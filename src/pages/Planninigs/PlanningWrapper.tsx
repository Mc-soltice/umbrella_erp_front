// src/pages/Plannings/PlanningWrapper.tsx
import { PlanningProvider } from '../../contexts/PlanningContext';
import PlanningManagement from './PlanningManagement';

export default function PlanningWrapper() {
  return (
    <PlanningProvider>
      <PlanningManagement />
    </PlanningProvider>
  );
}