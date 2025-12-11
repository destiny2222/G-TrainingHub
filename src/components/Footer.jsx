import React from 'react'
import footerLogo from '../assets/image/logo/footer-logo.png';
import { Link } from 'react-router-dom';
import {  CallAdd, Location, Message, MessageText1 } from 'iconsax-reactjs';
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
            <div className="col-12 col-sm-12 col-md-12 col-lg-7  mb-5 mb-lg-0 ">
              <Link to="/">
                <img src={footerLogo} className='img-fluid footer-logo'  alt="" />
              </Link>
              <p className="footer-description">
                GritinAI is an innovative artificial intelligence (AI) company dedicated to transforming businesses through cutting-edge AI solutions.
              </p>
            </div>
            <div className="col-6 col-sm-12 col-md-12 col-lg-2  mb-4 mb-lg-0">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Quick Links</h3>
                <ul className="footer-widget-menu">
                  <li><Link to="https://gritinai.com/blog" target="_blank" rel="noopener noreferrer">Blog</Link></li>
                  <li><Link to="/about">About us</Link></li>
                  <li><Link to="/faqs">FAQs</Link></li>
                  <li><Link to="/cohorts">Cohort</Link></li>
                  {/* <li><Link to="/contact">Contact us</Link></li> */}
                </ul>
              </div>
            </div>
            <div className="col-6 col-sm-12 col-md-12 col-lg-3 mb-4 mb-lg-0">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Contact Us</h3>
                <ul className="footer-widget-menu">
                  <li><Link to="mailto:info@gritinai.com"> <Message className='footer-icon' variant="Bold"/> training@gritinai.com</Link></li>
                  <li><Link to="mailto:info@gritinai.com"> <MessageText1 className='footer-icon' variant="Bold"/> info@gritinai.com</Link></li>
                  <li><p><CallAdd className='footer-icon' variant="Bold"/> 07060974359 or 08164280619 </p></li>
                </ul>
              </div>
            </div>
            
          </div>
          <div className="footer-bottom">
            <div className="row">
              <div className="col-12 col-lg-6 order-lg-first order-last">
                <p className='footer-copyright'>©Copyrights  {new Date().getFullYear()} GritinAI. All rights reserved.</p>
              </div>
              <div className="col-12 col-lg-6  order-lg-last order-first">
                <div className="footer-social-icon justify-content-start justify-content-lg-end">
                  <Link to='https://www.facebook.com/GritinAI' className='footer-bottom-icon'><FaFacebookF /></Link>
                  <Link to='https://twitter.com/GritinAI?t=MExR6i1aZAuyPwV0XRQ2_g&s=09' className='footer-bottom-icon'><IoLogoTwitter /></Link>
                  <Link to='https://instagram.com/gritinai?igshid=YmMyMTA2M2Y=' className='footer-bottom-icon'><IoLogoInstagram /></Link>
                  <Link to='https://www.linkedin.com/company/gritinai/' className='footer-bottom-icon'><FaLinkedinIn  /></Link>
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
