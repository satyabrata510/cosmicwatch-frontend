/**
 * Shared TypeScript Types
 *
 * Covers the full backend API surface (33 endpoints).
 */

// ── Roles & Common ──────────────────────────────────────
export type Role = "USER" | "RESEARCHER" | "ADMIN";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AlertType = "CLOSE_APPROACH" | "HAZARDOUS_DETECTED" | "WATCHLIST_UPDATE";

// ── API Envelope ────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// ── Auth ────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  isVerified?: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count?: { watchlist: number; alerts: number };
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

// ── NEO ─────────────────────────────────────────────────
export interface NeoObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  is_sentry_object: boolean;
}

export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
  };
  orbiting_body: string;
}

export interface NeoFeedResponse {
  element_count: number;
  near_earth_objects: Record<string, NeoObject[]>;
}

// ── Risk Analysis ───────────────────────────────────────
export interface RiskScore {
  asteroid_id: string;
  name: string;
  risk_level: RiskLevel;
  risk_score: number;
  hazardous: boolean;
  estimated_diameter_km: number;
  miss_distance_km: number;
  velocity_km_s: number;
  kinetic_energy_mt: number;
  torino_scale: number;
  palermo_scale: number;
  impact_probability: number;
  relative_size: string;
  score_breakdown: {
    hazardous_points: number;
    diameter_points: number;
    miss_distance_points: number;
    velocity_points: number;
    kinetic_energy_points: number;
    orbital_uncertainty_points: number;
  };
}

export interface SentryRiskScore extends RiskScore {
  sentry_available: boolean;
  sentry_designation?: string;
  real_impact_probability?: number;
  real_palermo_cumulative?: number;
  real_palermo_max?: number;
  real_torino_max?: number;
  real_impact_energy_mt?: number;
  total_virtual_impactors?: number;
  data_source: string;
}

// ── CNEOS ───────────────────────────────────────────────
export interface CloseApproach {
  designation: string;
  orbitId: string;
  julianDate: string;
  approachDate: string;
  distanceAu: number;
  distanceMinAu: number;
  distanceMaxAu: number;
  distanceKm: number;
  distanceLunar: number;
  velocityRelative: number;
  velocityInfinity: number;
  uncertaintyTime: string;
  absoluteMagnitude: number | null;
  diameter: number | null;
  diameterSigma: number | null;
  fullname: string | null;
}

export interface CloseApproachResponse {
  totalCount: number;
  dateRange: { min: string; max: string };
  approaches: CloseApproach[];
}

export interface SentryObject {
  designation: string;
  fullname: string;
  absoluteMagnitude: number;
  diameter: number | null;
  impactCount: number;
  impactProbability: number;
  palermoCumulative: number;
  palermoMax: number;
  torinoMax: number;
  impactDateRange: string;
  lastObservation: string;
  velocityInfinity: number;
}

export interface SentryListResponse {
  totalCount: number;
  objects: SentryObject[];
}

export interface VirtualImpactor {
  date: string;
  impactEnergy: number | null;
  impactProbability: number;
  palermoScale: number;
  torinoScale: number;
}

export interface SentryDetail {
  designation: string;
  fullname: string;
  method: string;
  absoluteMagnitude: number;
  diameter: number | null;
  mass: number | null;
  impactEnergy: number | null;
  velocityInfinity: number;
  velocityImpact: number;
  cumulativeImpactProbability: number;
  totalVirtualImpactors: number;
  palermoCumulative: number;
  palermoMax: number;
  torinoMax: number;
  observationArc: string;
  totalObservations: number;
  firstObservation: string;
  lastObservation: string;
  virtualImpactors: VirtualImpactor[];
}

export interface Fireball {
  date: string;
  latitude: number | null;
  latitudeDirection: string | null;
  longitude: number | null;
  longitudeDirection: string | null;
  altitude: number | null;
  velocity: number | null;
  totalRadiatedEnergy: number;
  impactEnergy: number;
  location: string | null;
}

