import { AtlasLake } from "@/components/AtlasLake";
import { CockpitShell } from "@/components/CockpitShell";

export default function AtlasPage() {
  return (
    <CockpitShell mode="atlas">
      <AtlasLake />
    </CockpitShell>
  );
}
