// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
// import api from "../lib/api";

// // ── Mega Dropdown ──────────────────────────────────────────────────────────────
// const MegaDropdown = ({ categories, visible }) => {
//   if (!visible) return null;

//   // Split into columns of max 6
//   const chunkSize = 6;
//   const cols = [];
//   for (let i = 0; i < categories.length; i += chunkSize) {
//     cols.push(categories.slice(i, i + chunkSize));
//   }
//   const colHeaders = ["Style", "Fabric", "Occasion", "Collections"];

//   return (
//     <div
//       className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-[200] min-w-[680px] max-w-5xl"
//       style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.10))" }}
//     >
//       {/* Arrow tip */}
//       <div className="flex justify-center">
//         <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-[#F0EDE8] -mb-1.5 relative z-10" />
//       </div>

//       <div className="bg-white border border-[#F0EDE8] rounded-sm overflow-hidden">
//         {/* Gold accent bar */}
//         <div className="h-0.5 bg-gradient-to-r from-[#C5A059] via-[#E8D5A3] to-[#C5A059]" />

//         <div className="flex">
//           {/* Left sidebar */}
//           <div className="w-52 shrink-0 bg-[#F9F8F5] border-r border-[#F0EDE8] p-6 flex flex-col justify-between">
//             <div>
//               <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-3">
//                 Browse
//               </p>
//               <Link
//                 to="/categories"
//                 className="block font-heading text-xl font-semibold text-[#2C2C2C] hover:text-[#C5A059] transition-colors mb-2 leading-tight"
//               >
//                 All Categories
//               </Link>
//               <p className="text-xs text-gray-400 leading-relaxed">
//                 Explore our complete saree collection
//               </p>
//             </div>
//             <Link
//               to="/catalog"
//               className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white bg-[#2C2C2C] hover:bg-[#C5A059] transition-colors px-4 py-2.5 mt-6 self-start"
//             >
//               Shop All
//             </Link>
//           </div>

//           {/* Category columns */}
//           <div className="flex-1 p-6">
//             {categories.length === 0 ? (
//               <div className="flex items-center justify-center h-full py-8">
//                 <p className="text-sm text-gray-400">No categories yet</p>
//               </div>
//             ) : (
//               <div
//                 className="grid gap-x-8"
//                 style={{
//                   gridTemplateColumns: `repeat(${Math.min(cols.length, 4)}, 1fr)`,
//                 }}
//               >
//                 {cols.map((col, colIdx) =>
//                   col.length > 0 ? (
//                     <div key={colIdx}>
//                       <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-3 pb-2 border-b border-[#F0EDE8]">
//                         {colHeaders[colIdx] || "More"}
//                       </p>
//                       <ul className="space-y-2.5">
//                         {col.map((cat) => (
//                           <li key={cat.id}>
//                             <Link
//                               to={`/catalog?category=${cat.id}`}
//                               className="group flex items-center gap-2 text-sm text-[#2C2C2C] hover:text-[#C5A059] transition-colors duration-150"
//                             >
//                               <span className="w-1 h-1 rounded-full bg-[#E8D5A3] group-hover:bg-[#C5A059] transition-colors shrink-0" />
//                               {cat.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ) : null,
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Main Navbar ────────────────────────────────────────────────────────────────
// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [categories, setCategories] = useState([]);
//   const [dropOpen, setDropOpen] = useState(false);
//   const dropRef = useRef(null);
//   const hideTimer = useRef(null);

//   // Fetch categories on mount
//   useEffect(() => {
//     api
//       .get("/categories")
//       .then((r) => setCategories(r.data))
//       .catch(() => {});
//   }, []);

