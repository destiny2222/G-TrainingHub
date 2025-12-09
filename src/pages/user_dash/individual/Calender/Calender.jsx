import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import "./Calendar.css";

const Calendar = ({ start, end }) => {
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(7); // August (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  function getDateIntervals(startDate, endDate, intervalDays = 3) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = {};

    let current = new Date(start);

    while (current <= end) {
      const month = current.getMonth();
      const day = current.getDate();

      if (!result[month]) {
        result[month] = [];
      }

      result[month].push(day);
      current.setDate(current.getDate() + intervalDays);
    }
    return result;
  }

  const highlightedDates = getDateIntervals(start, end);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      let isHighlighted = false;
      if (highlightedDates[currentMonth]) {
        isHighlighted = highlightedDates[currentMonth].includes(day);
      }
      days.push(
        <div
          key={day}
          className={`calendar-day ${isHighlighted ? "highlighted" : ""}`}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <>
      <div  className="overlay mt-5" />
      <div className="calendar-section cal">
        <h2>Live Sessions Calendar</h2>
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={() => navigateMonth("prev")}>
              <FaChevronLeft size={20} />
            </button>
            <span>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={() => navigateMonth("next")}>
              <FaChevronRight size={20} />
            </button>
          </div>
          <div className="calendar-weekdays">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="calendar-grid">{renderCalendar()}</div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
