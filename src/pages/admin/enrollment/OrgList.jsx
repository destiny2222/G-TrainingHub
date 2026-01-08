import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRegisterOrg,
  approvePayment,
  rejectPayment,
} from "../../../redux/slices/super_admin/RegisterCohortOrg";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import '../../admin/course/Course.css';

const OrgList = () => {
  const dispatch = useDispatch();

  // ✅ IMPORTANT: matches the reducer key you will add to store: registerOrg
  const { subscriptions, loading, actionLoading, error } = useSelector(
    (state) => state.registerOrg
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState("all"); // all|paid|pending

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState("approve"); // approve|reject

  useEffect(() => {
    dispatch(fetchRegisterOrg());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.message || error?.error || "Something went wrong";
      toast.error(msg);
    }
  }, [error]);

  const paymentLabel = (payment_status) =>
    Number(payment_status) === 1 ? "paid" : "pending";

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return (subscriptions || []).filter((item) => {
      const matchesSearch =
        !term ||
        item.user_name?.toLowerCase().includes(term) ||
        item.user_email?.toLowerCase().includes(term) ||
        item.organization_name?.toLowerCase().includes(term) ||
        String(item.cohort_id || "").toLowerCase().includes(term) ||
        String(item.reference || "").toLowerCase().includes(term);

      const label = paymentLabel(item.payment_status);
      const matchesPayment =
        filterPayment === "all" || label === filterPayment;

      return matchesSearch && matchesPayment;
    });
  }, [subscriptions, searchTerm, filterPayment]);

  const openModal = (row, type) => {
    setSelectedRow(row);
    setActionType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setActionType("approve");
    setShowModal(false);
  };

  const handleConfirm = async () => {
    if (!selectedRow) return;

    try {
      const payload = {
        organization_id: selectedRow.organization_id,
        cohort_id: selectedRow.cohort_id,
      };

      if (actionType === "approve") {
        await dispatch(approvePayment(payload)).unwrap();
        toast.success("Payment approved successfully!");
      } else {
        await dispatch(rejectPayment(payload)).unwrap();
        toast.success("Payment rejected successfully!");
      }

      closeModal();
      dispatch(fetchRegisterOrg());
    } catch (e) {
      const msg =
        typeof e === "string"
          ? e
          : e?.message || e?.error || "Action failed";
      toast.error(msg);
    }
  };

  const stats = useMemo(() => {
    const total = subscriptions?.length || 0;
    const paid = (subscriptions || []).filter((x) => Number(x.payment_status) === 1).length;
    const pending = total - paid;
    const totalAmountPaid = (subscriptions || [])
      .filter((x) => Number(x.payment_status) === 1)
      .reduce((sum, x) => sum + Number(x.amount || 0), 0);

    return { total, paid, pending, totalAmountPaid };
  }, [subscriptions]);

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="course-list-header">
          <h1>Registered Organizations</h1>
          <Skeleton width={160} height={40} />
        </div>

        <div className="course-filters">
          <Skeleton height={45} width={320} />
          <Skeleton height={45} width={180} />
        </div>

        <div className="course-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <Skeleton width={120} height={20} />
              <Skeleton width={60} height={30} style={{ marginTop: "0.5rem" }} />
            </div>
          ))}
        </div>

        <div className="course-table-container">
          <Skeleton height={260} />
        </div>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Registered Organizations</h1>
      </div>

      <div className="course-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by org, user, email, cohort id, reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Payment:</label>
          <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button
          className="btn-primary"
          onClick={() => dispatch(fetchRegisterOrg())}
          disabled={actionLoading}
          style={{ marginLeft: "auto" }}
        >
          Refresh
        </button>
      </div>

      <div className="course-stats">
        <div className="stat-card">
          <h4>Total Registrations</h4>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Paid</h4>
          <p className="stat-value">{stats.paid}</p>
        </div>
        <div className="stat-card">
          <h4>Pending</h4>
          <p className="stat-value">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h4>Total Amount Paid</h4>
          <p className="stat-value">₦{Number(stats.totalAmountPaid).toLocaleString()}</p>
        </div>
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Paid By</th>
              <th>Cohort</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Payment</th>
              {/* <th>Reference</th> */}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((row) => {
                const label = paymentLabel(row.payment_status);
                const isPaid = label === "paid";

                return (
                  <tr key={row.id}>
                    <td>
                      <div className="course-title">
                        <h4>{row.organization_name || "N/A"}</h4>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{row.user_name || "N/A"}</div>
                        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>{row.user_email || ""}</div>
                      </div>
                    </td>

                    <td>
                      <span className="category-badge">{row.cohort_title}</span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {Number(row.total_number_members || 0)}
                    </td>

                    <td style={{ fontWeight: 700 }}>
                      ₦{Number(row.amount || 0).toLocaleString()}
                    </td>

                    <td>
                      {isPaid ? (
                        <span className="status-badge active">Paid</span>
                      ) : (
                        <span className="status-badge inactive">Pending</span>
                      )}
                    </td>

                    {/* <td style={{ fontSize: "0.85rem" }}>
                      {row.reference || "N/A"}
                    </td> */}

                    <td>
                      <div className="action-buttons">
                        {!isPaid ? (
                          <>
                            <button
                              className="btn-action btn-edit"
                              title="Approve Payment"
                              disabled={actionLoading}
                              onClick={() => openModal(row, "approve")}
                            >
                              ✓
                            </button>
                            <button
                              className="btn-action btn-delete"
                              title="Reject Payment"
                              disabled={actionLoading}
                              onClick={() => openModal(row, "reject")}
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-action btn-delete"
                            title="Reject Payment"
                            disabled={actionLoading}
                            onClick={() => openModal(row, "reject")}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <div className="no-data-content">
                    <h3>No registrations found</h3>
                    <p>Try adjusting your search/filter.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Confirm Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            style={{ width: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body d-flex text-center align-items-center justify-content-center">
              <h3>
                {actionType === "approve"
                  ? "Approve this payment?"
                  : "Reject this payment?"}
              </h3>
            </div>

            <div className="modal-footer d-flex justify-content-center">
              <button className="btn-modal-cancel" onClick={closeModal} disabled={actionLoading}>
                Cancel
              </button>
              <button
                className={actionType === "approve" ? "btn-modal-confirm" : "btn-modal-reject"}
                onClick={handleConfirm}
                disabled={actionLoading}
              >
                {actionLoading
                  ? actionType === "approve"
                    ? "Approving..."
                    : "Rejecting..."
                  : actionType === "approve"
                  ? "Approve"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgList;
