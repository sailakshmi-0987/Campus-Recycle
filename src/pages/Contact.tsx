import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Leaf, Sparkles } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { supabase } from "../lib/supabase";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      message,
    });

    setSending(false);

    if (error) {
      alert("Failed to send message. Try again.");
      console.log(error);
      return;
    }

    alert("Message sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header
        onLoginClick={() => (window.location.href = "/")}
        onPostItemClick={() => (window.location.href = "/")}
        onProfileClick={() => (window.location.href = "/")}
        onAdminClick={() => (window.location.href = "/")}
      />

      {/* CONTACT HERO */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 text-white py-20 md:py-28 px-6 text-center overflow-hidden">
        <Leaf className="absolute top-16 left-12 opacity-30 animate-bounce-slow" size={55} />
        <Sparkles className="absolute bottom-24 right-24 opacity-40 animate-pulse" size={50} />

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-6xl font-extrabold mb-4"
        >
          Contact <span className="text-yellow-300">Campus Recycle</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed"
        >
          Have questions, suggestions, or want to collaborate?
          We're here to help and support your sustainability journey.
        </motion.p>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-20 fill-gray-50">
            <path d="M0.00,49.98 C201.42,150.00 318.58,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
          </svg>
        </div>
      </section>

      {/* CONTACT DETAILS + FORM */}
      <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* LEFT INFO */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-emerald-700">Get in Touch</h2>

          <p className="text-gray-600 leading-relaxed">
            Whether you have feedback, a feature request, or want to collaborate for a sustainability event — reach out anytime.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail size={28} className="text-emerald-600" />
              <p className="text-gray-700 text-lg">campusrecycle@gmail.com</p>
            </div>

            <div className="flex items-center gap-4">
              <Phone size={28} className="text-emerald-600" />
              <p className="text-gray-700 text-lg">+91 7075456496</p>
            </div>

            <div className="flex items-center gap-4">
              <MapPin size={28} className="text-emerald-600" />
              <p className="text-gray-700 text-lg">RGUKT — Campus Innovation Building</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border"
        >
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Send us a Message</h3>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <textarea
            rows={5}
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </section>

      {/* FUTURE MAP */}
      <section className="py-20 px-6 md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full h-72 bg-gray-200 rounded-2xl shadow-inner flex items-center justify-center text-gray-500 text-lg"
        >
          Campus Map Coming Soon 🗺️
        </motion.div>
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
