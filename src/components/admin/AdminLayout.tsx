import { useEffect, useState, memo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Calendar, 
  FileText,
  Menu,
  X,
  Settings,
  Zap,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/settings', label: 'Site Settings', icon: Settings },
  { path: '/admin/events', label: 'Events', icon: Calendar },
  { path: '/admin/legal', label: 'Legal Docs', icon: FileText },
];

function AdminLayoutComponent() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Zap className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Simplified Background */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-xl border-r border-primary/10 transform transition-transform duration-300 ease-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full relative">
          {/* Logo Section */}
          <div className="p-8 border-b border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
                  LILY<span className="text-primary">NEX</span>
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-heading">Control Center</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-heading mb-4 px-3">Main Menu</p>
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full group flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-heading tracking-wider uppercase transition-colors duration-200 relative",
                    active
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer User Info */}
          <div className="p-6 mt-auto border-t border-primary/10 bg-black/20">
            <div className="bg-card/40 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-[2px]">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <ShieldAlert className="w-2 h-2 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-heading text-foreground truncate">{user.email}</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Admin</p>
                </div>
              </div>
              <Button 
                variant="heroOutline" 
                size="sm" 
                className="w-full text-[10px] py-4 h-auto"
                onClick={handleSignOut}
              >
                <LogOut className="w-3 h-3 mr-2" />
                Disconnect Session
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-primary/10 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-primary/10 hover:text-primary"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-sm tracking-tight">LILY<span className="text-primary">NEX</span> ADMIN</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export const AdminLayout = memo(AdminLayoutComponent);
