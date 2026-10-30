import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readStore, writeStore, DEFAULT_STUDIO_SETTINGS } from "@/lib/serverStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = readStore();
  let settings = store.studioSettings || DEFAULT_STUDIO_SETTINGS;

  try {
    const cookieStore = await cookies();
    const cookieMode = cookieStore.get("sourav_display_mode")?.value;
    const cookieLoader = cookieStore.get("sourav_screen_loader")?.value;
    const cookieUpdatedAt = cookieStore.get("sourav_mode_updated_at")?.value;

    if (cookieMode === "studio" || cookieMode === "enquiry") {
      const cookieTs = cookieUpdatedAt ? Date.parse(cookieUpdatedAt) : 0;
      const storeTs = settings.updatedAt ? Date.parse(settings.updatedAt) : 0;

      if (cookieTs >= storeTs) {
        settings = {
          ...settings,
          displayMode: cookieMode,
          customizationStudioOn: cookieMode === "studio",
          enquiryFormOn: cookieMode === "enquiry",
          screenLoaderOn:
            cookieLoader === "false"
              ? false
              : cookieLoader === "true"
              ? true
              : settings.screenLoaderOn !== false,
          updatedAt: cookieUpdatedAt || settings.updatedAt,
        };
      }
    } else if (cookieLoader === "false" || cookieLoader === "true") {
      settings = {
        ...settings,
        screenLoaderOn: cookieLoader === "true",
      };
    }
  } catch (e) {}

  return NextResponse.json(
    { success: true, settings },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function POST(request) {
  try {
    const isAdmin = request.headers.get("x-admin-auth") === "true";
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized: Only authenticated administrators can modify display mode settings.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const store = readStore();
    const displayMode =
      body.displayMode === "studio" || body.displayMode === "enquiry"
        ? body.displayMode
        : store.studioSettings?.displayMode || "enquiry";
    const screenLoaderOn =
      typeof body.screenLoaderOn === "boolean"
        ? body.screenLoaderOn
        : store.studioSettings?.screenLoaderOn !== false;
    const minQuantity = Math.max(1, parseInt(body.minQuantity, 10) || 1);
    const maxFileSizeMB = Math.min(
      50,
      Math.max(1, parseInt(body.maxFileSizeMB, 10) || 10)
    );
    const updatedAt = body.updatedAt || new Date().toISOString();

    const updatedSettings = {
      ...store.studioSettings,
      displayMode,
      customizationStudioOn: displayMode === "studio",
      enquiryFormOn: displayMode === "enquiry",
      screenLoaderOn,
      minQuantity,
      maxFileSizeMB,
      factoryInfo: body.factoryInfo
        ? {
            ...(store.studioSettings?.factoryInfo || DEFAULT_STUDIO_SETTINGS.factoryInfo),
            ...body.factoryInfo,
          }
        : store.studioSettings?.factoryInfo || DEFAULT_STUDIO_SETTINGS.factoryInfo,
      updatedAt,
      updatedBy: String(body.updatedBy || "admin").slice(0, 100),
    };

    store.studioSettings = updatedSettings;
    writeStore(store);

    const response = NextResponse.json({
      success: true,
      message: `Settings saved — Mode: ${
        displayMode === "studio" ? "3D Studio (ON)" : "Enquiry Form (ON)"
      } • Screen Loader: ${screenLoaderOn ? "ON" : "OFF"}`,
      settings: updatedSettings,
    });

    response.cookies.set("sourav_display_mode", displayMode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    response.cookies.set("sourav_screen_loader", String(screenLoaderOn), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    response.cookies.set("sourav_mode_updated_at", updatedAt, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("POST /api/studio-settings error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
