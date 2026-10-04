"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="Support chat" className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <a
        href="https://wa.me/94718905282"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all transform hover:scale-105"
        title="Chat with Ceylon Trail on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 leading-tight">
            Direct Tourist Support
          </span>
          <span className="text-xs font-black tracking-tight leading-tight">
            WhatsApp Online
          </span>
        </div>
      </a>
    </aside>
  );
};
