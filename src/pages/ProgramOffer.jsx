import React from "react";

/* ---------- Edit these to match your real program ---------- */
const CONFIG = {
    bookingUrl: "/calendar-booking",
    weeks: 12,
    groupMinutes: 60,
    groupMaxSize: 5,
    oneOnOneMinutes: 60,
    oneOnOnePerWeek: 1,
    groupPerWeek: 1,
};

const MENTORS = [
    { name: "Daniel Keum", bio: "Math Teacher and Engineer with a decade of experience teaching math like precalculus 9-12, AP Calculus AB/BC, IB Math HL." },
];

const TESTIMONIALS = [
    { name: "Hudson", from: 60, to: 79, note: "over 12 weeks" },
    { name: "Audrina", from: 52, to: 84, note: "Math 9, over 12 weeks" },
    { name: "Suvi", from: 52, to: 77, note: "" },
    { name: "Naya", from: 70, to: 86, note: "" },
];

const STEPS = [
    ["Assessment", "We test your teen from Grade 6 up to their current course, so we find the real gaps (fractions, integers, ratios, early algebra), not just this term’s trouble spots."],
    ["Build the foundation", "In small-group sessions, students with the same gaps rebuild core algebra and number skills together."],
    ["Apply it one-on-one", "Individual sessions follow your teen’s actual class: this month’s unit, upcoming tests, and the homework they’re stuck on."],
    ["Challenge", "Word problems, tougher numeracy questions, and exam-style practice, once the foundation holds."],
    ["Practice and track", `Our software sets questions at the right difficulty. Check-ins at the start, middle, and end of the ${CONFIG.weeks} weeks keep the plan on track.`],
];

const ANXIETY = [
    ["Low-stakes timed practice", "Short, ungraded timed sets that build up to test conditions, so the clock stops being a threat."],
    ["A stuck-in-a-test routine", "A simple plan for when the mind goes blank: reread, write what you know, skip, return."],
    ["Mistakes are data", "Every error is reviewed as a clue to a specific gap. Mentors model this out loud, so errors feel normal."],
];

const INCLUDED = [
    ["One-on-one sessions", `${CONFIG.oneOnOnePerWeek} per week, ${CONFIG.oneOnOneMinutes} minutes. Personal attention on your teen’s own gaps and school work.`],
    ["Small-group foundation classes", `${CONFIG.groupPerWeek} per week, ${CONFIG.groupMinutes} minutes, max ${CONFIG.groupMaxSize} students grouped by shared gaps. Instruction first, then guided practice.`],
    ["Foundation Building Software", "Questions from basic to challenging, progress tracked automatically, reports sent to you."],
    ["Weekly practice target", "A clear amount of practice each week. Parents see what was completed, not only the scores."],
    ["Monthly progress calls", "We review progress, adjust the plan, and answer questions before gaps grow."],
    ["Office hours", "Drop-in time outside scheduled sessions for school or program questions."],
    ["Tech set-up session", "We walk you through logins and software so the first week is spent on math."],
    ["Curriculum roadmap", "A step-by-step sequence that builds skills from the ground up."],
];

const WEEK = [
    ["Group class", "Rebuild a foundation skill with up to 5 peers who share the gap."],
    ["Mid-week practice", "Software practice at your teen’s level, with a weekly target."],
    ["One-on-one session", "Apply it to school work: homework, the current unit, test prep."],
    ["Office hours", "Drop in with a specific question when stuck."],
];

const BENEFITS = [
    ["Stronger foundations", "Your teen understands the key concepts and can apply them independently."],
    ["Better grades", "Targeted practice and a structured plan. Our students’ results are shown below; every student is different."],
    ["More confidence", "Hard topics are broken down so progress is visible and real."],
    ["Less stress", "Homework and tests feel manageable instead of overwhelming."],
    ["Personal support", "Individual sessions mean no one is left behind in a group."],
];

const FIT = [
    "Feels overwhelmed or anxious tackling math, especially under test pressure.",
    "Needs a clear plan that strengthens weak areas and rebuilds the foundation.",
    "Wants to raise their math grade and solve problems independently.",
    "Would benefit from a structured system that builds confidence.",
];

