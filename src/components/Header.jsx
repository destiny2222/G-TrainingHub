import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/image/logo/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { DollarSquare, CardPos, ConvertCard } from 'iconsax-reactjs';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const closeDropdown = () => {
    setIsProductDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsProductDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProductDropdownOpen(false);
  };

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const handleLogoClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    navigate('/');
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="header d-none d-lg-block">
        <div className="header_section">
            <div className="logo">
              <Link to="/" onClick={handleLogoClick}>
                <img src={logo} alt="" className='img-fluid'/>
              </Link>
            </div>
            <div className="header_menu">
                <ul>
                    <li className="nav-item dropdown" ref={desktopDropdownRef}>
                      <Link to="#" className="nav-link dropdown-toggle" onClick={toggleProductDropdown}>
                        Courses
                      </Link>
                      <div className={`header-dropdown-menu ${isProductDropdownOpen ? 'show' : ''}`}>
                        <Link to="/dollar-account" className="header-dropdown-menu-item" onClick={closeDropdown}>
                          <DollarSquare /> USD account
                          <span>Get an individual or business USD account</span>
                        </Link>
                        <Link to="/virtual-card" className="header-dropdown-menu-item" onClick={closeDropdown}>
                          <CardPos /> Virtual card
                          <span>Get an individual or business USD account</span>
                        </Link>
                        <Link to="/send-money" className="header-dropdown-menu-item" onClick={closeDropdown}>
                          <ConvertCard /> Send & Receive Money
                          <span>Get an individual or business USD account</span>
                        </Link>
                      </div>
                    </li>
                    <li><Link to="/cohort">Cohort</Link></li>
                    <li><Link to="/pricing">How it works</Link></li>
                    <li><Link to="/faqs">FAQs</Link></li>
                </ul>
            </div>   
            <div className="header_buttons">
                {/* <Link to="/auth/login" className='btn-process-button--primary  btn-process-link'>Log in</Link> */}
                <Link to="/login" className='btn-process-button--primary signup-btn'>Get Started</Link>
            </div> 
        </div>
      </header>

      {/* Mobile Header */}
      <header className="header-mobile d-block d-lg-none">
        <div className="header_section_mobile">
          <div className="logo">
            <Link to="/" onClick={handleLogoClick}>
              <img src={logo} alt="" className='img-fluid'/>
            </Link>
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes className='primary-color' /> : <FaBars className='primary-color'/>}
          </div>
        </div>
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li className="nav-item dropdown" ref={mobileDropdownRef}>
              <Link to="#" className="nav-link dropdown-toggle" onClick={toggleProductDropdown}>
                Product
              </Link>
              <div className={`header-dropdown-menu ${isProductDropdownOpen ? 'show' : ''}`}>
                <Link to="/dollar-account" className="header-dropdown-menu-item" onClick={toggleMenu}>
                  <DollarSquare /> USD account
                  <span>Get an individual or business USD account</span>
                </Link>
                <Link to="/virtual-card" className="header-dropdown-menu-item" onClick={toggleMenu}>
                  <CardPos /> Virtual card
                  <span>Get an individual or business USD account</span>
                </Link>
                <Link to="/send-money" className="header-dropdown-menu-item" onClick={toggleMenu}>
                  <ConvertCard /> Send & Receive Money
                  <span>Get an individual or business USD account</span>
                </Link>
              </div>
            </li>
            <li><Link to="#" onClick={toggleMenu}>Features</Link></li>
            <li><Link to="/faqs" onClick={toggleMenu}>FAQs</Link></li>
            <li><Link to="/pricing" onClick={toggleMenu}>Pricing</Link></li>
            <li><Link to="#" onClick={toggleMenu}>Blog</Link></li>
            <li><Link to="/signup" className='btn-theme signup-btn' onClick={toggleMenu}>Get Started</Link></li>
            <li><Link to="/login" className='btn-theme login-btn' onClick={toggleMenu}>Log in</Link></li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
