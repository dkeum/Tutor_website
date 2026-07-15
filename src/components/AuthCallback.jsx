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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      Signing you in…
    </div>
  );
};

export default AuthCallback;