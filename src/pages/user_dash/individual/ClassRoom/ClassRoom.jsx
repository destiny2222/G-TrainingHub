import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import api from "../../../../utils/api";
import "./ClassRoom.css";

function ClassRoom() {
  const { cohortSlug } = useParams();
  const navigate = useNavigate();
  const meetingInitialized = useRef(false);
  const clientRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (meetingInitialized.current) return;
    meetingInitialized.current = true;

    const joinMeeting = async () => {
      try {
        setLoading(true);
        console.log("Fetching Zoom join info...");

        const res = await api.get(`/user/cohorts/${cohortSlug}/zoom/join-info`);
        console.log("Zoom join info response:", res);
        const json = res.data;

        if (json.status !== "success") {
          throw new Error(json.message || "Unable to join class");
        }

        const {
          sdkKey,
          signature,
          meetingNumber,
          password,
          userName,
          userEmail,
        } = json.data;

        if (!sdkKey || !signature || !meetingNumber) {
          throw new Error("Missing required Zoom configuration");
        }

        console.log("Zoom config:", {
          sdkKey,
          meetingNumber,
          userName,
          signatureLength: signature?.length,
        });

        console.log("Creating Zoom client...");
        const client = ZoomMtgEmbedded.createClient();
        clientRef.current = client;

        // ✅ Now this element WILL exist because we always render it
        const meetingSDKElement = document.getElementById("meetingSDKElement");

        if (!meetingSDKElement) {
          throw new Error("Meeting container element not found");
        }

        console.log("Initializing Zoom SDK...");
        await client.init({
          zoomAppRoot: meetingSDKElement,
          language: "en-US",
          patchJsMedia: true,
          leaveOnPageUnload: true,
        });

        console.log("Zoom SDK initialized successfully");
        console.log("Joining meeting...");

        await client.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: String(meetingNumber),
          password: password || "",
          userName: userName,
          userEmail: userEmail || "",
          tk: "",
        });

        console.log("Successfully joined Zoom meeting");
        setLoading(false);
      } catch (e) {
        console.error("Zoom error details:", e);
        const errorMessage =
          e?.message || e?.reason || "Failed to join meeting";
        setError(errorMessage);
        setLoading(false);

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    };

    joinMeeting();

    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
        } catch (e) {
          console.error("Error leaving meeting:", e);
        }
      }
      meetingInitialized.current = false;
    };
  }, [cohortSlug, navigate]);

  return (
    <div className="classroom-wrapper">
      <div className="classroom-content">
        {/* ✅ Zoom container is ALWAYS in the DOM */}
        <div
          id="meetingSDKElement"
          style={{
            width: "100%",
            height: "100vh",
            position: "relative",
          }}
        />

        {/* 🔹 Loading overlay */}
        {loading && !error && (
          <div className="classroom-overlay">
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "5px solid #f3f3f3",
                borderTop: "5px solid #007bff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ marginTop: "20px", fontSize: "18px" }}>
              Joining Meeting...
            </p>
          </div>
        )}

        {/* 🔹 Error overlay */}
        {error && (
          <div className="classroom-overlay">
            <h2 style={{ color: "#dc3545", marginBottom: "20px" }}>
              Failed to Join Meeting
            </h2>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassRoom;
