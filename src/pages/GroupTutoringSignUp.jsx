import React from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
    bg: "#f8f9ff",
    card: "#ffffff",
    primary: "#0037b0",
    primaryHover: "#00298a",
    primaryLight: "#eef1fb",
    ink: "#0b1c30",
    inkSoft: "#434655",
    border: "#c4c5d7",
    muted: "#747686",
    accent: "#29b673",
    accentHover: "#1f9a5f",
    accentLight: "#e6f7ef",
    videoDark: "#101528",
    amber: "#f2a900",
    errorBar: "#ba1a1a",
};

const STATS = [
    { value: "94%", label: "Jump 1+ Letter Grades", sub: "within 10-week mentorship" },
    { value: "200+", label: "Grade 9 & 10 Students", sub: "successfully coached since 2017" },
    { value: "10 Weeks", label: "Average Time to Mastery", sub: "from failing marks to top 10%" },
];

const PILLARS = [
    {
        num: "01",
        title: "Pinpoint Diagnostic Gap Analysis",
        body: "High school math is cumulative. Most Grade 9 and 10 difficulties stem from a few subtle misconceptions in Grade 7/8 pre-algebra. Our diagnostic maps these gaps in 30 minutes.",
        note: "Fixes foundation without retaking full courses",
    },
    {
        num: "02",
        title: "1-on-1 Socratic Intuition Coaching",
        body: "No boring lectures. Our mentors use precision questioning to guide students to discover mathematical concepts on their own.",
        note: "Turns passive watchers into active thinkers",
    },
    {
        num: "03",
        title: "Practice Under Real Test Conditions",
        body: "We run timed practice tests so exam day doesn't feel new. Students learn to work faster, stay calm, and leave time to double-check their answers.",
        note: "Less anxiety, better scores on test day",
    },
];

const REVIEWS = [
    {
        quote:
            "We tried a couple of other tutoring places first and nothing really stuck. Mathmagick was different — Maya actually looks forward to her sessions now, and test anxiety just isn't the issue it used to be. She walked out of her Grade 9 finals smiling. We're so grateful we found Daniel who's been a great teacher.",
        name: "Kevin Sterling",
        role: "Father of Grade 9 Student",
        img: "./KevinSterling.png"
    },
    {
        quote:
            "Ethan had been stuck on the same stuff since 8th grade and I didn't even know it — turns out he'd just missed a couple of basics along the way. Once his mentor caught that, everything else started making sense to him. His teacher actually emailed me asking what had changed. We're really thankful.",
        name: "Elena Rostova",
        role: "Mother of Grade 10 Honors Student",
        img: "./ElenaRostova.jpg"
    },
];

const CALL_STEPS = [
    {
        title: "Curriculum Review",
        body: "We look at their textbook, syllabus, and recent quizzes, then build a clear plan to improve their next exam.",
    },
    {
        title: "Live Diagnostic",
        body: "A gentle 10-minute diagnostic solving a few tailored questions to identify conceptual blindspots in real time.",
    },
    {
        title: "Free Access to Math Software",
        body: "You'll also get free but limited access to our homework software alongside a math roadmap — so your student can start putting it into practice right away, whether you enroll with us or not.",
    },
];

const Stars = ({ size = 14 }) => (
    <div style={{ display: "flex", gap: 2 }}>
        {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ color: COLORS.amber, fontSize: size, lineHeight: 1 }}>
                ★
            </span>
        ))}
    </div>
);

