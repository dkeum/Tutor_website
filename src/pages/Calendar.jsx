import React from "react";
import Navbar from "../components/Navbar";

const COLORS = {
    bg: "#f8f9ff",
    card: "#ffffff",
    ink: "#0b1c30",
    inkSoft: "#434655",
};

// Replace with the booking link Google gives you for your appointment schedule
const BOOKING_URL = "https://calendar.app.google/JHDmh2cpJ7v1iPbv7";

const Calendar = () => {
    return (
        <div>


            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    background: COLORS.bg,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "40px 24px",
                    boxSizing: "border-box",
                }}
            >

                <img src="/logo.png" alt="Mathmagick Logo" className="w-20 mb-6" />
                <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>
                    Book the most informative life-changing session for your child
                </h1>
                <p style={{ fontSize: 14, color: COLORS.inkSoft, marginBottom: 24, textAlign: "center" }}>
                    Available Monday, Friday, Saturday, and Sunday.
                </p>
                <div
                    style={{
                        width: "100%",
                        maxWidth: 900,
                        background: COLORS.card,
                        borderRadius: 20,
                        boxShadow: "0 20px 40px -12px rgba(15,23,42,0.12)",
                        overflow: "hidden",
                    }}
                >
                    <iframe
                        src={BOOKING_URL}
                        title="Book a session"
                        style={{ border: 0, width: "100%", height: 700 }}
                        frameBorder="0"
                    />
                </div>
            </div>
        </div>
    );
};

export default Calendar;