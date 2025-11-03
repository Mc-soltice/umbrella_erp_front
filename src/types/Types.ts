export interface User {
  id: number;
  last_name: string;
  first_name: string;
  matricule: string;
  email: string;
  location: string;
  phone?: string;
  roles: string[];
}

// Gestion des candidatures
export interface Candidature {
  id: string;
  last_name: string;
  first_name: string;
  phone: number;
  email: string;
  location: string;
  create_at: Date;
}

export interface CreateCandidatureData {
  last_name: string;
  first_name: string;
  location: string;
  phone: number;
  email: string;
}

export interface UpdateCandidatureData {
  last_name?: string;
  first_name?: string;
  location?: string;
  phone?: string;
  email?: string;
}

export interface Notification {
  id: string;
  utilisateurId: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  lue: boolean;
  dateCreation: Date;
}

export interface MessageChat {
  id: string;
  expediteurId: string;
  destinataireId?: string;
  contenu: string;
  dateEnvoi: Date;
  lu: boolean;
  type: 'prive' | 'groupe';
  fichierJoint?: string;
}

export interface ConversationChat {
  id: string;
  last_name: string;
  participants: string[];
  type: 'prive' | 'groupe';
  dernierMessage?: MessageChat;
  dateCreation: Date;
}

export interface Dossier {
  id: string;
  last_name: string;
  description?: string;
  parentId?: string;
  proprietaireId: string;
  partage: 'prive' | 'equipe' | 'public';
  dateCreation: Date;
  dateModification: Date;
}

export interface Fichier {
  id: string;
  last_name: string;
  last_nameOriginal: string;
  extension: string;
  taille: number;
  type: string;
  dossierId: string;
  proprietaireId: string;
  url: string;
  dateCreation: Date;
  dateModification: Date;
  description?: string;
  tags: string[];
}

// --- Agents & Sites ---
// src/types/Types.ts
export interface Agent {
  id: number;
  matricule: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  location: string;
  status?: boolean;
  site: {
    id: number;
    name: string;
    location: string;
    responsable?: {
      id: number;
      first_name: string;
      last_name: string;
      matricule: string;
    };
  };
  // responsable?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Site {
  id: number;
  name: string;
  location: string;
  responsable?: {
    id: number;
    first_name: string;
    last_name: string;
    matricule: string;
  };
  agents_count?: number;
}

export interface AgentApiResponse {
  id: number;
  matricule: string;
  first_name: string;
  last_name: string;
  location: string;
  phone: string;
  email: string;
  site: Site;
  created_at: string;
  updated_at: string;
}

export interface CreateSiteData {
  name: string;
  location: string;
  responsable_id?: number;
}

// ✅ Remplacement de l’interface vide par un type
export type UpdateSiteData = Partial<CreateSiteData>;


// --- Planning et présence ---

// ✅ remplacement des enums par des unions littérales
export type AttendanceStatus = 'WORKED' | 'ABSENT' | 'REST' | 'REPLACEMENT';
export type ShiftType = 'MORNING' | 'EVENING';

export interface PlanningAgent {
  id?: number;
  agent_id: number;
  agent?: Agent;
  shift: ShiftType;
  status: AttendanceStatus;
  motif?: string | null;
  remplacant_id?: number | null;
  remplacant?: Agent | null;
}

export interface Planning {
  id: number;
  site: string;
  date: string;
  shifts: {
    day: PlanningAgent[];
    evening: PlanningAgent[];
  };
  created_by: string;
}

export interface PlanningAgentInput {
  agent_id: number;
  status: AttendanceStatus;
  reason?: string;
  remplacant_id?: number;
}

export interface CreatePlanningData {
  site_id: number;
  date: string;
  shifts: {
    MORNING: { agents: PlanningAgentInput[] };
    EVENING: { agents: PlanningAgentInput[] };
  };
  created_by: number;
}

export interface UpdatePlanningData extends CreatePlanningData {
  id: number;
}
