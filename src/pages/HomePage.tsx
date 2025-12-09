import { useState } from "react";
import { motion } from "framer-motion";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import Leaderboard from "../components/LeaderBoard";
import { ItemsGrid } from "../components/ItemsGrid";
import AdminDashboardPage from "./AdminDashboard";
import { AuthModal } from "../components/AuthModal";
import { PostItemModal } from "../components/PostItemModal";
import { ProfileModal } from "../components/ProfileModal";
import { ItemDetailModal } from "../components/ItemDetailModal";
import { EcoImpactCard } from "../components/EcoImpactCard";

import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Item } from "../types";
import { Footer } from "../components/Footer";



export default function HomePage() {
  const { items } = useData();
  const { user } = useAuth();

  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (showAdminDashboard) {
    return <AdminDashboardPage onClose={() => setShowAdminDashboard(false)} />;
  }
  return (
  <div className="min-h-screen bg-gray-50">

    {/* SHOW ADMIN DASHBOARD */}
    {showAdminDashboard ? (
      <AdminDashboardPage onClose={() => setShowAdminDashboard(false)} />
    ) : (
      <>
        {/* Header */}
        <Header
          onLoginClick={() => setAuthOpen(true)}
          onPostItemClick={() => setPostModalOpen(true)}
          onProfileClick={() => setProfileOpen(true)}
          onAdminClick={() => setShowAdminDashboard(true)}
        />

        {/* Homepage Content */}
        {!user && (
          <>
            <Hero
              onGetStarted={() =>
                user ? setPostModalOpen(true) : setAuthOpen(true)
              }
            />

            {/* Leaderboard */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 px-6 md:px-12 pb-20 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3">
                Campus Sustainability Leaders
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                Meet the top contributors who are making our campus cleaner and greener —
                one exchange at a time.
              </p>
              <Leaderboard />
            </motion.section>

            {/* Eco Impact */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12 px-6 md:px-12 pb-20"
            >
              <EcoImpactCard />
            </motion.section>
          </>
        )}

        {/* Eco Impact for logged-in users */}
        {user && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 px-6 md:px-12 pb-20"
          >
            <EcoImpactCard />
          </motion.section>
        )}

        {/* Items Grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-emerald-800 mt-12 mb-4">
            Explore Available Items
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Browse and request items your campus peers are sharing
          </p>

          <ItemsGrid
            items={items}
            onItemClick={(item) =>
              user ? setSelectedItem(item) : setAuthOpen(true)
            }
          />
        </motion.section>

        {/* Item Modal */}
        <ItemDetailModal
          item={selectedItem}
          isOpen={selectedItem !== null}
          onClose={() => setSelectedItem(null)}
        />

        {/* Modals */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
        <PostItemModal
          isOpen={isPostModalOpen}
          onClose={() => setPostModalOpen(false)}
        />
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setProfileOpen(false)}
        />

        {/* Footer */}
        <Footer />
      </>
    )}

  </div>
);
}