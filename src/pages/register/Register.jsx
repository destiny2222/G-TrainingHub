import { useRef, useState, useEffect } from "react";
import "./Register.css";
import api from "../../utils/api";
import { Link, useParams, useLocation } from "react-router-dom";
import Slider from "react-slick";
import { FaArrowLeft } from "react-icons/fa";

export default function RegistrationForm() {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { id, cohortName} = useParams();
  const { cohort_id } = location.state || {};
  const [status, setStatus] = useState({
    status: false,
    class: "button",
    message: "Loading...",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Submission state for button UI
  const [submitted, setSubmitted] = useState(false);

  // Form ref for validation
  const formRef = useRef(null);

  // Timeout ref to clear on unmount
  const timeoutRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl) return;

    // Check native form validation
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    // Prevent multiple submissions
    if (submitted) return;

    const formData = { name, email, phone, cohort_id: cohort_id };

    try {
      setSubmitted(true);
      setErrorMessage("");
       await api.post(`/cohorts/register`, formData);

      // Initialize payment and redirect

      const redirect = await api.post(`/payment/initialize`, {
        email,
        name,
        phone,
        cohort_id: cohort_id,
      });

      setStatus({
        class: "button-success",
        message: "Successful",
        status: true,
      });

      if (redirect.data.status === "success") {
        const url = redirect.data.data.authorization_url;
        if (url) {
          window.location.href = url;
          return;
        }
      }
      // 
    } catch (error) {
      setStatus({
        class: "button-error",
        message: "An error occurred",
        status: false,
      });
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }

    // Reset after 3 seconds only if still mounted
    timeoutRef.current = setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
      setStatus({
        status: false,
        class: "button",
        message: "Loading...",
      });
      setSubmitted(false);
      setErrorMessage("");
    }, 3000);
  };

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

  const slides = [
    {
      title: "Join the Next GritinAI Cohort",
      description:
        "Be part of an intensive, hands-on learning experience designed to accelerate your tech career and put you ahead of the curve.",
    },
    {
      title: "Learn With a Community",
      description:
        "Collaborate with driven learners, attend live sessions, and get mentorship from industry experts throughout the cohort.",
    },
    {
      title: "Start Your Transformation",
      description:
        "Register now and unlock structured learning, real-world projects, accountability, and support from a community that wants you to win.",
    },
  ];

  return (
    <>
      <div className="register-container">
        <div className="register-wrapper">
          <div className="user-register-left-panel">
            <div className="form-scroll-container" aria-live="polite">
              <Link to="/cohort">
                <button className="back-button">
                  <FaArrowLeft size={25} />
                </button>
              </Link>
              <div className="user-register-form-header">
                <h1>Start Your Adventure 🚀</h1>
                <p>Register for the cohort {cohortName}</p>
              </div>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="user-register-form"
              >
                <div className="input-group">
                  <label className="label" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    className="input"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="label" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    className="input"
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 80 2293 1920"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="error-message" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className={submitted ? status.class : "btn-submit"}
                  disabled={submitted}
                  aria-disabled={submitted}
                >
                  {submitted ? (
                    <>&nbsp;{status.message}</>
                  ) : (
                    "Proceed to payment"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="user-register-right-panel">
            <div className="slider-overlay"></div>
            <div className="slider-content">
              <div className="brand-section">
                <div className="brand-logo">
                  <span className="logo-icon">
                    <img src="/login-logo.png" alt="" />
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
  );
}
