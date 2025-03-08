import { useState, useEffect } from "react";

// Define the week schedule (Monday to Saturday)
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function BookingGrid({ bookings, selectedDate, setSelectedDate, handleSeatClick }) {
  const [showSeats, setShowSeats] = useState(false);
  const [weekStart, setWeekStart] = useState(null);

  // Calculate the start of the current week (Monday)
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday

    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() + mondayOffset);
    startOfWeek.setHours(0, 0, 0, 0);

    setWeekStart(startOfWeek);
  }, []);

  return (
    <div className="text-center w-full">
      {/* Date Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {weekStart &&
          days.map((day, index) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + index);
            const formattedDate = date.toISOString().split("T")[0];

            const bookedSeats = bookings[formattedDate] ? bookings[formattedDate].length : 0;
            const isFull = bookedSeats >= 10;

            return (
              <button
                key={formattedDate}
                disabled={isFull}
                className={`p-3 border rounded-xl transition-all duration-300 text-lg font-semibold cursor-pointer
                  ${isFull ? "bg-gray-500 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-800"}`}
                onClick={() => {
                  setSelectedDate(formattedDate);
                  setShowSeats(true);
                }}
              >
                📅 {day} ({formattedDate}) <br />
                <span className="text-sm">{bookedSeats}/10 {isFull ? " - House Full" : ""}</span>
              </button>
            );
          })}
      </div>

      {/* Seat Selection Grid */}
      {showSeats && selectedDate && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Select a Seat for {selectedDate}</h2>
          <div className=" md:ml-2 grid grid-cols-5 md:grid-cols-10 gap-3 justify-center">
            {Array.from({ length: 10 }).map((_, seatIndex) => {
              const isBooked = bookings[selectedDate]?.some(b => b.seatNumber === seatIndex);
              return (
                <button
                  key={seatIndex}
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-xl 
                    transition-all duration-300 border-2 
                    ${isBooked ? "bg-gray-400 border-gray-600 cursor-not-allowed text-gray-700" : 
                    "bg-green-500 border-green-700 hover:bg-green-700 hover:border-green-900"} cursor-pointer`}
                  onClick={() => !isBooked && handleSeatClick(seatIndex)}
                  disabled={isBooked}
                >
                  📌
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingGrid;
