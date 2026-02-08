/**
 * App Constants
 *
 * Global configuration constants used throughout the application.
 */

export const APP_NAME = "Cosmic Watch";
export const APP_DESCRIPTION = "Real-Time Near-Earth Object Monitoring & Risk Analysis Platform";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const AUTH_COOKIE_KEY = "cw_access_token";
export const REFRESH_COOKIE_KEY = "cw_refresh_token";
