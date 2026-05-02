import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import TrackingDottedGraph from "./TrackData/TrackingDottedGraph";
import TrackingLoggedInActivtiy_Progress from "./TrackData/TrackingLoggedInActivtiy_Progress";
import TopicMastery from "./TrackData/TopicMastery";

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const sideNavItems = [
  { icon: "dashboard",    label: "Dashboard"  },
  { icon: "auto_stories", label: "Lessons"    },
  { icon: "edit_square",  label: "Practice"   },
  { icon: "school",       label: "Tutors"     },
  { icon: "settings",     label: "Settings"   },
];

const temp_data = [
  { date: "2025-08-01T10:00:00Z", grade: "0.00"   },
  { date: "2025-08-02T10:00:00Z", grade: "33.33"  },
  { date: "2025-08-03T10:00:00Z", grade: "15.00"  },
  { date: "2025-08-04T10:00:00Z", grade: "100.00" },
  { date: "2025-08-05T10:00:00Z", grade: "72.50"  },
  { date: "2025-08-06T10:00:00Z", grade: "10.00"  },
  { date: "2025-08-07T10:00:00Z", grade: "88.00"  },
  { date: "2025-08-08T10:00:00Z", grade: "55.00"  },
  { date: "2025-08-09T10:00:00Z", grade: "65.00"  },
  { date: "2025-08-10T10:00:00Z", grade: "78.00"  },
  { date: "2025-08-11T10:00:00Z", grade: "45.00"  },
  { date: "2025-08-12T10:00:00Z", grade: "90.00"  },
  { date: "2025-09-01T10:00:00Z", grade: "90.00"  },
  { date: "2025-09-08T10:00:00Z", grade: "60.00"  },
  { date: "2025-09-09T10:00:00Z", grade: "90.00"  },
  { date: "2025-09-10T10:00:00Z", grade: "70.00"  },
  { date: "2025-09-11T10:00:00Z", grade: "100.00" },
  { date: "2025-09-12T10:00:00Z", grade: "90.00"  },
  { date: "2025-09-13T10:00:00Z", grade: "70.00"  },
  { date: "2025-09-14T10:00:00Z", grade: "40.00"  },
];

const graphTitleMap = { week: "Past 7 Days", month: "Past Month", year: "Past Year" };

