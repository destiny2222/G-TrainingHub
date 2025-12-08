import React, { useEffect, useState, useRef } from "react";
import "../assets/css/Certificate.css";
import Logo from "../assets/image/logo/logo.png"
import { fetchUserEnrolledCohorts } from "../redux/slices/userEnrolledCohortSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { usePDF } from 'react-to-pdf';

const Certificate = () => {
  const dispatch = useDispatch();
  const { enrollment, loading } = useSelector((state) => state.userEnrolledCohorts);
  const [selectedCohortId, setSelectedCohortId] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { toPDF, targetRef } = usePDF({
    filename: 'certificate.pdf',
    page: { format: 'A4', orientation: 'landscape' }
  });

  useEffect(() => {
    dispatch(fetchUserEnrolledCohorts());
  }, [dispatch]);

  // Generate certificate ID based on cohort name
  const generateCertificateId = (cohortName, enrollmentItem) => {
    const words = cohortName.split(' ').filter(word => word.length > 0);
    
    // Fixed prefix
    const prefix = "RC";
    
    // Get current year
    const year = new Date().getFullYear();
    
    // Get first letter of first word (D from "Data")
    const firstLetter = words[0] ? words[0].charAt(0).toUpperCase() : 'C';
    
    // Get first letter of second word (A from "Analysis")
    const secondLetter = words[1] ? words[1].charAt(0).toUpperCase() : 'O';
    
    return `${prefix}${year}${firstLetter}${secondLetter}${enrollmentItem?.enrollment_id || ''}`;
  };


  const handleCohortChange = (e) => {
    setSelectedCohortId(e.target.value);
    setShowCertificate(false);
    setErrorMessage("");
  };

  const handleGenerateCertificate = () => {
    setErrorMessage("");
    
    if (!selectedCohortId) {
      setErrorMessage("Please select a cohort first.");
      return;
    }

    const enrollmentItem = enrollment.find((item) => item.cohort.id === selectedCohortId);
    if (!enrollmentItem) {
      setErrorMessage("Selected cohort not found.");
      return;
    }

    if (!enrollmentItem.approve_certificate) {
      setErrorMessage("Your certificate has not been approved yet. Please contact the program administrator.");
      return;
    }

    setSelectedCohort(enrollmentItem);
    setShowCertificate(true);
  };

  const handleDownloadCertificate = () => {
    toPDF();
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "700", color: "#1a1a1a", marginBottom: "10px" }}>
            My Certificate
          </h1>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "0" }}>
            Select a cohort and generate your certificate of completion.
          </p>
        </div>

        {/* Filter Section */}
        <div style={{ 
          backgroundColor: "#fff", 
          padding: "30px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "30px"
        }}>
          <div style={{ 
            display: "flex", 
            gap: "20px", 
            alignItems: "flex-end",
            flexWrap: "wrap"
          }}>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <label 
                htmlFor="cohort-select" 
                style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#333"
                }}
              >
                Cohort:
              </label>
              <select
                id="cohort-select"
                value={selectedCohortId}
                onChange={handleCohortChange}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  color: "#333",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "20px",
                  paddingRight: "40px"
                }}
              >
                <option value="">All Cohorts</option>
                {enrollment?.map((item) => (
                  <option key={item.id} value={item.cohort.id}>
                    {item.cohort.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateCertificate}
              disabled={loading || !selectedCohortId}
              style={{
                padding: "12px 32px",
                fontSize: "15px",
                fontWeight: "600",
                backgroundColor: selectedCohortId && !loading ? "#0066cc" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: selectedCohortId && !loading ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                minWidth: "180px",
                height: "48px"
              }}
              onMouseEnter={(e) => {
                if (selectedCohortId && !loading) {
                  e.target.style.backgroundColor = "#0052a3";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCohortId && !loading) {
                  e.target.style.backgroundColor = "#0066cc";
                }
              }}
            >
              {loading ? "Loading..." : "Generate Certificate"}
            </button>
          </div>

          {errorMessage && (
            <div style={{ 
              padding: "12px 16px", 
              marginTop: "20px", 
              backgroundColor: "#fff3cd", 
              color: "#856404", 
              borderRadius: "8px",
              border: "1px solid #ffeaa7",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "18px" }}>⚠️</span>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Certificate Display */}
        {showCertificate && selectedCohort && (
          <>
            {/* Download Button */}
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              marginBottom: "20px",
              gap: "10px"
            }}>
              <button
                onClick={handleDownloadCertificate}
                style={{
                  padding: "12px 32px",
                  fontSize: "15px",
                  fontWeight: "600",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
              >
                <span>📥</span> Download as PDF
              </button>
            </div>

            <div ref={targetRef} className="certificate bg-image">
          {/* Decorative chevrons - top left */}
          <div className="chevron-decoration chevron-top-left">
            <div className="double-chevron-left">
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Decorative chevrons - top right */}
          <div className="chevron-decoration chevron-top-right">
            <div className="double-chevron-right">
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Top logo / brand */}
          <div className="certificate-header">
            <div className="certificate-logo">
              <img src={Logo} alt="GritinAI" width="100" />
            </div>
          </div>

          {/* Main title */}
          <h1 className="certificate-title">Certificate</h1>
          <p className="certificate-subtitle">OF COMPLETION</p>

          <p className="certificate-small-text">
            This certificate is awarded to :
          </p>

          {/* Recipient Name */}
          <h2 className="certificate-recipient">
            {selectedCohort.user?.name || "Recipient Name"}
          </h2>

          {/* Description */}
          <p className="certificate-body">
            For the successful completion of the comprehensive{" "}
            <span className="certificate-program">
              {selectedCohort.cohort?.name || "Training Program"}
            </span>{" "}
            on this day of {new Date(selectedCohort.completed_at || selectedCohort.cohort?.end_date || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}.
            This certification recognizes the recipient's demonstrated
            proficiency in essential competencies, including data
            acquisition, cleaning and transformation, statistical analysis, and
            data storytelling through visualization.
          </p>

          {/* Signatures */}
          <div className="certificate-signatures">
            <div className="certificate-signature-block">
              <div className="signature-line" />
              <div className="signature-name">
                {selectedCohort.director_name || "OLUWAFUNMIKE ADEYEMI"}
              </div>
              <div className="signature-title">
                {selectedCohort.director_title || "PROGRAM DIRECTOR"}
              </div>
            </div>

            <div className="certificate-signature-block">
              <div className="signature-line" />
              <div className="signature-name">
                {selectedCohort.instructor_name || "BENEDICT EMOEKABU"}
              </div>
              <div className="signature-title">
                {selectedCohort.instructor_title || "LEAD INSTRUCTOR"}
              </div>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="certificate-id">
            {selectedCohort.certificate_id || generateCertificateId(selectedCohort.cohort?.name || "Certificate Holder", selectedCohort)}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Certificate;