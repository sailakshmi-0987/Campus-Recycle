import { LayoutDashboard, Users, Package, Inbox, Flag, ArrowLeft, ContactIcon } from "lucide-react";

export default function AdminSidebar({
  active,
  setActive,
  onClose,
}: {
  active: string;
  setActive: (v: string) => void;
  onClose: () => void;
}) {
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "users", label: "Users", icon: <Users size={18} /> },
    { id: "items", label: "Items", icon: <Package size={18} /> },
    { id: "requests", label: "Requests", icon: <Inbox size={18} /> },
    { id: "reports", label: "Reports", icon: <Flag size={18} /> },
    {id: "contacts",label:"Contacts",icon: <ContactIcon size={18} />}
  ];

  return (
    <aside className="w-72 bg-white p-6 shadow-xl h-screen sticky top-0">
      <h1 className="text-xl font-bold text-emerald-700 mb-6">Admin Panel</h1>
      <nav className="space-y-2">
        {menu.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              active === m.id ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {m.icon}
            <span className="font-medium">{m.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to app
        </button>
      </div>
    </aside>
  );
}
