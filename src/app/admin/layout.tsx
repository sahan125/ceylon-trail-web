import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Ceylon Trail Tourist Car Rentals",
  description:
    "Real-time management dashboard for incoming vehicle rental bookings, customer inquiries, and fleet operations.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-100 text-slate-900">{children}</div>;
}
