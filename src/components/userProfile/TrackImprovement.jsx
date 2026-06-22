import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as d3 from "d3";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ChevronRightIcon,
} from "lucide-react";

import TrackingDottedGraph from "./TrackData/TrackingDottedGraph";
import TrackingLoggedInActivtiy_Progress from "./TrackData/TrackingLoggedInActivtiy_Progress";
import QuadrantScatterPlot from "./TrackData/QuadrantScatterPlot";
import Sidebar from "../Sidebar";
import NavbarLoggedIn from "../NavbarLoggedIn";

import { supabase } from "../../db/supabaseclient";
import LoggedInLayout from "../LoggedInLayout";

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

const mockTopics = [
  {
    title: "Calculus Basics",
    desc: "Perfect Score Streak",
    grade: "A+",
    numericGrade: 95,
    timeSpent: 4.5,
    bg: "bg-green-50",
    text: "text-green-600",
    color: "#38A169",
  },
  {
    title: "Statistics",
    desc: "Needs consistent review",
    grade: "B-",
    numericGrade: 72,
    timeSpent: 4.8,
    bg: "bg-amber-50",
    text: "text-amber-600",
    color: "#fd8b00",
  },
  {
    title: "Probability",
    desc: "Improving steadily",
    grade: "B+",
    numericGrade: 84,
    timeSpent: 2.2,
    bg: "bg-purple-50",
    text: "text-purple-600",
    color: "#5d3fd3",
  },
  {
    title: "Linear Algebra",
    desc: "High effort required",
    grade: "C+",
    numericGrade: 62,
    timeSpent: 5.5,
    bg: "bg-red-50",
    text: "text-red-500",
    color: "#E53E3E",
  },
];

const graphTitleMap = {
  week: "Past 7 Days",
  month: "Past Month",
  year: "Past Year",
};
const PURPLE_SHADOW_THEME = "0 8px 24px rgba(93, 63, 211, 0.12)";

