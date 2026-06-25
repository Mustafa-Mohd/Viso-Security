import { Link } from "@tanstack/react-router";

export function TopNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[140] flex items-center justify-between px-8 py-5 mix-blend-difference">
      <div className="flex items-center gap-4">
        <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1782392385/ChatGPT_Image_Jun_25_2026_06_29_30_PM_agmwib.png" alt="Viso Clone" className="h-8 w-8 rounded-full object-cover" />
        <div className="font-mono text-xs tracking-[0.3em] text-foreground">VISO CLONE</div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8 font-mono text-[10px] tracking-[0.3em] text-foreground/70">
          <Link to="/" className="hover:text-foreground transition-colors">HOME</Link>
          <Link to="/certificates" className="hover:text-foreground transition-colors">CERTIFICATES</Link>
        </div>
        <Link to="/home" className="rounded-full border border-foreground/20 bg-foreground/10 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-foreground hover:bg-foreground/20 transition-colors backdrop-blur">
          ENTER SITE
        </Link>
      </div>
    </div>
  );
}
