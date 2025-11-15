import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps";
import { scaleLinear } from "d3-scale";
import { Line, Bar } from "react-chartjs-2";
import VPop1 from "../../../assets/images/VPop1.png";
import VPop2 from '../../../assets/images/VPop2.png';
import VPop3 from '../../../assets/images/VPop3.png';
import VPop4 from '../../../assets/images/VPop4.png';
import VPop5 from '../../../assets/images/VPop5.png';
import VPop6 from '../../../assets/images/VPop6.png';
import VPop7 from '../../../assets/images/VPop7.png';
import VPop8 from '../../../assets/images/VPop8.png';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const INDIA_TOPO_URL =
  "https://raw.githubusercontent.com/datameet/maps/master/TopoJSON/india_states.topojson";

const biodiversityIndex = {
  Kerala: 95,
  Maharashtra: 78,
  Rajasthan: 50,
  Assam: 92,
  Gujarat: 70,
  Odisha: 82,
  "Madhya Pradesh": 85,
  TamilNadu: 88,
};

const colorScale = scaleLinear()
  .domain([40, 70, 100])
  .range(["#ef4444", "#facc15", "#16a34a"]);

export default function VerifiedPopulationResearchDashboard() {
  const [topo, setTopo] = useState(null);
  const [selectedState, setSelectedState] = useState("India");
  const [hoverState, setHoverState] = useState(null);
  const [species, setSpecies] = useState("Tiger");
  const [year, setYear] = useState("2025");
  const [region, setRegion] = useState("All");
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const [activeDataset, setActiveDataset] = useState("Mammals");

  // Auto-change Species Spotlight every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpotlight((prev) => (prev + 1) % speciesSpotlight.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 🗺️ Load India Map
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(INDIA_TOPO_URL)
        .then((res) => res.json())
        .then((data) => setTopo(data));
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleStateClick = (geo) => {
    const name =
      geo.properties?.name ||
      geo.properties?.NAME_1 ||
      geo.properties?.st_nm;
    setSelectedState(name);
  };

  // 📈 Chart Data
  const populationData = {
    labels: [2000, 2005, 2010, 2015, 2020, 2025],
    datasets: [
      {
        label: "Tiger Population",
        data: [80, 100, 130, 170, 200, 220],
        borderColor: "#15803d",
        backgroundColor: "rgba(22,163,74,0.15)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Elephant Population",
        data: [90, 110, 140, 160, 180, 190],
        borderColor: "#0d9488",
        backgroundColor: "rgba(13,148,136,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const migrationData = {
    labels: [2010, 2015, 2020, 2025],
    datasets: [
      {
        label: "Migration Activity Index",
        data: [30, 45, 55, 70],
        backgroundColor: "#16a34a",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e2e8f0" } },
    },
  };

  // 🧮 Multiple Dataset Cards
  const DATASETS = [
    {
      title: "Mammals Dataset",
      description: "Includes data from 2020–2025, validated through national surveys.",
      data: [
        { species: "Bengal Tiger", region: "Assam", population: 820, growth: "+6%" },
        { species: "Indian Elephant", region: "Odisha", population: 4700, growth: "+3%" },
      ],
    },
    {
      title: "Birds Dataset",
      description: "Compiled from ornithological tracking in migration corridors.",
      data: [
        { species: "Peacock", region: "Rajasthan", population: 21000, growth: "+2%" },
        { species: "Sarus Crane", region: "Bihar", population: 1200, growth: "-1%" },
      ],
    },
    {
      title: "Marine Dataset",
      description: "Data from coastal marine conservation projects, 2020 onwards.",
      data: [
        { species: "Olive Ridley Turtle", region: "Tamil Nadu", population: 95000, growth: "+5%" },
        { species: "Dugong", region: "Kerala", population: 850, growth: "-2%" },
      ],
    },
  ];

  const downloadCSV = (dataset) => {
    const csv =
      "Species,Region,Population,Growth\n" +
      dataset.map((d) => `${d.species},${d.region},${d.population},${d.growth}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "FaunaFlux_Dataset.csv";
    link.click();
  };

  const researchHighlights = [
    {
      title: "Climate Impact on Himalayan Species",
      author: "Dr. Meera Singh",
      year: 2025,
      img: {VPop1},
      summary:
        "Temperature rise has reduced cold-adapted mammal distribution by 14% in northern zones.",
    },
    {
      title: "Coastal Hatchery Effectiveness",
      author: "Dr. Arjun Roy",
      year: 2024,
      img: {VPop2},
      summary:
        "Community hatcheries improved turtle hatching success by 12% across Tamil Nadu coastlines.",
    },
    {
      title: "Urban Biodiversity Decline",
      author: "Dr. Sneha Rao",
      year: 2023,
      img: {VPop3},
      summary:
        "Urbanization and noise levels correlate with a 30% reduction in common bird species presence.",
    },
    {
      title: "Forest Corridors & Mammal Movement",
      author: "Prof. K. Sengupta",
      year: 2022,
      img: {VPop4},
      summary:
        "Corridor development increased elephant movement by 8% and reduced human-wildlife conflict.",
    },
    {
      title: "Desert Wildlife Resilience",
      author: "Dr. Rhea Kapoor",
      year: 2021,
      img: {VPop5},
      summary:
        "Desert species have evolved adaptive behavior during extreme temperature cycles.",
    },
  ];

  const speciesSpotlight = [
    {
      img: {VPop6},
      name: "Bengal Tiger",
      status: "Endangered",
      region: "Asia",
      description:
        "Population has stabilized due to strong conservation and anti-poaching efforts.",
    },
    {
      img: {VPop7},
      name: "Indian Rhino",
      status: "Vulnerable",
      region: "Assam",
      description:
        "Habitat restoration projects have improved grassland cover and population density.",
    },
    {
      img: {VPop8},
      name: "Asiatic Elephant",
      status: "Vulnerable",
      region: "South India",
      description:
        "Population growth continues with protected corridors and transboundary conservation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf2] via-white to-green-50 text-gray-800">
{/* 🌿 Filters + Map Layout */}
<div className="max-w-7xl mx-auto my-10 px-4 grid lg:grid-cols-[300px_1fr] gap-8">

  {/* 🧭 Sidebar Filters */}
  <aside className="bg-white rounded-xl shadow-md border border-green-100 p-5 h-fit sticky top-24">
    <h3 className="text-xl font-semibold text-green-800 mb-4">
      Filters & Insights
    </h3>

    <div className="space-y-5">
      {/* Species */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
        <select
          className="w-full border border-green-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        >
          <option>Tiger</option>
          <option>Elephant</option>
          <option>Rhino</option>
          <option>Leopard</option>
          <option>Peacock</option>
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
        <select
          className="w-full border border-green-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-green-600"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option>2025</option>
          <option>2020</option>
          <option>2015</option>
        </select>
      </div>

      {/* Region */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
        <select
          className="w-full border border-green-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-green-600"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option>All</option>
          <option>South India</option>
          <option>Central India</option>
          <option>North East</option>
          <option>Western Ghats</option>
        </select>
      </div>

      {/* Conservation Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conservation Status</label>
        <select className="w-full border border-green-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-green-600">
          <option>All</option>
          <option>Endangered</option>
          <option>Vulnerable</option>
          <option>Stable</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        className="w-full bg-green-700 text-white rounded-md hover:bg-green-800 transition p-2.5 font-medium shadow-md"
      >
        Apply Filters
      </button>
    </div>

    {/* Info Note */}
    <div className="mt-6 p-3 bg-green-50 border border-green-100 rounded-md text-sm text-gray-600">
      💡 Click on any state to view biodiversity data and population trends.
    </div>
  </aside>

  {/* 🗺️ Map + Chart Section */}
  <div className="space-y-8">
    
    {/* Interactive Map */}
    <motion.div
      className="bg-white rounded-xl p-5 shadow border border-green-100"
      whileHover={{ scale: 1.01 }}
    >
      <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center justify-between">
        Biodiversity Distribution Map
        {selectedState !== "India" && (
          <span className="text-sm text-gray-500">
            Selected:{" "}
            <span className="font-medium text-green-700">{selectedState}</span>
          </span>
        )}
      </h2>

      {topo ? (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1000, center: [80, 22] }}
          style={{ width: "100%", height: "480px" }} // 🗺️ increased map height
        >
          <Geographies geography={topo}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name =
                  geo.properties.name ||
                  geo.properties.NAME_1 ||
                  geo.properties.st_nm;
                const val = biodiversityIndex[name] ?? 60;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={colorScale(val)}
                    stroke="#fff"
                    strokeWidth={0.6}
                    onClick={() => handleStateClick(geo)}
                    onMouseEnter={() => setHoverState(name)}
                    onMouseLeave={() => setHoverState(null)}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#15803d", cursor: "pointer" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      ) : (
        <div className="text-center py-16 text-gray-500 animate-pulse">
          Loading interactive map...
        </div>
      )}

      {hoverState && (
        <p className="text-sm text-gray-600 mt-3 text-center">
          {hoverState}: Biodiversity Index{" "}
          {biodiversityIndex[hoverState] ?? "N/A"}
        </p>
      )}
    </motion.div>

    {/* 📊 Chart Section */}
    <div className="bg-white rounded-xl p-5 shadow border border-green-100">
      <h2 className="font-semibold text-green-800 mb-3">
        Population Trends (2000–2025)
      </h2>
      <div style={{ height: "220px" }}> {/* 🔽 Reduced chart height */}
        <Line data={populationData} options={chartOptions} />
      </div>
      <p className="text-xs mt-3 text-gray-600">
        📈 Verified population growth for tigers and elephants (2000–2025) showing
        steady increase due to successful conservation initiatives.
      </p>
    </div>
  </div>
</div>
{/* 🌿 Verified Dataset Analytics Section */}
<div className="max-w-7xl mx-auto my-20 px-6">
  {/* Section Heading */}
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-green-800 drop-shadow-sm">
      Wildlife Dataset Analytics Dashboard 📊
    </h2>
    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
      Explore verified biodiversity datasets, population trends, and regional conservation insights.
    </p>
  </div>

  {/* Dataset Filter */}
  <div className="flex justify-center flex-wrap gap-4 mb-10">
    {["Mammals", "Birds", "Marine"].map((category) => (
      <motion.button
        key={category}
        onClick={() => setActiveDataset(category)}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-2.5 rounded-lg font-semibold border text-sm transition-all ${
          activeDataset === category
            ? "bg-green-700 text-white border-green-700 shadow-md"
            : "bg-white text-green-800 border-green-300 hover:bg-green-50"
        }`}
      >
        {category}
      </motion.button>
    ))}
  </div>

  {/* Three Column Layout */}
  <div className="grid lg:grid-cols-3 gap-10">
    {/* 🧾 Dataset Table */}
    <motion.div
      className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 transition-all hover:shadow-2xl overflow-hidden"
      whileHover={{ scale: 1.01 }}
    >
      <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
        📘 {activeDataset} Dataset Overview
      </h3>

      {/* ✅ Table Section */}
      <div className="overflow-y-auto max-h-72 rounded-lg border border-green-200 shadow-inner bg-gradient-to-b from-white to-green-50">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-green-700 text-white sticky top-0">
            <tr>
              <th className="p-3 text-left border-b border-green-600">Species</th>
              <th className="p-3 text-left border-b border-green-600">Region</th>
              <th className="p-3 text-left border-b border-green-600">Population</th>
              <th className="p-3 text-left border-b border-green-600">Growth</th>
            </tr>
          </thead>
          <tbody>
            {(
              DATASETS.find(
                (d) =>
                  d.title.toLowerCase().includes(activeDataset.toLowerCase())
              )?.data || []
            ).map((row, i) => (
              <tr
                key={i}
                className={`border-b border-green-100 ${
                  i % 2 === 0 ? "bg-white" : "bg-green-50"
                } hover:bg-green-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{row.species}</td>
                <td className="p-3 text-gray-600">{row.region}</td>
                <td className="p-3 text-green-700 font-semibold">
                  {row.population.toLocaleString()}
                </td>
                <td className="p-3 text-gray-700">{row.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 👇 If dataset is empty */}
        {(
          DATASETS.find(
            (d) =>
              d.title.toLowerCase().includes(activeDataset.toLowerCase())
          )?.data || []
        ).length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No data available for this category.
          </div>
        )}
      </div>
    </motion.div>

    {/* 📈 Graph Section */}
    <motion.div
      className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 flex flex-col justify-center hover:shadow-2xl"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
        📊 {activeDataset} Growth Trends
      </h3>
      <div style={{ height: "240px" }}>
        <Line
          data={{
            labels: ["2010", "2015", "2020", "2025"],
            datasets: [
              {
                label: `${activeDataset} Population`,
                data:
                  activeDataset === "Mammals"
                    ? [450, 600, 800, 950]
                    : activeDataset === "Birds"
                    ? [2000, 2200, 2600, 2900]
                    : [500, 650, 800, 1200],
                borderColor: "#15803d",
                backgroundColor: "rgba(21,128,61,0.2)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#166534",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: {
              x: { grid: { display: false }, ticks: { color: "#374151" } },
              y: { grid: { color: "rgba(16,185,129,0.08)" }, ticks: { color: "#374151" } },
            },
          }}
        />
      </div>
      <p className="text-xs mt-4 text-gray-600 text-center">
        🌿 Population index derived from verified wildlife census reports (2010–2025).
      </p>
    </motion.div>

    {/* 🧠 Info + Download Section */}
    <motion.div
      className="bg-gradient-to-b from-green-50 to-emerald-50 rounded-2xl shadow-xl border border-green-100 p-6 flex flex-col justify-between hover:shadow-2xl"
      whileHover={{ scale: 1.02 }}
    >
      <div>
        <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
          🧠 About {activeDataset}
        </h4>
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          The <strong>{activeDataset}</strong> dataset contains species population,
          growth, and conservation statistics verified through India’s National Biodiversity Census.
        </p>

        <div className="border-l-4 border-green-600 bg-green-100/50 p-3 rounded-md text-sm text-gray-700 mb-4">
          <strong>Key Insights:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Includes 2020–2025 verified species data.</li>
            <li>Population growth rate analyzed regionally.</li>
            <li>Verified by Project FaunaFlux research division.</li>
          </ul>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={() =>
          downloadCSV(
            DATASETS.find(
              (d) =>
                d.title.toLowerCase().includes(activeDataset.toLowerCase())
            )?.data || []
          )
        }
        className="mt-6 w-full bg-green-700 text-white py-2.5 rounded-md hover:bg-green-800 text-sm font-medium flex items-center justify-center gap-2 transition shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
          />
        </svg>
        Download {activeDataset} Dataset
      </button>
    </motion.div>
  </div>

  {/* Footer Note */}
  <p className="text-sm mt-10 text-gray-600 text-center max-w-3xl mx-auto">
    🧾 Data validated by the Indian Biodiversity Monitoring Program (IBMP) and regional ecology reports.
  </p>

</div>


      {/* Research Highlights */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl p-6 shadow mb-10">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          Research Highlights 📚
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {researchHighlights.map((r, i) => (
            <div key={i} className="min-w-[280px] bg-green-50 border border-green-100 rounded-lg p-4">
              <img src={r.img} alt={r.title} className="w-full h-32 object-cover rounded-md mb-2" />
              <h3 className="font-semibold text-green-800">{r.title}</h3>
              <p className="text-sm text-gray-600">{r.author} • {r.year}</p>
              <p className="text-sm mt-2 text-gray-700">{r.summary}</p>
              <button className="text-green-700 text-sm mt-2 hover:underline">
                View Full Study →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Species Spotlight */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-2xl font-semibold text-green-800 mb-6">
          Species Spotlight 🐾
        </h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSpotlight}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <div className="w-2/3 pr-6">
              <h3 className="text-xl font-semibold text-green-800">{speciesSpotlight[activeSpotlight].name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {speciesSpotlight[activeSpotlight].status} • {speciesSpotlight[activeSpotlight].region}
              </p>
              <p className="text-gray-700">
                {speciesSpotlight[activeSpotlight].description}
              </p>
            </div>
            <img
              src={speciesSpotlight[activeSpotlight].img}
              alt={speciesSpotlight[activeSpotlight].name}
              className="w-48 h-48 rounded-xl object-cover shadow-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
