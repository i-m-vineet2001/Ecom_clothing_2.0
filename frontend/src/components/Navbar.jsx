// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "@/Components/ui/button";
// import { LogOut, User, ShoppingBag } from "lucide-react";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
//       <div className="px-6 md:px-12 lg:px-24 py-4">
//         <div className="flex items-center justify-between">
//           <Link
//             to="/"
//             className="font-heading text-2xl tracking-tight text-[#2C2C2C] hover:text-[#C5A059] transition-colors"
//             data-testid="logo-link"
//           >
//             GM_<span className="text-[#C5A059]">Bastralaya</span>
//           </Link>

//           <div className="hidden md:flex items-center gap-8">
//             <Link
//               to="/"
//               className="text-sm tracking-wide uppercase hover:text-[#C5A059] transition-colors"
//               data-testid="nav-home"
//             >
//               Home
//             </Link>
//             <Link
//               to="/catalog"
//               className="text-sm tracking-wide uppercase hover:text-[#C5A059] transition-colors"
//               data-testid="nav-catalog"
//             >
//               Catalog
//             </Link>
//             <Link
//               to="/categories"
//               className="text-sm tracking-wide uppercase hover:text-[#C5A059] transition-colors"
//               data-testid="nav-categories"
//             >
//               Categories
//             </Link>
//             <Link
//               to="/about"
//               className="text-sm tracking-wide uppercase hover:text-[#C5A059] transition-colors"
//               data-testid="nav-about"
//             >
//               About
//             </Link>
//           </div>

//           <div className="flex items-center gap-4">
//             {user ? (
//               <>
//                 {(user.role === "admin" || user.role === "shopowner") && (
//                   <Link to="/dashboard" data-testid="nav-dashboard">
//                     <Button variant="ghost" size="sm" className="gap-2">
//                       <ShoppingBag className="w-4 h-4" />
//                       Dashboard
//                     </Button>
//                   </Link>
//                 )}
//                 <div
//                   className="flex items-center gap-2 text-sm"
//                   data-testid="user-info"
//                 >
//                   <User className="w-4 h-4" />
//                   <span>{user.name}</span>
//                 </div>
//                 <Button
//                   onClick={handleLogout}
//                   variant="ghost"
//                   size="sm"
//                   data-testid="logout-button"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </Button>
//               </>
//             ) : (
//               <Link to="/login" data-testid="login-link">
//                 <Button className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] px-6 py-2 rounded-none uppercase text-xs tracking-widest">
//                   Login
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F9F8F5] border-b border-[#E8E5E0]">
      <nav className="flex items-center justify-between px-12 h-16">
        {/* Logo - left */}
        <Link
          to="/"
          className="font-heading text-[1.25rem] font-semibold text-[#2C2C2C] no-underline tracking-tight shrink-0"
          data-testid="logo-link"
        >
          GM_<span className="text-[#C5A059]">Bastralaya</span>
        </Link>

        {/* Center Nav Links */}
        <div className="flex items-center gap-10">
          {[
            { label: "HOME", to: "/" },
            { label: "CATALOG", to: "/catalog" },
            { label: "CATEGORIES", to: "/categories" },
            { label: "ABOUT", to: "/about" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-[#2C2C2C] text-[0.7rem] font-body tracking-[0.13em] no-underline hover:text-[#C5A059] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side - Dashboard, User, Logout */}
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