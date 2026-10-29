import { cookies } from "next/headers";
import StudioModeClient from "../../components/StudioModeClient";
import { readStore } from "@/lib/serverStore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Studio Builder & Product Enquiry | Sourav Graphic",
  description:
    "Customize your metal & LED name plates in 3D or submit an industrial product specification enquiry.",
};

export default async function CustomizePage() {
  const store = readStore();
  let initialSettings = store.studioSettings;

  try {
    const cookieStore = await cookies();
    const cookieMode = cookieStore.get("sourav_display_mode")?.value;
    const cookieUpdatedAt = cookieStore.get("sourav_mode_updated_at")?.value;

    if (cookieMode === "studio" || cookieMode === "enquiry") {
      const cookieTs = cookieUpdatedAt ? Date.parse(cookieUpdatedAt) : 0;
      const storeTs = initialSettings?.updatedAt
        ? Date.parse(initialSettings.updatedAt)
        : 0;

      if (cookieTs >= storeTs) {
        initialSettings = {
          ...initialSettings,
          displayMode: cookieMode,
          customizationStudioOn: cookieMode === "studio",
          enquiryFormOn: cookieMode === "enquiry",
          updatedAt: cookieUpdatedAt || initialSettings.updatedAt,
        };
      }
    }
  } catch (e) {}

  return (
    <main>
      <StudioModeClient initialSettings={initialSettings} />
    </main>
  );
}
