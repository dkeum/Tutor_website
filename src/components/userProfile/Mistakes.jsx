import React, { useState, useEffect, useRef } from 'react';
import NavbarLoggedIn from '../NavbarLoggedIn';
import Sidebar from '../Sidebar';

export default function Mistakes() {
  // Manage which accordions are expanded (supports multiple open at once)
  const [openAccordions, setOpenAccordions] = useState({
    calculus: true,
    linearAlgebra: false,
    trigonometry: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen  text-[#101b30] font-sans antialiased ">
      {/* Global Navigation Layouts */}
      <NavbarLoggedIn />
      <Sidebar />

      {/* Main Content Viewport Area: Offset classes handle the fixed sidebar/navbar real estate */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:pl-72 lg:pr-8 max-w-[1440px] mx-auto transition-all duration-300">
        
        {/* Hero Header Section */}
        <section className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#4800b2] tracking-tight mb-2">
                Correct Your Mistakes
              </h2>
              <p className="text-lg text-[#494456]">
                Master these concepts to boost your score! Every mistake is a step towards mastery.
              </p>
            </div>
            <div className="hidden lg:block">
              <img 
                alt="Decoration" 
                className="w-32 opacity-20" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD82a9wzxWczdXPaC048WgLogUBPmF51A2QAIVMAki_FTNCvIQN1U33n7ItlSARNz6iUSP8lZjVvLjmrB1zRCplT6s5xv4UYURixMTc1315sHBuoWq9A5kuzkh80-B67f6Iia1wFaEV16UiK1V2yCtE4459kZyXfvxpBJiR1mdwSVlReZivjc09mbjTt67dqdjEAGT1cEvsZC82UNKJ5mOxHsTYHtIy5vLQ15X9OpkG7CL1N6TbqIbrWS9FOTd30Kz-hiZQyTxO8w"
              />
            </div>
          </div>
        </section>

        {/* Main Responsive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Accordions / Topics (8/12 wide) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-[#7a7488] uppercase tracking-widest">
                Review Topics
              </h3>
              <div className="flex gap-2 items-center text-sm">
                <span className="text-[#494456]">Sort by:</span>
                <select className="bg-transparent border-none font-bold text-[#4800b2] focus:ring-0 cursor-pointer p-0 text-sm">
                  <option>Priority</option>
                  <option>Topic Name</option>
                  <option>Questions Count</option>
                </select>
              </div>
            </div>

            {/* CALCULUS ACCORDION */}
            <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] hover:shadow-[0_12px_40px_0_rgba(98,0,238,0.12)] transition-all duration-300 overflow-hidden">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#F3E8FF]/20 transition-colors"
                onClick={() => toggleAccordion('calculus')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#6200ee] flex items-center justify-center shadow-md text-white">
                    <span className="text-2xl font-bold font-serif">∫</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#101b30] leading-tight">Calculus</h4>
                    <p className="text-xs font-semibold text-[#4800b2] flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 bg-[#4800b2] rounded-full inline-block"></span>
                      6 Questions to review
                    </p>
                  </div>
                </div>
                <ChevronIcon isOpen={openAccordions.calculus} />
              </div>
              
              <AccordionWrapper isOpen={openAccordions.calculus}>
                <div className="p-6 space-y-3 bg-[#F8F9FE]/50 border-t border-[#cbc3d9]/30">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#cbc3d9]/10">
                    <div>
                      <p className="font-bold text-[#101b30]">Integrals</p>
                      <p className="text-xs text-[#494456]">Area under curve, substitution</p>
                    </div>
                    <ReviewButton count={4} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#cbc3d9]/10">
                    <div>
                      <p className="font-bold text-[#101b30]">Derivatives</p>
                      <p className="text-xs text-[#494456]">Chain rule, Power rule</p>
                    </div>
                    <ReviewButton count={2} />
                  </div>
                </div>
              </AccordionWrapper>
            </div>

            {/* LINEAR ALGEBRA ACCORDION */}
            <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] hover:shadow-[0_12px_40px_0_rgba(98,0,238,0.12)] transition-all duration-300 overflow-hidden">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#F3E8FF]/20 transition-colors"
                onClick={() => toggleAccordion('linearAlgebra')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#79f2f4] flex items-center justify-center shadow-md text-[#006e6f]">
                    <span className="text-xl font-bold">[ :: ]</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#101b30] leading-tight">Linear Algebra</h4>
                    <p className="text-xs font-semibold text-[#00696b] flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 bg-[#00696b] rounded-full inline-block"></span>
                      5 Questions to review
                    </p>
                  </div>
                </div>
                <ChevronIcon isOpen={openAccordions.linearAlgebra} />
              </div>

              <AccordionWrapper isOpen={openAccordions.linearAlgebra}>
                <div className="p-6 space-y-3 bg-[#F8F9FE]/50 border-t border-[#cbc3d9]/30">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#cbc3d9]/10">
                    <div>
                      <p className="font-bold text-[#101b30]">Matrix Multiplication</p>
                      <p className="text-xs text-[#494456]">Standard and dot products</p>
                    </div>
                    <ReviewButton count={5} isSecondary />
                  </div>
                </div>
              </AccordionWrapper>
            </div>

            {/* TRIGONOMETRY ACCORDION */}
            <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] hover:shadow-[0_12px_40px_0_rgba(98,0,238,0.12)] transition-all duration-300 overflow-hidden">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#F3E8FF]/20 transition-colors"
                onClick={() => toggleAccordion('trigonometry')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#594e6d] flex items-center justify-center shadow-md text-[#d0c1e6]">
                    <span className="text-xl font-bold">▲</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#101b30] leading-tight">Trigonometry</h4>
                    <p className="text-xs font-semibold text-[#594e6d] flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 bg-[#594e6d] rounded-full inline-block"></span>
                      3 Questions to review
                    </p>
                  </div>
                </div>
                <ChevronIcon isOpen={openAccordions.trigonometry} />
              </div>

              <AccordionWrapper isOpen={openAccordions.trigonometry}>
                <div className="p-6 space-y-3 bg-[#F8F9FE]/50 border-t border-[#cbc3d9]/30">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#cbc3d9]/10">
                    <div>
                      <p className="font-bold text-[#101b30]">Sine & Cosine Laws</p>
                      <p className="text-xs text-[#494456]">Non-right angled triangles</p>
                    </div>
                    <ReviewButton count={3} isTertiary />
                  </div>
                </div>
              </AccordionWrapper>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar Stats and Tip Cards (4/12 wide) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Total Pending Card */}
            <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] transition-all duration-300">
              <div className="relative z-10">
                <p className="text-xs font-bold text-[#4800b2] mb-4 uppercase tracking-wider">Total Pending</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#101b30]">14</span>
                  <span className="text-sm text-[#494456]">Questions</span>
                </div>
                <p className="text-xs text-[#494456] mt-4 leading-relaxed">
                  Most errors found in <span className="font-bold text-[#4800b2]">Calculus Integrals</span>. Review this first!
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#4800b2]/10 rounded-full blur-3xl"></div>
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 bg-[#e8ddff]/50 rounded-full flex items-center justify-center text-[#4800b2]">
                  <span className="text-xl">✦</span>
                </div>
              </div>
            </div>

            {/* Quick Review Widget */}
            <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] transition-all duration-300">
              <h5 className="font-bold text-[#494456] uppercase tracking-widest text-[10px] mb-6">Mastery Tip</h5>
              <div className="flex gap-4 items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-[#2ECC71]/10 flex items-center justify-center flex-shrink-0 text-[#2ECC71]">
                  <span className="text-lg">💡</span>
                </div>
                <p className="text-xs text-[#494456] italic leading-relaxed">
                  "Reviewing mistakes within 24 hours increases long-term retention by 60%. Try to tackle 2 questions now."
                </p>
              </div>
              <button className="w-full py-3 bg-[#4800b2] hover:bg-[#6200ee] text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-[#4800b2]/20">
                Start Quick Review
              </button>
            </div>

            {/* Recent Achievement */}
            <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-6 flex items-center gap-4 shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] transition-all duration-300">
              <img 
                alt="Mastery Badge" 
                className="w-16 h-16 object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgS1V0m7e1aeuQYdRSShaV9EfsTcbOvVZ73Fxsm2Nygcff9D4a1eHV-8q1x9HlKI5jJVPQcTRtlXOTtEkOH-umj1v_lFpXOnxEv0hvKvrQzsDMhoB5pq_OFrs5sitJDtiwcUHfYj4LPnk0xwkhVuoUxIGa4ktNsL-t9ufxkmuOzHhxluqUE5FWUx2bHnHX9PNLmqsTLZP5inEO_pAlPeL45wqQdiWPkSCsyVor0cVw3P9b84jF2ejXdCHM036vn9VlctZj6Cy0XQ"
              />
              <div>
                <p className="font-bold text-[#101b30] text-sm">Equation Explorer</p>
                <p className="text-xs text-[#494456]">50 quadratic equations solved!</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENTS
   ========================================================================== */

function AccordionWrapper({ isOpen, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{ maxHeight: height }}
      className="transition-[max-height] duration-300 ease-out overflow-hidden"
    >
      {children}
    </div>
  );
}

function ReviewButton({ count, isSecondary, isTertiary }) {
  let styles = "bg-[#e8ddff] text-[#4800b2] hover:bg-[#6200ee] hover:text-white";
  if (isSecondary) styles = "bg-[#7cf5f7] text-[#002020] hover:bg-[#00696b] hover:text-white";
  if (isTertiary) styles = "bg-[#ebddff] text-[#201632] hover:bg-[#413755] hover:text-white";

  return (
    <button 
      onClick={(e) => e.stopPropagation()} 
      className={`px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${styles}`}
    >
      Review {count}
      <span className="text-xs font-bold">→</span>
    </button>
  );
}

// Fixed spacing down-arrow indicator icon 
function ChevronIcon({ isOpen }) {
  return (
    <span className={`text-[#7a7488] block text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
      ▼
    </span>
  );
}