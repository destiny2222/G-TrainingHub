import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import testimonialImg1 from '../../assets/image/testimony/testim-3.jpg'
import testimonialImg2 from '../../assets/image/testimony/testim-3.jpg'
import testimonialImg3 from '../../assets/image/testimony/testim-3.jpg'
import BlurText from '../../components/BlurText';


const Home = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        margin: 50,
        autoplay: true,
        slidesToShow: 3,
        arrows: false,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    useEffect(() => {
        const els = document.querySelectorAll('.what-you-get-subtitle');
        if (!els || els.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        els.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
    return (
        <>
            <section className="hero-section-wrapper">
                <div className="hero-section-content">
                    <h1 className="js-scroll fade-in">Join the GritinAI Annual AI Training — <span className='primary-color'>August Cohort</span></h1>
                    <BlurText
                        text="Unlock your potential in AI and Machine Learning with our comprehensive training program. Gain hands-on experience and mentorship from industry experts."
                        delay={150}
                        duration={0.5}
                        stagger={0.1}
                        animateBy="words"
                        direction="top"
                        className="text-base"
                    />
                    <div className="hero-buttons">
                        <Link to='/cohort' className="register-btn">Register for Cohort</Link>
                        <Link className="mentors-btn">Register as Organization</Link>
                    </div>
                </div>
            </section>
            <div className="next-cohort-section" >
                <div className="cohort-header">
                    <i className="lni lni-calendar"></i>
                    <h3>Next Cohort:</h3>
                </div>
                <div className='cohort-content-head'>
                    <div className="cohort-options">
                        <div className="cohort-card mb-4 mb-lg-0">
                            <h2>Nov 03, 2025</h2>
                            <p>Weekday Class: Nov 03, 2025</p>
                        </div>
                        <div className="cohort-card mb-4 mb-lg-0">
                            <h2>Nov 01, 2025</h2>
                            <p>Weekend Class, Online Class: Nov 01, 2025</p>
                        </div>
                    </div>
                    <Link to="/register" className="register-now-btn">
                        Register Now
                    </Link>
                </div>
            </div>

            <section  className='what-you-get'>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-12 text-center mb-5">
                            <h2 className='what-you-get-title js-scroll slide-left'>What You'll Get</h2>
                            <BlurText
                                text="Our program is designed to provide you with a complete learning experience, from live training sessions to personalized mentorship and career support."
                                delay={150}
                                duration={0.5}
                                stagger={0.1}
                                animateBy="words"
                                direction="top"
                                className="what-you-get-subtitle"
                            />
                            {/* <p className='what-you-get-subtitle'></p> */}
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card js-scroll slide-left">
                                <i className="lni lni-video"></i>
                                <h3>Annual Live Training</h3>
                                <p>Participate in live, interactive training sessions with our expert instructors.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card js-scroll fade-in">
                                <i className="lni lni-play"></i>
                                <h3>Rewatch & Assignment Access</h3>
                                <p>Access recordings of all sessions and complete assignments at your own pace.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card js-scroll fade-in-bottom">
                                <i className="lni lni-users"></i>
                                <h3>Human + AI Mentorship</h3>
                                <p>Receive guidance and support from both human mentors and our AI-powered tutor.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card js-scroll slide-left">
                                <i className="lni lni-graduation"></i>
                                <h3>Organization Training Options</h3>
                                <p>Equip your team with the latest AI skills through our tailored training programs.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card js-scroll fade-in-bottom">
                                <i className="lni lni-certificate"></i>
                                <h3>Certificate of Completion</h3>
                                <p>Earn a professional certificate to showcase your new skills and knowledge.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card js-scroll slide-left">
                                <i className="lni lni-graph"></i>
                                <h3>Performance Tracking</h3>
                                <p>Monitor your progress and identify areas for improvement with our performance tracking tools.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="testimonials pt-50 pb-50 js-scroll fade-in-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 my-3 justify-content-center">
                            <h2 className="testimonials-title">Hear from Our Alumni</h2>
                        </div>
                    </div>
                    <Slider {...settings}>
                        <div className="testimonial-slide">
                            <div className="Testimonials-card mb-3">
                                <div className="Testimonials-card-content">
                                    <p className="Testimonials-card-content-text mt-3">
                                        GritinAI's training transformed my career. The hands-on experience and expert mentorship were invaluable.
                                    </p>
                                    <div className="d-flex align-items-center mt-4">
                                        <img src={testimonialImg1} className="img_profile" alt="Avatar" />
                                        <div className="ms-3">
                                            <p className='Testimonials-card-content-name mb-0'>Nina R</p>
                                            <span className='Testimonials-card-content-position'>Business Owner</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-slide">
                            <div className="Testimonials-card mb-3">
                                <div className="Testimonials-card-content">
                                    <p className="Testimonials-card-content-text mt-3">
                                        The comprehensive curriculum and personalized support at GritinAI helped me master complex AI concepts with ease.
                                    </p>
                                    <div className="d-flex align-items-center mt-4">
                                        <img src={testimonialImg2} className="img_profile" alt="Avatar" />
                                        <div className="ms-3">
                                            <p className='Testimonials-card-content-name mb-0'>Alex J</p>
                                            <span className='Testimonials-card-content-position'>Free Lancer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-slide">
                            <div className=" Testimonials-card  mb-3" >
                                <div className="Testimonials-card-content">
                                    <p className="Testimonials-card-content-text mt-3">
                                        I highly recommend GritinAI for anyone looking to excel in AI. The practical skills I gained are directly applicable to my work.
                                    </p>
                                    <div className="d-flex align-items-center mt-4">
                                        <img src={testimonialImg3} className="img_profile" alt="Avatar" />
                                        <div className="ms-3">
                                            <p className='Testimonials-card-content-name mb-0'>Emily S</p>
                                            <span className='Testimonials-card-content-position'>Entrepreneur</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-slide">
                            <div className="Testimonials-card mb-3">
                                <div className="Testimonials-card-content">
                                    <p className="Testimonials-card-content-text mt-3">
                                        GritinAI's training transformed my career. The hands-on experience and expert mentorship were invaluable.
                                    </p>
                                    <div className="d-flex align-items-center mt-4">
                                        <img src={testimonialImg1} className="img_profile" alt="Avatar" />
                                        <div className="ms-3">
                                            <p className='Testimonials-card-content-name mb-0'>Nina R</p>
                                            <span className='Testimonials-card-content-position'>Business Owner</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-slide">
                            <div className="Testimonials-card mb-3">
                                <div className="Testimonials-card-content">
                                    <p className="Testimonials-card-content-text mt-3">
                                        The comprehensive curriculum and personalized support at GritinAI helped me master complex AI concepts with ease.
                                    </p>
                                    <div className="d-flex align-items-center mt-4">
                                        <img src={testimonialImg2} className="img_profile" alt="Avatar" />
                                        <div className="ms-3">
                                            <p className='Testimonials-card-content-name mb-0'>Alex J</p>
                                            <span className='Testimonials-card-content-position'>Free Lancer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-slide">
                            <div className=" Testimonials-card  mb-3" >
                                <div className="Testimonials-card-content">
                                    <p className="Testimonials-card-content-text mt-3">
                                        I highly recommend GritinAI for anyone looking to excel in AI. The practical skills I gained are directly applicable to my work.
                                    </p>
                                    <div className="d-flex align-items-center mt-4">
                                        <img src={testimonialImg3} className="img_profile" alt="Avatar" />
                                        <div className="ms-3">
                                            <p className='Testimonials-card-content-name mb-0'>Emily S</p>
                                            <span className='Testimonials-card-content-position'>Entrepreneur</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-slide">
                            <div className="Testimonials-card mb-3">
                                <div className="Testimonials-card-content">
                                    <p className="Testimonials-card-content-text mt-3">
                                        GritinAI's training transformed my career. The hands-on experience and expert mentorship were invaluable.
                                    </p>
                                    <div className="d-flex align-items-center mt-4">
                                        <img src={testimonialImg1} className="img_profile" alt="Avatar" />
                                        <div className="ms-3">
                                            <p className='Testimonials-card-content-name mb-0'>Nina R</p>
                                            <span className='Testimonials-card-content-position'>Business Owner</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </section>
        </>
    );
};

export default Home;
