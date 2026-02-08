import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Root Route
 *
 * Redirects to /dashboard if authenticated, otherwise to /login.
 * No public landing page — the app is auth-gated.
 */
export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cw_access_token");

  if (token?.value) {
    redirect("/dashboard");
  }

  redirect("/login");
}
