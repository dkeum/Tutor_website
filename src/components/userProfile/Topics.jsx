import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Play, CheckCircle2, PenLine, Circle, Lock, ChevronLeft } from "lucide-react";

// Temporary filler data matching your Redux architecture
const FILLER_PROGRESS_DATA = [
  {
    topic_name: "ALGEBRA",
    sections: [
      { section_name: "Introduction to polynomials", latest_grade: 100, status: "done" },
      { section_name: "Adding & subtracting polynomials", latest_grade: 95, status: "done" },
      { section_name: "Multiplying polynomials", latest_grade: 88, status: "done" },
      { section_name: "GCF & factoring out", latest_grade: 82, status: "done" },
      { section_name: "Difference of squares", latest_grade: 78, status: "done" },
      { section_name: "Factoring ax² + bx + c", latest_grade: 45, status: "active" },
      { section_name: "Factoring by grouping", latest_grade: 0, status: "todo" },
      { section_name: "Polynomial long division", latest_grade: 0, status: "locked" },
    ],
  },
  {
    topic_name: "TRIGONOMETRY",
    sections: [
      { section_name: "Unit Circle", latest_grade: 42, status: "active" },
      { section_name: "Trigonometric Identities", latest_grade: 0, status: "todo" },
    ],
  },
];

// Derive a color scheme based on mastery grade
const getMasteryColor = (grade) => {
  if (grade >= 80) return { text: "text-emerald-600", bar: "bg-emerald-500", light: "bg-emerald-50" };
  if (grade >= 50) return { text: "text-amber-500",  bar: "bg-amber-400",  light: "bg-amber-50"  };
  return               { text: "text-rose-500",    bar: "bg-rose-400",    light: "bg-rose-50"    };
};

// Status icon + ring color
const StatusIcon = ({ status, grade }) => {
  if (status === "done")
    return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
  if (status === "active")
    return <PenLine className="w-4 h-4 text-indigo-500 flex-shrink-0" />;
  if (status === "locked")
    return <Lock className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />;
  return <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />;
};

const Topics = () => {
  const progressArrayFromRedux = useSelector(
    (state) => state.personDetail.progressArray
  );

  const progressArray =
    progressArrayFromRedux && progressArrayFromRedux.length > 0
      ? progressArrayFromRedux
      : FILLER_PROGRESS_DATA;

  const navigate = useNavigate();

  const handleClick = (topic, section) => {
    navigate(
      `/question/${encodeURIComponent(topic)}?section=${encodeURIComponent(section)}`
    );
  };

  const currentTopic = progressArray?.[0];

  // All sections, but only show last 3 in the list
  const allSections = currentTopic?.sections ?? [];
  const visibleSections = allSections.slice(-3);

  // Resume target: last active or in-progress section
  const resumeSection =
    [...allSections].reverse().find((s) => s.status === "active") ??
    visibleSections[0];

  // Overall mastery across all sections that have a grade
  const gradedSections = allSections.filter((s) => s.latest_grade > 0);
  const overallMastery =
    gradedSections.length > 0
      ? Math.round(gradedSections.reduce((sum, s) => sum + s.latest_grade, 0) / gradedSections.length)
      : 0;

  if (!currentTopic || allSections.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200 p-6">
        <p className="text-sm font-bold text-slate-400 tracking-wide uppercase">
          All topics complete!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full select-none space-y-4">

      {/* ── Topic header ── */}
      <div className="flex flex-col gap-y-1">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
          Current Module
        </span>
        <div className="flex items-center justify-between gap-x-3">
          <h3
            className="text-xl font-extrabold tracking-tight text-slate-800 uppercase"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {currentTopic.topic_name}
          </h3>
          <span className="text-sm font-bold text-slate-500">
            {overallMastery}% mastery
          </span>
        </div>
        {/* Overall progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-700"
            style={{ width: `${overallMastery}%` }}
          />
        </div>
      </div>

      {/* ── Resume bar ── */}
      {resumeSection && (
        <div className="flex items-center justify-between gap-x-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-x-1.5 mb-0.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                Last session
              </span>
            </div>
            <span className="text-sm font-bold text-indigo-800 truncate">
              {resumeSection.section_name}
            </span>
            {resumeSection.latest_grade > 0 && (
              <span className="text-[11px] text-indigo-400 mt-0.5">
                {resumeSection.latest_grade}% complete
              </span>
            )}
          </div>
          <button
            onClick={() =>
              handleClick(currentTopic.topic_name, resumeSection.section_name)
            }
            className="flex items-center gap-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-200 transition-all duration-150 flex-shrink-0 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white text-white" />
            Resume
          </button>
        </div>
      )}

      {/* ── Section list (last 3) ── */}
      <div className="flex flex-col gap-y-2">
        {visibleSections.map((section, idx) => {
          const grade = section?.latest_grade != null ? Math.round(section.latest_grade) : 0;
          const colors = getMasteryColor(grade);
          const isLocked = section.status === "locked";
          const isActive = section.status === "active";
          const globalIdx = allSections.indexOf(section) + 1;

          return (
            <div
              key={idx}
              onClick={() =>
                !isLocked &&
                handleClick(currentTopic.topic_name, section.section_name)
              }
              className={[
                "flex items-center gap-x-3 px-4 py-3 rounded-xl border transition-all duration-150",
                isLocked
                  ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                  : isActive
                  ? "bg-white border-indigo-200 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md"
                  : "bg-white border-slate-100 cursor-pointer hover:border-slate-200 hover:shadow-sm",
              ].join(" ")}
            >
              {/* Section number */}
              <span className="text-[11px] font-bold text-slate-300 w-5 text-center flex-shrink-0">
                {globalIdx}
              </span>

              {/* Status icon */}
              <StatusIcon status={section.status} grade={grade} />

              {/* Name + mini progress */}
              <div className="flex-1 min-w-0">
                <p
                  className={[
                    "text-sm font-bold leading-snug truncate",
                    isLocked ? "text-slate-400" : "text-slate-700",
                  ].join(" ")}
                >
                  {section.section_name}
                </p>
                {grade > 0 && (
                  <div className="flex items-center gap-x-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.bar} transition-all duration-700`}
                        style={{ width: `${Math.max(4, Math.min(100, grade))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Grade or action */}
              <div className="flex-shrink-0 flex items-center">
                {grade > 0 ? (
                  <span className={`text-sm font-extrabold ${colors.text}`}>
                    {grade}%
                  </span>
                ) : section.status === "todo" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(currentTopic.topic_name, section.section_name);
                    }}
                    className="text-[11px] font-bold text-slate-400 border border-slate-200 rounded-md px-2 py-1 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Start
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default Topics;