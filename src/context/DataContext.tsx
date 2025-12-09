// src/context/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Item, Request } from "../types";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";
import { sendNotification } from "../api/notifications";

// ---------------------- TYPES ----------------------
export interface Report {
  id?: number;
  itemId: string;
  reporterId: string;
  reason: string;
  details?: string;
  created_at?: string;
}

interface DataContextType {
  items: Item[];
  requests: Request[];
  reports: Report[];

  addItem: (item: Omit<Item, "id" | "createdAt" | "user">) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;

  addRequest: (
    req: Omit<Request, "id" | "createdAt" | "status" | "item" | "requester">
  ) => Promise<void>;

  updateRequest: (id: string, status: Request["status"]) => Promise<void>;

  addReport: (report: Report) => Promise<void>;

  loadItems: () => Promise<void>;
  loadRequests: () => Promise<void>;
  loadReports: () => Promise<void>;

  getItemById: (id: string) => Item | undefined;
  getRequestsForItem: (itemId: string) => Request[];
  getUserItems: (userId: string) => Item[];
  getUserRequests: (userId: string) => Request[];

  // LOST & FOUND
  lostFound: any[];
  loadLostFound: () => Promise<void>;
  addLostFound: (payload: {
    userId: string;
    title: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    kind: "lost" | "found";
  }) => Promise<void>;
  updateLostFoundStatus: (id: string, newStatus: "returned") => Promise<void>;
  getUserProfile: (id: string) => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// =====================================================
//                     PROVIDER
// =====================================================
export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [lostFound, setLostFound] = useState<any[]>([]);

  // =================== INITIAL LOAD ===================
  useEffect(() => {
    loadItems();
    loadLostFound();

    if (!user) return;

    loadRequests();
    loadReports();
  }, [user]);

  // ============= REALTIME SUBSCRIPTIONS ===============
  useEffect(() => {
    if (!user) return;

    const itemChannel = supabase
      .channel("rt-items")
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, loadItems)
      .subscribe();

    const requestChannel = supabase
      .channel("rt-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "item_requests" }, loadRequests)
      .subscribe();

    const reportChannel = supabase
      .channel("rt-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, loadReports)
      .subscribe();

    const lostFoundChannel = supabase
      .channel("rt-lostfound")
      .on("postgres_changes", { event: "*", schema: "public", table: "lost_found" }, loadLostFound)
      .subscribe();

    return () => {
      supabase.removeChannel(itemChannel);
      supabase.removeChannel(requestChannel);
      supabase.removeChannel(reportChannel);
      supabase.removeChannel(lostFoundChannel);
    };
  }, [user]);

  // =====================================================
  //                     LOADERS
  // =====================================================
  const loadItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return console.error("Load Items Error:", error);

    setItems(
      data.map((item: any) => ({
        id: String(item.id),
        userId: String(item.user_id),
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition,
        imageUrl: item.image_url,
        pickupLocation: item.pickup_location,
        status: item.status,
        createdAt: new Date(item.created_at),
      }))
    );
  };

  // =====================================================
  //                 LOST & FOUND LOADER
  // =====================================================
  const loadLostFound = async () => {
    const { data, error } = await supabase
      .from("lost_found")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return console.error("Load LostFound Error:", error);

    setLostFound(
      (data || []).map((r: any) => ({
        id: String(r.id),
        userId: String(r.user_id),
        title: r.title,
        description: r.description,
        imageUrl: r.image_url,
        location: r.location,
        kind: r.kind,
        status: r.status,
        createdAt: new Date(r.created_at),
      }))
    );
  };

  // =====================================================
  //            ADD LOST / FOUND (WITH IMAGE)
  // =====================================================
  const addLostFound = async (payload: {
    userId: string;
    title: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    kind: "lost" | "found";
  }) => {
    const { error } = await supabase.from("lost_found").insert({
      user_id: payload.userId,
      title: payload.title,
      description: payload.description,
      image_url: payload.imageUrl,
      location: payload.location,
      kind: payload.kind,
      status: "open",
    });

    if (error) throw error;

    await loadLostFound();
  };

  // =====================================================
  //             UPDATE LOST/FOUND STATUS
  // =====================================================
  const updateLostFoundStatus = async (id: string, newStatus: "returned") => {
    const { error } = await supabase
      .from("lost_found")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) throw error;

