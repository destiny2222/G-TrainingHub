import "./Faq.css";
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Question from "./question";

const Faq = () => {
  const faq = [
    {
      question: "How do I start?",
      answer:
        "You can begin the program by selecting your preferred training track, completing the enrollment form, and securing your spot with payment. The program is open to beginners and anyone interested in building data analytics skills, even without prior experience.",
    },
    {
      question: "What is the cost of the program?",
      answer:
        "Program fees vary depending on the training track you choose. Full pricing details are available on the enrollment page.",
    },
    {
      question: "What is the training really about?",
      answer:
        "The training focuses on equipping learners with practical data analytics skills, including collecting, organizing, analyzing, and interpreting data to support real-world decision-making.",
    },
    {
      question: "What tools will I learn during the training?",
      answer:
        "You will work with essential industry tools such as Microsoft Excel, Google Sheets, SQL, Power BI, and beginner-friendly Python for data analysis.",
    },
    {
      question: "Do I need a laptop to participate?",
      answer:
        "Yes. A laptop is required to practice with analytics tools, complete assignments, and follow along with practical sessions.",
    },
    {
      question: "Will I receive a certificate after completing the program?",
      answer:
        "Yes. Upon completing all required modules and projects, you will receive a digital certificate recognizing your achievement.",
    },
  ];

  const ref = useRef([]);
  const [open, setOpen] = useState([]);
  const [mobile, setMobile] = useState(false);
  const handleToggle = (i) => {
    setOpen((prevOpen) => {
      const newOpen = [...prevOpen];
      newOpen[i] = !newOpen[i];
      return newOpen;
    });
    ref.current[i].classList.toggle("down");
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMobile(true);
    }
  }, []);

  return (
    <div className="faq-container">
      <Question
        style={{
          position: "absolute",
          top: "14%",
          left: "70%",
          transform: "translate(-50%, -10%)",
          rotate: "45deg",
          transformOrigin: "center",
        }}
        size={"25rem"}
      />

      <Question
        size={"15rem"}
        style={{
          position: "absolute",
          top: "14%",
          left: "60%",
          transform: "translate(-50%, -20%)",
          rotate: "45deg",
          transformOrigin: "center",
        }}
      />

      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p className="sub">
          Find quick answers to common questions about our product below.
        </p>
      </div>

      <ul>
        {faq.map((item, i) => (
          <li key={i} onClick={() => handleToggle(i)}>
            <h3>
              {item.question}{" "}
              <span onClick={() => handleToggle(i)}>
                <FaChevronDown
                  className={open[i] ? "svg-rotate" : "svg-normal"}
                />
              </span>
            </h3>

            <p className="" ref={(el) => ref.current.push(el)}>
              {item.answer}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Faq;
