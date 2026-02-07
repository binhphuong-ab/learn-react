import { redirect } from "next/navigation";

import { getServerSessionUser } from "@/lib/session";

export default async function Home() {
  const user = await getServerSessionUser();
  if (user) {
    redirect("/planner");
  }
  redirect("/login");
}
