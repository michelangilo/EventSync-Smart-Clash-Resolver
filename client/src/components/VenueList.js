import React, { useState, useEffect } from 'react';
import { venueAPI } from '../services/api';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: ''
  });

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    capacity: ''
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await venueAPI.getAll();
      setVenues(response.data);
    } catch (error) {
      setError('Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await venueAPI.create({
        name: formData.name,
        location: formData.location || undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined
      });

      setSuccess('Venue created successfully!');
      setFormData({ name: '', location: '', capacity: '' });
      await fetchVenues();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create venue');
    }
  };

  const startEdit = (venue) => {
    setEditing(venue._id);
    setEditForm({
      name: venue.name,
      location: venue.location || '',
      capacity: venue.capacity || ''
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({ name: '', location: '', capacity: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (venueId) => {
    try {
      const payload = {
        name: editForm.name,
        location: editForm.location || undefined,
        capacity: editForm.capacity ? parseInt(editForm.capacity) : undefined
      };

      await venueAPI.update(venueId, payload);
      setSuccess('Venue updated successfully!');
      setEditing(null);
      await fetchVenues();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update venue');
    }
  };

  const handleDelete = async (venueId, venueName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the venue "${venueName}"?\n\nThis will also affect any events scheduled at this venue.\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      try {
        await venueAPI.delete(venueId);
        setSuccess('Venue deleted successfully!');
        await fetchVenues();
      } catch (error) {
        setError('Failed to delete venue. It may be referenced by existing events.');
      }
    }
  };

  if (loading) return <div className="loading">Loading venues...</div>;

  return (
    <div className="venues-page">
      <div className="page-header">
        <h2>Venue Management</h2>
        <p>Manage all your event venues and their details</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <section className="venues-list-section">
        <h3 className="section-title">All Venues ({venues.length})</h3>
        
        {venues.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🏢</div>
            <h4>No venues found</h4>
            <p>Create your first venue below to get started!</p>
          </div>
        ) : (
          <div className="venues-grid">
            {venues.map((venue) => (
              <div key={venue._id} className="venue-card card">
                {editing === venue._id ? (
                  <div className="edit-form">
                    <h4 className="form-title">✏️ Edit Venue</h4>
                    <div className="form-group">
                      <label>Venue Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Enter venue name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                        placeholder="e.g., Building A, Floor 2"
                      />
                    </div>

                    <div className="form-group">
                      <label>Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        value={editForm.capacity}
                        onChange={handleEditChange}
                        min="1"
                        placeholder="Maximum number of people"
                      />
                    </div>

                    <div className="form-actions">
                      <button className="btn btn-primary" onClick={() => saveEdit(venue._id)}>
                        💾 Save Changes
                      </button>
                      <button className="btn btn-secondary" onClick={cancelEdit}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="venue-content">
                    <div className="venue-header">
                      <h4 className="venue-name">🏢 {venue.name}</h4>
                      <div className="venue-meta">
                        <span className="venue-id">ID: {venue._id.slice(-6)}</span>
                      </div>
                    </div>
                    
                    <div className="venue-details">
                      {venue.location && (
                        <div className="detail-item">
                          <span className="detail-icon">📍</span>
                          <span>{venue.location}</span>
                        </div>
                      )}
                      
                      {venue.capacity && (
                        <div className="detail-item">
                          <span className="detail-icon">👥</span>
                          <span>{venue.capacity} people</span>
                        </div>
                      )}
                      
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>Created: {new Date(venue.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>

                    <div className="venue-actions">
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => startEdit(venue)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(venue._id, venue.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="create-venue-section card">
        <h3 className="section-title">Create New Venue</h3>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="name">Venue Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Auditorium"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Building A, Floor 2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              placeholder="Maximum number of people"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Venue
          </button>
        </form>
      </section>
    </div>
  );
};

export default VenueList;
