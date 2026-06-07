// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
// import { Phone, ExternalLink, Search, MessageSquare } from "lucide-react";
// import { Input } from "../../components/ui/input";
// import api from "../../lib/api.jsx";
// import { toast } from "sonner";

// const Enquiries = () => {
//   const [enquiries, setEnquiries] = useState([]);
//   const [products, setProducts] = useState({}); // id → title map
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     try {
//       const [enqRes, prodRes] = await Promise.all([
//         api.get("/enquiries?limit=200"),
//         api.get("/products?limit=500&include_inactive=true"),
//       ]);
//       setEnquiries(enqRes.data);
//       // Build id → title map for quick lookup
//       const map = {};
//       prodRes.data.forEach((p) => {
//         map[p.id] = p.title;
//       });
//       setProducts(map);
//     } catch {
//       toast.error("Failed to load enquiries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filtered = enquiries.filter((e) => {
//     if (!search) return true;
//     const s = search.toLowerCase();
//     return (
//       e.e164_number?.includes(s) ||
//       e.message_preview?.toLowerCase().includes(s) ||
//       products[e.product_id]?.toLowerCase().includes(s)
//     );
//   });

//   const formatPhone = (e164) => {
//     // "+919876543210" → "+91 98765 43210"
//     if (!e164) return "—";
//     if (e164.startsWith("+91") && e164.length === 13) {
//       return `+91 ${e164.slice(3, 8)} ${e164.slice(8)}`;
//     }
//     return e164;
//   };

//   return (
//     <div className="p-8" data-testid="enquiries-page">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
//             Enquiries
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">
//             {enquiries.length} customer enquir
//             {enquiries.length !== 1 ? "ies" : "y"}
//           </p>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="relative mb-5">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//         <Input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by phone, product name or message…"
//           className="pl-9 bg-white border-[#E8E5E0] focus:border-[#C5A059]"
//         />
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center py-24">
//           <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-20 bg-white border border-[#F2F0EB] rounded-xl">
//           <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
//           <p className="text-gray-500">
//             {search ? `No enquiries matching "${search}"` : "No enquiries yet"}
//           </p>
//           {!search && (
//             <p className="text-sm text-gray-400 mt-1">
//               Customer WhatsApp enquiries will appear here.
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="bg-white border border-[#F2F0EB] rounded-xl overflow-hidden shadow-sm">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-[#F9F8F5] hover:bg-[#F9F8F5]">
//                 <TableHead className="pl-6">Customer Phone</TableHead>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Message</TableHead>
//                 <TableHead>Source</TableHead>
//                 <TableHead className="pr-5 text-right">Date</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filtered.map((item) => (
//                 <TableRow
//                   key={item.id}
//                   className="hover:bg-[#F9F8F5]/50 border-b border-[#F2F0EB]"
//                 >
//                   {/* Phone */}
//                   <TableCell className="pl-6">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
//                         <Phone className="w-3.5 h-3.5 text-[#25D366]" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-[#2C2C2C] text-sm">
//                           {formatPhone(item.e164_number)}
//                         </p>
//                         <p className="text-[10px] text-gray-400">
//                           via WhatsApp
//                         </p>
//                       </div>
//                     </div>
//                   </TableCell>

//                   {/* Product */}
//                   <TableCell>
//                     <p className="text-sm font-medium text-[#2C2C2C]">
//                       {products[item.product_id] || (
//                         <span className="text-gray-400 italic text-xs">
//                           Unknown product
//                         </span>
//                       )}
//                     </p>
//                     <p className="text-[10px] text-gray-400 font-mono">
//                       {item.product_id?.slice(0, 8)}…
//                     </p>
//                   </TableCell>

//                   {/* Message */}
//                   <TableCell>
//                     <p className="text-sm text-gray-600 italic max-w-xs truncate">
//                       "{item.message_preview}"
//                     </p>
//                   </TableCell>

//                   {/* Source URL */}
//                   <TableCell>
//                     {item.source_url ? (
//                       <a
//                         href={item.source_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1 text-xs text-blue-500 hover:underline max-w-[140px] truncate"
//                       >
//                         <ExternalLink className="w-3 h-3 shrink-0" />
//                         {item.source_url.replace(/https?:\/\/[^/]+/, "")}
//                       </a>
//                     ) : (
//                       "—"
//                     )}
//                   </TableCell>

//                   {/* Date */}
//                   <TableCell className="pr-5 text-right">
//                     <p className="text-xs text-gray-500 font-medium">
//                       {new Date(item.created_at).toLocaleDateString("en-IN", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                     <p className="text-[10px] text-gray-400">
//                       {new Date(item.created_at).toLocaleTimeString("en-IN", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <div className="px-6 py-3 border-t border-[#F2F0EB] bg-[#F9F8F5]">
//             <p className="text-xs text-gray-400">
//               Showing {filtered.length} of {enquiries.length} enquiries · newest
//               first
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Enquiries;

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Phone, ExternalLink, Search, MessageSquare } from "lucide-react";
import { Input } from "../../components/ui/input";
import api from "../../lib/api.jsx";
import { toast } from "sonner";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState({}); // id → title map
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [enqRes, prodRes] = await Promise.all([
        api.get("/enquiries?limit=200"),
        api.get("/products?limit=500&include_inactive=true"),
      ]);
      setEnquiries(enqRes.data);
      // Build id → title map for quick lookup
      const map = {};
      prodRes.data.forEach((p) => {
        map[p.id] = p.title;
      });
      setProducts(map);
    } catch {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const filtered = enquiries.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      e.e164_number?.includes(s) ||
      e.message_preview?.toLowerCase().includes(s) ||
      products[e.product_id]?.toLowerCase().includes(s)
    );
  });

  const formatPhone = (e164) => {
    // "+919876543210" → "+91 98765 43210"
    if (!e164) return "—";
    if (e164.startsWith("+91") && e164.length === 13) {
      return `+91 ${e164.slice(3, 8)} ${e164.slice(8)}`;
    }
    return e164;
  };

  return (
    <div className="p-4 sm:p-8" data-testid="enquiries-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-4xl font-semibold text-[#2C2C2C]">
            Enquiries
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {enquiries.length} customer enquir
            {enquiries.length !== 1 ? "ies" : "y"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by phone, product name or message…"
          className="pl-9 bg-white border-[#E8E5E0] focus:border-[#C5A059]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F2F0EB] rounded-xl">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">
            {search ? `No enquiries matching "${search}"` : "No enquiries yet"}
          </p>
          {!search && (
            <p className="text-sm text-gray-400 mt-1">
              Customer WhatsApp enquiries will appear here.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#F2F0EB] rounded-xl overflow-hidden shadow-sm">
          {/* ── MOBILE: Card list (hidden on md+) ── */}
          <div className="md:hidden divide-y divide-[#F2F0EB]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-[#F9F8F5]/50 transition-colors"
              >
                {/* Top row: phone + date */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2C2C2C] text-sm">
                        {formatPhone(item.e164_number)}
                      </p>
                      <p className="text-[10px] text-gray-400">via WhatsApp</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium shrink-0">
                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Product */}
                <p className="text-sm font-medium text-[#2C2C2C] mb-1 line-clamp-1">
                  {products[item.product_id] || (
                    <span className="text-gray-400 italic text-xs">
                      Unknown product
                    </span>
                  )}
                </p>

                {/* Message */}
                {item.message_preview && (
                  <p className="text-xs text-gray-500 italic mb-1 line-clamp-2">
                    "{item.message_preview}"
                  </p>
                )}

                {/* Source URL */}
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline truncate max-w-full"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {item.source_url.replace(/https?:\/\/[^/]+/, "") || "/"}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* ── DESKTOP: Table (hidden on mobile) ── */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F9F8F5] hover:bg-[#F9F8F5]">
                  <TableHead className="pl-6">Customer Phone</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="pr-5 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-[#F9F8F5]/50 border-b border-[#F2F0EB]"
                  >
                    {/* Phone */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                          <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C2C2C] text-sm">
                            {formatPhone(item.e164_number)}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            via WhatsApp
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Product */}
                    <TableCell>
                      <p className="text-sm font-medium text-[#2C2C2C]">
                        {products[item.product_id] || (
                          <span className="text-gray-400 italic text-xs">
                            Unknown product
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {item.product_id?.slice(0, 8)}…
                      </p>
                    </TableCell>

                    {/* Message */}
                    <TableCell>
                      <p className="text-sm text-gray-600 italic max-w-xs truncate">
                        "{item.message_preview}"
                      </p>
                    </TableCell>

                    {/* Source URL */}
                    <TableCell>
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-500 hover:underline max-w-[140px] truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          {item.source_url.replace(/https?:\/\/[^/]+/, "")}
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="pr-5 text-right">
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(item.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(item.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="px-4 sm:px-6 py-3 border-t border-[#F2F0EB] bg-[#F9F8F5]">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {enquiries.length} enquiries · newest
              first
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;