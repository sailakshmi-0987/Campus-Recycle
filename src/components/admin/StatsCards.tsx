import  { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    activeRequests: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const [{ count: users }, { count: items }, { count: requests }, { count: reports }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("items").select("id", { count: "exact", head: true }),
        supabase.from("item_requests").select("id", { count: "exact", head: true }),
        supabase.from("reports").select("id", { count: "exact", head: true }).match(() => ({ count: 0 })),
      ]);
      setStats({
        totalUsers: users || 0,
        totalItems: items || 0,
        activeRequests: requests || 0,
        reports: reports || 0,
      });
    } catch (err) {
      console.error("Stats load:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">Overview</h2>
        <button
          onClick={loadStats}
          className="text-sm px-3 py-2 border rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">
            {loading ? "..." : stats.totalUsers}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-sm text-gray-500">Total Items</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {loading ? "..." : stats.totalItems}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-sm text-gray-500">Requests</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">
            {loading ? "..." : stats.activeRequests}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-sm text-gray-500">Reports</div>
          <div className="text-3xl font-bold text-red-600 mt-2">
            {loading ? "..." : stats.reports}
          </div>
        </div>
      </div>
    </div>
  );
}
