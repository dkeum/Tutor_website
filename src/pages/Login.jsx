import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { initializeState } from "../features/auth/personDetails";
import { supabase } from "../db/supabaseclient";
import { Calculator, Mail, Lock, ShieldCheck, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    setResponseMessage("");
    setIsGoogleSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Google OAuth failed:", error.message);
        setResponseMessage("Google sign-in failed. Please try again.");
        setIsGoogleSubmitting(false);
      }
      // On success the browser navigates away to Google, so no further
      // state update happens here — AuthCallback.jsx picks up from there.
    } catch (err) {
      console.error("Google OAuth error:", err);
      setResponseMessage("Google sign-in failed. Please try again.");
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setIsSubmitting(true);

    if (!email || !password || (!isLogin && password !== confirmPassword)) {
      setResponseMessage("Please fill all fields correctly.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setResponseMessage("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/login"
            : "https://mathamagic-backend.vercel.app/login",
          { email, password },
          { withCredentials: true }
        );

        await supabase.auth.setSession({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        });

        dispatch(initializeState({ data: response.data.student, email }));

        if (response.data.student.name === "") {
          navigate("/surveypersonaldetail");
        } else {
          navigate("/showpersonaldata");
        }
      } else {
        const response = await axios.post(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/signup"
            : "https://mathamagic-backend.vercel.app/signup",
          { email, password }
        );

        console.log("Signup successful:", response.data);
        setResponseMessage("Signup successful! Check your email for verification.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Authentication error:", error.response?.data || error.message);
      setResponseMessage(
        error.response?.data?.error || "Authentication failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9ff] text-[#101b30] tracking-normal flex flex-col relative overflow-hidden">

      {/* Dynamic Math Overlay Grid using the exact Star Blue color palette */}
      <style>{`
        .math-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(43, 86, 222, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 86, 222, 0.04) 1px, transparent 1px);
        }
        .floating-shape {
          position: absolute;
          z-index: 0;
          filter: blur(50px);
          opacity: 0.25;
          animation: float-orb 22s infinite alternate ease-in-out;
        }
        @keyframes float-orb {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(50px, 40px) rotate(10deg); }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer-effect 2s infinite;
        }
        @keyframes shimmer-effect {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Ambient Visual Ornaments */}
      <div className="absolute inset-0 math-grid pointer-events-none z-0" />
      <div className="floating-shape w-72 h-72 bg-[#cfdaf6] top-20 left-10 rounded-full" />
      <div className="floating-shape w-96 h-96 bg-[#a2b7f7] bottom-10 right-10 rounded-full" style={{ animationDelay: "-5s" }} />

      {/* Pinned Global Navigation Bar Layer */}
      <div className="w-full relative z-20">
        <Navbar />
      </div>

      {/* Main Content Body Shell Centerer */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 my-8">
        <main className="w-full max-w-[480px] tracking-normal">

          {/* Platform Identity Branding Header Block */}
          <div className="text-center mb-8 tracking-normal">
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#2b56de] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                <Calculator className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-[#2b56de] tracking-normal">Mathamagic</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#101b30] tracking-normal">
              {isLogin ? "Welcome back" : "Create Account"}
            </h1>
            <p className="text-[#494456] text-base mt-2 tracking-normal">
              {isLogin ? "Ready to master some more math today?" : "Join us to unlock your mathematical potential."}
            </p>
          </div>

          {/* Form Credentials Panel Card Assembly */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(43,86,222,0.06)] border border-[#e8edff] tracking-normal">
            <form className="space-y-5 tracking-normal" onSubmit={handleSubmit}>

              {/* Input: Email */}
              <div className="relative group tracking-normal">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7a7488] group-focus-within:text-[#2b56de] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus:border-[#2b56de] focus:bg-white transition-all peer tracking-normal"
                />
    
              </div>

              {/* Input: Password */}
              <div className="relative group tracking-normal">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7a7488] group-focus-within:text-[#2b56de] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus:border-[#2b56de] focus:bg-white transition-all peer tracking-normal"
                />
            
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-4 flex items-center text-[#7a7488] hover:text-[#2b56de] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Dynamic Sign up verification block */}
              {!isLogin && (
                <div className="relative group animate-[fadeIn_0.2s_ease-out] tracking-normal">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7a7488] group-focus-within:text-[#2b56de] transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus:border-[#2b56de] focus:bg-white transition-all peer tracking-normal"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-12 top-4 text-[#494456] text-sm font-medium transition-all pointer-events-none peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#2b56de] peer-[:not(:placeholder-shown)]:-translate-y-9 peer-[:not(:placeholder-shown)]:scale-90 tracking-normal"
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-4 flex items-center text-[#7a7488] hover:text-[#2b56de] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {/* Recovery trigger links */}
              {isLogin && (
                <div className="flex justify-end tracking-normal">
                  <a className="text-[#2b56de] text-sm font-bold hover:underline tracking-normal" href="#">
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Action Submit Pipeline Button Execution Trigger */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2b56de] text-white text-base font-bold py-4 rounded-xl shadow-md shadow-blue-100 active:scale-[0.98] transition-all hover:bg-[#1a43c7] relative overflow-hidden group disabled:opacity-70 disabled:pointer-events-none tracking-normal"
              >
                <div className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center tracking-normal">
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Log In" : "Sign Up"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Implicit Terms & Privacy Consent Notice — sign-up only */}
            {!isLogin && (
              <p className="text-xs text-[#7a7488] text-center mt-4 leading-relaxed tracking-normal">
                By signing up, you agree to our{" "}
                <a href="/terms" className="text-[#2b56de] font-semibold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#2b56de] font-semibold hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            )}

            {/* Response Errors Display Layout Node */}
            {responseMessage && (
              <p className="text-sm font-medium text-center text-rose-600 mt-4 animate-pulse tracking-normal">
                {responseMessage}
              </p>
            )}

            {/* Break Splitter Line segment element layout */}
            <div className="mt-6 flex items-center justify-center space-x-4 tracking-normal">
              <div className="h-[1px] flex-1 bg-[#e0e8ff]" />
              <span className="text-xs font-bold text-[#7a7488] tracking-normal">OR CONTINUE WITH</span>
              <div className="h-[1px] flex-1 bg-[#e0e8ff]" />
            </div>

            {/* Single Sign-on OAuth SSO Engine link button configuration */}
            <div className="mt-6 tracking-normal">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting}
                className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 rounded-xl border border-[#cbc3d9] hover:bg-[#f0f3ff] transition-all text-sm font-bold text-[#494456] active:scale-[0.98] tracking-normal cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
              >
                {isGoogleSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {/* Your Inline Google SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/>
                      <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"/>
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/>
                    </svg>
                    <span>Google</span>
                  </>
                )}
              </button>

              {/* Component Route State Mode Controller Toggles */}
              <div className="mt-8 text-center tracking-normal">
                <p className="text-[#494456] text-base tracking-normal">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin((prev) => !prev);
                      setResponseMessage("");
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                    }}
                    className="text-[#2b56de] font-bold hover:underline ml-1 tracking-normal cursor-pointer"
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default LoginSignup;