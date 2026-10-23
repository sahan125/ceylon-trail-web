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
  katunayake: { lat: 7.1808, lng: 79.8841, description: "Colombo Bandaranaike International Airport (CMB / BIA)" },
  airport: { lat: 7.1808, lng: 79.8841, description: "Colombo Bandaranaike International Airport (CMB / BIA)" },
  "colombo airport": { lat: 7.1808, lng: 79.8841, description: "Colombo Bandaranaike International Airport (CMB / BIA)" },
  "bandaranaike international airport": { lat: 7.1808, lng: 79.8841, description: "Colombo Bandaranaike International Airport (CMB / BIA)" },
  "colombo bandaranaike international airport": { lat: 7.1808, lng: 79.8841, description: "Colombo Bandaranaike International Airport (CMB / BIA)" },
};

export const AIRPORT_START_WAYPOINT: Waypoint = {
  name: "Colombo Bandaranaike International Airport",
  lat: 7.1808,
  lng: 79.8841,
  description: "Airport Meet & Greet, Vehicle Delivery & Tour Start",
};

export const AIRPORT_END_WAYPOINT: Waypoint = {
  name: "Colombo Bandaranaike International Airport",
  lat: 7.1775,
  lng: 79.8885,
  description: "Airport Terminal Handover & Flight Departure Gate",
};

function ensureAirportRoundTrip(stops: Waypoint[]): Waypoint[] {
  if (!stops || stops.length === 0) {
    return [AIRPORT_START_WAYPOINT, AIRPORT_END_WAYPOINT];
  }

  const result = [...stops];

  // 1. Ensure Start is Colombo Bandaranaike International Airport
  const first = result[0];
  const isFirstAirport =
    first.name.toLowerCase().includes("airport") ||
    first.name.toLowerCase().includes("bandaranaike") ||
    first.name.toLowerCase().includes("katunayake") ||
    (Math.abs(first.lat - 7.1808) < 0.05 && Math.abs(first.lng - 79.8841) < 0.05);

  if (!isFirstAirport) {
    result.unshift(AIRPORT_START_WAYPOINT);
  } else {
    result[0] = {
      ...result[0],
      name: "Colombo Bandaranaike International Airport",
      description: result[0].description || AIRPORT_START_WAYPOINT.description,
    };
  }

  // 2. Ensure End is Colombo Bandaranaike International Airport
  const last = result[result.length - 1];
  const isLastAirport =
    result.length > 1 &&
    (last.name.toLowerCase().includes("airport") ||
      last.name.toLowerCase().includes("bandaranaike") ||
      last.name.toLowerCase().includes("katunayake") ||
      (Math.abs(last.lat - 7.1775) < 0.05 && Math.abs(last.lng - 79.8885) < 0.05));

  if (!isLastAirport) {
    result.push(AIRPORT_END_WAYPOINT);
  } else if (result.length > 1) {
    result[result.length - 1] = {
      ...result[result.length - 1],
      name: "Colombo Bandaranaike International Airport",
      description: result[result.length - 1].description || AIRPORT_END_WAYPOINT.description,
    };
  }

  return result;
}

