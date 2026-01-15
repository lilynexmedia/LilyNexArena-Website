import { Link } from "react-router-dom";
import { Zap, Twitter, Youtube, Twitch, Instagram, Mail, MessageCircle } from "lucide-react";
import { useLegalDocs } from "@/hooks/useLegalDocs";

const footerLinks = {
  platform: [
    { label: "Events", href: "/events" },
    { label: "Tournament Rules", href: "/rules" },
    { label: "Support", href: "/support" },
    { label: "Help Center", href: "/help" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

const WHATSAPP_URL = "https://wa.me/7023592497?text=Hello, I need Help.";

const socialLinks = [
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
];

export function Footer() {
  const { data: legalDocs } = useLegalDocs();

  // Build legal links from database
  const legalLinks = legalDocs?.map(doc => ({
    label: doc.title,
    href: `/docs/${doc.slug}`,
  })) || [
    { label: "Privacy Policy", href: "/docs/privacy-policy" },
    { label: "Terms of Service", href: "/docs/terms-of-service" },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-black/40 backdrop-blur-[40px] pb-24 md:pb-0">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-primary/10 blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                <Zap className="w-6 h-6 text-primary fill-primary/20" />
              </div>
                <span className="font-display text-2xl font-black uppercase tracking-tighter text-white">
                  LILY<span className="text-primary">NEX</span> ARENA
                </span>
            </Link>
            
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-medium">
              THE NEXT GENERATION OF ESPORTS INFRASTRUCTURE. OPERATING AT THE INTERSECTION OF COMPETITION AND TECHNOLOGY.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 text-white/60 hover:text-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">
                TERMINAL
              </h3>
              <ul className="space-y-4">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">
                COMMAND
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">
                PROTOCOLS
              </h3>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              © {new Date().getFullYear()} LILYNEX ARENA. ALL SYSTEMS OPERATIONAL.
            </p>
          </div>
          
          <a
            href="mailto:lilynexesports@gmail.com"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary hover:border-primary/30 transition-all"
          >
            <Mail className="w-3 h-3 text-primary" />
            lilynexesports@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
