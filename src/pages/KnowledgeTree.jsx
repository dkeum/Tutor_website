import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    Handle,
    Position,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import '../css/KnowledgeTree.css';
import LoggedInLayout from '../components/LoggedInLayout';
import { supabase } from '../db/supabaseclient';
import axios from "axios";
import { setCredits } from '../features/auth/personDetails';
import { useDispatch } from 'react-redux';

// ---------------------------------------------------------------------------
// Mastery -> letter grade. No color coding — the grade badge is the only
// signal for how the student is doing on a section.
// ---------------------------------------------------------------------------
function getLetterGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

// ---------------------------------------------------------------------------
// Node components
// ---------------------------------------------------------------------------
function TopicNode({ data }) {
    return (
        <div className="knowledge-node node-output">
            <Handle type="target" position={Position.Top} />
            <span>{renderBrokenTitle(data.label)}</span>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

function SectionNode({ data }) {
    const { name, masteryScore, status, videoWatched, skillsObtained, skillsMissed } = data;
    const isLocked = status === 'locked';
    const isNext = status === 'next';
    const hasSkills = skillsObtained.length > 0 || skillsMissed.length > 0;

    return (
        <div
            className={`section-node${isNext ? ' section-node--next' : ''}${isLocked ? ' section-node--locked' : ''}`}
        >
            <Handle type="target" position={Position.Top} />

            <div className="section-node__header">
                <span className="section-node__name text-center! w-full">{renderBrokenTitle(name)}</span>
                {videoWatched && <span className="section-node__badge" title="Video watched">▶</span>}
            </div>

            {isLocked && <div className="section-node__badge">Locked</div>}
            {isNext && <div className="grade-badge">Go<span className="grade-badge__label">start here</span></div>}
            {status === 'completed' && (
                <div className="grade-badge">
                    {getLetterGrade(masteryScore)}
                    <span className="grade-badge__label">unit grade</span>
                </div>
            )}

            {hasSkills && (
                <div className="section-node__skills">
                    {skillsObtained.length > 0 && (
                        <>
                            <div className="section-node__skills-heading section-node__skills-heading--obtained">Mastered</div>
                            {skillsObtained.map((skill) => (
                                <div key={skill} className="skill-pill skill-pill--obtained">
                                    <span className="skill-pill__icon">✓</span> {skill}
                                </div>
                            ))}
                        </>
                    )}
                    {skillsMissed.length > 0 && (
                        <>
                            <div className="section-node__skills-heading section-node__skills-heading--missed">Needs work</div>
                            {skillsMissed.map((skill) => (
                                <div key={skill} className="skill-pill skill-pill--missed">
                                    <span className="skill-pill__icon">✕</span> {skill}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

// Splits text longer than maxLen into two lines, breaking at the nearest
// space to the middle rather than mid-word. If no space exists (one long
// word), returns the text unbroken — better than an ugly mid-word split.
function breakLongTitle(text, maxLen = 30) {
    if (!text || text.length <= maxLen) return [text];

    const mid = Math.floor(text.length / 2);
    let splitIndex = -1;

    for (let offset = 0; offset < text.length / 2; offset++) {
        if (text[mid + offset] === ' ') { splitIndex = mid + offset; break; }
        if (text[mid - offset] === ' ') { splitIndex = mid - offset; break; }
    }

    if (splitIndex === -1) return [text];
    return [text.slice(0, splitIndex), text.slice(splitIndex + 1)];
}

function renderBrokenTitle(text, maxLen = 30) {
    return breakLongTitle(text, maxLen).map((line, i) => (
        <React.Fragment key={i}>
            {i > 0 && <br />}
            {line}
        </React.Fragment>
    ));
}

const nodeTypes = { topic: TopicNode, section: SectionNode };

// ---------------------------------------------------------------------------
// Layout constants — tuned to the card sizes in KnowledgeTree.css
// ---------------------------------------------------------------------------
const SECTION_WIDTH = 260;
const SECTION_GAP = 36;
const TOPIC_GAP = 100;
const TOPIC_NODE_WIDTH = 160;
const TOPIC_ROW_Y = 140;
const SECTION_ROW_Y = 300;

function dedupeEdges(edges) {
    const bySourceTarget = new Map();
    edges.forEach((edge) => {
        bySourceTarget.set(`${edge.source}->${edge.target}`, edge);
    });
    return Array.from(bySourceTarget.values());
}

function buildTree(topics) {
    // Guard: with zero topics (e.g. transient fetch error), topicCenters[0]
    // would be undefined and gradeCenterX below becomes NaN, which ReactFlow
    // silently mispositions everything on.
    if (!topics || topics.length === 0) {
        return { nodes: [], edges: [] };
    }

    const nodes = [];
    const edges = [];
    const topicCenters = [];
    let cursorX = 0;

    topics.forEach((topic) => {
        const sectionCount = topic.sections.length;
        const rowWidth = sectionCount * SECTION_WIDTH + (sectionCount - 1) * SECTION_GAP;
        const topicId = `topic-${topic.id}`;
        const topicCenterX = cursorX + rowWidth / 2;
        topicCenters.push(topicCenterX);

        nodes.push({
            id: topicId,
            type: 'topic',
            position: { x: topicCenterX - TOPIC_NODE_WIDTH / 2, y: TOPIC_ROW_Y },
            data: { label: topic.name },
        });
        edges.push({ id: `grade-${topicId}`, source: 'grade', target: topicId, type: 'smoothstep' });

        topic.sections.forEach((section, si) => {
            const sectionId = `section-${section.id}`;
            const sectionX = cursorX + si * (SECTION_WIDTH + SECTION_GAP);
            const isNext = section.status === 'next';

            nodes.push({
                id: sectionId,
                type: 'section',
                position: { x: sectionX, y: SECTION_ROW_Y },
                data: section,
                draggable: false,
            });
            edges.push({
                id: `${topicId}-${sectionId}`,
                source: topicId,
                target: sectionId,
                type: 'smoothstep',
                animated: isNext,
                className: isNext ? 'edge-next' : undefined,
            });
        });

        cursorX += rowWidth + TOPIC_GAP;
    });

    const gradeCenterX = (topicCenters[0] + topicCenters[topicCenters.length - 1]) / 2;
    nodes.unshift({
        id: 'grade',
        type: 'input',
        position: { x: gradeCenterX - TOPIC_NODE_WIDTH / 2, y: 0 },
        data: { label: 'Grade 11' },
        className: 'knowledge-node node-input',
    });

    return { nodes, edges: dedupeEdges(edges) };
}

function minimapColor(node) {
    if (node.type === 'topic' || node.type === 'input') return '#d9c4d7';
    const { status } = node.data || {};
    if (status === 'locked') return '#b4b2a9';
    if (status === 'next') return '#4fae82';
    return '#d8a7c0';
}

// ---------------------------------------------------------------------------
// Loading state — navbar stays put, dots fill the remaining space
// ---------------------------------------------------------------------------
function LoadingDots() {
    return (
        <div className="knowledge-tree-loading">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
        </div>
    );
}

// ---------------------------------------------------------------------------
const KnowledgeTree = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState([]);
    const [creditsExhausted, setCreditsExhausted] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchKnowledgeTree = async () => {
            try {
                const base =
                    import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
                        ? "http://localhost:3000"
                        : "https://mathamagic-backend.vercel.app";

                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session?.user) {
                    navigate("/login");
                    return;
                }

                const { data } = await axios.get(
                    `${base}/generate-student-knowledge-tree`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                        withCredentials: true,
                    }
                );

                setTopics(data?.tree?.topics || []);
                setCreditsExhausted(!!data?.creditsExhausted);

                const remainingCredits = data.creditsRemaining; // camelCase — matches the backend response

                if (remainingCredits !== undefined) {
                    dispatch(setCredits({ ai_credits: Number(remainingCredits) }));
                }
            } catch (err) {
                console.error("Error fetching knowledge tree:", err);
                setFetchError("Couldn't load your knowledge tree. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchKnowledgeTree();
    }, [navigate, dispatch]);

    const { nodes, edges } = useMemo(() => buildTree(topics), [topics]);

    // On load, center the camera on the recommended "next" section instead
    // of fitting the whole tree — that's the node the student should see
    // first. Falls back to fitting everything if nothing is marked next.
    const handleInit = useCallback((instance) => {
        const nextNode = nodes.find((node) => node.data?.status === 'next');
        if (nextNode) {
            instance.fitView({
                nodes: [{ id: nextNode.id }],
                duration: 600,
                padding: 0.6,
                maxZoom: 1.1,
            });
        } else {
            instance.fitView({ duration: 600, padding: 0.25 });
        }
    }, [nodes]);

    if (loading) {
        return (
            <LoggedInLayout bare>
                <div className="knowledge-tree-container">
                    <LoadingDots />
                </div>
            </LoggedInLayout>
        );
    }

    if (fetchError) {
        return (
            <LoggedInLayout bare>
                <div className="knowledge-tree-container knowledge-tree-error">
                    {fetchError}
                </div>
            </LoggedInLayout>
        );
    }

    return (
        <LoggedInLayout bare>
            <div className="knowledge-tree-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onInit={handleInit}
                >
                    <Panel position="top-center" className="knowledge-panel">
                        Grade 11 knowledge tree
                        {creditsExhausted && (
                            <span className="knowledge-panel__warning">
                                {' '}— some sections weren't updated (out of AI credits)
                            </span>
                        )}
                    </Panel>

                    <Background variant="dots" gap={18} size={1} color="#ddd7e8" />

                    <Controls
                        position="top-right"
                        showZoom
                        showFitView={false}
                        showInteractive={false}
                        className="knowledge-zoom-controls"
                    />

                    <MiniMap
                        nodeColor={minimapColor}
                        nodeStrokeWidth={2}
                        nodeBorderRadius={8}
                        zoomable
                        pannable
                        className="knowledge-minimap"
                    />
                </ReactFlow>
            </div>
        </LoggedInLayout>
    );
};

export default KnowledgeTree;