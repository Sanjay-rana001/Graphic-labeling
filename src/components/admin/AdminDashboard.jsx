"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Layers,
  Settings as SettingsIcon,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Trash2,
  X,
  Sun,
  Moon,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Inbox,
  MapPin,
  Hash,
  Calendar,
  Save,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Sliders,
  LayoutGrid,
  ListFilter,
  Award,
  Send,
  FileText,
  Briefcase,
} from "lucide-react";
import {
  INITIAL_LEADS,
  LEAD_STATUSES,
  INITIAL_MATERIALS,
  DEFAULT_ADMIN_AUTH,
} from "@/lib/adminData";
import { useTheme } from "../ThemeProvider";
import PremiumLoader from "../PremiumLoader";
import StudioModeSettingsCard from "./StudioModeSettingsCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(statusKey) {
  const s = LEAD_STATUSES.find((x) => x.key === statusKey);
  return s
    ? s.color
    : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
}

function statusDotColor(statusKey) {
  switch (statusKey) {
    case "New Inquiry":
      return "bg-blue-400 shadow-[0_0_8px_#60a5fa]";
    case "In Discussion":
      return "bg-amber-400 shadow-[0_0_8px_#fbbf24]";
    case "Quote Sent":
      return "bg-purple-400 shadow-[0_0_8px_#c084fc]";
    case "Sample Dispatched":
      return "bg-sky-400 shadow-[0_0_8px_#38bdf8]";
    case "Converted / Won":
      return "bg-emerald-400 shadow-[0_0_8px_#34d399]";
    default:
      return "bg-zinc-500";
  }
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "SG";
}

function getMaterialTextureClass(material = "") {
  const m = material.toLowerCase();
  if (m.includes("brass") || m.includes("gold")) return "texture-brass text-zinc-950";
  if (m.includes("titanium") || m.includes("black") || m.includes("acrylic")) return "texture-titanium text-white";
  if (m.includes("rose")) return "texture-rosegold text-zinc-950";
  if (m.includes("steel") || m.includes("mirror")) return "texture-metal text-zinc-900";
  return "texture-aluminium text-zinc-900";
}

function whatsappLink(phone, lead) {
  const cleanPhone = (phone || "").replace(/\D/g, "").slice(-10);
  const msg = encodeURIComponent(
    `Hello ${lead.client},\n\nGreetings from *Sourav Graphic & Metal Labels*! Regarding your custom signage inquiry *${lead.id}*:\n• Material: ${lead.material || "Custom Alloy"}\n• Size: ${lead.size || "Custom"}\n• Qty: ${lead.quantity || 1} pcs\n• Current Status: *${lead.status}*\n\nPlease let us know a convenient time to share your formal quotation and laser proof.`
  );
  return `https://wa.me/91${cleanPhone}?text=${msg}`;
}

