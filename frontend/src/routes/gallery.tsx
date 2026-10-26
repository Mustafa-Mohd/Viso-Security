import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { useTranslation } from "react-i18next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("image_url")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching images:", error);
      } else if (data) {
        setGalleryImages(data.map(img => img.image_url));
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

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
            {t("gallery.eyebrow")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl leading-tight text-foreground mb-16"
          >
            {t("gallery.title")} <span className="italic text-primary">{t("gallery.title_italic")}</span>
          </motion.h1>

          {loading ? (
            <div className="text-foreground/60 py-20">{t("gallery.loading")}</div>
          ) : galleryImages.length === 0 ? (
            <div className="text-foreground/60 py-20">{t("gallery.empty")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
                  className="group relative h-[400px] rounded-xl overflow-hidden shadow-lg border border-foreground/5 cursor-pointer"
                >
                  <img src={src} alt={`Gallery Image ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-white font-mono text-xs tracking-widest uppercase">{t("gallery.view")}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
