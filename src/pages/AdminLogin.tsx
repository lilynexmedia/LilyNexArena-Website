import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/motion-wrapper";

export default function AdminLogin() {
  const { user, isAdmin, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

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

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 cyber-grid opacity-10" />
        </div>
        
        <Card variant="glass-premium" className="max-w-md w-full border-red-500/20 relative z-10">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-2xl">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="font-display text-3xl font-black mb-4 uppercase italic tracking-tighter">ACCESS DENIED</h1>
            <p className="text-white/40 mb-10 font-bold font-heading uppercase tracking-widest text-xs leading-relaxed">
              Operator privileges not found. This terminal is restricted to Command HQ personnel only.
            </p>
            <Button variant="iphone" className="w-full h-14" onClick={() => navigate('/')}>
              RETURN TO HUB
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-primary/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute inset-0 cyber-grid opacity-10" />
      </div>
      
      <ScrollReveal animation="scale">
        <Card variant="glass-premium" className="max-w-md w-full border-white/5 relative z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10" />
          
          <CardContent className="p-12 md:p-16">
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-2xl animate-float">
                <ShieldCheck className="w-12 h-12 text-primary" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50">Command Authorization Required</span>
              </div>
              
              <h1 className="font-display text-4xl font-black mb-4 uppercase italic tracking-tighter leading-none">COMMAND <br /><span className="text-primary italic">HUB LOGIN</span></h1>
              <p className="text-white/30 mb-12 font-bold font-heading uppercase tracking-widest text-[10px] leading-relaxed">
                Establish secure link via authorized Google frequency.
              </p>
              
              <Button 
                variant="gaming-premium" 
                size="xl" 
                className="w-full h-20 gap-4 text-xl tracking-widest font-black italic shadow-2xl"
                onClick={signInWithGoogle}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                ESTABLISH LINK
              </Button>
              
              <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
                  <Zap className="w-4 h-4" />
                  <span>Encrypted Channel Alpha-7</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
