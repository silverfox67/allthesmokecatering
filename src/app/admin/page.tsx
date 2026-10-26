import type { Metadata } from "next";
import { AdminPortal } from "@/components/admin/AdminPortal";

export const metadata: Metadata = {
  title: "Pitmaster Operations | All The Smoke Catering",
  description: "Executive catering operations hub for Marion Bolden.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortal />;
}
