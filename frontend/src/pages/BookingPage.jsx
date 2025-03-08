import { useState, useEffect } from "react";
import axios from "axios";
import BookingGrid from "../components/BookingGrid";
import BookingForm from "../components/BookingForm";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;// Backend URL

function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/");
    } else {
      setUser(JSON.parse(userData));
    }

    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchBookings();
    }
  }, [selectedDate]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const { data } = await axios.get(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedBookings = data.reduce((acc, booking) => {
        if (!acc[booking.date]) {
          acc[booking.date] = [];
        }
        acc[booking.date].push(booking);
        return acc;
      }, {});

      setBookings(formattedBookings);
    } catch (error) {
      console.error("❌ Fetch Bookings Error:", error.response?.data || error.message);
    }
  };

  const handleSeatClick = (seatIndex) => {
    if (!selectedDate) return alert("Please select a day first!");
    setSelectedSeat(seatIndex);
  };

  const closeModal = () => {
    setSelectedSeat(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-blue-900 to-indigo-700 text-white">
      {/* Page Heading with Animation */}
      <motion.h1
        className="text-2xl sm:text-4xl font-extrabold mb-6 text-center flex items-center gap-3 md:mt-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-3xl sm:text-4xl "> 📅</span> Book Your Appointment
      </motion.h1>

      {/* Booking Grid */}
      <motion.div
        className="w-full max-w-full sm:max-w-4xl bg-white shadow-xl rounded-lg p-4 sm:p-6 text-gray-900 md:mt-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <BookingGrid 
          bookings={bookings} 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          handleSeatClick={handleSeatClick} 
        />
      </motion.div>

      {/* Booking Form Modal */}
      {selectedSeat !== null && user && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <BookingForm 
              selectedDate={selectedDate} 
              seatNumber={selectedSeat} 
              fetchBookings={fetchBookings} 
              closeModal={closeModal} 
              user={user}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default BookingPage;
