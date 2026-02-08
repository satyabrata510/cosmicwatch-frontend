/**
 * Signup Page
 *
 * Facilitates new user registration with a themed authentication
 * card and informative feature panels.
 */

import AuthCard from "@/components/auth/AuthCard";
import AuthInfoPanel from "@/components/auth/AuthInfoPanel";
import SignupForm from "@/components/auth/SignupForm";

const leftSections = [
  {
    heading: "Join the Fleet",
    body: "Become part of a global network of astronomers, researchers, and space enthusiasts tracking objects that cross Earth\u2019s orbit.",
  },
  {
    heading: "Objects Tracked",
    body: "34,000+ catalogued NEOs and counting. New discoveries are added within hours of confirmation.",
  },
  {
    heading: "Your Dashboard",
    body: "Watchlists \u00B7 Custom Alerts \u00B7 Risk Scores \u00B7 Live Feeds \u00B7 APOD Gallery",
  },
];

const rightSections = [
  {
    heading: "Researcher Access",
    body: "Researchers get extended API limits, Sentry data exports, and collaboration tools for peer review.",
  },
  {
    heading: "Real-time Alerts",
    body: "WebSocket-powered notifications for close approaches, solar flares, and geomagnetic storms.",
  },
  {
    heading: "Open Data",
    body: "All orbital data sourced from NASA JPL \u00B7 ESA NEO Coordination Centre \u00B7 MPC",
  },
];

export default function SignupPage() {
  return (
    <AuthCard
      title="COSMIC WATCH"
      leftPanel={<AuthInfoPanel sections={leftSections} />}
      rightPanel={<AuthInfoPanel sections={rightSections} />}
    >
      <SignupForm />
    </AuthCard>
  );
}
