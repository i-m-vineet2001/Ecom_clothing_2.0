// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Star, Send, CheckCircle, Mail, MapPin, Instagram, Facebook } from "lucide-react";
// import api from "../lib/api.jsx";

// const formatDisplay = (e164) => {
//   if (!e164) return null;
//   const m = e164.match(/^\+(\d{1,3})(\d{5})(\d{5})$/);
//   return m ? `+${m[1]} ${m[2]} ${m[3]}` : e164;
// };

// const StarPicker = ({ value, onChange }) => (
//   <div className="flex gap-1">
//     {[1, 2, 3, 4, 5].map((n) => (
//       <button key={n} type="button" onClick={() => onChange(n)} className="focus:outline-none transition-transform hover:scale-125">
//         <Star className={`w-4 h-4 transition-colors ${n <= value ? "text-[#C5A059] fill-[#C5A059]" : "text-white/20"}`} />
//       </button>
//     ))}
//   </div>
// );

// const FeedbackBox = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [rating, setRating] = useState(5);
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);
//   const [done, setDone] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name.trim() || !message.trim()) return;
//     setSending(true);
//     try {
//       await api.post("/feedback", { name: name.trim(), email: email.trim(), rating, message: message.trim(), page_url: window.location.href });
//       setDone(true);
//     } catch { alert("Something went wrong."); }
//     finally { setSending(false); }
//   };

//   if (done) return (
//     <div className="flex flex-col items-center py-6 text-center">
//       <CheckCircle className="w-8 h-8 text-[#C5A059] mb-3" />
//       <p className="text-[10px] uppercase tracking-[0.2em] text-white">Message Received</p>
//       <button onClick={() => setDone(false)} className="mt-4 text-[9px] uppercase tracking-widest text-white/40 hover:text-white underline decoration-[#C5A059]">Send Another</button>
//     </div>
//   );

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <input placeholder="NAME *" value={name} onChange={(e) => setName(e.target.value)}
//           className="bg-transparent border-b border-white/10 py-2 text-[10px] tracking-widest uppercase focus:border-[#C5A059] outline-none transition-colors text-white placeholder-white/30" />
//         <input placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)}
//           className="bg-transparent border-b border-white/10 py-2 text-[10px] tracking-widest uppercase focus:border-[#C5A059] outline-none transition-colors text-white placeholder-white/30" />
//       </div>
//       <div className="flex items-center justify-between py-2">
//         <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Rating</span>
//         <StarPicker value={rating} onChange={setRating} />
//       </div>
//       <textarea placeholder="YOUR MESSAGE..." value={message} onChange={(e) => setMessage(e.target.value)} rows={2}
//         className="w-full bg-white/5 border border-white/10 p-3 text-[10px] tracking-widest focus:border-[#C5A059] outline-none transition-colors resize-none text-white placeholder-white/30" />
//       <button type="submit" disabled={sending}
//         className="w-full bg-white text-[#2C2C2C] text-[10px] font-bold tracking-[0.3em] uppercase py-3 hover:bg-[#C5A059] hover:text-white transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50">
//         <Send className="w-3 h-3" /> {sending ? "Sending..." : "Submit Feedback"}
//       </button>
//     </form>
//   );
// };

// const Footer = () => {
//   const [waNumber, setWaNumber] = useState(null);

//   useEffect(() => {
//     api.get("/whatsapp-default").then((res) => setWaNumber(res.data?.e164_number)).catch(() => {});
//   }, []);

//   return (
//     <footer className="bg-[#1A1A1A] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
//       <div className="container mx-auto px-6 md:px-12 lg:px-24">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-20">

//           {/* Brand & Identity */}
//           <div className="lg:col-span-4">
//             <h3 className="font-heading text-4xl font-light mb-6 tracking-tighter">
//               GM_ <span className="font-serif italic text-[#C5A059]">Bastralaya</span>
//             </h3>
//             <p className="text-[11px] text-white/40 leading-relaxed tracking-widest uppercase mb-8 max-w-sm">
//               Crafting elegance in every thread. A legacy of handloom excellence since 1995.
//             </p>
//           </div>

//           {/* Nav Columns */}
//           <div className="lg:col-span-4 grid grid-cols-2 gap-8">
//             <div>
//               <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-8">Navigation</h4>
//               <nav className="flex flex-col gap-4">
//                 {[
//                   { label: "Catalog", to: "/catalog" },
//                   { label: "Categories", to: "/categories" },
//                   { label: "About Us", to: "/about" },
//                 ].map(({ label, to }) => (
//                   <Link key={label} to={to} className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">
//                     {label}
//                   </Link>
//                 ))}
//               </nav>
//             </div>

//             <div>
//               <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-8">Connect</h4>
//               <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/60">

//                 {/* WhatsApp */}
//                 {waNumber && (
//                   <a href={`https://wa.me/${waNumber.replace("+", "")}`} target="_blank" rel="noreferrer"
//                     className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
//                     <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
//                     </svg>
//                     {formatDisplay(waNumber)}
//                   </a>
//                 )}

//                 {/* Email */}
//                 <a href="mailto:info@gmbastralaya.com" className="flex items-center gap-2 hover:text-white transition-colors normal-case">
//                   <Mail className="w-4 h-4 shrink-0" />
//                   info@gmbastralaya.com
//                 </a>

//                 {/* Instagram */}
//                 <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#E1306C] transition-colors">
//                   <Instagram className="w-4 h-4 shrink-0" />
//                   Instagram
//                 </a>

//                 {/* Facebook */}
//                 <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#1877F2] transition-colors">
//                   <Facebook className="w-4 h-4 shrink-0" />
//                   Facebook
//                 </a>

