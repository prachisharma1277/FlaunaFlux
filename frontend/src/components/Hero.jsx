import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import photo1 from "../assets/images/Photo1.jpeg";
import photo2 from "../assets/images/Photo2.jpeg";
import photo3 from "../assets/images/Home6.png";
import { Link } from "react-router-dom";

export default function Hero() {
  const images = [photo1, photo2, photo3];
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  // Added images.length to the dependency array
  }, [images.length]); 

  useEffect(() => {
    // Renamed variables for clarity to avoid shadowing
    const userString = localStorage.getItem("user"); 
    if (userString) {
      try {
        const userObject = JSON.parse(userString); // Parse the string
        setIsLoggedIn(true);
        setIsAuthorized(userObject.role === "authorised");
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        // Optionally clear bad data
        // localStorage.removeItem("user"); 
      }
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Image Slider */}
      <AnimatePresence>
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt="FaunaFlux Hero"
          className="absolute inset-0 w-full h-full object-cover scale-110"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      {/* Softer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/50"></div>

      {/* Text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Protect. Preserve. Prosper.
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white/90 mt-4 max-w-2xl leading-relaxed drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Join FaunaFlux in safeguarding biodiversity and tracking the impact
          of climate change on wildlife.
        </motion.p>

        {/* CTA */}
        <Link to={isLoggedIn ? "/report" : "/login"}>
          <motion.button
            className="mt-8 px-8 py-3 rounded-full font-semibold text-white bg-green-700 hover:bg-green-800
            shadow-[0_4px_20px_rgba(0,150,80,0.4)] transition-all duration-300"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoggedIn ? "Report Sighting" : "Get Started"}
          </motion.button>
        </Link>
        {isLoggedIn && isAuthorized && (
          <Link to="/upload-document">
            <motion.button
              // Added mt-4 for spacing
              className="mt-4 px-8 py-3 rounded-full font-semibold text-green-900 bg-white border-2 border-green-700 
              hover:bg-green-50 shadow-md transition-all duration-300"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload Document
            </motion.button>
          </Link>
        )}
      </div>
    </section>
  );
}