import React, { useState, useEffect } from 'react';
import { eventAPI, venueAPI } from '../services/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [totalEventsCount, setTotalEventsCount] = useState(0);
  const [venues, setVenues] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, venuesResponse, allEventsResponse] = await Promise.all([
        eventAPI.getAll({ date: selectedDate }),
        venueAPI.getAll(),
        eventAPI.getAll()
      ]);
      setEvents(eventsResponse.data);
      setVenues(venuesResponse.data);
      setTotalEventsCount(allEventsResponse.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupEventsByVenue = () => {
    const grouped = {};
    events.forEach(event => {
      const venueName = event.venue.name;
      if (!grouped[venueName]) {
        grouped[venueName] = [];
      }
      grouped[venueName].push(event);
    });
    return grouped;
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const eventsByVenue = groupEventsByVenue();

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Monitor events, venues, and scheduling across your organization</p>
      </div>

      <div className="dashboard-controls card">
        <div className="form-group">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Events Today</h3>
            <div className="stat-value">{events.length}</div>
            <div className="stat-label">scheduled events</div>
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>Active Venues</h3>
            <div className="stat-value">{Object.keys(eventsByVenue).length}</div>
            <div className="stat-label">venues in use</div>
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <h3>Total Venues</h3>
            <div className="stat-value">{venues.length}</div>
            <div className="stat-label">available venues</div>
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>All Events</h3>
            <div className="stat-value">{totalEventsCount}</div>
            <div className="stat-label">total events</div>
          </div>
        </div>
      </div>

      <div className="events-section">
        <h3 className="section-title">Events for {new Date(selectedDate).toLocaleDateString('en-GB')}</h3>
        
        {Object.keys(eventsByVenue).length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📅</div>
            <h4>No events scheduled</h4>
            <p>No events found for this date. Create your first event to get started!</p>
          </div>
        ) : (
          <div className="venues-grid">
            {Object.keys(eventsByVenue).map(venueName => (
              <div key={venueName} className="venue-section card">
                <h4 className="venue-title">🏢 {venueName}</h4>
                <div className="events-list">
                  {eventsByVenue[venueName].map(event => (
                    <div key={event._id} className={`event-item ${event.status}`}>
                      <div className="event-header">
                        <h5 className="event-title">{event.title}</h5>
                        <span className={`status-badge ${event.status}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="event-details">
                        <div className="event-time">
                          🕐 {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                        {event.organizer && (
                          <div className="event-organizer">
                            👤 {event.organizer}
                          </div>
                        )}
                        {event.description && (
                          <div className="event-description">
                            📝 {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
