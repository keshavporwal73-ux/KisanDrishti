import type { ReactNode } from 'react';
import { HomePage } from './pages/HomePage';
import { NewAuditPage } from './pages/NewAuditPage';
import { AuditDetailPage } from './pages/AuditDetailPage';
import { EvidenceRecordsPage } from './pages/EvidenceRecordsPage';
import { DemoPage } from './pages/DemoPage';
import { CalibrationSheetPage } from './pages/CalibrationSheetPage';
import { ProtocolPage } from './pages/ProtocolPage';

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
    name: 'Audit Evidence Record',
    path: '/records/:id',
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
    name: 'Demo Mode (Wheat Sample)',
    path: '/demo',
    element: <DemoPage />,
    public: true,
  },
  {
    name: 'Physical Calibration Sheet',
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
