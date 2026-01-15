import { useState } from "react";
import { Search, ChevronDown, HelpCircle, Users, Trophy, CreditCard, Settings, Shield, MessageCircle, Zap, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/motion-wrapper";

const faqCategories = [
  {
    id: "getting-started",
    icon: Zap,
    title: "INITIATION",
    color: "text-primary",
    bg: "bg-primary/10",
    faqs: [
      {
        question: "How do I enlist in the hub?",
        answer: "Navigate to the 'Join The Elite' link on the homepage. Provide your operator credentials including primary frequency (email), tactical alias (username), and secure access key (password). Verify your frequency to complete initiation.",
      },
      {
        question: "How do I deploy to an arena?",
        answer: "Access the 'Arenas' sector, select your designated engagement zone, and click 'ENLIST'. Provide your squad roster details and await Command HQ clearance.",
      },
      {
        question: "What combat zones are active?",
        answer: "We currently support high-intensity operations in Valorant, BGMI, Counter-Strike 2, League of Legends, Apex Legends, and EA Sports FC. New zones are added per season.",
      },
    ],
  },
  {
    id: "registration",
    icon: Users,
    title: "SQUAD LOGISTICS",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    faqs: [
      {
        question: "What is the maximum squad size?",
        answer: "Squad configurations vary by arena. Standard operations require 5 primary units with up to 2 tactical reserves. Consult specific engagement rules for local limits.",
      },
      {
        question: "Can I enlist as a lone operator?",
        answer: "While most arenas are squad-based, we frequently deploy solo and duo operations. Monitor the 'Arenas' sector for 1v1 or individual engagement listings.",
      },
      {
        question: "What is the clearance protocol?",
        answer: "Post-enlistment, your data undergoes Command review. Upon mission clearance, your squad roster is finalized and you'll receive a secure transmission packet.",
      },
    ],
  },
  {
    id: "tournaments",
    icon: Trophy,
    title: "ARENA INTEL",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    faqs: [
      {
        question: "What are the engagement formats?",
        answer: "Operations utilize various tactical formats including Round Robin, Single Elimination, and Swiss. The format is detailed within each arena's documentation.",
      },
      {
        question: "How are match cycles determined?",
        answer: "Engagement schedules are broadcasted on the arena dashboard. Operators receive localized alerts via secure frequency before match initiation.",
      },
      {
        question: "Can I request schedule recalibration?",
        answer: "Contact Command HQ at least 24 cycles before match start. Recalibrations are rare and require critical justification and Command approval.",
      },
    ],
  },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.faqs.length > 0);

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
                <ShieldCheck className="w-4 h-4 text-primary animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Central Intelligence Database</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="scale" delay={0.1}>
              <h1 className="font-display text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-[0.85] italic">
                INTEL <br />
                <span className="text-primary italic text-glow-cyan">ARCHIVE</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal animation="slideUp" delay={0.2}>
              <div className="relative max-w-3xl mx-auto mt-16 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center p-2 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-3xl">
                  <Search className="absolute left-10 w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder="QUERY TACTICAL LOGS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-24 h-24 bg-transparent border-none focus:ring-0 text-2xl font-display font-black tracking-widest placeholder:text-white/10 uppercase"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="max-w-5xl mx-auto space-y-24">
            {filteredCategories.map((category, categoryIdx) => (
              <div key={category.id}>
                <ScrollReveal animation="slideDown">
                  <div className="flex items-center gap-6 mb-10 ml-4">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl", category.bg)}>
                      <category.icon className={cn("w-8 h-8", category.color)} />
                    </div>
                    <h2 className="font-display text-4xl font-black uppercase italic tracking-tighter">{category.title}</h2>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="slideUp" delay={0.2}>
                  <Card variant="glass-premium" className="border-white/5 overflow-hidden p-0">
                    <div className="divide-y divide-white/5">
                      {category.faqs.map((faq, faqIdx) => {
                        const itemId = `${category.id}-${faqIdx}`;
                        const isOpen = openItems.includes(itemId);

                        return (
                          <div key={itemId} className="group/item">
                            <button
                              onClick={() => toggleItem(itemId)}
                              className="w-full flex items-center justify-between p-10 md:p-14 text-left hover:bg-white/[0.02] transition-all duration-500 group-hover/item:pl-16"
                            >
                              <span className="font-display text-2xl font-black uppercase tracking-tight text-white/70 group-hover/item:text-white transition-colors italic">
                                {faq.question}
                              </span>
                              <div className={cn(
                                "w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-700 shadow-2xl",
                                isOpen ? "bg-primary text-black border-primary rotate-180" : "bg-white/5 text-white/30"
                              )}>
                                <ChevronDown className="w-6 h-6" />
                              </div>
                            </button>
                            
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                  <div className="px-10 md:px-14 pb-14 pt-4 border-t border-white/5 bg-white/[0.01]">
                                    <p className="text-white/40 font-bold font-heading leading-relaxed text-xl uppercase tracking-widest">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </ScrollReveal>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-40">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-12 shadow-3xl"
                >
                  <Search className="w-12 h-12 text-white/10" />
                </motion.div>
                <h3 className="font-display text-5xl font-black mb-6 uppercase tracking-tighter italic">ZERO HITS</h3>
                <p className="text-white/30 max-w-sm mx-auto font-bold font-heading uppercase tracking-widest text-lg">
                  Target data not found in current sector. recalibrate your query parameters.
                </p>
              </div>
            )}

            <ScrollReveal animation="scale" delay={0.5}>
              <Card variant="glass-premium" className="bg-primary/5 p-16 md:p-24 text-center border-primary/20 relative overflow-hidden group mt-32">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] -z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
                
                <MessageCircle className="w-24 h-24 text-primary mx-auto mb-12 animate-float" />
                <h3 className="font-display text-6xl font-black mb-8 uppercase tracking-tighter italic text-glow-cyan">NEED REINFORCEMENTS?</h3>
                <p className="text-white/40 text-2xl font-bold font-heading mb-16 max-w-3xl mx-auto uppercase tracking-widest leading-relaxed">
                  If your tactical query remains unresolved within the archive, establish a direct link with Command personnel.
                </p>
                <Button variant="gaming-premium" size="xl" className="h-28 px-20 text-2xl uppercase tracking-[0.4em] font-black italic shadow-3xl group" asChild>
                  <a href="/contact">
                    OPEN COMMS CHANNEL <Zap className="w-8 h-8 ml-6 group-hover:scale-125 transition-transform" />
                  </a>
                </Button>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
