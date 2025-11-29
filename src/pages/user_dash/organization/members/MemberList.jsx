import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Add,
  SearchNormal1,
  Edit2,
  Trash,
  Eye,
  People,
  ArrowLeft2,
  ArrowRight2,
  Sms,
} from "iconsax-reactjs";
import { toast } from "react-toastify";
import {
  getOrganizationMembers,
  deleteOrganizationMember,
} from "../../../../redux/slices/organisationUserSlice";
import "./member.css";

const MemberList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { members, loading, error } = useSelector(
    (state) => state.organizationUser,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch members on component mount
  useEffect(() => {
    dispatch(getOrganizationMembers());
  }, [dispatch]);

  // Ensure members is always an array
  const membersList = Array.isArray(members) ? members : [];

  // Filter members based on search and filters
  const filteredMembers = membersList.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle delete member
  const handleDeleteMember = (memberId, memberName) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${memberName} from the organization?`,
      )
    ) {
      dispatch(deleteOrganizationMember(memberId));
      toast.success(`${memberName} has been removed from the organization.`);
    }
  };

  const handleShowMember = (memberId) => {
    navigate(`/organization/members/${memberId}`);
  };

  const handleEditMember = (memberId) => {
    navigate(`/organization/members/${memberId}/edit`);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="member-list-container">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="member-list-container">
        <div className="alert alert-danger" role="alert">
          <h4>Error Loading Members</h4>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => dispatch(getOrganizationMembers())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="member-list-container">
      {/* Header Section */}
      <div className="member-header d-flex justify-content-between align-items-center mb-4 fade-in-up">
        <div>
          <h1>Organization Members</h1>
          <p>Manage and monitor your organization's team members</p>
        </div>
        <Link to="/organization/members/create" className="add-member-btn">
          <Add size="20" />
          Add Member
        </Link>
      </div>
      {/* Search and Filters */}
      <div className="search-filter-section fade-in-up">
        <div className="row align-items-center">
          <div className="col-md-8 mb-3 mb-md-0">
            <div className="search-input-wrapper">
              <SearchNormal1 size="20" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search members"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <div className="filter-group d-flex align-items-center gap-2">
                <label className="filter-label">Status:</label>
                <select
                  className="filter-select-inline"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  aria-label="Filter by Role"
                >
                  <option value="">All Role</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
              {(searchTerm || roleFilter) && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="statistics-section mb-4 fade-in-up">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="stat-card">
              <h6 className="stat-title">Total Members</h6>
              <div className="stat-number">{membersList.length}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card active">
              <h6 className="stat-title">Active Members</h6>
              <div className="stat-number">
                {
                  membersList.filter(
                    (member) => member.status?.toLowerCase() === "active",
                  ).length
                }
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h6 className="stat-title">Inactive Members</h6>
              <div className="stat-number">
                {
                  membersList.filter(
                    (member) => member.status?.toLowerCase() === "inactive",
                  ).length
                }
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h6 className="stat-title">Roles</h6>
              <div className="stat-number">
                {new Set(membersList.map((member) => member.role)).size}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="members-table-card fade-in-up">
        {currentMembers.length > 0 ? (
          <div className="table-responsive">
            <table className="members-table table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">Member</th>
                  <th scope="col">Role</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Joined Date</th>
                  <th scope="col" className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="member-avatar">
                          {member.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="member-info">
                          <h6>{member.name || "N/A"}</h6>
                          <div className="member-email">
                            <Sms size="14" />
                            {member.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`role-badge ${member.role?.toLowerCase() || "member"}`}
                      >
                        {member.role || "Member"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`phone-badge ${member.phone ? "has-phone" : "no-phone"}`}
                      >
                        {member.phone || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${member.status?.toLowerCase() || "active"}`}
                      >
                        {member.status || "Active"}
                      </span>
                    </td>
                    <td className="text-muted">
                      {member.created_at
                        ? new Date(member.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => handleShowMember(member.id)}
                          title="View Details"
                          aria-label={`View details of ${member.name}`}
                        >
                          <Eye size="16" />
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditMember(member.id)}
                          title="Edit Member"
                          aria-label={`Edit ${member.name}`}
                        >
                          <Edit2 size="16" />
                        </button>

                        {member.role !== "admin" && (
                          <button
                            className="action-btn delete"
                            onClick={() =>
                              handleDeleteMember(member.id, member.name)
                            }
                            title="Remove Member"
                            aria-label={`Remove ${member.name} from organization`}
                          >
                            <Trash size="16" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <People size="64" />
            </div>
            <h5>No members found</h5>
            <p>
              {searchTerm || roleFilter
                ? "Try adjusting your search criteria or filters."
                : "Start by adding your first organization member."}
            </p>
            {!searchTerm && !roleFilter && (
              <Link
                to="/organization/members/create"
                className="empty-state-btn"
              >
                <Add size="20" />
                Add First Member
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-info">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
            {filteredMembers.length} entries
          </div>
          <nav>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ArrowLeft2 size="16" />
                  Previous
                </button>
              </li>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + Math.max(1, currentPage - 2);
                if (pageNum > totalPages) return null;
                return (
                  <li
                    key={pageNum}
                    className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}
                      aria-label={`Page ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <ArrowRight2 size="16" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MemberList;
