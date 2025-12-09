import { motion } from "framer-motion";
import { CheckCircle, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const guidelines = [
  "Post only genuine items in usable condition.",
  "Respond politely and promptly to chat messages.",
  "Meet in safe campus locations for exchanges.",
  "Do not post prohibited or harmful items.",
  "Respect others’ time and donated items.",
  "Report suspicious users to the admin team."
];

export default function Guidelines() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => (window.location.href = "/")}
        onPostItemClick={() => (window.location.href = "/")}
        onProfileClick={() => (window.location.href = "/")}
        onAdminClick={() => (window.location.href = "/")}
      />

      <section className="py-20 px-6 md:px-16 text-center">
        <Shield size={60} className="mx-auto text-emerald-600 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700">
          Campus Recycle Guidelines
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Help us maintain a safe, friendly, and sustainable trading environment.
        </p>

        <div className="max-w-3xl mx-auto mt-12 space-y-5">
          {guidelines.map((g, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 bg-white p-5 rounded-xl shadow border"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <CheckCircle className="text-emerald-600 mt-1" size={26} />
              <p className="text-gray-700 text-lg">{g}</p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-10 flex items-center mx-auto bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </button>
      </section>

      <Footer />
    </div>
  );
}
