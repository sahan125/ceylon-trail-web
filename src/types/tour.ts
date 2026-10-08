export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  route_locations: string | string[];
  description: string;
  highlights: string[];
  inclusions?: string[];
  price: number;
  image_url: string;
  created_at?: string;

  // Frontend display aliases
  route?: string;
  image?: string;
  priceLabel?: string;
  buttonColor?: "navy" | "orange";
}

export function normalizeTourPackage(item: any): TourPackage {
  // Format route string from array or text
  let routeString = "";
  if (Array.isArray(item.route_locations)) {
    routeString = item.route_locations.join(" • ");
  } else if (typeof item.route_locations === "string") {
    // If comma separated, format with bullets
    routeString = item.route_locations.includes("•")
      ? item.route_locations
      : item.route_locations
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
          .join(" • ");
  } else if (item.route) {
    routeString = item.route;
  }

  // Format highlights array
  let highlightsArray: string[] = [];
  if (Array.isArray(item.highlights)) {
    highlightsArray = item.highlights;
  } else if (typeof item.highlights === "string") {
    try {
      const parsed = JSON.parse(item.highlights);
      highlightsArray = Array.isArray(parsed) ? parsed : [item.highlights];
    } catch {
      highlightsArray = item.highlights
        .split("\n")
        .concat(item.highlights.split(","))
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }

  // Format inclusions array
  let inclusionsArray: string[] = [
    "Dedicated Tourist Vehicle",
    "English-fluent Driver",
    "Fuel & Expressway Tolls",
    "Airport Pickup & Drop",
    "Comprehensive Insurance",
    "24/7 Islandwide Backup",
  ];
  if (Array.isArray(item.inclusions) && item.inclusions.length > 0) {
    inclusionsArray = item.inclusions;
  } else if (typeof item.inclusions === "string" && item.inclusions.trim()) {
    try {
      const parsed = JSON.parse(item.inclusions);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inclusionsArray = parsed;
      }
    } catch {
      inclusionsArray = item.inclusions
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }

  const image = item.image_url || item.image || "/images/sigiriya.jpg";

  return {
    id: String(item.id),
    title: item.title || "Scenic Tour",
    duration: item.duration || "Multi-day Tour",
    route_locations: item.route_locations || routeString,
    route: routeString,
    description: item.description || "",
    highlights: highlightsArray,
    inclusions: inclusionsArray,
    price: Number(item.price) || 0,
    priceLabel: item.priceLabel || "/ Complete Group",
    image_url: image,
    image: image,
    buttonColor: item.buttonColor || "navy",
    created_at: item.created_at || new Date().toISOString(),
  };
}
