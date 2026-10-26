import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ClientItem {
  name: string;
  nameAr?: string;
  icon: string;
  url?: string;
}

export interface ClientCategory {
  title: string;
  titleAr?: string;
  clients: ClientItem[];
}

export const CLIENT_SECTORS_AR: Record<string, string> = {
  "ENERGY & PETROCHEMICALS": "الطاقة والبتروكيماويات",
  "GIGA-PROJECTS & INFRASTRUCTURE": "المشاريع الكبرى والبنية التحتية",
  "WATER, POWER & UTILITIES": "المياه والطاقة والمرافق العامة",
  "GOVERNMENT & FINANCIAL": "القطاع الحكومي والمالي",
  "EPC & ENGINEERING PARTNERS": "شركاء الهندسة والمقاولات (EPC)",
  "PRIVATE SECTOR & HOSPITALITY": "القطاع الخاص والضيافة"
};

export const CLIENT_NAMES_AR: Record<string, string> = {
  "Saudi Aramco": "أرامكو السعودية",
  "SATORP": "ساتورب (SATORP)",
  "S-Chem": "شيفرون فيليبس (S-Chem)",
  "NMDC Energy": "إن إم دي سي إينرجي",
  "Saudi Chemical Company": "الشركة الكيميائية السعودية",
  "Advanced Petrochemical Company": "المتقدمة للبتروكيماويات",
  "NEOM": "نيوم (NEOM)",
  "Red Sea Global": "البحر الأحمر الدولية (RSG)",
  "ROSHN": "روشن (ROSHN)",
  "MA'ADEN": "معادن (MA'ADEN)",
  "Royal Commission for Jubail and Yanbu (RCJY)": "الهيئة الملكية للجبيل وينبع",
  "RSA (Red Sea Aluminium)": "ألمنيوم البحر الأحمر",
  "OXAGON": "أوكساجون (OXAGON)",
  "MKKN": "مكّن (MKKN)",
  "ACWA Power": "أكوا باور (ACWA Power)",
  "NWC (National Water Company)": "شركة المياه الوطنية (NWC)",
  "Saudi Water Authority": "الهيئة السعودية للمياه",
  "Water Transmission Company (WTC)": "شركة نقل وتقنيات المياه (WTC)",
  "TAQQAT (Abdulla Fouad Group)": "طاقات (مجموعة عبد الله فؤاد)",
  "SE (Saudi Energy / Saudi Electricity)": "الشركة السعودية للكهرباء (SEC)",
  "MARAFIQ": "مرافق (MARAFIQ)",
  "Saudi Central Bank (SAMA)": "البنك المركزي السعودي (ساما)",
  "MAWANI (Saudi Ports Authority)": "الهيئة العامة للموانئ (موانئ)",
  "Royal Commission for Riyadh City": "الهيئة الملكية لمدينة الرياض",
  "General Authority for Military Industries (GAMI)": "الهيئة العامة للصناعات العسكرية",
  "Worley": "ورلي (Worley)",
  "Wood": "وود (Wood)",
  "SLFE (SNC-Lavalin Fayez Engineering)": "إس إن سي لافالين فايز",
  "KBR": "كي بي آر (KBR)",
  "IDOM": "إيدوم (IDOM)",
  "SIEMENS": "سيمنز (SIEMENS)",
  "L&T Energy (Hydrocarbon)": "لارسن آند توبرو (L&T)",
  "Samsung Engineering": "سامسونج للهندسة",
  "DOOSAN": "دوسان (DOOSAN)",
  "The Ritz-Carlton": "فندق الريتز-كارلتون",
  "Red Sea International": "البحر الأحمر العالمية",
  "Amazon": "أمازون (Amazon)",
  "Jotun Paints": "دهانات جوتن (Jotun)",
};

