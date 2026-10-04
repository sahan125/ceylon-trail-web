"use client";

import React from "react";
import { X, FileBadge, Check, ShieldCheck, Clock, MessageCircle } from "lucide-react";

interface PermitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PermitModal: React.FC<PermitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePermitWhatsApp = () => {
    const msg = "Hello Ceylon Trail! I would like assistance with obtaining a legal Sri Lanka Tourist Driving Permit (AAC endorsement). Please let me know what documents you need.";
    window.open(`https://wa.me/94718905282?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileBadge className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Sri Lanka Tourist Driving Permits
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Automobile Association of Ceylon (AAC) Legal Endorsement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs text-slate-600 leading-relaxed">
          <p className="text-slate-800 font-semibold text-sm">
            Can foreigners drive legally in Sri Lanka?
          </p>
          <p>
            Yes! However, Sri Lankan traffic laws require all foreign driver&apos;s license holders or
            International Driving Permits (IDP 1949 or 1968 convention) to hold an official
            endorsement from the Automobile Association of Ceylon (AAC) or DMT Colombo.
          </p>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-amber-900">
            <span className="font-bold block mb-1">
              ✨ Skip The Hassle &amp; Hours in Colombo Government Queues!
            </span>
            <span>
              Ceylon Trail takes care of the entire administrative paperwork prior to your arrival.
              Simply email or WhatsApp a clear photo of your home driver&apos;s license and passport photo
              page. Your verified legal driving permit will be handed over to you directly at the
              Katunayake Airport (BIA) terminal gate!
            </span>
          </div>

          <h4 className="font-bold text-slate-900 text-sm pt-2">
            Required Documents for Permit Issuance:
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Valid National Driver&apos;s License (front &amp; back clear photo)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Passport photo page copy</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Flight arrival details into Colombo Katunayake (BIA)</span>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePermitWhatsApp}
              className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Submit License Via WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
