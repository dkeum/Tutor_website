import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

// Define inline schema matching your email validation requirements
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Trait 3: Odometer-style counter component to animate numbers organically
const LiveCounter = ({ targetNumber }) => {
  const count = useMotionValue(3);
  // Round to nearest integer during calculation steps
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (targetNumber) {
      // Animate from current value to server total over 2 seconds with an elegant easeOut curve
      const controls = animate(count, targetNumber, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [targetNumber, count]);

  return <motion.span className="text-blue-600 dark:text-blue-400 font-black">{rounded}</motion.span>;
};

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Real-time telemetry and milestone stats
  const [totalSignups, setTotalSignups] = useState(null);
  const [userData, setUserData] = useState({ referralToken: "", referralCount: 0 });
  const [copied, setCopied] = useState(false);

  // Extract referral parameters from URL if present
  const [referrerToken, setReferrerToken] = useState(null);

  // Determine base URL dynamically based on Vite environment variables once globally
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://mathamagic-backend.vercel.app";

  useEffect(() => {
    // 1. Parse incoming parameters to support viral tracking lookups
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("ref");
    if (token) setReferrerToken(token);

    console.log("Current API Environment Base URL:", baseUrl);

    // 2. Fetch live counter for social proof section
    axios
      .get(`${baseUrl}/api/waitlist/stats`)
      .then((res) => {
        // Automatically inject your +3 offset onto the active server database numbers
        setTotalSignups(res.data.total_signups + 3);
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
        setTotalSignups(6); // Fallback standard baseline (3 base + 3 bonus offset)
      });
  }, [baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = waitlistSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      // Dynamic API routing based on running environment profile
      const response = await axios.post(`${baseUrl}/api/waitlist/join`, {
        email,
        referred_by: referrerToken || undefined,
      });

      if (response.status === 200 || response.status === 201) {
        setUserData({
          referralToken: response.data.user.referralToken,
          referralCount: response.data.user.referralCount,
        });
        setIsSent(true);

        // Optimize Loop: Increment client counter by 1 instantly upon success to maintain live fidelity
        setTotalSignups((prev) => (prev ? prev + 1 : 4));
      }
    } catch (err) {
      console.error("Waitlist error:", err);
      setError(err.response?.data?.error || "Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = () => {
    const personalUrl = `${window.location.origin}${window.location.pathname}?ref=${userData.referralToken}`;
    navigator.clipboard.writeText(personalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 overflow-x-hidden antialiased">
      <Navbar />

      {/* Main Container Wrapper */}
      <div className="flex-grow relative flex items-center justify-center py-20 px-4 md:px-8">

        {/* Background Grids */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none z-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-white dark:bg-black z-0
            [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] 
            [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />

        {/* Inner Content Grid */}
        <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12">

          {/* Left Column: Context Branding and Pitch Hooks */}
          <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
            <div className="inline-flex max-w-max items-center gap-x-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full">
              <span className="text-xs font-semibold tracking-wide uppercase">Interactive Math Canvas</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-zinc-800 dark:text-zinc-100">
              Master Math <span className="text-blue-600 italic">visually.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              No cluttered workspaces, no dense text blocks. Mathamagic turns abstract rules into clean, responsive visual tracks that make conceptual breakthroughs inevitable.
            </p>

            {/* Dynamic Real-time Counter Area */}
            <div className="flex items-center gap-x-3 pt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-black object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="User avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-black object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="User avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-black object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="User avatar"
                />
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Join <LiveCounter targetNumber={totalSignups} /> educators and students accelerating their learning curve.
              </p>
            </div>
          </div>

          {/* Right Column: Interaction Form or Success Queue Display */}
          <div className="lg:col-span-6 w-full flex flex-col items-center">
            <div className="w-full max-w-md bg-zinc-50 border border-zinc-200/80 dark:bg-zinc-900/50 dark:border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">

              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.div
                    key="form-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-[16/9] border border-zinc-200 dark:border-zinc-800">
                      <iframe
                        src="https://www.youtube.com/embed/wTqdIH_Nnng?autoplay=1&mute=1&loop=1&playlist=wTqdIH_Nnng&controls=1&rel=0"
                        title="Mathamagic Waitlist Preview"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <LabelInputContainer>
                        <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-medium">Secure Your Early Access Spot</Label>
                        <Input
                          id="email"
                          placeholder="you@example.com"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                        />
                        {error && (
                          <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
                        )}
                      </LabelInputContainer>

                      <button
                        className="group/btn relative block h-11 w-full rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 font-semibold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Securing Spot..." : "Join Waitlist →"}
                        <BottomGradient />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4 space-y-5"
                  >
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">You're on the list!</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Want to bypass the queue and get priority access?</p>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Your Referral Stats</p>
                      <div className="flex justify-around items-center mt-2">
                        <div>
                          <span className="block text-2xl font-black text-zinc-800 dark:text-zinc-100">{userData.referralCount}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">Referred</span>
                        </div>
                        <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                        <div>
                          <span className="block text-base font-mono font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-950 px-2.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                            {userData.referralToken}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-1">Token Code</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-2">
                      🎁 Invite **3 friends** to unlock 1-Month of <strong>Student Pro</strong> features completely free when the dynamic render track modules launch.
                    </p>

                    <div className="flex gap-2 pt-2">
                      <input
                        readOnly
                        value={`${window.location.origin}${window.location.pathname}?ref=${userData.referralToken}`}
                        className="flex-grow bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono rounded-lg px-3 py-2 text-zinc-600 dark:text-zinc-400 focus:outline-none"
                      />
                      <button
                        onClick={copyLink}
                        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                      >
                        {copied ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Waitlist;

// Internal Utility Form Components
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);