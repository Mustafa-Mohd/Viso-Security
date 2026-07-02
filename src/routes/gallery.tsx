import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { useTranslation } from "react-i18next";
import { SmoothScroll } from "@/components/SmoothScroll";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "VISO | Gallery" },
      { name: "description", content: "Explore our facilities and portfolio." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t } = useTranslation();

  const galleryImages = [
    "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHocOIHseXbk5L-q6ABIpO3Uj7RIBDCAfJQHmF03LVbsGfzNDD3hW8EC0INE_jnOx8wu6a2ieSSUVFfTn0NrWOBYRzwVJnw_rXvVP-CB41DkaYP2F4R-IEoOz2BSRi8yp-ZBK9KlA=w408-h306-k-no",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541888081699-272e259e8756?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574360773950-717013fc76e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main className="bg-background min-h-screen text-foreground pt-40 pb-20">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-mono text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase"
          >
            Explore
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl leading-tight text-foreground mb-16"
          >
            Visual <span className="italic text-primary">Gallery.</span>
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
                className="group relative h-[400px] rounded-xl overflow-hidden shadow-lg border border-foreground/5 cursor-pointer"
              >
                <img src={src} alt={`Gallery Image ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white font-mono text-xs tracking-widest uppercase">View Fullscreen</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