// ─── Main component ───────────────────────────────────────────────────────────
const TrackImprovement = () => {
  const navigate    = useNavigate();
  const graphContainerRef = useRef();
  const [width, setWidth]           = useState(600);
  const [filterType, setFilterType] = useState("week");
  const [graphOption, setGraphOption] = useState(1);
  const [toastVisible, setToastVisible] = useState(true);

  const data = useSelector((state) => state.personDetail.marks_section) || temp_data;

  const getFilteredData = () => {
    if (!data.length) return [];
    const latestDate = new Date(data[data.length - 1].date);
    let startDate = new Date(latestDate);
    if (filterType === "week")  startDate.setDate(latestDate.getDate() - 6);
    if (filterType === "month") startDate.setMonth(latestDate.getMonth() - 1);
    if (filterType === "year")  startDate.setFullYear(latestDate.getFullYear() - 1);
    return data.filter((d) => new Date(d.date) >= startDate && new Date(d.date) <= latestDate);
  };

  const filteredData = getFilteredData();

  useEffect(() => {
    const updateWidth = () => {
      if (graphContainerRef.current)
        setWidth(Math.min(graphContainerRef.current.offsetWidth - 48, 700));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const items = [
    {
      option: 1,
      topic: "Average Grade Over Time",
      previewLabel: "Grade Trend",
      previewIcon: "show_chart",
      item: (
        <div className="w-full" ref={graphContainerRef}>
          <TrackingDottedGraph data={filteredData} width={width} filterType={filterType} />
        </div>
      ),
    },
    {
      option: 2,
      topic: "Completion Progress & Time Commitment",
      previewLabel: "Study Efficiency",
      previewIcon: "donut_large",
      item: (
        <div className="w-full">
          <TrackingLoggedInActivtiy_Progress filterType={filterType} />
        </div>
      ),
    },
    {
      option: 3,
      topic: "Grades for each Topic",
      previewLabel: "Topic Mastery",
      previewIcon: "bar_chart",
      item: (
        <div className="w-full">
          <TopicMastery />
        </div>
      ),
    },
  ];

  const activeItem   = items.find((i) => i.option === graphOption);
  const inactiveItems = items.filter((i) => i.option !== graphOption);

  return (
    <div
      className="min-h-screen text-on-surface"
      style={{ background: "#f8f9fa", fontFamily: "'Lexend', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="h-screen w-64 border-r border-gray-100 bg-white fixed left-0 top-0 hidden md:flex flex-col z-50"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="flex flex-col h-full p-4 gap-2">
          {/* Logo */}
          <div className="px-4 py-6 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: "#5d3fd3" }}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight" style={{ color: "#5d3fd3" }}>
                  Mathamagic
                </h2>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  Learning Path
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {sideNavItems.map(({ icon, label }) => {
              const isActive = label === "Dashboard";
              return (
                <div
                  key={label}
                  onClick={() => label === "Dashboard" && navigate("/showpersonaldata")}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer select-none transition-all duration-200 hover:translate-x-1"
                  style={
                    isActive
                      ? { background: "rgba(93,63,211,0.1)", color: "#5d3fd3", fontWeight: 700 }
                      : { color: "#64748b" }
                  }
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span>{label}</span>
                </div>
              );
            })}
          </nav>

          {/* XP progress */}
          <div
            className="mt-auto p-4 rounded-2xl mb-4"
            style={{ background: "rgba(93,63,211,0.05)" }}
          >
            <p className="text-xs font-bold mb-2 uppercase tracking-tighter" style={{ color: "#5d3fd3" }}>
              Level 12 Wizard
            </p>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "75%", background: "#5d3fd3" }} />
            </div>
            <button
              className="mt-4 w-full py-2.5 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-95"
              style={{ background: "#904d00" }}
            >
              Start Daily Challenge
            </button>
          </div>

          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            onClick={() => navigate("/login")}
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Log Out</span>
          </div>
        </div>
      </aside>

      {/* ── Top Nav ── */}
      <header
        className="fixed top-0 right-0 left-0 md:left-64 z-40 border-b border-gray-100"
        style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex justify-between items-center w-full px-6 py-3">
          {/* Search */}
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2"
              style={{ focusRingColor: "rgba(144,77,0,0.2)" }}
              placeholder="Search topics, tutors..."
              type="text"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <nav
              className="hidden lg:flex items-center gap-6 text-sm font-medium"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <a className="text-slate-600 hover:text-indigo-700 transition-colors" href="#">Book Tutor</a>
              <a
                className="font-bold border-b-2 pb-1"
                style={{ color: "#5d3fd3", borderColor: "#5d3fd3" }}
                href="#"
              >
                Profile
              </a>
              <a className="text-slate-600 hover:text-indigo-700 transition-colors" href="#">Free Resources</a>
            </nav>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden lg:block" />
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="pt-24 pb-12 px-4 md:px-10 md:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Page header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1
                className="text-4xl font-bold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Weekly Progress
              </h1>
              <p className="text-lg text-gray-500 mt-2">
                Your analytical journey through the world of numbers.
              </p>
            </div>
            <div className="flex gap-3">
              {/* Filter buttons */}
              {Object.entries(graphTitleMap).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={
                    filterType === type
                      ? { background: "#5d3fd3", color: "#fff", boxShadow: "0 4px 12px rgba(93,63,211,0.3)" }
                      : { background: "#fff", border: "1px solid #c9c4d7", color: "#484554" }
                  }
                >
                  {type === "week" && (
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  )}
                  {label}
                </button>
              ))}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 hover:shadow-lg"
                style={{ background: "#5d3fd3" }}
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
            </div>
          </div>

          {/* ── Bento grid ── */}
          <div className="grid grid-cols-12 gap-6">

            {/* Main chart card */}
            <div
              className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-gray-100"
              style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.06)" }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3
                    className="text-2xl font-semibold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {activeItem.topic}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {filterType === "week" && "Average performance over the past 7 days"}
                    {filterType === "month" && "Average performance over the past month"}
                    {filterType === "year" && "Average performance over the past year"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#5d3fd3" }} />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Avg. Grade
                  </span>
                </div>
              </div>
              <div ref={graphContainerRef} className="w-full">
                {activeItem.item}
              </div>
            </div>

            {/* Sidebar graph-switcher cards */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              {inactiveItems.map((i) => (
                <div
                  key={i.option}
                  onClick={() => setGraphOption(i.option)}
                  className="flex-1 bg-white p-6 rounded-xl border border-gray-100 cursor-pointer transition-all hover:border-indigo-300 group"
                  style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.06)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors group-hover:bg-indigo-100"
                      style={{ background: "#f3f4f5" }}
                    >
                      <span
                        className="material-symbols-outlined transition-colors group-hover:text-indigo-600"
                        style={{ color: "#5d3fd3" }}
                      >
                        {i.previewIcon}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {i.previewLabel}
                      </p>
                      <p className="text-xs text-gray-400">{i.topic}</p>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between text-xs font-bold mt-2 transition-colors group-hover:text-indigo-600"
                    style={{ color: "#5d3fd3" }}
                  >
                    <span>Switch to this view</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))}

              {/* Achievement card */}
              <div
                className="rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
                style={{ background: "#1C0062", minHeight: "160px" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at top right, rgba(93,63,211,0.4), transparent)",
                  }}
                />
                <div className="absolute right-[-16px] bottom-[-16px] opacity-20">
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontSize: "120px", fontVariationSettings: "'FILL' 1" }}
                  >
                    military_tech
                  </span>
                </div>
                <div className="relative z-10">
                  <span
                    className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                    style={{ background: "#6bfe9c", color: "#004f26" }}
                  >
                    Mastery Badge Earned
                  </span>
                  <p className="text-white font-bold text-sm leading-snug">
                    You've mastered Linear Equations!
                  </p>
                </div>
                <button
                  className="relative z-10 mt-4 self-start font-bold px-4 py-2 rounded-xl text-sm transition-colors active:scale-95"
                  style={{ background: "#fff", color: "#1C0062" }}
                >
                  Claim Reward
                </button>
              </div>
            </div>

            {/* Next Milestone card */}
            <div
              className="col-span-12 md:col-span-6 bg-white p-6 rounded-xl border border-gray-100"
              style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.06)" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="text-2xl font-semibold"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Next Milestone
                </h3>
                <span className="text-sm font-bold" style={{ color: "#5d3fd3" }}>
                  In 2 days
                </span>
              </div>
              <div
                className="flex gap-4 p-4 rounded-xl border-2 border-dashed items-center cursor-pointer group transition-colors hover:border-indigo-300"
                style={{ borderColor: "#c9c4d7" }}
              >
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center transition-colors group-hover:bg-indigo-50"
                  style={{ background: "#edeeef" }}
                >
                  <span className="material-symbols-outlined" style={{ color: "#5d3fd3" }}>quiz</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Weekly Trigonometry Quiz
                  </h4>
                  <p className="text-sm text-gray-400">15 Questions • 25 Minutes</p>
                </div>
                <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 p-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-indigo-200 -ml-2 first:ml-0"
                    style={{ background: `hsl(${240 + i * 20}, 60%, 75%)` }}
                  />
                ))}
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400 -ml-2"
                  style={{ background: "#edeeef" }}
                >
                  +24
                </div>
                <span className="ml-2 text-xs font-medium text-gray-400">Joining this quiz</span>
              </div>
            </div>

            {/* Stats summary row */}
            <div
              className="col-span-12 md:col-span-6 rounded-xl p-6 flex items-center gap-6"
              style={{ background: "#1C0062", boxShadow: "0 8px 32px rgba(28,0,98,0.25)" }}
            >
              <div className="flex-1">
                <span
                  className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                  style={{ background: "#6bfe9c", color: "#004f26" }}
                >
                  Weekly Summary
                </span>
                <h2
                  className="text-white text-3xl font-bold mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Keep it up!
                </h2>
                <p className="text-indigo-200 text-sm">
                  You're in the top 15% of students this week.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { value: filteredData.length, label: "Sessions" },
                  {
                    value: filteredData.length
                      ? Math.round(
                          filteredData.reduce((s, d) => s + parseFloat(d.grade), 0) /
                            filteredData.length
                        ) + "%"
                      : "—",
                    label: "Avg Grade",
                  },
                  { value: "12.5h", label: "Time Logged" },
                  { value: "3", label: "Topics Done" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <p className="text-white text-xl font-bold">{value}</p>
                    <p className="text-indigo-300 text-[10px] uppercase tracking-wider font-semibold">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Toast ── */}
      {toastVisible && (
        <div
          className="fixed bottom-8 right-8 bg-white border shadow-2xl rounded-2xl p-4 flex items-center gap-4 z-50"
          style={{ borderColor: "#c9c4d7", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: "#fd8b00" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              celebration
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-800">Daily Goal Reached!</p>
            <p className="text-xs text-gray-400">You earned 50 Wizard XP</p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 ml-2"
            onClick={() => setToastVisible(false)}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackImprovement;