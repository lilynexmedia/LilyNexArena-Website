import { useEvents, useRegistrations } from '@/hooks/useEvents';
import { useLegalDocs } from '@/hooks/useLegalDocs';
import { Calendar, Users, Trophy, FileText, TrendingUp, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ScrollReveal, MotionWrapper } from '@/components/ui/motion-wrapper';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  loading,
  delay = 0
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType; 
  description?: string;
  loading?: boolean;
  delay?: number;
}) => (
  <MotionWrapper animation="scale" delay={delay}>
    <Card className="bg-card/40 backdrop-blur-md border-primary/10 hover:border-primary/30 transition-all duration-300 group gaming-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-primary/10 transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-heading uppercase tracking-[0.2em] text-muted-foreground">{title}</CardTitle>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20 bg-primary/5" />
        ) : (
          <>
            <div className="text-3xl font-display font-bold text-foreground tracking-tighter mb-1">{value}</div>
            {description && (
              <p className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground/80">{description}</p>
            )}
          </>
        )}
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-transparent opacity-30" />
    </Card>
  </MotionWrapper>
);

export const AdminDashboard = () => {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: registrations, isLoading: regsLoading } = useRegistrations();
  const { data: legalDocs, isLoading: docsLoading } = useLegalDocs();

  const liveEvents = events?.filter(e => e.status === 'live').length || 0;
  const upcomingEvents = events?.filter(e => e.status === 'upcoming').length || 0;
  const pendingRegs = registrations?.filter(r => r.status === 'pending').length || 0;
  const approvedRegs = registrations?.filter(r => r.status === 'approved').length || 0;

  const recentRegistrations = registrations
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || [];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary/10 pb-8">
        <div>
          <MotionWrapper animation="fade">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-heading uppercase tracking-[0.3em] text-primary">System Online</span>
            </div>
          </MotionWrapper>
          <MotionWrapper animation="slideUp" delay={0.1}>
            <h1 className="text-4xl font-display font-black text-foreground tracking-tighter">
              DASH<span className="text-primary">BOARD</span>
            </h1>
          </MotionWrapper>
          <MotionWrapper animation="slideUp" delay={0.2}>
            <p className="text-muted-foreground font-heading uppercase tracking-wider text-xs">LilyNex Command & Control</p>
          </MotionWrapper>
        </div>
        <MotionWrapper animation="fade" delay={0.3}>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" asChild className="h-10 px-6 gaming-border">
              <Link to="/admin/events">Manage Events</Link>
            </Button>
            <Button variant="hero" size="sm" asChild className="h-10 px-6">
              <Link to="/admin/events">Create Event</Link>
            </Button>
          </div>
        </MotionWrapper>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={events?.length || 0}
          icon={Calendar}
          description={`${liveEvents} live, ${upcomingEvents} upcoming`}
          loading={eventsLoading}
          delay={0.1}
        />
        <StatCard
          title="Pending Queue"
          value={pendingRegs}
          icon={Users}
          description="Awaiting Approval"
          loading={regsLoading}
          delay={0.2}
        />
        <StatCard
          title="Battle Teams"
          value={approvedRegs}
          icon={ShieldCheck}
          description="Verified Combatants"
          loading={regsLoading}
          delay={0.3}
        />
        <StatCard
          title="Published Intel"
          value={legalDocs?.length || 0}
          icon={FileText}
          description="Legal Protocols"
          loading={docsLoading}
          delay={0.4}
        />
      </div>

      {/* Quick Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations */}
        <MotionWrapper animation="slideUp" delay={0.5}>
          <Card className="bg-card/40 backdrop-blur-md border-primary/10 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardHeader className="border-b border-primary/10 pb-4">
              <CardTitle className="text-sm font-heading uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                Incoming Registrations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {regsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-16 w-full bg-primary/5" />
                  ))}
                </div>
              ) : recentRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-heading uppercase tracking-widest text-xs">No pending data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRegistrations.map((reg, idx) => (
                    <motion.div 
                      key={reg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (idx * 0.1) }}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 font-bold text-secondary text-xs">
                          {reg.team_name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm tracking-tight group-hover:text-secondary transition-colors">{reg.team_name}</p>
                          <p className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
                            {reg.events?.name || 'Protocol Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-heading uppercase tracking-widest ${
                          reg.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          reg.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}>
                          {reg.status}
                        </span>
                        <p className="text-[10px] font-heading text-muted-foreground mt-2 opacity-60">
                          {format(new Date(reg.created_at), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <Button variant="ghost" className="w-full mt-2 text-[10px] uppercase tracking-[0.2em] font-heading hover:text-secondary" asChild>
                    <Link to="/admin/events">View All Registrations <ArrowRight className="w-3 h-3 ml-2" /></Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Live & Upcoming Events */}
        <MotionWrapper animation="slideUp" delay={0.6}>
          <Card className="bg-card/40 backdrop-blur-md border-primary/10 h-full relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mb-16 blur-2xl" />
            <CardHeader className="border-b border-primary/10 pb-4">
              <CardTitle className="text-sm font-heading uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                Active Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {eventsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-16 w-full bg-primary/5" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {events?.filter(e => e.status === 'live' || e.status === 'upcoming').slice(0, 5).map((event, idx) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (idx * 0.1) }}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Trophy className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{event.name}</p>
                          <p className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">{event.game}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-heading uppercase tracking-widest ${
                          event.status === 'live' ? 'bg-destructive/10 text-destructive border border-destructive/20 animate-pulse' :
                          'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          {event.status}
                        </span>
                        <p className="text-[10px] font-heading text-muted-foreground mt-2 opacity-60">
                          {format(new Date(event.start_date), 'MMM d')}
                        </p>
                      </div>
                    </motion.div>
                  )) || (
                    <div className="text-center py-12">
                      <Trophy className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground font-heading uppercase tracking-widest text-xs">No active ops</p>
                    </div>
                  )}
                  <Button variant="ghost" className="w-full mt-2 text-[10px] uppercase tracking-[0.2em] font-heading hover:text-primary" asChild>
                    <Link to="/admin/events">Manage Battle Events <ArrowRight className="w-3 h-3 ml-2" /></Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </div>
  );
};
