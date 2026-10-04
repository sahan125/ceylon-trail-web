"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Fleet } from "@/components/Fleet";
import { Tours } from "@/components/Tours";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/Modals/BookingModal";
import { TourModal } from "@/components/Modals/TourModal";
import { PermitModal } from "@/components/Modals/PermitModal";
import { InfoModal } from "@/components/Modals/InfoModal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Vehicle, TourPackage, TOUR_PACKAGES } from "@/data/mockData";

export default function Home() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>(undefined);
  const [rentalMode, setRentalMode] = useState<"self" | "chauffeur">("self");

  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);

  const [permitModalOpen, setPermitModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<
    "deposit" | "emergency" | "airport" | "terms" | null
  >(null);

  const handleOpenQuote = (preset?: { carId?: string }) => {
    if (preset?.carId) {
      setSelectedCarId(preset.carId);
    }
    setBookingModalOpen(true);
  };

  const handleSearchFleet = (filters: {
    rentalType: "self" | "chauffeur";
    location: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
  }) => {
    setRentalMode(filters.rentalType);
    // User can proceed to browse cars or click Rent Now with pre-set mode
  };

  const handleSelectCar = (car: Vehicle) => {
    setSelectedCarId(car.id);
    setBookingModalOpen(true);
  };

  const handleSelectTour = (tour: TourPackage) => {
    setSelectedTour(tour);
    setTourModalOpen(true);
  };

  const handleViewAllTours = () => {
    setSelectedTour(TOUR_PACKAGES[0]);
    setTourModalOpen(true);
  };

  const handleOpenInfo = (type: "deposit" | "emergency" | "airport" | "terms") => {
    setInfoModalType(type);
    setInfoModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Site Header */}
      <Header onOpenQuoteModal={handleOpenQuote} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section with Search Bar */}
        <Hero onSearchFleet={handleSearchFleet} />

        {/* 2. Peace of Mind / International Travelers Benefits */}
        <Features
          onOpenPermitModal={() => setPermitModalOpen(true)}
          onOpenDepositInfo={() => handleOpenInfo("deposit")}
          onOpenEmergencyInfo={() => handleOpenInfo("emergency")}
          onOpenAirportInfo={() => handleOpenInfo("airport")}
        />

        {/* 3. Verified Tourist Fleet Showcase */}
        <Fleet onSelectCar={handleSelectCar} />

        {/* 4. Curated Scenic Tour Packages */}
        <Tours
          onSelectTour={handleSelectTour}
          onViewAllItineraries={handleViewAllTours}
        />

        {/* 5. Customer Reviews & Credentials */}
        <Testimonials />
      </main>

      {/* Site Footer */}
      <Footer
        onOpenPermitModal={() => setPermitModalOpen(true)}
        onOpenTermsModal={() => handleOpenInfo("terms")}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedCarId={selectedCarId}
        initialRentalType={rentalMode}
      />

      <TourModal
        isOpen={tourModalOpen}
        onClose={() => setTourModalOpen(false)}
        tour={selectedTour}
      />

      <PermitModal
        isOpen={permitModalOpen}
        onClose={() => setPermitModalOpen(false)}
      />

      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        type={infoModalType}
      />

      {/* Floating WhatsApp Action Pill */}
      <FloatingWhatsApp />
    </div>
  );
}
