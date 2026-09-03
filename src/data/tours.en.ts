import type { TourContent } from "./tours";

const packageExcluded = [
  "International and domestic airfare",
  "Visa charges",
  "Early check-in and late check-out",
  "Meals other than those listed",
  "Museum and fort entrance fees",
  "Personal expenses such as drinks, laundry, telephone and tips",
  "Anything not clearly listed in the inclusions",
];

const packageNotes = [
  "This itinerary is a quotation. No air, hotel or transport reservations are held until a booking is confirmed.",
  "Prices and availability are subject to change at the time of booking.",
  "The order of the itinerary may change for operational reasons; every place listed is still covered.",
  "The Grand Mosque is visited Saturday to Thursday. Women cover their head with a scarf and wear full sleeves.",
];

const dayNotes = ["Prices are subject to availability and change."];

const muscatHotels = {
  place: "Muscat",
  options: [
    "3 star: Muscat Hills or La Rosa, or similar",
    "4 star: Muscat Plaza, or similar",
    "4 star plus: Holiday Inn Al Seeb, or similar",
  ],
};

const muscatCityTour = {
  title: "Muscat city tour",
  text: "The Sultan Qaboos Grand Mosque first, then the seaside residential area of Qurum to the National Museum, photo stops at Al Alam Palace between the Jalali and Mirani forts, the fish market on the corniche and the old Muttrah Souq.",
};

const arrival = {
  label: "Day 1",
  title: "Arrival in Muscat",
  text: "Meet at Muscat International Airport and transfer to your hotel. Overnight in Muscat.",
};

const departure = (day: number) => ({
  label: `Day ${day}`,
  title: "Departure",
  text: "Breakfast, check-out and a private transfer to the airport for your onward journey.",
});

