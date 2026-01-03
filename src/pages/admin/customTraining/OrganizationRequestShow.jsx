import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrganizationRequestShow = () => {
  const { id } = useParams();
  const { organizationCustomRequests = [] } = useSelector((state) => state.customTraining || {});

  const request = useMemo(() => {
    // id from route might be number or string depending on data
    return organizationCustomRequests.find((r) => String(r.id) === String(id));
  }, [organizationCustomRequests, id]);

  if (!request) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Request not found</h2>
        <p>We could not find the requested organization training request.</p>
        <Link to="/admin/organization-requests" className="btn-secondary">Back to list</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>{request.title}</h1>
        <Link to="/admin/organization-requests" className="btn-secondary">Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.25rem' }}>
        <div style={{ background: 'white', padding: '1.25rem', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3>Business challenge</h3>
          <p>{request.business_challenge}</p>

          <h3 style={{ marginTop: '1rem' }}>Learning outcomes</h3>
          <p>{request.learning_outcomes}</p>

          <h3 style={{ marginTop: '1rem' }}>Target roles</h3>
          <p>{request.target_job_roles}</p>

          <h3 style={{ marginTop: '1rem' }}>Additional comments</h3>
          <p>{request.additional_comments}</p>

          <h3 style={{ marginTop: '1rem' }}>Requestor</h3>
          <p><strong>Name:</strong> {request.user_name || '—'}</p>
          <p><strong>Email:</strong> {request.user_email ? <a href={`mailto:${request.user_email}`}>{request.user_email}</a> : '—'}</p>
          <p><strong>Organization:</strong> {request.user_organization || '—'}</p>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: 8 }}>
            <p><strong>Participants:</strong> {request.number_of_participants}</p>
            <p><strong>Skill level:</strong> {request.skill_level}</p>
            <p><strong>Formats:</strong> {(request.training_formats || []).join(', ')}</p>
            <p><strong>Location (in-person):</strong> {request.in_person_location || 'N/A'}</p>
            <p><strong>Preferred timeframe:</strong> {request.preferred_timeframe}</p>
            <p><strong>Duration:</strong> {request.training_duration}</p>
            <p><strong>Budget:</strong> {request.budget_constraints}</p>
            <p><strong>Has materials:</strong> {request.has_existing_materials ? 'Yes' : 'No'}</p>
          </div>

          <div style={{ background: 'white', padding: '1rem', borderRadius: 8 }}>
            <p><strong>Status:</strong> <span className={`status-badge ${request.status || 'pending'}`}>{(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1)}</span></p>
            <p><strong>Created:</strong> {request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A'}</p>
            <p><strong>Updated:</strong> {request.updated_at ? new Date(request.updated_at).toLocaleString() : 'N/A'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrganizationRequestShow;
