import { AtlasHero } from "@/components/AtlasHero";
import { CockpitShell } from "@/components/CockpitShell";

export default function AtlasPage() {
  return (
    <CockpitShell mode="atlas">
      <AtlasHero />
    </CockpitShell>
  );
}
