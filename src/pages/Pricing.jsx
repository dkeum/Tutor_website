import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hook/useAuthSession";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import LoggedInLayout from "../components/LoggedInLayout";
import { School2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { supabase } from "../db/supabaseclient";
import { setProfileInfo } from "../features/auth/personDetails";
import { useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-family: 'Material Symbols Outlined';
  }

  .pricing-page-container {
     display: flex;
     flex-direction: column;
     width: 100%;
     min-height: 100vh;
  }
  .pricing-content-fluid {
     flex-grow: 1;
     width: 100%;
     display: flex;
     flex-direction: column;
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
    flex-grow: 1;
  }

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

  .pricing-page .text-primary          { color: var(--color-primary); }
  .pricing-page .text-on-surface       { color: var(--color-on-surface); }
  .pricing-page .text-on-surface-variant { color: var(--color-on-surface-variant); }
  .pricing-page .bg-primary            { background-color: var(--color-primary); }
  .pricing-page .bg-surface-container-lowest { background-color: var(--color-surface-container-lowest); }
  .pricing-page .bg-surface-container-low    { background-color: var(--color-surface-container-low); }

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
    const { session } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // console.log(session)
    const isLoggedIn = !!session;

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


                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Error initializing session:", err);
            }
        };
        if (session) {

            initializeUserSession();
        }

    }, [dispatch, navigate]); // Removed 'name' from dependencies to prevent infinite loop/re-runs


    // Every plan action funnels through here first. If the user isn't
    // logged in, they're sent to /login instead of triggering checkout.
    // Every plan action funnels through here first. If the user isn't
    // logged in, they're sent to /login instead of triggering checkout.
    const handleCheckout = async (planType) => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            // Pull a fresh session/token rather than relying on the possibly
            // stale `session` from component state — access tokens expire.
            const {
                data: { session: freshSession },
            } = await supabase.auth.getSession();

            if (!freshSession) {
                navigate("/login");
                return;
            }

            const email = freshSession.user.email;

            const response = await axios.post(
                import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
                    ? "http://localhost:3000/payment/create-checkout-session"
                    : "https://mathamagic-backend.vercel.app/payment/create-checkout-session",
                { email, plan: planType },
                {
                    headers: {
                        Authorization: `Bearer ${freshSession.access_token}`,
                    },
                    withCredentials: true,
                }
            );
            window.location.href = response.data.url;
        } catch (err) {
            console.error("Checkout error:", err);
        }
    };

    // Same login gate for the "AI & Tutor Support" tier, which routes to
    // /contact instead of Stripe checkout.
    const handleContactPlan = () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        navigate("/contact");
    };

    // FAQ's "Chat With Us" also routes to /contact — same gate, so every
    // clickable action on this page requires a session first.
    const handleChatWithUs = () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        navigate("/contact");
    };

    const pageContent = (
        <>
            <style>{styles}</style>

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
                        EARLY STUDENT SPECIAL PRICING
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
                                {["Standard Course Access", "Basic Exam Simulator", "Basic AI Tutoring", "AI Powered Progress Tracking"].map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px" }}>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>check_circle</span>
                                        <span className="text-body-md">{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handleCheckout("self_study")} className="pp-btn-outline">Choose Self-Study</button>
                        </div>

                        {/* Student Pro */}
                        <div className="pricing-card-highlight bg-surface-container-lowest" style={{
                            position: "relative", border: "2px solid #1a4fd6", padding: "32px",
                            borderRadius: "0.75rem", display: "flex", flexDirection: "column",
                            height: "100%", transform: "scale(1.05)", zIndex: 10
                        }}>
                            <div className="badge-popular mt-1">BEST VALUE</div>
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
                            <button onClick={() => handleCheckout("student_pro")} className="pp-btn-primary">
                                {isLoggedIn ? "Upgrade to Student Pro" : "Get Student Pro"}
                            </button>
                        </div>

                        {/* AI & Tutor Support (hybrid, contact-only, no price) */}
                        <div className="bg-surface-container-lowest" style={{
                            border: "1px solid rgba(184,202,240,0.5)", padding: "32px",
                            borderRadius: "0.75rem", display: "flex", flexDirection: "column", height: "100%"
                        }}>
                            <div style={{ marginBottom: "48px" }}>
                                <h3 className="text-headline-md text-on-surface" style={{ marginBottom: "4px" }}>AI &amp; Tutor Support</h3>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                                    <span className="text-headline-lg text-on-surface">Custom</span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant">A hybrid plan combining Mathmagick's AI tools with real tutor support, tailored to your needs.</p>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1, marginBottom: "48px" }}>
                                {["Everything in Student Pro", "Opt-in Human Tutor Sessions", "Flexible Scheduling", "Personalized Pricing Based on Needs"].map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px" }}>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>check_circle</span>
                                        <span className="text-body-md text-left">{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleContactPlan} className="pp-btn-outline">Contact Us</button>
                        </div>

                    </div>
                </section>

                {/* FAQ Section */}
                <section style={{ backgroundColor: "var(--color-surface-container-low)", padding: "64px 0" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 32px" }}>
                        <div className="pp-faq-header" style={{
                            display: "flex", flexDirection: "column",
                            marginBottom: "48px", gap: "24px"
                        }}>
                            <div className="mx-auto" style={{ maxWidth: "36rem" }}>
                                <h2 className="text-headline-lg text-on-surface " style={{ marginBottom: "8px" }}>Common Questions</h2>
                                <p className="text-body-md text-on-surface-variant">Everything you need to know about navigating your academic journey with Mathmagick.</p>
                            </div>
                        </div>

                        <div className="pp-faq-grid">
                            {[
                                { icon: "event_busy", title: "What happens during school breaks?", body: "You can pause your subscription for up to 3 months a year. Your progress, study library, and tutor matches remain saved until you return." },
                                { icon: "person_search", title: "How does tutor matching work?", body: "Our AI analyzes your learning style and weak points to match you with a tutor specialized in your specific math curriculum (AP, IB, GCSE, etc.)." },
                                { icon: "card_giftcard", title: "Is there a free trial?", body: "Yes! Every new student gets a 7-day full access trial to Student Pro." },
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
                                    <p className="text-body-sm text-on-surface-variant" style={{ marginBottom: "16px" }}>We offer enterprise pricing for schools and educational institutions. If you're an educator, we can help bring Mathmagick to your entire classroom.</p>
                                    <a style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1a4fd6", fontSize: "12px" }} href="#">Learn About EDU Plans →</a>
                                </div>
                                <div style={{ position: "relative", width: "8rem", height: "8rem", flexShrink: 0 }}>
                                    <div className="faq-circle-deco" style={{ position: "absolute", inset: 0 }} />
                                    <School2
                                        size={48}
                                        color="#1a4fd6"
                                        style={{ position: "absolute", inset: 0, margin: "auto" }}
                                    />
                                </div>
                            </div>

                            {/* CTA card */}
                            <div className="bg-primary" style={{
                                padding: "32px", borderRadius: "0.75rem",
                                border: "1px solid #1a4fd6", color: "#ffffff"
                            }}>
                                <h4 className="text-body-lg" style={{ fontWeight: 700, marginBottom: "8px" }}>Still have questions?</h4>
                                <p className="text-body-sm" style={{ marginBottom: "24px", opacity: 0.9 }}>Our academic advisors are available 24/7 to help you choose the right plan for your goals.</p>
                                <button
                                    onClick={handleChatWithUs}
                                    style={{
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
                            <p className="text-body-lg" style={{ color: "rgba(238,244,255,0.8)" }}>Join students already improving their grades with Mathmagick.</p>
                        </div>
                        <div style={{ position: "relative", zIndex: 10, display: "flex", flexWrap: "wrap", gap: "16px" }}>
                            <button
                                onClick={() => handleCheckout("student_pro")}
                                style={{
                                    padding: "16px 32px", backgroundColor: "#1a4fd6", color: "#ffffff",
                                    borderRadius: "0.5rem", fontWeight: 700, border: "none", cursor: "pointer",
                                    boxShadow: "0 4px 14px rgba(26,79,214,0.4)"
                                }}
                            >
                                {isLoggedIn ? "Activate My Pro Account" : "Start Your Free Trial"}
                            </button>
                        </div>
                        <div className="cta-glow" />
                    </div>
                </section>

            </main>

            {!isLoggedIn && <Footer />}
        </>
    );

    // Logged-in users get the full app shell (navbar + sidebar via
    // LoggedInLayout). Everyone else gets just the plain marketing Navbar.
    if (isLoggedIn) {
        return (
            <div className="pricing-page-container">
                <LoggedInLayout>
                    {pageContent}
                </LoggedInLayout>
            </div>
        );
    }

    return (
        <div className="pricing-page-container">
            <div className="pricing-content-fluid">
                <Navbar />
                {pageContent}
            </div>
        </div>
    );
};

export default PricingPage;