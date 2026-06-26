// import React, { useEffect, useState, useCallback } from "react";
// import { CheckCircle2, PlayCircle, ArrowRight, X, Loader2, Clock } from "lucide-react";
// import { useSelector } from "react-redux";
// import axios from "axios";

// import Sidebar from "../components/Sidebar";
// import NavbarLoggedIn from "../components/NavbarLoggedIn";
// import LoggedInLayout from "../components/LoggedInLayout";

// const BASE =
//   import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
//     ? "http://localhost:3000"
//     : "https://mathamagic-backend.vercel.app";

// // ── Helpers ───────────────────────────────────────────────────────────────────

// /**
//  * Convert any YouTube URL format to an embed URL.
//  * Returns null if the link can't be parsed.
//  */
// function toEmbedUrl(url) {
//   if (!url) return null;
//   try {
//     const u = new URL(url);
//     if (u.hostname === "youtu.be") {
//       return `https://www.youtube.com/embed${u.pathname}`;
//     }
//     if (u.hostname.includes("youtube.com")) {
//       if (u.pathname.startsWith("/embed/")) return url;
//       const v = u.searchParams.get("v");
//       if (v) return `https://www.youtube.com/embed/${v}`;
//     }
//   } catch (_) {}
//   return null;
// }

// // ── YouTube Modal ─────────────────────────────────────────────────────────────

// const YouTubeModal = ({ section, onClose, onWatched }) => {
//   const embedUrl = toEmbedUrl(section?.youtube_link);

//   useEffect(() => {
//     const handler = (e) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   if (!section) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-3xl bg-[#101b30] rounded-2xl overflow-hidden shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-start justify-between p-5 pb-3">
//           <div>
//             <h3 className="text-white font-bold text-lg leading-tight">
//               {section.name}
//             </h3>
//             {section.difficulty && (
//               <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#4800b2]/40 text-purple-300">
//                 {section.difficulty}
//               </span>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white/50 hover:text-white transition-colors ml-4 flex-shrink-0"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Video */}
//         <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
//           {embedUrl ? (
//             <iframe
//               className="absolute inset-0 w-full h-full"
//               src={embedUrl}
//               title={section.name}
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             />
//           ) : (
//             <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
//               No video available for this section.
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-5 pt-4 flex items-center justify-between gap-4">
//           {section.notes && (
//             <p className="text-white/50 text-xs line-clamp-2 flex-1">
//               {section.notes}
//             </p>
//           )}
//           {!section.video_watched ? (
//             <button
//               onClick={() => { onWatched(section.id); }}
//               className="flex-shrink-0 bg-[#2ECC71] hover:bg-[#27ae60] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
//             >
//               Mark as Watched
//             </button>
//           ) : (
//             <span className="flex-shrink-0 flex items-center gap-1.5 text-[#2ECC71] text-sm font-bold">
//               <CheckCircle2 className="w-4 h-4" /> Watched
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Sub-components ────────────────────────────────────────────────────────────

