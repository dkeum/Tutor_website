import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BadgeCheck, User, SlidersHorizontal } from "lucide-react";
import Sidebar from "../Sidebar";
import NavbarLoggedIn from "../NavbarLoggedIn";
import LoggedInLayout from "../LoggedInLayout";

const Settings = () => {
  const currentName = useSelector((state) => state.personDetail.name);
  const currentEmail = useSelector((state) => state.personDetail.email);
  const currentProfile = useSelector((state) => state.personDetail.profile_pic);

  const [name, setName] = useState(currentName || "Alex Chen");
  const [profilePicture, setProfilePicture] = useState(currentProfile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const handleAvatarClick = () => {
    document.getElementById("avatar-input").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) formData.append("profile_picture", selectedFile);

      await axios.put(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/update-profile-info"
          : "https://mathamagic-backend.vercel.app/update-profile-info",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.put(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/delete-account"
          : "https://mathamagic-backend.vercel.app/delete-account",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full text-[#1C1B1F] flex font-sans">
      <LoggedInLayout>
        {/* 2. Main View Container */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {/* 4. Outer Settings Content Page Layout */}
          <main className="p-12 max-w-[1100px] w-full mx-auto flex flex-col gap-8 flex-1">
            <div>
              <h2 className="text-3xl font-extrabold text-[#6200EE] tracking-tight">
                Settings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Personalize your learning experience and manage your plan.
              </p>
            </div>

            {/* Subscription Section Card */}
            <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-purple-200/60 relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#6200EE] rounded-full flex items-center justify-center text-white shadow-md shadow-purple-200">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        Pro Plan
                      </h3>
                      <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-2">
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          Monthly Price
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          $9.99/mo
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          Renewal Date
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          Dec 15, 2023
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          Next Payment
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          $9.99 USD
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="bg-[#F2E7FE] text-[#6200EE] font-bold text-xs px-6 py-3 rounded-full border border-purple-100 hover:bg-[#EADDFF] transition-colors whitespace-nowrap">
                  Manage Subscription
                </button>
              </div>
            </section>

            {/* Settings Sub-Grid Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Profile Settings Container */}
              <section className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User className="text-[#6200EE] w-5 h-5" />
                    Profile Settings
                  </h3>

                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
                      <div
                        className="relative cursor-pointer flex-shrink-0"
                        onClick={handleAvatarClick}
                      >
                        <img
                          alt="Avatar Upload Target"
                          className="w-20 h-20 rounded-full object-cover shadow-inner ring-4 ring-purple-50"
                          src={
                            profilePicture || "https://via.placeholder.com/80"
                          }
                        />
                        <input
                          type="file"
                          id="avatar-input"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Profile Photo
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          Update your avatar to appear across the leaderboard.
                        </p>
                        <button
                          onClick={handleAvatarClick}
                          className="text-[#6200EE] font-bold text-xs mt-2 block hover:underline"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1.5">
                          Full Name
                        </label>
                        <input
                          className="w-full bg-[#F3F3FA] focus:bg-white border-2 border-transparent focus:border-[#6200EE] rounded-2xl px-4 py-3 text-sm text-gray-800 transition-all outline-none"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1.5">
                          Email Address
                        </label>
                        <input
                          className="w-full bg-[#F3F3FA] border border-transparent rounded-2xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed outline-none"
                          type="email"
                          value={currentEmail || "alex.chen@student.edu"}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleSave}
                    className="bg-[#1C1B1F] text-white text-xs font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </section>

              {/* Application Preferences Container Block */}
              <section className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[340px]">
                <h3 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="text-[#6200EE] w-5 h-5" />
                  Preferences
                </h3>
                <div className="flex flex-col justify-center h-[calc(100%-3rem)]">
                  <div className="flex items-center justify-between py-2">
                    <div className="pr-4">
                      <p className="text-sm font-bold text-gray-800">
                        Text-to-Speech
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        Hear problems read aloud
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={ttsEnabled}
                        onChange={(e) => setTtsEnabled(e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full transition-colors peer-checked:bg-[#6200EE]"></div>
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* 5. Danger Zone Footnote Layout Grid */}
            <section className="w-full bg-[#FDF2F2] rounded-3xl p-6 border border-red-100/70 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div>
                <h3 className="text-md font-bold text-[#A61C1C] mb-0.5">
                  Danger Zone
                </h3>
                <p className="text-xs text-gray-500 leading-normal">
                  Deleting your account is permanent and will remove all your
                  learning progress and Pro history.
                </p>
              </div>
              <button
                onClick={handleDelete}
                className="bg-[#B3261E] text-white text-xs font-bold px-6 py-3.5 rounded-full hover:bg-[#961F19] transition-colors whitespace-nowrap shadow-sm shadow-red-100"
              >
                Delete Account
              </button>
            </section>
          </main>
        </div>
      </LoggedInLayout>
    </div>
  );
};

export default Settings;
