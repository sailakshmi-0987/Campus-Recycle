import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { Mail, CheckCircle, Clock } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  resolved: boolean;
}

export default function ContactInbox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Only admins should access
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Access Denied. Admins Only.
      </div>
    );
  }

  // Load messages
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      setMessages(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function markResolved(id: number) {
    await supabase
      .from("contact_messages")
      .update({ resolved: true })
      .eq("id", id);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, resolved: true } : m
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
          <Mail size={36} /> Contact Inbox
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading messages...</p>
        ) : !messages.length ? (
          <p className="text-gray-500 text-center">No messages found.</p>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {msg.name}
                    </p>
                    <p className="text-sm text-gray-600">{msg.email}</p>
                  </div>

                  <div className="text-sm text-gray-500 flex gap-2 items-center">
                    <Clock size={16} />
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>

                <p className="mt-4 text-gray-700">{msg.message}</p>

                <div className="mt-5">
                  {!msg.resolved ? (
                    <button
                      onClick={() => markResolved(msg.id)}
                      className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
                    >
                      <CheckCircle size={18} /> Mark as Resolved
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-semibold flex items-center gap-2">
                      <CheckCircle size={18} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
