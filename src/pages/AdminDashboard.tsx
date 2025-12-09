import React, { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import StatsCards from "../components/admin/StatsCards";
import UsersTable from "../components/admin/UsersTable";
import ItemsTable from "../components/admin/ItemsTable";
import RequestsTable from "../components/admin/RequestsTable";
import ReportsTable from "../components/admin/ReportsTable";
import ContactInbox from "./ContactsInbox";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboardpage({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [view, setView] = useState<string>("dashboard");

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-1">Admins only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar active={view} setActive={setView} onClose={onClose} />
      <main className="flex-1 p-10">
        {view === "dashboard" && <StatsCards />}
        {view === "users" && <UsersTable />}
        {view === "items" && <ItemsTable />}
        {view === "requests" && <RequestsTable />}
        {view === "reports" && <ReportsTable />}
        {view === "contacts" && <ContactInbox />}
      </main>
    </div>
  );
}