export interface FireballResponse {
  totalCount: number;
  fireballs: Fireball[];
}

// ── Space Weather ───────────────────────────────────────
export interface CmeEvent {
  activityId: string;
  startTime: string;
  sourceLocation: string;
  activeRegionNum: number | null;
  note: string;
  instruments: string[];
  speed: number | null;
  halfAngle: number | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
  earthDirected: boolean;
  estimatedArrival: string | null;
  linkedEvents: string[];
  link: string;
}

export interface CmeResponse {
  totalCount: number;
  dateRange: { start: string; end: string };
  events: CmeEvent[];
}

export interface SolarFlare {
  flareId: string;
  beginTime: string;
  peakTime: string;
  endTime: string | null;
  classType: string;
  classCategory: string;
  intensity: number;
  sourceLocation: string;
  activeRegionNum: number | null;
  instruments: string[];
  note: string;
  link: string;
}

export interface SolarFlareResponse {
  totalCount: number;
  dateRange: { start: string; end: string };
  events: SolarFlare[];
  summary: {
    xClass: number;
    mClass: number;
    cClass: number;
    other: number;
  };
}

export interface KpReading {
  observedTime: string;
  kpIndex: number;
  source: string;
}

export interface GeoStorm {
  stormId: string;
  startTime: string;
  maxKpIndex: number;
  stormLevel: string;
  kpReadings: KpReading[];
  link: string;
}

export interface GeoStormResponse {
  totalCount: number;
  dateRange: { start: string; end: string };
  events: GeoStorm[];
}

export interface SpaceWeatherNotification {
  messageType: string;
  messageId: string;
  messageUrl: string;
  issueTime: string;
  body: string;
}

export interface SpaceWeatherNotificationResponse {
  totalCount: number;
  dateRange: { start: string; end: string };
  notifications: SpaceWeatherNotification[];
}

// ── APOD ────────────────────────────────────────────────
export interface Apod {
  title: string;
  date: string;
  explanation: string;
  mediaType: string;
  url: string;
  hdUrl?: string;
  thumbnailUrl?: string;
  copyright?: string;
}

// ── EPIC ────────────────────────────────────────────────
export interface EpicImage {
  identifier: string;
  caption: string;
  imageFilename: string;
  date: string;
  imageUrl: string;
  version: string;
  centroidCoordinates: { lat: number; lon: number };
  dscovrPosition: { x: number; y: number; z: number };
  lunarPosition: { x: number; y: number; z: number };
  sunPosition: { x: number; y: number; z: number };
}

// ── NASA Media ──────────────────────────────────────────
export interface MediaItem {
  nasa_id: string;
  title: string;
  description: string;
  media_type: string;
  date_created: string;
  keywords: string[];
  center: string;
  thumbnail?: string;
  href?: string;
}

// ── Watchlist ───────────────────────────────────────────
export interface WatchlistItem {
  id: string;
  userId: string;
  asteroidId: string;
  asteroidName: string;
  alertOnApproach: boolean;
  alertDistanceKm: number;
  createdAt: string;
}

export interface AddToWatchlist {
  asteroidId: string;
  asteroidName: string;
  alertOnApproach?: boolean;
  alertDistanceKm?: number;
}

export interface UpdateWatchlist {
  alertOnApproach?: boolean;
  alertDistanceKm?: number;
}

// ── Alerts ──────────────────────────────────────────────
export interface Alert {
  id: string;
  userId: string;
  asteroidId: string;
  asteroidName: string;
  alertType: AlertType;
  message: string;
  riskLevel: RiskLevel;
  approachDate: string;
  missDistanceKm: number;
  velocityKmph: number;
  isRead: boolean;
  createdAt: string;
}

// ── WebSocket Chat ──────────────────────────────────────
export interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  userId: string;
  createdAt: string;
  user: { id: string; name: string; avatar?: string | null };
}
