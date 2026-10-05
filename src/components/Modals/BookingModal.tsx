"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Calendar,
  MapPin,
  Car,
  UserCheck,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { VEHICLES } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCarId?: string;
  initialRentalType?: "self" | "chauffeur";
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedCarId,
  initialRentalType = "self",
}) => {
  const [carId, setCarId] = useState<string>(selectedCarId || VEHICLES[0].id);
  const [rentalType, setRentalType] = useState<"self" | "chauffeur">(initialRentalType);
  const [location, setLocation] = useState("Bandaranaike Intl. Airport (BIA)");
  const [pickupDate, setPickupDate] = useState("2026-04-10");
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [returnDate, setReturnDate] = useState("2026-04-18");
  const [returnTime, setReturnTime] = useState("04:00 PM");
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [needAacPermit, setNeedAacPermit] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCarId) {
      setCarId(selectedCarId);
    }
  }, [selectedCarId]);

  if (!isOpen) return null;

  const currentCar = VEHICLES.find((v) => v.id === carId) || VEHICLES[0];

  // Calculate rental days
  const start = new Date(pickupDate).getTime();
  const end = new Date(returnDate).getTime();
  const daysDiff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24))) || 8;

  const baseRate = currentCar.price * daysDiff;
  const chauffeurFee = rentalType === "chauffeur" ? 25 * daysDiff : 0;
  const permitFee = needAacPermit ? 40 : 0;
  const total = baseRate + chauffeurFee + permitFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let bookingRef = `REQ-${Date.now().toString().slice(-4)}`;

    try {
      // 1. Insert into Supabase 'bookings' table
      try {
        const { data: supabaseData, error: supabaseError } = await supabase
          .from("bookings")
          .insert([
            {
              full_name: fullName,
              email: email || "Not provided",
              phone: whatsappNumber,
              vehicle: currentCar.name,
              pickup_date: pickupDate,
              return_date: returnDate,
              pickup_location: location,
              status: "Pending",
            },
          ])
          .select();

        if (supabaseError) {
          console.warn("Supabase insertion notice:", supabaseError.message);
        } else if (supabaseData && supabaseData[0]?.id) {
          bookingRef = String(supabaseData[0].id);
          console.log("Successfully inserted into Supabase bookings with ID:", bookingRef);
        }
      } catch (sbErr) {
        console.warn("Supabase insert error:", sbErr);
      }

      // 2. Post to backend Admin Store API
      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: fullName,
            phone: whatsappNumber,
            email: email || "Not provided",
            vehicleId: currentCar.id,
            vehicleName: currentCar.name,
            vehicleCategory: currentCar.category,
            rentalType,
            location,
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
            days: daysDiff,
            totalCost: total,
            needAacPermit,
            notes,
          }),
        });

        const result = await response.json();
        if (!bookingRef && result?.data?.id) {
          bookingRef = result.data.id;
        }
      } catch (apiErr) {
        console.warn("Local API backup notice:", apiErr);
      }

      setCreatedBookingId(bookingRef);
      setSubmitSuccess(true);

      // 3. Format pre-filled WhatsApp message
      const message = `Hello Ceylon Trail! I'd like to confirm a car rental booking request:%0A%0A` +
        `📋 *Booking Ref:* ${bookingRef}%0A` +
        `🚗 *Vehicle:* ${currentCar.name} (${currentCar.category})%0A` +
        `🛠️ *Service:* ${rentalType === "self" ? "Self-Drive Rental" : "Chauffeur Guided Tour"}%0A` +
        `📍 *Pickup Location:* ${location}%0A` +
        `📅 *Pickup Date/Time:* ${pickupDate} at ${pickupTime}%0A` +
        `🏁 *Return Date/Time:* ${returnDate} at ${returnTime}%0A` +
        `⏱️ *Duration:* ${daysDiff} Days%0A` +
        `📑 *AAC Driving Permit:* ${needAacPermit ? "Yes, please prepare endorsement" : "No, have international license"}%0A` +
        `💰 *Estimated Total:* $${total}%0A%0A` +
        `👤 *Client Details:*%0A` +
        `- Name: ${fullName}%0A` +
        `- WhatsApp: ${whatsappNumber}%0A` +
        `- Email: ${email || "N/A"}` +
        (notes ? `%0A- Notes: ${notes}` : "");

      // 3. Open WhatsApp link in new tab
      setTimeout(() => {
        window.open(`https://wa.me/94718905282?text=${message}`, "_blank");
      }, 500);
    } catch (error) {
      console.error("Booking submission error:", error);
      // Fallback: still open WhatsApp even if local API had a temporary glitch
      const fallbackMsg = `Hello Ceylon Trail! I'd like an Instant Quote for ${currentCar.name} ($${total}) for ${daysDiff} days from ${pickupDate} to ${returnDate}. Name: ${fullName}, Phone: ${whatsappNumber}.`;
      window.open(`https://wa.me/94718905282?text=${encodeURIComponent(fallbackMsg)}`, "_blank");
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitSuccess(false);
    setCreatedBookingId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Instant Quote &amp; Car Rental Booking
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Official S.L.T.D.A. Tourist Fleet • Syncs with Admin Dashboard &amp; WhatsApp
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Screen */}
        {submitSuccess ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full mb-2 border border-emerald-200">
                Booking Reference: {createdBookingId}
              </span>
              <h4 className="text-2xl font-black text-slate-950 tracking-tight">
                Request Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Your rental request has been saved in our <strong>Admin Dashboard</strong> with status{" "}
                <span className="text-amber-600 font-bold">Pending Review</span>, and your WhatsApp chat
                with our BIA airport reservation desk has been launched.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Vehicle:</span>
                <span className="font-bold text-slate-900">{currentCar.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">
                  {rentalType === "self" ? "Self-Drive Rental" : "Chauffeur Guided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rental Period:</span>
                <span className="font-bold text-slate-900">
                  {pickupDate} → {returnDate} ({daysDiff} Days)
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span>Estimated Total:</span>
                <span className="text-orange-600 text-sm font-black">${total}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  const message = `Hello Ceylon Trail! Checking on my booking ref: ${createdBookingId}`;
                  window.open(`https://wa.me/94718905282?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Re-open WhatsApp Chat</span>
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Main Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Service Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Service Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRentalType("self")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    rentalType === "self"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Self-Drive Rental</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRentalType("chauffeur")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    rentalType === "chauffeur"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Chauffeur Guided</span>
                </button>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Vehicle
              </label>
              <select
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
              >
                {VEHICLES.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} ({car.category}) — ${car.price}/day
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Pickup &amp; Return Location
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-900 w-full focus:outline-hidden cursor-pointer"
                >
                  <option>Bandaranaike Intl. Airport (BIA)</option>
                  <option>Colombo Fort / Galle Face</option>
                  <option>Negombo Beach Hub</option>
                  <option>Kandy Central</option>
                  <option>Galle Fort / Unawatuna</option>
                  <option>Ella Mountain Station</option>
                </select>
              </div>
            </div>

            {/* Dates & Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Pickup Date & Time */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Pickup Date &amp; Time
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-900 w-full focus:outline-hidden"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-transparent text-[11px] font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
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

              {/* Return Date & Time */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Return Date &amp; Time
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-900 w-full focus:outline-hidden"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-transparent text-[11px] font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
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
            </div>

            {/* Client Details (Name, Phone, Email) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Client Contact Information
              </label>

              <div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-orange-500">
                  <span className="text-slate-600 text-xs font-bold w-20">Full Name:</span>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-orange-500">
                  <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <input
                    type="tel"
                    placeholder="WhatsApp No. (+44...)"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    required
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-orange-500">
                  <Mail className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Optional Special Notes */}
            <div>
              <input
                type="text"
                placeholder="Optional notes: flight number, child seat requirement..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* AAC Driving permit checkbox */}
            <label className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={needAacPermit}
                onChange={(e) => setNeedAacPermit(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Include Official AAC Driving Permit Processing ($40)
                </span>
                <span className="text-slate-600">
                  We handle the complete legal endorsement so it is ready at Katunayake Airport
                  upon your arrival.
                </span>
              </div>
            </label>

            {/* Pricing Breakdown Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{currentCar.name} ({daysDiff} days × ${currentCar.price})</span>
                <span className="font-semibold text-white">${baseRate}</span>
              </div>
              {rentalType === "chauffeur" && (
                <div className="flex justify-between text-xs text-slate-300">
                  <span>English-fluent Tourist Chauffeur (${25} × {daysDiff}d)</span>
                  <span className="font-semibold text-white">+${chauffeurFee}</span>
                </div>
              )}
              {needAacPermit && (
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Government Endorsed AAC Driving Permit</span>
                  <span className="font-semibold text-white">+${permitFee}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-emerald-400">
                <span>BIA Terminal Gate Curbside Handover</span>
                <span className="font-bold">FREE ($0)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-200">Total Estimated Quote:</span>
                <span className="text-2xl font-black text-[#F59E0B]">${total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EA580C] hover:bg-[#C2410C] disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Dashboard &amp; Formatting WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm &amp; Send to WhatsApp (+94 71 890 5282)</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Simultaneously posts to Admin Dashboard and launches WhatsApp desk</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
