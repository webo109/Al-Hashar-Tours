export type Airport = { code: string; city: string; name: string; country: string };
export type AirportOption = Airport & { cityAr?: string; countryEn: string; countryAr: string; terms: string[] };

const suggested = ["MCT", "SLL", "DXB", "AUH", "DOH", "JED", "RUH", "LHR"];
const arabicCities: Record<string, string> = {
  MCT: "مسقط", SLL: "صلالة", DQM: "الدقم", OHS: "صحار", KHS: "خصب",
  DXB: "دبي", DWC: "دبي", AUH: "أبوظبي", SHJ: "الشارقة", DOH: "الدوحة",
  BAH: "المنامة", KWI: "الكويت", RUH: "الرياض", JED: "جدة", DMM: "الدمام", MED: "المدينة المنورة",
  CAI: "القاهرة", AMM: "عمّان", BEY: "بيروت", IST: "إسطنبول", SAW: "إسطنبول",
  LHR: "لندن", LGW: "لندن", STN: "لندن", CDG: "باريس", ORY: "باريس",
  BOM: "مومباي", DEL: "دلهي", COK: "كوتشي", CCJ: "كوزيكود", MAA: "تشيناي",
  HYD: "حيدر أباد", BLR: "بنغالور", KHI: "كراتشي", LHE: "لاهور", ISB: "إسلام آباد",
  DAC: "دكا", CMB: "كولومبو", MLE: "ماليه", BKK: "بانكوك", HKT: "بوكيت",
  KUL: "كوالالمبور", SIN: "سنغافورة", CGK: "جاكرتا", MNL: "مانيلا", JFK: "نيويورك",
};

export function normalizeAirportText(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي")
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function indexAirports(airports: Airport[]): AirportOption[] {
  const en = new Intl.DisplayNames(["en"], { type: "region" });
  const ar = new Intl.DisplayNames(["ar"], { type: "region" });
  return airports.map((airport) => {
    const countryEn = en.of(airport.country) ?? airport.country;
    const countryAr = ar.of(airport.country) ?? airport.country;
    const cityAr = arabicCities[airport.code];
    return { ...airport, cityAr, countryEn, countryAr,
      terms: [airport.code, airport.city, airport.name, countryEn, countryAr, cityAr ?? ""].map(normalizeAirportText),
    };
  });
}

export function airportLabel(airport: AirportOption, locale: string) {
  return `${locale === "ar" && airport.cityAr ? airport.cityAr : airport.city} (${airport.code})`;
}

export function searchAirports(airports: AirportOption[], query: string, limit = 8): AirportOption[] {
  const normalized = normalizeAirportText(query);
  if (!normalized) return suggested.flatMap((code) => airports.filter((a) => a.code === code)).slice(0, limit);
  const words = normalized.split(" ");
  const priority = (code: string) => suggested.includes(code) ? suggested.indexOf(code) : suggested.length;
  return airports.filter((a) => words.every((word) => a.terms.some((term) => term.includes(word))))
    .map((airport) => ({ airport, rank: airport.terms[0] === normalized ? 0
      : airport.terms[1].startsWith(normalized) || airport.terms[5].startsWith(normalized) ? 1
      : airport.terms[0].startsWith(normalized) ? 2 : 3 }))
    .sort((a, b) => a.rank - b.rank || priority(a.airport.code) - priority(b.airport.code))
    .slice(0, limit).map(({ airport }) => airport);
}
