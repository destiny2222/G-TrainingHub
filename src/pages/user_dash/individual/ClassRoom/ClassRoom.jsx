import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import "./ClassRoom.css";
import { FaExternalLinkAlt } from "react-icons/fa";

function ClassRoom() {
  const { cohortSlug } = useParams();
  const [message, setMessage] = useState("");
  const [zoomUrl, setZoomUrl] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    const getData = async () => {
      setClassName("loading");

      try {
        const res = await api.get(`/user/cohorts/${cohortSlug}/zoom/join-info`);
        setZoomUrl(res.data.data.join_url);
        setClassName("success");
        setMessage("Join Class");
      } catch (e) {
        console.error(e);
        setMessage("Unable to join class. Try again later.");
        setClassName("error");
        return;
      }
    };
    getData();
  }, [cohortSlug]);

  return (
    <div className="classroom-wrapper">
      <header className="classroom-header">
        <h1>
          Live Class for the cohort <br /> <span>"{cohortSlug}"</span>
        </h1>
        <p>
          The live class session is hosted by your instructor, who will guide
          you through the topic in real time. By joining now, you’ll have the
          opportunity to actively participate in the discussion and ask
          questions. This interactive format is designed to enhance your
          learning experience and help clarify any challenging concepts
          immediately.
        </p>

        <button
          className={`join-btn ${className}`}
          disabled={className === "loading" || className === "error"}
          onClick={() => window.open(zoomUrl, "_blank", "noopener,noreferrer")}
        >
          {className === "loading" ? (
            <div className="spinner-sm spinner" />
          ) : null}
          {message}
          {message === "Join Class" ? <FaExternalLinkAlt /> : " "}
        </button>
      </header>
    </div>
  );
}

export default ClassRoom;
