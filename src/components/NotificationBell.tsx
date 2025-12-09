import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const unread = notifications.filter((n) => !n.is_read).length;

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Group notifications
  const today = notifications.filter((n) => isToday(n.created_at));
  const yesterday = notifications.filter((n) => isYesterday(n.created_at));
  const earlier = notifications.filter(
    (n) => !isToday(n.created_at) && !isYesterday(n.created_at)
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6 text-gray-700 cursor-pointer" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unread}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl p-3 max-h-96 overflow-y-auto z-50"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Notifications</p>
              {unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-600 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Groups */}
            {renderGroup("Today", today, markAsRead)}
            {renderGroup("Yesterday", yesterday, markAsRead)}
            {renderGroup("Earlier", earlier, markAsRead)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------
// Helpers
// ----------------------
function renderGroup(
  title: string,
  list: any[],
  markAsRead: (id: string) => void
) {
  if (list.length === 0) return null;

  return (
    <div className="mb-3">
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      {list.map((n) => (
        <div
          key={n.id}
          className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
            n.is_read ? "bg-gray-100" : "bg-emerald-100"
          }`}
          onClick={() => markAsRead(n.id)}
        >
          <p className="font-semibold">{n.title}</p>
          <p className="text-sm text-gray-700">{n.message}</p>
        </div>
      ))}
    </div>
  );
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

function isYesterday(dateStr: string) {
  const d = new Date(dateStr);
  const t = new Date();
  t.setDate(t.getDate() - 1);
  return d.toDateString() === t.toDateString();
}
