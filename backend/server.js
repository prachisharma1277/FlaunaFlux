const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const passport = require('passport');
const path = require("path");
dotenv.config();
require('./src/config/passport')(passport);
connectDB();
// --- FIX: Import http and socket.io ---
const http = require('http'); 
const { Server } = require('socket.io');

// --- Your Route Imports ---
const reportRoutes = require('./src/routes/reportRoutes');
const alertRoutesSetup = require('./src/routes/alertRoutes');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const dataRoutes = require('./src/routes/dataRoutes');
const climateRoutes=require('./src/routes/climateDashboardRoutes');
const recordRoutes=require('./src/routes/recordRoutes');
const aboutRoutes=require('./src/routes/aboutRoutes');
const documentRoutes=require('./src/routes/documentRoutes');
// --- Create Express App ---
const app = express();
// --- FIX: Create the HTTP server from the Express app ---
const server = http.createServer(app);

// --- FIX: Initialize Socket.io using the new 'server' ---
const io = new Server(server, {
  cors: {
    origin:process.env.FRONTEND_URL, // Your React app's URL
    methods: ["GET", "POST"]
  }
});

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// --- START: Data Merged from Server 1 ---
// Note: This data is taken directly from the frontend's hardcoded component files
const allData = {
    // Data extracted from src/components/Population/ChartsDashboard.jsx
    parkData: {
        "All India": {
            trend: [1000, 950, 870, 780, 720, 680],
            info: "India’s biodiversity is among the richest in the world. While rapid urbanization has led to a 15% decline in species count, conservation efforts are showing positive recovery in several national parks.",
            keySpecies: "Tiger, Elephant, Rhino, Peacock",
            challenges: "Habitat loss, poaching, climate stress",
            state: "Across India",
            type: "National Overview",
        },
        "Kaziranga National Park": {
            trend: [700, 710, 720, 750, 780, 820],
            info: "Home to the world’s largest population of one-horned rhinoceros, Kaziranga has seen consistent population growth due to strict protection laws.",
            keySpecies: "One-horned Rhino, Elephants, Swamp Deer",
            challenges: "Flooding from Brahmaputra River",
            state: "Assam",
            type: "National Park",
        },
        "Sundarbans National Park": {
            trend: [500, 480, 470, 450, 440, 460],
            info: "A UNESCO World Heritage Site, the Sundarbans is home to Bengal tigers and mangrove ecosystems facing threats from rising sea levels.",
            keySpecies: "Bengal Tiger, Saltwater Crocodile, Spotted Deer",
            challenges: "Climate change and coastal erosion",
            state: "West Bengal",
            type: "National Park",
        },
        "Jim Corbett National Park": {
            trend: [650, 670, 690, 710, 740, 780],
            info: "India’s first national park and the birthplace of Project Tiger, Corbett has shown a significant rise in tiger numbers over the past decade.",
            keySpecies: "Tiger, Elephant, Barking Deer",
            challenges: "Tourism pressure & forest encroachment",
            state: "Uttarakhand",
            type: "National Park",
        },
        "Gir National Park": {
            trend: [900, 880, 860, 850, 830, 820],
            info: "A tri-state biosphere spanning Tamil Nadu, Kerala, and Karnataka, known for its elephants and lion-tailed macaques. Deforestation remains a key concern.",
            keySpecies: "Elephant, Lion-tailed Macaque, Nilgiri Tahr",
            challenges: "Deforestation & corridor fragmentation",
            state: "TN, Kerala, Karnataka",
            type: "Biosphere Reserve",
        },
    },

    // Data extracted from src/components/Population/StatsCards.jsx
    statsMap: {
        "All India": [
            { title: "Total Species Monitored", icon: "🐾", value: "12,800+", sub: "Across India’s National Database" },
            { title: "Overall Species Decline", icon: "📉", value: "-15%", sub: "Over the Last 20 Years" },
            { title: "Recovery Successes", icon: "🌱", value: "+2.5%", sub: "Annual Growth in Protected Zones" },
            { title: "Species at Risk", icon: "🦺", value: "5,200+", sub: "Across Habitats and Biomes" },
        ],
        "Jim Corbett National Park": [
            { title: "Tiger Population Growth", icon: "🐅", value: "+18%", sub: "Since 2015 under Project Tiger" },
            { title: "Total Species Recorded", icon: "🐾", value: "650+", sub: "Mammals, Birds, and Reptiles" },
            { title: "Elephant Corridors Restored", icon: "🐘", value: "7", sub: "Across Terai Arc Landscape" },
            { title: "Human-Wildlife Conflicts", icon: "⚠️", value: "-9%", sub: "Reduction since 2020" },
        ],
        "Kaziranga National Park": [
            { title: "Rhino Population Recovery", icon: "🦏", value: "+200", sub: "Growth since 2018" },
            { title: "Total Species Monitored", icon: "🐾", value: "480+", sub: "Including Wetland & Avian Species" },
            { title: "Flood Impact Reduction", icon: "🌊", value: "-15%", sub: "Through Elevated Shelters" },
            { title: "Poaching Incidents", icon: "🚫", value: "-85%", sub: "Drop since 2015 with Drone Patrols" },
        ],
        "Gir National Park": [
            { title: "Asiatic Lion Population", icon: "🦁", value: "674", sub: "2023 Official Census" },
            { title: "Forest Cover Health", icon: "🌿", value: "+6.8%", sub: "Improvement in Last 5 Years" },
            { title: "Species Diversity", icon: "🦋", value: "480+", sub: "Including Leopards & Antelopes" },
             { title: "Rescue Operations", icon: "🚑", value: "60+", sub: "Successful Rescues in 2024" },
        ],
        "Sundarbans National Park": [
            { title: "Mangrove Density", icon: "🌴", value: "+4.3%", sub: "Improved Canopy Since 2017" },
            { title: "Tiger Population Trend", icon: "🐅", value: "+5%", sub: "Growth since 2015" },
            { title: "Total Species Monitored", icon: "🐾", value: "780+", sub: "Including Marine & Terrestrial" },
            { title: "Sea Level Threat Index", icon: "🌊", value: "High", sub: "Requires Coastal Buffer Projects" },
        ],
    },

    // Data extracted from src/components/Population/SpeciesSpotlight.jsx
    speciesData: {
        "All India": [
            { image: 'Tiger', title: "Bengal Tiger", status: "Endangered", habitat: "National Parks across India", population: "≈ 3,167 (2022 Census)", threat: "Poaching & habitat loss", conservation: "Project Tiger & WWF collaborations have improved tiger safety and corridor restoration.", },
            { image: 'Elephant', title: "Indian Elephant", status: "Endangered", habitat: "Across India (South, Central, and North-East)", population: "≈ 27,000", threat: "Habitat loss & human-elephant conflict", conservation: "Elephant Corridors, Project Elephant, and radio-collar tracking are helping reduce human-animal clashes.", },
            { image: 'Turtle', title: "Olive Ridley Turtle", status: "Vulnerable", habitat: "Coastal Regions of Odisha & Tamil Nadu", population: "≈ 800,000 nesting females", threat: "Fishing nets & coastal pollution", conservation: "Community hatcheries and Marine Turtle Conservation Network protect eggs and guide safe nesting routes.", },
        ],
        "Jim Corbett National Park": [
            { image: 'Tiger', title: "Bengal Tiger", status: "Vulnerable", habitat: "Sal Forests and River Valleys", population: "≈ 252 (2022 Census)", threat: "Human-wildlife conflict and forest encroachment", conservation: "India’s oldest national park under Project Tiger — home to one of the densest tiger populations in the country.", },
            { image: 'Elephant', title: "Asian Elephant", status: "Endangered", habitat: "Grasslands near the Ramganga River", population: "≈ 1,000", threat: "Encroachment of migratory corridors", conservation: "Eco-bridges and community patrols help reduce roadkills and guide herds safely between reserves.", },
            { image: 'Deer', title: "Sambar Deer", status: "Least Concern", habitat: "Moist deciduous forests and foothills", population: "Stable (approx. 5,000)", threat: "Predation & poaching for meat", conservation: "Habitat enrichment through salt licks and grassland regeneration programs.", },
        ],
        "Kaziranga National Park": [
            { image: 'Rhino', title: "One-Horned Rhino", status: "Vulnerable", habitat: "Grasslands & Wetlands", population: "≈ 2,613 (2022 Census)", threat: "Poaching & Flooding from Brahmaputra River", conservation: "Kaziranga Rhino Protection Force and elevated mounds for flood survival have stabilized populations.", },
            { image: 'Elephant', title: "Indian Elephant", status: "Endangered", habitat: "Swamp Forests & Flood Plains", population: "≈ 1,200", threat: "Habitat fragmentation & seasonal floods", conservation: "Community watch groups and elephant movement tracking reduce human-elephant clashes.", },
            { image: 'Buffalo', title: "Wild Water Buffalo", status: "Endangered", habitat: "Marshy Grasslands", population: "≈ 1,900", threat: "Disease transmission from livestock", conservation: "Vaccination campaigns and wetland buffer zones have improved buffalo health and breeding success.", },
        ],
        "Gir National Park": [
            { image: 'Lion', title: "Asiatic Lion", status: "Endangered", habitat: "Dry deciduous forests of Gujarat", population: "≈ 674 (2023 Census)", threat: "Disease outbreaks & human-wildlife interaction", conservation: "Gir Lion Conservation Project focuses on disease monitoring and creating a second habitat in Madhya Pradesh.", },
            { image: 'Leopard', title: "Indian Leopard", status: "Vulnerable", habitat: "Hilly Forest Areas & Grasslands", population: "≈ 300 (within Gir region)", threat: "Territorial conflict with lions & poaching", conservation: "Night patrols and livestock compensation schemes help coexistence with local communities.", },
            { image: 'Hyena', title: "Striped Hyena", status: "Near Threatened", habitat: "Scrublands and rocky plateaus", population: "≈ 400", threat: "Poisoning due to livestock conflict", conservation: "Scavenger species protection program to maintain ecological balance.", },
        ],
        "Sundarbans National Park": [
            { image: 'Tiger', title: "Bengal Tiger", status: "Endangered", habitat: "Mangrove Swamps & Deltaic Forests", population: "≈ 96 (2023 Estimate)", threat: "Rising sea levels & habitat salinity", conservation: "India–Bangladesh Tiger Monitoring and Mangrove Restoration Project safeguard the tiger habitat.", },
            { image: 'Crocodile', title: "Saltwater Crocodile", status: "Least Concern", habitat: "Brackish Waters and Estuaries", population: "Stable (~200)", threat: "Habitat degradation & plastic pollution", conservation: "Mangrove replantation and water monitoring improve breeding conditions.", },
          { image: 'Deer', title: "Spotted Deer (Chital)", status: "Least Concern", habitat: "Mangrove undergrowth and grass patches", population: "≈ 20,000", threat: "Predation and food scarcity during floods", conservation: "Habitat restoration and elevated grazing grounds have improved survival rates.", },
        ],
    },
};
// --- END: Data Merged from Server 1 ---


// --- API Routes ---
app.get('/', (req, res) => {
  res.send('FlaunaFlux API is running...');
});

// --- START: Route Merged from Server 1 ---
app.get('/api/population-data', (req, res) => {
    // This endpoint sends all the data needed by the frontend components.
    res.json(allData);
});
// --- END: Route Merged from Server 1 ---

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/climate', climateRoutes );
app.use('/api/records', recordRoutes);
app.use('/api/alerts', alertRoutesSetup(io));
app.use('/api/about', aboutRoutes);
app.use('/api/documents', documentRoutes);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;

// --- FIX: Use server.listen() INSTEAD of app.listen() ---
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);