import React, { useState, useEffect } from 'react';
import { eventAPI, venueAPI } from '../services/api';

const EventsPage = () => {
  // [Previous state logic remains the same]
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    venueName: '',
    venueId: '',
    date: '',
    startTime: '',
    endTime: '',
    organizer: '',
    description: ''
  });
  const [clashWarning, setClashWarning] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    venueId: '',
    date: '',
    startTime: '',
    endTime: '',
    organizer: '',
    description: ''
  });

  // [Previous useEffect and handler functions remain the same - just updating return JSX]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, venuesResponse] = await Promise.all([
        eventAPI.getAll(),
        venueAPI.getAll()
      ]);
      setEvents(eventsResponse.data);
      setVenues(venuesResponse.data);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // [All previous handler functions remain exactly the same]
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setClashWarning(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setSuccess('');
    setClashWarning(null);

    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;

      const eventData = {
        title: formData.title,
        date: formData.date,
        startTime: startDateTime,
        endTime: endDateTime,
        organizer: formData.organizer,
        description: formData.description
      };

      if (formData.venueId) {
        eventData.venueId = formData.venueId;
      } else {
        eventData.venueName = formData.venueName;
      }

      await eventAPI.create(eventData);
      setSuccess('Event created successfully!');
      setFormData({
        title: '',
        venueName: '',
        venueId: '',
        date: '',
        startTime: '',
        endTime: '',
        organizer: '',
        description: ''
      });
      await fetchData();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setClashWarning(error.response.data);
        const proceed = window.confirm('Time clash detected.\n\nDo you still want to add the event?');

        if (proceed) {
          try {
            const startDateTime = `${formData.date}T${formData.startTime}:00`;
            const endDateTime = `${formData.date}T${formData.endTime}:00`;

            const forcedEventData = {
              title: formData.title,
              date: formData.date,
              startTime: startDateTime,
              endTime: endDateTime,
              organizer: formData.organizer,
              description: formData.description,
              force: true
            };

            if (formData.venueId) {
              forcedEventData.venueId = formData.venueId;
            } else {
              forcedEventData.venueName = formData.venueName;
            }

            await eventAPI.create(forcedEventData);
            setSuccess('Event added despite clash (marked tentative).');
            setFormData({
              title: '',
              venueName: '',
              venueId: '',
              date: '',
              startTime: '',
              endTime: '',
              organizer: '',
              description: ''
            });
            setClashWarning(null);
            await fetchData();
          } catch (e2) {
            setError(e2.response?.data?.error || 'Failed to force-create event');
          }
        }
      } else {
        setError(error.response?.data?.error || 'An error occurred');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const startEdit = (event) => {
    setEditing(event._id);
    setEditForm({
      title: event.title,
      venueId: event.venue._id.toString(),
      date: event.date,
      startTime: new Date(event.startTime).toISOString().slice(11, 16),
      endTime: new Date(event.endTime).toISOString().slice(11, 16),
      organizer: event.organizer || '',
      description: event.description || ''
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({
      title: '',
      venueId: '',
      date: '',
      startTime: '',
      endTime: '',
      organizer: '',
      description: ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (eventId) => {
    try {
      const payload = {
        title: editForm.title,
        venue: editForm.venueId,
        date: editForm.date,
        startTime: `${editForm.date}T${editForm.startTime}:00`,
        endTime: `${editForm.date}T${editForm.endTime}:00`,
        organizer: editForm.organizer,
        description: editForm.description
      };

      await eventAPI.update(eventId, payload);
      setSuccess('Event updated successfully!');
      setEditing(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update event');
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the event "${eventTitle}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      try {
        await eventAPI.delete(eventId);
        setSuccess('Event deleted successfully!');
        await fetchData();
      } catch (error) {
        setError('Failed to delete event');
      }
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-page">
      <div className="page-header">
        <h2>Events Management</h2>
        <p>Create, edit, and manage all your events in one place</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <section className="events-list-section">
        <h3 className="section-title">All Events ({events.length})</h3>
        
        {events.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📅</div>
            <h4>No events found</h4>
            <p>Create your first event below to get started!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card card">
                {editing === event._id ? (
                  <div className="edit-form">
                    <h4 className="form-title">✏️ Edit Event</h4>
                    <div className="form-group">
                      <label>Event Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Venue *</label>
                      <select
                        name="venueId"
                        value={editForm.venueId}
                        onChange={handleEditChange}
                      >
                        {venues.map((venue) => (
                          <option key={venue._id} value={venue._id}>
                            {venue.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Time *</label>
                        <input
                          type="time"
                          name="startTime"
                          value={editForm.startTime}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time *</label>
                        <input
                          type="time"
                          name="endTime"
                          value={editForm.endTime}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Organizer</label>
                      <input
                        type="text"
                        name="organizer"
                        value={editForm.organizer}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button className="btn btn-primary" onClick={() => saveEdit(event._id)}>
                        💾 Save Changes
                      </button>
                      <button className="btn btn-secondary" onClick={cancelEdit}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="event-content">
                    <div className="event-header">
                      <h4 className="event-title">{event.title}</h4>
                      <span className={`status-badge ${event.status}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="event-details">
                      <div className="detail-item">
                        <span className="detail-icon">🏢</span>
                        <span>{event.venue.name}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">🕐</span>
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      
                      {event.organizer && (
                        <div className="detail-item">
                          <span className="detail-icon">👤</span>
                          <span>{event.organizer}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <div className="detail-item description">
                          <span className="detail-icon">📝</span>
                          <span>{event.description}</span>
                        </div>
                      )}
                    </div>

                    <div className="event-actions">
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => startEdit(event)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(event._id, event.title)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="create-event-section card">
        <h3 className="section-title">➕ Create New Event</h3>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="venue-select">Select Existing Venue</label>
            <select
              id="venue-select"
              name="venueId"
              value={formData.venueId}
              onChange={handleFormChange}
            >
              <option value="">-- Choose a venue --</option>
              {venues.map(venue => (
                <option key={venue._id} value={venue._id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="venueName">Or Create New Venue</label>
            <input
              type="text"
              id="venueName"
              name="venueName"
              value={formData.venueName}
              onChange={handleFormChange}
              placeholder="Enter new venue name"
              disabled={formData.venueId !== ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="organizer">Organizer</label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleFormChange}
              placeholder="Event organizer name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="3"
              placeholder="Event description (optional)"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={formLoading}>
            {formLoading ? '⏳ Creating...' : 'Create Event'}
          </button>
        </form>

        {clashWarning && (
          <div className="alert alert-warning clash-warning">
            <h4>⚠️ Time Clash Detected!</h4>
            <p>{clashWarning.message}</p>
            <h5>Conflicting Events:</h5>
            <ul>
              {clashWarning.clashes.map((event, index) => (
                <li key={index}>
                  <strong>{event.title}</strong> at {event.venue.name} 
                  ({formatTime(event.startTime)} - {formatTime(event.endTime)})
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default EventsPage;
