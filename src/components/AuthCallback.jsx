import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { supabaseBrowser } from "../lib/supabaseBrowserClient";
// import { setProfileInfo } from "../store/personDetailSlice"; // wire up if you dispatch profile info here

const getBaseUrl = () =>
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

// Route: /auth/callback
const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const finishLogin = async () => {
      // supabase-js already parsed the redirect URL (detectSessionInUrl: true)
      // by the time this component mounts — just read the session it found.
      const { data, error } = await supabaseBrowser.auth.getSession();

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
          { withCredentials: true } // lets the backend set its httpOnly cookie
        );

        // Same place you'd normally dispatch setProfileInfo after a
        // password login — plug in your existing profile-fetch here.
        navigate("/showpersonaldata");
      } catch (err) {
        console.error("Backend session exchange failed:", err?.response?.data || err.message);
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