import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import "./Library.css";
import Skeleton from "react-loading-skeleton";

const Library = () => {
  const [data, setData] = useState([]);
  const [datum, setDatum] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const libraryData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/libraries");
        const data = response.data.data;
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    libraryData();
  }, []);

  const handleLibraryClick = (library) => {
    setDatum(library);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h1>Tech Library</h1>
        <p>
          Curated Tech Book Recommendations, focusing on highlighting essential
          reads for developers and tech enthusiasts to build knowledge in areas
          data science and Artificial Intelligence.
        </p>
      </div>

      {!loading ? (
        <div>
          {data.map((library) => (
            <div className="library-card">
              <div className="library-image-wrapper">
                <img src={library.image_url} alt="Library" />
              </div>
              <div className="library-content">
                <h2 className="library-title">
                  {library.title}
                  <Link to={library.file_url} target="_blank">
                    <FiExternalLink />
                  </Link>
                </h2>
                <h5 className="library-author">{library.author}</h5>
                <p className="library-description">
                  {truncateText(library.description, 150)}
                </p>
                <button
                  onClick={() => handleLibraryClick(library)}
                  className="read-more"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Skeleton height={120} count={4} width={"60%"} />
      )}

      <div
        style={{
          position: "fixed",
          display: showModal ? "flex" : "none",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          justifyContent: "center",
          alignItems: "center",
        }}
      />

      <div
        className="library-modal"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="library-modal-header">
          <button onClick={handleCloseModal} className="close-button">
            &times;
          </button>
        </div>
        <div className="library-modal-image-wrapper">
          <img src={datum.image_url} alt="Library" />
        </div>
        <div className="library-modal-content">
          <h2 className="library-modal-title">{datum.title}</h2>
          <h5 className="library-modal-author"> Author: {datum.author}</h5>
          <p className="library-modal-description">{datum.description}</p>
          <hr />
          <div className="library-modal-info">
            <p className="library-modal-info-item">
              <b>Published Year</b>: {datum.publish_year}
            </p>
            <p className="library-modal-info-item">
              <b>Uploaded date:</b>
              <br /> {formatDate(datum.updated_at)}
            </p>
            <p className="library-modal-info-item">
              <b>Status:</b> {datum.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
