"use client";

import React from "react";
import { X, ShieldCheck, Wrench, Plane, Check, HelpCircle } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "emergency" | "airport" | "terms" | null;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  const contentMap = {
    deposit: {
      title: "Transparent Security Deposits & Zero FX Markups",
      icon: <ShieldCheck className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50",
      content: (
        <>
          <p>
            Unlike many roadside rental companies that take excessive card holds and delay releasing
            funds for weeks, Ceylon Trail provides 100% transparent tourist deposit terms:
          </p>
          <ul className="space-y-2.5 my-3">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Physical FX Cash Deposit Option:</strong> You may place a refundable deposit
                in EUR, USD, GBP, or AUD on handover. The exact physical bank notes are placed in a
                sealed security envelope and handed back to you on vehicle return. Zero conversion loss!
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Auth Card Hold:</strong> If using a credit card, pre-authorizations are
                released immediately upon vehicle inspection upon return.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>No Hidden Surcharges:</strong> What you see on your reservation quote is
                exactly what you pay. No unexpected taxes or swipe fees at the airport.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    emergency: {
      title: "24/7 Islandwide Mechanical Recovery & Backup",
      icon: <Wrench className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50",
      content: (
        <>
          <p>
            Explore Sri Lanka with total confidence. Whether traveling through mountain switchbacks in
            Nuwara Eliya, tea estates in Ella, or remote coastal roads in Yala, our dedicated roadside
            assistance network has you covered.
          </p>
          <ul className="space-y-2.5 my-3">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Instant Replacement Vehicle:</strong> In the rare event of mechanical issues
                or an accident, a replacement vehicle of equal or upgraded class is dispatched
                immediately.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Fast Response Time:</strong> Average assistance arrival under 90 minutes
                anywhere across the island.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Dedicated English Helpline:</strong> Direct hotline and WhatsApp available
                24/7 to guide you with directions, roadside advice, or mechanics.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    airport: {
      title: "Katunayake BIA Airport Terminal Gate Handover",
      icon: <Plane className="w-6 h-6 text-sky-600" />,
      bg: "bg-sky-50",
      content: (
        <>
          <p>
            Your journey begins seamlessly the moment you exit the customs hall at Colombo
            Bandaranaike International Airport (BIA):
          </p>
          <ul className="space-y-2.5 my-3">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Uniformed Meet &amp; Greet:</strong> Our representative waits at the arrivals
                lobby holding a personalized placard with your name.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>No Shuttle Buses:</strong> The vehicle is parked right outside the terminal
                curbside for instant drive-off.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Handover in 10 Minutes:</strong> We verify your AAC permit, complete the 360°
                walkaround, answer any Sri Lankan driving questions, and hand over the keys.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    terms: {
      title: "Rental Terms, Comprehensive Insurance & Policies",
      icon: <HelpCircle className="w-6 h-6 text-slate-700" />,
      bg: "bg-slate-100",
      content: (
        <>
          <p className="font-semibold text-slate-900">
            Official SLTDA Tourist Rental Guidelines:
          </p>
          <ul className="space-y-2 my-3">
            <li>• Driver must be at least 21 years of age with a valid domestic driving license.</li>
            <li>• All rentals include full comprehensive third-party and collision cover.</li>
            <li>• Free cancellation is permitted up to 48 hours prior to scheduled pickup.</li>
            <li>• Unlimited mileage included on all multi-day tourist contracts.</li>
            <li>• Dual air conditioning, spare tyre, toolkit, and safety triangles equipped in all vehicles.</li>
          </ul>
        </>
      ),
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 sm:p-7">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${contentMap.bg} flex items-center justify-center`}>
              {contentMap.icon}
            </div>
            <h3 className="text-lg font-black text-slate-950 tracking-tight">
              {contentMap.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-600 leading-relaxed">
          {contentMap.content}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
