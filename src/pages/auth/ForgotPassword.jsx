import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Login.css";
import Api from "../../utils/api"

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  // Form data state
  const [formData, setFormData] = useState({
    email: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrors({});
    setLoading(true);
    try {
        const response = await Api.post("/forgot-password", {
            email: formData.email,
        });
        if (response.data.status  === "success") {
            toast.success("Password reset instructions have been sent to your email.");
        } else {
            toast.error(response.data.message || "Failed to send reset instructions. Please try again.");
        }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    pauseOnHover: true,
    appendDots: (dots) => (
      <div className="slider-dots">
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: () => <div className="dot"></div>,
  };

  // Slider content data - Dynamic based on login type
  const slides =
   [
          {
            title: "Welcome Back to Your Organization Hub",
            description:
              "Access your comprehensive training management dashboard and continue building your team's capabilities with data-driven insights.",
          },
          {
            title: "Manage Your Training Programs",
            description:
              "Oversee courses, track team progress, and analyze performance metrics all in one centralized platform designed for organizational efficiency.",
          },
          {
            title: "Scale Your Organization's Growth",
            description:
              "Resume managing your organization's learning initiatives with personalized training paths and comprehensive analytics.",
          },
        
    ];

  return (
    <>
       <div className="user-login-container">
      <div className="user-login-wrapper">
        {/* Left Side - Form */}
        <div className="user-login-left-panel">
          <div className="form-scroll-container">
            <div className="user-login-form-header">
                <h1>Forgot Password</h1>
                <p>Enter your email address and we'll send you instructions to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="user-login-form">

              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>


                {/* Submit Button */}
                <button type="submit" disabled={loading} className={`btn-submit ${loading ? "" : ""}`}>
                    {loading ? "Sending..." : "Reset Password"}
                </button>
                {/* Sign in Link */}
                <div className="form-footer">
                   <p>
                        Already have an account?{" "}
                        <Link to="/login" className="link-primary">
                           Login Here
                        </Link>
                    </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Slider/Carousel */}
        <div className="user-login-right-panel">
          <div className="slider-overlay"></div>
          <div className="slider-content">
            <div className="brand-section">
              <div className="brand-logo">
                <span className="logo-icon">
                  <img src="./login-logo.png" alt="" />
                </span>
                <span className="brand-name">GritinAI</span>
              </div>
            </div>

            <div className="slider-main">
              <Slider {...sliderSettings}>
                {slides.map((slide, index) => (
                  <div key={index} className="slide-item">
                    <div className="slide-content">
                      <div className="slide-text">
                        <h2>{slide.title}</h2>
                        <p>{slide.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ForgotPassword