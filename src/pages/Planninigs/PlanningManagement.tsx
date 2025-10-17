import React, { useState } from 'react';
import { PlanningForm } from '../../components/PlanningForm';
import { PlanningList } from '../../components/PlanningList';
import { Calendar, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const PlanningManagementContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
                <Calendar size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Plannings</h1>
                <p className="text-gray-600 mt-1">Organisez et gérez les plannings de vos agents</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Nouveau Planning
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <PlanningList />
        </div>
      </div>

      {showForm && <PlanningForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

  
export default function PlanningManagement() {
  return <PlanningManagementContent />;
}

