import { Link } from "@tanstack/react-router";

export function TopNav() {
  return (
    <>
      {/* Normal Layer for Logo */}
      <div className="fixed top-0 left-0 z-[150] px-8 py-5 flex items-center">
        <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1782392385/ChatGPT_Image_Jun_25_2026_06_29_30_PM_agmwib.png" alt="Viso Clone" className="h-8 w-8 rounded-full object-cover shadow-[0_0_10px_rgba(223,155,42,0.3)]" />
      </div>

      {/* Mix-Blend Layer for Text */}
      <div className="fixed top-0 left-0 right-0 z-[140] flex items-center justify-between px-8 py-5 mix-blend-difference pointer-events-none">
        <div className="flex items-center pl-[52px]">
          <div className="font-mono text-xs tracking-[0.3em] text-white pointer-events-auto">VISO CLONE</div>
        </div>
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="hidden md:flex gap-8 font-mono text-[10px] tracking-[0.3em] text-white/70">
            <Link to="/" className="hover:text-white transition-colors">STORY</Link>
            <Link to="/certificates" className="hover:text-white transition-colors">CERTIFICATES</Link>
          </div>
          <Link to="/home" className="group flex items-center gap-2 rounded-full border border-[#DF9B2A]/50 bg-[#DF9B2A]/10 px-6 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#DF9B2A] hover:bg-[#DF9B2A]/20 hover:border-[#DF9B2A] transition-all backdrop-blur">
            HOME PAGE
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
