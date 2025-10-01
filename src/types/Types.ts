export interface User {
  id: string;
  last_name: string;
  first_name: string;
  matricule: string;
  email: string;
  telephone?: string;
  role: 'admin' | 'coordinateur' | 'benevole';
  dateCreation: Date;
  actif: boolean;
  competences: string[];
}
// Gestion des candidatures
export interface Candidature {
  id: string;
  last_name: string;
  first_name: string;
  telephone: string;
  email: string;
  create_at: Date;
}

export interface CreateCandidatureData {
  last_name: string;
  first_name: string;
  telephone: string;
  email: string;
}

export interface UpdateCandidatureData {
  last_name?: string;
  first_name?: string;
  telephone?: string;
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
  id: string;
  location: string;
  agents: Agent[];
}

export type Shift = 'morning' | 'evening';
export type Status = 'present' | 'absent' | 'repos' | 'permutation';

export interface PlanningAgent {
  agent_id: number;
  shift: Shift;
  status: Status;
  motif?: string;
  remplacant_id?: number;
  agent?: Agent;
}

export interface Planning {
  id?: number;
  site_id: number;
  date: string;
  agents: PlanningAgent[];
}

export interface PlanningFormData {
  site_id: number;
  date: string;
  agents: PlanningAgent[];
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

