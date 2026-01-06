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
                  role="button"
                  tabIndex={0}
                >
                  {loading ? (
                    <Skeleton width={80} height={50} />
                  ) : (
                    <div
                      className="rounded me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "50px", background: "#f5f6f7" }}
                    >
                      {material.file_path ? (
                        <a
                          href={material.file_path}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-decoration-none fw-semibold"
                          style={{ fontSize: "12px" }}
                        >
                          Zoom
                        </a>
                      ) : (
                        <span className="text-muted" style={{ fontSize: "12px" }}>
                          No link
                        </span>
                      )}
                    </div>
                  )}

                  <div>
                    <h4 className="recap-video-head mb-0">
                      {loading ? (
                        <Skeleton width={100} />
                      ) : (
                        (material.title ? material.title.slice(0, 25) : "Untitled Recap")
                      )}
                    </h4>

                    <span className="recap-video-span mb-0">
                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        formatDateDMY(material.created_at)
                      )}
                    </span>

                    <p className="recap-video-description">
                      {loading ? (
                        <Skeleton count={2} />
                      ) : (
                        (material.description
                          ? material.description.slice(0, 100)
                          : "No description provided.")
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
