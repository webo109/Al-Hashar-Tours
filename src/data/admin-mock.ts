// Sample data for the operator dashboard preview. Names are fictional; prices
// follow Al-Hashar's published rates. Today is Thursday 3 September 2026, 09:42.

export type Urgency = "critical" | "watch" | "ok";
export type Channel = "WhatsApp" | "Email" | "Phone" | "Branch" | "Instagram" | "System" | "GDS" | "Payment";

export type TimelineEvent = { at: string; channel: Channel; text: string };

export type RequestRow = {
  ref: string;
  customer: string;
  country: string;
  product: string;
  date: string;
  status: string;
  urgency: Urgency;
  amount: string;
  channel: Channel;
  branch: string;
  repeat?: boolean;
  phone: string;
  email: string;
  travellers: string;
  operations: { hotel?: string; guide?: string | null; vehicle?: string | null; suggestion?: string };
  notes: string;
  timeline: TimelineEvent[];
};

export const today = { label: "Thursday 3 September 2026", time: "09:42" };

export const consultant = { name: "Aisha Al Zadjali", role: "Consultant, Ruwi branch", initials: "AZ" };

export const staff = [
  { name: "Salim", role: "Driver guide", tags: ["EN", "AR", "4x4"], free: false },
  { name: "Khalid", role: "Driver guide", tags: ["EN", "AR", "UR", "4x4", "forts"], free: true },
  { name: "Yousuf", role: "Driver guide", tags: ["EN", "AR"], free: true },
  { name: "Noura", role: "Consultant, Ghobra", tags: ["EN", "AR", "HI"], free: true },
  { name: "Rashid", role: "Umrah desk, Seeb", tags: ["AR", "EN"], free: false },
];

