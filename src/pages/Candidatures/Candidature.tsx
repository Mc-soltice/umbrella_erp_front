import { useState } from 'react';
import type { Candidature } from "../../types/Types";
import { useCandidature } from '../../contexts/CandidatureContext';
import { Orbit } from 'ldrs/react';
import 'ldrs/react/Orbit.css';

import { CheckCircle, Edit, PlusCircle, Trash } from 'lucide-react';
export default function CandidatureManagement() {
    const { addCandidature, deleteCandidature, updateCandidature } = useCandidature(); // <-- ici
    //   const { addCandidature, candidatures } = useCandidature(); // <-- ici
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // States pour le formulaire
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddCandidature = async () => {
        setLoading(true);
        try {
            await addCandidature({
                last_name: nom,
                first_name: prenom,
                telephone: telephone,
                email: email,
            });
            setNom("");
            setPrenom("");
            setTelephone("");
            setEmail("");
            const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
            if (modal) modal.close();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la candidature:', error);
            alert('Erreur lors de l\'ajout de la candidature');
        } finally {
            setLoading(false);
        }
    };




    // States pour le formulaire de modification
    const [editNom, setEditNom] = useState("");
    const [editPrenom, setEditPrenom] = useState("");
    const [editTelephone, setEditTelephone] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editLoading, setEditLoading] = useState(false);


    const handleOpenEditModal = (candidature: Candidature) => {
        setSelectedCandidature(candidature);
        setEditNom(candidature.last_name);
        setEditPrenom(candidature.first_name);
        setEditTelephone(candidature.telephone);
        setEditEmail(candidature.email);
        setShowEditModal(true);
    };


    const handleUpdateCandidature = async () => {
        if (!selectedCandidature) return;

        setEditLoading(true);
        try {
            await updateCandidature(selectedCandidature.id, {
                last_name: editNom,
                first_name: editPrenom,
                telephone: editTelephone,
                email: editEmail,
            });

            // Mettre à jour la candidature sélectionnée avec les nouvelles données
            setSelectedCandidature({
                ...selectedCandidature,
                last_name: editNom,
                first_name: editPrenom,
                telephone: editTelephone,
                email: editEmail,
            });

            setShowEditModal(false);
            setShowModal(true); // Rouvrir le modal de détail avec les données mises à jour
        } catch (error) {
            console.error('Erreur lors de la modification de la candidature:', error);
            alert('Erreur lors de la modification de la candidature');
        } finally {
            setEditLoading(false);
        }
    };


    //   const filteredCandidatures = candidatures.filter(candidature => {
    //     return candidature.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       candidature.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       candidature.email.toLowerCase().includes(searchTerm.toLowerCase());
    //   });

    const handleViewDetails = (candidature: Candidature) => {
        setSelectedCandidature(candidature);
        setShowModal(true);
    };

    const handleDeleteCandidature = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
            deleteCandidature(id);
        }
    };

    const formatDate = (dateString: string) => {

        const d = new Date(dateString)

        return d.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const filteredCandidatures = [
        {
            id: 'CAND-001',
            last_name: 'Ngoumba',
            first_name: 'Clarisse',
            email: 'clarisse.ngoumba@example.com',
            telephone: '+237 690 12 34 56',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-002',
            last_name: 'Mbappe',
            first_name: 'Jean-Paul',
            email: 'jp.mbappe@example.com',
            telephone: '+237 699 87 65 43',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-003',
            last_name: 'Tchoua',
            first_name: 'Aline',
            email: 'aline.tchoua@example.com',
            telephone: '+237 674 33 22 11',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-004',
            last_name: 'Kouassi',
            first_name: 'Brice',
            email: 'brice.kouassi@example.com',
            telephone: '+237 655 44 77 88',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
        {
            id: 'CAND-005',
            last_name: 'Ewane',
            first_name: 'Marina',
            email: 'marina.ewane@example.com',
            telephone: '+237 698 99 88 77',
            create_at: new Date('2023-10-01T10:30:00')
        },
    ];


    return (
        <div className="p-6 flex justify-center flex-col">
            {/* En-tête avec recherche et bouton d'ajout */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Candidatures</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="px-4 py-1 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="w-full flex items-center space-x-3 px-3 py-1 rounded-lg bg-gradient-to-r bg-blue-500 to-bubble-500 text-white shadow-soft"
                        onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement)?.showModal()}>
                        Ajouter une candidature
                    </button>
                </div>
            </div>


            {/* Modal d'ajout de candidature */}
            <dialog id="my_modal_3" className="modal backdrop-blur">

                <div className="modal-box border-2 border-warning/10 border-dashed rounded-lg">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Ajouter une nouvelle candidature</h3>
                    <div className="py-4 space-y-4">

                        <label className="label">Nom</label>
                        <input
                            type="text"
                            placeholder="Nom"
                            className="input bordered rounded-lg px-4 py-3 w-full"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />
                        <label className="label">Prénom</label>
                        <input
                            type="text"
                            placeholder="Prénom"
                            className="input bordered rounded-lg px-4 py-3  w-full"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                        />
                        <label className="label">email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input bordered rounded-lg px-4 py-3 w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="label">Telephone</label>
                        <input
                            type="tel"
                            placeholder="Téléphone"
                            className="input bordered rounded-lg px-4 py-3 w-full"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn w-full flex justify-center items-center gap-2 rounded-lg  bg-blue-500 to-bubble-500 text-white shadow-soft"
                        onClick={handleAddCandidature}
                        disabled={loading}
                    >
                        {loading ? (
                            <Orbit size="20" speed="1.5" color="blue" />
                        ) : (
                            <>
                                <PlusCircle className="w-4 h-4" />
                                Ajouter
                            </>
                        )}
                    </button>
                </div>
            </dialog>


            Liste des candidatures
            {loading ? (
                <div className=" w-full flex justify-center py-10">
                    <Orbit size="50" speed="1.5" color="blue" />
                </div>
            ) : 
            (
                <>
                    <div className="overflow-x-auto max-w-full rounded-2xl shadow-md p-6 mb-4 bg-gray-50">
                        <table className="table table-xm table-pin-rows table-pin-cols">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prenom</th>
                                    <th>Telephone</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCandidatures.map((candidature) => (
                                    <tr key={candidature.id} className='rounded-lg shadow-md '>
                                        <td>{candidature.last_name}</td>
                                        <td>{candidature.first_name}</td>
                                        <td>{candidature.telephone}</td>
                                        <td>{candidature.email}</td>
                                        <td>
                                            {formatDate(candidature.create_at)}
                                        </td>
                                        <td className="flex gap-2">
                                            <button
                                                onClick={() => handleViewDetails(candidature)}
                                                className="btn btn-sm btn-info"
                                            >
                                                Détails
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCandidature(candidature.id)}
                                                className="btn btn-sm btn-error hover:scale-110 transition-all duration-300 ease-in-out"
                                                title="Supprimer"
                                            >
                                                <Trash className="w-4 h-4 " />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Modal de detail */}
            {showModal && selectedCandidature && (
                <div className="modal modal-open  backdrop-blur">
                    <div className="modal-box ">
                        <form method="dialog">
                            <button onClick={() => setShowModal(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Détails de la candidature</h3>
                        <div className="py-4">
                            <p><strong>Nom:</strong> {selectedCandidature.last_name}</p>
                            <p><strong>Prénom:</strong> {selectedCandidature.first_name}</p>
                            <p><strong>Email:</strong> {selectedCandidature.email}</p>
                            <p><strong>Téléphone:</strong> {selectedCandidature.telephone}</p>
                            {/* <p><strong>Date de création:</strong> {selectedCandidature.date_creation}</p> */}
                        </div>
                        <div className="modal-action flex justify-around">
                            <button
                                onClick={() => handleOpenEditModal(selectedCandidature)}
                                className="btn w-1/4 flex justify-center items-center rounded-lg bg-blue-300 to-bubble-500 text-white shadow-soft hover:scale-105 transition-all duration-300 ease-in-out"
                                title="Modifier"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                className="btn w-3/4 flex justify-center items-center rounded-lg  bg-blue-500 to-bubble-500 text-white shadow-soft  hover:scale-105 transition-all duration-300 ease-in-out"
                                onClick={handleAddCandidature}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Orbit size="20" speed="1.5" color="blue" />
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Valider la candidature
                                    </>
                                )}
                            </button>
                        </div>
                    </div>



                    {/* Modal de modification */}
                    {showEditModal && selectedCandidature && (
                        <div className="modal modal-open backdrop-blur">
                            <div className="modal-box border-2 border-warning/10 border-dashed rounded-lg">
                                <form method="dialog">
                                    <button onClick={() => setShowEditModal(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Modifier la candidature</h3>
                                <div className="py-4 space-y-4">
                                    <label className="label">Nom</label>
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        className="input bordered rounded-lg px-4 py-3 w-full"
                                        value={editNom}
                                        onChange={(e) => setEditNom(e.target.value)}
                                    />
                                    <label className="label">Prénom</label>
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        className="input bordered rounded-lg px-4 py-3 w-full"
                                        value={editPrenom}
                                        onChange={(e) => setEditPrenom(e.target.value)}
                                    />
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="input bordered rounded-lg px-4 py-3 w-full"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                    />
                                    <label className="label">Téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="Téléphone"
                                        className="input bordered rounded-lg px-4 py-3 w-full"
                                        value={editTelephone}
                                        onChange={(e) => setEditTelephone(e.target.value)}
                                    />
                                </div>
                                <div className="modal-action">
                                    <button
                                        className="btn w-full flex justify-center items-center gap-2 rounded-lg bg-blue-500 to-bubble-500 text-white shadow-soft"
                                        onClick={handleUpdateCandidature}
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
            )}
        </div>
    );
}