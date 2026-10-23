"use client";

import React from "react";
import { X, Wrench, Plane, Check, HelpCircle, Phone, Mail, MapPin, ShieldAlert, FileText } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "emergency" | "airport" | "terms" | "deposit" | null;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  const contentMap = {
    emergency: {
      title: "24/7 Islandwide Emergency & Roadside Assistance",
      icon: <Wrench className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900">
            We are always ready to help! Travel across Sri Lanka with complete peace of mind.
          </p>
          <p>
            Whether you are navigating high-altitude mountain passes in Nuwara Eliya, tea country switchbacks in Ella, or remote coastal routes near Yala, our dedicated roadside emergency network is standing by 24 hours a day, 7 days a week.
          </p>
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-indigo-950 block">
              Friendly Support for Every Situation:
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mechanical &amp; Technical Issues:</strong> Fast response team reaches you rapidly with roadside assistance or instant vehicle replacement so you never lose vacation days.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strikes &amp; Public Obstacles:</strong> If local strikes, roadblocks, or unexpected area troubles arise, our team guides you with alternative safe routing, local coordination, and complete on-ground support.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dedicated WhatsApp Emergency Hotline:</strong> Direct contact with our operations desk at <strong>+9471 487 7742</strong> anytime, day or night.
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    airport: {
      title: "Katunayake BIA Airport Terminal Gate Handover",
      icon: <Plane className="w-6 h-6 text-sky-600" />,
      bg: "bg-sky-50",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Your journey begins seamlessly the moment you exit the customs hall at Colombo Bandaranaike International Airport (BIA):
          </p>
          <ul className="space-y-2.5 my-3 text-xs">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Uniformed Meet &amp; Greet:</strong> Our representative waits at the arrivals lobby holding a personalized placard with your name.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>No Shuttle Buses:</strong> The vehicle is parked right outside the terminal curbside for instant drive-off.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Handover in 10 Minutes:</strong> We verify your AAC permit, complete the walkaround, answer any Sri Lankan driving questions, and hand over the keys.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    deposit: {
      title: "Security Deposit Guidelines",
      icon: <HelpCircle className="w-6 h-6 text-slate-700" />,
      bg: "bg-slate-100",
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Refundable security deposits depend on the vehicle category and range between 300 USD to 1,200 USD. Deposits are collected upon vehicle handover and refunded upon scheduled return in accordance with the signed rental agreement.
          </p>
        </div>
      ),
    },
    terms: {
      title: "Terms & Conditions and Privacy Policy - Lankatrails.lk",
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50",
      content: (
        <div className="space-y-5 text-xs text-slate-700 leading-relaxed pr-1">
          {/* Section: Introduction */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-amber-950 font-medium">
            <h4 className="font-bold text-sm mb-1 text-amber-900">
              Terms and Conditions - Lankatrails.lk
            </h4>
            <p>
              Terms and Conditions you have to read carefully and understand and accept before making any reservations. &quot;I have not read the terms and conditions properly&quot;, &quot;I have not understood the terms and conditions properly&quot; will not be an excuse to escape from a responsibility, so kindly go through these carefully and place the booking only if you are willing to stick into them.
            </p>
            <p className="mt-2">
              And before placing a booking, you must confirm that you have read the terms and conditions and agreed to them too. Placing a booking means you have agreed to our terms and conditions.
            </p>
            <p className="mt-2 font-bold text-red-700">
              NO BARGAINING IS ALLOWED, since we have placed fixed and standard charges under each vehicle.
            </p>
          </div>

          {/* Section: Refundable Security Deposit */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              About Refundable Security Deposit
            </h5>
            <p>
              This amount depends on the car, low for economy class cars and high for premium class cars. It may vary from 300 USD to 1,200 USD depending on the car category.
            </p>
          </div>

          {/* Section: For Rental Cars */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              For Rental Cars
            </h5>
            <p>
              There are two types of vehicles mentioned in the Vehicles sections, one type is real time pictures, and the other type is dummy photos (hope you can differentiate between the real time photos and dummy photos, dummy photos are displayed in Silver colour), when reserving a vehicle with a real time photo, we guarantee to deliver you the same vehicle as it is on the web site (unless if any unfortunate incident happens, in such case please help us find you the best replacement).
            </p>
            <p>
              And when reserving vehicles with dummy photos, please be kindly informed that, we have posted dummy photos due to high availability of the vehicle with same make, in such cases we guarantee you to deliver you the vehicle depending on the availability on booking time.
            </p>
          </div>

          {/* Section: Driving License & AAC */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Driving License &amp; Endorsement
            </h5>
            <p>
              You should have a valid international driving license either obtained from Motor traffic department of Sri Lanka or from Auto Mobile Association of Sri Lanka, or a Sri Lankan driving license. Yes, it is okay if you have the Local driving license of your country, we will assist you in the process of obtaining a driving license from Automobile Association of Ceylon which is valid in Sri Lanka. It is illegal to drive in Sri Lankan roads without any of the driving licences stated above.
            </p>
            <p>
              You can get the International driving license in Sri Lanka by contacting below numbers (we can get it done for you upon your request on booking the vehicle, we will be charging an extra service charge of 10 USD per driving permit (Apart from the AA Ceylon office charges which is 7,650 LKR (Approximately 28 USD)), but that will save your time from travelling to Automobile Association of Ceylon, in busy streets amidst traffic jams, and waiting time in their office):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg space-y-1 font-mono text-[11px] text-slate-800">
              <p><strong>Colombo Office:</strong> +94 11 2421528 / +94 11 2320454 / +94 11 2446074</p>
              <p>Address: 40, Sir Mohamed Macan Markar Mawatha, P.O.Box 338, Colombo 03, Sri Lanka</p>
              <p><strong>Kandy Office:</strong> +94 84 7201020 / +94 81 2224093</p>
              <p>Address: 35/2/9, Silverdale Complex, Yatinuwara Veediya, Kandy, Sri Lanka</p>
              <p>Website: https://www.aaceylon.lk/contact/ | Email: aacmotor@sltnet.lk</p>
            </div>
          </div>

          {/* Section: Card processing & Bank Transfers */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Payment &amp; Processing Fees
            </h5>
            <p>
              You are entitled to pay bank processing fee and government taxes collectively worth of 5% of total value when paying with the credit or debit card, but in case if you can do direct transactions to our bank account or pay by cash, you can save that amount as this amount is being added by us to avoid our losses after paying bank and payment gateway processing fees. Bank account details are provided only on request and we will not be responsible for any transactions you make to third parties. (If you are doing online transfers to bank account or deposit to bank account, we will need the screenshot of the online transaction or a photo of the bank slip, so it is always hassle-free if you pay online with credit/debit cards, where both you and we get confirmation e-mails from the bank/payment gateway provider).
            </p>
            <p>
              Here you are paying only the rental of the vehicle for the duration that you have selected, other than that, the person who visits you to rent out the car (each car rental is assisted by a person allocated for that job) will be charging a Refundable Security Deposit as a Security when handing over the vehicle to you, and the amount will be varied depending on the vehicle, however the maximum it could be is 1,200 USD and minimum it could be is 300 USD, so you will be asked to pay an amount in between 300 USD - 1,200 USD depending on the vehicle, and you cannot refuse to pay it, in such case we will have to cancel the booking and the rental you have paid will not be refunded. The security deposit will be used to cover up damages if any, which can be covered with that amount, and if the damage goes beyond the security deposit, we will be claiming the insurance (vehicles are fully insured) from the insurance company.
            </p>
          </div>

          {/* Section: Accidents, Emergencies & Notice */}
          <div className="border border-red-200 bg-red-50/50 rounded-xl p-3.5 space-y-2 text-red-950">
            <h5 className="font-bold text-red-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>In Case of Accident or Emergency</span>
            </h5>
            <p className="font-semibold">
              In case of any accident or emergency related to the vehicle, YOU SHOULD CONTACT THE PHONE NUMBER GIVEN HERE (+9471 487 7742), before contacting any local authorities like police or insurance companies.
            </p>
            <p>
              You will be responsible for the total cost of damages and rental, if insurance claim is rejected on account of invalid documents and not following our instructions i.e.: incorrect details of the accident, under intoxication, etc.
            </p>
            <p>
              In case of addition of an extra day to the package, you SHOULD inform the company beforehand, at least two days before (48 hours) the time that you should have returned the vehicle to the office, if not we will be charging a 50% of your refundable deposit for violating the agreements.
            </p>
          </div>

          {/* Section: Legal & Usage Rules */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Vehicle Rules &amp; Operational Policies
            </h5>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>You are prohibited from using the vehicle in breach of Laws - excessive speed, under the influence of Liquor/any other illegal purpose and in areas of civil disturbance/Mortgage, sales, alteration/Transportation of pets, illegal items and any transaction related to the vehicle.</li>
              <li>No payment will be refunded on returning the vehicle before the scheduled returning date, and this will be clearly stated on the rental agreement you sign.</li>
              <li>Vehicle will be handed over to you as a clean vehicle, so it should be clean on returning too, if not a reasonable service charge will be charged, or else you can visit a local service center and get it cleaned and return.</li>
              <li>You will be charged for any damages or losses to interior/ exterior accessories i.e.: DVD, Stereo, MP3/remote keys, Radio, etc.</li>
              <li>You will be responsible for the Cost of tyre damages, Running without oil, Water, Fuel or wrong fuel and underneath damages, if any. Vehicle will be given to you with a tank full of fuel thus you will have to return it the same, unless we will be charging the amount of which we will need to make the tank full of fuel (Fuel policy - Full to Full).</li>
              <li>You will have to sign an agreement with the driver who is handing over the vehicle to you, and read it carefully and sign it.</li>
              <li>For any bookings you make here, the agreements signed will be legal and will be between the client and the vehicle owner which will be a non-disclosure agreement.</li>
              <li>Take photos or videos of the vehicle, showing damages if any, and keep them with you and send the same video/photo to us via WhatsApp the same time you take the vehicle.</li>
              <li>In case if the driver who is arriving you to hand over the vehicle, will find out that you do not have legal documents to drive the vehicle in Sri Lanka, or if he feels like you are not fit enough to drive (ex: drunk), our driver has the rights to refuse to hand over the vehicle to you.</li>
              <li>The rental fee includes, vehicle wastage, insurance (vehicle insurance), and in case the delivery location or handing over/returning location is too far from our offices, a reasonable amount will be charged accordingly to cover up fuel charges and drivers salary and transportage fee.</li>
              <li>The rental fee does not include, any payments you will have to pay on moving around the country (ex: highway charges, parking fees, fuel costs and etc).</li>
              <li>If the rental period is too long (a month or beyond) you are entitled to fully service the vehicle, regardless of the usage, and you can discuss it with us on taking the vehicle (funds will be provided by us for the cost of service).</li>
              <li>You have to bear the cost of fuel, parking tickets/fees, highway charges and fines if any.</li>
            </ul>
          </div>

          {/* Section: Non-Refundable Circumstances */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Rental payment will not be refunded on below mentioned circumstances:
            </h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>Cancellation from your side</li>
              <li>Cancellation from our side due to not providing proper valid documents (International driving permit/ passport details)</li>
              <li>At the time of collection of car, if we realize you are not fit to drive a vehicle due to intoxication/ disabled/ poor vision or any reason.</li>
              <li>Fails on test drive (not able to drive a vehicle)</li>
              <li>On early returning of the vehicle, before the scheduled date.</li>
              <li>Not agreeing to or refusing to sign the agreement or refusing to pay the refundable deposit on collecting the car or rejecting to accept any terms/condition stated on this page/agreement.</li>
            </ul>
          </div>

          {/* Section: Refund Process & Notice */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Important Notice of Process of refunds and Refund Policy
            </h5>
            <p>
              Refunds are made by us; <strong>Lankatrails.lk</strong> and we are responsible to provide funds to make refunds, and payment gateway is not responsible to provide funds.
            </p>
            <p>
              Refunding process generally takes 2 bank working days to process a refund.
            </p>
            <p>
              Reservation cancellations are not refunded once you make a payment to reserve the car rental, but you can use the paid amount for future reservations as a discount.
            </p>
          </div>

          {/* Section: Privacy Policy */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50/50">
            <h5 className="font-bold text-slate-900 text-sm">
              Privacy Policy - Lankatrails.lk
            </h5>
            <p>
              At Lankatrails.lk, we are committed to protecting the privacy and security of our customers&apos; personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit or make a purchase on our website.
            </p>
            <div className="space-y-2 pt-1">
              <span className="font-bold text-slate-900 block">Information We Collect:</span>
              <ul className="space-y-1 list-disc list-inside">
                <li>Personal identification information (such as your name, email address, and phone number) provided voluntarily by you during the registration or checkout process.</li>
                <li>Payment and billing information necessary to process your orders, including credit card details, securely handled by trusted third-party payment processors.</li>
                <li>Browsing information, such as your IP address, browser type, and device information, collected automatically using cookies.</li>
              </ul>
            </div>
            <div className="space-y-2 pt-1">
              <span className="font-bold text-slate-900 block">Use of Information:</span>
              <p>We may use the collected information for the following purposes:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>To process and fulfill your reservation</li>
                <li>To communicate with you regarding your reservation/s, provide customer support, and respond to inquiries or requests.</li>
                <li>To detect and prevent fraud, unauthorized activities, and abuse of our website.</li>
              </ul>
            </div>
            <div className="pt-1">
              <span className="font-bold text-slate-900 block">Data Security:</span>
              <p>
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block">Contact Us:</span>
              <p>If you have any questions, concerns, or requests regarding our Privacy Policy or the handling of your personal information, please contact us using the information provided below:</p>
              <div className="mt-1 space-y-0.5 text-slate-800 font-medium">
                <p>📍 <strong>Business Address:</strong> Kotawilakanda, Pahamune, Narammala, Sri Lanka</p>
                <p>💬 <strong>WhatsApp:</strong> +9471 487 7742</p>
                <p>✉️ <strong>Email:</strong> lankatrails.booking@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  }[type];

  const isWide = type === "terms";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-3xl ${
          isWide ? "max-w-3xl" : "max-w-xl"
        } w-full shadow-2xl border border-slate-200 p-4 sm:p-6 md:p-7 max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${contentMap.bg} flex items-center justify-center`}>
              {contentMap.icon}
            </div>
            <h3 className="text-lg font-black text-slate-950 tracking-tight">
              {contentMap.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {contentMap.content}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 cursor-pointer flex items-center justify-center"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
