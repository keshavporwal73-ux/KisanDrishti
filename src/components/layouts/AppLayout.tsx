import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <DisclaimerBanner />
      <Header />
      <main className="flex-1 w-full flex flex-col min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
