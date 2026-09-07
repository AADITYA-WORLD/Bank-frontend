import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Send,
  History,
  ShieldCheck,
  LogOut,
  Landmark,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  }

  if (!user) return null;

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/transfer", label: "Transfer", icon: Send },
    { to: "/history", label: "History", icon: History },
    ...(user.role === "admin"
      ? [{ to: "/admin", label: "Admin", icon: ShieldCheck }]
      : []),
  ];

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Landmark size={22} />
          Aaditya Banking
        </div>

        {/* Desktop nav - hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-slate-900"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:bg-slate-800 px-3 py-2 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile hamburger button - hidden on desktop */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-white"
        >
          <Menu size={26} />
        </button>
      </nav>

      {/* Overlay - click to close */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sliding sidebar from right */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-slate-900 z-40 transform transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
          <button onClick={() => setMenuOpen(false)} className="text-white">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col p-3 gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-slate-900"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors mt-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}