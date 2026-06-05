import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";

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
      name: "Dr. Sarah Miller",
      title: "PhD in Applied Mathematics",
      description: "Specializes in Calculus II and Differential Equations with 10+ years of teaching experience.",
      rating: "4.9",
      price: 45,
      tags: ["Calculus", "Physics"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8YzcleXL0ED-zMtOXlUzTASYYt505xhJp9v22Va7ewJxjmmBTKWiZEa5qYU-6igTE7OiRp_x_-e6xFZiCXLNxNR4HiYeZbWppuYyZAorQxuPRYTRpLU5L0Y7Qn613a_V6KTXmkT2CPxferbutOXoIOr1K7oi9K7ukNCUhO6cQr3dohLsBrklVffOwFsh-OxBz_aIwpf6BsFh_EoqY-p-_0FHbAapXco89mq1xHeWSaPR7JcT2z3r9pmURVijOT3Z42b3qoiOfyQ",
    },
    {
      id: 2,
      name: "Marcus Thompson",
      title: "M.Sc. Theoretical Physics",
      description: "Focuses on making Algebra and Geometry intuitive through visual learning techniques.",
      rating: "5.0",
      price: 38,
      tags: ["Algebra", "Geometry"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG0CURdXpuWvo6bTx4edpm2Cojj87D0YtOG8mz8sGzbNyQZZeErGFcLAyQ_ia-2A6DEGtyiH0HOB7RyNS9ouY2NP0WhdVt6wTbahFdTN9Gaq5LsDkNIuda2hA9B7bnVo6CqfAyyMF_e7T6q3nCmFtXgaeuv7tAbj4kvw4tKjC3_CEwceyevMgk8H2YpErTSFVB87_L4yaJwu9skjD4VUTceQXeN8gHs_Set_bAjJungqRhZJQ-UgYC4rz4B_LlMvy7xdyy6TDepQ",
    },
    {
      id: 3,
      name: "Dr. Elena Rodriguez",
      title: "PhD in Statistics",
      description: "Helping students master data analysis and probability for advanced research projects.",
      rating: "4.8",
      price: 55,
      tags: ["Statistics", "Data Science"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3IJRlk0mTXZr2NwEj-qd-hkLhf51g9f-1_ClktuKi1eBOLuT3MMj6DV4h88ajvGGD1gU-KkIc86lKN2n50z58BPr_79nvOIUsBOnoXS1MwmAa-F4I4gUT0dys9Cl5idNB3VaYWBCdPxVEB9OArf5RZC9m2iynNtUsXlUorHeSRDNvRUdfX31hpdK8zXpPO9ZC9lNoHdYhAZqyALtqe2mpFE_LsIPW-56sb57ZgSiKESHp9n9TANSA9MySSHHT8ouhlIf-9eQp7Q",
    },
    {
      id: 4,
      name: "Kevin Park",
      title: "B.S. Mathematics & Computer Science",
      description: "Competitive math coach focusing on Olympiad-level problems and logic puzzles.",
      rating: "4.7",
      price: 40,
      tags: ["Logic", "Number Theory"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ-mLlqFn352xQpRIK-6a8QykiOojh3LxnjBpZLZmT7Y1vH43jtBB0tbBL3UmFzuVm7StbGfsxw4ABQ_sS0WVaMVPfFsB8BE7KP2xFaxzt-yfVJ-oBl7U6V62GJNWwujnh0GTEytMBXHVsZ3muTK36U44SmJ3WdCnkkXpexZw7eJjqnerbpH2V7NA0Rio4Rq-t3ZSXTuFRh6KQVeNf-kk2h2dcTfix1Af_doerUgKubTLygI-Vt0t3pdTuYE9WTu6UiOmVrax_UA",
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
            <h2 className="text-5xl font-extrabold text-[#22005d] tracking-tight mb-2">
              Find your math mentor
            </h2>
            <p className="text-lg text-[#494456] max-w-2xl">
              Connect with expert tutors who specialize in making complex mathematics simple and engaging.
            </p>
          </section>

          {/* Quick Filters Options Toolbar Row */}
          <section className="mb-8">
            <div className="glass-card p-6 rounded-2xl border border-white flex flex-wrap items-center gap-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#494456] px-2 uppercase tracking-wider text-xs">
                  Quick Subjects:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-6 py-2 rounded-full bg-[#6200ee] text-white font-bold text-xs bounce-active shadow-sm">
                  All Subjects
                </button>
                {["Calculus", "Algebra", "Geometry", "Statistics", "Trigonometry"].map((subject) => (
                  <button
                    key={subject}
                    className="px-6 py-2 rounded-full bg-[#F3E8FF] text-[#4800b2] font-bold text-xs hover:bg-[#4800b2] hover:text-white transition-all bounce-active"
                  >
                    {subject}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-4">
                <select className="bg-[#F8F9FE] border-[#cbc3d9] rounded-xl text-xs font-bold px-4 py-2 focus:ring-[#4800b2] focus:border-[#4800b2] outline-none">
                  <option>Price: Low to High</option>
                  <option>Highest Rated</option>
                  <option>Most Popular</option>
                </select>
                <button className="flex items-center gap-2 text-[#4800b2] font-bold group text-sm">
                  <span className="material-symbols-outlined text-md">tune</span>
                  More Filters
                </button>
              </div>
            </div>
          </section>

          {/* Core Tutors Profiles Content Directories Layout Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tutorsData.map((tutor) => (
              <div
                key={tutor.id}
                className="tutor-card bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(98,0,238,0.08)] border border-transparent hover:border-[#6200ee] flex flex-col group h-full"
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
                      star
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
                  <button className="bg-[#4800b2] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#6200ee] transition-all bounce-active shadow-sm text-sm">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Directory Navigation Pagination Actions Footer Base */}
          <div className="mt-12 flex justify-center items-center flex-col gap-4">
            <button className="px-8 py-3 bg-[#F3E8FF] text-[#4800b2] font-bold rounded-xl border border-[#6200ee] hover:bg-[#4800b2] hover:text-white transition-all bounce-active text-sm">
              Load More Mentors
            </button>
            <p className="text-xs text-[#494456] font-medium">
              Showing 4 of 128 available expert tutors
            </p>
          </div>
        </main>

        {/* Global Footer Metadata Frameworks Segment */}
        <footer className="mt-auto px-10 py-6 border-t border-[#d7e2ff] opacity-60">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#494456] text-center sm:text-left">
              © 2026 Mathamagic Portal. All mentors are verified for academic excellence.
            </p>
            <div className="flex gap-6">
              <a className="text-xs font-bold text-[#494456] hover:text-[#4800b2] transition-colors" href="#">
                Support
              </a>
              <a className="text-xs font-bold text-[#494456] hover:text-[#4800b2] transition-colors" href="#">
                Privacy
              </a>
              <a className="text-xs font-bold text-[#494456] hover:text-[#4800b2] transition-colors" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Tutors;