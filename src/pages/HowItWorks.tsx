import React from "react";
import { motion } from "framer-motion";
import { Recycle, Users, MessageSquare, ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const steps = [
  {
    icon: <Recycle size={50} className="text-emerald-600 mx-auto" />,
    title: "Post Items",
    desc: "Upload items you no longer need and help others reuse valuable resources."
  },
  {
    icon: <Users size={50} className="text-blue-600 mx-auto" />,
    title: "Browse & Request",
    desc: "Explore items posted by other students and request what you need."
  },
  {
    icon: <MessageSquare size={50} className="text-purple-600 mx-auto" />,
    title: "Chat & Exchange",
    desc: "Coordinate the handover using our built-in chat system."
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => (window.location.href = "/")}
        onPostItemClick={() => (window.location.href = "/")}
        onProfileClick={() => (window.location.href = "/")}
        onAdminClick={() => (window.location.href = "/")}
      />

      <section className="py-20 px-6 md:px-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700">
          How Campus Recycle Works
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          A simple 3-step system to promote sustainability across campus.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-14">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-lg text-center border hover:shadow-2xl transition"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              {s.icon}
              <h3 className="text-xl font-semibold mt-4">{s.title}</h3>
              <p className="text-gray-600 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-10 flex items-center mx-auto bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </button>
      </section>

      <Footer />
    </div>
  );
}
