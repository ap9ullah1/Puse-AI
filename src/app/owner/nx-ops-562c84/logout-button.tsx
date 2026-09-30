"use client";

import { useRouter } from "next/navigation";

export function OwnerLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/owner/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-accent-solid/40 hover:text-accent-solid"
    >
      Log out
    </button>
  );
}
