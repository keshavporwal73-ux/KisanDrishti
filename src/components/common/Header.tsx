import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Camera, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  Menu, 
  X, 
  TrendingUp, 
  SlidersHorizontal, 
  BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { KisanDrishtiLogo } from '@/components/brand/KisanDrishtiLogo';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Evidence Records', path: '/records', icon: Layers },
    { label: 'Mandi Prices', path: '/prices', icon: TrendingUp },
    { label: 'Price Calculator', path: '/calculator', icon: SlidersHorizontal },
    { label: 'Grain Encyclopedia', path: '/encyclopedia', icon: BookOpen },
    { label: 'Showcase', path: '/showcase', icon: Sparkles },
    { label: 'Protocol', path: '/protocol', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Animated Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <KisanDrishtiLogo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Button & Mobile Menu */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs gap-1.5 shadow-sm">
            <Link to="/audit/new">
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Visual Evidence</span>
              <span className="sm:hidden">New Audit</span>
            </Link>
          </Button>

          {/* Mobile Sheet Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="w-5 h-5 text-foreground" />
                <span className="sr-only">Toggle Navigation Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="pb-3 border-b border-border">
                  <KisanDrishtiLogo size="sm" />
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-xs">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`p-2.5 rounded-lg flex items-center gap-2.5 transition-colors ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-serif text-xs gap-1.5">
                  <Link to="/audit/new" onClick={() => setIsOpen(false)}>
                    <Camera className="w-3.5 h-3.5" />
                    <span>Start Smartphone Capture</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
