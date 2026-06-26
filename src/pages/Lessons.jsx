import React, { useEffect, useState, useCallback, useRef } from "react";
import { CheckCircle2, PlayCircle, X, Loader2, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import LoggedInLayout from "../components/LoggedInLayout";

const BASE =
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

// ── Helpers ───────────────────────────────────────────────────────────────────
function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch (_) { }
  return null;
}

// ── YouTube Modal ─────────────────────────────────────────────────────────────
const YouTubeModal = ({ section, onClose, onWatched }) => {
  const embedUrl = toEmbedUrl(section?.youtube_link);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!section) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#101b30] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">{section.name}</h3>
            {section.difficulty && (
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#4800b2]/40 text-purple-300">
                {section.difficulty}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors ml-4 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          {embedUrl ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embedUrl}
              title={section.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
              No video available for this section.
            </div>
          )}
        </div>

        <div className="p-5 pt-4 flex items-center justify-between gap-4">
          {section.notes && <p className="text-white/50 text-xs line-clamp-2 flex-1">{section.notes}</p>}
          {!section.video_watched ? (
            <button
              onClick={() => onWatched(section.id)}
              className="flex-shrink-0 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Mark as Watched
            </button>
          ) : (
            <span className="flex-shrink-0 flex items-center gap-1.5 text-[#10B981] text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" /> Watched
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Section Row ───────────────────────────────────────────────────────────────
const SectionRow = ({ section, onClick }) => {
  const getDifficultyClass = (diff) => {
    switch (String(diff).toLowerCase()) {
      case "easy": return "text-[#10B981] bg-[#ecfdf5]";
      case "hard": return "text-[#ef4444] bg-[#fef2f2]";
      default: return "text-[#f59e0b] bg-[#fffbeb]"; // Medium / default
    }
  };

  return (
    <div
      onClick={() => onClick(section)}
      className={`p-4 flex items-center gap-4 transition-all duration-150 cursor-pointer border-b border-gray-100 last:border-b-0 active:scale-[0.99] ${
        section.video_watched && !section.quiz_completed ? "bg-[#3525cd]/5" : "hover:bg-gray-50"
      }`}
    >
      {/* Icon Status Indicator */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
        {section.quiz_completed ? (
          <CheckCircle2 className="w-6 h-6 text-[#10B981] fill-[#10B981]/10" />
        ) : section.video_watched ? (
          <CheckCircle2 className="w-6 h-6 text-[#3525cd]/60" />
        ) : (
          <PlayCircle className="w-6 h-6 text-[#3525cd]" />
        )}
      </div>

      {/* Title & Metadata Group - ADDED text-left and items-start HERE */}
      <div className="flex-1 min-w-0 flex flex-col items-start text-left">
        <h4 className={`block w-full text-left text-sm font-semibold tracking-tight ${
          section.video_watched ? "text-[#3525cd] font-bold" : "text-[#191c1d]"
        }`}>
          {section.name}
        </h4>
        <span className="block w-full text-left text-xs text-gray-500 font-medium mt-0.5">
          {section.quiz_completed ? "Completed" : section.video_watched ? "Watched Lesson" : "Watch Lesson"}
          {section.minutes_this_week > 0 && ` • ${section.minutes_this_week}m studied this week`}
        </span>
      </div>

      {/* Difficulty Tag */}
      {section.difficulty && (
        <span className={`ml-auto flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getDifficultyClass(section.difficulty)}`}>
          {section.difficulty}
        </span>
      )}
    </div>
  );
};

// ── Topic Card ────────────────────────────────────────────────────────────────
const TopicCard = React.forwardRef(({ topic, onSectionClick }, ref) => {
  const total = topic.sections.length;
  const watched = topic.sections.filter((s) => s.video_watched).length;
  const percentage = total > 0 ? Math.round((watched / total) * 100) : 0;

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6 border-b border-gray-100 flex justify-between items-end bg-gray-50/50">
        <div>
          <h3 className="text-lg font-bold text-[#191c1d] tracking-tight">{topic.name}</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {total} Section{total !== 1 ? "s" : ""} • {watched}/{total} videos watched
          </p>
        </div>
        <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden shrink-0 mb-1">
          <div className="bg-[#10B981] h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="flex flex-col">
        {topic.sections.map((s) => (
          <SectionRow key={s.id} section={s} onClick={onSectionClick} />
        ))}
        {total === 0 && (
          <p className="text-xs text-gray-400 p-6 text-center">No structural concepts here yet.</p>
        )}
      </div>
    </div>
  );
});

// ── Main Page ─────────────────────────────────────────────────────────────────
const Lessons = () => {
  const classID = useSelector((state) => state.personDetail?.class_ID);

  const [topics, setTopics] = useState([]);
  const [resumeTarget, setResumeTarget] = useState(null);
  const [minutesThisWeek, setMinutesThisWeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  // Store references to topic cards for scrolling lookup
  const topicRefs = useRef({});

  useEffect(() => {
    console.log(`${BASE}/${classID}/topics-with-sections`)
    if (!classID) return;
    const fetchTopics = async () => {
      try {
        const res = await axios.get(`${BASE}/${classID}/topics-with-sections`, { withCredentials: true });


        setTopics(res.data?.topics ?? []);
        setMinutesThisWeek(res.data?.minutes_this_week ?? 0);
        setResumeTarget(res.data?.resume_target ?? null);
      } catch (err) {
        console.error("Failed to load topics:", err);
        setError(err.response?.data?.error ?? err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [classID]);

  const handleMarkWatched = useCallback(async (sectionId) => {
    setTopics((prev) =>
      prev.map((t) => ({
        ...t,
        sections: t.sections.map((s) => (s.id === sectionId ? { ...s, video_watched: true } : s)),
      }))
    );
    setActiveSection((prev) => (prev?.id === sectionId ? { ...prev, video_watched: true } : prev));

    try {
      await axios.post(`${BASE}/${classID}/mark-video-watched`, { section_id: sectionId }, { withCredentials: true });
    } catch (err) {
      console.error("Failed to save tracking point state:", err);
    }
  }, [classID]);

  // Dynamic Scroll and Modal Opener
  const handleResumeClick = useCallback(() => {
    if (!resumeTarget) return;

    // 1. Scroll down to the correct topic block seamlessly
    const element = topicRefs.current[resumeTarget.topic_id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // 2. Automatically throw open the video interface
    setActiveSection(resumeTarget);
  }, [resumeTarget]);

  const handleOpenSection = useCallback((section) => setActiveSection(section), []);
  const handleCloseModal = useCallback(() => setActiveSection(null), []);

  return (
    <div className="min-h-screen w-full text-[#191d1d] flex font-sans ">
      <LoggedInLayout>
        <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
          <main className=" w-full mx-auto flex-1 z-10 flex flex-col gap-8">

            <section className="text-center max-w-2xl mx-auto mt-4 mb-2">
              <h1 className="text-3xl font-extrabold text-[#191c1d] tracking-tight sm:text-4xl">
                Lessons & Concept Lectures
              </h1>
              <p className="text-base text-gray-500 mt-3 font-medium">
                Master mathematical foundations with visual contexts, step-by-step recordings, and guided homework support.
              </p>
            </section>

            {/* Bento Box Promo */}
            <section
              className="relative overflow-hidden rounded-3xl min-h-[14rem] shadow-lg flex items-center p-8 lg:p-12 text-white"
              style={{ background: "radial-gradient(at 0% 0%, #4f46e5 0%, transparent 75%), radial-gradient(at 100% 100%, #712ae2 0%, #3525cd 100%)" }}
            >
              {/* Added text-left here to guarantee left alignment across all child elements */}
              <div className="relative z-10 w-full max-w-xl text-left flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {resumeTarget ? `Up Next • ${resumeTarget.topic_name}` : "All Caught Up!"}
                  </span>
                </div>

                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-6">
                  {resumeTarget ? resumeTarget.name : "Ready to check your weekly practice statistics below?"}
                </h2>

                {resumeTarget ? (
                  <button
                    onClick={handleResumeClick}
                    // Added self-start to prevent the button from expanding to the full block width
                    className="self-start bg-white text-[#3525cd] px-8 py-3 rounded-full font-bold shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 text-sm"
                  >
                    Resume Lesson
                  </button>
                ) : minutesThisWeek > 0 ? (
                  <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold">
                    You logged {minutesThisWeek} minutes studying this week!
                  </span>
                ) : null}
              </div>
            </section>

            {loading && (
              <div className="flex items-center justify-center py-24 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-3 text-[#3525cd]" />
                <span className="text-sm font-semibold">Loading courses...</span>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-md mx-auto w-full">
                <p className="text-red-600 font-bold text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-2 text-xs underline text-red-500 font-bold">
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {topics.map((t) => (
                  <TopicCard
                    key={t.id}
                    topic={t}
                    onSectionClick={handleOpenSection}
                    ref={(el) => (topicRefs.current[t.id] = el)} // Wire the component nodes into refs dictionary
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </LoggedInLayout>

      {activeSection && (
        <YouTubeModal section={activeSection} onClose={handleCloseModal} onWatched={handleMarkWatched} />
      )}
    </div>
  );
};

export default Lessons;