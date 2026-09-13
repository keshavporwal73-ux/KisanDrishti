import React from 'react';
import type { VerificationStatus } from '@/types/evidence';
import { Eye, HelpCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'default';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'default',
  showIcon = true 
}) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'OBSERVED':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-semibold rounded ${
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
          } bg-emerald-700/15 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30 font-mono`}
        >
          {showIcon && <Eye className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
          OBSERVED
        </span>
      );

    case 'POSSIBLE':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-semibold rounded ${
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
          } bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-mono`}
        >
          {showIcon && <HelpCircle className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
          POSSIBLE
        </span>
      );

    case 'UNVERIFIED':
      return (
        <span 
          className={`inline-flex items-center gap-1 font-medium rounded ${
            isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
          } bg-muted text-muted-foreground border border-border font-mono`}
        >
          {showIcon && <AlertTriangle className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
          UNVERIFIED
        </span>
      );

    default:
      return null;
  }
};