// const SectionRow = ({ section, onClick }) => (
//   <div
//     onClick={() => onClick(section)}
//     className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-[#4800b2]/20 hover:bg-[#F8F9FE] transition-all cursor-pointer group/row"
//   >
//     <div className="flex-shrink-0">
//       {section.quiz_completed ? (
//         <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" title="Quiz Completed" />
//       ) : section.video_watched ? (
//         <CheckCircle2 className="w-4 h-4 text-[#4800b2]/60" title="Video Watched" />
//       ) : (
//         <PlayCircle className="w-4 h-4 text-[#4800b2]" title="Not Started" />
//       )}
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-sm font-bold text-[#101b30] truncate">{section.name}</p>
//       <p className="text-[10px] text-[#494456] font-medium mt-0.5 capitalize flex items-center gap-1">
//         <span>{section.difficulty ?? "Video"}</span>
//         {section.youtube_link ? <span>• Watch lesson</span> : ""}
//         {section.minutes_this_week > 0 && (
//           <span className="text-[#4800b2] font-semibold">
//             • {section.minutes_this_week}m studied this week
//           </span>
//         )}
//       </p>
//     </div>
//     <ArrowRight className="w-4 h-4 text-[#4800b2] opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0" />
//   </div>
// );

// const TopicCard = ({ topic, onSectionClick }) => {
//   const total = topic.sections.length;
//   const watched = topic.sections.filter((s) => s.video_watched).length;

//   return (
//     <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e8ddff] flex flex-col gap-4 hover:shadow-md transition-shadow">
//       <div>
//         <h3 className="text-xl font-bold text-[#101b30]">{topic.name}</h3>
//         <p className="text-xs text-[#494456] font-medium mt-0.5">
//           {total} Section{total !== 1 ? "s" : ""} • {watched}/{total} videos watched
//         </p>
//       </div>
//       <div className="flex flex-col gap-1">
//         {topic.sections.map((s) => (
//           <SectionRow key={s.id} section={s} onClick={onSectionClick} />
//         ))}
//         {topic.sections.length === 0 && (
//           <p className="text-xs text-[#494456]/60 px-3 py-2">No sections yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Page ──────────────────────────────────────────────────────────────────────

// const Lessons = () => {
//   const classID = useSelector((state) => state.personDetail?.class_ID);

//   const [topics, setTopics]               = useState([]);
//   const [minutesThisWeek, setMinutesThisWeek] = useState(0);
//   const [loading, setLoading]             = useState(true);
//   const [error, setError]                 = useState(null);
//   const [activeSection, setActiveSection] = useState(null);

//   // ── Fetch topics + sections ────────────────────────────────────────────────
//   useEffect(() => {
//     if (!classID) return;

//     const fetchTopics = async () => {
//       try {
//         const res = await axios.get(
//           `${BASE}/${classID}/topics-with-sections`,
//           { withCredentials: true }
//         );
//         setTopics(res.data?.topics ?? []);
//         setMinutesThisWeek(res.data?.minutes_this_week ?? 0);
//       } catch (err) {
//         console.error("Failed to load topics:", err);
//         setError(err.response?.data?.error ?? err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopics();
//   }, [classID]);

//   // ── Mark a video as watched (Optimistic + Network call) ────────────────────
//   const handleMarkWatched = useCallback(async (sectionId) => {
//     // 1. Optimistically update local UI state immediately
//     setTopics((prev) =>
//       prev.map((t) => ({
//         ...t,
//         sections: t.sections.map((s) =>
//           s.id === sectionId ? { ...s, video_watched: true } : s
//         ),
//       }))
//     );
//     setActiveSection((prev) =>
//       prev?.id === sectionId ? { ...prev, video_watched: true } : prev
//     );

//     // 2. Persist backend progression update
//     try {
//       await axios.post(
//         `${BASE}/${classID}/mark-video-watched`,
//         { section_id: sectionId },
//         { withCredentials: true }
//       );
//     } catch (err) {
//       console.error("Failed to persist video watched state to server:", err);
//     }
//   }, [classID]);

//   const handleOpenSection  = useCallback((section) => setActiveSection(section), []);
//   const handleCloseModal   = useCallback(() => setActiveSection(null), []);

//   // ── First unwatched video section -> Dynamic Resume target ──────────────────
//   const resumeSection = (() => {
//     for (const t of topics) {
//       const next = t.sections.find((s) => !s.video_watched && s.youtube_link);
//       if (next) return { ...next, topicName: t.name };
//     }
//     return null;
//   })();

//   return (
//     <div className="min-h-screen w-full text-[#101b30] flex font-sans">
//       <LoggedInLayout>
//         <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
//           <main className="mt-20 p-10 max-w-[1280px] w-full mx-auto flex-1 z-10 flex flex-col gap-12">

//             {/* ── Page header + Total Week Metric Card ── */}
//             <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-4">
//               <div className="max-w-2xl">
//                 <h2
//                   className="text-4xl font-bold text-[#101b30] tracking-tight text-left"
//                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
//                 >
//                   Lessons & Concept Lectures
//                 </h2>
//                 <p className="text-lg text-[#494456] max-w-2xl mt-2 text-left">
//                   Review lesson recordings, build visual context, and tackle homework assignments.
//                 </p>
//                 {minutesThisWeek > 0 && (
//                   <div className="mt-4 inline-flex items-center gap-2 bg-[#4800b2]/10 text-[#4800b2] px-4 py-2 rounded-xl text-sm font-bold">
//                     <Clock className="w-4 h-4" />
//                     <span>You've spent {minutesThisWeek} mins practicing this week!</span>
//                   </div>
//                 )}
//               </div>

//               {resumeSection && (
//                 <div className="bg-[#263046] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-md w-full lg:w-80 shrink-0">
//                   <div className="z-10 relative">
//                     <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
//                       Up Next · {resumeSection.topicName}
//                     </p>
//                     <h4 className="text-xl font-bold leading-tight truncate">
//                       {resumeSection.name}
//                     </h4>
//                   </div>
//                   <button
//                     onClick={() => handleOpenSection(resumeSection)}
//                     className="z-10 relative mt-6 w-full bg-white text-[#101b30] py-3 rounded-xl text-sm font-bold hover:bg-[#e8ddff] transition-colors shadow-sm"
//                   >
//                     Resume Lesson
//                   </button>
//                   <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 pointer-events-none">
//                     <div className="w-36 h-36 rounded-full border-[16px] border-white" />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ── Loading ── */}
//             {loading && (
//               <div className="flex items-center justify-center py-24 text-[#494456]">
//                 <Loader2 className="w-6 h-6 animate-spin mr-3" />
//                 <span className="text-sm font-medium">Loading lessons…</span>
//               </div>
//             )}

//             {/* ── Error ── */}
//             {!loading && error && (
//               <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
//                 <p className="text-red-600 font-semibold text-sm">{error}</p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-3 text-xs underline text-red-500"
//                 >
//                   Try again
//                 </button>
//               </div>
//             )}

//             {/* ── Empty ── */}
//             {!loading && !error && topics.length === 0 && (
//               <div className="py-24 text-center text-[#494456]/60 text-sm">
//                 No topics found for this class yet.
//               </div>
//             )}

//             {/* ── Topic grid ── */}
//             {!loading && !error && topics.length > 0 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {topics.map((t) => (
//                   <TopicCard
//                     key={t.id}
//                     topic={t}
//                     onSectionClick={handleOpenSection}
//                   />
//                 ))}
//               </div>
//             )}
//           </main>
//         </div>
//       </LoggedInLayout>

//       {/* ── YouTube modal ── */}
//       {activeSection && (
//         <YouTubeModal
//           section={activeSection}
//           onClose={handleCloseModal}
//           onWatched={handleMarkWatched}
//         />
//       )}
//     </div>
//   );
// };

// export default Lessons;

import React, { useEffect, useState, useCallback } from "react";
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
  } catch (_) {}
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
      default: return "text-[#f59e0b] bg-[#fffbeb]";
    }
  };

  return (
    <div
      onClick={() => onClick(section)}
      className={`p-4 flex items-center gap-4 transition-all duration-150 cursor-pointer border-b border-gray-100 last:border-b-0 active:scale-[0.99] ${
        section.video_watched && !section.quiz_completed ? "bg-[#3525cd]/5" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
        {section.quiz_completed ? (
          <CheckCircle2 className="w-6 h-6 text-[#10B981] fill-[#10B981]/10" />
        ) : section.video_watched ? (
          <CheckCircle2 className="w-6 h-6 text-[#3525cd]/60" />
        ) : (
          <PlayCircle className="w-6 h-6 text-[#3525cd]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className={`text-sm font-semibold tracking-tight ${section.video_watched ? "text-[#3525cd] font-bold" : "text-[#191c1d]"}`}>
            {section.name}
          </h4>
          {section.difficulty && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getDifficultyClass(section.difficulty)}`}>
              {section.difficulty}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {section.quiz_completed ? "Completed" : section.video_watched ? "Watched Lesson" : "Watch Lesson"}
          {section.minutes_this_week > 0 && ` • ${section.minutes_this_week}m studied this week`}
        </span>
      </div>
    </div>
  );
};

