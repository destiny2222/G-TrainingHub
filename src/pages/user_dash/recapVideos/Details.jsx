import React, { useEffect, useMemo } from "react";
import "./RecapVideos.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecapMaterials } from "../../../redux/slices/classRecapMaterialSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Details() {
  const { slug } = useParams(); // ✅ material slug from /recap-videos/:slug
  const dispatch = useDispatch();

  const recapMaterials = useSelector(
    (state) => state.classRecapMaterials.recapMaterials
  );
  const loading = useSelector((state) => state.classRecapMaterials.loading);

  useEffect(() => {
    // fetch list if not already loaded
    if (!recapMaterials || recapMaterials.length === 0) {
      dispatch(fetchRecapMaterials());
    }
  }, [dispatch]);

  const material = useMemo(() => {
    return (recapMaterials || []).find((m) => m.slug === slug);
  }, [recapMaterials, slug]);

  const formatDateDMY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading && !material) {
    return (
      <div className="details-container p-4">
        <Skeleton height={30} width={250} />
        <Skeleton height={15} width={120} style={{ marginTop: 10 }} />
        <Skeleton count={4} style={{ marginTop: 10 }} />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="details-container p-4">
        <p className="text-muted">Recap material not found.</p>
      </div>
    );
  }

  return (
    <div className="details-container p-4">
      <div className="details-card">
        <h2 className="details-title mb-2">{material.title || "Untitled Recap"}</h2>

        <span className="details-date mb-2">
          {formatDateDMY(material.created_at)}
        </span>

        <p className="details-description mb-3">
          {material.description || "No description provided."}
        </p>

        {/* ✅ Zoom link (stored in file_path) */}
        {material.file_path ? (
          <a
            href={material.file_path}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Join Zoom
          </a>
        ) : (
          <p className="text-muted small">No Zoom link available.</p>
        )}

        {material.cohort && (
          <div className="details-meta mt-3">
            <span>Cohort: {material.cohort.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;
