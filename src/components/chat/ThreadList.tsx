import { useEffect, useState } from "react";
import { fetchUserThreads } from "../../api/chatThreads";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare } from "lucide-react";

interface ThreadListProps {
  onSelectThread: (id: number) => void;
}

export default function ThreadList({ onSelectThread }: ThreadListProps) {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;

    async function load() {
      const data = await fetchUserThreads(user!.id);
      if (!mounted) return;
      setThreads(data);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return <p className="text-center p-4">Loading chats...</p>;
  }

  if (!threads.length) {
    return <p className="text-gray-500 text-center p-4">No chats yet.</p>;
  }

  return (
    <div className="p-4 space-y-3">
      {threads.map((t) => {
        const isOwner = t.owner_id === user?.id;
        const partner = isOwner ? t.requester : t.owner;

        return (
          <div
            key={t.id}
            className="p-3 border rounded-xl flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => onSelectThread(Number(t.id))}
          >
            {/* Item Image */}
            <img
              src={t.items?.image_url}
              className="w-12 h-12 rounded-lg object-cover"
            />

            {/* Chat details */}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {t.items?.title}
              </p>

              <p className="text-sm text-gray-600 truncate">
                Chat with {partner?.full_name || "User"}
              </p>

              {/* Last message preview */}
              {t.lastMsg ? (
                <p className="text-xs text-gray-400 truncate mt-1">
                  {t.lastMsg.sender_id === user?.id ? "You: " : ""}
                  {t.lastMsg.message}
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  No messages yet.
                </p>
              )}
            </div>

            {/* Right side icons */}
            <div className="flex flex-col items-center gap-1">
              <MessageSquare className="text-gray-500" size={18} />

              {/* Unread count */}
              {t.unread > 0 && (
                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {t.unread}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
