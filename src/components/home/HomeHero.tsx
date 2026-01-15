import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Trophy, Target, Shield, ArrowRight } from "lucide-react";
import { memo } from "react";

function HomeHeroComponent() {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-center items-center text-center px-4 md:px-6 overflow-hidden select-none py-16 md:py-0">
      {/* Static Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] opacity-50" />
        <div className="absolute bottom-1/4 -right-20 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-secondary/20 rounded-full blur-[80px] md:blur-[120px] opacity-50" />
        
        {/* Cyber Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 md:mb-8 rounded-full bg-black/60 backdrop-blur-xl border border-primary/20 shadow-lg">
          <div className="relative">
            <Trophy className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[8px] md:text-[9px] font-heading font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/80">
            ELITE TOURNAMENT <span className="text-primary italic">ARE</span> UPCOMING
          </span>
        </div>

        <div className="relative mb-6 md:mb-8 px-4">
          <h1 className="font-display text-6xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] relative italic">
            <span className="text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">LILY</span>
            <span className="text-primary italic text-glow-cyan">NEX</span>
            <span className="text-white block sm:inline sm:ml-3 text-2xl sm:text-4xl md:text-6xl lg:text-7xl opacity-50 mt-1 sm:mt-0">ARENA</span>
          </h1>
          
          {/* HUD Title Elements */}
          <div className="absolute -top-4 -right-2 md:-top-6 md:-right-16 hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[8px] md:text-[7px] font-bold uppercase tracking-widest text-primary">System Online</span>
            </div>
            <div className="text-[11px] md:text-[8px] font-bold text-white/20 tracking-[0.2em] italic uppercase">Sector 5-G / Command</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 md:gap-8 mb-8 md:mb-10 w-full">
          <div className="h-[1px] w-24 md:w-36 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white/50 font-heading text-[7px] md:text-[8px] uppercase tracking-[0.15em] md:tracking-[0.3em] font-bold px-4">
            {[
              { icon: Shield, label: "ANTI-CHEAT ENGINE" },
              { icon: Target, label: "PRECISION MATCHMAKING" },
              { icon: Zap, label: "INSTANT REWARD PAYLOAD" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 md:gap-2 group">
                <item.icon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center w-full px-4">
          <Button variant="gaming-premium" size="lg" asChild className="group h-11 md:h-12 w-full sm:w-auto px-6 md:px-8 text-sm md:text-base tracking-[0.1em] font-bold italic shadow-lg">
            <Link to="/events" className="flex items-center gap-2">
              DEPLOY TO ARENA
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="iphone" size="lg" asChild className="h-11 md:h-12 w-full sm:w-auto px-6 md:px-8 text-sm md:text-base tracking-[0.1em] font-bold italic bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 backdrop-blur-xl">
            <Link to="/registration">JOIN THE ELITE</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-10 flex flex-col items-center gap-2">
        <div className="relative w-5 h-8 md:w-6 md:h-10 border border-white/10 rounded-full flex justify-center p-1 backdrop-blur-md">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
        <span className="text-[6px] md:text-[7px] font-bold uppercase tracking-[0.3em] text-white/20">Scroll for Intel</span>
      </div>
    </section>
  );
}

export const HomeHero = memo(HomeHeroComponent);
