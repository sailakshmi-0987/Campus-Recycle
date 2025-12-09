import  { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchThread } from "../../api/chatThreads"; 
import { updateLostFoundStatus } from "../../api/lostFound";
import toast from "react-hot-toast";
import ChatModal from "../chat/ChatModal";

export default function LostFoundCard({ item }: { item: any }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [openChat, setOpenChat] = useState(false);
  const [threadId, setThreadId] = useState<number | null>(null);

  const contactOwner = async () => {
    if (!user) return toast.error("Please sign in to contact the owner.");

    try {
      setLoading(true);

      const thread = await fetchThread(
        null,           
        user.id,        
        item.userId,    
        item.id         
      );

      setThreadId(Number(thread.id));
      setOpenChat(true);

    } catch (err: any) {
      console.error(err);
      toast.error("Unable to start chat.");
    } finally {
      setLoading(false);
    }
  };

  const onMarkReturned = async () => {
    if (!user) return toast.error("Please sign in.");
    setLoading(true);
    try {
      await updateLostFoundStatus(Number(item.id), "returned");
      toast.success("Marked as returned.");
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow flex gap-4">
        <img
          src={item.imageUrl || "/placeholder.png"}
          className="w-28 h-28 rounded-lg object-cover"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>

          <p className="text-xs text-gray-500 mt-2">Location: {item.location}</p>
          <p className="text-xs text-gray-400 mt-1">
            Posted: {new Date(item.createdAt).toLocaleString()}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={contactOwner}
              className="px-3 py-1 rounded bg-emerald-600 text-white"
              disabled={loading}
            >
              {loading ? "Opening..." : "Contact"}
            </button>

            {item.userId === user?.id && item.status === "open" && (
              <button
                onClick={onMarkReturned}
                disabled={loading}
                className="px-3 py-1 rounded bg-gray-200"
              >
                {loading ? "Updating..." : "Mark Returned"}
              </button>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {item.kind}
          </span>
          <div className="mt-4 text-xs text-gray-500">{item.status}</div>
        </div>
      </div>

      {openChat && threadId && (
        <ChatModal
          itemId={null}
          requesterId={user!.id}
          ownerId={item.userId}
          lostFoundId={String(item.id)}
          onClose={() => setOpenChat(false)}
        />
      )}
    </>
  );
}
