// client/src/pages/ProfilePage.js
import { FaHome, FaUser, FaBell, FaCog, FaBook, FaUsers, FaChartLine, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import React, { useState, useEffect } from "react";
import axios from "axios";

// --- API Configuration ---
const API_URL = "http://localhost:5000/api";
// ❗️ We no longer need the SERVER_URL constant

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userString = localStorage.getItem("user");
        if (!userString) {
          return;
        }
        const userObj = JSON.parse(userString);
        setUser(userObj);

        const config = {
          headers: {
            "x-user-id": userObj._id,
          },
        };

        const docResponse = await axios.get(`${API_URL}/documents/my-documents`, config);
        setDocuments(docResponse.data);

      } catch (error) {
        console.error("Error fetching profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... (loading and user checks remain the same) ...

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
     return (
       <div className="min-h-screen flex items-center justify-center">
        Error loading user. Please log in again.
      </div>
    );
  }

  const sidebarNav = [
    { label: "Dashboard", icon: <FaHome />, path: "/home" },
    { label: "My Contributions", icon: <FaBook />, path: "/contributions" },
    { label: "Analytics", icon: <FaChartLine />, path: "/analytics" },
    { label: "Followers / Following", icon: <FaUsers />, path: "/network" },
    { label: "Settings", icon: <FaCog />, path: "/settings" },
    { label: "Notifications", icon: <FaBell />, path: "/notifications" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50 pt-18 pb-8 shadow-md">
        {/* --- Sidebar (unchanged) --- */}
        <aside className="w-64 bg-white shadow-md flex flex-col justify-between p-6">
          <div>
            <div className="flex flex-col items-center mb-10">
              <img
                src="https://i.pravatar.cc/100?img=8"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mb-3 shadow"
              />
              <h2 className="text-lg font-semibold text-green-800">{user.name || "Dr. Anya Sharra"}</h2>
              <p className="text-sm text-gray-500">{user.title || "Lead Conservation Scientist"}</p>
            </div>
            <nav className="space-y-2">
              {sidebarNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-800 transition"
                >
                  <span className="text-green-700 mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="text-center text-sm text-gray-400 mt-8">
            © {new Date().getFullYear()} FaunaFlux
          </div>
        </aside>

        {/* --- Main Content (with the fix) --- */}
        <div className="flex-1 flex flex-col">
          {/* Header (unchanged) */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-green-800">
              Welcome Back, <span className="text-green-700">{user.name || "Dr. Anya Sharra"} 👋</span>
            </h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-green-700"><FaBell size={20} /></button>
              <button className="text-gray-600 hover:text-green-700"><FaUser size={20} /></button>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 p-8 bg-gray-50">
            {/* Stats (unchanged) */}
            <h2 className="text-xl font-semibold text-green-800 mb-6">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="Documents Uploaded" value={documents.length} />
              <StatCard title="Data Visualizations" value="5,890" />
              <StatCard title="Alerts Reviewed" value="312" />
              <StatCard title="Impact Score" value="4.7 / 5" />
            </div>

            {/* --- ⭐️ THIS IS THE FIX ⭐️ --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                My Uploaded Documents
              </h3>
              {documents.length > 0 ? (
                <ul className="space-y-3">
                  {documents.map((doc) => (
                    <li
                      key={doc._id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm hover:bg-green-50 transition"
                    >
                      <div className="flex items-center">
                        <FaFileAlt className="text-green-700 mr-3" />
                        <span className="text-gray-700">{doc.originalName}</span>
                      </div>
                      <a
                        // ❗️ THE FIX: We just use doc.filePath directly.
                        // It is now a full URL like 'https://res.cloudinary.com/...'
                        href={doc.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">You haven't uploaded any documents yet.</p>
              )}
            </div>
            {/* --- END: MY DOCUMENTS SECTION --- */}

            {/* Other sections (unchanged) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Recent Activity
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <ActivityItem text="💬 You commented on 'Coral Reef Resilience Study'." />
                  <ActivityItem text="📊 You shared insights on 'Elephant Migration Trends'." />
                  <ActivityItem text="📄 You uploaded a new document on 'Global Bird Decline'." />
                  <ActivityItem text="🔔 You received 2 new conservation alerts." />
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Suggested Actions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Keep your profile updated and explore more projects to boost your impact.
                  </p>
                </div>
                <button className="bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 transition">
                  Complete Your Profile (70%)
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

/* --- Reusable Components (unchanged) --- */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
      <p className="text-gray-500 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-green-800">{value}</h3>
    </div>
  );
}

function ActivityItem({ text }) {
  return (
    <li className="bg-gray-50 p-3 rounded-md shadow-sm hover:bg-green-50 transition">
      {text}
    </li>
  );
}