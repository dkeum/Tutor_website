import React, { useEffect, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import BackgroundWrapper_2 from "../components/BackgroundWrapper_2";
import axios from "axios";

// react-pdf imports
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// shadcn/ui imports
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ReadPdfOrImageFiles_AI from "../components/AI/ReadPdfOrImageFiles_AI";
import { useSelector } from "react-redux";

const HomeworkHelp = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [fileURL, setFileURL] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // track current page

  const profile_picture = useSelector(
    (state) => state.personDetail.profile_pic
  );

  if (!Promise.withResolvers) {
    Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      setFile(files[0]);
      setCurrentPage(1); // reset page to 1 when a new file is uploaded
      console.log("Selected file:", files[0]);
    }
  };

  useEffect(() => {
    const uploadPDF = async () => {
      if (file && file.type === "application/pdf") {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post(
            import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
              ? "http://localhost:3000/homework-help/upload-pdf"
              : "https://mathamagic-backend.vercel.app/homework-help/upload-pdf",
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          setFileURL(response.data?.githubUrls);
          console.log("PDF uploaded:", response.data);
        } catch (error) {
          console.error("Error uploading PDF:", error);
        }
      }
    };

    uploadPDF();

    const uploadImage = async () => {
      if (file && file.type.startsWith("image/")) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post(
            import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
              ? "http://localhost:3000/homework-help/upload-image"
              : "https://mathamagic-backend.vercel.app/homework-help/upload-image",
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log(response.data)
          setFileURL(response.data?.githubUrls);
          console.log("Image uploaded:", response.data);
        } catch (error) {
          console.error("Error uploading PDF:", error);
        }
      }
    };

    uploadImage();
  }, [file]);

  return (
    <div className="flex flex-col justify-center h-screen">
      <NavbarLoggedIn />
      <BackgroundWrapper_2 className="flex-1">
        {!file && (
          <div className="w-full max-w-6xl mx-auto border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4 flex flex-col items-center justify-center">
            <FileUpload
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
            />
          </div>
        )}

        {file && (
          <div className="flex flex-row gap-10 justify-center items-center">
            {/* Pass current page to AI */}
            <ReadPdfOrImageFiles_AI
              fileURL={fileURL}
              currentPage={currentPage-1}
            />

            <div className="w-full mx-auto border border-dashed bg-slate-100 dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4 flex flex-col items-center justify-center">
              {/**This is where the user can query the document for questions */}
              <div className="w-1/2 mt-4 flex justify-center h-[500px]">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Uploaded Preview"
                    className=" min-w-[400px] object-contain border rounded-lg shadow"
                  />
                ) : (
                  <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  >
                    {numPages && (
                      <Carousel
                        className="w-full max-w-lg"
                        opts={{ loop: false }}
                        onSelect={(embla) => {
                          if (!embla) return;
                          const index = embla.selectedScrollSnap(); // zero-based
                          setCurrentPage(index + 1); // make it 1-based
                        }}
                      >
                        <CarouselContent>
                          {Array.from(new Array(numPages), (_, index) => (
                            <CarouselItem key={`page-${index + 1}`}>
                              <Card className="relative">
                                <CardContent className="flex flex-col items-center justify-center p-2 overflow-y-auto overflow-x-hidden">
                                  <Page
                                    width={500}
                                    height={500}
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="my-2 h-[400px]"
                                  />
                                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 absolute bottom-2">
                                    Page {index + 1} / {numPages}
                                  </div>
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="bg-black text-white" />
                        <CarouselNext className="bg-black text-white" />
                      </Carousel>
                    )}
                  </Document>
                )}
              </div>
            </div>
          </div>
        )}
      </BackgroundWrapper_2>
    </div>
  );
};

export default HomeworkHelp;
