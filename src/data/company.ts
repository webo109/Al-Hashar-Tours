// Every value here was verified on a public page in September 2026.
// Sources are kept next to the data so the pitch can point to them.

export const company = {
  name: "Al-Hashar Tourism & Travels LLC",
  website: "https://www.alhashartravels.com/",
  established: 1984,
  phone: { display: "+968 2496 5555", tel: "+96824965555" },
  whatsapp: { display: "+968 9558 7789", digits: "96895587789" },
  email: "sales@alhashartravels.com",
  divisions: {
    holidays: {
      phone: { display: "+968 2496 5520", tel: "+96824965520" },
      email: "holidays@alhashartravels.com",
    },
    cargo: {
      phone: { display: "+968 2483 6300", tel: "+96824836300" },
      email: "cargo@alhashartravels.com",
    },
  },
  headOffice: {
    areaKey: "shattiAlQurum",
    postal: "P.O. Box 276, P.C. 134, Muscat, Sultanate of Oman",
  },
  branchKeys: [
    "ruwi",
    "muttrah",
    "ghobra",
    "seeb",
    "alKhoud",
    "mabela",
    "barka",
    "jalanBaniBuAli",
    "sohar",
    "nizwa",
    "salalah",
  ] as const,
  // Their own site states 12 branches; the contact page names 11 plus the head office.
  branchesClaimed: 12,
  iataAccredited: true,
  socials: [
    {
      key: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/alhashar_travels/",
    },
    {
      key: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/alhashartourismandtravels",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/al-hashar-tourism-and-travels",
    },
  ],
  sources: {
    contact: "https://www.alhashartravels.com/contact-us/",
    about: "https://www.alhashartravels.com/about-us/",
    services: "https://www.alhashartravels.com/services/",
    tours: "https://www.alhashartravels.com/oman-tours-details/",
    group: "https://www.alhashargroup.com/our-group.php",
  },
} as const;

export type BranchKey = (typeof company.branchKeys)[number];
