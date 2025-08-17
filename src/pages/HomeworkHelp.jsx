import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import NavbarLoggedIn from "../components/NavbarLoggedIn";

import BackgroundWrapper from "../components/BackgroundWrapper";

const HomeworkHelp = () => {
  const [files, setFiles] = useState([]);
  const handleFileUpload = (files) => {
    setFiles(files);
    console.log(files);
  };

  /**
   * 
   * 
   puter.ai.chat(
    "What do you see in this image?", 
    "https://assets.puter.site/doge.jpeg"
)
.then(response => {
    puter.print(response);
});
   */

  return (
    <div>
      <NavbarLoggedIn />
      <BackgroundWrapper>
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
      </BackgroundWrapper>
    </div>
  );
};

export default HomeworkHelp;
