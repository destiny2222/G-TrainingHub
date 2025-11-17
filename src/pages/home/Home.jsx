import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useCallback  } from 'react';
import Particles from "react-tsparticles";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import testimonialImg1 from '../../assets/image/testimony/testim-3.jpg'
import testimonialImg2 from '../../assets/image/testimony/testim-3.jpg'
import testimonialImg3 from '../../assets/image/testimony/testim-3.jpg'
import featureImg1 from '../../assets/image/feature/feature-1.webp';
import featureImg2 from '../../assets/image/feature/feature-2.webp';
import featureImg3 from '../../assets/image/feature/feature-3.webp';
import medialogo1 from '../../assets/image/background/ABA logo.png';
import medialogo2 from '../../assets/image/background/AIPressRoom new.png';
import medialogo3 from '../../assets/image/background/Bora Agribusiness Afrika light_new.png';
import medialogo4 from '../../assets/image/background/africa cybersecurity Mag.png'

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroVideoVisual = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroVideoVisual.current,
        { scale: 0.7, borderRadius: "1.2rem", y: -100 },
        {
          scrollTrigger: {
            trigger: heroVideoVisual.current,
            scrub: true,
            start: "-50% center",
            end: "center center",
          },
          scale: 1,
          borderRadius: 0,
          y: 0,
        },
      );
    });
    return () => ctx.revert();
  }, []);

    return (
        <>
            <Particles
                options={{
                fullScreen: {
                    enable: true,
                    zIndex: 0
                },
                particles: {
                    number: {
                    value: 200,
                    limit: 300,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                    },
                    color: {
                    value: "#ffffff"
                    },
                    shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    },
                    polygon: {
                        nb_sides: 5
                    },
                    image: {
                        src: "images/github.svg",
                        width: 100,
                        height: 100
                    }
                    },
                    opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.5,
                        sync: false
                    }
                    },
                    size: {
                    value: 6,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 10,
                        size_min: 2,
                        sync: false
                    }
                    },
                    line_linked: {
                    enable: true,
                    distance: 100,
                    color: "#ffffff",
                    opacity: 1,
                    width: 1
                    },
                    move: {
                    enable: true,
                    speed: 3,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                    onHover: {
                        enable: true,
                        mode: "bubble",
                        parallax: {
                        enable: false,
                        force: 60,
                        smooth: 10
                        }
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                    },
                    modes: {
                    grab: {
                        distance: 400,
                        lineLinked: {
                        opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 10,
                        duration: 2,
                        opacity: 1,
                        speed: 2
                    },
                    repulse: {
                        distance: 200
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                    }
                },
                backgroundMask: {
                    enable: true,
                    cover: {
                    color: {
                        value: {
                        r: 0,
                        g: 0,
                        b: 0
                        }
                    }
                    }
                },
                retina_detect: true,
                fps_limit: 60,
                background: {
                    image: "url('https://particles.js.org/images/background3.jpg')"
                }
                }}
            />
            <section className="hero-section-wrapper">
                <div className="hero-section-content">
                    <h1 className="js-scroll fade-in">Join the GritinAI Annual AI Training — <span className='primary-color'>August Cohort</span></h1>
                    <p>Unlock your potential in AI and Machine Learning with our comprehensive training program. Gain hands-on experience and mentorship from industry experts.</p>
                    <div className="hero-buttons">
                        <Link to='/cohort' className="register-btn text-white">Register for Cohort</Link>
                        <Link to='/organization/register' className="mentors-btn text-white">Register as Organization</Link>
                    </div>
                </div>
                <section className='info-section'>
                    <div className='info '>
                        <p className='text-white'>Starting at 10am blah blah blah</p>
                        <p className='text-white'>Starting at 10am blah blah blah</p>
                        <p className='text-white'>Starting at 10am blah blah blah</p>
                        <p className='text-white'>Starting at 10am blah blah blah</p>
                    </div>
                    <div className='info'><p>Starting at 10am blah blah blah</p> <p>Starting at 10am blah blah blah</p><p>Starting at 10am blah blah blah</p> <p>Starting at 10am blah blah blah</p></div></section>

        <section className="home-hero-video-section">
          <div className="home-hero_visual">
            <video
              muted
              loop
              autoPlay
              className="inline-video_video"
              ref={heroVideoVisual}
            >
              <source src="/video/home-hero.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      </section>

      <section className="what-you-get">
        <div className="container-fluid py-5">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="what-you-get-title js-scroll fade-in-bottom">
                What You'll Get
              </h2>
              <p className="what-you-get-subtitle js-scroll fade-in-bottom">
                Our program is designed to provide you with a complete learning
                experience, from live training sessions to personalized
                mentorship and career support.
              </p>
            </div>
          </div>
          <div className="feature-slider-wrapper">
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
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
                enabled: true,
              }}
              pagination={{
                clickable: true,
                el: ".swiper-pagination-custom",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                480: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 1, spaceBetween: 20 },
                1024: { slidesPerView: 2, spaceBetween: 30 },
                1280: { slidesPerView: 3, spaceBetween: 30 },
              }}
            >
              <SwiperSlide>
                <div className="feature-card">
                  <div className="feature-card-bg">
                    <img src={featureImg1} className="u-img-cover" alt="" />
                  </div>
                  <div className="u-bg-blur cc-accordion-card"></div>
                  <div className="feature-card-content">
                    <i className="lni lni-video"></i>
                    <h3>Annual Live Training</h3>
                    <p>
                      Participate in live, interactive training sessions with
                      our expert instructors.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="feature-card cursor-target">
                  <div className="feature-card-bg">
                    <img
                      src={featureImg2}
                      className="u-img-cover"
                      alt="Rewatch & Assignment Access"
                    />
                  </div>
                  <div className="u-bg-blur cc-accordion-card"></div>
                  <div className="feature-card-content">
                    <i className="lni lni-play"></i>
                    <h3>Rewatch & Assignment Access</h3>
                    <p>
                      Access recordings of all sessions and complete assignments
                      at your own pace.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="feature-card cursor-target">
                  <div className="feature-card-bg">
                    <img
                      src={featureImg3}
                      className="u-img-cover"
                      alt="Human + AI Mentorship"
                    />
                  </div>
                  <div className="u-bg-blur cc-accordion-card"></div>
                  <div className="feature-card-content">
                    <i className="lni lni-users"></i>
                    <h3>Human + AI Mentorship</h3>
                    <p>
                      Receive guidance and support from both human mentors and
                      our AI-powered tutor.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="feature-card cursor-target">
                  <div className="feature-card-bg">
                    <img
                      src={featureImg1}
                      className="u-img-cover"
                      alt="Organization Training Options"
                    />
                  </div>
                  <div className="u-bg-blur cc-accordion-card"></div>
                  <div className="feature-card-content">
                    <i className="lni lni-graduation"></i>
                    <h3>Organization Training Options</h3>
                    <p>
                      Equip your team with the latest AI skills through our
                      tailored training programs.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="feature-card cursor-target">
                  <div className="feature-card-bg">
                    <img
                      src={featureImg2}
                      className="u-img-cover"
                      alt="Certificate of Completion"
                    />
                  </div>
                  <div className="u-bg-blur cc-accordion-card"></div>
                  <div className="feature-card-content">
                    <i className="lni lni-certificate"></i>
                    <h3>Certificate of Completion</h3>
                    <p>
                      Earn a professional certificate to showcase your new
                      skills and knowledge.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="feature-card cursor-target">
                  <div className="feature-card-bg">
                    <img
                      src={featureImg3}
                      className="u-img-cover"
                      alt="Performance Tracking"
                    />
                  </div>
                  <div className="u-bg-blur cc-accordion-card"></div>
                  <div className="feature-card-content">
                    <i className="lni lni-graph"></i>
                    <h3>Performance Tracking</h3>
                    <p>
                      Monitor your progress and identify areas for improvement
                      with our performance tracking tools.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            <div className="swiper-pagination-custom"></div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 my-3 text-center">
              <h2 className="how-it-works-title js-scroll fade-in-bottom">
                How It Works
              </h2>
              <p className="how-it-works-subtitle js-scroll fade-in">
                Comprehensive AI training solutions tailored for individuals and
                organizations
              </p>
            </div>
          </div>
          <div className="row how-it-works-content">
            <div className="col-lg-6 how-it-works-image-wrapper">
              <div className="how-it-works-image-container">
                <img
                  src={featureImg1}
                  alt="Build web experiences"
                  className="how-it-works-image active"
                  id="offer-image-1"
                />
                <img
                  src={featureImg2}
                  alt="Create and manage content"
                  className="how-it-works-image"
                  id="offer-image-2"
                />
                <img
                  src={featureImg3}
                  alt="Empower with templates"
                  className="how-it-works-image"
                  id="offer-image-3"
                />
                <img
                  src={featureImg1}
                  alt="Generate with AI"
                  className="how-it-works-image"
                  id="offer-image-4"
                />
              </div>
            </div>
            <div className="col-lg-6 how-it-works-text-wrapper">
              <div className="how-it-works-items">
                <div
                  className="how-it-works-item js-scroll fade-in-bottom"
                  onMouseEnter={() => {
                    document
                      .querySelectorAll(".how-it-works-image")
                      .forEach((img) => img.classList.remove("active"));
                    document
                      .getElementById("offer-image-1")
                      .classList.add("active");
                  }}
                >
                  <h3>Register For A Cohort</h3>
                  <p>
                    Choose your preferred training track and complete a quick
                    registration to secure your spot.
                  </p>
                </div>
                <div
                  className="how-it-works-item js-scroll fade-in-bottom"
                  onMouseEnter={() => {
                    document
                      .querySelectorAll(".how-it-works-image")
                      .forEach((img) => img.classList.remove("active"));
                    document
                      .getElementById("offer-image-2")
                      .classList.add("active");
                  }}
                >
                  <h3>Access Learning Dashboard</h3>
                  <p>
                    Confirm payment and gain hands-on access to a personalized
                    dashboard where all your enrolled courses, schedules, and
                    online class details are clearly mapped out.
                  </p>
                </div>
                <div
                  className="how-it-works-item js-scroll fade-in-bottom"
                  onMouseEnter={() => {
                    document
                      .querySelectorAll(".how-it-works-image")
                      .forEach((img) => img.classList.remove("active"));
                    document
                      .getElementById("offer-image-3")
                      .classList.add("active");
                  }}
                >
                  <h3>Join Live Sessions</h3>
                  <p>
                    Learn directly from industry experts through engaging live
                    classes and practical projects.
                  </p>
                </div>
                <div
                  className="how-it-works-item js-scroll fade-in-bottom"
                  onMouseEnter={() => {
                    document
                      .querySelectorAll(".how-it-works-image")
                      .forEach((img) => img.classList.remove("active"));
                    document
                      .getElementById("offer-image-4")
                      .classList.add("active");
                  }}
                >
                  <h3>Track Learning Progress And Get Certified</h3>
                  <p>
                    Relive class moments through recorded sessions, celebrate
                    milestones, and watch your growth unfold. Earn your
                    certificate and step into the next stage of your career
                    equipped with job-ready AI skills.
                  </p>
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
              <h2 className="media-partners-title js-scroll fade-in-bottom">
                Where Our Alumni Work
              </h2>
              <p className="media-partners-subtitle js-scroll fade-in">
                Graduates from our programs now contribute to leading
                organizations, shaping the future of technology and innovation
                across Africa and beyond.
              </p>
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
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={50}
            slidesPerView={3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              600: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 1, spaceBetween: 30 },
              1024: { slidesPerView: 2, spaceBetween: 40 },
              1280: { slidesPerView: 3, spaceBetween: 50 },
            }}
          >
            <SwiperSlide>
              <div className="Testimonials-card mb-3">
                <div className="Testimonials-card-content">
                  <p className="Testimonials-card-content-text mt-3">
                    GritinAI's training transformed my career. The hands-on
                    experience and expert mentorship were invaluable.
                  </p>
                  <div className="d-flex align-items-center mt-4">
                    <img
                      src={testimonialImg1}
                      className="img_profile"
                      alt="Avatar"
                    />
                    <div className="ms-3">
                      <p className="Testimonials-card-content-name mb-0">
                        Nina R
                      </p>
                      <span className="Testimonials-card-content-position">
                        Business Owner
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="Testimonials-card mb-3">
                <div className="Testimonials-card-content">
                  <p className="Testimonials-card-content-text mt-3">
                    The comprehensive curriculum and personalized support at
                    GritinAI helped me master complex AI concepts with ease.
                  </p>
                  <div className="d-flex align-items-center mt-4">
                    <img
                      src={testimonialImg2}
                      className="img_profile"
                      alt="Avatar"
                    />
                    <div className="ms-3">
                      <p className="Testimonials-card-content-name mb-0">
                        Alex J
                      </p>
                      <span className="Testimonials-card-content-position">
                        Free Lancer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="Testimonials-card mb-3">
                <div className="Testimonials-card-content">
                  <p className="Testimonials-card-content-text mt-3">
                    I highly recommend GritinAI for anyone looking to excel in
                    AI. The practical skills I gained are directly applicable to
                    my work.
                  </p>
                  <div className="d-flex align-items-center mt-4">
                    <img
                      src={testimonialImg3}
                      className="img_profile"
                      alt="Avatar"
                    />
                    <div className="ms-3">
                      <p className="Testimonials-card-content-name mb-0">
                        Emily S
                      </p>
                      <span className="Testimonials-card-content-position">
                        Entrepreneur
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Home;
