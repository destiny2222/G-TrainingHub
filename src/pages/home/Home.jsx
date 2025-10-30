import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import testimonialImg1 from '../../assets/image/testimony/testim-3.jpg'
import testimonialImg2 from '../../assets/image/testimony/testim-3.jpg'
import testimonialImg3 from '../../assets/image/testimony/testim-3.jpg'
import featureImg1 from '../../assets/image/feature/feature-1.webp';
import featureImg2 from '../../assets/image/feature/feature-2.webp';
import featureImg3 from '../../assets/image/feature/feature-3.webp';
import videoSection from '../../assets/video/home-hero.mp4';
import medialogo1 from '../../assets/image/background/ABA logo.png';
import medialogo2 from '../../assets/image/background/AIPressRoom new.png';
import medialogo3 from '../../assets/image/background/Bora Agribusiness Afrika light_new.png';
import medialogo4 from '../../assets/image/background/africa cybersecurity Mag.png' 


const Home = () => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        margin: 50,
        autoplay: true,
        slidesToShow: 3,
        arrows:false,
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
                breakpoint:768,
                settings: {
                    slidesToShow: 1,
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
                    <p>Unlock your potential in AI and Machine Learning with our comprehensive training program. Gain hands-on experience and mentorship from industry experts.</p>
                    <div className="hero-buttons">
                        <Link to='/cohort' className="register-btn ">Register for Cohort</Link>
                        <Link className="mentors-btn ">Register as Organization</Link>
                    </div>
                </div>
            </section>
            <section className='home-hero-video-section'>
                <div className="home-hero_visual">
                    <video muted loop autoPlay className='inline-video_video'>
                        <source src={videoSection} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </section>

            <section  className='what-you-get'>
                <div className="container-fluid py-5">
                    <div className="row">
                        <div className="col-12 text-center mb-5">
                            <h2 className='what-you-get-title js-scroll slide-left'>What You'll Get</h2>
                            <p className='what-you-get-subtitle js-scroll fade-in-bottom'>
                                Our program is designed to provide you with a complete learning experience, from live training sessions to personalized mentorship and career support.
                            </p>
                        </div>
                    </div>
                    <div className="feature-slider-wrapper">
                        {/* Custom Navigation Buttons - Must be before Swiper */}
                        <button className="swiper-button-prev-custom feature-slider-arrow feature-slider-prev">
                            <i className="lni lni-chevron-left"></i>
                        </button>
                        <button className="swiper-button-next-custom feature-slider-arrow feature-slider-next">
                            <i className="lni lni-chevron-right"></i>
                        </button>
                        
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={3}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                                enabled: true,
                            }}
                            pagination={{ 
                                clickable: true,
                                el: '.swiper-pagination-custom',
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            loop={true}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                480: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                1280: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                }
                            }}
                        >
                            <SwiperSlide>
                                <div className="feature-card">
                                    <div className="feature-card-bg">
                                        <div id="" className="fluted-glass-component">
                                            <div className="fluted-glass-canvas" >
                                                <img src="https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" className="fluted-glass-image" />
                                                <canvas width="408" height="544" style={{display: "block", width: "100%", height: "100%", opacity: 1}}></canvas>
                                            </div>
                                        </div>
                                        <img src={featureImg1} className='u-img-cover' alt="" />
                                    </div>
                                    <div className="u-bg-blur cc-accordion-card"></div>
                                    <div className='feature-card-content '>
                                        <i className="lni lni-video"></i>
                                        <h3>Annual Live Training</h3>
                                        <p>Participate in live, interactive training sessions with our expert instructors.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="feature-card cursor-target">
                                    <div className="feature-card-bg">
                                        <img src={featureImg2} className='u-img-cover' alt="Rewatch & Assignment Access" />
                                    </div>
                                    <div className="u-bg-blur cc-accordion-card"></div>
                                    <div className='feature-card-content'>
                                        <i className="lni lni-play"></i>
                                        <h3>Rewatch & Assignment Access</h3>
                                        <p>Access recordings of all sessions and complete assignments at your own pace.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="feature-card cursor-target">
                                    <div className="feature-card-bg">
                                        <img src={featureImg3} className='u-img-cover' alt="Human + AI Mentorship" />
                                    </div>
                                    <div className="u-bg-blur cc-accordion-card"></div>
                                    <div className='feature-card-content'>
                                        <i className="lni lni-users"></i>
                                        <h3>Human + AI Mentorship</h3>
                                        <p>Receive guidance and support from both human mentors and our AI-powered tutor.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="feature-card cursor-target">
                                    <div className="feature-card-bg">
                                        <div id="" className="fluted-glass-component">
                                            <div className="fluted-glass-canvas" >
                                                <img src="https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" className="fluted-glass-image" />
                                                <canvas width="408" height="544" style={{display: "block", width: "100%", height: "100%", opacity: 1}}></canvas>
                                            </div>
                                        </div>
                                        <img src={featureImg1} className='u-img-cover' alt="Organization Training Options" />
                                    </div>
                                    <div className="u-bg-blur cc-accordion-card"></div>
                                    <div className='feature-card-content'>
                                        <i className="lni lni-graduation"></i>
                                        <h3>Organization Training Options</h3>
                                        <p>Equip your team with the latest AI skills through our tailored training programs.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="feature-card cursor-target">
                                    <div className="feature-card-bg">
                                        <img src={featureImg2} className='u-img-cover' alt="Certificate of Completion" />
                                    </div>
                                    <div className="u-bg-blur cc-accordion-card"></div>
                                    <div className='feature-card-content'>
                                        <i className="lni lni-certificate"></i>
                                        <h3>Certificate of Completion</h3>
                                        <p>Earn a professional certificate to showcase your new skills and knowledge.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="feature-card cursor-target">
                                    <div className="feature-card-bg">
                                        <img src={featureImg3} className='u-img-cover' alt="Performance Tracking" />
                                    </div>
                                    <div className="u-bg-blur cc-accordion-card"></div>
                                    <div className='feature-card-content'>
                                        <i className="lni lni-graph"></i>
                                        <h3>Performance Tracking</h3>
                                        <p>Monitor your progress and identify areas for improvement with our performance tracking tools.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        
                        {/* Custom Pagination */}
                        <div className="swiper-pagination-custom"></div>
                    </div>
                </div>
            </section>

            <section className='what-we-offer'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 my-3 text-center">
                            <h2 className="what-we-offer-title js-scroll fade-in-bottom">What We Offer</h2>
                            <p className="what-we-offer-subtitle js-scroll fade-in">Comprehensive AI training solutions tailored for individuals and organizations</p>
                        </div>
                    </div>
                    <div className="row what-we-offer-content">
                        <div className="col-lg-6 what-we-offer-image-wrapper">
                            <div className="what-we-offer-image-container">
                                <img 
                                    src={featureImg1} 
                                    alt="Build web experiences" 
                                    className="what-we-offer-image active"
                                    id="offer-image-1"
                                />
                                <img 
                                    src={featureImg2} 
                                    alt="Create and manage content" 
                                    className="what-we-offer-image"
                                    id="offer-image-2"
                                />
                                <img 
                                    src={featureImg3} 
                                    alt="Empower with templates" 
                                    className="what-we-offer-image"
                                    id="offer-image-3"
                                />
                                <img 
                                    src={featureImg1} 
                                    alt="Generate with AI" 
                                    className="what-we-offer-image"
                                    id="offer-image-4"
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 what-we-offer-text-wrapper">
                            <div className="what-we-offer-items">
                                <div 
                                    className="what-we-offer-item js-scroll fade-in-bottom "
                                    onMouseEnter={() => {
                                        document.querySelectorAll('.what-we-offer-image').forEach(img => img.classList.remove('active'));
                                        document.getElementById('offer-image-1').classList.add('active');
                                    }}
                                >
                                    <h3>Build web experiences in a visual canvas</h3>
                                    <p>Create stunning AI-powered web applications without extensive coding. Our visual tools make development accessible to everyone.</p>
                                    
                                </div>
                                <div 
                                    className="what-we-offer-item js-scroll fade-in-bottom "
                                    onMouseEnter={() => {
                                        document.querySelectorAll('.what-we-offer-image').forEach(img => img.classList.remove('active'));
                                        document.getElementById('offer-image-2').classList.add('active');
                                    }}
                                >
                                    <h3>Create, edit, and manage content in a visual, composable CMS</h3>
                                    <p>Master content management systems enhanced with AI capabilities. Learn to build and manage dynamic content efficiently.</p>
                                    
                                </div>
                                <div 
                                    className="what-we-offer-item js-scroll fade-in-bottom "
                                    onMouseEnter={() => {
                                        document.querySelectorAll('.what-we-offer-image').forEach(img => img.classList.remove('active'));
                                        document.getElementById('offer-image-3').classList.add('active');
                                    }}
                                >
                                    <h3>Empower everyone with page building and templates</h3>
                                    <p>Access pre-built templates and learn to customize them for your specific needs. No technical expertise required to get started.</p>
                                    
                                </div>
                                <div 
                                    className="what-we-offer-item js-scroll fade-in-bottom "
                                    onMouseEnter={() => {
                                        document.querySelectorAll('.what-we-offer-image').forEach(img => img.classList.remove('active'));
                                        document.getElementById('offer-image-4').classList.add('active');
                                    }}
                                >
                                    <h3>Generate production-ready apps and reusable components with AI</h3>
                                    <p>Harness the power of AI to accelerate your development workflow. Create production-ready applications faster than ever.</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="media-partners-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center mb-5">
                            <h2 className="media-partners-title js-scroll fade-in-bottom">Our Media Partners</h2>
                            <p className="media-partners-subtitle js-scroll fade-in">Collaborating with leading media organizations to amplify innovation and technology across Africa</p>
                        </div>
                    </div>
                    <div className="media-partners-grid js-scroll fade-in-bottom">
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo1} alt="Tech Africa" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo2} alt="AI Weekly" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo3} alt="TechCrunch" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo4} alt="Forbes Africa" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo2} alt="Disrupt Africa" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo1} alt="VentureBeat" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo3} alt="Innovation Hub" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo4} alt="Tech Times" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo1} alt="Digital Africa" />
                            </div>
                        </div>
                        <div className="media-partner-item">
                            <div className="media-partner-logo">
                                <img src={medialogo2} alt="AI News" />
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
