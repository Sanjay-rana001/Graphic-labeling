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
  ArrowUpRight,
  ExternalLink,
  Sliders,
  LayoutGrid,
  ListFilter,
  Award,
  Send,
  FileText,
  Briefcase,
  Printer,
  Download,
  Menu,
} from "lucide-react";
import {
  INITIAL_LEADS,
  LEAD_STATUSES,
  INITIAL_MATERIALS,
  DEFAULT_ADMIN_AUTH,
  PRODUCT_IMAGE_MAP,
} from "@/lib/adminData";
import { useTheme } from "../ThemeProvider";
import PremiumLoader, { isScreenLoaderEnabled } from "../PremiumLoader";
import SweepButton from "../SweepButton";
import StudioModeSettingsCard from "./StudioModeSettingsCard";

function getLeadProductImage(lead) {
  if (lead?.designFile?.previewUrl) return lead.designFile.previewUrl;
  const key = lead?.category || lead?.material || "";
  if (PRODUCT_IMAGE_MAP[key]) return PRODUCT_IMAGE_MAP[key];
  const found = INITIAL_MATERIALS.find(
    (m) =>
      key.toLowerCase().includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().includes(key.toLowerCase())
  );
  return found?.img || "/Media/Aluminium Name Plate.webp";
}

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
    `Hello ${lead.client},\n\nGreetings from *Sourav Graphic & Metal Label (B2B Factory Direct)*! Regarding your industrial inquiry *${lead.id}*:\n• Product: ${lead.category || lead.material || "Industrial Metal Label"}\n• Specifications: ${lead.size || "Custom Gauge"}\n• Mounting / Side: ${lead.mounting || "Standard"}\n• Colour / Print: ${lead.lighting || "Single Colour"}\n• Batch Qty: ${lead.quantity || 1} pcs\n• Current Status: *${lead.status}*\n\nPlease let us know a convenient time to share your B2B factory quotation & GST proforma invoice.`
  );
  return `https://wa.me/91${cleanPhone}?text=${msg}`;
}

