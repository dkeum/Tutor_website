import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";

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
    { value: "200+", label: "Grade 9 & 10 Students", sub: "successfully mentored since 2017" },
    { value: "10 Weeks", label: "Average Time to Mastery", sub: "from failing marks to top 15%" },
];

const PILLARS = [
    {
        num: "01",
        title: "Pinpoint Diagnostic Gap Analysis",
        body: "Math is a subject that builds. Most Grade 9 and 10 difficulties stem from missed foundations in Grade 7/8 pre-algebra. Our free call finds these gaps in less than 30 minutes and we fix them.",
        note: "Fixes foundation without retaking full courses",
    },
    {
        num: "02",
        title: "1-on-1 Socratic Intuition Coaching",
        body: "Asking the right questions guides the students into discovering the math concepts. We don't just give answers — we teach students to think like mathematicians & engineers, so they can solve problems on their own.",
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
        img: "./KevinSterling.png",
    },
    {
        quote:
            "Ethan had been stuck on the same stuff since 8th grade and I didn't even know it — turns out he'd just missed a couple of basics along the way. Once his mentor caught that, everything else started making sense to him. His teacher actually emailed me asking what had changed. We're really thankful.",
        name: "Elena Rostova",
        role: "Mother of Grade 10 Student",
        img: "./ElenaRostova.png",
    },
];

