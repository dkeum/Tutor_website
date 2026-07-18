import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase as supabaseClient } from "../../db/supabaseclient"; // adjust path to match your project

const STORAGE_BUCKET = "Mathmagick image attachments"; // your existing public bucket

const MobileUploadPage = () => {
  const { sessionId } = useParams();
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelected = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("Please choose an image file.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    const filePath = `mobile-sessions/${sessionId}/${Date.now()}.jpg`;

    const { error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, selectedFile, { contentType: selectedFile.type });

    if (error) {
      console.error("mobile upload error:", error);
      setStatus("error");
      setErrorMessage( error);
      return;
    }

    setStatus("done");
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        fontFamily: "inherit",
      }}
    >
      {status === "done" ? (
        <>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Photo uploaded</h2>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            You can go back to your computer now — it should appear there in a few seconds.
          </p>
        </>
      ) : (
        <>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Upload a photo</h2>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: 8,
              background: "#4441c4",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {status === "uploading" ? "Uploading..." : "Take a photo"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelected}
              disabled={status === "uploading"}
              style={{ display: "none" }}
            />
          </label>
          {status === "error" && (
            <p style={{ marginTop: 12, fontSize: 13, color: "#dc2626" }}>{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
};

export default MobileUploadPage;
