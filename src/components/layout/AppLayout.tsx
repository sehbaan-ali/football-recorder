import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="w-full p-4 sm:p-6 pb-20 md:pb-6 max-w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
