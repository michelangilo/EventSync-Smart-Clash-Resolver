// server/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    date: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    organizer: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['scheduled', 'tentative', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

eventSchema.index({ venue: 1, startTime: 1 });
eventSchema.index({ date: 1, startTime: 1 });

module.exports = mongoose.model('Event', eventSchema);