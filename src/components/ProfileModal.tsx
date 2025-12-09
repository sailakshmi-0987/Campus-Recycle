import  { useState } from "react";
import { X, Package, Inbox, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { supabase } from "../lib/supabase";
import { sendNotification } from "../api/notifications";
import ChatModal from "./chat/ChatModal";

import { acceptRequest, completeExchange } from "../api/itemRequests";
import toast from "react-hot-toast";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const {
    items,
    getUserItems,
    getUserRequests,
    getRequestsForItem,
    loadItems,
    loadRequests
  } = useData();

  const [activeTab, setActiveTab] = useState<"items" | "requests" | "received">("items");

  const [chatInfo, setChatInfo] = useState<{ itemId: string; requesterId: string } | null>(null);

  if (!isOpen || !user) return null;

  const userItems = getUserItems(user.id);
  const userRequests = getUserRequests(user.id);

  const receivedRequests = items
    .filter((item) => item.userId === user.id)
    .flatMap((item) =>
      getRequestsForItem(item.id).map((req) => ({
        ...req,
        item,
      }))
    );


  function openChat(itemId: string, requesterId: string) {
    setChatInfo({ itemId, requesterId });
  }

  
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptRequest(Number(requestId));

      toast.success("Request accepted!");

      await loadRequests();
      await loadItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to accept");
    }
  };


  const handleRejectRequest = async (requestId: string, requesterId: string, itemTitle: string) => {
    try {
      await supabase.from("item_requests").update({ status: "rejected" }).eq("id", requestId);

      await sendNotification(
        requesterId,
        "request_rejected",
        "Request Rejected",
        `Your request for "${itemTitle}" was rejected.`
      );

      toast("Request rejected");
    } catch {
      toast.error("Error rejecting request");
    }
  };


const handleCompleteRequest = async (requestId: string) => {
  try {
    await completeExchange(Number(requestId));

    toast.success("✅ Exchange completed & points credited!");

    await loadRequests();
    await loadItems();

  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Error completing exchange");
  }
};



  return (
    <>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
          <div className="p-8 border-b relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
            <div className="text-gray-600 space-y-1">
              <p className="text-lg font-medium">{user.fullName}</p>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm">{user.collegeName}</p>
              {user.phone && <p className="text-sm">{user.phone}</p>}
            </div>
          </div>

      
          <div className="border-b flex">
            <button
              onClick={() => setActiveTab("items")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "items"
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              <Package size={18} className="inline-block mr-2" />
              My Items ({userItems.length})
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "requests"
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              <Inbox size={18} className="inline-block mr-2" />
              My Requests ({userRequests.length})
            </button>

            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "received"
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              <CheckCircle size={18} className="inline-block mr-2" />
              Received ({receivedRequests.length})
            </button>
          </div>

          <div className="p-8 max-h-96 overflow-y-auto">
         
            {activeTab === "items" &&
              userItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg mb-4 flex space-x-4">
                  <img src={item.imageUrl} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}

            
            {activeTab === "requests" &&
  userRequests.map((req) => {
    const item = items.find((i) => i.id === req.itemId);
    return (
      <div
        key={req.id}
        className="p-4 border rounded-lg mb-4 flex space-x-4"
      >
        <img
          src={item?.imageUrl}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{item?.title}</h3>
          <p className="text-sm text-gray-600">{req.message}</p>

          <button
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg"
            onClick={() => openChat(req.itemId, item?.userId!)}
          >
            Chat with Owner
          </button>
        </div>
      </div>
    );
  })}


            {activeTab === "received" &&
              receivedRequests.map((req) => (
                <div key={req.id} className="p-4 border rounded-lg mb-4">
                  <div className="flex space-x-4">
                    <img src={req.item.imageUrl} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{req.item.title}</h3>
                      <p className="text-sm text-gray-600">{req.message}</p>
                    </div>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex mt-3 space-x-2">
                      <button
                        className="flex-1 bg-emerald-600 text-white py-2 rounded-lg"
                        onClick={() => handleAcceptRequest(req.id)}
                      >
                        Accept
                      </button>

                      <button
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                        onClick={() =>
                          handleRejectRequest(req.id, req.requesterId, req.item.title)
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {req.status === "accepted" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                        onClick={() => openChat(req.itemId, req.requesterId)}
                      >
                        Chat
                      </button>

                      <button
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                        onClick={() => handleCompleteRequest(req.id)}
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {chatInfo && (
        <ChatModal
          itemId={chatInfo.itemId}
          requesterId={chatInfo.requesterId}
          ownerId={user.id}
          onClose={() => setChatInfo(null)}
        />
      )}
    </>
  );
}
