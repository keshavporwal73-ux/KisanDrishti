import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Camera, 
  FolderLock, 
  Sparkles, 
  Grid, 
  BookOpen, 
  Menu, 
  CheckCircle2,
  Scale,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useLanguage, Language } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: t.startAudit || 'Start Audit', path: '/audit/new', highlight: true },
    { name: t.records || 'Evidence Records', path: '/records' },
    { name: t.demoMode || 'Demo Mode', path: '/demo', badge: 'Wheat Sample' },
    { name: t.calibrationSheet || 'Calibration Sheet', path: '/calibration-sheet' },
    { name: t.protocol || 'How It Works', path: '/protocol' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLanguageLabel = (l: Language) => {
    if (l === 'hi') return 'हिन्दी';
    if (l === 'pa') return 'ਪੰਜਾਬੀ';
    return 'English';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <Scale className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
                {t.appName || 'KisanDrishti'}
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary font-mono hidden sm:inline-flex">
                Tamper-Evident Protocol
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium italic tracking-wide">
              {t.tagline || 'Evidence Before Valuation.'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  active 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/15 text-amber-800 dark:text-amber-300 rounded font-medium">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Language Selector + Action Button & Mobile Menu */}
        <div className="flex items-center gap-2">
          
          {/* Multi-Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs font-medium gap-1.5">
                <Languages className="w-3.5 h-3.5 text-primary" />
                <span>{getLanguageLabel(language)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'font-bold text-primary' : ''}>
                English (Default)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('hi')} className={language === 'hi' ? 'font-bold text-primary' : ''}>
                हिन्दी (Hindi)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('pa')} className={language === 'pa' ? 'font-bold text-primary' : ''}>
                ਪੰਜਾਬੀ (Punjabi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild size="sm" className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
            <Link to="/audit/new">
              <Camera className="w-4 h-4 mr-1.5" />
              {t.startAudit || 'New Audit'}
            </Link>
          </Button>

          {/* Mobile Sheet Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] pt-6 flex flex-col justify-between">
                <div>
                  <SheetHeader className="text-left pb-4 border-b border-border">
                    <SheetTitle className="font-serif text-lg font-bold flex items-center gap-2">
                      <Scale className="w-5 h-5 text-primary" />
                      {t.appName || 'KisanDrishti'}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground italic">
                      {t.tagline || 'Evidence Before Valuation.'}
                    </p>
                  </SheetHeader>

                  <div className="py-4 flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const active = isActive(link.path);
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between ${
                            active 
                              ? 'bg-primary/10 text-primary font-semibold' 
                              : 'text-foreground hover:bg-muted/80'
                          }`}
                        >
                          <span>{link.name}</span>
                          {link.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/15 text-amber-800 dark:text-amber-300 rounded">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-col gap-2">
                  <Button asChild className="w-full bg-primary text-primary-foreground" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/audit/new">
                      <Camera className="w-4 h-4 mr-2" />
                      {t.startAudit || 'Start New Audit'}
                    </Link>
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground">
                    Tamper-Evident Visual Evidence Protocol v3.2
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
};