export const requests: RequestRow[] = [
  {
    ref: "AH-3F7K",
    customer: "Hannah Weber",
    country: "Germany",
    product: "Authentic Oman, 4 star",
    date: "17 to 20 Sep",
    status: "Quoted, awaiting reply",
    urgency: "critical",
    amount: "OMR 390",
    channel: "WhatsApp",
    branch: "Ruwi",
    phone: "+49 171 555 0192",
    email: "hannah.weber@example.de",
    travellers: "2 adults",
    operations: { hotel: "Muscat Plaza, tentative", guide: null, vehicle: null, suggestion: "Khalid (EN/AR, 4x4, forts certified)" },
    notes: "Asked about adding a night in Nizwa. Vegetarian dinner at the desert camp.",
    timeline: [
      { at: "1 Sep 10:12", channel: "WhatsApp", text: "Sind diese Termine frei? 17. bis 20. September, 2 Erwachsene." },
      { at: "1 Sep 10:40", channel: "System", text: "Quote AH-3F7K generated from published prices: OMR 390 (4 star tier)." },
      { at: "1 Sep 11:05", channel: "Email", text: "Quote sent by Aisha with the day-by-day itinerary." },
      { at: "2 Sep 16:20", channel: "WhatsApp", text: "Can we add a night in Nizwa? And is the camp dinner vegetarian-friendly?" },
      { at: "3 Sep 08:10", channel: "Phone", text: "Missed call from customer. Callback requested." },
    ],
  },
  {
    ref: "AH-P9C4",
    customer: "Fatma Al Balushi",
    country: "Oman",
    product: "Flights MCT to IST, return",
    date: "21 Sep",
    status: "Deposit paid, ticketing due 17:00",
    urgency: "critical",
    amount: "OMR 412",
    channel: "Branch",
    branch: "Ruwi",
    phone: "+968 9234 5510",
    email: "fatma.b@example.om",
    travellers: "2 adults",
    operations: {},
    notes: "Prefers aisle seats. Balance to be paid at the branch today.",
    timeline: [
      { at: "31 Aug 12:30", channel: "Branch", text: "Walked into Ruwi. Fare held on Turkish Airlines, time limit 3 Sep 17:00." },
      { at: "31 Aug 12:45", channel: "Payment", text: "Deposit OMR 200 received in cash, receipt 4412." },
      { at: "3 Sep 09:00", channel: "System", text: "Ticket time limit in 8 hours. Balance OMR 212 outstanding." },
    ],
  },
  {
    ref: "AH-R4N6",
    customer: "Sophie Martin",
    country: "France",
    product: "Great Fort Tour",
    date: "4 Sep, 08:30",
    status: "Confirmed, driver guide unassigned",
    urgency: "critical",
    amount: "OMR 120",
    channel: "WhatsApp",
    branch: "Ghobra",
    phone: "+33 6 12 34 56 78",
    email: "sophie.martin@example.fr",
    travellers: "2 adults",
    operations: { guide: null, vehicle: "Land Cruiser 2", suggestion: "Khalid (forts certified, free tomorrow)" },
    notes: "Pickup at Grand Hyatt Muscat lobby.",
    timeline: [
      { at: "30 Aug 18:04", channel: "WhatsApp", text: "Bonjour, is the fort tour possible on Friday the 4th for two?" },
      { at: "30 Aug 18:30", channel: "WhatsApp", text: "Confirmed by Noura. OMR 120 per car, up to 4." },
      { at: "2 Sep 11:00", channel: "Payment", text: "Paid by card link, OMR 120." },
    ],
  },
  {
    ref: "AH-M2D8",
    customer: "Marco Bianchi",
    country: "Italy",
    product: "Muscat Moments",
    date: "3 Sep, 08:00",
    status: "On tour now",
    urgency: "ok",
    amount: "OMR 55",
    channel: "Email",
    branch: "Ruwi",
    phone: "+39 333 123 4567",
    email: "marco.bianchi@example.it",
    travellers: "3 adults",
    operations: { guide: "Salim", vehicle: "Land Cruiser 1" },
    notes: "Asked to add Nizwa later in the week.",
    timeline: [
      { at: "29 Aug 09:15", channel: "Email", text: "Requested the half-day city tour for three." },
      { at: "29 Aug 10:02", channel: "Email", text: "Confirmed with pickup at 08:00, Al Bustan Palace." },
      { at: "3 Sep 08:03", channel: "System", text: "Salim checked in at pickup." },
    ],
  },
  {
    ref: "AH-K7Q2",
    customer: "Priya Nair",
    country: "India, Muscat resident",
    product: "Coastal Road Tour",
    date: "3 Sep, 08:30",
    status: "On tour now",
    urgency: "ok",
    amount: "OMR 105",
    channel: "Branch",
    branch: "Ghobra",
    phone: "+968 9911 2233",
    email: "priya.nair@example.com",
    travellers: "2 adults, 1 child",
    operations: { guide: "Yousuf", vehicle: "Prado 1" },
    notes: "Child seat requested.",
    timeline: [
      { at: "1 Sep 17:40", channel: "Branch", text: "Booked at Ghobra, paid in full." },
      { at: "3 Sep 08:31", channel: "System", text: "Yousuf checked in at Al Khuwair pickup." },
    ],
  },
  {
    ref: "AH-T5W1",
    customer: "James O'Connor",
    country: "Ireland",
    product: "Hotel, Muscat Plaza, 3 nights",
    date: "3 to 6 Sep",
    status: "Confirmed, early check-in requested",
    urgency: "watch",
    amount: "OMR 168",
    channel: "Phone",
    branch: "Ruwi",
    phone: "+353 87 123 4567",
    email: "james.oconnor@example.ie",
    travellers: "1 adult",
    operations: { hotel: "Muscat Plaza, confirmed 55123" },
    notes: "Lands 06:40. Wants the room by 11:00.",
    timeline: [
      { at: "28 Aug 14:20", channel: "Phone", text: "Booked three nights by phone." },
      { at: "28 Aug 15:05", channel: "System", text: "Hotel confirmation 55123 received." },
      { at: "2 Sep 21:15", channel: "Email", text: "Asked for early check-in." },
    ],
  },
  {
    ref: "AH-U8G3",
    customer: "Ahmed Al Rawahi, group lead",
    country: "Oman",
    product: "Umrah group, 12 pilgrims",
    date: "Departs 12 Sep",
    status: "3 of 12 visas pending",
    urgency: "watch",
    amount: "OMR 4,680",
    channel: "Branch",
    branch: "Seeb",
    phone: "+968 9555 0101",
    email: "a.rawahi@example.om",
    travellers: "12 pilgrims",
    operations: { hotel: "Near the Haram, confirmed", vehicle: "Coaster, airport transfer" },
    notes: "Briefing at Seeb branch Saturday 14:00.",
    timeline: [
      { at: "20 Aug 10:00", channel: "Branch", text: "Group booked at Seeb by Rashid." },
      { at: "1 Sep 09:30", channel: "System", text: "12 visa applications submitted to the agent." },
      { at: "3 Sep 09:10", channel: "System", text: "9 visas issued, 3 pending." },
    ],
  },
  {
    ref: "AH-Q1L5",
    customer: "Khalifa Al Hinai",
    country: "Oman",
    product: "Quickie Oman, family of 4",
    date: "10 to 13 Sep",
    status: "Balance OMR 158 due",
    urgency: "watch",
    amount: "OMR 316",
    channel: "WhatsApp",
    branch: "Nizwa",
    repeat: true,
    phone: "+968 9222 7788",
    email: "k.hinai@example.om",
    travellers: "2 adults, 2 children",
    operations: { hotel: "La Rosa, confirmed", guide: "Yousuf", vehicle: "Land Cruiser 2" },
    notes: "Repeat guest, booked Coastal Road in 2025.",
    timeline: [
      { at: "25 Aug 19:00", channel: "WhatsApp", text: "Booked the family package for Eid al-Mawlid week." },
      { at: "25 Aug 19:20", channel: "Payment", text: "Deposit OMR 158 received." },
      { at: "1 Sep 09:00", channel: "System", text: "Balance reminder sent." },
    ],
  },
  {
    ref: "AH-B6Z9",
    customer: "Elena Petrova",
    country: "Russia",
    product: "Dolphins and Snorkelling, 3 seats",
    date: "4 Sep, 09:45",
    status: "Confirmed",
    urgency: "ok",
    amount: "OMR 57",
    channel: "Instagram",
    branch: "Ruwi",
    phone: "+7 916 555 4433",
    email: "elena.p@example.ru",
    travellers: "3 adults",
    operations: { vehicle: "Shared boat, marina" },
    notes: "",
    timeline: [
      { at: "2 Sep 13:00", channel: "Instagram", text: "Asked about dolphins on Friday." },
      { at: "2 Sep 13:30", channel: "WhatsApp", text: "Moved to WhatsApp, confirmed three seats." },
    ],
  },
  {
    ref: "AH-N3H7",
    customer: "Daniel Okafor",
    country: "Nigeria, Muscat resident",
    product: "Visa assistance, Schengen",
    date: "Appointment 15 Sep",
    status: "Documents received",
    urgency: "ok",
    amount: "On confirmation",
    channel: "Email",
    branch: "Ruwi",
    phone: "+968 9777 6655",
    email: "d.okafor@example.com",
    travellers: "1 adult",
    operations: {},
    notes: "Travel 2 to 9 October, Netherlands.",
    timeline: [
      { at: "30 Aug 11:00", channel: "Email", text: "Sent passport scan and employment letter." },
      { at: "31 Aug 09:20", channel: "Email", text: "Checklist returned by Aisha, two documents missing." },
      { at: "2 Sep 15:00", channel: "Email", text: "All documents received." },
    ],
  },
];

