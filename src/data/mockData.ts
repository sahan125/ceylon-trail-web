export interface PricingTier {
  days: number;
  label: string;
  mileage: string;
  priceUSD: number;
  extraDayUSD: number;
}

export interface ModelPricingTable {
  category: "Wagon" | "Hatchback" | "Sedan";
  title: string;
  tiers: PricingTier[];
}

export const VEHICLE_PRICING_TABLES: ModelPricingTable[] = [
  {
    category: "Wagon",
    title: "Wagon Car Model Prices",
    tiers: [
      { days: 5, label: "5 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 250, extraDayUSD: 50 },
      { days: 10, label: "10 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 500, extraDayUSD: 45 },
      { days: 15, label: "15 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 725, extraDayUSD: 45 },
      { days: 20, label: "20 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 800, extraDayUSD: 40 },
      { days: 25, label: "25 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 1150, extraDayUSD: 40 },
      { days: 30, label: "30 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 1050, extraDayUSD: 40 },
    ],
  },
  {
    category: "Hatchback",
    title: "Hatchback Car Model Prices",
    tiers: [
      { days: 5, label: "5 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 275, extraDayUSD: 55 },
      { days: 10, label: "10 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 550, extraDayUSD: 55 },
      { days: 15, label: "15 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 825, extraDayUSD: 50 },
      { days: 20, label: "20 Days No mileage restrictions", mileage: "0 km (Unlimited)", priceUSD: 1050, extraDayUSD: 45 },
    ],
  },
  {
    category: "Sedan",
    title: "Sedan Car Model Prices",
    tiers: [
      { days: 5, label: "5 Days No Mileage Restrictions", mileage: "0 km (Unlimited)", priceUSD: 300, extraDayUSD: 60 },
      { days: 10, label: "10 Days No Mileage Restrictions", mileage: "0 km (Unlimited)", priceUSD: 600, extraDayUSD: 55 },
      { days: 15, label: "15 Days No Mileage Restrictions", mileage: "0 km (Unlimited)", priceUSD: 875, extraDayUSD: 55 },
      { days: 20, label: "20 Days No Mileage Restrictions", mileage: "0 km (Unlimited)", priceUSD: 1150, extraDayUSD: 50 },
    ],
  },
];

export interface Vehicle {
  id: string;
  name: string;
  badge: string;
  badgeType: "green" | "blue" | "orange" | "slate";
  metric: string;
  category: string;
  rating: number;
  type: "Hatchbacks" | "Sedans" | "SUV" | "Passenger Vans";
  image: string;
  specs: {
    seats: string;
    transmission: string;
    luggage: string;
    ac: string;
  };
  price: number;
  priceUnit: string;
  pricingCategory?: "Wagon" | "Hatchback" | "Sedan";
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  route: string;
  description: string;
  price: number;
  priceLabel: string;
  image: string;
  featured?: boolean;
  buttonColor?: "navy" | "orange";
  highlights: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  countryCode: "DE" | "GB" | "AU";
  rating: number;
  quote: string;
  tripTag: string;
}

export const VEHICLES: Vehicle[] = [
  {
    id: "wagon-r",
    name: "Suzuki Wagon R FX",
    badge: "TOP HILL ECONOMY",
    badgeType: "green",
    metric: "⛽ 22 km/L",
    category: "WAGON CAR MODEL",
    rating: 4.9,
    type: "Hatchbacks",
    image: "/images/wagon-r.png",
    specs: {
      seats: "4 Seats",
      transmission: "Automatic",
      luggage: "2 Bags",
      ac: "Full A/C",
    },
    price: 25,
    priceUnit: "Per day / Unlimited KM",
    pricingCategory: "Wagon",
  },
  {
    id: "hatchback-swift",
    name: "Suzuki Swift / Alto Hatchback",
    badge: "POPULAR CITY & COAST",
    badgeType: "orange",
    metric: "⛽ 21 km/L",
    category: "HATCHBACK MODEL",
    rating: 4.88,
    type: "Hatchbacks",
    image: "/images/wagon-r.png",
    specs: {
      seats: "4-5 Seats",
      transmission: "Automatic",
      luggage: "2 Bags",
      ac: "Full A/C",
    },
    price: 28,
    priceUnit: "Per day / Unlimited KM",
    pricingCategory: "Hatchback",
  },
  {
    id: "axio-hybrid",
    name: "Toyota Axio Hybrid",
    badge: "TOURIST'S CHOICE",
    badgeType: "blue",
    metric: "⛽ 19 km/L",
    category: "SEDAN CAR MODEL",
    rating: 4.9,
    type: "Sedans",
    image: "/images/axio-sedan.png",
    specs: {
      seats: "5 Seats",
      transmission: "Automatic",
      luggage: "3 Large Bags",
      ac: "Full A/C",
    },
    price: 38,
    priceUnit: "Per day / Unlimited KM",
    pricingCategory: "Sedan",
  },
  {
    id: "raize-turbo",
    name: "Toyota Raize Turbo",
    badge: "IDEAL FOR HILL COUNTRY",
    badgeType: "orange",
    metric: "⤓ 200mm Clearance",
    category: "COMPACT SUV",
    rating: 4.95,
    type: "SUV",
    image: "/images/raize-suv.png",
    specs: {
      seats: "5 Seats",
      transmission: "Automatic",
      luggage: "3 Suitcases",
      ac: "Full A/C",
    },
    price: 45,
    priceUnit: "Per day / Unlimited KM",
  },
  {
    id: "hiace-kdh",
    name: "Toyota HiAce KDH",
    badge: "FAMILY & GROUP",
    badgeType: "slate",
    metric: "👥 Up to 10 Pax",
    category: "LUXURY TOUR VAN",
    rating: 4.98,
    type: "Passenger Vans",
    image: "/images/hiace-van.png",
    specs: {
      seats: "7-10 Seats",
      transmission: "Automatic",
      luggage: "6 Large Bags",
      ac: "Full A/C",
    },
    price: 65,
    priceUnit: "Per day / Unlimited KM",
  },
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: "classic-ceylon",
    title: "Classic Ceylon Explorer",
    duration: "7 Days / 6 Nights",
    route: "Negombo • Kandy • Nuwara Eliya • Galle",
    description:
      "The quintessential first-timer circuit. UNESCO cultural triangle, sacred Kandy relics, misty high-elevation tea plantations, down to southern colonial fortress.",
    price: 490,
    priceLabel: "/ Complete Group",
    image: "/images/sigiriya.jpg",
    buttonColor: "navy",
    highlights: [
      "Sigiriya Rock Fortress sunrise climb",
      "Sacred Temple of the Tooth Relic in Kandy",
      "Scenic tea estate tour & tasting in Nuwara Eliya",
      "St. Clair & Devon Waterfalls panoramic view",
      "UNESCO Galle Dutch Fort sunset walk",
      "Colombo Airport (BIA) VIP Meet & Greet",
    ],
  },
  {
    id: "hill-country",
    title: "Hill Country & Tea Trails",
    duration: "4 Days / 3 Nights",
    route: "Kandy • Ella • Horton Plains • Little Adam's Peak",
    description:
      "Traverse panoramic waterfalls, cool temperate mountain towns, historic British colonial bungalows, and scenic hikes through rolling Ceylon tea valleys.",
    price: 280,
    priceLabel: "/ Complete Group",
    image: "/images/ella-bridge.jpg",
    buttonColor: "navy",
    highlights: [
      "Famous Demodara Nine Arch Bridge in Ella",
      "Little Adam's Peak & Ravana Falls exploration",
      "Horton Plains National Park & World's End trek",
      "Colonial tea factory private tour",
      "Kandy Lake & Royal Botanical Gardens Peradeniya",
    ],
  },
  {
    id: "grand-loop",
    title: "Grand Island Grand Loop",
    duration: "10 Days / 9 Nights",
    route: "Anuradhapura • Trincomalee • Ella • Yala • Galle",
    description:
      "The definitive comprehensive expedition. From northern ancient kingdoms to Eastern secluded surf beaches, wild leopard safaris in Yala, and coastal drives back to BIA Airport.",
    price: 720,
    priceLabel: "/ Complete Group",
    image: "/images/mirissa-beach.jpg",
    featured: true,
    buttonColor: "orange",
    highlights: [
      "Sacred ancient city of Anuradhapura & Polonnaruwa",
      "Pristine beaches and Nilaveli Pigeon Island in Trincomalee",
      "Nine Arch Bridge & Ella gap views",
      "Yala National Park 4x4 wild Leopard & Elephant safari",
      "Mirissa coconut hill & whale watching options",
      "Southern expressway direct drop to Katunayake BIA",
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "lukas",
    name: "Lukas Weber",
    location: "Munich, Germany",
    countryCode: "DE",
    rating: 5,
    quote:
      "We rented the Toyota Raize for 12 days to drive from Colombo to Sigiriya, Nuwara Eliya and Mirissa. Ceylon Trail had our AAC driving permit ready timely and 0 deposit was demanded as $100 USD FX deposit returned. No cash Airport rip-offs with swift. Outstanding service.",
    tripTag: "HIRED: SUV RAIZE • 12 DAYS SELF-DRIVE",
  },
  {
    id: "sarah-james",
    name: "Sarah & James P.",
    location: "Bristol, United Kingdom",
    countryCode: "GB",
    rating: 5,
    quote:
      "We opted for a chauffeur-driven Toyota Sedan for our family trip. Our driver Rohan was courteous, spoke fluent English, knew all the serene spots in Ella without rush, and drove with extreme care. The booking over WhatsApp was effortless.",
    tripTag: "HIRED: SEDAN WITH CHAUFFEUR • 8 DAYS",
  },
];
