const Booking = require("../models/Booking.js");
const User = require("../models/User");

// 📌 Book a seat
exports.bookSeat = async (req, res) => {
    const { studentId, name, date, seatNumber } = req.body;

    try {
        // ✅ Ensure the user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        // ✅ Check if the student already booked this week
        const existingBooking = await Booking.findOne({ studentId, date });
        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this week!" });
        }

        // ✅ Check if the day is fully booked (max 10 students)
        const dayBookings = await Booking.find({ date });
        if (dayBookings.length >= 10) {
            return res.status(400).json({ message: "House Full for this day!" });
        }

        // ✅ Ensure seat number is unique per day
        const seatTaken = await Booking.findOne({ date, seatNumber });
        if (seatTaken) {
            return res.status(400).json({ message: `Seat ${seatNumber} is already taken! Choose another.` });
        }

        // ✅ Save booking
        const newBooking = new Booking({ studentId, name, date, seatNumber });
        await newBooking.save();

        res.json({ message: "Booking successful!", booking: newBooking });
    } catch (error) {
        console.error("❌ Booking Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 📌 Get student bookings
exports.getStudentBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        console.log("📡 Returning Bookings:", bookings);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 📌 Get all bookings (For faculty)
exports.getAllBookings = async (req, res) => {
    try {
        console.log("🔍 Fetching all bookings...");

        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error("❌ Fetch All Bookings Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
