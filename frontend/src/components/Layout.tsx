import { Link, useLocation } from '@tanstack/react-router';
import { Activity, Settings, Heart, LogOut, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const { identity, clear, isLoggingIn, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/status-logo.dim_128x128.png"
              alt="Status"
              className="w-7 h-7 object-contain"
            />
            <div>
              <span className="font-semibold text-sm text-foreground tracking-tight">
                District Status
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2 font-mono">
                IT Operations
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                !isAdmin
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Status
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isAdmin
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Logout button — only shown in header when on admin route and authenticated */}
            {isAdmin && isAuthenticated && !isInitializing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                disabled={isLoggingIn}
                className="ml-1 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} District IT Operations
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 text-[oklch(0.62_0.22_25)] fill-[oklch(0.62_0.22_25)]" />
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'district-status-page')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
