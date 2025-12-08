import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <section className="hero-section">
        <img src="/about/hero.jpg" alt="GritinAI Hero" className="hero-image" />
        <h1>
          AI skills shouldn't feel out of reach. So we made sure they aren't.
        </h1>
      </section>

      <section className="mission-section">
        <div className="image-text-block">
          <img src="/about/mission.jpg" alt="Our Mission" />
          <div className="text-content">
            <h2>Our Mission</h2>
            <p>
              At GritinAI, we believe that the future belongs to those who
              master the transformative power of artificial intelligence. We're
              committed to empowering professionals and enthusiasts to unlock
              their full potential in this dynamic field.
            </p>
          </div>
        </div>
      </section>

      <section className="approach-section">
        <div className="image-text-block reverse">
          <img src="/about/approach.jpg" alt="Our Approach" />
          <div className="text-content">
            <h2>Our Approach</h2>
            <p>
              Founded on a passion for data-driven innovation and machine
              learning excellence, GritinAI delivers comprehensive, hands-on
              training programs designed to build real-world skills and tech
              confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="expertise-section">
        <div className="image-text-block">
          <img src="/about/expertise.jpg" alt="Expert Mentorship" />
          <div className="text-content">
            <h2>Expert Mentorship</h2>
            <p>
              Our courses blend cutting-edge theory with practical mentorship
              from industry experts, ensuring learners not only understand AI
              concepts but can apply them effectively to drive business
              innovation and growth.
            </p>
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="image-text-block reverse">
          <img src="/about/journey.jpg" alt="Your Journey" />
          <div className="text-content">
            <h2>Your Journey</h2>
            <p>
              Whether you're aiming to enhance your career, lead digital
              transformation, or simply explore the possibilities of AI,
              GritinAI provides the knowledge, tools, and support you need to
              succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-overlay">
          <h2>Your journey to tech confidence starts here</h2>
          <button className="cta-button">Get Started</button>
        </div>
      </section>
    </div>
  );
};

export default About;
