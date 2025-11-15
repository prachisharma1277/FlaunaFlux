// src/pages/Population/Population.jsx
import { useState, useEffect } from "react"; // 👈 Import useEffect
import Overview from "../../components/Population_comp/Overview";
import StatsCards from "../../components/Population_comp/StatsCard";
import ChartsDashboard from "../../components/Population_comp/ChartsDashboard";
import SpeciesSpotlight from "../../components/Population_comp/Species";
import Navbar from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
const API_URL=import.meta.env.VITE_BACKEND_URL;
export default function NormalPopulation() {
  const [regions, setRegions] = useState(["All India"]); // 👈 Default region list
  const [selectedRegion, setSelectedRegion] = useState("All India");

  // 👈 Fetch the list of regions from the backend
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/population-data`);
        const data = await response.json();
        // The regions are the keys of the parkData object
        const fetchedRegions = Object.keys(data.parkData);
        setRegions(fetchedRegions);
        setSelectedRegion(fetchedRegions[0] || "All India");
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, []); // Run once on component mount

  // ... (No change to return block)
  return (
    <>
      <Navbar />
      <Overview
        selectedRegion={selectedRegion}
        regions={regions} // Passes the dynamically fetched list
        setSelectedRegion={setSelectedRegion}
      />
      <StatsCards selectedRegion={selectedRegion} />
      <ChartsDashboard selectedRegion={selectedRegion} />
      <SpeciesSpotlight selectedRegion={selectedRegion} />
      <Footer />
    </>
  );
}