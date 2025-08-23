<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<div>
    <h1>EventSync</h1>
    <h3>Dynamic Clash Resolver</h3>
    <p><strong>A comprehensive event scheduling platform with real-time clash detection and intelligent conflict resolution</strong></p>
</div>

<hr>

<h2>Table of Contents</h2>
<ul>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#algorithms">Algorithms & Logic</a></li>
</ul>

<hr>

<h2 id="overview"> Overview</h2>

<p><strong>EventSync</strong> is a full-stack web application designed to streamline event scheduling and venue management for organizations. The platform features an intelligent clash detection system that identifies scheduling conflicts in real-time and provides actionable solutions for resolution.</p>

<h3>Key Highlights</h3>
<ul>
    <li><strong>Real-time Clash Detection:</strong> Automatically identifies scheduling conflicts across venues and time slots</li>
    <li><strong>Force-Create Workflow:</strong> Allows intentional conflict recording with tentative status for later resolution</li>
    <li><strong>Intelligent Suggestions:</strong> Provides alternative venue recommendations for conflicting events</li>
    <li><strong>Responsive Design:</strong> Modern dark theme with neon green accents, optimized for all devices</li>
    <li><strong>Comprehensive Management:</strong> Full CRUD operations for events and venues</li>
    <li><strong>Visual Schedule:</strong> Interactive day/week view with half-hour precision time slots</li>
</ul>

<h3>Design Philosophy</h3>
<p>Built with a modern dark theme featuring deep blues, blacks, and vibrant neon green accents. The interface employs glass-morphism effects, smooth transitions, and intuitive iconography to create a professional yet engaging user experience.</p>

<hr>

<h2 id="features">Features</h2>

<h3>Dashboard</h3>
<ul>
    <li><strong>Real-time Statistics:</strong> Events today, active venues, total venues, all events</li>
    <li><strong>Date-based Filtering:</strong> View events for any specific date</li>
    <li><strong>Venue Grouping:</strong> Events organized by venue with status indicators</li>
    <li><strong>Quick Overview:</strong> At-a-glance event details with time, organizer, and description</li>
</ul>

<h3>Event Management</h3>
<ul>
    <li><strong>Complete CRUD Operations:</strong> Create, read, update, and delete events</li>
    <li><strong>Clash Detection:</strong> Real-time conflict identification during creation/editing</li>
    <li><strong>Force-Create Option:</strong> Override conflicts with tentative status</li>
    <li><strong>Inline Editing:</strong> Quick event modifications without navigation</li>
    <li><strong>Status Management:</strong> Automatic status assignment (scheduled/tentative)</li>
    <li><strong>Venue Integration:</strong> Create new venues on-the-fly or select existing ones</li>
</ul>

<h3>Venue Management</h3>
<ul>
    <li><strong>Venue CRUD:</strong> Full create, read, update, delete functionality</li>
    <li><strong>Capacity Management:</strong> Track venue capacity and location details</li>
    <li><strong>Usage Analytics:</strong> See venue utilization across events</li>
    <li><strong>Conflict Prevention:</strong> Integration with clash detection system</li>
</ul>

<h3>Clash Resolution</h3>
<ul>
    <li><strong>Conflict Identification:</strong> Automatic detection of overlapping events</li>
    <li><strong>Alternative Suggestions:</strong> Find available venues for same time slots</li>
    <li><strong>Inline Resolution:</strong> Edit conflicting events directly from clash view</li>
    <li><strong>Duration Analysis:</strong> Calculate exact overlap duration in minutes</li>
    <li><strong>Visual Indicators:</strong> Clear color-coding for different conflict types</li>
</ul>

<h3>Schedule View</h3>
<ul>
    <li><strong>Day/Week Views:</strong> Toggle between daily and weekly schedule layouts</li>
    <li><strong>Time Precision:</strong> Half-hour time slots (events placed in first/second half based on minutes)</li>
    <li><strong>Venue Columns:</strong> Each venue gets its own column for clear visualization</li>
    <li><strong>Interactive Events:</strong> Click events for details and actions</li>
    <li><strong>Venue Filtering:</strong> Show/hide specific venues with checkbox controls</li>
    <li><strong>Date Navigation:</strong> Previous/next navigation with today shortcut</li>
    <li><strong>Status Color-coding:</strong> Visual distinction between scheduled and tentative events</li>
</ul>

