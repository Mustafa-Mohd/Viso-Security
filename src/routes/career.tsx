import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { useState } from "react";
import { Briefcase, Send, CheckCircle2, ChevronRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "VISO | Careers" },
      { name: "description", content: "Join VISO and build the future of security." },
    ],
  }),
  component: CareerPage,
});

function CareerPage() {
  const [activeJob, setActiveJob] = useState<string | null>(null);

  const jobs = [
    {
      id: "doc-controller",
      title: "Document Controller",
      department: "Projects / Document Control",
      type: "Full-Time",
      location: "Riyadh, KSA",
      description: "Manage project documentation, track revisions, and oversee the correspondence flow between internal teams and clients using our proprietary DMS platform."
    },
    {
      id: "security-officer",
      title: "Senior Security Officer",
      department: "Operations",
      type: "Full-Time",
      location: "Jeddah, KSA",
      description: "Ensure the highest level of physical security for premium assets. Manage field operations and oversee junior guards."
    },
    {
      id: "hr-specialist",
      title: "HR Specialist",
      department: "Human Resources",
      type: "Full-Time",
      location: "Riyadh, KSA",
      description: "Drive employee engagement, handle onboarding, and manage records in our internal ESS platform."
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden flex flex-col">
      <TopNav />
      
      <main className="pt-32 pb-24 relative flex-1">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">JOIN OUR TEAM</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase mb-6 tracking-tight">
              Careers at VISO
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              We are constantly seeking talented individuals who embody our core values of honesty, excellence, leadership, and innovation. Apply below to shape the future of security.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface/50 backdrop-blur-xl border border-foreground/10 p-8 rounded-2xl flex flex-col group hover:border-primary/50 transition-colors"
              >
                <div className="text-xs font-bold tracking-widest text-primary uppercase mb-2">{job.department}</div>
                <h3 className="text-2xl font-bold mb-4">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6 font-mono">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
                <p className="text-foreground/70 mb-8 flex-1">{job.description}</p>
                <button 
                  onClick={() => setActiveJob(job.title)}
                  className="mt-auto flex items-center justify-between w-full bg-background border border-foreground/10 px-6 py-4 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                >
                  <span className="font-medium">Apply Now</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {activeJob && (
          <ApplicationModal jobTitle={activeJob} onClose={() => setActiveJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplicationModal({ jobTitle, onClose }: { jobTitle: string, onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('job_applications').insert([{
      name, email, phone, position: jobTitle, cover_letter: coverLetter
    }]);

    setLoading(false);
    if (error) {
      alert("Error submitting application: " + error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-surface border border-foreground/10 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative my-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground/50 hover:text-foreground"
        >
          <X size={24} />
        </button>

        {success ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Application Submitted</h2>
            <p className="text-foreground/70 mb-8">Thank you for applying for the {jobTitle} position. Our HR team will review your application and get back to you soon.</p>
            <button onClick={onClose} className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Application Form</div>
              <h2 className="text-2xl font-bold">Apply for {jobTitle}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Full Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Email *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Cover Letter</label>
                <textarea rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="Tell us why you are a great fit for this role..."></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-foreground text-background py-4 rounded-lg font-bold hover:bg-foreground/90 transition-colors mt-4 flex items-center justify-center gap-2">
                {loading ? "Submitting..." : <><Send size={18} /> Submit Application</>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
