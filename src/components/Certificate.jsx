import React from "react";
import "../assets/css/Certificate.css";
import Logo from "../assets/image/logo/logo.png"

const Certificate = ({
  recipientName = "BENEDICT EMOEKABU",
  programName = "Professional Data Analysis Program",
  dateText = "on this day of [Day] of [Month], [Year].",
  directorName = "OLUWAFUNMIKE ADEYEMI",
  directorTitle = "PROGRAM DIRECTOR",
  instructorName = "BENEDICT EMOEKABU",
  instructorTitle = "LEAD INSTRUCTOR",
  certificateId = "RC2025DA6001",
  academyName = "GritinAI",
}) => {
  return (
    <div className="certificate-container">
      <div className="certificate bg-image">
        {/* Decorative background shapes are handled in CSS with ::before / ::after */}

        {/* Top logo / brand */}
        <div className="certificate-header">
          <div className="certificate-logo"><img src={Logo} alt={academyName} width="100" /></div>
        </div>

        {/* Main title */}
        <h1 className="certificate-title">Certificate</h1>
        <p className="certificate-subtitle">OF COMPLETION</p>

        <p className="certificate-small-text">
          This certificate is awarded to :
        </p>

        {/* Recipient Name */}
        <h2 className="certificate-recipient">{recipientName}</h2>

        {/* Description */}
        <p className="certificate-body">
          For the successful completion of the comprehensive{" "}
          <span className="certificate-program">{programName}</span>{" "}
          {dateText} This certification recognises the recipient’s demonstrated
          proficiency in essential data analysis competencies, including data
          acquisition, cleaning and transformation, statistical analysis, and
          data storytelling through visualisation.
        </p>

        {/* Signatures */}
        <div className="certificate-signatures">
          <div className="certificate-signature-block">
            <div className="signature-line" />
            <div className="signature-name">{directorName}</div>
            <div className="signature-title">{directorTitle}</div>
          </div>

          <div className="certificate-signature-block">
            <div className="signature-line" />
            <div className="signature-name">{instructorName}</div>
            <div className="signature-title">{instructorTitle}</div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="certificate-id">{certificateId}</div>
      </div>
    </div>
  );
};

export default Certificate;
