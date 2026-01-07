import React, { useState } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, cohortName }) => {
  const [stage, setStage] = useState(1);
  const [members, setMembers] = useState(1);
  const amountPerMember = 100; // Example amount

  if (!isOpen) {
    return null;
  }

  const handleNext = () => {
    setStage(stage + 1);
  };

  const handleBack = () => {
    setStage(stage - 1);
  };

  const handleClose = () => {
    setStage(1);
    onClose();
  };

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <div className="modal-stage">
            <h3>{cohortName}</h3>
            <p>Select how many members you want to register.</p>
            <input
              type="number"
              value={members}
              onChange={(e) =>
                setMembers(Math.max(1, parseInt(e.target.value, 10)))
              }
              min="1"
              className="modal-input"
            />
            <button onClick={handleNext} className="modal-button">
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="modal-stage">
            <h3>Payment Details</h3>
            <h4>{cohortName}</h4>
            <p>Please ensure you have the correct details before proceeding.</p>
            <div className="payment-info">
              <p>
                <strong>Account Number:</strong> 1234567890
              </p>
              <p>
                <strong>Bank:</strong> Example Bank
              </p>
              <p>
                <strong>Amount to Pay:</strong> ${members * amountPerMember}
              </p>
            </div>
            <div className="modal-buttons">
              <button onClick={handleBack} className="modal-button secondary">
                Go Back
              </button>
              <button onClick={handleNext} className="modal-button">
                Verify
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