export const triage = {
  rightNow: [
    { ref: "AH-P9C4", urgency: "critical" as Urgency, title: "Fatma Al Balushi, MCT to IST", detail: "Airline time limit 17:00 today. Balance OMR 212 outstanding.", cta: "Issue ticket" },
    { ref: "AH-3F7K", urgency: "critical" as Urgency, title: "Hannah Weber, Authentic Oman", detail: "Unread WhatsApp for 92 min. Draft reply ready in German.", cta: "Send draft" },
    { ref: "AH-R4N6", urgency: "critical" as Urgency, title: "Great Fort Tour tomorrow 08:30", detail: "2 guests, no driver guide assigned.", cta: "Assign Khalid" },
  ],
  todayJobs: [
    { ref: "AH-M2D8", time: "08:00", title: "Muscat Moments", detail: "Marco Bianchi + 2. Salim, Land Cruiser 1.", done: true },
    { ref: "AH-K7Q2", time: "08:30", title: "Coastal Road Tour", detail: "Nair family. Yousuf, Prado 1.", done: true },
    { ref: "AH-T5W1", time: "11:00", title: "Early check-in, Muscat Plaza", detail: "James O'Connor. Confirm with the hotel.", done: false },
    { ref: "AH-P9C4", time: "17:00", title: "Ticketing deadline", detail: "Fatma Al Balushi, Turkish Airlines.", done: false },
  ],
  pending: [
    { ref: "AH-Q1L5", title: "Balance OMR 158", detail: "Khalifa Al Hinai, reminder sent 2 days ago.", cta: "Send reminder" },
    { ref: "AH-U8G3", title: "3 Umrah visas pending", detail: "Departure in 9 days. Chase the agent.", cta: "Chase agent" },
    { ref: "AH-3F7K", title: "Desert camp tentative", detail: "Sama Al Wasil, 18 Sep, Weber.", cta: "Confirm camp" },
  ],
  inbox: [
    { ref: "AH-3F7K", channel: "WhatsApp" as Channel, from: "Hannah Weber", lang: "DE", text: "Können wir eine Nacht in Nizwa hinzufügen?", draft: "Ja, gern. Eine Nacht in Nizwa im Tanuf Residency kostet OMR 38 pro Person zusätzlich. Soll ich das Angebot aktualisieren?", ago: "92 min" },
    { ref: "AH-M2D8", channel: "Email" as Channel, from: "Marco Bianchi", lang: "IT", text: "Posso aggiungere Nizwa venerdì?", draft: "Certo. Il Great Fort Tour di venerdì costa OMR 120 per auto fino a 4 persone. Le confermo il posto?", ago: "3 h" },
    { ref: "AH-U8G3", channel: "WhatsApp" as Channel, from: "Ahmed Al Rawahi", lang: "AR", text: "هل يوجد عرض للعمرة في أكتوبر؟", draft: "نعم، لدينا مجموعة ثانية تغادر في 10 أكتوبر. هل أرسل لك التفاصيل والأسعار؟", ago: "5 h" },
  ],
};

