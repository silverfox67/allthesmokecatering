import type { Metadata } from "next";
import { AdminPortal } from "@/components/admin/AdminPortal";

export const metadata: Metadata = {
  title: "Pitmaster Portal | All The Smoke Catering",
  description: "Executive catering command center for Marion Bolden.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortal />;
}
