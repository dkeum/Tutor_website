import React, { useState } from 'react';
import { Check } from 'lucide-react'; // Imported Lucide Check icon
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import Sidebar from '../components/Sidebar';

const FinalExamPrep = () => {
  // 1. Manage state for the selected topics
  const [topics, setTopics] = useState([
    { id: 'polynomials', title: 'Polynomials', desc: 'Operations, factoring, and roots of higher-degree polynomials.', mastery: 85, selected: false },
    { id: 'linear_equations', title: 'Linear Equations', desc: 'Systems of equations, graphing, and real-world applications.', mastery: 92, selected: false },
    { id: 'quadratic_functions', title: 'Quadratic Functions', desc: 'Parabolas, vertex form, and quadratic formula mastery.', mastery: 64, selected: false },
    { id: 'unit_circle', title: 'Unit Circle', desc: 'Sine, cosine, and tangent values across all quadrants.', mastery: 42, selected: false },
    { id: 'trig_identities', title: 'Trigonometric Identities', desc: 'Pythagorean, sum/difference, and double angle formulas.', mastery: 71, selected: false },
    { id: 'limits', title: 'Limits', desc: 'Evaluating one-sided and infinite limits with algebraic methods.', mastery: 55, selected: false },
  ]);

  const [showToast, setShowToast] = useState(false);

  // 2. Toggle selection and trigger transient feedback toast
  const handleToggleTopic = (id) => {
    setTopics((prevTopics) => {
      const updated = prevTopics.map((topic) =>
        topic.id === id ? { ...topic, selected: !topic.selected } : topic
      );

      const newlySelected = updated.find((t) => t.id === id)?.selected;
      if (newlySelected) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

      return updated;
    });
  };

  // 3. Derived Summary calculations
  const selectedCount = topics.filter((t) => t.selected).length;
  const estQuestions = selectedCount * 5;
  const estTime = selectedCount * 12;

  const handleGenerateTest = () => {
    const selectedIds = topics.filter((t) => t.selected).map((t) => t.id);
    console.log('Generating practice test for topics:', selectedIds);
    alert(`Generating test with ${estQuestions} questions across ${selectedCount} topics.`);
  };

  return (
    <div className="text-[#101b30] min-h-screen font-sans overflow-x-hidden antialiased ">

      <NavbarLoggedIn />
      
      <div className="relative z-40">
        <Sidebar />
      </div>

      <main className="pl-0 lg:pl-64 2xl:pl-0 pt-[64px] min-h-screen relative transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">

          {/* Page Header Layout Block */}
          <div className="flex flex-col lg:flex-row justify-between items-start  mb-12 gap-8">
            <div className="max-w-2xl">
              <nav className="flex items-center gap-2 text-[#4800b2] font-bold text-sm mb-4"></nav>
              <h2 className="text-4xl font-bold tracking-tight text-[#101b30] mb-4 text-left"  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Final Exam Prep</h2>
              <p className="text-[#494456] text-base md:text-lg text-left">Customize your practice test by selecting the topics you want to master. We'll generate a personalized set of problems based on your selection and current mastery levels.</p>
            </div>

            {/* Summary Floating Card Stack Allocation */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full lg:w-80 shadow-md shrink-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#494456] font-bold text-xs uppercase tracking-wider">Your Selection</span>
                <span className="bg-[#4800b2] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                  {selectedCount} Topic{selectedCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#494456]">Est. Questions</span>
                  <span className="font-bold text-[#101b30]">{estQuestions}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#494456]">Est. Duration</span>
                  <span className="font-bold text-[#101b30]">{estTime} mins</span>
                </div>
              </div>
              <button
                onClick={handleGenerateTest}
                disabled={selectedCount === 0}
                className="w-full bg-[#6200ee] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#4800b2] transition-all active:scale-95 shadow-lg shadow-[#4800b2]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6200ee] cursor-pointer"
              >
                Generate Practice Test
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </button>
            </div>
          </div>

          {/* Clean 3-Column Topic Cards Layout with Slate Outlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleToggleTopic(topic.id)}
                className={`p-6 rounded-2xl transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer relative overflow-hidden bg-white transform hover:-translate-y-1 hover:shadow-lg ${
                  topic.selected 
                    ? 'ring-2 ring-[#6200ee] border-transparent shadow-md' 
                    : 'border border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Active Check Indicator using Lucide React */}
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    topic.selected ? 'bg-[#2ECC71] border-[#2ECC71]' : 'border-slate-300'
                  }`}>
                    <Check 
                      className={`w-3.5 h-3.5 text-white transition-all duration-300 transform ${
                        topic.selected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                      }`} 
                      strokeWidth={3}
                    />
                  </div>
                </div>

                {/* Content Details */}
                <h4 className="text-lg font-bold mb-2 text-[#101b30] pr-6">{topic.title}</h4>
                <p className="text-[#494456] text-sm mb-6 h-10 overflow-hidden line-clamp-2">{topic.desc}</p>

                {/* Mastery Level Visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#494456] uppercase">Mastery</span>
                    <span className="text-[#4800b2]">{topic.mastery}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full relative transition-all duration-500 ${
                        topic.mastery >= 75 ? 'bg-[#2ECC71]' : topic.mastery >= 50 ? 'bg-[#6200ee]' : 'bg-[#ba1a1a]'
                      }`}
                      style={{ width: `${topic.mastery}%` }}
                    >
                      {topic.mastery >= 50 && <div className="absolute inset-0 shimmer"></div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Notification Toast */}
      <div className={`fixed bottom-10 right-10 bg-[#2ECC71] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transform transition-transform duration-500 z-50 ${
        showToast ? 'translate-y-0' : 'translate-y-32'
      }`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <span className="font-bold text-sm">Selection Saved! Your custom test is ready to generate.</span>
      </div>
    </div>
  );
};

export default FinalExamPrep;