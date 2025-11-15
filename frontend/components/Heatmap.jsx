import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Heatmap.css'; // Your CSS file
import TrendChart from './TrendChart'; // Your Chart component

// --- (Leaflet Icon Fix) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- IMPORTANT: API Key ---
const OPENWEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// --- Chart Labels ---
const chartLabels = ['2019', '2020', '2021', '2022', '2023', '2024'];

// --- Chart.js Options for NEW light theme ---
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Hide legend
    },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#223322',
      bodyColor: '#556655',
      borderColor: '#cce0cc',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#556655', // Dark text for X-axis
      },
      grid: {
        color: 'rgba(204, 224, 204, 0.5)', // Faint grid lines
        borderColor: '#556655',
      },
    },
    y: {
      ticks: {
        color: '#556655', // Dark text for Y-axis
      },
      grid: {
        color: 'rgba(204, 224, 204, 0.5)', // Faint grid lines
        borderColor: '#556655',
      },
    },
  },
  elements: {
    line: {
      tension: 0.4, // Makes lines curved and smooth
    },
    point: {
      radius: 0, // Hides points on the line
    },
  },
};

// --- Region Data (Unchanged) ---
const regionsData = {
  delhi: {
    name: 'New Delhi',
    center: [28.6139, 77.209],
    zoom: 10,
    tempData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Avg. Temp (°C)',
          data: [25.0, 25.4, 24.9, 25.7, 25.2, 26.0],
          borderColor: '#ff8c00', // Dark Orange
          backgroundColor: 'rgba(255, 140, 0, 0.2)',
          fill: true,
        },
      ],
    },
    rainData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: [760, 800, 750, 780, 810, 790],
          borderColor: '#00bfff', // Deep Sky Blue / Cyan
          backgroundColor: 'rgba(0, 191, 255, 0.2)',
          fill: true,
        },
      ],
    },
    keyInsights: [
      'Rising average temperatures can increase heat stress for urban wildlife, especially birds.',
      'Pressure on water bodies like the Yamuna impacts migratory birds and aquatic life.',
      'Air quality issues, when combined with heat, pose significant respiratory threats to all animal populations.',
    ],
  },
  mumbai: {
    name: 'Mumbai',
    center: [19.076, 72.8777],
    zoom: 10,
    tempData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Avg. Temp (°C)',
          data: [27.1, 27.4, 27.0, 27.5, 27.8, 28.0],
          borderColor: '#ff8c00',
          backgroundColor: 'rgba(255, 140, 0, 0.2)',
          fill: true,
        },
      ],
    },
    rainData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: [2400, 2500, 2300, 2450, 2550, 2480],
          borderColor: '#00bfff',
          backgroundColor: 'rgba(0, 191, 255, 0.2)',
          fill: true,
        },
      ],
    },
    keyInsights: [
      'Slightly rising rainfall is crucial for the mangrove ecosystems, a vital habitat for birds and marine life.',
      'Extreme flooding events can destroy ground-nesting sites and displace animals.',
      'Warming coastal waters may affect local fish populations, impacting the food chain for coastal birds.',
    ],
  },
  bengaluru: {
    name: 'Bengaluru',
    center: [12.9716, 77.5946],
    zoom: 11,
    tempData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Avg. Temp (°C)',
          data: [23.0, 23.5, 23.2, 23.8, 24.0, 23.7],
          borderColor: '#ff8c00',
          backgroundColor: 'rgba(255, 140, 0, 0.2)',
          fill: true,
        },
      ],
    },
    rainData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: [970, 990, 950, 1010, 1050, 1000],
          borderColor: '#00bfff',
          backgroundColor: 'rgba(0, 191, 255, 0.2)',
          fill: true,
        },
      ],
    },
    keyInsights: [
      "The city's lakes are critical habitats. The slight rise in rainfall helps, but pollution remains a threat to aquatic life.",
      'Rising temperatures can disrupt the flowering and fruiting seasons of trees, affecting birds and insects.',
      'Urban heat island effect is pronounced, pushing native fauna to cooler, shrinking green patches.',
    ],
  },
  kolkata: {
    name: 'Kolkata',
    center: [22.5726, 88.3639],
    zoom: 10,
    tempData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Avg. Temp (°C)',
          data: [26.5, 26.8, 26.3, 27.0, 27.2, 27.5],
          borderColor: '#ff8c00',
          backgroundColor: 'rgba(255, 140, 0, 0.2)',
          fill: true,
        },
      ],
    },
    rainData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: [1600, 1650, 1580, 1700, 1680, 1720],
          borderColor: '#00bfff',
          backgroundColor: 'rgba(0, 191, 255, 0.2)',
          fill: true,
        },
      ],
    },
    keyInsights: [
      'Increased rainfall is vital for the nearby Sundarbans, but also increases flood risk in the city.',
      "Rising temperatures put stress on the East Kolkata Wetlands, which act as the city's 'kidneys' and are a habitat for fish and birds.",
      'Proximity to the coast makes local fauna vulnerable to cyclones and water salinity changes.',
    ],
  },
  chennai: {
    name: 'Chennai',
    center: [13.0827, 80.2707],
    zoom: 10,
    tempData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Avg. Temp (°C)',
          data: [28.0, 28.3, 28.1, 28.5, 28.8, 29.0],
          borderColor: '#ff8c00',
          backgroundColor: 'rgba(255, 140, 0, 0.2)',
          fill: true,
        },
      ],
    },
    rainData: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: [1400, 1450, 1390, 1420, 1500, 1480],
          borderColor: '#00bfff',
          backgroundColor: 'rgba(0, 191, 255, 0.2)',
          fill: true,
        },
      ],
    },
    keyInsights: [
      'Noticeably rising temperatures increase the risk of heat stress for animals at the Guindy National Park.',
      'Stable but intense rainfall patterns (monsoons) are critical for refilling water bodies, but can also cause flash floods.',
      'Coastal erosion and water salinity changes can impact habitats for sea turtles and other coastal wildlife.',
    ],
  },
};

