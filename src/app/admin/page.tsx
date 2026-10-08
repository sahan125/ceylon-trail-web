"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Shield,
  FileBadge,
  ArrowLeft,
  DollarSign,
  UserCheck,
  Plus,
  Trash2,
  Eye,
  X,
  Check,
  Database,
  Radio,
  Compass,
} from "lucide-react";
import { Booking, BookingStatus, BookingStats } from "@/types/booking";
import { VEHICLES } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { TourManagement } from "@/components/Admin/TourManagement";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<"bookings" | "tours">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | BookingStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<"connected" | "fallback" | "syncing">("syncing");

  // New manual booking form state
  const [newClientName, setNewClientName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCarId, setNewCarId] = useState(VEHICLES[0].id);
  const [newRentalType, setNewRentalType] = useState<"self" | "chauffeur">("self");
  const [newLocation, setNewLocation] = useState("Bandaranaike Intl. Airport (BIA)");
  const [newPickupDate, setNewPickupDate] = useState("2026-04-10");
  const [newReturnDate, setNewReturnDate] = useState("2026-04-16");
  const [newAacPermit, setNewAacPermit] = useState(true);
  const [newNotes, setNewNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const calculateStats = (items: Booking[]) => {
    const total = items.length;
    const pending = items.filter((b) => b.status === "Pending").length;
    const confirmed = items.filter((b) => b.status === "Confirmed").length;
    const cancelled = items.filter((b) => b.status === "Cancelled").length;
    const totalRevenue = items
      .filter((b) => b.status === "Confirmed")
      .reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);

    setStats({ total, pending, confirmed, cancelled, totalRevenue });
  };

  // Fetch bookings directly from Supabase 'bookings' table
  const fetchBookings = async () => {
    setLoading(true);

    try {
      // 1. Primary: Direct Supabase query
      const { data: sbData, error: sbError } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!sbError && sbData && sbData.length > 0) {
        // Map Supabase rows to normalized Booking model
        const normalized: Booking[] = sbData.map((row: any) => ({
          id: String(row.id),
          clientName: row.full_name || row.clientName || "Guest",
          phone: row.phone || "",
          email: row.email || "Not provided",
          vehicleId: row.vehicleId || "vehicle",
          vehicleName: row.vehicle || row.vehicleName || "Vehicle",
          vehicleCategory: row.vehicle_category || row.vehicleCategory || "Tourist Car",
          rentalType: row.rental_type || row.rentalType || "self",
          location: row.pickup_location || row.location || "BIA Airport",
          pickupDate: row.pickup_date || row.pickupDate || "",
          pickupTime: row.pickup_time || row.pickupTime || "10:00 AM",
          returnDate: row.return_date || row.returnDate || "",
          returnTime: row.return_time || row.returnTime || "04:00 PM",
          days: Number(row.days) || 1,
          totalCost: Number(row.total_cost || row.totalCost) || 0,
          needAacPermit: Boolean(row.need_aac_permit || row.needAacPermit),
          notes: row.notes || "",
          status: (row.status as BookingStatus) || "Pending",
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
        }));

        setBookings(normalized);
        calculateStats(normalized);
        setSupabaseStatus("connected");
        return;
      }
    } catch (err) {
      console.warn("Direct Supabase query exception:", err);
    }

    // 2. Fallback: Local API mirror
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.success && json.data) {
        setBookings(json.data);
        calculateStats(json.data);
        setSupabaseStatus("fallback");
      }
    } catch (err) {
      console.error("Local API fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up Real-Time subscription on Supabase 'bookings' table
    try {
      const channel = supabase
        .channel("bookings-realtime-admin")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookings" },
          (payload) => {
            console.log("Supabase Real-Time Event:", payload);
            fetchBookings();
            showToast("Real-time update received from Supabase!");
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setSupabaseStatus("connected");
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Real-time subscription error:", err);
    }
  }, []);

  // Update status directly in Supabase
  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    // Optimistic UI update
    const updatedList = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b
    );
    setBookings(updatedList);
    calculateStats(updatedList);

    // 1. Direct Supabase update
    try {
      const { error: sbError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);

      if (sbError) {
        console.warn("Supabase status update error:", sbError.message);
      } else {
        console.log(`Supabase record ${id} status updated to ${newStatus}`);
      }
    } catch (err) {
      console.warn("Supabase update error:", err);
    }

    // 2. Local mirror update
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("API mirror update error:", err);
    }

    showToast(`Booking ${id} status updated to ${newStatus}`);
  };

  // Delete directly from Supabase
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete booking ${id}?`)) {
      return;
    }

    // Optimistic UI update
    const filtered = bookings.filter((b) => b.id !== id);
    setBookings(filtered);
    calculateStats(filtered);

    // 1. Direct Supabase delete
    try {
      await supabase.from("bookings").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }

    // 2. Local mirror delete
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    } catch (err) {}

    showToast(`Booking ${id} deleted`);
  };

  // Create manual booking in Supabase
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const car = VEHICLES.find((v) => v.id === newCarId) || VEHICLES[0];
    const start = new Date(newPickupDate).getTime();
    const end = new Date(newReturnDate).getTime();
    const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24))) || 6;
    const total =
      car.price * days +
      (newRentalType === "chauffeur" ? 25 * days : 0) +
      (newAacPermit ? 40 : 0);

    const newRecord = {
      full_name: newClientName,
      email: newEmail || "Not provided",
      phone: newPhone,
      vehicle: car.name,
      pickup_date: newPickupDate,
      return_date: newReturnDate,
      pickup_location: newLocation,
      status: "Pending",
    };

    // 1. Direct Supabase insert
    try {
      await supabase.from("bookings").insert([newRecord]);
    } catch (err) {
      console.warn("Supabase manual insert error:", err);
    }

    // 2. Local API sync
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: newClientName,
          phone: newPhone,
          email: newEmail,
          vehicleId: car.id,
          vehicleName: car.name,
          vehicleCategory: car.category,
          rentalType: newRentalType,
          location: newLocation,
          pickupDate: newPickupDate,
          pickupTime: "10:00 AM",
          returnDate: newReturnDate,
          returnTime: "04:00 PM",
          days,
          totalCost: total,
          needAacPermit: newAacPermit,
          notes: newNotes,
        }),
      });
    } catch (err) {}

    showToast("New manual reservation created successfully!");
    setIsNewBookingModalOpen(false);
    setNewClientName("");
    setNewPhone("");
    setNewEmail("");
    setNewNotes("");
    fetchBookings();
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === "All" ? true : b.status === activeTab;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTab;
    return (
      matchesTab &&
      (b.clientName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.vehicleName.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#08101E] text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center font-black text-sm text-white shadow-xs">
                CT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-base tracking-tight text-white leading-tight">
                    Ceylon Trail
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-sm border border-orange-500/30">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Airport Dispatch &amp; Reservation Desk
                </p>
              </div>
            </div>
          </div>

          {/* Right Actions & Supabase Indicator */}
          <div className="flex items-center gap-3">
            {/* Supabase Status Pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                supabaseStatus === "connected"
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-300"
              }`}
              title={
                supabaseStatus === "connected"
                  ? "Direct Supabase live sync connected"
                  : "Local synchronization fallback active"
              }
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>{supabaseStatus === "connected" ? "Supabase Live" : "Database Ready"}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  supabaseStatus === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
            </div>

            {activeSection === "bookings" && (
              <button
                onClick={() => setIsNewBookingModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Reservation</span>
              </button>
            )}

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title="Refresh Bookings from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Module Switcher Tabs */}
        <section className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection("bookings")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeSection === "bookings"
                  ? "bg-[#08101E] text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Car className="w-4 h-4 text-orange-500" />
              <span>Car Rental Bookings</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeSection === "bookings"
                    ? "bg-orange-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection("tours")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeSection === "tours"
                  ? "bg-[#08101E] text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Tour Packages</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeSection === "tours"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                Supabase CMS
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold px-2">
            {activeSection === "bookings" ? (
              <span>Managing Customer Vehicle Bookings &amp; Airport Dispatch</span>
            ) : (
              <span>Managing Curated Sri Lanka Tour Itineraries</span>
            )}
          </div>
        </section>

        {activeSection === "bookings" ? (
          <>
            {/* 1. Statistics Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Bookings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Total Requests
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {stats.total}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Supabase synced bookings
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Car className="w-6 h-6 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 2: Pending Requests */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Pending Review
              </span>
              <div className="text-3xl font-black text-amber-600 tracking-tight">
                {stats.pending}
              </div>
              <span className="text-[11px] text-amber-600/80 font-semibold mt-1 block">
                Needs admin confirmation
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Clock className="w-6 h-6 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 3: Confirmed Rentals */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Confirmed Rentals
              </span>
              <div className="text-3xl font-black text-emerald-600 tracking-tight">
                {stats.confirmed}
              </div>
              <span className="text-[11px] text-emerald-600/80 font-semibold mt-1 block">
                Ready for handover at BIA
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 4: Confirmed Revenue & Fleet */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Confirmed Value
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                Active fleet: 4 model tiers
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
              <DollarSign className="w-6 h-6 stroke-[1.8]" />
            </div>
          </div>
        </section>

        {/* 2. Controls Bar (Search + Filter Tabs) */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(["All", "Pending", "Confirmed", "Cancelled"] as const).map((tab) => {
              const count =
                tab === "All"
                  ? stats.total
                  : tab === "Pending"
                  ? stats.pending
                  : tab === "Confirmed"
                  ? stats.confirmed
                  : stats.cancelled;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#08101E] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      activeTab === tab
                        ? "bg-slate-700 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, phone, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-orange-500"
            />
          </div>
        </section>

        {/* 3. Bookings List / Table */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Incoming Rental Requests ({filteredBookings.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Direct Supabase &apos;bookings&apos; table synchronization
            </span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No rental requests found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No bookings match your selected filter. Submissions from the car rental form will
                insert directly here into Supabase.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Ref &amp; Date</th>
                    <th className="py-3.5 px-4">Client Contact</th>
                    <th className="py-3.5 px-4">Vehicle &amp; Service</th>
                    <th className="py-3.5 px-4">Rental Period</th>
                    <th className="py-3.5 px-4">Location &amp; AAC</th>
                    <th className="py-3.5 px-4">Total Quote</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Ref & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block font-mono">
                          #{b.id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(b.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Client Contact */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block text-sm">
                          {b.clientName}
                        </span>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <a
                            href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                          >
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{b.phone}</span>
                          </a>
                          {b.email && b.email !== "Not provided" && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[150px]">{b.email}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Vehicle & Service */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block">
                          {b.vehicleName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {b.vehicleCategory}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              b.rentalType === "chauffeur"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-sky-50 text-sky-700 border border-sky-200"
                            }`}
                          >
                            {b.rentalType === "chauffeur" ? "Chauffeur Tour" : "Self-Drive"}
                          </span>
                        </div>
                      </td>

                      {/* Rental Period */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {b.pickupDate} → {b.returnDate}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {b.days} Days ({b.pickupTime} - {b.returnTime})
                        </span>
                      </td>

                      {/* Location & AAC */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-medium text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{b.location}</span>
                        </div>
                        {b.needAacPermit ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-200">
                            <FileBadge className="w-3 h-3" />
                            AAC Permit Needed
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block mt-1">
                            No AAC Needed
                          </span>
                        )}
                      </td>

                      {/* Total Quote */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-sm font-black text-slate-900 block">
                          ${b.totalCost}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Unlimited KM
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(b.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Confirm Button */}
                          {b.status !== "Confirmed" && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, "Confirmed")}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Update status to Confirmed in Supabase"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm</span>
                            </button>
                          )}

                          {/* Cancel Button */}
                          {b.status !== "Cancelled" && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, "Cancelled")}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-lg text-[11px] font-semibold transition-all border border-slate-200 cursor-pointer"
                              title="Update status to Cancelled in Supabase"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}

                          {/* Direct WhatsApp Reply */}
                          <a
                            href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hello ${b.clientName}! This is Ceylon Trail Car Rentals regarding your booking #${b.id} for the ${b.vehicleName} (${b.pickupDate} to ${b.returnDate}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            title="Reply to Client on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
                          </a>

                          {/* Inspect Details */}
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Record from Supabase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
          </>
        ) : (
          <TourManagement
            showToast={showToast}
            supabaseStatus={supabaseStatus}
          />
        )}
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Booking #{selectedBooking.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedBooking.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Status:
                  </span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Total Estimated:
                  </span>
                  <span className="text-base font-black text-orange-600">
                    ${selectedBooking.totalCost}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.vehicleName} ({selectedBooking.vehicleCategory})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.rentalType === "chauffeur"
                      ? "Chauffeur Guided Tour"
                      : "Self-Drive Rental"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.pickupDate} ({selectedBooking.pickupTime}) →{" "}
                    {selectedBooking.returnDate} ({selectedBooking.returnTime})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.days} Days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AAC Permit:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.needAacPermit ? "Yes ($40 included)" : "Not required"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp Phone:</span>
                  <span className="font-bold text-emerald-600">
                    {selectedBooking.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.email}
                  </span>
                </div>
                {selectedBooking.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                      Client Notes:
                    </span>
                    <p className="p-2 bg-slate-50 rounded-lg text-slate-800 italic">
                      &ldquo;{selectedBooking.notes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  handleUpdateStatus(selectedBooking.id, "Confirmed");
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Confirm Booking in Supabase
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(selectedBooking.id, "Cancelled");
                  setSelectedBooking(null);
                }}
                className="px-4 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Booking Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Create Reservation in Supabase
              </h3>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-4 pt-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tourist name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+94... or +44..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="client@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Assigned Vehicle
                </label>
                <select
                  value={newCarId}
                  onChange={(e) => setNewCarId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                >
                  {VEHICLES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.price}/day)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newPickupDate}
                    onChange={(e) => setNewPickupDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newReturnDate}
                    onChange={(e) => setNewReturnDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAacPermit}
                  onChange={(e) => setNewAacPermit(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600"
                />
                <span>Include AAC Tourist Driving Permit ($40)</span>
              </label>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes, flight number, payment arrangement..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Save to Supabase
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
