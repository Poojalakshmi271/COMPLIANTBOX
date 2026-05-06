import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle2, AlertCircle, Loader2, MessageSquare, Filter, BarChart3, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // State for providing admin replies
  const [replyInput, setReplyInput] = useState({});

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/complaints`, {
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

  const updateComplaint = async (id, payload) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchComplaints();
      
      // Clear reply input if a response was sent
      if (payload.adminResponse) {
         setReplyInput(prev => ({ ...prev, [id]: '' }));
      }
    } catch (error) {
      console.error('Error updating complaint', error);
      alert('Failed to update complaint');
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyInput(prev => ({ ...prev, [id]: value }));
  };

  const submitReply = (id, currentStatus) => {
    const txt = replyInput[id];
    if (!txt) return;
    // Auto shift to 'In Progress' if pending.
    const newStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus;
    updateComplaint(id, { adminResponse: txt, status: newStatus });
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader2 className="w-8 h-8 spin text-gradient" /></div>;
  }

  const filteredComplaints = complaints.filter(c => filter === 'All' || c.status === filter);
  
  // Analytics
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const critical = complaints.filter(c => c.priority === 'Critical').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 className="w-8 h-8 text-gradient" /> Admin Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all organizational complaints, analytics, and resolutions comprehensively.</p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
         <div className="card glass" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Complaints</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{total}</p>
         </div>
         <div className="card glass" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--status-pending)' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pending Action</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{pending}</p>
         </div>
         <div className="card glass" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--status-rejected)' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Critical Priority</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{critical}</p>
         </div>
         <div className="card glass" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--status-resolved)' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Resolved</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{resolved}</p>
         </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
         <Filter className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
         <select 
            className="input-field" 
            style={{ width: 'auto', padding: '0.5rem' }} 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
        >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
         </select>
      </div>

      <div className="grid-cards">
        {filteredComplaints.length === 0 ? (
          <div className="card glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No complaints found matching this filter.</p>
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <div key={complaint._id} className="card glass" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className={`badge badge-${complaint.status.replace(' ', '-')}`}>
                  {complaint.status}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.08)', color: 'var(--text-secondary)' }}>
                       {complaint.category}
                   </span>
                   <span className={`badge-priority-${complaint.priority}`} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                     <AlertCircle className="w-3 h-3" /> {complaint.priority}
                   </span>
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>{complaint.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flexGrow: 1, lineHeight: '1.5' }}>
                {complaint.description}
              </p>

              {complaint.adminResponse && (
                <div style={{ background: 'rgba(236, 72, 153, 0.05)', borderLeft: '3px solid var(--accent-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                   <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.2rem' }}>Admin Response:</strong>
                   <span style={{ color: 'var(--text-primary)' }}>{complaint.adminResponse}</span>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock className="w-3 h-3" /> {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)' }}>
                        <Users className="w-3 h-3" /> By: {complaint.isAnonymous ? 'Anonymous' : complaint.user?.name || 'Unknown User'}
                    </span>
                    </div>
                    
                    <select 
                        className="input-field" 
                        style={{ width: 'auto', padding: '0.4rem', fontSize: '0.85rem' }}
                        value={complaint.status}
                        onChange={(e) => updateComplaint(complaint._id, { status: e.target.value })}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                
                {complaint.status !== 'Resolved' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            placeholder="Add official response..." 
                            className="input-field" 
                            style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                            value={replyInput[complaint._id] || ''}
                            onChange={(e) => handleReplyChange(complaint._id, e.target.value)}
                        />
                        <button className="btn btn-primary" style={{ padding: '0.5rem 0.8rem' }} onClick={() => submitReply(complaint._id, complaint.status)}>
                            <MessageSquare className="w-4 h-4" />
                        </button>
                    </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