export function getWaypointsForTour(tour?: TourPackage | null): Waypoint[] {
  if (!tour) {
    return [
      AIRPORT_START_WAYPOINT,
      { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Temple of the Sacred Tooth Relic" },
      { name: "Horton Plains National Park", lat: 6.8016, lng: 80.8034, description: "World's End & Baker's Falls" },
      { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Nine Arch Bridge & Ella Gap" },
      { name: "Little Adam's Peak", lat: 6.8737, lng: 81.0558, description: "Scenic Mountain Hiking Trek" },
      AIRPORT_END_WAYPOINT,
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
      AIRPORT_START_WAYPOINT,
      { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Cultural Capital & Temple of the Tooth" },
      { name: "Horton Plains National Park", lat: 6.8016, lng: 80.8034, description: "Cloud Forest Plateau & World's End" },
      { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Demodara Nine Arch Bridge & Waterfalls" },
      { name: "Little Adam's Peak", lat: 6.8737, lng: 81.0558, description: "Panoramic Hiking Summit over Tea Valleys" },
      AIRPORT_END_WAYPOINT,
    ];
  }

  // 2. Explicit Check for "Classic Ceylon Explorer" (or id ending in 01)
  if (
    titleLower.includes("classic ceylon") ||
    titleLower.includes("explorer") ||
    idLower.includes("tour-ceylon-01")
  ) {
    return [
      AIRPORT_START_WAYPOINT,
      { name: "Negombo", lat: 7.2083, lng: 79.8358, description: "Coastal Canal Town & Lagoon" },
      { name: "Sigiriya", lat: 7.957, lng: 80.7603, description: "Ancient Rock Fortress Citadel" },
      { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Sacred Tooth Relic & Peradeniya Gardens" },
      { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, description: "Highland Tea Country & Misty Peaks" },
      { name: "Galle", lat: 6.0535, lng: 80.221, description: "Colonial Dutch Fortress & Ramparts" },
      AIRPORT_END_WAYPOINT,
    ];
  }

  // 3. Explicit Check for "Grand Island Grand Loop" (or id ending in 03)
  if (
    titleLower.includes("grand island") ||
    titleLower.includes("grand loop") ||
    idLower.includes("tour-ceylon-03")
  ) {
    return [
      AIRPORT_START_WAYPOINT,
      { name: "Anuradhapura", lat: 8.3114, lng: 80.4037, description: "Ancient Sacred City & Monasteries" },
      { name: "Trincomalee", lat: 8.5874, lng: 81.2152, description: "Nilaveli Beach & Pigeon Island" },
      { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Scenic Mountain Valleys & Ravana Falls" },
      { name: "Yala National Park", lat: 6.3686, lng: 81.5204, description: "4x4 Leopard Safari Expedition" },
      { name: "Galle", lat: 6.0535, lng: 80.221, description: "Southern Ocean Fortress Sunset" },
      AIRPORT_END_WAYPOINT,
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
    return ensureAirportRoundTrip(matchedWaypoints);
  }

  // Default fallback if unknown custom tour
  return [
    AIRPORT_START_WAYPOINT,
    { name: "Kandy", lat: 7.2906, lng: 80.6337, description: "Sacred City & Cultural Heart" },
    { name: "Horton Plains National Park", lat: 6.8016, lng: 80.8034, description: "World's End Plateau" },
    { name: "Ella", lat: 6.8667, lng: 81.0466, description: "Demodara Railway & Scenic Gap" },
    { name: "Little Adam's Peak", lat: 6.8737, lng: 81.0558, description: "Hiking Summit" },
    AIRPORT_END_WAYPOINT,
  ];
}

const CARTO_API_KEY =
  process.env.NEXT_PUBLIC_CARTO_API_KEY || "cb1_4sl4_1_186d138aad7484b40b6d85de";

interface TourRouteMapProps {
  tour: TourPackage | null;
  className?: string;
}

export const TourRouteMap: React.FC<TourRouteMapProps> = ({ tour, className = "" }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [mapStyle, setMapStyle] = useState<"dark" | "voyager">("dark");
  const [activeWaypoint, setActiveWaypoint] = useState<number | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const waypoints = getWaypointsForTour(tour);

  // Switch basemap layer dynamically when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const newTileUrl =
        mapStyle === "voyager"
          ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`
          : `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;

      const newTileLayer = L.tileLayer(newTileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
        minZoom: 6,
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newTileLayer;
    });
  }, [mapStyle]);

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

      // 1. Center of Sri Lanka with country-level zoom (zoom 7 to 8)
      const sriLankaCenter: [number, number] = [7.8731, 80.7718];
      const countryZoom = 7.4;

      const map = L.map(mapContainerRef.current, {
        center: sriLankaCenter,
        zoom: countryZoom,
        minZoom: 6,
        maxZoom: 18,
        scrollWheelZoom: false, // Prevent page scroll interception
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // 2. CartoDB Basemap Tile Layer (Authenticated with API Key)
      const initialTileUrl =
        mapStyle === "voyager"
          ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`
          : `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;

      const initialTileLayer = L.tileLayer(initialTileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
        minZoom: 6,
      }).addTo(map);

      tileLayerRef.current = initialTileLayer;

      // 3. Bright Glowing Light Route Polyline (Bright Cyan '#38bdf8')
      const latLngs: [number, number][] = waypoints.map((w) => [w.lat, w.lng]);

      // Outer atmospheric glowing halo
      L.polyline(latLngs, {
        color: "#38bdf8",
        weight: 10,
        opacity: 0.3,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Main bright cyan route line
      L.polyline(latLngs, {
        color: "#38bdf8",
        weight: 4,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "6, 8",
      }).addTo(map);

      // Inner white core filament for neon trajectory
      L.polyline(latLngs, {
        color: "#f0f9ff",
        weight: 1.5,
        opacity: 0.85,
        dashArray: "6, 8",
      }).addTo(map);

      // 4. Sequential Light-Colored Destination Markers with Dark Numbers
      const markers: any[] = [];
      waypoints.forEach((loc, index) => {
        const isStart = index === 0;
        const isEnd = index === waypoints.length - 1;

        // Light-colored backgrounds (bright white / warm light yellow)
        const markerBg = isStart ? "#ffffff" : isEnd ? "#fef08a" : "#ffffff";
        const accentBorder = isStart ? "#38bdf8" : isEnd ? "#fbbf24" : "#38bdf8";

        const customIcon = L.divIcon({
          className: "leaflet-tour-waypoint-marker",
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background-color: ${markerBg};
              color: #08101e;
              font-family: ui-sans-serif, system-ui, sans-serif;
              font-size: 13px;
              font-weight: 900;
              box-shadow: 0 0 14px rgba(56, 189, 248, 0.65), 0 4px 12px rgba(0,0,0,0.85);
              border: 2.5px solid ${accentBorder};
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              ${index + 1}
              <div style="
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 6px solid ${markerBg};
              "></div>
            </div>
          `,
          iconSize: [32, 38],
          iconAnchor: [16, 38],
          popupAnchor: [0, -38],
        });

        const popupHtml = `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px 4px; min-width: 180px; background-color: #08101e; color: #ffffff;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${accentBorder};">
                ${isStart ? "🚩 Tour Start (Arrivals)" : isEnd ? "🏁 Tour Return (Departures)" : `📍 Stop ${index + 1} of ${waypoints.length}`}
              </span>
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #ffffff; line-height: 1.3;">
              ${loc.name}
            </div>
            ${
              loc.description
                ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 4px; line-height: 1.35;">${loc.description}</div>`
                : ""
            }
            <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 6px;">
              GPS: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}
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

      // 5. Initial country-level view centered over Sri Lanka (zoom 7 to 8)
      map.setView(sriLankaCenter, countryZoom);

      // Handle container sizing inside modals/animating elements
      const resizeTimer1 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.setView(sriLankaCenter, countryZoom);
        }
      }, 150);

      const resizeTimer2 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.setView(sriLankaCenter, countryZoom);
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
      mapInstanceRef.current.setView([target.lat, target.lng], 11, { animate: true });
    }
  };

  const handleResetView = () => {
    setActiveWaypoint(null);
    if (mapInstanceRef.current) {
      const sriLankaCenter: [number, number] = [7.8731, 80.7718];
      mapInstanceRef.current.setView(sriLankaCenter, 7.4, { animate: true });
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Map Control Bar & Waypoint Quick Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Navigation className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span>Interactive Route Map</span>
          <span className="text-[10px] text-slate-500 font-medium">
            (Entire Island View • {waypoints.length} Stops)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Map Style Switcher (Dark Matter / Voyager) */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setMapStyle("dark")}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                mapStyle === "dark"
                  ? "bg-[#08101E] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dark Matter
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("voyager")}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                mapStyle === "voyager"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Voyager
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetView}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-sky-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-slate-200"
          >
            <Compass className="w-3 h-3 text-sky-500" />
            <span className="hidden sm:inline">Sri Lanka Island View</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Responsive Map Container with Dark Backdrop */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-[#08101E]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Ambient Loading Placeholder */}
        {!isMapReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#08101E] text-slate-400 text-xs font-medium">
            Loading interactive route map...
          </div>
        )}

        {/* Mini Map Legend Overlay */}
        <div className="absolute bottom-2.5 right-2.5 z-20 bg-[#08101E]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-md text-[10px] text-slate-200 flex items-center gap-3 pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#38bdf8]" /> Start
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#38bdf8]" /> Stops
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fef08a] border-2 border-[#fbbf24]" /> Finish
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
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              activeWaypoint === idx
                ? "bg-sky-50 text-sky-700 border-sky-300 shadow-2xs"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black text-slate-950 bg-white ${
                idx === 0
                  ? "border border-[#38bdf8]"
                  : idx === waypoints.length - 1
                  ? "bg-[#fef08a] border border-[#fbbf24]"
                  : "border border-[#38bdf8]"
              }`}
            >
              {idx + 1}
            </span>
            <span>
              {idx === 0
                ? "Colombo Airport (Start)"
                : idx === waypoints.length - 1
                ? "Colombo Airport (Return)"
                : wp.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
