import { SessionStream } from "@/components/SessionStream";

type Props = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionPage({ params }: Props) {
  const { sessionId } = await params;
  return (
    <main>
      <SessionStream sessionId={sessionId} />
    </main>
  );
}