const TrackImprovement = () => {
  const navigate = useNavigate();
  const graphContainerRef = useRef();
  const [width, setWidth] = useState(600);
  const [filterType, setFilterType] = useState("week");
  const [graphOption, setGraphOption] = useState(1);

  // State variables for backend data hydration
  const [gradeTrend, setGradeTrend] = useState([]);
  const [topicProgress, setTopicProgress] = useState([]);
  const [studyTimeLogs, setStudyTimeLogs] = useState([]);
  const [weeklyTarget, setWeeklyTarget] = useState(15);
  const [nextMilestone, setNextMilestone] = useState(null);

  const [loading, setLoading] = useState(true);

  // ─── Fetch Analytics Data From Backend on Mount ──────────────────────────
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const base =
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000"
            : "https://mathamagic-backend.vercel.app";

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data } = await axios.get(`${base}/student/progress`, {
            withCredentials: true,
          });
          console.log(data);
          if (data.gradeTrend) setGradeTrend(data.gradeTrend);
          if (data.topics) setTopicProgress(data.topics);
          // if (data.topicBreakdown) setTopicProgress(data.topicBreakdown);
          if (data.timeLogs) setStudyTimeLogs(data.timeLogs);
          if (data.targetHours) setWeeklyTarget(data.targetHours);
          if (data.nextMilestone) setNextMilestone(data.nextMilestone);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error hydrating tracking analytics updates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  const data = gradeTrend && gradeTrend.length ? gradeTrend : temp_data;
  const advancedSampleTopics =
    topicProgress && topicProgress.length ? topicProgress : mockTopics;

  // ─── Live Calculation Engine For Study Target Milestones ──────────────────
  const getGoalStatusMetrics = () => {
    let actualHours = 0;
    const now = new Date();

    studyTimeLogs.forEach((log) => {
      const logDate = new Date(log.date);
      const diffTime = Math.abs(now - logDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filterType === "week" && diffDays <= 7)
        actualHours += log.durationHours;
      else if (filterType === "month" && diffDays <= 30)
        actualHours += log.durationHours;
      else if (filterType === "year" && diffDays <= 365)
        actualHours += log.durationHours;
    });

    let targetHours = weeklyTarget;
    if (filterType === "month") targetHours = weeklyTarget * 4.3;
    if (filterType === "year") targetHours = weeklyTarget * 52;

    if (actualHours === 0)
      actualHours =
        filterType === "week" ? 12 : filterType === "month" ? 45 : 480;

    const percentMet = Math.round((actualHours / targetHours) * 100);
    const isGoalMet = percentMet >= 100;

    return { percentMet, isGoalMet, actualHours, targetHours };
  };

  const getTrendMetrics = () => {
    if (!data || !data.length)
      return {
        currentAvg: 0,
        isUp: true,
        percentageDiff: "0.0",
        label: "vs last week",
        filteredData: [],
        activeDaysCount: 0,
        topicsCount: 0,
      };

    const latestDateInData = new Date(d3.max(data, (d) => new Date(d.date)));
    let start,
      end,
      unit = "day";
    let prevStart,
      prevEnd,
      comparisonLabel = "vs last week";

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
      start = new Date(
        latestDateInData.getFullYear(),
        latestDateInData.getMonth(),
        1
      );
      end = new Date(
        latestDateInData.getFullYear(),
        latestDateInData.getMonth() + 1,
        0
      );
      prevStart = new Date(
        latestDateInData.getFullYear(),
        latestDateInData.getMonth() - 1,
        1
      );
      prevEnd = new Date(
        latestDateInData.getFullYear(),
        latestDateInData.getMonth(),
        0
      );
      comparisonLabel = "vs last month";
    } else if (filterType === "year") {
      start = new Date(latestDateInData.getFullYear(), 0, 1);
      end = new Date(latestDateInData.getFullYear(), 11, 31);
      unit = "month";
      prevStart = new Date(latestDateInData.getFullYear() - 1, 0, 1);
      prevEnd = new Date(latestDateInData.getFullYear() - 1, 11, 31);
      comparisonLabel = "vs last year";
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    function toLocalDateKey(dateInput) {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return unit === "day" ? `${year}-${month}-${day}` : `${year}-${month}`;
    }

    const dataMap = {};
    data.forEach((d) => {
      const key = toLocalDateKey(d.date);
      if (!key) return;
      if (!dataMap[key]) dataMap[key] = [];
      const numericGrade = parseFloat(d.grade);
      dataMap[key].push(isNaN(numericGrade) ? 0 : numericGrade);
    });

    function generateDateRange(st, ed, un) {
      const range = [];
      let current = new Date(st);
      while (current <= ed) {
        range.push(new Date(current));
        if (un === "day") current.setDate(current.getDate() + 1);
        else current.setMonth(current.getMonth() + 1);
      }
      return range;
    }

    const dateRange = generateDateRange(start, end, unit);
    let uniqueLoggedDays = 0;

    const parsedData = dateRange.map((date) => {
      const key = toLocalDateKey(date);
      const grades = dataMap[key] || [];
      const hasData = grades.length > 0;

      if (hasData) {
        uniqueLoggedDays++;
      }

      const avg = hasData
        ? grades.reduce((a, b) => a + b, 0) / grades.length
        : 0;
      return {
        date: date.toISOString(),
        grade: avg.toFixed(2),
        hasData,
      };
    });

    const currentPeriodGrades = parsedData
      .filter((d) => d.hasData)
      .map((d) => parseFloat(d.grade));
    const currentAvg = currentPeriodGrades.length
      ? currentPeriodGrades.reduce((a, b) => a + b, 0) /
        currentPeriodGrades.length
      : 0;

    const prevDateRange = generateDateRange(prevStart, prevEnd, unit);
    const prevPeriodGrades = [];
    prevDateRange.forEach((date) => {
      const key = toLocalDateKey(date);
      if (dataMap[key]) prevPeriodGrades.push(...dataMap[key]);
    });

    const prevAvg = prevPeriodGrades.length
      ? prevPeriodGrades.reduce((a, b) => a + b, 0) / prevPeriodGrades.length
      : 0;

    const diff = currentAvg - prevAvg;

    return {
      currentAvg,
      isUp: diff >= 0,
      percentageDiff: Math.abs(diff).toFixed(1),
      label: comparisonLabel,
      filteredData: parsedData,
      activeDaysCount: uniqueLoggedDays,
      topicsCount:
        topicProgress && topicProgress.length ? topicProgress.length : 0,
    };
  };

  const goalMetrics = getGoalStatusMetrics();
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
        <TrackingDottedGraph
          data={trendMetrics.filteredData}
          width={width}
          filterType={filterType}
        />
      ),
    },
    {
      option: 2,
      topic: "Study Efficiency",
      previewLabel: "Time Commitment Goals",
      item: (
        <TrackingLoggedInActivtiy_Progress
          filterType={filterType}
          width={width}
          timeLogs={studyTimeLogs}
          targetHours={weeklyTarget}
        />
      ),
    },
    {
      option: 3,
      topic: "Grades vs Effort Analysis",
      previewLabel: "TOPIC MASTERY",
      item: (
        <QuadrantScatterPlot
          topics={advancedSampleTopics}
          width={width}
          filterType={filterType}
        />
      ),
    },
  ];

  const activeItem = items.find((i) => i.option === graphOption);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-600 font-bold">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-on-surface">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      <LoggedInLayout>
        <main
          className="pt-24 pb-12 px-4 md:px-10 pl-0 lg:pl-64 2xl:pl-0"
          style={{ fontFamily: "'Lexend', sans-serif" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1
                  className="text-4xl font-bold text-left"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Welcome Back, Student!
                </h1>
                <p className="text-lg text-gray-500 mt-2">
                  Keep up the great work on your learning metrics!
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              {Object.entries(graphTitleMap).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                  style={
                    filterType === type
                      ? {
                          background: "#5d3fd3",
                          color: "#fff",
                          boxShadow: "0 4px 14px rgba(93,63,211,0.4)",
                        }
                      : {
                          background: "#fff",
                          border: "1px solid #e2dfec",
                          color: "#484554",
                          boxShadow: "0 2px 6px rgba(93,63,211,0.03)",
                        }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6 items-stretch">
              <div className="col-span-12 lg:col-span-8 flex flex-col justify-stretch">
                {graphOption === 3 ? (
                  <div
                    ref={graphContainerRef}
                    className="w-full h-full flex flex-col"
                  >
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
                        <h3
                          className="text-2xl font-bold text-gray-900"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {activeItem.topic}
                        </h3>

                        {graphOption === 1 && (
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ background: "#5d3fd3" }}
                              />
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Avg. Grade
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div
                                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
                                style={{
                                  color: trendMetrics.isUp
                                    ? "#38A169"
                                    : "#E53E3E",
                                  backgroundColor: trendMetrics.isUp
                                    ? "#F0FDF4"
                                    : "#FFF5F5",
                                }}
                              >
                                {trendMetrics.isUp ? (
                                  <TrendingUpIcon size={12} />
                                ) : (
                                  <TrendingDownIcon size={12} />
                                )}
                                <span>{trendMetrics.percentageDiff}%</span>
                              </div>
                              <span className="text-xs text-gray-400 font-medium">
                                {trendMetrics.label}
                              </span>
                            </div>
                          </div>
                        )}

                        {graphOption === 2 && (
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-5 text-[10px] font-black tracking-wider text-gray-400">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                                <span className="uppercase tracking-widest">
                                  ACTUAL TIME
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-4 border-t-2 border-dashed border-slate-300 inline-block"></span>
                                <span className="uppercase tracking-widest">
                                  STUDY GOAL
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                              <div
                                className="text-xs font-bold px-1.5 py-0.5 rounded"
                                style={{
                                  color: goalMetrics.isGoalMet
                                    ? "#38A169"
                                    : "#E53E3E",
                                  backgroundColor: goalMetrics.isGoalMet
                                    ? "#F0FDF4"
                                    : "#FFF5F5",
                                }}
                              >
                                {goalMetrics.percentMet}%
                              </div>
                              <span className="text-xs text-gray-400 font-medium">
                                of goal completed
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-full">{activeItem.item}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 justify-between">
                {items.map((i) => {
                  const isActive = graphOption === i.option;

                  if (i.option === 3) {
                    return (
                      <div
                        key={i.option}
                        onClick={() => setGraphOption(3)}
                        className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between flex-1 ${
                          isActive
                            ? "border-purple-300 ring-2 ring-purple-100"
                            : "border-gray-100 hover:border-purple-200"
                        }`}
                        style={{ boxShadow: PURPLE_SHADOW_THEME }}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                            {i.previewLabel}
                          </p>

                          <div className="flex flex-col gap-4">
                            {advancedSampleTopics
                              .slice(0, 3)
                              .map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className={`w-9 h-9 rounded-full ${
                                      item.bg || "bg-purple-50"
                                    } flex items-center justify-center ${
                                      item.text || "text-purple-600"
                                    } font-black text-xs shadow-sm border border-black/5 flex-shrink-0`}
                                  >
                                    {item.grade}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-gray-800 leading-tight truncate text-left">
                                      {item.title || item.topic}
                                    </h4>
                                    <p className="text-xs text-gray-400 truncate">
                                      {item.desc ||
                                        `Accuracy Check: ${item.numericGrade}%`}
                                    </p>
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
                        isActive
                          ? "border-purple-300 ring-2 ring-purple-100"
                          : "border-gray-100 hover:border-purple-200"
                      }`}
                      style={{ boxShadow: PURPLE_SHADOW_THEME }}
                    >
                      <div className="flex justify-between items-start text-center lg:text-left w-full">
                        <div>
                          <p
                            className="font-bold text-sm text-gray-800"
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {i.previewLabel}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {i.topic}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center justify-between text-xs font-bold transition-colors group-hover:text-purple-700 mt-auto pt-2"
                        style={{ color: "#5d3fd3" }}
                      >
                        <span>
                          {isActive
                            ? "Currently viewing"
                            : "Switch to this view"}
                        </span>
                        <span className="flex items-center group-hover:translate-x-1 transition-transform">
                          <ChevronRightIcon size={16} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="col-span-12 md:col-span-6 bg-white p-6 rounded-3xl border border-gray-100"
                style={{ boxShadow: PURPLE_SHADOW_THEME }}
              >
                <div
                  onClick={() => {
                    navigate("/practice-topics");
                  }}
                  className="flex justify-between items-center mb-6"
                >
                  <h3
                    className="text-2xl font-bold text-gray-900"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Next Milestone
                  </h3>
                  <span className="text-sm font-bold text-purple-600">
                    Get Started
                  </span>
                </div>

                <div
                  className="flex gap-4 p-4 rounded-2xl border-2 border-dashed items-center cursor-pointer group transition-colors hover:border-purple-300"
                  style={{ borderColor: "#e2dfec" }}
                  onClick={() => {
                    navigate("/practice-topics");
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors group-hover:bg-purple-50"
                    style={{ background: "#f1f0f6" }}
                  >
                    <span className="material-symbols-outlined text-purple-600">
                      quiz
                    </span>
                  </div>
                  <div className="flex-1">
                    {nextMilestone && nextMilestone.isCompletedAll ? (
                      <>
                        <h4
                          className="font-bold text-gray-800"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          You're done everything congratulations!
                        </h4>
                        <p className="text-sm text-gray-400">
                          All milestones checked 🎉
                        </p>
                      </>
                    ) : (
                      <>
                        <h4
                          className="font-bold text-gray-800"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {nextMilestone
                            ? nextMilestone.title
                            : "Loading Next Objective..."}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {nextMilestone.type}
                        </p>
                      </>
                    )}
                  </div>

                  <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </div>
              </div>

              <div
                className="col-span-12 md:col-span-6 rounded-3xl p-6 flex items-center gap-6"
                style={{
                  background: "#1C0062",
                  boxShadow: PURPLE_SHADOW_THEME,
                }}
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
                  <p className="text-purple-200 text-sm">
                    You're in the top 15% of students this week.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    {
                      value: trendMetrics.activeDaysCount,
                      label: "Days Active",
                    },
                    {
                      value: `${trendMetrics.currentAvg.toFixed(0)}%`,
                      label: "Avg Grade",
                    },
                    {
                      value: `${goalMetrics.actualHours.toFixed(1)}h`,
                      label: "Time Logged",
                    },
                    {
                      value: trendMetrics.topicsCount,
                      label: "Topics Done",
                    },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="rounded-2xl p-3"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <p className="text-white text-xl font-bold">{value}</p>
                      <p className="text-purple-300 text-[10px] uppercase tracking-wider font-semibold">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </LoggedInLayout>
    </div>
  );
};

export default TrackImprovement;
