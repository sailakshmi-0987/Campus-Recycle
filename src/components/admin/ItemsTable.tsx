import  { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

type ItemRow = {
  id: number;
  title: string;
  user_id: string;
  status: string;
  created_at: string;
  pickup_location?: string;
  category?: string;
};

export default function ItemsTable() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    setLoading(true);
    try {
      // join to get owner name
      const { data, error } = await supabase
        .from("items")
        .select(`id, title, status, created_at, user_id, pickup_location, category, profiles(full_name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems((data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        user_id: d.user_id,
        status: d.status,
        created_at: d.created_at,
        pickup_location: d.pickup_location,
        category: d.category,
        // profiles included for UI
        full_name: d.profiles?.full_name,
      } as any)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(itemId: number) {
    if (!confirm("Delete this item permanently?")) return;
    try {
      const { error } = await supabase.from("items").delete().eq("id", itemId);
      if (error) throw error;
      toast.success("Item deleted");
      loadItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  }

  async function setStatus(itemId: number, status: string) {
    try {
      const { error } = await supabase.from("items").update({ status }).eq("id", itemId);
      if (error) throw error;
      toast.success("Status updated");
      loadItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  }

  const filtered = items.filter(i => i.title.toLowerCase().includes(q.toLowerCase()) || (i as any).full_name?.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Items</h2>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or owner" className="px-3 py-2 border rounded-lg" />
          <button onClick={loadItems} className="px-3 py-2 border rounded-lg">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-6">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="p-6">No items</td></tr>
            ) : filtered.map((it: any) => (
              <tr key={it.id} className="border-b">
                <td className="p-3">{it.title}</td>
                <td className="p-3">{(it as any).full_name || it.user_id}</td>
                <td className="p-3 capitalize">{it.category}</td>
                <td className="p-3 capitalize">{it.status}</td>
                <td className="p-3">{new Date(it.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {it.status !== "given-away" && <button onClick={() => setStatus(it.id, "given-away")} className="px-2 py-1 bg-blue-600 text-white rounded">Mark Given</button>}
                    {it.status !== "requested" && <button onClick={() => setStatus(it.id, "requested")} className="px-2 py-1 bg-amber-500 text-white rounded">Mark Requested</button>}
                    <button onClick={() => removeItem(it.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
