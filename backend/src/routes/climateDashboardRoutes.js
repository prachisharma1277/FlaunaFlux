const mongoose = require('mongoose');
const express = require('express');

// Create a new router to export
const router = express.Router();

// --- 1. MONGOOSE SCHEMA ---
const Schema = mongoose.Schema;

const HistoricalDataSchema = new Schema({
  year: { type: Number, required: true },
  avgTemperature: { type: Number, required: true },
  avgRainfall: { type: Number, required: true }
});

const RegionClimateSchema = new Schema({
  regionName: { type: String, required: true, unique: true, trim: true },
  historicalData: [HistoricalDataSchema]
});

// IMPORTANT: Check if the model already exists before defining it
// This prevents errors during hot-reloading
const RegionClimate = mongoose.models.RegionClimate || mongoose.model('RegionClimate', RegionClimateSchema);


// --- 2. MOCK DATA & SEEDING (For Demonstration) ---
// This data will be used by the API routes.
// In a real app, you would connect to MongoDB and fetch this.
// For now, this mock data will power the API.
let MOCK_DB = [];
const sampleRegionsData = [
  {
    regionName: 'Western Ghats',
    historicalData: [
      { year: 2000, avgTemperature: 25.1, avgRainfall: 3050 },
      { year: 2005, avgTemperature: 25.4, avgRainfall: 2980 },
      { year: 2010, avgTemperature: 25.7, avgRainfall: 3120 },
      { year: 2015, avgTemperature: 26.0, avgRainfall: 2890 },
      { year: 2020, avgTemperature: 26.3, avgRainfall: 3150 },
    ],
  },
  {
    regionName: 'Himalayan Region',
    historicalData: [
      { year: 2000, avgTemperature: 12.5, avgRainfall: 1250 },
      { year: 2005, avgTemperature: 12.9, avgRainfall: 1220 },
      { year: 2010, avgTemperature: 13.3, avgRainfall: 1300 },
      { year: 2015, avgTemperature: 13.8, avgRainfall: 1190 },
      { year: 2020, avgTemperature: 14.2, avgRainfall: 1280 },
    ],
  },
  {
    regionName: 'Thar Desert',
    historicalData: [
      { year: 2000, avgTemperature: 29.3, avgRainfall: 280 },
      { year: 2005, avgTemperature: 29.8, avgRainfall: 250 },
      { year: 2010, avgTemperature: 30.1, avgRainfall: 310 },
      { year: 2015, avgTemperature: 30.5, avgRainfall: 240 },
      { year: 2020, avgTemperature: 31.0, avgRainfall: 260 },
    ],
  },
  {
    regionName: 'Gangetic Plains',
    historicalData: [
      { year: 2000, avgTemperature: 26.5, avgRainfall: 1050 },
      { year: 2005, avgTemperature: 26.8, avgRainfall: 1020 },
      { year: 2010, avgTemperature: 27.0, avgRainfall: 1100 },
      { year: 2015, avgTemperature: 27.3, avgRainfall: 980 },
      { year: 2020, avgTemperature: 27.6, avgRainfall: 1030 },
    ],
  },
];

// Seed the mock database
(function seedMockDatabase() {
    MOCK_DB = sampleRegionsData;
    console.log('Mock climate database seeded for API.');
})();

