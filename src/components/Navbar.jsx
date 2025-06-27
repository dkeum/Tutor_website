import React from "react";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between px-10 sticky top-0 z-50 bg-white">
      <div className="flex flex-row items-center gap-x-5 text-3xl">
        <img className="w-12 h-12" src="./src/assets/logo.png" alt="logo" />
        <p className='font-extrabold '>Mathamagic</p>

      </div>
      <div className="flex flex-row gap-x-2">
        <h3>About</h3>
        <button className="p-[3px] relative text-xl w-[150px] cursor-pointer font-medium">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-2 py-2  bg-black rounded-[10px]  relative group transition duration-200 text-white hover:bg-transparent">
            → Let's Chat
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
