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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profile_picture: null,
    preview: null,
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
              src={form.preview || form.profile_picture || perUser?.profile_picture || "https://ui-avatars.com/api/?name=User"}
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
    </div>
  );
};

export default Profile;