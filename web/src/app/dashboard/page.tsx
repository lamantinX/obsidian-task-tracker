import { DashboardView } from "@/components/dashboard-view";
import { requireAppSession } from "@/server/auth/server-session";
import { getVaultAdapter } from "@/server/vault";

export default async function DashboardPage() {
  const session = await requireAppSession();
  const snapshot = await getVaultAdapter().getDashboardSnapshot(session.email);

  return <DashboardView snapshot={snapshot} />;
}
