import fs from "fs";
import os from "os";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "src", "data", "studio-store.json");
const TMP_STORE_PATH = path.join(os.tmpdir(), "sourav-studio-store.json");

export const DEFAULT_STUDIO_SETTINGS = {
  displayMode: "enquiry", // "studio" | "enquiry"
  customizationStudioOn: false,
  enquiryFormOn: true,
  screenLoaderOn: true,
  minQuantity: 1,
  maxFileSizeMB: 10,
  allowedFileTypes: [".png", ".jpg", ".jpeg", ".svg", ".pdf", ".ai", ".cdr", ".eps"],
  thicknessOptions: ["0.3 mm", "0.5 mm", "0.7 mm", "0.91 mm", "1.5 mm", "2.0 mm"],
  holeOptions: ["1 mm", "2 mm", "3 mm", "4 mm", "5 mm", "No Holes"],
  sideOptions: ["Single Side", "Double Side"],
  colourOptions: ["Single Colour", "Double Colour", "Three Colour", "Four Colour"],
  factoryInfo: {
    businessName: "Sourav Graphic & Metal Label",
    whatsapp: "9876543210",
    email: "sales@souravgraphic.in",
    address: "Industrial Area, New Delhi, India",
    gstin: "07AABCS1429B1Z1",
    tagline: "B2B Industrial Nameplate & Metal Label Manufacturer",
  },
  updatedAt: "2026-10-29T12:00:00.000Z",
  updatedBy: "admin",
};

function safeReadJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {}
  return null;
}

function getTimestamp(storeObj) {
  const ts = storeObj?.studioSettings?.updatedAt;
  const parsed = ts ? Date.parse(ts) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function readStore() {
  const candidates = [];

  if (globalThis.__SOURAV_STUDIO_STORE__) {
    candidates.push(globalThis.__SOURAV_STUDIO_STORE__);
  }

  const tmpData = safeReadJson(TMP_STORE_PATH);
  if (tmpData) candidates.push(tmpData);

  const fileData = safeReadJson(STORE_PATH);
  if (fileData) candidates.push(fileData);

  if (candidates.length === 0) {
    const initial = { studioSettings: DEFAULT_STUDIO_SETTINGS, enquiries: [] };
    globalThis.__SOURAV_STUDIO_STORE__ = initial;
    return initial;
  }

  // Pick the candidate with the most recent studioSettings.updatedAt
  candidates.sort((a, b) => getTimestamp(b) - getTimestamp(a));
  const newest = candidates[0];

  // Merge enquiries across all candidates by unique id
  const enquiryMap = new Map();
  for (const c of candidates) {
    if (Array.isArray(c?.enquiries)) {
      for (const eq of c.enquiries) {
        if (eq?.id && !enquiryMap.has(eq.id)) {
          enquiryMap.set(eq.id, eq);
        }
      }
    }
  }

  const result = {
    studioSettings: {
      ...DEFAULT_STUDIO_SETTINGS,
      ...(newest.studioSettings || {}),
    },
    enquiries: Array.from(enquiryMap.values()),
  };

  globalThis.__SOURAV_STUDIO_STORE__ = result;
  return result;
}

export function writeStore(data) {
  globalThis.__SOURAV_STUDIO_STORE__ = data;
  let wroteAny = true;

  try {
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {}

  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Expected on read-only serverless filesystems (e.g. Vercel /var/task);
    // globalThis and TMP_STORE_PATH still succeed.
  }

  return wroteAny;
}
