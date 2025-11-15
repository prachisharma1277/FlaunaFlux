import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
const API_URL=import.meta.env.VITE_BACKEND_URL;
function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Fetch backend message
    axios.get(`${API_URL}/api/welcome`)
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => console.error("Backend not connected:", err));
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-green-700 mb-4"
      >
        Welcome to FaunaFlux 🌿
      </motion.h1>

      <p data-aos="fade-up" className="text-gray-600 text-lg max-w-xl text-center">
        {message || "Connecting to backend..."}
      </p>
    </div>
  );
}

export default Home;
