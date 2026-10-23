"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Compass, ArrowRight, MapPin, Sparkles, Loader2, MessageCircle } from "lucide-react";
import { TourPackage, normalizeTourPackage } from "@/types/tour";
import { supabase } from "@/lib/supabase";
import { SEED_TOURS } from "@/data/toursData";

interface ToursProps {
  onSelectTour: (tour: TourPackage) => void;
  onViewAllItineraries: (allTours?: TourPackage[]) => void;
}

export const Tours: React.FC<ToursProps> = ({
  onSelectTour,
  onViewAllItineraries,
}) => {
  const [tours, setTours] = useState<TourPackage[]>(SEED_TOURS);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      // 1. Direct Supabase query
      const { data, error } = await supabase
        .from("tour_packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setTours(data.map(normalizeTourPackage));
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Supabase live tour fetch note:", err);
    }

    // 2. Fallback via local API
    try {
      const res = await fetch("/api/tours");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setTours(json.data.map(normalizeTourPackage));
      }
    } catch (err) {
      console.warn("Local API tours fetch note:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();

    // Real-Time subscription for Tour Packages
    try {
      const channel = supabase
        .channel("tour_packages-live-frontend")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tour_packages" },
          () => {
            fetchTours();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Tour package realtime setup note:", err);
    }
  }, []);

  return (
    <section id="tours" className="w-full py-16 bg-[#F4F7FB] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full mb-3 border border-sky-200">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              HANDCRAFTED JOURNEYS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Curated Scenic Tour Packages
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl font-normal">
              Take the stress out of navigation. Combine vehicle rental with government-certified
              English tourist drivers or follow custom road-trip GPS routes.
            </p>
          </div>

          <button
            onClick={() => onViewAllItineraries(tours)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-orange-600 transition-colors self-start md:self-end group cursor-pointer"
          >
            <span>View All {tours.length} Itineraries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading state indicator */}
        {loading && (
          <div className="flex items-center justify-center py-6 text-xs text-slate-500 font-semibold gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            <span>Syncing live tour packages from Supabase...</span>
          </div>
        )}

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {tours.map((tour, idx) => (
            <div
              key={tour.id || idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Route Overlay Container */}
              <div className="relative w-full h-56 overflow-hidden bg-slate-100">
                <Image
                  src={tour.image || tour.image_url || "/images/sigiriya.png"}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/30" />

                {/* Duration Badge */}
                <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {tour.duration}
                </div>

                {/* Route String Banner at bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-[11px] font-medium truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{tour.route || tour.route_locations}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-2.5">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6 line-clamp-3">
                    {tour.description}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-950 tracking-tight">
                        ${tour.price}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold block -mt-0.5">
                      {tour.priceLabel || "/ Complete Group"}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTour(tour)}
                    className={`px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                      idx === 2 || tour.buttonColor === "orange"
                        ? "bg-[#EA580C] hover:bg-[#C2410C] text-white hover:shadow-md"
                        : "bg-[#08101E] hover:bg-slate-800 text-white hover:shadow-md"
                    }`}
                  >
                    Details &amp; Route
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Tour Package Card - No Price Displayed */}
          <div className="bg-linear-to-br from-slate-900 via-slate-850 to-[#08101E] rounded-2xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-white group">
            {/* Header Visual */}
            <div className="relative w-full h-56 overflow-hidden bg-slate-800 flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Tailor-Made Itinerary
                </span>
                <span className="text-xs text-slate-300 font-medium mt-2">
                  Flexible Route &amp; Dedicated Driver
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight mb-2.5">
                  Create Your Own Custom Tour Package
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal mb-6">
                  Design your dream Sri Lanka vacation. Tell us where you want to visit, your travel dates, and group size. Our tour planners will analyze your route and provide an instant manual quote tailored just for you.
                </p>
              </div>

              {/* Action - No price displayed */}
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  Manual Quotation via WhatsApp
                </span>
                <a
                  href={`https://wa.me/94714877742?text=${encodeURIComponent(
                    "Hello lankatrails.lk! I would like to create my own custom tour package in Sri Lanka. Here are my preferred destinations, dates, and group size:"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer transform active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Chat With Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
