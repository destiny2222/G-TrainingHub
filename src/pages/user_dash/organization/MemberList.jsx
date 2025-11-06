import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Add, 
  SearchNormal1, 
  Filter, 
  Edit2, 
  Trash, 
  Eye,
  People,
  ArrowLeft2,
  ArrowRight2,
  User,
  Sms,
  Crown,
  Calendar
} from 'iconsax-reactjs';
import { toast } from 'react-toastify';
import {
  getOrganizationMembers,
  deleteOrganizationMember,
  clearError,
  clearSuccess
} from '../../../redux/slices/organisationUserSlice';
import { useAuth } from '../../../contexts/AuthContext';

const MemberList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redux state
  const { 
    members, 
    loading, 
    error, 
    success 
  } = useSelector(state => state.organizationUser);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage] = useState(10);

  // Get organization slug from user data
  const organizationSlug = user?.organization?.slug;

  // Fetch members on component mount
  useEffect(() => {
    if (organizationSlug) {
      dispatch(getOrganizationMembers(organizationSlug));
    }
  }, [dispatch, organizationSlug]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success('Action completed successfully!');
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || member.role === roleFilter;
    const matchesStatus = !statusFilter || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle delete member
  const handleDeleteMember = (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
      dispatch(deleteOrganizationMember({
        organization: organizationSlug,
        organizationUser: memberId
      }));
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'badge-danger';
      case 'manager': return 'badge-warning';
      case 'member': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-secondary';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Organization Members</h1>
          <p className="text-muted mb-0">
            Manage and monitor your organization's team members
          </p>
        </div>
        <Link 
          to="/organization/members/create" 
          className="btn btn-primary d-flex align-items-center"
        >
          <Add size="20" className="me-2" />
          Add Member
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0">Total Members</h5>
                  <h2 className="mb-0">{members.length}</h2>
                </div>
                <People size="40" variant="Bulk" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0">Active Members</h5>
                  <h2 className="mb-0">
                    {members.filter(m => m.status?.toLowerCase() === 'active').length}
                  </h2>
                </div>
                <User size="40" variant="Bulk" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0">Pending</h5>
                  <h2 className="mb-0">
                    {members.filter(m => m.status?.toLowerCase() === 'pending').length}
                  </h2>
                </div>
                <Calendar size="40" variant="Bulk" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0">Admins</h5>
                  <h2 className="mb-0">
                    {members.filter(m => m.role?.toLowerCase() === 'admin').length}
                  </h2>
                </div>
                <Crown size="40" variant="Bulk" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="position-relative">
                <SearchNormal1 
                  size="20" 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
                />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="d-flex gap-2">
                <button
                  className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size="20" className="me-2" />
                  Filters
                </button>
                {(searchTerm || roleFilter || statusFilter) && (
                  <button className="btn btn-outline-secondary" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-2">
              <div className="text-muted text-end">
                {filteredMembers.length} of {members.length} members
              </div>
            </div>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="row mt-3 pt-3 border-top">
              <div className="col-md-6 mb-3">
                <label className="form-label">Filter by Role</label>
                <select
                  className="form-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="member">Member</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Filter by Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="card">
        <div className="card-body p-0">
          {currentMembers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="px-4 py-3">Member</th>
                    <th scope="col" className="px-4 py-3">Role</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Joined Date</th>
                    <th scope="col" className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                            <span className="text-white fw-bold">
                              {member.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <h6 className="mb-1">{member.name || 'N/A'}</h6>
                            <div className="d-flex align-items-center text-muted small">
                              <Sms size="14" className="me-1" />
                              {member.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${getRoleBadgeColor(member.role)}`}>
                          {member.role || 'Member'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${getStatusBadgeColor(member.status)}`}>
                          {member.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                            onClick={() => navigate(`/organization/members/${member.id}`)}
                            title="View Details"
                          >
                            <Eye size="16" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning d-flex align-items-center"
                            onClick={() => navigate(`/organization/members/${member.id}/edit`)}
                            title="Edit Member"
                          >
                            <Edit2 size="16" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger d-flex align-items-center"
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            title="Remove Member"
                          >
                            <Trash size="16" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <People size="64" className="text-muted mb-3" />
              <h5 className="text-muted mb-2">No members found</h5>
              <p className="text-muted mb-4">
                {searchTerm || roleFilter || statusFilter 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Start by adding your first organization member.'
                }
              </p>
              {!searchTerm && !roleFilter && !statusFilter && (
                <Link to="/organization/members/create" className="btn btn-primary">
                  <Add size="20" className="me-2" />
                  Add First Member
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} entries
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link d-flex align-items-center"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft2 size="16" className="me-1" />
                  Previous
                </button>
              </li>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + Math.max(1, currentPage - 2);
                if (pageNum > totalPages) return null;
                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link d-flex align-items-center"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ArrowRight2 size="16" className="ms-1" />
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