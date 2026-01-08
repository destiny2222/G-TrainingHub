import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizationCohorts,
  initializeCohortPayment,
} from "../../../../redux/slices/admin_organisation/trainingProgramSlice";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./TrainingProgram.css";

const TrainingCohortList = () => {
  const dispatch = useDispatch();
  const { organizationCohorts, loading, error, paymentLoading } = useSelector(
    (state) => state.trainingProgram
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterSubscriptionType, setFilterSubscriptionType] = useState("all");

  /**
   * ✅ Payment UI logic:
   * - If payment_status !== 1 => show "pending"
   * - If payment_status === 1 => show enum status ("paid", "expired", "cancelled")
   */
  const displayStatus = (subscription) => {
    const paid = Number(subscription?.payment_status) === 1;
    if (!paid) return "pending";
    return (subscription?.status || "paid").toLowerCase();
  };

  // Optional: if you still want a simple payment label from 0/1 for cohort field
  const getPaymentLabel = (payment_status) =>
    Number(payment_status) === 1 ? "paid" : "pending";

  const handlePayment = async (cohortId) => {
    try {
      const resultAction = await dispatch(initializeCohortPayment(cohortId));
      if (initializeCohortPayment.fulfilled.match(resultAction)) {
        const { authorization_url } = resultAction.payload.data;
        if (authorization_url) {
          window.location.href = authorization_url;
        } else {
          toast.error(
            "Payment initialization failed: No authorization URL received"
          );
        }
      } else {
        toast.error(resultAction.payload || "Payment initialization failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    dispatch(getOrganizationCohorts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const filteredCohorts = organizationCohorts.filter((cohort) => {
    const cohortData = cohort.cohort || cohort;
    const subscription = cohort.cohort ? cohort : null;

    // Search filter
    const matchesSearch =
      cohortData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cohortData.course?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cohort.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription?.paid_by?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subscription?.paid_by?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Cohort status filter
    const cohortStatus = cohortData.status || cohort.status;
    const matchesFilter = filterStatus === "all" || cohortStatus === filterStatus;

    // ✅ Payment filter (uses payment_status first, NOT enum status default)
    const paymentLabel = subscription
      ? displayStatus(subscription) // pending OR paid/expired/cancelled (only if paid)
      : getPaymentLabel(cohortData.payment_status); // fallback if list item isn't wrapped

    const matchesPaymentFilter =
      filterPaymentStatus === "all" || paymentLabel === filterPaymentStatus;

    // Subscription type filter
    const subscriptionType = subscription?.subscription_type || cohort.subscription_type;
    const matchesSubscriptionType =
      filterSubscriptionType === "all" || subscriptionType === filterSubscriptionType;

    return (
      matchesSearch && matchesFilter && matchesPaymentFilter && matchesSubscriptionType
    );
  });

  const getStatusClass = (startDate, endDate, status) => {
    if (status === "inactive") return "inactive";

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "inactive";
    if (now > end) return "completed";
    return "active";
  };

  // ✅ Stats must also rely on payment_status, not enum status default
  const paidCount = organizationCohorts.filter((c) => {
    const subscription = c.cohort ? c : null;
    if (subscription) return Number(subscription.payment_status) === 1;
    const cohortData = c.cohort || c;
    return Number(cohortData.payment_status) === 1;
  }).length;

  const totalPaidAmount = organizationCohorts
    .filter((c) => {
      const subscription = c.cohort ? c : null;
      if (subscription) return Number(subscription.payment_status) === 1;
      const cohortData = c.cohort || c;
      return Number(cohortData.payment_status) === 1;
    })
    .reduce((sum, c) => sum + parseFloat(c.amount_paid || 0), 0);

  if (loading) {
    return (
      <div className="training-program-container">
        <div className="training-program-header">
          <h1>Training Cohorts</h1>
          <Skeleton width={150} height={40} />
        </div>

        <div className="training-program-filters">
          <Skeleton height={45} width={300} />
          <Skeleton height={45} width={150} />
        </div>

        <div className="training-program-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <Skeleton width={100} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: "0.5rem" }} />
            </div>
          ))}
        </div>

        <div className="training-program-table-container">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cohort-card">
              <Skeleton height={150} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-container">
      <div className="training-program-header">
        <h1>Training Cohorts</h1>
        <Link
          to="/organization/trainings/assign"
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5V15M5 10H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Assign Member
        </Link>
      </div>

      <div className="training-program-filters">
        <div className="search-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by cohort, course, or member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Cohort Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Payment:</label>
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            {/* keep only if you truly support it */}
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Subscription:</label>
          <select
            value={filterSubscriptionType}
            onChange={(e) => setFilterSubscriptionType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="one_time">One Time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
      </div>

      <div className="training-program-stats">
        <div className="stat-card">
          <h4>Total Subscriptions</h4>
          <p className="stat-value">{organizationCohorts.length}</p>
        </div>

        <div className="stat-card">
          <h4>Paid</h4>
          <p className="stat-value">{paidCount}</p>
        </div>

        <div className="stat-card">
          <h4>Active Cohorts</h4>
          <p className="stat-value">
            {organizationCohorts.filter((c) => {
              const cohortData = c.cohort || c;
              return cohortData.status === "active";
            }).length}
          </p>
        </div>

        <div className="stat-card">
          <h4>Total Amount</h4>
          <p className="stat-value">₦{Number(totalPaidAmount).toLocaleString()}</p>
        </div>
      </div>

      <div className="training-program-table-container">
        {filteredCohorts.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                borderRadius: "0.5rem",
                overflow: "hidden",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Cohort / Course
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Paid By
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Dates
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Amount
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Subscription
                  </th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Members
                  </th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Status
                  </th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCohorts.map((subscription) => {
                  const cohort = subscription.cohort || subscription;
                  const course = cohort.course || {};
                  const paidBy = subscription.paid_by;

                  // ✅ the subscription/payment status shown depends on payment_status
                  const shownPaymentStatus = subscription.cohort
                    ? displayStatus(subscription)
                    : getPaymentLabel(cohort.payment_status);

                  const isPaid = subscription.cohort
                    ? Number(subscription.payment_status) === 1
                    : Number(cohort.payment_status) === 1;

                  return (
                    <tr key={subscription.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {course.image && (
                            <img
                              src={course.image}
                              alt={course.title}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "0.375rem",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: "600", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                              {cohort.name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                              {course.title || cohort.course_title}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                              {cohort.duration}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                        {paidBy ? (
                          <div>
                            <div style={{ fontWeight: "500" }}>{paidBy.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{paidBy.email}</div>
                          </div>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>N/A</span>
                        )}
                      </td>

                      <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <div>
                            <span style={{ fontWeight: "500" }}>Start:</span>{" "}
                            <span style={{ color: "#6b7280" }}>
                              {new Date(cohort.start_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontWeight: "500" }}>End:</span>{" "}
                            <span style={{ color: "#6b7280" }}>
                              {new Date(cohort.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: "600" }}>
                        {subscription.currency} {Number(subscription.amount_paid || cohort.price).toLocaleString()}
                      </td>

                      <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                        {subscription.subscription_type ? (
                          <div>
                            <div style={{ fontWeight: "500", textTransform: "capitalize" }}>
                              {subscription.subscription_type?.replace("_", " ")}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                              Expires: {new Date(subscription.expires_at).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>N/A</span>
                        )}
                      </td>

                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center" }}>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                            <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#059669" }}>
                              {cohort.enrolled_members_count || 0}
                            </span>{" "}
                            Enrolled
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                            <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#2563eb" }}>
                              {cohort.active_members_count || 0}
                            </span>{" "}
                            Active
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                            <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#7c3aed" }}>
                              {cohort.completed_members_count || 0}
                            </span>{" "}
                            Completed
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                          
                          <span
                            className={`status-badge ${getStatusClass(
                              cohort.start_date,
                              cohort.end_date,
                              cohort.status
                            )}`}
                          >
                            {cohort.status}
                          </span>

                          {/* ✅ enum status shown ONLY if payment_status === 1 otherwise "pending" */}
                          <span className={`status-badge ${isPaid ? "active" : "inactive"}`}>
                            {shownPaymentStatus}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                          <Link
                            to={`/organization/trainings/cohorts/${cohort.id}/members`}
                            className="btn-primary"
                            style={{
                              padding: "0.5rem 1rem",
                              fontSize: "0.875rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            View Members
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-content">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z"
                  stroke="#D1D5DB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3>No cohorts found</h3>
              <p>No cohorts match your current filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCohortList;
