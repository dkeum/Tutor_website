import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import BackgroundWrapper from "../components/BackgroundWrapper";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // 👈 New state for API message

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(""); // Reset message on new submit

    if (!email || !password || (!isLogin && password !== confirmPassword)) {
      setResponseMessage("Please fill all fields correctly.");
      return;
    }

    if (password.length < 6) {
      setResponseMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(
          process.env.ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/login"
            : "https://mathamagic-backend.vercel.app/login",
          {
            email,
            password,
          },
          {
            withCredentials: true, // ⬅️ very important!
          }
        );

        navigate("/showpersonaldata"); // ← redirect
      } else {
        const response = await axios.post(
          process.env.ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/signup"
            : "https://mathamagic-backend.vercel.app/signup",
          {
            email,
            password,
          }
        );

        console.log("Signup successful:", response.data);
        setResponseMessage("Signup successful! You can now log in.");
        setIsLogin(true); // Optionally switch to login form
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setResponseMessage(
        error.response?.data?.error || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <BackgroundWrapper>
        <form className="tracking-normal" onSubmit={handleSubmit}>
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? "Login" : "Sign Up"}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? "Enter your email and password to log in"
                  : "Create an account by filling the form below"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-full">
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </div>

              {responseMessage && (
                <p className="text-sm text-red-600 mt-4 text-center">
                  {responseMessage}
                </p>
              )}

              <div className="flex flex-col gap-y-5 items-center justify-center pt-5">
                <hr className="w-2/3 h-[2px] bg-slate-500" />
                <button
                  type="button"
                  className="font-bold text-sm hover:underline"
                  onClick={() => {
                    setIsLogin((prev) => !prev);
                    setResponseMessage(""); // Clear message on switch
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Login"}
                </button>
              </div>
            </CardContent>
          </Card>
        </form>
      </BackgroundWrapper>
    </div>
  );
};

export default LoginSignup;
