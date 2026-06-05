import React, { useEffect, useState, useRef } from "react";
import { FileUpload } from "@/components/ui/file-upload";
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
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import Sidebar from "../components/Sidebar";

// image/pdf input. along with a prompt question 

//better interface for solving problems
// graph interface 
// calculator access 

// Better explanation 
// better -> logically seperately the steps and allow the student to practice 
// better -> immersive chatting with a virtual assistant
// lead to more questions, suggest sections
// Video generation 

// come with up more example problems
// 

const HomeworkHelp = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [fileURL, setFileURL] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // track current page
  const [api, setApi] = useState(null); // Reference tracking for Embla API instance

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

  // Captures carousel slides changes to inform current page state
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentPage(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

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
          console.log(response.data?.githubUrls)
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
    <div className="bg-background text-on-background min-h-screen antialiased flex flex-col">
      {/* Global Navigation Shell Elements */}
      <NavbarLoggedIn />
      <Sidebar />

      {/* Main Content Canvas - Structured matching structural width of the frame architecture */}
      <main className="pl-64 pt-24 pr-8 pb-12 w-full min-h-screen box-border flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">

          {/* Hero Header Section */}
          <section className="mb-10">
            <h2 className="font-display-lg text-4xl font-extrabold text-primary mb-2 tracking-tight">Submit Your Work.</h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl text-base opacity-90">Upload your math problems for expert review or AI-assisted step-by-step solutions.</p>
          </section>

          {/* Grid Layout Container */}
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* Interactive Workspace Area (Left/Main Column) */}
            <div className="col-span-12 lg:col-span-8 space-y-8">

              {!file ? (
                /* File Dropzone Workspace state */
                <div className="bg-white rounded-2xl p-10 border-2 border-dashed border-outline-variant shadow-sm flex flex-col items-center justify-center text-center transition-all hover:border-primary group bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/20 to-transparent">
                  <div className="w-full max-w-2xl mx-auto rounded-xl p-4 flex flex-col items-center justify-center">
                    <FileUpload
                      onChange={handleFileUpload}
                      accept="image/*,application/pdf"
                    />
                  </div>
                  <p className="mt-6 text-sm text-on-surface-variant/60">Supported formats: JPG, PNG, PDF (Max 25MB)</p>
                </div>
              ) : (
                /* Dynamic Interactive Homework & AI Splitting Preview Workspace state */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                  {/* Pass current page to AI (Zero-indexed conversion logic preserved) */}
                  <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                    <ReadPdfOrImageFiles_AI
                      fileURL={fileURL}
                      currentPage={currentPage - 1}
                    />
                  </div>

                  {/* Document Render Panel Viewport */}
                  <div className="bg-white border border-dashed border-neutral-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[550px] shadow-sm">
                    {/**This is where the user can query the document for questions */}
                    <div className="w-full flex justify-center items-center h-[500px]">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Uploaded Preview"
                          className="w-full max-w-[380px] object-contain border rounded-xl shadow-sm"
                        />
                      ) : (
                        <Document
                          file={file}
                          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                          className="w-full flex justify-center"
                        >
                          {numPages && (
                            <Carousel
                              setApi={setApi}
                              className="w-full max-w-xs sm:max-w-sm"
                              opts={{ loop: false }}
                            >
                              <CarouselContent>
                                {Array.from(new Array(numPages), (_, index) => (
                                  <CarouselItem key={`page-${index + 1}`}>
                                    <Card className="border-none shadow-none bg-transparent">
                                      <CardContent className="flex flex-col items-center justify-center p-0 overflow-y-auto overflow-x-hidden">
                                        <Page
                                          width={320}
                                          pageNumber={index + 1}
                                          renderTextLayer={false}
                                          renderAnnotationLayer={false}
                                          className="my-2 shadow-sm border rounded-lg overflow-hidden object-contain"
                                        />
                                        <div className="mt-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                          Page {index + 1} / {numPages}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="bg-black text-white hover:bg-black/80 -left-4" />
                              <CarouselNext className="bg-black text-white hover:bg-black/80 -right-4" />
                            </Carousel>
                          )}
                        </Document>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Recent Uploads Section */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-on-surface tracking-tight">Recent Uploads</h3>
                  <button className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline">
                    View History <span className="material-symbols-outlined text-sm">history</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Recent Item 1 */}
                  <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 flex items-center justify-between hover:border-primary/30 transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">Calculus_HW_Set_4.pdf</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Uploaded 2 hours ago • 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Processing</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                  {/* Recent Item 2 */}
                  <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 flex items-center justify-between hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">Trig_Problem_Handwritten.jpg</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Uploaded Yesterday • 1.1 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Completed</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Guidelines Panel Right Column */}
            <aside className="col-span-12 lg:col-span-4 space-y-8 sticky top-24">
              {/* Submission Guidelines */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                  Submission Tips
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-primary flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Ensure your handwriting is clear and legible for our AI and tutors.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-primary flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Capture the entire problem, including any given diagrams or tables.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-primary flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Specify the textbook name or topic for faster processing.</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-outline-variant/30">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Quality Example</p>
                  <div className="bg-purple-50/50 rounded-xl p-4 flex items-center justify-center border border-purple-100">
                    <img alt="Submission Example" className="mix-blend-multiply opacity-80 max-h-32 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT43JZpujVgIpkQ0HJqCXHnDXScRkcAkS2d0eIz--N5aum-OemW-DuTh3KVkcc6LDKCNOVpn3kkavYutBimac6bYBw9gNovqkyQp53vzB16X3iHa1EEZUsUT9gEE22LJDWj_TcYg51OfX0PWtiOnZEhVJU4_EeU88JxBvB432cqHYPSeiKNMXjvau6AUD_TGCZLfrLgS46cvuilI2Ja_IMCHWx0Dyg_1LZKDAZTJ3lFhC50_f7cNUgu4MqLEDjlhkU0gyaKQ6zvQ" />
                  </div>
                </div>
              </div>

              {/* Quick Reference Materials Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  Quick Reference
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">functions</span>
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Formula Cheat Sheet</span>
                    </div>
                    <span className="material-symbols-outlined text-xs opacity-60 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">calculate</span>
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Online Calculator</span>
                    </div>
                    <span className="material-symbols-outlined text-xs opacity-60 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">menu_book</span>
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Glossary of Terms</span>
                    </div>
                    <span className="material-symbols-outlined text-xs opacity-60 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeworkHelp;