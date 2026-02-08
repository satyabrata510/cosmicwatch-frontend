/**
 * NEO Detail Page
 *
 * Dynamic route: /neo/[id]
 */

import NeoDetailShell from "@/components/neo/NeoDetailShell";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NeoDetailPage({ params }: Props) {
  const { id } = await params;
  return <NeoDetailShell asteroidId={id} />;
}
