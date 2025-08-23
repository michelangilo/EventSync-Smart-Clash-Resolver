// server/routes/events.js
const express = require('express');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const router = express.Router();

// helper to check clashes
async function checkClashes(venueId, startTime, endTime, excludeEventId = null) {
    const query = {
        venue: venueId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
    };
    if (excludeEventId) query._id = { $ne: excludeEventId };
    return Event.find(query).populate('venue');
}

router.get('/', async (req, res) => {
  try {
    const { venue, date, start, end } = req.query;
    const query = {};
    
    if (venue) query.venue = venue;
    
    // Handle date filtering
    if (date) {
      // Single date filter (existing behavior)
      query.date = date;
    } else if (start && end) {
      // Date range filter (new for schedule)
      query.date = { $gte: start, $lte: end };
    } else if (start) {
      // From start date onwards
      query.date = { $gte: start };
    } else if (end) {
      // Up to end date
      query.date = { $lte: end };
    }
    
    const events = await Event.find(query).populate('venue').sort({ startTime: 1 });
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create an event
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/events body:', req.body);
        const {
            title,
            venueId,
            venueName,
            date,
            startTime,
            endTime,
            organizer,
            description,
            force = false
        } = req.body;

        if (!title || !date || !startTime || !endTime) {
            return res.status(400).json({ error: 'title, date, startTime, endTime are required' });
        }

        let venueDoc;
        if (venueId) {
            venueDoc = await Venue.findById(venueId);
            if (!venueDoc) return res.status(404).json({ error: 'Venue not found' });
        } else if (venueName) {
            venueDoc = await Venue.findOne({ name: venueName });
            if (!venueDoc) {
                venueDoc = new Venue({ name: venueName });
                await venueDoc.save();
            }
        } else {
            return res.status(400).json({ error: 'Either venueId or venueName is required' });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        // Clash check
        const overlaps = await checkClashes(venueDoc._id, start, end);
        if (overlaps.length > 0 && !force) {
            return res.status(409).json({
                error: 'Time clash detected',
                message: 'Event conflicts with existing events',
                clashes: overlaps
            });
        }

        const event = new Event({
            title,
            venue: venueDoc._id,
            date,
            startTime: start,
            endTime: end,
            organizer,
            description,
            status: overlaps.length > 0 ? 'tentative' : 'scheduled'
        });

        await event.save();
        await event.populate('venue');
        return res.status(201).json(event);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// List events, optional filters
router.get('/clashes', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ error: 'Date parameter is required' });
        // Fetch all events on this date, sorted by venue and startTime
        const events = await Event.find({ date })
            .populate('venue')
            .sort({ venue: 1, startTime: 1 });

        // Group by venue
        const eventsByVenue = new Map();
        for (const ev of events) {
            const key = ev.venue._id.toString();
            if (!eventsByVenue.has(key)) {
                eventsByVenue.set(key, { venue: ev.venue, list: [] });
            }
            eventsByVenue.get(key).list.push(ev);
        }

        // Build overlapping pairs
        const clashes = [];
        for (const { venue, list } of eventsByVenue.values()) {
            for (let i = 0; i < list.length - 1; i++) {
                for (let j = i + 1; j < list.length; j++) {
                    const A = list[i];
                    const B = list[j];
                    if (A.startTime < B.endTime && B.startTime < A.endTime) {
                        clashes.push({ venue, events: [A, B] });
                    } else if (B.startTime >= A.endTime) {
                        break; // early exit
                    }
                }
            }
        }

        return res.json(clashes);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/:id/suggest-reschedule', async (req, res) => {
    try {
        const eventId = req.params.id;
        const { startTime, endTime } = req.body;
        if (!startTime || !endTime) {
            return res.status(400).json({ error: 'startTime and endTime are required' });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid startTime or endTime' });
        }
        if (end <= start) {
            return res.status(400).json({ error: 'endTime must be after startTime' });
        }

        const venues = await Venue.find().sort({ name: 1 });
        const availableVenues = [];

        for (const venue of venues) {
            // exclude the current event by id so it doesn't clash with itself
            const conflicts = await checkClashes(venue._id, start, end, eventId);
            if (conflicts.length === 0) {
                availableVenues.push(venue);
            }
        }

        return res.json({ availableVenues });
    } catch (error) {
        console.error('Suggest-reschedule error:', error);
        return res.status(500).json({ error: 'Failed to get suggestions' });
    }
});

// UPDATE an event
router.put('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, venue, date, startTime, endTime, organizer, description, force = false } = req.body;

    if (!title || !venue || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'title, venue, date, startTime, endTime are required' });
    }

    // Find the existing event
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check for clashes (exclude the current event from clash check)
    const overlaps = await checkClashes(venue, start, end, eventId);
    if (overlaps.length > 0 && !force) {
      return res.status(409).json({
        error: 'Time clash detected',
        message: 'Updated event conflicts with existing events',
        clashes: overlaps
      });
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        venue,
        date,
        startTime: start,
        endTime: end,
        organizer,
        description,
        status: overlaps.length > 0 ? 'tentative' : 'scheduled'
      },
      { new: true } // return updated document
    ).populate('venue');

    return res.json(updatedEvent);
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;