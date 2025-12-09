import { useEffect, useState } from "react";
import { Ban, Undo2} from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  college_name?: string;
  phone?: string;
  role: "user" | "admin";
  is_banned: boolean;
  created_at?: string;
};

export default function UsersTable() {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, college_name, phone, role, is_banned, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }


  async function promote(userId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User promoted to admin");
      loadUsers();
    } catch (err) {
      toast.error("Failed to promote user");
    }
  }

  async function demote(userId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "user" })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User demoted");
      loadUsers();
    } catch (err) {
      toast.error("Failed to demote user");
    }
  }


  async function ban(userId: string) {
    if (!confirm("Ban this user? They will not be able to log in.")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: true })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User banned");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to ban user");
    }
  }
  
  async function unban(userId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: false })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User unbanned");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to unban user");
    }
  }

  
  async function removeProfile(userId: string) {
    if (!confirm("Delete this profile row from database?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast.success("Profile deleted");
      loadUsers();
    } catch (err) {
      toast.error("Failed to delete profile");
    }
  }

 
  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>

        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
            className="px-3 py-2 border rounded-lg"
          />
          <button onClick={loadUsers} className="px-3 py-2 border rounded-lg">
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">College</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Joined</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-6">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-6 text-center">No users found</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.full_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.college_name || "-"}</td>

                  {/* Role */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Banned / Active */}
                  <td className="p-3 text-center">
                    {u.is_banned ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        BANNED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      {/* Admin promotion/demotion */}
                      {u.role === "admin" ? (
                        <button
                          onClick={() => demote(u.id)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                        >
                          Demote
                        </button>
                      ) : (
                        <button
                          onClick={() => promote(u.id)}
                          className="px-2 py-1 bg-purple-600 text-white rounded"
                        >
                          Promote
                        </button>
                      )}

                      {/* Ban / Unban */}
                      {u.is_banned ? (
                        <button
                          onClick={() => unban(u.id)}
                          className="px-2 py-1 bg-emerald-600 text-white rounded flex items-center"
                        >
                          <Undo2 size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => ban(u.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded flex items-center"
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      {/* Delete profile */}
                      <button
                        onClick={() => removeProfile(u.id)}
                        className="px-2 py-1 border rounded"
                      >
                        Delete
                      </button>
                    </div>
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
