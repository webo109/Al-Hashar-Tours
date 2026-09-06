import type { ImageKey } from "./images.generated";

export type ServiceId =
  | "holidayPackages"
  | "airTickets"
  | "hotelBooking"
  | "omanTours"
  | "visaAssistance"
  | "umrah"
  | "travelInsurance"
  | "cargo";

export type Service = {
  id: ServiceId;
  icon:
    | "SunHorizon"
    | "AirplaneTilt"
    | "Bed"
    | "Compass"
    | "Stamp"
    | "Mosque"
    | "ShieldCheck"
    | "Package";
  image: ImageKey | null;
  href: string;
  // Bento placement on large screens; the eight cells fill four 12-column rows.
  span: string;
  tone: "photo" | "sand" | "cream";
};

// All eight are listed on alhashartravels.com/services.
export const services: Service[] = [
  { id: "holidayPackages", icon: "SunHorizon", image: "people-holiday-abroad", href: "/services/holidays", span: "lg:col-span-7 lg:row-span-2", tone: "photo" },
  { id: "airTickets", icon: "AirplaneTilt", image: null, href: "/services/flights", span: "lg:col-span-5", tone: "sand" },
  { id: "hotelBooking", icon: "Bed", image: "people-hotel-arrival", href: "/services/hotels", span: "lg:col-span-5", tone: "photo" },
  { id: "omanTours", icon: "Compass", image: "dest-jabal-akhdar-village", href: "/tours", span: "lg:col-span-5 lg:row-span-2", tone: "photo" },
  { id: "visaAssistance", icon: "Stamp", image: null, href: "/services/visa", span: "lg:col-span-4", tone: "cream" },
  { id: "umrah", icon: "Mosque", image: null, href: "/umrah", span: "lg:col-span-3", tone: "sand" },
  { id: "travelInsurance", icon: "ShieldCheck", image: null, href: "/services/insurance", span: "lg:col-span-4", tone: "cream" },
  { id: "cargo", icon: "Package", image: null, href: "/services/cargo", span: "lg:col-span-3", tone: "sand" },
];
