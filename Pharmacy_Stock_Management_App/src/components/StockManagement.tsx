import { useState, useEffect } from 'react';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { formatXof } from '../utils/currency';
import { Medicine, Batch, Supplier } from '../types/pharmacy';
import axiosClient from '../utils/axiosClient';

export function StockManagement() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showEditMedicine, setShowEditMedicine] = useState(false);
  const [showEditBatch, setShowEditBatch] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [expandedMedicine, setExpandedMedicine] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const medicinesResponse = await axiosClient.get('/api/medicines');
      const suppliersResponse = await axiosClient.get('/api/suppliers');

      console.log('📦 Médicaments reçus:', medicinesResponse.data);

      setMedicines(
        (medicinesResponse.data || []).map((med: any) => ({
          ...med,
          id: med.id?.toString() || med.id_medicine?.toString(),
          name: med.name || med.medicine_name || 'Sans nom',
          genericName: med.genericName || med.generic_name || '',
          dosage: med.dosage || '',
          form: med.form || '',
          category: med.category || '',
          minStock: med.minStock || med.min_stock || 10,
          batches: med.batches ?? []
        }))
      );
      setSuppliers(suppliersResponse.data || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setMedicines([]);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newMedicine = {
      name: formData.get('name') as string,
      genericName: formData.get('genericName') as string,
      dosage: formData.get('dosage') as string,
      form: formData.get('form') as string,
      category: formData.get('category') as string,
      minStock: parseInt(formData.get('minStock') as string),
    };

    try {
      await axiosClient.post('/api/medicines', newMedicine);
      await loadData();
      setShowAddMedicine(false);
    } catch (error: any) {
      console.error('Erreur ajout médicament:', error);
      let msg = 'Impossible d\'ajouter le médicament';
      if (error && error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert('Erreur: ' + msg);
    }
  };

  const handleAddBatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    const formData = new FormData(e.currentTarget);

    const newBatch = {
      medicineId: parseInt(selectedMedicine.id),
      batchNumber: formData.get('batchNumber') as string,
      quantity: parseInt(formData.get('quantity') as string),
      purchasePrice: parseFloat(formData.get('purchasePrice') as string),
      sellPrice: parseFloat(formData.get('sellPrice') as string),
      manufacturingDate: formData.get('manufacturingDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      supplierId: parseInt(formData.get('supplierId') as string),
      receivedDate: new Date().toISOString().split('T')[0],
    };

    console.log('📦 Envoi lot:', newBatch);

    try {
      await axiosClient.post('/api/batches', newBatch);
      await loadData();
      setShowAddBatch(false);
      setSelectedMedicine(null);
    } catch (error: any) {
      console.error('Erreur ajout lot:', error);
      let msg = 'Impossible d\'ajouter le lot';
      if (error && error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert('Erreur: ' + msg);
    }
  };

  const handleEditMedicine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Edit medicine form submitted');
    console.log('Selected medicine:', selectedMedicine);
    
    if (!selectedMedicine) {
      console.log('No selected medicine');
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    
    const updatedMedicine = {
      name: formData.get('name') as string,
      genericName: formData.get('genericName') as string,
      dosage: formData.get('dosage') as string,
      form: formData.get('form') as string,
      category: formData.get('category') as string,
      minStock: parseInt(formData.get('minStock') as string),
    };
    
    try {
      await axiosClient.put(`/api/medicines/${selectedMedicine.id}`, updatedMedicine);
      await loadData();
      setShowEditMedicine(false);
      setSelectedMedicine(null);
    } catch (error: any) {
      console.error('Erreur modification médicament:', error);
      let msg = 'Impossible de modifier le médicament';
      if (error && error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert('Erreur: ' + msg);
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ? Cette action supprimera également tous les lots associés.')) {
      return;
    }
    
    try {
      await axiosClient.delete(`/api/medicines/${medicineId}`);
      await loadData();
    } catch (error: any) {
      console.error('Erreur suppression médicament:', error);
      let msg = 'Impossible de supprimer le médicament';
      if (error && error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert('Erreur: ' + msg);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
      return;
    }
    
    try {
      await axiosClient.delete(`/api/batches/${batchId}`);
      await loadData();
    } catch (error: any) {
      console.error('Erreur suppression lot:', error);
      let msg = 'Impossible de supprimer le lot';
      if (error && error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert('Erreur: ' + msg);
    }
  };

  const handleEditBatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBatch || !selectedMedicine) return;
    
    const formData = new FormData(e.currentTarget);
    
    const updatedBatch = {
      medicineId: parseInt(selectedMedicine.id),
      batchNumber: formData.get('batchNumber') as string,
      quantity: parseInt(formData.get('quantity') as string),
      purchasePrice: parseFloat(formData.get('purchasePrice') as string),
      sellPrice: parseFloat(formData.get('sellPrice') as string),
      manufacturingDate: formData.get('manufacturingDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      supplierId: parseInt(formData.get('supplierId') as string),
    };
    
    try {
      await axiosClient.put(`/api/batches/${selectedBatch.id}`, updatedBatch);
      await loadData();
      setShowEditBatch(false);
      setSelectedBatch(null);
      setSelectedMedicine(null);
    } catch (error: any) {
      console.error('Erreur modification lot:', error);
      let msg = 'Impossible de modifier le lot';
      if (error && error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert('Erreur: ' + msg);
    }
  };

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalStock = (medicine: Medicine) =>
    (medicine.batches ?? []).reduce((sum, batch) => sum + (batch.quantity || 0), 0);

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion du Stock</h2>
          <p className="text-gray-500 mt-1">Gérez vos médicaments et leurs lots</p>
        </div>
        <button
          onClick={() => setShowAddMedicine(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau médicament
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, générique ou catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Medicines List */}
      <div className="space-y-4">
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucun médicament trouvé</p>
          </div>
        ) : (
          filteredMedicines.map((medicine) => {
            const totalStock = getTotalStock(medicine);
            const isLowStock = totalStock < medicine.minStock;
            const isExpanded = expandedMedicine === medicine.id;

            return (
              <div key={medicine.id} className="bg-white rounded-lg border border-gray-200">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedMedicine(isExpanded ? null : medicine.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{medicine.name}</h3>
                        {isLowStock && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Stock faible
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {medicine.genericName && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Nom générique:</span> {medicine.genericName}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {medicine.dosage && (
                            <span><span className="font-medium">Dosage:</span> {medicine.dosage}</span>
                          )}
                          {medicine.form && (
                            <span className={medicine.dosage ? 'font-medium ml-2' : 'font-medium'}>
                              {medicine.dosage ? 'Forme:' : ''} {medicine.form}
                            </span>
                          )}
                          {medicine.category && (
                            <span className="font-medium ml-2">
                              Catégorie: {medicine.category}
                            </span>
                          )}
                          {!medicine.dosage && !medicine.form && !medicine.category && (
                            <span className="font-medium">Informations non disponibles</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Stock total:</span> <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>{totalStock}</span> unités • 
                          <span className="font-medium ml-2">Stock minimum:</span> {medicine.minStock} unités
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMedicine(medicine);
                        setShowAddBatch(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Nouveau lot
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit medicine button clicked');
                        console.log('Selected medicine:', medicine);
                        setSelectedMedicine(medicine);
                        setShowEditMedicine(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedicine(medicine.id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Lots disponibles ({medicine.batches?.length || 0})
                    </h4>

                    {!medicine.batches || medicine.batches.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Aucun lot disponible. Cliquez sur "Nouveau lot" pour en ajouter un.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {medicine.batches.map((batch) => {
                          const daysLeft = getDaysUntilExpiry(batch.expiryDate);
                          const isExpiringSoon = daysLeft <= 90 && daysLeft > 0;
                          const isExpired = daysLeft <= 0;
                          const supplier = suppliers.find((s) => s.id === batch.supplierId?.toString());

                          return (
                            <div
                              key={batch.id}
                              className={`bg-white rounded-lg border p-4 ${
                                isExpired
                                  ? 'border-red-300 bg-red-50'
                                  : isExpiringSoon
                                  ? 'border-orange-300 bg-orange-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">N° Lot</p>
                                    <p className="text-sm font-medium text-gray-900">{batch.batchNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Quantité</p>
                                    <p className="text-sm font-semibold text-gray-900">{batch.quantity} unités</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Prix d'achat</p>
                                    <p className="text-sm font-medium text-gray-900">{formatXof(batch.purchasePrice || 0)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Prix de vente</p>
                                    <p className="text-sm font-semibold text-blue-600">{formatXof(batch.sellPrice || 0)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Date de fabrication</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {batch.manufacturingDate ? new Date(batch.manufacturingDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Expiration</p>
                                    <p
                                      className={`text-sm font-medium ${
                                        isExpired
                                          ? 'text-red-600 font-bold'
                                          : isExpiringSoon
                                          ? 'text-orange-600'
                                          : 'text-gray-900'
                                      }`}
                                    >
                                      {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                                      {isExpired && <span className="ml-2 text-xs">(Expiré)</span>}
                                      {isExpiringSoon && !isExpired && <span className="ml-2 text-xs">({daysLeft}j restants)</span>}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Fournisseur</p>
                                    <p className="text-sm font-medium text-gray-900">{supplier?.name || 'Non spécifié'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Date de réception</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {batch.receivedDate ? new Date(batch.receivedDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                                    </p>
                                  </div>
                                </div>

                                {(isExpiringSoon || isExpired) && (
                                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ml-3 ${isExpired ? 'text-red-500' : 'text-orange-500'}`} />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMedicine(medicine);
                                    setSelectedBatch(batch);
                                    setShowEditBatch(true);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors ml-3"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                  Modifier
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBatch(batch.id);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors ml-3"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD MEDICINE MODAL */}
      {showAddMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Nouveau médicament</h3>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <label htmlFor="med-name" className="block text-sm font-medium mb-1">
                  Nom commercial *
                </label>
                <input
                  type="text"
                  id="med-name"
                  name="name"
                  required
                  placeholder="ex: Paracétamol"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="med-generic" className="block text-sm font-medium mb-1">
                  Nom générique *
                </label>
                <input
                  type="text"
                  id="med-generic"
                  name="genericName"
                  required
                  placeholder="ex: Paracétamol"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="med-category" className="block text-sm font-medium mb-1">
                  Catégorie *
                </label>
                <select
                  id="med-category"
                  name="category"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une catégorie...</option>
                  <option value="Antibiotique">Antibiotique</option>
                  <option value="Antidouleur">Antidouleur</option>
                  <option value="Anti-inflammatoire">Anti-inflammatoire</option>
                  <option value="Antifongique">Antifongique</option>
                  <option value="Antiparasitaire">Antiparasitaire</option>
                  <option value="Vitamines">Vitamines et Suppléments</option>
                  <option value="Cardiovasculaire">Cardiovasculaire</option>
                  <option value="Digestif">Digestif</option>
                  <option value="Respiratoire">Respiratoire</option>
                  <option value="Dermatologie">Dermatologie</option>
                  <option value="Neurologie">Neurologie</option>
                  <option value="Diabète">Diabète</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="med-dosage" className="block text-sm font-medium mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    id="med-dosage"
                    name="dosage"
                    required
                    placeholder="ex: 500mg"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="med-form" className="block text-sm font-medium mb-1">
                    Forme *
                  </label>
                  <select
                    id="med-form"
                    name="form"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Comprimé">Comprimé</option>
                    <option value="Gélule">Gélule</option>
                    <option value="Sirop">Sirop</option>
                    <option value="Injection">Injection</option>
                    <option value="Crème">Crème</option>
                    <option value="Pommade">Pommade</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="med-minstock" className="block text-sm font-medium mb-1">
                  Stock minimum *
                </label>
                <input
                  type="number"
                  id="med-minstock"
                  name="minStock"
                  required
                  min="1"
                  defaultValue="10"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMedicine(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BATCH MODAL */}
      {showAddBatch && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">Nouveau lot</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pour: <span className="font-semibold">{selectedMedicine.name}</span>
            </p>

            <form onSubmit={handleAddBatch} className="space-y-4">
              <div>
                <label htmlFor="batch-number" className="block text-sm font-medium mb-1">
                  N° de lot *
                </label>
                <input
                  type="text"
                  id="batch-number"
                  name="batchNumber"
                  required
                  placeholder="ex: LOT123456"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="batch-quantity" className="block text-sm font-medium mb-1">
                  Quantité *
                </label>
                <input
                  type="number"
                  id="batch-quantity"
                  name="quantity"
                  required
                  min="1"
                  placeholder="ex: 100"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="batch-purchase" className="block text-sm font-medium mb-1">
                    Prix d'achat (FCFA) *
                  </label>
                  <input
                    type="number"
                    id="batch-purchase"
                    name="purchasePrice"
                    required
                    min="0"
                    step="0.01"
                    placeholder="ex: 1000"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="batch-sell" className="block text-sm font-medium mb-1">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    id="batch-sell"
                    name="sellPrice"
                    required
                    min="0"
                    step="0.01"
                    placeholder="ex: 1500"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="batch-mfg" className="block text-sm font-medium mb-1">
                  Date de fabrication *
                </label>
                <input
                  type="date"
                  id="batch-mfg"
                  name="manufacturingDate"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="batch-expiry" className="block text-sm font-medium mb-1">
                  Date d'expiration *
                </label>
                <input
                  type="date"
                  id="batch-expiry"
                  name="expiryDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="batch-supplier" className="block text-sm font-medium mb-1">
                  Fournisseur *
                </label>
                <select
                  id="batch-supplier"
                  name="supplierId"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un fournisseur...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBatch(false);
                    setSelectedMedicine(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter le lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEDICINE MODAL */}
      {showEditMedicine && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Modifier le médicament</h3>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Debug:</strong> Editing medicine ID: {selectedMedicine.id}, Name: {selectedMedicine.name}
              </p>
            </div>
            <form onSubmit={handleEditMedicine} className="space-y-4">
              <div>
                <label htmlFor="edit-med-name" className="block text-sm font-medium mb-1">
                  Nom commercial *
                </label>
                <input
                  type="text"
                  id="edit-med-name"
                  name="name"
                  required
                  defaultValue={selectedMedicine.name}
                  disabled={false}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-med-generic" className="block text-sm font-medium mb-1">
                  Nom générique
                </label>
                <input
                  type="text"
                  id="edit-med-generic"
                  name="genericName"
                  defaultValue={selectedMedicine.genericName || ''}
                  disabled={false}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-med-category" className="block text-sm font-medium mb-1">
                  Catégorie
                </label>
                <select
                  id="edit-med-category"
                  name="category"
                  defaultValue={selectedMedicine.category || ''}
                  disabled={false}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une catégorie...</option>
                  <option value="Antibiotique">Antibiotique</option>
                  <option value="Antidouleur">Antidouleur</option>
                  <option value="Anti-inflammatoire">Anti-inflammatoire</option>
                  <option value="Antifongique">Antifongique</option>
                  <option value="Antiparasitaire">Antiparasitaire</option>
                  <option value="Vitamines">Vitamines et Suppléments</option>
                  <option value="Cardiovasculaire">Cardiovasculaire</option>
                  <option value="Digestif">Digestif</option>
                  <option value="Respiratoire">Respiratoire</option>
                  <option value="Dermatologie">Dermatologie</option>
                  <option value="Neurologie">Neurologie</option>
                  <option value="Diabète">Diabète</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-med-dosage" className="block text-sm font-medium mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    id="edit-med-dosage"
                    name="dosage"
                    defaultValue={selectedMedicine.dosage || ''}
                    placeholder="ex: 500mg"
                    disabled={false}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-med-form" className="block text-sm font-medium mb-1">
                    Forme
                  </label>
                  <select
                    id="edit-med-form"
                    name="form"
                    defaultValue={selectedMedicine.form || ''}
                    disabled={false}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Comprimé">Comprimé</option>
                    <option value="Gélule">Gélule</option>
                    <option value="Sirop">Sirop</option>
                    <option value="Injection">Injection</option>
                    <option value="Crème">Crème</option>
                    <option value="Pommade">Pommade</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-med-minstock" className="block text-sm font-medium mb-1">
                  Stock minimum *
                </label>
                <input
                  type="number"
                  id="edit-med-minstock"
                  name="minStock"
                  required
                  min="1"
                  defaultValue={selectedMedicine.minStock}
                  disabled={false}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditMedicine(false);
                    setSelectedMedicine(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold text-lg shadow-lg"
                >
                  ✅ Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BATCH MODAL */}
      {showEditBatch && selectedBatch && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">Modifier le lot</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pour: <span className="font-semibold">{selectedMedicine.name}</span>
            </p>

            <form onSubmit={handleEditBatch} className="space-y-4">
              <div>
                <label htmlFor="edit-batch-number" className="block text-sm font-medium mb-1">
                  N° de lot *
                </label>
                <input
                  type="text"
                  id="edit-batch-number"
                  name="batchNumber"
                  required
                  defaultValue={selectedBatch.batchNumber}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-batch-quantity" className="block text-sm font-medium mb-1">
                  Quantité *
                </label>
                <input
                  type="number"
                  id="edit-batch-quantity"
                  name="quantity"
                  required
                  min="0"
                  defaultValue={selectedBatch.quantity}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-batch-purchase" className="block text-sm font-medium mb-1">
                    Prix d'achat (FCFA) *
                  </label>
                  <input
                    type="number"
                    id="edit-batch-purchase"
                    name="purchasePrice"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={selectedBatch.purchasePrice}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-batch-sell" className="block text-sm font-medium mb-1">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    id="edit-batch-sell"
                    name="sellPrice"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={selectedBatch.sellPrice}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-batch-mfg" className="block text-sm font-medium mb-1">
                  Date de fabrication *
                </label>
                <input
                  type="date"
                  id="edit-batch-mfg"
                  name="manufacturingDate"
                  required
                  defaultValue={selectedBatch.manufacturingDate.split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-batch-expiry" className="block text-sm font-medium mb-1">
                  Date d'expiration *
                </label>
                <input
                  type="date"
                  id="edit-batch-expiry"
                  name="expiryDate"
                  required
                  defaultValue={selectedBatch.expiryDate.split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-batch-supplier" className="block text-sm font-medium mb-1">
                  Fournisseur *
                </label>
                <select
                  id="edit-batch-supplier"
                  name="supplierId"
                  required
                  defaultValue={selectedBatch.supplierId}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un fournisseur...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditBatch(false);
                    setSelectedBatch(null);
                    setSelectedMedicine(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold text-lg shadow-lg"
                >
                  ✅ Modifier le lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}