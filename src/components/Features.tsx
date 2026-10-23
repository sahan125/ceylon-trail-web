"use client";

import React from "react";
import {
  FileBadge,
  Wrench,
  KeyRound,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

interface FeaturesProps {
  onOpenPermitModal: () => void;
  onOpenEmergencyInfo: () => void;
  onOpenAirportInfo: () => void;
}

export const Features: React.FC<FeaturesProps> = ({
  onOpenPermitModal,
  onOpenEmergencyInfo,
  onOpenAirportInfo,
}) => {
  return (
    <section id="services" className="w-full py-12 md:py-16 bg-[#F8FAFC] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & WhatsApp Floating Pill */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PEACE OF MIND ASSURED
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tight">
              Designed Explicitly for International Travelers
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
              We resolve all traditional challenges tourists face when renting a vehicle in Sri Lanka,
              from complex foreign permit validation to airport logistics.
            </p>
          </div>

          {/* WhatsApp Support Pill */}
          <a
            href="https://wa.me/94714877742"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white px-5 py-3 rounded-full font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 shrink-0 w-full sm:w-auto min-h-[44px]"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-emerald-100 font-extrabold leading-none">
                Need Help? Chat Now
              </span>
              <span className="text-sm font-black leading-tight">
                +9471 487 7742
              </span>
            </div>
          </a>
        </div>

        {/* 3 Cards Grid - Security deposit card removed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Driving Permit */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <FileBadge className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2.5">
                No Local Driving Permit?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Sri Lanka requires an official AAC endorsement for legal car use. We handle all the
                documentation works in advance and handover the verified driving permit directly to you
                upon landing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onOpenPermitModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer group-hover:translate-x-1 duration-200 min-h-[44px]"
              >
                <span>IDP / AAC CERTIFIED</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: 24/7 Islandwide Emergency */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2.5">
                24/7 Islandwide Assistance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Travel with total peace of mind across Sri Lanka. We are always ready to help! If you face
                any vehicle mechanical issues, road obstacles, or local strikes and public troubles
                (වර්ජන කරදර), our friendly emergency response team is just a call away with instant
                on-site assistance and vehicle replacement.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onOpenEmergencyInfo}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer group-hover:translate-x-1 duration-200 min-h-[44px]"
              >
                <span>INSTANT REPLACEMENT CAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Terminal Gate Handover */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <KeyRound className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2.5">
                BIA Terminal Gate Handover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                No dragging luggage across shuttle buses or dodging touts outside. Our uniformed
                representative awaits you directly at the Colombo Katunayake arrivals lobby with your
                customised name card.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onOpenAirportInfo}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors cursor-pointer group-hover:translate-x-1 duration-200 min-h-[44px]"
              >
                <span>DIRECT CURBSIDE DRIVE-OFF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
