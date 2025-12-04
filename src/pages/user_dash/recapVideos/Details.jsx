import React, { useEffect, useMemo } from "react";
import "./RecapVideos.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecapMaterialByCohortSlug } from "../../../redux/slices/classRecapMaterialSlice";

function Details() {
  const { cohortSlug } = useParams();
  const dispatch = useDispatch();
  const recapMaterials = useSelector((state) => state.classRecapMaterials.recapMaterials);
  const loading = useSelector((state) => state.classRecapMaterials.loading);

//  console.log("cohortSlug:", cohortSlug);
//  console.log("materialId:", recapMaterials);

  // Fetch recap materials for this cohort if we don't have the one we need
  useEffect(() => {
    if (cohortSlug) {
      dispatch(fetchRecapMaterialByCohortSlug(cohortSlug));
    }
  }, [dispatch, cohortSlug]);

  const formatDateDMY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading && recapMaterials.length === 0) {
    return (
      <div className="details-container p-4">
        <p>Loading recap material...</p>
      </div>
    );
  }

  if (recapMaterials.length === 0) {
    return (
      <div className="details-container p-4">
        <p className="text-muted">No recap material found.</p>
      </div>
    );
  }

  return (
    <>
    </>
    // <div className="details-container p-4">
    //   <div className="details-card">
    //     <video
    //       className="details-video rounded mb-3"
    //       controls
    //       muted
    //       loop
    //       playsInline
    //     >
    //       <source src={material.thumbnail_path} />
    //       Your browser does not support the video tag.
    //     </video>

    //     <h2 className="details-title mb-2">{material.title}</h2>

    //     <span className="details-date mb-2">
    //       {formatDateDMY(material.created_at)}
    //     </span>

    //     <p className="details-description mb-3">
    //       {material.description}
    //     </p>

    //     {material.cohort && (
    //       <div className="details-meta">
    //         <span>Cohort: {material.cohort.name}</span>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}

export default Details;
