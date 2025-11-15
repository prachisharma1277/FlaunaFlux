import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import VerifiedPopulationMetrics from "../../components/Population_comp/Verified/Final.jsx";
import Overview from "../../components/Population_comp/Overview.jsx";

// Use your environment variable for the API URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function PopulationMetricsPage() {
  // --- 1. State now lives in the parent component ---
  const [allData, setAllData] = useState(null); // Stores all data from the API
  const [selectedRegion, setSelectedRegion] = useState("All India");
  // --- Loader state has been removed ---

  // --- 2. Fetch all data when this page loads ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // This is the new API endpoint you created in server.js
        const response = await axios.get(`${API_URL}/api/population-data`);
        setAllData(response.data);
      } catch (error) {
        console.error("Error fetching population data:", error);
      }
      // 'finally' block for loading state removed
    };
    fetchData();
  }, []); // Empty array means this runs once on mount

  // --- 3. Derive regions from the fetched data ---
  // We use optional chaining '?' in case allData is null
  const regions = allData ? Object.keys(allData.parkData) : [];

  // --- 4. Loading check has been removed ---
  // The components will simply render with empty/default data
  // until 'allData' is populated by the useEffect.
  // The '?' optional chaining in the child components prevents crashes.

  // --- 5. Pass the data down as props to the children ---
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <Overview 
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
      
      {/* We add a check here: Only render VerifiedPopulationMetrics 
        if allData actually exists. This is a safer alternative
        to a loading screen.
      */}
      {allData && (
        <VerifiedPopulationMetrics 
          allData={allData}
          selectedRegion={selectedRegion}
        />
      )}
      
      <Footer />
    </main>
  );
}