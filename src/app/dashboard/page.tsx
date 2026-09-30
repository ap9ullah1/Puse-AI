import { notFound } from "next/navigation";

/** Old public path — removed so the dashboard is not discoverable. */
export default function RemovedDashboard() {
  notFound();
}
