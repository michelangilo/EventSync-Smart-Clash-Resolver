import React, { useState, useEffect, useCallback } from 'react';
import { eventAPI, venueAPI } from '../services/api';

const ClashView = () => {
  const [clashes, setClashes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [suggestions, setSuggestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [venues, setVenues] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    venueId: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  const fetchClashes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventAPI.getClashes(selectedDate);
      setClashes(response.data);
    } catch (error) {
      setError('Failed to fetch clashes');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchClashes();
    }
  }, [selectedDate, fetchClashes]);

  useEffect(() => {
    (async () => {
      try {
        const v = await venueAPI.getAll();
        setVenues(v.data);
      } catch (e) {
        // optionally handle error
      }
    })();
  }, []);

  useEffect(() => {
    if (editing && venues.length > 0 && !editForm.venueId) {
      setEditForm((prev) => ({ ...prev, venueId: venues[0]._id.toString() }));
    }
  }, [editing, venues, editForm.venueId]);

  const getSuggestions = async (eventId, startTime, endTime) => {
    try {
      const response = await eventAPI.suggestReschedule(eventId, {
        startTime,
        endTime
      });
      setSuggestions(prev => ({
        ...prev,
        [eventId]: response.data.availableVenues
      }));
    } catch (error) {
      setError('Failed to get suggestions');
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getOverlapDuration = (event1, event2) => {
    const start1 = new Date(event1.startTime);
    const end1 = new Date(event1.endTime);
    const start2 = new Date(event2.startTime);
    const end2 = new Date(event2.endTime);

    const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()));
    const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()));

    const overlapMinutes = Math.round((overlapEnd - overlapStart) / (1000 * 60));
    return overlapMinutes;
  };

  const startEdit = (ev) => {
    setEditing(ev._id);
    setEditForm({
      title: ev.title,
      venueId: (ev.venue?._id || '').toString(),
      date: ev.date,
      startTime: new Date(ev.startTime).toISOString().slice(11, 16),
      endTime: new Date(ev.endTime).toISOString().slice(11, 16)
    });
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (eventId) => {
    try {
      const payload = {
        title: editForm.title,
        venue: editForm.venueId,
        date: editForm.date,
        startTime: `${editForm.date}T${editForm.startTime}:00`,
        endTime: `${editForm.date}T${editForm.endTime}:00`
      };
      await eventAPI.update(eventId, payload);
      setEditing(null);
      await fetchClashes();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update event');
    }
  };

  return (
    <div className="clash-view">
      <div className="page-header">
        <h2>Event Clashes</h2>
        <p>Identify and resolve scheduling conflicts across venues</p>
      </div>

      <div className="clash-controls card">
        <div className="controls-content">
          <div className="form-group">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={fetchClashes} 
            disabled={loading}
          >
            {loading ? '⏳ Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {clashes.length === 0 ? (
        <div className="no-clashes card">
          <div className="success-icon">🎉</div>
          <h3>No clashes found for {formatDate(selectedDate)}!</h3>
          <p>All events are properly scheduled without conflicts.</p>
          <div className="success-animation"></div>
        </div>
      ) : (
        <div className="clashes-content">
          <div className="clashes-header">
            <h3 className="section-title">
              ⚠️ Found {clashes.length} clash{clashes.length !== 1 ? 'es' : ''} on {formatDate(selectedDate)}
            </h3>
          </div>

          <div className="clashes-list">
            {clashes.map((clash, index) => (
              <div key={index} className="clash-card card">
                <div className="clash-header">
                  <h4 className="clash-venue">🏢 {clash.venue.name}</h4>
                  <div className="clash-meta">
                    <span className="overlap-duration">
                      ⏱️ {getOverlapDuration(clash.events[0], clash.events)} min overlap
                    </span>
                  </div>
                </div>

                <div className="clashing-events">
                  {clash.events.map((event) => (
                    <div key={event._id} className={`event-details ${event.status}`}>
                      <div className="event-info">
                        <div className="event-title-row">
                          <h5 className="event-title">{event.title}</h5>
                          <span className={`status-badge ${event.status}`}>
                            {event.status}
                          </span>
                        </div>
                        
                        <div className="event-meta">
                          <div className="meta-item">
                            <span className="meta-icon">🕐</span>
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          </div>
                          
                          {event.organizer && (
                            <div className="meta-item">
                              <span className="meta-icon">👤</span>
                              <span>{event.organizer}</span>
                            </div>
                          )}
                          
                          {event.description && (
                            <div className="meta-item description">
                              <span className="meta-icon">📝</span>
                              <span>{event.description}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="event-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => getSuggestions(
                            event._id,
                            event.startTime,
                            event.endTime
                          )}
                        >
                          🔍 Find Alternatives
                        </button>

                        {editing !== event._id && (
                          <button 
                            className="btn btn-primary" 
                            onClick={() => startEdit(event)}
                          >
                            ✏️ Edit Event
                          </button>
                        )}
                      </div>

                      {suggestions[event._id] && (
                        <div className="suggestions">
                          <h6 className="suggestions-title">💡 Available Venues for Same Time:</h6>
                          {suggestions[event._id].length === 0 ? (
                            <p className="no-suggestions">No alternative venues available for this time slot.</p>
                          ) : (
                            <div className="suggestions-grid">
                              {suggestions[event._id].map(venue => (
                                <div key={venue._id} className="suggestion-item">
                                  <div className="suggestion-name">🏢 {venue.name}</div>
                                  {venue.location && <div className="suggestion-location">📍 {venue.location}</div>}
                                  {venue.capacity && <div className="suggestion-capacity">👥 {venue.capacity} people</div>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {editing === event._id && (
                        <div className="edit-form">
                          <h4 className="form-title">✏️ Edit Event Details</h4>
                          <div className="form-group">
                            <label>Event Title</label>
                            <input 
                              type="text" 
                              name="title" 
                              value={editForm.title} 
                              onChange={handleEditChange} 
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Venue</label>
                            <select
                              name="venueId"
                              value={editForm.venueId}
                              onChange={handleEditChange}
                            >
                              {venues.map((v) => (
                                <option key={v._id} value={v._id.toString()}>
                                  {v.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Date</label>
                            <input
                              type="date"
                              name="date"
                              value={editForm.date}
                              onChange={handleEditChange}
                            />
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Start Time</label>
                              <input
                                type="time"
                                name="startTime"
                                value={editForm.startTime}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>End Time</label>
                              <input
                                type="time"
                                name="endTime"
                                value={editForm.endTime}
                                onChange={handleEditChange}
                              />
                            </div>
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
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClashView;
