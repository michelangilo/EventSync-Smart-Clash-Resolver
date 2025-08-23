import React, { useState, useEffect } from 'react';
import { eventAPI, venueAPI } from '../services/api';
import './Schedule.css';

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [view, setView] = useState('day'); // 'day' or 'week'
    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [selectedVenues, setSelectedVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Time slots: 8 AM to 10 PM (14 hours), each split into 2 half-hour slots
    const timeSlots = [];
    for (let hour = 8; hour <= 22; hour++) {
        timeSlots.push({
            hour,
            display: `${hour.toString().padStart(2, '0')}:00`,
            slots: [
                { start: 0, end: 30, display: ':00-:30' },
                { start: 30, end: 60, display: ':30-:00' }
            ]
        });
    }

    useEffect(() => {
        fetchVenues();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [selectedDate, view, selectedVenues]);

    const fetchVenues = async () => {
        try {
            const response = await venueAPI.getAll();
            setVenues(response.data);
            setSelectedVenues(response.data.map(v => v._id)); // Select all by default
        } catch (error) {
            setError('Failed to fetch venues');
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');

            let filters = {};

            if (view === 'day') {
                filters.date = selectedDate;
            } else if (view === 'week') {
                const startDate = getWeekStart(selectedDate);
                const endDate = getWeekEnd(selectedDate);
                filters.start = startDate;
                filters.end = endDate;
            }

            const response = await eventAPI.getAll(filters);
            setEvents(response.data);
        } catch (error) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    const getWeekEnd = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Sunday end
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    const getEventPosition = (event) => {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        const startHour = startTime.getHours();
        const startMinutes = startTime.getMinutes();
        const endHour = endTime.getHours();
        const endMinutes = endTime.getMinutes();

        // Calculate start position (which half-hour slot)
        const startSlotIndex = (startHour - 8) * 2 + (startMinutes <= 30 ? 0 : 1);

        // Calculate end position
        const endSlotIndex = (endHour - 8) * 2 + (endMinutes <= 30 ? 0 : 1);

        // Ensure positions are within our time range
        const clampedStart = Math.max(0, Math.min(startSlotIndex, timeSlots.length * 2 - 1));
        const clampedEnd = Math.max(clampedStart + 1, Math.min(endSlotIndex, timeSlots.length * 2));

        return {
            startSlot: clampedStart,
            endSlot: clampedEnd,
            duration: clampedEnd - clampedStart
        };
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleVenueToggle = (venueId) => {
        setSelectedVenues(prev =>
            prev.includes(venueId)
                ? prev.filter(id => id !== venueId)
                : [...prev, venueId]
        );
    };

    const handleDateNavigation = (direction) => {
        const date = new Date(selectedDate);
        if (view === 'day') {
            date.setDate(date.getDate() + direction);
        } else {
            date.setDate(date.getDate() + (direction * 7));
        }
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const goToToday = () => {
        setSelectedDate(new Date().toISOString().split('T'));
    };

    const handleEventClick = (event) => {
        // For now, just show alert - can be extended to edit modal
        alert(`Event: ${event.title}\nVenue: ${event.venue.name}\nTime: ${formatTime(event.startTime)} - ${formatTime(event.endTime)}\nStatus: ${event.status}`);
    };

    const filteredVenues = venues.filter(venue => selectedVenues.includes(venue._id));
    const filteredEvents = events.filter(event => selectedVenues.includes(event.venue._id));

    if (loading) return <div className="loading">Loading schedule...</div>;

    return (
        <div className="schedule">
            <h2>Event Schedule</h2>

            {/* Controls */}
            <div className="schedule-controls">
                <div className="view-toggle">
                    <button
                        className={view === 'day' ? 'active' : ''}
                        onClick={() => setView('day')}
                    >
                        Day
                    </button>
                    <button
                        className={view === 'week' ? 'active' : ''}
                        onClick={() => setView('week')}
                    >
                        Week
                    </button>
                </div>

                <div className="date-navigation">
                    <button onClick={() => handleDateNavigation(-1)}>
                        ← Prev {view === 'day' ? 'Day' : 'Week'}
                    </button>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button onClick={() => handleDateNavigation(1)}>
                        Next {view === 'day' ? 'Day' : 'Week'} →
                    </button>
                    <button onClick={goToToday}>Today</button>
                </div>

                <div className="venue-filter">
                    <label>Venues:</label>
                    <div className="venue-checkboxes">
                        {venues.map(venue => (
                            <label key={venue._id} className="venue-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedVenues.includes(venue._id)}
                                    onChange={() => handleVenueToggle(venue._id)}
                                />
                                {venue.name}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Messages */}
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Schedule Grid */}
            <div className="schedule-container">
                <div className="schedule-grid" style={{ ['--dynamic-venue-count']: filteredVenues.length }} >
                    {/* Header with venue names */}
                    <div className="schedule-header">
                        <div className="time-header">Time</div>
                        {filteredVenues.map(venue => (
                            <div key={venue._id} className="venue-header">
                                {venue.name}
                                {venue.capacity && <span className="capacity">({venue.capacity})</span>}
                            </div>
                        ))}
                    </div>

                    {/* Time slots and events */}
                    <div className="schedule-body">
                        {timeSlots.map((timeSlot, timeIndex) => (
                            <div key={timeSlot.hour} className="time-row">
                                {/* Time label */}
                                <div className="time-label">
                                    {timeSlot.display}
                                </div>

                                {/* Venue columns */}
                                {filteredVenues.map(venue => {
                                    // Find events for this venue at this time
                                    const venueEvents = filteredEvents.filter(event => {
                                        if (event.venue._id !== venue._id) return false;

                                        const position = getEventPosition(event);
                                        const currentSlotStart = timeIndex * 2;
                                        const currentSlotEnd = currentSlotStart + 2;

                                        return position.startSlot < currentSlotEnd && position.endSlot > currentSlotStart;
                                    });

                                    return (
                                        <div key={venue._id} className="venue-column">
                                            <div className="time-slot">
                                                {/* First half hour */}
                                                <div className="half-slot first-half">
                                                    {venueEvents
                                                        .filter(event => {
                                                            const pos = getEventPosition(event);
                                                            return pos.startSlot <= timeIndex * 2 && pos.endSlot > timeIndex * 2;
                                                        })
                                                        .map(event => {
                                                            const pos = getEventPosition(event);
                                                            const isStart = pos.startSlot === timeIndex * 2;
                                                            return (
                                                                <div
                                                                    key={event._id}
                                                                    className={`event-block ${event.status} ${isStart ? 'event-start' : 'event-continue'}`}
                                                                    onClick={() => handleEventClick(event)}
                                                                    title={`${event.title} (${formatTime(event.startTime)} - ${formatTime(event.endTime)})`}
                                                                >
                                                                    {isStart && (
                                                                        <>
                                                                            <div className="event-title">{event.title}</div>
                                                                            <div className="event-time">
                                                                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                {/* Second half hour */}
                                                <div className="half-slot second-half">
                                                    {venueEvents
                                                        .filter(event => {
                                                            const pos = getEventPosition(event);
                                                            return pos.startSlot <= timeIndex * 2 + 1 && pos.endSlot > timeIndex * 2 + 1;
                                                        })
                                                        .map(event => {
                                                            const pos = getEventPosition(event);
                                                            const isStart = pos.startSlot === timeIndex * 2 + 1;
                                                            return (
                                                                <div
                                                                    key={event._id}
                                                                    className={`event-block ${event.status} ${isStart ? 'event-start' : 'event-continue'}`}
                                                                    onClick={() => handleEventClick(event)}
                                                                    title={`${event.title} (${formatTime(event.startTime)} - ${formatTime(event.endTime)})`}
                                                                >
                                                                    {isStart && (
                                                                        <>
                                                                            <div className="event-title">{event.title}</div>
                                                                            <div className="event-time">
                                                                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="schedule-legend">
                <h4>Legend:</h4>
                <div className="legend-items">
                    <div className="legend-item">
                        <div className="legend-color scheduled"></div>
                        <span>Scheduled Events</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color tentative"></div>
                        <span>Tentative Events (Conflicts)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;