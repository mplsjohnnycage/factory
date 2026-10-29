import { CockpitShell } from "@/components/CockpitShell";
import { SessionStream } from "@/components/SessionStream";

type Props = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionPage({ params }: Props) {
  const { sessionId } = await params;
  return (
    <CockpitShell mode="cockpit">
      <SessionStream sessionId={sessionId} />
    </CockpitShell>
  );
}
