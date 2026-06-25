import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/certificates")({
  component: CertificatesPage,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const certificatesData = [
  {
    org: "Higher Commission for Industrial Security (HCIS)",
    certs: ["License to Practice Security Consultancy", "Security Consultancy Qualification Certificate"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/HCIS-2.png"
  },
  {
    org: "Literature, Publishing & Translation commission",
    certs: ["License to Practice Translation Profession"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/Literature-Publishing-Translation-commission.png"
  },
  {
    org: "Ministry of Commerce",
    certs: ["Commercial Register for Security Consultancy Activities", "Commercial Register for Translation Activities"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/Ministry-of-commerce.png"
  },
  {
    org: "Balady",
    certs: ["Municipal License"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/Balady.png"
  },
  {
    org: "ISO 9001:2015",
    certs: ["Quality Management System", "Security Risk Assessment, Preliminary Design of Security System, Detail Design of Security System, Operational Readiness"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/ISO9001.jpg"
  },
  {
    org: "ISO 45001:2018",
    certs: ["Occupational Health & Safety Management System", "Security Risk Assessment, Preliminary Design of Security System, Detail Design of Security System, Operational Readiness"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/ISO45001.png"
  }
];

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[80vh] items-center justify-center overflow-hidden bg-background">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcefror3c/image/upload/v1781695184/images_1_s7wzhb.jpg')] bg-cover bg-center opacity-10 " />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-4 font-mono text-[10px] tracking-[0.4em] text-[#C89933]"
        >
          ACCREDITATIONS & COMPLIANCE
        </motion.div>
        <h1 className="text-5xl font-light leading-tight tracking-tight text-foreground md:text-7xl">
          Official <span className="italic text-[#C89933]">Certificates</span>.
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-foreground/60">
          Validated by leading governmental and international organizations, establishing our supreme standard of quality.
        </p>
      </motion.div>
    </section>
  );
}

function CertificatesGrid() {
  return (
    <section className="relative z-20 bg-background py-20">
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {certificatesData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm p-6  hover:border-[#C89933]/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C89933] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mb-6 flex h-32 items-center justify-center rounded-xl bg-white p-4">
                <img src={item.img} alt={item.org} className="max-h-full object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">{item.org}</h3>
              <ul className="space-y-2 mt-auto">
                {item.certs.map((c, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C89933]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-background py-20 border-t border-foreground/10 overflow-hidden">
      <div className="absolute inset-0 opacity-5 [background-image:radial-gradient(circle_at_center,#C89933_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-6xl px-8 relative z-10 grid gap-12 md:grid-cols-3">
        <div>
          <h4 className="font-mono text-[10px] tracking-[0.3em] text-[#C89933] mb-6">HEADQUARTERS</h4>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-xs">
            Office No. 110 - Building No. 7423<br />
            Abi Bakr As Siddiq - Al-Taawun Dist.<br />
            Riyadh - KSA
          </p>
        </div>
        <div>
          <h4 className="font-mono text-[10px] tracking-[0.3em] text-[#C89933] mb-6">CONTACT US</h4>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li>
              <a href="mailto:info@visogroup.com" className="hover:text-[#C89933] transition-colors">info@visogroup.com</a>
            </li>
            <li>
              <a href="mailto:translation@visogroup.com" className="hover:text-[#C89933] transition-colors">translation@visogroup.com</a>
            </li>
            <li className="pt-2">
              <a href="tel:+966543966637" className="font-mono text-[#C89933]">+966 543 966 637</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[10px] tracking-[0.3em] text-[#C89933] mb-6">LEGAL</h4>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            <li className="pt-4 text-xs text-foreground/40">&copy; 2026 Viso Security Consultations. All rights reserved.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function CertificatesPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <SmoothScroll />
      <TopNav />
      <main>
        <HeroSection />
        <CertificatesGrid />
      </main>
      <Footer />
    </div>
  );
}
