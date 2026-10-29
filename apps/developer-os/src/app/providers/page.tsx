import { CockpitShell } from "@/components/CockpitShell";
import { ProviderGrid } from "@/components/ProviderGrid";

export default function ProvidersPage() {
  return (
    <CockpitShell mode="cockpit">
      <ProviderGrid />
    </CockpitShell>
  );
}
