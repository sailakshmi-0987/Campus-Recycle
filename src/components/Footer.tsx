// src/components/Footer.tsx
import { Instagram, Twitter, Facebook, ArrowRight, Send } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#0B1220] text-gray-300 py-16 px-6 md:px-16 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* --- Column 1: CTA --- */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Start Recycling Today
          </h3>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition"
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>

        {/* --- Column 2: Navigate --- */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Navigate</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/faq's" className="hover:text-white transition">
                FAQ’s
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-white transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/guidelines" className="hover:text-white transition">
                Guidelines
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Column 3: Social Media --- */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 hover:text-white cursor-pointer">
              <Instagram size={18} /> Instagram
            </li>
            <li className="flex items-center gap-3 hover:text-white cursor-pointer">
              <Twitter size={18} /> Twitter
            </li>
            <li className="flex items-center gap-3 hover:text-white cursor-pointer">
              <Facebook size={18} /> Facebook
            </li>
          </ul>
        </div>

        {/* --- Column 4: Subscribe --- */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-4">
            Get notifications about new items and sustainability tips.
          </p>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-500">
        <p>© 2025 Campus Recycle. All rights reserved.</p>
        <p>Powered by Team Power House</p>
      </div>
    </footer>
  );
}

export default Footer;
