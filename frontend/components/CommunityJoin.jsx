/*import { motion } from "framer-motion";

export default function CommunityJoin() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-green-100 py-16 text-center"
    >
      <h2 className="text-3xl font-bold text-green-800">
        Join the FaunaFlux Community!
      </h2>
      <p className="text-gray-700 mt-3 max-w-xl mx-auto">
        Be part of a global network working together to conserve wildlife and
        track environmental change.
      </p>
      <button className="mt-6 bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 hover:shadow-[0_0_15px_#16a34a90] transition-all duration-300">
        Join Now
      </button>
    </motion.section>
  );
}
*/
import { motion } from "framer-motion";

export default function CommunityJoin() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 text-white text-center overflow-hidden">
      {/* Animated Leaf Background */}
      <motion.div
        className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"
        animate={{ backgroundPositionX: ["0%", "100%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <motion.h2
        className="text-4xl font-bold mb-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Join the FaunaFlux Community 💬
      </motion.h2>

      <motion.p
        className="max-w-2xl mx-auto text-gray-100 mb-8 z-10 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Be part of a vibrant global movement — share your sightings, discuss
        wildlife, and collaborate for conservation impact.
      </motion.p>

      <motion.button
        className="relative z-10 bg-white text-green-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Join Now
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
    </section>
  );
}
