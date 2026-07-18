import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bot, ArrowRight, ImageOff, RotateCcw, Smartphone, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { FileUpload } from "./FileUploadTemp";
import { supabase as supabaseClient } from "../../db/supabaseclient"; // adjust path to match your project

const STORAGE_BUCKET = "Mathmagick image attachments"; // your existing public bucket
const POLL_INTERVAL_MS = 2000;
const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 min — QR expires client-side

const UploadPictureTool = ({ onAddToAIChat }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // Phone/QR upload state
  const [phoneSession, setPhoneSession] = useState(null); // { sessionId, qrValue }

  const objectUrlRef = useRef(null); // track object URL for cleanup
  const pollRef = useRef(null); // polling interval
  const timeoutRef = useRef(null); // session expiry timer

  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;
    const uploadedFile = files[0];

    if (!uploadedFile.type.startsWith("image/")) {
      setError("Only image files are supported (JPG, PNG, etc).");
      return;
    }

    setError("");

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

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling(); // clean up on unmount
  }, [stopPolling]);

  // ── Generate a session and show the QR, then poll storage for the phone's upload ──
  const handleStartPhoneUpload = () => {
    setError("");

    const sessionId = crypto.randomUUID();
    const qrValue = `${window.location.origin}/mobile-upload/${sessionId}`;
    setPhoneSession({ sessionId, qrValue });

    const folderPath = `mobile-sessions/${sessionId}`;

    pollRef.current = setInterval(async () => {
      const { data: files, error: listError } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .list(folderPath);

      if (listError) {
        console.error("storage list error:", listError);
        return; // keep polling — a transient error shouldn't kill the session
      }

      if (files && files.length > 0) {
        const uploadedFile = files[0];
        const { data: publicUrlData } = supabaseClient.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(`${folderPath}/${uploadedFile.name}`);

        setPreviewImage(publicUrlData?.publicUrl);
        setFile(null); // no local File object for phone uploads
        setPhoneSession(null);
        stopPolling();
      }
    }, POLL_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setPhoneSession(null);
      setError("That QR code expired. Generate a new one to try again.");
    }, SESSION_TIMEOUT_MS);
  };

  const handleCancelPhoneUpload = () => {
    stopPolling();
    setPhoneSession(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, overflow: "hidden" }}>
        {previewImage ? (
          <>
            <img
              src={previewImage}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
            <button
              onClick={handleReplace}
              style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              title="Choose a different image"
            >
              <RotateCcw size={13} />
              Replace
            </button>
          </>
        ) : phoneSession ? (
          <div style={{ textAlign: "center" }}>
            <QRCodeSVG value={phoneSession.qrValue} size={110} />

     
          </div>
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
        <div style={{ padding: "6px 12px", fontSize: 12, color: "#dc2626", display: "flex", alignItems: "center", gap: 6, borderTop: "1px solid #e5e7eb", background: "#fef2f2" }}>
          <ImageOff size={14} />
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderTop: "1px solid #e5e7eb" }}>
        <button
          onClick={handleStartPhoneUpload}
          disabled={!!previewImage || !!phoneSession}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "transparent", cursor: previewImage || phoneSession ? "not-allowed" : "pointer", opacity: previewImage || phoneSession ? 0.5 : 1, fontSize: 12, fontWeight: 600, color: "#4441c4" }}
          title="Upload from your phone instead"
        >
          <Smartphone size={14} />
          Upload via phone
        </button>
        <button
          onClick={() => onAddToAIChat?.(previewImage)}
          disabled={!previewImage}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "transparent", cursor: previewImage ? "pointer" : "not-allowed", opacity: previewImage ? 1 : 0.5, fontSize: 12, fontWeight: 600, color: "#4441c4" }}
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