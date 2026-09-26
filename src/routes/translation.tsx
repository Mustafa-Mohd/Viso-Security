import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, FileText, Search, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Lock } from "lucide-react";
import { certsApi, TranslationCertificate, getCertificateDisplayStatus, CertificateDisplayStatus } from "@/lib/certsApi";

export const Route = createFileRoute("/translation")({
  component: TranslationPage,
  head: () => ({
    meta: [
      { title: "VISO | Certified Translation Services" },
      { name: "description", content: "Officially accredited translation services in Saudi Arabia." },
    ],
  }),
});

// Custom Premium SVG Icons for the translation domains
function OfficialStampIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 45H70M30 55H70M35 50H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="38" y="32" width="24" height="36" rx="2" stroke="currentColor" strokeWidth="2" fill="var(--background)" />
      <path d="M44 42H56M44 50H56M44 58H50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="62" r="5" fill="currentColor" />
    </svg>
  );
}

function MedicalPulseIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M25 50H38L43 32L50 68L56 45L60 50H75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="43" cy="32" r="3" fill="currentColor" />
      <circle cx="50" cy="68" r="3" fill="currentColor" />
    </svg>
  );
}

function LegalScalesIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      {/* Central Pillar */}
      <path d="M50 25V75M42 75H58M45 25H55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Balance Beam */}
      <path d="M30 35H70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Left scale pan */}
      <path d="M30 35L22 55M30 35L38 55" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 55H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Right scale pan */}
      <path d="M70 35L62 55M70 35L78 55" stroke="currentColor" strokeWidth="1.5" />
      <path d="M60 55H80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MediaMegaphoneIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      {/* Megaphone body */}
      <path d="M32 45H42L56 32V68L42 55H32C30 55 28 53 28 50C28 47 30 45 32 45Z" stroke="currentColor" strokeWidth="2.5" fill="var(--background)" strokeLinejoin="round" />
      {/* Handle */}
      <path d="M44 55L48 68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Audio waves */}
      <path d="M66 40C69 43 71 47 71 50C71 53 69 57 66 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 32C79 37 82 43 82 50C82 57 79 63 74 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function SecurityShieldIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      {/* Shield */}
      <path d="M50 25C58 25 70 28 70 28V50C70 63 59 72 50 75C41 72 30 63 30 50V28C30 28 42 25 50 25Z" stroke="currentColor" strokeWidth="2.5" fill="var(--background)" strokeLinejoin="round" />
      {/* Checkmark inside */}
      <path d="M42 50L48 56L58 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerificationSection({ isAr }: { isAr: boolean }) {
  const { t } = useTranslation();
  const [certId, setCertId] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationCertificate | null>(null);
  const [error, setError] = useState("");
  
  const [recentCerts, setRecentCerts] = useState<TranslationCertificate[]>([]);

  useEffect(() => {
    // Load recent certificates for the demo section
    certsApi.fetchCertificates().then(data => {
      setRecentCerts(data.slice(0, 3));
    }).catch(console.error);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const verifyId = params.get("verify");
      const verifyNationalId = params.get("nationalId");

      if (verifyId && verifyNationalId) {
        setCertId(verifyId);
        setNationalId(verifyNationalId);
        handleVerification(verifyId, verifyNationalId);
      }
    }
  }, []);

  const handleVerification = async (idToVerify: string, natIdToVerify: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const cert = await certsApi.getCertificateById(idToVerify.trim().toUpperCase());
      
      if (!cert) {
        setError("Certificate not found. Please check the ID.");
        return;
      }
      if (cert.national_id !== natIdToVerify.trim()) {
        setError("Invalid National ID.");
        return;
      }
      setResult(cert);
      
      // Clean up URL if it came from query params
      if (typeof window !== "undefined") {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch (err) {
      setError("An error occurred while verifying the certificate.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(certId, nationalId);
  };

  const getStatusColor = (displayStatus: CertificateDisplayStatus) => {
    if (displayStatus === "active") return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (displayStatus === "expired") return "text-orange-700 bg-orange-50 border-orange-200";
    if (displayStatus === "revoked") return "text-red-700 bg-red-50 border-red-200";
    if (displayStatus === "pending") return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-neutral-700 bg-neutral-50 border-neutral-200";
  };

  const getStatusIcon = (displayStatus: CertificateDisplayStatus) => {
    if (displayStatus === "active") return <CheckCircle className="w-5 h-5" />;
    if (displayStatus === "expired") return <AlertTriangle className="w-5 h-5" />;
    if (displayStatus === "revoked") return <XCircle className="w-5 h-5" />;
    if (displayStatus === "pending") return <AlertTriangle className="w-5 h-5" />;
    return <ShieldCheck className="w-5 h-5" />;
  };

  const getStatusLabel = (cert: TranslationCertificate) => {
    const displayStatus = getCertificateDisplayStatus(cert);
    switch (displayStatus) {
      case "active":
        return t("translation_page.verify.status_active", { date: cert.expiry_date });
      case "expired":
        return t("translation_page.verify.status_expired", { date: cert.expiry_date });
      case "pending":
        return t("translation_page.verify.status_pending", { date: cert.issue_date });
      case "revoked":
        return t("translation_page.verify.status_revoked");
      default:
        return "";
    }
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] tracking-[0.2em] uppercase mb-6">
            <ShieldCheck className="w-4 h-4" />
            Certipedia Explorer
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-neutral-900 mb-4">
            VISO Certificate Database
          </h2>
          <p className="font-sans text-base text-neutral-500 max-w-2xl mx-auto">
            Search our centralized registry to verify the authenticity, validity, and status of VISO certified translation documents.
          </p>
        </div>

        {/* Certificate Search Bar (TUV Style) */}
        <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-6 md:p-8 mb-12 relative z-20">
          <h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> Certificate Lookup
          </h3>
          <form id="verify-form" onSubmit={handleVerify} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Certificate ID Number</label>
              <input 
                type="text" 
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. VISO-TR-2026-001245"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-3.5 px-4 text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-neutral-800 placeholder:text-neutral-400"
                required
              />
            </div>
            
            <div className="flex-1 w-full relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">National ID</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="10-digit ID"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-3.5 pl-11 pr-4 text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-neutral-800 placeholder:text-neutral-400"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-10 py-3.5 rounded-lg bg-neutral-900 text-white font-bold text-sm tracking-wide hover:bg-primary transition-all disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Search Registry</>
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6">
                <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Certificate Result Record */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="bg-white border-t-4 border-t-primary shadow-xl rounded-xl overflow-hidden mb-16 relative z-10"
            >
              <div className="p-8 md:p-12 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Verified Document Record</div>
                  <h4 className="text-3xl md:text-4xl font-display text-neutral-900 mb-2">{result.project_name}</h4>
                  <p className="font-mono text-neutral-500 text-sm">Certificate No: {result.id}</p>
                </div>
                <div className={`px-6 py-2.5 rounded-full font-bold tracking-wide text-sm border flex items-center gap-2 shadow-sm text-center ${getStatusColor(getCertificateDisplayStatus(result))}`}>
                  {getStatusIcon(getCertificateDisplayStatus(result))} {getStatusLabel(result)}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-neutral-100">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 border-b border-neutral-100 pb-3">Translation Specifications</h5>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Source Language</div>
                      <div className="text-neutral-900 font-medium">{result.source_lang}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Target Language</div>
                      <div className="text-neutral-900 font-medium">{result.target_lang}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Date of Issuance</div>
                      <div className="text-neutral-900 font-medium">{result.issue_date}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Valid Until</div>
                      <div className="text-neutral-900 font-medium">{result.expiry_date}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 md:p-12 bg-neutral-50 flex flex-col items-center justify-center text-center">
                  <ShieldCheck className="w-20 h-20 text-neutral-300 mb-6" />
                  <p className="text-sm text-neutral-500 max-w-xs mb-8 leading-relaxed">
                    This certification record is actively monitored. The information displayed reflects the current status in the VISO central registry.
                  </p>
                  <a 
                    href={`/certificate/${result.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary font-bold hover:text-neutral-900 transition-colors bg-white px-6 py-3 rounded-lg border border-neutral-200 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <FileText className="w-4 h-4"/> View Digital Certificate
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Database Section */}
        {recentCerts.length > 0 && (
          <div className="pt-16 mt-8 border-t border-neutral-200 relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Live Registry Example</h3>
              <p className="text-sm text-neutral-500">Recently verified records in the database.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {recentCerts.map((data) => (
                <div 
                  key={data.id} 
                  className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-sans font-bold text-sm text-neutral-800 mb-1 truncate max-w-[150px]">{data.project_name}</h4>
                      <p className="font-mono text-xs text-neutral-400">ID: {data.id}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-[9px] font-bold tracking-wide border leading-tight max-w-[120px] text-end ${getStatusColor(getCertificateDisplayStatus(data))}`}>
                      {getStatusLabel(data)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={`/certificate/${data.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-md bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-200 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> View PDF
                    </a>
                    <button 
                      onClick={() => { setCertId(data.id); setNationalId(data.national_id); setResult(null); setError(""); window.scrollTo({top: document.getElementById('verify-form')?.offsetTop || 0, behavior: 'smooth'}); }}
                      className="flex-1 py-2.5 rounded-md bg-primary/5 hover:bg-primary/10 text-primary transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-primary/10 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" /> Auto-Fill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const serviceKeys = ["official", "medical", "legal", "media", "security"] as const;

const images: Record<typeof serviceKeys[number], string> = {
  official: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
  medical: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
  legal: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=600&q=80",
  media: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=600&q=80",
  security: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80"
};

function TranslationPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const detailRef = useRef<HTMLDivElement>(null);

  const [activeKey, setActiveKey] = useState<typeof serviceKeys[number]>("official");
  const [orderedKeys, setOrderedKeys] = useState([...serviceKeys]);

  const handleSelectService = (key: typeof serviceKeys[number]) => {
    setActiveKey(key);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextSlide = () => {
    setOrderedKeys(prev => {
      const copy = [...prev];
      const first = copy.shift();
      copy.push(first!);
      return copy;
    });
  };

  const prevSlide = () => {
    setOrderedKeys(prev => {
      const copy = [...prev];
      const last = copy.pop();
      copy.unshift(last!);
      return copy;
    });
  };

  // Safe fetch of localized list items
  const getServiceItems = (key: typeof serviceKeys[number]): string[] => {
    const raw = t(`translation_page.services.${key}.items`, { returnObjects: true });
    return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];
  };

  return (
    <div className={`bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary ${isAr ? "rtl" : "ltr"}`}>
      <SmoothScroll />
      <TopNav />

      <main className="pb-40">

        {/* Compact Hero Banner Section */}
        <div className="relative w-full overflow-hidden flex items-center justify-center bg-black h-[65vh] mb-24">
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1920&q=80" 
              alt="Translation Services" 
              className="w-full h-full object-cover filter brightness-[0.6] saturate-125"
            />
            {/* Simple dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4 drop-shadow-lg uppercase">
                CERTIFIED TRANSLATION <span className="text-primary block sm:inline">SERVICES</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="max-w-3xl flex flex-col items-center"
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white/90 mb-10 drop-shadow-md">
                Officially Accredited Translation Services
              </h2>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('certipedia-section');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 rounded-full bg-primary text-black font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[0_10px_20px_-10px_rgba(212,175,55,0.5)] border border-primary/50"
              >
                Certipedia Explorer
              </button>
            </motion.div>
          </div>
        </div>





        {/* Premium Slider/Carousel Section */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 relative mb-24 z-10">
          <div className="relative group">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous service"
              className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-surface border border-foreground/10 hover:border-primary/50 text-foreground hover:text-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next service"
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-surface border border-foreground/10 hover:border-primary/50 text-foreground hover:text-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slider track viewport */}
            <div className="overflow-hidden py-6 px-2 md:px-4">
              <motion.div className="flex gap-6 md:gap-8">
                <AnimatePresence mode="popLayout">
                {orderedKeys.map((key) => {
                  const isActive = activeKey === key;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      key={key}
                      onClick={() => setActiveKey(key)}
                      className={`min-w-[280px] sm:min-w-[340px] max-w-[340px] flex-1 rounded-3xl p-6 border cursor-pointer select-none transition-all duration-500 flex flex-col bg-surface shadow-md hover:shadow-xl relative overflow-hidden group ${
                        isActive
                          ? "border-primary bg-surface-2 ring-1 ring-primary/45 scale-[1.02]"
                          : "border-foreground/5 hover:border-primary/30"
                      }`}
                    >
                      {/* Active state top accent glow */}
                      <div
                        className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-gold to-primary transition-opacity duration-500 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        }`}
                      />

                      {/* Square Image container */}
                      <div className="mb-6 w-full h-40 rounded-2xl overflow-hidden relative">
                        <img 
                           src={images[key]}
                           alt={key}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      </div>

                      <h3
                        className={`text-center font-sans font-bold text-lg md:text-xl mb-4 group-hover:text-primary transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {t(`translation_page.services.${key}.title`)}
                      </h3>

                      <p className="text-center font-sans text-sm text-foreground/60 leading-relaxed mb-6 flex-grow">
                        {t(`translation_page.services.${key}.short_desc`)}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectService(key);
                        }}
                        className={`w-full py-3.5 rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md ${
                          isActive
                            ? "bg-primary text-white hover:bg-neutral-800"
                            : "bg-neutral-100 hover:bg-primary text-foreground hover:text-white"
                        }`}
                      >
                        {t("translation_page.read_more")}
                        {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Service Section with Breadcrumbs */}
        <div ref={detailRef} className="scroll-mt-36 max-w-[1400px] mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-surface rounded-3xl border border-foreground/5 shadow-2xl overflow-hidden relative"
            >
              {/* Top Accent Divider matching premium look */}
              <div className="h-2 bg-gradient-to-r from-primary via-gold to-secondary" />

              {/* White clean inner card */}
              <div className="p-8 md:p-16">
                {/* Breadcrumb row */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-sans font-medium text-foreground/40 mb-8 border-b border-foreground/5 pb-4">
                  <span>{t("translation_page.breadcrumb_base")}</span>
                  <span className="text-primary">/</span>
                  <span>{t("translation_page.breadcrumb_mid")}</span>
                  <span className="text-primary">/</span>
                  <span className="text-primary font-bold">
                    {t(`translation_page.services.${activeKey}.title`)}
                  </span>
                </div>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-start">
                  <div>
                    <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 leading-tight">
                      {t(`translation_page.services.${activeKey}.title`)}
                    </h2>
                    <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/75 mb-8 text-justify">
                      {t(`translation_page.services.${activeKey}.desc`)}
                    </p>
                  </div>

                  <div className="bg-background rounded-2xl p-6 md:p-10 border border-foreground/10 relative shadow-inner">
                    <div className="absolute top-4 right-4 text-primary/10">
                      <FileText className="w-20 h-20" />
                    </div>
                    
                    <ul className="space-y-5 relative z-10">
                      {getServiceItems(activeKey).map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.4 }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20 text-sm font-mono font-bold">
                            {idx + 1}
                          </div>
                          <span className="font-sans text-sm md:text-base text-foreground/80 leading-relaxed pt-1 font-medium">
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Verification Section */}
        <div id="certipedia-section" className="mt-32">
          <VerificationSection isAr={!!isAr} />
        </div>
      </main>
    </div>
  );
}
