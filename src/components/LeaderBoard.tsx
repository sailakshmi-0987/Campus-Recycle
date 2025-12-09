import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/leaderboard";
import { Leaf, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

interface LeaderboardEntry {
  points: number;
  user_id: string;
  profiles?: { full_name: string; college_name?: string };
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchLeaderboard();
      setLeaders(data);
    } catch (err) {
      console.error("Leaderboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Initial load + realtime refresh
  useEffect(() => {
    load();

    // Realtime updates for eco_points
    const subscription = supabase
      .channel("eco-points-watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eco_points" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading leaderboard...
      </div>
    );

  return (
    <motion.div
      className="w-full max-w-lg mx-auto bg-gradient-to-b from-emerald-50 to-white rounded-2xl shadow-lg p-6 border border-emerald-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-4">
        <Award className="text-emerald-600 w-6 h-6 mr-2" />
        <h2 className="text-2xl font-bold text-emerald-800">
          Top Eco Champions
        </h2>
      </div>

      {leaders.length === 0 ? (
        <p className="text-gray-500 text-center">No exchanges yet 🌱</p>
      ) : (
        <ul className="space-y-3">
          {leaders.map((entry, index) => (
            <motion.li
              key={entry.user_id}
              className={`flex items-center justify-between p-3 rounded-xl shadow-sm ${
                index === 0
                  ? "bg-gradient-to-r from-emerald-500 to-green-400 text-white"
                  : "bg-white border border-emerald-100"
              }`}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center space-x-3">
                {index === 0 ? (
                  <Leaf className="w-5 h-5" />
                ) : (
                  <Zap className="text-emerald-600 w-5 h-5" />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      index === 0 ? "text-white" : "text-emerald-800"
                    }`}
                  >
                    {entry.profiles?.full_name || "Unknown User"}
                  </p>
                  <p
                    className={`text-xs ${
                      index === 0 ? "text-emerald-50" : "text-gray-500"
                    }`}
                  >
                    {entry.profiles?.college_name || ""}
                  </p>
                </div>
              </div>

              <span
                className={`font-bold ${
                  index === 0 ? "text-white" : "text-emerald-700"
                }`}
              >
                {entry.points} pts
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
