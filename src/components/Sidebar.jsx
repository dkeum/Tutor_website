import React, { useState, useEffect } from 'react'; // 💡 FIXED: Added useEffect to your imports
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard, BookOpenCheck, SquarePen,
  GraduationCap, Settings, ChevronRight, ChevronDown,
  HelpCircle, TrendingUp, AlertTriangle, BookOpen,
  FileText, CheckCircle2,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const sideNavItems = [
  { path: "/showpersonaldata", icon: <LayoutDashboard size={20} />, label: "Dashboard", hasSubMenu: true },
  { path: "/lessons", icon: <BookOpenCheck size={20} />, label: "Lessons" },
  { path: "/practice-topics", icon: <SquarePen size={20} />, label: "Practice" },
  { path: "/tutors", icon: <GraduationCap size={20} />, label: "Tutors" },
  { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
];

const dashboardSubItems = [
  { path: "/track-improvement", icon: <TrendingUp size={16} />, label: "Track Improvement" },
  { path: "/correct-mistakes", icon: <AlertTriangle size={16} />, label: "Correct Mistakes" },
  { path: "/homework-help", icon: <BookOpen size={16} />, label: "Homework Help" },
  { path: "/final-exam-prep", icon: <FileText size={16} />, label: "Final Exam Prep" },
];

const PLAN_LABELS = {
  free: "Free",
  pro: "Pro",
};

const PLAN_CREDIT_TOTALS = {
  free: 50,
  pro: 500, // adjust to whatever your actual Pro-tier monthly credit allotment is
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);

  // Pull everything from Redux
  const studentName = useSelector(s => s.personDetail?.name) || "";
  const plan_type = useSelector(s => s.personDetail?.plan_type) ?? "free";
  const ai_credits = useSelector(s => s.personDetail?.ai_credits) ?? 0;
  const is_on_trial = useSelector(s => s.personDetail?.is_on_trial) ?? false;
  const days_remaining = useSelector(s => s.personDetail?.days_remaining) ?? 0;
  const subscription_status = useSelector(s => s.personDetail?.subscription_status) ?? "inactive";
  const className = useSelector(s => s.personDetail?.class)
  const profile_picture = useSelector((state) => state.personDetail.profile_pic);
  const userInitials = studentName ? studentName[0].toUpperCase() : "?";

  const planLabel = PLAN_LABELS[plan_type] ?? "Free";
  const creditTotal = PLAN_CREDIT_TOTALS[plan_type] ?? 50;
  const creditPct = Math.min(100, Math.round((ai_credits / creditTotal) * 100));
  const isMaxPlan = plan_type === "pro";

  const isPathActive = (path) => location.pathname === path;
  const isDashboardActive =
  location.pathname === "/showpersonaldata" ||
  dashboardSubItems.some(sub => location.pathname === sub.path);


  const toggleSubMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDashboardOpen(prev => !prev);
  };

  const handleRowNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside
      className="hidden lg:flex flex-col gap-4 p-4 pt-[64px] w-64 border-r fixed top-0 left-0 text-left"
      style={{
        height: "100vh",
        borderColor: "#e5e7eb",
        background: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "14px",
        zIndex: 40,
      }}
    >
      {/* User profile card */}
      <div className="flex items-center gap-3 p-2 mb-2 mt-2">
        {/* <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "#5d3fd3" }}
        >
          {studentName ? studentName[0].toUpperCase() : "?"}
        </div> */}
        <Avatar 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ borderColor: "#e6deff" }}
      >
        <AvatarImage
          src={profile_picture}
          alt={studentName || "Student profile"}
          className="object-cover w-full h-full"
        />
        {/* Dynamic structural substitution fallback handler inheriting old design typography markup */}
        <AvatarFallback 
          className="w-full h-full flex items-center justify-center text-lg font-black rounded-full"
          style={{ background: "#5d3fd3", color: "#fff" }}
        >
          {userInitials}
        </AvatarFallback>
      </Avatar>
        <div>
          <div className="font-bold text-gray-800">{studentName || "Student"}</div>
          <div className="text-xs text-gray-400">{className}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 select-none overflow-y-auto max-h-[calc(100vh-380px)] pr-1">
        {sideNavItems.map((item) => {
          const isActive = item.hasSubMenu ? isDashboardActive : isPathActive(item.path);
          return (
            <div key={item.label} className="flex flex-col w-full">
              <div
                onClick={() => handleRowNavigation(item.path)}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? "font-bold" : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                style={isActive ? { background: "#ede9ff", color: "#4338ca" } : {}}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.hasSubMenu && (
                  <button
                    type="button"
                    onClick={toggleSubMenu}
                    className="p-1 rounded-md hover:bg-black/5 transition-colors text-gray-400 hover:text-indigo-600 flex items-center justify-center relative z-10"
                  >
                    {isDashboardOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
              </div>

              {item.hasSubMenu && isDashboardOpen && (
                <div className="flex flex-col gap-0.5 pl-9 pr-1 mt-1 border-l-2 border-slate-100 ml-5">
                  {dashboardSubItems.map((subItem) => {
                    const isSubActive = isPathActive(subItem.path);
                    return (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${isSubActive
                          ? "text-indigo-600 bg-indigo-50 font-bold"
                          : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <span className="opacity-80">{subItem.icon}</span>
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Account Details */}
      <section className="px-3 py-4 border-t border-gray-100 bg-gray-50/50 rounded-xl flex flex-col gap-3 mt-auto">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
            Current Plan
          </span>
          <p className="text-sm font-bold text-gray-700">{planLabel}</p>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold mb-1">
            <span className="text-gray-400 uppercase tracking-wider">AI Credits</span>
            <span className="text-gray-600">{ai_credits} / {creditTotal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${creditPct}%`,
                background: creditPct >= 90 ? "#ef4444" : "#5d3fd3",
              }}
            />
          </div>
        </div>

        {is_on_trial && days_remaining > 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg p-2">
            <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
            <span className="text-[11px] font-medium text-green-700">
              {days_remaining} day{days_remaining !== 1 ? "s" : ""} free trial remaining
            </span>
          </div>
        )}

        {!is_on_trial && subscription_status === "canceled" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-2">
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
            <span className="text-[11px] font-medium text-red-600">
              Subscription ended
            </span>
          </div>
        )}
      </section>

      {/* Bottom actions */}
      <div className="flex flex-col gap-2">
        {!isMaxPlan && (
          <Link to="/pricing" className="w-full">
            <button
              className="font-bold py-3 w-full rounded-xl shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
              style={{ background: "#fd8b00", color: "#fff" }}
            >
              Upgrade to Pro
            </button>
          </Link>
        )}
        <Link
          to="/help"
          className="flex items-center gap-3 p-3 text-gray-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-gray-50 text-sm font-medium"
        >
          <HelpCircle size={20} />
          <span>Help Center</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;