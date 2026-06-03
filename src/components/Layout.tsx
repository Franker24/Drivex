import { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import NavigationDrawer from './NavigationDrawer';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="bg-background text-on-background selection:bg-secondary-fixed-dim selection:text-primary min-h-screen flex flex-col">
      {/* Reusable Header Navbar */}
      <Navbar onToggleDrawer={() => setDrawerOpen(true)} />
      
      {/* Sliding Sidebar Drawer */}
      <NavigationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-[64px] transition-all">
        {children}
      </main>
      
      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}
