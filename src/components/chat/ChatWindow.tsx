import  { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

export default function ChatWindow({ threadId }: { threadId: number | null }) {
  const { messages, loadMessages, sendChatMessage } = useChat();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threadId) return;
    loadMessages(threadId).catch(console.error);
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!threadId) return <div className="flex items-center justify-center h-full text-gray-400">Select a conversation</div>;

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendChatMessage(threadId, text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`max-w-lg p-3 rounded-xl ${mine ? "bg-emerald-200 ml-auto" : "bg-gray-100"}`}>
              <div className="text-sm">{m.message}</div>
              <div className="text-xs text-gray-500 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="Type a message..." />
        <button onClick={handleSend} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Send</button>
      </div>
    </div>
  );
}
