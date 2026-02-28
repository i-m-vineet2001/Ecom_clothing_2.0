import React, { useEffect, useState } from "react";
import { ShieldCheck, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import api from "../../lib/api";
import { toast } from "sonner";

const ACTION_STYLES = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-purple-100 text-purple-700",
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState({}); // id → name/email map
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [logsRes, usersRes] = await Promise.all([
        api.get("/audit-logs?limit=200"),
        api.get("/users"),
      ]);
      setLogs(logsRes.data);
      // Build id → display name map
      const map = {};
      usersRes.data.forEach((u) => {
        map[u.id] = { name: u.name, email: u.email };
      });
      setUsers(map);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const u = users[l.user_id];
    return (
      l.action?.toLowerCase().includes(s) ||
      l.entity_type?.toLowerCase().includes(s) ||
      l.entity_id?.toLowerCase().includes(s) ||
      u?.name?.toLowerCase().includes(s) ||
      u?.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-8" data-testid="audit-logs-page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
          Audit Trail
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {logs.length} system event{logs.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, action, or entity type…"
          className="pl-9 bg-white border-[#E8E5E0] focus:border-[#C5A059]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F2F0EB] rounded-xl">
          <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">
            {search ? `No logs matching "${search}"` : "No audit logs yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((log) => {
            const user = users[log.user_id];
            const actionStyle =
              ACTION_STYLES[log.action] || "bg-gray-100 text-gray-600";
            const initials = user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "?";

            return (
              <div
                key={log.id}
                className="p-5 bg-white border border-[#F2F0EB] rounded-xl flex items-center justify-between hover:border-[#C5A059]/40 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#C5A059]">
                      {initials}
                    </span>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#2C2C2C]">
                        {user?.name || "Unknown user"}
                      </span>
                      {user?.email && (
                        <span className="text-xs text-gray-400">
                          {user.email}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${actionStyle}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-sm text-gray-600">
                        a{" "}
                        <span className="font-medium text-[#2C2C2C]">
                          {log.entity_type}
                        </span>
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      ID: {log.entity_id?.slice(0, 16)}…
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    {new Date(log.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