export const toursEn: Record<string, TourContent> = {
  "quickie-oman": {
    name: "Quickie Oman",
    tagline: "Three nights in the capital",
    summary:
      "A short first taste of Oman: a full city tour of Muscat, a free day to wander, and a hotel of your choice on the coast.",
    story: null,
    highlights: [
      "Sultan Qaboos Grand Mosque and the National Museum",
      "Al Alam Palace and the Jalali and Mirani forts",
      "Muttrah Souq and the corniche fish market",
      "A free day in Muscat",
    ],
    itinerary: [
      arrival,
      { label: "Day 2", ...muscatCityTour, text: `${muscatCityTour.text} Overnight in Muscat.` },
      {
        label: "Day 3",
        title: "Free day in Muscat",
        text: "The day is yours to explore the city at your own pace. Overnight in Muscat.",
      },
      departure(4),
    ],
    included: [
      "3 nights at your chosen hotel category in Muscat",
      "Daily breakfast",
      "Airport to hotel to airport transfers",
      "Private transfers and sightseeing with an English and Arabic speaking driver guide",
    ],
    excluded: packageExcluded,
    notes: packageNotes,
    hotels: [muscatHotels],
  },
  "glimpse-oman": {
    name: "Glimpse Oman",
    tagline: "City, then a night in the sands",
    summary:
      "Muscat's grand mosque, palace and souq, then a drive into the Wahiba Sands for a night in a desert camp among the dunes.",
    story: {
      headline: "Dunes that change colour by the hour.",
      text: "Ride the ridges at golden hour, take tea with a Bedouin family, and sleep under a sky with no city glow.",
    },
    highlights: [
      "Full Muscat city tour",
      "Wahiba Sands, a sand sea of 10,000 square kilometres",
      "Night in a desert camp with dinner",
      "Hotel category of your choice in Muscat",
    ],
    itinerary: [
      arrival,
      { label: "Day 2", ...muscatCityTour },
      {
        label: "Day 3",
        title: "Into the Wahiba Sands",
        text: "Drive to the Wahiba Sands, home of the Bedouin, where dune formations shift and change colour through the day. Overnight at the desert camp.",
      },
      departure(4),
    ],
    included: [
      "Hotel nights in Muscat at your chosen category, as published",
      "One night at the desert camp in the Wahiba Sands",
      "Daily breakfast and dinner at the desert camp",
      "Airport to hotel to airport transfers",
      "Private transfers and sightseeing with an English and Arabic speaking driver guide",
    ],
    excluded: packageExcluded,
    notes: packageNotes,
    hotels: [muscatHotels, { place: "Wahiba Sands", options: ["Sama Al Wasil desert camp, or similar"] }],
  },
  "authentic-oman": {
    name: "Authentic Oman",
    tagline: "Muscat, the Wahiba Sands and the coast",
    summary:
      "The capital, a night among the dunes, then the coastal road back through Fins Beach, Wadi Shab, Quriyat and the Bimmah Sinkhole.",
    story: null,
    highlights: [
      "Muscat city tour, then the Wahiba Sands the same day",
      "Overnight in a desert camp",
      "Coastal road: Fins Beach, Wadi Shab, Quriyat, Bimmah Sinkhole",
      "Three hotel categories to choose from",
    ],
    itinerary: [
      arrival,
      {
        label: "Day 2",
        title: "Muscat, then the desert",
        text: `${muscatCityTour.text} Later, drive to the Wahiba Sands for the night at a desert camp.`,
      },
      {
        label: "Day 3",
        title: "The coastal road to Muscat",
        text: "Return along the Gulf of Oman with stops at Fins Beach, Wadi Shab, the fishing village of Quriyat and the Bimmah Sinkhole. Check in to your Muscat hotel.",
      },
      departure(4),
    ],
    included: [
      "2 nights at your chosen hotel category in Muscat",
      "1 night at the desert camp in the Wahiba Sands",
      "Daily breakfast and dinner at the desert camp",
      "Airport to hotel to airport transfers",
      "Private transfers and sightseeing with an English and Arabic speaking driver guide",
    ],
    excluded: packageExcluded,
    notes: packageNotes,
    hotels: [muscatHotels, { place: "Wahiba Sands", options: ["Sama Al Wasil desert camp, or similar"] }],
  },
  "magnificent-oman": {
    name: "Magnificent Oman",
    tagline: "Mountains, wadis and dolphins from a Muscat base",
    summary:
      "Four nights in Muscat with day trips to Nizwa and Jebel Shams, the coastal road to Wadi Shab, and a morning with the dolphins.",
    story: null,
    highlights: [
      "Half-day Muscat city tour",
      "Nizwa Fort and Souq, then Jebel Shams at 3,009 metres",
      "Coastal road with Fins Beach and Wadi Shab",
      "Dolphin watching before departure",
    ],
    itinerary: [
      arrival,
      { label: "Day 2", title: "Half-day Muscat city tour", text: `${muscatCityTour.text} Overnight in Muscat.` },
      {
        label: "Day 3",
        title: "Nizwa and Jebel Shams",
        text: "Nizwa Fort and Souq, then the drive up to Jebel Shams, the Mountain of the Sun, passing Misfat and Wadi Ghul on the way. Return to Muscat.",
      },
      {
        label: "Day 4",
        title: "The coastal road to Wadi Shab",
        text: "Along the coast towards Sur from Quriyat, with a photo stop at Fins Beach and time to walk inside Wadi Shab. Lunch on your own. Return to Muscat.",
      },
      {
        label: "Day 5",
        title: "Dolphins, then departure",
        text: "A morning at sea watching dolphins in their natural habitat, then check-out and a private transfer to the airport.",
      },
    ],
    included: [
      "4 nights at your chosen hotel category in Muscat",
      "Daily breakfast",
      "Airport to hotel to airport transfers",
      "Private transfers and sightseeing with an English and Arabic speaking driver guide",
    ],
    excluded: packageExcluded,
    notes: packageNotes,
    hotels: [muscatHotels],
  },
  "historical-treasures-of-oman": {
    name: "Historical Treasures of Oman",
    tagline: "Forts of the interior and the Batinah coast",
    summary:
      "Muscat, then the great forts of Nizwa, Bahla and Jabreen with a night in Nizwa, and Nakhal Fort on the way home.",
    story: null,
    highlights: [
      "Muscat city tour with the Grand Mosque and Muttrah Souq",
      "Nizwa Fort, the Friday livestock auction and Bahla, a UNESCO site",
      "Jabreen Castle, a seat of Omani learning",
      "Nakhal Fort at the foot of the Hajar mountains",
    ],
    itinerary: [
      arrival,
      { label: "Day 2", ...muscatCityTour, text: `${muscatCityTour.text} Overnight in Muscat.` },
      {
        label: "Day 3",
        title: "Nizwa, Bahla and Jabreen",
        text: "The oasis city of Nizwa with its 17th-century fort and souq, Bahla Fort on the UNESCO list, and Jabreen Castle. Overnight in Nizwa.",
      },
      {
        label: "Day 4",
        title: "Nakhal Fort",
        text: "Nakhal Fort, rebuilt in the 17th century on rock at the foot of Jebel Nakhal, with its museum of historic guns and a weekly goat market. Return to Muscat.",
      },
      departure(5),
    ],
    included: [
      "3 nights at your chosen hotel category in Muscat",
      "1 night at your chosen hotel in Nizwa",
      "Daily breakfast",
      "Airport to hotel to airport transfers",
      "Transfers and sightseeing as itinerary with an English and Arabic speaking driver guide",
    ],
    excluded: packageExcluded,
    notes: packageNotes,
    hotels: [muscatHotels, { place: "Nizwa", options: ["Tanuf Residency, or Falaj Daris for the 4 star plus tier"] }],
  },
  "awesome-oman": {
    name: "Awesome Oman",
    tagline: "A week across mountains, forts, desert and coast",
    summary:
      "Seven days that cover Muscat, a night on Jebel Shams, the forts of Nizwa, a desert camp in the Wahiba Sands and the coastal road home.",
    story: null,
    highlights: [
      "Full Muscat city tour",
      "Night on Jebel Shams via Misfat and Wadi Ghul",
      "Nizwa, Bahla and Jabreen forts with a night in Nizwa",
      "Desert camp in the Wahiba Sands",
      "Coastal road with Wadi Shab and the Bimmah Sinkhole",
    ],
    itinerary: [
      arrival,
      { label: "Day 2", ...muscatCityTour, text: `${muscatCityTour.text} Overnight in Muscat.` },
      {
        label: "Day 3",
        title: "Up to Jebel Shams",
        text: "Check out and drive to Jebel Shams at 3,009 metres, visiting Misfat, a village built into the mountainside, and Wadi Ghul on the way. Overnight on Jebel Shams.",
      },
      {
        label: "Day 4",
        title: "Forts of the interior",
        text: "Nizwa Fort and Souq, a photo stop at Bahla and a visit to Jabreen Castle. Overnight in Nizwa.",
      },
      {
        label: "Day 5",
        title: "The Wahiba Sands",
        text: "Into the sand sea of the Wahiba, home of the Bedouin. Dinner and overnight at the desert camp.",
      },
      {
        label: "Day 6",
        title: "The coastal road to Muscat",
        text: "Fins Beach, Wadi Shab, the fishing village of Quriyat and the Bimmah Sinkhole on the way back to Muscat.",
      },
      departure(7),
    ],
    included: [
      "3 nights at your chosen hotel category in Muscat",
      "1 night on Jebel Shams",
      "1 night in Nizwa",
      "1 night at the desert camp in the Wahiba Sands",
      "Daily breakfast and dinner at the desert camp",
      "Airport to hotel to airport transfers",
      "Private transfers and sightseeing with an English and Arabic speaking driver guide",
    ],
    excluded: packageExcluded,
    notes: packageNotes,
    hotels: [
      muscatHotels,
      { place: "Jebel Shams", options: ["Sama Heights Resort, or similar"] },
      { place: "Nizwa", options: ["Tanuf Residency, or Falaj Daris for the 4 star plus tier"] },
      { place: "Wahiba Sands", options: ["Sama Al Wasil desert camp, or similar"] },
    ],
  },
  "enchanting-oman": {
    name: "Enchanting Oman",
    tagline: "The full sweep, turtles included",
    summary:
      "Muscat and Jebel Shams, the forts, a desert night, the shipyards of Sur and the turtles of Ras Al Jinz, then the coast and the dolphins.",
    story: null,
    highlights: [
      "Muscat city tour and Jebel Shams in one day",
      "Nizwa, Bahla and Jabreen forts",
      "Desert camp in the Wahiba Sands",
      "Sur's dhow yards and the turtle reserve at Ras Al Jinz",
      "Coastal road home and dolphin watching on the last morning",
    ],
    itinerary: [
      arrival,
      {
        label: "Day 2",
        title: "Muscat, then Jebel Shams",
        text: `${muscatCityTour.text} Later, drive up to Jebel Shams via Misfat and Wadi Ghul. Overnight on the mountain.`,
      },
      {
        label: "Day 3",
        title: "Forts of the interior",
        text: "Nizwa Fort and Souq, a photo stop at Bahla and a visit to Jabreen Castle. Overnight in Nizwa.",
      },
      {
        label: "Day 4",
        title: "The Wahiba Sands",
        text: "Into the dunes for dinner and a night at the desert camp.",
      },
      {
        label: "Day 5",
        title: "Sur and Ras Al Jinz",
        text: "The port city of Sur with its dhow yards, then Ras Al Jinz for the evening visit to the green turtle reserve. Overnight at Sama Ras Al Jinz.",
      },
      {
        label: "Day 6",
        title: "The coastal road to Muscat",
        text: "Fins Beach, Wadi Shab, Quriyat and the Bimmah Sinkhole on the drive back. Overnight in Muscat.",
      },
      {
        label: "Day 7",
        title: "Dolphins, then departure",
        text: "A packed breakfast and a morning at sea with the dolphins, then a transfer to the airport.",
      },
    ],
    included: [
      "2 nights at your chosen hotel category in Muscat",
      "1 night on Jebel Shams",
      "1 night in Nizwa",
      "1 night at the desert camp in the Wahiba Sands",
      "1 night at Sama Ras Al Jinz",
      "Daily breakfast and dinner at the desert camp",
      "Airport to hotel to airport transfers",
      "Private transfers and sightseeing with an English and Arabic speaking driver guide",
    ],
    excluded: packageExcluded,
    notes: packageNotes,
    hotels: [
      muscatHotels,
      { place: "Jebel Shams", options: ["Sama Heights Resort, or similar"] },
      { place: "Nizwa", options: ["Tanuf Residency, or Falaj Daris for the 4 star plus tier"] },
      { place: "Wahiba Sands", options: ["Sama Al Wasil desert camp, or similar"] },
      { place: "Ras Al Jinz", options: ["Sama Ras Al Jinz"] },
    ],
  },
  "coastal-road-tour": {
    name: "Coastal Road Tour",
    tagline: "Bimmah Sinkhole, Wadi Shab and Wadi Tiwi",
    summary:
      "A day along the Gulf of Oman towards Sur: white beaches, the sinkhole, a walk into Wadi Shab and the palms of Wadi Tiwi.",
    story: {
      headline: "Turquoise water at the end of the walk.",
      text: "An hour on foot between canyon walls ends at pools so clear you can count the pebbles, then a swim into a hidden cave with a waterfall inside.",
    },
    highlights: [
      "Quriyat, a fishing village between lagoon and sea",
      "Photo stop at Fins Beach",
      "Walk inside Wadi Shab",
      "Wadi Tiwi and the Bimmah Sinkhole",
    ],
    itinerary: [
      { label: "08:30", title: "Pickup", text: "Collected from your hotel or home in Muscat in a private vehicle." },
      { label: "Morning", title: "Quriyat and Fins Beach", text: "The coast road south, sometimes touching the sea, with a stop at the white sands of Fins." },
      { label: "Midday", title: "Wadi Shab", text: "Shallow green pools and shade between the cliffs. Take pictures, or walk deep into the wadi." },
      { label: "Afternoon", title: "Wadi Tiwi and Bimmah", text: "The palm-lined terraces of Wadi Tiwi and the Bimmah Sinkhole, then the drive back to Muscat by 18:00." },
    ],
    included: [
      "Private vehicle for all transfers and touring",
      "Visits to the Bimmah Sinkhole, Wadi Shab, Wadi Tiwi and Fins Beach",
      "English and Arabic speaking driver guide",
    ],
    excluded: ["Meals and anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
  "daymaniyat-islands": {
    name: "Daymaniyat Islands",
    tagline: "Snorkelling in a marine reserve",
    summary:
      "By boat from Marina Al Bandar to a protected group of nine islands, with snorkelling over coral, a packed lunch and the island permit arranged.",
    story: null,
    highlights: [
      "Boat from Marina Al Bandar",
      "Nature reserve of nine islands across 100 hectares",
      "Snorkelling over coral gardens",
      "Packed lunch and permit included",
    ],
    itinerary: [
      { label: "08:30", title: "Pickup", text: "Transfer from your hotel or home to Marina Al Bandar." },
      { label: "Morning", title: "Out to the islands", text: "Board the boat for the Daymaniyat Islands, a reserve home to thousands of species." },
      { label: "Midday", title: "Snorkel and lunch", text: "Snorkelling over the reef, then a packed lunch on board." },
      { label: "14:30", title: "Return", text: "Back to the marina and transfer to your hotel." },
    ],
    included: [
      "Hotel to Marina Al Bandar to hotel transfers by vehicle",
      "Boat to the Daymaniyat Islands and back",
      "Snorkelling",
      "Packed lunch",
      "Island permit",
    ],
    excluded: ["Anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
  "dolphins-and-snorkelling": {
    name: "Dolphins and Snorkelling",
    tagline: "Three hours at sea from Muscat",
    summary:
      "Watch dolphins at play in the open sea, then snorkel the coral of Bandar Al Khairan.",
    story: null,
    highlights: [
      "Dolphins in the open sea",
      "Snorkelling at Bandar Al Khairan",
      "Snacks, soft drinks and water on board",
      "Snorkelling equipment provided",
    ],
    itinerary: [
      { label: "09:45", title: "Departure", text: "Board at the marina for the three-hour trip." },
      { label: "At sea", title: "Dolphins", text: "Out to the high seas where the pods play." },
      { label: "Then", title: "Bandar Al Khairan", text: "Anchor by the island for snorkelling over the coral reef." },
    ],
    included: [
      "Transfers from hotels on a sharing basis",
      "Light snacks, soft drinks and water",
      "Snorkelling equipment",
    ],
    excluded: ["Private transfers", "Meals and anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
  "great-fort-tour": {
    name: "Great Fort Tour",
    tagline: "Nizwa, Bahla and Jabreen",
    summary:
      "Three centuries of Omani forts in a day: Nizwa's round tower and souq, a stop at Bahla, and the painted rooms of Jabreen Castle.",
    story: {
      headline: "The old capital still keeps its Friday market.",
      text: "Climb the round tower of Nizwa Fort, bargain for silver and dates in the souq, and watch the livestock market that has run every Friday for generations.",
    },
    highlights: [
      "Nizwa Fort and Souq, with the Friday goat and cattle auction",
      "Bahla, a UNESCO World Heritage fort town",
      "Jabreen Castle, the finest of Oman's castles",
      "Fort entrance fees included",
    ],
    itinerary: [
      { label: "08:30", title: "Pickup", text: "Collected from your hotel or home in a private 4x4." },
      { label: "Morning", title: "Nizwa", text: "The oasis city of the interior: its 17th-century fort and the busy souq." },
      { label: "Midday", title: "Bahla", text: "Photo stop at the fort town famous for pottery and on the UNESCO list." },
      { label: "Afternoon", title: "Jabreen Castle", text: "The late 17th-century castle that became a seat of Omani learning, then back to Muscat by 18:00." },
    ],
    included: [
      "Entrance fees to the forts",
      "Private 4x4 for all transfers and touring",
      "English and Arabic speaking driver guide",
    ],
    excluded: ["Meals and anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
  "muscat-moments": {
    name: "Muscat Moments",
    tagline: "The capital in a morning",
    summary:
      "The Grand Mosque, the National Museum, Al Alam Palace between its two forts, the fish market and Muttrah Souq, all before lunch.",
    story: {
      headline: "Where the mountains meet the sea.",
      text: "Wander the Mutrah corniche at dusk, step inside the Sultan Qaboos Grand Mosque, and end the day with the call to prayer echoing across the harbour.",
    },
    highlights: [
      "Sultan Qaboos Grand Mosque",
      "National Museum and the Qurum seafront",
      "Al Alam Palace with the Jalali and Mirani forts",
      "Fish market and Muttrah Souq",
    ],
    itinerary: [
      { label: "08:00", title: "Pickup", text: "Collected from your hotel or home in a private vehicle." },
      { label: "First", title: "Grand Mosque", text: "The gift to the nation for the 30th year of Sultan Qaboos's reign, with one of the world's largest carpets and chandeliers." },
      { label: "Then", title: "Qurum and the National Museum", text: "Along the seaside residential area to the museum of Oman's heritage, from the first settlements to today." },
      { label: "Late morning", title: "Old Muscat and Muttrah", text: "Photo stops at Al Alam Palace and the forts, the fish market on the corniche and the old Muttrah Souq. Back by 12:00." },
    ],
    included: [
      "Private vehicle for all transfers and touring",
      "English and Arabic speaking driver guide",
    ],
    excluded: ["Meals", "Museum entry charges", "Anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
  "jabal-akhdar-day-tour": {
    name: "Jabal Akhdar",
    tagline: "The Green Mountain via Nizwa",
    summary:
      "Nizwa Fort and Souq, then up to 3,000 metres on the Green Mountain, with its cooler air, terraces and the villages of Sayq and Wadi Bani Habib.",
    story: {
      headline: "Mornings above the clouds.",
      text: "Wake above the clouds, walk through ancient mountain villages, and discover a quieter side of Oman.",
    },
    highlights: [
      "Nizwa Fort and Souq on the way",
      "Jabal Akhdar at around 3,000 metres",
      "The villages of Sayq and Wadi Bani Habib",
      "Private 4x4 with driver guide",
    ],
    itinerary: [
      { label: "08:30", title: "Pickup", text: "Collected from your hotel or home in a private 4x4." },
      { label: "Morning", title: "Nizwa", text: "The fort and the souq of the interior's oasis city." },
      { label: "Midday", title: "Up the Green Mountain", text: "The climb into the Hajar range, known for cooler temperatures and the rain that feeds its terraces." },
      { label: "Afternoon", title: "Sayq and Wadi Bani Habib", text: "The villages built beside the mountain, then the drive back to Muscat by 18:00." },
    ],
    included: [
      "Private 4x4 for all transfers and touring",
      "Visits to Jabal Akhdar, Sayq village and Wadi Bani Habib",
      "English and Arabic speaking driver guide",
    ],
    excluded: ["Entry tickets to forts, museums and sights", "Meals and anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
  "jebel-shams-grand-canyon": {
    name: "Grand Canyon Tour",
    tagline: "Jebel Shams, the Mountain of the Sun",
    summary:
      "Nizwa first, then the road up to Oman's highest peak for the view over the canyon of Wadi Ghul and the villages far below.",
    story: {
      headline: "The Grand Canyon of Arabia.",
      text: "Stand on the rim above Wadi Ghul at 3,000 metres, look down on villages the size of a thumbnail, and understand why Omanis call this the Mountain of the Sun.",
    },
    highlights: [
      "Nizwa Fort and Souq",
      "Jebel Shams at 3,029 metres, the highest peak in Oman",
      "Bird's-eye view over the canyon, villages and plantations",
      "Private 4x4 with driver guide",
    ],
    itinerary: [
      { label: "08:30", title: "Pickup", text: "Collected from your hotel or home in a private 4x4." },
      { label: "Morning", title: "Nizwa", text: "The fort and the souq before the mountain road." },
      { label: "Midday", title: "Jebel Shams", text: "The climb to the top of the country and the view over the canyon." },
      { label: "Afternoon", title: "Return", text: "Back down through the valley villages to Muscat by 18:00." },
    ],
    included: [
      "Private 4x4 for all transfers and touring",
      "Visits to Jebel Shams and Nizwa",
      "English and Arabic speaking driver guide",
    ],
    excluded: ["Meals and anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
  "nakhal-and-rustaq": {
    name: "Nakhal and Rustaq",
    tagline: "Forts and hot springs of the Batinah",
    summary:
      "A desert oasis town under the western Hajar, its rock-cut fort and museum, a soak in the hot springs, and the citadel fort of Rustaq.",
    story: null,
    highlights: [
      "Nakhal Fort carved into the rock, with its museum",
      "The hot springs of Nakhal",
      "Rustaq Fort on the citadel",
      "Private 4x4 with driver guide",
    ],
    itinerary: [
      { label: "08:30", title: "Pickup", text: "Collected from your hotel or home in a private 4x4." },
      { label: "Morning", title: "Nakhal", text: "The oasis town in the western Hajar and its fort, with a museum of historical artefacts." },
      { label: "Midday", title: "Hot springs", text: "Time in the calm waters of the springs." },
      { label: "Afternoon", title: "Rustaq", text: "The ancient town and its citadel fort, then back to Muscat by 18:00." },
    ],
    included: [
      "Private 4x4 for all transfers and touring",
      "English and Arabic speaking driver guide",
    ],
    excluded: ["Entrance fees to the forts", "Meals and anything not listed above"],
    notes: dayNotes,
    hotels: null,
  },
};
