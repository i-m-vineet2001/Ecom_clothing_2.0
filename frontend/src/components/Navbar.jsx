import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import api from "../lib/api.jsx";

// ── Mega Dropdown (Desktop only) ──────────────────────────────────────────
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
        <div className="w-64 shrink-0 bg-[#FCFAF8] p-8 border border-gray-100">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-4 block">
            Archive
          </span>
          <h3 className="font-serif italic text-2xl text-[#2C2C2C] mb-4">
            The Silk Series
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-6 tracking-wide">
            Explore our signature hand-woven sarees curated for elegance.
          </p>
          <Link
            to="/catalog"
            className="text-[10px] font-bold tracking-widest uppercase border-b border-[#2C2C2C] pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-all"
          >
            Shop Collection
          </Link>
        </div>
        <div className="flex-1 grid grid-cols-4 gap-8">
          {cols.slice(0, 4).map((col, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-6">
                Column 0{idx + 1}
              </p>
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

// ── Main Navbar ────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const navLinks = [
    { label: "CATALOG", to: "/catalog" },
    { label: "OUR STORY", to: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100">
        <nav className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 lg:px-12">
          {/* LEFT: Mobile hamburger / Desktop nav links */}
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 -ml-1 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#2C2C2C]" />
            </button>

            <div className="hidden lg:flex items-center gap-10">
              <div
                ref={dropRef}
                className="relative h-20 flex items-center"
                onMouseEnter={() => setDropOpen(true)}
                onMouseLeave={() => setDropOpen(false)}
              >
                <button
                  onClick={() => navigate("/categories")}
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#2C2C2C] hover:text-[#C5A059] transition-colors uppercase"
                >
                  CATEGORIES
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${dropOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <MegaDropdown categories={categories} visible={dropOpen} />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="relative text-[10px] font-bold tracking-[0.2em] text-[#2C2C2C] hover:text-[#C5A059] transition-colors uppercase group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER: Logo */}
          <Link to="/" className="flex-shrink-0 mx-4">
            <h1 className="font-heading text-lg md:text-xl lg:text-2xl font-light tracking-tighter text-[#2C2C2C] whitespace-nowrap">
              GM_{" "}
              <span className="font-serif italic text-[#C5A059]">
                Bastralaya
              </span>
            </h1>
          </Link>

          {/* RIGHT: User icon/button */}
          <div className="flex items-center flex-1 justify-end">
            {user ? (
              // ── Logged in: icon + dropdown (same on all screen sizes) ──
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="p-2 hover:bg-[#FCFAF8] rounded-full transition-colors"
                  aria-label="Account"
                >
                  <User className="w-4 h-4 text-[#2C2C2C]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 shadow-xl z-50 p-4">
                    <p className="text-[10px] font-bold tracking-widest text-[#2C2C2C] uppercase">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-[10px] text-gray-400 mt-0.5 mb-4 truncate">
                        {user.email}
                      </p>
                    )}
                    {(user.role === "admin" || user.role === "shopowner") && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 text-[10px] font-bold text-[#2C2C2C] hover:text-[#C5A059] uppercase tracking-widest mb-3 transition-colors"
                      >
                        <LayoutDashboard className="w-3 h-3" /> Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                    >
                      <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Desktop: Sign In button */}
                <Link
                  to="/login"
                  className="hidden sm:block bg-[#2C2C2C] text-white text-[10px] font-bold tracking-[0.2em] px-5 md:px-8 py-2.5 md:py-3 hover:bg-[#C5A059] transition-all uppercase"
                >
                  Sign In
                </Link>
                {/* Mobile: User icon → goes to login */}
                <button
                  onClick={() => navigate("/login")}
                  className="sm:hidden p-2 hover:bg-[#FCFAF8] rounded-full transition-colors"
                  aria-label="Sign in"
                >
                  <User className="w-4 h-4 text-[#2C2C2C]" />
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Side Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] flex"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading text-base font-light tracking-tighter text-[#2C2C2C]">
                GM_{" "}
                <span className="font-serif italic text-[#C5A059]">
                  Bastralaya
                </span>
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5 text-[#2C2C2C]" />
              </button>
            </div>

            <nav className="flex-1 px-6 py-8 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-4 border-b border-gray-50 text-[11px] font-bold tracking-[0.25em] text-[#2C2C2C] uppercase hover:text-[#C5A059] transition-colors"
              >
                Home
              </Link>

              <div className="border-b border-gray-50">
                <button
                  onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
                  className="w-full flex items-center justify-between py-4 text-[11px] font-bold tracking-[0.25em] text-[#2C2C2C] uppercase hover:text-[#C5A059] transition-colors"
                >
                  Categories
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${mobileCatsOpen ? "rotate-90" : ""}`}
                  />
                </button>
                {mobileCatsOpen && categories.length > 0 && (
                  <div className="pb-4 pl-4 space-y-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug || cat.id}`}
                        onClick={() => setMobileOpen(false)}
                        className="block text-[11px] tracking-widest text-gray-500 hover:text-[#C5A059] uppercase transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/catalog"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-4 border-b border-gray-50 text-[11px] font-bold tracking-[0.25em] text-[#2C2C2C] uppercase hover:text-[#C5A059] transition-colors"
              >
                Catalog
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-4 border-b border-gray-50 text-[11px] font-bold tracking-[0.25em] text-[#2C2C2C] uppercase hover:text-[#C5A059] transition-colors"
              >
                Our Story
              </Link>

              {user && (user.role === "admin" || user.role === "shopowner") && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-4 border-b border-gray-50 text-[11px] font-bold tracking-[0.25em] text-[#2C2C2C] uppercase hover:text-[#C5A059] transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
              )}
            </nav>

            <div className="p-6 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    {user.name}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full bg-[#2C2C2C] text-white py-4 text-center text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#C5A059] transition-all"
                >
                  Member Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
