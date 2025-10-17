// src/pages/Agents/AgentsWrapper.tsx
import { AgentProvider } from '../../contexts/AgentContext';
import AgentManagement from './Agents';

export default function AgentsWrapper() {
  return (
    <AgentProvider>
      <AgentManagement />
    </AgentProvider>
  );
}