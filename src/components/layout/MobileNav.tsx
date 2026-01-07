import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Players', path: '/players' },
    { icon: Plus, label: 'Match', path: '/match/new' },
    { icon: Trophy, label: 'Board', path: '/leaderboard' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
