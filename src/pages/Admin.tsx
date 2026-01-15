import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdminVideoSettings } from '@/components/admin/AdminVideoSettings';
import { LogOut, Users, Calendar, Trophy, Image, Video, Settings, ShieldCheck, LayoutDashboard, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/motion-wrapper';

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const NetworkPulse = () => (
    <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-20">
      <motion.div
        animate={{
          x: ["-100%", "100%"],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        className="h-[2px] w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 cyber-grid opacity-10" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div className="flex flex-col leading-none">
                <h1 className="text-lg font-display font-black tracking-tighter uppercase">COMMAND <span className="text-primary italic">HUB</span></h1>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">LILY NEX ADMIN</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">OPERATOR ACTIVE</span>
              <span className="text-xs font-bold text-primary">{user.email}</span>
            </div>
            <Button variant="iphone" size="iphone-sm" onClick={handleSignOut} className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400">
              <LogOut className="w-3.5 h-3.5 mr-2" />
              TERMINATE SESSION
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 relative z-10">
        <ScrollReveal animation="slideDown">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter">CONTROL CENTER</h2>
          </div>
        </ScrollReveal>

        {/* Site Settings Section */}
        <div className="mb-20">
          <ScrollReveal animation="slideUp" delay={0.1}>
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-5 h-5 text-secondary" />
              <h3 className="text-xl font-display font-black uppercase tracking-widest text-white/60">SYSTEM CONFIGURATION</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdminVideoSettings />
            </div>
          </ScrollReveal>
        </div>

        {/* Management Section */}
        <ScrollReveal animation="slideUp" delay={0.2}>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-display font-black uppercase tracking-widest text-white/60">ASSET MANAGEMENT</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "BATTLE ARENAS", desc: "Configure match zones and rulebooks", icon: Calendar, color: "text-blue-400", bg: "bg-blue-400/10" },
              { title: "SQUAD ROSTERS", desc: "Verify and deploy registered units", icon: Users, color: "text-green-400", bg: "bg-green-400/10" },
              { title: "GLORY RECORDS", desc: "Finalize victors and reward payloads", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
              { title: "INTEL ARCHIVE", desc: "Update media visual assets", icon: Image, color: "text-purple-400", bg: "bg-purple-400/10" },
              { title: "STREAM FEEDS", desc: "Broadcast frequency control", icon: Video, color: "text-red-400", bg: "bg-red-400/10" },
            ].map((item, i) => (
              <Card key={item.title} variant="glass-premium" className="group border-white/5 hover:translate-y-[-8px] duration-500">
                <CardContent className="p-10">
                  <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-8 border border-white/5 shadow-2xl transition-transform group-hover:scale-110 duration-500`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h4 className="text-2xl font-display font-black text-white mb-4 uppercase italic tracking-tighter">{item.title}</h4>
                  <p className="text-white/40 text-sm font-bold font-heading uppercase tracking-widest leading-relaxed mb-10">{item.desc}</p>
                  <Button variant="iphone" className="w-full h-14 bg-white/5 border-white/10 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-500" disabled>
                    SECURE ACCESS LINKED
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </main>

      <footer className="mt-20 py-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">LilyNex Command Protocol v2.4.0</p>
      </footer>
    </div>
  );
};

export default Admin;
