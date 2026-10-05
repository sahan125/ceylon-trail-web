import fs from "fs/promises";
import path from "path";
import { Booking, BookingStatus, BookingStats } from "@/types/booking";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-2026-001",
    clientName: "Lukas Weber",
    phone: "+49 170 1234567",
    email: "lukas.weber@example.de",
    vehicleId: "raize-turbo",
    vehicleName: "Toyota Raize Turbo",
    vehicleCategory: "COMPACT SUV",
    rentalType: "self",
    location: "Bandaranaike Intl. Airport (BIA)",
    pickupDate: "2026-04-10",
    pickupTime: "10:00 AM",
    returnDate: "2026-04-22",
    returnTime: "04:00 PM",
    days: 12,
    totalCost: 580,
    needAacPermit: true,
    notes: "Requires curbside handover upon flight arrival at BIA. German driving license copy ready.",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "BK-2026-002",
    clientName: "Sarah & James P.",
    phone: "+44 7911 123456",
    email: "sarah.james@example.co.uk",
    vehicleId: "axio-hybrid",
    vehicleName: "Toyota Axio Hybrid",
    vehicleCategory: "COMFORT SEDAN",
    rentalType: "chauffeur",
    location: "Bandaranaike Intl. Airport (BIA)",
    pickupDate: "2026-04-12",
    pickupTime: "08:00 AM",
    returnDate: "2026-04-20",
    returnTime: "06:00 PM",
    days: 8,
    totalCost: 504,
    needAacPermit: false,
    notes: "Family trip with 2 large suitcases. Requested English fluent chauffeur guide.",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: "BK-2026-003",
    clientName: "David Miller",
    phone: "+61 412 345 678",
    email: "david.miller@example.com.au",
    vehicleId: "hiace-kdh",
    vehicleName: "Toyota HiAce KDH",
    vehicleCategory: "LUXURY TOUR VAN",
    rentalType: "chauffeur",
    location: "Bandaranaike Intl. Airport (BIA)",
    pickupDate: "2026-04-15",
    pickupTime: "02:00 PM",
    returnDate: "2026-04-25",
    returnTime: "10:00 AM",
    days: 10,
    totalCost: 940,
    needAacPermit: false,
    notes: "Group of 6 adults heading to Ella and Yala National Park.",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "BK-2026-004",
    clientName: "Elena Rostova",
    phone: "+33 6 12 34 56 78",
    email: "elena.rostova@example.fr",
    vehicleId: "wagon-r",
    vehicleName: "Suzuki Wagon R FX",
    vehicleCategory: "COMPACT HYBRID",
    rentalType: "self",
    location: "Negombo Beach Hub",
    pickupDate: "2026-04-18",
    pickupTime: "10:00 AM",
    returnDate: "2026-04-22",
    returnTime: "04:00 PM",
    days: 4,
    totalCost: 140,
    needAacPermit: true,
    notes: "Requires AAC permit endorsement before arrival.",
    status: "Pending",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_BOOKINGS, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error ensuring bookings file:", error);
  }
}

export async function getBookings(): Promise<Booking[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const bookings: Booking[] = JSON.parse(raw);
    // Sort newest first
    return bookings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error reading bookings:", error);
    return INITIAL_BOOKINGS;
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = await getBookings();
  return bookings.find((b) => b.id === id) || null;
}

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt" | "status"> & { status?: BookingStatus }
): Promise<Booking> {
  await ensureDataFile();
  const bookings = await getBookings();

  const newId = `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, "0")}`;
  const newBooking: Booking = {
    ...data,
    id: newId,
    status: data.status || "Pending",
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(newBooking);
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | null> {
  await ensureDataFile();
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === id);

  if (idx === -1) {
    return null;
  }

  bookings[idx].status = status;
  bookings[idx].updatedAt = new Date().toISOString();

  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  return bookings[idx];
}

export async function deleteBooking(id: string): Promise<boolean> {
  await ensureDataFile();
  const bookings = await getBookings();
  const filtered = bookings.filter((b) => b.id !== id);

  if (filtered.length === bookings.length) {
    return false;
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function getBookingStats(): Promise<BookingStats> {
  const bookings = await getBookings();
  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status === "Confirmed")
      .reduce((sum, b) => sum + (b.totalCost || 0), 0),
  };
}
