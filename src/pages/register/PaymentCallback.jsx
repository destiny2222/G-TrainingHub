// src/pages/PaymentCallback.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./PaymentCallback.css";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("");

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference provided.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api.get(`/payment/verify/${reference}`);

        if (res.data.status === "success") {
          setStatus("success");
          setMessage("Payment verified! Your enrollment is complete ✅");

          // Optionally redirect after a few seconds
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(
            res.data.message ||
              "Payment verification failed. Please contact support.",
          );
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Unable to verify payment. Please contact support.",
        );
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  return (
    <div className="payment-container">
      <div className="payment-content">
        {status === "verifying" && (
          <>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="payment-title">Verifying Payment...</h3>
            <p className="payment-subtitle">
              Please wait while we confirm your transaction.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="payment-title">{message} redirecting...</h3>
          </>
        )}
        {status === "error" && (
          <>
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="payment-title">Payment Failed</h3>
            <p className="payment-subtitle">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
