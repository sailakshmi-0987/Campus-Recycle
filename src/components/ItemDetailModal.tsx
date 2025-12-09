import { useState } from "react";
import { X, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Item } from "../types";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { sendNotification } from "../api/notifications";

import toast from "react-hot-toast";

interface ItemDetailModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const conditionLabels = {
  new: "Brand New",
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
};

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const { user } = useAuth();
  const { addRequest, addReport } = useData();

  const [message, setMessage] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  if (!isOpen || !item) return null;

  const isOwner = user?.id === item.userId;

  // --- SEND REQUEST ---
  
  const handleRequest = async () => {
  if (!user || !message.trim()) return;

  try {
    // 1) Create request in DB
    await addRequest({
      itemId: item.id,
      requesterId: user.id,
      message: message.trim(),
    });

    // 2) Fetch item owner details
    const { data: ownerProfile } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", item.userId)
      .single();

    const ownerId = item.userId;
    const ownerName = ownerProfile?.full_name || "Item Owner";
    const requesterName = user.fullName;

    // 3) Send notification to OWNER
    await sendNotification(
      ownerId,
      "request_received",
      "New Request Received",
      `${requesterName} requested your item "${item.title}".`
    );

    // 4) Optional confirmation to requester (use allowed type)
    await sendNotification(
      user.id,
      "pickup_updated",
      "Request Sent",
      `Your request for "${item.title}" has been sent to ${ownerName}.`
    );

    toast.success("Request sent to the item owner!");

    setMessage("");
    setShowRequestForm(false);
    onClose();

  } catch (err: any) {
    console.error(err);
    toast.error("Failed to send request");
  }
};

  // --- SEND REPORT (FIXED TYPE ERROR) ---
  const handleReport = async () => {
    if (!user) return toast.error("Please sign in to report.");

    await addReport({
      itemId:item.id, // 🔥 FIXED ERROR: convert string → number
      reporterId: user.id,
      reason: reportReason,
      details: reportDetails,
    });

    toast.success("Report submitted! Our team will review it.");

    setShowReportForm(false);
    setReportReason("");
    setReportDetails("");

    onClose();
  };

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="relative h-80 w-full overflow-hidden">
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-white/80 px-4 py-2 rounded-xl shadow">
            <p className="text-sm font-semibold text-gray-700">Posted {timeAgo(item.createdAt)}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-bold shadow ${
                item.status === "available"
                  ? "bg-emerald-100 text-emerald-700"
                  : item.status === "requested"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {item.status}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Category</p>
              <p className="font-semibold text-gray-800 capitalize">{item.category}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Condition</p>
              <p className="font-semibold text-gray-800">{conditionLabels[item.condition]}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Pickup Location</p>
              <p className="font-semibold text-gray-800 line-clamp-1">{item.pickupLocation}</p>
            </div>
          </div>

          {/* Pickup Row */}
          <div className="flex items-center space-x-2 text-gray-700 mb-6">
            <MapPin size={20} />
            <span>{item.pickupLocation}</span>
          </div>

          {/* Owner View */}
          {isOwner && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-center font-medium shadow">
              This item belongs to you 🌿
            </div>
          )}

          {/* Request Item */}
          {!isOwner && item.status === "available" && user && (
            <div className="mt-6 border-t pt-6">
              {!showRequestForm ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowRequestForm(true)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Request This Item
                </motion.button>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Write a short message..."
                  />

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="flex-1 border py-3 rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleRequest}
                      disabled={!message.trim()}
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-lg disabled:opacity-50"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Send size={18} />
                        <span>Send Request</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REPORT ITEM */}
          <div className="border-t pt-6 mt-6">
            {!showReportForm ? (
              <button
                onClick={() => setShowReportForm(true)}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Report This Item
              </button>
            ) : (
              <div className="space-y-4">
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                >
                  <option value="">Select reason</option>
                  <option value="fake item">Fake or misleading item</option>
                  <option value="inappropriate content">Inappropriate image/content</option>
                  <option value="spam">Spam or repeated posting</option>
                  <option value="suspicious">Suspicious behavior</option>
                </select>

                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  className="w-full border px-4 py-2 rounded-lg"
                  placeholder="Optional details..."
                />

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReportForm(false)}
                    className="flex-1 border py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleReport}
                    disabled={!reportReason}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-red-700"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>

          {!user && (
            <div className="mt-6 bg-gray-50 p-4 text-center text-gray-600 rounded-xl">
              Please sign in to request or report this item.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
