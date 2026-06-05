import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-family: 'Material Symbols Outlined';
  }

  .pricing-page {
    --color-primary: #1a4fd6;
    --color-on-primary: #ffffff;
    --color-primary-fixed: #dce9fd;
    --color-primary-container: #3b6ef0;
    --color-inverse-surface: #0f2a6e;
    --color-inverse-on-surface: #eef4ff;
    --color-surface: #faf8ff;
    --color-surface-container-lowest: #ffffff;
    --color-surface-container-low: #f0f4ff;
    --color-on-surface: #0d1b3e;
    --color-on-surface-variant: #3a4a6b;
    --color-outline-variant: #b8caf0;
    --color-secondary-container: #39b8fd;
    background-color: var(--color-surface);
    color: var(--color-on-surface);
    font-family: 'Inter', sans-serif;
    background-image:
      linear-gradient(to right, #e4e8f5 1px, transparent 1px),
      linear-gradient(to bottom, #e4e8f5 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* Typography — safe to leave unscoped, unique class names */
  .text-headline-xl {
    font-family: 'Manrope', sans-serif;
    font-size: 48px;
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-weight: 800;
  }
  .text-headline-lg {
    font-family: 'Manrope', sans-serif;
    font-size: 32px;
    line-height: 1.2;
    letter-spacing: -0.015em;
    font-weight: 700;
  }
  .text-headline-md {
    font-family: 'Manrope', sans-serif;
    font-size: 24px;
    line-height: 1.3;
    font-weight: 600;
  }
  .text-body-lg  { font-size: 18px; line-height: 1.6; font-weight: 400; }
  .text-body-md  { font-size: 16px; line-height: 1.5; font-weight: 400; }
  .text-body-sm  { font-size: 14px; line-height: 1.5; font-weight: 400; }
  .text-label-md { font-size: 12px; line-height: 1; letter-spacing: 0.05em; font-weight: 600; }

  /* Scoped colors */
  .pricing-page .text-primary          { color: var(--color-primary); }
  .pricing-page .text-on-surface       { color: var(--color-on-surface); }
  .pricing-page .text-on-surface-variant { color: var(--color-on-surface-variant); }
  .pricing-page .bg-primary            { background-color: var(--color-primary); }
  .pricing-page .bg-surface-container-lowest { background-color: var(--color-surface-container-lowest); }
  .pricing-page .bg-surface-container-low    { background-color: var(--color-surface-container-low); }

  /* Grid layout — NOT scoped so media queries work correctly */
  .pp-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
  .pp-faq-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }

  @media (min-width: 768px) {
    .pp-grid      { grid-template-columns: repeat(3, 1fr); }
    .pp-faq-grid  { grid-template-columns: repeat(2, 1fr); }
    .pp-col-span-2 { grid-column: span 2; }
    .pp-faq-header { flex-direction: row; }
    .pp-cta-inner  { flex-direction: row; }
  }

  @media (min-width: 1024px) {
    .pp-faq-grid { grid-template-columns: repeat(3, 1fr); }
    .pp-col-span-2 { grid-column: span 2; }
  }

  /* Unique component styles */
  .badge-popular {
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1a4fd6;
    color: #ffffff;
    padding: 4px 24px;
    border-radius: 9999px;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.05em;
    font-weight: 600;
    white-space: nowrap;
  }
  .pricing-card-highlight {
    box-shadow: 0 20px 25px -5px rgba(26,79,214,0.12), 0 10px 10px -5px rgba(26,79,214,0.06);
  }
  .cta-glow {
    position: absolute;
    right: 0; top: 0;
    width: 50%; height: 100%;
    background-color: rgba(26,79,214,0.12);
    filter: blur(120px);
    pointer-events: none;
  }
  .faq-circle-deco {
    display: none;
    width: 8rem; height: 8rem;
    border-radius: 9999px;
    background: linear-gradient(to top right, #1a4fd6, #39b8fd);
    opacity: 0.2;
    flex-shrink: 0;
  }
  @media (min-width: 768px) {
    .faq-circle-deco { display: block; }
  }
  .icon-box {
    width: 3rem; height: 3rem;
    background-color: rgba(26,79,214,0.1);
    border-radius: 0.5rem;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    color: #1a4fd6;
  }
  .pp-btn-outline {
    width: 100%; padding: 16px 24px;
    border: 1px solid #1a4fd6; color: #1a4fd6;
    border-radius: 0.5rem; background: transparent;
    cursor: pointer; font-size: 16px;
    transition: all 0.2s;
  }
  .pp-btn-outline:hover { background: rgba(26,79,214,0.05); }
  .pp-btn-outline:active { transform: scale(0.98); }
  .pp-btn-primary {
    width: 100%; padding: 16px 24px;
    background-color: #1a4fd6; color: #ffffff;
    border-radius: 0.5rem; border: none;
    cursor: pointer; font-size: 16px;
    box-shadow: 0 10px 15px -3px rgba(26,79,214,0.25);
    transition: all 0.2s;
  }
  .pp-btn-primary:hover { filter: brightness(1.1); }
  .pp-btn-primary:active { transform: scale(0.98); }
`;

const PricingPage = () => {
    return (
        <>
            <style>{styles}</style>
            <Navbar />
            <main className="pricing-page" style={{ minHeight: "100vh" }}>

                {/* Hero */}
                <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "64px 32px 48px", textAlign: "center" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", padding: "4px 16px",
                        borderRadius: "9999px", border: "1px solid rgba(26,79,214,0.2)",
                        backgroundColor: "rgba(26,79,214,0.08)", color: "#1a4fd6",
                        fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "24px"
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", marginRight: "4px" }}>school</span>
                        STUDENT SPECIAL PRICING
                    </div>
                    <h1 className="text-headline-xl text-on-surface" style={{ marginBottom: "16px" }}>Master Mathematics with AI</h1>
                    <p className="text-body-lg text-on-surface-variant" style={{ maxWidth: "42rem", margin: "0 auto" }}>
                        Join thousands of students achieving academic excellence through personalized AI tutoring and comprehensive study resources.
                    </p>
                </section>

                {/* Pricing Grid */}
                <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 32px 64px" }}>
                    <div className="pp-grid">

                        {/* Self-Study */}
                        <div className="bg-surface-container-lowest" style={{
                            border: "1px solid rgba(184,202,240,0.5)", padding: "32px",
                            borderRadius: "0.75rem", display: "flex", flexDirection: "column", height: "100%"
                        }}>
                            <div style={{ marginBottom: "48px" }}>
                                <h3 className="text-headline-md text-on-surface" style={{ marginBottom: "4px" }}>Self-Study</h3>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                                    <span className="text-headline-xl text-on-surface">$19</span>
                                    <span className="text-body-md text-on-surface-variant">/mo</span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant">The essentials for independent learners who want smarter study tools.</p>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1, marginBottom: "48px" }}>
                                {["Standard Course Access", "Basic Exam Prep Tools", "Basic AI Tutoring", "AI Powered Progress Tracking"].map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px" }}>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>check_circle</span>
                                        <span className="text-body-md">{f}</span>
                                    </li>
                                ))}
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px", opacity: 0.4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>cancel</span>
                                    <span className="text-body-md" style={{ textDecoration: "line-through" }}>1-on-1 Mentorship</span>
                                </li>
                            </ul>
                            <button className="pp-btn-outline">Choose Self-Study</button>
                        </div>

                        {/* Student Pro */}
                        <div className="pricing-card-highlight bg-surface-container-lowest" style={{
                            position: "relative", border: "2px solid #1a4fd6", padding: "32px",
                            borderRadius: "0.75rem", display: "flex", flexDirection: "column",
                            height: "100%", transform: "scale(1.05)", zIndex: 10
                        }}>
                            <div className="badge-popular">POPULAR CHOICE</div>
                            <div style={{ marginBottom: "48px" }}>
                                <h3 className="text-headline-md text-on-surface" style={{ marginBottom: "4px" }}>Student Pro</h3>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                                    <span className="text-headline-xl text-on-surface">$49</span>
                                    <span className="text-body-md text-on-surface-variant">/mo</span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant">Advanced AI features and personalized guidance for grade optimization.</p>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1, marginBottom: "48px" }}>
                                {["Priority Course Access", "Advanced Exam Simulators", "Stronger AI Support", "AI Powered Progress Tracking", "Personalized Study Plans"].map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px" }}>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>check_circle</span>
                                        <span className="text-body-md" style={{ fontWeight: 600 }}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="pp-btn-primary">Get Student Pro</button>
                        </div>

                        {/* Academic Excellence */}
                        <div className="bg-surface-container-lowest" style={{
                            border: "1px solid rgba(184,202,240,0.5)", padding: "32px",
                            borderRadius: "0.75rem", display: "flex", flexDirection: "column", height: "100%"
                        }}>
                            <div style={{ marginBottom: "48px" }}>
                                <h3 className="text-headline-md text-on-surface" style={{ marginBottom: "4px" }}>Academic Excellence</h3>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                                    <span className="text-headline-xl text-on-surface">$249</span>
                                    <span className="text-body-md text-on-surface-variant">/mo</span>
                                </div>
                              <p className="text-body-sm text-on-surface-variant">For high-achievers tackling advanced courses and seeking direct expert mentorship.</p>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1, marginBottom: "48px" }}>
                                {["All Premium Features", "Fast Support"].map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px" }}>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>check_circle</span>
                                        <span className="text-body-md">{f}</span>
                                    </li>
                                ))}
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px" }}>
                                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>check_circle</span>
                                    <span className="text-body-md text-primary" style={{ fontWeight: 700 }}>1-on-1 Weekly Mentorship</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px" }}>
                                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>check_circle</span>
                                    <span className="text-body-md text-left">Unlock Upper-Level Courses (AP Calculus, IB HL Math, Pre-Cal 12 & more)</span>
                                </li>
                            </ul>
                            <button className="pp-btn-outline">Contact for Excellence</button>
                        </div>

                    </div>
                </section>

                {/* FAQ Section */}
                <section style={{ backgroundColor: "var(--color-surface-container-low)", padding: "64px 0" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 32px" }}>
                        <div className="pp-faq-header" style={{
                            display: "flex", flexDirection: "column",
                            justifyContent: "space-between", alignItems: "flex-end",
                            marginBottom: "48px", gap: "24px"
                        }}>
                            <div style={{ maxWidth: "36rem" }}>
                                <h2 className="text-headline-lg text-on-surface" style={{ marginBottom: "8px" }}>Common Questions</h2>
                                <p className="text-body-md text-on-surface-variant">Everything you need to know about navigating your academic journey with Mathamagic.</p>
                            </div>
                            <button style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                fontWeight: 600, background: "none", border: "none",
                                cursor: "pointer", color: "#1a4fd6", fontSize: "16px"
                            }}>
                                Visit Help Center
                                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_forward</span>
                            </button>
                        </div>

                        <div className="pp-faq-grid">
                            {[
                                { icon: "event_busy", title: "What happens during school breaks?", body: "You can pause your subscription for up to 3 months a year. Your progress, study library, and tutor matches remain saved until you return." },
                                { icon: "person_search", title: "How does tutor matching work?", body: "Our AI analyzes your learning style and weak points to match you with a tutor specialized in your specific math curriculum (AP, IB, GCSE, etc.)." },
                                { icon: "card_giftcard", title: "Is there a free trial?", body: "Yes! Every new student gets a 7-day full access trial to Student Pro. No credit card is required to start exploring the study library." },
                            ].map(({ icon, title, body }) => (
                                <div key={title} className="bg-surface-container-lowest" style={{
                                    padding: "32px", borderRadius: "0.75rem",
                                    border: "1px solid rgba(184,202,240,0.3)"
                                }}>
                                    <div className="icon-box"><span className="material-symbols-outlined">{icon}</span></div>
                                    <h4 className="text-body-lg text-on-surface" style={{ fontWeight: 700, marginBottom: "8px" }}>{title}</h4>
                                    <p className="text-body-sm text-on-surface-variant">{body}</p>
                                </div>
                            ))}

                            {/* Wide card */}
                            <div className="pp-col-span-2 bg-surface-container-lowest" style={{
                                padding: "32px", borderRadius: "0.75rem",
                                border: "1px solid rgba(184,202,240,0.3)",
                                display: "flex", flexDirection: "row", gap: "32px", alignItems: "center"
                            }}>
                                <div style={{ flex: 1 }}>
                                    <h4 className="text-body-lg text-on-surface" style={{ fontWeight: 700, marginBottom: "8px" }}>Academic Institutional Discount</h4>
                                    <p className="text-body-sm text-on-surface-variant" style={{ marginBottom: "16px" }}>We offer enterprise pricing for schools and educational institutions. If you're an educator, we can help bring Mathamagic to your entire classroom.</p>
                                    <a style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1a4fd6", fontSize: "12px" }} href="#">Learn About EDU Plans →</a>
                                </div>
                                <div className="faq-circle-deco" />
                            </div>

                            {/* CTA card */}
                            <div className="bg-primary" style={{
                                padding: "32px", borderRadius: "0.75rem",
                                border: "1px solid #1a4fd6", color: "#ffffff"
                            }}>
                                <h4 className="text-body-lg" style={{ fontWeight: 700, marginBottom: "8px" }}>Still have questions?</h4>
                                <p className="text-body-sm" style={{ marginBottom: "24px", opacity: 0.9 }}>Our academic advisors are available 24/7 to help you choose the right plan for your goals.</p>
                                <button style={{
                                    backgroundColor: "#ffffff", color: "#1a4fd6", padding: "8px 24px",
                                    borderRadius: "0.5rem", fontWeight: 600, border: "none", cursor: "pointer"
                                }}>Chat With Us</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "64px 32px" }}>
                    <div className="pp-cta-inner" style={{
                        position: "relative", backgroundColor: "#0f2a6e", borderRadius: "1rem",
                        overflow: "hidden", padding: "48px", display: "flex",
                        flexDirection: "column", alignItems: "center",
                        justifyContent: "space-between", gap: "32px"
                    }}>
                        <div style={{ position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none" }}>
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#cta-grid)" />
                            </svg>
                        </div>
                        <div style={{ position: "relative", zIndex: 10, maxWidth: "36rem" }}>
                            <h2 className="text-headline-lg" style={{ color: "#eef4ff", marginBottom: "16px" }}>Ready to ace your next exam?</h2>
                            <p className="text-body-lg" style={{ color: "rgba(238,244,255,0.8)" }}>Join 50,000+ students already using Mathamagic AI to transform their grades.</p>
                        </div>
                        <div style={{ position: "relative", zIndex: 10, display: "flex", flexWrap: "wrap", gap: "16px" }}>
                            <button style={{
                                padding: "16px 32px", backgroundColor: "#1a4fd6", color: "#ffffff",
                                borderRadius: "0.5rem", fontWeight: 700, border: "none", cursor: "pointer",
                                boxShadow: "0 4px 14px rgba(26,79,214,0.4)"
                            }}>Start Your Free Trial</button>
                            <button style={{
                                padding: "16px 32px", border: "1px solid rgba(238,244,255,0.3)",
                                color: "#eef4ff", borderRadius: "0.5rem", fontWeight: 600,
                                backgroundColor: "transparent", cursor: "pointer"
                            }}>View Success Stories</button>
                        </div>
                        <div className="cta-glow" />
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
};

export default PricingPage;