import React, { useState } from "react";
import "./Modal.css";
import api from "../utils/api";

const Modal = ({ isOpen, onClose, Data }) => {
  const [stage, setStage] = useState(1);
  const [members, setMembers] = useState(1);
  const [serverAmount, setServerAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pricePerMember = Number(Data?.price ?? 0);
  const totalAmount = members * pricePerMember;

  // ✅ correct useState usage
  const [formData, setFormData] = useState({
    cohort_id: "",
    members: 1,
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setStage(1);
    setMembers(1);
    setServerAmount(null);
    setError("");
    setFormData({ cohort_id: "", members: 1 });
    onClose();
  };

  const createManualPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        cohort_id: Data?.id,
        members: members,
      };

      // if you want to keep formData too:
      setFormData(payload);

      const res = await api.post(
        "/organization/trainings/cohort/initialize-manual-payment",
        payload
      );

      // ✅ axios returns JSON here
      const json = res.data;

      // if your backend returns { status: "success" | "error", ... }
      if (json?.status !== "success") {
        throw new Error(json?.message || "Failed to initiate payment");
      }

      setServerAmount(json.data.amount);
      setStage(2);
    } catch (e) {
      // ✅ axios error message extraction
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (stage === 1) {
      createManualPayment();
      return;
    }
    setStage((s) => s + 1);
  };

  const handleBack = () => setStage((s) => s - 1);

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <div className="modal-stage">
            <h3>{Data?.name}</h3>

            {error ? <p className="error text-danger">{error}</p> : null}

            <p>Select how many members you want to register.</p>

            <input
              type="number"
              value={members}
              onChange={(e) =>
                setMembers(Math.max(1, Number(e.target.value) || 1))
              }
              min="1"
              className="modal-input"
            />

            <button
              onClick={handleNext}
              className="modal-button"
              disabled={loading || !Data?.id}
            >
              {loading ? "Processing..." : "Next"}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="modal-stage">
            <h3>Payment Details</h3>
            <h4>{Data?.name}</h4>

            <div className="payment-info">
              <p>
                <strong>Account Number:</strong> 1234567890
              </p>
              <p>
                <strong>Bank:</strong> Example Bank
              </p>

              <p>
                <strong>Amount to Pay:</strong>{" "}
                ₦{Number(serverAmount ?? totalAmount).toLocaleString()}
              </p>
              <p className="muted">Use this reference as your transfer narration.</p>
            </div>

            <div className="modal-buttons">
              <button onClick={handleBack} className="modal-button secondary">
                Go Back
              </button>
              <button onClick={handleNext} className="modal-button">
                I've Paid
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="modal-stage">
            <h2>Verification Pending</h2>
            <p>
              Your payment will be verified within 5 working days. When it is,
              your cohorts will be updated.
            </p>
            <button onClick={handleClose} className="modal-button">
              Finish
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={handleClose} className="modal-close-button">
          &times;
        </button>
        {renderStage()}
      </div>
    </div>
  );
};

export default Modal;
