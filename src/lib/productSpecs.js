// Product-specific engineering specifications mapping
// Provides realistic thickness, mounting, side, and color options based on manufacturing processes.

export const PRODUCT_SPEC_MAP = {
  // ── 1. Polycarbonate Stickers & Graphic Overlays ──
  polycarbonate: {
    labels: {
      thickness: "Material Gauge",
      holes: "Backing / Adhesive",
      side: "Printing Process",
      colour: "Finish / Colour",
    },
    thicknessOptions: [
      "125 Micron",
      "175 Micron",
      "250 Micron",
      "375 Micron",
      "0.5 mm Rigid PC",
    ],
    holesOptions: [
      "3M 467MP High-Tack",
      "3M 468MP Heavy Duty",
      "Standard Acrylic Gum",
      "Peel & Stick Transfer Tape",
      "Non-Adhesive Graphic Overlay",
    ],
    sideOptions: ["Reverse Sub-Surface Print", "Digital Surface Print"],
    colourOptions: [
      { label: "Single Colour Screen", dots: ["#f59e0b"] },
      { label: "Double Colour Screen", dots: ["#f59e0b", "#3b82f6"] },
      { label: "Multi-Colour Full Gloss", dots: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"] },
      { label: "Matte Velvet Texture", dots: ["#71717a", "#e4e4e7"] },
    ],
    defaultSpecs: {
      thickness: "250 Micron",
      holes: "3M 467MP High-Tack",
      side: "Reverse Sub-Surface Print",
      colour: "Double Colour Screen",
    },
  },

  // ── 2. Acrylic Sign Boards & Architectural Signs ──
  acrylic: {
    labels: {
      thickness: "Acrylic Sheet Gauge",
      holes: "Mounting Style",
      side: "Printing Face",
      colour: "Effect / Illumination",
    },
    thicknessOptions: [
      "2.0 mm",
      "3.0 mm",
      "4.0 mm",
      "5.0 mm",
      "6.0 mm",
      "8.0 mm",
    ],
    holesOptions: [
      "SS Standoff Studs (4 Corner)",
      "2 Corner Screw Holes",
      "4 Corner Screw Holes",
      "Keyhole Wall Mount",
      "3M VHB Heavy Tape (No Holes)",
    ],
    sideOptions: ["Front UV Printed", "Reverse Clear Acrylic Print"],
    colourOptions: [
      { label: "Direct Multi-Colour UV", dots: ["#f59e0b", "#3b82f6", "#10b981"] },
      { label: "Frosted / Laser Etched", dots: ["#e4e4e7", "#a1a1aa"] },
      { label: "Warm White LED Backlit", dots: ["#fbbf24", "#fef3c7"] },
      { label: "Cool White LED Backlit", dots: ["#38bdf8", "#e0f2fe"] },
    ],
    defaultSpecs: {
      thickness: "3.0 mm",
      holes: "SS Standoff Studs (4 Corner)",
      side: "Reverse Clear Acrylic Print",
      colour: "Direct Multi-Colour UV",
    },
  },

  // ── 3. Stainless Steel (SS 304/316) & Brass Plates ──
  ss_brass: {
    labels: {
      thickness: "Metal Plate Gauge",
      holes: "Mounting / Punch Holes",
      side: "Plate Finish / Side",
      colour: "Infill / Etching Process",
    },
    thicknessOptions: [
      "0.5 mm",
      "0.8 mm",
      "1.0 mm",
      "1.5 mm",
      "2.0 mm",
      "3.0 mm",
    ],
    holesOptions: [
      "2 mm Corner Holes",
      "3 mm Corner Holes",
      "4 mm Corner Holes",
      "Standoff Bolt Holes",
      "3M 468MP High-Bond (No Holes)",
    ],
    sideOptions: ["Single Side Etched", "Double Side Etched"],
    colourOptions: [
      { label: "Single Colour Infill", dots: ["#18181b"] },
      { label: "Double Colour Infill", dots: ["#ef4444", "#18181b"] },
      { label: "Multi-Colour Enamel", dots: ["#ef4444", "#f59e0b", "#18181b"] },
      { label: "Fiber Laser Mark (No Paint)", dots: ["#52525b", "#71717a"] },
    ],
    defaultSpecs: {
      thickness: "1.0 mm",
      holes: "3 mm Corner Holes",
      side: "Single Side Etched",
      colour: "Double Colour Infill",
    },
  },

  // ── 4. QR, Barcode & Inspection Asset Tags ──
  asset_tags: {
    labels: {
      thickness: "Tag Gauge",
      holes: "Attachment / Slot",
      side: "Laser Marking Face",
      colour: "Contrast / Coating",
    },
    thicknessOptions: [
      "0.3 mm (Foil/Curved)",
      "0.5 mm Standard",
      "0.7 mm Heavy Duty",
      "1.0 mm Rigid Asset",
    ],
    holesOptions: [
      "2 mm Corner Rivet Holes",
      "3 mm Corner Rivet Holes",
      "Single Top Hanging Hole",
      "Cable-Tie Slotted Holes",
      "3M 468MP Heavy Adhesive (No Holes)",
    ],
    sideOptions: ["Single Side Marked", "Double Side Marked"],
    colourOptions: [
      { label: "High-Contrast White Laser", dots: ["#fafafa", "#18181b"] },
      { label: "Black Anodized Background", dots: ["#09090b", "#e4e4e7"] },
      { label: "Silver Satin Matte", dots: ["#d4d4d8", "#71717a"] },
      { label: "Two-Tone QR Matrix", dots: ["#f59e0b", "#18181b"] },
    ],
    defaultSpecs: {
      thickness: "0.5 mm Standard",
      holes: "2 mm Corner Rivet Holes",
      side: "Single Side Marked",
      colour: "High-Contrast White Laser",
    },
  },

  // ── 5. Standard Aluminium Nameplates (Default) ──
  aluminium: {
    labels: {
      thickness: "Aluminium Gauge",
      holes: "Corner Holes",
      side: "Printing Side",
      colour: "Colour Option",
    },
    thicknessOptions: [
      "0.3 mm",
      "0.5 mm",
      "0.7 mm",
      "0.91 mm",
      "1.5 mm",
      "2.0 mm",
    ],
    holesOptions: [
      "1 mm",
      "2 mm",
      "3 mm",
      "4 mm",
      "5 mm",
      "No Holes (3M Adhesive)",
    ],
    sideOptions: ["Single Side", "Double Side"],
    colourOptions: [
      { label: "Single Colour", dots: ["#f59e0b"] },
      { label: "Double Colour", dots: ["#f59e0b", "#3b82f6"] },
      { label: "Three Colour", dots: ["#f59e0b", "#3b82f6", "#10b981"] },
      { label: "Four Colour", dots: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"] },
    ],
    defaultSpecs: {
      thickness: "0.7 mm",
      holes: "2 mm",
      side: "Single Side",
      colour: "Single Colour",
    },
  },
};

export function getProductSpecCategory(productName = "") {
  const norm = String(productName).toLowerCase().trim();

  if (norm.includes("polycarbonate") || norm.includes("sticker")) {
    return "polycarbonate";
  }
  if (norm.includes("acrylic")) {
    return "acrylic";
  }
  if (
    norm.includes("ss 304") ||
    norm.includes("ss 316") ||
    norm.includes("stainless") ||
    norm.includes("brass") ||
    norm.includes("door plate") ||
    norm.includes("cabin")
  ) {
    return "ss_brass";
  }
  if (
    norm.includes("qr") ||
    norm.includes("barcode") ||
    norm.includes("black anodized") ||
    norm.includes("punch tag") ||
    norm.includes("inspection")
  ) {
    return "asset_tags";
  }

  return "aluminium";
}

export function getProductSpecs(productName = "") {
  const catKey = getProductSpecCategory(productName);
  return PRODUCT_SPEC_MAP[catKey] || PRODUCT_SPEC_MAP.aluminium;
}
