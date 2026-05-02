import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector, useDispatch } from "react-redux";
import { setName, setQuestions, setProfileInfo } from "../features/auth/personDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginActivity from "../components/userProfile/LoginActivity";
import Profile from "../components/userProfile/Profile";
import UserInfo from "../components/userProfile/UserInfo";
import Topics from "../components/userProfile/Topics";

import bookEngineering from "../assets/book-engineering-svgrepo-com.svg";
import correct_mistakes from "../assets/correct_mistake_logo.png";
import homework_icon from "../assets/book-mark-book-svgrepo-com.svg";
import exam_icon from "../assets/exam-svgrepo-com.svg";
import donate_icon from "../assets/donate-svgrepo-com.svg";

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const sideNavItems = [
  { icon: "dashboard",   label: "Dashboard", active: true  },
  { icon: "menu_book",   label: "Lessons"                  },
  { icon: "calculate",   label: "Practice"                 },
  { icon: "school",      label: "Tutors"                   },
  { icon: "settings",    label: "Settings"                 },
];

// ─── Main component ───────────────────────────────────────────────────────────
const ShowPersonalData = () => {
  const name  = useSelector((state) => state.personDetail.name);
  const email = useSelector((state) => state.personDetail.email);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!name || name.trim() === "") setOpen(true);

    const fetchProfile = async () => {
      try {
        const base = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000"
          : "https://mathamagic-backend.vercel.app";
        const res = await axios.get(`${base}/${email}/getprofile`, { withCredentials: true });
        dispatch(setProfileInfo(res?.data));
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const getQuestionsData = async () => {
      try {
        const base = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000"
          : "https://mathamagic-backend.vercel.app";
        const res = await axios.get(`${base}/questions/get-questions`, { withCredentials: true });
        dispatch(setQuestions(res.data?.mark_section));
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchProfile();
    getQuestionsData();
  }, [name, email]);

  return (
    <div
      className="bg-background text-on-background min-h-screen flex flex-col"
      style={{ fontFamily: "'Lexend', sans-serif" }}
    >
      {/* ── Top Nav ── */}
      <header
        className="sticky top-0 z-50 border-b border-gray-100"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(93,63,211,0.08)",
        }}
      >
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div
            className="text-2xl font-black tracking-tight"
            style={{ color: "#4f46e5", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Mathamagic
          </div>
          <nav
            className="hidden md:flex items-center gap-8 font-medium"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <a className="text-gray-500 hover:text-indigo-500 transition-colors" href="#">Book Tutor</a>
            <a
              className="font-bold border-b-2 pb-1"
              style={{ color: "#4f46e5", borderColor: "#4f46e5" }}
              href="#"
            >
              Profile
            </a>
            <a className="text-gray-500 hover:text-indigo-500 transition-colors" href="#">Free Resources</a>
          </nav>
          <button
            className="px-4 py-2 font-bold transition-transform active:scale-95"
            style={{ color: "#4f46e5" }}
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* ── Sidebar ── */}
        <aside
          className="hidden lg:flex flex-col gap-4 p-4 w-64 border-r sticky top-[73px] self-start"
          style={{
            height: "calc(100vh - 73px)",
            borderColor: "#e5e7eb",
            background: "#fff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
          }}
        >
          {/* User mini-profile */}
          <div className="flex items-center gap-3 p-2 mb-4">
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

          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            {sideNavItems.map(({ icon, label, active }) => (
              <a
                key={label}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "font-bold"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                }`}
                style={active ? { background: "#ede9ff", color: "#4338ca" } : {}}
                href="#"
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            <button
              className="font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm"
              style={{ background: "#fd8b00", color: "#603100" }}
            >
              Upgrade to Pro
            </button>
            <a className="flex items-center gap-3 p-3 text-gray-400 hover:text-indigo-600 transition-all" href="#">
              <span className="material-symbols-outlined">help</span>
              <span>Help Center</span>
            </a>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-6 md:p-10" style={{ background: "#f8f9fa" }}>
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">

            {/* Row 1: Login Activity + Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Login Activity heatmap */}
              <div
                className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100"
                style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.08)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className="text-2xl font-semibold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Login Activity
                  </h3>
                  <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
                    Last 3 Months
                  </span>
                </div>
                {/* Render the actual LoginActivity component inside the styled card */}
                <LoginActivity />
              </div>

              {/* Profile Card */}
              <div
                className="rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
                style={{
                  background: "#451ebb",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(69,30,187,0.25)",
                }}
              >
                <div
                  className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-50"
                  style={{ background: "#5d3fd3" }}
                />
                <div
                  className="w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-black mb-4 relative z-10"
                  style={{ borderColor: "#e6deff", background: "#5d3fd3", color: "#fff" }}
                >
                  {name ? name[0].toUpperCase() : "?"}
                </div>
                <h2
                  className="text-3xl font-bold mb-1 relative z-10"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {name || "Student"}
                </h2>
                <p className="text-lg opacity-90 relative z-10">{email}</p>
                <div
                  className="mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest relative z-10"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  Advanced Level
                </div>
              </div>
            </div>

            {/* Row 2: Progress Rings + Status */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div
                className="lg:col-span-3 bg-white rounded-xl p-6 border border-gray-100"
                style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.08)" }}
              >
                <h3
                  className="text-2xl font-semibold mb-8"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Current Progress
                </h3>
                {/* Renders Profile component (pie/progress charts) */}
                <Profile />
              </div>

              {/* Status card */}
              <div
                className="rounded-xl p-6 flex flex-col items-center justify-center text-center"
                style={{ background: "#006a35", color: "#5aef8f", boxShadow: "0 8px 32px rgba(0,106,53,0.2)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <span className="material-symbols-outlined text-4xl">celebration</span>
                </div>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Well done!
                </h3>
                <p className="text-base opacity-90">All topics for this week are complete!</p>
              </div>
            </div>

            {/* Row 3: Topics */}
            <div
              className="bg-white rounded-xl p-6 border border-gray-100"
              style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.08)" }}
            >
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Your Topics
              </h3>
              <Topics />
            </div>

            {/* Row 4: Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActionCard
                icon="trending_up"
                iconBg="#ede9ff"
                iconColor="#451ebb"
                title="Track Improvement"
                footer="View Grade Trends →"
                footerHoverColor="#451ebb"
                path="/user/track-improvement"
                navigate={navigate}
              >
                <div className="flex items-end justify-around h-24 px-4 bg-gray-50 rounded-lg py-2">
                  {["33%","50%","66%","100%"].map((h, i) => (
                    <div
                      key={i}
                      className="w-4 rounded-t"
                      style={{ height: h, background: `rgba(69,30,187,${0.2 + i * 0.2})` }}
                    />
                  ))}
                </div>
              </ActionCard>

              <ActionCard
                icon="rule"
                iconBg="#ffdad6"
                iconColor="#ba1a1a"
                title="Correct Mistakes"
                footer="12 items pending"
                footerHoverColor="#ba1a1a"
                path="/user/mistakes"
                navigate={navigate}
              >
                <div className="flex flex-col gap-2">
                  {["100%","75%","50%"].map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm" style={{ color: "#ba1a1a" }}>
                        check_box_outline_blank
                      </span>
                      <div className="h-2 bg-gray-100 rounded-full" style={{ width: w }} />
                    </div>
                  ))}
                </div>
              </ActionCard>

              <ActionCard
                icon="auto_stories"
                iconBg="#ffdcc3"
                iconColor="#904d00"
                title="Homework Help"
                footer="Ask a question"
                footerHoverColor="#904d00"
                path="/homework-help"
                navigate={navigate}
              >
                <div className="flex justify-center py-2">
                  <img src={homework_icon} alt="Homework" className="max-h-20 mx-auto" />
                </div>
              </ActionCard>

              <ActionCard
                icon="edit_note"
                iconBg="#6bfe9c33"
                iconColor="#004f26"
                title="Final Exam Prep"
                footer="3 weeks remaining"
                footerHoverColor="#004f26"
                path="/final-exam-prep"
                navigate={navigate}
              >
                <div className="flex justify-center py-2">
                  <img src={exam_icon} alt="Exam" className="max-h-20 mx-auto" />
                </div>
              </ActionCard>
            </div>

            {/* Row 5: Utility row */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
              <UtilityButton icon="settings" label="Settings" onClick={() => navigate("/user/setting")} />
              <UtilityButton icon="volunteer_activism" label="Donate" onClick={() => navigate("/donate")} />
              <div
                className="col-span-2 lg:col-span-4 rounded-xl p-4 flex items-center justify-between"
                style={{ background: "rgba(230,222,255,0.35)" }}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined" style={{ color: "#451ebb" }}>info</span>
                  <span className="text-xs font-medium" style={{ color: "#4723be" }}>
                    New feature: Live tutoring chat is now available!
                  </span>
                </div>
                <button className="text-xs font-bold underline" style={{ color: "#451ebb" }}>
                  Try now
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div
          className="flex flex-col md:flex-row justify-between items-center py-8 px-6 w-full max-w-7xl mx-auto gap-4 text-xs"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <div className="font-bold" style={{ color: "#4f46e5" }}>Mathamagic Tutoring</div>
          <div className="flex gap-6">
            {["Privacy Policy","Terms of Service","Contact Support"].map((l) => (
              <a key={l} className="text-gray-500 hover:text-indigo-500 transition-colors" href="#">{l}</a>
            ))}
          </div>
          <div className="text-gray-400">© 2024 Mathamagic Tutoring</div>
        </div>
      </footer>

      {/* ── Name Dialog ── */}
      <DialogBox open={open} setOpen={setOpen} />
    </div>
  );
};

export default ShowPersonalData;

// ─── Action Card ─────────────────────────────────────────────────────────────
const ActionCard = ({ icon, iconBg, iconColor, title, footer, footerHoverColor, path, navigate, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="bg-white rounded-xl p-6 border border-gray-100 cursor-pointer transition-shadow"
      style={{ boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => path && navigate(path)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg" style={{ background: iconBg }}>
          <span className="material-symbols-outlined" style={{ color: iconColor }}>{icon}</span>
        </div>
        <h4 className="font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </h4>
      </div>
      {children}
      <p
        className="text-xs mt-3 transition-colors"
        style={{ color: hovered ? footerHoverColor : "#797586" }}
      >
        {footer}
      </p>
    </div>
  );
};

// ─── Utility Button ───────────────────────────────────────────────────────────
const UtilityButton = ({ icon, label, onClick }) => (
  <button
    className="lg:col-span-1 bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors"
    onClick={onClick}
  >
    <span className="material-symbols-outlined text-gray-400">{icon}</span>
    <span className="text-xs font-bold text-gray-500">{label}</span>
  </button>
);

// ─── Name Dialog ──────────────────────────────────────────────────────────────
const DialogBox = ({ open, setOpen }) => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    dispatch(setName(username.trim()));
    try {
      const base = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000"
        : "https://mathamagic-backend.vercel.app";
      const res = await axios.put(`${base}/user/setname`, { name: username.trim() }, { withCredentials: true });
      if (res.status === 200) setOpen(false);
    } catch (err) {
      console.error("Error setting name:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
            <DialogDescription>Enter your name to continue.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username-1">Name</Label>
              <Input
                id="username-1"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};