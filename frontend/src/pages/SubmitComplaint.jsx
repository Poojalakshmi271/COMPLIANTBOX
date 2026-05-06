import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, EyeOff } from 'lucide-react';

const SubmitComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
    isAnonymous: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>File a Complaint</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Provide details about the issue you encountered.</p>

      <form onSubmit={handleSubmit} className="card glass">
        <div className="form-group">
          <label className="label">Issue Title</label>
          <input 
            type="text" 
            name="title"
            className="input-field" 
            placeholder="E.g., Broken AC in Room 302" 
            value={formData.title}
            onChange={handleChange}
            required 
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label className="label">Description</label>
          <textarea 
            name="description"
            className="input-field" 
            placeholder="Please detail the problem..." 
            rows="5"
            style={{ resize: 'vertical' }}
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={1000}
          ></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="label">Category</label>
            <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Facilities">Facilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Priority</label>
            <select name="priority" className="input-field" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ 
          background: 'rgba(236, 72, 153, 0.05)', 
          border: '1px solid var(--border-color)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <input 
            type="checkbox" 
            name="isAnonymous"
            id="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-primary)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="isAnonymous" style={{ fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <EyeOff className="w-4 h-4" /> Submit Anonymously
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your identity will be hidden from administrators.</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Complaint</>}
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
