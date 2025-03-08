import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChair, FaCalendarAlt } from "react-icons/fa"; // Icons
import { motion } from "framer-motion"; // Animations
import ClipLoader from "react-spinners/ClipLoader"; // Loader

const API_URL = `${ import.meta.env.VITE_REACT_APP_BACKEND_BASEURL }/api/bookings`;

function FacultyDashboard() {
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "faculty") {
      navigate("/");
    } else {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const groupedBookings = data.reduce((acc, booking) => {
        if (!acc[booking.date]) {
          acc[booking.date] = [];
        }
        acc[booking.date].push(booking);
        return acc;
      }, {});

      setBookings(groupedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.h1 
        className="text-3xl font-bold text-center text-gray-900 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Faculty Dashboard
      </motion.h1>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader color="#2563EB" size={50} />
        </div>
      ) : (
        <div className="overflow-x-auto max-w-4xl mx-auto">
          {Object.keys(bookings).length === 0 ? (
            <p className="text-center text-gray-500">No bookings found.</p>
          ) : (
            Object.entries(bookings).map(([date, dayBookings]) => (
              <motion.div 
                key={date} 
                className="bg-white shadow-lg rounded-lg p-5 mb-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3 text-gray-700 text-lg font-semibold">
                  <FaCalendarAlt className="text-blue-500" />
                  {date}
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="border p-3 text-left"> <FaUserGraduate className="inline-block mr-1" /> Student ID</th>
                      <th className="border p-3 text-left"> Name</th>
                      <th className="border p-3 text-left"> <FaChair className="inline-block mr-1" /> Seat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayBookings.map((booking, index) => (
                      <motion.tr 
                        key={booking._id} 
                        className={`text-gray-700 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <td className="border p-3">{booking.studentId}</td>
                        <td className="border p-3">{booking.name}</td>
                        <td className="border p-3">{booking.seatNumber + 1}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default FacultyDashboard;