const GroupTutoringSignUp = () => {
    const navigate = useNavigate();
    const bookCall = () => navigate("/calendar-booking");

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bg }}>
            <style>{`
                @keyframes pulseDot {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    70% { transform: scale(1.8); opacity: 0; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
            `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    padding: "48px 20px 80px",
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div style={{ width: "100%", maxWidth: 860 }}>
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <img src="/logo.png" alt="Mathmagick Logo" className="w-20" />
                        <h1 className="text-4xl font-bold text-center mb-2" style={{ color: COLORS.ink }}>
                            Mathmagick
                        </h1>
                    </div>

                    {/* Admissions Open Badge */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 16px",
                                borderRadius: 999,
                                background: COLORS.card,
                                boxShadow: "0 1px 6px rgba(15,23,42,0.08)",
                            }}
                        >
                            <span style={{ position: "relative", width: 10, height: 10, display: "inline-flex" }}>
                                <span
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "50%",
                                        background: COLORS.accent,
                                        animation: "pulseDot 1.8s ease-out infinite",
                                    }}
                                />
                                <span
                                    style={{
                                        position: "relative",
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: COLORS.accent,
                                    }}
                                />
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", color: COLORS.ink, textTransform: "uppercase" }}>
                                Admissions Open For Spring / Fall Accelerator
                            </span>
                            <span style={{ fontSize: 12, color: COLORS.muted }}>• Limited 25 Seats / Cohort</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            fontSize: "clamp(28px, 4vw, 40px)",
                            fontWeight: 800,
                            color: COLORS.ink,
                            textAlign: "center",
                            lineHeight: 1.25,
                            letterSpacing: "-0.02em",
                            margin: "0 0 16px",
                        }}
                    >
                        After Working With <span style={{ color: COLORS.primary }}>Hundreds Of Students</span>, We've
                        Built{" "}
                        <span
                            style={{
                                color: COLORS.accent,
                                background: COLORS.accentLight,
                                padding: "2px 10px",
                                borderRadius: 8,
                            }}
                        >
                            The Best Way
                        </span>{" "}
                        To Take A Grade 9 &amp; 10 Student From Struggling To The{" "}
                        <span style={{ textDecoration: "underline", textDecorationColor: COLORS.accent, textDecorationThickness: 3, textUnderlineOffset: 4 }}>
                            Top Of Their Class
                        </span>
                    </h1>

                    {/* Value prop subtitle */}
                    <p
                        className="mx-auto my-10"
                        style={{
                            fontSize: 14,
                            color: COLORS.primary,
                            opacity: 0.75,
                            textAlign: "center",
                            maxWidth: 560,


                            lineHeight: 1.6,
                        }}
                    >
                        Master foundational algebra, quadratic functions, and geometry intuition in under 12 weeks — backed
                        by a decade of teaching experience
                    </p>

                    {/* Blue "watch video" banner */}
                    <div
                        style={{
                            background: COLORS.primary,
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: 15,
                            padding: "12px 16px",
                            borderRadius: "14px 14px 0 0",
                        }}
                    >
                        Watch The 3 Minute Video Below To See How
                    </div>

                    {/* Dark video panel */}
                    <div
                        style={{
                            background: COLORS.videoDark,
                            borderRadius: "0 0 14px 14px",
                            padding: "28px 24px 32px",
                            boxSizing: "border-box",
                        }}
                    >
                        <h2
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontSize: "clamp(20px, 3vw, 26px)",
                                fontWeight: 800,
                                lineHeight: 1.3,
                                margin: "0 0 24px",
                            }}
                        >
                            HOW TO GET YOUR GRADE 9/10 STUDENT{" "}
                            <span style={{ color: "#5aa7ff" }}>TOP OF THE CLASS</span> IN MATH
                        </h2>

                        {/* Embedded video */}
                        <div
                            style={{
                                position: "relative",
                                maxWidth: 480,
                                margin: "0 auto",
                                aspectRatio: "16 / 9",
                                borderRadius: 12,
                                overflow: "hidden",
                                border: `2px solid ${COLORS.primary}`,
                            }}
                        >
                            <iframe
                                src="https://www.youtube.com/embed/M1AhNm2WMJA"
                                title="Mathmagick — How To Get Your Grade 9/10 Student Top Of The Class"
                                style={{ width: "100%", height: "100%", border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>


                    {/* Primary CTA */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 28 }}>
                        <button
                            onClick={bookCall}
                            className="flex flex-col bg-[#29b673] hover:bg-[#1f9a5f] transition-colors duration-200"
                            style={{
                                width: "100%",
                                maxWidth: 480,
                                padding: "18px 16px",
                                border: "none",
                                borderRadius: 12,
                                color: "#fff",
                                textAlign: "center",
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            <span className="text-xl font-bold bg-inherit">BOOK A CALL</span>
                            <span className="text-sm font-bold bg-inherit">Click Here To Save Your Spot</span>
                        </button>
                    </div>

                    {/* Stats bar */}
                    <div
                        style={{
                            marginTop: 56,
                            paddingTop: 32,
                            borderTop: `1px solid ${COLORS.border}`,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: 20,
                        }}
                    >
                        {STATS.map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.primary, letterSpacing: "-0.02em" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, marginTop: 4 }}>{s.label}</div>
                                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* 3-Pillar Method */}
                    <div style={{ marginTop: 64 }}>
                        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 32px" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                Why Traditional Tutoring Fails
                            </div>
                            <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.ink, margin: "8px 0" }}>
                                The 3-Pillar Mathmagick Framework
                            </h2>
                            <p style={{ fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.6 }}>
                                High school math isn't about memorizing formulas; it's about pattern recognition and
                                confidence under timed conditions.
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                            {PILLARS.map((p) => (
                                <div
                                    key={p.num}
                                    style={{
                                        background: COLORS.card,
                                        borderRadius: 14,
                                        padding: 24,
                                        boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", marginBottom: 6 }}>
                                            Pillar {p.num}
                                        </div>
                                        <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, margin: "0 0 10px" }}>{p.title}</h3>
                                        <p style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.6, margin: "0 0 16px" }}>{p.body}</p>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: COLORS.ink,
                                            background: COLORS.bg,
                                            borderRadius: 8,
                                            padding: "8px 10px",
                                        }}
                                    >
                                        ✓ {p.note}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Before / After case study */}
                    <div
                        style={{
                            marginTop: 64,
                            background: COLORS.card,
                            borderRadius: 16,
                            padding: 28,
                            boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: 32,
                            alignItems: "start",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", marginBottom: 8 }}>
                                Grade 10 Case Study
                            </div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.ink, lineHeight: 1.35, margin: "0 0 12px" }}>
                                "From a 62% in Term 1 to a 91% on the Final Exam."
                            </h2>
                            <p style={{ fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.6, margin: "0 0 20px" }}>
                                "Before Mathmagick, homework time was stressful for Lucas — he'd get stuck, get frustrated, and start avoiding it altogether by turning to video games instead, which only made his grades slip further. In 9 weeks, his mentor rebuilt his understanding of math from the ground up. Now he actually gets it, and he's confident walking into a math test."
                            </p>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <img
                                    src="./vance_family.png"
                                    alt="Vance Family"
                                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>Claire &amp; Lucas Vance</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>Oakridge High School, Grade 10 Parent</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between h-[90%]">
                            {[
                                { week: "Week 1", detail: "Diagnostic Intake", score: "62%", pct: 62, color: COLORS.errorBar },
                                { week: "Week 5", detail: "Mid-Accelerator Exam", score: "81%", pct: 81, color: COLORS.primary },
                                { week: "Week 10", detail: "Final Term Examination", score: "91%", pct: 91, color: COLORS.accent },
                            ].map((row) => (
                                <div key={row.week}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                                        <span>
                                            <span style={{ fontSize: 16, fontWeight: 800, color: row.color }}>{row.week}</span>{" "}
                                            <span style={{ fontSize: 13, color: COLORS.inkSoft }}>({row.detail})</span>
                                        </span>
                                        <span style={{ fontWeight: 700, color: row.color }}>{row.score}</span>
                                    </div>
                                    <div style={{ width: "100%", height: 12, background: COLORS.bg, borderRadius: 999, overflow: "hidden" }}>
                                        <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, borderRadius: 999 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Parent reviews */}
                    <div style={{ marginTop: 64 }}>
                        <div style={{ textAlign: "center", marginBottom: 28 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                Parent Testimonials
                            </div>
                            <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.ink, margin: "8px 0" }}>
                                Real Transformations From Real Families
                            </h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                            {REVIEWS.map((r) => (
                                <div
                                    key={r.name}
                                    style={{
                                        background: COLORS.card,
                                        borderRadius: 14,
                                        padding: 24,
                                        boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
                                    }}
                                >
                                    <Stars />
                                    <p style={{ fontSize: 14, color: COLORS.ink, fontStyle: "italic", lineHeight: 1.6, margin: "12px 0 16px" }}>
                                        "{r.quote}"
                                    </p>
                                    <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                                        <img
                                            src={r.img}
                                            alt={r.name}
                                            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                        />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{r.name}</div>
                                            <div style={{ fontSize: 12, color: COLORS.muted }}>{r.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* What happens on the call */}
                    <div style={{ marginTop: 64, textAlign: "center" }}>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.ink, margin: "0 0 10px" }}>
                            What Happens On Your Free Call?
                        </h2>
                        <p style={{ fontSize: 14, color: COLORS.inkSoft, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.6 }}>
                            Zero high-pressure sales. Just actionable clarity on your student's exact math profile.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, textAlign: "left" }}>
                            {CALL_STEPS.map((s, i) => (
                                <div key={s.title} style={{ background: COLORS.card, borderRadius: 14, padding: 20 }}>
                                    <div
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: COLORS.primary,
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            marginBottom: 12,
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: "0 0 6px" }}>{s.title}</h3>
                                    <p style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div
                        style={{
                            marginTop: 64,
                            background: COLORS.ink,
                            borderRadius: 20,
                            padding: "48px 28px",
                            textAlign: "center",
                        }}
                    >
                        <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.3 }}>
                            Give Your Child The Confidence To Lead Their Math Class
                        </h2>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.6 }}>
                            Every week spent struggling widens the cumulative gap. Secure one of the remaining 25 spots
                            in this term's cohort today.
                        </p>
                        <button
                            onClick={bookCall}
                            style={{
                                width: "100%",
                                maxWidth: 360,
                                padding: "16px 16px",
                                border: "none",
                                borderRadius: 12,
                                background: COLORS.accent,
                                color: "#fff",
                                fontFamily: "inherit",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.target.style.background = COLORS.accentHover)}
                            onMouseLeave={(e) => (e.target.style.background = COLORS.accent)}
                        >
                            <div style={{ fontSize: 16, fontWeight: 700 }}>BOOK A CALL</div>
                            <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.9, marginTop: 2 }}>
                                Takes Under 60 Seconds • No Commitment Required
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupTutoringSignUp;