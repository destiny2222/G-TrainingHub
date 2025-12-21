import React, { useEffect, useRef } from "react";
import "./RecapVideos.css";
import {
  fetchRecapMaterials,
  fetchRecapMaterialByCohortSlug,
} from "../../../redux/slices/classRecapMaterialSlice";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

function List() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recapMaterials = useSelector(
    (state) => state.classRecapMaterials.recapMaterials,
  );
  const loading = useSelector((state) => state.classRecapMaterials.loading);
  const cohortSlug = recapMaterials.cohort?.slug;
  const lastFetchedSlug = useRef();

  useEffect(() => {
    dispatch(fetchRecapMaterials());
  }, [dispatch]);

  // useEffect(() => {
  //     if (cohortSlug && lastFetchedSlug.current !== cohortSlug) {
  //         dispatch(fetchRecapMaterialByCohortSlug(cohortSlug));
  //         lastFetchedSlug.current = cohortSlug;
  //     }
  // }, [dispatch, cohortSlug]);

  // Helper function to format date as d m y
  const formatDateDMY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <div className="container p-4">
        <div className="recap-video-head-container mb-4">
          <h2 className="recap-video-heading">Class Recap Videos</h2>
          <p>
            Class Recap Videos provide concise video summaries of classroom
            lessons. They help you to review key concepts and reinforce learning
            outside class time.
          </p>
        </div>

        <div className="row">
          {recapMaterials.length === 0 && !loading ? (
            // Show this when there is no recap and not loading
            <p className="text-muted small mb-0">
              No recap materials available.
            </p>
          ) : (
            // Otherwise, show the latest recap (or skeleton while loading)
            recapMaterials.map((material) => (
              <div key={material.id} className="col-lg-6">
                <div
                  className="recap-video-card"
                  onClick={() => navigate(`/recap-videos/${material.slug}`)}
                >
                  {loading ? (
                    <Skeleton width={80} height={50} />
                  ) : (
                    <video className="rounded me-3" controls>
                      <source src={material.thumbnail_path} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <div>
                    <h4 className="recap-video-head mb-0">
                      {loading ? (
                        <Skeleton width={100} />
                      ) : (
                        // Use your actual title field here
                        material.title.slice(0, 25) ||
                        "Intro to Machine Learning"
                      )}
                    </h4>
                    <span className="recap-video-span   mb-0">
                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        // Use your actual date field here
                        formatDateDMY(material.created_at) || "20 Oct 2024"
                      )}
                    </span>
                    <p className="recap-video-description">
                      {loading ? (
                        <Skeleton count={2} />
                      ) : (
                        material.description.slice(0, 100) ||
                        "A brief overview of machine learning concepts and applications."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default List;
