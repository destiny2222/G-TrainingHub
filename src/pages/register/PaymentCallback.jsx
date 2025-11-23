// src/pages/PaymentCallback.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

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
          // setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          setStatus("error");
          setMessage(
            res.data.message || "Payment verification failed. Please contact support."
          );
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Unable to verify payment. Please contact support."
        );
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  return (
    <div className="payment-status-container">
      {status === "verifying" && (
        <div>
          <h2>Verifying your payment...</h2>
          <p>Please wait while we confirm your transaction.</p>
        </div>
      )}

      {status === "success" && (
        <div className="payment-success">
          <h2>Payment Successful 🎉</h2>
          <p>{message}</p>
          <button onClick={() => navigate("/login")} className="btn-submit">
            Login to Dashboard
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="payment-error">
          <h2>Payment Issue 😔</h2>
          <p>{message}</p>
          <button onClick={() => navigate("/cohort")} className="btn-submit">
            Back to Cohorts
          </button>
        </div>
      )}
    </div>
  );
}