//   // Close on route change
//   useEffect(() => {
//     setDropOpen(false);
//   }, [location.pathname]);

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropRef.current && !dropRef.current.contains(e.target)) {
//         setDropOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // Hover with small delay to prevent flicker
//   const openDrop = () => {
//     clearTimeout(hideTimer.current);
//     setDropOpen(true);
//   };
//   const closeDrop = () => {
//     hideTimer.current = setTimeout(() => setDropOpen(false), 120);
//   };

//   const navLinks = [
//     { label: "HOME", to: "/" },
//     { label: "CATALOG", to: "/catalog" },
//     { label: "ABOUT", to: "/about" },
//   ];

//   return (
//     <header className="sticky top-0 z-50 bg-[#F9F8F5] border-b border-[#E8E5E0]">
//       <nav className="flex items-center justify-between px-12 h-16">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="font-heading text-[1.25rem] font-semibold text-[#2C2C2C] no-underline tracking-tight shrink-0"
//           data-testid="logo-link"
//         >
//           GM_<span className="text-[#C5A059]">Bastralaya</span>
//         </Link>

//         {/* Center Nav */}
//         <div className="flex items-center gap-10">
//           {navLinks.map(({ label, to }) => (
//             <Link
//               key={label}
//               to={to}
//               className="text-[#2C2C2C] text-[0.7rem] font-body tracking-[0.13em] no-underline hover:text-[#C5A059] transition-colors duration-200"
//             >
//               {label}
//             </Link>
//           ))}

//           {/* CATEGORIES with mega dropdown */}
//           <div
//             ref={dropRef}
//             className="relative"
//             onMouseEnter={openDrop}
//             onMouseLeave={closeDrop}
//           >
//             <button
//               className={`flex items-center gap-1 text-[0.7rem] font-body tracking-[0.13em] transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 ${
//                 dropOpen
//                   ? "text-[#C5A059]"
//                   : "text-[#2C2C2C] hover:text-[#C5A059]"
//               }`}
//               onClick={() => navigate("/categories")}
//               aria-expanded={dropOpen}
//             >
//               CATEGORIES
//               <ChevronDown
//                 className={`w-3 h-3 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
//               />
//             </button>

//             <div onMouseEnter={openDrop} onMouseLeave={closeDrop}>
//               <MegaDropdown categories={categories} visible={dropOpen} />
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center gap-5 shrink-0">
//           {user ? (
//             <>
//               {(user.role === "admin" || user.role === "shopowner") && (
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center gap-1.5 text-[#2C2C2C] text-[0.72rem] font-body tracking-[0.06em] no-underline hover:text-[#C5A059] transition-colors duration-200"
//                   data-testid="nav-dashboard"
//                 >
//                   <LayoutDashboard
//                     className="w-[1rem] h-[1rem]"
//                     strokeWidth={1.7}
//                   />
//                   Dashboard
//                 </Link>
//               )}
//               <span className="flex items-center gap-1.5 text-[#2C2C2C] text-[0.72rem] font-body tracking-[0.06em]">
//                 <User className="w-[1rem] h-[1rem]" strokeWidth={1.7} />
//                 {user.name || "Admin"}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-[#888] hover:text-[#2C2C2C] transition-colors bg-transparent border-none cursor-pointer p-0"
//                 data-testid="logout-button"
//               >
//                 <LogOut className="w-[1rem] h-[1rem]" strokeWidth={1.7} />
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               className="bg-[#2C2C2C] text-white text-[0.65rem] tracking-[0.15em] font-body font-bold uppercase px-6 py-2 no-underline hover:bg-[#C5A059] transition-colors duration-300"
//               data-testid="login-link"
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;

// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
// import api from "../lib/api";

// // ── Mega Dropdown ──────────────────────────────────────────────────────────────
// const MegaDropdown = ({ categories, visible }) => {
//   if (!visible) return null;

//   // Split into columns of max 6
//   const chunkSize = 6;
//   const cols = [];
//   for (let i = 0; i < categories.length; i += chunkSize) {
//     cols.push(categories.slice(i, i + chunkSize));
//   }
//   const colHeaders = ["Style", "Fabric", "Occasion", "Collections"];

//   return (
//     <div
//       className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-[200] min-w-[680px] max-w-5xl"
//       style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.10))" }}
//     >
//       {/* Arrow tip */}
//       <div className="flex justify-center">
//         <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-[#F0EDE8] -mb-1.5 relative z-10" />
//       </div>

//       <div className="bg-white border border-[#F0EDE8] rounded-sm overflow-hidden">
//         {/* Gold accent bar */}
//         <div className="h-0.5 bg-gradient-to-r from-[#C5A059] via-[#E8D5A3] to-[#C5A059]" />

//         <div className="flex">
//           {/* Left sidebar */}
//           <div className="w-52 shrink-0 bg-[#F9F8F5] border-r border-[#F0EDE8] p-6 flex flex-col justify-between">
//             <div>
//               <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-3">
//                 Browse
//               </p>
//               <Link
//                 to="/categories"
//                 className="block font-heading text-xl font-semibold text-[#2C2C2C] hover:text-[#C5A059] transition-colors mb-2 leading-tight"
//               >
//                 All Categories
//               </Link>
//               <p className="text-xs text-gray-400 leading-relaxed">
//                 Explore our complete saree collection
//               </p>
//             </div>
//             <Link
//               to="/catalog"
//               className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white bg-[#2C2C2C] hover:bg-[#C5A059] transition-colors px-4 py-2.5 mt-6 self-start"
//             >
//               Shop All
//             </Link>
//           </div>

//           {/* Category columns */}
//           <div className="flex-1 p-6">
//             {categories.length === 0 ? (
//               <div className="flex items-center justify-center h-full py-8">
//                 <p className="text-sm text-gray-400">No categories yet</p>
//               </div>
//             ) : (
//               <div
//                 className="grid gap-x-8"
//                 style={{
//                   gridTemplateColumns: `repeat(${Math.min(cols.length, 4)}, 1fr)`,
//                 }}
//               >
//                 {cols.map((col, colIdx) =>
//                   col.length > 0 ? (
//                     <div key={colIdx}>
//                       <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-3 pb-2 border-b border-[#F0EDE8]">
//                         {colHeaders[colIdx] || "More"}
//                       </p>
//                       <ul className="space-y-2.5">
//                         {col.map((cat) => (
//                           <li key={cat.id}>
//                             <Link
//                               to={`/category/${cat.slug || cat.id}`}
//                               className="group flex items-center gap-2 text-sm text-[#2C2C2C] hover:text-[#C5A059] transition-colors duration-150"
//                             >
//                               <span className="w-1 h-1 rounded-full bg-[#E8D5A3] group-hover:bg-[#C5A059] transition-colors shrink-0" />
//                               {cat.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ) : null,
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Main Navbar ────────────────────────────────────────────────────────────────
// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [categories, setCategories] = useState([]);
//   const [dropOpen, setDropOpen] = useState(false);
//   const dropRef = useRef(null);
//   const hideTimer = useRef(null);

//   // Fetch categories on mount
//   useEffect(() => {
//     api
//       .get("/categories")
//       .then((r) => setCategories(r.data))
//       .catch(() => {});
//   }, []);

//   // Close on route change
//   useEffect(() => {
//     setDropOpen(false);
//   }, [location.pathname]);

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropRef.current && !dropRef.current.contains(e.target)) {
//         setDropOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // Hover with small delay to prevent flicker
//   const openDrop = () => {
//     clearTimeout(hideTimer.current);
//     setDropOpen(true);
//   };
//   const closeDrop = () => {
//     hideTimer.current = setTimeout(() => setDropOpen(false), 120);
//   };

//   const navLinks = [
//     { label: "HOME", to: "/" },
//     { label: "CATALOG", to: "/catalog" },
//     { label: "ABOUT", to: "/about" },
//   ];

//   return (
//     <header className="sticky top-0 z-50 bg-[#F9F8F5] border-b border-[#E8E5E0]">
//       <nav className="flex items-center justify-between px-12 h-16">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="font-heading text-[1.25rem] font-semibold text-[#2C2C2C] no-underline tracking-tight shrink-0"
//           data-testid="logo-link"
//         >
//           GM_<span className="text-[#C5A059]">Bastralaya</span>
//         </Link>

//         {/* Center Nav */}
//         <div className="flex items-center gap-10">
//           {navLinks.map(({ label, to }) => (
//             <Link
//               key={label}
//               to={to}
//               className="text-[#2C2C2C] text-[0.7rem] font-body tracking-[0.13em] no-underline hover:text-[#C5A059] transition-colors duration-200"
//             >
//               {label}
//             </Link>
//           ))}

//           {/* CATEGORIES with mega dropdown */}
//           <div
//             ref={dropRef}
//             className="relative"
//             onMouseEnter={openDrop}
//             onMouseLeave={closeDrop}
//           >
//             <button
//               className={`flex items-center gap-1 text-[0.7rem] font-body tracking-[0.13em] transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 ${
//                 dropOpen
//                   ? "text-[#C5A059]"
//                   : "text-[#2C2C2C] hover:text-[#C5A059]"
//               }`}
//               onClick={() => navigate("/categories")}
//               aria-expanded={dropOpen}
//             >
//               CATEGORIES
//               <ChevronDown
//                 className={`w-3 h-3 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
//               />
//             </button>

//             <div onMouseEnter={openDrop} onMouseLeave={closeDrop}>
//               <MegaDropdown categories={categories} visible={dropOpen} />
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center gap-5 shrink-0">
//           {user ? (
//             <>
//               {(user.role === "admin" || user.role === "shopowner") && (
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center gap-1.5 text-[#2C2C2C] text-[0.72rem] font-body tracking-[0.06em] no-underline hover:text-[#C5A059] transition-colors duration-200"
//                   data-testid="nav-dashboard"
//                 >
//                   <LayoutDashboard
//                     className="w-[1rem] h-[1rem]"
//                     strokeWidth={1.7}
//                   />
//                   Dashboard
//                 </Link>
//               )}
//               <span className="flex items-center gap-1.5 text-[#2C2C2C] text-[0.72rem] font-body tracking-[0.06em]">
//                 <User className="w-[1rem] h-[1rem]" strokeWidth={1.7} />
//                 {user.name || "Admin"}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-[#888] hover:text-[#2C2C2C] transition-colors bg-transparent border-none cursor-pointer p-0"
//                 data-testid="logout-button"
//               >
//                 <LogOut className="w-[1rem] h-[1rem]" strokeWidth={1.7} />
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               className="bg-[#2C2C2C] text-white text-[0.65rem] tracking-[0.15em] font-body font-bold uppercase px-6 py-2 no-underline hover:bg-[#C5A059] transition-colors duration-300"
//               data-testid="login-link"
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import api from "../lib/api";

// ── Mega Dropdown ──────────────────────────────────────────────────────────────
const MegaDropdown = ({ categories, visible }) => {
  if (!visible) return null;

  // Split into columns of max 6
  const chunkSize = 6;
  const cols = [];
  for (let i = 0; i < categories.length; i += chunkSize) {
    cols.push(categories.slice(i, i + chunkSize));
  }
  const colHeaders = ["Style", "Fabric", "Occasion", "Collections"];

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-[200] min-w-[680px] max-w-5xl"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.10))" }}
    >
      {/* Arrow tip */}
      <div className="flex justify-center">
        <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-[#F0EDE8] -mb-1.5 relative z-10" />
      </div>

      <div className="bg-white border border-[#F0EDE8] rounded-sm overflow-hidden">
        {/* Gold accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-[#C5A059] via-[#E8D5A3] to-[#C5A059]" />

        <div className="flex">
          {/* Left sidebar */}
          <div className="w-52 shrink-0 bg-[#F9F8F5] border-r border-[#F0EDE8] p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-3">
                Browse
              </p>
              <Link
                to="/categories"
                className="block font-heading text-xl font-semibold text-[#2C2C2C] hover:text-[#C5A059] transition-colors mb-2 leading-tight"
              >
                All Categories
              </Link>
              <p className="text-xs text-gray-400 leading-relaxed">
                Explore our complete saree collection
              </p>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white bg-[#2C2C2C] hover:bg-[#C5A059] transition-colors px-4 py-2.5 mt-6 self-start"
            >
              Shop All
            </Link>
          </div>

          {/* Category columns */}
          <div className="flex-1 p-6">
            {categories.length === 0 ? (
              <div className="flex items-center justify-center h-full py-8">
                <p className="text-sm text-gray-400">No categories yet</p>
              </div>
            ) : (
              <div
                className="grid gap-x-8"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(cols.length, 4)}, 1fr)`,
                }}
              >
                {cols.map((col, colIdx) =>
                  col.length > 0 ? (
                    <div key={colIdx}>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-3 pb-2 border-b border-[#F0EDE8]">
                        {colHeaders[colIdx] || "More"}
                      </p>
                      <ul className="space-y-2.5">
                        {col.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              to={`/category/${cat.slug || cat.id}`}
                              className="group flex items-center gap-2 text-sm text-[#2C2C2C] hover:text-[#C5A059] transition-colors duration-150"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#E8D5A3] group-hover:bg-[#C5A059] transition-colors shrink-0" />
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Navbar ────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const hideTimer = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(r.data))
      .catch(() => {});
  }, []);

  // Close on route change
  useEffect(() => {
    setDropOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Hover with small delay to prevent flicker
  const openDrop = () => {
    clearTimeout(hideTimer.current);
    setDropOpen(true);
  };
  const closeDrop = () => {
    hideTimer.current = setTimeout(() => setDropOpen(false), 120);
  };

  const navLinks = [
    { label: "HOME", to: "/" },
    { label: "CATALOG", to: "/catalog" },
    { label: "ABOUT", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F9F8F5] border-b border-[#E8E5E0]">
      <nav className="flex items-center justify-between px-12 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-heading text-[1.25rem] font-semibold text-[#2C2C2C] no-underline tracking-tight shrink-0"
          data-testid="logo-link"
        >
          GM_<span className="text-[#C5A059]">Bastralaya</span>
        </Link>

        {/* Center Nav */}
        <div className="flex items-center gap-10">
          {navLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-[#2C2C2C] text-[0.7rem] font-body tracking-[0.13em] no-underline hover:text-[#C5A059] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}

          {/* CATEGORIES with mega dropdown */}
          <div
            ref={dropRef}
            className="relative"
            onMouseEnter={openDrop}
            onMouseLeave={closeDrop}
          >
            <button
              className={`flex items-center gap-1 text-[0.7rem] font-body tracking-[0.13em] transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 ${
                dropOpen
                  ? "text-[#C5A059]"
                  : "text-[#2C2C2C] hover:text-[#C5A059]"
              }`}
              onClick={() => navigate("/categories")}
              aria-expanded={dropOpen}
            >
              CATEGORIES
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div onMouseEnter={openDrop} onMouseLeave={closeDrop}>
              <MegaDropdown categories={categories} visible={dropOpen} />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 shrink-0">
          {user ? (
            <>
              {(user.role === "admin" || user.role === "shopowner") && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-[#2C2C2C] text-[0.72rem] font-body tracking-[0.06em] no-underline hover:text-[#C5A059] transition-colors duration-200"
                  data-testid="nav-dashboard"
                >
                  <LayoutDashboard
                    className="w-[1rem] h-[1rem]"
                    strokeWidth={1.7}
                  />
                  Dashboard
                </Link>
              )}
              <span className="flex items-center gap-1.5 text-[#2C2C2C] text-[0.72rem] font-body tracking-[0.06em]">
                <User className="w-[1rem] h-[1rem]" strokeWidth={1.7} />
                {user.name || "Admin"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-[#888] hover:text-[#2C2C2C] transition-colors bg-transparent border-none cursor-pointer p-0"
                data-testid="logout-button"
              >
                <LogOut className="w-[1rem] h-[1rem]" strokeWidth={1.7} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-[#2C2C2C] text-white text-[0.65rem] tracking-[0.15em] font-body font-bold uppercase px-6 py-2 no-underline hover:bg-[#C5A059] transition-colors duration-300"
              data-testid="login-link"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;