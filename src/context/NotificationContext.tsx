import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastCount, setLastCount] = useState(0);

  // -------------------------
  // Load notifications
  // -------------------------
  async function load() {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      if (data.length > lastCount && lastCount !== 0) {
        const latest = data[0];

        // toast preview
        toast(`${latest.title}: ${latest.message}`, { icon: "🔔" });

        // notification sound
        const audio = new Audio("/notify.mp3");  // <-- FIXED PATH
        audio.volume = 0.8;
        audio.play().catch(() => {});

        // vibration for mobile
        if (navigator.vibrate) navigator.vibrate(80);
      }

      setLastCount(data.length);
      setNotifications(data as Notification[]);
    }
  }

  // -------------------------
  // Realtime listener
  // -------------------------
  useEffect(() => {
    if (!user) return;

    load();

    const channel = supabase
      .channel("notifications-rt")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // -------------------------
  // Mark single notification
  // -------------------------
  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  // -------------------------
  // Mark all notifications read
  // -------------------------
  async function markAllAsRead() {
    if (!user) return;

    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be inside provider");
  return ctx;
}
