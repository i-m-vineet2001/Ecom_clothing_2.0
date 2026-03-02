// import React from "react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-[#2C2C2C] text-white">
//       <div className="px-6 md:px-12 lg:px-24 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//           <div>
//             <h3 className="font-heading text-2xl mb-4">
//               GM_<span className="text-[#C5A059]">Bastralaya</span>
//             </h3>
//             <p className="text-sm text-gray-400 leading-relaxed font-body">
//               Crafting elegance in every thread. Your destination for premium
//               fashion textiles.
//             </p>
//           </div>

//           <div>
//             <h4 className="font-body font-bold text-sm uppercase tracking-widest mb-4">
//               Quick Links
//             </h4>
//             <div className="flex flex-col gap-2">
//               <Link
//                 to="/catalog"
//                 className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors font-body no-underline"
//               >
//                 Catalog
//               </Link>
//               <Link
//                 to="/categories"
//                 className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors font-body no-underline"
//               >
//                 Categories
//               </Link>
//               <Link
//                 to="/about"
//                 className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors font-body no-underline"
//               >
//                 About Us
//               </Link>
//             </div>
//           </div>

//           <div>
//             <h4 className="font-body font-bold text-sm uppercase tracking-widest mb-4">
//               Contact
//             </h4>
//             <p className="text-sm text-gray-400 leading-relaxed font-body">
//               WhatsApp: +91 98765 43210
//               <br />
//               Email: info@gmbastralaya.com
//             </p>
//           </div>
//         </div>

//         <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400 font-body">
//           <p>
//             &copy; {new Date().getFullYear()} GM_Bastralaya. All rights
//             reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Send, CheckCircle, X } from "lucide-react";
import api from "../lib/api";

// ── WhatsApp number fetch ────────────────────────────────────────────────────
const formatDisplay = (e164) => {
  if (!e164) return null;
  const m = e164.match(/^\+(\d{1,3})(\d{5})(\d{5})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]}` : e164;
};

// ── Star rating picker ───────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="focus:outline-none transition-transform hover:scale-110"
      >
        <Star
          className={`w-5 h-5 transition-colors ${
            n <= value ? "text-[#C5A059] fill-[#C5A059]" : "text-gray-500"
          }`}
        />
      </button>
    ))}
  </div>
);

// ── Feedback Box ─────────────────────────────────────────────────────────────
const FeedbackBox = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Name and message are required.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await api.post("/feedback", {
        name: name.trim(),
        email: email.trim(),
        rating,
        message: message.trim(),
        page_url: window.location.href,
      });
      setDone(true);
      setName("");
      setEmail("");
      setRating(5);
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (done)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <CheckCircle className="w-10 h-10 text-[#C5A059]" />
        <p className="text-white font-heading text-lg">
          Thank you for your feedback!
        </p>
        <p className="text-gray-400 text-sm">
          We appreciate you taking the time to share your thoughts.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-2 text-xs text-gray-500 hover:text-[#C5A059] transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Submit another
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name + Email row */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#3a3a3a] text-white text-sm px-3 py-2 rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059] border border-transparent focus:border-[#C5A059]"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#3a3a3a] text-white text-sm px-3 py-2 rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059] border border-transparent focus:border-[#C5A059]"
        />
      </div>

      {/* Star rating */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Rating:</span>
        <StarPicker value={rating} onChange={setRating} />
        <span className="text-xs text-gray-500">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
        </span>
      </div>

      {/* Message */}
      <textarea
        placeholder="Share your experience or suggestion… *"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full bg-[#3a3a3a] text-white text-sm px-3 py-2 rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059] border border-transparent focus:border-[#C5A059] resize-none"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#b8904a] text-white text-sm font-semibold px-5 py-2 rounded transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {sending ? "Sending…" : "Send Feedback"}
      </button>
    </form>
  );
};

// ── Main Footer ──────────────────────────────────────────────────────────────
const Footer = () => {
  const [waNumber, setWaNumber] = useState(null);

  useEffect(() => {
    api
      .get("/whatsapp-default")
      .then((res) => {
        if (res.data?.e164_number) setWaNumber(res.data.e164_number);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#2C2C2C] text-white">
      <div className="px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl mb-4">
              GM_<span className="text-[#C5A059]">Bastralaya</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crafting elegance in every thread. Your destination for premium
              fashion textiles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/catalog"
                className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
              >
                Catalog
              </Link>
              <Link
                to="/categories"
                className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">
              Contact
            </h4>
            <div className="text-sm text-gray-400 space-y-2">
              {waNumber ? (
                <a
                  href={`https://wa.me/${waNumber.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#C5A059] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-current shrink-0"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {formatDisplay(waNumber)}
                </a>
              ) : (
                <span className="text-gray-600 text-xs">Loading…</span>
              )}
              <p>Email: info@gmbastralaya.com</p>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">
              Share Feedback
            </h4>
            <FeedbackBox />
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} GM_Bastralaya. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;