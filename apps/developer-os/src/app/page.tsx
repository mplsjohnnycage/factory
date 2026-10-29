import { CockpitHome } from "@/components/CockpitHome";
import { CockpitShell } from "@/components/CockpitShell";

export default function HomePage() {
  return (
    <CockpitShell mode="cockpit">
      <CockpitHome />
    </CockpitShell>
  );
}
