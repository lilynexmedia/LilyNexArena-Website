import { MessageCircle, Mail, BookOpen, Clock, Loader2, Send, ShieldCheck, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState, memo } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/7023592497?text=Hello, I need Help.";

const supportCategories = [
  {
    icon: MessageCircle,
    title: "LIVE COMMAND",
    description: "Instant access to tournament admins via secure WhatsApp frequency.",
    action: "ESTABLISH LINK",
    href: WHATSAPP_URL,
    isExternal: true,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: BookOpen,
    title: "INTEL ARCHIVE",
    description: "Classified guides, rules of engagement, and combat FAQs.",
    action: "ACCESS FILES",
    href: "/rules",
    isExternal: false,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

const SupportCard = memo(({ category }: { category: typeof supportCategories[0] }) => (
  <Card variant="glass-premium" className="h-full group hover:translate-y-[-4px] duration-300 overflow-hidden relative border-white/5">
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 opacity-20", category.bg)} />
    <CardContent className="p-6 md:p-8 text-center">
      <div className={cn("inline-flex p-4 md:p-5 rounded-xl md:rounded-2xl mb-4 md:mb-6 border border-white/10 shadow-lg transition-all duration-300", category.bg)}>
        <category.icon className={cn("w-6 h-6 md:w-8 md:h-8", category.color)} />
      </div>
      <h3 className="font-display text-lg md:text-xl font-black mb-2 md:mb-3 tracking-tighter uppercase">{category.title}</h3>
      <p className="text-white/50 text-[10px] md:text-xs mb-5 md:mb-6 font-medium leading-relaxed">{category.description}</p>
      {category.isExternal ? (
        <Button variant="gaming-premium" size="default" className="w-full h-10 md:h-12 text-xs" asChild>
          <a href={category.href} target="_blank" rel="noopener noreferrer">
            {category.action}
          </a>
        </Button>
      ) : (
        <Button variant="iphone" size="default" className="w-full h-10 md:h-12 text-xs bg-white/5 border-white/10" asChild>
          <Link to={category.href}>
            {category.action}
          </Link>
        </Button>
      )}
    </CardContent>
  </Card>
));
SupportCard.displayName = "SupportCard";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Transmission received! Command will respond within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error("Transmission failed. Re-establish connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-32 md:pb-32 mb-20 md:mb-0">
        {/* Static Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />
        </div>

        <section className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-5 shadow-lg">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">Support Protocol Alpha</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-black mb-5 md:mb-6 tracking-tighter leading-[0.9] italic">
              SUPPORT <br />
              <span className="text-primary italic">STATION</span>
            </h1>
            
            <p className="text-white/60 text-[10px] md:text-xs font-heading uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
              Elite operators standing by. Your victory is our priority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto mb-12 md:mb-20">
            {supportCategories.map((category) => (
              <SupportCard key={category.title} category={category} />
            ))}
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto relative">
            <Card variant="glass-premium" className="border-white/5 overflow-hidden p-0">
              <div className="p-6 md:p-10">
                <div className="flex flex-col items-center text-center mb-6 md:mb-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-5 border border-primary/20 shadow-lg">
                    <Zap className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-black mb-2 md:mb-3 uppercase tracking-tighter italic">ENCRYPTED SIGNAL</h2>
                  <p className="text-white/40 text-[10px] md:text-xs">Direct transmission to Lilynex Arena Command HQ</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Agent Identity</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        required
                        className="h-11 md:h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 px-4 text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Frequency ID</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="h-11 md:h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 px-4 text-sm font-medium transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Subject Vector</label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What's this about?"
                      required
                      className="h-11 md:h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 px-4 text-sm font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Intel Briefing</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your issue or question..."
                      required
                      rows={4}
                      className="rounded-xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 p-4 text-sm font-medium transition-all resize-none"
                    />
                  </div>
                  <Button type="submit" variant="gaming-premium" size="lg" className="w-full h-12 md:h-14 text-sm md:text-base tracking-wider font-bold shadow-lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        TRANSMIT <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5 flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Response time: 12-24 hours</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}