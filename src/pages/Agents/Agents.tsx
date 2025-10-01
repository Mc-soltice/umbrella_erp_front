// components/AgentManagement.tsx
import { useState } from 'react';
import type { Agent } from "../../types/Types";
import { useAgents } from '../../contexts/AgentContext';
import { Orbit } from 'ldrs/react';
import 'ldrs/react/Orbit.css';
import { CheckCircle, Edit, Trash } from 'lucide-react';

export default function AgentManagement() {
  const { deleteAgent, updateAgent } = useAgents();
//   const { agents,fetchAgent } = useAgents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>('Tous');
    //  const [loading, setLoading] = useState(false);

  // States pour le formulaire de modification
  const [editMatricule, setEditMatricule] = useState("");
  const [editNom, setEditNom] = useState("");
  const [editPrenom, setEditPrenom] = useState("");
  const [editTelephone, setEditTelephone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSite, setEditSite] = useState("");
  const [editResponsable, setEditResponsable] = useState("");
  const [editLoading, setEditLoading] = useState(false);


    // const filteredAgents = agents.filter(agent => {
    //     return agent.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       agent.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    //   });

  // Données d'exemple classées par sites
  const sitesData = {
    "Site Principal": [
      {
        id: 1,
        matricule: 'MAT001',
        last_name: 'Ngoumba',
        first_name: 'Clarisse',
        email: 'clarisse.ngoumba@example.com',
        phone: '+237 690 12 34 56',
        status: true,
        site: 'Site Principal',
        responsable: 'Admin System',
        created_at: new Date('2023-10-01T10:30:00')
      },
      {
        id: 2,
        matricule: 'MAT002',
        last_name: 'Mbappe',
        first_name: 'Jean-Paul',
        email: 'jp.mbappe@example.com',
        phone: '+237 699 87 65 43',
        status: true,
        site: 'Site Principal',
        responsable: 'Admin System',
        created_at: new Date('2023-10-02T14:20:00')
      }
    ],
    "Site Secondaire": [
      {
        id: 3,
        matricule: 'MAT003',
        last_name: 'Tchoua',
        first_name: 'Aline',
        email: 'aline.tchoua@example.com',
        phone: '+237 674 33 22 11',
        status: true,
        site: 'Site Secondaire',
        responsable: 'Manager Site B',
        created_at: new Date('2023-10-03T09:15:00')
      }
    ],
    "Site Régional": [
      {
        id: 4,
        matricule: 'MAT004',
        last_name: 'Kouassi',
        first_name: 'Brice',
        email: 'brice.kouassi@example.com',
        phone: '+237 655 44 77 88',
        status: false,
        site: 'Site Régional',
        responsable: 'Directeur Régional',
        created_at: new Date('2023-10-04T16:45:00')
      },
      {
        id: 5,
        matricule: 'MAT005',
        last_name: 'Ewane',
        first_name: 'Marina',
        email: 'marina.ewane@example.com',
        phone: '+237 698 99 88 77',
        status: true,
        site: 'Site Régional',
        responsable: 'Directeur Régional',
        created_at: new Date('2023-10-05T11:20:00')
      }
    ]
  };


  const handleOpenEditModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditMatricule(agent.matricule);
    setEditNom(agent.last_name);
    setEditPrenom(agent.first_name);
    setEditTelephone(agent.phone);
    setEditEmail(agent.email);
    setEditSite(agent.site);
    setEditResponsable(agent.responsable);
    setShowEditModal(true);
  };

  const handleUpdateAgent = async () => {
    if (!selectedAgent) return;

    setEditLoading(true);
    try {
      await updateAgent(selectedAgent.id, {
        matricule: editMatricule,
        last_name: editNom,
        first_name: editPrenom,
        phone: editTelephone,
        email: editEmail,
        site: editSite,
        responsable: editResponsable,
      });

      setSelectedAgent({
        ...selectedAgent,
        matricule: editMatricule,
        last_name: editNom,
        first_name: editPrenom,
        phone: editTelephone,
        email: editEmail,
        site: editSite,
        responsable: editResponsable,
      });

      setShowEditModal(false);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'agent:', error);
      alert('Erreur lors de la modification de l\'agent');
    } finally {
      setEditLoading(false);
    }
  };

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  const handleDeleteAgent = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      deleteAgent(id);
    }
  };

  const formatDate = (dateString: Date) => {
    return dateString.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: boolean) => {
    return status ? 
    <div className="badge badge-soft badge-info">Actif</div>: 
    <div className="badge badge-soft badge-error">Inactif</div>;
  };

  // Filtrer les sites et agents selon la recherche et le site sélectionné
  const filteredSites = Object.entries(sitesData).filter(([siteName, agents]) => {
    if (selectedSite !== 'Tous' && siteName !== selectedSite) return false;
    
    return agents.some(agent =>
      agent.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 flex justify-center flex-col">
      {/* En-tête avec recherche, filtre et bouton d'ajout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Agents</h1>
        <div className="flex gap-4">
          <select 
            className="select select-bordered"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="Tous">Tous les sites</option>
            {Object.keys(sitesData).map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Rechercher un agent..."
            className="px-4 py-1 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
      </div>


      {/* Liste des agents par site
      {loading ? (
        <div className="w-full flex justify-center py-10">
          <Orbit size="50" speed="1.5" color="blue" />
        </div>
      ) :  */}
      (
        <div className="space-y-6">
          {filteredSites.map(([siteName, agents]) => (
            <div key={siteName} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {siteName} 
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({agents.length} agent{agents.length > 1 ? 's' : ''})
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Téléphone</th>
                      <th>Email</th>
                      <th>Statut</th>
                      <th>Responsable</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="font-mono">{agent.matricule}</td>
                        <td>{agent.last_name}</td>
                        <td>{agent.first_name}</td>
                        <td>{agent.phone}</td>
                        <td>{agent.email}</td>
                        <td>{getStatusBadge(agent.status)}</td>
                        <td>{agent.responsable}</td>
                        <td>{formatDate(agent.created_at)}</td>
                        <td className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(agent)}
                            className="btn btn-sm btn-info"
                          >
                            Détails
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(agent)}
                            className="btn btn-sm btn-warning"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="btn btn-sm btn-error hover:scale-110 transition-all duration-300 ease-in-out"
                            title="Supprimer"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )
      {/* } */}

      {/* Modal de détail */}
      {showModal && selectedAgent && (
        <div className="modal modal-open backdrop-blur">
          <div className="modal-box">
            <form method="dialog">
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Détails de l'agent</h3>
            <div className="py-4 space-y-3">
              <p><strong>Matricule:</strong> {selectedAgent.matricule}</p>
              <p><strong>Nom:</strong> {selectedAgent.last_name}</p>
              <p><strong>Prénom:</strong> {selectedAgent.first_name}</p>
              <p><strong>Email:</strong> {selectedAgent.email}</p>
              <p><strong>Téléphone:</strong> {selectedAgent.phone}</p>
              <p><strong>Site:</strong> {selectedAgent.site}</p>
              <p><strong>Responsable:</strong> {selectedAgent.responsable}</p>
              <p><strong>Statut:</strong> {getStatusBadge(selectedAgent.status)}</p>
              <p><strong>Date de création:</strong> {formatDate(selectedAgent.created_at)}</p>
            </div>
            <div className="modal-action">
              <button
                onClick={() => handleOpenEditModal(selectedAgent)}
                className="btn bg-blue-200 flex items-center gap-2 rounded-lg text-gray-700 hover:bg-blue-300"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedAgent && (
        <div className="modal modal-open backdrop-blur">
          <div className="modal-box border-2 border-warning/10 border-dashed rounded-lg">
            <form method="dialog">
              <button onClick={() => setShowEditModal(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Modifier l'agent</h3>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Matricule</label>
                  <input
                    type="text"
                    placeholder="Matricule"
                    className="input bordered rounded-lg px-4 py-3 w-full"
                    value={editMatricule}
                    onChange={(e) => setEditMatricule(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Site</label>
                  <input
                    type="text"
                    placeholder="Site"
                    className="input bordered rounded-lg px-4 py-3 w-full"
                    value={editSite}
                    onChange={(e) => setEditSite(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom</label>
                  <input
                    type="text"
                    placeholder="Nom"
                    className="input bordered rounded-lg px-4 py-3 w-full"
                    value={editNom}
                    onChange={(e) => setEditNom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Prénom</label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="input bordered rounded-lg px-4 py-3 w-full"
                    value={editPrenom}
                    onChange={(e) => setEditPrenom(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input bordered rounded-lg px-4 py-3 w-full"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    className="input bordered rounded-lg px-4 py-3 w-full"
                    value={editTelephone}
                    onChange={(e) => setEditTelephone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Responsable</label>
                  <input
                    type="text"
                    placeholder="Responsable"
                    className="input bordered rounded-lg px-4 py-3 w-full"
                    value={editResponsable}
                    onChange={(e) => setEditResponsable(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn w-full flex justify-center items-center gap-2 rounded-lg bg-blue-500 to-bubble-500 text-white shadow-soft"
                onClick={handleUpdateAgent}
                disabled={editLoading}
              >
                {editLoading ? (
                  <Orbit size="20" speed="1.5" color="blue" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}