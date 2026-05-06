import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect admins to admin portal
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const fetchComplaints = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const { data } = await axios.get(`${API_URL}/api/complaints/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader2 className="w-8 h-8 spin text-gradient" /></div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track the status of your submitted complaints and official responses.
          </p>
        </div>
      </div>

      <div className="grid-cards">
        {complaints.length === 0 ? (
          <div className="card glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          complaints.map(complaint => (
            <div key={complaint._id} className="card glass" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className={`badge badge-${complaint.status.replace(' ', '-')}`}>
                  {complaint.status}
                </span>
                <span className={`badge-priority-${complaint.priority}`} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle className="w-3 h-3" /> {complaint.priority}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>{complaint.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.5' }}>
                {complaint.description}
              </p>

              {complaint.adminResponse && (
                <div style={{ background: 'rgba(236, 72, 153, 0.05)', borderLeft: '3px solid var(--accent-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                   <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.2rem' }}>Admin Response:</strong>
                   <span style={{ color: 'var(--text-primary)' }}>{complaint.adminResponse}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock className="w-3 h-3" /> {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {complaint.status === 'Resolved' && (
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-resolved)' }} />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
