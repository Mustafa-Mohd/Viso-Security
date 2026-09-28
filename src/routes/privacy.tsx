import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "VISO | Privacy Policy" },
      { name: "description", content: "Privacy Policy and data protection at VISO." },
    ],
  }),
});

function PrivacyPage() {
  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main className="bg-background min-h-[100dvh] text-foreground relative overflow-hidden">
        {/* Ambient Backgrounds */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-gold/[0.03] rounded-full blur-[120px] pointer-events-none" />
        
        {/* Cyber Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02]" />

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-40 pb-32 relative z-10 flex flex-col lg:flex-row gap-16">
          
          {/* Header & Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-8 bg-gold" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Data Protection
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-8"
            >
              Privacy Policy
            </motion.h1>



            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="prose prose-neutral dark:prose-invert prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-a:text-gold hover:prose-a:text-gold/80 prose-li:text-foreground/80 prose-p:text-foreground/80 max-w-none"
            >
              <p className="text-lg leading-relaxed text-foreground/90 font-light mb-8">
                At Vision of Solutions Company (VISO), we respect your privacy and are committed to protecting the personal information entrusted to us. This Privacy Policy explains how we collect, use, store, disclose, and protect personal data when you visit our website, contact us, or use our services.
              </p>

              <p>
                VISO operates in the Kingdom of Saudi Arabia and aims to handle personal data in accordance with applicable Saudi laws and regulations, including the Personal Data Protection Law (PDPL) and its Implementing Regulations.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">1. Information We Collect</h3>
              <p>Depending on how you interact with VISO, we may collect:</p>
              <ul className="grid md:grid-cols-2 gap-x-4 gap-y-2 marker:text-gold">
                <li>Name and job title</li>
                <li>Company or organization name</li>
                <li>Email address</li>
                <li>Telephone or mobile number</li>
                <li>Information provided through contact or consultation forms</li>
                <li>Project or service-related information</li>
                <li>Information provided when requesting services</li>
                <li>Website usage and technical information</li>
              </ul>
              <p className="mt-6 p-4 border-l-2 border-gold bg-gold/5 text-sm">
                We seek to collect only the personal data reasonably necessary for the relevant purpose. Saudi PDPL guidance emphasizes purpose limitation and collecting no more than the data necessary for the stated purpose.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">2. How We Collect Personal Data</h3>
              <p>We may collect information when you:</p>
              <ul className="marker:text-gold">
                <li>Submit a contact or enquiry form</li>
                <li>Request a consultation</li>
                <li>Communicate with our team</li>
                <li>Request our services</li>
                <li>Subscribe to communications, where available</li>
                <li>Visit or interact with our website</li>
              </ul>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">3. How We Use Your Information</h3>
              <p>VISO may use personal data to:</p>
              <ul className="grid md:grid-cols-2 gap-x-4 gap-y-2 marker:text-gold">
                <li>Respond to enquiries and requests</li>
                <li>Provide information about our services</li>
                <li>Evaluate and manage potential projects</li>
                <li>Deliver consultancy and translation services</li>
                <li>Communicate with clients and prospective clients</li>
                <li>Improve our website and services</li>
                <li>Maintain business and operational records</li>
                <li>Meet applicable legal and regulatory obligations</li>
                <li>Protect the security and integrity of our systems</li>
              </ul>
              <p className="mt-6 italic text-foreground/60">
                We will not use personal data for purposes that are incompatible with the purpose for which it was collected unless permitted by applicable law.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">4. Sharing of Personal Data</h3>
              <p><strong>VISO does not sell personal data.</strong></p>
              <p>Where necessary and legally permitted, personal data may be shared with:</p>
              <ul className="marker:text-gold">
                <li>Authorized employees and representatives</li>
                <li>Service providers supporting our website or business operations</li>
                <li>Professional advisers</li>
                <li>Government or regulatory authorities where required by law</li>
                <li>Other parties where disclosure is necessary for a legitimate and lawful business purpose</li>
              </ul>
              <p>Any disclosure will be handled in accordance with applicable legal requirements.</p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">5. Data Security</h3>
              <p>VISO takes reasonable organizational, technical and administrative measures to protect personal data against unauthorized access, disclosure, alteration, loss or destruction.</p>
              <p>However, no electronic transmission or storage system can be guaranteed to be completely secure.</p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">6. Data Retention</h3>
              <p>We retain personal data only for as long as reasonably necessary to fulfil the purposes for which it was collected, comply with legal or regulatory obligations, resolve disputes, and maintain appropriate business records.</p>
              <p>When personal data is no longer required, it will be handled or destroyed in accordance with applicable requirements.</p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">7. Cookies and Website Technologies</h3>
              <p>Our website may use cookies or similar technologies to support website functionality, understand website usage and improve the user experience.</p>
              <p>Where required, appropriate consent or controls will be provided.</p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">8. Your Rights</h3>
              <p>Subject to applicable law and relevant conditions, individuals may have rights regarding their personal data, including rights relating to being informed, accessing their personal data, requesting correction, and other rights provided under the PDPL and its Implementing Regulations.</p>
              <p>To exercise an applicable right or submit a privacy-related request, please contact us using the details below.</p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">9. International Data Transfers</h3>
              <p>Where personal data is processed or transferred outside the Kingdom of Saudi Arabia, VISO will handle such transfers in accordance with applicable Saudi data-protection requirements and the relevant regulations governing transfers of personal data outside the Kingdom.</p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">10. Changes to This Privacy Policy</h3>
              <p>VISO may update this Privacy Policy from time to time to reflect changes in our services, practices, or applicable laws and regulations.</p>
              <p>The latest version will be published on this page with the updated effective date.</p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">11. Contact Us</h3>
              <div className="p-8 rounded-2xl bg-surface border border-gold/20 mt-8 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                <p className="mb-6">For questions, requests or concerns regarding this Privacy Policy or the processing of your personal data, please contact:</p>
                <div className="space-y-3 font-mono text-sm">
                  <p className="flex items-center gap-3">
                    <span className="text-gold w-5">🏢</span> 
                    <strong>Vision of Solutions Company (VISO)</strong>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-gold w-5">📍</span>
                    Riyadh, Kingdom of Saudi Arabia
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-gold w-5">✉️</span> 
                    info@visogroup.com
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-gold w-5">📞</span> 
                    +966 11 450 3289
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-gold w-5">🗺️</span> 
                    Riyadh, Saudi Arabia
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </main>
    </>
  );
}
