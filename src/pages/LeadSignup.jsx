import React, { useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

// Zod Schema
const leadSchema = z.object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(7, "Enter a phone number so we can reach you."),
    grade: z.enum(["9", "10"], { errorMap: () => ({ message: "Select a grade." }) }),
});

const BENEFITS = [
    {
        title: "A plan built around your exact gaps",
        body: "A short diagnostic finds precisely where marks are slipping — factoring, linear systems, trig identities — and the six weeks are built around that, not a generic syllabus.",
    },
    {
        title: "Weekly live problem-solving",
        body: "One live session a week with our lead tutor, working through the problems that actually show up on quizzes and tests.",
    },
    {
        title: "Mistakes caught before test day",
        body: "Step-by-step homework feedback flags errors in the moment, so a small misunderstanding doesn't compound for six weeks.",
    },
];

const STEPS = [
    { n: "1", label: "5-minute diagnostic", body: "A handful of Grade 9/10 questions to find your starting point." },
    { n: "2", label: "Personalized plan", body: "A six-week schedule built around your gaps, sent the same day." },
    { n: "3", label: "Weekly sessions", body: "Live tutoring plus short lessons to work through each week." },
    { n: "4", label: "Track the change", body: "Weekly check-ins so you can see marks move before the term ends." },
];

const LeadSignup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [grade, setGrade] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSent(false);

        const formData = { fullName, email, phone, grade };
        const result = leadSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        // NOTE: reusing the existing /email endpoint with a structured message so
        // no backend changes are required to launch the ad. Point this at a
        // dedicated /leads endpoint later if you want cleaner data.
        axios
            .post("https://mathamagic-backend.vercel.app/email", {
                fullName,
                email,
                message: `New free 6-week program lead.\nGrade: ${grade}\nPhone: ${phone}`,
            })
            .then((response) => {
                console.log("Server response:", response.data);
                setIsSent(true);
            })
            .catch((error) => {
                console.error(
                    "Error sending lead:",
                    error.response?.data || error.message
                );
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="min-h-screen w-full bg-[#f9f9ff] text-[#101b30] tracking-normal flex flex-col relative overflow-hidden">
            <style>{`
        .math-grid {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(43, 86, 222, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 86, 222, 0.04) 1px, transparent 1px);
        }
      `}</style>

            <div className="absolute inset-0 math-grid pointer-events-none z-0" />
            <div className="pointer-events-none absolute inset-0 bg-[#f9f9ff] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />



            <div className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-6 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
                    {/* Left: pitch */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >


                        <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-[1.08] text-[#101b30]">
                            Six weeks to turn a slipping math grade around.
                        </h1>

                        <p className="mt-4 text-lg text-[#494456] max-w-lg">
                            A free, structured program for Grade 9 and 10 students — built
                            around exactly where your marks are dropping, not a generic
                            review course.
                        </p>

                        <div className="mt-8 space-y-5">
                            {BENEFITS.map((b) => (
                                <div key={b.title} className="flex gap-4">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-[#2b56de] shrink-0" />
                                    <div>
                                        <p className="font-semibold text-[#101b30]">{b.title}</p>
                                        <p className="text-sm text-[#494456] mt-1 max-w-md">{b.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 border-t border-[#e8edff] pt-8">
                            <p className="text-sm font-semibold text-[#101b30] mb-4">
                                How the six weeks work
                            </p>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                                {STEPS.map((s) => (
                                    <div key={s.n} className="flex gap-3">
                                        <span className="text-sm font-bold text-[#2b56de]">{s.n}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-[#101b30]">{s.label}</p>
                                            <p className="text-sm text-[#494456] mt-0.5">{s.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: signup form */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                        className="w-full bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(43,86,222,0.06)] border border-[#e8edff] lg:sticky lg:top-10"
                    >
                        <h2 className="text-2xl font-extrabold text-[#101b30]">
                            Reserve a free spot
                        </h2>
                        <p className="mt-2 text-sm text-[#494456]">
                            Spots are limited for this cohort. We'll follow up within one
                            business day with your diagnostic link.
                        </p>

                        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                            <LabelInputContainer>
                                <Label htmlFor="fullname" className="text-sm font-medium text-[#101b30]">
                                    Student's full name
                                </Label>
                                <Input
                                    id="fullname"
                                    placeholder="John Smith"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus-visible:ring-0 focus:border-[#2b56de] focus:bg-white transition-all"
                                />
                                {errors.fullName && (
                                    <p className="text-sm text-red-500 font-medium">{errors.fullName}</p>
                                )}
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label className="text-sm font-medium text-[#101b30]">Grade</Label>
                                <div className="flex gap-3">
                                    {["9", "10"].map((g) => (
                                        <button
                                            type="button"
                                            key={g}
                                            onClick={() => setGrade(g)}
                                            className={cn(
                                                "flex-1 rounded-xl border-2 py-3 text-sm font-semibold transition-all",
                                                grade === g
                                                    ? "border-[#2b56de] bg-[#eef1ff] text-[#2b56de]"
                                                    : "border-transparent bg-[#f0f3ff] text-[#494456] hover:bg-[#e8edff]"
                                            )}
                                        >
                                            Grade {g}
                                        </button>
                                    ))}
                                </div>
                                {errors.grade && (
                                    <p className="text-sm text-red-500 font-medium">{errors.grade}</p>
                                )}
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="email" className="text-sm font-medium text-[#101b30]">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    placeholder="you@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus-visible:ring-0 focus:border-[#2b56de] focus:bg-white transition-all"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 font-medium">{errors.email}</p>
                                )}
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="phone" className="text-sm font-medium text-[#101b30]">
                                    Phone number
                                </Label>
                                <Input
                                    id="phone"
                                    placeholder="(604) 555-0100"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus-visible:ring-0 focus:border-[#2b56de] focus:bg-white transition-all"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500 font-medium">{errors.phone}</p>
                                )}
                            </LabelInputContainer>

                            <button
                                className="text-base group/btn relative block h-12 w-full rounded-xl bg-[#2b56de] font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-[#1a43c7] active:scale-[0.98]"
                                type="submit"
                                disabled={isSubmitting || isSent}
                            >
                                {isSent ? "You're in — check your email" : isSubmitting ? "Reserving..." : "Claim my free spot"}
                                <BottomGradient />
                            </button>

                            <p className="text-xs text-center text-[#8a879a]">
                                No cost, no credit card. Cancel anytime.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LeadSignup;

// Utility Components
const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#2b56de] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
);

const LabelInputContainer = ({ children, className }) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
        {children}
    </div>
);