import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
import { Line, Bar } from "react-chartjs-2";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Header/Header";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function ClimateImpactPage() {
  const [species, setSpecies] = useState("Tiger");
  const [yearRange, setYearRange] = useState("2000–2025");
  const [region, setRegion] = useState("All India");

  // 🌍 Region-specific datasets
  const regionData = {
    "All India": {
      kpis: { habitatLossPct: 12.4, avgTempRiseC: 1.7, vulnerableSpecies: 63 },
      popData: [120, 105, 98, 92, 100, 115],
      tempData: [24.2, 24.3, 24.6, 24.9, 25.1, 25.4],
      highlights: [
        "Nationwide population trends show recovery post-2020 in protected zones.",
        "Average temperature rise of 1.7°C linked to species range shifts.",
        "North India and coastal belts show the steepest habitat decline.",
        "Rainfall irregularities reduce breeding cycles for elephants and tigers.",
      ],
      habitatBars: {
        labels: ["Western Ghats", "Sundarbans", "Central India", "NE Hills", "Coastal Plains"],
        values: [78, 65, 72, 58, 45],
      },
      articles: [
        {
          title: "National Overview: Wildlife & Warming Trends",
          content:
            "India’s diverse ecosystems show uneven impacts. While tiger reserves record mild recovery, semi-arid zones experience severe vegetation stress. Large mammals shift northward seeking cooler microclimates.",
          img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
        },
        {
          title: "Changing Rainfall Patterns",
          content:
            "Altered monsoon cycles cause food shortages in grasslands, affecting deer and herbivore populations — leading to cascading predator declines.",
          img: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1200&q=60",
        },
      ],
    },

    "Jim Corbett National Park": {
      kpis: { habitatLossPct: 6.2, avgTempRiseC: 1.1, vulnerableSpecies: 18 },
      popData: [140, 132, 128, 120, 125, 135],
      tempData: [22.3, 22.4, 22.6, 22.8, 23.0, 23.4],
      highlights: [
        "Steady tiger growth despite moderate warming trends.",
        "Forest restoration increased canopy by 3.5% since 2018.",
        "Elephant migration now peaks two weeks earlier than 2010.",
        "Conflict incidents dropped 9% through eco-corridor planning.",
      ],
      habitatBars: {
        labels: ["Grasslands", "Sal Forests", "River Belts", "Hill Slopes"],
        values: [55, 42, 38, 30],
      },
      articles: [
        {
          title: "Forest Canopy Recovery in Corbett",
          content:
            "Reforestation and anti-encroachment drives rejuvenated the Ramganga corridor, aiding tiger and elephant movement.",
          img: "https://images.unsplash.com/photo-1522204502061-76fcbb213c5b?auto=format&fit=crop&w=1200&q=60",
        },
        {
          title: "Cooling Trends in Foothills",
          content:
            "Shade and canopy recovery helped stabilize microclimate conditions, reducing soil temperature extremes.",
          img: "https://images.unsplash.com/photo-1533681704110-61b8b2f11e97?auto=format&fit=crop&w=1200&q=60",
        },
      ],
    },

    "Kaziranga National Park": {
      kpis: { habitatLossPct: 9.1, avgTempRiseC: 1.4, vulnerableSpecies: 27 },
      popData: [130, 118, 110, 105, 112, 125],
      tempData: [23.8, 23.9, 24.2, 24.6, 25.0, 25.3],
      highlights: [
        "Rhino population up 200+ since 2018.",
        "Flood mitigation mounds save ~35% more animals annually.",
        "Grassland species adapting to warmer floodplain cycles.",
        "Poaching incidents fell sharply after drone surveillance.",
      ],
      habitatBars: {
        labels: ["Grasslands", "Swamp Forest", "Wetlands", "Hill Fringes"],
        values: [68, 60, 72, 55],
      },
      articles: [
        {
          title: "Floodplain Ecology and Rhino Resilience",
          content:
            "Seasonal flooding reshapes vegetation patterns. Elevated zones provide critical refuge improving calf survival.",
          img: "https://images.unsplash.com/photo-1516569422535-d2784dcf40f7?auto=format&fit=crop&w=1200&q=60",
        },
        {
          title: "Community Conservation Success",
          content:
            "Villagers near Kaziranga play key roles in alerting authorities to poaching threats and rescuing stranded animals.",
          img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=60",
        },
      ],
    },

    "Gir National Park": {
      kpis: { habitatLossPct: 5.3, avgTempRiseC: 1.0, vulnerableSpecies: 12 },
      popData: [160, 152, 150, 145, 150, 158],
      tempData: [24.1, 24.2, 24.3, 24.6, 24.8, 25.0],
      highlights: [
        "Asiatic lions adapted to drier microclimates.",
        "Grasslands show 6.8% vegetation improvement.",
        "Regular vaccination controls disease outbreaks.",
        "Solar fencing reduces livestock predation near villages.",
      ],
      habitatBars: {
        labels: ["Dry Forest", "Grassland", "Water Sources", "Scrubland"],
        values: [45, 38, 25, 32],
      },
      articles: [
        {
          title: "Lions Thrive Amidst Heat Adaptations",
          content:
            "Behavioral studies reveal nocturnal shifts and denning in shaded ravines to cope with rising heat.",
          img: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=1200&q=60",
        },
        {
          title: "Human–Lion Coexistence Program",
          content:
            "Compensation and awareness drives drastically reduced retaliatory killings near Gir’s buffer villages.",
          img: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=60",
        },
      ],
    },

    "Sundarbans National Park": {
      kpis: { habitatLossPct: 14.2, avgTempRiseC: 1.9, vulnerableSpecies: 34 },
      popData: [110, 100, 95, 88, 93, 98],
      tempData: [25.2, 25.4, 25.6, 25.9, 26.2, 26.5],
      highlights: [
        "Rising sea levels threaten mangrove tiger habitats.",
        "Crocodile and deer populations remain stable.",
        "Community-led mangrove restoration enhances resilience.",
        "Salinity increase pushes species inland by ~10 km.",
      ],
      habitatBars: {
        labels: ["Mangrove Core", "Riverine Islands", "Coastal Edge", "Buffer Zone"],
        values: [85, 74, 90, 60],
      },
      articles: [
        {
          title: "Mangrove Guardians of the Delta",
          content:
            "Grass-root replantation programs restore degraded areas — creating carbon sinks and wildlife refuge zones.",
          img: "https://images.unsplash.com/photo-1605719122112-9fd3f3a906f0?auto=format&fit=crop&w=1200&q=60",
        },
        {
          title: "Climate-Driven Salinity Shift",
          content:
            "Rising sea levels and tidal surges push saline waters inland, forcing tiger prey species to migrate upland.",
          img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=60",
        },
      ],
    },
  };

  // 🧠 Extract region-specific data safely
  const current = regionData[region] || regionData["All India"];

  // CHARTS
  const timelineLabels = [2000, 2005, 2010, 2015, 2020, 2025];
  const climateLineData = useMemo(
    () => ({
      labels: timelineLabels,
      datasets: [
        {
          label: `${species} Population Index`,
          data: current.popData,
          borderColor: "#166534",
          backgroundColor: "rgba(22,101,52,0.12)",
          tension: 0.25,
          fill: true,
        },
        {
          label: "Avg Annual Temperature (°C)",
          data: current.tempData,
          borderColor: "#0d9488",
          backgroundColor: "rgba(13,148,136,0.08)",
          tension: 0.25,
          yAxisID: "temp",
        },
      ],
    }),
    [species, current]
  );

  const lineOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    scales: {
      y: { title: { display: true, text: "Population Index" } },
      temp: {
        position: "right",
        grid: { display: false },
        ticks: { callback: (v) => `${v}°` },
        title: { display: true, text: "Temperature (°C)" },
      },
      x: { grid: { display: false } },
    },
    plugins: { legend: { position: "bottom" } },
  };

  const habitatBarData = useMemo(
    () => ({
      labels: current.habitatBars.labels,
      datasets: [
        {
          label: "Habitat Risk (0–100)",
          data: current.habitatBars.values,
          backgroundColor: ["#84cc16", "#f59e0b", "#ea580c", "#ef4444", "#10b981"],
        },
      ],
    }),
    [current]
  );

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 }, x: { grid: { display: false } } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7fff4] to-white text-gray-900">
      {/* HERO */}
      <Navbar/>
      <div
        className="relative bg-cover bg-center h-80 flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60')",
        }}
      >
        <div className="absolute inset-0 bg-green-900/50"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">
            Climate Impact on Wildlife
          </h1>
          <p className="text-green-100 mt-2 max-w-2xl text-sm md:text-base">
            Explore how changing temperatures and rainfall influence migration, habitats, and behavior.
          </p>
        </div>
      </div>

      {/* FILTER + KPI */}
        <div className="max-w-6xl mx-auto px-6 py-10 -mt-14 relative z-20">
        <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-lg">

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-6 mb-6">

            {/* Species */}
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">Species</label>
                <select
                className="border rounded-lg p-2 w-60 bg-white focus:ring-2 focus:ring-green-600"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                >
                <option>Tiger</option>
                <option>Elephant</option>
                <option>Olive Ridley Turtle</option>
                <option>Peacock</option>
                </select>
            </div>

            {/* Year Range */}
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">Year Range</label>
                <select
                className="border rounded-lg p-2 w-60 bg-white focus:ring-2 focus:ring-green-600"
                value={yearRange}
                onChange={(e) => setYearRange(e.target.value)}
                >
                <option>2000–2025</option>
                <option>2010–2025</option>
                <option>2015–2025</option>
                </select>
            </div>

            {/* Region */}
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">Region</label>
                <select
                className="border rounded-lg p-2 w-100 bg-white focus:ring-2 focus:ring-green-600"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                >
                <option>All India</option>
                <option>Jim Corbett National Park</option>
                <option>Kaziranga National Park</option>
                <option>Gir National Park</option>
                <option>Sundarbans National Park</option>
                </select>
            </div>

            </div>

            {/* KPI CARDS — ⭐ Bigger, cleaner design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[
                { label: "Habitat Loss", value: `${current.kpis.habitatLossPct}%` },
                { label: "Temperature Rise", value: `${current.kpis.avgTempRiseC}°C` },
                { label: "Vulnerable Species", value: current.kpis.vulnerableSpecies },
            ].map((k, i) => (
                <div
                key={i}
                className="bg-green-50 border border-green-200 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all"
                >
                <div className="text-sm text-gray-600 mb-1 font-medium tracking-wide">{k.label}</div>
                <div className="text-3xl font-bold text-green-800 mt-1">{k.value}</div>
                </div>
            ))}
            </div>
        </div>
        </div>


      {/* CHARTS + INSIGHTS */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[2fr_1fr] gap-6">
        <motion.div className="bg-white rounded-xl p-6 shadow border border-green-100">
          <h2 className="text-xl font-semibold text-green-800 mb-3">Population vs Temperature Trend</h2>
          <div style={{ height: 280 }}>
            <Line data={climateLineData} options={lineOptions} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm flex flex-col justify-center"
        >
          <h3 className="text-lg font-semibold text-green-800 mb-2">Highlights</h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            {current.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* BEHAVIOR & HABITAT */}
      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 py-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow border border-green-100">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Behavioral & Seasonal Shifts</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Increased nocturnal activity",
              "Migration shifts earlier each year",
              "Shorter breeding windows",
              "Altitude-based habitat moves",
              "Morning feeding adaptation",
              "Rising human–wildlife conflicts",
            ].map((txt, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-green-50 border border-green-100 p-4 rounded-lg shadow-sm"
              >
                <p className="text-sm text-gray-700">{txt}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl p-6 shadow border border-green-100"
        >
          <h3 className="text-lg font-semibold text-green-800 mb-3">Habitat Risk Overview</h3>
          <div style={{ height: 200 }}>
            <Bar data={habitatBarData} options={barOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Habitat risk is calculated from forest cover decline, temperature anomaly, and human disturbance indices.
          </p>
        </motion.div>
      </div>

      {/* ARTICLES */}
      <section className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Impact of Climate Change on Migration & Habitat
        </h2>
        {current.articles.map((a, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.01 }}
            className={`bg-white border border-green-100 rounded-xl overflow-hidden shadow flex flex-col md:flex-row ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <img
              src={a.img}
              alt={a.title}
              className="w-full md:w-1/2 object-cover h-48 md:h-56"
            />
            <div className="p-5 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">{a.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{a.content}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <p className="text-center text-xs text-gray-500 mt-10 pb-6">
        Data shown is illustrative and derived from regional conservation trends.
      </p>
      <Footer/>
    </div>
  );
}
