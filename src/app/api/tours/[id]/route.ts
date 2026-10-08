import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getFallbackTours, saveFallbackTours } from "@/lib/toursStore";
import { normalizeTourPackage } from "@/types/tour";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from("tour_packages")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, data: normalizeTourPackage(data) });
      }
    } catch (err) {}

    // 2. Fallback
    const tours = await getFallbackTours();
    const tour = tours.find((t) => t.id === id);
    if (!tour) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: tour });
  } catch (error) {
    console.error("GET /api/tours/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tour" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updatePayload: any = {};
    if (body.title !== undefined) updatePayload.title = body.title;
    if (body.duration !== undefined) updatePayload.duration = body.duration;
    if (body.route_locations !== undefined) {
      updatePayload.route_locations = typeof body.route_locations === "string"
        ? body.route_locations
        : (body.route_locations || []).join(", ");
    }
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.price !== undefined) updatePayload.price = Number(body.price);
    if (body.image_url !== undefined) updatePayload.image_url = body.image_url;
    if (body.highlights !== undefined) updatePayload.highlights = body.highlights;
    if (body.inclusions !== undefined) updatePayload.inclusions = body.inclusions;

    // 1. Update in Supabase
    try {
      await supabase.from("tour_packages").update(updatePayload).eq("id", id);
    } catch (err) {
      console.warn("Supabase tour update warning:", err);
    }

    // 2. Update in fallback store
    const current = await getFallbackTours();
    const idx = current.findIndex((t) => t.id === id);
    if (idx !== -1) {
      current[idx] = normalizeTourPackage({ ...current[idx], ...updatePayload });
      await saveFallbackTours(current);
    }

    return NextResponse.json({
      success: true,
      message: "Tour package updated successfully",
      data: idx !== -1 ? current[idx] : updatePayload,
    });
  } catch (error) {
    console.error("PATCH /api/tours/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update tour package" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    // 1. Delete in Supabase
    try {
      await supabase.from("tour_packages").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase tour delete warning:", err);
    }

    // 2. Delete from fallback store
    const current = await getFallbackTours();
    const filtered = current.filter((t) => t.id !== id);
    await saveFallbackTours(filtered);

    return NextResponse.json({
      success: true,
      message: "Tour package deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/tours/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete tour package" }, { status: 500 });
  }
}
