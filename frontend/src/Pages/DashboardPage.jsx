// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import Navbar from "../components/Header/Header";
import DashboardMap from "../components/DashboardMap";
import AlertsFeed from "../components/AlertsFeed";
import image from "../assets/images/Vid3.png";
// import Footer from "../components/Footer/Footer"; // optional if you have Footer

// local mini Sparkline copied from FileB (keeps UI parity)
function Sparkline({ data, stroke = "#0f9d58", height = 36, width = 120 }) {
  if (!data) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pad = 6;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * innerW;
      const y = pad + innerH - ((v - min) / (max - min || 1)) * innerH;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="block">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardPage() {
  // small UI state to match FileB layout
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [live, setLive] = useState(true);

  // widgets (kept simple; real values come from your backend if needed)
  const widgets = {
    sightings: 12,
    rangers: 42,
    sensors: 28,
    investigations: 3,
  };

  const sampleSparks = {
    sightings: [2, 3, 4, 5, 4, 6, 7],
    rangers: [30, 31, 35, 36, 38],
    sensors: [22, 23, 25, 27, 28],
    investigations: [1, 2, 3, 2],
  };

  return (
    <main className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg,#f0fff4 0%, #ffffff 65%)" }}>
      <Navbar />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        {/* HERO */}
        <section
          className="mb-10 relative rounded-2xl shadow-lg overflow-hidden w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(6,95,70,0.35), rgba(6,95,70,0.12)), url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            marginTop: "-0.5rem",
          }}
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
              Wildlife Protection Dashboard
            </h1>
            <p className="mt-4 text-white/95 max-w-2xl font-medium leading-relaxed">
              Real-time monitoring of wildlife patterns, AI-detected risks,
              ranger activity, and automated incident logs — all in one place.
            </p>

            <div className="mt-8 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["Regions Monitored", 12],
                ["Daily Alerts", "58+"],
                ["Active Sensors", 428],
                ["Tracked Species", 27],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow-sm text-center card-lift"
                >
                  <p className="text-xs text-white/90">{label}</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MAP + ALERTS */}
        <section className="bg-white rounded-2xl border border-green-100 shadow-lg p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-800">LIVE THREAT FEED</h3>
                <p className="text-sm text-gray-600">AI heatmap + ranger signals</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm bg-white"
                >
                  <option value="1h">1h</option>
                  <option value="6h">6h</option>
                  <option value="12h">12h</option>
                  <option value="24h">24h</option>
                </select>

                <button
                  onClick={() => setLive((s) => !s)}
                  className={`px-3 py-1 rounded-md text-sm ${live ? "bg-green-700 text-white" : "bg-white text-green-700 border"}`}
                  title={live ? "Pause live updates" : "Resume live updates"}
                >
                  {live ? "Live" : "Resume"}
                </button>

                <button className="px-3 py-1 bg-white border rounded-md text-sm hover:shadow" title="Export alerts as CSV">
                  Export
                </button>
              </div>
            </div>

            {/* MAP BOX */}
            <div className="relative rounded-lg overflow-hidden border border-green-100 bg-cover" style={{ minHeight: 350 }}>
              {/* Use your DashboardMap component here — it renders a live Leaflet map */}
              <DashboardMap style={{ minHeight: 350 }} />
              <div className="absolute left-4 bottom-4 bg-white/95 px-3 py-2 rounded shadow text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full" /> AI Threat Zone
              </div>
            </div>

            {/* WIDGETS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["New Sightings (24h)", widgets.sightings, sampleSparks.sightings],
                ["Active Rangers", widgets.rangers, sampleSparks.rangers],
                ["Sensors Online", widgets.sensors, sampleSparks.sensors],
                ["Investigations", widgets.investigations, sampleSparks.investigations],
              ].map(([label, val, spark], i) => (
                <div key={i} className="p-4 bg-white rounded-md border shadow-sm card-lift">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-green-800">{val}</p>
                  <div className="mt-2"><Sparkline data={spark} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTS (right column) */}
          <aside className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-green-800">REAL-TIME ALERTS</h4>
              {/* AlertsFeed internally shows N items; keep a placeholder count */}
              <span className="text-xs text-gray-500">live</span>
            </div>

            {/* AlertsFeed component renders the feed itself */}
            <div className="space-y-3">
              <AlertsFeed compact />
            </div>

            <div className="mt-auto bg-white border rounded-md p-3 shadow">
              <div className="text-xs text-gray-500">Summary</div>
              <div className="text-sm font-semibold text-gray-700 mt-1">
                live • <span className="text-red-600">high</span> • <span className="text-amber-600">amber</span>
              </div>
            </div>
          </aside>
        </section>

        {/* INCIDENT TABLE */}
        <section className="mt-12 bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-green-800">Recent Incident Logs</h3>
          <p className="text-sm text-gray-600 mt-1">Automatically recorded incidents from sightings, AI alerts, and ranger reports.</p>

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Species</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {/* keep placeholder rows (your backend can populate these later) */}
                <tr className="border-b even:bg-white/50">
                  <td className="p-3">101</td>
                  <td className="p-3">Animal Sighting</td>
                  <td className="p-3 text-green-700 font-medium">Bengal Tiger</td>
                  <td className="p-3">Corbett NP</td>
                  <td className="p-3">2025-11-14 09:12</td>
                </tr>
                <tr className="border-b even:bg-white/50">
                  <td className="p-3">102</td>
                  <td className="p-3">Vehicle Strike</td>
                  <td className="p-3 text-green-700 font-medium">Elephant</td>
                  <td className="p-3">Kaziranga</td>
                  <td className="p-3">2025-11-14 07:45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SPECIES SPOTLIGHT (keeps design from File B) */}
        <section className="w-full bg-white py-8 mt-14 shadow-inner rounded-xl">
          <h2 className="text-center text-2xl font-bold text-green-800">Species Spotlight</h2>
          <p className="text-center text-gray-600 text-sm mt-1 mb-6 max-w-3xl mx-auto">
            Key species activity updates — important for monitoring and protection.
          </p>

          <div className="relative overflow-hidden w-full">
            <div className="flex gap-6 whitespace-nowrap px-4">
              {[
                { name: "Bengal Tiger", img: "https://placehold.co/200x120/F0FFF4/0f8a44?text=Tiger", status: "High activity" },
                { name: "Indian Elephant", img: "https://placehold.co/200x120/E9FFF7/0f8a44?text=Elephant", status: "Village-side movement" },
                { name: "One-horned Rhino", img: "https://placehold.co/200x120/EFFFF5/0f8a44?text=Rhino", status: "Stable & monitored" },
              ].map((s, i) => (
                <div key={i} className="min-w-[220px] bg-green-50 border border-green-200 rounded-xl shadow-sm overflow-hidden card-lift" style={{ display: "inline-block" }}>
                  <img src={s.img} alt={s.name} className="w-full h-24 object-cover" />
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-green-900">{s.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{s.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* <Footer /> */}
    </main>
  );
}