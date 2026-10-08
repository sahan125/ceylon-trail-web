"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Check,
  Sparkles,
  Layers,
  Image as ImageIcon,
  MessageCircle,
} from "lucide-react";
import { TourPackage, normalizeTourPackage } from "@/types/tour";
import { supabase } from "@/lib/supabase";
import { TourModal } from "@/components/Modals/TourModal";

interface TourManagementProps {
  showToast: (msg: string) => void;
  supabaseStatus: "connected" | "fallback" | "syncing";
}

const PRESET_IMAGES = [
  { label: "Sigiriya Rock", url: "/images/sigiriya.jpg" },
  { label: "Ella Nine Arch", url: "/images/ella-bridge.jpg" },
  { label: "Mirissa Coast", url: "/images/mirissa-beach.jpg" },
  { label: "Island Scenic", url: "/images/hero-bg.jpg" },
];

export const TourManagement: React.FC<TourManagementProps> = ({
  showToast,
  supabaseStatus,
}) => {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTour, setPreviewTour] = useState<TourPackage | null>(null);

  // Form modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formRoute, setFormRoute] = useState("");
  const [formPrice, setFormPrice] = useState<number | string>(490);
  const [formImageUrl, setFormImageUrl] = useState("/images/sigiriya.jpg");
  const [formDescription, setFormDescription] = useState("");
  const [formHighlights, setFormHighlights] = useState("");
  const [formInclusions, setFormInclusions] = useState("");

  const fetchTours = async () => {
    setLoading(true);
    try {
      // 1. Direct Supabase query
      const { data, error } = await supabase
        .from("tour_packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setTours(data.map(normalizeTourPackage));
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Direct Supabase query exception:", err);
    }

    // 2. Local fallback API
    try {
      const res = await fetch("/api/tours");
      const json = await res.json();
      if (json.success && json.data) {
        setTours(json.data.map(normalizeTourPackage));
      }
    } catch (err) {
      console.error("Local API tour fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();

    // Subscribe to real-time changes on 'tour_packages'
    try {
      const channel = supabase
        .channel("tour_packages-realtime-admin")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tour_packages" },
          () => {
            fetchTours();
            showToast("Tour packages updated in real-time from Supabase!");
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Real-time tour packages subscription error:", err);
    }
  }, []);

  const openAddModal = () => {
    setEditingTour(null);
    setFormTitle("");
    setFormDuration("7 Days / 6 Nights");
    setFormRoute("Negombo, Kandy, Nuwara Eliya, Galle");
    setFormPrice(490);
    setFormImageUrl("/images/sigiriya.jpg");
    setFormDescription(
      "Experience the ultimate Sri Lankan journey traversing ancient kingdoms, rolling highland tea estates, and coastal heritage fortresses."
    );
    setFormHighlights(
      "Climb Sigiriya Rock Fortress\nScenic Kandy to Ella mountain train ride\nTea factory & plantation tour in Nuwara Eliya\nGalle Dutch Fort sunset walking tour"
    );
    setFormInclusions(
      "Private AC tourist vehicle & fuel\nEnglish-fluent chauffeur guide\nExpressway tolls & parking fees\nAirport pickup and drop-off\nComprehensive passenger insurance"
    );
    setIsFormModalOpen(true);
  };

  const openEditModal = (tour: TourPackage) => {
    setEditingTour(tour);
    setFormTitle(tour.title);
    setFormDuration(tour.duration);
    setFormRoute(
      Array.isArray(tour.route_locations)
        ? tour.route_locations.join(", ")
        : tour.route_locations || tour.route || ""
    );
    setFormPrice(tour.price);
    setFormImageUrl(tour.image_url || tour.image || "/images/sigiriya.jpg");
    setFormDescription(tour.description || "");
    setFormHighlights(
      Array.isArray(tour.highlights) ? tour.highlights.join("\n") : ""
    );
    setFormInclusions(
      Array.isArray(tour.inclusions) ? tour.inclusions.join("\n") : ""
    );
    setIsFormModalOpen(true);
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please provide a title for the tour package.");
      return;
    }

    setSubmitting(true);

    const highlightsArray = formHighlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const inclusionsArray = formInclusions
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle.trim(),
      duration: formDuration.trim(),
      route_locations: formRoute.trim(),
      description: formDescription.trim(),
      highlights: highlightsArray,
      inclusions: inclusionsArray,
      price: Number(formPrice) || 0,
      image_url: formImageUrl.trim(),
    };

    if (editingTour) {
      // 1. Update in Supabase
      try {
        const { error } = await supabase
          .from("tour_packages")
          .update(payload)
          .eq("id", editingTour.id);

        if (error) {
          console.warn("Supabase update error:", error.message);
        }
      } catch (err) {
        console.warn("Supabase update error:", err);
      }

      // 2. Local mirror update
      try {
        await fetch(`/api/tours/${editingTour.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {}

      showToast(`Tour package "${formTitle}" updated successfully!`);
    } else {
      // 1. Insert into Supabase
      try {
        const { error } = await supabase
          .from("tour_packages")
          .insert([payload]);

        if (error) {
          console.warn("Supabase insert error:", error.message);
        }
      } catch (err) {
        console.warn("Supabase insert error:", err);
      }

      // 2. Local mirror insert
      try {
        await fetch("/api/tours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {}

      showToast(`New tour package "${formTitle}" added to Supabase!`);
    }

    setSubmitting(false);
    setIsFormModalOpen(false);
    fetchTours();
  };

  const handleDeleteTour = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete tour "${title}"?`)) {
      return;
    }

    // Optimistic UI update
    setTours((prev) => prev.filter((t) => t.id !== id));

    // 1. Direct Supabase delete
    try {
      const { error } = await supabase
        .from("tour_packages")
        .delete()
        .eq("id", id);
      if (error) {
        console.warn("Supabase delete tour error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase delete tour error:", err);
    }

    // 2. Local mirror delete
    try {
      await fetch(`/api/tours/${id}`, { method: "DELETE" });
    } catch (err) {}

    showToast(`Tour "${title}" deleted.`);
  };

  const filteredTours = tours.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const routeStr = Array.isArray(t.route_locations)
      ? t.route_locations.join(" ")
      : t.route_locations || "";
    const highlightsStr = t.highlights?.join(" ") || "";
    return (
      t.title.toLowerCase().includes(q) ||
      t.duration.toLowerCase().includes(q) ||
      routeStr.toLowerCase().includes(q) ||
      highlightsStr.toLowerCase().includes(q)
    );
  });

  const lowestPrice =
    tours.length > 0 ? Math.min(...tours.map((t) => t.price || 0)) : 0;
  const highestPrice =
    tours.length > 0 ? Math.max(...tours.map((t) => t.price || 0)) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Tour Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tours */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Active Packages
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {tours.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              In &apos;tour_packages&apos; table
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Compass className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 2: Starting Price */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Starting From
            </span>
            <div className="text-3xl font-black text-amber-600 tracking-tight">
              ${lowestPrice}
            </div>
            <span className="text-[11px] text-amber-600/80 font-semibold mt-1 block">
              Up to ${highestPrice} / package
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <DollarSign className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 3: Included Inclusions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Standard Service
            </span>
            <div className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Private Chauffeur
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              AC Vehicle + Fuel Included
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Layers className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 4: WhatsApp Inquiries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Booking Channel
            </span>
            <div className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Direct WhatsApp
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
              Pre-filled route details
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <MessageCircle className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>
      </section>

      {/* 2. Controls Bar */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tours by title, route, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTours}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tour Package</span>
          </button>
        </div>
      </section>

      {/* 3. Tour Packages Table */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Configured Tour Packages ({filteredTours.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Supabase table: &apos;tour_packages&apos;
          </span>
        </div>

        {filteredTours.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No tour packages found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the &ldquo;Add Tour Package&rdquo; button above to create your
              first curated tour itinerary.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Tour / Cover</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Route Waypoints</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Highlights</th>
                  <th className="py-3.5 px-4">Inclusions</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTours.map((t) => {
                  const routeText = Array.isArray(t.route_locations)
                    ? t.route_locations.join(" • ")
                    : t.route_locations || t.route || "";

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Tour / Cover */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                            <Image
                              src={t.image_url || t.image || "/images/sigiriya.jpg"}
                              alt={t.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block text-sm">
                              {t.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px] block">
                              ID: {t.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {t.duration}
                        </span>
                      </td>

                      {/* Route Waypoints */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1 text-slate-700 font-medium text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="line-clamp-2">{routeText}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-sm font-black text-slate-900 block">
                          ${t.price}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {t.priceLabel || "/ Group"}
                        </span>
                      </td>

                      {/* Highlights */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Sparkles className="w-3 h-3 text-orange-500" />
                          {t.highlights?.length || 0} Key Stops
                        </span>
                      </td>

                      {/* Inclusions */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {t.inclusions?.length || 6} Items
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview modal */}
                          <button
                            onClick={() => setPreviewTour(t)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            title="Preview Customer Modal"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => openEditModal(t)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Edit Tour Package"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteTour(t.id, t.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Tour Package from Supabase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add / Edit Tour Modal Form */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  {editingTour ? "Edit Package" : "Create Package"}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingTour
                    ? `Update: ${editingTour.title}`
                    : "Add New Tour Package"}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-4 pt-4">
              {/* Title & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tour Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classic Ceylon Explorer"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7 Days / 6 Nights"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Price & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="490"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Banner Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/images/sigiriya.jpg or https://..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Quick Image Presets */}
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Preset Images (Click to Select):
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.url}
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        formImageUrl === preset.url
                          ? "bg-orange-50 border-orange-500 text-orange-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Locations */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Route Waypoints (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Negombo, Sigiriya, Kandy, Nuwara Eliya, Galle"
                  value={formRoute}
                  onChange={(e) => setFormRoute(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tour Overview Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the journey, destinations, and what travelers can look forward to..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Highlights (one per line) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Itinerary Highlights (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder={`Climb Sigiriya Rock Fortress\nScenic train ride through tea country\nWildlife safari in Yala\nSunset at Galle Dutch Fort`}
                  value={formHighlights}
                  onChange={(e) => setFormHighlights(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Inclusions (one per line) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Package Inclusions (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Private AC vehicle & dedicated driver\nFuel, expressway tolls & parking\nAirport pickup & drop-off\n24/7 Islandwide customer support`}
                  value={formInclusions}
                  onChange={(e) => setFormInclusions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Saving to Supabase..."
                    : editingTour
                    ? "Update Tour in Supabase"
                    : "Save New Tour to Supabase"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTour && (
        <TourModal
          isOpen={!!previewTour}
          onClose={() => setPreviewTour(null)}
          tour={previewTour}
        />
      )}
    </div>
  );
};
