import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { supabase } from "../db/supabaseclient";

const getBaseUrl = () =>
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

// Route: /auth/callback
const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Guard to prevent Strict Mode double-firing
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const finishLogin = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        console.error("No session after Google redirect:", error?.message);
        navigate("/login?error=google_auth_failed");
        return;
      }

      const { access_token, refresh_token } = data.session;

      try {
        const res = await axios.post(
          `${getBaseUrl()}/auth/google-session`,
          { access_token, refresh_token },
          { withCredentials: true }
        );

        // If the student hasn't set a class yet, send them through the
        // onboarding survey first. Otherwise they've already completed
        // it, so go straight to their profile.
        if (res.data?.hasClass) {
          navigate("/showpersonaldata");
        } else {
          navigate("/surveypersonaldetail");
        }
      } catch (err) {
        navigate("/login?error=session_exchange_failed");
      }
    };

    finishLogin();
  }, [navigate]);

  return (
    <div className="auth-callback-loader">
      <style>{`
        .auth-callback-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
      
        }

        .loader-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }

        .loader-glyph {
          position: relative;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(99, 91, 255, 0.15);
          border-top-color: #5b4bff;
          animation: spin 1s linear infinite;
        }

        .loader-symbol {
          font-family: "Georgia", serif;
          font-style: italic;
          font-size: 30px;
          font-weight: 600;
          color: #4936e0;
          animation: pulse 1.6s ease-in-out infinite;
        }

        .loader-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #3c3560;
          letter-spacing: 0.2px;
        }

        .loader-text .dots span {
          animation: blink 1.4s infinite;
          opacity: 0;
        }
        .loader-text .dots span:nth-child(2) { animation-delay: 0.2s; }
        .loader-text .dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        @keyframes blink {
          0%, 20% { opacity: 0; }
          40% { opacity: 1; }
          100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-ring, .loader-symbol, .loader-text .dots span {
            animation: none;
          }
        }
      `}</style>

      <div className="loader-card">
        <div className="loader-glyph">
          <div className="loader-ring" />
          <span className="loader-symbol">√</span>
        </div>
        <p className="loader-text">
          Signing you in
          <span className="dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;