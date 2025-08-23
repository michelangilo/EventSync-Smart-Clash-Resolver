// server/models/Venue.js
const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: String,
    capacity: Number,
}, { timestamps: true });

module.exports = mongoose.model('Venue', VenueSchema);