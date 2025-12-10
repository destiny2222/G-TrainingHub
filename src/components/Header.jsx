import { useState } from "react";
import logo from "../assets/image/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    navigate("/");
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="header d-none d-lg-block">
        <div className="header_section">
          <div className="logo">
            <Link to="/" onClick={handleLogoClick}>
              <img src={logo} alt="" className="img-fluid" />
            </Link>
          </div>
          <div className="header_menu">
            <ul>
              <li>
                <Link to="/cohorts">Cohorts</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
          <div className="header_buttons">
            {/* <Link to="/auth/login" className='btn-process-button--primary  btn-process-link'>Log in</Link> */}
            <Link
              to="/login"
              className="btn-process-button--primary signup-btn"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="header-mobile d-block d-lg-none">
        <div className="header_section_mobile">
          <div className="logo">
            <Link to="/" onClick={handleLogoClick}>
              <img src={logo} alt="" className="img-fluid" />
            </Link>
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaTimes className="primary-color" />
            ) : (
              <FaBars className="primary-color" />
            )}
          </div>
        </div>
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/cohorts" onClick={toggleMenu}>
                Cohorts
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>
                About
              </Link>
            </li>

            <li>
              {" "}
              <Link to="/login" className="btn-theme primary-btn signup-btn">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
