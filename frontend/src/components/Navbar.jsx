
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   LayoutDashboard,
//   User,
//   LogOut,
//   ChevronDown,
//   Menu,
//   X,
// } from "lucide-react";
// import api from "../lib/api.jsx";

// // ── Mega Dropdown (desktop only) ───────────────────────────────────────────────
// const MegaDropdown = ({ categories, visible }) => {
//   if (!visible) return null;

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
//       <div className="flex justify-center">
//         <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-[#F0EDE8] -mb-1.5 relative z-10" />
//       </div>
//       <div className="bg-white border border-[#F0EDE8] rounded-sm overflow-hidden">
//         <div className="h-0.5 bg-gradient-to-r from-[#C5A059] via-[#E8D5A3] to-[#C5A059]" />
//         <div className="flex">
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
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
//   const dropRef = useRef(null);
//   const hideTimer = useRef(null);

//   useEffect(() => {
//     api
//       .get("/categories")
//       .then((r) => setCategories(r.data))
//       .catch(() => {});
//   }, []);

//   // Close everything on route change
//   useEffect(() => {
//     setDropOpen(false);
//     setMobileOpen(false);
//     setMobileCatsOpen(false);
//   }, [location.pathname]);

//   // Close desktop dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropRef.current && !dropRef.current.contains(e.target)) {
//         setDropOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Prevent body scroll when mobile menu open
//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

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
//       <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-12 h-16">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="font-heading text-[1.1rem] sm:text-[1.25rem] font-semibold text-[#2C2C2C] no-underline tracking-tight shrink-0"
//           data-testid="logo-link"
//         >
//           GM_<span className="text-[#C5A059]">Bastralaya</span>
//         </Link>

//         {/* ── Desktop Center Nav ─────────────────────────────────── */}
//         <div className="hidden lg:flex items-center gap-10">
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

//         {/* ── Desktop Right Side ─────────────────────────────────── */}
//         <div className="hidden lg:flex items-center gap-5 shrink-0">
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

//         {/* ── Mobile: Login shortcut + Hamburger ────────────────── */}
//         <div className="flex lg:hidden items-center gap-3">
//           {!user && (
//             <Link
//               to="/login"
//               className="bg-[#2C2C2C] text-white text-[0.6rem] tracking-[0.12em] font-body font-bold uppercase px-4 py-1.5 no-underline hover:bg-[#C5A059] transition-colors"
//               data-testid="login-link"
//             >
//               Login
//             </Link>
//           )}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className="p-1.5 text-[#2C2C2C] hover:text-[#C5A059] transition-colors"
//             aria-label="Toggle menu"
//           >
//             {mobileOpen ? (
//               <X className="w-5 h-5" />
//             ) : (
//               <Menu className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//       </nav>

//       {/* ── Mobile Drawer ─────────────────────────────────────────────── */}
//       {mobileOpen && (
//         <>
//           {/* Backdrop */}
//           <div
//             className="fixed inset-0 top-16 bg-black/30 z-40 lg:hidden"
//             onClick={() => setMobileOpen(false)}
//           />
//           {/* Panel */}
//           <div className="fixed top-16 left-0 right-0 bg-[#F9F8F5] border-b border-[#E8E5E0] z-50 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto shadow-xl">
//             <div className="px-4 py-3">
//               {navLinks.map(({ label, to }) => (
//                 <Link
//                   key={label}
//                   to={to}
//                   className="flex items-center py-3.5 text-sm font-bold tracking-widest text-[#2C2C2C] hover:text-[#C5A059] border-b border-[#E8E5E0] transition-colors"
//                 >
//                   {label}
//                 </Link>
//               ))}