// --- MapController Component (Unchanged) ---
function MapController({ selectedRegion }) {
  const map = useMap(); // Hook to access the Leaflet map instance

  useEffect(() => {
    if (selectedRegion) {
      map.flyTo(selectedRegion.center, selectedRegion.zoom, {
        duration: 1.5,
      });
    }
  }, [selectedRegion, map]);

  return null;
}

// --- Main Dashboard Component ---
const Heatmap = () => {
  const indiaCenter = [22.351115, 78.667743]; // Default center
  const defaultZoom = 5; // Default zoom

  const [activeLayer, setActiveLayer] = useState('temperature');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedRegionKey, setSelectedRegionKey] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey(Date.now());
    }, 10 * 60 * 1000); // 10 minutes refresh

    return () => clearInterval(intervalId);
  }, []);

  const layerUrls = {
    precipitation: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
  };

  const openWeatherMapTileUrl = layerUrls[activeLayer];

  // Handle region selection from dropdown
  const handleRegionChange = (e) => {
    const regionKey = e.target.value;
    setSelectedRegionKey(regionKey);
    if (regionKey && regionsData[regionKey]) {
      setSelectedRegion(regionsData[regionKey]);
    } else {
      setSelectedRegion(null); // Clear selection
    }
  };

  return (
    <div className="dashboard-container">
      <div className="control-pannel">
  <h2>Regional Climate Data & Trends</h2>

  <div className="controls-section">
    {/* Group 1: Region Select */}
    <div className="region-select-group">
      <label htmlFor="region-select">Search Region</label>
      <select
        id="region-select"
        className="region-select"
        value={selectedRegionKey}
        onChange={handleRegionChange}
      >
        <option value="">-- View Full Map --</option>
        {Object.keys(regionsData).map((key) => (
          <option key={key} value={key}>
            {regionsData[key].name}
          </option>
        ))}
      </select>
    </div>

    {/* Group 2: Data Type */}
    <div className="layer-select-group">
      <label>Select Data Type</label>
      <div className="layer-buttons">
        <button
          className={activeLayer === 'temperature' ? 'active' : ''}
          onClick={() => setActiveLayer('temperature')}
        >
          Temperature
        </button>
        <button
          className={activeLayer === 'precipitation' ? 'active' : ''}
          onClick={() => setActiveLayer('precipitation')}
        >
          Rainfall
        </button>
      </div>
    </div>
  </div>
</div>
      {/* --- NEW: CONTENT COLUMN (Map + Insights) --- */}
      <div className="content-column">
        {/* --- MAP PANEL (LEFT) --- */}
        <div className="map-panel">
          <MapContainer
            className="map-container-inner" // Use class for 100% height
            center={indiaCenter}
            zoom={defaultZoom}
            scrollWheelZoom={true}
          >
            <MapController selectedRegion={selectedRegion} />

            {/* Base Map - Switched to a Light Map */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* Weather Data Overlay */}
            <TileLayer
              key={activeLayer + '-' + refreshKey}
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              url={openWeatherMapTileUrl}
              opacity={0.9} // Adjusted opacity for light theme
            />
          </MapContainer>
        </div>

        {/* --- KEY INSIGHTS SECTION (MOVED HERE) --- */}
        {selectedRegion && (
          <div className="insights-panel">
            <h3>Key Climate Insights for {selectedRegion.name}</h3>
            <ul>
              {selectedRegion.keyInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* --- SIDEBAR PANEL (RIGHT) --- */}
      <div className="sidebar-panel">
       

        <div className="charts-section">
          {selectedRegion ? (
            <>
              {/* --- CHARTS --- */}
              <div className="chart-container">
                <h3>Historical Temperature (°C)</h3>
                <div className="chart-wrapper">
                  <TrendChart
                    chartData={selectedRegion.tempData}
                    options={chartOptions} // Pass the new light options
                  />
                </div>
              </div>

              <div className="chart-container">
                <h3>Historical Rainfall (mm)</h3>
                <div className="chart-wrapper">
                  <TrendChart
                    chartData={selectedRegion.rainData}
                    options={chartOptions} // Pass the new light options
                  />
                </div>
              </div>

              {/* --- INSIGHTS SECTION IS NOW MOVED --- */}
            </>
          ) : (
            <div className="no-selection">
              <p>
                Select a region from the dropdown to see historical trends and
                insights.
              </p>
            </div>
          )}
        </div>

        {OPENWEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' && (
          <p
            style={{
              color: '#d9534f', // Red warning color
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            WARNING: Please replace 'YOUR_OPENWEATHERMAP_API_KEY' in the code!
          </p>
        )}
      </div>
    </div>
  );
};

export default Heatmap;