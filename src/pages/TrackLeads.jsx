import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

// Adjust if your other pages call the backend differently
const API_BASE = import.meta.env.VITE_API_URL || "";

const PRIMARY = "#4441c4";
const BORDER = "#c7c4d6";

const STAGE_LABELS = {
    new_lead: "New lead",
    in_conversation: "In conversation",
    follow_up: "Follow-up",
    cold_lead: "Gone cold",
    booked_call: "Call booked",
    cancelled: "Call cancelled",
};

const ENROLLMENT_LABELS = {
    one_on_one: "one-on-one",
    group: "group",
    both: "one-on-one and group",
};

const MESSAGE_STAGES = ["new_lead", "in_conversation"];

// ---------- lead rules (the stat boxes and the table filters share these) ----------
const isEnrolled = (l) => !!l.enrollment_type;
const isLost = (l) => l.opportunity_active === false;
const needsReply = (l) =>
    !isLost(l) &&
    !isEnrolled(l) &&
    !!l.last_inbound_at &&
    (!l.last_outbound_at || new Date(l.last_inbound_at) > new Date(l.last_outbound_at));
const repliedToEmail = (l) =>
    l.messages_sent > 0 &&
    !!l.last_response_at &&
    (!l.last_message_at || new Date(l.last_response_at) > new Date(l.last_message_at));

const FILTERS = [
    { key: "all", label: "Total leads", test: () => true },
    { key: "needs_reply", label: "Waiting on your reply", test: needsReply },
    { key: "messages", label: "In message stage", test: (l) => MESSAGE_STAGES.includes(l.stage) && !isLost(l) },
    { key: "qualified", label: "Need grade 9–10", test: (l) => !!l.is_qualified },
    { key: "email", label: "Gave an email", test: (l) => !!l.email },
    { key: "phone", label: "Gave a phone number", test: (l) => !!l.phone },
    { key: "clicked", label: "Clicked the calendar link", test: (l) => !!l.calendar_link_clicked_at },
    { key: "booked", label: "Booked a call", test: (l) => l.stage === "booked_call" },
    { key: "one_on_one", label: "Enrolled one-on-one", test: (l) => ["one_on_one", "both"].includes(l.enrollment_type) },
    { key: "group", label: "Enrolled in a group", test: (l) => ["group", "both"].includes(l.enrollment_type) },
    { key: "open", label: "Open opportunities", test: (l) => !isLost(l) && !isEnrolled(l) },
    { key: "lost", label: "Opportunities lost", test: isLost },
];

// ---------- formatting ----------
function timeAgo(iso) {
    if (!iso) return "—";
    const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (secs < 3600) return `${Math.max(1, Math.round(secs / 60))}m ago`;
    if (secs < 86400) return `${Math.round(secs / 3600)}h ago`;
    return `${Math.round(secs / 86400)}d ago`;
}

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function statusOf(l) {
    if (l.enrollment_type) {
        return { text: `Enrolled (${ENROLLMENT_LABELS[l.enrollment_type] || l.enrollment_type})`, tone: "good" };
    }
    if (isLost(l)) {
        return { text: l.lost_reason ? `Lost: ${l.lost_reason}` : "Lost", tone: "bad" };
    }
    return {
        text: STAGE_LABELS[l.stage] || l.stage || "Unknown",
        tone: l.stage === "booked_call" ? "good" : "neutral",
    };
}

const TONE_CLASSES = {
    good: "bg-emerald-50 text-emerald-800",
    bad: "bg-red-50 text-red-800",
    neutral: "bg-[#eeedf8] text-[#3a37a8]",
};

