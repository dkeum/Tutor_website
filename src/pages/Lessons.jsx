import React, { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";

const Lessons = () => {
  useEffect(() => {
    // Micro-interaction simulation for the notification toast
    const timer = setTimeout(() => {
      const toast = document.getElementById("toast");
      if (toast) {
        toast.classList.remove("translate-y-20", "opacity-0");
        
        setTimeout(() => {
          toast.classList.add("translate-y-20", "opacity-0");
        }, 5000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full text-[#101b30] flex font-sans">
      {/* Custom Styles Injection */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .hover-lift {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <Sidebar />

      {/* 2. Main View Content Area Container */}
      {/* FIX: Removed global component backdrop background color allocations */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* FIX: Completely purged the decorative background blueprint graph overlay vector node */}

        {/* 3. Global Top Navigation Header */}
        <NavbarLoggedIn />

        {/* 4. Scrollable Canvas Content Layer */}
        <main className="mt-20 p-10 max-w-[1280px] w-full mx-auto flex-1 z-10 flex flex-col gap-12">
          
          {/* Section Hero Branding Titles */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="bg-[#e8ddff] text-[#4800b2] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                Curriculum Directory
              </span>
              <h2 className="text-4xl font-extrabold text-[#101b30] tracking-tight">Grade 10 Mathematics</h2>
              <p className="text-lg text-[#494456] max-w-2xl mt-2">
                Explore the foundations of complex logic. Master the rules of the universe, one theorem at a time.
              </p>
            </div>
            
            <div className="flex gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 bg-white border border-[#cbc3d9] px-6 py-3 rounded-full text-sm font-bold text-[#101b30] hover:bg-[#f1f3ff] transition-all">
                <span className="material-symbols-outlined text-[#494456]">sort</span>
                Filter Topics
              </button>
              <button className="flex items-center gap-2 bg-[#4800b2] text-white px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-[#4800b2]/20">
                <span className="material-symbols-outlined">auto_awesome</span>
                AI Study Guide
              </button>
            </div>
          </div>

          {/* Bento Grid - Module Containers */}
          <div className="grid grid-cols-12 gap-8">
            
            {/* Topic: Algebra Block */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8ddff] hover-lift relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#e8ddff]/50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                
                <div>
                  <div className="flex items-center gap-4 mb-8 relative">
                    <div className="w-14 h-14 bg-[#4800b2] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#4800b2]/30">
                      <span className="material-symbols-outlined text-[32px]">function</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#101b30]">Advanced Algebra</h3>
                      <p className="text-xs text-[#494456] font-medium mt-0.5">12 Lessons • 8 Hours total</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {/* Lesson Rows */}
                    <div className="p-4 rounded-2xl border border-[#d7e2ff] hover:border-[#4800b2]/30 hover:bg-[#F8F9FE] transition-all cursor-pointer flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-full bg-[#2ECC71]/10 flex items-center justify-center text-[#2ECC71]">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#101b30]">Linear Equations & Inequalities</p>
                        <p className="text-[10px] text-[#494456] font-medium mt-0.5">Video • 45 mins</p>
                      </div>
                      <span className="material-symbols-outlined opacity-0 group-hover/item:opacity-100 transition-opacity text-[#4800b2]">arrow_forward</span>
                    </div>

                    <div className="p-4 rounded-2xl border border-[#d7e2ff] hover:border-[#4800b2]/30 hover:bg-[#F8F9FE] transition-all cursor-pointer flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-full bg-[#e8ddff] flex items-center justify-center text-[#4800b2]">
                        <span className="material-symbols-outlined text-[20px]">play_circle</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#101b30]">Quadratic Functions</p>
                        <p className="text-[10px] text-[#494456] font-medium mt-0.5">Interactive Lesson • 1 hour</p>
                      </div>
                      <span className="material-symbols-outlined opacity-0 group-hover/item:opacity-100 transition-opacity text-[#4800b2]">arrow_forward</span>
                    </div>

                    <div className="p-4 rounded-2xl border border-[#d7e2ff] hover:border-[#4800b2]/30 hover:bg-[#F8F9FE] transition-all cursor-pointer flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-full bg-[#e8ddff] flex items-center justify-center text-[#4800b2]">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#101b30]">Systems of Equations</p>
                        <p className="text-[10px] text-[#494456] font-medium mt-0.5">Document • 30 mins</p>
                      </div>
                      <span className="material-symbols-outlined opacity-0 group-hover/item:opacity-100 transition-opacity text-[#4800b2]">arrow_forward</span>
                    </div>

                    <div className="p-4 rounded-2xl border border-[#d7e2ff] hover:border-[#4800b2]/30 hover:bg-[#F8F9FE] transition-all cursor-pointer flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-full bg-[#e8ddff] flex items-center justify-center text-[#4800b2]">
                        <span className="material-symbols-outlined text-[20px]">play_circle</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#101b30]">Exponential Expressions</p>
                        <p className="text-[10px] text-[#494456] font-medium mt-0.5">Video • 50 mins</p>
                      </div>
                      <span className="material-symbols-outlined opacity-0 group-hover/item:opacity-100 transition-opacity text-[#4800b2]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Module Spotlight Cards */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
              <div className="bg-[#263046] rounded-3xl p-6 text-white h-full relative overflow-hidden flex flex-col justify-between shadow-sm">
                <div className="z-10">
                  <span className="text-[10px] font-bold text-[#e8ddff] uppercase tracking-widest mb-2 block">Quick Review</span>
                  <h4 className="text-2xl font-bold leading-tight mb-4">Pythagorean Identities</h4>
                  <p className="text-sm text-[#d7e2ff] leading-relaxed">
                    Prepare for the Geometry midterm with our curated summary and interactive cheat sheet.
                  </p>
                </div>
                <div className="z-10 mt-6">
                  <button className="w-full bg-white text-[#101b30] py-3.5 rounded-2xl text-sm font-bold hover:bg-[#e8ddff] transition-colors shadow-sm">
                    Resume Topic
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12 pointer-events-none">
                  <span className="material-symbols-outlined text-[160px]">architecture</span>
                </div>
              </div>
            </div>

            {/* Topic: Geometry Block */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8ddff] hover-lift">
                <div className="flex items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#00696b] text-white rounded-2xl flex items-center justify-center shadow-md shadow-[#00696b]/10">
                      <span className="material-symbols-outlined text-[32px]">shapes</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#101b30]">Coordinate Geometry</h3>
                      <p className="text-xs text-[#494456] font-medium mt-0.5">8 Lessons • 6 Hours</p>
                    </div>
                  </div>
                  <div className="h-9 px-3 bg-[#f1f3ff] rounded-full flex items-center gap-2 flex-shrink-0 border border-gray-100">
                    <div className="w-12 bg-[#d7e2ff] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2ECC71]" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-[#2ECC71]">65%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#F8F9FE] rounded-2xl border border-transparent hover:border-[#00696b]/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#00696b]">category</span>
                      <span className="text-sm font-bold text-[#101b30]">Slope & Distance Formula</span>
                    </div>
                    <span className="text-[10px] text-[#494456] font-bold uppercase tracking-wider">Document • 15 Min</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F8F9FE] rounded-2xl border border-transparent hover:border-[#00696b]/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#00696b]">play_circle</span>
                      <span className="text-sm font-bold text-[#101b30]">Circle Equations</span>
                    </div>
                    <span className="text-[10px] text-[#494456] font-bold uppercase tracking-wider">Video • 40 Min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Topic: Trigonometry Block */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8ddff] hover-lift">
                <div className="flex items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#594e6d] text-white rounded-2xl flex items-center justify-center shadow-md shadow-[#594e6d]/10">
                      <span className="material-symbols-outlined text-[32px]">waves</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#101b30]">Trigonometry</h3>
                      <p className="text-xs text-[#494456] font-medium mt-0.5">10 Lessons • 7 Hours</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                    High Priority
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#F8F9FE] rounded-2xl border border-transparent hover:border-[#413755]/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#413755]">change_history</span>
                      <span className="text-sm font-bold text-[#101b30]">Sine, Cosine & Tangent Laws</span>
                    </div>
                    <span className="text-[10px] text-[#494456] font-bold uppercase tracking-wider">Video • 1 Hour</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F8F9FE] rounded-2xl border border-transparent hover:border-[#413755]/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#413755]">quiz</span>
                      <span className="text-sm font-bold text-[#101b30]">Trigonometric Ratios</span>
                    </div>
                    <span className="text-[10px] text-[#494456] font-bold uppercase tracking-wider">Interactive • 25 Min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Footer Tracks Carousel */}
          <div className="mt-8">
            <h4 className="text-xs font-bold text-[#494456] uppercase tracking-widest mb-6">Recently Viewed Lessons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#cbc3d9]/30 flex gap-4 hover-lift cursor-pointer items-center">
                <img alt="Lesson thumbnail" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100" src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=150&q=80" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#101b30] truncate">Polynomial Division</p>
                  <p className="text-[11px] text-[#494456] font-medium mb-2">Algebra • Part 2</p>
                  <div className="h-1 bg-[#e8edff] rounded-full overflow-hidden w-full">
                    <div className="h-full bg-[#4800b2]" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#cbc3d9]/30 flex gap-4 hover-lift cursor-pointer items-center">
                <img alt="Lesson thumbnail" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100" src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=150&q=80" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#101b30] truncate">3D Surface Area</p>
                  <p className="text-[11px] text-[#494456] font-medium mb-2">Geometry • Intro</p>
                  <div className="h-1 bg-[#e8edff] rounded-full overflow-hidden w-full">
                    <div className="h-full bg-[#4800b2]" style={{ width: "35%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#cbc3d9]/30 flex gap-4 hover-lift cursor-pointer items-center">
                <img alt="Lesson thumbnail" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100" src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=150&q=80" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#101b30] truncate">Introduction to Limits</p>
                  <p className="text-[11px] text-[#494456] font-medium mb-2">Calculus • Fundamentals</p>
                  <div className="h-1 bg-[#e8edff] rounded-full overflow-hidden w-full">
                    <div className="h-full bg-[#4800b2]" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Footer System Branding Metadata */}
        <footer className="p-8 text-center text-[#494456]/40 text-[10px] font-bold uppercase tracking-[0.2em] z-10 mt-auto">
          Powered by Lumina Learning Systems • Grade 10 Mathamagic Portal v2.4
        </footer>

        {/* 5. Interactive Success Toast Structure */}
        <div
          id="toast"
          className="fixed bottom-10 right-10 translate-y-20 opacity-0 transition-all duration-500 z-[100] flex items-center gap-4 bg-[#2ECC71] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#2ECC71]/40"
        >
          <span className="material-symbols-outlined">celebration</span>
          <div>
            <p className="text-sm font-bold">Topic Unlocked!</p>
            <p className="text-xs opacity-90 mt-0.5">You've reached the prerequisite for Advanced Calculus.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lessons;