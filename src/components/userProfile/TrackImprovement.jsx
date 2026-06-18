import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import { TrendingUpIcon, TrendingDownIcon, ChevronRightIcon } from "lucide-react";

import TrackingDottedGraph from "./TrackData/TrackingDottedGraph";
import TrackingLoggedInActivtiy_Progress from "./TrackData/TrackingLoggedInActivtiy_Progress";
import QuadrantScatterPlot from "./TrackData/QuadrantScatterPlot"; 
import Sidebar from "../Sidebar";
import NavbarLoggedIn from "../NavbarLoggedIn";

const temp_data = [
  { date: "2025-08-01T10:00:00Z", grade: "0.00" },
  { date: "2025-08-02T10:00:00Z", grade: "33.33" },
  { date: "2025-08-03T10:00:00Z", grade: "15.00" },
  { date: "2025-08-04T10:00:00Z", grade: "100.00" },
  { date: "2025-08-05T10:00:00Z", grade: "72.50" },
  { date: "2025-08-06T10:00:00Z", grade: "10.00" },
  { date: "2025-08-07T10:00:00Z", grade: "88.00" },
  { date: "2025-08-08T10:00:00Z", grade: "55.00" },
  { date: "2025-08-09T10:00:00Z", grade: "65.00" },
  { date: "2025-08-10T10:00:00Z", grade: "78.00" },
  { date: "2025-08-11T10:00:00Z", grade: "45.00" },
  { date: "2025-08-12T10:00:00Z", grade: "90.00" },
  { date: "2025-09-01T10:00:00Z", grade: "90.00" },
  { date: "2025-09-08T10:00:00Z", grade: "60.00" },
  { date: "2025-09-09T10:00:00Z", grade: "90.00" },
  { date: "2025-09-10T10:00:00Z", grade: "70.00" },
  { date: "2025-09-11T10:00:00Z", grade: "100.00" },
  { date: "2025-09-12T10:00:00Z", grade: "90.00" },
  { date: "2025-09-13T10:00:00Z", grade: "70.00" },
  { date: "2025-09-14T10:00:00Z", grade: "40.00" },
];

const advancedSampleTopics = [
  { title: "Calculus Basics", desc: "Perfect Score Streak", grade: "A+", numericGrade: 95, timeSpent: 4.5, bg: "bg-green-50", text: "text-green-600", color: "#38A169" },
  { title: "Statistics", desc: "Needs consistent review", grade: "B-", numericGrade: 72, timeSpent: 4.8, bg: "bg-amber-50", text: "text-amber-600", color: "#fd8b00" },
  { title: "Probability", desc: "Improving steadily", grade: "B+", numericGrade: 84, timeSpent: 2.2, bg: "bg-purple-50", text: "text-purple-600", color: "#5d3fd3" },
  { title: "Linear Algebra", desc: "High effort required", grade: "C+", numericGrade: 62, timeSpent: 5.5, bg: "bg-red-50", text: "text-red-500", color: "#E53E3E" },
];

const graphTitleMap = { week: "Past 7 Days", month: "Past Month", year: "Past Year" };
const PURPLE_SHADOW_THEME = "0 8px 24px rgba(93, 63, 211, 0.12)";