// ─── Animated Manual Lead Modal (Aligned with B2B Landing Page Specs) ──────────
function ManualLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    client: "",
    phone: "",
    email: "",
    city: "",
    category: "Aluminium Name Plate",
    thickness: "0.7 mm",
    holes: "2 mm",
    side: "Single Side",
    colour: "Single Colour",
    quantity: 100,
    source: "B2B Bulk Quote Desk",
    notes: "",
    status: "New Inquiry",
  });
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.client.trim() || !form.phone.trim()) {
      setErr("Client / Company name and mobile number are required.");
      return;
    }
    const newLead = {
      id: "INQ-" + Math.floor(1000 + Math.random() * 9000),
      client: form.client,
      phone: form.phone,
      email: form.email || "—",
      city: form.city || "India",
      address: form.city || "India",
      date: new Date().toISOString().split("T")[0],
      source: form.source,
      category: form.category,
      material: form.category,
      size: `Thickness: ${form.thickness} | Holes: ${form.holes}`,
      lighting: form.colour,
      mounting: `${form.side} | Holes: ${form.holes}`,
      quantity: Number(form.quantity) || 1,
      status: form.status,
      notes:
        form.notes ||
        `Product: ${form.category} | Thickness: ${form.thickness} | Holes: ${form.holes} | Side: ${form.side} | Colour: ${form.colour} | Qty: ${form.quantity}`,
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
              <h2 className="text-white font-extrabold text-base">Log New B2B Inquiry</h2>
              <p className="text-zinc-400 text-xs">Add a direct B2B phone, WhatsApp, or OEM order lead</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          {err && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
              <AlertCircle size={14} /> {err}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Client / Company Name *</label>
              <input
                required
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                placeholder="e.g. Apex Switchgear Pvt. Ltd."
              />
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">WhatsApp / Mobile *</label>
              <input
                required
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="98XXXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Product Category</label>
              <select
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {INITIAL_MATERIALS.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">City / Industrial Area</label>
              <input
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. MIDC Pune / Gurugram"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Thickness</label>
              <select
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                value={form.thickness}
                onChange={(e) => setForm({ ...form, thickness: e.target.value })}
              >
                <option>0.3 mm</option>
                <option>0.5 mm</option>
                <option>0.7 mm</option>
                <option>0.91 mm</option>
                <option>1.5 mm</option>
                <option>2.0 mm</option>
                <option>3.0 mm+</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Holes</label>
              <select
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                value={form.holes}
                onChange={(e) => setForm({ ...form, holes: e.target.value })}
              >
                <option>1 mm</option>
                <option>2 mm</option>
                <option>3 mm</option>
                <option>4 mm</option>
                <option>5 mm</option>
                <option>No Holes</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Colour</label>
              <select
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                value={form.colour}
                onChange={(e) => setForm({ ...form, colour: e.target.value })}
              >
                <option>Single Colour</option>
                <option>Double Colour</option>
                <option>Three Colour</option>
                <option>Four Colour</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Batch Qty</label>
              <input
                type="number"
                min={1}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Printing Side</label>
              <select
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                value={form.side}
                onChange={(e) => setForm({ ...form, side: e.target.value })}
              >
                <option>Single Side</option>
                <option>Double Side</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-semibold mb-1 block">Inquiry Source</label>
              <select
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                <option>B2B Bulk Quote Desk</option>
                <option>Catalog Product Quote</option>
                <option>Product Enquiry Form</option>
                <option>WhatsApp Direct</option>
                <option>Phone / Direct Call</option>
                <option>OEM Repeat Order</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-semibold mb-1 block">Requirement & GST Notes</label>
            <textarea
              rows={2}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Custom drawing specs, GST number, or delivery timeline..."
            />
          </div>

          <div className="flex gap-3 pt-1">
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
              Save B2B Inquiry
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Animated Lead Detail & Spec Inspector Modal ───────────────────────────────
function LeadDetailModal({
  lead,
  onClose,
  onStatusChange,
  onNotesChange,
  factorySettings,
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [saved, setSaved] = useState(false);
  const [unitPrice, setUnitPrice] = useState("18");

  function saveNotes() {
    onNotesChange(lead.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePrintQuote() {
    const qty = Math.max(1, Number(lead.quantity) || 1);
    const rate = Math.max(0, Number(unitPrice) || 0);
    const subTotal = qty * rate;
    const gstAmt = Math.round(subTotal * 0.18);
    const grandTotal = subTotal + gstAmt;
    const bizName =
      factorySettings?.businessName || "Sourav Graphic & Metal Label";
    const bizPhone = factorySettings?.whatsapp || "9876543210";
    const bizAddr =
      factorySettings?.address || "Industrial Area, New Delhi, India";
    const bizGst = factorySettings?.gstin || "07AABCS1429B1Z1";

    const win = window.open("", "_blank", "width=860,height=720");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Quotation - ${lead.id} - ${bizName}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; padding: 28px; margin: 0; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #d97706; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
    .sub { font-size: 12px; color: #4b5563; margin-top: 4px; }
    .badge { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .box { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; font-size: 13px; }
    .box h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #b45309; letter-spacing: 0.8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
    th { background: #f3f4f6; font-weight: 800; text-transform: uppercase; font-size: 11px; }
    .totals { margin-top: 16px; width: 280px; margin-left: auto; font-size: 13px; }
    .totals div { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
    .totals .grand { font-weight: 900; font-size: 15px; border-top: 2px solid #111827; border-bottom: none; padding-top: 8px; }
    .footer { margin-top: 32px; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${bizName}</div>
      <div class="sub">${bizAddr}</div>
      <div class="sub">WhatsApp / Contact: +91 ${bizPhone} &bull; GSTIN: ${bizGst}</div>
    </div>
    <div style="text-align:right">
      <div class="badge">OFFICIAL B2B QUOTATION</div>
      <div class="sub" style="margin-top:8px"><strong>Ref ID:</strong> ${lead.id}</div>
      <div class="sub"><strong>Date:</strong> ${lead.date || new Date().toISOString().split("T")[0]}</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <h4>Buyer / Client Details</h4>
      <div><strong>${lead.client}</strong></div>
      <div>Phone: ${lead.phone}</div>
      <div>Email: ${lead.email || "—"}</div>
      <div>Location: ${lead.address || lead.city || "India"}</div>
    </div>
    <div class="box">
      <h4>Technical Job Card</h4>
      <div><strong>Category:</strong> ${lead.category || lead.material || "Industrial Nameplate"}</div>
      <div><strong>Specs:</strong> ${lead.size || "Standard Gauge"}</div>
      <div><strong>Mounting / Side:</strong> ${lead.mounting || "Standard"}</div>
      <div><strong>Colour / Finish:</strong> ${lead.lighting || "Standard"}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Product Description & Specifications</th>
        <th>Quantity</th>
        <th>Unit Rate (INR)</th>
        <th>Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td>
          <strong>${lead.category || lead.material || "Industrial Metal Label"}</strong><br/>
          <span style="font-size:12px;color:#4b5563">${lead.size || ""} | ${lead.mounting || ""} | ${lead.lighting || ""}</span>
        </td>
        <td>${qty} Pcs</td>
        <td>&#8377;${rate.toFixed(2)}</td>
        <td><strong>&#8377;${subTotal.toLocaleString("en-IN")}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal:</span><span>&#8377;${subTotal.toLocaleString("en-IN")}</span></div>
    <div><span>GST (18%):</span><span>&#8377;${gstAmt.toLocaleString("en-IN")}</span></div>
    <div class="grand"><span>Grand Total:</span><span>&#8377;${grandTotal.toLocaleString("en-IN")}</span></div>
  </div>

  ${notes ? `<div class="box" style="margin-top:18px"><h4>Terms & Quotation Notes</h4><div>${notes}</div></div>` : ""}

  <div class="footer">
    <span>Terms: 50% Advance with PO, Balance Before Dispatch. Standard Lead Time: 3-5 Working Days.</span>
    <span>Authorized Signatory — ${bizName}</span>
  </div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
    win.document.close();
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
          {/* Uploaded Customer Photo OR B2B Catalog Specimen Preview */}
          <div className="rounded-2xl bg-zinc-950/90 border border-white/10 p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3 font-mono">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Layers size={13} />{" "}
                {lead.designFile?.previewUrl
                  ? "CUSTOMER UPLOADED CAD / DESIGN PHOTO"
                  : "B2B CATALOG PRODUCT & FABRICATION SPECIMEN"}
              </span>
              <span>
                {lead.thickness || "0.7 mm"} • {lead.product || lead.material || "Aluminium Name Plate"}
              </span>
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
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                <div className="sm:col-span-5 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden relative min-h-[125px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getLeadProductImage(lead)}
                    alt={lead.product || lead.material || "B2B Product"}
                    className="w-full h-32 object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-amber-400 font-mono text-[9px] font-bold">
                    {lead.product || lead.material}
                  </span>
                </div>
                <div
                  className={`sm:col-span-7 py-6 px-5 rounded-xl relative flex flex-col items-center justify-center text-center shadow-2xl ${getMaterialTextureClass(
                    lead.material || lead.product
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
                          i === 0
                            ? "text-sm sm:text-base font-black tracking-wider"
                            : "text-xs font-semibold opacity-85 mt-1"
                        }`}
                      >
                        {t.line}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm sm:text-base font-black tracking-widest uppercase">
                      {lead.client}
                    </div>
                  )}
                </div>
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

          {/* Quick Printable Quote Builder + Follow-Up CTA Buttons */}
          <div className="bg-amber-500/[0.06] border border-amber-500/25 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Unit Rate (₹):
              </span>
              <input
                type="number"
                min={1}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-20 bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1 text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] font-mono text-zinc-400">
                × {lead.quantity} Pcs ={" "}
                <strong className="text-white">
                  ₹
                  {(
                    (Number(unitPrice) || 0) *
                    (Number(lead.quantity) || 1)
                  ).toLocaleString("en-IN")}
                </strong>{" "}
                (+18% GST)
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrintQuote}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer size={13} />
              <span>Print / PDF Quote</span>
            </button>
          </div>

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
  const [screenLoaderOn, setScreenLoaderOn] = useState(true);

  // UI
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'
  const [selectedLead, setSelectedLead] = useState(null);
  const [showManualLeadModal, setShowManualLeadModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [newMatName, setNewMatName] = useState("");
  const [newMatThickness, setNewMatThickness] = useState("3.0 mm");

  // Settings
  const [settings, setSettings] = useState({
    businessName: "Sourav Graphic & Metal Label",
    whatsapp: "9876543210",
    email: "sales@souravgraphic.in",
    address: "Industrial Area, New Delhi, India",
    gstin: "07AABCS1429B1Z1",
    tagline: "B2B Industrial Nameplate & Metal Label Manufacturer",
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  function handleExportCSV() {
    if (!leads || leads.length === 0) return;
    const headers = [
      "Inquiry ID",
      "Date",
      "Company / Client",
      "Phone",
      "Email",
      "City / Address",
      "Product / Material",
      "Specifications",
      "Mounting / Side",
      "Colour / Finish",
      "Quantity",
      "Status",
      "Source",
      "Notes",
    ];
    const escapeCsv = (val) => {
      const str = String(val ?? "").replace(/"/g, '""');
      return `"${str}"`;
    };
    const rows = leads.map((l) =>
      [
        l.id,
        l.date,
        l.client,
        l.phone,
        l.email || "",
        l.address || l.city || "",
        l.category || l.material || "",
        l.size || "",
        l.mounting || "",
        l.lighting || "",
        l.quantity || 1,
        l.status,
        l.source || "",
        l.notes || "",
      ]
        .map(escapeCsv)
        .join(",")
    );
    const csvContent = "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sourav-Graphic-B2B-Leads-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
      let localLeads = savedLeads ? JSON.parse(savedLeads) : INITIAL_LEADS;
      // Upgrade legacy residential demo leads to the B2B industrial leads
      const hasLegacyDemoLead = localLeads.some(
        (l) => l.client === "Rahul Sharma" || l.client === "Vikram Malhotra"
      );
      if (hasLegacyDemoLead) {
        const customUserLeads = localLeads.filter(
          (l) => !["LD-9041", "LD-9040", "LD-9039", "LD-9038", "LD-9037"].includes(l.id)
        );
        localLeads = [...customUserLeads, ...INITIAL_LEADS];
        localStorage.setItem("sourav_admin_leads", JSON.stringify(localLeads));
      }
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
      const parsedMats = savedMats ? JSON.parse(savedMats) : null;
      if (!parsedMats || !parsedMats[0]?.img || parsedMats.length < 12) {
        setMaterials(INITIAL_MATERIALS);
        localStorage.setItem("sourav_admin_materials", JSON.stringify(INITIAL_MATERIALS));
      } else {
        setMaterials(parsedMats);
      }

      const savedSettings = localStorage.getItem("sourav_admin_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error("AdminDashboard load error:", e);
    }

    const loaderEnabled = isScreenLoaderEnabled();
    setScreenLoaderOn(loaderEnabled);

    // Sync screenLoaderOn from server settings & BroadcastChannel
    fetch("/api/studio-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.settings) {
          const serverLoaderOn = data.settings.screenLoaderOn !== false;
          setScreenLoaderOn(serverLoaderOn);
        }
      })
      .catch(() => {});

    let channel = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("sourav_studio_mode_channel");
        channel.onmessage = (event) => {
          if (typeof event?.data?.screenLoaderOn === "boolean") {
            setScreenLoaderOn(event.data.screenLoaderOn);
          }
        };
      }
    } catch (e) {}

    if (!loaderEnabled) {
      setIsLoaded(true);
      return () => {
        if (channel) channel.close();
      };
    }

    const timer = setTimeout(() => setIsLoaded(true), 550);
    return () => {
      clearTimeout(timer);
      if (channel) channel.close();
    };
  }, []);

  async function handleToggleScreenLoader() {
    const nextVal = !screenLoaderOn;
    setScreenLoaderOn(nextVal);
    const nowIso = new Date().toISOString();

    let updatedSettings = {
      displayMode: "enquiry",
      customizationStudioOn: false,
      enquiryFormOn: true,
      screenLoaderOn: nextVal,
      minQuantity: 1,
      maxFileSizeMB: 10,
      updatedAt: nowIso,
      updatedBy: adminAuth.email,
    };

    try {
      const cached = localStorage.getItem("sourav_studio_mode_settings");
      if (cached) {
        const parsed = JSON.parse(cached);
        updatedSettings = {
          ...parsed,
          screenLoaderOn: nextVal,
          updatedAt: nowIso,
          updatedBy: adminAuth.email,
        };
      }
      localStorage.setItem(
        "sourav_studio_mode_settings",
        JSON.stringify(updatedSettings)
      );
      localStorage.setItem("sourav_screen_loader", String(nextVal));
    } catch (e) {}

    try {
      document.cookie = `sourav_screen_loader=${nextVal}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `sourav_mode_updated_at=${encodeURIComponent(
        nowIso
      )}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}

    try {
      if (typeof BroadcastChannel !== "undefined") {
        const ch = new BroadcastChannel("sourav_studio_mode_channel");
        ch.postMessage(updatedSettings);
        ch.close();
      }
    } catch (e) {}

    try {
      await fetch("/api/studio-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "true",
        },
        body: JSON.stringify(updatedSettings),
      });
    } catch (e) {}
  }

  // ── Persistence ──
  function saveLeads(updated) {
    setLeads(updated);
    localStorage.setItem("sourav_admin_leads", JSON.stringify(updated));
  }

  function saveMaterials(updated) {
    setMaterials(updated);
    localStorage.setItem("sourav_admin_materials", JSON.stringify(updated));
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const ch = new BroadcastChannel("sourav_studio_mode_channel");
        ch.postMessage({ catalogItems: updated });
        ch.close();
      }
    } catch (e) {}
    try {
      fetch("/api/studio-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "true",
        },
        body: JSON.stringify({
          catalogItems: updated,
          updatedAt: new Date().toISOString(),
          updatedBy: adminAuth.email,
        }),
      }).catch(() => {});
    } catch (e) {}
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
    const trimmed = newMatName.trim();
    const item = {
      id: "mat-" + Date.now(),
      name: trimmed,
      category: "Industrial Tags & Labels",
      thickness: newMatThickness || "0.5 mm – 2.0 mm",
      status: "Available",
      popular: true,
      img: PRODUCT_IMAGE_MAP[trimmed] || "/Media/metal labels.jpg",
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
            {/* Brand Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-transparent border border-amber-500/30 mb-4 shadow-lg shadow-amber-500/10">
                <ShieldCheck size={30} className="text-amber-400" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-2">
                <Lock size={11} /> Restricted Executive Access
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
    { id: "dashboard", label: "B2B Overview", icon: LayoutDashboard },
    { id: "leads", label: "B2B Inquiries & Leads", icon: Users, badge: newLeadsCount },
    { id: "studio-mode", label: "Studio Display Mode", icon: Sliders },
    { id: "materials", label: `B2B Product Catalog (${materials.length || 12})`, icon: Layers },
    { id: "security", label: "Super Admin Security", icon: ShieldCheck },
    { id: "settings", label: "Factory Settings", icon: SettingsIcon },
  ];

  return (
    <div
      className={`min-h-screen flex font-sans relative transition-colors duration-200 ${
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
            factorySettings={settings}
          />
        )}
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/65 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Fixed Left Sidebar (Sticks Permanently on Desktop, Drawer on Mobile) ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-56 h-screen shrink-0 flex flex-col z-40 border-r backdrop-blur-2xl overflow-y-auto transition-transform duration-200 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          isDarkMode
            ? "bg-[#0c0e14]/95 border-white/[0.08]"
            : "bg-[#f2faf7]/95 border-[#c3e2da]"
        }`}
      >
        {/* Brand Header — Double-Size Logo + Filling Animation "Back to Site" Button */}
        <div className="px-3.5 py-3 border-b border-current/10 flex flex-col items-center shrink-0">
          <Link href="/" className="w-full flex items-center justify-center group">
            <div className="relative h-28 w-full overflow-hidden">
              <Image
                src="/Media/Logo.png"
                alt="Sourav Graphic & Metal Label"
                fill
                sizes="220px"
                className="object-contain object-center scale-[1.28] transition-transform duration-200 group-hover:scale-[1.33]"
                priority
              />
            </div>
          </Link>
          <div className="mt-2 w-full">
            <SweepButton
              href="/"
              label="Back to Site"
              type="back"
              size="sm"
              fullWidth={true}
            />
          </div>
        </div>

        {/* Compact Navigation Links */}
        <nav className="flex-1 p-2.5 space-y-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full relative flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  active
                    ? "text-amber-600 dark:text-amber-400"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeAdminSidebarPill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-amber-500/15 border border-amber-500/30"
                  />
                )}
                <div className="relative z-10 flex items-center gap-2.5">
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="relative z-10 px-1.5 py-0.2 rounded-full text-[9.5px] font-mono font-extrabold bg-amber-500 text-zinc-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Compact Super Admin Card, Screen Loader ON/OFF & Actions */}
        <div className="p-2.5 border-t border-current/10 space-y-1.5 shrink-0">
          {/* Screen Loader ON / OFF Quick Switch */}
          <button
            type="button"
            onClick={handleToggleScreenLoader}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10.5px] font-extrabold border transition-all cursor-pointer ${
              screenLoaderOn
                ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-600 dark:text-emerald-400"
                : isDarkMode
                ? "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white"
                : "bg-white border-[#c3e2da] text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  screenLoaderOn ? "bg-emerald-500" : "bg-zinc-400"
                }`}
              />
              <span>Screen Loader</span>
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                screenLoaderOn
                  ? "bg-emerald-500 text-zinc-950"
                  : isDarkMode
                  ? "bg-zinc-800 text-zinc-300"
                  : "bg-zinc-200 text-zinc-700"
              }`}
            >
              {screenLoaderOn ? "ON" : "OFF"}
            </span>
          </button>

          <div
            className={`p-2 rounded-xl border text-[11px] ${
              isDarkMode
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-white/70 border-[#c3e2da]"
            }`}
          >
            <div className="text-[9px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-500 font-bold">
              Super Admin
            </div>
            <div className="font-mono text-[10px] truncate opacity-80">
              {adminAuth.email}
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => setTheme(!isDarkMode)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10.5px] font-semibold border transition-colors cursor-pointer ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.07]"
                  : "bg-white border-[#c3e2da] text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {isDarkMode ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} />}
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10.5px] font-bold bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area (Offset by Fixed Left Sidebar w-56 -> md:ml-56) ── */}
      <main className="flex-1 flex flex-col min-w-0 z-10 md:ml-56">
        {/* Compact Top Command Bar */}
        <header
          className={`sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b backdrop-blur-2xl ${
            isDarkMode
              ? "bg-[#08090d]/85 border-white/[0.08]"
              : "bg-[#e3f2ee]/85 border-[#c3e2da]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((v) => !v)}
              className="md:hidden p-1.5 rounded-lg border border-current/15 hover:bg-white/10 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Menu size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base tracking-tight">
                  {navItems.find((n) => n.id === activeTab)?.label}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Sync
                </span>
              </div>
              <p className="text-[10.5px] opacity-60 leading-tight">
                Sourav Graphic & Metal Label • B2B Inquiry & Quotation Hub
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Export Leads to CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/10 text-zinc-300 hover:text-white hover:border-amber-500/40"
                  : "bg-white border-[#c3e2da] text-zinc-800 hover:border-amber-500"
              }`}
              title="Export All B2B Leads to Excel / CSV"
            >
              <Download size={11} className="text-amber-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Screen Loader ON / OFF Button in Top Header */}
            <button
              type="button"
              onClick={handleToggleScreenLoader}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10.5px] font-extrabold border transition-all cursor-pointer ${
                screenLoaderOn
                  ? "bg-emerald-500 text-zinc-950 border-emerald-400"
                  : isDarkMode
                  ? "bg-white/[0.04] border-white/15 text-zinc-300 hover:text-white"
                  : "bg-white border-[#c3e2da] text-zinc-700 hover:text-zinc-950"
              }`}
              title="Turn Screen Loader ON or OFF"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  screenLoaderOn ? "bg-zinc-950" : "bg-zinc-400"
                }`}
              />
              <span>Screen Loader: {screenLoaderOn ? "ON" : "OFF"}</span>
            </button>

            <Link
              href="/customize"
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
                  : "bg-white border-[#c3e2da] text-zinc-800"
              }`}
            >
              <span>/customize</span>
              <ExternalLink size={11} />
            </Link>

            <button
              onClick={() => setShowManualLeadModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] rounded-lg transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Manual Inquiry</span>
            </button>
          </div>
        </header>

        {/* Compact Animated Tab Views */}
        <div className="p-3 sm:p-4 max-w-[1920px] w-full mx-auto flex-1">
          <AnimatePresence mode="wait">
            {/* ── TAB 1: DASHBOARD OVERVIEW ── */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* 4 Micro-Compact KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    {
                      label: "Total Inquiries",
                      sub: "All leads captured",
                      value: totalLeads,
                      icon: Users,
                      iconClass: "text-amber-500 bg-amber-500/10 border-amber-500/25",
                    },
                    {
                      label: "New / Unread Queries",
                      sub: "Awaiting first quote",
                      value: newLeadsCount,
                      icon: Inbox,
                      iconClass: "text-blue-500 bg-blue-500/10 border-blue-500/25",
                    },
                    {
                      label: "Active Discussions",
                      sub: "Quote & sample stage",
                      value: activePipelineCount,
                      icon: Clock,
                      iconClass: "text-purple-500 bg-purple-500/10 border-purple-500/25",
                    },
                    {
                      label: "Converted / Won",
                      sub: `${conversionRate}% conversion rate`,
                      value: convertedLeadsCount,
                      icon: Award,
                      iconClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
                    },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      onClick={() => setActiveTab("leads")}
                      className={`cursor-pointer rounded-xl border px-3 py-2.5 flex items-center justify-between gap-2 transition-shadow hover:shadow-sm ${
                        isDarkMode
                          ? "bg-[#0f1118] border-white/[0.08]"
                          : "bg-white border-[#c3e2da]"
                      }`}
                    >
                      <div>
                        <div className="text-lg sm:text-xl font-black font-mono tracking-tight leading-none">
                          {kpi.value}
                        </div>
                        <div className="text-[11px] font-extrabold mt-1 leading-tight">{kpi.label}</div>
                        <div className="text-[9.5px] opacity-60">{kpi.sub}</div>
                      </div>
                      <div className={`p-2 rounded-lg border shrink-0 ${kpi.iconClass}`}>
                        <kpi.icon size={15} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Studio Builder Display Mode Quick Control Card */}
                <StudioModeSettingsCard
                  isDarkMode={isDarkMode}
                  adminEmail={adminAuth.email}
                />

                {/* ── HORIZONTAL 6-STAGE INQUIRY PIPELINE STRIP (COMPACT) ── */}
                <div
                  className={`rounded-xl border p-2.5 sm:p-3 ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/[0.08]"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-extrabold text-xs">Inquiry Pipeline</h2>
                      <span className="text-[10px] opacity-60">
                        Click stage to filter
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setStatusFilter("All");
                        setActiveTab("leads");
                      }}
                      className="text-amber-600 dark:text-amber-400 text-[11px] font-extrabold hover:underline cursor-pointer"
                    >
                      All Leads ({totalLeads}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {LEAD_STATUSES.map((s) => {
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
                          className={`group cursor-pointer rounded-lg px-2.5 py-2 border transition-all ${
                            isDarkMode
                              ? "bg-white/[0.02] border-white/[0.07] hover:border-amber-500/40"
                              : "bg-[#f4fbf9] border-[#c3e2da] hover:border-amber-500"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold truncate group-hover:text-amber-500 transition-colors">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotColor(
                                  s.key
                                )}`}
                              />
                              <span className="truncate">{s.label}</span>
                            </span>
                            <span className="text-[9px] font-mono font-bold opacity-55 shrink-0">
                              {pct}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-black font-mono leading-none">
                              {count}
                            </span>
                            <div
                              className={`flex-1 h-1 rounded-full overflow-hidden ${
                                isDarkMode ? "bg-white/10" : "bg-emerald-950/10"
                              }`}
                            >
                              <div
                                style={{
                                  width: `${Math.max(pct, count > 0 ? 12 : 0)}%`,
                                }}
                                className="h-full rounded-full bg-amber-500"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── FULL-WIDTH COMPACT LATEST CUSTOMER QUERIES ── */}
                <div
                  className={`rounded-xl border p-3 flex flex-col ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/[0.08]"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-current/10">
                    <div>
                      <h2 className="font-extrabold text-xs sm:text-sm">
                        Latest B2B Customer Queries
                      </h2>
                      <p className="text-[10px] opacity-60">
                        Click any inquiry to inspect plate specs & send WhatsApp quote
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold border transition-colors cursor-pointer ${
                        isDarkMode
                          ? "bg-amber-500 text-zinc-950 border-amber-400 hover:bg-amber-400"
                          : "bg-[#0d1e1b] text-white border-[#0d1e1b] hover:bg-slate-800"
                      }`}
                    >
                      View All ({leads.length})
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {leads.slice(0, 5).map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer px-2.5 py-2 rounded-lg border grid grid-cols-1 lg:grid-cols-12 items-center gap-2 transition-all ${
                          isDarkMode
                            ? "bg-white/[0.02] border-white/[0.07] hover:border-amber-500/40 hover:bg-white/[0.04]"
                            : "bg-[#f6fbf9] border-[#cce5de] hover:border-[#0d1e1b]/40 hover:bg-[#eef8f5]"
                        }`}
                      >
                        {/* Col 1-5: Real Product Thumbnail + Company Name + Inquiry ID + Contact */}
                        <div className="lg:col-span-5 flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-current/15 bg-zinc-900 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getLeadProductImage(lead)}
                              alt={lead.material || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs truncate">
                                {lead.client}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black border shrink-0 whitespace-nowrap ${
                                  isDarkMode
                                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                    : "bg-amber-500/15 text-amber-900 border-amber-500/35"
                                }`}
                              >
                                {lead.id}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 text-[10px] opacity-65 font-medium leading-tight">
                              <span className="font-mono">{lead.phone}</span>
                              <span>•</span>
                              <span className="truncate">{lead.city || "India"}</span>
                              <span>•</span>
                              <span>{lead.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Col 6-9: Product Category & Gauge Specs + Batch Quantity */}
                        <div className="lg:col-span-4 flex items-center justify-between sm:justify-start gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 truncate leading-tight">
                              {lead.material || lead.category}
                            </div>
                            <div className="text-[10px] font-mono opacity-75 truncate leading-tight">
                              {lead.size}
                            </div>
                          </div>
                          <div
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black border shrink-0 whitespace-nowrap ${
                              isDarkMode
                                ? "bg-white/5 border-white/10 text-white"
                                : "bg-white border-[#c3e2da] text-[#0d1e1b]"
                            }`}
                          >
                            Qty: {lead.quantity}
                          </div>
                        </div>

                        {/* Col 10-12: Pipeline Status Dropdown + Specs & WhatsApp Actions */}
                        <div
                          className="lg:col-span-3 flex items-center justify-end gap-1.5 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value)
                            }
                            className={`px-2 py-1 rounded-md text-[10px] font-bold border cursor-pointer focus:outline-none ${statusBadge(
                              lead.status
                            )}`}
                          >
                            {LEAD_STATUSES.map((s) => (
                              <option
                                key={s.key}
                                value={s.key}
                                className="bg-zinc-900 text-white"
                              >
                                {s.label}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className={`px-2 py-1 rounded-md border text-[10px] font-extrabold transition-colors cursor-pointer ${
                              isDarkMode
                                ? "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200"
                                : "bg-white hover:bg-zinc-100 border-[#c3e2da] text-[#0d1e1b]"
                            }`}
                          >
                            Specs
                          </button>

                          <a
                            href={whatsappLink(lead.phone, lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded-md border transition-colors ${
                              isDarkMode
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500 hover:text-zinc-950"
                                : "bg-emerald-600/15 text-emerald-800 border-emerald-600/30 hover:bg-emerald-600 hover:text-white"
                            }`}
                            title="Send B2B Quote on WhatsApp"
                          >
                            <MessageCircle size={12} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: ALL LEADS & INQUIRIES CRM (COMPACT) ── */}
            {activeTab === "leads" && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Compact Search Bar & View Mode Switcher */}
                <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-between">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by client name, mobile, INQ-ID, material, or city..."
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-500 transition-colors ${
                        isDarkMode
                          ? "bg-[#0f1118] border-white/10 text-white placeholder:text-zinc-500"
                          : "bg-white border-[#c3e2da] text-zinc-900"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                        viewMode === "cards"
                          ? "bg-amber-500 text-zinc-950 border-amber-500"
                          : isDarkMode
                          ? "bg-[#0f1118] border-white/10 text-zinc-400"
                          : "bg-white border-[#c3e2da] text-zinc-700"
                      }`}
                    >
                      <LayoutGrid size={12} /> Cards
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                        viewMode === "table"
                          ? "bg-amber-500 text-zinc-950 border-amber-500"
                          : isDarkMode
                          ? "bg-[#0f1118] border-white/10 text-zinc-400"
                          : "bg-white border-[#c3e2da] text-zinc-700"
                      }`}
                    >
                      <ListFilter size={12} /> Table
                    </button>
                  </div>
                </div>

                {/* Compact Interactive Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                          active
                            ? "bg-amber-500 text-zinc-950 border-amber-500"
                            : isDarkMode
                            ? "bg-[#0f1118] border-white/10 text-zinc-400 hover:text-white"
                            : "bg-white border-[#c3e2da] text-zinc-700"
                        }`}
                      >
                        <span>{st}</span>
                        <span
                          className={`px-1.5 py-0.1 rounded-full text-[9.5px] font-mono ${
                            active ? "bg-black/20 text-zinc-950" : "bg-current/10"
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
                    className={`rounded-2xl border p-8 text-center ${
                      isDarkMode
                        ? "bg-[#0f1118] border-white/10"
                        : "bg-white border-[#c3e2da]"
                    }`}
                  >
                    <Inbox size={28} className="mx-auto mb-2 text-amber-400 opacity-50" />
                    <h3 className="font-bold text-sm">No matching inquiries found</h3>
                    <p className="text-[11px] opacity-60 mt-0.5">
                      Try clearing your search filter or add a manual inquiry above.
                    </p>
                  </div>
                ) : viewMode === "cards" ? (
                  /* COMPACT 3-COLUMN CARD GRID VIEW */
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all hover:shadow-md ${
                          isDarkMode
                            ? "bg-[#0f1118] border-white/[0.08] hover:border-amber-500/40"
                            : "bg-white border-[#c3e2da] hover:border-amber-500"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-current/15 bg-zinc-900 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getLeadProductImage(lead)}
                                  alt={lead.material || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] font-bold text-amber-500 whitespace-nowrap">
                                    {lead.id}
                                  </span>
                                  <span className="text-[10px] opacity-50">• {lead.date}</span>
                                </div>
                                <h3 className="font-extrabold text-xs leading-tight truncate">
                                  {lead.client}
                                </h3>
                              </div>
                            </div>

                            <select
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border focus:outline-none cursor-pointer shrink-0 ${
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

                          {/* Compact Spec Chips */}
                          <div className="flex flex-wrap gap-1 my-2">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                              {lead.material || "Custom Metal"}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-current/5 border border-current/10 text-[10px] font-mono">
                              {lead.size || "Standard"}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-current/5 border border-current/10 text-[10px] font-bold">
                              Qty: {lead.quantity}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-current/5 border border-current/10 text-[10px] opacity-75">
                              {lead.city || "India"}
                            </span>
                          </div>

                          {lead.notes && (
                            <p className="text-[10.5px] opacity-65 line-clamp-1 italic mb-2">
                              &ldquo;{lead.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-current/10 flex items-center justify-between gap-2">
                          <div className="text-[10.5px] font-mono opacity-75 flex items-center gap-1">
                            <Phone size={11} className="text-amber-500" />
                            {lead.phone}
                          </div>

                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={whatsappLink(lead.phone, lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-zinc-950 border border-emerald-500/25 text-[10px] font-bold flex items-center gap-1 transition-all"
                            >
                              <MessageCircle size={11} /> WhatsApp
                            </a>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-2 py-1 rounded-lg bg-current/5 hover:bg-current/10 border border-current/10 text-[10px] font-semibold cursor-pointer"
                            >
                              Specs
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* COMPACT EXECUTIVE TABLE VIEW */
                  <div
                    className={`rounded-xl border overflow-hidden ${
                      isDarkMode
                        ? "bg-[#0f1118] border-white/10"
                        : "bg-white border-[#c3e2da]"
                    }`}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-current/10 text-[10px] uppercase tracking-wider opacity-60">
                            <th className="py-2.5 px-3">Inquiry ID & Client</th>
                            <th className="py-2.5 px-3">Contact</th>
                            <th className="py-2.5 px-3">Plate Specifications</th>
                            <th className="py-2.5 px-3">Qty</th>
                            <th className="py-2.5 px-3">Pipeline Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-current/10">
                          {filteredLeads.map((lead) => (
                            <tr
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className="hover:bg-current/[0.03] cursor-pointer transition-colors"
                            >
                              <td className="py-2 px-3">
                                <div className="font-mono text-amber-500 font-bold text-[10px]">
                                  {lead.id}
                                </div>
                                <div className="font-bold text-xs">{lead.client}</div>
                                <div className="text-[10px] opacity-50">
                                  {lead.source} • {lead.date}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="font-mono">{lead.phone}</div>
                                <div className="text-[10px] opacity-60">{lead.city}</div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="font-bold text-amber-500">{lead.material}</div>
                                <div className="font-mono text-[10px] opacity-70">{lead.size}</div>
                              </td>
                              <td className="py-2 px-3 font-mono font-bold">
                                {lead.quantity}
                              </td>
                              <td
                                className="py-2 px-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <select
                                  value={lead.status}
                                  onChange={(e) =>
                                    handleStatusChange(lead.id, e.target.value)
                                  }
                                  className="bg-zinc-900 border border-white/15 rounded-lg px-2 py-1 text-white text-[10.5px] font-bold focus:outline-none focus:border-amber-500"
                                >
                                  {LEAD_STATUSES.map((s) => (
                                    <option key={s.key} value={s.key}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td
                                className="py-2 px-3 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="inline-flex items-center gap-1">
                                  <a
                                    href={whatsappLink(lead.phone, lead)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500 hover:text-zinc-950 transition-colors"
                                  >
                                    <MessageCircle size={12} />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 size={12} />
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <StudioModeSettingsCard
                  isDarkMode={isDarkMode}
                  adminEmail={adminAuth.email}
                />
              </motion.div>
            )}

            {/* ── TAB 4: B2B PRODUCT CATALOG (COMPACT 6-COLUMN GRID) ── */}
            {activeTab === "materials" && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Compact Add New Material Bar */}
                <form
                  onSubmit={handleAddMaterial}
                  className={`rounded-xl border p-3 flex flex-col sm:flex-row items-stretch sm:items-end gap-2 ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/10"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                      Add New B2B Product / Material Specimen
                    </label>
                    <input
                      value={newMatName}
                      onChange={(e) => setNewMatName(e.target.value)}
                      placeholder="e.g. Copper Antique Brushed Plate"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500 ${
                        isDarkMode
                          ? "bg-zinc-900/80 border-white/10 text-white"
                          : "bg-zinc-50 border-zinc-300 text-zinc-900"
                      }`}
                    />
                  </div>
                  <div className="sm:w-36">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                      Standard Gauge
                    </label>
                    <input
                      value={newMatThickness}
                      onChange={(e) => setNewMatThickness(e.target.value)}
                      placeholder="0.5 - 2.0 mm"
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-500 ${
                        isDarkMode
                          ? "bg-zinc-900/80 border-white/10 text-white"
                          : "bg-zinc-50 border-zinc-300 text-zinc-900"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus size={13} /> Add Product
                  </button>
                </form>

                {/* Micro-Compact 6-Column B2B Product Catalog Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {materials.map((mat, idx) => (
                    <div
                      key={mat.id}
                      className={`rounded-xl border p-2.5 flex flex-col justify-between ${
                        isDarkMode
                          ? "bg-[#0f1118] border-white/10"
                          : "bg-white border-[#c3e2da]"
                      }`}
                    >
                      <div>
                        {/* Real Landing Page Product Photo */}
                        <div className="h-24 rounded-lg mb-2 relative overflow-hidden bg-white border border-current/10">
                          {mat.img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={mat.img}
                              alt={mat.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center ${getMaterialTextureClass(
                                mat.name
                              )}`}
                            />
                          )}
                          <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/75 text-white font-mono text-[8px] font-bold">
                            {mat.code || `SG-${idx + 1}`}
                          </span>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-amber-400 font-mono text-[8.5px] font-bold">
                            {mat.thickness}
                          </span>
                        </div>

                        <div className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 truncate">
                          {mat.category || "Industrial Label"}
                        </div>
                        <h3 className="font-extrabold text-[11px] mt-0.5 line-clamp-1 leading-tight">
                          {mat.name}
                        </h3>
                        <p className="text-[9.5px] opacity-60 mt-0.5 truncate">
                          {mat.mounting || "Holes / 3M"}
                        </p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-current/10 flex items-center justify-between gap-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                            mat.status === "Available"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
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
                          className="px-2 py-0.5 rounded bg-current/5 hover:bg-current/10 border border-current/10 text-[9.5px] font-bold transition-colors cursor-pointer"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 5: SUPER ADMIN SECURITY (COMPACT) ── */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="max-w-lg"
              >
                <div
                  className={`rounded-2xl border p-4 sm:p-5 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/10"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500">
                      <KeyRound size={16} />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-sm">
                        Super Admin Security & Credentials
                      </h2>
                      <p className="text-[11px] opacity-60">
                        Update login email or password after verifying current password
                      </p>
                    </div>
                  </div>

                  <div className="mb-3.5 p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-[9.5px] uppercase tracking-wider opacity-60 font-bold">
                        Active Super Admin Email
                      </p>
                      <p className="text-amber-600 dark:text-amber-400 font-mono font-extrabold text-xs">
                        {adminAuth.email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Verified
                    </span>
                  </div>

                  {credError && (
                    <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-500 text-[11px] font-semibold mb-3">
                      <AlertCircle size={13} className="shrink-0" /> {credError}
                    </div>
                  )}

                  {credSuccess && (
                    <div className="space-y-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 text-emerald-500 text-[11px] mb-3">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 size={14} className="shrink-0" /> {credSuccess}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="opacity-80">
                          New credentials active immediately.
                        </span>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-zinc-950 font-black text-[10px]"
                        >
                          Test Login
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleCredChange} className="space-y-2.5 text-[11px]">
                    <div>
                      <label className="opacity-70 font-bold uppercase tracking-wider mb-1 block text-[10px]">
                        Admin Email ID *
                      </label>
                      <div className="relative">
                        <Mail
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                          type="email"
                          required
                          value={credForm.email}
                          onChange={(e) =>
                            setCredForm({ ...credForm, email: e.target.value })
                          }
                          placeholder="Enter new admin email ID"
                          className="w-full bg-zinc-900/90 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-current/10">
                      <label className="opacity-70 font-bold uppercase tracking-wider mb-1 block text-[10px]">
                        Current Password *
                      </label>
                      <div className="relative">
                        <Lock
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
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
                          className="w-full bg-zinc-900/90 border border-white/10 rounded-lg pl-8 pr-8 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCredPw((p) => ({ ...p, current: !p.current }))
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                        >
                          {showCredPw.current ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-current/10">
                      <div>
                        <label className="opacity-70 font-bold uppercase tracking-wider mb-1 block text-[10px]">
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
                            placeholder="Leave blank to keep"
                            className="w-full bg-zinc-900/90 border border-white/10 rounded-lg px-2.5 py-2 pr-8 text-white focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCredPw((p) => ({ ...p, new: !p.new }))
                            }
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showCredPw.new ? (
                              <EyeOff size={13} />
                            ) : (
                              <Eye size={13} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="opacity-70 font-bold uppercase tracking-wider mb-1 block text-[10px]">
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
                            className="w-full bg-zinc-900/90 border border-white/10 rounded-lg px-2.5 py-2 pr-8 text-white focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCredPw((p) => ({
                                ...p,
                                confirm: !p.confirm,
                              }))
                            }
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showCredPw.confirm ? (
                              <EyeOff size={13} />
                            ) : (
                              <Eye size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-2 rounded-lg text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Authenticate & Save Credentials
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── TAB 6: FACTORY SETTINGS (COMPACT) ── */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 max-w-4xl"
              >
                <StudioModeSettingsCard
                  isDarkMode={isDarkMode}
                  adminEmail={adminAuth.email}
                />

                <div
                  className={`rounded-2xl border p-4 sm:p-5 max-w-lg ${
                    isDarkMode
                      ? "bg-[#0f1118] border-white/10"
                      : "bg-white border-[#c3e2da]"
                  }`}
                >
                  <h2 className="font-extrabold text-sm mb-0.5">
                    Factory & Contact Settings
                  </h2>
                  <p className="text-[11px] opacity-60 mb-3.5">
                    Configure business details used for WhatsApp follow-ups & quotations
                  </p>

                  {settingsSaved && (
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-emerald-500 text-[11px] font-bold mb-3">
                      <CheckCircle2 size={13} /> Factory settings saved!
                    </div>
                  )}

                  <div className="space-y-2.5 text-[11px]">
                    {[
                      {
                        label: "Business / Factory Name",
                        key: "businessName",
                        placeholder: "Sourav Graphic & Metal Label",
                      },
                      {
                        label: "Official WhatsApp Number (Used on Live Website)",
                        key: "whatsapp",
                        placeholder: "9876543210",
                      },
                      {
                        label: "Official Sales Email",
                        key: "email",
                        placeholder: "sales@souravgraphic.in",
                      },
                      {
                        label: "GSTIN Number (Printed on Quotations)",
                        key: "gstin",
                        placeholder: "07AABCS1429B1Z1",
                      },
                      {
                        label: "Factory Address",
                        key: "address",
                        placeholder: "Industrial Area, New Delhi",
                      },
                      {
                        label: "Brand Tagline",
                        key: "tagline",
                        placeholder: "B2B Industrial Nameplate & Metal Label Manufacturer",
                      },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="opacity-70 font-bold uppercase tracking-wider mb-1 block text-[10px]">
                          {field.label}
                        </label>
                        <input
                          value={settings[field.key] || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, [field.key]: e.target.value })
                          }
                          placeholder={field.placeholder}
                          className="w-full bg-zinc-900/90 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}

                    <button
                      onClick={async () => {
                        localStorage.setItem(
                          "sourav_admin_settings",
                          JSON.stringify(settings)
                        );
                        try {
                          if (typeof BroadcastChannel !== "undefined") {
                            const ch = new BroadcastChannel("sourav_studio_mode_channel");
                            ch.postMessage({ factoryInfo: settings });
                            ch.close();
                          }
                        } catch (e) {}
                        try {
                          await fetch("/api/studio-settings", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "x-admin-auth": "true",
                            },
                            body: JSON.stringify({
                              factoryInfo: settings,
                              updatedAt: new Date().toISOString(),
                              updatedBy: adminAuth.email,
                            }),
                          });
                        } catch (e) {}
                        setSettingsSaved(true);
                        setTimeout(() => setSettingsSaved(false), 3000);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-2 rounded-lg text-[11px] uppercase tracking-wider transition-all mt-1 cursor-pointer"
                    >
                      Save & Sync Factory Settings Across Website
                    </button>
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
