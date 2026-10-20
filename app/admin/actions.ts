"use server";
import { signIn, signOut } from "../lib/auth";
import { isAdminEnabled } from "../lib/adminEnv";

// Sign-in and sign-out for the admin pages. Each checks the flag itself, so they do nothing in production.

export async function signInWithGitHub() {
  if (!isAdminEnabled()) return;
  await signIn("github", { redirectTo: "/admin" });
}

export async function signOutAdmin() {
  if (!isAdminEnabled()) return;
  await signOut({ redirectTo: "/admin/sign-in" });
}
