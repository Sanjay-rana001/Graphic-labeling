import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "src", "data", "studio-store.json");

export const DEFAULT_STUDIO_SETTINGS = {
  displayMode: "enquiry", // "studio" | "enquiry"
  customizationStudioOn: false,
  enquiryFormOn: true,
  minQuantity: 1,
  maxFileSizeMB: 10,
  allowedFileTypes: [".png", ".jpg", ".jpeg", ".svg", ".pdf", ".ai", ".cdr", ".eps"],
  thicknessOptions: ["0.3", "0.5", "0.7", "0.91mm", "1.5mm", "2.0mm"],
  holeOptions: ["1mm", "2mm", "3mm", "4mm", "5mm"],
  sideOptions: ["Single Side", "Double Side"],
  colourOptions: ["Single Colour", "Double Colour", "Three Colour", "Four Colour"],
  updatedAt: new Date().toISOString(),
  updatedBy: "admin",
};

export function readStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const initial = { studioSettings: DEFAULT_STUDIO_SETTINGS, enquiries: [] };
      fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      studioSettings: { ...DEFAULT_STUDIO_SETTINGS, ...(parsed.studioSettings || {}) },
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
    };
  } catch (err) {
    console.error("Failed to read studio-store.json:", err);
    return { studioSettings: DEFAULT_STUDIO_SETTINGS, enquiries: [] };
  }
}

export function writeStore(data) {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to write studio-store.json:", err);
    return false;
  }
}

