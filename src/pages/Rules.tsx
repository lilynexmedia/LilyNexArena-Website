import { Shield, AlertTriangle, CheckCircle, XCircle, Scale, Users, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";

const rulesSections = [
  {
    title: "ARENA PROTOCOLS",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
    rules: [
      "Operators must be at least 16 cycles of age to enlist.",
      "Valid Neural IDs (Game IDs) must be used for all transmissions.",
      "Squad rosters are locked once the deployment channel closes.",
      "Squads can enlist up to 2 substitute tactical units.",
      "All engagements must occur on official verified servers.",
      "Mission schedules are absolute. Command must approve changes.",
    ],
  },
  {
    title: "CONDUCT OF COMBAT",
    icon: Scale,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    rules: [
      "Respect all operators, command personnel, and observers.",
      "Zero tolerance for toxic signals or discriminatory packets.",
      "Maintain elite sportsmanship integrity at all times.",
      "No intentional sabotage or match frequency interference.",
      "Comply with all command decisions without hesitation.",
      "Report violations only through official secure frequencies.",
    ],
  },
  {
    title: "FAIR PLAY LOGIC",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-400/10",
    rules: [
      "Cheating or external neural augmentations are forbidden.",
      "Only approved hardware and official software are allowed.",
      "Frequency intercepting (stream sniping) is a critical fail.",
      "Identity fraud or account boosting triggers immediate ban.",
      "Report any discovered system exploits to Command.",
      "Security protocols must remain active during engagement.",
    ],
  },
];

const violations = [
  {
    type: "Phase 1 Warning",
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    examples: ["Late arrival", "Minor toxicity", "Technical errors"],
    penalty: "WARNING / TEMPORARY SUSPENSION",
  },
  {
    type: "Critical Failure",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    examples: ["Cheating", "Match Fixing", "Severe Harassment"],
    penalty: "PERMANENT BAN / ASSET FORFEITURE",
  },
];

export default function Rules() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-32 md:pb-32 mb-20 md:mb-0">
        {/* Futuristic Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute inset-0 cyber-grid opacity-10" />
        </div>

        <section className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-32">
            <ScrollReveal animation="slideDown">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-12 shadow-2xl">
                <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Official Rules of Engagement</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="scale" delay={0.1}>
              <h1 className="font-display text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-[0.85] italic">
                ENGAGEMENT <br />
                <span className="text-primary italic text-glow-cyan">PROTOCOLS</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal animation="slideUp" delay={0.2}>
              <p className="text-white/40 text-sm md:text-base font-heading uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
                Synchronization with Command protocols is mandatory. 
                Failure to comply will result in immediate termination of deployment status.
              </p>
            </ScrollReveal>
          </div>

          <div className="max-w-5xl mx-auto space-y-12 mb-32">
            {rulesSections.map((section, sectionIdx) => (
              <ScrollReveal
                key={section.title}
                animation="slideUp"
                delay={sectionIdx * 0.1 + 0.3}
              >
                <Card variant="glass-premium" className="group border-white/5 overflow-hidden relative">
                  <div className="p-12 md:p-20">
                    <div className="flex items-center gap-8 mb-16">
                      <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110", section.bg)}>
                        <section.icon className={cn("w-10 h-10", section.color)} />
                      </div>
                      <h2 className="font-display text-4xl font-black uppercase tracking-tighter italic">{section.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                      {section.rules.map((rule, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex gap-6 group/item"
                        >
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-primary group-hover/item:bg-primary/10 transition-all duration-500">
                            <span className="text-xs font-black text-white/20 group-hover/item:text-primary">{idx + 1}</span>
                          </div>
                          <span className="text-white/50 font-bold font-heading uppercase tracking-widest text-sm leading-relaxed group-hover/item:text-white/80 transition-colors">{rule}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <div className="max-w-5xl mx-auto">
            <ScrollReveal animation="slideDown">
              <div className="flex items-center gap-6 mb-16 ml-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-2xl">
                  <Zap className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
                <h2 className="font-display text-5xl font-black uppercase tracking-tighter italic">ENFORCEMENT ACTIONS</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
              {violations.map((violation, idx) => (
                <ScrollReveal
                  key={violation.type}
                  animation="scale"
                  delay={idx * 0.1 + 0.5}
                >
                  <Card variant="glass-premium" className="group border-white/5 hover:border-red-500/30 transition-all duration-700 h-full">
                    <div className="p-12">
                      <div className="flex items-center gap-6 mb-10">
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl", violation.bg)}>
                          <violation.icon className={cn("w-8 h-8", violation.color)} />
                        </div>
                        <h3 className="font-display text-3xl font-black uppercase italic tracking-tighter">{violation.type}</h3>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">INTEL SAMPLES</p>
                          <ul className="space-y-4">
                            {violation.examples.map((example, i) => (
                              <li key={i} className="text-white/40 text-sm font-black font-heading uppercase tracking-widest flex items-center gap-4 group-hover:text-white/60 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-10 border-t border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">SANCTION PROTOCOL</p>
                          <p className={cn("text-2xl font-black italic uppercase tracking-tighter", violation.color)}>{violation.penalty}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="slideUp" delay={0.8}>
              <Card variant="glass-premium" className="bg-primary/5 border-primary/20 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
                <div className="p-16 md:p-24">
                  <ShieldCheck className="w-24 h-24 text-primary mx-auto mb-10 animate-float shadow-2xl" />
                  <h3 className="font-display text-5xl font-black mb-8 uppercase tracking-tighter italic">SYNCHRONIZED</h3>
                    <p className="text-white/40 text-xl font-bold font-heading uppercase tracking-widest max-w-3xl mx-auto leading-relaxed">
                      By enlisting in any Lilynex Arena engagement, you acknowledge full synchronization with these protocols. 
                      Command HQ reserves absolute authority over all sanction deployment.
                    </p>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
