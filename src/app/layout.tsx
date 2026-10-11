import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ceylon Trail | Sri Lanka Tourist Rentals & Chauffeur Services",
  description:
    "Official SLTDA-registered tourist fleet. Vehicles delivered directly inside Katunayake Airport arrivals gate with zero hidden deposit deductions, English-fluent tourist chauffeurs, and legally certified self-drive permits.",
  keywords: [
    "Sri Lanka car rental",
    "Katunayake airport car hire",
    "BIA airport rental",
    "Colombo car rental",
    "Sri Lanka driving permit AAC",
    "Tourist car hire Sri Lanka",
    "Ceylon Trail",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased font-sans">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
