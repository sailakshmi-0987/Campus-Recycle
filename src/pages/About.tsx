import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Recycle, Leaf, Users, Globe, Sparkles } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/*const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};*/

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Header
        onLoginClick={() => (window.location.href = "/")}
        onPostItemClick={() => (window.location.href = "/")}
        onProfileClick={() => (window.location.href = "/")}
        onAdminClick={() => (window.location.href = "/")}
      />
 
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 text-white py-24 md:py-32 px-6 md:px-16 overflow-hidden">

        <Leaf className="absolute top-10 left-10 opacity-25 animate-bounce-slow" size={55} />
        <Recycle className="absolute bottom-10 right-20 opacity-20 animate-spin-slow" size={70} />
        <Sparkles className="absolute top-24 right-1/3 opacity-40 animate-pulse" size={50} />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Welcome to <span className="text-yellow-300">Campus Recycle</span>
          </h1>
          <p className="text-lg md:text-xl opacity-95 leading-relaxed max-w-3xl mx-auto">
            A community-driven platform that transforms unused campus items into value,
            reduces waste, and builds a greener future — one exchange at a time.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            className="w-full h-24 fill-gray-50"
          >
            <path d="M-0.00,49.98 C150.00,150.00 271.42,-49.98 500.00,49.98 L500.00,150.00 L-0.00,150.00 Z"></path>
          </svg>
        </div>
      </section>
      <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-4xl font-bold text-emerald-700 mb-6"
        >
          Why We Built Campus Recycle
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-gray-700 text-lg max-w-4xl mx-auto leading-relaxed"
        >
          Every year, students throw away perfectly usable items — books, gadgets,
          lab materials, clothing, and essentials — simply because they no longer need them.
          <br />
          <br />
          We realized the campus needed a **smart, simple, zero-cost system** for sharing,
          reusing, and reducing waste.  
          That’s how **Campus Recycle** was born:  
          a platform designed to make sustainability effortless and fun.
        </motion.p>
      </section>
      <section className="py-24 bg-emerald-50 px-6 md:px-16">
        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-3xl font-bold text-emerald-700 text-center mb-14"
        >
          Our Mission & Values
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {/* Card */}
          {[{
            icon: <Recycle size={54} className="mx-auto text-emerald-600" />,
            title: "Reduce Campus Waste",
            desc: "Giving items a second life helps shrink landfills and conserve resources."
          },
          {
            icon: <Users size={54} className="mx-auto text-emerald-600" />,
            title: "Build a Responsible Community",
            desc: "Sharing encourages trust, collaboration, and responsible living."
          },
          {
            icon: <Leaf size={54} className="mx-auto text-green-600" />,
            title: "Promote Sustainability",
            desc: "Every recycled item counts — for the campus and the planet."
          }].map((c, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center"
            >
              {c.icon}
              <h4 className="text-xl font-semibold mt-4 mb-2">{c.title}</h4>
              <p className="text-gray-600">{c.desc}</p>
            </motion.div>
          ))}

        </div>
      </section>

      <section className="py-20 px-6 md:px-20 max-w-5xl mx-auto text-center">
        <Globe size={60} className="mx-auto text-emerald-600 mb-6" />
        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-3xl font-bold text-emerald-700 mb-4"
        >
          A Movement That Starts With You
        </motion.h3>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-gray-700 text-lg leading-relaxed"
        >
          Campus Recycle is more than an app — it’s a commitment  
          to sustainability, awareness, and change.  
          Together, we’re building a campus that values responsibility  
          while reducing carbon footprints one item at a time.
        </motion.p>
      </section>
           <div className="px-6 md:px-16 mt-6">
  <button
    onClick={() => navigate("/")}
    className="flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-900 transition"
  >
    <span className="text-xl">←</span> Back to Homepage
  </button>
</div>
      <Footer />
    </div>
  );
}
