import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import BookingPage from "./pages/BookingPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected Route Component
function ProtectedRoute({ element, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />; // Redirect if not logged in
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/booking" replace />; // Redirect students to Booking Page
  }

  return element;
}

function App() {
  return (
    <>
      {/* ✅ ToastContainer is placed here to be globally available */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        draggable 
        pauseOnHover 
        theme="colored" 
        className="z-[9999]" 
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route 
          path="/faculty-dashboard" 
          element={<ProtectedRoute element={<FacultyDashboard />} allowedRoles={["faculty"]} />} 
        />
      </Routes>
    </>
  );
}

export default App;
