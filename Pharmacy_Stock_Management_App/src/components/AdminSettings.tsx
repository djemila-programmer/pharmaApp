import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Users, Building2, FileBarChart, TrendingUp, Search, Download, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { formatXof } from '../utils/currency';
import { Supplier } from '../types/pharmacy';
import axiosClient from '../utils/axiosClient';

export function AdminSettings() {
  const [activeSection, setActiveSection] = useState<'suppliers' | 'users' | 'reports'>('suppliers');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paramètres d'administration</h2>
        <p className="text-gray-500 mt-1">Gérez les paramètres système et les utilisateurs</p>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex gap-1">
        <button
          onClick={() => setActiveSection('suppliers')}
          aria-label="Voir la gestion des fournisseurs"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'suppliers'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="font-medium">Fournisseurs</span>
        </button>

        <button
          onClick={() => setActiveSection('users')}
          aria-label="Voir la gestion des utilisateurs"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'users'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="font-medium">Utilisateurs</span>
        </button>

        <button
          onClick={() => setActiveSection('reports')}
          aria-label="Voir les rapports et analyses"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'reports'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FileBarChart className="w-4 h-4" />
          <span className="font-medium">Ventes & Rapports</span>
        </button>
      </div>

      {/* Content */}
      {activeSection === 'suppliers' && <SuppliersManagement />}
      {activeSection === 'users' && <UsersManagement />}
      {activeSection === 'reports' && <Reports />}
    </div>
  );
}

function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true); // ✅ AJOUTÉ

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/suppliers');
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Erreur chargement fournisseurs:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newSupplier = {
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
    };

    try {
      await axiosClient.post('/api/suppliers', newSupplier);
      await loadSuppliers();
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Erreur ajout fournisseur:', error);
      alert(`Erreur: ${error?.response?.data?.message || 'Impossible d\'ajouter le fournisseur'}`);
    }
  };

  const handleEditSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSupplier) return;

    const formData = new FormData(e.currentTarget);

    const updatedSupplier = {
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
    };

    try {
      await axiosClient.put(`/api/suppliers/${editingSupplier.id}`, updatedSupplier);
      await loadSuppliers();
      setEditingSupplier(null);
    } catch (error: any) {
      console.error('Erreur modification fournisseur:', error);
      alert(`Erreur: ${error?.response?.data?.message || 'Impossible de modifier le fournisseur'}`);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) return;

    try {
      await axiosClient.delete(`/api/suppliers/${id}`);
      await loadSuppliers();
    } catch (error: any) {
      console.error('Erreur suppression fournisseur:', error);
      alert(`Erreur: ${error?.response?.data?.message || 'Impossible de supprimer le fournisseur'}`);
    }
  };

  // ✅ AJOUTÉ - État de chargement
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des fournisseurs</h3>
        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Ajouter un nouveau fournisseur"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un fournisseur
        </button>
      </div>

      {/* Suppliers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucun fournisseur enregistré</p>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">Contact: {supplier.contact}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSupplier(supplier)}
                    aria-label={`Modifier le fournisseur ${supplier.name}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    aria-label={`Supprimer le fournisseur ${supplier.name}`}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📞 {supplier.phone}</p>
                <p>📧 {supplier.email}</p>
                <p>📍 {supplier.address}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nouveau fournisseur</h3>
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input id="add-name" name="name" required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="add-contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Personne de contact *
                </label>
                <input id="add-contact" name="contact" required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input id="add-phone" name="phone" required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input id="add-email" name="email" type="email" required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="add-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <textarea id="add-address" name="address" required className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Modifier le fournisseur</h3>
            <form onSubmit={handleEditSupplier} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input id="edit-name" name="name" defaultValue={editingSupplier.name} required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="edit-contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Personne de contact *
                </label>
                <input id="edit-contact" name="contact" defaultValue={editingSupplier.contact} required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input id="edit-phone" name="phone" defaultValue={editingSupplier.phone} required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input id="edit-email" name="email" type="email" defaultValue={editingSupplier.email} required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <textarea id="edit-address" name="address" defaultValue={editingSupplier.address} required className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersManagement() {
  const [users] = useState([
    { id: '1', name: 'Admin Principal', username: 'admin', role: 'Administrateur', email: 'admin@pharmacy.com' },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Utilisateur Unique</h3>
        <button
          aria-label="Ajouter un utilisateur"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{user.role}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>👤 {user.username}</p>
              <p>📧 {user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reports() {
  const [sales, setSales] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true); // ✅ AJOUTÉ

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/sales');
      setSales(response.data || []);
    } catch (error) {
      console.error('Erreur chargement ventes:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = useMemo(() => {
    return sales.reduce((sum, sale) => sum + (sale.total || sale.totalPrice || 0), 0);
  }, [sales]);

  const todaySales = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return sales.filter(s => s.date?.startsWith(today)).length;
  }, [sales]);

  const averageSale = useMemo(() => {
    return sales.length > 0 ? totalSales / sales.length : 0;
  }, [sales, totalSales]);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch = searchTerm === '' || 
        sale.id?.toString().includes(searchTerm) ||
        sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = sale.date?.startsWith(today);
      }
      
      return matchesSearch && matchesDate;
    });
  }, [sales, searchTerm, dateFilter]);

  const exportSales = () => {
    const csv = [
      ['ID', 'Date', 'Client', 'Total', 'Paiement'],
      ...sales.map(s => [
        s.id || '',
        s.date || '',
        s.customerName || 'Client',
        s.total || s.totalPrice || 0,
        s.paymentMethod || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // ✅ AJOUTÉ - État de chargement
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
      <h3 className="text-lg font-semibold text-gray-900">Ventes et Rapports</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total des ventes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatXof(totalSales)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventes aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{todaySales}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Panier moyen</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatXof(Math.round(averageSale))}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par client ou numéro..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filtrer les ventes par période"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
          </select>
          <button
            onClick={exportSales}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucune vente trouvée
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.date ? new Date(sale.date).toLocaleString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customerName || 'Client'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatXof(sale.total || sale.totalPrice || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.paymentMethod || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}