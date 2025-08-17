import React, { useEffect, useRef, useState } from "react";

// i want to be able to create dog that has text speech bubble that does the following
// the default animation is standing
// i want to create a tab where dog will help as the user writes steps by step instructions
// dog should dynamically move positions
// if the dog is disappointed or the user doesnt follow what the dog says then the camera rotates slowly
// seeing the dog's back and then there's a text speech that says hmph! pout

// text to speech should work
// activated by default
// there should be a mute button setting that users can set by default
//

const animation_items = [
  "standing",
  "sitting",
  "shake",
  "rollover",
  "play_dead",
];

const Dog = ({mountRef, handlePlayAudio}) => {
  

  return (
    <div className="relative">
      <div
        className="w-[90%] h-[330px] py-5 mx-auto overflow-hidden"
        ref={mountRef}
      />
      <div className="absolute top-4 right-3 flex gap-2">
        <button
          className="text-3xl"
          onClick={() => handlePlayAudio("Hello, I am your helper dog!")}
        >
          ▶️
        </button>
      </div>
    </div>
  );
};

export default Dog;
