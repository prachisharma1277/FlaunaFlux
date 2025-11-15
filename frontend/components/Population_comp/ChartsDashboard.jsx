import { useState, useEffect } from "react"; // 👈 Import hooks
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
const API_URL=import.meta.env.VITE_BACKEND_URL;
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Define default structure for safe initial rendering
const defaultParkData = {
    "All India": {
        trend: [0, 0, 0, 0, 0, 0],
        info: "Loading data...",
        keySpecies: "...",
        challenges: "...",
        state: "...",
        type: "...",
    }
};

export default function ChartsDashboard({ selectedRegion }) {
  const [parkData, setParkData] = useState(defaultParkData); // 👈 State for park data
  const [isLoading, setIsLoading] = useState(true);

  // 👈 Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/population-data`);
        const data = await response.json();
        setParkData(data.parkData); // Use the 'parkData' key from the API response
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Run only once on mount

  // Use the fetched data or the default structure while loading/error
  const data = parkData[selectedRegion] || parkData["All India"];

  const chartData = {
    labels: ["2000", "2005", "2010", "2015", "2020", "2025"],
    datasets: [
      {
        label: `${selectedRegion} Population Index`,
        data: data.trend,
        borderColor: "#166534",
        backgroundColor: "rgba(22, 101, 52, 0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { backgroundColor: "#166534", titleColor: "#fff", bodyColor: "#fff" },
    },
    scales: {
      x: { ticks: { color: "#374151" }, grid: { display: false } },
      y: { ticks: { color: "#374151" }, grid: { color: "rgba(209,250,229,0.3)" } },
    },
  };

  if (isLoading) {
    return (
        <section className="px-8 py-16 text-center text-gray-500">
            <p>Loading population trends...</p>
        </section>
    );
  }

  return (
    <section className="px-8 py-16 bg-gradient-to-br from-green-50 to-gray-50 rounded-xl">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Info Section */}
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            {selectedRegion}
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{data.info}</p>
          <ul className="text-gray-700 space-y-2">
            <li>📍 <b>Location:</b> {data.state}</li>
            <li>🏞️ <b>Type:</b> {data.type}</li>
            <li>🦋 <b>Key Species:</b> {data.keySpecies}</li>
            <li>⚠️ <b>Challenges:</b> {data.challenges}</li>
          </ul>
        </div>

        {/* Chart Section */}
        <div className="bg-white shadow-md p-6 rounded-xl border border-green-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Population Trend (2000–2025)
          </h3>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </section>
  );
}