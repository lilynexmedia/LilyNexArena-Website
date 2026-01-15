import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, PlayCircle, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSmartEventButton } from "@/hooks/useSmartEventButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const smartButton = useSmartEventButton();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-[94%] sm:w-[95%] max-w-7xl rounded-full px-4 sm:px-6",
        isScrolled
          ? "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] py-2 md:py-3"
          : "bg-black/10 backdrop-blur-md border border-white/5 py-3 md:py-5"
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="relative">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)] rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 blur-xl bg-primary/30 -z-10 group-hover:bg-primary/50 transition-colors" />
          </div>
          <div className="flex flex-col leading-none">
              <span className="font-display text-lg md:text-xl font-black tracking-tighter text-white">
                LILY<span className="text-primary italic">NEX</span> ARENA
              </span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Arena</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 md:gap-2 bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href || 
              (link.href !== "/" && location.pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative px-4 md:px-6 py-1.5 md:py-2 rounded-full font-heading text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 overflow-hidden group",
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-full shadow-[inset_0_0_12px_rgba(var(--primary),0.2)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 font-bold">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section - Smart Event Button */}
        <div className="flex items-center">
          {/* Desktop Button */}
          <div className="hidden md:flex">
            <Button 
              asChild 
              variant={smartButton.isLive ? "action-pulse" : "iphone"} 
              size="iphone-sm"
              className={smartButton.isLive ? "bg-red-500/90 hover:bg-red-500 border-red-400/50" : ""}
            >
              <Link to={smartButton.href} className="flex items-center gap-2">
                {smartButton.isLive ? (
                  <PlayCircle className="w-4 h-4" />
                ) : smartButton.label === "Upcoming" ? (
                  <Calendar className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{smartButton.isLive ? "Watch Live" : smartButton.label === "Upcoming" ? "Next Event" : "View Events"}</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button 
              asChild 
              variant="action-pulse" 
              size="iphone-sm" 
              className={cn(
                "px-3 h-8 text-[10px] border-none",
                smartButton.isLive 
                  ? "bg-red-500/90 hover:bg-red-500" 
                  : "bg-primary/90 hover:bg-primary"
              )}
            >
              <Link to={smartButton.href} className="flex items-center gap-1.5">
                {smartButton.isLive ? (
                  <PlayCircle className="w-3.5 h-3.5" />
                ) : (
                  <Calendar className="w-3.5 h-3.5" />
                )}
                <span>{smartButton.label}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
