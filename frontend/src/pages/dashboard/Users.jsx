
import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import api from "../../lib/api.jsx";
import { useAuth } from "../../contexts/AuthContext";
import { Shield, User, Eye, Search, UserPlus, Trash2, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuPortal,
} from "../../components/ui/dropdown-menu";

// ── Role config ────────────────────────────────────────────────────────────────
const ROLES = {
  admin: {
    label: "Admin",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Shield,
    desc: "Full access — manage products, categories, users",
  },
  shopowner: {
    label: "Shop Owner",
    color: "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/25",
    icon: User,
    desc: "Manage products, categories, inventory & discounts",
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-500 border-gray-200",
    icon: Eye,
    desc: "Browse store only — no dashboard access",
  },
};

const RoleBadge = ({ role }) => {
  const cfg = ROLES[role] || ROLES.viewer;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

const RoleDropdown = ({ userId, currentRole, currentUserId, onChanged }) => {
  const [saving, setSaving] = useState(false);
  const isSelf = userId === currentUserId;

  const changeRole = async (newRole) => {
    if (newRole === currentRole) return;
    setSaving(true);
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success(`Role changed to ${ROLES[newRole].label}`);
      onChanged();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to change role");
    } finally { setSaving(false); }
  };

  if (isSelf) {
    return (
      <div className="flex items-center gap-2">
        <RoleBadge role={currentRole} />
        <span className="text-[10px] text-gray-400">(you)</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button disabled={saving} className="flex items-center gap-1.5 group outline-none focus:outline-none">
          <RoleBadge role={currentRole} />
          <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#C5A059] transition-all" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="start" sideOffset={8}
          className="z-[100] bg-white border border-[#E8E5E0] rounded-xl shadow-xl w-64 overflow-hidden p-0 animate-in fade-in zoom-in duration-100">
          <p className="px-3 pt-3 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Change Role</p>
          {Object.entries(ROLES).map(([role, cfg]) => {
            const Icon = cfg.icon;
            const isActive = role === currentRole;
            return (
              <DropdownMenuItem key={role} onClick={() => changeRole(role)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-[#F9F8F5] transition-colors text-left cursor-pointer outline-none focus:bg-[#F9F8F5] ${isActive ? "bg-[#F9F8F5]" : ""}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isActive ? ROLES[role].color : "bg-gray-100"}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isActive ? "text-[#2C2C2C]" : "text-gray-600"}`}>
                    {cfg.label}
                    {isActive && <span className="ml-2 text-[10px] text-gray-400 font-normal">current</span>}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{cfg.desc}</p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

// ── Add User Dialog ────────────────────────────────────────────────────────────
const AddUserDialog = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "viewer" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      await api.post("/users", form);
      toast.success(`User ${form.email} created!`);
      setForm({ name: "", email: "", password: "", role: "viewer" });
      onCreated();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to create user");
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#C5A059]" /> Add New User
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="u-name" className="text-sm">Full Name</Label>
            <Input id="u-name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Priya Sharma" className="mt-1 focus:border-[#C5A059]" autoComplete="off" />
          </div>
          <div>
            <Label htmlFor="u-email" className="text-sm">Email</Label>
            <Input id="u-email" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="priya@example.com" className="mt-1 focus:border-[#C5A059]" autoComplete="off" />
          </div>
          <div>
            <Label htmlFor="u-pass" className="text-sm">Password</Label>
            <Input id="u-pass" type="password" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters" className="mt-1 focus:border-[#C5A059]" autoComplete="new-password" />
          </div>
          <div>
            <Label htmlFor="u-role" className="text-sm">Role</Label>
            <select id="u-role" value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:border-[#C5A059] outline-none">
              {Object.entries(ROLES).map(([role, cfg]) => (
                <option key={role} value={role}>{cfg.label} — {cfg.desc}</option>
              ))}
            </select>
          </div>
          <div className={`p-3 rounded-lg border text-sm ${ROLES[form.role].color}`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              <Shield className="w-3.5 h-3.5" />
              {ROLES[form.role].label} permissions
            </div>
            <p className="text-xs opacity-80">{ROLES[form.role].desc}</p>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-[#F2F0EB]">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}
              className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors">
              {saving ? "Creating…" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN USERS PAGE
// ══════════════════════════════════════════════════════════════════════════════
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const { user: currentUser } = useAuth();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (e) { toast.error(e.response?.data?.detail || "Delete failed"); }
  };

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    shopowner: users.filter((u) => u.role === "shopowner").length,
    viewer: users.filter((u) => u.role === "viewer").length,
  };

  const getInitials = (name) =>
    (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColor = (role) =>
    ({ admin: "bg-purple-100 text-purple-600", shopowner: "bg-[#C5A059]/15 text-[#C5A059]", viewer: "bg-gray-100 text-gray-500" })[role] || "bg-gray-100 text-gray-500";

  return (
    <div className="p-4 sm:p-8" data-testid="users-page">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-4xl font-semibold text-[#2C2C2C]">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setAddOpen(true)}
          className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors">
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      {/* Stats bar — 2x2 on mobile, 4-col on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {[
          { key: "all", label: "All Users", color: "border-l-gray-300" },
          { key: "admin", label: "Admins", color: "border-l-purple-400" },
          { key: "shopowner", label: "Shop Owners", color: "border-l-[#C5A059]" },
          { key: "viewer", label: "Viewers", color: "border-l-gray-300" },
        ].map(({ key, label, color }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`bg-white border border-[#F2F0EB] border-l-4 ${color} rounded-xl p-3 sm:p-4 text-left transition-all hover:shadow-sm ${
              filter === key ? "ring-2 ring-[#C5A059]/30 shadow-sm" : ""
            }`}>
            <p className="text-xl sm:text-2xl font-bold text-[#2C2C2C]">{counts[key]}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-9 bg-white border-[#E8E5E0] focus:border-[#C5A059]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "admin", "shopowner", "viewer"].map((r) => (
            <button key={r} onClick={() => setFilter(r)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all capitalize ${
                filter === r
                  ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                  : "bg-white text-gray-500 border-[#E8E5E0] hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}>
              {r === "all" ? "All" : ROLES[r].label}
            </button>
          ))}
        </div>
      </div>

      <AddUserDialog open={addOpen} onClose={() => setAddOpen(false)} onCreated={fetchUsers} />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F2F0EB] rounded-xl">
          <p className="text-gray-400">No users found{search ? ` for "${search}"` : ""}</p>
        </div>
      ) : (
        <>
          {/* ── Mobile card list (hidden on md+) ── */}
          <div className="md:hidden space-y-3">
            {filtered.map((u) => {
              const isSelf = u.id === currentUser?.id;
              return (
                <div key={u.id}
                  className={`bg-white border border-[#F2F0EB] rounded-xl p-4 ${isSelf ? "bg-[#FDFCF8]" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(u.role)}`}>
                      {getInitials(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-[#2C2C2C] text-sm truncate">{u.name}</p>
                          {isSelf && <p className="text-[10px] text-[#C5A059] font-semibold">You</p>}
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" disabled={isSelf}
                          onClick={() => handleDelete(u.id, u.email)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-300 disabled:opacity-30 shrink-0"
                          title={isSelf ? "Can't delete yourself" : `Delete ${u.email}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <RoleDropdown userId={u.id} currentRole={u.role}
                          currentUserId={currentUser?.id} onChanged={fetchUsers} />
                        {u.created_at && (
                          <span className="text-[10px] text-gray-400">
                            Joined {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop table (hidden on mobile) ── */}
          <div className="hidden md:block bg-white border border-[#F2F0EB] rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F9F8F5] hover:bg-[#F9F8F5]">
                  <TableHead className="pl-5">User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <TableRow key={u.id}
                      className={`hover:bg-[#F9F8F5]/60 transition-colors ${isSelf ? "bg-[#FDFCF8]" : ""}`}>
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(u.role)}`}>
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <p className="font-medium text-[#2C2C2C] text-sm">{u.name}</p>
                            {isSelf && <p className="text-[10px] text-[#C5A059] font-semibold">You</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{u.email}</TableCell>
                      <TableCell>
                        <RoleDropdown userId={u.id} currentRole={u.role}
                          currentUserId={currentUser?.id} onChanged={fetchUsers} />
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end pr-2">
                          <Button variant="ghost" size="sm" disabled={isSelf}
                            onClick={() => handleDelete(u.id, u.email)}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-300 disabled:opacity-30"
                            title={isSelf ? "Can't delete yourself" : `Delete ${u.email}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-t border-[#F2F0EB] bg-[#F9F8F5]">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {users.length} users</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <ChevronDown className="w-3 h-3" /> Click a role badge to change it
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;