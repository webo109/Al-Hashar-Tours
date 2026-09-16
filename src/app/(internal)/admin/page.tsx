import type { Metadata } from "next";
import { AdminPreview } from "@/components/admin/AdminPreview";

export const metadata: Metadata = {
  title: "Admin | Al-Hashar",
  description: "Admin dashboard for Al-Hashar Tourism & Travels: triage, week, requests and business views with sample data.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPreview />;
}
