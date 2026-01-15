import { useParams, Link } from "react-router-dom";
import { FileText, ChevronRight, ArrowLeft, Shield, Scale, Gavel } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLegalDocs, useLegalDoc } from "@/hooks/useLegalDocs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Simple markdown renderer
function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;
  let inList = false;
  let listItems: JSX.Element[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++} className="list-disc list-inside space-y-3 mb-6 text-white/60 font-body">{listItems}</ul>);
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={key++} className="font-display text-4xl md:text-5xl font-bold mb-8 mt-12 tracking-tighter uppercase italic text-primary">{trimmed.slice(2)}</h1>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={key++} className="font-display text-2xl md:text-3xl font-bold mb-6 mt-10 tracking-tight text-white uppercase">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={key++} className="font-display text-xl font-bold mb-4 mt-8 text-white/90 uppercase tracking-wide">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const content = trimmed.slice(2);
      const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
      listItems.push(<li key={key++} className="pl-2" dangerouslySetInnerHTML={{ __html: formattedContent }} />);
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      const formattedContent = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
      elements.push(<p key={key++} className="text-white/60 mb-6 font-body leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: formattedContent }} />);
    }
  }
  
  flushList();
  return elements;
}

function DocsList() {
  const { data: docs, isLoading } = useLegalDocs();
  
  // Filter out policy documents that have their own pages
  const policySlugList = ['privacy-policy', 'refund-policy', 'terms-and-conditions', 'disclaimer', 'contact-support'];
  const filteredDocs = docs?.filter(doc => !policySlugList.includes(doc.slug));

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!filteredDocs || filteredDocs.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p className="text-white/40 font-body">No additional documents available.</p>
        <p className="text-white/30 text-sm mt-2">Check out the policy pages linked below.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredDocs.map((doc, idx) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Link to={`/docs/${doc.slug}`}>
            <Card variant="glass" className="group border-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-2xl">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors tracking-tight uppercase">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-white/40 font-body mt-1">
                      Protocol Updated: {new Date(doc.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-2 transition-all duration-500">
                    <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function DocDetail({ slug }: { slug: string }) {
  const { data: doc, isLoading } = useLegalDoc(slug);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-3/4 bg-white/5" />
        <Skeleton className="h-6 w-full bg-white/5" />
        <Skeleton className="h-6 w-full bg-white/5" />
        <Skeleton className="h-6 w-2/3 bg-white/5" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-32">
        <h2 className="font-display text-3xl font-bold mb-6 uppercase tracking-tighter">Archive Not Found</h2>
        <p className="text-white/40 mb-10 font-body">The requested protocol documentation is missing or has been relocated.</p>
        <Link to="/docs">
          <Button variant="glassPrimary" size="xl" className="rounded-2xl uppercase tracking-widest font-black text-xs">
            Return to Archives
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link
        to="/docs"
        className="inline-flex items-center gap-3 text-white/40 hover:text-primary transition-all mb-12 group"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-heading uppercase tracking-[0.3em] text-xs font-black">Back to Archives</span>
      </Link>
      
      <Card variant="glass" className="border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <CardContent className="p-8 md:p-16">
          <div className="max-w-none">
            {renderMarkdown(doc.content)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Docs() {
  const { slug } = useParams();

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
          {!slug && (
            <div className="max-w-4xl mx-auto text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
              >
                <Shield className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-heading uppercase tracking-[0.3em] text-white/80 font-black">System Protocols</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase"
              >
                LEGAL <span className="text-primary italic">CORE</span>
              </motion.h1>
              
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/40 text-lg md:text-xl font-body max-w-2xl mx-auto"
                >
                  Operational frameworks and legal governance for the Lilynex Arena ecosystem.
                </motion.p>
            </div>
          )}
          
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {slug ? (
                <DocDetail key="detail" slug={slug} />
              ) : (
                <div key="list" className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-8">
                    <DocsList />
                  </div>
                  <div className="md:col-span-4 space-y-8">
                    <Card variant="gaming" className="border-primary/20 bg-primary/5 p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />
                      <Scale className="w-12 h-12 text-primary mb-6 group-hover:rotate-12 transition-transform duration-500" />
                      <h3 className="font-display text-xl font-bold mb-4 uppercase tracking-tight">Governance</h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-6">
                        Our platform operates under strict ethical and competitive standards to ensure a fair environment for all players.
                      </p>
                      <div className="w-full h-px bg-white/10 mb-6" />
                      <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Gavel className="w-4 h-4" />
                        <span>Compliance Active</span>
                      </div>
                    </Card>
                    
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                      <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-4">Quick Navigation</h4>
                      <ul className="space-y-3">
                        {[
                          { name: 'Terms & Conditions', path: '/terms-and-conditions' },
                          { name: 'Privacy Policy', path: '/privacy-policy' },
                          { name: 'Refund Policy', path: '/refund-policy' },
                          { name: 'Disclaimer', path: '/disclaimer' },
                          { name: 'Contact & Support', path: '/contact-support' },
                        ].map((item) => (
                          <li key={item.path}>
                            <Link to={item.path} className="text-sm text-white/40 hover:text-white transition-colors flex items-center justify-between group">
                              {item.name}
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
