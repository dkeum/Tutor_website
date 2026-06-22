import React, { useState, useEffect } from "react";
import { Check, Zap, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import Sidebar from "../components/Sidebar";
import { supabase } from "../db/supabaseclient"; // adjust path as needed
import { setProfileInfo } from "../features/auth/personDetails";
import LoggedInLayout from "../components/LoggedInLayout";

const BASE =
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

const FinalExamPrep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classId = useSelector((state) => state.personDetail.class_ID); // adjust selector to match your store

  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [actualQuestionCount, setActualQuestionCount] = useState(null);

  // ── 1. Session init (copied from your pattern) ──────────────────────────────
  useEffect(() => {
    const initializeUserSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const res = await axios.get(
            `${BASE}/${session.user.email}/getprofile`,
            { withCredentials: true }
          );
          dispatch(setProfileInfo(res?.data));
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error initializing session:", err);
      }
    };
    initializeUserSession();
  }, [dispatch, navigate]);

  // ── 2. Fetch topics once classId is available ────────────────────────────────
  useEffect(() => {
    if (!classId) return;

    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const { data } = await axios.get(`${BASE}/final-exam/topics`, {
          params: { classId },
          withCredentials: true,
        });

        // console.log(data);

        // Map DB rows → local shape; mastery starts at 0 until you wire up progress
        setTopics(
          data.map((t) => ({
            id: t.id,
            title: t.name,
            desc: t.description ?? "",
            mastery: t.mastery ?? 0, // ← now real, not hardcoded 0
            attempted: t.attempted ?? false, // ← lets you show a "not yet attempted" state
            selected: false,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [classId]);

  // ── 3. Toggle selection ──────────────────────────────────────────────────────
  const handleToggleTopic = (id) => {
    setTopics((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, selected: !t.selected } : t
      );
      const nowSelected = updated.find((t) => t.id === id)?.selected;
      if (nowSelected) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      return updated;
    });
  };

  // ── 4. Generate exam ─────────────────────────────────────────────────────────
  const handleGenerateTest = async () => {
    const selectedTopicIds = topics.filter((t) => t.selected).map((t) => t.id);
    if (!selectedTopicIds.length) return;

    setGenerating(true);
    try {
      const { data: questions } = await axios.post(
        `${BASE}/final-exam/generate`,
        { selectedTopicIds, questionCount: selectedTopicIds.length * 10 },
        { withCredentials: true }
      );
      setActualQuestionCount(questions.length);
      // console.log("Generated questions:", questions);

      // 1. Success! Now we navigate with the data.
      // Because this is inside the 'try' block, it has access to 'questions'.
      navigate("/final-exam/test", { state: { questions } });
    } catch (err) {
      console.error("Failed to generate exam:", err);
      // 2. If it fails, we stay on this page to show the error.
      // Do not navigate here!
    } finally {
      setGenerating(false);
    }
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const selectedCount = topics.filter((t) => t.selected).length;
  const estQuestions = selectedCount * 10;
  const estTime = selectedCount * 12;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="text-[#101b30] min-h-screen font-sans overflow-x-hidden antialiased">
      <LoggedInLayout>
        <main className="pl-0 lg:pl-64 2xl:pl-0 pt-[64px] min-h-screen relative transition-all duration-300">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8">
              <div className="max-w-2xl">
                <h2
                  className="text-4xl font-bold tracking-tight text-[#101b30] mb-4 text-left"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Final Exam Prep
                </h2>
                <p className="text-[#494456] text-base md:text-lg text-left">
                  Customize your practice test by selecting the topics you want
                  to master. We'll generate a personalized set of problems based
                  on your selection and current mastery levels.
                </p>
              </div>

              {/* Summary card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full lg:w-80 shadow-md shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#494456] font-bold text-xs uppercase tracking-wider">
                    Your Selection
                  </span>
                  <span className="bg-[#4800b2] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                    {selectedCount} Topic{selectedCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#494456]">Est. Questions</span>
                    <span className="font-bold text-[#101b30]">
                      {estQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#494456]">Est. Duration</span>
                    <span className="font-bold text-[#101b30]">
                      {estTime} mins
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleGenerateTest}
                  disabled={selectedCount === 0 || generating}
                  className="w-full bg-[#6200ee] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#4800b2] transition-all active:scale-95 shadow-lg shadow-[#4800b2]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6200ee] cursor-pointer"
                >
                  {generating ? "Generating..." : "Generate Practice Test"}
                  <Zap className="w-5 h-5" fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Topic cards */}
            {loadingTopics ? (
              // Skeleton placeholders matching the card grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-slate-200 animate-pulse bg-white h-48"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => handleToggleTopic(topic.id)}
                    className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden bg-white transform hover:-translate-y-1 hover:shadow-lg ${
                      topic.selected
                        ? "ring-2 ring-[#6200ee] border-transparent shadow-md"
                        : "border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="absolute top-4 right-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          topic.selected
                            ? "bg-[#2ECC71] border-[#2ECC71]"
                            : "border-slate-300"
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 text-white transition-all duration-300 transform ${
                            topic.selected
                              ? "scale-100 opacity-100"
                              : "scale-50 opacity-0"
                          }`}
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-[#101b30] pr-6">
                      {topic.title}
                    </h4>
                    <p className="text-[#494456] text-sm mb-6 h-10 overflow-hidden line-clamp-2">
                      {topic.desc}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#494456] uppercase">
                          Mastery
                        </span>
                        <span className="text-[#4800b2]">
                          {topic.attempted ? `${topic.mastery}%` : "—"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        {topic.attempted ? (
                          <div
                            className={`h-full relative transition-all duration-500 ${
                              topic.mastery >= 75
                                ? "bg-[#2ECC71]"
                                : topic.mastery >= 50
                                ? "bg-[#6200ee]"
                                : "bg-[#ba1a1a]"
                            }`}
                            style={{ width: `${topic.mastery}%` }}
                          />
                        ) : (
                          // Grey bar for topics never attempted
                          <div className="h-full bg-slate-200 w-full rounded-full" />
                        )}
                      </div>
                      {!topic.attempted && (
                        <p className="text-[#494456] text-xs">
                          No attempts yet
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </LoggedInLayout>

      {/* Toast */}
      <div
        className={`fixed bottom-10 right-10 bg-[#2ECC71] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transform transition-transform duration-500 z-50 ${
          showToast ? "translate-y-0" : "translate-y-32"
        }`}
      >
        <CheckCircle2 className="w-6 h-6" />
        <span className="font-bold text-sm">
          Selection Saved! Your custom test is ready to generate.
        </span>
      </div>
    </div>
  );
};

export default FinalExamPrep;