<h3>User Interface</h3>
<ul>
    <li><strong>Dark Theme:</strong> Professional dark blue/black gradient backgrounds</li>
    <li><strong>Neon Accents:</strong> Light neon green highlights and interactive elements</li>
    <li><strong>Glass-morphism:</strong> Modern frosted glass effects with backdrop blur</li>
    <li><strong>Smooth Animations:</strong> Hover effects, transitions, and micro-interactions</li>
    <li><strong>Responsive Design:</strong> Optimized for desktop, tablet, and mobile devices</li>
    <li><strong>Accessibility:</strong> Proper contrast ratios and keyboard navigation</li>
</ul>

<hr>

<h2 id="tech-stack">Tech Stack</h2>

<h3>Frontend</h3>
<table>
    <tr>
        <td><strong>Framework</strong></td>
        <td>React 18.0+ (Hooks, Context API)</td>
    </tr>
    <tr>
        <td><strong>Routing</strong></td>
        <td>React Router DOM 6.0+</td>
    </tr>
    <tr>
        <td><strong>HTTP Client</strong></td>
        <td>Axios for API communication</td>
    </tr>
    <tr>
        <td><strong>Styling</strong></td>
        <td>CSS3 with CSS Variables, Grid, Flexbox</td>
    </tr>
    <tr>
        <td><strong>Typography</strong></td>
        <td>Inter Font Family (Google Fonts)</td>
    </tr>
    <tr>
        <td><strong>Icons</strong></td>
        <td>Unicode Emojis for consistent cross-platform display</td>
    </tr>
</table>

<h3>Backend</h3>
<table>
    <tr>
        <td><strong>Runtime</strong></td>
        <td>Node.js 18.0+</td>
    </tr>
    <tr>
        <td><strong>Framework</strong></td>
        <td>Express.js 4.18+</td>
    </tr>
    <tr>
        <td><strong>Database</strong></td>
        <td>MongoDB 6.0+</td>
    </tr>
    <tr>
        <td><strong>ODM</strong></td>
        <td>Mongoose 7.0+ (Schema validation, population, indexing)</td>
    </tr>
    <tr>
        <td><strong>Middleware</strong></td>
        <td>CORS, Body Parser, Error Handling</td>
    </tr>
</table>

<h3>Development Tools</h3>
<table>
    <tr>
        <td><strong>Package Manager</strong></td>
        <td>npm</td>
    </tr>
    <tr>
        <td><strong>Version Control</strong></td>
        <td>Git</td>
    </tr>
    <tr>
        <td><strong>API Testing</strong></td>
        <td>Postman/Insomnia</td>
    </tr>
    <tr>
        <td><strong>Environment</strong></td>
        <td>Development/Production configs</td>
    </tr>
</table>

<hr>

<h2 id="installation">Installation</h2>

<h3>Prerequisites</h3>
<ul>
    <li>Node.js 18.0 or higher</li>
    <li>MongoDB 6.0 or higher (local or cloud)</li>
    <li>npm or yarn package manager</li>
    <li>Git for version control</li>
</ul>

<h3>Backend Setup</h3>
<pre><code># Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/eventsync
# PORT=5000
# NODE_ENV=development

# Start the server
npm run dev</code></pre>

<h3>Frontend Setup</h3>
<pre><code># Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Start the development server
npm start</code></pre>

<h3>Database Setup</h3>
<pre><code># MongoDB will create collections automatically
# Default collections: events, venues

<h3>Verification</h3>
<ul>
    <li>Backend: <a href="http://localhost:5000/api/venues">http://localhost:5000/api/venues</a></li>
    <li>Frontend: <a href="http://localhost:3000">http://localhost:3000</a></li>
    <li>Database: Check MongoDB connection in server logs</li>
</ul>

<hr>

<h2 id="usage">Usage</h2>

<h3>Quick Start Guide</h3>

<h4>1. Create Your First Venue</h4>
<ol>
    <li>Navigate to <strong>Venues</strong> tab</li>
    <li>Click "Create New Venue" section</li>
    <li>Fill in venue name, location (optional), and capacity (optional)</li>
    <li>Click "Create Venue"</li>
</ol>

<h4>2. Schedule Your First Event</h4>
<ol>
    <li>Go to <strong>Events</strong> tab</li>
    <li>Scroll to "Create New Event" section</li>
    <li>Enter event title, select venue, date, and time</li>
    <li>Add organiser and description (optional)</li>
    <li>Click "Create Event"</li>
</ol>

<h4>3. Handle Conflicts</h4>
<ol>
    <li>If a clash is detected, you'll see a warning dialogue </li>
    <li>Choose to proceed anyway (creates a tentative event) or edit the timing</li>
    <li>Visit <strong>Clashes</strong> tab to resolve conflicts</li>
    <li>Use "Find Alternatives" or "Edit Event" to resolve</li>
</ol>

