import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Package,
  Folder,
  Image,
  Warehouse,
  Tag,
  Settings,
  Users,
  FileText,
  MessageSquare,
  Home,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  if (!user) return null;

  return (
    <div className="min-h-screen flex" data-testid="dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2C2C2C] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="font-heading text-2xl">
            GM_<span className="text-[#C5A059]">Bastralaya</span>
          </Link>
          <p className="text-sm text-gray-400 mt-2">
            {user.role === "admin" ? "Admin" : "Shopowner"} Dashboard
          </p>
        </div>

        <nav className="flex-1 py-6">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? "bg-[#C5A059] text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
                data-testid={`menu-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center font-bold">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F9F8F6]">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
