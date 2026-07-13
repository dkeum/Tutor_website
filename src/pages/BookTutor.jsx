import React, { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Zap, BadgeCheck, Send, User, Mail } from "lucide-react";
import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import LoggedInLayout from "../components/LoggedInLayout";

// Zod Validation Schema
const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(5, "Message must be at least 5 characters."),
});

const BookTutor = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = { fullName, email, message };
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    axios
      .post("https://mathamagic-backend.vercel.app/email", formData)
      .then((response) => {
        console.log("Server response:", response.data);
        setIsSent(true);
        setIsSubmitting(false);
        setFullName("");
        setEmail("");
        setMessage("");

        setTimeout(() => setIsSent(false), 4000);
      })
      .catch((error) => {
        console.error("Error sending email:", error.response?.data || error.message);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen w-full text-[#101b30] flex relative  ">
      {/* Dynamic Math Matrix Background Grid Pattern */}
      

      <div className="absolute inset-0 math-grid pointer-events-none z-0" />

      <LoggedInLayout>
        {/* Main Core Content Shell Wrap */}
        <div className="flex-1 flex flex-col min-h-screen relative z-10 ">

          {/* Content Box Wrap */}
          <main className="p-6 md:p-10 max-w-[1280px] w-full mx-auto flex-1 flex flex-col justify-center">
            <section className="max-w-5xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                {/* Left Column Layout: Lead Tutor Profile Description Context */}
                <div className="lg:col-span-5 space-y-6 flex flex-col justify-center text-left">
                  <div className="relative inline-block">
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#79f2f4]/20 rounded-full blur-2xl" />
                    <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#101b30] relative z-10 font-['Plus_Jakarta_Sans']">
                      Let's solve <br />
                      <span className="text-[#4800b2] italic font-normal">together.</span>
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-[#494456] max-w-sm leading-relaxed">
                    Struggling with a concept? Email us to strategize 1-1 with our lead tutor and unlock your mathematical potential.
                  </p>

                  {/* Interactive Bio Widget Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(98,0,238,0.06)] border border-[#e0e8ff] transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#F3E8FF] shrink-0">
                        <img
                          alt="Daniel Keum"
                          className="w-full h-full object-cover"
                          src="/headshot.jpg"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[#101b30]">Daniel Keum</h4>
                        <p className="text-[#4800b2] text-xs font-bold uppercase tracking-wider mt-0.5">Lead Tutor & Strategist</p>
                      </div>
                    </div>

                    {/* Performance Indicators Grid split */}
                    <div className="flex gap-2">
                      <div className="flex-1 bg-[#F8F9FE] p-3 rounded-xl text-center">
                        <span className="block text-[#4800b2] font-bold text-base">8+</span>
                        <span className="text-[11px] text-[#494456] opacity-70 block mt-0.5">Years Exp.</span>
                      </div>
                      <div className="flex-1 bg-[#F8F9FE] p-3 rounded-xl text-center">
                        <span className="block text-[#4800b2] font-bold text-base">1000+</span>
                        <span className="text-[11px] text-[#494456] opacity-70 block mt-0.5">Students</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column Layout: Unified Core React Hook Request Form Block */}
                <div className="lg:col-span-7">
                  <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(98,0,238,0.08)] border border-[#e8edff] relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#4800b2]/5 rounded-full blur-3xl" />

                    <div className="mb-6 text-left relative z-10">
                      <h3 className="text-2xl font-bold text-[#101b30]">Request Strategy Session</h3>
                      <p className="text-sm text-[#494456] mt-2 opacity-90">
                        Fill out the form below and Daniel will get back to you within 24 hours.
                      </p>
                    </div>

                    <form className="space-y-5 text-left relative z-10" onSubmit={handleSubmit}>
                      {/* Input Module 1: Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#494456] uppercase tracking-wider block ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbc3d9] w-5 h-5" />
                          <input
                            type="text"
                            className={cn(
                              "w-full pl-11 pr-4 py-3.5 bg-white border-2 border-[#e0e8ff] rounded-xl outline-none transition-all text-sm font-medium focus:border-[#4800b2] focus:ring-4 focus:ring-[#4800b2]/10",
                              errors.fullName && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                            )}
                            placeholder="e.g. John Smith"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-xs font-semibold text-rose-500 mt-1 ml-1">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Input Module 2: Email Handle */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#494456] uppercase tracking-wider block ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbc3d9] w-5 h-5" />
                          <input
                            type="email"
                            className={cn(
                              "w-full pl-11 pr-4 py-3.5 bg-white border-2 border-[#e0e8ff] rounded-xl outline-none transition-all text-sm font-medium focus:border-[#4800b2] focus:ring-4 focus:ring-[#4800b2]/10",
                              errors.email && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                            )}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs font-semibold text-rose-500 mt-1 ml-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Input Module 3: Message Textarea */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#494456] uppercase tracking-wider block ml-1">Message (Helpful Information)</label>
                        <textarea
                          rows="4"
                          className={cn(
                            "w-full p-4 bg-white border-2 border-[#e0e8ff] rounded-xl outline-none transition-all text-sm font-medium resize-none focus:border-[#4800b2] focus:ring-4 focus:ring-[#4800b2]/10",
                            errors.message && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                          )}
                          placeholder="Tell us about your current math challenges..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        {errors.message && (
                          <p className="text-xs font-semibold text-rose-500 mt-1 ml-1">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit Action Controller */}
                      <button
                        type="submit"
                        disabled={isSubmitting || isSent}
                        className="w-full py-4 bg-[#4800b2] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#4800b2]/20 hover:shadow-[#4800b2]/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-80 disabled:pointer-events-none"
                      >
                        <span>
                          {isSent ? "Message Sent!" : isSubmitting ? "Sending Request..." : "Request Strategy Session"}
                        </span>
                        {!isSent && !isSubmitting && (
                          <Send className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Subtext Grid Tiles Container */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-white border border-[#e8edff] rounded-xl flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-full bg-[#79f2f4]/10 flex items-center justify-center text-[#00696b] shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#101b30]">Fast Response</span>
                        <span className="text-[11px] text-[#494456] opacity-70">Under 24 hours</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-[#e8edff] rounded-xl flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-full bg-[#2ECC71]/10 flex items-center justify-center text-[#2ECC71] shrink-0">
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#101b30]">1-1 Focus</span>
                        <span className="text-[11px] text-[#494456] opacity-70">Private sessions</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </main>

          {/* Global Floating Success Toast Notification Modal - Given max z-index stack layer */}
          <div
            className={cn(
              "fixed bottom-10 right-10 bg-[#2ECC71] text-white px-6 py-4 rounded-xl shadow-2xl transition-all duration-500 flex items-center gap-3 z-[100]",
              isSent ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
            )}
          >
            <BadgeCheck className="w-5 h-5 text-white" />
            <span className="text-xs font-bold tracking-wide">Message sent! We'll be in touch soon.</span>
          </div>


        </div>

      </LoggedInLayout>


    </div>
  );
};

export default BookTutor;