// ─── Animated Manual Lead Modal ────────────────────────────────────────────────
function ManualLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    client: "",
    phone: "",
    email: "",
    city: "",
    material: "Brushed Aluminium",
    size: '12" × 6" (3mm)',
    lighting: "None",
    mounting: "4× M6 Stainless Standoffs",
    quantity: 1,
    source: "Phone / Direct Call",
    notes: "",
    status: "New Inquiry",
  });
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.client.trim() || !form.phone.trim()) {
      setErr("Client name and phone number are required.");
      return;
    }
    const newLead = {
      ...form,
      id: "INQ-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split("T")[0],
      textLayers: [{ line: form.client.toUpperCase(), font: "Montserrat" }],
    };
    onSave(newLead);
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f1118] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-base">Log New Client Inquiry</h2>
              <p className="text-zinc-400 text-xs">Add a direct phone, WhatsApp, or walk-in lead</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {err && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
              <AlertCircle size={14} /> {err}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">Client / Company Name *</label>
              <input
                required
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                placeholder="e.g. Rajesh Khanna / Apex Corp"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">WhatsApp / Mobile *</label>
              <input
                required
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="98XXXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">Email Address</label>
              <input
                type="email"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="client@company.com"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">City / Location</label>
              <input
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. New Delhi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">Preferred Material</label>
              <input
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="Brushed Aluminium"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">Dimensions & Gauge</label>
              <input
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                placeholder='12" × 6" (3mm)'
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">Quantity Needed</label>
              <input
                type="number"
                min={1}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1.5 block">Inquiry Source</label>
              <select
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                <option>Phone / Direct Call</option>
                <option>WhatsApp Direct</option>
                <option>Walk-in Workshop</option>
                <option>Online 3D Studio</option>
                <option>Commercial RFP</option>
                <option>Referral</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-semibold mb-1.5 block">Requirement Notes</label>
            <textarea
              rows={3}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Engraving text, mounting preference, or delivery timeline..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-300 font-semibold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-extrabold hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
            >
              Save Inquiry Lead
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Animated Lead Detail & Spec Inspector Modal ───────────────────────────────
function LeadDetailModal({ lead, onClose, onStatusChange, onNotesChange }) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [saved, setSaved] = useState(false);

  function saveNotes() {
    onNotesChange(lead.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f1118] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto relative"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#0f1118]/95 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-base">
              {getInitials(lead.client)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xs font-mono font-bold">{lead.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
              <h2 className="text-white font-extrabold text-lg mt-0.5">{lead.client}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Uploaded Customer Photo OR Simulated Metal Plate Specimen Preview */}
          <div className="rounded-2xl bg-zinc-950/90 border border-white/10 p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3 font-mono">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles size={13} />{" "}
                {lead.designFile?.previewUrl
                  ? "CUSTOMER UPLOADED DESIGN PHOTO"
                  : "LIVE FABRICATION SPECIMEN"}
              </span>
              <span>{lead.size || '12" × 6"'} • {lead.material || "Brushed Aluminium"}</span>
            </div>

            {lead.designFile?.previewUrl ? (
              <div className="w-full rounded-xl bg-zinc-900/90 border border-white/10 p-4 flex flex-col items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead.designFile.previewUrl}
                  alt={lead.designFile.fileName || "Uploaded Design"}
                  className="max-h-56 w-auto object-contain rounded-lg shadow-xl"
                />
              </div>
            ) : (
              <div
                className={`w-full py-7 px-6 rounded-xl relative flex flex-col items-center justify-center text-center shadow-2xl ${getMaterialTextureClass(
                  lead.material
                )}`}
              >
                {/* 4 Corner Standoff Bolts */}
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 border border-zinc-600 shadow-inner absolute top-2.5 left-2.5" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 border border-zinc-600 shadow-inner absolute top-2.5 right-2.5" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 border border-zinc-600 shadow-inner absolute bottom-2.5 left-2.5" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 border border-zinc-600 shadow-inner absolute bottom-2.5 right-2.5" />

                {lead.textLayers && lead.textLayers.length > 0 ? (
                  lead.textLayers.map((t, i) => (
                    <div
                      key={i}
                      className={`${
                        i === 0 ? "text-base sm:text-xl font-black tracking-wider" : "text-xs sm:text-sm font-semibold opacity-85 mt-1"
                      }`}
                    >
                      {t.line}
                    </div>
                  ))
                ) : (
                  <div className="text-base sm:text-lg font-black tracking-widest uppercase">
                    {lead.client}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pipeline Status Selector */}
          <div>
            <label className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest mb-2.5 block">
              Update Lead Pipeline Stage
            </label>
            <div className="flex flex-wrap gap-2">
              {LEAD_STATUSES.map((s) => {
                const active = lead.status === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => onStatusChange(lead.id, s.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      active
                        ? s.color + " ring-2 ring-amber-500/40 scale-102 shadow-lg"
                        : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor(s.key)}`} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer & Fabrication Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2.5">
              <h3 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
                Client Contact Details
              </h3>
              <div className="flex items-center gap-2.5 text-xs text-white font-mono">
                <Phone size={14} className="text-amber-400 shrink-0" /> {lead.phone}
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300 truncate">
                <Mail size={14} className="text-amber-400 shrink-0" /> {lead.email || "Not provided"}
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <MapPin size={14} className="text-amber-400 shrink-0" />{" "}
                {lead.address
                  ? `${lead.address}, ${lead.city || ""}, ${lead.state || ""} - ${lead.postalCode || ""}, ${lead.country || "India"}`
                  : lead.city || "India"}
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                <Calendar size={14} className="text-amber-400 shrink-0" /> Inquiry Date: {lead.date}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
              <h3 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
                Workshop Specifications
              </h3>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Category / Material:</span>
                <span className="text-white font-semibold">{lead.category || lead.material || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Plate Size / Specs:</span>
                <span className="text-white font-mono">{lead.size || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Mounting / Side:</span>
                <span className="text-white">{lead.mounting || "Standard"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Colour / Lighting:</span>
                <span className="text-white">{lead.lighting || "None"}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                <span className="text-zinc-400 font-semibold">Batch Quantity:</span>
                <span className="text-amber-400 font-mono font-extrabold">{lead.quantity} Units</span>
              </div>
            </div>
          </div>

          {/* Uploaded Design Artwork Preview (if submitted via Enquiry Form) */}
          {lead.designFile && lead.designFile.fileName && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {lead.designFile.previewUrl ? (
                  <img
                    src={lead.designFile.previewUrl}
                    alt={lead.designFile.fileName}
                    className="w-16 h-16 rounded-xl object-contain bg-white border border-white/20 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
                    <FileText size={24} />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    Uploaded Customer Design File
                  </span>
                  <p className="text-white font-bold text-sm truncate mt-0.5">
                    {lead.designFile.fileName}
                  </p>
                  <p className="text-zinc-400 text-xs font-mono">
                    {lead.designFile.fileType || "Design Artwork"} •{" "}
                    {((lead.designFile.fileSize || 0) / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              {lead.designFile.previewUrl && (
                <a
                  href={lead.designFile.previewUrl}
                  download={lead.designFile.fileName}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs shrink-0 hover:bg-amber-400 transition-colors"
                >
                  Download Artwork
                </a>
              )}
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest">
                Follow-Up & Quotation Notes
              </label>
              <button
                onClick={saveNotes}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  saved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle2 size={13} /> Notes Saved
                  </>
                ) : (
                  <>
                    <Save size={13} /> Save Notes
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={3}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write quotation price shared, client feedback, or dispatch tracking details..."
            />
          </div>

          {/* Quick Follow-Up CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href={whatsappLink(lead.phone, lead)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all"
            >
              <MessageCircle size={16} /> Send Quote / Follow Up on WhatsApp
            </a>
            <a
              href={`tel:+91${lead.phone}`}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
            >
              <Phone size={15} /> Call Client
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main AdminDashboard ───────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { isDarkMode, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Auth
  const [adminAuth, setAdminAuth] = useState(DEFAULT_ADMIN_AUTH);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Credentials form
  const [credForm, setCredForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [credError, setCredError] = useState("");
  const [credSuccess, setCredSuccess] = useState("");
  const [showCredPw, setShowCredPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Data
  const [leads, setLeads] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'
  const [selectedLead, setSelectedLead] = useState(null);
  const [showManualLeadModal, setShowManualLeadModal] = useState(false);
  const [newMatName, setNewMatName] = useState("");
  const [newMatThickness, setNewMatThickness] = useState("3.0 mm");

  // Settings
  const [settings, setSettings] = useState({
    businessName: "Sourav Graphic & Metal Labels",
    whatsapp: "9876543210",
    address: "Industrial Area, New Delhi, India",
    tagline: "Aerospace 6061-T6 Alloy & Fiber Laser Engraving Workshop",
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ── Load from localStorage ──
  useEffect(() => {
    try {
      localStorage.removeItem("sourav_admin_auth");

      const savedAuth = localStorage.getItem("sourav_super_admin_auth");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        setAdminAuth(parsed);
        setCredForm((prev) => ({ ...prev, email: parsed.email }));
      } else {
        localStorage.setItem(
          "sourav_super_admin_auth",
          JSON.stringify(DEFAULT_ADMIN_AUTH)
        );
        setAdminAuth(DEFAULT_ADMIN_AUTH);
        setCredForm((prev) => ({ ...prev, email: DEFAULT_ADMIN_AUTH.email }));
      }

      const session = sessionStorage.getItem("sourav_admin_session");
      if (session === "true") setIsAuthenticated(true);

      const savedLeads = localStorage.getItem("sourav_admin_leads");
      const localLeads = savedLeads ? JSON.parse(savedLeads) : INITIAL_LEADS;
      setLeads(localLeads);

      // Merge any server-stored enquiries from /api/enquiries
      fetch("/api/enquiries", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.enquiries) && data.enquiries.length > 0) {
            const existingIds = new Set(localLeads.map((l) => l.id));
            const newFromServer = data.enquiries.filter((e) => !existingIds.has(e.id));
            if (newFromServer.length > 0) {
              const merged = [...newFromServer, ...localLeads];
              setLeads(merged);
              localStorage.setItem("sourav_admin_leads", JSON.stringify(merged));
            }
          }
        })
        .catch(() => {});

      const savedMats = localStorage.getItem("sourav_admin_materials");
      setMaterials(savedMats ? JSON.parse(savedMats) : INITIAL_MATERIALS);

      const savedSettings = localStorage.getItem("sourav_admin_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error("AdminDashboard load error:", e);
    }
    const timer = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // ── Persistence ──
  function saveLeads(updated) {
    setLeads(updated);
    localStorage.setItem("sourav_admin_leads", JSON.stringify(updated));
  }

  function saveMaterials(updated) {
    setMaterials(updated);
    localStorage.setItem("sourav_admin_materials", JSON.stringify(updated));
  }

  // ── Auth handlers ──
  function handleLogin(e) {
    e.preventDefault();
    const auth = (() => {
      try {
        return (
          JSON.parse(localStorage.getItem("sourav_super_admin_auth")) ||
          adminAuth
        );
      } catch {
        return adminAuth;
      }
    })();

    if (
      loginEmail.trim().toLowerCase() === auth.email.trim().toLowerCase() &&
      loginPassword === auth.password
    ) {
      sessionStorage.setItem("sourav_admin_session", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("sourav_admin_session");
    setIsAuthenticated(false);
    setLoginEmail("");
    setLoginPassword("");
  }

  function handleCredChange(e) {
    e.preventDefault();
    setCredError("");
    setCredSuccess("");

    const auth = (() => {
      try {
        return (
          JSON.parse(localStorage.getItem("sourav_super_admin_auth")) ||
          adminAuth
        );
      } catch {
        return adminAuth;
      }
    })();

    if (credForm.currentPassword !== auth.password) {
      setCredError("Current password is incorrect. Authentication failed.");
      return;
    }

    const nextEmail = credForm.email.trim();
    const wantsEmailChange =
      nextEmail && nextEmail.toLowerCase() !== auth.email.toLowerCase();
    const wantsPasswordChange = credForm.newPassword.length > 0;

    if (!wantsEmailChange && !wantsPasswordChange) {
      setCredError("Please enter a new email ID or a new password to update.");
      return;
    }

    if (nextEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setCredError("Please enter a valid email address.");
      return;
    }

    if (wantsPasswordChange) {
      if (credForm.newPassword.length < 6) {
        setCredError("New password must be at least 6 characters long.");
        return;
      }
      if (credForm.newPassword !== credForm.confirmPassword) {
        setCredError("New password and confirm password do not match.");
        return;
      }
    }

    const updated = {
      ...auth,
      email: nextEmail || auth.email,
      password: wantsPasswordChange ? credForm.newPassword : auth.password,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem("sourav_super_admin_auth", JSON.stringify(updated));
    setAdminAuth(updated);
    setCredSuccess(
      wantsEmailChange && wantsPasswordChange
        ? "Admin email ID and password updated successfully!"
        : wantsEmailChange
        ? `Admin email ID changed to ${updated.email} successfully!`
        : "Admin password updated successfully!"
    );
    setCredForm({
      email: updated.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  // ── Lead handlers ──
  function handleStatusChange(id, newStatus) {
    const updated = leads.map((l) =>
      l.id === id ? { ...l, status: newStatus } : l
    );
    saveLeads(updated);
    if (selectedLead?.id === id)
      setSelectedLead({ ...selectedLead, status: newStatus });
  }

  function handleNotesChange(id, notes) {
    const updated = leads.map((l) => (l.id === id ? { ...l, notes } : l));
    saveLeads(updated);
  }

  function handleDeleteLead(id) {
    if (!confirm("Delete this inquiry lead permanently?")) return;
    saveLeads(leads.filter((l) => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
  }

  function handleAddManualLead(newLead) {
    saveLeads([newLead, ...leads]);
  }

  function handleAddMaterial(e) {
    e.preventDefault();
    if (!newMatName.trim()) return;
    const item = {
      id: "mat-" + Date.now(),
      name: newMatName.trim(),
      thickness: newMatThickness || "3.0 mm",
      status: "Available",
      popular: false,
    };
    saveMaterials([item, ...materials]);
    setNewMatName("");
  }

  // ── Filtered leads ──
  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      l.client.toLowerCase().includes(q) ||
      (l.phone || "").includes(q) ||
      l.id.toLowerCase().includes(q) ||
      (l.city || "").toLowerCase().includes(q) ||
      (l.material || "").toLowerCase().includes(q) ||
      (l.email || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── KPIs ──
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "New Inquiry").length;
  const activePipelineCount = leads.filter((l) =>
    ["In Discussion", "Quote Sent", "Sample Dispatched"].includes(l.status)
  ).length;
  const convertedLeadsCount = leads.filter(
    (l) => l.status === "Converted / Won"
  ).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeadsCount / totalLeads) * 100) : 0;

  // ────────────────────────────────────────────────────────
  // ── LOADING SCREEN ──
  // ────────────────────────────────────────────────────────
  if (!isLoaded) {
    return <PremiumLoader label="Initializing Executive CRM..." />;
  }

  // ────────────────────────────────────────────────────────
  // ── LUXURY ANIMATED LOGIN SCREEN ──
  // ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090d] text-white flex items-center justify-center p-4 relative overflow-hidden select-none">
        {/* Ambient Background Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-amber-500/12 rounded-full blur-3xl" />
          <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-sky-500/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(to_right,transparent,transparent_1px,#ffffff_1px,#ffffff_2px)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#0f1118]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Top Specular Gold Line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {/* Brand Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-transparent border border-amber-500/30 mb-4 shadow-lg shadow-amber-500/10">
                <ShieldCheck size={30} className="text-amber-400" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-2">
                <Sparkles size={11} /> Restricted Executive Access
              </div>
              <h1 className="text-white text-2xl font-black tracking-tight">
                Sourav Graphic CRM
              </h1>
              <p className="text-zinc-400 text-xs mt-1">
                Sign in to manage client inquiries & custom quotations
              </p>
            </div>

            {/* Login Form (Generic Placeholders Only) */}
            <form onSubmit={handleLogin} className="space-y-4">
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-3.5 py-2.5 text-red-400 text-xs font-medium"
                  >
                    <AlertCircle size={15} className="shrink-0" /> {loginError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-amber-500 placeholder:text-zinc-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type={showLoginPw ? "text" : "password"}
                    required
                    autoComplete="off"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-xs font-medium focus:outline-none focus:border-amber-500 placeholder:text-zinc-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all mt-2"
              >
                Authenticate & Enter Portal
              </motion.button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
              <Link
                href="/"
                className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
              >
                ← Back to Live Website
              </Link>
              <span className="font-mono text-[10px] text-zinc-600">
                256-Bit Local Vault
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────
  // ── MAIN LUXURY CRM LAYOUT ──
  // ────────────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "leads", label: "Inquiries & Leads", icon: Users, badge: newLeadsCount },
    { id: "studio-mode", label: "Studio Display Mode", icon: Sliders },
    { id: "materials", label: "Alloy Catalog", icon: Layers },
    { id: "security", label: "Super Admin Security", icon: ShieldCheck },
    { id: "settings", label: "Workshop Settings", icon: SettingsIcon },
  ];

  return (
    <div
      className={`min-h-screen flex font-sans relative overflow-x-hidden transition-colors duration-200 ${
        isDarkMode ? "bg-[#08090d] text-white" : "bg-[#e3f2ee] text-[#0d1e1b]"
      }`}
    >
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/3 w-[750px] h-[400px] bg-amber-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-sky-500/[0.05] rounded-full blur-3xl" />
      </div>

      {/* Modals with AnimatePresence */}
      <AnimatePresence>
        {showManualLeadModal && (
          <ManualLeadModal
            onClose={() => setShowManualLeadModal(false)}
            onSave={handleAddManualLead}
          />
        )}
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onStatusChange={(id, status) => {
              handleStatusChange(id, status);
              setSelectedLead((prev) => ({ ...prev, status }));
            }}
            onNotesChange={handleNotesChange}
          />
        )}
      </AnimatePresence>

      {/* ── Sleek Glassmorphic Sidebar ── */}
      <aside
        className={`w-64 shrink-0 flex flex-col z-20 border-r min-h-screen sticky top-0 backdrop-blur-2xl ${
          isDarkMode
            ? "bg-[#0c0e14]/90 border-white/[0.08]"
            : "bg-[#f2faf7]/90 border-[#c3e2da]"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.08]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-32">
              <Image
                src="/Media/Logo.png"
                alt="Sourav Graphic"
                fill
                sizes="140px"
                className="object-contain object-left"
              />
            </div>
          </Link>
          <div className="mt-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Lead Management CRM
            </span>
          </div>
        </div>

        {/* Navigation Links with Framer Motion Sliding Pill */}
        <nav className="flex-1 p-3.5 space-y-1.5">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-colors ${
                  active
                    ? "text-amber-400"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeAdminSidebarPill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 shadow-lg shadow-amber-500/5"
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <item.icon size={17} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="relative z-10 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500 text-zinc-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Super Admin Card & Actions */}
        <div className="p-3.5 border-t border-white/[0.08] space-y-2">
          <div
            className={`p-3 rounded-2xl border text-xs ${
              isDarkMode
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-white/70 border-[#c3e2da]"
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold">
              Super Admin
            </div>
            <div className="font-mono text-[11px] truncate mt-0.5 opacity-80">
              {adminAuth.email}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTheme(!isDarkMode)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.07]"
                  : "bg-white border-[#c3e2da] text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {isDarkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Floating Command Bar */}
        <header
          className={`sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b backdrop-blur-2xl ${
            isDarkMode
              ? "bg-[#08090d]/85 border-white/[0.08]"
              : "bg-[#e3f2ee]/85 border-[#c3e2da]"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg sm:text-xl tracking-tight">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </div>
            <p className="text-xs opacity-60">
              Sourav Graphic & Metal Labels • Customer Inquiry & Quotation Hub
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/customize"
              className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
                  : "bg-white border-[#c3e2da] text-zinc-800"
              }`}
            >
              <span>3D Studio</span>
              <ExternalLink size={13} />
            </Link>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowManualLeadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
            >
              <Plus size={15} />
              <span>Add Manual Inquiry</span>
            </motion.button>
          </div>
        </header>

        {/* Animated Tab Views */}
        <div className="p-4 sm:p-6 lg:px-8 max-w-[1920px] w-full mx-auto flex-1">
          <AnimatePresence mode="wait">
            {/* ── TAB 1: DASHBOARD OVERVIEW ── */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                className="space-y-6"
              >
                {/* 4 Animated Bento KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Inquiries",
                      sub: "All leads captured",
                      value: totalLeads,
                      icon: Users,
                      accent: "from-amber-500/20 to-amber-500/0",
                      iconClass: "text-amber-400 bg-amber-500/10 border-amber-500/25",
                    },
                    {
                      label: "New / Unread Queries",
                      sub: "Awaiting first quote",
                      value: newLeadsCount,
                      icon: Inbox,
                      accent: "from-blue-500/20 to-blue-500/0",
                      iconClass: "text-blue-400 bg-blue-500/10 border-blue-500/25",
                    },
                    {
                      label: "Active Discussions",
                      sub: "Quote & sample stage",
                      value: activePipelineCount,
                      icon: Clock,
                      accent: "from-purple-500/20 to-purple-500/0",
                      iconClass: "text-purple-400 bg-purple-500/10 border-purple-500/25",
                    },
                    {
                      label: "Converted / Won",
                      sub: `${conversionRate}% conversion rate`,
                      value: convertedLeadsCount,
                      icon: Award,
                      accent: "from-emerald-500/20 to-emerald-500/0",
                      iconClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
                    },
                  ].map((kpi, idx) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.35 }}
                      whileHover={{ y: -4 }}
                      onClick={() => setActiveTab("leads")}
                      className={`cursor-pointer rounded-3xl border p-5 relative overflow-hidden transition-shadow hover:shadow-xl ${
                        isDarkMode
                          ? "bg-[#0f1118] border-white/[0.08]"
                          : "bg-white border-[#c3e2da]"
                      }`}
                    >
                      <div
                        className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-bl ${kpi.accent} rounded-full blur-2xl pointer-events-none`}
                      />
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 rounded-2xl border ${kpi.iconClass}`}>
                          <kpi.icon size={20} />
                        </div>
                        <ArrowUpRight size={16} className="opacity-40" />
                      </div>
                      <div className="text-3xl font-black font-mono tracking-tight">
                        {kpi.value}
                      </div>
                      <div className="text-xs font-bold mt-1">{kpi.label}</div>
                      <div className="text-[11px] opacity-55 mt-0.5">{kpi.sub}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Studio Builder Display Mode Quick Control Card */}
                <StudioModeSettingsCard
                  isDarkMode={isDarkMode}
                  adminEmail={adminAuth.email}
                />

                {/* Middle Bento Grid: Pipeline Funnel + Recent Priority Leads */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Pipeline Stage Breakdown (5 cols) */}
                  <div
                    className={`lg:col-span-5 rounded-3xl border p-6 flex flex-col justify-between ${
                      isDarkMode
                        ? "bg-[#0f1118] border-white/[0.08]"
                        : "bg-white border-[#c3e2da]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="font-extrabold text-base">Inquiry Pipeline</h2>
                        <span className="text-[11px] font-mono text-amber-400">
                          Click stage to filter
                        </span>
                      </div>
                      <p className="text-xs opacity-60 mb-5">
                        Real-time progression from initial query to confirmed project
                      </p>

                      <div className="space-y-4">
                        {LEAD_STATUSES.map((s, i) => {
                          const count = leads.filter((l) => l.status === s.key).length;
                          const pct =
                            totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                          return (
                            <div
                              key={s.key}
                              onClick={() => {
                                setStatusFilter(s.key);
                                setActiveTab("leads");
                              }}
                              className="group cursor-pointer"
                            >
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${statusDotColor(
                                      s.key
                                    )}`}
                                  />
                                  <span className="font-bold group-hover:text-amber-400 transition-colors">
                                    {s.label}
                                  </span>
                                </div>
                                <span className="font-mono font-bold">
                                  {count} <span className="opacity-40 text-[10px]">({pct}%)</span>
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-zinc-800/70 overflow-hidden p-0.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${ Math.max(pct, count > 0 ? 8 : 0) }%` }}
                                  transition={{ duration: 0.6, delay: i * 0.07 }}
                                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="opacity-60"> customizer & web inquiries sync automatically</span>
                      <button
                        onClick={() => {
                          setStatusFilter("All");
                          setActiveTab("leads");
                        }}
                        className="text-amber-400 font-bold hover:underline"
                      >
                        All Leads →
                      </button>
                    </div>
                  </div>

                  {/* Recent Inquiries Feed (7 cols) */}
                  <div
                    className={`lg:col-span-7 rounded-3xl border p-6 flex flex-col ${
                      isDarkMode
                        ? "bg-[#0f1118] border-white/[0.08]"
                        : "bg-white border-[#c3e2da]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-extrabold text-base">Latest Customer Queries</h2>
                        <p className="text-xs opacity-60">
                          Click any lead to inspect 3D plate specs & send WhatsApp quote
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("leads")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-colors ${
                          isDarkMode
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                            : "bg-[#0d1e1b] text-white border-[#0d1e1b] hover:bg-slate-800 shadow-xs"
                        }`}
                      >
                        View All ({leads.length})
                      </button>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {leads.slice(0, 5).map((lead, idx) => (
                        <motion.div
                          key={lead.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.008 }}
                          onClick={() => setSelectedLead(lead)}
                          className={`cursor-pointer p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                            isDarkMode
                              ? "bg-white/[0.02] border-white/[0.06] hover:border-amber-500/40 hover:bg-white/[0.04]"
                              : "bg-[#f2faf7] border-[#c3e2da] hover:border-[#0d1e1b]/40"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${
                                isDarkMode
                                  ? "bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/25 text-amber-300"
                                  : "bg-[#0d1e1b] border-[#0d1e1b] text-white shadow-xs"
                              }`}
                            >
                              {getInitials(lead.client)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs sm:text-sm truncate">
                                  {lead.client}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold border ${
                                    isDarkMode
                                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                      : "bg-amber-900/10 text-amber-950 border-amber-900/25"
                                  }`}
                                >
                                  {lead.id}
                                </span>
                              </div>
                              <div className="text-[11px] opacity-70 truncate mt-0.5">
                                {lead.material} • {lead.size} • Qty: {lead.quantity}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge(
                                lead.status
                              )}`}
                            >
                              {lead.status}
                            </span>
                            <a
                              href={whatsappLink(lead.phone, lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`p-2 rounded-xl border transition-colors ${
                                isDarkMode
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500 hover:text-zinc-950"
                                  : "bg-emerald-600/15 text-emerald-800 border-emerald-600/30 hover:bg-emerald-600 hover:text-white"
                              }`}
                              title="Follow up on WhatsApp"
                            >
                              <MessageCircle size={15} />
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: ALL LEADS & INQUIRIES CRM ── */}
            {activeTab === "leads" && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Search Bar & View Mode Switcher */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by client name, mobile, INQ-ID, material, or city..."
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:border-amber-500 transition-colors ${
                        isDarkMode
                          ? "bg-[#0f1118] border-white/10 text-white placeholder:text-zinc-500"
                          : "bg-white border-[#c3e2da] text-zinc-900"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        viewMode === "cards"
                          ? "bg-amber-500 text-zinc-950 border-amber-500"
                          : isDarkMode
                          ? "bg-[#0f1118] border-white/10 text-zinc-400"
                          : "bg-white border-[#c3e2da] text-zinc-700"
                      }`}
                    >
                      <LayoutGrid size={14} /> Cards
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        viewMode === "table"
                          ? "bg-amber-500 text-zinc-950 border-amber-500"
                          : isDarkMode
                          ? "bg-[#0f1118] border-white/10 text-zinc-400"
                          : "bg-white border-[#c3e2da] text-zinc-700"
                      }`}
                    >
                      <ListFilter size={14} /> Table
                    </button>
                  </div>
                </div>

                {/* Interactive Status Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {["All", ...LEAD_STATUSES.map((s) => s.key)].map((st) => {
                    const count =
                      st === "All"
                        ? leads.length
                        : leads.filter((l) => l.status === st).length;
                    const active = statusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all flex items-center gap-2 ${
                          active
                            ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-md shadow-amber-500/15"
                            : isDarkMode
                            ? "bg-[#0f1118] border-white/10 text-zinc-400 hover:text-white"
                            : "bg-white border-[#c3e2da] text-zinc-700"
                        }`}
                      >
                        <span>{st}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            active ? "bg-black/20 text-zinc-950" : "bg-white/10"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filteredLeads.length === 0 ? (
                  <div
                    className={`rounded-3xl border p-14 text-center ${
                      isDarkMode
                        ? "bg-[#0f1118] border-white/10"
                        : "bg-white border-[#c3e2da]"
                    }`}
                  >
                    <Inbox size={38} className="mx-auto mb-3 text-amber-400 opacity-50" />
                    <h3 className="font-bold text-base">No matching inquiries found</h3>
                    <p className="text-xs opacity-60 mt-1">
                      Try clearing your search filter or add a manual inquiry above.
                    </p>
                  </div>
                ) : viewMode === "cards" ? (
                  /* LUXURY BENTO CARD GRID VIEW */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLeads.map((lead, idx) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        whileHover={{ y: -3 }}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer rounded-3xl border p-5 flex flex-col justify-between transition-all hover:shadow-xl ${
                          isDarkMode
                            ? "bg-[#0f1118] border-white/[0.08] hover:border-amber-500/40"
                            : "bg-white border-[#c3e2da] hover:border-amber-500"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm shrink-0">
                                {getInitials(lead.client)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-amber-400">
                                    {lead.id}
                                  </span>
                                  <span className="text-[11px] opacity-50">• {lead.date}</span>
                                </div>
                                <h3 className="font-extrabold text-base leading-snug">
                                  {lead.client}
                                </h3>
                              </div>
                            </div>

                            <select
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer ${
                                isDarkMode
                                  ? "bg-zinc-900 border-white/15 text-white"
                                  : "bg-zinc-100 border-zinc-300 text-zinc-900"
                              }`}
                            >
                              {LEAD_STATUSES.map((s) => (
                                <option key={s.key} value={s.key}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Spec Chips */}
                          <div className="flex flex-wrap gap-1.5 my-3">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">
                              {lead.material || "Custom Metal"}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono">
                              {lead.size || "Standard"}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold">
                              Qty: {lead.quantity}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] opacity-75">
                              {lead.city || "India"}
                            </span>
                          </div>

                          {lead.notes && (
                            <p className="text-xs opacity-65 line-clamp-2 italic mb-4">
                              "{lead.notes}"
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <div className="text-xs font-mono opacity-75 flex items-center gap-1.5">
                            <Phone size={12} className="text-amber-400" />
                            {lead.phone}
                          </div>

                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={whatsappLink(lead.phone, lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/25 text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold"
                            >
                              Specs
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* EXECUTIVE TABLE VIEW */
                  <div
                    className={`rounded-3xl border overflow-hidden ${
                      isDarkMode
                        ? "bg-[#0f1118] border-white/10"
                        : "bg-white border-[#c3e2da]"
                    }`}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider opacity-60">
                            <th className="py-3.5 px-4">Inquiry ID & Client</th>
                            <th className="py-3.5 px-4">Contact</th>
                            <th className="py-3.5 px-4">Plate Specifications</th>
                            <th className="py-3.5 px-4">Qty</th>
                            <th className="py-3.5 px-4">Pipeline Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {filteredLeads.map((lead) => (
                            <tr
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                            >
                              <td className="py-3.5 px-4">
                                <div className="font-mono text-amber-400 font-bold text-[11px]">
                                  {lead.id}
                                </div>
                                <div className="font-bold text-sm">{lead.client}</div>
                                <div className="text-[11px] opacity-50">
                                  {lead.source} • {lead.date}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-mono">{lead.phone}</div>
                                <div className="text-[11px] opacity-60">{lead.city}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-amber-400">{lead.material}</div>
                                <div className="font-mono text-[11px] opacity-70">{lead.size}</div>
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold">
                                {lead.quantity}
                              </td>
                              <td
                                className="py-3.5 px-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <select
                                  value={lead.status}
                                  onChange={(e) =>
                                    handleStatusChange(lead.id, e.target.value)
                                  }
                                  className="bg-zinc-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                                >
                                  {LEAD_STATUSES.map((s) => (
                                    <option key={s.key} value={s.key}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td
                                className="py-3.5 px-4 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="inline-flex items-center gap-1.5">
                                  <a
                                    href={whatsappLink(lead.phone, lead)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 transition-colors"
                                  >
                                    <MessageCircle size={14} />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── TAB 3: STUDIO BUILDER DISPLAY MODE ── */}
            {activeTab === "studio-mode" && (
              <motion.div
                key="studio-mode"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <StudioModeSettingsCard
                  isDarkMode={isDarkMode}
                  adminEmail={adminAuth.email}
                />
              </motion.div>
            )}

            {/* ── TAB 4: MATERIALS & ALLOY CATALOG ── */}
            {activeTab === "materials" && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Add New Material Bar */}
                <form
                  onSubmit={handleAddMaterial}
                  className={`rounded-3xl border p-5 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/10"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <div className="flex-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                      Add New Alloy / Material Specimen
                    </label>
                    <input
                      value={newMatName}
                      onChange={(e) => setNewMatName(e.target.value)}
                      placeholder="e.g. Copper Antique Brushed Plate"
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:w-44">
                    <label className="text-[11px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                      Standard Gauge
                    </label>
                    <input
                      value={newMatThickness}
                      onChange={(e) => setNewMatThickness(e.target.value)}
                      placeholder="3.0 mm"
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Plus size={15} /> Add Material
                  </button>
                </form>

                {/* Materials Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((mat, idx) => (
                    <motion.div
                      key={mat.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -3 }}
                      className={`rounded-3xl border p-5 flex flex-col justify-between ${
                        isDarkMode
                          ? "bg-[#0f1118] border-white/10"
                          : "bg-white border-[#c3e2da]"
                      }`}
                    >
                      <div>
                        {/* Metallic Swatch Preview */}
                        <div
                          className={`h-20 rounded-2xl mb-4 flex items-center justify-between px-4 ${getMaterialTextureClass(
                            mat.name
                          )}`}
                        >
                          <span className="font-mono text-[10px] font-black uppercase tracking-widest opacity-80">
                            {mat.thickness}
                          </span>
                          {mat.popular && (
                            <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-amber-400 text-[10px] font-bold">
                              ★ Popular
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-sm">{mat.name}</h3>
                        <p className="text-xs opacity-60 mt-0.5">
                          Gauge Thickness: {mat.thickness}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            mat.status === "Available"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {mat.status}
                        </span>

                        <button
                          onClick={() => {
                            const updated = materials.map((m) =>
                              m.id === mat.id
                                ? {
                                    ...m,
                                    status:
                                      m.status === "Available"
                                        ? "Out of Stock"
                                        : "Available",
                                  }
                                : m
                            );
                            saveMaterials(updated);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-colors"
                        >
                          Toggle Stock
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 4: SUPER ADMIN SECURITY ── */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="max-w-xl"
              >
                <div
                  className={`rounded-3xl border p-7 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/10"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
                      <KeyRound size={22} />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base">
                        Super Admin Security & Credentials
                      </h2>
                      <p className="text-xs opacity-60">
                        Update your login email ID, password, or both after verifying with your current password
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider opacity-60 font-bold">
                        Active Super Admin Login Email
                      </p>
                      <p className="text-amber-400 font-mono font-extrabold text-sm mt-0.5">
                        {adminAuth.email}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified
                    </span>
                  </div>

                  {credError && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-semibold mb-4">
                      <AlertCircle size={15} className="shrink-0" /> {credError}
                    </div>
                  )}

                  {credSuccess && (
                    <div className="space-y-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-emerald-400 text-xs mb-4">
                      <div className="flex items-center gap-2 font-bold">
                        <CheckCircle2 size={16} className="shrink-0" /> {credSuccess}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="opacity-80">
                          Your new credentials are active immediately.
                        </span>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs hover:bg-emerald-400 transition-colors"
                        >
                          Test Login Now
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleCredChange} className="space-y-4 text-xs">
                    <div>
                      <label className="opacity-70 font-bold uppercase tracking-wider mb-1.5 block">
                        Admin Email ID *
                      </label>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                          type="email"
                          required
                          value={credForm.email}
                          onChange={(e) =>
                            setCredForm({ ...credForm, email: e.target.value })
                          }
                          placeholder="Enter new admin email ID"
                          className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <label className="opacity-70 font-bold uppercase tracking-wider mb-1.5 block">
                        Current Password (Required to Authenticate) *
                      </label>
                      <div className="relative">
                        <Lock
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                          type={showCredPw.current ? "text" : "password"}
                          required
                          value={credForm.currentPassword}
                          onChange={(e) =>
                            setCredForm({
                              ...credForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="Enter your current password"
                          className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCredPw((p) => ({ ...p, current: !p.current }))
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                        >
                          {showCredPw.current ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                      <div>
                        <label className="opacity-70 font-bold uppercase tracking-wider mb-1.5 block">
                          New Password (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type={showCredPw.new ? "text" : "password"}
                            value={credForm.newPassword}
                            onChange={(e) =>
                              setCredForm({
                                ...credForm,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Leave blank to keep current"
                            className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-3 pr-10 text-white focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCredPw((p) => ({ ...p, new: !p.new }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showCredPw.new ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="opacity-70 font-bold uppercase tracking-wider mb-1.5 block">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCredPw.confirm ? "text" : "password"}
                            value={credForm.confirmPassword}
                            onChange={(e) =>
                              setCredForm({
                                ...credForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Repeat new password"
                            className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-3 pr-10 text-white focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCredPw((p) => ({
                                ...p,
                                confirm: !p.confirm,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showCredPw.confirm ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
                    >
                      Authenticate & Save Credentials
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── TAB 5: WORKSHOP SETTINGS ── */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 max-w-4xl"
              >
                <StudioModeSettingsCard
                  isDarkMode={isDarkMode}
                  adminEmail={adminAuth.email}
                />

                <div
                  className={`rounded-3xl border p-7 max-w-xl ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/10"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <h2 className="font-extrabold text-base mb-1">
                    Workshop & Contact Settings
                  </h2>
                  <p className="text-xs opacity-60 mb-6">
                    Configure business details used for WhatsApp follow-ups and digital proofs
                  </p>

                  {settingsSaved && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 text-emerald-400 text-xs font-bold mb-4">
                      <CheckCircle2 size={15} /> Workshop settings saved!
                    </div>
                  )}

                  <div className="space-y-4 text-xs">
                    {[
                      {
                        label: "Business / Workshop Name",
                        key: "businessName",
                        placeholder: "Sourav Graphic & Metal Labels",
                      },
                      {
                        label: "Official WhatsApp Number",
                        key: "whatsapp",
                        placeholder: "9876543210",
                      },
                      {
                        label: "Workshop Address",
                        key: "address",
                        placeholder: "Industrial Area, New Delhi",
                      },
                      {
                        label: "Brand Tagline",
                        key: "tagline",
                        placeholder: "Aerospace 6061-T6 Alloy Workshop",
                      },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="opacity-70 font-bold uppercase tracking-wider mb-1.5 block">
                          {field.label}
                        </label>
                        <input
                          value={settings[field.key] || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, [field.key]: e.target.value })
                          }
                          placeholder={field.placeholder}
                          className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        localStorage.setItem(
                          "sourav_admin_settings",
                          JSON.stringify(settings)
                        );
                        setSettingsSaved(true);
                        setTimeout(() => setSettingsSaved(false), 3000);
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all mt-2"
                    >
                      Save Workshop Settings
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
