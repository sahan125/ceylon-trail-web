import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getFallbackTours, saveFallbackTours } from "@/lib/toursStore";
import { normalizeTourPackage, TourPackage } from "@/types/tour";

export async function GET() {
  try {
    // 1. Try Supabase first
    const { data, error } = await supabase
      .from("tour_packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const normalized = data.map(normalizeTourPackage);
      return NextResponse.json({ success: true, data: normalized, source: "supabase" });
    }
  } catch (err) {
    console.warn("Supabase tours fetch exception:", err);
  }

  // 2. Fallback store
  const fallback = await getFallbackTours();
  return NextResponse.json({ success: true, data: fallback, source: "fallback" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      duration,
      route_locations,
      description,
      price,
      image_url,
      highlights,
      inclusions,
    } = body;

    if (!title || !duration || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (title, duration, description)" },
        { status: 400 }
      );
    }

    const newRecord = {
      title,
      duration,
      route_locations: typeof route_locations === "string" ? route_locations : (route_locations || []).join(", "),
      description,
      price: Number(price) || 0,
      image_url: image_url || "/images/sigiriya.jpg",
      highlights: Array.isArray(highlights) ? highlights : [],
      inclusions: Array.isArray(inclusions) && inclusions.length > 0
        ? inclusions
        : [
            "Dedicated Tourist Vehicle",
            "English-fluent Driver",
            "Fuel & Expressway Tolls",
            "Airport Pickup & Drop",
            "Comprehensive Insurance",
            "24/7 Islandwide Backup",
          ],
    };

    let createdId = `tour-${Date.now()}`;
    let insertedData: any = null;

    // 1. Insert into Supabase
    try {
      const { data, error } = await supabase
        .from("tour_packages")
        .insert([newRecord])
        .select();

      if (!error && data && data[0]) {
        insertedData = data[0];
        createdId = String(data[0].id);
      } else if (error) {
        console.warn("Supabase tour insert warning:", error.message);
      }
    } catch (err) {
      console.warn("Supabase tour insert exception:", err);
    }

    // 2. Sync to fallback store
    const current = await getFallbackTours();
    const normalizedNew = normalizeTourPackage({
      ...newRecord,
      id: createdId,
      created_at: new Date().toISOString(),
    });
    current.unshift(normalizedNew);
    await saveFallbackTours(current);

    return NextResponse.json(
      {
        success: true,
        message: "Tour package created successfully",
        data: normalizedNew,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tours error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tour package" },
      { status: 500 }
    );
  }
}
