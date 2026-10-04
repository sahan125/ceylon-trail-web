"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Users, Luggage, Wind, Cog, ArrowRight } from "lucide-react";
import { VEHICLES, Vehicle } from "@/data/mockData";

interface FleetProps {
  onSelectCar: (car: Vehicle) => void;
}

export const Fleet: React.FC<FleetProps> = ({ onSelectCar }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "All Classes" | "Hatchbacks" | "Sedans" | "SUV" | "Passenger Vans"
  >("All Classes");

  const categories = [
    "All Classes",
    "Hatchbacks",
    "Sedans",
    "SUV",
    "Passenger Vans",
  ] as const;

  const filteredVehicles =
    selectedCategory === "All Classes"
      ? VEHICLES
      : VEHICLES.filter((v) => v.type === selectedCategory);

  const getBadgeStyle = (type: Vehicle["badgeType"]) => {
    switch (type) {
      case "green":
        return "bg-[#1E7E34] text-white";
      case "blue":
        return "bg-[#1A365D] text-white";
      case "orange":
        return "bg-[#EA580C] text-white";
      case "slate":
        return "bg-[#1E293B] text-white";
      default:
        return "bg-slate-800 text-white";
    }
  };

  return (
    <section id="fleet" className="w-full py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-3 border border-orange-200">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              PRISTINE JAPANESE LINEUP
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Our Verified Tourist Fleet
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl font-normal">
              All vehicles under 4 years old, fully comprehensive tourist rental insurance, dual A/C,
              and certified prior to handover.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#08101E] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Image & Badges Container */}
              <div className="relative w-full h-48 bg-[#F1F5F9] p-4 flex items-center justify-center overflow-hidden">
                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${getBadgeStyle(
                      car.badgeType
                    )}`}
                  >
                    {car.badge}
                  </span>
                </div>

                {/* Car Image with hover zoom */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={car.image}
                    alt={car.name}
                    width={400}
                    height={240}
                    className="object-contain max-h-36 group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Bottom Metric Tag on image */}
                <div className="absolute bottom-2.5 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-2xs border border-slate-200/60">
                  {car.metric}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10.5px]">
                      {car.category}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{car.rating}</span>
                    </div>
                  </div>

                  {/* Car Name */}
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-4">
                    {car.name}
                  </h3>

                  {/* Specs 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11.5px] font-semibold text-slate-600 mb-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>{car.specs.seats}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cog className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>{car.specs.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Luggage className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>{car.specs.luggage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>{car.specs.ac}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-950 tracking-tight">
                        ${car.price}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold block -mt-0.5">
                      {car.priceUnit}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectCar(car)}
                    className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Rent Now
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
