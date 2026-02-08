/**
 * Risk Detail Page
 *
 * Displays comprehensive impact risk analysis and technical
 * details for a specific Near-Earth Object.
 */

import RiskDetailShell from "@/components/risk/RiskDetailShell";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RiskDetailPage({ params }: Props) {
  const { id } = await params;
  return <RiskDetailShell asteroidId={id} />;
}
