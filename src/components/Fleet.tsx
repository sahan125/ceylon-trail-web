"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Users, Luggage, Wind, Cog, Check, ArrowRight, MessageCircle } from "lucide-react";
import { VEHICLES, Vehicle, VEHICLE_PRICING_TABLES } from "@/data/mockData";

interface FleetProps {
  onSelectCar: (car: Vehicle) => void;
}

export const Fleet: React.FC<FleetProps> = ({ onSelectCar }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "All Classes" | "Hatchbacks" | "Sedans" | "SUV" | "Passenger Vans"
  >("All Classes");

  const [activePricingTab, setActivePricingTab] = useState<"Wagon" | "Hatchback" | "Sedan">("Wagon");

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

  const handleBookPackage = (category: string, days: number, price: number, extraDay: number) => {
    const msg = `Hello lankatrails.lk! I want to book the ${category} Car Package:%0A` +
      `⏱️ Duration: ${days} Days (No mileage restrictions)%0A` +
      `💰 Package Price: $${price} USD%0A` +
      `➕ Additional Day Rate: $${extraDay} USD%0A` +
      `Please let me know how to proceed with the reservation.`;
    window.open(`https://wa.me/94714877742?text=${msg}`, "_blank");
  };

  const currentPricingTable =
    VEHICLE_PRICING_TABLES.find((p) => p.category === activePricingTab) ||
    VEHICLE_PRICING_TABLES[0];

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
              Fully comprehensive tourist rental insurance, full A/C, and certified prior to handover.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredVehicles.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Image & Badges Container */}
              <div className="relative w-full h-44 bg-[#F1F5F9] p-4 flex items-center justify-center overflow-hidden">
                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs ${getBadgeStyle(
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
                    className="object-contain max-h-32 group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Bottom Metric Tag on image */}
                <div className="absolute bottom-2.5 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10.5px] font-bold text-slate-800 shadow-2xs border border-slate-200/60">
                  {car.metric}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">
                      {car.category}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{car.rating}</span>
                    </div>
                  </div>

                  {/* Car Name */}
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-3">
                    {car.name}
                  </h3>

                  {/* Specs 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-[11px] font-semibold text-slate-600 mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{car.specs.seats}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Cog className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{car.specs.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Luggage className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{car.specs.luggage}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{car.specs.ac}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-950 tracking-tight">
                        ${car.price}
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 font-bold block -mt-0.5">
                      {car.priceUnit}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectCar(car)}
                    className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-3.5 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section: Tiered Pricing Tables */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                GUARANTEED PACKAGE PRICING
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Vehicle Package Pricing Tables
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Transparent multi-day rates with <strong>No Mileage Restrictions (0 km limit)</strong>.
              </p>
            </div>

            {/* Model Selector Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
              {(["Wagon", "Hatchback", "Sedan"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActivePricingTab(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    activePricingTab === cat
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {cat} Model
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-extrabold text-sm tracking-wide">
                {currentPricingTable.title}
              </span>
              <span className="text-xs text-amber-400 font-semibold">
                Unlimited Kilometers Included
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Package Plan</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5">Mileage Limit</th>
                    <th className="py-3.5 px-5">Total Price (USD)</th>
                    <th className="py-3.5 px-5">Per Additional Day</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {currentPricingTable.tiers.map((tier, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {tier.label}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-600">
                        {tier.days} Days
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200/60">
                          {tier.mileage}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-black text-slate-950 text-sm">
                        ${tier.priceUSD.toFixed(2)} USD
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-600">
                        ${tier.extraDayUSD.toFixed(2)} USD
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() =>
                            handleBookPackage(
                              activePricingTab,
                              tier.days,
                              tier.priceUSD,
                              tier.extraDayUSD
                            )
                          }
                          className="inline-flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white px-3.5 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Reserve</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
