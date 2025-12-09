import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recycle, Plus, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

interface HeaderProps {
  onLoginClick: () => void;
  onPostItemClick: () => void;
  onProfileClick: () => void;
  onAdminClick?: () => void;
}

export function Header({
  onLoginClick,
  onPostItemClick,
  onProfileClick,
  onAdminClick,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Recycle className="text-white" size={26} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Campus Recycle
            </h1>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">

            <NotificationBell />
           
          <button
            onClick={() => (window.location.href = "/lost-found")}
            className="bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
              Lost & Found
          </button>

            {/* About */}
            <button
              onClick={() => (window.location.href = "/about")}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              About
            </button>

            {/* Contact */}
            <button
              onClick={() =>
                user ? (window.location.href = "/contact") : onLoginClick()
              }
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Contact
            </button>

            {user ? (
              <>
                <button
                  onClick={onPostItemClick}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  <Plus size={18} /> Post Item
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={onAdminClick}
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Admin
                  </button>
                )}

                <button
                  onClick={onProfileClick}
                  className="border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                >
                  <User size={18} /> {user.fullName}
                </button>

                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md rounded-lg p-4 space-y-3">

            <NotificationBell />

            <button
              onClick={() => (window.location.href = "/about")}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg"
            >
              About
            </button>

            <button
              onClick={() =>
                user ? (window.location.href = "/contact") : onLoginClick()
              }
              className="w-full bg-emerald-600 text-white py-2 rounded-lg"
            >
              Contact
            </button>

            {user ? (
              <>
                <button
                  onClick={onPostItemClick}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg"
                >
                  Post Item
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={onAdminClick}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg"
                  >
                    Admin
                  </button>
                )}

                <button
                  onClick={onProfileClick}
                  className="w-full border py-2 rounded-lg"
                >
                  Profile
                </button>

                <button
                  onClick={logout}
                  className="w-full bg-red-500 text-white py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
