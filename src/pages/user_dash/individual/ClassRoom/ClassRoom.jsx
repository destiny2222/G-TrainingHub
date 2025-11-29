import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { ZoomMtg } from "@zoomus/websdk";
// import api from "../../../../utils/api";
import "./ClassRoom.css";

// ZoomMtg.setZoomJSLib("https://source.zoom.us/2.18.2/lib", "/av");
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareJssdk();

function ClassRoom() {
  const { cohortSlug } = useParams();
  const navigate = useNavigate();
  // const zoomRootRef = useRef(null);

  // useEffect(() => {
  //     const joinMeeting = async () => {
  //       try {
  //         const res = await api.get(`/user/cohorts/${cohortSlug}/zoom/join-info`);
  //         console.log("Zoom join info response:", res);
  //         const json = res.data;
  //         if (json.status !== "success") {
  //           alert(json.message || "Unable to join class");
  //           navigate("/dashboard");
  //           return;
  //         }
  
  //         const {
  //           sdkKey,
  //           signature,
  //           meetingNumber,
  //           password,
  //           userName,
  //           userEmail,
  //         } = json.data;
  
  //         ZoomMtg.init({
  //           leaveUrl: window.location.origin + "/dashboard",
  //           isSupportAV: true,
  //           success: () => {
  //             ZoomMtg.join({
  //               signature,
  //               sdkKey,
  //               meetingNumber,
  //               userName,
  //               userEmail,
  //               passWord: password,
  //               success: () => {
  //                 console.log("Joined Zoom class");
  //               },
  //               error: (err) => {
  //                 console.error(err);
  //                 alert("Failed to join meeting");
  //               },
  //             });
  //           },
  //           error: (err) => {
  //             console.error(err);
  //             alert("Failed to initialize Zoom");
  //           },
  //         });
  //       } catch (e) {
  //         console.error(e);
  //         alert("Something went wrong");
  //         navigate("/dashboard");
  //       }
  //     };
  
  //     joinMeeting();
  //   }, [cohortSlug, navigate]);

  return (
    <div className="classroom-wrapper">
      {/* <header className="classroom-header">
        <button
          className="btn btn-light"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
        <h4>Live Class</h4>
      </header> */}

      <div className="classroom-content">
        {/* Zoom will render its UI inside this div */}
        {/* <div id="zmmtg-root"/> */}
      </div>
    </div>
  )
}

export default ClassRoom