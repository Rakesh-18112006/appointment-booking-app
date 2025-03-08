import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const BookingForm = ({ selectedDate, seatNumber, fetchBookings, closeModal, user }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBooking = async () => {
        if (!user?.studentId) {
            return setError("Invalid user. Please log in again.");
        }
        if (!selectedDate) {
            return setError("Select a date first!");
        }
        if (seatNumber === undefined || seatNumber === null) {
            return setError("Please select a seat before booking!");
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return setError("Authentication error. Please log in again.");
            }

            console.log("📌 Booking Data:", { studentId: user.studentId, date: selectedDate, seatNumber });

            await axios.post(
                `${API_URL}/api/bookings`,
                {
                    studentId: user.studentId,
                    name: user.name,
                    date: selectedDate,
                    seatNumber,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success(`✅ Seat ${seatNumber + 1} booked successfully!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });

            fetchBookings();
            closeModal();
        } catch (err) {
            console.error("❌ Booking Error:", err.response?.data?.message || err.message);
            toast.error(`❌ ${err.response?.data?.message || "Booking failed!"}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ✅ Place ToastContainer outside the modal, with the highest z-index */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} className="z-[10000]" />

            <motion.div 
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl border border-gray-200"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Header */}
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                        Confirm Your Booking
                    </h2>

                    {/* Selected Seat Info */}
                    <p className="text-lg text-gray-700 text-center mb-4">
                        <span className="font-medium text-gray-600">Selected Seat:</span> 
                        <strong className="text-blue-600"> {seatNumber + 1}</strong>
                    </p>

                    {/* Error Message */}
                    {error && <p className="text-red-600 text-center text-sm bg-red-100 p-2 rounded-md mb-3">{error}</p>}

                    {/* User Details */}
                    <div className="bg-gray-100 p-5 rounded-lg border border-gray-300 shadow-sm">
                        <p className="text-lg text-gray-900 font-semibold mb-2">
                            <span className="text-gray-600 font-medium">Name:</span> {user?.name}
                        </p>
                        <p className="text-lg text-gray-900 font-semibold mb-2">
                            <span className="text-gray-600 font-medium">Student ID:</span> {user?.studentId}
                        </p>
                        <p className="text-lg text-gray-900 font-semibold">
                            <span className="text-gray-600 font-medium">Role:</span> {user?.role}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                        <motion.button
                            className="w-full sm:w-1/2 px-4 py-3 rounded-lg text-lg font-medium text-gray-800 bg-gray-300 hover:bg-gray-400 transition-all cursor-pointer"
                            onClick={closeModal}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.94 }}
                            disabled={loading}
                        >
                            Cancel
                        </motion.button>
                        
                        <motion.button
                            className={`w-full sm:w-1/2 px-5 py-3 rounded-lg text-lg font-semibold text-white shadow-lg transition-all
                                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-lg hover:scale-105 cursor-pointer"}`}
                            onClick={handleBooking}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.94 }}
                            disabled={loading}
                        >
                            {loading ? "Booking..." : "Confirm"}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default BookingForm;