// ── Topic Card ────────────────────────────────────────────────────────────────
const TopicCard = ({ topic, onSectionClick }) => {
  const total = topic.sections.length;
  const watched = topic.sections.filter((s) => s.video_watched).length;
  const percentage = total > 0 ? Math.round((watched / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
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
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const Lessons = () => {
  const classID = useSelector((state) => state.personDetail?.class_ID);

  const [topics, setTopics]               = useState([]);
  const [minutesThisWeek, setMinutesThisWeek] = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (!classID) return;
    const fetchTopics = async () => {
      try {
        const res = await axios.get(`${BASE}/${classID}/topics-with-sections`, { withCredentials: true });
        setTopics(res.data?.topics ?? []);
        setMinutesThisWeek(res.data?.minutes_this_week ?? 0);
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

  const handleOpenSection  = useCallback((section) => setActiveSection(section), []);
  const handleCloseModal   = useCallback(() => setActiveSection(null), []);

  const resumeSection = (() => {
    for (const t of topics) {
      const next = t.sections.find((s) => !s.video_watched && s.youtube_link);
      if (next) return { ...next, topicName: t.name };
    }
    return null;
  })();

  return (
    <div className="min-h-screen w-full text-[#191c1d] flex font-sans bg-[#f8f9fa]">
      <LoggedInLayout>
        <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
          <main className="mt-16 p-8 max-w-[1280px] w-full mx-auto flex-1 z-10 flex flex-col gap-8">
            
            {/* Page Header Titles */}
            <section className="text-center max-w-2xl mx-auto mt-4 mb-2">
              <h1 className="text-3xl font-extrabold text-[#191c1d] tracking-tight sm:text-4xl">
                Lessons & Concept Lectures
              </h1>
              <p className="text-base text-gray-500 mt-3 font-medium">
                Master mathematical foundations with visual contexts, step-by-step recordings, and guided homework support.
              </p>
            </section>

            {/* Bento Grid Action Card */}
            <section 
              className="relative overflow-hidden rounded-3xl min-h-[14rem] shadow-lg flex items-center p-8 lg:p-12 text-white"
              style={{ background: "radial-gradient(at 0% 0%, #4f46e5 0%, transparent 75%), radial-gradient(at 100% 100%, #712ae2 0%, #3525cd 100%)" }}
            >
              <div className="relative z-10 w-full max-w-xl">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {resumeSection ? `Up Next • ${resumeSection.topicName}` : "All Caught Up!"}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-6">
                  {resumeSection ? resumeSection.name : "Ready to check your weekly practice statistics below?"}
                </h2>
                {resumeSection ? (
                  <button
                    onClick={() => handleOpenSection(resumeSection)}
                    className="bg-white text-[#3525cd] px-8 py-3 rounded-full font-bold shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 text-sm"
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

            {/* Loading / Error States */}
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

            {/* Topics Layout Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {topics.map((t) => (
                  <TopicCard key={t.id} topic={t} onSectionClick={handleOpenSection} />
                ))}
              </div>
            )}
          </main>
        </div>
      </LoggedInLayout>

      {/* Video Anchor Overlay */}
      {activeSection && (
        <YouTubeModal section={activeSection} onClose={handleCloseModal} onWatched={handleMarkWatched} />
      )}
    </div>
  );
};

export default Lessons;