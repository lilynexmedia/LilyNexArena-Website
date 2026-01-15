import { Mail, MapPin, Phone, Clock, Send, Globe, Zap, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState, memo } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "COMM FREQUENCY",
    value: "CONTACT@LILYNEX.GG",
    href: "mailto:contact@lilynex.gg",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Phone,
    label: "DIRECT LINE",
    value: "+91 70235 92497",
    href: "tel:+917023592497",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: MapPin,
    label: "COMMAND SECTOR",
    value: "ARENA HQ, RAJASTHAN",
    href: null,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Clock,
    label: "OPERATIONAL STATUS",
    value: "24/7 ACTIVE DEPLOYMENT",
    href: null,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

const ContactInfoCard = memo(({ info }: { info: typeof contactInfo[0] }) => (
  <Card variant="glass-premium" className="group border-white/5 overflow-hidden hover:translate-x-2 duration-300">
    <CardContent className="p-4 md:p-5">
      <div className="flex items-center gap-4 md:gap-5">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${info.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-lg shrink-0`}>
          <info.icon className={`w-5 h-5 md:w-6 md:h-6 ${info.color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/40 font-bold mb-0.5">{info.label}</p>
          {info.href ? (
            <a href={info.href} className="text-sm md:text-base font-display font-bold hover:text-primary transition-colors tracking-tight block truncate">
              {info.value}
            </a>
          ) : (
            <p className="text-sm md:text-base font-display font-bold tracking-tight truncate">{info.value}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
));
ContactInfoCard.displayName = "ContactInfoCard";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Transmission Received! Command center will respond shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-5 shadow-lg group cursor-default">
              <Globe className="w-3 h-3 text-primary" />
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">Global Network Active</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-black mb-5 md:mb-6 tracking-tighter leading-[0.9] italic uppercase">
              SIGNAL <br />
              <span className="text-primary italic">TRANSMISSION</span>
            </h1>
            
            <p className="text-white/60 text-[10px] md:text-xs font-heading uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
              Establish direct link with Command HQ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Info Panel */}
            <div className="lg:col-span-5 space-y-4 md:space-y-5">
              {contactInfo.map((info) => (
                <ContactInfoCard key={info.label} info={info} />
              ))}

              <Card variant="glass-premium" className="bg-primary/5 mt-5 md:mt-6 border-primary/20 overflow-hidden relative group">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tight">PRIORITY INTEL?</h3>
                  </div>
                  <p className="text-xs md:text-sm text-white/50 mb-4 md:mb-5 leading-relaxed">
                    Check our documentation for quick answers to common questions.
                  </p>
                  <Button variant="gaming-premium" size="default" className="w-full h-10 md:h-12 text-xs md:text-sm" asChild>
                    <a href="/help">View Help Center</a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Form Panel */}
            <div className="lg:col-span-7">
              <Card variant="glass-premium" className="h-full border-white/5 overflow-hidden p-0">
                <div className="p-6 md:p-10">
                  <div className="flex flex-col mb-6 md:mb-8">
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                        <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight">CONTACT US</h2>
                    </div>
                    <p className="text-white/40 text-xs md:text-sm">Send us a message and we'll get back to you.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Your Name</label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your name"
                          required
                          className="h-11 md:h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 px-4 text-sm font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Email</label>
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
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Subject</label>
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
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 ml-3">Message</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        required
                        rows={5}
                        className="rounded-xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 p-4 text-sm font-medium transition-all resize-none min-h-[140px]"
                      />
                    </div>

                    <Button type="submit" variant="gaming-premium" size="lg" className="w-full h-12 md:h-14 text-sm md:text-base tracking-wider font-bold shadow-lg group">
                      <span className="flex items-center gap-2">
                        Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}