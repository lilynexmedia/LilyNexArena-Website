import { Trophy, Users, Gamepad2, Zap } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Trophy, value: "500+", label: "Tournaments Hosted" },
  { icon: Users, value: "50K+", label: "Active Players" },
  { icon: Gamepad2, value: "25+", label: "Game Titles" },
  { icon: Zap, value: "$1M+", label: "Prize Pool Distributed" },
];

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-24 bg-gradient-dark overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={cn(
              "inline-block px-4 py-2 mb-4 text-xs font-heading uppercase tracking-[0.3em] text-secondary border border-secondary/30 bg-secondary/10 rounded-full transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            About Us
          </span>
          <h2
            className={cn(
              "font-display text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 delay-100",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            The Arena of <span className="text-gradient">Champions</span>
          </h2>
            <p
              className={cn(
                "text-muted-foreground max-w-2xl mx-auto text-lg transition-all duration-700 delay-200",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Lilynex Arena is the premier destination for competitive gaming. 
              We bring together the best players, the most exciting games, and 
              unforgettable tournament experiences.
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "esports-card p-6 text-center group hover-glow transition-all duration-700",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="font-heading text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
