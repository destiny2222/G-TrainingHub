import React from 'react'
import footerLogo from '../assets/image/logo/footer-logo.png';
import { Link } from 'react-router-dom';
import {  Location, Message } from 'iconsax-reactjs';
import { FaFacebookF , FaLinkedinIn } from "react-icons/fa";
import { IoLogoTwitter, IoLogoInstagram  } from "react-icons/io";
import { useScrollToTop } from '../hooks/useScrollToTop';



function Footer() {
  useScrollToTop();
  return (
    <>
      <footer className='footer pt-50 pb-100'>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3  mb-5 mb-lg-0 order-1 order-lg-1">
              <Link to="/">
                <img src={footerLogo} className='img-fluid footer-logo' alt="" />
              </Link>
            </div>
            <div className="col-6 col-sm-6 col-md-6 col-lg-3 order-3 order-lg-2 mb-4 mb-lg-0">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Product</h3>
                <ul className="footer-widget-menu">
                  <li><Link to="/dollar-account">Dollar account</Link></li>
                  <li><Link to="/virtual-card">Virtual card</Link></li>
                  <li><Link to="/send-money">Send/Receive Money</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-md-6 col-lg-3 order-4 order-lg-3 mb-4 mb-lg-0">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Support</h3>
                <ul className="footer-widget-menu">
                  <li><Link to="#">Blog</Link></li>
                  <li><Link to="/faqs">FAQs</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-md-6 col-lg-3 order-5  order-lg-5 mb-4 mb-lg-0">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Contact Us</h3>
                <ul className="footer-widget-menu">
                  <li><Link to=""> <Message className='footer-icon' variant="Bold"/> info@.com</Link></li>
                  <li><p><Location className='footer-icon' variant="Bold"/> Suit E-33 </p></li>
                </ul>
              </div>
            </div>
            
          </div>
          <div className="footer-bottom">
            <div className="row">
              <div className="col-12 col-lg-6 order-lg-first order-last">
                <p className='footer-copyright'>Copyrights © {new Date().getFullYear()} .com</p>
              </div>
              <div className="col-12 col-lg-6  order-lg-last order-first">
                <div className="footer-social-icon justify-content-start justify-content-lg-end">
                  <Link to='' className='footer-bottom-icon'><FaFacebookF /></Link>
                  <Link to='' className='footer-bottom-icon'><IoLogoTwitter /></Link>
                  <Link to='' className='footer-bottom-icon'><IoLogoInstagram /></Link>
                  <Link to='' className='footer-bottom-icon'><FaLinkedinIn  /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer> 
    </>
  )
}

export default Footer
