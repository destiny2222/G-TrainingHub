import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ScheduleSessionShow = () => {
  const { id } = useParams();
  const { scheduleSessions = [] } = useSelector((state) => state.scheduleSessions || {});

  const session = useMemo(() => {
    // try to find by id first, fallback to using index if id is numeric and matches an index
    const byId = scheduleSessions.find(s => s?.id !== undefined && String(s.id) === String(id));
    if (byId) return byId;
    const asIndex = Number(id);
    if (!Number.isNaN(asIndex) && scheduleSessions[asIndex]) return scheduleSessions[asIndex];
    return undefined;
  }, [scheduleSessions, id]);

  if (!session) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Session not found</h2>
        <p>We could not find the requested session. It may have been removed or the identifier is invalid.</p>
        <Link to="/admin/schedule-sessions" className="btn-secondary">Back to list</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>{session.title}</h1>
        <Link to="/admin/schedule-sessions" className="btn-secondary">Back</Link>
      </div>

      <div className="detail-grid">
        <div className="detail-section">
          <h3>Description</h3>
          <p>{session.description}</p>

          <h3 style={{ marginTop: '1rem' }}>User</h3>
          <p><strong>Name:</strong> {session.user_name || '—'}</p>
          <p><strong>Email:</strong> {session.user_email || '—'}</p>
          <p><strong>Organization:</strong> {session.user_organization || '—'}</p>
        </div>

        <aside>
          <div className="detail-section">
            <p><strong>Status:</strong> <span className={`status-badge status-${session.status}`}>{String(session.status) === '1' ? 'Scheduled' : String(session.status) === '2' ? 'Completed' : 'Draft'}</span></p>
            <p><strong>Created:</strong> {session.created_at ? new Date(session.created_at).toLocaleString() : 'N/A'}</p>
            <p><strong>Updated:</strong> {session.updated_at ? new Date(session.updated_at).toLocaleString() : 'N/A'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ScheduleSessionShow;
