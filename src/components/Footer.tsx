"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Star,
  Lock,
  CreditCard,
} from "lucide-react";

interface FooterProps {
  onOpenPermitModal: () => void;
  onOpenTermsModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPermitModal,
  onOpenTermsModal,
}) => {
  return (
    <footer id="contact" className="w-full bg-[#08101E] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand Info (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/95 p-1 rounded-xl shadow-xs inline-flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Lanka Trail"
                  width={60}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                lankatrails.lk
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Premier tourist mobility car rentals and curated journeys in Sri Lanka. Providing
              international visitors with guaranteed pricing, full comprehensive insurance, BIA
              airport terminal gate handovers, and prompt driving permit processing.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Comprehensive Tourist Insurance</span>
            </div>
          </div>

          {/* Col 2: Airport Hub & Office (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Operations &amp; Contact
            </h4>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  Kotawilakanda, Pahamune, Narammala, Sri Lanka
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  BIA Katunayake Airport Arrivals Handover Hub
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/94714877742"
                  className="hover:text-white transition-colors"
                >
                  +9471 487 7742 (Hotline &amp; WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href="mailto:lankatrails.booking@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  lankatrails.booking@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Open 24 Hours / 7 Days a Week</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links (Span 2) - Admin link removed */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>

            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <a href="#fleet" className="hover:text-orange-400 transition-colors">
                  Fleet &amp; Rates
                </a>
              </li>
              <li>
                <a href="#tours" className="hover:text-orange-400 transition-colors">
                  Tour Packages
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenPermitModal}
                  className="hover:text-orange-400 transition-colors text-left cursor-pointer"
                >
                  Driving Permits &amp; AAC
                </button>
              </li>
              <li>
                <a href="#services" className="hover:text-orange-400 transition-colors">
                  BIA Airport Handover
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTermsModal}
                  className="hover:text-orange-400 transition-colors text-left cursor-pointer"
                >
                  Rental Terms &amp; Policies
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trusted Standards & Badges (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Trusted Tourist Standards
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Transparent transactions with trusted payment handling, roadside support, and verified
              tourist services.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold text-slate-200">
              <div className="bg-slate-800/80 px-2 py-1.5 rounded border border-slate-700/60 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Visa / Mastercard</span>
              </div>
              <div className="bg-slate-800/80 px-2 py-1.5 rounded border border-slate-700/60 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL 256-Bit</span>
              </div>
              <div className="bg-slate-800/80 px-2 py-1.5 rounded border border-slate-700/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>No Hidden Fees</span>
              </div>
              <div className="bg-slate-800/80 px-2 py-1.5 rounded border border-slate-700/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Full Comprehensive Cover</span>
              </div>
            </div>

            {/* Stars rating badge */}
            <div className="pt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <span className="text-xs font-black text-white">
                4.9 / 5.0
              </span>
              <span className="text-[11px] text-slate-300">
                (Tourist Verified Service)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div>
            © 2026 lankatrails.lk. All rights reserved.
          </div>

          <div className="flex items-center gap-5">
            <button onClick={onOpenTermsModal} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenTermsModal} className="hover:text-white transition-colors cursor-pointer">
              Terms &amp; Conditions
            </button>
            <span>•</span>
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
