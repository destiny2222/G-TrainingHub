import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyCohortPayment } from "../../../../redux/slices/admin_organisation/trainingProgramSlice";
import { toast } from "react-toastify";
import "./PaymentCallback.css";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paymentLoading, paymentError, success, message } = useSelector(
    (state) => state.trainingProgram,
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const reference = searchParams.get("reference");

    if (reference) {
      dispatch(verifyCohortPayment(reference));
    } else {
      toast.error("No payment reference found");
      navigate("/organization/trainings/cohorts");
    }
  }, [dispatch, location, navigate]);

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      navigate("/organization/trainings/cohorts");
    }
    if (paymentError) {
      toast.error(paymentError);
      navigate("/organization/trainings/cohorts");
    }
  }, [success, message, paymentError, navigate]);

  return (
    <div className="payment-container">
      <div className="payment-content">
        {paymentLoading ? (
          <>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="payment-title">Verifying Payment...</h3>
            <p className="payment-subtitle">
              Please wait while we confirm your transaction.
            </p>
          </>
        ) : (
          <>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="payment-title">Redirecting...</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