// ---------- page ----------
const TrackLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loadState, setLoadState] = useState("loading"); // loading | ready | forbidden | error
    const [filterKey, setFilterKey] = useState("all");
    const [query, setQuery] = useState("");

    const load = useCallback(async () => {
        setLoadState("loading");
        try {
            const { data } = await axios.get(`${API_BASE}/leads/dashboard`, { withCredentials: true });
            setLeads(data.leads || []);
            setLoadState("ready");
        } catch (err) {
            const code = err.response?.status;
            setLoadState(code === 401 || code === 403 ? "forbidden" : "error");
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const counts = useMemo(
        () => Object.fromEntries(FILTERS.map((f) => [f.key, leads.filter(f.test).length])),
        [leads]
    );

    const visible = useMemo(() => {
        const active = FILTERS.find((f) => f.key === filterKey) || FILTERS[0];
        const q = query.trim().toLowerCase();
        return leads.filter((l) => {
            if (!active.test(l)) return false;
            if (!q) return true;
            return [l.first_name, l.email, l.phone].some((v) => v && String(v).toLowerCase().includes(q));
        });
    }, [leads, filterKey, query]);

    if (loadState === "forbidden") {
        return (
            <Shell>
                <Notice
                    title="This page is only for the account owner"
                    body="Sign in with the owner account, then reload the page."
                />
            </Shell>
        );
    }

    if (loadState === "error") {
        return (
            <Shell>
                <Notice
                    title="Couldn't load your leads"
                    body="Check that the backend is running and the /leads/dashboard route is registered, then try again."
                    action={<button onClick={load} className={primaryButton}>Try again</button>}
                />
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Everyone who has messaged you or booked a call. Click a box to filter the list.
                    </p>
                </div>
                <button onClick={load} disabled={loadState === "loading"} className={outlineButton}>
                    {loadState === "loading" ? "Refreshing…" : "Refresh"}
                </button>
            </div>

            {/* Stat boxes double as filters */}
            <div
                className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border md:grid-cols-4"
                style={{ backgroundColor: BORDER, borderColor: BORDER }}
            >
                {FILTERS.map((f) => {
                    const selected = f.key === filterKey;
                    return (
                        <button
                            key={f.key}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setFilterKey(f.key)}
                            className={`px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4441c4] ${selected ? "bg-[#eeedf8]" : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <div
                                className="text-2xl font-semibold tabular-nums"
                                style={{ color: selected ? PRIMARY : "#0f172a" }}
                            >
                                {loadState === "loading" && leads.length === 0 ? "…" : counts[f.key]}
                            </div>
                            <div className="text-sm text-slate-600">{f.label}</div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, email or phone"
                    aria-label="Search leads"
                    className="w-full max-w-sm rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4441c4]"
                    style={{ borderColor: BORDER }}
                />
                <p className="text-sm text-slate-600">
                    Showing {visible.length} of {leads.length}
                </p>
            </div>

            <div className="mt-3 overflow-x-auto rounded-lg border bg-white" style={{ borderColor: BORDER }}>
                <table className="w-full min-w-[960px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <Th>Lead</Th>
                            <Th>Status</Th>
                            <Th>Grade</Th>
                            <Th>Contact</Th>
                            <Th>First message</Th>
                            <Th>Last reply</Th>
                            <Th>Emails sent</Th>
                            <Th>Calendar link</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((l) => {
                            const status = statusOf(l);
                            const waiting = needsReply(l);
                            return (
                                <tr key={l.id} className="border-t align-top" style={{ borderColor: BORDER }}>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">{l.first_name || "Unnamed"}</div>
                                        <div className="text-xs text-slate-500">{l.source || "No source"}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[status.tone]}`}>
                                            {status.text}
                                        </span>
                                        {waiting && (
                                            <div className="mt-1 text-xs font-medium text-amber-700">
                                                Waiting on you since {timeAgo(l.last_inbound_at)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{l.grade_level ? `Grade ${l.grade_level}` : "—"}</td>
                                    <td className="px-4 py-3">
                                        <div className={l.email ? "text-slate-900" : "text-slate-400"}>{l.email || "No email"}</div>
                                        <div className={l.phone ? "text-slate-900" : "text-slate-400"}>{l.phone || "No phone"}</div>
                                    </td>
                                    <td className="px-4 py-3">{fmtDate(l.first_message_at || l.created_at)}</td>
                                    <td className="px-4 py-3">{timeAgo(l.last_response_at)}</td>
                                    <td className="px-4 py-3">
                                        {l.messages_sent > 0 ? (
                                            <>
                                                <div>{l.messages_sent} sent, last {timeAgo(l.last_message_at)}</div>
                                                <div className={repliedToEmail(l) ? "text-emerald-700" : "text-slate-500"}>
                                                    {repliedToEmail(l) ? "Replied" : "No reply"}
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-slate-400">None yet</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {l.calendar_link_clicked_at
                                            ? `Clicked ${l.calendar_link_click_count || 1}×, ${timeAgo(l.calendar_link_clicked_at)}`
                                            : <span className="text-slate-400">Not clicked</span>}
                                    </td>
                                </tr>
                            );
                        })}
                        {loadState === "ready" && visible.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center text-slate-600">
                                    No leads match. Pick another box above or clear the search.
                                </td>
                            </tr>
                        )}
                        {loadState === "loading" && leads.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center text-slate-600">
                                    Loading leads…
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Shell>
    );
};

// ---------- small pieces ----------
const primaryButton =
    "rounded-md px-4 py-2 text-sm font-medium text-white bg-[#4441c4] hover:bg-[#3a37a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4441c4]";
const outlineButton =
    "rounded-md border border-[#c7c4d6] bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4441c4]";

const Shell = ({ children }) => (
    <div className="mx-auto max-w-7xl px-4 py-8" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
        {children}
    </div>
);

const Th = ({ children }) => <th className="px-4 py-2 font-medium">{children}</th>;

const Notice = ({ title, body, action }) => (
    <div className="mx-auto mt-16 max-w-md rounded-lg border bg-white p-6" style={{ borderColor: BORDER }}>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{body}</p>
        {action && <div className="mt-4">{action}</div>}
    </div>
);

export default TrackLeads;