/*
  Layout rule: every <section> is a full-width band (plain or .tint).
  The content inside always sits in a <div className="wrap">.
  All text colors are set explicitly so global app styles can't override them.
*/
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;700;800&display=swap');
.mf{--ink:#1d1b3a;--body:#3a3860;--muted:#5a5880;--brand:#4441c4;--soft:#e9e8fb;--line:#c7c4d6;--bg:#ffffff;--gold:#f5c04a;
 width:100%;margin:0;text-align:left;color-scheme:light;
 font-family:'Hanken Grotesk',system-ui,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6;font-size:17px}
.mf *{box-sizing:border-box}
.mf h1,.mf h2,.mf h3{color:var(--ink);margin:0;font-family:inherit}
.mf p,.mf li,.mf small{color:var(--body)}
.mf p{margin:0 0 12px;max-width:62ch}
.mf h1{font-size:clamp(2rem,5vw,3.4rem);line-height:1.1;font-weight:800;margin-bottom:20px;max-width:18em;letter-spacing:-.02em}
.mf h2{font-size:clamp(1.5rem,3vw,2rem);line-height:1.2;font-weight:800;margin-bottom:12px;letter-spacing:-.01em}
.mf h3{font-size:1.1rem;font-weight:700;margin-bottom:6px}

/* bands + container */
.mf section{width:100%;padding-top:56px;padding-bottom:56px;background:var(--bg)}
.mf section.tint{background:var(--soft)}
.mf .wrap{max-width:1040px;margin-left:auto;margin-right:auto;padding-left:24px;padding-right:24px}

/* header */
.mf header.top{background:var(--bg);border-bottom:1px solid var(--line)}
.mf header.top .wrap{display:flex;align-items:center;gap:12px;padding-top:16px;padding-bottom:16px}
.mf header.top img{height:44px;width:auto;display:block}
.mf .brand{font-size:1.4rem;font-weight:800;color:var(--brand);letter-spacing:-.01em}

