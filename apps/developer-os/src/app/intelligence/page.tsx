import { CockpitShell } from "@/components/CockpitShell";
import { IntelligenceGraph } from "@/components/IntelligenceGraph";

export default function IntelligencePage() {
  return (
    <CockpitShell mode="atlas">
      <IntelligenceGraph />
    </CockpitShell>
  );
}
