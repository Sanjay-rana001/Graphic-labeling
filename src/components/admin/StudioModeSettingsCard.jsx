"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Smartphone,
  Columns,
  ArrowLeft,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from "lucide-react";
import ProductBuilder from "../ProductBuilder";
import StudioEnquiryForm from "../StudioEnquiryForm";

function getTs(obj) {
  const raw = obj?.updatedAt;
  const parsed = raw ? Date.parse(raw) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function StudioModeSettingsCard({
  isDarkMode = true,
  adminEmail = "admin",
}) {
  const [liveSettings, setLiveSettings] = useState({
    displayMode: "enquiry",
    customizationStudioOn: false,
    enquiryFormOn: true,
    minQuantity: 1,
    maxFileSizeMB: 10,
    thicknessOptions: ["0.3 mm", "0.5 mm", "0.7 mm", "0.91 mm", "1.5 mm", "2.0 mm"],
    holeOptions: ["1 mm", "2 mm", "3 mm", "4 mm", "5 mm", "No Holes"],
    sideOptions: ["Single Side", "Double Side"],
    colourOptions: ["Single Colour", "Double Colour", "Three Colour", "Four Colour"],
    updatedAt: "2026-10-29T12:00:00.000Z",
  });

  const [draftSettings, setDraftSettings] = useState(liveSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // Live Preview Modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState("enquiry"); // 'studio' | 'enquiry' | 'split'
  const [previewViewport, setPreviewViewport] = useState("desktop"); // 'desktop' | 'mobile'

  const persistEverywhere = (nextSettings) => {
    try {
      localStorage.setItem(
        "sourav_studio_mode_settings",
        JSON.stringify(nextSettings)
      );
    } catch (e) {}

    try {
      document.cookie = `sourav_display_mode=${nextSettings.displayMode}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `sourav_mode_updated_at=${encodeURIComponent(
        nextSettings.updatedAt
      )}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}

    try {
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("sourav_studio_mode_channel");
        channel.postMessage(nextSettings);
        channel.close();
      }
    } catch (e) {}
  };

  // Load saved setting on mount (compare localStorage vs server by updatedAt)
  useEffect(() => {
    let localParsed = null;
    try {
      const cached = localStorage.getItem("sourav_studio_mode_settings");
      if (cached) {
        localParsed = JSON.parse(cached);
        if (localParsed?.displayMode) {
          setLiveSettings((prev) => ({ ...prev, ...localParsed }));
          setDraftSettings((prev) => ({ ...prev, ...localParsed }));
          setPreviewMode(localParsed.displayMode);
        }
      }
    } catch (e) {}

    fetch("/api/studio-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.settings) {
          const serverSettings = data.settings;
          if (!localParsed || getTs(serverSettings) >= getTs(localParsed)) {
            setLiveSettings(serverSettings);
            setDraftSettings(serverSettings);
            setPreviewMode(serverSettings.displayMode || "enquiry");
            persistEverywhere(serverSettings);
          }
        }
      })
      .catch(() => {});
  }, []);

  const isStudioMode = draftSettings.displayMode === "studio";

  const handleToggleMode = async (nextMode) => {
    setSaveMessage("");
    setSaveError("");
    const nowIso = new Date().toISOString();
    const updatedDraft = {
      ...draftSettings,
      displayMode: nextMode,
      customizationStudioOn: nextMode === "studio",
      enquiryFormOn: nextMode === "enquiry",
      updatedAt: nowIso,
      updatedBy: adminEmail,
    };

    setDraftSettings(updatedDraft);
    setLiveSettings(updatedDraft);
    setPreviewMode(nextMode);
    persistEverywhere(updatedDraft);

    setSaveMessage(
      `Switched to ${
        nextMode === "studio"
          ? "Customization Studio (ON) — 3D Customizer is now LIVE on /customize"
          : "Enquiry Form (ON) — Direct Photo Upload & Enquiry Form is now LIVE on /customize"
      }`
    );

    setIsSaving(true);
    try {
      const res = await fetch("/api/studio-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "true",
        },
        body: JSON.stringify(updatedDraft),
      });
      const data = await res.json();
      if (res.ok && data?.success && data.settings) {
        setLiveSettings(data.settings);
        setDraftSettings(data.settings);
        persistEverywhere(data.settings);
      }
    } catch (err) {
      // LocalStorage + Cookie + BroadcastChannel already succeeded
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setSaveError("");
    const nowIso = new Date().toISOString();
    const payload = {
      ...draftSettings,
      updatedAt: nowIso,
      updatedBy: adminEmail,
    };

    setLiveSettings(payload);
    setDraftSettings(payload);
    persistEverywhere(payload);

    try {
      const res = await fetch("/api/studio-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data?.success && data.settings) {
        setLiveSettings(data.settings);
        setDraftSettings(data.settings);
        persistEverywhere(data.settings);
      }

      setSaveMessage(
        `Saved! Live customer page (/customize) is now showing ${
          payload.displayMode === "studio"
            ? "Customization Studio (ON)"
            : "Enquiry Form (ON)"
        }.`
      );
    } catch (err) {
      setSaveMessage(
        `Saved! Live customer page (/customize) is now showing ${
          payload.displayMode === "studio"
            ? "Customization Studio (ON)"
            : "Enquiry Form (ON)"
        }.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className={`rounded-3xl border p-6 sm:p-7 relative overflow-hidden ${
          isDarkMode
            ? "bg-[#0f1118] border-white/10 text-white"
            : "bg-white border-[#c3e2da] text-[#0d1e1b]"
        }`}
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 shrink-0">
              <Sliders size={22} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg">
                  Studio Builder Display Mode
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-black uppercase border ${
                    isStudioMode
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  }`}
                >
                  LIVE ON /customize:{" "}
                  {isStudioMode ? "3D Customization Studio" : "Photo Upload Enquiry Form"}
                </span>
              </div>
              <p className="text-xs opacity-65 mt-1">
                Click either button below to immediately switch what customers see on{" "}
                <code>/customize</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/customize"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-all"
            >
              <span>Open /customize</span>
              <ExternalLink size={13} />
            </a>
            <button
              type="button"
              onClick={() => {
                setPreviewMode(draftSettings.displayMode);
                setIsPreviewOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-extrabold flex items-center gap-1.5 transition-all"
            >
              <Eye size={14} className="text-amber-400" />
              <span>Preview Both</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{saveMessage}</span>
              </div>
              <a
                href="/customize"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-black text-[11px] flex items-center gap-1 shrink-0 hover:bg-emerald-400"
              >
                <span>Verify Live Page</span>
                <ExternalLink size={12} />
              </a>
            </motion.div>
          )}

          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{saveError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Clickable Toggle Switch Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => handleToggleMode("studio")}
              className={`px-4 py-2.5 rounded-xl font-extrabold border transition-all flex items-center gap-2 cursor-pointer ${
                isStudioMode
                  ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                  : "bg-zinc-800/60 text-zinc-400 border-white/10 hover:text-white"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isStudioMode ? "bg-zinc-950" : "bg-zinc-500"
                }`}
              />
              <span>Customization Studio: {isStudioMode ? "ON" : "OFF"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleMode("enquiry")}
              className={`px-4 py-2.5 rounded-xl font-extrabold border transition-all flex items-center gap-2 cursor-pointer ${
                !isStudioMode
                  ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-zinc-800/60 text-zinc-400 border-white/10 hover:text-white"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  !isStudioMode ? "bg-zinc-950" : "bg-zinc-500"
                }`}
              />
              <span>Enquiry Form: {!isStudioMode ? "ON" : "OFF"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleToggleMode(isStudioMode ? "enquiry" : "studio")}
            className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-extrabold transition-all cursor-pointer"
          >
            {isStudioMode ? (
              <>
                <ToggleRight size={22} className="text-emerald-400" />
                <span>Turn ON Enquiry Form</span>
              </>
            ) : (
              <>
                <ToggleLeft size={22} className="text-amber-400" />
                <span>Turn ON Customization Studio</span>
              </>
            )}
          </button>
        </div>

        {/* Mode A & Mode B Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Mode A: Customization Studio */}
          <div
            onClick={() => handleToggleMode("studio")}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
              isStudioMode
                ? "border-emerald-500 bg-emerald-500/[0.08] shadow-lg shadow-emerald-500/10"
                : "border-white/10 bg-white/[0.02] opacity-75 hover:opacity-100"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Mode A • 3D Customizer
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isStudioMode
                      ? "bg-emerald-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Customization Studio — {isStudioMode ? "ON" : "OFF"}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Interactive 3D Customization Studio
              </h3>
              <p className="text-xs opacity-65 mt-1.5 leading-relaxed">
                Customers can type custom text, pick fonts, change metal textures, adjust sizes, and see a live 3D engraved nameplate.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">
                {isStudioMode ? "● Currently LIVE on Website" : "Click to Activate Mode A"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewMode("studio");
                  setIsPreviewOpen(true);
                }}
                className="text-xs font-semibold underline opacity-80 hover:opacity-100"
              >
                Preview Studio →
              </button>
            </div>
          </div>

          {/* Mode B: Enquiry Form */}
          <div
            onClick={() => handleToggleMode("enquiry")}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
              !isStudioMode
                ? "border-amber-500 bg-amber-500/[0.08] shadow-lg shadow-amber-500/10"
                : "border-white/10 bg-white/[0.02] opacity-75 hover:opacity-100"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Mode B • Direct Upload & Lead Form
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    !isStudioMode
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Enquiry Form — {!isStudioMode ? "ON" : "OFF"}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Direct Photo Upload & Specification Enquiry Form
              </h3>
              <p className="text-xs opacity-65 mt-1.5 leading-relaxed">
                Hides all customization tools. Customers directly upload their design photo with side-by-side photo preview, pick Thickness/Holes/Colour/Qty, and submit a lead.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">
                {!isStudioMode ? "● Currently LIVE on Website" : "Click to Activate Mode B"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewMode("enquiry");
                  setIsPreviewOpen(true);
                }}
                className="text-xs font-semibold underline opacity-80 hover:opacity-100"
              >
                Preview Enquiry Form →
              </button>
            </div>
          </div>
        </div>

        {/* Configurable Enquiry Form Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10 text-xs">
          <div>
            <label className="opacity-70 font-bold uppercase tracking-wider block mb-1.5">
              Enquiry Form Minimum Order Quantity
            </label>
            <input
              type="number"
              min={1}
              value={draftSettings.minQuantity}
              onChange={(e) =>
                setDraftSettings({
                  ...draftSettings,
                  minQuantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                })
              }
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="opacity-70 font-bold uppercase tracking-wider block mb-1.5">
              Max Artwork Upload File Size (MB)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={draftSettings.maxFileSizeMB}
              onChange={(e) =>
                setDraftSettings({
                  ...draftSettings,
                  maxFileSizeMB: Math.min(
                    50,
                    Math.max(1, parseInt(e.target.value, 10) || 10)
                  ),
                })
              }
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Save Action Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs opacity-70">
            Mode switches are applied immediately to <code>/customize</code>.
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveSettings}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Save size={15} />
            <span>
              {isSaving ? "Saving Setting..." : "Save Display Mode Setting"}
            </span>
          </button>
        </div>
      </div>

      {/* ── FULL-SCREEN / SPLIT-SCREEN ADMIN PREVIEW MODAL ── */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col"
          >
            {/* Top Admin Preview Control Bar */}
            <div className="bg-[#08090d] border-b border-white/15 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white text-xs shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-black flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Admin Settings</span>
                </button>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span className="font-bold">Admin Customer Page Preview</span>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("studio")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      previewMode === "studio"
                        ? "bg-emerald-500 text-zinc-950"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Preview Customization Studio
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("enquiry")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      previewMode === "enquiry"
                        ? "bg-amber-500 text-zinc-950"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Preview Enquiry Form
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewMode("split");
                      setPreviewViewport("desktop");
                    }}
                    className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                      previewMode === "split"
                        ? "bg-white text-zinc-950"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Columns size={13} />
                    <span>Split-Screen Both</span>
                  </button>
                </div>

                {/* Desktop vs Mobile Viewport Toggle */}
                {previewMode !== "split" && (
                  <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPreviewViewport("desktop")}
                      className={`p-1.5 rounded-lg transition-all ${
                        previewViewport === "desktop"
                          ? "bg-white/15 text-white"
                          : "text-zinc-500 hover:text-white"
                      }`}
                      title="Desktop Preview"
                    >
                      <Monitor size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewViewport("mobile")}
                      className={`p-1.5 rounded-lg transition-all ${
                        previewViewport === "mobile"
                          ? "bg-white/15 text-white"
                          : "text-zinc-500 hover:text-white"
                      }`}
                      title="Mobile Responsive Preview"
                    >
                      <Smartphone size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Viewport Stage */}
            <div className="flex-1 overflow-y-auto bg-zinc-950 p-2 sm:p-6 flex justify-center">
              {previewMode === "split" ? (
                <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4 h-full">
                  <div className="rounded-2xl border border-white/15 overflow-y-auto bg-background max-h-[86vh]">
                    <ProductBuilder
                      isPreview={true}
                      onExitPreview={() => setIsPreviewOpen(false)}
                    />
                  </div>
                  <div className="rounded-2xl border border-white/15 overflow-y-auto bg-background max-h-[86vh]">
                    <StudioEnquiryForm
                      studioSettings={draftSettings}
                      isPreview={true}
                      onExitPreview={() => setIsPreviewOpen(false)}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`transition-all duration-300 rounded-2xl border border-white/15 overflow-y-auto max-h-[88vh] shadow-2xl ${
                    previewViewport === "mobile"
                      ? "w-[390px] max-w-full"
                      : "w-full max-w-[1440px]"
                  }`}
                >
                  {previewMode === "studio" ? (
                    <ProductBuilder
                      isPreview={true}
                      onExitPreview={() => setIsPreviewOpen(false)}
                    />
                  ) : (
                    <StudioEnquiryForm
                      studioSettings={draftSettings}
                      isPreview={true}
                      onExitPreview={() => setIsPreviewOpen(false)}
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
