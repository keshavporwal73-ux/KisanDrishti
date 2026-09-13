import React from 'react';
import { CalibrationSheetView } from '@/components/calibration/CalibrationSheetView';

export const CalibrationSheetPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <CalibrationSheetView isStandalone={true} />
    </div>
  );
};
