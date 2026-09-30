import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { NavClient } from "./NavClient";

export async function Nav() {
  const user = await getCurrentUser();
  return <NavClient user={user ? { email: user.email, name: user.name } : null} />;
}