//               {/* Categories accordion */}
//               <div className="border-b border-[#E8E5E0]">
//                 <button
//                   onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
//                   className="w-full flex items-center justify-between py-3.5 text-sm font-bold tracking-widest text-[#2C2C2C] hover:text-[#C5A059] transition-colors"
//                 >
//                   CATEGORIES
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform duration-200 ${mobileCatsOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {mobileCatsOpen && (
//                   <div className="pb-4 space-y-1 pl-2">
//                     <Link
//                       to="/categories"
//                       className="block py-2 text-sm text-[#C5A059] font-semibold"
//                     >
//                       View All Categories →
//                     </Link>
//                     {categories.map((cat) => (
//                       <Link
//                         key={cat.id}
//                         to={`/category/${cat.slug || cat.id}`}
//                         className="block py-2 text-sm text-gray-600 hover:text-[#C5A059] transition-colors"
//                       >
//                         {cat.name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* User section */}
//               {user ? (
//                 <div className="pt-2 space-y-1">
//                   <div className="flex items-center gap-2 py-2.5 text-sm text-gray-500 border-b border-[#E8E5E0]">
//                     <User className="w-4 h-4 shrink-0" />
//                     <span className="truncate">{user.name || "User"}</span>
//                   </div>
//                   {(user.role === "admin" || user.role === "shopowner") && (
//                     <Link
//                       to="/dashboard"
//                       className="flex items-center gap-2 py-3.5 text-sm font-bold tracking-widest text-[#2C2C2C] hover:text-[#C5A059] border-b border-[#E8E5E0] transition-colors"
//                       data-testid="nav-dashboard"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       DASHBOARD
//                     </Link>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 w-full py-3.5 text-sm font-bold tracking-widest text-red-500 hover:text-red-700 transition-colors"
//                     data-testid="logout-button"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     LOGOUT
//                   </button>
//                 </div>
//               ) : (
//                 <div className="pt-4 pb-2">
//                   <Link
//                     to="/login"
//                     className="block w-full text-center bg-[#2C2C2C] text-white text-xs tracking-widest font-bold uppercase px-6 py-3 hover:bg-[#C5A059] transition-colors"
//                   >
//                     Login / Sign Up
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </header>
//   );
// };

// export default Navbar;














// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   LayoutDashboard,
//   User,
//   LogOut,
//   ChevronDown,
//   Menu,
//   X,
//   ShoppingBag,
//   Search,
// } from "lucide-react";
// import api from "../lib/api.jsx";

// // ── Refined Mega Dropdown ──────────────────────────────────────────────────
// const MegaDropdown = ({ categories, visible }) => {
//   if (!visible) return null;

//   const chunkSize = 5;
//   const cols = [];
//   for (let i = 0; i < categories.length; i += chunkSize) {
//     cols.push(categories.slice(i, i + chunkSize));
//   }

//   return (
//     <div className="absolute top-full left-0 w-screen bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-top-2 duration-300">
//       <div className="container mx-auto px-12 lg:px-24 py-12 flex gap-16">
//         {/* Left Featured Block */}
//         <div className="w-64 shrink-0 bg-[#FCFAF8] p-8 border border-gray-100 relative group">
//           <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-4 block">Archive</span>
//           <h3 className="font-serif italic text-2xl text-[#2C2C2C] mb-4">The Silk Series</h3>
//           <p className="text-[11px] text-gray-400 leading-relaxed mb-6 tracking-wide">Explore our signature hand-woven sarees curated for elegance.</p>
//           <Link to="/catalog" className="text-[10px] font-bold tracking-widest uppercase border-b border-[#2C2C2C] pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-all">
//             Shop Collection
//           </Link>
//         </div>

//         {/* Dynamic Category Columns */}
//         <div className="flex-1 grid grid-cols-4 gap-8">
//           {cols.slice(0, 4).map((col, idx) => (
//             <div key={idx}>
//               <p className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-6">Column 0{idx + 1}</p>
//               <ul className="space-y-4">
//                 {col.map((cat) => (
//                   <li key={cat.id}>
//                     <Link
//                       to={`/category/${cat.slug || cat.id}`}
//                       className="text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#C5A059] transition-colors"
//                     >
//                       {cat.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Main Navbar ────────────────────────────────────────────────────────────────
// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [dropOpen, setDropOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const dropRef = useRef(null);

//   useEffect(() => {
//     api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
//   }, []);

//   const handleLogout = () => { logout(); navigate("/login"); };

//   const navLinks = [
//     { label: "CATALOG", to: "/catalog" },
//     { label: "OUR STORY", to: "/about" },
//   ];

//   return (
//     <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-50">
//       <nav className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
//         {/* Left: Mobile Menu Trigger */}
//         <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2">
//           <Menu className="w-5 h-5 text-[#2C2C2C]" />
//         </button>

//         {/* Left: Nav Links (Desktop) */}
//         <div className="hidden lg:flex items-center gap-10">
//           <div 
//             ref={dropRef} 
//             className="relative h-20 flex items-center"
//             onMouseEnter={() => setDropOpen(true)}
//             onMouseLeave={() => setDropOpen(false)}
//           >
//             <button className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#2C2C2C] hover:text-[#C5A059] transition-colors uppercase">
//               CATEGORIES <ChevronDown className={`w-3 h-3 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
//             </button>
//             <MegaDropdown categories={categories} visible={dropOpen} />
//           </div>
//           {navLinks.map(link => (
//             <Link key={link.label} to={link.to} className="relative text-[10px] font-bold tracking-[0.2em] text-[#2C2C2C] hover:text-[#C5A059] transition-colors uppercase group">
//               {link.label}
//               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all group-hover:w-full" />
//             </Link>
//           ))}
//         </div>

//         {/* Center: Branding */}
//         <Link to="/" className="absolute left-1/2 -translate-x-1/2">
//           <h1 className="font-heading text-xl md:text-2xl font-light tracking-tighter text-[#2C2C2C]">
//             GM_ <span className="font-serif italic text-[#C5A059]">Bastralaya</span>
//           </h1>
//         </Link>

//         {/* Right: Actions */}
//         <div className="flex items-center gap-6">
//           {/* <Search className="w-4 h-4 text-[#2C2C2C] cursor-pointer hover:text-[#C5A059] hidden sm:block" /> */}
          
//           {user ? (
//             <div className="flex items-center gap-4">
//               {(user.role === "admin" || user.role === "shopowner") && (
//                 <Link to="/dashboard" className="p-2 hover:bg-[#FCFAF8] rounded-full transition-colors">
//                   <LayoutDashboard className="w-4 h-4 text-[#2C2C2C]" />
//                 </Link>
//               )}
//               <div className="group relative">
//                 <User className="w-4 h-4 text-[#2C2C2C] cursor-pointer" />
//                 <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-4">
//                   <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">{user.name}</p>
//                   <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest">
//                     <LogOut className="w-3 h-3" /> Sign Out
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <Link to="/login" className="bg-[#2C2C2C] text-white text-[10px] font-bold tracking-[0.2em] px-8 py-3 hover:bg-[#C5A059] transition-all uppercase hidden sm:block">
//               Sign In
//             </Link>
//           )}
          
//           <Link to="/catalog" className="relative p-2">
//             <ShoppingBag className="w-4 h-4 text-[#2C2C2C]" />
//             <span className="absolute top-0 right-0 w-2 h-2 bg-[#C5A059] rounded-full" />
//           </Link>
//         </div>
//       </nav>

//       {/* ── Mobile Side Drawer ─────────────────────────────────────────── */}
//       {mobileOpen && (
//         <div className="fixed inset-0 z-[200] flex animate-in fade-in duration-300">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
//           <div className="relative w-4/5 max-w-sm bg-white h-full p-8 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
//             <button onClick={() => setMobileOpen(false)} className="self-end mb-12 p-2">
//               <X className="w-6 h-6 text-[#2C2C2C]" />
//             </button>
            
//             <nav className="space-y-8 flex-1">
//               {['HOME', 'COLLECTIONS', 'CATEGORIES', 'OUR STORY'].map(item => (
//                 <Link 
//                   key={item} 
//                   to={item === 'HOME' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
//                   className="block text-xl font-heading font-light tracking-widest text-[#2C2C2C]"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {item}
//                 </Link>
//               ))}
//             </nav>

//             {!user && (
//               <Link to="/login" className="bg-[#2C2C2C] text-white py-5 text-center text-xs font-bold tracking-widest uppercase">
//                 Member Sign In
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;








// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   LayoutDashboard,
//   User,
//   LogOut,
//   ChevronDown,
//   Menu,
//   X,
// } from "lucide-react";
// import api from "../lib/api.jsx";

// // ── Mega Dropdown (desktop only) ───────────────────────────────────────────────
// const MegaDropdown = ({ categories, visible }) => {
//   if (!visible) return null;

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
//       <div className="flex justify-center">
//         <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-[#F0EDE8] -mb-1.5 relative z-10" />
//       </div>
//       <div className="bg-white border border-[#F0EDE8] rounded-sm overflow-hidden">
//         <div className="h-0.5 bg-gradient-to-r from-[#C5A059] via-[#E8D5A3] to-[#C5A059]" />
//         <div className="flex">
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
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
//   const dropRef = useRef(null);
//   const hideTimer = useRef(null);

//   useEffect(() => {
//     api
//       .get("/categories")
//       .then((r) => setCategories(r.data))
//       .catch(() => {});
//   }, []);

//   // Close everything on route change
//   useEffect(() => {
//     setDropOpen(false);
//     setMobileOpen(false);
//     setMobileCatsOpen(false);
//   }, [location.pathname]);

//   // Close desktop dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropRef.current && !dropRef.current.contains(e.target)) {
//         setDropOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Prevent body scroll when mobile menu open
//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

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
//       <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-12 h-16">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="font-heading text-[1.1rem] sm:text-[1.25rem] font-semibold text-[#2C2C2C] no-underline tracking-tight shrink-0"
//           data-testid="logo-link"
//         >
//           GM_<span className="text-[#C5A059]">Bastralaya</span>
//         </Link>

//         {/* ── Desktop Center Nav ─────────────────────────────────── */}
//         <div className="hidden lg:flex items-center gap-10">
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

//         {/* ── Desktop Right Side ─────────────────────────────────── */}
//         <div className="hidden lg:flex items-center gap-5 shrink-0">
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

//         {/* ── Mobile: Login shortcut + Hamburger ────────────────── */}
//         <div className="flex lg:hidden items-center gap-3">
//           {!user && (
//             <Link
//               to="/login"
//               className="bg-[#2C2C2C] text-white text-[0.6rem] tracking-[0.12em] font-body font-bold uppercase px-4 py-1.5 no-underline hover:bg-[#C5A059] transition-colors"
//               data-testid="login-link"
//             >
//               Login
//             </Link>
//           )}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className="p-1.5 text-[#2C2C2C] hover:text-[#C5A059] transition-colors"
//             aria-label="Toggle menu"
//           >
//             {mobileOpen ? (
//               <X className="w-5 h-5" />
//             ) : (
//               <Menu className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//       </nav>

//       {/* ── Mobile Drawer ─────────────────────────────────────────────── */}
//       {mobileOpen && (
//         <>
//           {/* Backdrop */}
//           <div
//             className="fixed inset-0 top-16 bg-black/30 z-40 lg:hidden"
//             onClick={() => setMobileOpen(false)}
//           />
//           {/* Panel */}
//           <div className="fixed top-16 left-0 right-0 bg-[#F9F8F5] border-b border-[#E8E5E0] z-50 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto shadow-xl">
//             <div className="px-4 py-3">
//               {navLinks.map(({ label, to }) => (
//                 <Link
//                   key={label}
//                   to={to}
//                   className="flex items-center py-3.5 text-sm font-bold tracking-widest text-[#2C2C2C] hover:text-[#C5A059] border-b border-[#E8E5E0] transition-colors"
//                 >
//                   {label}
//                 </Link>
//               ))}

//               {/* Categories accordion */}
//               <div className="border-b border-[#E8E5E0]">
//                 <button
//                   onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
//                   className="w-full flex items-center justify-between py-3.5 text-sm font-bold tracking-widest text-[#2C2C2C] hover:text-[#C5A059] transition-colors"
//                 >
//                   CATEGORIES
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform duration-200 ${mobileCatsOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {mobileCatsOpen && (
//                   <div className="pb-4 space-y-1 pl-2">
//                     <Link
//                       to="/categories"
//                       className="block py-2 text-sm text-[#C5A059] font-semibold"
//                     >
//                       View All Categories →
//                     </Link>
//                     {categories.map((cat) => (
//                       <Link
//                         key={cat.id}
//                         to={`/category/${cat.slug || cat.id}`}
//                         className="block py-2 text-sm text-gray-600 hover:text-[#C5A059] transition-colors"
//                       >
//                         {cat.name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* User section */}
//               {user ? (
//                 <div className="pt-2 space-y-1">
//                   <div className="flex items-center gap-2 py-2.5 text-sm text-gray-500 border-b border-[#E8E5E0]">
//                     <User className="w-4 h-4 shrink-0" />
//                     <span className="truncate">{user.name || "User"}</span>
//                   </div>
//                   {(user.role === "admin" || user.role === "shopowner") && (
//                     <Link
//                       to="/dashboard"
//                       className="flex items-center gap-2 py-3.5 text-sm font-bold tracking-widest text-[#2C2C2C] hover:text-[#C5A059] border-b border-[#E8E5E0] transition-colors"
//                       data-testid="nav-dashboard"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       DASHBOARD
//                     </Link>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 w-full py-3.5 text-sm font-bold tracking-widest text-red-500 hover:text-red-700 transition-colors"
//                     data-testid="logout-button"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     LOGOUT
//                   </button>
//                 </div>
//               ) : (
//                 <div className="pt-4 pb-2">
//                   <Link
//                     to="/login"
//                     className="block w-full text-center bg-[#2C2C2C] text-white text-xs tracking-widest font-bold uppercase px-6 py-3 hover:bg-[#C5A059] transition-colors"
//                   >
//                     Login / Sign Up
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </header>
//   );
// };

// export default Navbar;


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  Search,
} from "lucide-react";
import api from "../lib/api.jsx";

// ── Refined Mega Dropdown ──────────────────────────────────────────────────
const MegaDropdown = ({ categories, visible }) => {
  if (!visible) return null;

  const chunkSize = 5;
  const cols = [];
  for (let i = 0; i < categories.length; i += chunkSize) {
    cols.push(categories.slice(i, i + chunkSize));
  }

  return (
    <div className="absolute top-full left-0 w-screen bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="container mx-auto px-12 lg:px-24 py-12 flex gap-16">
        {/* Left Featured Block */}
        <div className="w-64 shrink-0 bg-[#FCFAF8] p-8 border border-gray-100 relative group">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-4 block">Archive</span>
          <h3 className="font-serif italic text-2xl text-[#2C2C2C] mb-4">The Silk Series</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-6 tracking-wide">Explore our signature hand-woven sarees curated for elegance.</p>
          <Link to="/catalog" className="text-[10px] font-bold tracking-widest uppercase border-b border-[#2C2C2C] pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-all">
            Shop Collection
          </Link>
        </div>

        {/* Dynamic Category Columns */}
        <div className="flex-1 grid grid-cols-4 gap-8">
          {cols.slice(0, 4).map((col, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-6">Column 0{idx + 1}</p>
              <ul className="space-y-4">
                {col.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug || cat.id}`}
                      className="text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#C5A059] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Main Navbar ────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const navLinks = [
    { label: "CATALOG", to: "/catalog" },
    { label: "OUR STORY", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-50">
      <nav className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Left: Mobile Menu Trigger */}
        <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2">
          <Menu className="w-5 h-5 text-[#2C2C2C]" />
        </button>

        {/* Left: Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-10">
          <div 
            ref={dropRef} 
            className="relative h-20 flex items-center"
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <button onClick={() => navigate("/categories")} className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#2C2C2C] hover:text-[#C5A059] transition-colors uppercase">
              CATEGORIES <ChevronDown className={`w-3 h-3 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
            </button>
            <MegaDropdown categories={categories} visible={dropOpen} />
          </div>
          {navLinks.map(link => (
            <Link key={link.label} to={link.to} className="relative text-[10px] font-bold tracking-[0.2em] text-[#2C2C2C] hover:text-[#C5A059] transition-colors uppercase group">
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Center: Branding */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-heading text-xl md:text-2xl font-light tracking-tighter text-[#2C2C2C]">
            GM_ <span className="font-serif italic text-[#C5A059]">Bastralaya</span>
          </h1>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* <Search className="w-4 h-4 text-[#2C2C2C] cursor-pointer hover:text-[#C5A059] hidden sm:block" /> */}
          
          {user ? (
            <div className="flex items-center gap-4">
              {(user.role === "admin" || user.role === "shopowner") && (
                <Link to="/dashboard" className="p-2 hover:bg-[#FCFAF8] rounded-full transition-colors">
                  <LayoutDashboard className="w-4 h-4 text-[#2C2C2C]" />
                </Link>
              )}
              <div className="group relative">
                <User className="w-4 h-4 text-[#2C2C2C] cursor-pointer" />
                <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-4">
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">{user.name}</p>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest">
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-[#2C2C2C] text-white text-[10px] font-bold tracking-[0.2em] px-8 py-3 hover:bg-[#C5A059] transition-all uppercase hidden sm:block">
              Sign In
            </Link>
          )}
          
          <Link to="/catalog" className="relative p-2">
            <ShoppingBag className="w-4 h-4 text-[#2C2C2C]" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#C5A059] rounded-full" />
          </Link>
        </div>
      </nav>

      {/* ── Mobile Side Drawer ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full p-8 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
            <button onClick={() => setMobileOpen(false)} className="self-end mb-12 p-2">
              <X className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            
            <nav className="space-y-8 flex-1">
              {['HOME', 'COLLECTIONS', 'CATEGORIES', 'OUR STORY'].map(item => (
                <Link 
                  key={item} 
                  to={item === 'HOME' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                  className="block text-xl font-heading font-light tracking-widest text-[#2C2C2C]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {!user && (
              <Link to="/login" className="bg-[#2C2C2C] text-white py-5 text-center text-xs font-bold tracking-widest uppercase">
                Member Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;