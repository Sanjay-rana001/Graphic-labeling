import StudioModeClient from "../../components/StudioModeClient";
import { readStore } from "@/lib/serverStore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Studio Builder & Product Enquiry | Sourav Graphic",
  description:
    "Customize your metal & LED name plates in 3D or submit an industrial product specification enquiry.",
};

export default function CustomizePage() {
  const store = readStore();
  return (
    <main>
      <StudioModeClient initialSettings={store.studioSettings} />
    </main>
  );
}
