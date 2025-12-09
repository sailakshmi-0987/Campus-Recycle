import  { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Trash2, CheckCircle} from "lucide-react";
import toast from "react-hot-toast";

export default function ReportsTable() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);


  const loadReports = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("reports")
      .select(`
        id,
        reason,
        details,
        status,
        created_at,
        item:items(*),
        reporter:profiles(full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } else {
      setReports(data);
    }

    setLoading(false);
  };

  // Load on mount
  useEffect(() => {
    loadReports();
  }, []);

  // -------------------------------
  // Mark as Reviewed
  // -------------------------------
  const markReviewed = async (id: number) => {
    const { error } = await supabase
      .from("reports")
      .update({ status: "reviewed" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update report");
    } else {
      toast.success("Report marked as reviewed");
      loadReports();
    }
  };

  // -------------------------------
  // Delete Item
  // -------------------------------
  const deleteItem = async (itemId: number) => {
    const { error } = await supabase.from("items").delete().eq("id", itemId);

    if (error) {
      toast.error("Failed to delete item");
    } else {
      toast.success("Item deleted successfully");
      loadReports();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">⚠️ User Reports</h2>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reports found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Reporter</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Details</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-semibold">{r.item?.title}</p>
                    <p className="text-xs text-gray-500">
                      ID: {r.item?.id}
                    </p>
                  </td>

                  <td className="p-3">
                    <p>{r.reporter?.full_name}</p>
                    <p className="text-xs text-gray-500">{r.reporter?.email}</p>
                  </td>

                  <td className="p-3">{r.reason}</td>

                  <td className="p-3 text-gray-600 text-sm">
                    {r.details || "—"}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3 text-sm">
                    {new Date(r.created_at).toLocaleString()}
                  </td>

                  <td className="p-3 flex items-center space-x-3 justify-center">
                    {/* Mark Reviewed */}
                    <button
                      onClick={() => markReviewed(r.id)}
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Mark as Reviewed"
                    >
                      <CheckCircle size={20} />
                    </button>

                    {/* Delete Item */}
                    <button
                      onClick={() => deleteItem(r.item?.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
