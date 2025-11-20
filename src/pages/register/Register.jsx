import React, { useRef, useState, useEffect } from "react";
import "./Register.css";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import Particles from "react-tsparticles";

export default function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { id } = useParams();
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

    const formData = { name, email, phone };

    try {
      setSubmitted(true);
      setErrorMessage("");

      await api.post(`/cohorts/${id}/register`, formData);

      // Initialize payment and redirect

      const redirect = await api.post(`/payment/initialize`, {
        email,
        name,
        phone,
        cohort_id: id,
      });

      setStatus({
        class: "button-success",
        message: "Successful",
        status: true,
      });

      // Redirect to payment page if URL is provided
      if (redirect) {
        window.location.href = redirect.data.data.authorization_url;
        return; // Don't reset form if redirecting
      }
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

  return (
    <>
      <div className="register-container">
        <div className="form-card" aria-live="polite">
          <h1 className="title">Register For A Cohort</h1>
          <p className="subtitle">Join us today and get started</p>

          <form ref={formRef} onSubmit={handleSubmit} className="form">
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
              className={submitted ? status.class : "button"}
              disabled={submitted}
              aria-disabled={submitted}
            >
              {submitted ? <>&nbsp;{status.message}</> : "Proceed to payment"}
            </button>
          </form>
        </div>
      </div>
      <div className="particles">
        <Particles
          options={{
            fullScreen: {
              enable: true,
              zIndex: -3,
            },
            particles: {
              number: {
                value: 100,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              color: {
                value: "#ffffff",
              },
              shape: {
                type: "circle",
                stroke: {
                  width: 0,
                  color: "#000000",
                },
                polygon: {
                  nb_sides: 5,
                },
                image: {
                  src: "img/github.svg",
                  width: 100,
                  height: 100,
                },
              },
              opacity: {
                value: 0.5,
                random: false,
              },
              size: {
                value: 3,
                random: true,
                anim: {
                  enable: false,
                  speed: 40,
                  size_min: 0.1,
                  sync: false,
                },
              },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#1d28fc",
                opacity: 0.4,
                width: 1,
              },
              move: {
                enable: true,
                speed: 1.2,
                direction: "top",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                  enable: false,
                  rotateX: 600,
                  rotateY: 1200,
                },
              },
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },

            retina_detect: true,
            fps_limit: 60,
          }}
        />
      </div>
    </>
  );
}
