export interface ComplianceCardItem {
  id?: string;
  title: string;
  titleAr?: string;
  desc: string;
  descAr?: string;
  url: string;
  logo: string;
  color: string;
  logoBg?: string;
}

export interface StandardsComplianceData {
  badge: string;
  badgeAr?: string;
  title: string;
  titleAr?: string;
  cards: ComplianceCardItem[];
}

export const COMPLIANCE_TRANSLATIONS_AR: Record<string, { title: string; desc: string }> = {
  SAIS: {
    title: "الهيئة العليا للأمن الصناعي (SAIS)",
    desc: "معايير الهيئة العليا للأمن الصناعي للسلامة والوقاية والأمن المادي.",
  },
  ARAMCO: {
    title: "أرامكو السعودية (ARAMCO)",
    desc: "معايير الأمن والسلامة الهندسية المعتمدة من أرامكو السعودية (SAES).",
  },
  NEOM: {
    title: "نيوم (NEOM)",
    desc: "خدمات استشارات السلامة العامة والأمن المادي لمنظومة مشاريع نيوم.",
  },
  API: {
    title: "معهد البترول الأمريكي (API)",
    desc: "تقييم المخاطر الأمنية لقطاعات النفط والغاز والصناعات البتروكيماوية.",
  },
  API780: {
    title: "معايير معهد البترول الأمريكي (API 780)",
    desc: "منهجية تقييم المخاطر الأمنية لمنشآت النفط والغاز والبتروكيماويات.",
  },
  MOI: {
    title: "وزارة الداخلية (MOI)",
    desc: "الأطر واللوائح الأمنية والتنظيمية المعتمدة من وزارة الداخلية.",
  },
};

export const COLOR_THEME_PRESETS = [
  {
    name: "Emerald Green (SAIS)",
    value: "from-emerald-100 to-emerald-50 border-emerald-200 hover:border-emerald-300 shadow-sm",
    badgeColor: "bg-emerald-500",
  },
  {
    name: "Cyan Teal (Aramco)",
    value: "from-cyan-100 to-cyan-50 border-cyan-200 hover:border-cyan-300 shadow-sm",
    badgeColor: "bg-cyan-500",
  },
  {
    name: "Purple Violet (NEOM)",
    value: "from-purple-100 to-purple-50 border-purple-200 hover:border-purple-300 shadow-sm",
    badgeColor: "bg-purple-500",
  },
  {
    name: "Sky Blue (API)",
    value: "from-sky-100 to-sky-50 border-sky-200 hover:border-sky-300 shadow-sm",
    badgeColor: "bg-sky-500",
  },
  {
    name: "Royal Blue (MOI)",
    value: "from-blue-100 to-blue-50 border-blue-200 hover:border-blue-300 shadow-sm",
    badgeColor: "bg-blue-600",
  },
  {
    name: "Amber Gold",
    value: "from-amber-100 to-amber-50 border-amber-200 hover:border-amber-300 shadow-sm",
    badgeColor: "bg-amber-500",
  },
  {
    name: "Rose Red",
    value: "from-rose-100 to-rose-50 border-rose-200 hover:border-rose-300 shadow-sm",
    badgeColor: "bg-rose-500",
  },
  {
    name: "Indigo Navy",
    value: "from-indigo-100 to-indigo-50 border-indigo-200 hover:border-indigo-300 shadow-sm",
    badgeColor: "bg-indigo-600",
  },
];

export const defaultStandardsComplianceData: StandardsComplianceData = {
  badge: "Governance",
  badgeAr: "الحوكمة والامتثال",
  title: "Standards and Compliance",
  titleAr: "المعايير والامتثال التنظيمي",
  cards: [
    {
      title: "SAIS",
      titleAr: "الهيئة العليا للأمن الصناعي (SAIS)",
      desc: "Supreme Authority for Industrial Security Standards.",
      descAr: "معايير الهيئة العليا للأمن الصناعي للسلامة والوقاية والأمن المادي.",
      url: "/regulatory/sais",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBwqTj0FNNJJm59mHR1GKznOvHK23QpPB5jwKZQuFaQ&s=10",
      color: "from-emerald-100 to-emerald-50 border-emerald-200 hover:border-emerald-300 shadow-sm",
      logoBg: "bg-white",
    },
    {
      title: "ARAMCO",
      titleAr: "أرامكو السعودية (ARAMCO)",
      desc: "Saudi Aramco Security Standards (SAES).",
      descAr: "معايير الأمن والسلامة الهندسية المعتمدة من أرامكو السعودية (SAES).",
      url: "/regulatory/aramco",
      logo: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790621083/aramco.jpg",
      color: "from-cyan-100 to-cyan-50 border-cyan-200 hover:border-cyan-300 shadow-sm",
      logoBg: "bg-white",
    },
    {
      title: "NEOM",
      titleAr: "نيوم (NEOM)",
      desc: "NEOM Public Safety & Security Consultancy Services.",
      descAr: "خدمات استشارات السلامة العامة والأمن المادي لمنظومة مشاريع نيوم.",
      url: "/regulatory/neom",
      logo: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1",
      color: "from-purple-100 to-purple-50 border-purple-200 hover:border-purple-300 shadow-sm",
      logoBg: "bg-white",
    },
    {
      title: "API",
      titleAr: "معهد البترول الأمريكي (API)",
      desc: "Security Risk Assessment for Petroleum & Petrochemical Industries.",
      descAr: "تقييم المخاطر الأمنية لقطاعات النفط والغاز والصناعات البتروكيماوية.",
      url: "/regulatory/api780",
      logo: "https://theshopmag.com/wp-content/uploads/2023/05/api-logo-stacked.png",
      color: "from-sky-100 to-sky-50 border-sky-200 hover:border-sky-300 shadow-sm",
      logoBg: "bg-white",
    },
    {
      title: "MOI",
      titleAr: "وزارة الداخلية (MOI)",
      desc: "Ministry of Interior Regulatory Frameworks.",
      descAr: "الأطر واللوائح الأمنية والتنظيمية المعتمدة من وزارة الداخلية.",
      url: "/regulatory/moi",
      logo: "https://res.cloudinary.com/dppwnds6z/image/upload/v1791460087/jko8c7aoobh0mpo3p0uw.png",
      color: "from-blue-100 to-blue-50 border-blue-200 hover:border-blue-300 shadow-sm",
      logoBg: "bg-white",
    },
  ],
};
