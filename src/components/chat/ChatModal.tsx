import { X } from "lucide-react";
import ThreadList from "./ThreadList";
import ChatWindow from "./ChatWindow";
import { useState, useEffect } from "react";
import { fetchThread } from "../../api/chatThreads";

interface ChatModalProps {
  itemId?: string | null;          
  lostFoundId?: string | null;     
  requesterId: string;
  ownerId: string;
  onClose: () => void;
}

export default function ChatModal({
  itemId,
  lostFoundId,
  requesterId,
  ownerId,
  onClose,
}: ChatModalProps) {
  
  const [threadId, setThreadId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadThread() {
      try {
        const thread = await fetchThread(
          itemId ? itemId : null,   
          requesterId,
          ownerId,
          lostFoundId ? lostFoundId : null 
        );

        if (mounted && thread?.id) setThreadId(Number(thread.id));

      } catch (err) {
        console.error("ChatModal load error:", err);
      }
    }

    loadThread();
    return () => { mounted = false; };
  }, [itemId, requesterId, ownerId, lostFoundId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl flex h-[80vh] relative">
        
       
        <button onClick={onClose} className="absolute right-3 top-3">
          <X size={26} />
        </button>

       
        <div className="w-1/3 border-r">
          <ThreadList onSelectThread={setThreadId} />
        </div>

       
        <div className="flex-1">
          <ChatWindow threadId={threadId} />
        </div>

      </div>
    </div>
  );
}
