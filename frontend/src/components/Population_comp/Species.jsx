
import { useState, useEffect } from "react"; // 👈 Import hooks
import { motion } from "framer-motion";
import { FaLeaf, FaGlobeAsia, FaShieldAlt, FaHeartbeat } from "react-icons/fa";
// Import local images as they are not being served by the backend
import Turtle from "../../assets/images/Pop1.png";
import Elephant from "../../assets/images/_Com3.png";
import Tiger from "../../assets/images/VPop6.png";
import Deer from '../../assets/images/Pop4.png';
import Rhino from '../../assets/images/VPop7.png';
import Buffalo from '../../assets/images/Buffalo.png';
import Lion from '../../assets/images/Lion.png';
import Hyena from '../../assets/images/Hyena.png';
import Leopard from '../../assets/images/Leopard.png';
import Crocodile from '../../assets/images/Crocodile.png';

const API_URL=import.meta.env.VITE_BACKEND_URL;
const imageMap = {
    'Tiger': Tiger,
    'Elephant': Elephant,
    'Turtle': Turtle,
    'Deer': Deer,
    'Rhino': Rhino,
    'Buffalo': Buffalo,
    'Lion': Lion,
    'Hyena': Hyena,
    'Leopard': Leopard,
    'Crocodile': Crocodile,
};

const defaultSpeciesData = { // Default for safe initial rendering
    "All India": [{ image: Tiger, title: "Loading Species...", status: "...", habitat: "...", population: "...", threat: "...", conservation: "..." }]
};

export default function SpeciesSpotlight({ selectedRegion }) {
  const [speciesData, setSpeciesData] = useState(defaultSpeciesData); // 👈 State for species data
  const [isLoading, setIsLoading] = useState(true);

  // 👈 Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/population-data`);
        const data = await response.json();
        setSpeciesData(data.speciesData); // Use the 'speciesData' key from the API response
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching species data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Run only once on mount

  const speciesList = speciesData[selectedRegion] || speciesData["All India"] || [];

  if (isLoading) {
    return (
        <section className="px-8 py-16 text-center text-gray-500">
            <p>Loading species spotlight...</p>
        </section>
    );
  }

  return (
    <section className="px-8 py-16 bg-gradient-to-br from-green-50 to-gray-50">
      <h2 className="text-3xl font-bold text-green-800 mb-10 text-center">
        {selectedRegion} Species Spotlight 🐾
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {speciesList.map((sp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            className="bg-white p-5 rounded-2xl shadow-md border border-green-100 hover:shadow-lg transition-all"
          >
            <img
              src={imageMap[sp.image]} // 👈 Use the map to get the correct local image
              alt={sp.title}
              className="rounded-lg h-52 w-full object-cover mb-4"
            />
            <h3 className="text-2xl font-bold text-green-700 mb-2">{sp.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              <FaGlobeAsia className="inline mr-2 text-green-600" /> {sp.habitat}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <FaHeartbeat className="inline mr-2 text-red-500" /> Population: {sp.population}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <FaLeaf className="inline mr-2 text-green-500" /> Threat: {sp.threat}
            </p>
            <p className="text-sm text-gray-700">
              <FaShieldAlt className="inline mr-2 text-green-700" /> Conservation:{" "}
              <span className="italic">{sp.conservation}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );

}