.mf .hero{padding-top:56px;padding-bottom:64px}
.mf .btn{display:inline-block;background:var(--brand);color:#fff;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:10px;margin-top:8px}
.mf .btn:hover{background:#3532a0;color:#fff}
.mf a:focus-visible{outline:3px solid var(--gold);outline-offset:3px}

.mf .two{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start}
.mf .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:24px}
.mf .item{border-left:4px solid var(--brand);padding:4px 0 4px 16px}
.mf .item p{margin:0}
.mf ul.fit{list-style:none;padding:0;margin:20px 0 0;display:grid;gap:12px}
.mf ul.fit li{padding-left:28px;position:relative;max-width:62ch}
.mf ul.fit li::before{content:"✓";position:absolute;left:0;color:var(--brand);font-weight:800}
.mf ol.steps{list-style:none;padding:0;margin:24px 0 0;counter-reset:s;display:grid;gap:18px}
.mf ol.steps li{counter-increment:s;display:grid;grid-template-columns:44px 1fr;gap:16px}
.mf ol.steps li::before{content:counter(s);width:44px;height:44px;border-radius:50%;background:var(--brand);color:#fff;font-weight:800;display:grid;place-items:center}

/* dark panel: light text on dark */
.mf .format{background:var(--ink);border-radius:16px;padding:32px;margin-top:24px}
.mf .format .two{gap:24px}
.mf .format h3{color:var(--gold);font-size:1.25rem}
.mf .format p{color:#e4e3f5}

/* white cards on tinted bands */
.mf .week{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:24px}
.mf .day,.mf .res{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px}
.mf .results{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.mf .res{padding:20px}
.mf .res b{display:block;font-size:2rem;font-weight:800;color:var(--brand);line-height:1.1}
.mf .res small{color:var(--muted)}
.mf .fine{font-size:.9rem;color:var(--muted);margin-top:20px}

/* call to action: white text on brand */
.mf .cta{background:var(--brand);border-radius:20px;padding:44px 32px;text-align:center}
.mf .cta h2{color:#fff}
.mf .cta p{margin:0 auto 12px;color:#e9e8ff}
.mf .cta .btn{background:var(--gold);color:var(--ink)}
.mf .cta .btn:hover{background:#ffd06b;color:var(--ink)}

.mf footer{background:var(--ink)}
.mf footer .wrap{padding-top:28px;padding-bottom:28px;color:#c9c8e6;font-size:.9rem}

@media (max-width:760px){.mf .two{grid-template-columns:1fr}.mf section{padding-top:40px;padding-bottom:40px}.mf .hero{padding-top:36px}}
`;

const Cards = ({ items, cls = "item" }) => (
    <div className="grid">
        {items.map(([t, d]) => (
            <div className={cls} key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
            </div>
        ))}
    </div>
);

const Steps = ({ items }) => (
    <ol className="steps">
        {items.map(([t, d]) => (
            <li key={t}>
                <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                </div>
            </li>
        ))}
    </ol>
);

export default function ProgramOffer() {
    return (
        <div className="mf">
            <style>{CSS}</style>

            <header className="top">
                <div className="wrap">
                    <img src="./logo.png" alt="MathMagick logo" />
                    <span className="brand">MathMagick</span>
                </div>
            </header>

            <main>
                <section className="hero">
                    <div className="wrap">
                        <h1>Help your teen build real math confidence, raise their grade, and stop dreading homework</h1>
                    </div>
                </section>

                <section className="tint">
                    <div className="wrap">
                        <h2>This Math Foundations Program is for students who</h2>
                        <ul className="fit">
                            {FIT.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <h2>What we do and why it works</h2>
                        <p>
                            At MathMagick we build tailored learning plans that help Grade 9-10 students succeed in math. We simplify complex concepts, break down the barriers behind math fear, and help students learn to solve problems on their own.
                        </p>
                        <p>
                            Struggling students rarely share the same gaps, so we combine two formats. One-on-one sessions focus on each student’s individual needs. Small-group classes rebuild the shared foundation, so students learn together without being held back by each other’s gaps.
                        </p>
                        <div className="format">
                            <div className="two">
                                <div>
                                    <h3>One-on-one sessions</h3>
                                    <p>Your teen’s own gaps, school units, homework, and test prep. This is where the plan is personalized and tied to their actual class.</p>
                                </div>
                                <div>
                                    <h3>Small-group foundation classes</h3>
                                    <p>Up to {CONFIG.groupMaxSize} students with similar gaps, {CONFIG.groupMinutes} minutes per class. Instruction first, then guided practice, with peers who are rebuilding the same skills.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tint">
                    <div className="wrap">
                        <h2>How it works</h2>
                        <Steps items={STEPS} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <h2>How we help with math anxiety</h2>
                        <p>Confidence comes from competence, and from having a plan for the hard moments. Your teen learns specific techniques, not just encouragement.</p>
                        <Cards items={ANXIETY} />
                    </div>
                </section>

                <section className="tint">
                    <div className="wrap">
                        <h2>A typical week</h2>
                        <p>The program runs {CONFIG.weeks} weeks. Each week mixes group foundation work, individual sessions, and practice your teen can do on their own schedule.</p>
                        <div className="week">
                            {WEEK.map(([t, d]) => (
                                <div className="day" key={t}>
                                    <h3>{t}</h3>
                                    <p>{d}</p>
                                </div>
                            ))}
                        </div>
                        <p className="fine">After {CONFIG.weeks} weeks we review results together and recommend next steps, whether that is continuing, moving to maintenance sessions, or finishing.</p>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <h2>What’s included</h2>
                        <Cards items={INCLUDED} />
                    </div>
                </section>

                <section className="tint">
                    <div className="wrap">
                        <h2>Meet your mentors</h2>
                        <Cards items={MENTORS.map((m) => [m.name, m.bio])} />

                        <img src="./my_picture.jpg" className="rounded-full my-3" alt="Mentor" />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <h2>Benefits of math tutoring</h2>
                        <Cards items={BENEFITS} />
                    </div>
                </section>

                <section className="tint">
                    <div className="wrap">
                        <h2>What other students have achieved</h2>
                        <div className="results">
                            {TESTIMONIALS.map((t) => (
                                <div className="res" key={t.name}>
                                    <b>{t.from}% to {t.to}%</b>
                                    <p style={{ margin: "6px 0 0" }}>{t.name}</p>
                                    {t.note && <small>{t.note}</small>}
                                </div>
                            ))}
                        </div>
                        <p className="fine">Individual results vary and depend on the student’s starting point and effort. Shared with family permission.</p>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <h2>Next steps</h2>
                        <Steps
                            items={[
                                ["Note your questions", "Write down any questions or ideas from this page. We’ll cover them on the call."],
                                ["Enroll and begin", "Your teen starts the assessment and lessons right away."],
                            ]}
                        />
                    </div>
                </section>


            </main>

            <footer>
                <div className="wrap">MathMagick · Math Foundations Program</div>
            </footer>
        </div>
    );
}