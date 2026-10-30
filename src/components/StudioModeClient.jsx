"use client";

import { useState, useEffect } from "react";
import ProductBuilder from "./ProductBuilder";
import StudioEnquiryForm from "./StudioEnquiryForm";
import PremiumLoader, { isScreenLoaderEnabled } from "./PremiumLoader";
import MetalScrollToTop from "./MetalScrollToTop";

function getTs(obj) {
  const raw = obj?.updatedAt;
  const parsed = raw ? Date.parse(raw) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function StudioModeClient({ initialSettings }) {
  const [settings, setSettings] = useState(
    initialSettings || {
      displayMode: "enquiry",
      customizationStudioOn: false,
      enquiryFormOn: true,
      screenLoaderOn: true,
      minQuantity: 1,
      maxFileSizeMB: 10,
      updatedAt: "2026-10-29T12:00:00.000Z",
    }
  );
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    if (initialSettings?.screenLoaderOn === false) return false;
    return true;
  });

  useEffect(() => {
    try {
      if (!isScreenLoaderEnabled()) {
        setShowInitialLoader(false);
      } else {
        const t = setTimeout(() => setShowInitialLoader(false), 500);
        return () => clearTimeout(t);
      }
    } catch (e) {
      setShowInitialLoader(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const applyNewestSettings = (incoming) => {
      if (!incoming || !incoming.displayMode) return;
      if (incoming.screenLoaderOn === false) {
        setShowInitialLoader(false);
      }
      setSettings((prev) => {
        if (getTs(incoming) >= getTs(prev)) {
          try {
            localStorage.setItem(
              "sourav_studio_mode_settings",
              JSON.stringify(incoming)
            );
            if (typeof incoming.screenLoaderOn === "boolean") {
              localStorage.setItem(
                "sourav_screen_loader",
                String(incoming.screenLoaderOn)
              );
            }
          } catch (e) {}
          return { ...prev, ...incoming };
        }
        return prev;
      });
    };

    try {
      const cached = localStorage.getItem("sourav_studio_mode_settings");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.displayMode) {
          applyNewestSettings(parsed);
        }
      }
    } catch (e) {}

    // 2. Sync from server API (only applies if server timestamp >= local timestamp)
    const syncFromServer = () => {
      fetch("/api/studio-settings", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (active && data?.success && data.settings) {
            applyNewestSettings(data.settings);
          }
        })
        .catch(() => {});
    };

    syncFromServer();

    // 3. Cross-tab instant sync via BroadcastChannel + storage event
    let channel = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("sourav_studio_mode_channel");
        channel.onmessage = (event) => {
          if (event?.data?.displayMode) {
            setSettings((prev) => ({ ...prev, ...event.data }));
          }
        };
      }
    } catch (e) {}

    const handleStorage = (e) => {
      if (e.key === "sourav_studio_mode_settings" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.displayMode) {
            setSettings((prev) => ({ ...prev, ...parsed }));
          }
        } catch (err) {}
      }
    };

    const handleFocus = () => {
      try {
        const cached = localStorage.getItem("sourav_studio_mode_settings");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.displayMode) {
            setSettings((prev) => ({ ...prev, ...parsed }));
            return;
          }
        }
      } catch (e) {}
      syncFromServer();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (showInitialLoader && settings.screenLoaderOn !== false) {
    return <PremiumLoader label="Loading B2B Specification Desk..." />;
  }

  if (settings.displayMode === "enquiry") {
    return <StudioEnquiryForm studioSettings={settings} isPreview={false} />;
  }

  return <ProductBuilder isPreview={false} />;
}
