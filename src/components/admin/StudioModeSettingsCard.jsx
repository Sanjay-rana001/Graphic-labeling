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
    screenLoaderOn: true,
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
    const loaderVal = nextSettings.screenLoaderOn !== false;
    try {
      localStorage.setItem(
        "sourav_studio_mode_settings",
        JSON.stringify(nextSettings)
      );
      localStorage.setItem("sourav_screen_loader", String(loaderVal));
    } catch (e) {}

    try {
      document.cookie = `sourav_display_mode=${nextSettings.displayMode}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `sourav_screen_loader=${loaderVal}; path=/; max-age=31536000; SameSite=Lax`;
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
  const isLoaderOn = draftSettings.screenLoaderOn !== false;

  // Listen for cross-component updates (e.g. from Admin Top Bar Screen Loader toggle)
  useEffect(() => {
    let channel = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("sourav_studio_mode_channel");
        channel.onmessage = (event) => {
          if (event?.data) {
            setLiveSettings((prev) => ({ ...prev, ...event.data }));
            setDraftSettings((prev) => ({ ...prev, ...event.data }));
          }
        };
      }
    } catch (e) {}
    return () => {
      if (channel) channel.close();
    };
  }, []);

  const handleToggleScreenLoader = async () => {
    setSaveMessage("");
    setSaveError("");
    const nextLoaderOn = !isLoaderOn;
    const nowIso = new Date().toISOString();
    const updatedDraft = {
      ...draftSettings,
      screenLoaderOn: nextLoaderOn,
      updatedAt: nowIso,
      updatedBy: adminEmail,
    };

    setDraftSettings(updatedDraft);
    setLiveSettings(updatedDraft);
    persistEverywhere(updatedDraft);

    setSaveMessage(
      `Screen Loader turned ${nextLoaderOn ? "ON" : "OFF"} across the website & CRM.`
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
    } finally {
      setIsSaving(false);
    }
  };

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
        className={`rounded-xl border p-2.5 sm:p-3 relative overflow-hidden ${
          isDarkMode
            ? "bg-[#0f1118] border-white/10 text-white"
            : "bg-white border-[#c3e2da] text-[#0d1e1b]"
        }`}
      >
        {/* Row 1: Micro-Compact Header + Inline Mode Switcher + Preview Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-2 border-b border-current/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-500 shrink-0">
              <Sliders size={14} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="font-extrabold text-xs">
                  Studio Builder Display Mode
                </h2>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black uppercase border ${
                    isStudioMode
                      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  }`}
                >
                  LIVE: {isStudioMode ? "3D Studio" : "Photo Enquiry Form"}
                </span>
              </div>
              <p className="text-[10px] opacity-60 leading-tight">
                Switch what customers see on <code>/customize</code>
              </p>
            </div>
          </div>

          {/* Right: Inline Quick Mode Toggle + Open / Preview */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => handleToggleMode("studio")}
              className={`px-2 py-1 rounded-md text-[10px] font-extrabold border transition-all flex items-center gap-1 cursor-pointer ${
                isStudioMode
                  ? "bg-emerald-500 text-zinc-950 border-emerald-400"
                  : isDarkMode
                  ? "bg-zinc-800/70 text-zinc-400 border-white/10 hover:text-white"
                  : "bg-zinc-100 text-zinc-600 border-zinc-300 hover:text-zinc-950"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isStudioMode ? "bg-zinc-950" : "bg-zinc-400"
                }`}
              />
              <span>3D Studio: {isStudioMode ? "ON" : "OFF"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleMode("enquiry")}
              className={`px-2 py-1 rounded-md text-[10px] font-extrabold border transition-all flex items-center gap-1 cursor-pointer ${
                !isStudioMode
                  ? "bg-amber-500 text-zinc-950 border-amber-400"
                  : isDarkMode
                  ? "bg-zinc-800/70 text-zinc-400 border-white/10 hover:text-white"
                  : "bg-zinc-100 text-zinc-600 border-zinc-300 hover:text-zinc-950"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  !isStudioMode ? "bg-zinc-950" : "bg-zinc-400"
                }`}
              />
              <span>Enquiry Form: {!isStudioMode ? "ON" : "OFF"}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleScreenLoader}
              className={`px-2 py-1 rounded-md text-[10px] font-extrabold border transition-all flex items-center gap-1 cursor-pointer ${
                isLoaderOn
                  ? "bg-emerald-500 text-zinc-950 border-emerald-400"
                  : isDarkMode
                  ? "bg-zinc-800/70 text-zinc-400 border-white/10 hover:text-white"
                  : "bg-zinc-100 text-zinc-600 border-zinc-300 hover:text-zinc-950"
              }`}
              title="Toggle Screen Loader ON or OFF across Website & Admin"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLoaderOn ? "bg-zinc-950" : "bg-zinc-400"
                }`}
              />
              <span>Screen Loader: {isLoaderOn ? "ON" : "OFF"}</span>
            </button>

            <a
              href="/customize"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-md bg-amber-500 text-zinc-950 font-black text-[10px] flex items-center gap-1 hover:bg-amber-400 transition-all"
            >
              <span>Open /customize</span>
              <ExternalLink size={10} />
            </a>
            <button
              type="button"
              onClick={() => {
                setPreviewMode(draftSettings.displayMode);
                setIsPreviewOpen(true);
              }}
              className={`px-2 py-1 rounded-md border text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-white/5 hover:bg-white/10 border-white/15"
                  : "bg-zinc-100 hover:bg-zinc-200 border-zinc-300"
              }`}
            >
              <Eye size={11} className="text-amber-500" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Status Messages (Compact) */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-bold flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="shrink-0" />
                <span>{saveMessage}</span>
              </div>
              <a
                href="/customize"
                target="_blank"
                rel="noopener noreferrer"
                className="px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-black text-[9.5px] flex items-center gap-1 shrink-0"
              >
                <span>Verify</span>
                <ExternalLink size={9} />
              </a>
            </motion.div>
          )}

          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-500 text-[10px] font-bold flex items-center gap-1.5"
            >
              <AlertCircle size={12} className="shrink-0" />
              <span>{saveError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 2: Micro-Compact 3-Column Grid (Mode A + Mode B + Limits & Save) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2 items-center">
          {/* Mode A: Customization Studio (4 Cols) */}
          <div
            onClick={() => handleToggleMode("studio")}
            className={`lg:col-span-4 cursor-pointer rounded-lg p-2 border transition-all flex items-center justify-between gap-2 ${
              isStudioMode
                ? "border-emerald-500 bg-emerald-500/[0.08]"
                : isDarkMode
                ? "border-white/10 bg-white/[0.02] opacity-75 hover:opacity-100"
                : "border-zinc-200 bg-zinc-50/70 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Mode A
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase ${
                    isStudioMode
                      ? "bg-emerald-500 text-zinc-950"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {isStudioMode ? "ON" : "OFF"}
                </span>
              </div>
              <h3 className="font-extrabold text-[11px] truncate">
                3D Customization Studio
              </h3>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewMode("studio");
                setIsPreviewOpen(true);
              }}
              className="text-[10px] font-bold underline opacity-80 hover:opacity-100 shrink-0"
            >
              Preview →
            </button>
          </div>

          {/* Mode B: Enquiry Form (4 Cols) */}
          <div
            onClick={() => handleToggleMode("enquiry")}
            className={`lg:col-span-4 cursor-pointer rounded-lg p-2 border transition-all flex items-center justify-between gap-2 ${
              !isStudioMode
                ? "border-amber-500 bg-amber-500/[0.08]"
                : isDarkMode
                ? "border-white/10 bg-white/[0.02] opacity-75 hover:opacity-100"
                : "border-zinc-200 bg-zinc-50/70 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                  Mode B
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase ${
                    !isStudioMode
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {!isStudioMode ? "ON" : "OFF"}
                </span>
              </div>
              <h3 className="font-extrabold text-[11px] truncate">
                Photo Upload & Enquiry Form
              </h3>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewMode("enquiry");
                setIsPreviewOpen(true);
              }}
              className="text-[10px] font-bold underline opacity-80 hover:opacity-100 shrink-0"
            >
              Preview →
            </button>
          </div>

          {/* Col 3: Inline Form Limits + Save Button (4 Cols) */}
          <div
            className={`lg:col-span-4 rounded-lg p-1.5 border flex items-center gap-1.5 ${
              isDarkMode
                ? "border-white/10 bg-white/[0.02]"
                : "border-zinc-200 bg-zinc-50/70"
            }`}
          >
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="text-[9px] opacity-65 font-bold uppercase shrink-0">
                Min Qty:
              </span>
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
                className={`w-12 border rounded px-1.5 py-1 text-[10.5px] font-mono text-center focus:outline-none focus:border-amber-500 ${
                  isDarkMode
                    ? "bg-zinc-900 border-white/10 text-white"
                    : "bg-white border-zinc-300 text-zinc-900"
                }`}
              />
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="text-[9px] opacity-65 font-bold uppercase shrink-0">
                Max MB:
              </span>
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
                className={`w-12 border rounded px-1.5 py-1 text-[10.5px] font-mono text-center focus:outline-none focus:border-amber-500 ${
                  isDarkMode
                    ? "bg-zinc-900 border-white/10 text-white"
                    : "bg-white border-zinc-300 text-zinc-900"
                }`}
              />
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveSettings}
              className="py-1 px-2.5 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[10px] uppercase tracking-wide transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Save size={11} />
              <span>{isSaving ? "..." : "Save"}</span>
            </button>
          </div>
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