router.get('/regions', async (req, res) => {
  try {
    // Using mock data. Replace with real DB query if available.
    const regions = MOCK_DB.map(r => ({ regionName: r.regionName }));
    res.json(regions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching regions' });
  }
});

// --- NEW MOCK DATA FOR MAP ---
// This simulates what a real-time API might return for the whole country
const MOCK_MAP_DATA = [
    { name: 'Shimla (Himalayan)', lat: 31.10, lng: 77.17, temp: 18.2 },
    { name: 'Jaisalmer (Thar)', lat: 26.91, lng: 70.90, temp: 42.1 },
    { name: 'Bikaner (Thar)', lat: 28.02, lng: 73.31, temp: 41.5 },
    { name: 'Lucknow (Gangetic)', lat: 26.84, lng: 80.94, temp: 38.0 },
    { name: 'Patna (Gangetic)', lat: 25.59, lng: 85.13, temp: 37.2 },
    { name: 'Mumbai (Western Ghats)', lat: 19.07, lng: 72.87, temp: 31.7 },
    { name: 'Kochi (Western Ghats)', lat: 9.93, lng: 76.26, temp: 30.5 },
    { name: 'Chennai (Coastal)', lat: 13.08, lng: 80.27, temp: 34.0 },
    { name: 'Bhopal (Central)', lat: 23.25, lng: 77.41, temp: 39.8 },
    { name: 'Amaravati (Andhra Pradesh)', lat: 16.5193, lng: 80.6305, temp: 35.2 },
    { name: 'Itanagar (Arunachal Pradesh)', lat: 27.1004, lng: 93.6166, temp: 24.5 },
    { name: 'Dispur (Assam)', lat: 26.1433, lng: 91.7898, temp: 29.0 },
    { name: 'Patna (Bihar)', lat: 25.5940, lng: 85.1376, temp: 36.5 },
    { name: 'Raipur (Chhattisgarh)', lat: 21.2444, lng: 81.6306, temp: 38.1 },
    { name: 'Panaji (Goa)', lat: 15.4909, lng: 73.8278, temp: 31.0 },
    { name: 'Gandhinagar (Gujarat)', lat: 23.2156, lng: 72.6369, temp: 39.5 },
    { name: 'Chandigarh (Haryana)', lat: 30.7333, lng: 76.7898, temp: 32.0 },
    { name: 'Ranchi (Jharkhand)', lat: 23.3600, lng: 85.3300, temp: 35.8 },
    { name: 'Bengaluru (Karnataka)', lat: 12.9789, lng: 77.5917, temp: 28.5 },
    { name: 'Thiruvananthapuram (Kerala)', lat: 8.5241, lng: 76.9366, temp: 30.2 },
    { name: 'Bhopal (Madhya Pradesh)', lat: 23.2599, lng: 77.4126, temp: 37.5 },
    { name: 'Mumbai (Maharashtra)', lat: 19.0761, lng: 72.8775, temp: 31.8 },
    { name: 'Imphal (Manipur)', lat: 24.8170, lng: 93.9368, temp: 26.3 },
    { name: 'Shillong (Meghalaya)', lat: 25.5788, lng: 91.8933, temp: 22.1 },
    { name: 'Aizawl (Mizoram)', lat: 23.7271, lng: 92.7176, temp: 25.0 },
    { name: 'Kohima (Nagaland)', lat: 25.6586, lng: 94.1053, temp: 23.4 },
    { name: 'Bhubaneswar (Odisha)', lat: 20.2961, lng: 85.8245, temp: 36.7 },
    { name: 'Chandigarh (Punjab)', lat: 30.7333, lng: 76.7898, temp: 32.0 },
    { name: 'Jaipur (Rajasthan)', lat: 26.9124, lng: 75.7873, temp: 40.2 },
    { name: 'Gangtok (Sikkim)', lat: 27.3389, lng: 88.6065, temp: 19.5 },
    { name: 'Chennai (Tamil Nadu)', lat: 13.0825, lng: 80.2750, temp: 34.8 },
    { name: 'Hyderabad (Telangana)', lat: 17.3617, lng: 78.4747, temp: 36.0 },
    { name: 'Agartala (Tripura)', lat: 23.8315, lng: 91.2868, temp: 31.5 },
    { name: 'Lucknow (Uttar Pradesh)', lat: 26.8500, lng: 80.9500, temp: 37.9 },
    { name: 'Dehradun (Uttarakhand)', lat: 30.3165, lng: 78.0322, temp: 28.0 },
    { name: 'Kolkata (West Bengal)', lat: 22.5675, lng: 88.3700, temp: 34.1 },

    // === Union Territories (8) ===
    { name: 'Port Blair (Andaman & Nicobar)', lat: 11.6661, lng: 92.7464, temp: 30.1 },
    { name: 'Chandigarh (Chandigarh)', lat: 30.7333, lng: 76.7898, temp: 32.0 },
    { name: 'Daman (Dadra & Nagar Haveli and Daman & Diu)', lat: 20.4283, lng: 72.8597, temp: 31.5 },
    { name: 'New Delhi (Delhi)', lat: 28.6100, lng: 77.2300, temp: 39.0 },
    { name: 'Srinagar (Jammu & Kashmir)', lat: 34.0900, lng: 74.7900, temp: 15.0 },
    { name: 'Kavaratti (Lakshadweep)', lat: 10.5669, lng: 72.6417, temp: 30.8 },
    { name: 'Leh (Ladakh)', lat: 34.1526, lng: 77.5770, temp: 12.1 },
    { name: 'Puducherry (Puducherry)', lat: 11.9416, lng: 79.8083, temp: 33.5 }
];

// --- 3. API ROUTES ---

router.get('/historical/:regionName', async (req, res) => {
  try {
    const regionName = req.params.regionName;
    // Using mock data. Replace with real DB query if available.
    const data = MOCK_DB.find(r => r.regionName === regionName);
    
    if (!data) {
      return res.status(404).json({ message: 'Region data not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching historical data' });
  }
});

// GET /api/climate/realtime/:regionName
router.get('/realtime/:regionName', (req, res) => {
    const regionName = req.params.regionName;
    
    // Using mock data.
    const regionBaseData = MOCK_DB.find(r => r.regionName === regionName);
    
    if (!regionBaseData) {
        return res.status(404).json({ message: 'Region not found' });
    }

    // Simulate real-time data with slight random variations
    const baseTemp = regionBaseData.historicalData.slice(-1)[0].avgTemperature;
    const baseRainfall = regionBaseData.historicalData.slice(-1)[0].avgRainfall / 12; // monthly approx

    const realTimeData = {
        region: regionName,
        // Simulate a temp between base and base + 15
        currentTemperature: parseFloat((baseTemp + Math.random() * 15).toFixed(1)),
        // Simulate monthly rainfall between base and base + 150
        currentRainfall: parseFloat((baseRainfall + Math.random() * 150).toFixed(0)),
        timestamp: new Date().toISOString()
    };
    
    res.json(realTimeData);
});

// --- NEW ROUTE FOR MAP DATA ---
// GET /api/climate/mapdata
router.get('/mapdata', (req, res) => {
  try {
    // In a real app, this is where you would call your 3rd-party weather API
    // and format the data for the map. We are just returning our mock data.
    res.json(MOCK_MAP_DATA);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching map data' });
  }
});


// Export the router
module.exports = router;