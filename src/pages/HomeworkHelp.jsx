import React, { useEffect, useState, useRef } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";
import {
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Download,
  History,
  ListChecks,
} from "lucide-react";

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
import LoggedInLayout from "../components/LoggedInLayout";

// ── Filler data for recent submissions ──────────────────────────────────────
const FILLER_SUBMISSIONS = [
  {
    id: 1,
    name: "Calculus_HW_Ch3.pdf",
    type: "pdf",
    date: "Oct 24, 2023",
    size: "4.2 MB",
    status: "processing",
  },
  {
    id: 2,
    name: "Geometry_Proof_12.png",
    type: "image",
    date: "Oct 22, 2023",
    size: "1.8 MB",
    status: "completed",
  },
  {
    id: 3,
    name: "Algebra_Midterm_Prep.pdf",
    type: "pdf",
    date: "Oct 20, 2023",
    size: "12.5 MB",
    status: "completed",
  },
];

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Completed
    </span>
  );
};

// ── Recent Submissions Table ──────────────────────────────────────────────────
const RecentSubmissionsTable = ({ submissions = FILLER_SUBMISSIONS }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20">
    {/* Header */}
    <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
      <h3
        className="text-xl font-bold text-on-surface tracking-tight"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Recent Submissions
      </h3>
      <button className="text-primary font-semibold text-sm hover:underline flex items-center gap-1.5">
        View All History <History className="w-4 h-4" />
      </button>
    </div>

    <table className="w-full text-left table-fixed">
      <thead className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
        <tr>
          <th className="px-6 py-3 w-[40%]">File Name</th>
          <th className="px-6 py-3 w-[20%]">Date</th>
          <th className="px-6 py-3 w-[12%]">Size</th>
          <th className="px-6 py-3 w-[16%]">Status</th>
          <th className="px-6 py-3 w-[12%] text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/10">
        {submissions.map((row) => (
          <tr
            key={row.id}
            className="hover:bg-lavender-tint/10 transition-colors group"
          >
            {/* File name */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 min-w-0">
                {row.type === "pdf" ? (
                  <FileText className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-bold text-sm text-on-surface truncate">
                  {row.name}
                </span>
              </div>
            </td>

            {/* Date */}
            <td className="px-6 py-4 text-sm text-on-surface-variant">
              {row.date}
            </td>

            {/* Size */}
            <td className="px-6 py-4 text-sm text-on-surface-variant">
              {row.size}
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              <StatusBadge status={row.status} />
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
              <div className="flex justify-end gap-1">
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const HomeworkHelp = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [fileURL, setFileURL] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [api, setApi] = useState(null);

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
      setCurrentPage(1);
      console.log("Selected file:", files[0]);
    }
  };

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentPage(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
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
          setFileURL(response.data?.githubUrls);
        } catch (error) {
          console.error("Error uploading PDF:", error);
        }
      }
    };

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
          setFileURL(response.data?.githubUrls);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };

    uploadPDF();
    uploadImage();
  }, [file]);

  return (
    <div className="bg-background text-on-background min-h-screen antialiased flex flex-col">
      <LoggedInLayout>
        <main className=" flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            {/* Hero Header */}
            <section className="mb-10">
              <h2
                className="font-display-lg text-4xl font-bold text-primary mb-2 tracking-tight text-left"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Submit Your Work.
              </h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl text-base opacity-90 text-left">
                Upload your math problems for expert review or AI-assisted
                step-by-step solutions.
              </p>
            </section>

            {/* Top row: upload zone + sidebar — same height via items-stretch */}
            <div className="flex gap-8 items-stretch mb-8">
              {/* Upload / preview zone */}
              <div className="flex-1 min-w-0">
                {!file ? (
                  <div className="h-full bg-white rounded-2xl p-10 border-2 border-dashed border-outline-variant shadow-sm flex flex-col items-center justify-center text-center transition-all hover:border-primary group bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/20 to-transparent">
                    <div className="w-full max-w-2xl mx-auto rounded-xl p-4 flex flex-col items-center justify-center">
                      <FileUpload
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf"
                      />
                    </div>
                    <p className="mt-6 text-sm text-on-surface-variant/60">
                      Supported formats: JPG, PNG, PDF (Max 25MB)
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full">
                    <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                      <ReadPdfOrImageFiles_AI
                        fileURL={fileURL}
                        currentPage={currentPage - 1}
                      />
                    </div>
                    <div className="bg-white border border-dashed border-neutral-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[550px] shadow-sm">
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
                            onLoadSuccess={({ numPages }) =>
                              setNumPages(numPages)
                            }
                            className="w-full flex justify-center"
                          >
                            {numPages && (
                              <Carousel
                                setApi={setApi}
                                className="w-full max-w-xs sm:max-w-sm"
                                opts={{ loop: false }}
                              >
                                <CarouselContent>
                                  {Array.from(
                                    new Array(numPages),
                                    (_, index) => (
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
                                    )
                                  )}
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
              </div>

              {/* Sidebar — stretches to match upload zone height */}
              <aside className="w-72 flex-shrink-0">
                <div className="h-full bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex flex-col">
                  <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-primary" />
                    Submission Tips
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Ensure your handwriting is clear and legible for our AI and tutors.",
                      "Capture the entire problem, including any given diagrams or tables.",
                    ].map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-4 h-4 rounded-full bg-purple-100 text-primary flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-outline-variant/30 flex-1 flex flex-col">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                      Quality Example
                    </p>
                    <div className="flex-1 bg-purple-50/50 rounded-xl flex items-center justify-center border border-purple-100">
                      <img
                        alt="Submission Example"
                        className="mix-blend-multiply opacity-80 max-h-32 object-contain"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT43JZpujVgIpkQ0HJqCXHnDXScRkcAkS2d0eIz--N5aum-OemW-DuTh3KVkcc6LDKCNOVpn3kkavYutBimac6bYBw9gNovqkyQp53vzB16X3iHa1EEZUsUT9gEE22LJDWj_TcYg51OfX0PWtiOnZEhVJU4_EeU88JxBvB432cqHYPSeiKNMXjvau6AUD_TGCZLfrLgS46cvuilI2Ja_IMCHWx0Dyg_1LZKDAZTJ3lFhC50_f7cNUgu4MqLEDjlhkU0gyaKQ6zvQ"
                      />
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* Full-width submissions table */}
            <RecentSubmissionsTable />
          </div>
        </main>
      </LoggedInLayout>
    </div>
  );
};

export default HomeworkHelp;
