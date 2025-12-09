import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden ">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.65]"
        style={{
          backgroundImage:
            "url(https://schaeferwaste.com/wp-content/uploads/2021/08/AdobeStock_248990042-768x499.jpeg)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center">

        {/* Sustainability Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-block bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg"
        >
          🌿 Campus Sustainability Initiative
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-white max-w-3xl"
        >
          Share, Request,{" "}
          <span className="text-emerald-300">Sustain</span> Your Campus Life
        </motion.h1>

        {/* Sub Heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white/90 max-w-xl mt-4 text-lg"
        >
          Join your campus community in reducing waste. Post items you no longer
          need and discover treasures from fellow students.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex gap-4 mt-6"
        >
          <button
            onClick={onGetStarted}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-lg shadow-md"
          >
            + Post an Item
          </button>

          <Link
            to="/about"
            className="bg-white text-gray-800 hover:bg-gray-200 px-6 py-3 rounded-lg text-lg shadow-md"
          >
            Learn More
          </Link>
        </motion.div>

      </div>

      {/* Floating small product cards */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-20">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg w-28 text-center"
        >
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ52gY0s6azYD1ncuJP-VIMVUaCsOqv8spB7g&s" className="rounded-lg h-12 w-full object-cover" />
          <p className="text-xs mt-2">Engineering Tools</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg w-28 text-center"
        >
          <img src="https://m.media-amazon.com/images/I/71NkhJAFXvL.jpg" className="rounded-lg h-12 w-full object-cover" />
          <p className="text-xs mt-2">Wireless Earbuds</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg w-28 text-center"
        >
          <img src="https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1721748590-547965_FADID_9762_001_089_0000_Light.jpg?crop=1xw:1.00xh;center,top&resize=980:*" className="rounded-lg h-12 w-full object-cover" />
          <p className="text-xs mt-2">Designer Backpack</p>
        </motion.div>

      </div>

      {/* Floating Bottom-Right Button */}
      <Link
        to="/contact"
        className="absolute bottom-5 right-5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 z-20"
      >
        💬 Talk With Us
      </Link>
    </section>
  );
}
