import ThreadList from "../components/chat/ThreadList";
import ChatWindow from "../components/chat/ChatWindow";

import { useState } from "react";

export default function ChatInbox() {
  const [threadId, setThreadId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {/* Thread List */}
      <div className="col-span-1 border rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <ThreadList onSelectThread={(id) => setThreadId(id)} />
      </div>

      {/* Chat Window */}
      {threadId && (
        <div className="col-span-2 border rounded-xl p-4">
          <ChatWindow threadId={threadId} />
        </div>
      )}
    </div>
  );
}