<h4>4. View Schedule</h4>
<ol>
    <li>Navigate to <strong>Schedule</strong> tab</li>
    <li>Toggle between Day/Week view</li>
    <li>Select date and filter venues as needed</li>
    <li>Click events for details and quick actions</li>
</ol>

<h3>Advanced Features</h3>

<h4>Force-Create Workflow</h4>
<pre><code>1. Create an event with a conflicting time
2. System detects a clash and shows warning
3. Choose "Yes" to proceed
4. Event created with "tentative" status
5. Resolve later via Clashes page</code></pre>

<h4>Schedule Time Slot Logic</h4>
<pre><code>Event Start/End Time Placement:
• Minutes ≤ 30: Placed in first half-hour slot
• Minutes > 30: Placed in second half-hour slot

Example:
• 09:15 → First half of 09:00-10:00
• 09:45 → Second half of 09:00-10:00</code></pre>

<hr>

<h2 id="api-documentation">API Documentation</h2>

<h3>Base URL</h3>
<pre><code>Development: http://localhost:5000/api
Production: https://your-domain.com/api</code></pre>

<h3>Venues Endpoints</h3>

<table>
    <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Body</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/venues</td>
        <td>Get all venues</td>
        <td>-</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/venues/:id</td>
        <td>Get venue by ID</td>
        <td>-</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/venues</td>
        <td>Create new venue</td>
        <td><code>{ name, location?, capacity? }</code></td>
    </tr>
    <tr>
        <td>PUT</td>
        <td>/venues/:id</td>
        <td>Update venue</td>
        <td><code>{ name, location?, capacity? }</code></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/venues/:id</td>
        <td>Delete venue</td>
        <td>-</td>
    </tr>
</table>

<h3>Events Endpoints</h3>

<table>
    <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Query Params</th>
        <th>Body</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/events</td>
        <td>Get events</td>
        <td><code>date, venue, start, end</code></td>
        <td>-</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/events</td>
        <td>Create event</td>
        <td>-</td>
        <td><code>{ title, venueId/venueName, date, startTime, endTime, organizer?, description?, force? }</code></td>
    </tr>
    <tr>
        <td>PUT</td>
        <td>/events/:id</td>
        <td>Update event</td>
        <td>-</td>
        <td><code>{ title, venue, date, startTime, endTime, organizer?, description? }</code></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/events/:id</td>
        <td>Delete event</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/events/clashes</td>
        <td>Get clashes for date</td>
        <td><code>date</code></td>
        <td>-</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/events/:id/suggest-reschedule</td>
        <td>Get alternative venues</td>
        <td>-</td>
        <td><code>{ startTime, endTime }</code></td>
    </tr>
</table>

<h3>Response Examples</h3>

<h4>Create Event Response</h4>
<pre><code>Status: 201 Created
{
  "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "title": "Team Meeting",
  "venue": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "name": "Conference Room A",
    "location": "Building 1, Floor 2",
    "capacity": 20
  },
  "date": "2025-08-18",
  "startTime": "2025-08-18T09:00:00.000Z",
  "endTime": "2025-08-18T10:00:00.000Z",
  "organizer": "John Doe",
  "description": "Weekly team sync",
  "status": "scheduled",
  "createdAt": "2025-08-17T18:30:00.000Z",
  "updatedAt": "2025-08-17T18:30:00.000Z"
}</code></pre>

<h4>Clash Detection Response</h4>
<pre><code>Status: 409 Conflict
{
  "error": "Time clash detected",
  "message": "Event conflicts with existing events",
  "clashes": [
    {
      "_id": "64a7b8c9d1e2f3a4b5c6d7ea",
      "title": "Existing Meeting",
      "venue": {
        "name": "Conference Room A"
      },
      "startTime": "2025-08-18T09:30:00.000Z",
      "endTime": "2025-08-18T10:30:00.000Z"
    }
  ]
}</code></pre>

<hr>

<h2 id="project-structure">Project Structure</h2>

<pre><code>eventsync/
├── client/                          # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js         # Main dashboard with statistics
│   │   │   ├── EventsPage.js        # Events CRUD management
│   │   │   ├── VenueList.js         # Venues CRUD management
│   │   │   ├── ClashView.js         # Conflict resolution interface
│   │   │   └── Schedule.js          # Interactive schedule view
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.js                   # Main app component with routing
│   │   ├── App.css                  # Global styles and theme
│   │   ├── Schedule.css             # Schedule-specific styles
│   │   └── index.js                 # React entry point
│   └── package.json
├── server/                          # Express backend
│   ├── models/
│   │   ├── Event.js                 # Event mongoose schema
│   │   └── Venue.js                 # Venue mongoose schema
│   ├── routes/
│   │   ├── events.js                # Event API routes
│   │   └── venues.js                # Venue API routes
│   ├── middleware/
│   │   └── errorHandler.js          # Global error handling
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── server.js                    # Express server setup
│   ├── .env.example                 # Environment variables template
│   └── package.json
├── sample-data/                     # Sample data for testing
│   ├── venues.json
│   └── events.json
├── docs/                           # Additional documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── .gitignore
├── README.md
└── LICENSE</code></pre>