const CALL_STEPS = [
    {
        title: "Foundations Review",
        body: "We assess your child's current understanding of the material and identify any gaps in their knowledge. This ensures that we can focus on the areas that will have the most impact on their performance.",
    },
    {
        title: "Live Diagnostic",
        body: "A gentle 10-minute diagnostic solving a few tailored questions to identify conceptual blindspots in real time.",
    },
    {
        title: "Free Access to Math Software",
        body: "You'll also get free access to our homework software alongside a math roadmap — so your student can start putting it into practice right away, whether you enroll with us or not.",
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

/**
 * Click-to-load YouTube embed. Shows a static thumbnail + play button
 * instead of loading YouTube's player JS on page load — this was the
 * single biggest driver of the mobile LCP/FCP problems.
 */
const LazyYouTube = ({ videoId, title }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                maxWidth: 480,
                margin: "0 auto",
                aspectRatio: "16 / 9",
                borderRadius: 12,
                overflow: "hidden",
                border: `2px solid ${COLORS.primary}`,
                cursor: loaded ? "default" : "pointer",
                background: "#000",
            }}
            onClick={() => !loaded && setLoaded(true)}
            role={loaded ? undefined : "button"}
            aria-label={loaded ? undefined : `Play video: ${title}`}
        >
            {loaded ? (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={title}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <>
                    <img
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt={title}
                        loading="lazy"
                        width="480"
                        height="270"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 68,
                                height: 48,
                                background: "rgba(0,0,0,0.75)",
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: "12px solid transparent",
                                    borderBottom: "12px solid transparent",
                                    borderLeft: "20px solid #fff",
                                    marginLeft: 4,
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const GroupTutoringSignUp = () => {
    const navigate = useNavigate();

    const bookCall = () => {
        ReactGA.event({
            category: "Booking",
            action: "book_call_click",
            label: "Group Tutoring Landing Page",
        });

        navigate("/calendar-booking");
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bg }}>
            <style>{`
                @keyframes pulseDot {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    70% { transform: scale(1.8); opacity: 0; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                .mm-badge {
                    display: inline-flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                    gap: clamp(4px, 1.5vw, 8px);
                    padding: clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px);
                    border-radius: 999px;
                    background: ${COLORS.card};
                    box-shadow: 0 1px 6px rgba(15,23,42,0.08);
                    max-width: 100%;
                    text-align: center;
                }
            `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    padding: "clamp(24px, 6vw, 48px) clamp(14px, 4vw, 20px) clamp(48px, 10vw, 80px)",
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div style={{ width: "100%", maxWidth: 860 }}>
                    {/* Logo */}
                    <div className="flex flex-row items-center gap-4 mb-6 justify-center">
                        <img
                            src="/logo.png"
                            alt="Mathmagick Logo"
                            className="w-16 sm:w-20"
                            width="80"
                            height="80"
                        />
                        <h1
                            className="font-bold text-center mb-2"
                            style={{ color: COLORS.ink, fontSize: "clamp(24px, 6vw, 36px)" }}
                        >
                            Mathmagick
                        </h1>
                    </div>

                    {/* Admissions Open Badge
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "clamp(16px, 4vw, 24px)", padding: "0 8px" }}>
                        <div className="mm-badge">
                            <span style={{ position: "relative", width: 10, height: 10, display: "inline-flex", flexShrink: 0 }}>
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
                            <span
                                style={{
                                    fontSize: "clamp(10px, 2.8vw, 12px)",
                                    fontWeight: 700,
                                    letterSpacing: "0.03em",
                                    color: COLORS.ink,
                                    textTransform: "uppercase",
                                }}
                            >
                                Admissions Open For Spring / Fall Accelerator
                            </span>
                            <span style={{ fontSize: "clamp(10px, 2.8vw, 12px)", color: COLORS.muted }}>
                                • Limited 25 Seats / Cohort
                            </span>
                        </div>
                    </div> */}

                    {/* Headline */}
                    <h1
                        style={{
                            fontSize: "clamp(26px, 6.5vw, 40px)",
                            fontWeight: 800,
                            color: COLORS.ink,
                            textAlign: "center",
                            lineHeight: 1.25,
                            letterSpacing: "-0.02em",
                            margin: "0 0 16px",
                            padding: "0 4px",
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
                                display: "inline-block",
                            }}
                        >
                            The Best Way
                        </span>{" "}
                        To Take A Grade 9 &amp; 10 Student From Struggling To Success{" "}
                        <span style={{ textDecoration: "underline", textDecorationColor: COLORS.accent, textDecorationThickness: 3, textUnderlineOffset: 4 }}>
                            In Their Class
                        </span>
                    </h1>

                    {/* Value prop subtitle
                    <p
                        className="mx-auto"
                        style={{
                            fontSize: "clamp(13px, 3.2vw, 14px)",
                            color: COLORS.primary,
                            opacity: 0.75,
                            textAlign: "center",
                            maxWidth: 560,
                            margin: "clamp(24px, 6vw, 40px) auto",
                            lineHeight: 1.6,
                            padding: "0 8px",
                        }}
                    >
                        Master foundational algebra, quadratic functions, and geometry intuition in under 12 weeks — backed
                        by a decade of teaching experience
                    </p> */}

                    {/* Blue "watch video" banner */}
                    <div
                        style={{
                            background: COLORS.primary,
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: "clamp(13px, 3.5vw, 15px)",
                            padding: "clamp(10px, 3vw, 12px) 16px",
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
                            padding: "clamp(20px, 5vw, 28px) clamp(16px, 4vw, 24px) clamp(24px, 6vw, 32px)",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* <h2
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontSize: "clamp(18px, 4.8vw, 26px)",
                                fontWeight: 800,
                                lineHeight: 1.3,
                                margin: "0 0 20px",
                            }}
                        >
                            HOW TO GET YOUR GRADE 9/10 STUDENT{" "}
                            <span style={{ color: "#5aa7ff" }}>TOP OF THE CLASS</span> IN MATH
                        </h2> */}

                        <LazyYouTube
                            videoId="M1AhNm2WMJA"
                            title="Mathmagick — How To Get Your Grade 9/10 Student Top Of The Class"
                        />
                    </div>

                    {/* Primary CTA */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "clamp(20px, 5vw, 28px)" }}>
                        <button
                            onClick={bookCall}
                            className="flex flex-col bg-[#29b673] hover:bg-[#1f9a5f] transition-colors duration-200"
                            style={{
                                width: "100%",
                                maxWidth: 480,
                                padding: "clamp(14px, 3.5vw, 18px) 16px",
                                border: "none",
                                borderRadius: 12,
                                color: "#fff",
                                textAlign: "center",
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            <span style={{ fontSize: "clamp(17px, 4.5vw, 20px)", fontWeight: 700 }}>BOOK A FREE CALL</span>
                            <span style={{ fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 700 }}>Click Here To Save Your Spot</span>
                        </button>
                    </div>

                    {/* Stats bar */}
                    <div
                        style={{
                            marginTop: "clamp(36px, 8vw, 56px)",
                            paddingTop: "clamp(20px, 5vw, 32px)",
                            borderTop: `1px solid ${COLORS.border}`,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: "clamp(14px, 3.5vw, 20px)",
                        }}
                    >
                        {STATS.map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 800, color: COLORS.primary, letterSpacing: "-0.02em" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 600, color: COLORS.ink, marginTop: 4 }}>{s.label}</div>
                                <div style={{ fontSize: "clamp(10.5px, 2.6vw, 11px)", color: COLORS.muted, marginTop: 2 }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Meet Your Mentor */}
                    <div style={{ marginTop: "clamp(40px, 9vw, 64px)" }}>
                        <div style={{ textAlign: "center", marginBottom: "clamp(20px, 5vw, 28px)", padding: "0 8px" }}>
                            <div style={{ fontSize: "clamp(11px, 2.8vw, 12px)", fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                Who's Teaching Your Child
                            </div>
                            <h2 style={{ fontSize: "clamp(21px, 5.5vw, 26px)", fontWeight: 800, color: COLORS.ink, margin: "8px 0" }}>
                                Meet Your Mentor
                            </h2>
                        </div>

                        <div
                            style={{
                                background: COLORS.card,
                                borderRadius: 16,
                                padding: "clamp(20px, 5vw, 28px)",
                                boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "clamp(20px, 5vw, 32px)",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <div
                                    style={{
                                        width: "clamp(160px, 30vw, 220px)",
                                        height: "clamp(160px, 30vw, 220px)",
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        boxShadow: "0 1px 6px rgba(15,23,42,0.08)",
                                    }}
                                >
                                    <img
                                        src="./my_picture.jpg"
                                        alt="Daniel, founder of Mathmagick"
                                        loading="lazy"
                                        width="220"
                                        height="220"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: "clamp(17px, 4.2vw, 19px)", fontWeight: 700, color: COLORS.ink, margin: "0 0 10px" }}>
                                    Daniel
                                </h3>
                                <p style={{ fontSize: "clamp(13px, 3.2vw, 14px)", color: COLORS.inkSoft, lineHeight: 1.6, margin: "0 0 16px" }}>
                                    I'm an engineer and classroom teacher who's spent 10+ years teaching high school math
                                    in Vancouver. Along the way I noticed most students weren't struggling with new
                                    material — they were missing foundations from a year or two earlier, and nobody
                                    had caught it. I built this program to fix that: rebuild the fundamentals, then
                                    build the discipline to keep improving.
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {["10+ Years Teaching", "Vancouver-Based", "Engineer & Educator"].map((badge) => (
                                        <span
                                            key={badge}
                                            style={{
                                                fontSize: "clamp(11px, 2.7vw, 12px)",
                                                fontWeight: 600,
                                                color: COLORS.primary,
                                                background: COLORS.primaryLight,
                                                borderRadius: 999,
                                                padding: "6px 12px",
                                            }}
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3-Pillar Method */}
                    <div style={{ marginTop: "clamp(40px, 9vw, 64px)" }}>
                        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto clamp(24px, 6vw, 32px)", padding: "0 8px" }}>
                            <div style={{ fontSize: "clamp(11px, 2.8vw, 12px)", fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                How our program works
                            </div>
                            <h2 style={{ fontSize: "clamp(21px, 5.5vw, 26px)", fontWeight: 800, color: COLORS.ink, margin: "8px 0" }}>
                                The 3-Pillar Mathmagick Framework
                            </h2>
                            <p style={{ fontSize: "clamp(13px, 3.2vw, 14px)", color: COLORS.inkSoft, lineHeight: 1.6 }}>
                                High school math isn't about memorizing formulas; it's about pattern recognition and
                                confidence under timed conditions.
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(14px, 3.5vw, 20px)" }}>
                            {PILLARS.map((p) => (
                                <div
                                    key={p.num}
                                    style={{
                                        background: COLORS.card,
                                        borderRadius: 14,
                                        padding: "clamp(18px, 4.5vw, 24px)",
                                        boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "clamp(10.5px, 2.6vw, 11px)", fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", marginBottom: 6 }}>
                                            Pillar {p.num}
                                        </div>
                                        <h3 style={{ fontSize: "clamp(16px, 4vw, 17px)", fontWeight: 700, color: COLORS.ink, margin: "0 0 10px" }}>{p.title}</h3>
                                        <p style={{ fontSize: "clamp(12.5px, 3.1vw, 13px)", color: COLORS.inkSoft, lineHeight: 1.6, margin: "0 0 16px" }}>{p.body}</p>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "clamp(11.5px, 2.9vw, 12px)",
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
                            marginTop: "clamp(40px, 9vw, 64px)",
                            background: COLORS.card,
                            borderRadius: 16,
                            padding: "clamp(20px, 5vw, 28px)",
                            boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "clamp(20px, 5vw, 32px)",
                            alignItems: "start",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "clamp(13px, 3.3vw, 15px)", fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", marginBottom: 8 }}>
                                Grade 10 Case Study
                            </div>
                            <h2 style={{ fontSize: "clamp(19px, 4.8vw, 22px)", fontWeight: 800, color: COLORS.ink, lineHeight: 1.35, margin: "0 0 12px" }}>
                                "From a 62% in Term 1 to a 91% on the Final Exam."
                            </h2>
                            <p style={{ fontSize: "clamp(13px, 3.2vw, 14px)", color: COLORS.inkSoft, lineHeight: 1.6, margin: "0 0 20px" }}>
                                "Before Mathmagick, homework time was stressful for Lucas — he'd get stuck, get frustrated, and start avoiding it altogether by turning to video games instead, which only made his grades slip further. In 9 weeks, his mentor rebuilt his understanding of math from the ground up. Now he actually gets it, and he's confident walking into a math test."
                            </p>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <img
                                    src="./vance_family.png"
                                    alt="Vance Family"
                                    loading="lazy"
                                    width="48"
                                    height="48"
                                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                />
                                <div>
                                    <div style={{ fontSize: "clamp(12.5px, 3.1vw, 13px)", fontWeight: 600, color: COLORS.ink }}>Claire &amp; Lucas Vance</div>
                                    <div style={{ fontSize: "clamp(11.5px, 2.9vw, 12px)", color: COLORS.muted }}>Killarney High School, Grade 10 Parent</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between h-[90%]" style={{ gap: 16 }}>
                            {[
                                { week: "Week 1", detail: "Diagnostic Intake", score: "62%", pct: 62, color: COLORS.errorBar },
                                { week: "Week 5", detail: "Mid-Accelerator Exam", score: "81%", pct: 81, color: COLORS.primary },
                                { week: "Week 10", detail: "Final Term Examination", score: "91%", pct: 91, color: COLORS.accent },
                            ].map((row) => (
                                <div key={row.week}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                                        <span>
                                            <span style={{ fontSize: "clamp(14.5px, 3.6vw, 16px)", fontWeight: 800, color: row.color }}>{row.week}</span>{" "}
                                            <span style={{ fontSize: "clamp(12px, 3vw, 13px)", color: COLORS.inkSoft }}>({row.detail})</span>
                                        </span>
                                        <span style={{ fontWeight: 700, color: row.color, fontSize: "clamp(13px, 3.2vw, 14px)" }}>{row.score}</span>
                                    </div>
                                    <div style={{ width: "100%", height: 12, background: COLORS.bg, borderRadius: 999, overflow: "hidden" }}>
                                        <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, borderRadius: 999 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Parent reviews */}
                    <div style={{ marginTop: "clamp(40px, 9vw, 64px)" }}>
                        <div style={{ textAlign: "center", marginBottom: "clamp(20px, 5vw, 28px)", padding: "0 8px" }}>
                            <div style={{ fontSize: "clamp(11px, 2.8vw, 12px)", fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                Parent Testimonials
                            </div>
                            <h2 style={{ fontSize: "clamp(21px, 5.5vw, 26px)", fontWeight: 800, color: COLORS.ink, margin: "8px 0" }}>
                                Real Transformations From Real Families
                            </h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(14px, 3.5vw, 20px)" }}>
                            {REVIEWS.map((r) => (
                                <div
                                    key={r.name}
                                    style={{
                                        background: COLORS.card,
                                        borderRadius: 14,
                                        padding: "clamp(18px, 4.5vw, 24px)",
                                        boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
                                    }}
                                >
                                    <Stars />
                                    <p style={{ fontSize: "clamp(13px, 3.2vw, 14px)", color: COLORS.ink, fontStyle: "italic", lineHeight: 1.6, margin: "12px 0 16px" }}>
                                        "{r.quote}"
                                    </p>
                                    <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                                        <img
                                            src={r.img}
                                            alt={r.name}
                                            loading="lazy"
                                            width="48"
                                            height="48"
                                            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                        />
                                        <div>
                                            <div style={{ fontSize: "clamp(12.5px, 3.1vw, 13px)", fontWeight: 600, color: COLORS.ink }}>{r.name}</div>
                                            <div style={{ fontSize: "clamp(11.5px, 2.9vw, 12px)", color: COLORS.muted }}>{r.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* What happens on the call */}
                    <div style={{ marginTop: "clamp(40px, 9vw, 64px)", textAlign: "center" }}>
                        <h2 style={{ fontSize: "clamp(19px, 5vw, 24px)", fontWeight: 800, color: COLORS.ink, margin: "0 0 10px" }}>
                            What Happens On Your Free Call?
                        </h2>
                        <p style={{ fontSize: "clamp(13px, 3.2vw, 14px)", color: COLORS.inkSoft, maxWidth: 480, margin: "0 auto clamp(20px, 5vw, 28px)", lineHeight: 1.6, padding: "0 8px" }}>
                            Zero high-pressure sales. Just actionable clarity on your student's exact math profile.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(12px, 3vw, 16px)", textAlign: "left" }}>
                            {CALL_STEPS.map((s, i) => (
                                <div key={s.title} style={{ background: COLORS.card, borderRadius: 14, padding: "clamp(16px, 4vw, 20px)" }}>
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
                                    <h3 style={{ fontSize: "clamp(14.5px, 3.6vw, 15px)", fontWeight: 700, color: COLORS.ink, margin: "0 0 6px" }}>{s.title}</h3>
                                    <p style={{ fontSize: "clamp(12.5px, 3.1vw, 13px)", color: COLORS.inkSoft, lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div
                        style={{
                            marginTop: "clamp(40px, 9vw, 64px)",
                            background: COLORS.ink,
                            borderRadius: 20,
                            padding: "clamp(32px, 8vw, 48px) clamp(18px, 4.5vw, 28px)",
                            textAlign: "center",
                        }}
                    >
                        <h2 style={{ fontSize: "clamp(22px, 5.5vw, 32px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.3 }}>
                            Give Your Child The Confidence To Ace Their Math Class
                        </h2>
                        <p style={{ fontSize: "clamp(13px, 3.2vw, 14px)", color: "rgba(255,255,255,0.7)", maxWidth: 460, margin: "0 auto clamp(20px, 5vw, 28px)", lineHeight: 1.6 }}>
                            Every week spent struggling widens the gap between your child and their peers. Book a free call to see how we can help them catch up and excel.
                        </p>
                        <button
                            onClick={bookCall}
                            style={{
                                width: "100%",
                                maxWidth: 360,
                                padding: "clamp(14px, 3.5vw, 16px) 16px",
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
                            <div style={{ fontSize: "clamp(15px, 3.8vw, 16px)", fontWeight: 700 }}>BOOK A FREECALL</div>
                            <div style={{ fontSize: "clamp(11px, 2.8vw, 12px)", fontWeight: 500, opacity: 0.9, marginTop: 2 }}>
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