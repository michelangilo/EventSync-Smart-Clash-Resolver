import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EventsPage from './components/EventsPage';
import VenueList from './components/VenueList';
import ClashView from './components/ClashView';
import Schedule from './components/Schedule';
import './App.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/events', label: 'Events' },
    { path: '/venues', label: 'Venues' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/clashes', label: 'Clashes' }
  ];

  return (
    <nav className="main-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <Link to="/" className="logo-link" aria-label="Go to Dashboard">
                <h1>EventSync</h1>
              </Link>
              <span className="tagline">Dynamic Clash Resolver</span>
            </div>
            <Navigation />
          </div>
        </header>

        <main className="main-content">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/venues" element={<VenueList />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/clashes" element={<ClashView />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
