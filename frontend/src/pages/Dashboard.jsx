
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api.jsx";
import { Button } from "../components/ui/button";
import {
  Package,
  Folder,
  Warehouse,
  Tag,
  Settings,
  Users,
  FileText,
  MessageSquare,
  MessageSquareDashed,
  Home,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Activity
} from "lucide-react";
import HelthCheck from "./dashboard/HealthCheck.jsx"
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadFeedback, setUnreadFeedback] = useState(0);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUnread = () => {
      api
        .get("/feedback?limit=500")
        .then((res) =>
          setUnreadFeedback(res.data.filter((f) => !f.is_read).length),
        )
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "shopowner")) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Overview",
      roles: ["admin", "shopowner"],
    },
    {
      path: "/dashboard/products",
      icon: Package,
      label: "Products",
      roles: ["admin", "shopowner"],
    },
    {
      path: "/dashboard/categories",
      icon: Folder,
      label: "Categories",
      roles: ["admin", "shopowner"],
    },
    {
      path: "/dashboard/inventory",
      icon: Warehouse,
      label: "Inventory",
      roles: ["admin", "shopowner"],
    },
    {
      path: "/dashboard/discounts",
      icon: Tag,
      label: "Discounts",
      roles: ["admin", "shopowner"],
    },
    {
      path: "/dashboard/enquiries",
      icon: MessageSquare,
      label: "Enquiries",
      roles: ["admin", "shopowner"],
    },
    {
      path: "/dashboard/feedback",
      icon: MessageSquareDashed,
      label: "Feedback",
      roles: ["admin", "shopowner"],
    },
    {
      path: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      roles: ["admin", "shopowner"],
    },
    { path: "/dashboard/users", icon: Users, label: "Users", roles: ["admin"] },
    {
      path: "/dashboard/audit-logs",
      icon: FileText,
      label: "Audit Logs",
      roles: ["admin"],
    },
  {
      path: "/dashboard/health",
      icon: Activity,
      label: "Health Check",
      roles: ["admin"],
    },

  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  if (!user) return null;

  const SidebarNav = ({ onLinkClick }) => (
    <>
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="font-heading text-2xl" onClick={onLinkClick}>
          GM_<span className="text-[#C5A059]">Bastralaya</span>
        </Link>
        <p className="text-sm text-gray-400 mt-2">
          {user.role === "admin" ? "Admin" : "Shopowner"} Dashboard
        </p>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-[#C5A059] text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
              data-testid={`menu-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.path === "/dashboard/feedback" && unreadFeedback > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    isActive
                      ? "bg-white text-[#C5A059]"
                      : "bg-[#C5A059] text-white"
                  }`}
                >
                  {unreadFeedback}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center font-bold text-white shrink-0">
            {user.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-white/5 hover:text-white"
          data-testid="logout-button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" data-testid="dashboard">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-in drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#2C2C2C] text-white flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarNav onLinkClick={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop inline sidebar */}
      {sidebarOpen && (
        <aside className="hidden md:flex w-64 bg-[#2C2C2C] text-white flex-col shrink-0">
          <SidebarNav onLinkClick={undefined} />
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="px-4 py-3 bg-[#F9F8F6] border-b border-[#F2F0EB] flex items-center gap-4">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="md:hidden hover:bg-[#E8E5E0]/50 shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex hover:bg-[#E8E5E0]/50 shrink-0"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>

          {/* Current page label on mobile */}
          <span className="text-sm font-semibold text-[#2C2C2C] md:hidden">
            {filteredMenuItems.find((item) => location.pathname === item.path)
              ?.label || "Dashboard"}
          </span>

          {/* Current page label on desktop when sidebar collapsed */}
          {!sidebarOpen && (
            <span className="hidden md:block text-sm font-semibold text-[#2C2C2C]">
              {filteredMenuItems.find((item) => location.pathname === item.path)
                ?.label || "Dashboard"}
            </span>
          )}
        </div>

        <main className="flex-1 bg-[#F9F8F6] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;