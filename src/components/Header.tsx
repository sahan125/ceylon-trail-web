"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  Car,
  FileCheck2,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onOpenQuoteModal: (preset?: { carId?: string; tourId?: string }) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"EN" | "DE" | "FR">("EN");

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Fleet & Rates", href: "#fleet" },
    { name: "Tour Packages", href: "#tours" },
    { name: "Services & Permits", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      {/* 1. Top Notice Bar / Ribbon */}
      <div className="bg-[#08101E] text-white text-[11px] sm:text-[12px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          {/* Left item */}
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 text-amber-400">
              <Car className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-slate-200">
              Free 24/7 BIA Colombo Airport Terminal Handover
            </span>
          </div>

          {/* Center item */}
          <div className="hidden lg:flex items-center gap-2 text-slate-300">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Free issuing of Sri Lanka Driving Permits & IAC/IDP Handed on Arrival
            </span>
          </div>

          {/* Right item */}
          <div className="flex items-center gap-3 text-xs ml-auto sm:ml-0">
            <a
              href="https://wa.me/94718905282"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors text-emerald-300 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hotline & WhatsApp: +94 71 890 5282</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SLTDA Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-linear-to-br from-slate-900 to-[#08101E] flex flex-col items-center justify-center text-white shadow-md border border-slate-700/50">
              <span className="text-base font-black tracking-widest text-amber-400 leading-none">
                CT
              </span>
              <span className="text-[7px] text-slate-300 tracking-tighter uppercase font-semibold">
                LANKA
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-black text-xl tracking-tight text-slate-950 font-sans group-hover:text-orange-600 transition-colors">
                  CEYLON TRAIL
                </span>
              </div>
              <span className="text-[9.5px] uppercase tracking-wider font-bold text-slate-500">
                Sri Lanka Tourist Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-7 text-sm font-semibold text-slate-700">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-orange-600 py-1 ${
                  idx === 0
                    ? "text-slate-950 font-bold border-b-2 border-orange-500"
                    : "text-slate-600"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Elements */}
          <div className="hidden md:flex items-center gap-4">
            {/* WhatsApp Quick Link */}
            <a
              href="https://wa.me/94718905282"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 text-xs font-semibold transition-all shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                <Phone className="w-2.5 h-2.5 fill-current" />
              </div>
              <span>+94 71 890 5282</span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 text-xs font-semibold text-slate-500 bg-slate-50">
              {(["EN", "DE", "FR"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLang(lang)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    currentLang === lang
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "hover:text-slate-900"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Instant Quote CTA */}
            <button
              onClick={() => onOpenQuoteModal()}
              className="flex items-center gap-2 bg-[#EA580C] hover:bg-[#C2410C] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Instant Quote</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenQuoteModal()}
              className="bg-[#EA580C] text-white px-3 py-1.5 rounded-full font-bold text-xs"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 font-semibold text-slate-800 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-orange-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
            <a
              href="https://wa.me/94718905282"
              className="flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp: +94 71 890 5282
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full bg-[#EA580C] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider"
            >
              Get Instant Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
