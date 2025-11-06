// Example: How to use the Organization Member Management Redux slice

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrganizationMembers,
  getOrganizationMember,
  createOrganizationMember,
  bulkCreateOrganizationMembers,
  addExistingUsersAsMembers,
  updateOrganizationMember,
  deleteOrganizationMember,
  clearErrors,
  clearSuccessFlags,
  clearCreateSuccess,
  clearBulkCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  setPagination,
  selectMembers,
  selectMember,
  selectLoading,
  selectMemberLoading,
  selectCreateLoading,
  selectBulkCreateLoading,
  selectAddExistingLoading,
  selectUpdateLoading,
  selectDeleteLoading,
  selectError,
  selectCreateError,
  selectBulkCreateError,
  selectUpdateError,
  selectDeleteError,
  selectCreateSuccess,
  selectBulkCreateSuccess,
  selectUpdateSuccess,
  selectDeleteSuccess,
  selectTotalMembers,
  selectCurrentPage,
  selectTotalPages,
  selectPerPage,
} from '../redux/slices/organisationUserSlice';

// Example 1: Organization Members List Component
const OrganizationMembersList = ({ organizationSlug }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const members = useSelector(selectMembers);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalMembers = useSelector(selectTotalMembers);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const perPage = useSelector(selectPerPage);
  
  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageLocal, setCurrentPageLocal] = useState(1);

  // Fetch members on component mount and when filters change
  useEffect(() => {
    if (organizationSlug) {
      dispatch(getOrganizationMembers({
        organization: organizationSlug,
        page: currentPageLocal,
        perPage: perPage,
        search: searchTerm,
      }));
    }
  }, [dispatch, organizationSlug, currentPageLocal, perPage, searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPageLocal(page);
    dispatch(setPagination({ page, perPage }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPageLocal(1);
    dispatch(getOrganizationMembers({
      organization: organizationSlug,
      page: 1,
      perPage: perPage,
      search: searchTerm,
    }));
  };

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="organization-members-list">
      <div className="members-header">
        <h2>Organization Members ({totalMembers})</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Members List */}
      <div className="members-grid">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <h4>{member.name}</h4>
            <p>Email: {member.email}</p>
            <p>Role: {member.role}</p>
            <p>Status: {member.status}</p>
            <p>Joined: {new Date(member.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Example 2: Create New Member Form
const CreateMemberForm = ({ organizationSlug, onSuccess }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const createLoading = useSelector(selectCreateLoading);
  const createError = useSelector(selectCreateError);
  const createSuccess = useSelector(selectCreateSuccess);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
  });

  // Handle success
  useEffect(() => {
    if (createSuccess) {
      alert('Member created successfully!');
      setFormData({
        name: '',
        email: '',
        role: '',
        phone: '',
        department: '',
      });
      dispatch(clearCreateSuccess());
      if (onSuccess) onSuccess();
    }
  }, [createSuccess, dispatch, onSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createOrganizationMember({
      organization: organizationSlug,
      memberData: formData
    }));
  };

  return (
    <div className="create-member-form">
      <h3>Add New Member</h3>
      
      {createError && (
        <div className="error-message">
          Error creating member: {createError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={createLoading}
          className="submit-button"
        >
          {createLoading ? 'Creating...' : 'Create Member'}
        </button>
      </form>
    </div>
  );
};

// Example 3: Bulk Create Members Form
const BulkCreateMembersForm = ({ organizationSlug, onSuccess }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const bulkCreateLoading = useSelector(selectBulkCreateLoading);
  const bulkCreateError = useSelector(selectBulkCreateError);
  const bulkCreateSuccess = useSelector(selectBulkCreateSuccess);
  
  // Form state
  const [csvData, setCsvData] = useState('');
  const [members, setMembers] = useState([]);

  // Handle success
  useEffect(() => {
    if (bulkCreateSuccess) {
      alert('Members created successfully!');
      setCsvData('');
      setMembers([]);
      dispatch(clearBulkCreateSuccess());
      if (onSuccess) onSuccess();
    }
  }, [bulkCreateSuccess, dispatch, onSuccess]);

  const parseCsvData = () => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const parsedMembers = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const member = {};
      headers.forEach((header, index) => {
        member[header] = values[index] || '';
      });
      return member;
    });
    
    setMembers(parsedMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (members.length === 0) {
      parseCsvData();
      return;
    }
    
    dispatch(bulkCreateOrganizationMembers({
      organization: organizationSlug,
      membersData: { members }
    }));
  };

  return (
    <div className="bulk-create-members-form">
      <h3>Bulk Create Members</h3>
      
      {bulkCreateError && (
        <div className="error-message">
          Error creating members: {bulkCreateError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="csvData">CSV Data:</label>
          <textarea
            id="csvData"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="name,email,role,phone,department&#10;John Doe,john@example.com,member,1234567890,IT&#10;Jane Smith,jane@example.com,admin,0987654321,HR"
            rows="10"
            required
          />
          <small>Format: name,email,role,phone,department</small>
        </div>

        {members.length > 0 && (
          <div className="preview">
            <h4>Preview ({members.length} members):</h4>
            <div className="members-preview">
              {members.slice(0, 3).map((member, index) => (
                <div key={index} className="member-preview">
                  <p><strong>{member.name}</strong> - {member.email} ({member.role})</p>
                </div>
              ))}
              {members.length > 3 && <p>...and {members.length - 3} more</p>}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={bulkCreateLoading}
          className="submit-button"
        >
          {members.length === 0 
            ? 'Parse CSV Data' 
            : bulkCreateLoading 
              ? 'Creating Members...' 
              : `Create ${members.length} Members`
          }
        </button>
      </form>
    </div>
  );
};

// Example 4: Edit Member Form
const EditMemberForm = ({ organizationSlug, memberId, onSuccess }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const member = useSelector(selectMember);
  const memberLoading = useSelector(selectMemberLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  const updateError = useSelector(selectUpdateError);
  const updateSuccess = useSelector(selectUpdateSuccess);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    status: '',
  });

  // Fetch member details
  useEffect(() => {
    if (organizationSlug && memberId) {
      dispatch(getOrganizationMember({
        organization: organizationSlug,
        organizationUser: memberId
      }));
    }
  }, [dispatch, organizationSlug, memberId]);

  // Populate form with member data
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || '',
        phone: member.phone || '',
        department: member.department || '',
        status: member.status || '',
      });
    }
  }, [member]);

  // Handle success
  useEffect(() => {
    if (updateSuccess) {
      alert('Member updated successfully!');
      dispatch(clearUpdateSuccess());
      if (onSuccess) onSuccess();
    }
  }, [updateSuccess, dispatch, onSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateOrganizationMember({
      organization: organizationSlug,
      organizationUser: memberId,
      memberData: formData
    }));
  };

  if (memberLoading) return <div>Loading member details...</div>;

  return (
    <div className="edit-member-form">
      <h3>Edit Member</h3>
      
      {updateError && (
        <div className="error-message">
          Error updating member: {updateError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={updateLoading}
          className="submit-button"
        >
          {updateLoading ? 'Updating...' : 'Update Member'}
        </button>
      </form>
    </div>
  );
};

// Example 5: Delete Member Component
const DeleteMemberButton = ({ organizationSlug, memberId, memberName, onSuccess }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const deleteLoading = useSelector(selectDeleteLoading);
  const deleteError = useSelector(selectDeleteError);
  const deleteSuccess = useSelector(selectDeleteSuccess);

  // Handle success
  useEffect(() => {
    if (deleteSuccess) {
      alert('Member deleted successfully!');
      dispatch(clearDeleteSuccess());
      if (onSuccess) onSuccess();
    }
  }, [deleteSuccess, dispatch, onSuccess]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
      dispatch(deleteOrganizationMember({
        organization: organizationSlug,
        organizationUser: memberId
      }));
    }
  };

  return (
    <div className="delete-member">
      {deleteError && (
        <div className="error-message">
          Error deleting member: {deleteError}
        </div>
      )}
      
      <button 
        onClick={handleDelete}
        disabled={deleteLoading}
        className="delete-button"
      >
        {deleteLoading ? 'Removing...' : 'Remove Member'}
      </button>
    </div>
  );
};

export { 
  OrganizationMembersList, 
  CreateMemberForm, 
  BulkCreateMembersForm, 
  EditMemberForm, 
  DeleteMemberButton 
};