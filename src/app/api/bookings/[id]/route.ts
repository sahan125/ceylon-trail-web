import { NextResponse } from "next/server";
import { updateBookingStatus, deleteBooking, getBookingById } from "@/lib/bookingsStore";
import { BookingStatus } from "@/types/booking";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status value. Must be 'Pending', 'Confirmed', or 'Cancelled'",
        },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, status as BookingStatus);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${id} status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const success = await deleteBooking(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
