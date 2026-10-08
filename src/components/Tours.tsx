"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Compass, ArrowRight, MapPin, Sparkles, Loader2 } from "lucide-react";
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
                  src={tour.image || tour.image_url || "/images/sigiriya.jpg"}
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
        </div>
      </div>
    </section>
  );
};
