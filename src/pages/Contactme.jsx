import React, { useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/text-area";
import axios from "axios";

// Zod Schema
const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(5, "Message must be at least 5 characters."),
});

const Contactme = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSent(false);

    const formData = { fullName, email, message };
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    axios
      .post("https://mathamagic-backend.vercel.app/email", {
        fullName,
        email,
        message,
      })
      .then((response) => {
        console.log("Server response:", response.data);
        setIsSent(true);
      })
      .catch((error) => {
        console.error(
          "Error sending email:",
          error.response?.data || error.message
        );
        console.log("Error detected");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9ff] text-[#101b30] tracking-normal flex flex-col relative overflow-hidden">
      
      {/* Background Grid using your exact Star Blue palette */}
      <style>{`
        .math-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(43, 86, 222, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 86, 222, 0.04) 1px, transparent 1px);
        }
      `}</style>

      <div className="absolute inset-0 math-grid pointer-events-none z-0" />
      <div className="pointer-events-none absolute inset-0 bg-[#f9f9ff] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="w-full relative z-20">
        <Navbar />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 my-8">
        <main className="w-full max-w-2xl tracking-normal">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgba(43,86,222,0.06)] border border-[#e8edff] tracking-normal"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex flex-col w-full">
                <h2 className="text-3xl font-extrabold text-[#101b30] tracking-normal">
                  Contact Us
                </h2>
                <p className="mt-2 text-[#494456] text-base tracking-normal font-normal">
                  Your Math Journey starts here. <br /> Say Hi!
                </p>
              </div>
              <div className="min-w-[120px] flex flex-col items-center sm:items-end">
                <img
                  className="w-16 h-16 rounded-full border-2 border-[#e8edff] object-cover shadow-sm"
                  src="/headshot.jpg"
                  alt="Daniel Keum"
                />
                <p className="text-sm tracking-normal font-semibold mt-2 text-[#101b30]">
                  Daniel Keum
                </p>
              </div>
            </div>

            <div className="my-6 border-t border-[#e8edff]" />

            <p className="mt-2 max-w-md text-sm text-[#494456] tracking-normal">
              Email us using this form to strategize 1-1 with our lead tutor
            </p>

            <form className="my-8 tracking-normal space-y-5" onSubmit={handleSubmit}>
              <LabelInputContainer>
                <Label htmlFor="fullname" className="text-sm font-medium text-[#101b30]">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="John Smith"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus-visible:ring-0 focus:border-[#2b56de] focus:bg-white transition-all tracking-normal"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 font-medium">{errors.fullName}</p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email" className="text-sm font-medium text-[#101b30]">Email Address</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus-visible:ring-0 focus:border-[#2b56de] focus:bg-white transition-all tracking-normal"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 font-medium">{errors.email}</p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="message" className="text-sm font-medium text-[#101b30]">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write a message..."
                  className="w-full px-4 py-3 bg-[#f0f3ff] border-2 border-transparent rounded-xl text-[#101b30] text-base outline-none focus-visible:ring-0 focus:border-[#2b56de] focus:bg-white transition-all min-h-[80px] max-h-[160px] overflow-y-auto tracking-normal"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {errors.message && (
                  <p className="text-sm text-red-500 font-medium">{errors.message}</p>
                )}
              </LabelInputContainer>

              <button
                className="text-base group/btn relative block h-12 w-full rounded-xl bg-[#2b56de] font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-[#1a43c7] active:scale-[0.98]"
                type="submit"
                disabled={isSubmitting || isSent}
              >
                {isSent
                  ? "Sent!"
                  : isSubmitting
                    ? "Sending..."
                    : "Send Email"}
                <BottomGradient />
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Contactme;

// Utility Components
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#2b56de] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);