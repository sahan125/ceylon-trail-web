export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

export interface Booking {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: string;
  rentalType: "self" | "chauffeur";
  location: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  days: number;
  totalCost: number;
  needAacPermit: boolean;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  totalRevenue: number;
}
