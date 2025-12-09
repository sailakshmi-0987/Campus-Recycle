import React, { useEffect, useState } from "react";
import { Recycle, Leaf, Cloud, Users } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export function EcoImpactCard() {
  const [stats, setStats] = useState({
    itemsShared: 0,
    activeUsers: 0,
    wasteSavedKg: 0,
    carbonReducedKg: 0,
    loading: true,
  });

  async function loadImpactData() {
    try {
      // 1️⃣ Count total items
      const { count: itemCount } = await supabase
        .from("items")
        .select("id", { count: "exact", head: true });

      // 2️⃣ Unique users — includes requesters also
      const { data: requesterList } = await supabase
        .from("item_requests")
        .select("requester_id");

      const { data: itemList } = await supabase
        .from("items")
        .select("user_id");

      const uniqueUsers = new Set([
        ...(itemList?.map((u) => u.user_id) || []),
        ...(requesterList?.map((u) => u.requester_id) || []),
      ]);

      const itemsShared = itemCount || 0;
      const activeUsers = uniqueUsers.size;

      const wasteSavedKg = Number((itemsShared * 1.5).toFixed(1));
      const carbonReducedKg = Number((itemsShared * 0.9).toFixed(1));

      setStats({
        itemsShared,
        activeUsers,
        wasteSavedKg,
        carbonReducedKg,
        loading: false,
      });
    } catch (error) {
      console.error("EcoImpactCard Error:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  }

  useEffect(() => {
    loadImpactData();

    // 🔄 FIXED REALTIME LISTENERS — use INSERT, UPDATE
    const channel = supabase
      .channel("eco-impact-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "items" },
        () => loadImpactData()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "items" },
        () => loadImpactData()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "item_requests" },
        () => loadImpactData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (stats.loading) return null;

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-xl border border-emerald-100 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-emerald-800 mb-6">
        🌱 Our Campus Impact
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ImpactBox
          icon={<Recycle size={32} className="text-emerald-600" />}
          value={stats.itemsShared}
          label="Items Shared"
        />

        <ImpactBox
          icon={<Leaf size={32} className="text-green-600" />}
          value={`${stats.wasteSavedKg} kg`}
          label="Waste Saved"
        />

        <ImpactBox
          icon={<Cloud size={32} className="text-cyan-600" />}
          value={`${stats.carbonReducedKg} kg`}
          label="CO₂ Reduced"
        />

        <ImpactBox
          icon={<Users size={32} className="text-emerald-500" />}
          value={stats.activeUsers}
          label="Active Users"
        />
      </div>

      <p className="text-gray-500 text-sm mt-6">
        Together, we’re reducing waste and creating a more sustainable campus. 🌍
      </p>
    </motion.div>
  );
}

function ImpactBox({ icon, value, label }: { icon: any; value: any; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-center mb-3">{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}
