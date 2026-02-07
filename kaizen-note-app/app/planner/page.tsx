import { redirect } from "next/navigation";

import { PlannerApp } from "@/components/planner/planner-app";
import { getServerSessionUser } from "@/lib/session";

export default async function PlannerPage() {
  const user = await getServerSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <PlannerApp username={user.username} />;
}
