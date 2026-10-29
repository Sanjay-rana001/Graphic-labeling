"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  FileText,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Smartphone,
  Columns,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from "lucide-react";
import ProductBuilder from "../ProductBuilder";
import StudioEnquiryForm from "../StudioEnquiryForm";

export default function StudioModeSettingsCard({
  isDarkMode = true,
  adminEmail = "admin",
}) {
  const [liveSettings, setLiveSettings] = useState({
    displayMode: "studio",
    customizationStudioOn: true,
    enquiryFormOn: false,
    minQuantity: 1,
    maxFileSizeMB: 10,
    thicknessOptions: ["0.3 mm", "0.5 mm", "0.7 mm", "0.91 mm", "1.5 mm", "2.0 mm"],
    holeOptions: ["1 mm", "2 mm", "3 mm", "4 mm", "5 mm"],
    sideOptions: ["Single Side", "Double Side"],
    colourOptions: ["Single Colour", "Double Colour", "Three Colour", "Four Colour"],
  });

  // Draft state (modified by admin before saving; used in preview without affecting live customer page)
  const [draftSettings, setDraftSettings] = useState(liveSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // Live Preview Modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState("studio"); // 'studio' | 'enquiry' | 'split'
  const [previewViewport, setPreviewViewport] = useState("desktop"); // 'desktop' | 'mobile'

  // Load saved setting on mount
  useEffect(() => {
    fetch("/api/studio-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.settings) {
          setLiveSettings(data.settings);
          setDraftSettings(data.settings);
          setPreviewMode(data.settings.displayMode || "studio");
          try {
            localStorage.setItem(
              "sourav_studio_mode_settings",
              JSON.stringify(data.settings)
            );
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const cached = localStorage.getItem("sourav_studio_mode_settings");
          if (cached) {
            const parsed = JSON.parse(cached);
            setLiveSettings(parsed);
            setDraftSettings(parsed);
            setPreviewMode(parsed.displayMode || "studio");
          }
        } catch (e) {}
      });
  }, []);

  const isStudioMode = draftSettings.displayMode === "studio";
  const hasUnsavedChanges =
    draftSettings.displayMode !== liveSettings.displayMode ||
    Number(draftSettings.minQuantity) !== Number(liveSettings.minQuantity) ||
    Number(draftSettings.maxFileSizeMB) !== Number(liveSettings.maxFileSizeMB);

  const handleToggleMode = async (nextMode) => {
    setSaveMessage("");
    setSaveError("");
    const updatedDraft = {
      ...draftSettings,
      displayMode: nextMode,
      customizationStudioOn: nextMode === "studio",
      enquiryFormOn: nextMode === "enquiry",
    };
    setDraftSettings(updatedDraft);
    setLiveSettings(updatedDraft);
    setPreviewMode(nextMode);

    try {
      localStorage.setItem(
        "sourav_studio_mode_settings",
        JSON.stringify(updatedDraft)
      );
    } catch (e) {}

    setIsSaving(true);
    try {
      const res = await fetch("/api/studio-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "true",
        },
        body: JSON.stringify({
          ...updatedDraft,
          updatedBy: adminEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLiveSettings(data.settings);
        setDraftSettings(data.settings);
        try {
          localStorage.setItem(
            "sourav_studio_mode_settings",
            JSON.stringify(data.settings)
          );
        } catch (e) {}
        setSaveMessage(
          `Active Mode Switched: Live customer page (/customize) is now showing ${
            nextMode === "studio"
              ? "Customization Studio (ON)"
              : "Direct Photo Upload & Enquiry Form (ON)"
          }.`
        );
      }
    } catch (err) {
      setSaveError("Could not sync mode to server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setSaveError("");

    try {
      const res = await fetch("/api/studio-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "true",
        },
        body: JSON.stringify({
          ...draftSettings,
          updatedBy: adminEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save Studio Display Mode.");
      }

      setLiveSettings(data.settings);
      setDraftSettings(data.settings);
      try {
        localStorage.setItem(
          "sourav_studio_mode_settings",
          JSON.stringify(data.settings)
        );
      } catch (e) {}

      setSaveMessage(
        data.message ||
          `Saved successfully! Live customer page is now set to ${
            data.settings.displayMode === "studio"
              ? "Customization Studio (ON)"
              : "Enquiry Form (ON)"
          }.`
      );
    } catch (err) {
      setSaveError(err.message || "Error saving setting.");
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
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    liveSettings.displayMode === "studio"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : "bg-red-500/10 text-red-400 border-red-500/25"
                  }`}
                >
                  Live Now:{" "}
                  {liveSettings.displayMode === "studio"
                    ? "Customization Studio"
                    : "Enquiry Form"}
                </span>
              </div>
              <p className="text-xs opacity-65 mt-1">
                Switch the customer-facing <code>/customize</code> Studio Builder page between the interactive 3D Customization Studio and the B2B Industrial Enquiry Form.
              </p>
            </div>
          </div>

          {/* Preview Customer Page Button */}
          <button
            type="button"
            onClick={() => {
              setPreviewMode(draftSettings.displayMode);
              setIsPreviewOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all"
          >
            <Eye size={15} className="text-amber-400" />
            <span>Preview Customer Page</span>
          </button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{saveMessage}</span>
              </div>
              <a
                href="/customize"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-lg bg-emerald-500 text-zinc-950 font-black text-[11px] flex items-center gap-1 shrink-0 hover:bg-emerald-400"
              >
                <span>Open Live Page</span>
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

        {/* Master Toggle Switch Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`px-3 py-1.5 rounded-xl font-extrabold border transition-all ${
                isStudioMode
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-zinc-800/60 text-zinc-400 border-white/10"
              }`}
            >
              Customization Studio: {isStudioMode ? "ON" : "OFF"}
            </span>
            <span
              className={`px-3 py-1.5 rounded-xl font-extrabold border transition-all ${
                !isStudioMode
                  ? "bg-red-500/15 text-red-400 border-red-500/30"
                  : "bg-zinc-800/60 text-zinc-400 border-white/10"
              }`}
            >
              Enquiry Form: {!isStudioMode ? "ON" : "OFF"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleToggleMode(isStudioMode ? "enquiry" : "studio")}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-extrabold transition-all"
          >
            {isStudioMode ? (
              <>
                <ToggleRight size={20} className="text-emerald-400" />
                <span>Switch to Enquiry Form</span>
              </>
            ) : (
              <>
                <ToggleLeft size={20} className="text-red-400" />
                <span>Switch to Customization Studio</span>
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
                ? "border-amber-500 bg-amber-500/[0.06] shadow-lg shadow-amber-500/5"
                : "border-white/10 bg-white/[0.02] opacity-75 hover:opacity-100"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Mode A
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
                Shows the existing Studio Builder customization interface with live 1:1 metal textures, font layers, custom logo upload, and digital proof export.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">
                {isStudioMode ? "✓ Selected Mode" : "Click to Select Mode A"}
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
                ? "border-red-500 bg-red-500/[0.06] shadow-lg shadow-red-500/5"
                : "border-white/10 bg-white/[0.02] opacity-75 hover:opacity-100"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                  Mode B
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    !isStudioMode
                      ? "bg-red-500 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Enquiry Form — {!isStudioMode ? "ON" : "OFF"}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Professional B2B Product Enquiry Form
              </h3>
              <p className="text-xs opacity-65 mt-1.5 leading-relaxed">
                Hides the customization canvas and displays the B2B industrial enquiry form with drag-and-drop artwork upload, thickness/hole/colour selectors, and address capture.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-bold text-red-400">
                {!isStudioMode ? "✓ Selected Mode" : "Click to Select Mode B"}
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
          <div className="text-xs">
            {hasUnsavedChanges ? (
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles size={14} /> You have unsaved display mode changes. Click Save to apply to the live website.
              </span>
            ) : (
              <span className="opacity-60">
                Live customer page is synchronized with your saved setting.
              </span>
            )}
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
                  <span className="text-zinc-400">
                    (Submissions disabled • Live mode unchanged until saved)
                  </span>
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
                        ? "bg-amber-500 text-zinc-950"
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
                        ? "bg-red-600 text-white"
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
                  <div className="rounded-2xl border border-white/15 overflow-y-auto bg-[#f8fafc] max-h-[86vh]">
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

