import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLegalDoc } from "@/hooks/useLegalDocs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { renderMarkdown } from "@/lib/markdown";

export default function PrivacyPolicy() {
  const { data: doc, isLoading } = useLegalDoc("privacy-policy");

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-x-hidden">
      <Navbar />
      
      <main className="pt-24 md:pt-32 pb-24 md:pb-24 mb-20 md:mb-0">
        {/* Background Atmosphere */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
        </div>

        <section className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-16 w-3/4 bg-white/5" />
                <Skeleton className="h-6 w-full bg-white/5" />
                <Skeleton className="h-6 w-full bg-white/5" />
                <Skeleton className="h-6 w-2/3 bg-white/5" />
              </div>
            ) : !doc ? (
              <div className="text-center py-32">
                <h2 className="font-display text-3xl font-bold mb-6 uppercase tracking-tighter">Document Not Found</h2>
                <p className="text-white/40 mb-10 font-body">The privacy policy document is not available.</p>
                <Link to="/">
                  <Button variant="glassPrimary" size="xl" className="rounded-2xl uppercase tracking-widest font-black text-xs">
                    Return Home
                  </Button>
                </Link>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-3 text-white/40 hover:text-primary transition-all mb-12 group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="font-heading uppercase tracking-[0.3em] text-xs font-black">Back to Home</span>
                </Link>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight">
                      Privacy Policy
                    </h1>
                    <p className="text-white/40 text-sm">
                      Last updated: {new Date(doc.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <Card variant="glass" className="border-white/5 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <CardContent className="p-8 md:p-16">
                    <div className="max-w-none">
                      {renderMarkdown(doc.content)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
