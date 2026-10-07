import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ClientItem {
  name: string;
  icon: string;
  url?: string;
}

export interface ClientCategory {
  title: string;
  clients: ClientItem[];
}

export const clientCategoriesData: ClientCategory[] = [
  {
    title: "ENERGY & PETROCHEMICALS",
    clients: [
      { name: "Saudi Aramco", icon: "/clients/aramco.png", url: "https://www.aramco.com/" },
      { name: "SATORP", icon: "/clients/satorp.png", url: "https://www.satorp.com/" },
      { name: "S-Chem", icon: "https://schem.com/assets/img/logo-schem.png", url: "https://schem.com/" },
      { name: "NMDC Energy", icon: "https://www.nmdc-energy.com/assets/images/logo/NMDC%20Energy%20white.svg", url: "https://www.nmdc-energy.com/" },
      { name: "Advanced Petrochemical Company", icon: "https://advancedpetrochem.com/wp-content/uploads/2022/09/advanced-logos-111-4.gif", url: "https://advancedpetrochem.com/" },
    ]
  },
  {
    title: "GIGA-PROJECTS & INFRASTRUCTURE",
    clients: [
      { name: "NEOM", icon: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1", url: "https://www.neom.com/" },
      { name: "MA'ADEN", icon: "/clients/maaden.png", url: "https://www.maaden.com.sa/" },
      { name: "RSA (Red Sea Aluminium)", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJnSK4CumDRELOlBQJg_dU7W7aO2YNryTbrBxqbTnsYw&s=10", url: "#" },
      { name: "OXAGON", icon: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790588462/download.jpg", url: "https://www.neom.com/en-us/regions/oxagon" },
      { name: "MKKN", icon: "https://mkkn.com.sa/wp-content/uploads/2022/02/logo-copy-2.png", url: "https://mkkn.com.sa/" },
    ]
  },
  {
    title: "WATER, POWER & UTILITIES",
    clients: [
      { name: "NWC (National Water Company)", icon: "https://upload.wikimedia.org/wikipedia/commons/2/25/%D8%B4%D8%B9%D8%A7%D8%B1_%D8%B4%D8%B1%D9%83%D8%A9_%D8%A7%D9%84%D9%85%D9%8A%D8%A7%D9%87_%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A%D8%A9_2021.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original", url: "https://www.nwc.com.sa/" },
      { name: "Saudi Water Authority", icon: "https://www.swa.gov.sa/assets/images/logos/swa-logo-dark.svg", url: "https://swa.gov.sa/" },
      { name: "Water Transmission Company (WTC)", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4rNUCMe2NSrf-9bHhEVrJAiweLdjsaPBTDaoVKBrw6A&s=10", url: "https://wtc.com.sa/" },
      { name: "TAQQAT (Abdulla Fouad Group)", icon: "https://www.taqqat.com/images/taqat-name-logo.png", url: "https://www.taqqat.com/" },
      { name: "SE (Saudi Energy / Saudi Electricity)", icon: "/clients/sec.png", url: "https://www.se.com.sa/" },
      { name: "MARAFIQ", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWmI1RlEzzSnT03QsEN1QN2uCRN4vBRERlbz1q-g99Sg&s=10", url: "https://www.marafiq.com.sa/" },
    ]
  },
  {
    title: "GOVERNMENT & FINANCIAL",
    clients: [
      { name: "Saudi Central Bank (SAMA)", icon: "https://www.sama.gov.sa/_layouts/15/SAMA.Portal/assets/images/logo.svg", url: "https://www.sama.gov.sa/" },
      { name: "MAWANI (Saudi Ports Authority)", icon: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790586145/download.png", url: "https://mawani.gov.sa/" },
      { name: "Royal Commission for Riyadh City", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2czWYhQ99YmeQijpZnDefTU-5wRxuzVxg2KnXQOrYQg&s=10", url: "https://www.rcrc.gov.sa/" },
      { name: "General Authority for Military Industries (GAMI)", icon: "https://www.gami.gov.sa/sites/default/files/160x22px_logo_GAMI.svg", url: "https://gami.gov.sa/" },
    ]
  },
  {
    title: "EPC & ENGINEERING PARTNERS",
    clients: [
      { name: "Worley", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFyOpJdepx0wZ8yYEX3LmMBYPV4pMRvm3HHxiFlgdfdg&s=10", url: "https://www.worley.com/" },
      { name: "Wood", icon: "https://www.woodgroup.com/__data/assets/file/0024/368601/Logo-Wood-Sidara.svg", url: "https://www.woodplc.com/" },
      { name: "SLFE (SNC-Lavalin Fayez Engineering)", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjYzRdA_sKcoN2QDryI05gyDlRxnX86WHzz_vMOLDE2A&s=10", url: "https://www.snclavalin.com/" },
      { name: "KBR", icon: "https://www.kbr.com/modules/custom/kbr_language/images/kbr-logo-color.svg", url: "https://www.kbr.com/" },
      { name: "IDOM", icon: "https://www.idom.com/wp-content/themes/idom/images/IDOM.svg", url: "https://www.idom.com/" },
      { name: "SIEMENS", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsrBNa5TuhWdFYRFwUaCOn-KAnm1gVrAmL_LFjTstyiQ&s=10", url: "https://www.siemens.com/" },
      { name: "L&T Energy (Hydrocarbon)", icon: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790588341/download.png", url: "https://www.larsentoubro.com/" },
      { name: "Samsung Engineering", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOebKDRgPNQCWw-4f8EFl--l8sqWuk1FWJ8pYjod6Zg&s=10", url: "https://www.samsungengineering.com/" },
      { name: "DOOSAN", icon: "https://www.doosan.com/images/common/CI_new.png", url: "https://www.doosan.com/" },
    ]
  },
  {
    title: "PRIVATE SECTOR & HOSPITALITY",
    clients: [
      { name: "The Ritz-Carlton", icon: "/clients/ritz.png", url: "https://www.ritzcarlton.com/" },
      { name: "Red Sea International", icon: "/clients/red-sea-intl.png", url: "https://www.redseahousing.com/" },
      { name: "Amazon", icon: "/clients/amazon.svg", url: "https://www.amazon.sa/" },
    ]
  }
];

export const ClientLogo = ({ src, name }: { src: string, name: string }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    const initials = name.replace(/[^a-zA-Z\s]/g, '').trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || name.substring(0, 2).toUpperCase();
    return (
      <div className="w-16 h-16 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground/40 font-bold font-mono text-xl border border-foreground/10">
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
      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
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


