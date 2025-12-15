import React, { useState } from "react";
import "../../assets/css/RequestCustom.css";
import { CloseCircle } from "iconsax-reactjs";
import api from "../../utils/api";
import { toast } from "react-toastify";

function RequestCustom({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    trainingTitle: "",
    businessChallenge: "",
    learningOutcomes: "",
    targetJobRoles: "",
    numberOfParticipants: "",
    skillLevel: "",
    trainingFormats: [],
    inPersonLocation: "",
    preferredTimeframe: "",
    trainingDuration: "",
    budgetConstraints: "",
    hasExistingMaterials: "",
    existingMaterialsDetails: "",
    specificSoftware: "",
    additionalComments: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        trainingFormats: checked
          ? [...prev.trainingFormats, value]
          : prev.trainingFormats.filter((format) => format !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Map frontend field names to backend field names
      const payload = {
        title: formData.trainingTitle,
        business_challenge: formData.businessChallenge,
        learning_outcomes: formData.learningOutcomes,
        target_job_roles: formData.targetJobRoles,
        number_of_participants: formData.numberOfParticipants,
        skill_level: formData.skillLevel,
        training_formats: formData.trainingFormats,
        in_person_location: formData.inPersonLocation,
        preferred_timeframe: formData.preferredTimeframe,
        training_duration: formData.trainingDuration,
        budget_constraints: formData.budgetConstraints,
        has_existing_materials: formData.hasExistingMaterials === "Yes" ? 1 : 0,
        existing_materials_details: formData.existingMaterialsDetails,
        specific_software: formData.specificSoftware,
        additional_comments: formData.additionalComments,
      };

      // Send request to backend
      const response = await api.post("/organization/trainings/custom/request", payload);
      if (response.status !== 201) {
        throw new Error("Failed to submit request");
      }

      // Show success toast
      toast.success("Your custom training request has been submitted successfully! We'll contact you within 24 hours.", {
        position: "top-right",
        autoClose: 5000,
      });
      
      // Reset form and close modal
      setFormData({
        trainingTitle: "",
        businessChallenge: "",
        learningOutcomes: "",
        targetJobRoles: "",
        numberOfParticipants: "",
        skillLevel: "",
        trainingFormats: [],
        inPersonLocation: "",
        preferredTimeframe: "",
        trainingDuration: "",
        budgetConstraints: "",
        hasExistingMaterials: "",
        existingMaterialsDetails: "",
        specificSoftware: "",
        additionalComments: "",
      });
      onClose();
    } catch (err) {
      // console.error("Error submitting form:", err);
      
      // Show error toast
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to submit request. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Custom Training</h2>
          <button className="close-btn" onClick={onClose}>
            <CloseCircle size="24" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Training Title */}
            <div className="form-group">
              <label htmlFor="trainingTitle">
                Training Title/Topic (Proposed) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="trainingTitle"
                name="trainingTitle"
                value={formData.trainingTitle}
                onChange={handleChange}
                placeholder="e.g., Advanced Python for Data Science, Leadership Fundamentals"
                required
              />
            </div>

            {/* Business Challenge */}
            <div className="form-group">
              <label htmlFor="businessChallenge">
                What is the primary business challenge or need this training is
                intended to address? <span className="required">*</span>
              </label>
              <textarea
                id="businessChallenge"
                name="businessChallenge"
                value={formData.businessChallenge}
                onChange={handleChange}
                rows="4"
                placeholder="e.g., Low team morale, need to adopt new compliance software, skill gap in XYZ technology"
                required
              />
            </div>

            {/* Learning Outcomes */}
            <div className="form-group">
              <label htmlFor="learningOutcomes">
                What specific, measurable outcomes or goals should participants
                achieve after completing this training? <span className="required">*</span>
              </label>
              <textarea
                id="learningOutcomes"
                name="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={handleChange}
                rows="4"
                placeholder="Be as specific as possible! Use bullet points if necessary."
                required
              />
            </div>

            {/* Target Job Roles */}
            <div className="form-group">
              <label htmlFor="targetJobRoles">
                Target Job Roles <span className="required">*</span>
              </label>
              <input
                type="text"
                id="targetJobRoles"
                name="targetJobRoles"
                value={formData.targetJobRoles}
                onChange={handleChange}
                placeholder="e.g., Junior Developers, Sales Managers, All Front-Line Staff"
                required
              />
            </div>

            {/* Number of Participants */}
            <div className="form-group">
              <label htmlFor="numberOfParticipants">
                Estimated Number of Participants <span className="required">*</span>
              </label>
              <select
                id="numberOfParticipants"
                name="numberOfParticipants"
                value={formData.numberOfParticipants}
                onChange={handleChange}
                required
              >
                <option value="">Select range</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-100">51-100</option>
                <option value="100+">100+</option>
              </select>
            </div>

            {/* Skill Level */}
            <div className="form-group">
              <label htmlFor="skillLevel">
                Current Skill Level of Participants in this Topic <span className="required">*</span>
              </label>
              <select
                id="skillLevel"
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select skill level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* Training Format */}
            <div className="form-group">
              <label>
                Preferred Training Format <span className="required">*</span>
                <span className="helper-text">(Check all that apply)</span>
              </label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="trainingFormats"
                    value="In-Person"
                    checked={formData.trainingFormats.includes("In-Person")}
                    onChange={handleChange}
                  />
                  In-Person (On-site at our location)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="trainingFormats"
                    value="Virtual/Live Online"
                    checked={formData.trainingFormats.includes("Virtual/Live Online")}
                    onChange={handleChange}
                  />
                  Virtual/Live Online (Instructor-Led)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="trainingFormats"
                    value="Blended"
                    checked={formData.trainingFormats.includes("Blended")}
                    onChange={handleChange}
                  />
                  Blended (Mix of live sessions and self-paced content)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="trainingFormats"
                    value="Self-Paced"
                    checked={formData.trainingFormats.includes("Self-Paced")}
                    onChange={handleChange}
                  />
                  Self-Paced (Pre-recorded modules only)
                </label>
              </div>
            </div>

            {/* In-Person Location */}
            {formData.trainingFormats.includes("In-Person") && (
              <div className="form-group">
                <label htmlFor="inPersonLocation">
                  If In-Person, please specify the city/location
                </label>
                <input
                  type="text"
                  id="inPersonLocation"
                  name="inPersonLocation"
                  value={formData.inPersonLocation}
                  onChange={handleChange}
                  placeholder="Enter city/location"
                />
              </div>
            )}

            {/* Preferred Timeframe */}
            <div className="form-group">
              <label htmlFor="preferredTimeframe">
                Preferred Timeframe for Delivery <span className="required">*</span>
              </label>
              <input
                type="text"
                id="preferredTimeframe"
                name="preferredTimeframe"
                value={formData.preferredTimeframe}
                onChange={handleChange}
                placeholder="e.g., Q2 2026, Start of March"
                required
              />
            </div>

            {/* Training Duration */}
            <div className="form-group">
              <label htmlFor="trainingDuration">
                Estimated Training Duration <span className="required">*</span>
              </label>
              <select
                id="trainingDuration"
                name="trainingDuration"
                value={formData.trainingDuration}
                onChange={handleChange}
                required
              >
                <option value="">Select duration</option>
                <option value="1 Day">1 Day</option>
                <option value="2 Days">2 Days</option>
                <option value="1 Week">1 Week (e.g., 4 x half-days)</option>
                <option value="Ongoing">Ongoing (specify months)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Budget Constraints */}
            <div className="form-group">
              <label htmlFor="budgetConstraints">  Are there any budget constraints we should be aware of? </label>
                <p className="helper-text text-start"> (Optional, but helpful for scoping)</p>
              <input
                type="text"
                id="budgetConstraints"
                name="budgetConstraints"
                value={formData.budgetConstraints}
                onChange={handleChange}
                placeholder="Enter budget information"
              />
            </div>

            {/* Existing Materials */}
            <div className="form-group">
              <label htmlFor="hasExistingMaterials">
                Do you have any existing internal documents, policies, or
                materials that should be incorporated into the training?
              </label>
              <select
                id="hasExistingMaterials"
                name="hasExistingMaterials"
                value={formData.hasExistingMaterials}
                onChange={handleChange}
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Existing Materials Details */}
            {formData.hasExistingMaterials === "Yes" && (
              <div className="form-group">
                <label htmlFor="existingMaterialsDetails">
                  Please describe the materials or upload them later
                </label>
                <textarea
                  id="existingMaterialsDetails"
                  name="existingMaterialsDetails"
                  value={formData.existingMaterialsDetails}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the materials you have..."
                />
              </div>
            )}

            {/* Specific Software */}
            <div className="form-group">
              <label htmlFor="specificSoftware">
                Is there a specific software, tool, or system that must be used
                or trained on?
              </label>
              <input
                type="text"
                id="specificSoftware"
                name="specificSoftware"
                value={formData.specificSoftware}
                onChange={handleChange}
                placeholder="Enter software/tool name"
              />
            </div>

            {/* Additional Comments */}
            <div className="form-group">
              <label htmlFor="additionalComments">  Additional Comments </label>
                <p className="helper-text text-start">
                  {" "}
                  (Please use this space for any further information, special
                  requests, or details)
                </p>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                rows="4"
                placeholder="Enter any additional information..."
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}

export default RequestCustom;
