import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import { Star, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Tutors = () => {
  useEffect(() => {
    // Micro-interactions: Image scales and input state management
    const cards = document.querySelectorAll(".tutor-card");
    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (img) {
        const handleMouseEnter = () => {
          img.style.transform = "scale(1.05)";
          img.style.transition = "transform 0.5s ease";
        };
        const handleMouseLeave = () => {
          img.style.transform = "scale(1)";
        };
        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          card.removeEventListener("mouseenter", handleMouseEnter);
          card.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    });
  }, []);

  // Comprehensive static data map matching template definitions
  const tutorsData = [
    {
      id: 1,
      name: "Daniel Keum",
      title: "Bachelor of Applied Science",
      description: "High School Math and Sciences",
      rating: "5",
      price: 50,
      tags: ["Calculus", "Physics"],
      img: "/headshot.jpg",
    },

  ];

  return (
    <div className="min-h-screen w-full  text-[#101b30] flex font-sans overflow-x-hidden">
      {/* Global Style Injections */}
      <style>{`
        body {
          background-image: 
            linear-gradient(rgba(98, 0, 238, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(98, 0, 238, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .tutor-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tutor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(98, 0, 238, 0.12);
        }
        .bounce-active:active {
          transform: scale(0.96);
        }
      `}</style>

      {/* 1. Sidebar Navigation Element */}
      <Sidebar />

      {/* 2. Main Workspace Layout Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* 3. Global Top Navigation Integration Header */}
        <NavbarLoggedIn />

        {/* 4. Canvas View Wrapper Content Layer */}
        <main className="p-10 max-w-[1280px] w-full mx-auto flex-1 flex flex-col">

          {/* Header Title Hero Segment */}
          <section className="mb-8">
            <h2 className="text-4xl font-bold text-[#22005d] tracking-tight mb-2 text-left"  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Find your math mentor
            </h2>
            <p className="text-lg text-[#494456] max-w-2xl text-left">
              Connect with expert tutors who specialize in making complex mathematics simple and engaging.
            </p>
          </section>


          {/* Core Tutors Profiles Content Directories Layout Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tutorsData.map((tutor) => (
              <div
                key={tutor.id}
                className="tutor-card min-w-[280px] bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(98,0,238,0.08)] border border-transparent hover:border-[#6200ee] flex flex-col group h-full"
              >
                {/* Photo Header Container */}
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    alt={tutor.name}
                    className="w-full h-48 object-cover transform transition-transform duration-500"
                    src={tutor.img}
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span
                      className="material-symbols-outlined text-[#FFD700] text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      <Star />
                    </span>
                    <span className="text-xs font-bold text-[#101b30]">{tutor.rating}</span>
                  </div>
                </div>

                {/* Info Text Content Stack block */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#101b30] group-hover:text-[#4800b2] transition-colors line-clamp-1">
                    {tutor.name}
                  </h3>
                  <p className="text-xs font-bold text-[#4800b2] mb-2">{tutor.title}</p>
                  <p className="text-sm text-[#494456] line-clamp-2 mb-4 leading-relaxed">
                    {tutor.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tutor.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#F3E8FF] text-[#4800b2] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action and Rates Box Row */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#d7e2ff]">
                  <div>
                    <span className="text-2xl font-extrabold text-[#494456]">${tutor.price}</span>
                    <span className="text-xs text-[#494456]">/hr</span>
                  </div>
                  <Link to={`/book-tutor`}>
                    <button className="bg-[#4800b2] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#6200ee] transition-all bounce-active shadow-sm text-sm">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </section>


        </main>


      </div>
    </div>
  );
};

export default Tutors;