<hr>

<h2 id="algorithms">Algorithms & Logic</h2>

<h3>Clash Detection Algorithm</h3>

<h4>Time Overlap Logic</h4>
<pre><code>function hasOverlap(event1, event2) {
  return (
    event1.startTime < event2.endTime && 
    event2.startTime < event1.endTime
  );
}

// Handles all cases:
// 1. Complete overlap
// 2. Partial overlap (start/end)
// 3. Nested overlap
// 4. Adjacent events (no overlap)</code></pre>

<h4>Database Query Optimization</h4>
<pre><code>// MongoDB indexes for performance
events.createIndex({ venue: 1, startTime: 1 });
events.createIndex({ date: 1, startTime: 1 });

// Efficient clash detection query
db.events.find({
  venue: targetVenueId,
  startTime: { $lt: eventEndTime },
  endTime: { $gt: eventStartTime },
  _id: { $ne: excludeEventId }
});</code></pre>

<h3>Schedule Positioning Algorithm</h3>

<h4>Time Slot Calculation</h4>
<pre><code>function calculateEventPosition(event) {
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinutes = endTime.getMinutes();

  // Calculate half-hour slot positions
  const startSlot = (startHour - 8) * 2 + (startMinutes <= 30 ? 0 : 1);
  const endSlot = (endHour - 8) * 2 + (endMinutes <= 30 ? 0 : 1);
  
  return {
    startSlot: Math.max(0, startSlot),
    endSlot: Math.min(endSlot, totalSlots),
    duration: endSlot - startSlot
  };
}</code></pre>

<h3>Alternative Venue Suggestion</h3>

<h4>Availability Check Algorithm</h4>
<pre><code>async function findAvailableVenues(startTime, endTime, excludeEventId) {
  const allVenues = await Venue.find();
  const availableVenues = [];
  for (const venue of allVenues) {
    const conflicts = await checkClashes(
      venue._id, 
      startTime, 
      endTime, 
      excludeEventId
    );
    if (conflicts.length === 0) {
      availableVenues.push(venue);
    }
  }
  return availableVenues;
}</code></pre>

<h3>Performance Optimizations</h3>

<h4>Frontend</h4>
<ul>
    <li><strong>React Hooks:</strong> Efficient state management and side effects</li>
    <li><strong>Memoization:</strong> Prevent unnecessary re-renders</li>
    <li><strong>Lazy Loading:</strong> Code splitting for better initial load</li>
    <li><strong>Debounced Inputs:</strong> Reduce API calls during typing</li>
</ul>

<h4>Backend</h4>
<ul>
    <li><strong>Database Indexing:</strong> Optimized queries for venue/time lookups</li>
    <li><strong>Mongoose Population:</strong> Efficient related data loading</li>
    <li><strong>Query Caching:</strong> Redis integration for frequently accessed data</li>
    <li><strong>Pagination:</strong> Large dataset handling</li>
</ul>

<hr>

# Frontend tests  
npm run test:client

# Integration tests
npm run test:e2e</code></pre>
    </li>
    
    <li><strong>Submit Pull Request</strong>
        <ul>
            <li>Provide clear description of changes</li>
            <li>Include screenshots for UI changes</li>
            <li>Reference any related issues</li>
        </ul>
    </li>
</ol>

<h3>Code Style Guidelines</h3>

<h4>JavaScript/React</h4>
<ul>
    <li>Use functional components with hooks</li>
    <li>Follow camelCase naming convention</li>
    <li>Use descriptive variable and function names</li>
    <li>Keep components focused and single-purpose</li>
    <li>Use async/await over Promise chains</li>
</ul>

<h4>CSS</h4>
<ul>
    <li>Use CSS custom properties (variables)</li>
    <li>Follow BEM methodology for class naming</li>
    <li>Mobile-first responsive design</li>
    <li>Consistent spacing and color usage</li>
</ul>

<h4>MongoDB/Mongoose</h4>
<ul>
    <li>Define proper schemas with validation</li>
    <li>Use appropriate indexes for performance</li>
    <li>Handle errors gracefully</li>
    <li>Follow RESTful API conventions</li>
</ul>

</html>
