import { Shield, Zap, Trophy, Headphones, Target, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { memo } from "react";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "Pro-tier anti-cheat protocols and live admin monitoring for every single match.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Zero-Lag Infrastructure",
    description: "Battle on high-tickrate servers engineered for frame-perfect competition.",
    color: "secondary",
  },
  {
    icon: Trophy,
    title: "Massive Prize Pools",
    description: "Claim your share of thousands in monthly rewards and exclusive sponsorships.",
    color: "accent",
  },
  {
    icon: Headphones,
    title: "Pro-Player Support",
    description: "24/7 priority assistance from experts who understand the grind.",
    color: "primary",
  },
  {
    icon: Target,
    title: "Elo-Based Ranking",
    description: "Advanced matchmaking that ensures you only face worthy opponents.",
    color: "secondary",
  },
  {
    icon: Rocket,
    title: "Instant Cashouts",
    description: "Win today, spend today. Our automated payout system never sleeps.",
    color: "accent",
  },
];

const FeatureCard = memo(({ feature, index }: { feature: typeof features[0]; index: number }) => (
  <div 
    className="animate-fade-in-up"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <Card variant="glass-premium" className="group h-full p-10 hover:translate-y-[-12px] hover:border-primary/40 duration-300 overflow-hidden">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative",
        "bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors duration-300",
        "shadow-lg"
      )}>
        <feature.icon
          className={cn(
            "w-8 h-8",
            feature.color === "primary" && "text-primary",
            feature.color === "secondary" && "text-secondary",
            feature.color === "accent" && "text-accent"
          )}
        />
      </div>

      <h3 className="font-display text-2xl font-black text-white mb-6 group-hover:text-primary transition-colors tracking-tight">
        {feature.title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed font-heading uppercase tracking-widest font-bold">
        {feature.description}
      </p>

      {/* Status Indicator */}
      <div className="mt-10 flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
          ))}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-primary transition-colors">
          Active Module
        </span>
      </div>
    </Card>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

function WhyLilyNexComponent() {
  return (
    <section className="py-32 relative overflow-hidden bg-black/60">
      {/* Static Background Elements */}
      <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[180px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Static Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-heading font-black uppercase tracking-[0.4em] text-white/80">
              The Competitive Standard
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
            BORN FOR <span className="text-secondary italic text-glow-purple">GLORY</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base font-heading uppercase tracking-[0.2em] leading-relaxed">
            We've engineered the ultimate arena where skill is the only currency. 
            Join the evolution of competitive gaming at Lilynex Arena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export const WhyLilyNex = memo(WhyLilyNexComponent);
