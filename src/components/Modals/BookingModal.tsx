"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Calendar, MapPin, Car, UserCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { VEHICLES, Vehicle } from "@/data/mockData";

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
  const [returnDate, setReturnDate] = useState("2026-04-18");
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [needAacPermit, setNeedAacPermit] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedCarId) {
      setCarId(selectedCarId);
    }
  }, [selectedCarId]);

  if (!isOpen) return null;

  const currentCar = VEHICLES.find((v) => v.id === carId) || VEHICLES[0];

  // Calculate days
  const start = new Date(pickupDate).getTime();
  const end = new Date(returnDate).getTime();
  const daysDiff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24))) || 8;

  const baseRate = currentCar.price * daysDiff;
  const chauffeurFee = rentalType === "chauffeur" ? 25 * daysDiff : 0;
  const permitFee = needAacPermit ? 40 : 0;
  const total = baseRate + chauffeurFee + permitFee;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const message = `Hello Ceylon Trail! I'd like an Instant Quote for:%0A- Vehicle: ${currentCar.name} ($${currentCar.price}/day)%0A- Service: ${rentalType === "self" ? "Self-Drive Rental" : "Chauffeur Guided"}%0A- Pickup: ${location}%0A- Dates: ${pickupDate} to ${returnDate} (${daysDiff} days)%0A- AAC Driving Permit: ${needAacPermit ? "Yes, please prepare" : "I have my own"}%0A- Estimated Total: $${total}%0A- Name: ${fullName || "Guest"}%0A- Contact: ${whatsappNumber || "Via WhatsApp"}`;

    setTimeout(() => {
      window.open(`https://wa.me/94718905282?text=${message}`, "_blank");
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h3 className="text-xl font-black text-slate-950 tracking-tight">
              Get Instant Quote &amp; Booking
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Official S.L.T.D.A. Tourist Fleet • Direct Katunayake Airport Delivery
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSendWhatsApp} className="p-6 space-y-5">
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

          {/* Pickup Location & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Pickup Location
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-900 w-full focus:outline-hidden"
                >
                  <option>Bandaranaike Intl. Airport (BIA)</option>
                  <option>Colombo Fort / Galle Face</option>
                  <option>Negombo Beach Hub</option>
                  <option>Kandy Central</option>
                  <option>Galle Fort</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Dates ({daysDiff} Days)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-900"
                />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Traveler Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                WhatsApp Phone / Country Code
              </label>
              <input
                type="tel"
                placeholder="e.g. +44 7911 123456"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
              />
            </div>
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
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm &amp; Send to WhatsApp (+94 71 890 5282)</span>
            </button>
            <p className="text-[11px] text-center text-slate-600 mt-2">
              Instant confirmation • Zero credit card deposit deductions • Free cancellation up to 48 hrs
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
