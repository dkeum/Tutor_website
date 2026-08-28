import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  BadgeCheck,
  User,
  CreditCard,
  Lock,
  Bell,
  Users,
  Loader2,
  Pause,
  Play,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import LoggedInLayout from "../LoggedInLayout";
import { supabase } from "../../db/supabaseclient";

const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

// Plan labels (No Free Plan)
const PLAN_LABELS = {
  self_study: "Self Study",
  student_pro: "Student Pro",
};

// AI Models available by plan
const AI_MODEL_BY_PLAN = {
  self_study: "Gemini 2.5 Pro",
  student_pro: "Gemini 3.5 Flash",
};

const Settings = () => {
  const currentName = useSelector((state) => state.personDetail.name);
  const currentEmail = useSelector((state) => state.personDetail.email);
  const currentProfile = useSelector((state) => state.personDetail.profile_pic);
  const userId = useSelector((state) => state.personDetail.id);
  const plan_type = useSelector((s) => s.personDetail?.plan_type) ?? "self_study";
  const is_on_trial = useSelector((s) => s.personDetail?.is_on_trial) ?? false;

  // Pro status & AI model resolution
  const isProStudent = plan_type === "student_pro";
  const currentModel = AI_MODEL_BY_PLAN[plan_type] || AI_MODEL_BY_PLAN.self_study;

  // ── Profile ────────────────────────────────────────────────────────────────
  const [name, setName] = useState(currentName || "");
  const [profilePicture, setProfilePicture] = useState(currentProfile);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // ── Subscription & Credits ────────────────────────────────────────────────
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionActionLoading, setSubscriptionActionLoading] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(plan_type || "self_study");
  const [creditsLoading, setCreditsLoading] = useState(true);

  // Usage Today data
  const [usage, setUsage] = useState(null);

  // ── Notification preferences ──────────────────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState({
    homeworkReminders: true,
    weeklyProgressEmail: true,
    streakNudges: false,
  });
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  // ── Parent / guardian linking ─────────────────────────────────────────────
  const [parentEmail, setParentEmail] = useState("");
  const [linkedGuardians, setLinkedGuardians] = useState([]);
  const [guardiansLoading, setGuardiansLoading] = useState(true);
  const [linkingGuardian, setLinkingGuardian] = useState(false);
  const [linkMessage, setLinkMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic Tier Calculation
  const activePlan = subscription?.plan || plan_type;
  const isCurrentPro = activePlan === "student_pro";
  const targetPlan = isCurrentPro ? "self_study" : "student_pro";

  // ── Helper: fetch fresh subscription status ────
  const fetchSubscriptionStatus = async () => {
    try {
      setSubscriptionLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data } = await axios.get(`${BASE_URL}/payment/subscription-status`, {
          params: { userId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        setSubscription(data);
        if (data?.plan) {
          setSelectedPlan(data.plan);
        } else {
          setSelectedPlan("self_study");
        }
      }
    } catch (err) {
      console.error("Failed to fetch subscription status:", err);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // ── Fetch data on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data } = await axios.get(`${BASE_URL}/setting-info`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          // 1. Hydrate Guardian Data
          const guardians = data.guardian_notifications || [];
          setLinkedGuardians(guardians);
          setGuardiansLoading(false);

          // 2. Hydrate Notification Preferences
          if (guardians.length > 0) {
            setNotifPrefs((prev) => ({
              ...prev,
              weeklyProgressEmail: guardians[0].weekly_report_opt_in,
            }));
          }
          setNotifLoading(false);

          // 3. Hydrate Usage Today
          const aiUsageArray = data.ai_usage || [];
          const creditsUsedToday = aiUsageArray.reduce(
            (total, record) => total + (record.credits || 0),
            0
          );

          const breakdown = {
            homeworkHelp: aiUsageArray.find((u) => u.category === "ai_chat")?.credits || 0,
            aiVideo: aiUsageArray.find((u) => u.category === "ai_video")?.credits || 0,
            extraTools: aiUsageArray.find((u) => u.category === "extra_tools")?.credits || 0,
          };

          setUsage({
            creditsUsedToday,
            creditsRemaining: data.credits || 0,
            breakdown,
          });
          setCreditsLoading(false);
        }

        // 4. Hydrate Subscription Data
        await fetchSubscriptionStatus();
      } catch (err) {
        console.error(err);
        setError("Failed to load settings. Please try again.");
        setSubscriptionLoading(false);
        setGuardiansLoading(false);
        setNotifLoading(false);
        setCreditsLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleToggleNotif = async (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    setNotifSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await axios.put(`${BASE_URL}/student/notification-preferences`, updated, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }
    } catch (err) {
      console.error("Failed to save notification preferences:", err);
      setNotifPrefs(notifPrefs);
    } finally {
      setNotifSaving(false);
    }
  };

  const handleLinkGuardian = async () => {
    if (!parentEmail.trim()) return;
    setLinkingGuardian(true);
    setLinkMessage(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const res = await axios.post(
          `${BASE_URL}/student/guardians`,
          { parentEmail },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        setLinkedGuardians((prev) => [
          ...prev,
          res.data?.guardian || { id: Date.now(), guardian_email: parentEmail, status: "pending" },
        ]);
        setParentEmail("");
        setLinkMessage({ type: "success", text: "Invite sent." });
      }
    } catch (err) {
      console.error("Failed to link guardian:", err);
      setLinkMessage({ type: "error", text: "Couldn't send invite. Try again." });
    } finally {
      setLinkingGuardian(false);
      setTimeout(() => setLinkMessage(null), 3000);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-input").click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setAvatarUploading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data } = await axios.post(`${BASE_URL}/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfilePicture(data.profile_picture);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handlePauseSubscription = async () => {
    setSubscriptionActionLoading(true);
    setSubscriptionMessage(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await axios.post(
          `${BASE_URL}/payment/pause-subscription`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        setSubscriptionMessage({ type: "success", text: "Subscription paused." });
        await fetchSubscriptionStatus();
      }
    } catch (err) {
      console.error("Failed to pause subscription:", err);
      setSubscriptionMessage({ type: "error", text: "Couldn't pause subscription." });
    } finally {
      setSubscriptionActionLoading(false);
      setTimeout(() => setSubscriptionMessage(null), 4000);
    }
  };

  const handleResumeSubscription = async () => {
    setSubscriptionActionLoading(true);
    setSubscriptionMessage(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await axios.post(
          `${BASE_URL}/payment/resume-subscription`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        setSubscriptionMessage({ type: "success", text: "Subscription resumed." });
        await fetchSubscriptionStatus();
      }
    } catch (err) {
      console.error("Failed to resume subscription:", err);
      setSubscriptionMessage({ type: "error", text: "Couldn't resume subscription." });
    } finally {
      setSubscriptionActionLoading(false);
      setTimeout(() => setSubscriptionMessage(null), 4000);
    }
  };

  // DYNAMIC Upgrade / Downgrade Plan Handler
  const handleToggleSubscriptionTier = async () => {
    setSubscriptionActionLoading(true);
    setSubscriptionMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // No subscription yet — go through checkout instead of change-plan
      if (!subscription?.active && subscription?.status !== "no_subscription" ? false : !subscription || subscription?.status === "no_subscription") {
        const res = await axios.post(
          `${BASE_URL}/payment/create-checkout-session`,
          { email: session.user.email, plan: targetPlan },
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        if (res.data?.url) {
          window.location.href = res.data.url;
        }
        return;
      }

      // Existing subscription — change tier in place
      const res = await axios.post(
        `${BASE_URL}/payment/change-plan`,
        { userId, newPlan: targetPlan },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      setSubscriptionMessage({
        type: "success",
        text: res.data?.message || `Plan updated to ${PLAN_LABELS[targetPlan]}.`,
      });
      await fetchSubscriptionStatus();
    } catch (err) {
      console.error("Failed to change plan:", err);
      setSubscriptionMessage({ type: "error", text: "Couldn't change plan. Try again." });
    } finally {
      setSubscriptionActionLoading(false);
      setTimeout(() => setSubscriptionMessage(null), 4000);
    }
  };

  // DELETE Subscription Handler
  const handleDeleteSubscription = async () => {
    setSubscriptionActionLoading(true);
    setSubscriptionMessage(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const res = await axios.post(
          `${BASE_URL}/payment/cancel-subscription`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        setSubscriptionMessage({
          type: "success",
          text: res.data?.message || "Subscription set to cancel at period end.",
        });
        await fetchSubscriptionStatus();
      }
    } catch (err) {
      console.error("Failed to delete subscription:", err);
      setSubscriptionMessage({ type: "error", text: "Couldn't delete subscription." });
    } finally {
      setSubscriptionActionLoading(false);
      setTimeout(() => setSubscriptionMessage(null), 4000);
    }
  };

  // ── Derived display values ────────────────────────────────────────────────
  const planLabel = PLAN_LABELS[activePlan] || activePlan;
  const isActive = subscription?.active;
  const isPaused = subscription?.paused;
  const isCanceling = subscription?.cancel_at_period_end;
  const nextPaymentDate = subscription?.next_payment_date
    ? new Date(subscription.next_payment_date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : null;

  return (
    <div className="min-h-screen w-full text-[#1C1B1F] flex font-sans">
      <LoggedInLayout>
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="p-12 max-w-[1100px] w-full mx-auto flex flex-col gap-8 flex-1">
            <div>
              <h2 className="text-3xl font-extrabold text-black tracking-tight">
                Settings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Personalize your learning experience and manage your plan.
              </p>
            </div>

            {/* ── Subscription Section ── */}
            <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-purple-200/60 relative overflow-hidden">
              {subscriptionLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading your plan…
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Top Info Area */}
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#6200EE] rounded-full flex items-center justify-center text-white shadow-md shadow-purple-200">
                        <BadgeCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900">
                            {planLabel}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${isPaused
                              ? "bg-[#FFF4E5] text-[#8A5A00]"
                              : isActive
                                ? "bg-[#E6F4EA] text-[#137333]"
                                : "bg-[#FDECEA] text-[#A61C1C]"
                              }`}
                          >
                            {isPaused ? "paused" : subscription?.status || "active"}
                          </span>
                          {isCanceling && !isPaused && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-[#FDECEA] text-[#A61C1C]">
                              canceling
                            </span>
                          )}
                        </div>

                        {/* Subscription Status Context */}
                        {nextPaymentDate && !isCanceling && (
                          <p className="text-sm text-gray-500 mt-1">
                            Next payment on{" "}
                            <span className="font-semibold text-gray-700">
                              {nextPaymentDate}
                            </span>
                          </p>
                        )}
                        {isCanceling && (
                          <p className="text-sm text-gray-500 mt-1">
                            Access ends{" "}
                            <span className="font-semibold text-gray-700">
                              {new Date(subscription.current_period_end).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                        {isPaused && (
                          <p className="text-sm text-gray-500 mt-1">
                            Billing is paused — no charges until resumed.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Dynamic Plan Actions ── */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-4 border-t border-gray-100 flex-wrap">
                    {/* Dynamic Upgrade/Downgrade Button */}
                    <button
                      onClick={handleToggleSubscriptionTier}
                      disabled={subscriptionActionLoading || isPaused || is_on_trial}
                      className={`font-bold text-xs px-6 py-3 rounded-full transition-all shadow-sm disabled:opacity-40 whitespace-nowrap flex items-center justify-center gap-2 ${isCurrentPro
                        ? "bg-[#F3F3FA] text-gray-800 hover:bg-gray-200"
                        : "bg-[#6200EE] text-white hover:bg-[#5000c9]"
                        }`}
                    >
                      {subscriptionActionLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isCurrentPro ? (
                        <>
                          <ArrowDownRight className="w-4 h-4 text-orange-600" />
                          Downgrade to Self Study
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-purple-200" />
                          Upgrade to Student Pro
                        </>
                      )}
                    </button>

                    {/* Pause / Resume Button */}
                    {isPaused ? (
                      <button
                        onClick={handleResumeSubscription}
                        disabled={subscriptionActionLoading || is_on_trial}
                        className="bg-[#E6F4EA] text-[#137333] font-bold text-xs px-6 py-3 rounded-full border border-green-100 hover:bg-[#D4EDDA] transition-colors whitespace-nowrap disabled:opacity-40 flex items-center gap-2 justify-center"
                      >
                        {subscriptionActionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                        Resume Subscription
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseSubscription}
                        disabled={subscriptionActionLoading || isCanceling || is_on_trial}
                        className="bg-[#F2E7FE] text-[#6200EE] font-bold text-xs px-6 py-3 rounded-full border border-purple-100 hover:bg-[#EADDFF] transition-colors whitespace-nowrap disabled:opacity-40 flex items-center gap-2 justify-center"
                      >
                        {subscriptionActionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Pause className="w-3.5 h-3.5" />
                        )}
                        Pause Subscription
                      </button>
                    )}

                    {/* Delete Subscription Button */}
                    <button
                      onClick={handleDeleteSubscription}
                      disabled={subscriptionActionLoading || isCanceling}
                      className="bg-[#FDECEA] text-[#A61C1C] font-bold text-xs px-6 py-3 rounded-full border border-red-100 hover:bg-[#FAD4D4] transition-colors whitespace-nowrap disabled:opacity-40 flex items-center gap-2 justify-center"
                    >
                      {subscriptionActionLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete Subscription
                    </button>
                  </div>

                  {subscriptionMessage && (
                    <p
                      className={`text-xs font-semibold ${subscriptionMessage.type === "success"
                        ? "text-[#137333]"
                        : "text-[#A61C1C]"
                        }`}
                    >
                      {subscriptionMessage.text}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* ── Profile + Usage Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <section className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User className="text-[#6200EE] w-5 h-5" />
                    Profile Settings
                  </h3>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
                      <div
                        className="relative cursor-pointer flex-shrink-0"
                        onClick={handleAvatarClick}
                      >
                        <img
                          alt="Avatar"
                          className={`w-20 h-20 rounded-full object-cover shadow-inner ring-4 ring-purple-50 ${avatarUploading ? "opacity-50" : ""
                            }`}
                          src={profilePicture || "https://via.placeholder.com/80"}
                        />
                        {avatarUploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-[#6200EE]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Profile Photo</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          Update your avatar to appear across the leaderboard.
                        </p>
                      </div>
                      <input
                        id="avatar-input"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1.5">
                          Full Name
                        </label>
                        <input
                          className="w-full bg-[#F3F3FA] focus:bg-white border-2 border-transparent focus:border-[#6200EE] rounded-2xl px-4 py-3 text-sm text-gray-800 transition-all outline-none"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 flex items-center gap-3">
                  <button className="bg-[#1C1B1F] text-white text-xs font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-sm">
                    Save Changes
                  </button>
                </div>
              </section>

              <section className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[340px]">
                <h3 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="text-[#6200EE] w-5 h-5" />
                  Usage Today
                </h3>
                {creditsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading usage…
                  </div>
                ) : usage ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Credits used today</span>
                      <span className="text-lg font-bold text-gray-800">
                        {usage.creditsUsedToday}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Credits remaining</span>
                      <span className="text-lg font-bold text-gray-800">
                        {usage.creditsRemaining}
                      </span>
                    </div>
                    {usage.breakdown && (
                      <div className="pt-3 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>AI Video Explanations</span>
                          <span>{usage.breakdown.aiVideo}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Homework Help</span>
                          <span>{usage.breakdown.homeworkHelp}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Extra Tools</span>
                          <span>{usage.breakdown.extraTools}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-4">
                    Usage data isn't available right now.
                  </p>
                )}
              </section>
            </div>

            {/* ── Security + AI Model Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <section className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Lock className="text-[#6200EE] w-5 h-5" />
                  Password
                </h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full bg-[#F3F3FA] focus:bg-white border-2 border-transparent focus:border-[#6200EE] rounded-2xl px-4 py-3 text-sm text-gray-800 transition-all outline-none"
                  />
                </div>
                <button className="mt-4 bg-[#1C1B1F] text-white text-xs font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-sm">
                  Update Password
                </button>
              </section>

              {/* AI Model Card */}
              <section className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BadgeCheck className="text-[#6200EE] w-5 h-5" />
                  AI Model
                </h3>
                <p className="text-sm text-gray-500 mb-1">Currently using</p>
                <p className="text-lg font-bold text-gray-900 mb-6">{currentModel}</p>

                <button
                  disabled={isCurrentPro}
                  onClick={handleToggleSubscriptionTier}
                  className="bg-[#1C1B1F] text-white text-xs font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCurrentPro ? "You're on the latest model" : "Upgrade to Student Pro"}
                </button>
              </section>
            </div>

            {/* ── Notifications ── */}
            <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bell className="text-[#6200EE] w-5 h-5" />
                Notifications
              </h3>

              {!isCurrentPro ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-4">
                    Notification preferences are a Student Pro feature.
                  </p>
                  <button
                    onClick={handleToggleSubscriptionTier}
                    className="bg-[#F2E7FE] text-[#6200EE] font-bold text-xs px-6 py-3 rounded-full border border-purple-100 hover:bg-[#EADDFF] transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              ) : notifLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading preferences…
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {[
                    {
                      key: "weeklyProgressEmail",
                      label: "Weekly Progress Email",
                      desc: "A weekly summary of your grades and time spent studying.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="pr-4">
                        <p className="text-sm font-bold text-gray-800">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={!!notifPrefs[item.key]}
                          onChange={() => handleToggleNotif(item.key)}
                          disabled={notifSaving}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6200EE]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Parent / Guardian Linking ── */}
            <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="text-[#6200EE] w-5 h-5" />
                Parent & Guardian Access
              </h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed max-w-lg">
                Invite a parent or guardian to receive your weekly progress
                reports. They won't be able to see your account password or
                make changes.
              </p>

              <div className="flex gap-3 mb-6">
                <input
                  type="email"
                  placeholder="parent@email.com"
                  className="flex-1 bg-[#F3F3FA] focus:bg-white border-2 border-transparent focus:border-[#6200EE] rounded-2xl px-4 py-3 text-sm text-gray-800 transition-all outline-none"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                />
                <button
                  onClick={handleLinkGuardian}
                  disabled={linkingGuardian || !parentEmail.trim()}
                  className="bg-[#F2E7FE] text-[#6200EE] font-bold text-xs px-6 py-3 rounded-full border border-purple-100 hover:bg-[#EADDFF] transition-colors whitespace-nowrap disabled:opacity-60 flex items-center gap-2"
                >
                  {linkingGuardian && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Send Invite
                </button>
              </div>

              {linkMessage && (
                <p
                  className={`text-xs font-semibold mb-4 ${linkMessage.type === "success"
                    ? "text-[#137333]"
                    : "text-[#A61C1C]"
                    }`}
                >
                  {linkMessage.text}
                </p>
              )}

              {guardiansLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading linked guardians…
                </div>
              ) : linkedGuardians.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {linkedGuardians.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F3F3FA]"
                    >
                      <p className="text-xs font-bold text-gray-700">{g.guardian_email}</p>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${g.status === "confirmed"
                          ? "bg-[#E6F4EA] text-[#137333]"
                          : "bg-[#FFF4E5] text-[#8A5A00]"
                          }`}
                      >
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No guardians linked yet.</p>
              )}
            </section>

            {/* ── Danger Zone ── */}
            <section className="w-full bg-[#FDF2F2] rounded-3xl p-6 border border-red-100/70 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div>
                <h3 className="text-md font-bold text-[#A61C1C] mb-0.5">
                  Danger Zone
                </h3>
                <p className="text-xs text-gray-500 leading-normal">
                  Deleting your account is permanent and will remove all your
                  learning progress and Pro history.
                </p>
              </div>
              <button className="bg-[#B3261E] text-white text-xs font-bold px-6 py-3.5 rounded-full hover:bg-[#961F19] transition-colors whitespace-nowrap shadow-sm shadow-red-100">
                Delete Account
              </button>
            </section>
          </main>
        </div>
      </LoggedInLayout>
    </div>
  );
};

export default Settings;