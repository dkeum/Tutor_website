import React, { useState, useRef } from "react";

import { Bot, ArrowRight, ImageOff, RotateCcw } from "lucide-react";
import { FileUpload } from "./FileUploadTemp";

const UploadPictureTool = ({ onAddToAIChat }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const objectUrlRef = useRef(null); // track for cleanup

  // ── Only accept images; reject anything else with a visible error ──
  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;
    const uploadedFile = files[0];

    if (!uploadedFile.type.startsWith("image/")) {
      setError("Only image files are supported (JPG, PNG, etc).");
      return;
    }

    setError("");

    // Clean up any previous object URL before creating a new one
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(uploadedFile);
    objectUrlRef.current = url;

    setFile(uploadedFile);
    setPreviewImage(url);
  };

  const handleReplace = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewImage(null);
    setFile(null);
    setError("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      {/* Upload / preview area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          overflow: "hidden",
        }}
      >
        {previewImage ? (
          <>
            <img
              src={previewImage}
              alt="Uploaded"
              style={{
                maxWidth: "100%",
                maxHeight: 160,
                objectFit: "contain",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <button
              onClick={handleReplace}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "transparent",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
              title="Choose a different image"
            >
              <RotateCcw size={13} />
              Replace
            </button>
          </>
        ) : (
          <div className="w-full max-w-sm mx-auto rounded-xl flex flex-col items-center justify-center">
            <FileUpload onChange={handleFileUpload} accept="image/*" />
            <p className="mt-4 text-xs text-on-surface-variant/60 text-center">
              Supported formats: JPG, PNG (images only)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "6px 12px",
            fontSize: 12,
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderTop: "1px solid #e5e7eb",
            background: "#fef2f2",
          }}
        >
          <ImageOff size={14} />
          {error}
        </div>
      )}

      {/* Bottom action row */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "8px 12px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <button
          onClick={() => onAddToAIChat?.(previewImage)}
          disabled={!previewImage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "transparent",
            cursor: previewImage ? "pointer" : "not-allowed",
            opacity: previewImage ? 1 : 0.5,
            fontSize: 12,
            fontWeight: 600,
            color: "#4441c4",
          }}
          title="Send to Chat Workspace"
        >
          <Bot size={14} />
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default UploadPictureTool;