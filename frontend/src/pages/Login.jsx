import { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL; // Backend URL

function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { studentId, password });

      // Store user details and token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect based on role
      if (data.user.role === "faculty") {
        navigate("/faculty-dashboard");
      } else {
        navigate("/booking");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-6">
      
      {/* Responsive Main Heading */}
      <motion.h1 
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Record Appointment Booking System
      </motion.h1>

      <motion.div 
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-gray-800">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="ID Number"
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.toUpperCase())}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle type
              placeholder="Password"
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10 sm:pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye Icon for Password Visibility */}
            <span
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 sm:p-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
