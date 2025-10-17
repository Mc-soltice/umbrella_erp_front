export interface User {
  id: number;
  last_name: string;
  first_name: string;
  matricule: string;
  email: string;
  location: string;
  phone?: string;
  roles: string;
}
// Gestion des candidatures
export interface Candidature {
  id: string;
  last_name: string;
  first_name: string;
  phone: number;
  email: string;
  location: string;
  create_at: Date; // Assurez-vous que c'est bien create_at et non createAt
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
  destinataireId?: string; // undefined pour messages de groupe
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
  parentId?: string; // Pour les sous-dossiers
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
  taille: number; // en bytes
  type: string; // MIME type
  dossierId: string;
  proprietaireId: string;
  url: string; // URL de téléchargement
  dateCreation: Date;
  dateModification: Date;
  description?: string;
  tags: string[];
}

// types/Types.ts
export interface Agent {
  id: number;
  matricule: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  status: boolean;
  site: string;
  responsable: string;
  created_at: Date;
}

export interface Site {
  id: number;
  name: string;
  location: string;
  responsable_id?: number;
  responsable?: User; // ✅ AJOUT : Pour avoir les infos du responsable
  agents: Agent[];
  created_at?: string; // ✅ AJOUT : Pour la date de création
}

export type Shift = 'morning' | 'evening';
export type Status = 'present' | 'absent' | 'repos' | 'permutation';

// src/types/planning.ts
export interface PlanningAgent {
  agent?: {
    first_name: string;
    last_name: string;
    matricule: string;
  };
  shift: 'morning' | 'evening';
  status: 'present' | 'absent' | 'repos' | 'permutation';
  motif?: string;
  remplacant_id?: number;
}

export interface Planning {
  id: number;
  site_id: number;
  date: string;
  agents: PlanningAgent[];
  site?: {
    id: number;
    name: string;
    address: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreatePlanningData {
  site_id: number;
  date: string;
  agents: Omit<PlanningAgent, 'agent'>[];
}

export interface UpdatePlanningData extends Partial<CreatePlanningData> { }


export interface Notification {
  id: string;
  utilisateurId: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  lue: boolean;
  dateCreation: Date;
}

