import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Play, CheckCircle2, PenLine, Circle, Lock } from "lucide-react";

// Robust fallback blueprint tracking real production database fields
const FALLER_PROGRESS_DATA = [
  {
    topic_name: "Rational Numbers",
    topic_mastery: 0,
    sections: [
      { section_name: "Introduction to Fractions", latest_grade: 0, completed: false, section_id: 101 },
      { section_name: "Equivalent Fractions", latest_grade: 0, completed: false, section_id: 102 },
      { section_name: "Comparing Fractions", latest_grade: 0, completed: false, section_id: 103 },
      { section_name: "Fractions on a Number Line", latest_grade: 0, completed: false, section_id: 104 },
    ],
  },
];

const getMasteryColor = (grade) => {
  if (grade >= 80) return { text: "text-emerald-600", bar: "bg-emerald-500", light: "bg-emerald-50" };
  if (grade >= 50) return { text: "text-amber-500",  bar: "bg-amber-400",  light: "bg-amber-50"  };
  return               { text: "text-rose-500",    bar: "bg-rose-400",    light: "bg-rose-50"    };
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case "done":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
    case "active":
      return <PenLine className="w-4 h-4 text-indigo-500 flex-shrink-0" />;
    case "locked":
      return <Lock className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />;
    default:
      return <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />;
  }
};

const Topics = () => {
  const navigate = useNavigate();

  const progressArrayFromRedux = useSelector((state) => state.personDetail?.progressArray);
  const currentModule = useSelector((state) => state.personDetail?.current_module);
  const hasActivityHistory = useSelector((state) => state.personDetail?.hasActivityHistory ?? true);

  const progressArray = progressArrayFromRedux && progressArrayFromRedux.length > 0
    ? progressArrayFromRedux
    : FALLER_PROGRESS_DATA;

  const currentTopic = progressArray?.[0];
  const allSections = currentTopic?.sections ?? [];

  // FIX 1: Removed .slice(0, 3) so all sections map properly to the UI
  const processedSections = allSections.slice(0, 3).map((section, idx) => {
    let status = section.status;
    
    if (!status) {
      if (section.completed) {
        status = "done";
      } else if (currentModule && section.section_id === currentModule.section_id) {
        status = "active";
      } else if (!currentModule && idx === 0) {
        status = "active"; 
      } else {
        status = "todo";
      }
    }
    return { ...section, status };
  });

  const resumeSection = processedSections.find((s) => s.status === "active") ?? processedSections[0];

  const handleClick = (topicName, sectionName) => {
    navigate(`/question/${encodeURIComponent(topicName)}?section=${encodeURIComponent(sectionName)}`);
  };

  if (!currentTopic || allSections.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200 p-6">
        <p className="text-sm font-bold text-slate-400 tracking-wide uppercase">
          All topics complete!
        </p>
      </div>
    );
  }

  // FIX 2: Handle potential decimal from database (e.g., 0.85 -> 85) for the main topic mastery
  const rawMastery = currentTopic.topic_mastery ?? 0;
  const displayMastery = rawMastery <= 1 && rawMastery > 0 ? Math.round(rawMastery * 100) : Math.round(rawMastery);

  return (
    <div className="w-full select-none space-y-4">
      
      {/* ── Topic Header ── */}
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
            {displayMastery}% Mastery
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-700"
            style={{ width: `${displayMastery}%` }}
          />
        </div>
      </div>

      {/* ── Resume Bar ── */}
      {resumeSection && (
        <div className="flex items-center justify-between gap-x-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-x-1.5 mb-0.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                {hasActivityHistory ? "Last session" : "Up Next"}
              </span>
            </div>
            <span className="text-sm font-bold text-indigo-800 truncate">
              {resumeSection.section_name}
            </span>
            {resumeSection.latest_grade > 0 && (
              <span className="text-[11px] text-indigo-400 mt-0.5">
                {/* Fixed resume section decimal bug */}
                Last Score: {resumeSection.latest_grade <= 1 ? Math.round(resumeSection.latest_grade * 100) : Math.round(resumeSection.latest_grade)}%
              </span>
            )}
          </div>
          <button
            onClick={() => handleClick(currentTopic.topic_name, resumeSection.section_name)}
            className="flex items-center gap-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-200 transition-all duration-150 flex-shrink-0 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white text-white" />
           {hasActivityHistory ? "Resume" : "Start"} 
          </button>
        </div>
      )}

      {/* ── Section List ── */}
      <div className="flex flex-col gap-y-2">
        {processedSections.map((section, idx) => {
          
          // FIX 3: Detect if backend is sending a decimal (like 0.85) or whole number (like 85)
          const rawGrade = section?.latest_grade != null ? section.latest_grade : 0;
          const grade = rawGrade <= 1 && rawGrade > 0 ? Math.round(rawGrade * 100) : Math.round(rawGrade);
          
          const colors = getMasteryColor(grade);
          const isLocked = section.status === "locked";
          const isActive = section.status === "active";

          return (
            <div
              key={section.section_id || idx}
              onClick={() => !isLocked && handleClick(currentTopic.topic_name, section.section_name)}
              className={[
                "flex items-center gap-x-3 px-4 py-3 rounded-xl border transition-all duration-150",
                isLocked
                  ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                  : isActive
                  ? "bg-white border-indigo-200 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md"
                  : "bg-white border-slate-100 cursor-pointer hover:border-slate-200 hover:shadow-sm",
              ].join(" ")}
            >
              <span className="text-[11px] font-bold text-slate-300 w-5 text-center flex-shrink-0">
                {idx + 1}
              </span>

              <StatusIcon status={section.status} />

              <div className="flex-1 min-w-0">
                <p className={["text-sm font-bold leading-snug truncate", isLocked ? "text-slate-400" : "text-slate-700"].join(" ")}>
                  {section.section_name}
                </p>
                {grade > 0 && (
                  <div className="flex items-center gap-x-2 mt-1">
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.bar} transition-all duration-700`}
                        style={{ width: `${Math.max(6, Math.min(100, grade))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 flex items-center">
                {grade > 0 ? (
                  <span className={`text-sm font-extrabold ${colors.text}`}>
                    {grade}%
                  </span>
                ) : section.status === "todo" || section.status === "active" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(currentTopic.topic_name, section.section_name);
                    }}
                    className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-1 hover:bg-indigo-100 transition-colors cursor-pointer"
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