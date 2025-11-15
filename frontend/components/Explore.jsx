/*export default function Explore() {
  const features = [
    {
      title: "Population Metrics",
      desc: "Analyze species trends and discover ecosystem changes in real time.",
      icon: "📊",
    },
    {
      title: "Community Engagement",
      desc: "Connect, share, and learn from other conservationists worldwide.",
      icon: "🤝",
    },
    {
      title: "Climate Impact",
      desc: "Visualize how weather and temperature shifts affect wildlife.",
      icon: "🌦️",
    },
  ];

  return (
    <section className="py-20 text-center bg-white" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-green-700 mb-10">
        Explore FaunaFlux
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="card bg-green-50 hover:bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="text-4xl">{f.icon}</div>
            <h3 className="text-xl font-semibold mt-3 text-green-800">
              {f.title}
            </h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}*/
import { motion } from "framer-motion";
import { FaLeaf, FaUsers, FaChartLine, FaCloudSun } from "react-icons/fa";

export default function Explore() {
  const features = [
    {
      icon: <FaChartLine className="text-green-600 text-3xl" />,
      title: "Population Metrics",
      desc: "Track wildlife population changes using live analytics and trends.",
    },
    {
      icon: <FaUsers className="text-green-600 text-3xl" />,
      title: "Community Engagement",
      desc: "Collaborate, share, and connect with people who care about nature.",
    },
    {
      icon: <FaCloudSun className="text-green-600 text-3xl" />,
      title: "Climate Impact",
      desc: "See how climate patterns influence species and habitats worldwide.",
    },
    {
      icon: <FaLeaf className="text-green-600 text-3xl" />,
      title: "Eco Awareness",
      desc: "Learn actionable ways to reduce environmental impact.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-green-50 to-white">
      <h2 className="text-4xl font-bold text-center text-green-800 mb-14">
        Explore FaunaFlux 
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-green-100 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-green-100 p-4 rounded-full">{f.icon}</div>
              <h3 className="text-xl font-semibold text-green-800">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