export const pulse = {
  today: { confirmed: "OMR 1,240", pending: "OMR 620", atRisk: "OMR 212" },
  week: { amount: "OMR 9,860", delta: "up 11% on the same week last month" },
  month: { amount: 6420, goal: 28000, daysLeft: 27 },
  up: "Authentic Oman, 5 requests this week",
  down: "Nakhal and Rustaq, no requests in 30 days",
};

export type WeekItem = { title: string; detail: string; urgency: Urgency; ref?: string };

export const week: { day: string; date: string; today?: boolean; hint?: string; items: WeekItem[] }[] = [
  { day: "Sun", date: "30 Aug", items: [{ title: "Great Fort Tour", detail: "Lee family, Khalid", urgency: "ok" }, { title: "Check-out", detail: "Ruiz, Muscat Plaza", urgency: "ok" }] },
  { day: "Mon", date: "31 Aug", items: [{ title: "Jabal Akhdar", detail: "Schneider x4, Salim", urgency: "ok" }, { title: "Ticketing", detail: "Al Kindi, MCT to LHR", urgency: "ok" }] },
  { day: "Tue", date: "1 Sep", items: [{ title: "Daymaniyat", detail: "Chen x2, shared boat", urgency: "ok" }, { title: "Umrah visas", detail: "12 submitted", urgency: "ok" }] },
  { day: "Wed", date: "2 Sep", items: [{ title: "Nakhal and Rustaq", detail: "Dubois x3, Yousuf", urgency: "ok" }, { title: "Quote follow-up", detail: "Weber", urgency: "watch", ref: "AH-3F7K" }] },
  { day: "Thu", date: "3 Sep", today: true, items: [{ title: "Muscat Moments", detail: "Bianchi, Salim", urgency: "ok", ref: "AH-M2D8" }, { title: "Coastal Road", detail: "Nair, Yousuf", urgency: "ok", ref: "AH-K7Q2" }, { title: "Ticketing 17:00", detail: "Al Balushi", urgency: "critical", ref: "AH-P9C4" }] },
  { day: "Fri", date: "4 Sep", hint: "Light day. Push day tours.", items: [{ title: "Great Fort Tour", detail: "Martin x2, unassigned", urgency: "critical", ref: "AH-R4N6" }, { title: "Dolphins 09:45", detail: "Petrova x3", urgency: "ok", ref: "AH-B6Z9" }] },
  { day: "Sat", date: "5 Sep", hint: "2 vehicles free.", items: [{ title: "Jebel Shams", detail: "Tanaka x2, Khalid", urgency: "ok" }, { title: "Umrah briefing 14:00", detail: "Seeb branch, 12 pilgrims", urgency: "watch", ref: "AH-U8G3" }] },
];

export const business = {
  channels: [
    { name: "WhatsApp", share: 54 },
    { name: "Walk-in", share: 22 },
    { name: "Phone", share: 16 },
    { name: "Email", share: 6 },
    { name: "Instagram", share: 2 },
  ],
  revenueByProduct: [
    { name: "Umrah packages", omr: 4680 },
    { name: "Authentic Oman", omr: 3120 },
    { name: "Flights (service)", omr: 2380 },
    { name: "Coastal Road Tour", omr: 1470 },
    { name: "Great Fort Tour", omr: 960 },
    { name: "Hotels", omr: 840 },
  ],
  responseTime: { median: "48 min", target: "30 min", within2h: "78%" },
  insights: [
    "German inquiries convert to packages (3.4 nights on average); Italian inquiries book half-day tours. Offer packages first to German requests.",
    "Six of ten Coastal Road guests ask about the Wahiba Sands within a week. Send the Glimpse Oman itinerary after every Coastal Road tour.",
    "October Umrah inquiries doubled since 20 August. Open a second group before the first one fills.",
  ],
  margin: [
    { product: "Umrah packages", revenue: 4680, cost: 3980 },
    { product: "Authentic Oman", revenue: 3120, cost: 2250 },
    { product: "Coastal Road Tour", revenue: 1470, cost: 860 },
    { product: "Great Fort Tour", revenue: 960, cost: 590 },
    { product: "Flights (service)", revenue: 2380, cost: 2140 },
  ],
};
