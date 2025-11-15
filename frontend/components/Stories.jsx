import { motion } from "framer-motion";
import { useRef } from "react";
import photo1 from '../assets/images/Home1.png'
import photo2 from '../assets/images/Home2.png'
import photo3 from '../assets/images/Home3.png'
export default function Stories() {
  const scrollRef = useRef(null);

  const stories = [
    {
      img: photo1,
      title: "Saving Tigers in Sundarbans",
      text: "Community-led programs have increased tiger visibility by 12%.",
    },
    {
      img: photo2,
      title: "Elephants & Ecosystem Revival",
      text: "Cross-border tracking helped restore migration paths.",
    },
    {
      img: photo3,
      title: "Coral Reef Guardians",
      text: "Youth divers are monitoring bleaching data weekly.",
    },
    {
      img: photo1,
      title: "Wings of Hope",
      text: "Bird migration tracking brings new insights to ecosystem balance.",
    },
    {
      img: photo2,
      title: "Polar Pulse",
      text: "Arctic animal patterns reveal climate change progression.",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-green-50 via-white to-green-100 py-20 overflow-hidden">
      {/* Title */}
      <motion.h2
        className="text-4xl font-bold text-center text-green-800 mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Impactful Stories 🌿
      </motion.h2>

      {/* Scrollable Card Row */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto px-8 scrollbar-hide snap-x snap-mandatory"
      >
        {stories.map((s, i) => (
          <motion.div
            key={i}
            className="relative min-w-[280px] md:min-w-[350px] h-[300px] rounded-2xl overflow-hidden shadow-lg snap-center group"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          >
            {/* Background Image */}
            <img
              src={s.img}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                {s.title}
              </h3>
              <p className="text-sm text-gray-200">{s.text}</p>
            </div>

            {/* Floating Tag */}
            <div className="absolute top-4 left-4 bg-green-700/80 text-white text-xs px-3 py-1 rounded-full shadow-md">
              Story #{i + 1}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gradient Fade Edges */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-green-50 via-green-50/80 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-green-100 via-green-100/80 to-transparent pointer-events-none"></div>
    </section>
  );
}
/*import { motion } from "framer-motion";
import photo1 from '../assets/images/Home1.png'
import photo2 from '../assets/images/Home2.png'
import photo3 from '../assets/images/Home3.png'


export default function Stories() {
  const stories = [
    {
      img: photo1,
      title: "Tiger Tales of the Sundarbans",
      author: "By Dr. Meera Rao",
      text: "How local communities are using technology to protect endangered species.",
    },
    {
      img: photo2,
      title: "Elephant Corridors Restored",
      author: "By Rajiv Sen",
      text: "Cross-border collaborations revive the natural routes of migrating elephants.",
    },
    {
      img: photo3,
      title: "Rebuilding Coral Reefs",
      author: "By Lila Fernandez",
      text: "Citizen divers and marine biologists are teaming up to heal our oceans.",
    },
  ];

  return (
    <section className="py-24 bg-green-50">
      <motion.h2
        className="text-4xl font-bold text-center text-green-800 mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Impactful Stories ✨
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-8">
        {stories.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="overflow-hidden">
              <img
                src={s.img}
                alt={s.title}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-green-700">{s.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{s.author}</p>
              <p className="text-gray-700 text-sm">{s.text}</p>
              <button className="mt-4 text-green-700 font-semibold hover:text-green-900 transition-all">
                Read More →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}*/