    loadLostFound();
  };

  // =====================================================
  //        FETCH USER PROFILE (USED BY CONTACT BUTTON)
  // =====================================================
  const getUserProfile = async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  };

  // =====================================================
  //                     REQUEST / REPORT / ITEMS CRUD
  // =====================================================
  const loadRequests = async () => {
    const { data, error } = await supabase
      .from("item_requests")
      .select("*")
      .order("requested_at", { ascending: false });

    if (error) return console.error("Load Requests Error:", error);

    setRequests(
      data.map((req: any) => ({
        id: String(req.id),
        itemId: String(req.item_id),
        requesterId: req.requester_id,
        message: req.message,
        status: req.status,
        createdAt: new Date(req.requested_at),
      }))
    );
  };

  const loadReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return console.error("Load Reports Error:", error);

    setReports(
      data.map((r: any) => ({
        id: r.id,
        itemId: String(r.item_id),
        reporterId: r.reporter_id,
        reason: r.reason,
        details: r.details,
        created_at: r.created_at,
      }))
    );
  };

  const addItem = async (item: Omit<Item, "id" | "createdAt" | "user">) => {
    const { error } = await supabase.from("items").insert({
      user_id: item.userId,
      title: item.title,
      description: item.description,
      category: item.category,
      condition: item.condition,
      pickup_location: item.pickupLocation,
      image_url: item.imageUrl,
      status: item.status,
    });

    if (error) throw error;
    loadItems();
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    const { error } = await supabase.from("items").update(updates).eq("id", id);
    if (error) throw error;
    loadItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("items").delete().eq("id", id);
    loadItems();
    loadRequests();
  };

  const addRequest = async (
    req: Omit<Request, "id" | "createdAt" | "status" | "item" | "requester">
  ) => {
    const { data, error } = await supabase
      .from("item_requests")
      .insert({
        item_id: Number(req.itemId),
        requester_id: req.requesterId,
        message: req.message,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    const { data: itemRow } = await supabase
      .from("items")
      .select("id, user_id, title")
      .eq("id", req.itemId)
      .single();

    if (itemRow) {
      const { data: requesterProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", req.requesterId)
        .single();

      await sendNotification(
        itemRow.user_id,
        "request_received",
        "New Request Received",
        `${requesterProfile?.full_name || "Someone"} requested your item "${itemRow.title}".`
      );
    }

    loadRequests();
  };

  const updateRequest = async (id: string, status: Request["status"]) => {
    const { data, error } = await supabase
      .from("item_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const request = data;

    const { data: itemRow } = await supabase
      .from("items")
      .select("title")
      .eq("id", request.item_id)
      .single();

    const itemTitle = itemRow?.title || "your item";

    if (status === "accepted") {
      await sendNotification(
        request.requester_id,
        "request_accepted",
        "Request Accepted 🎉",
        `Your request for "${itemTitle}" was accepted.`
      );
    }

    if (status === "rejected") {
      await sendNotification(
        request.requester_id,
        "request_rejected",
        "Request Rejected",
        `Your request for "${itemTitle}" was rejected.`
      );
    }

    if (status === "completed") {
      await sendNotification(
        request.requester_id,
        "exchange_completed",
        "Exchange Completed",
        `Your exchange for "${itemTitle}" is now completed.`
      );
    }

    loadRequests();
  };

  const addReport = async (report: Report) => {
    await supabase.from("reports").insert({
      item_id: Number(report.itemId),
      reporter_id: report.reporterId,
      reason: report.reason,
      details: report.details,
    });

    loadReports();
  };

  // =====================================================
  //                     HELPERS
  // =====================================================
  const getItemById = (id: string) => items.find((i) => i.id === id);
  const getRequestsForItem = (itemId: string) => requests.filter((r) => r.itemId === itemId);
  const getUserItems = (userId: string) => items.filter((i) => i.userId === userId);
  const getUserRequests = (userId: string) => requests.filter((r) => r.requesterId === userId);

  return (
    <DataContext.Provider
      value={{
        items,
        requests,
        reports,
        addItem,
        updateItem,
        deleteItem,
        addRequest,
        updateRequest,
        addReport,
        loadItems,
        loadRequests,
        loadReports,
        getItemById,
        getRequestsForItem,
        getUserItems,
        getUserRequests,

        // LOST & FOUND
        lostFound,
        loadLostFound,
        addLostFound,
        updateLostFoundStatus,
        getUserProfile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// =====================================================
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
