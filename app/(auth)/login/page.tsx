/**
 * Login Page
 *
 * Authentication entry point for returning users, featuring
 * the mission control briefing and security information.
 */

import AuthCard from "@/components/auth/AuthCard";
import AuthInfoPanel from "@/components/auth/AuthInfoPanel";
import LoginForm from "@/components/auth/LoginForm";

const leftSections = [
  {
    heading: "Mission Briefing",
    body: "CosmicWatch monitors near-Earth objects in real-time, tracking asteroids, comets, and space debris that pass within our planetary neighbourhood. Your mission control awaits.",
  },
  {
    heading: "Orbital Distance",
    body: "0.05 AU — Close approach threshold for potentially hazardous asteroids monitored by our systems.",
  },
  {
    heading: "Active Sensors",
    body: "NASA NeoWs \u00B7 CNEOS Sentry \u00B7 EPIC \u00B7 APOD \u00B7 Space Weather",
  },
];

const rightSections = [
  {
    heading: "Threat Classification",
    body: "Our AI risk engine scores every object from 0–10 on the Torino Scale, factoring velocity, diameter, and miss distance.",
  },
  {
    heading: "Data Refresh",
    body: "Orbital data syncs every 15 minutes from JPL Horizons and the Minor Planet Center.",
  },
  {
    heading: "Security",
    body: "AES-256 encrypted sessions \u00B7 JWT rotation \u00B7 Rate-limited API",
  },
];

export default function LoginPage() {
  return (
    <AuthCard
      title="COSMIC WATCH"
      leftPanel={<AuthInfoPanel sections={leftSections} />}
      rightPanel={<AuthInfoPanel sections={rightSections} />}
    >
      <LoginForm />
    </AuthCard>
  );
}
