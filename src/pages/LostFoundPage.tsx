import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useData } from "../context/DataContext";
import LostFoundCard from "../components/lostfound/LostFoundCard";
import LostFoundModal from "../components/lostfound/LostFoundModal";

export default function LostFoundPage() {
  const { lostFound, loadLostFound } = useData();
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadLostFound();
  }, []);

  const filtered = filter === "all"
    ? lostFound
    : lostFound.filter((i) => i.kind === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => (window.location.href = "/login")}
        onPostItemClick={() => (window.location.href = "/")}
        onProfileClick={() => (window.location.href = "/profile")}
      />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">Lost &amp; Found</h1>
            <p className="text-gray-600">Report lost or found items inside the campus.</p>
          </div>

          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded ${
                filter === "all" ? "bg-emerald-600 text-white" : "bg-white border"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={`px-4 py-2 rounded ${
                filter === "lost" ? "bg-emerald-600 text-white" : "bg-white border"
              }`}
              onClick={() => setFilter("lost")}
            >
              Lost
            </button>

            <button
              className={`px-4 py-2 rounded ${
                filter === "found" ? "bg-emerald-600 text-white" : "bg-white border"
              }`}
              onClick={() => setFilter("found")}
            >
              Found
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Report
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No reports yet — be the first!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((i) => (
              <LostFoundCard key={i.id} item={i} />
            ))}
          </div>
        )}
      </main>
      <button
    onClick={() => navigate("/")}
    className="flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-900 transition"
  >
    <span className="text-xl">←</span> Back to Homepage
  </button>
      <Footer />
      <LostFoundModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
