import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHandshake,
  FaEye,
  FaLeaf,
  FaLightbulb,
  FaLinkedin,
} from "react-icons/fa";

import HeroImg from "../../assets/images/Home1.png"; // use your own banner image
import Member1 from "../../assets/images/member.jpeg";
import Member2 from "../../assets/images/member.jpeg";
import Member3 from "../../assets/images/member.jpeg";
import Member4 from "../../assets/images/member.jpeg";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const AboutUs = () => {
  const team = [
    {
      name: "Jannat",
      role: "Frontend Developer (React)",
      img: Member1,
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Latika Adhikari",
      role: "Backend Developer",
      img: Member2,
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Kajal",
      role: "Frontend Developer",
      img: Member3,
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Prachi",
      role: "Backend Developer",
      img: Member4,
      linkedin: "https://www.linkedin.com/",
    },
  ];

  // 🔹 Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("Sending...");

    try {
      const res = await fetch(`${API_URL}/api/about/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setResponseMsg("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResponseMsg("⚠️ Please fill all fields correctly.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMsg("❌ Failed to send message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-green-50 text-gray-800">
      {/* 🌱 Hero Section */}
      <div
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${HeroImg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Our Mission: Empowering Conservation Through Data & Innovation
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Together we aim to protect biodiversity, promote transparency,
            and use technology to drive meaningful environmental change.
          </p>
        </motion.div>
      </div>

      {/* 🌿 Vision Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-green-800 mb-4"
        >
          Connecting Data, Experts & Communities for a Greener Future
        </motion.h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          At FaunaFlux, we are dedicated to safeguarding the future of our planet’s most vulnerable wildlife species. Leveraging cutting-edge technology and real-time data, we empower conservationists, researchers, and local communities to monitor, analyze, and protect ecosystems across the globe.
          <br /><br />
          Our platform combines IoT sensors, AI-driven analytics, and cloud-based infrastructure to provide actionable insights into wildlife populations, habitat health, and climate impacts. By offering real-time metrics, extinction alerts, and disease monitoring, we ensure that conservation efforts are informed and impactful.
          <br /><br />
          Together, with innovative solutions and a shared commitment, we aim to foster collaboration and drive sustainable practices that can restore balance to our natural world.
          Join us in making a difference—because every species matters.
        </p>

        {/* 🌎 Core Values */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow border border-green-100">
            <FaHandshake className="text-green-700 text-3xl mb-3 mx-auto" />
            <h3 className="font-semibold text-green-800 mb-2">Collaboration</h3>
            <p className="text-sm text-gray-600">
              Empowering partnerships across conservation networks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-green-100">
            <FaEye className="text-green-700 text-3xl mb-3 mx-auto" />
            <h3 className="font-semibold text-green-800 mb-2">Transparency</h3>
            <p className="text-sm text-gray-600">
              Open data and verified research for trusted insights.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-green-100">
            <FaLeaf className="text-green-700 text-3xl mb-3 mx-auto" />
            <h3 className="font-semibold text-green-800 mb-2">Impact</h3>
            <p className="text-sm text-gray-600">
              Real-time action and measurable ecological outcomes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-green-100">
            <FaLightbulb className="text-green-700 text-3xl mb-3 mx-auto" />
            <h3 className="font-semibold text-green-800 mb-2">Innovation</h3>
            <p className="text-sm text-gray-600">
              Leveraging AI, ML, and IoT to redefine conservation research.
            </p>
          </div>
        </div>
      </section>

      {/* 👩‍💻 Team Section */}
      <section className="bg-white py-16 border-t border-green-100">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">
          Meet Our Team
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-8 px-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-b from-green-50 to-white p-6 rounded-xl shadow-lg text-center border border-green-100"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-green-200"
              />
              <h3 className="mt-4 text-lg font-semibold text-green-800">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600">{member.role}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-green-700 text-sm font-medium hover:underline"
              >
                <FaLinkedin /> LinkedIn
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✉️ Contact Section */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Contact & Feedback
          </h2>
          <p className="text-gray-600 mb-6">
            We’d love to hear your thoughts, feedback, or partnership inquiries.
            Fill out the form or reach us through our social channels below.
          </p>

          {/* Contact Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
            />
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full p-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {responseMsg && (
              <p className="text-sm mt-2 text-green-700">{responseMsg}</p>
            )}
          </form>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-inner">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Join Our Conservation Journey 🌍
          </h3>
          <p className="text-gray-600 mb-4">
            Be part of FaunaFlux — where technology meets conservation.
            Together, we can protect wildlife and drive ecological change.
          </p>
          <a
            href="/community"
            className="block text-center bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
          >
            Join Community
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
