import { useState, useEffect } from 'react';
import { Plus, Search, Truck, CheckCircle, XCircle, Clock, Package as PackageIcon } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { SupplierOrder, Supplier, OrderItem, Medicine } from '../types/pharmacy';
import { formatXof } from '../utils/currency';

export function SupplierOrders() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    try {
      const [ordersRes, suppliersRes, medicinesRes] = await Promise.all([
        axiosClient.get('/api/orders'),
        axiosClient.get('/api/suppliers'),
        axiosClient.get('/api/medicines')
      ]);

      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setSuppliers(Array.isArray(suppliersRes.data) ? suppliersRes.data : []);
      setMedicines(Array.isArray(medicinesRes.data) ? medicinesRes.data : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setOrders([]);
      setSuppliers([]);
      setMedicines([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Available medicines:', medicines);
    console.log('Available medicine IDs:', medicines.map(m => m.id));
    console.log('Medicine ID types:', medicines.map(m => typeof m.id));
    console.log('Full medicine details:');
    medicines.forEach((med, index) => {
      console.log(`  ${index + 1}. ID: "${med.id}" (type: ${typeof med.id}), Name: "${med.name}", Dosage: "${med.dosage}"`);
    });
    const formData = new FormData(e.currentTarget);
      
    const itemsCount = parseInt(formData.get('itemsCount') as string);
    console.log('Items count from form:', itemsCount);
    console.log('All form data keys:', Array.from(formData.keys()));
      
    const items: OrderItem[] = [];
    let total = 0;

    for (let i = 0; i < itemsCount; i++) {
      const medicineId = formData.get(`medicine_${i}`) as string;
      const quantity = parseInt(formData.get(`quantity_${i}`) as string);
      const unitPrice = parseFloat(formData.get(`price_${i}`) as string);
      
      console.log(`Item ${i}:`, { 
        medicineId, 
        medicineIdType: typeof medicineId,
        quantity, 
        unitPrice, 
        quantityValid: !isNaN(quantity), 
        priceValid: !isNaN(unitPrice) 
      });
      
      if (medicineId && quantity && unitPrice && !isNaN(quantity) && !isNaN(unitPrice)) {
        // Handle both string and numeric ID comparisons
        const medicine = medicines.find(m => {
          // Convert both to strings for comparison
          return String(m.id) === String(medicineId);
        });
        console.log(`Looking for medicine ID '${medicineId}' (converted to string: '${String(medicineId)}'):`, medicine);
        if (medicine) {
          const itemTotal = unitPrice * quantity;
          items.push({
            medicineId,
            medicineName: `${medicine.name} ${medicine.dosage}`,
            quantity,
            unitPrice,
            total: itemTotal,
          });
          total += itemTotal;
        }
      }
    }
    
    console.log('Final items array:', items);
    console.log('Items length:', items.length);

    if (items.length === 0) {
      alert('Veuillez ajouter au moins un article');
      return;
    }

    const supplierId = formData.get('supplierId') as string;
    const supplier = suppliers.find(s => s.id === supplierId);

    const newOrder: SupplierOrder = {
      id: Date.now().toString(),
      orderNumber: `CMD${Date.now()}`,
      supplierId,
      supplierName: supplier?.name || '',
      date: new Date().toISOString().split('T')[0],
      manufacturingDate: formData.get('manufacturingDate') as string || undefined,
      receivedDate: formData.get('receivedDate') as string || undefined,
      expectedDelivery: formData.get('expectedDelivery') as string,
      status: 'pending',
      items,
      total,
    };

    try {
      await axiosClient.post('/api/orders', newOrder);
      await loadData();
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error adding order:', error);
      alert('Erreur lors de la création de la commande: ' + (error.message || 'Erreur inconnue'));
    }
  };

  const handleStatusChange = async (orderId: string, status: SupplierOrder['status']) => {
    try {
      await axiosClient.put(`/api/orders/${orderId}`, { status });
      await loadData();
    } catch (error: any) {
      console.error('Error updating order:', error);
      alert('Erreur lors de la mise à jour de la commande: ' + (error.message || 'Erreur inconnue'));
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusInfo = (status: SupplierOrder['status']) => {
    switch (status) {
      case 'pending': return { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
      case 'confirmed': return { label: 'Confirmée', color: 'bg-blue-100 text-blue-700', icon: CheckCircle };
      case 'shipped': return { label: 'Expédiée', color: 'bg-purple-100 text-purple-700', icon: Truck };
      case 'delivered': return { label: 'Livrée', color: 'bg-green-100 text-green-700', icon: PackageIcon };
      case 'cancelled': return { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: XCircle };
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: Clock };
    }
  };

  // Get alert status for visual indicators
  const getOrderAlert = (order: SupplierOrder) => {
    const today = new Date();
    const expectedDelivery = new Date(order.expectedDelivery);
    const daysUntilDelivery = Math.ceil((expectedDelivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (order.status === 'cancelled') {
      return { type: 'error', message: 'Commande annulée' };
    }
    
    if (order.status === 'pending' && daysUntilDelivery < 0) {
      return { type: 'warning', message: `Retard de ${Math.abs(daysUntilDelivery)} jours` };
    }
    
    if (order.status === 'shipped' && daysUntilDelivery < 0) {
      return { type: 'warning', message: `Livraison en retard de ${Math.abs(daysUntilDelivery)} jours` };
    }
    
    if (order.status === 'pending' && daysUntilDelivery <= 2 && daysUntilDelivery >= 0) {
      return { type: 'info', message: `À expédier dans ${daysUntilDelivery} jours` };
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commandes Fournisseurs</h2>
          <p className="text-gray-500 mt-1">Gérez vos commandes et réapprovisionnements</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle commande
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro, fournisseur ou article..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Recherche"
            title="Recherche par numéro, fournisseur ou article"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          aria-label="Filtrer par statut"
          title="Filtrer par statut"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="shipped">Expédiée</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                {/* Alert Banner */}
                {getOrderAlert(order) && (
                  <div className={`p-2 rounded-t-lg text-sm font-medium ${
                    getOrderAlert(order)?.type === 'error' ? 'bg-red-50 text-red-700 border-b border-red-200' :
                    getOrderAlert(order)?.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border-b border-yellow-200' :
                    'bg-blue-50 text-blue-700 border-b border-blue-200'
                  }`}>
                    ⚠️ {getOrderAlert(order)?.message}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Truck className="w-4 h-4" />{order.supplierName}</span>
                        <span>Commande: {order.date}</span>
                        {order.manufacturingDate && <span>Fabrication: {order.manufacturingDate}</span>}
                        {order.receivedDate && <span>Réception: {order.receivedDate}</span>}
                        <span>Livraison prévue: {order.expectedDelivery}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{formatXof(order.total)}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Articles commandés:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <span className="text-gray-900">{item.medicineName}</span>
                            <span className="text-gray-600 ml-2">× {item.quantity}</span>
                            <span className="text-gray-500 text-xs ml-2">({formatXof(item.unitPrice)}/u)</span>
                          </div>
                          <span className="font-medium text-gray-900">{formatXof(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />Confirmer
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />Annuler
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <Truck className="w-4 h-4" />Marquer expédiée
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />Annuler
                        </button>
                      </>
                    )}
                    {order.status === 'shipped' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <PackageIcon className="w-4 h-4" />Marquer livrée
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />Annuler
                        </button>
                      </>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />Confirmer réception
                      </button>
                    )}
                    {(order.status === 'cancelled') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'pending')}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        <Clock className="w-4 h-4" />Réactiver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Order Modal */}
      {showAddModal && <AddOrderModal suppliers={suppliers} medicines={medicines} onClose={() => setShowAddModal(false)} onSubmit={handleAddOrder} />}
    </div>
  );
}

// -------------------- AddOrderModal --------------------
function AddOrderModal({
  suppliers,
  medicines,
  onClose,
  onSubmit,
}: {
  suppliers: Supplier[];
  medicines: Medicine[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [itemsCount, setItemsCount] = useState(1);

  const defaultDeliveryDate = new Date();
  defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 7);
  const formattedDate = defaultDeliveryDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Nouvelle commande fournisseur</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="itemsCount" value={itemsCount} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="supplierSelect" className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
              <select
                id="supplierSelect"
                name="supplierId"
                required
                aria-label="Fournisseur"
                title="Fournisseur"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Livraison prévue *</label>
              <input
                id="deliveryDate"
                type="date"
                name="expectedDelivery"
                required
                defaultValue={formattedDate}
                aria-label="Date de livraison prévue"
                title="Date de livraison prévue"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="manufacturingDate" className="block text-sm font-medium text-gray-700 mb-1">Date de fabrication</label>
              <input
                id="manufacturingDate"
                type="date"
                name="manufacturingDate"
                aria-label="Date de fabrication"
                title="Date de fabrication"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="receivedDate" className="block text-sm font-medium text-gray-700 mb-1">Date de réception</label>
              <input
                id="receivedDate"
                type="date"
                name="receivedDate"
                aria-label="Date de réception"
                title="Date de réception"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Articles à commander</h4>
              <button type="button" onClick={() => setItemsCount(itemsCount + 1)} className="text-sm text-blue-600 hover:text-blue-700">+ Ajouter un article</button>
            </div>

            <div className="space-y-3">
              {Array.from({ length: itemsCount }, (_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Article {i + 1}</span>
                    {i > 0 && (
                      <button type="button" onClick={() => setItemsCount(Math.max(1, itemsCount - 1))} className="text-sm text-red-600 hover:text-red-700">Retirer</button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label htmlFor={`medicine_${i}`} className="block text-xs text-gray-600 mb-1">Médicament *</label>
                      <select
                        id={`medicine_${i}`}
                        name={`medicine_${i}`}
                        required
                        aria-label="Médicament"
                        title="Médicament"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner...</option>
                        {medicines.map(m => <option key={m.id} value={m.id}>{m.name} {m.dosage} (ID: {m.id})</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`quantity_${i}`} className="block text-xs text-gray-600 mb-1">Quantité *</label>
                      <input
                        id={`quantity_${i}`}
                        type="number"
                        name={`quantity_${i}`}
                        required
                        min="1"
                        placeholder="Quantité"
                        title="Quantité"
                        aria-label="Quantité"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor={`price_${i}`} className="block text-xs text-gray-600 mb-1">Prix unitaire (fcfa) *</label>
                      <input
                        id={`price_${i}`}
                        type="number"
                        name={`price_${i}`}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Prix unitaire"
                        title="Prix unitaire"
                        aria-label="Prix unitaire"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Créer la commande</button>
          </div>
        </form>
      </div>
    </div>
  );
}