//                 {/* Location */}
//                 <span className="flex items-center gap-2">
//                   <MapPin className="w-4 h-4 shrink-0" />
//                   Odisha, India
//                 </span>

//               </div>
//             </div>
//           </div>

//           {/* Guestbook / Feedback */}
//           <div className="lg:col-span-4 bg-white/5 p-8 rounded-sm">
//             <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-8">Guestbook</h4>
//             <FeedbackBox />
//           </div>

//         </div>

//         {/* Copyright */}
//         <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5">
//           <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-4 md:mb-0">
//             &copy; {new Date().getFullYear()} GM_BASTRALAYA SIGNATURE. ALL RIGHTS RESERVED.
//           </p>
//           <div className="flex gap-8 text-[9px] uppercase tracking-[0.4em] text-white/20">
//             <span className="hover:text-white/40 cursor-pointer transition-colors">Privacy Policy</span>
//             <span className="hover:text-white/40 cursor-pointer transition-colors">Terms of Service</span>
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Send,
  CheckCircle,
  Mail,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react";
import api from "../lib/api.jsx";

const formatDisplay = (e164) => {
  if (!e164) return null;
  const m = e164.match(/^\+(\d{1,3})(\d{5})(\d{5})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]}` : e164;
};

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="focus:outline-none transition-transform hover:scale-125 p-1"
      >
        <Star
          className={`w-4 h-4 transition-colors ${n <= value ? "text-[#C5A059] fill-[#C5A059]" : "text-white/20"}`}
        />
      </button>
    ))}
  </div>
);

const FeedbackBox = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      await api.post("/feedback", {
        name: name.trim(),
        email: email.trim(),
        rating,
        message: message.trim(),
        page_url: window.location.href,
      });
      setDone(true);
    } catch {
      alert("Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  if (done)
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle className="w-8 h-8 text-[#C5A059] mb-3" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-white">
          Message Received
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-4 text-[9px] uppercase tracking-widest text-white/40 hover:text-white underline decoration-[#C5A059]"
        >
          Send Another
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Email — full width on mobile, side by side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          placeholder="NAME *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border-b border-white/10 py-2.5 text-[10px] tracking-widest uppercase focus:border-[#C5A059] outline-none transition-colors text-white placeholder-white/30"
        />
        <input
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-b border-white/10 py-2.5 text-[10px] tracking-widest uppercase focus:border-[#C5A059] outline-none transition-colors text-white placeholder-white/30"
        />
      </div>
      <div className="flex items-center justify-between py-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">
          Rating
        </span>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <textarea
        placeholder="YOUR MESSAGE..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full bg-white/5 border border-white/10 p-3 text-[10px] tracking-widest focus:border-[#C5A059] outline-none transition-colors resize-none text-white placeholder-white/30"
      />
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-white text-[#2C2C2C] text-[10px] font-bold tracking-[0.3em] uppercase py-3.5 hover:bg-[#C5A059] hover:text-white transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="w-3 h-3" />{" "}
        {sending ? "Sending..." : "Submit Feedback"}
      </button>
    </form>
  );
};

const Footer = () => {
  const [waNumber, setWaNumber] = useState(null);

  useEffect(() => {
    api
      .get("/whatsapp-default")
      .then((res) => setWaNumber(res.data?.e164_number))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#1A1A1A] text-white pt-12 md:pt-24 pb-10 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-5 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24 mb-12 md:mb-20">
          {/* Brand */}
          <div className="lg:col-span-4">
            <h3 className="font-heading text-3xl md:text-4xl font-light mb-4 md:mb-6 tracking-tighter">
              GM_{" "}
              <span className="font-serif italic text-[#C5A059]">
                Bastralaya
              </span>
            </h3>
            <p className="text-[11px] text-white/40 leading-relaxed tracking-widest uppercase max-w-sm">
              Crafting elegance in every thread. A legacy of handloom excellence
              since 1995.
            </p>
          </div>

          {/* Nav + Connect — side by side on mobile too */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-5 md:mb-8">
                Navigation
              </h4>
              <nav className="flex flex-col gap-3 md:gap-4">
                {[
                  { label: "Catalog", to: "/catalog" },
                  { label: "Categories", to: "/categories" },
                  { label: "About Us", to: "/about" },
                ].map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-5 md:mb-8">
                Connect
              </h4>
              <div className="flex flex-col gap-3 md:gap-4 text-[10px] uppercase tracking-widest text-white/60">
                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber.replace("+", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-current shrink-0"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {formatDisplay(waNumber)}
                  </a>
                )}
                <a
                  href="mailto:info@gmbastralaya.com"
                  className="flex items-center gap-2 hover:text-white transition-colors normal-case break-all"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">info@gmbastralaya.com</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-[#E1306C] transition-colors"
                >
                  <Instagram className="w-4 h-4 shrink-0" /> Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-[#1877F2] transition-colors"
                >
                  <Facebook className="w-4 h-4 shrink-0" /> Facebook
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" /> Odisha, India
                </span>
              </div>
            </div>
          </div>

          {/* Guestbook — full width on mobile */}
          <div className="md:col-span-2 lg:col-span-4 bg-white/5 p-6 md:p-8 rounded-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-6 md:mb-8">
              Guestbook
            </h4>
            <FeedbackBox />
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 md:pt-12 border-t border-white/5 gap-4">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 text-center md:text-left">
            &copy; {new Date().getFullYear()} GM_BASTRALAYA SIGNATURE. ALL
            RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 md:gap-8 text-[9px] uppercase tracking-[0.4em] text-white/20">
            <span className="hover:text-white/40 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;