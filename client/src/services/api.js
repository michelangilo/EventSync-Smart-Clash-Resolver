import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Venue API calls
export const venueAPI = {
  getAll: () => api.get('/venues'),
  getById: (id) => api.get(`/venues/${id}`),
  create: (venue) => api.post('/venues', venue),
  update: (id, venue) => api.put(`/venues/${id}`, venue),
  delete: (id) => api.delete(`/venues/${id}`)
};

// Event API calls
export const eventAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.venue) params.append('venue', filters.venue);
    if (filters.date) params.append('date', filters.date);
    if (filters.start) params.append('start', filters.start);
    if (filters.end) params.append('end', filters.end);
    
    return api.get(`/events?${params.toString()}`);
  },
  create: (event) => api.post('/events', event),
  update: (id, event) => api.put(`/events/${id}`, event),
  delete: (id) => api.delete(`/events/${id}`),
  getClashes: (date) => api.get(`/events/clashes?date=${date}`),
  suggestReschedule: (eventId, timeWindow) => 
    api.post(`/events/${eventId}/suggest-reschedule`, timeWindow)
};

export default api;
