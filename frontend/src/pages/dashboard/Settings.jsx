import React, { useEffect, useState } from "react";
import {
  Phone,
  Plus,
  Trash2,
  Star,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Store,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import api from "../../lib/api";
import { toast } from "sonner";

// ── Phone number formatter ──────────────────────────────────────────────────
const formatDisplay = (e164) => {
  if (!e164) return "";
  // +91XXXXXXXXXX → +91 XXXXX XXXXX
  const m = e164.match(/^\+(\d{1,3})(\d{5})(\d{5})$/);
  if (m) return `+${m[1]} ${m[2]} ${m[3]}`;
  return e164;
};

// ── WhatsApp Number Card ────────────────────────────────────────────────────
const WaCard = ({ wa, onSetDefault, onDelete, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [num, setNum] = useState(wa.e164_number);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!num.trim()) return;
    setSaving(true);
    await onSave(wa.id, num.trim());
    setSaving(false);
    setEditing(false);
  };

  return (
    <div
      className={`border rounded-lg px-5 py-4 flex items-center justify-between gap-4 transition-all ${
        wa.is_default
          ? "border-[#C5A059] bg-[#FDFBF7]"
          : "border-[#F2F0EB] bg-white hover:border-[#E0DDD7]"
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            wa.is_default ? "bg-[#C5A059]/10" : "bg-[#F2F0EB]"
          }`}
        >
          <Phone
            className={`w-4 h-4 ${wa.is_default ? "text-[#C5A059]" : "text-gray-400"}`}
          />
        </div>

        {/* Number or edit input */}
        {editing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="tel"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className="flex-1 text-sm border border-[#C5A059] rounded px-3 py-1.5 focus:outline-none font-mono"
              autoFocus
            />
          </div>
        ) : (
          <div>
            <p className="font-mono text-[#2C2C2C] font-semibold text-sm tracking-wide">
              {formatDisplay(wa.e164_number)}
            </p>
            {wa.is_default && (
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">
                Default store number
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 text-xs font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-3 py-1.5 rounded transition-colors disabled:opacity-50"
            >
              <Save className="w-3 h-3" /> {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setNum(wa.e164_number);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-[#E8E5E0]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            {/* Test link */}
            <a
              href={`https://wa.me/${wa.e164_number.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Test this number on WhatsApp"
              className="p-1.5 text-gray-400 hover:text-green-500 transition-colors rounded border border-[#E8E5E0]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {!wa.is_default && (
              <button
                onClick={() => onSetDefault(wa.id)}
                title="Set as default"
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#C5A059] transition-colors px-2 py-1.5 border border-[#E8E5E0] rounded hover:border-[#C5A059]"
              >
                <Star className="w-3.5 h-3.5" /> Set Default
              </button>
            )}
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-gray-400 hover:text-[#C5A059] transition-colors rounded border border-[#E8E5E0]"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(wa.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded border border-[#E8E5E0]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Main Settings Page ──────────────────────────────────────────────────────
const Settings = () => {
  const [waNumbers, setWaNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newNum, setNewNum] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWa();
  }, []);

  const fetchWa = async () => {
    setLoading(true);
    try {
      const res = await api.get("/whatsapp-numbers");
      // Sort: default first
      setWaNumbers(
        res.data.sort(
          (a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0),
        ),
      );
    } catch {
      toast.error("Failed to load WhatsApp numbers");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newNum.trim()) {
      toast.error("Enter a phone number");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/whatsapp-numbers", {
        e164_number: newNum.trim(),
        is_default: waNumbers.length === 0, // first number becomes default
        owner_scope: "store",
      });
      setWaNumbers((prev) => [...prev, res.data]);
      setNewNum("");
      setAdding(false);
      toast.success("WhatsApp number added");
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          "Invalid number format. Use E.164 e.g. +919876543210",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/whatsapp-numbers/${id}`, { is_default: true });
      await fetchWa();
      toast.success("Default number updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this WhatsApp number?")) return;
    try {
      await api.delete(`/whatsapp-numbers/${id}`);
      setWaNumbers((prev) => prev.filter((w) => w.id !== id));
      toast.success("Number removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSaveEdit = async (id, num) => {
    try {
      const wa = waNumbers.find((w) => w.id === id);
      const payload = { e164_number: num };
      // Preserve is_default so the flag isn't lost during update
      if (wa?.is_default) payload.is_default = true;
      await api.put(`/whatsapp-numbers/${id}`, payload);
      await fetchWa();
      toast.success(
        "Number updated — all product enquiry buttons now use the new number",
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          "Invalid number. Use format: +919876543210",
      );
    }
  };

  const defaultNum = waNumbers.find((w) => w.is_default);

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-[#2C2C2C]">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage store configuration and contact numbers
        </p>
      </div>

      {/* Store info banner */}
      <div className="flex items-center gap-4 bg-[#F9F8F5] border border-[#F2F0EB] rounded-lg px-5 py-4 mb-8">
        <div className="w-10 h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center shrink-0">
          <Store className="w-5 h-5 text-[#C5A059]" />
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-[#2C2C2C]">
            GM Bastralaya
          </p>
          {defaultNum ? (
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              Default enquiry: {formatDisplay(defaultNum.e164_number)}
            </p>
          ) : (
            <p className="text-xs text-amber-500 mt-0.5">
              No default WhatsApp number set
            </p>
          )}
        </div>
      </div>

      {/* WhatsApp Numbers section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-widest">
              WhatsApp Numbers
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              The default number appears on all product enquiry buttons
            </p>
          </div>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-4 py-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Number
            </button>
          )}
        </div>

        {/* Info tip */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5 text-xs text-blue-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Numbers must be in international format — e.g.{" "}
            <strong>+919876543210</strong> (country code + number, no spaces)
          </span>
        </div>

        {/* Add form */}
        {adding && (
          <div className="border border-[#C5A059] rounded-lg px-5 py-4 mb-4 bg-[#FDFBF7]">
            <p className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-3">
              New Number
            </p>
            <div className="flex gap-3">
              <input
                type="tel"
                value={newNum}
                onChange={(e) => setNewNum(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") setAdding(false);
                }}
                placeholder="+91XXXXXXXXXX"
                className="flex-1 text-sm border border-[#E8E5E0] rounded px-3 py-2 focus:outline-none focus:border-[#C5A059] font-mono"
                autoFocus
              />
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> {saving ? "Adding…" : "Add"}
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setNewNum("");
                }}
                className="p-2 text-gray-400 hover:text-gray-700 rounded border border-[#E8E5E0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Numbers list */}
        {/* How it works note */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mb-5 text-xs text-amber-700">
          <RefreshCw className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            The <strong>default number</strong> is used on every product's
            "Enquire on WhatsApp" button. After changing it,{" "}
            <strong>reload the catalog or product page</strong> to see the
            updated number.
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : waNumbers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#E8E5E0] rounded-lg">
            <Phone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              No WhatsApp numbers added yet
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Add one so customers can enquire about products
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {waNumbers.map((wa) => (
              <WaCard
                key={wa.id}
                wa={wa}
                onSetDefault={handleSetDefault}
                onDelete={handleDelete}
                onSave={handleSaveEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
