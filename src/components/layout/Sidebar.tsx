import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Trophy, ChevronLeft, ChevronRight, LogOut, LogIn, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, isAdmin, isSuperAdmin } = useAuth();

  const navSections: NavSection[] = [
    {
      title: 'Home',
      items: [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Players', path: '/players' },
        { icon: Plus, label: 'New Match', path: '/match/new' },
        { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
      ],
    },
    {
      title: 'Manage',
      items: [
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: HelpCircle, label: 'Help', path: '/help' },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getRoleDisplay = () => {
    if (isSuperAdmin) return 'Super Admin';
    if (isAdmin) return 'Admin';
    return 'Viewer';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          {!collapsed && (
            <h1 className="text-lg font-semibold text-foreground whitespace-nowrap overflow-hidden">
              Football Tracker
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-1">
            {/* Section Heading */}
            {!collapsed && (
              <div className="px-3 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h2>
              </div>
            )}
            {collapsed && sectionIndex > 0 && (
              <div className="h-px bg-border my-2" />
            )}

            {/* Section Items */}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Button
                  key={item.path}
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    collapsed && "justify-center px-0"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-2 border-t border-border">
        {user ? (
          <div className="space-y-2">
            {!collapsed && (
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getRoleDisplay()}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10",
                collapsed && "justify-center px-0"
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="text-sm">Sign Out</span>}
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            className={cn(
              "w-full justify-start gap-3 h-10",
              collapsed && "justify-center px-0"
            )}
            onClick={() => navigate('/login', { state: { from: location } })}
          >
            <LogIn className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">Login</span>}
          </Button>
        )}
      </div>
    </div>
  );
}
