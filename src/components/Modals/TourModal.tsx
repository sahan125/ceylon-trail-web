"use client";

import React from "react";
import Image from "next/image";
import { X, Check, MapPin, Calendar, Users, Shield, MessageCircle, Sparkles } from "lucide-react";
import { TourPackage } from "@/types/tour";

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TourPackage | null;
}

export const TourModal: React.FC<TourModalProps> = ({ isOpen, onClose, tour }) => {
  if (!isOpen || !tour) return null;

  const routeDisplay =
    tour.route ||
    (Array.isArray(tour.route_locations)
      ? tour.route_locations.join(" • ")
      : tour.route_locations || "");

  const highlights =
    Array.isArray(tour.highlights) && tour.highlights.length > 0
      ? tour.highlights
      : [
          "Curated UNESCO Cultural & Natural Heritage stops",
          "Scenic viewpoint photography sessions",
          "Dedicated government-licensed tourist guide support",
          "Customizable private photo stops along route",
        ];

  const inclusions =
    Array.isArray(tour.inclusions) && tour.inclusions.length > 0
      ? tour.inclusions
      : [
          "Dedicated Tourist Vehicle",
          "English-fluent Driver",
          "Fuel & Expressway Tolls",
          "Airport Pickup & Drop",
          "Comprehensive Insurance",
          "24/7 Islandwide Backup",
        ];

  const handleBookTour = () => {
    const msg = `Hello Ceylon Trail! I am interested in booking the tour package:%0A` +
      `🧭 *Tour:* ${tour.title}%0A` +
      `⏱️ *Duration:* ${tour.duration}%0A` +
      `📍 *Route:* ${routeDisplay}%0A` +
      `💰 *Price:* $${tour.price} ${tour.priceLabel || "/ Complete Group"}%0A` +
      `Please check available dates and vehicle options for my travel group.`;

    window.open(`https://wa.me/94718905282?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Tour Image Header */}
        <div className="relative w-full h-64 bg-slate-900">
          <Image
            src={tour.image || tour.image_url || "/images/sigiriya.jpg"}
            alt={tour.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and metadata on image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="inline-block bg-[#EA580C] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md mb-2">
              {tour.duration}
            </span>
            <h3 className="text-2xl font-black tracking-tight">{tour.title}</h3>
            {routeDisplay && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{routeDisplay}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
              Tour Overview
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {tour.description}
            </p>
          </div>

          {/* Key Highlights */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Key Itinerary Highlights
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">
                {highlights.length} stops &amp; activities
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              What Is Included In Every Package:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-semibold text-slate-600">
              {inclusions.map((inc, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Package Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-950">${tour.price}</span>
                <span className="text-xs text-slate-500 font-semibold">
                  {tour.priceLabel || "/ Complete Group"}
                </span>
              </div>
            </div>

            <button
              onClick={handleBookTour}
              className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
