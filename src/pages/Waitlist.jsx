import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/text-area";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const Waitlist = () => {
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
      })
      .catch((error) => {
        console.error(
          "Error sending email:",
          error.response?.data || error.message
        );
      });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Navbar Navbar />
      <div className="mt-10 relative  flex h-[150vh]    2xl:h-[120vh] w-full  justify-center bg-white dark:bg-black ">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        <div
          className="pointer-events-none absolute inset-0 bg-white dark:bg-black 
            [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] 
            [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
        <section className="flex flex-col pt-20 ml-20 mt-50 items-center justify-center px-8 w-full h-[500px]">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            className={cn(
              "flex flex-col gap-y-10 pt-10 relative mb-6 max-w-2xl text-left text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
            )}
            layout
          >
            <h1 className="mt-10 mx-auto">Join the Waitlist</h1>
            <div>
              <p className="text-xl text-slate-700 text-center tracking-normal">
                {" "}
                Are you ready to improve your math and science grades in 2025?{" "}
              </p>

              <p className="text-xl text-slate-700 text-center tracking-normal">
                {" "}
                Get early access to your own AI Math and Science tutor
              </p>
            </div>
            
            <video src="/PromptScene.mp4" width="600" height="300"  autoPlay="true" muted playsInline loop/>

            <div className=" shadow-input min-w-xl max-w-2xl max-h-[700px] rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
              <form className="my-8 tracking-normal" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <LabelInputContainer>
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      placeholder="John Smith"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </LabelInputContainer>
                </div>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write a message..."
                    type="text"
                    className="min-h-[50px] max-h-[100px] overflow-y-auto"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </LabelInputContainer>

                <button
                  className="text-sm group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                  type="submit"
                  // disabled={isSubmitting || isSent}
                >
                  {isSent
                    ? "Joined!"
                    : isSubmitting
                    ? "Joining..."
                    : "Join Waitlist"}
                  <BottomGradient />
                </button>
              </form>
            </div>
          </motion.h1>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Waitlist;

// Utility Components
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
