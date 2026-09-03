import type { Metadata } from "next";
import { AdminPreview } from "@/components/admin/AdminPreview";

export const metadata: Metadata = {
  title: "Operations preview, Al-Hashar",
  description: "Preview of the operator dashboard for Al-Hashar Tourism & Travels: triage, week, requests and business views with sample data.",
  robots: { index: false, follow: false },
};

export default function AdminPreviewPage() {
  return <AdminPreview />;
}
