// src/components/Population_comp/StatsCards.jsx
import { useState, useEffect } from "react"; // 👈 Import hooks
const API_URL=import.meta.env.VITE_BACKEND_URL;

const defaultStatsMap = { // Default for safe initial rendering
    "All India": [{ title: "Loading...", icon: "⏳", value: "...", sub: "Fetching Data" }]
};

export default function StatsCards({ selectedRegion }) {
  const [statsMap, setStatsMap] = useState(defaultStatsMap); // 👈 State for stats data
  const [isLoading, setIsLoading] = useState(true);

  // 👈 Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/population-data`);
        const data = await response.json();
        setStatsMap(data.statsMap); // Use the 'statsMap' key from the API response
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stats data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Run only once on mount

  const stats = statsMap[selectedRegion] || statsMap["All India"];

  if (isLoading) {
    // Render a simple loading state or a skeleton for better UX
    return (
        <section className="py-10 px-6 bg-gradient-to-b from-white to-green-50 flex justify-center">
            <p className="text-gray-500">Loading statistics cards...</p>
        </section>
    );
  }

  return (
    <section className="py-10 px-6 bg-gradient-to-b from-white to-green-50 flex justify-center">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
        {stats.map((item, i) => (
          <div
            key={i}
            className="relative bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="absolute -top-6 left-6 bg-green-100 text-3xl p-3 rounded-full border border-green-200">
              {item.icon}
            </div>
            <h3 className="font-bold text-lg text-gray-800 mt-6">{item.title}</h3>
            <p className="text-4xl font-extrabold text-green-700 mt-2">{item.value}</p>
            <p className="text-sm text-gray-500 mt-2">{item.sub}</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-b-2xl"></div>
          </div>
        ))}
      </div>
    </section>
  );
}