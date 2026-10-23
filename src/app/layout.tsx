import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lankatrails.lk | Sri Lanka Tourist Rentals & Chauffeur Services",
  description:
    "Pristine tourist fleet. Vehicles delivered directly inside Katunayake Airport arrivals gate, English-fluent tourist chauffeurs, and driving permits handled before your flight lands.",
  keywords: [
    "Sri Lanka car rental",
    "Katunayake airport car hire",
    "BIA airport rental",
    "Colombo car rental",
    "Sri Lanka driving permit AAC",
    "Tourist car hire Sri Lanka",
    "Lankatrails.lk",
    "Lankatrails",
  ],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased font-sans overflow-x-hidden">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
