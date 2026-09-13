import type { ReactNode } from 'react';
import { HomePage } from './pages/HomePage';
import { NewAuditPage } from './pages/NewAuditPage';
import { AuditDetailPage } from './pages/AuditDetailPage';
import { EvidenceRecordsPage } from './pages/EvidenceRecordsPage';
import { DemoPage } from './pages/DemoPage';
import { CalibrationSheetPage } from './pages/CalibrationSheetPage';
import { ProtocolPage } from './pages/ProtocolPage';
import { MandiPricesPage } from './pages/MandiPricesPage';
import { QualityCalculatorPage } from './pages/QualityCalculatorPage';
import { GrainEncyclopediaPage } from './pages/GrainEncyclopediaPage';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Home / Dashboard',
    path: '/',
    element: <HomePage />,
    public: true,
  },
  {
    name: 'Start New Audit',
    path: '/audit/new',
    element: <NewAuditPage />,
    public: true,
  },
  {
    name: 'Create Evidence',
    path: '/create',
    element: <NewAuditPage />,
    public: true,
  },
  {
    name: 'Audit Evidence Record',
    path: '/records/:id',
    element: <AuditDetailPage />,
    public: true,
  },
  {
    name: 'Audit Detail Alias',
    path: '/audits/:id',
    element: <AuditDetailPage />,
    public: true,
  },
  {
    name: 'Audit Single Alias',
    path: '/audit/:id',
    element: <AuditDetailPage />,
    public: true,
  },
  {
    name: 'Evidence Repository',
    path: '/records',
    element: <EvidenceRecordsPage />,
    public: true,
  },
  {
    name: 'Evidence Repository Alias',
    path: '/audits',
    element: <EvidenceRecordsPage />,
    public: true,
  },
  {
    name: 'Interactive Evidence Showcase',
    path: '/showcase',
    element: <DemoPage />,
    public: true,
  },
  {
    name: 'Interactive Showcase Alias',
    path: '/demo',
    element: <DemoPage />,
    public: true,
  },
  {
    name: 'Live APMC Mandi Prices',
    path: '/prices',
    element: <MandiPricesPage />,
    public: true,
  },
  {
    name: 'Grain Quality Calculator',
    path: '/calculator',
    element: <QualityCalculatorPage />,
    public: true,
  },
  {
    name: 'Visual Grain Encyclopedia',
    path: '/encyclopedia',
    element: <GrainEncyclopediaPage />,
    public: true,
  },
  {
    name: 'Physical Alignment Sheet',
    path: '/calibration-sheet',
    element: <CalibrationSheetPage />,
    public: true,
  },
  {
    name: 'How It Works / Protocol',
    path: '/protocol',
    element: <ProtocolPage />,
    public: true,
  },
];
