const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    seatNumber: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
