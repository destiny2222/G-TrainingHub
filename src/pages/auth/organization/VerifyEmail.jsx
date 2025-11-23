import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent multiple calls using ref
      if (hasVerifiedRef.current) return;
      hasVerifiedRef.current = true;

      // Get token and email from URL params (from email verification link)
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      console.log("Verification attempt:", {
        token,
        email,
        hasVerified: hasVerifiedRef.current,
      });

      if (!token || !email) {
        setStatus("error");
        setMessage(
          "Invalid verification link. Please check your email and try again.",
        );
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/organization/verify-email`,
          { token, email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Verification response:", response.data);

        if (response.data) {
          setStatus("success");
          setMessage(
            response.data.message ||
              "Your email has been verified successfully!",
          );

          // Store access token if provided
          if (response.data.access_token) {
            localStorage.setItem("authToken", response.data.access_token);
          }

          // Redirect to login/dashboard after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        console.error("Error response:", error.response?.data);

        // Check if it's already verified
        if (
          error.response?.status === 200 ||
          (error.response?.data?.message &&
            error.response.data.message.includes("already been verified"))
        ) {
          setStatus("success");
          setMessage("Email has already been verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            error.response?.data?.message ||
              "Verification failed. The link may be expired or invalid.",
          );
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-card">
        {status === "verifying" && (
          <>
            <div className="spinner"></div>
            <h1>Verifying Your Email</h1>
            <p>Please wait while we verify your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="success-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 4L12 14.01L9 11.01"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1>Email Verified!</h1>
            <p>{message}</p>
            <p className="redirect-text">Redirecting to login page...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                <path
                  d="M15 9L9 15M9 9L15 15"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <div className="actions">
              <button
                onClick={() => navigate("/organization/register")}
                className="btn btn-primary"
              >
                Back to Registration
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-secondary"
              >
                Go to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
