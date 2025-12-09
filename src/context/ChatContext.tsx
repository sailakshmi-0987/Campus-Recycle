// src/context/ChatContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchMessages, sendMessage, markThreadRead } from "../api/chat";
import { useAuth } from "./AuthContext";

export interface ChatMessage {
  id: number;
  thread_id: number;
  sender_id: string;
  message: string;
  is_read?: boolean;
  created_at: string;
  sender_name?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  currentThread: number | null;
  loadMessages: (threadId: number) => Promise<void>;
  sendChatMessage: (threadId: number, text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentThread, setCurrentThread] = useState<number | null>(null);
  const realtimeRef = useRef<any>(null);

  // Load messages for thread
  async function loadMessages(threadId: number) {
    setCurrentThread(threadId);
    const data = await fetchMessages(threadId);

    // Normalize sender_name
    const normalized: ChatMessage[] = (data || []).map((m: any) => ({
      id: m.id,
      thread_id: m.thread_id,
      sender_id: m.sender_id,
      message: m.message,
      is_read: m.is_read,
      created_at: m.created_at,
      sender_name: m.profiles?.full_name || undefined,
    }));

    setMessages(normalized);

    // mark other messages as read on open
    if (user) {
      try {
        await markThreadRead(threadId, user.id);
        // locally mark them read
        setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
      } catch (e) {
        console.error("Failed to mark thread read", e);
      }
    }

    // set up realtime subscription for this thread
    setupRealtime(threadId);
  }

  // Send message
  async function sendChatMessage(threadId: number, text: string) {
    if (!user) return;
    // optimistic UI
    const tempId = Date.now();
    const optimistic: ChatMessage = {
      id: tempId,
      thread_id: threadId,
      sender_id: user.id,
      message: text,
      is_read: true,
      created_at: new Date().toISOString(),
      sender_name: user.fullName,
    };

    setMessages((prev) => [...prev, optimistic]);

    // send to DB
    const { data, error } = await sendMessage(threadId, user.id, text);
    if (error) {
      console.error("sendMessage error", error);
      // remove optimistic or flag error - simple approach: reload messages
      await loadMessages(threadId);
      return;
    }

    // replace optimistic with real row (if IDs differ)
    if (data) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, id: data.id, created_at: data.created_at } : m))
      );
    }
  }

  // Setup realtime subscription per-thread
  function setupRealtime(threadId: number) {
    // cleanup previous
    if (realtimeRef.current) {
      supabase.removeChannel(realtimeRef.current);
      realtimeRef.current = null;
    }

    // create new channel
    const ch = supabase
      .channel(`thread-${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload: any) => {
          const newMsgRaw = payload.new;
          const newMsg: ChatMessage = {
            id: newMsgRaw.id,
            thread_id: Number(newMsgRaw.thread_id),
            sender_id: newMsgRaw.sender_id,
            message: newMsgRaw.message,
            is_read: newMsgRaw.is_read,
            created_at: newMsgRaw.created_at,
          };

          // If message already present (rare), ignore
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // If current user is viewing and the new message is from the other user, mark read
          if (user && newMsg.sender_id !== user.id) {
            markThreadRead(threadId, user.id).catch(console.error);
            // mark locally too
            setMessages((prev) => prev.map((m) => (m.id === newMsg.id ? { ...m, is_read: true } : m)));
          }
        }
      )
      .subscribe();

    realtimeRef.current = ch;
  }

  // When provider unmounts cleanup
  useEffect(() => {
    return () => {
      if (realtimeRef.current) supabase.removeChannel(realtimeRef.current);
    };
  }, []);

  return (
    <ChatContext.Provider value={{ messages, currentThread, loadMessages, sendChatMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be inside ChatProvider");
  return ctx;
}
