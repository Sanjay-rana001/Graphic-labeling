import { NextResponse } from "next/server";
import { readStore, writeStore, DEFAULT_STUDIO_SETTINGS } from "@/lib/serverStore";

export async function GET() {
  const store = readStore();
  return NextResponse.json(
    { success: true, settings: store.studioSettings || DEFAULT_STUDIO_SETTINGS },
    { status: 200 }
  );
}

export async function POST(request) {
  try {
    const isAdmin = request.headers.get("x-admin-auth") === "true";
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Only authenticated administrators can modify display mode settings." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const displayMode = body.displayMode === "enquiry" ? "enquiry" : "studio";
    const minQuantity = Math.max(1, parseInt(body.minQuantity, 10) || 1);
    const maxFileSizeMB = Math.min(50, Math.max(1, parseInt(body.maxFileSizeMB, 10) || 10));

    const store = readStore();
    const updatedSettings = {
      ...store.studioSettings,
      displayMode,
      customizationStudioOn: displayMode === "studio",
      enquiryFormOn: displayMode === "enquiry",
      minQuantity,
      maxFileSizeMB,
      thicknessOptions: Array.isArray(body.thicknessOptions) && body.thicknessOptions.length > 0
        ? body.thicknessOptions.map((s) => String(s).trim()).filter(Boolean)
        : store.studioSettings.thicknessOptions,
      holeOptions: Array.isArray(body.holeOptions) && body.holeOptions.length > 0
        ? body.holeOptions.map((s) => String(s).trim()).filter(Boolean)
        : store.studioSettings.holeOptions,
      sideOptions: Array.isArray(body.sideOptions) && body.sideOptions.length > 0
        ? body.sideOptions.map((s) => String(s).trim()).filter(Boolean)
        : store.studioSettings.sideOptions,
      colourOptions: Array.isArray(body.colourOptions) && body.colourOptions.length > 0
        ? body.colourOptions.map((s) => String(s).trim()).filter(Boolean)
        : store.studioSettings.colourOptions,
      updatedAt: new Date().toISOString(),
      updatedBy: String(body.updatedBy || "admin").slice(0, 100),
    };

    store.studioSettings = updatedSettings;
    const saved = writeStore(store);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to persist studio display settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Studio Builder Display Mode saved: ${
        displayMode === "studio" ? "Customization Studio (ON)" : "Enquiry Form (ON)"
      }`,
      settings: updatedSettings,
    });
  } catch (err) {
    console.error("POST /api/studio-settings error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}

