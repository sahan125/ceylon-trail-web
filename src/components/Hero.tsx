"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Car,
  UserCheck,
  MapPin,
  Calendar,
  Clock,
  Check,
  Zap,
  Star,
  MessageCircle,
  Loader2,
  Phone,
  User,
} from "lucide-react";
import { VEHICLES, getVehicleStartingPrice } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

interface HeroProps {
  onSearchFleet?: (filters: {
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
  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLES[0].id);

  const [location, setLocation] = useState("Bandaranaike Intl. Airport (BIA)");
  const [pickupDate, setPickupDate] = useState("2026-04-10");
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [returnDate, setReturnDate] = useState("2026-04-18");
  const [returnTime, setReturnTime] = useState("04:00 PM");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const selectedVehicle =
    VEHICLES.find((v) => v.id === selectedVehicleId) || VEHICLES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const clientNameValue = customerName.trim() || "Guest Traveler";
    const phoneValue = customerPhone.trim() || "Not provided";

    let bookingRef = `REQ-${Date.now().toString().slice(-4)}`;

    try {
      // 1. Log to Supabase 'bookings' table
      try {
        const { data: supabaseData, error: sbError } = await supabase
          .from("bookings")
          .insert([
            {
              full_name: clientNameValue,
              email: "Form Inquiry",
              phone: phoneValue,
              vehicle: selectedVehicle.name,
              pickup_date: pickupDate,
              return_date: returnDate,
              pickup_location: location,
              status: "Pending",
            },
          ])
          .select();

        if (!sbError && supabaseData && supabaseData[0]?.id) {
          bookingRef = String(supabaseData[0].id);
        }
      } catch (err) {
        console.warn("Direct Supabase insert notice:", err);
      }

      // 2. Also log to /api/bookings store
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: clientNameValue,
            phone: phoneValue,
            email: "Inquiry via Website",
            vehicleId: selectedVehicle.id,
            vehicleName: selectedVehicle.name,
            vehicleCategory: selectedVehicle.category,
            rentalType,
            location,
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
            status: "Pending",
          }),
        });
        const json = await res.json();
        if (json?.data?.id) {
          bookingRef = json.data.id;
        }
      } catch (apiErr) {
        console.warn("API booking notice:", apiErr);
      }

      setSubmitSuccess(true);

      // 3. Generate pre-filled WhatsApp message to +9471 487 7742
      const serviceName =
        rentalType === "self" ? "Self-Drive Rental" : "Chauffeur Guided Tour";
      const message =
        `Hello Lankatrails.lk! I would like to book a vehicle:%0A%0A` +
        `📋 *Booking Ref:* ${bookingRef}%0A` +
        `🚗 *Chosen Vehicle:* ${selectedVehicle.name} (${selectedVehicle.category})%0A` +
        `🛠️ *Service:* ${serviceName}%0A` +
        `📍 *Pickup Location:* ${location}%0A` +
        `📅 *Pickup Date & Time:* ${pickupDate} at ${pickupTime}%0A` +
        `🏁 *Return Date & Time:* ${returnDate} at ${returnTime}%0A` +
        (customerName ? `👤 *Name:* ${customerName}%0A` : "") +
        (customerPhone ? `📞 *Phone/WhatsApp:* ${customerPhone}%0A` : "") +
        `%0APlease confirm availability and pricing for this request.`;

      setTimeout(() => {
        window.open(`https://wa.me/94714877742?text=${message}`, "_blank");
      }, 400);

      if (onSearchFleet) {
        onSearchFleet({
          rentalType,
          location,
          pickupDate,
          pickupTime,
          returnDate,
          returnTime,
        });
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      const fallbackMsg = `Hello Lankatrails.lk! I want to book ${selectedVehicle.name} (${rentalType === "self" ? "Self-Drive" : "Chauffeur"}) from ${pickupDate} (${pickupTime}) to ${returnDate} (${returnTime}) at ${location}. Name: ${clientNameValue}, Phone: ${phoneValue}`;
      window.open(
        `https://wa.me/94714877742?text=${encodeURIComponent(fallbackMsg)}`,
        "_blank"
      );
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-slate-900 py-12 md:pt-10 md:pb-16 lg:pb-24"
    >
      {/* Background Hero Image with Gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Sri Lanka scenic mountains and tea country"
          fill
          priority
          className="object-cover object-center brightness-80 scale-105 transition-transform duration-1000"
        />
        {/* Soft Contrast Overlay for Readability while keeping scenery clearly visible */}
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/25 to-[#08101E]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10.5px] md:text-xs font-bold tracking-wide mb-4 md:mb-6 backdrop-blur-md shadow-lg max-w-full">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span className="truncate">THE #1 TRUSTED CHOICE FOR INTERNATIONAL TRAVELERS</span>
        </div>

        {/* Hero Headlines */}
        <div className="max-w-4xl mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] drop-shadow-md">
            Explore Sri Lanka With{" "}
            <span className="text-[#F59E0B] drop-shadow-lg">Freedom</span>{" "}
            &amp; Unrivaled Confidence
          </h1>

          <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-slate-100 leading-relaxed font-normal max-w-3xl drop-shadow-sm">
            Pristine vehicles delivered directly inside Katunayake Airport arrivals gate, English-fluent tourist chauffeurs, and legally certified self-drive permits ready before your flight lands.
          </p>
        </div>

        {/* Highlight Stats Row */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-14 mb-8 md:mb-10 text-white">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-4xl font-extrabold text-[#F59E0B] tracking-tight">
              100%
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-medium mt-0.5">
              Refund Guarantee
            </span>
          </div>
          <div className="h-8 w-px bg-white/20 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-4xl font-extrabold text-[#F59E0B] tracking-tight">
              24 / 7
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-medium mt-0.5">
              Islandwide Roadside Aid
            </span>
          </div>
        </div>

        {/* Mobile Quick Action Buttons (Visible on mobile below stats, hidden on desktop md:hidden) */}
        <div className="flex flex-col gap-3 w-full mb-6 md:hidden">
          <a
            href="https://wa.me/94714877742?text=Hello%20Lankatrails.lk!%20I%20would%20like%20to%20book%20a%20vehicle%20in%20Sri%20Lanka.%20Please%20let%20me%20know%20availability%20and%20rates."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-98 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Book via WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-3 w-full">
            <a
              href="#fleet"
              className="w-full min-h-[44px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all text-center"
            >
              <Car className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>View Our Cars</span>
            </a>
            <a
              href="#tours"
              className="w-full min-h-[44px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all text-center"
            >
              <span>Tour Packages</span>
            </a>
          </div>
        </div>

        {/* Booking / Dynamic Reservation Card (Hidden on mobile, preserved on desktop md:block) */}
        <div className="hidden md:block w-full bg-white rounded-2xl shadow-2xl p-4 sm:p-5 md:p-7 border border-slate-100 text-slate-800">
          <form onSubmit={handleSubmit}>
            {/* Card Header: Tabs & Options */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 gap-4">
              {/* Rental Type Tabs */}
              <div className="flex flex-col sm:flex-row p-1 bg-slate-100 rounded-xl gap-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setRentalType("self")}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 min-h-[44px] rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 min-h-[44px] rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Direct WhatsApp Booking (+9471 487 7742)
                </span>
              </div>
            </div>

            {/* Input Row 1: Vehicle & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 pt-5">
              {/* Chosen Vehicle / Car Dropdown */}
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Chosen Vehicle / Car
                </label>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-orange-500 shrink-0" />
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-transparent text-base md:text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    {VEHICLES.map((v) => {
                      const starting = getVehicleStartingPrice(v);
                      return (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.category}) — Starts at {starting.formatted} ({starting.unit})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Pickup Location
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-base md:text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
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
            </div>

            {/* Input Row 2: Dates, Times & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 pt-3.5">
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
                    className="bg-transparent text-base md:text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer w-full sm:w-28"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-transparent text-base md:text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
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
                    className="bg-transparent text-base md:text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer w-full sm:w-28"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-transparent text-base md:text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
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

              {/* Client Name & Phone */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Your Name &amp; WhatsApp
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-1.5 w-full sm:w-1/2">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-transparent text-base md:text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                    />
                  </div>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 w-full sm:w-1/2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="WhatsApp No."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-transparent text-base md:text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Submit to WhatsApp & Admin Button */}
              <div className="lg:col-span-3 flex items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-full min-h-[48px] md:min-h-[52px] bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer px-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Book via WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Success Notification Banner */}
            {submitSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    Your booking request was submitted to the Admin Dashboard and your pre-filled WhatsApp chat is opening!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Bottom Highlights (Old badges removed) */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  24/7 BIA Airport Terminal Gate Handover
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Driving Permits Handled Prior to Landing
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
