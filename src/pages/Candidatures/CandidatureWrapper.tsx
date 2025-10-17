// src/pages/Candidatures/CandidatureWrapper.tsx
import { CandidatureProvider } from '../../contexts/CandidatureContext';
import Candidature from './Candidature';

export default function CandidatureWrapper() {
  return (
    <CandidatureProvider>
      <Candidature />
    </CandidatureProvider>
  );
}