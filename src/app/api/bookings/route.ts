import { NextResponse } from "next/server";
import { getBookings, createBooking, getBookingStats } from "@/lib/bookingsStore";
import { BookingStatus } from "@/types/booking";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookingStatus | null;
    const search = searchParams.get("search")?.toLowerCase();

    let bookings = await getBookings();

    if (status && ["Pending", "Confirmed", "Cancelled"].includes(status)) {
      bookings = bookings.filter((b) => b.status === status);
    }

    if (search) {
      bookings = bookings.filter(
        (b) =>
          b.clientName.toLowerCase().includes(search) ||
          b.email.toLowerCase().includes(search) ||
          b.phone.toLowerCase().includes(search) ||
          b.vehicleName.toLowerCase().includes(search) ||
          b.location.toLowerCase().includes(search) ||
          b.id.toLowerCase().includes(search)
      );
    }

    const stats = await getBookingStats();

    return NextResponse.json({
      success: true,
      data: bookings,
      stats,
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      clientName,
      phone,
      email,
      vehicleId,
      vehicleName,
      vehicleCategory,
      rentalType,
      location,
      pickupDate,
      pickupTime = "10:00 AM",
      returnDate,
      returnTime = "04:00 PM",
      days,
      totalCost,
      needAacPermit = false,
      notes,
    } = body;

    if (!clientName || !phone || !vehicleId || !pickupDate || !returnDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking details (clientName, phone, vehicleId, dates)",
        },
        { status: 400 }
      );
    }

    const newBooking = await createBooking({
      clientName,
      phone,
      email: email || "Not provided",
      vehicleId,
      vehicleName: vehicleName || "Vehicle",
      vehicleCategory: vehicleCategory || "Car Rental",
      rentalType: rentalType || "self",
      location: location || "Bandaranaike Intl. Airport (BIA)",
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      days: Number(days) || 1,
      totalCost: Number(totalCost) || 0,
      needAacPermit: Boolean(needAacPermit),
      notes: notes || "",
    });

    // Also persist to Supabase 'bookings' table
    try {
      const { error: sbErr } = await supabase.from("bookings").insert([
        {
          full_name: clientName,
          email: email || "Not provided",
          phone: phone,
          vehicle: vehicleName || "Vehicle",
          pickup_date: pickupDate,
          return_date: returnDate,
          pickup_location: location || "Bandaranaike Intl. Airport (BIA)",
          status: "Pending",
        },
      ]);
      if (sbErr) {
        console.warn("Supabase server insert warning:", sbErr.message);
      }
    } catch (err) {
      console.warn("Supabase server insert error:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking request created successfully and saved to admin store",
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
