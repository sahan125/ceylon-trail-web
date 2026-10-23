"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Maximize2, Compass } from "lucide-react";
import { TourPackage } from "@/types/tour";

export interface Waypoint {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

// Known coordinates across Sri Lanka tourist circuits
const SRI_LANKA_COORDINATES: Record<string, { lat: number; lng: number; description?: string }> = {
  kandy: { lat: 7.2906, lng: 80.6337, description: "Temple of the Sacred Tooth Relic & Royal Botanic Gardens" },
  "horton plains": { lat: 6.8016, lng: 80.8034, description: "Horton Plains National Park & World's End" },
  "horton plains national park": { lat: 6.8016, lng: 80.8034, description: "Horton Plains National Park & World's End" },
  ella: { lat: 6.8667, lng: 81.0466, description: "Nine Arch Demodara Bridge & Misty Mountain Pass" },
  "little adam's peak": { lat: 6.8737, lng: 81.0558, description: "Panoramic Hiking Viewpoint over Ella Gap" },
  negombo: { lat: 7.2083, lng: 79.8358, description: "Coastal Dutch Canal Gateway to Airport" },
  sigiriya: { lat: 7.957, lng: 80.7603, description: "Ancient 5th Century Lion Rock Citadel" },
  "nuwara eliya": { lat: 6.9497, lng: 80.7891, description: "High-Altitude Tea Estates & Gregory Lake" },
  galle: { lat: 6.0535, lng: 80.221, description: "UNESCO World Heritage Dutch Fortress & Lighthouse" },
  anuradhapura: { lat: 8.3114, lng: 80.4037, description: "Sacred Ancient Kingdom & Giant Stupas" },
  trincomalee: { lat: 8.5874, lng: 81.2152, description: "Nilaveli Beaches & Koneswaram Temple" },
  yala: { lat: 6.3686, lng: 81.5204, description: "Yala National Park Wild Leopard Safari" },
  "yala national park": { lat: 6.3686, lng: 81.5204, description: "Yala National Park Wild Leopard Safari" },
  mirissa: { lat: 5.9483, lng: 80.4578, description: "Coconut Tree Hill & Whale Watching Bay" },
  colombo: { lat: 6.9271, lng: 79.8612, description: "Commercial Capital & Ocean Promenade" },
  dambulla: { lat: 7.8731, lng: 80.6517, description: "Golden Royal Rock Cave Temple" },
  polonnaruwa: { lat: 7.9403, lng: 81.0188, description: "Medieval Royal Capital & Gal Vihara" },
  bentota: { lat: 6.4256, lng: 79.9982, description: "Golden Beach & Watersports Lagoon" },
  katunayake: { lat: 7.1693, lng: 79.8886, description: "Bandaranaike International Airport (BIA)" },
};

export function getWaypointsForTour(tour?: TourPackage | null): Waypoint[] {
  if (!tour) {
    return [
      { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Temple of the Sacred Tooth Relic" },
      { name: "Horton Plains National Park", lat: 6.8016, lng: 80.8034, description: "World's End & Baker's Falls" },
      { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Nine Arch Bridge & Ella Gap" },
      { name: "Little Adam's Peak", lat: 6.8737, lng: 81.0558, description: "Scenic Mountain Hiking Trek" },
    ];
  }

  const titleLower = (tour.title || "").toLowerCase();
  const idLower = (tour.id || "").toLowerCase();

  // 1. Explicit Check for "Hill Country & Tea Trails" (or id ending in 02)
  if (
    titleLower.includes("hill country") ||
    titleLower.includes("tea trails") ||
    idLower.includes("tour-ceylon-02")
  ) {
    return [
      { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Cultural Capital & Temple of the Tooth" },
      { name: "Horton Plains National Park", lat: 6.8016, lng: 80.8034, description: "Cloud Forest Plateau & World's End" },
      { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Demodara Nine Arch Bridge & Waterfalls" },
      { name: "Little Adam's Peak", lat: 6.8737, lng: 81.0558, description: "Panoramic Hiking Summit over Tea Valleys" },
    ];
  }

  // 2. Explicit Check for "Classic Ceylon Explorer" (or id ending in 01)
  if (
    titleLower.includes("classic ceylon") ||
    titleLower.includes("explorer") ||
    idLower.includes("tour-ceylon-01")
  ) {
    return [
      { name: "Negombo", lat: 7.2083, lng: 79.8358, description: "Coastal Canal Town & BIA Airport Gate" },
      { name: "Sigiriya", lat: 7.957, lng: 80.7603, description: "Ancient Rock Fortress Citadel" },
      { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Sacred Tooth Relic & Peradeniya Gardens" },
      { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, description: "Highland Tea Country & Misty Peaks" },
      { name: "Galle", lat: 6.0535, lng: 80.221, description: "Colonial Dutch Fortress & Ramparts" },
    ];
  }

  // 3. Explicit Check for "Grand Island Grand Loop" (or id ending in 03)
  if (
    titleLower.includes("grand island") ||
    titleLower.includes("grand loop") ||
    idLower.includes("tour-ceylon-03")
  ) {
    return [
      { name: "Anuradhapura", lat: 8.3114, lng: 80.4037, description: "Ancient Sacred City & Monasteries" },
      { name: "Trincomalee", lat: 8.5874, lng: 81.2152, description: "Nilaveli Beach & Pigeon Island" },
      { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Scenic Mountain Valleys & Ravana Falls" },
      { name: "Yala National Park", lat: 6.3686, lng: 81.5204, description: "4x4 Leopard Safari Expedition" },
      { name: "Galle", lat: 6.0535, lng: 80.221, description: "Southern Ocean Fortress Sunset" },
    ];
  }

  // 4. Dynamic Waypoint Parsing from route string
  const rawLocations = tour.route || tour.route_locations || "";
  const parts = (Array.isArray(rawLocations) ? rawLocations : rawLocations.split(/[,•]/))
    .map((s) => s.trim())
    .filter(Boolean);

  const matchedWaypoints: Waypoint[] = [];
  for (const part of parts) {
    const key = part.toLowerCase();
    for (const [coordKey, coord] of Object.entries(SRI_LANKA_COORDINATES)) {
      if (key.includes(coordKey) || coordKey.includes(key)) {
        matchedWaypoints.push({
          name: part,
          lat: coord.lat,
          lng: coord.lng,
          description: coord.description,
        });
        break;
      }
    }
  }

  if (matchedWaypoints.length >= 2) {
    return matchedWaypoints;
  }

  // Default fallback if unknown custom tour
  return [
    { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Sacred City & Cultural Heart" },
    { name: "Horton Plains National Park", lat: 6.8016, lng: 80.8034, description: "World's End Plateau" },
    { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Demodara Railway & Scenic Gap" },
    { name: "Little Adam's Peak", lat: 6.8737, lng: 81.0558, description: "Hiking Summit" },
  ];
}

interface TourRouteMapProps {
  tour: TourPackage | null;
  className?: string;
}

export const TourRouteMap: React.FC<TourRouteMapProps> = ({ tour, className = "" }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<number | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const waypoints = getWaypointsForTour(tour);

  useEffect(() => {
    let isMounted = true;

    // Dynamically load Leaflet on the client side
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map instance if already initialized
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default Sri Lanka center (approx. Dambulla/Central Province)
      const sriLankaCenter: [number, number] = [7.2906, 80.6337];

      // 1. Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: sriLankaCenter,
        zoom: 9,
        scrollWheelZoom: false, // Prevent page scroll interception
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // 2. OpenStreetMap Standard Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        maxZoom: 18,
        minZoom: 6,
      }).addTo(map);

      // 3. Styled Route Polyline
      const latLngs: [number, number][] = waypoints.map((w) => [w.lat, w.lng]);

      // Glow / outer shadow polyline
      L.polyline(latLngs, {
        color: "#EA580C",
        weight: 8,
        opacity: 0.25,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Main vibrant route polyline
      const routeLine = L.polyline(latLngs, {
        color: "#EA580C",
        weight: 4,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "6, 8", // Elegant dashed travel trajectory
      }).addTo(map);

      // 4. Sequential Waypoint Markers with Popups
      const markers: any[] = [];
      waypoints.forEach((loc, index) => {
        const isStart = index === 0;
        const isEnd = index === waypoints.length - 1;
        const badgeColor = isStart ? "#08101E" : isEnd ? "#EA580C" : "#0284C7";

        const customIcon = L.divIcon({
          className: "leaflet-tour-waypoint-marker",
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 30px;
              height: 30px;
              border-radius: 9999px;
              background-color: ${badgeColor};
              color: #ffffff;
              font-family: ui-sans-serif, system-ui, sans-serif;
              font-size: 12px;
              font-weight: 800;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
              border: 2.5px solid #ffffff;
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              ${index + 1}
              <div style="
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 5px solid ${badgeColor};
              "></div>
            </div>
          `,
          iconSize: [30, 35],
          iconAnchor: [15, 35],
          popupAnchor: [0, -35],
        });

        const popupHtml = `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px; min-width: 170px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${badgeColor};">
                ${isStart ? "🚩 Tour Start" : isEnd ? "🏁 Final Destination" : `📍 Stop ${index + 1} of ${waypoints.length}`}
              </span>
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.25;">
              ${loc.name}
            </div>
            ${
              loc.description
                ? `<div style="font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.35;">${loc.description}</div>`
                : ""
            }
            <div style="font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 6px;">
              Coordinates: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}
            </div>
          </div>
        `;

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupHtml, {
            offset: [0, -10],
            closeButton: false,
            className: "modern-tour-popup",
          });

        marker.on("click", () => {
          setActiveWaypoint(index);
        });

        markers.push(marker);
      });

      // 5. Automatically fit bounds to route with responsive padding
      if (latLngs.length > 0) {
        const bounds = routeLine.getBounds();
        map.fitBounds(bounds, {
          padding: [35, 35],
          maxZoom: 12,
        });
      }

      // 6. Handle container sizing inside modals/animating elements
      const resizeTimer1 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds(routeLine.getBounds(), {
            padding: [35, 35],
            maxZoom: 12,
          });
        }
      }, 150);

      const resizeTimer2 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 500);

      setIsMapReady(true);

      return () => {
        clearTimeout(resizeTimer1);
        clearTimeout(resizeTimer2);
      };
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tour]);

  const handleFocusWaypoint = (index: number) => {
    setActiveWaypoint(index);
    const target = waypoints[index];
    if (mapInstanceRef.current && target) {
      mapInstanceRef.current.setView([target.lat, target.lng], 12, { animate: true });
    }
  };

  const handleResetView = () => {
    setActiveWaypoint(null);
    if (mapInstanceRef.current && waypoints.length > 0) {
      import("leaflet").then((L) => {
        const latLngs: [number, number][] = waypoints.map((w) => [w.lat, w.lng]);
        const bounds = L.latLngBounds(latLngs);
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [35, 35],
          maxZoom: 12,
          animate: true,
        });
      });
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Map Control Bar & Waypoint Quick Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Navigation className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>Interactive Route Map</span>
          <span className="text-[10px] text-slate-500 font-medium">
            ({waypoints.length} Tour Stops)
          </span>
        </div>

        <button
          type="button"
          onClick={handleResetView}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-orange-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-slate-200"
        >
          <Compass className="w-3 h-3 text-orange-500" />
          <span>Fit Full Route</span>
        </button>
      </div>

      {/* Responsive Map Container */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Ambient Loading Placeholder */}
        {!isMapReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-medium">
            Loading interactive route map...
          </div>
        )}

        {/* Mini Map Legend Overlay */}
        <div className="absolute bottom-2.5 right-2.5 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs text-[10px] text-slate-700 flex items-center gap-3 pointer-events-none">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#08101E]" /> Start
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> Stops
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#EA580C]" /> Finish
          </span>
        </div>
      </div>

      {/* Waypoint Chips for Quick Selection */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] font-semibold text-slate-500 mr-1">Stops:</span>
        {waypoints.map((wp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleFocusWaypoint(idx)}
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              activeWaypoint === idx
                ? "bg-orange-50 text-orange-700 border-orange-300 shadow-2xs"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white ${
                idx === 0
                  ? "bg-[#08101E]"
                  : idx === waypoints.length - 1
                  ? "bg-[#EA580C]"
                  : "bg-[#0284C7]"
              }`}
            >
              {idx + 1}
            </span>
            <span>{wp.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