export const clientCategoriesData: ClientCategory[] = [
  {
    title: "ENERGY & PETROCHEMICALS",
    titleAr: "الطاقة والبتروكيماويات",
    clients: [
      { name: "Saudi Aramco", nameAr: "أرامكو السعودية", icon: "/clients/aramco.png", url: "https://www.aramco.com/" },
      { name: "SATORP", nameAr: "ساتورب (SATORP)", icon: "/clients/satorp.png", url: "https://www.satorp.com/" },
      { name: "Saudi Chemical Company", nameAr: "الشركة الكيميائية السعودية", icon: "/clients/saudi-chemical.png", url: "https://saudichemical.com/" },
      { name: "NMDC Energy", nameAr: "إن إم دي سي إينرجي", icon: "https://www.nmdc-energy.com/assets/images/logo/NMDC%20Energy.svg", url: "https://www.nmdc-energy.com/" },
      { name: "S-Chem", nameAr: "شيفرون فيليبس (S-Chem)", icon: "https://schem.com/assets/img/logo-schem.png", url: "https://schem.com/" },
      { name: "Advanced Petrochemical Company", nameAr: "المتقدمة للبتروكيماويات", icon: "https://advancedpetrochem.com/wp-content/uploads/2022/09/advanced-logos-111-4.gif", url: "https://advancedpetrochem.com/" },
    ]
  },
  {
    title: "GIGA-PROJECTS & INFRASTRUCTURE",
    titleAr: "المشاريع الكبرى والبنية التحتية",
    clients: [
      { name: "NEOM", nameAr: "نيوم (NEOM)", icon: "/clients/neom.png", url: "https://www.neom.com/" },
      { name: "Red Sea Global", nameAr: "البحر الأحمر الدولية (RSG)", icon: "/clients/red-sea-global.png", url: "https://www.redseaglobal.com/" },
      { name: "ROSHN", nameAr: "روشن (ROSHN)", icon: "/clients/roshn.png", url: "https://www.roshn.sa/" },
      { name: "MA'ADEN", nameAr: "معادن (MA'ADEN)", icon: "/clients/maaden.png", url: "https://www.maaden.com.sa/" },
      { name: "Royal Commission for Jubail and Yanbu (RCJY)", nameAr: "الهيئة الملكية للجبيل وينبع", icon: "/clients/rcjy.png", url: "https://www.rcjy.gov.sa/" },
      { name: "RSA (Red Sea Aluminium)", nameAr: "ألمنيوم البحر الأحمر", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJnSK4CumDRELOlBQJg_dU7W7aO2YNryTbrBxqbTnsYw&s=10", url: "#" },
      { name: "OXAGON", nameAr: "أوكساجون (OXAGON)", icon: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790588462/download.jpg", url: "https://www.neom.com/en-us/regions/oxagon" },
      { name: "MKKN", nameAr: "مكّن (MKKN)", icon: "https://mkkn.com.sa/wp-content/uploads/2022/02/logo-copy-2.png", url: "https://mkkn.com.sa/" },
    ]
  },
  {
    title: "WATER, POWER & UTILITIES",
    titleAr: "المياه والطاقة والمرافق العامة",
    clients: [
      { name: "ACWA Power", nameAr: "أكوا باور (ACWA Power)", icon: "/clients/acwa.png", url: "https://www.acwapower.com/" },
      { name: "NWC (National Water Company)", nameAr: "شركة المياه الوطنية (NWC)", icon: "/clients/nwc.png", url: "https://www.nwc.com.sa/" },
      { name: "Saudi Water Authority", nameAr: "الهيئة السعودية للمياه", icon: "https://www.swa.gov.sa/assets/images/logos/swa-logo-dark.svg", url: "https://swa.gov.sa/" },
      { name: "Water Transmission Company (WTC)", nameAr: "شركة نقل وتقنيات المياه (WTC)", icon: "https://res.cloudinary.com/dppwnds6z/image/upload/v1791403689/halrzfairpmo4hwt6irw.png", url: "https://wtc.com.sa/" },
      { name: "TAQQAT (Abdulla Fouad Group)", nameAr: "طاقات (مجموعة عبد الله فؤاد)", icon: "https://www.taqqat.com/images/taqat-name-logo.png", url: "https://www.taqqat.com/" },
      { name: "SE (Saudi Energy / Saudi Electricity)", nameAr: "الشركة السعودية للكهرباء (SEC)", icon: "/clients/sec.png", url: "https://www.se.com.sa/" },
      { name: "MARAFIQ", nameAr: "مرافق (MARAFIQ)", icon: "/clients/marafiq.png", url: "https://www.marafiq.com.sa/" },
    ]
  },
  {
    title: "GOVERNMENT & FINANCIAL",
    titleAr: "القطاع الحكومي والمالي",
    clients: [
      { name: "Saudi Central Bank (SAMA)", nameAr: "البنك المركزي السعودي (ساما)", icon: "/clients/sama.png", url: "https://www.sama.gov.sa/" },
      { name: "MAWANI (Saudi Ports Authority)", nameAr: "الهيئة العامة للموانئ (موانئ)", icon: "/clients/mawani.png", url: "https://mawani.gov.sa/" },
      { name: "Royal Commission for Riyadh City", nameAr: "الهيئة الملكية لمدينة الرياض", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2czWYhQ99YmeQijpZnDefTU-5wRxuzVxg2KnXQOrYQg&s=10", url: "https://www.rcrc.gov.sa/" },
      { name: "General Authority for Military Industries (GAMI)", nameAr: "الهيئة العامة للصناعات العسكرية", icon: "https://www.gami.gov.sa/sites/default/files/160x22px_logo_GAMI.svg", url: "https://gami.gov.sa/" },
    ]
  },
  {
    title: "EPC & ENGINEERING PARTNERS",
    titleAr: "شركاء الهندسة والمقاولات (EPC)",
    clients: [
      { name: "Worley", nameAr: "ورلي (Worley)", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFyOpJdepx0wZ8yYEX3LmMBYPV4pMRvm3HHxiFlgdfdg&s=10", url: "https://www.worley.com/" },
      { name: "Wood", nameAr: "وود (Wood)", icon: "https://www.woodgroup.com/__data/assets/file/0024/368601/Logo-Wood-Sidara.svg", url: "https://www.woodplc.com/" },
      { name: "SLFE (SNC-Lavalin Fayez Engineering)", nameAr: "إس إن سي لافالين فايز", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjYzRdA_sKcoN2QDryI05gyDlRxnX86WHzz_vMOLDE2A&s=10", url: "https://www.snclavalin.com/" },
      { name: "KBR", nameAr: "كي بي آر (KBR)", icon: "https://www.kbr.com/modules/custom/kbr_language/images/kbr-logo-color.svg", url: "https://www.kbr.com/" },
      { name: "IDOM", nameAr: "إيدوم (IDOM)", icon: "https://www.idom.com/wp-content/themes/idom/images/IDOM.svg", url: "https://www.idom.com/" },
      { name: "SIEMENS", nameAr: "سيمنز (SIEMENS)", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsrBNa5TuhWdFYRFwUaCOn-KAnm1gVrAmL_LFjTstyiQ&s=10", url: "https://www.siemens.com/" },
      { name: "L&T Energy (Hydrocarbon)", nameAr: "لارسن آند توبرو (L&T)", icon: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790588341/download.png", url: "https://www.larsentoubro.com/" },
      { name: "Samsung Engineering", nameAr: "سامسونج للهندسة", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOebKDRgPNQCWw-4f8EFl--l8sqWuk1FWJ8pYjod6Zg&s=10", url: "https://www.samsungengineering.com/" },
      { name: "DOOSAN", nameAr: "دوسان (DOOSAN)", icon: "https://www.doosan.com/images/common/CI_new.png", url: "https://www.doosan.com/" },
    ]
  },
  {
    title: "PRIVATE SECTOR & HOSPITALITY",
    titleAr: "القطاع الخاص والضيافة",
    clients: [
      { name: "The Ritz-Carlton", nameAr: "فندق الريتز-كارلتون", icon: "/clients/ritz.png", url: "https://www.ritzcarlton.com/" },
      { name: "Red Sea International", nameAr: "البحر الأحمر العالمية", icon: "/clients/red-sea-intl.png", url: "https://www.redseahousing.com/" },
      { name: "Amazon", nameAr: "أمازون (Amazon)", icon: "/clients/amazon.svg", url: "https://www.amazon.sa/" },
      { name: "Jotun Paints", nameAr: "دهانات جوتن (Jotun)", icon: "/clients/jotun.png", url: "https://www.jotun.com/" },
    ]
  }
];

export const ClientLogo = ({ src, name }: { src: string; name: string }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    const initials =
      name
        .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .substring(0, 3)
        .toUpperCase() || name.substring(0, 2).toUpperCase();
    return (
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold font-mono text-sm shadow-xs">
        {initials}
      </div>
    );
  }

  return (
    <img 
      loading="lazy" 
      decoding="async" 
      src={src} 
      alt={name} 
      className="max-h-12 max-w-[130px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
      onError={() => setError(true)}
    />
  );
};

export function useClientCategories() {
  const [categories, setCategories] = useState<ClientCategory[]>(() => {
    try {
      const cached = localStorage.getItem("viso_cms_client_page_categories");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return clientCategoriesData;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("cms_content")
          .select("content")
          .eq("section_key", "client_page_categories")
          .maybeSingle();

        if (!error && data?.content && Array.isArray(data.content) && data.content.length > 0) {
          if (isMounted) {
            setCategories(data.content);
            localStorage.setItem("viso_cms_client_page_categories", JSON.stringify(data.content));
          }
        }
      } catch (err) {
        console.error("Error loading client categories:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    const handleStorageChange = () => {
      try {
        const cached = localStorage.getItem("viso_cms_client_page_categories");
        if (cached) setCategories(JSON.parse(cached));
      } catch (e) {}
    };

    window.addEventListener("viso_cms_updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener("viso_cms_updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { categories, loading };
}


