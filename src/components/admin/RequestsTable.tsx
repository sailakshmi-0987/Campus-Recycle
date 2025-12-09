import  { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Check, XCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface AdminRequestRow {
  id: string;
  item_id: string;
  requester_id: string;
  message: string;
  status: string;
  requested_at: string;
  item_title: string;
  requester_name: string;
}

export default function RequestsTable() {
  const [rows, setRows] = useState<AdminRequestRow[]>([]);
  const [loading, setLoading] = useState(false);


useEffect(() => {
  loadData();

  const channel = supabase.channel("admin-requests");

  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table: "item_requests" },
    () => loadData()
  );

  channel.subscribe(); 

  return () => {
    supabase.removeChannel(channel);  
  };
}, []);

 
  async function loadData() {
    setLoading(true);

    try {
      
      const { data: reqs, error } = await supabase
        .from("item_requests")
        .select("*")
        .order("requested_at", { ascending: false });

      if (error) throw error;

      if (!reqs || reqs.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      const itemIds = reqs.map((r) => r.item_id);
      const { data: items } = await supabase
        .from("items")
        .select("id, title")
        .in("id", itemIds);

      const requesterIds = reqs.map((r) => r.requester_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", requesterIds);

      const itemMap = Object.fromEntries(
        items?.map((i) => [String(i.id), i.title]) || []
      );

      const profileMap = Object.fromEntries(
        profiles?.map((p) => [String(p.id), p.full_name]) || []
      );

      setRows(
        reqs.map((r) => ({
          id: String(r.id),
          item_id: String(r.item_id),
          requester_id: r.requester_id,
          message: r.message,
          status: r.status,
          requested_at: r.requested_at,
          item_title: itemMap[String(r.item_id)] ?? "Unknown",
          requester_name: profileMap[r.requester_id] ?? "Unknown User",
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    }

    setLoading(false);
  }


  async function handleAccept(requestId: string) {
    const { data: session } = await supabase.auth.getUser();
    const adminId = session?.user?.id;

    const { error } = await supabase.rpc("accept_item_request", {
      request_id: Number(requestId),
      user_uuid: adminId,
    });

    if (error) {
      toast.error("Failed to accept request");
      console.error(error);
      return;
    }

    toast.success("Request accepted");
    loadData();
  }

  async function handleReject(requestId: string) {
    const { error } = await supabase
      .from("item_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to reject");
      return;
    }

    toast("Request rejected");
    loadData();
  }

 
  async function handleComplete(requestId: string) {
    const { data: session } = await supabase.auth.getUser();
    const adminId = session?.user?.id;

    const { error } = await supabase.rpc("complete_item_exchange", {
      request_id: Number(requestId),
      user_uuid: adminId,
    });

    if (error) {
      toast.error("Failed to complete exchange");
      console.error(error);
      return;
    }

    toast.success("Exchange marked as completed 🎉");
    loadData();
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Item Requests</h2>
        <button
          onClick={loadData}
          className="border px-3 py-2 rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Requester</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td className="p-6">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-6">No requests found</td></tr>
            ) : (
              rows.map((req) => (
                <tr key={req.id} className="border-b">
                  <td className="p-3">{req.item_title}</td>
                  <td className="p-3">{req.requester_name}</td>
                  <td className="p-3">{req.message}</td>
                  <td className="p-3 capitalize">{req.status}</td>
                  <td className="p-3">
                    {new Date(req.requested_at).toLocaleString()}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">

                    {/* Accept */}
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded flex items-center gap-1"
                        >
                          <Check size={16} /> Accept
                        </button>

                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}

                    {/* Complete */}
                    {req.status === "accepted" && (
                      <button
                        onClick={() => handleComplete(req.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-1"
                      >
                        <CheckCircle size={16} /> Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
