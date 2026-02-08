/**
 * Sentry Detail Page
 *
 * Route: /cneos/sentry/[designation]
 */

import SentryDetailShell from "@/components/cneos/SentryDetailShell";

interface Props {
  params: Promise<{ designation: string }>;
}

export default async function SentryDetailPage({ params }: Props) {
  const { designation } = await params;
  return <SentryDetailShell designation={designation} />;
}
