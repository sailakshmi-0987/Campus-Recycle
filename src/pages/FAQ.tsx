import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState } from "react";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const navigate = useNavigate();
  const toggle = (i: number) => {
    setOpen(open === i ? null : i);
  };

  const faqs = [
    {
      q: "What is Campus Recycle?",
      a: "Campus Recycle is a platform that helps students share, donate, and exchange items to reduce waste on campus."
    },
    {
      q: "Is it free to use?",
      a: "Yes! Campus Recycle is completely free for all students."
    },
    {
      q: "How do I post an item?",
      a: "Simply sign in, click the 'Post Item' button, upload images, add details, and publish."
    },
    {
      q: "How does chat work?",
      a: "When you request an item, a private chat opens between you and the item owner for smooth communication."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => (window.location.href = "/")}
        onPostItemClick={() => (window.location.href = "/")}
        onProfileClick={() => (window.location.href = "/")}
        onAdminClick={() => (window.location.href = "/")}
      />

      <section className="py-20 px-6 md:px-16 text-center">
        <HelpCircle size={60} className="mx-auto text-emerald-600 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Find answers to common questions about how Campus Recycle works.
        </p>

        <div className="max-w-3xl mx-auto mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white p-5 rounded-xl shadow cursor-pointer border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => toggle(i)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{faq.q}</h3>
                <ChevronDown
                  className={`transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </div>
              {open === i && (
                <p className="mt-3 text-gray-600">{faq.a}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Back to Homepage */}
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
