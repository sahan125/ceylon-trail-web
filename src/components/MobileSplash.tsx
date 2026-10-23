"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export const MobileSplash: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoState, setLogoState] = useState<"enter" | "exit">("enter");
  const [overlayFading, setOverlayFading] = useState(false);

  useEffect(() => {
    // 1. Mobile-only check (< 768px)
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

    // 2. SessionStorage check (once per browser session)
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem("lt_mobile_splash_shown") === "true";
    } catch {
      // Ignore storage access errors in restricted/private modes
    }

    // If desktop or already shown in this session, immediately hide and do not lock scroll
    if (isDesktop || alreadyShown) {
      setIsVisible(false);
      return;
    }

    // Store flag in sessionStorage
    try {
      sessionStorage.setItem("lt_mobile_splash_shown", "true");
    } catch {
      // Ignore
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 3. Lock page scroll while splash is active
    document.body.style.overflow = "hidden";

    if (prefersReducedMotion) {
      // Reduced motion: skip scale/movement animations, perform only a brief gentle fade
      const reducedFadeTimer = setTimeout(() => {
        setOverlayFading(true);
      }, 400);

      const reducedDoneTimer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "";
      }, 700);

      return () => {
        clearTimeout(reducedFadeTimer);
        clearTimeout(reducedDoneTimer);
        document.body.style.overflow = "";
      };
    }

    // Standard 2.5s sequence:
    // - 0s to 0.8s: Logo enters center (fade in + scale up)
    // - 0.8s to 1.6s: Stays in center (~0.8s)
    // - 1.6s to 2.1s: Logo exits (~0.5s fade out + scale down)
    // - 2.1s to 2.5s: Overlay fades out (~0.4s) and DOM removes component
    const logoExitTimer = setTimeout(() => {
      setLogoState("exit");
    }, 1600);

    const overlayFadeTimer = setTimeout(() => {
      setOverlayFading(true);
    }, 2100);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 2500);

    return () => {
      clearTimeout(logoExitTimer);
      clearTimeout(overlayFadeTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] bg-[#08101E] flex flex-col items-center justify-center p-6 md:hidden select-none transition-opacity duration-400 ease-out ${
        overlayFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle ambient brand glow in center */}
      <div className="absolute w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      {/* Centered Logo Container with keyframe animation */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center gap-3.5 ${
          logoState === "enter"
            ? "animate-splash-logo-enter"
            : "animate-splash-logo-exit"
        }`}
      >
        <div className="bg-white p-2.5 rounded-2xl shadow-2xl inline-flex items-center justify-center border border-white/20">
          <Image
            src="/images/logo.png"
            alt="Lankatrails"
            width={140}
            height={90}
            priority
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-black tracking-tight text-white font-sans">
            Lankatrails<span className="text-[#F59E0B]">.lk</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-extrabold mt-0.5">
            Verified Tourist Fleet &amp; Tours
          </span>
        </div>
      </div>
    </div>
  );
};
