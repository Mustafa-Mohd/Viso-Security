import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "VISO | Terms of Service" },
      { name: "description", content: "Terms of Service for using the VISO website and services." },
    ],
  }),
});

function TermsPage() {
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
                Legal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-8"
            >
              Terms of Service
            </motion.h1>



            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="prose prose-neutral dark:prose-invert prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-a:text-gold hover:prose-a:text-gold/80 prose-li:text-foreground/80 prose-p:text-foreground/80 max-w-none"
            >
              <p className="text-lg leading-relaxed text-foreground/90 font-light mb-8">
                Welcome to the website of Vision of Solutions Company (VISO). By accessing or using this website, you agree to comply with these Terms of Service.
              </p>
              <p className="p-4 border-l-2 border-gold bg-gold/5 text-sm mb-12">
                If you do not agree with these Terms, please discontinue use of the website.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">1. About VISO</h3>
              <p>
                VISO provides professional services including physical security consultancy, security risk assessment, security engineering and design, security technology consultancy, security management support, and certified translation services, subject to the applicable scope and terms of each engagement.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">2. Use of the Website</h3>
              <p>You agree to use this website only for lawful purposes. You must not:</p>
              <ul className="grid md:grid-cols-2 gap-x-4 gap-y-2 marker:text-gold">
                <li>Use the website for unlawful activities</li>
                <li>Attempt to gain unauthorized access to the website or its systems</li>
                <li>Interfere with the operation or security of the website</li>
                <li>Copy, reproduce or misuse website content without authorization</li>
                <li>Submit false, misleading or unauthorized information</li>
                <li>Introduce malicious software or harmful code</li>
              </ul>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">3. Website Content</h3>
              <p>
                The information presented on this website is provided for general informational purposes. Although VISO aims to keep its website information accurate and current, information may change without prior notice.
              </p>
              <p>
                Website content should not be interpreted as a substitute for a formal professional assessment, consultation, proposal, contract or engagement with VISO.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">4. Security Consultancy Services</h3>
              <p>
                Information displayed on this website about security consultancy, engineering, risk assessment, security technology and related services describes VISO's capabilities and areas of expertise.
              </p>
              <p>
                Specific services, deliverables, methodologies, timelines, fees and responsibilities will be determined through a separate written proposal, quotation, agreement or statement of work.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">5. Project Information and Confidentiality</h3>
              <p>
                Clients may provide sensitive information relating to facilities, infrastructure, operations or security requirements. Such information will be handled in accordance with the applicable contractual arrangements, confidentiality obligations and applicable laws.
              </p>
              <p className="mt-6 italic text-foreground/60">
                Users should not submit highly sensitive or classified information through a general website enquiry form unless specifically requested through an appropriate secure communication channel.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">6. Intellectual Property</h3>
              <p>All content on this website, including:</p>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 marker:text-gold mb-6">
                <li>Logos</li>
                <li>Branding</li>
                <li>Text</li>
                <li>Graphics</li>
                <li>Images</li>
                <li>Videos</li>
                <li>Designs</li>
                <li>Layouts</li>
                <li>Original materials</li>
              </ul>
              <p>
                is owned by or licensed to VISO unless otherwise stated. You may not reproduce, modify, distribute, publish or commercially exploit website content without prior written permission.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">7. Third-Party Links</h3>
              <p>
                The website may contain links to third-party websites or services. VISO does not control and is not responsible for the content, availability, privacy practices or policies of third-party websites. Accessing third-party websites is at your own discretion.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">8. Availability of the Website</h3>
              <p>
                VISO aims to maintain the availability and security of its website but does not guarantee that the website will always be:
              </p>
              <ul className="grid md:grid-cols-2 gap-x-4 gap-y-2 marker:text-gold">
                <li>Available without interruption</li>
                <li>Free from errors</li>
                <li>Free from security vulnerabilities</li>
                <li>Compatible with every device or browser</li>
              </ul>
              <p className="mt-4">
                VISO may modify, suspend or discontinue portions of the website when necessary.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">9. Limitation of Liability</h3>
              <p>
                To the extent permitted by applicable law, VISO shall not be responsible for indirect, incidental or consequential losses arising from the use of, or inability to use, this website.
              </p>
              <p>
                Nothing in these Terms is intended to exclude or limit liability where such exclusion or limitation is prohibited by applicable law.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">10. Privacy</h3>
              <p>
                Your use of this website is also subject to our Privacy Policy, which explains how VISO handles personal data.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">11. Governing Law</h3>
              <p>
                These Terms shall be governed by and interpreted in accordance with the applicable laws and regulations of the Kingdom of Saudi Arabia.
              </p>
              <p>
                Any disputes arising in connection with these Terms shall be subject to the jurisdiction of the competent authorities and courts of the Kingdom of Saudi Arabia, unless otherwise agreed in writing or required by applicable law.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">12. Changes to These Terms</h3>
              <p>
                VISO may update these Terms from time to time. Any updated version will be published on this page with the revised effective date. Your continued use of the website after an update constitutes continued use subject to the updated Terms, to the extent permitted by applicable law.
              </p>

              <h3 className="text-2xl mt-12 mb-6 border-b border-foreground/10 pb-4 text-gold">13. Contact Us</h3>
              <div className="p-8 rounded-2xl bg-surface border border-gold/20 mt-8 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                <p className="mb-6">For questions regarding these Terms of Service, please contact:</p>
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
