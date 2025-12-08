import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { fetchUserEnrolledCohorts } from "../../../../redux/slices/userEnrolledCohortSlice";
import { useSelector, useDispatch } from "react-redux";
import "./Calendar.css";

const Calendar = () => {
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(7); // August (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const dispatch = useDispatch();
  const { enrollment, loading, error } = useSelector(
    (state) => state.userEnrolledCohorts,
  );

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

  const highlightedDates = getDateIntervals(
    "2025-12-01T00:00:00.000000Z",
    "2026-02-02T00:00:00.000000Z",
  );

  // const highlightedDates = { 7: [6, 7, 8], 8: [12, 13], 9: [14, 15] };

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
      {/* <div
        className="overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 99,
        }}
      />
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
      </div>*/}
    </>
  );
};

export default Calendar;
