"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Car,
  UserCheck,
  MapPin,
  Calendar,
  Clock,
  Search,
  Check,
  Zap,
  Star,
} from "lucide-react";

interface HeroProps {
  onSearchFleet: (filters: {
    rentalType: "self" | "chauffeur";
    location: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearchFleet }) => {
  const [rentalType, setRentalType] = useState<"self" | "chauffeur">("self");
  const [returnSameLocation, setReturnSameLocation] = useState(true);
  const [whatsappConfirm, setWhatsappConfirm] = useState(true);

  const [location, setLocation] = useState("Bandaranaike Intl. Airport (BIA)");
  const [pickupDate, setPickupDate] = useState("2026-04-10");
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [returnDate, setReturnDate] = useState("2026-04-18");
  const [returnTime, setReturnTime] = useState("04:00 PM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchFleet({
      rentalType,
      location,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
    });
    // Smooth scroll to fleet section
    const fleetSection = document.getElementById("fleet");
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-slate-900 pt-10 pb-16 lg:pb-24">
      {/* Background Hero Image with Gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Sri Lanka scenic mountains and tea country"
          fill
          priority
          className="object-cover object-center brightness-45 scale-105 transition-transform duration-1000"
        />
        {/* Dark Vignette Overlay for Readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-[#08101E]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide mb-6 backdrop-blur-md shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>THE #1 TRUSTED CHOICE FOR INTERNATIONAL TRAVELERS</span>
        </div>

        {/* Hero Headlines */}
        <div className="max-w-4xl mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Explore Sri Lanka With{" "}
            <span className="text-[#F59E0B] drop-shadow-md">Freedom</span>{" "}
            &amp; Unrivaled Confidence
          </h1>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal max-w-3xl">
            Official S.L.T.D.A.-registered tourist fleet. Pristine vehicles delivered directly inside
            Katunayake Airport arrivals gate with zero hidden deposit deductions, English-fluent
            tourist chauffeurs, and legally certified self-drive permits ready before your flight lands.
          </p>
        </div>

        {/* Highlight Stats Row */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-14 mb-10 text-white">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight">
              12,400+
            </span>
            <span className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Tourists Handled
            </span>
          </div>
          <div className="h-8 w-px bg-white/20 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-2xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight">
              100%
            </span>
            <span className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Refund Guarantee
            </span>
          </div>
          <div className="h-8 w-px bg-white/20 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-2xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight">
              24 / 7
            </span>
            <span className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Islandwide Roadside Aid
            </span>
          </div>
        </div>

        {/* Booking / Search Card */}
        <div className="w-full bg-white rounded-2xl shadow-2xl p-5 sm:p-7 border border-slate-100 text-slate-800">
          <form onSubmit={handleSubmit}>
            {/* Card Header: Tabs & Checkbox Options */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 gap-4">
              {/* Rental Type Tabs */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setRentalType("self")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rentalType === "self"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Self-Drive Rental</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRentalType("chauffeur")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rentalType === "chauffeur"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Chauffeur Guided Tour</span>
                </button>
              </div>

              {/* Convenience checkmarks */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={returnSameLocation}
                    onChange={(e) => setReturnSameLocation(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Return to same location</span>
                </label>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={whatsappConfirm}
                    onChange={(e) => setWhatsappConfirm(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Instant WhatsApp Confirmation</span>
                </label>
              </div>
            </div>

            {/* Input Row: Location, Dates, Times & Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 pt-5">
              {/* Pickup Location */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Pickup Location
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Bandaranaike Intl. Airport (BIA)">
                      Bandaranaike Intl. Airport (BIA)
                    </option>
                    <option value="Colombo Fort / Galle Face">
                      Colombo Fort / Galle Face
                    </option>
                    <option value="Negombo Beach Town">Negombo Beach Town</option>
                    <option value="Kandy City Central Hub">
                      Kandy City Central Hub
                    </option>
                    <option value="Galle Fort / Unawatuna">
                      Galle Fort / Unawatuna
                    </option>
                    <option value="Ella Mountain Station">
                      Ella Mountain Station
                    </option>
                  </select>
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Pickup Date &amp; Time
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer w-28"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option>08:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                    <option>06:00 PM</option>
                    <option>10:00 PM</option>
                    <option>Midnight</option>
                  </select>
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Return Date &amp; Time
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer w-28"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option>08:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                    <option>06:00 PM</option>
                    <option>10:00 PM</option>
                  </select>
                </div>
              </div>

              {/* CTA Search Button */}
              <div className="lg:col-span-2 flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[52px] bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer px-3"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Available Fleet</span>
                </button>
              </div>
            </div>

            {/* Bottom Guarantee Checklist */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Free cancellation up to 48hrs
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  No international card swipe surcharge
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Zero-deposit cash/card hold options
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-[11px] uppercase tracking-wide bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80">
                <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>Cars Guaranteed or Free Upgrade</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
