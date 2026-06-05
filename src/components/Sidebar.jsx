import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpenCheck, 
  SquarePen, 
  GraduationCap, 
  Settings, 
  ChevronRight,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  FileText
} from 'lucide-react';

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

const Sidebar = ({ name = "Daniel" }) => {
  const location = useLocation();
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);

  const isPathActive = (path) => location.pathname === path;
  
  const isDashboardActive = location.pathname === "/showpersonaldata" || 
    dashboardSubItems.some(sub => location.pathname === sub.path);

  const toggleSubMenu = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsDashboardOpen(!isDashboardOpen);
  };

  return (
    <aside
      /* FIX: Changed top-[73px] to top-0, and height calculation to 100vh.
         We use pt-[56px] (or whatever matches your clean navbar padding boundary) 
         so the border-r cleanly connects flush all the way to the top behind the header banner!
      */
      className="hidden lg:flex flex-col gap-4 p-4 pt-[64px] w-64 border-r fixed top-0 left-0 self-start"
      style={{
        height: "100vh",
        borderColor: "#e5e7eb",
        background: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "14px",
        zIndex: 40, /* Sits safely underneath the Navbar's z-50 layer */
      }}
    >
      {/* User profile card section */}
      <div className="flex items-center gap-3 p-2 mb-2 mt-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "#5d3fd3" }}
        >
          {name ? name[0].toUpperCase() : "?"}
        </div>
        <div>
          <div className="font-bold text-gray-800">{name || "Student"}</div>
          <div className="text-xs text-gray-400">Student</div>
        </div>
      </div>

      {/* Primary Navigation Shell */}
      <nav className="flex flex-col gap-1 select-none">
        {sideNavItems.map((item) => {
          const isActive = item.hasSubMenu ? isDashboardActive : isPathActive(item.path);

          return (
            <div key={item.label} className="flex flex-col w-full">
              <Link
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  isActive ? "font-bold" : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                }`}
                style={isActive ? { background: "#ede9ff", color: "#4338ca" } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.hasSubMenu && (
                  <button 
                    onClick={toggleSubMenu}
                    className="p-1 rounded-md hover:bg-black/5 transition-colors flex items-center justify-center text-gray-400 hover:text-indigo-600"
                  >
                    {isDashboardOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
              </Link>

              {item.hasSubMenu && isDashboardOpen && (
                <div className="flex flex-col gap-0.5 pl-9 pr-1 mt-1 border-l-2 border-slate-100 ml-5">
                  {dashboardSubItems.map((subItem) => {
                    const isSubActive = isPathActive(subItem.path);
                    return (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isSubActive 
                            ? "text-indigo-600 bg-indigo-50 font-bold" 
                            : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex items-center justify-center opacity-80">{subItem.icon}</span>
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

      {/* Persistent Bottom Utility Bracket elements */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          className="font-bold py-3 rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all text-sm cursor-pointer"
          style={{ background: "#fd8b00", color: "#603100" }}
        >
          Upgrade to Pro
        </button>
        <Link 
          className="flex items-center gap-3 p-3 text-gray-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-gray-50 text-sm font-medium" 
          to="/help"
        >
          <HelpCircle size={20} />
          <span>Help Center</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;