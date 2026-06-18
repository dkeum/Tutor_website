import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserInfo = () => {
  // Grabbing all required state fields from your Redux slices
  const name = useSelector((state) => state.personDetail.name);
  const grade = useSelector((state) => state.personDetail.grade);
  const email = useSelector((state) => state.personDetail.email) || ""; // Fallback fallback safety handling
  const profile_picture = useSelector((state) => state.personDetail.profile_pic);

  // Extracting student initials cleanly for fallback state representation
  const userInitials = name ? name[0].toUpperCase() : "?";

  return (
    <div
      className="rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-w-0 w-full h-full"
      style={{
        background: "#451ebb",
        color: "#fff",
        boxShadow: "0 8px 32px rgba(69,30,187,0.25)",
      }}
    >
      {/* Absolute Decorative Background Pattern Ring */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-50 pointer-events-none"
        style={{ background: "#5d3fd3" }}
      />

      {/* Integrated Shadcn Avatar Core Block wrapped directly inside your custom style guidelines */}
      <Avatar 
        className="w-24 h-24 mb-4 relative z-10 flex-shrink-0 select-none border-4"
        style={{ borderColor: "#e6deff" }}
      >
        <AvatarImage
          src={profile_picture}
          alt={name || "Student profile"}
          className="object-cover w-full h-full"
        />
        {/* Dynamic structural substitution fallback handler inheriting old design typography markup */}
        <AvatarFallback 
          className="w-full h-full flex items-center justify-center text-4xl font-black rounded-full"
          style={{ background: "#5d3fd3", color: "#fff" }}
        >
          {userInitials}
        </AvatarFallback>
      </Avatar>

      {/* User Dynamic Text Nodes */}
      <h2
        className="text-3xl font-bold mb-1 relative z-10 w-full truncate"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {name || "Student"}
      </h2>
      
      <p className="text-lg opacity-90 relative z-10 w-full break-all px-2">
        {email || (grade ? `Grade: ${grade}` : "")}
      </p>

      {/* Educational Tier Indicator Badge Component Layout */}
      <div
        className="mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest relative z-10 flex-shrink-0 select-none"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        {grade ? `Grade ${grade}` : "Advanced Level"}
      </div>
    </div>
  );
};

export default UserInfo;