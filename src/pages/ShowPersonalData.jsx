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
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginActivity from "../components/userProfile/LoginActivity";
import Profile from "../components/userProfile/Profile";
import UserInfo from "../components/userProfile/UserInfo";
import Topics from "../components/userProfile/Topics";

import homework_icon from "../assets/book-mark-book-svgrepo-com.svg";
import exam_icon from "../assets/exam-svgrepo-com.svg";
import { BookAlert, BookOpenText, ChartNoAxesColumnIncreasingIcon, LibraryBig, SquareDashed, X } from 'lucide-react';

import Footer from "../components/Footer";


import { supabase } from "../db/supabaseclient";
import LoggedInLayout from "../components/LoggedInLayout";

// ─── Main Component ───────────────────────────────────────────────────────────
const ShowPersonalData = () => {
  const name = useSelector((state) => state.personDetail.name);
  const wrong_count = useSelector((state) => state.personDetail.wrong_count);

  const [open, setOpen] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();



  useEffect(() => {
    const initializeUserSession = async () => {
      try {
        const base = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000"
          : "https://mathamagic-backend.vercel.app";




        // 1. Check Supabase for an existing local session
        const { data: { session } } = await supabase.auth.getSession();

        // console.log("Supabase session:", session);
        if (session?.user) {
          const userEmail = session.user.email;

          // 2. Fetch complete profile from backend
          const res = await axios.get(`${base}/${userEmail}/getprofile`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`, // Inject the fresh token
            },
            withCredentials: true
          });
          // console.log("Profile data fetched:", res.data);

          // 3. Hydrate Redux store
          dispatch(setProfileInfo(res?.data));

          console.log(res.data)

          if (!res.data?.name) {
            setOpen(true);
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error initializing session:", err);
      } finally {
        setLoadingSession(false);
      }
    };

    initializeUserSession();
  }, [dispatch, navigate]); // Removed 'name' from dependencies to prevent infinite loop/re-runs

  // 4. Guard layout until session validation finishes
  if (loadingSession) {
    return (
      <LoggedInLayout>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
        </div>
      </LoggedInLayout>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex flex-col"
    >
      <LoggedInLayout>
        {/* ── Main Content Container ── */}
        <div className="flex-1 min-w-0 overflow-x-hidden flex justify-center">
          <main className="w-full max-w-7xl p-6 md:p-10 flex flex-col gap-8">

            {/* Row 1: Login Activity (2/3) + User Info Card (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
              {/* Login Activity heatmap */}
              <div
                className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 min-w-0 overflow-hidden h-full flex flex-col justify-between"
                style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.08)" }}
              >
                <div>
                  <div className="flex justify-between items-center mb-4 select-none text-left">
                    <h3
                      className="text-2xl font-semibold text-gray-800"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Login Activity
                    </h3>
                    <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
                      Last 6 Months
                    </span>
                  </div>

                  <div className="w-full min-w-0 overflow-hidden flex justify-center items-center py-4">
                    <LoginActivity />
                  </div>
                </div>
              </div>

              {/* User Profile Info Panel */}
              <div className="w-full h-full min-w-0">
                <UserInfo />
              </div>
            </div>

            {/* Row 2: Topics (2/3) + Current Progress (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
              {/* Topics — 2/3 */}
              <div
                className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 min-w-0 text-left h-full"
                style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.08)" }}
              >
                <Topics />
              </div>

              {/* Current Progress — 1/3 */}
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 min-w-0 text-left h-full flex flex-col"
                style={{ boxShadow: "0 4px 20px rgba(93,63,211,0.08)" }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Current Progress
                </h3>
                <div className="flex-1 flex items-center justify-center">
                  <Profile />
                </div>
              </div>
            </div>

            {/* Row 3: Action cards */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
                <ActionCard
                  icon={<ChartNoAxesColumnIncreasingIcon size={20} />}
                  iconBg="#ede9ff"
                  iconColor="#451ebb"
                  title="Track Improvement"
                  footer="View Grade Trends →"
                  footerHoverColor="#451ebb"
                  path="/track-improvement"
                  navigate={navigate}
                >
                  <div className="flex items-end justify-around h-24 px-4 bg-gray-50 rounded-lg py-2 mt-2">
                    {["33%", "50%", "66%", "100%"].map((h, i) => (
                      <div
                        key={i}
                        className="w-4 rounded-t"
                        style={{ height: h, background: `rgba(69,30,187,${0.2 + i * 0.2})` }}
                      />
                    ))}
                  </div>
                </ActionCard>

                <ActionCard
                  icon={<BookAlert size={20} />}
                  iconBg="#ffdad6"
                  iconColor="#ba1a1a"
                  title="Correct Mistakes"
                  footer={wrong_count === 0
                    ? "All caught up! 🎉"
                    : `${wrong_count} mistake${wrong_count !== 1 ? "s" : ""} to review`
                  }
                  footerHoverColor="#ba1a1a"
                  path="/correct-mistakes"
                  navigate={navigate}
                >
                  <div className="flex flex-col gap-2 w-full h-24 justify-center mt-2">
                    {["100%", "75%", "50%"].map((w, i) => (
                      <div key={i} className="flex items-center gap-2 w-full ">
                        <span className="relative inline-flex items-center justify-center flex-shrink-0">
                          <SquareDashed style={{ color: "#ba1a1a" }} size={20} />
                          <X size={10} className="absolute" style={{ color: "#ba1a1a" }} />
                        </span>
                        <div className="h-2 bg-gray-100 rounded-full flex-1" style={{ maxWidth: w }} />
                      </div>
                    ))}
                  </div>
                </ActionCard>

                <ActionCard
                  icon={<BookOpenText size={20} />}
                  iconBg="#ffdcc3"
                  iconColor="#904d00"
                  title="Homework Help"
                  footer="Ask a question"
                  footerHoverColor="#904d00"
                  path="/homework-help"
                  navigate={navigate}
                >
                  <div className="flex justify-center py-2 h-24 items-center mt-2">
                    <img src={homework_icon} alt="Homework" className="max-h-20 object-contain mx-auto" />
                  </div>
                </ActionCard>

                <ActionCard
                  icon={<LibraryBig size={20} />}
                  iconBg="#6bfe9c33"
                  iconColor="#004f26"
                  title="Final Exam Prep"
                  footer="Test your Knowledge"
                  footerHoverColor="#004f26"
                  path="/final-exam-prep"
                  navigate={navigate}
                >
                  <div className="flex justify-center py-2 h-24 items-center mt-2">
                    <img src={exam_icon} alt="Exam" className="max-h-20 object-contain mx-auto" />
                  </div>
                </ActionCard>
              </div>
            </section>
          </main>
        </div>

      </LoggedInLayout>

      <DialogBox open={open} setOpen={setOpen} />
    </div>
  );
};

// ─── Action Card Subcomponent ────────────────────────────────────────────────
const ActionCard = ({ icon, iconBg, iconColor, title, footer, footerHoverColor, path, navigate, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="bg-white rounded-xl p-6 border border-gray-100 cursor-pointer transition-shadow flex flex-col justify-between min-w-0 w-full"
      style={{ boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => path && navigate(path)}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-4 min-w-0">
          <div className="p-2 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: iconBg }}>
            <span className="flex items-center justify-center" style={{ color: iconColor }}>{icon}</span>
          </div>
          <h4 className="font-bold text-gray-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {title}
          </h4>
        </div>
        {children}
      </div>
      <p
        className="text-xs mt-3 transition-colors truncate"
        style={{ color: hovered ? footerHoverColor : "#797586" }}
      >
        {footer}
      </p>
    </div>
  );
};

// ─── Name Dialog Subcomponent ────────────────────────────────────────────────
const DialogBox = ({ open, setOpen }) => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("No active session — cannot update name.");
        return;
      }

      const base = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000"
        : "https://mathamagic-backend.vercel.app";


      // console.log("sending the name: ", username.trim())
      // console.log(`${base}/user/setname`)
      const res = await axios.put(
        `${base}/user/setname`,
        { name: username.trim() },
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
          withCredentials: true,
        }
      );

      console.log("res data", res)

      if (res.status === 200) {
        dispatch(setName(username.trim())); // dispatch only after confirmed success
        setOpen(false);
      }
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

export default ShowPersonalData;