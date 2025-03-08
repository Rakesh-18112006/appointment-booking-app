const express = require("express");
const { bookSeat, getStudentBookings, getAllBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, bookSeat);
router.get("/", authMiddleware, getStudentBookings);
router.get("/all", authMiddleware, getAllBookings); // Faculty only

module.exports = router;
