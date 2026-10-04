"use client";

import React from "react";
import Image from "next/image";
import { Compass, ArrowRight, MapPin } from "lucide-react";
import { TOUR_PACKAGES, TourPackage } from "@/data/mockData";

interface ToursProps {
  onSelectTour: (tour: TourPackage) => void;
  onViewAllItineraries: () => void;
}

export const Tours: React.FC<ToursProps> = ({
  onSelectTour,
  onViewAllItineraries,
}) => {
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
            onClick={onViewAllItineraries}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-orange-600 transition-colors self-start md:self-end group cursor-pointer"
          >
            <span>View All 12 Itineraries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {TOUR_PACKAGES.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Route Overlay Container */}
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={tour.image}
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
                  <span className="truncate">{tour.route}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-2.5">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6">
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
                    <span className="text-[10px] text-slate-600 font-bold block -mt-0.5">
                      {tour.priceLabel}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTour(tour)}
                    className={`px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                      tour.buttonColor === "orange"
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
