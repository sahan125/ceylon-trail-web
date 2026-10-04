"use client";

import React from "react";
import { Star, ShieldCheck, Building2, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/mockData";

export const Testimonials: React.FC = () => {
  return (
    <section id="about" className="w-full py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Dark Navy Trust Summary Card (Span 4 cols) */}
          <div className="lg:col-span-4 bg-[#08101E] text-white rounded-2xl p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* 5 Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                  />
                ))}
              </div>

              {/* 4.96 Rating */}
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                4.96 <span className="text-xl font-bold text-slate-300">out of 5.0</span>
              </h3>

              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1 mb-6">
                Over 380+ verified international reviews
              </p>

              {/* Summary quote */}
              <blockquote className="text-xs text-slate-300 leading-relaxed font-normal italic border-l-2 border-amber-400 pl-3">
                &ldquo;Tourists from the UK, Germany, Australia, and Switzerland consistently rank
                Ceylon Trail as the most dependable and transparent vehicle hire agency at Colombo
                Bandaranaike Airport.&rdquo;
              </blockquote>
            </div>

            {/* Official Credentials */}
            <div className="mt-8 pt-5 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SLTDA Tourist Transport Board Approved</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Government Endorsed AAC Processing</span>
              </div>
            </div>
          </div>

          {/* Individual Testimonial Cards (Span 8 cols -> 2 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Country Flag Badge */}
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-base shadow-2xs border border-slate-200">
                        {t.countryCode === "DE" ? "🇩🇪" : "🇬🇧"}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">
                          {t.name}
                        </h4>
                        <span className="text-[11px] text-slate-600 block">
                          {t.location}
                        </span>
                      </div>
                    </div>

                    {/* 5 Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom Trip Tag */}
                <div className="mt-6 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {t.tripTag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
