// import React, { useEffect, useState } from "react";
// import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "../components/ui/button";
// import {
//   Package,
//   Folder,
//   Image,
//   Warehouse,
//   Tag,
//   Settings,
//   Users,
//   FileText,
//   MessageSquare,
//   Home,
//   LogOut,
//   PanelLeftClose,
//   PanelLeftOpen,
// } from "lucide-react";

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // New state to control sidebar visibility
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     if (!user || (user.role !== "admin" && user.role !== "shopowner")) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const menuItems = [
//     {
//       path: "/dashboard",
//       icon: Home,
//       label: "Overview",
//       roles: ["admin", "shopowner"],
//     },
//     {
//       path: "/dashboard/products",
//       icon: Package,
//       label: "Products",
//       roles: ["admin", "shopowner"],
//     },
//     {
//       path: "/dashboard/categories",
//       icon: Folder,
//       label: "Categories",
//       roles: ["admin", "shopowner"],
//     },
//     {
//       path: "/dashboard/inventory",
//       icon: Warehouse,
//       label: "Inventory",
//       roles: ["admin", "shopowner"],
//     },
//     {
//       path: "/dashboard/discounts",
//       icon: Tag,
//       label: "Discounts",
//       roles: ["admin", "shopowner"],
//     },
//     {
//       path: "/dashboard/enquiries",
//       icon: MessageSquare,
//       label: "Enquiries",
//       roles: ["admin", "shopowner"],
//     },
//     {
//       path: "/dashboard/settings",
//       icon: Settings,
//       label: "Settings",
//       roles: ["admin", "shopowner"],
//     },
//     { path: "/dashboard/users", icon: Users, label: "Users", roles: ["admin"] },
//     {
//       path: "/dashboard/audit-logs",
//       icon: FileText,
//       label: "Audit Logs",
//       roles: ["admin"],
//     },
//   ];

//   const filteredMenuItems = menuItems.filter((item) =>
//     item.roles.includes(user?.role),
//   );

//   if (!user) return null;

//   return (
//     <div className="min-h-screen flex" data-testid="dashboard">
//       {/* Sidebar - conditionally shown */}
//       {sidebarOpen && (
//         <aside className="w-64 bg-[#2C2C2C] text-white flex flex-col transition-all duration-300">
//           <div className="p-6 border-b border-white/10">
//             <Link to="/" className="font-heading text-2xl">
//               GM_<span className="text-[#C5A059]">Bastralaya</span>
//             </Link>
//             <p className="text-sm text-gray-400 mt-2">
//               {user.role === "admin" ? "Admin" : "Shopowner"} Dashboard
//             </p>
//           </div>

//           <nav className="flex-1 py-6">
//             {filteredMenuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center gap-3 px-6 py-3 transition-colors ${
//                     isActive
//                       ? "bg-[#C5A059] text-white"
//                       : "text-gray-300 hover:bg-white/5"
//                   }`}
//                   data-testid={`menu-${item.label
//                     .toLowerCase()
//                     .replace(" ", "-")}`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           <div className="p-6 border-t border-white/10">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center font-bold">
//                 {user.name[0].toUpperCase()}
//               </div>
//               <div>
//                 <p className="text-sm font-medium">{user.name}</p>
//                 <p className="text-xs text-gray-400">{user.email}</p>
//               </div>
//             </div>
//             <Button
//               onClick={handleLogout}
//               variant="ghost"
//               className="w-full justify-start text-gray-300 hover:bg-white/5 hover:text-white"
//               data-testid="logout-button"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </aside>
//       )}

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Toggle Button - always visible */}
//         <div className="p-4 bg-[#F9F8F6] border-b border-[#F2F0EB] flex items-center">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="hover:bg-[#E8E5E0]/50"
//             title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
//           >
//             {sidebarOpen ? (
//               <PanelLeftClose className="h-5 w-5" />
//             ) : (
//               <PanelLeftOpen className="h-5 w-5" />
//             )}
//           </Button>

//           {/* Optional: show current page title when sidebar is hidden */}
//           {!sidebarOpen && (
//             <span className="ml-4 text-lg font-medium text-[#2C2C2C]">
//               {filteredMenuItems.find((item) => location.pathname === item.path)
//                 ?.label || "Dashboard"}
//             </span>
//           )}
//         </div>

//         {/* Page Content */}
//         <main className="flex-1 bg-[#F9F8F6] overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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
  Activity
} from "lucide-react";
import HelthCheck from "./dashboard/HealthCheck.jsx"
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadFeedback, setUnreadFeedback] = useState(0);

  // Poll unread feedback count every 60s
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
      path:"/dashboard/health",
      icon: Activity,
      label: "System Health",
      roles: ["admin"]
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  if (!user) return null;

  return (
    <div className="min-h-screen flex" data-testid="dashboard">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <aside className="w-64 bg-[#2C2C2C] text-white flex flex-col shrink-0">
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
                  <span className="flex-1">{item.label}</span>

                  {/* Unread feedback badge */}
                  {item.path === "/dashboard/feedback" &&
                    unreadFeedback > 0 && (
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
              <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center font-bold text-white">
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
      )}

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar with sidebar toggle */}
        <div className="px-4 py-3 bg-[#F9F8F6] border-b border-[#F2F0EB] flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-[#E8E5E0]/50 shrink-0"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>

          {!sidebarOpen && (
            <span className="text-sm font-semibold text-[#2C2C2C]">
              {filteredMenuItems.find((item) => location.pathname === item.path)
                ?.label || "Dashboard"}
            </span>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 bg-[#F9F8F6] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;