const TrackImprovement = () => {
  const navigate = useNavigate();
  const graphContainerRef = useRef();
  const [width, setWidth] = useState(600);
  const [filterType, setFilterType] = useState("week");
  const [graphOption, setGraphOption] = useState(1);

  const data = useSelector((state) => state.personDetail?.marks_section) || temp_data;

  // --- START NEW TIME EXTRACTION METRICS ---
  const getGoalStatusMetrics = () => {
    // Dynamic fallback mock calculation based on active filter view
    let actualHours = 16.0;
    let targetHours = 15.0;

    if (filterType === "month") {
      actualHours = 58.5;
      targetHours = 60.0;
    } else if (filterType === "year") {
      actualHours = 612.0;
      targetHours = 550.0;
    }

    const percentMet = Math.round((actualHours / targetHours) * 100);
    const isGoalMet = percentMet >= 100;

    return { percentMet, isGoalMet, actualHours, targetHours };
  };

  const goalMetrics = getGoalStatusMetrics();
  // --- END NEW TIME EXTRACTION METRICS ---

  const getTrendMetrics = () => {
    if (!data.length) return { currentAvg: 0, isUp: true, percentageDiff: "0.0", label: "vs last week", filteredData: [] };
    const latestDateInData = new Date(d3.max(data, (d) => new Date(d.date)));
    let start, end, unit = "day";
    let prevStart, prevEnd, comparisonLabel = "vs last week";

    if (filterType === "week") {
      end = new Date(latestDateInData);
      start = new Date(latestDateInData);
      start.setDate(end.getDate() - 6);
      prevEnd = new Date(start);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 6);
      comparisonLabel = "vs last week";
    } else if (filterType === "month") {
      start = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth(), 1);
      end = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth() + 1, 0);
      prevStart = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth() - 1, 1);
      prevEnd = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth(), 0);
      comparisonLabel = "vs last month";
    } else if (filterType === "year") {
      start = new Date(latestDateInData.getFullYear(), 0, 1);
      end = new Date(latestDateInData.getFullYear(), 11, 31);
      unit = "month";
      prevStart = new Date(latestDateInData.getFullYear() - 1, 0, 1);
      prevEnd = new Date(latestDateInData.getFullYear() - 1, 11, 31);
      comparisonLabel = "vs last year";
    }

    const utcStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    const utcEnd = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

    function toUTCDateKey(date) {
      if (unit === "day") {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
      } else {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }
    }

    function generateDateRange(start, end, unit) {
      const range = [];
      let current = new Date(start);
      while (current <= end) {
        range.push(new Date(current));
        if (unit === "day") current.setUTCDate(current.getUTCDate() + 1);
        else current.setUTCMonth(current.getUTCMonth() + 1);
      }
      return range;
    }

    const dateRange = generateDateRange(utcStart, utcEnd, unit);
    const dataMap = {};
    data.forEach((d) => {
      const key = toUTCDateKey(new Date(d.date));
      if (!dataMap[key]) dataMap[key] = [];
      const numericGrade = parseFloat(d.grade);
      dataMap[key].push(isNaN(numericGrade) ? 0 : numericGrade);
    });

    const parsedData = dateRange.map((date) => {
      const key = toUTCDateKey(date);
      const grades = dataMap[key] || [];
      const avg = grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
      return { date, value: avg, hasData: grades.length > 0 };
    });

    const currentPeriodGrades = parsedData.filter(d => d.hasData).map(d => d.value);
    const currentAvg = currentPeriodGrades.length ? currentPeriodGrades.reduce((a, b) => a + b, 0) / currentPeriodGrades.length : 0;
    const prevDateRange = generateDateRange(prevStart, prevEnd, unit);
    const prevPeriodGrades = [];
    prevDateRange.forEach((date) => {
      const key = toUTCDateKey(date);
      if (dataMap[key]) prevPeriodGrades.push(...dataMap[key]);
    });
    const prevAvg = prevPeriodGrades.length ? prevPeriodGrades.reduce((a, b) => a + b, 0) / prevPeriodGrades.length : 0;
    const diff = currentAvg - prevAvg;
    const filteredData = data.filter((d) => new Date(d.date) >= start && new Date(d.date) <= end);

    return { currentAvg, isUp: diff >= 0, percentageDiff: Math.abs(diff).toFixed(1), label: comparisonLabel, filteredData };
  };

  const trendMetrics = getTrendMetrics();

  useEffect(() => {
    const updateWidth = () => {
      if (graphContainerRef.current) {
        setWidth(Math.max(graphContainerRef.current.offsetWidth - 16, 320));
      }
    };
    
    const timeoutId = setTimeout(updateWidth, 50);
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
      clearTimeout(timeoutId);
    };
  }, [graphOption]);

  const items = [
    {
      option: 1,
      topic: "Weekly Grade Trend",
      previewLabel: "Grade Trend",
      item: (
        <TrackingDottedGraph data={trendMetrics.filteredData} width={width} filterType={filterType} />
      ),
    },
    {
      option: 2,
      topic: "Study Efficiency",
      previewLabel: "Time Commitment Goals",
      item: (
        <TrackingLoggedInActivtiy_Progress filterType={filterType} width={width} />
      ),
    },
    {
      option: 3,
      topic: "Grades vs Effort Analysis",
      previewLabel: "TOPIC MASTERY",
      item: (
        <QuadrantScatterPlot topics={advancedSampleTopics} width={width} filterType={filterType} />
      ),
    },
  ];

  const activeItem = items.find((i) => i.option === graphOption);

  return (
    <div className="min-h-screen text-on-surface" >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      
      <Sidebar />
      <NavbarLoggedIn />

      <main className="pt-24 pb-12 px-4 md:px-10 pl-0 lg:pl-64 2xl:pl-0" style={{ fontFamily: "'Lexend', sans-serif" }}>
        <div className="max-w-7xl mx-auto">

          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-left" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome Back, Student!
              </h1>
              <p className="text-lg text-gray-500 mt-2">
                You've mastered 4 calculus topics. Keep up the great work!
              </p>
            </div>
          </div>

          {/* Quick Filter Controls */}
          <div className="flex gap-3 mb-6">
            {Object.entries(graphTitleMap).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                style={
                  filterType === type
                    ? { background: "#5d3fd3", color: "#fff", boxShadow: "0 4px 14px rgba(93,63,211,0.4)" }
                    : { background: "#fff", border: "1px solid #e2dfec", color: "#484554", boxShadow: "0 2px 6px rgba(93,63,211,0.03)" }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bento Grid Stack Layout */}
          <div className="grid grid-cols-12 gap-6 items-stretch">

            {/* Left Primary Display Canvas Container */}
            <div className="col-span-12 lg:col-span-8 flex flex-col justify-stretch">
              {graphOption === 3 ? (
                <div ref={graphContainerRef} className="w-full h-full flex flex-col">
                  {activeItem.item}
                </div>
              ) : (
                <div
                  ref={graphContainerRef}
                  className="w-full h-full bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between"
                  style={{ boxShadow: PURPLE_SHADOW_THEME }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {activeItem.topic}
                      </h3>

                      {graphOption === 1 && (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5d3fd3" }} />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Grade</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
                              style={{
                                color: trendMetrics.isUp ? "#38A169" : "#E53E3E",
                                backgroundColor: trendMetrics.isUp ? "#F0FDF4" : "#FFF5F5"
                              }}
                            >
                              {trendMetrics.isUp ? <TrendingUpIcon size={12} /> : <TrendingDownIcon size={12} />}
                              <span>{trendMetrics.percentageDiff}%</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{trendMetrics.label}</span>
                          </div>
                        </div>
                      )}

                      {graphOption === 2 && (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-5 text-[10px] font-black tracking-wider text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                              <span className="uppercase tracking-widest">ACTUAL TIME</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 border-t-2 border-dashed border-slate-300 inline-block"></span>
                              <span className="uppercase tracking-widest">STUDY GOAL</span>
                            </div>
                          </div>
                          
                          {/* Sync dynamic status pill onto primary header view layer */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <div 
                              className="text-xs font-bold px-1.5 py-0.5 rounded"
                              style={{
                                color: goalMetrics.isGoalMet ? "#38A169" : "#E53E3E",
                                backgroundColor: goalMetrics.isGoalMet ? "#F0FDF4" : "#FFF5F5"
                              }}
                            >
                              {goalMetrics.percentMet}%
                            </div>
                            <span className="text-xs text-gray-400 font-medium">of goal completed</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full">
                      {activeItem.item}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel Layout Switchers */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 justify-between">
              {items.map((i) => {
                const isActive = graphOption === i.option;

                if (i.option === 3) {
                  return (
                    <div
                      key={i.option}
                      onClick={() => setGraphOption(3)}
                      className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between flex-1 ${
                        isActive ? "border-purple-300 ring-2 ring-purple-100" : "border-gray-100 hover:border-purple-200"
                      }`}
                      style={{ boxShadow: PURPLE_SHADOW_THEME }}
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                          {i.previewLabel}
                        </p>

                        <div className="flex flex-col gap-4">
                          {advancedSampleTopics.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center ${item.text} font-black text-xs shadow-sm border border-black/5 flex-shrink-0`}>
                                {item.grade}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-gray-800 leading-tight truncate">{item.title}</h4>
                                <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="w-full py-2.5 rounded-full border border-purple-200 text-center text-xs font-bold text-purple-600 bg-white transition-all group-hover:bg-purple-50 flex items-center justify-center gap-1">
                          <span>View All Grades</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={i.option}
                    onClick={() => setGraphOption(i.option)}
                    className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between h-[115px] ${
                      isActive ? "border-purple-300 ring-2 ring-purple-100" : "border-gray-100 hover:border-purple-200"
                    }`}
                    style={{ boxShadow: PURPLE_SHADOW_THEME }}
                  >
                    <div className="flex justify-between items-start text-center lg:text-left w-full">
                      <div>
                        <p className="font-bold text-sm text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {i.previewLabel}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{i.topic}</p>
                      </div>

                  
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold transition-colors group-hover:text-purple-700 mt-auto pt-2" style={{ color: "#5d3fd3" }}>
                      <span>{isActive ? "Currently viewing" : "Switch to this view"}</span>
                      <span className="flex items-center group-hover:translate-x-1 transition-transform">
                        <ChevronRightIcon size={16} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Milestone Card */}
            <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-3xl border border-gray-100" style={{ boxShadow: PURPLE_SHADOW_THEME }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Next Milestone</h3>
                <span className="text-sm font-bold text-purple-600">In 2 days</span>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl border-2 border-dashed items-center cursor-pointer group transition-colors hover:border-purple-300" style={{ borderColor: "#e2dfec" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors group-hover:bg-purple-50" style={{ background: "#f1f0f6" }}>
                  <span className="material-symbols-outlined text-purple-600">quiz</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Weekly Trigonometry Quiz</h4>
                  <p className="text-sm text-gray-400">15 Questions • 25 Minutes</p>
                </div>
                <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </div>

            {/* Bottom Summary Panel */}
            <div className="col-span-12 md:col-span-6 rounded-3xl p-6 flex items-center gap-6" style={{ background: "#1C0062", boxShadow: PURPLE_SHADOW_THEME }}>
              <div className="flex-1">
                <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ background: "#6bfe9c", color: "#004f26" }}>Weekly Summary</span>
                <h2 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Keep it up!</h2>
                <p className="text-purple-200 text-sm">You're in the top 15% of students this week.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { value: trendMetrics.filteredData.length, label: "Sessions" },
                  { value: "83%", label: "Avg Grade" },
                  // Dynamic display binding on footer summary column card module
                  { value: `${goalMetrics.actualHours.toFixed(1)}h`, label: "Time Logged" },
                  { value: "4", label: "Topics Done" },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <p className="text-white text-xl font-bold">{value}</p>
                    <p className="text-purple-300 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackImprovement;