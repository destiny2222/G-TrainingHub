import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Profile.css";
import { useFetchUser } from "../../utils/useUserStore";
import api from "../../utils/api";
import { toast } from "react-toastify";

const Profile = () => {
  const perUser = useFetchUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profile_picture: null,
    preview: null,
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    new_password_confirmation: false,
  });

  const fileInputRef = useRef();

  useEffect(() => {
    if (perUser) {
      setForm((prev) => ({
        ...prev,
        name: perUser.name || "",
        email: perUser.email || "",
        phone: perUser.phone || "",
        profile_picture: perUser.profile_picture || null,
        preview: null,
      }));
    }
  }, [perUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        profile_picture: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleEditImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (form.profile_picture instanceof File) {
        formData.append("profile_picture", form.profile_picture);
    }
    setIsLoading(true);
    try {
      await api.post("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      let message = "An error occurred. Please try again.";
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          message = error.response.data.message;
        }
        if (error.response.data.errors) {
          // Show first error message
          const firstField = Object.keys(error.response.data.errors)[0];
          message = error.response.data.errors[firstField][0];
        }
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleChangedPasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error("New password and confirmation do not match");
      return;
    }

    // Validate password length
    if (passwordForm.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setIsPasswordLoading(true);
    try {
      await api.post("/user/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });
      toast.success("Password changed successfully!");
      // Reset form
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      let message = "An error occurred. Please try again.";
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          message = error.response.data.message;
        }
        if (error.response.data.errors) {
          // Show first error message
          const firstField = Object.keys(error.response.data.errors)[0];
          message = error.response.data.errors[firstField][0];
        }
      }
      toast.error(message);
    } finally {
      setIsPasswordLoading(false);
    }
  }

  // Simple validation for green check
  const isValid = {
    name: form.name.length > 2,
    email: /.+@.+\..+/.test(form.email),
    phone: form.phone.length > 6,
  };

  const isProfileLoading = !perUser;

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-image-wrapper">
          {isProfileLoading ? (
            <Skeleton circle height={110} width={110} />
          ) : (
            <img
              src={form.preview || form.profile_picture || perUser?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(perUser?.name || "User")}` }
              alt="Profile"
              className="edit-profile-image"
            />
          )}
          <button type="button" className="edit-profile-image-edit" onClick={handleEditImageClick}>
            <span role="img" aria-label="edit">✎</span>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div>
            <label className="edit-profile-label" htmlFor="name">Full Name</label>
            <div className="edit-profile-input-row">
              {isProfileLoading ? (
                <Skeleton height={44} width={320} style={{ borderRadius: 8 }} />
              ) : (
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="edit-profile-input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              )}
            </div>
          </div>
          <div>
            <label className="edit-profile-label" htmlFor="email">Email</label>
            <div className="edit-profile-input-row">
              {isProfileLoading ? (
                <Skeleton height={44} width={320} style={{ borderRadius: 8 }} />
              ) : (
                <input
                  id="email"
                  name="email"
                  type="email"
                  readOnly
                  className="edit-profile-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              )}
            </div>
          </div>
          <div>
            <label className="edit-profile-label" htmlFor="phone">Number</label>
            <div className="edit-profile-input-row">
              {isProfileLoading ? (
                <Skeleton height={44} width={320} style={{ borderRadius: 8 }} />
              ) : (
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="edit-profile-input"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              )}
            </div>
          </div>
          <div className="edit-profile-actions">
            <button type="submit" className="edit-profile-btn" disabled={isLoading || isProfileLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <div className="edit-profile-card">
        <h2 className="mb-4">Change Password</h2>
        <form onSubmit={handleChangedPasswordSubmit} className="edit-profile-form">
          <div className="form-group">
            <label className="edit-profile-label" htmlFor="current_password">Current Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword.current_password ? "text" : "password"}
                id="current_password"
                name="current_password"
                className="edit-profile-input"
                placeholder="Enter current password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("current_password")}
                aria-label="Toggle password visibility"
              >
                {showPassword.current_password ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="edit-profile-label" htmlFor="new_password">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword.new_password ? "text" : "password"}
                id="new_password"
                name="new_password"
                className="edit-profile-input"
                placeholder="Enter new password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("new_password")}
                aria-label="Toggle password visibility"
              >
                {showPassword.new_password ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="form-group mb-0">
            <label className="edit-profile-label" htmlFor="new_password_confirmation">Confirm Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword.new_password_confirmation ? "text" : "password"}
                id="new_password_confirmation"
                name="new_password_confirmation"
                className="edit-profile-input"
                placeholder="Confirm new password"
                value={passwordForm.new_password_confirmation}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("new_password_confirmation")}
                aria-label="Toggle password visibility"
              >
                {showPassword.new_password_confirmation ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="edit-profile-actions">
            <button type="submit" className="edit-profile-btn" disabled={isPasswordLoading || isProfileLoading}>
              {isPasswordLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;