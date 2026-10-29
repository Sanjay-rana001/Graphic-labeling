"use client";

import { useState, useEffect } from "react";
import ProductBuilder from "./ProductBuilder";
import StudioEnquiryForm from "./StudioEnquiryForm";

export default function StudioModeClient({ initialSettings }) {
  const [settings, setSettings] = useState(
    initialSettings || {
      displayMode: "enquiry",
      customizationStudioOn: false,
      enquiryFormOn: true,
      minQuantity: 1,
      maxFileSizeMB: 10,
    }
  );

  useEffect(() => {
    let active = true;

    const syncFromServer = () => {
      fetch("/api/studio-settings", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (active && data?.success && data.settings) {
            setSettings(data.settings);
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
            if (cached && active) {
              const parsed = JSON.parse(cached);
              if (parsed?.displayMode) {
                setSettings((prev) => ({ ...prev, ...parsed }));
              }
            }
          } catch (e) {}
        });
    };

    syncFromServer();

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

    const handleFocus = () => syncFromServer();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (settings.displayMode === "enquiry") {
    return <StudioEnquiryForm studioSettings={settings} isPreview={false} />;
  }

  return <ProductBuilder isPreview={false} />;
}
