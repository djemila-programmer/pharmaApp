import { useState, useEffect } from 'react';
import { Search, CreditCard, Wallet, ShieldCheck, Receipt, RefreshCw } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { formatXof } from '../utils/currency';
import { Sale, Medicine } from '../types/pharmacy';
import { MOBILE_API_CONFIG, testMobileConnection } from '../utils/mobileConfig';

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesRes, medicinesRes] = await Promise.all([
        axiosClient.get('/api/sales'),
        axiosClient.get('/api/medicines')
      ]);
      
      setSales(Array.isArray(salesRes.data) ? salesRes.data : []);
      const medicinesData = Array.isArray(medicinesRes.data) ? medicinesRes.data : [];
      setMedicines(medicinesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setSales([]);
      setMedicines([]);
    }
  };

  const fetchMobileSales = async () => {
    try {
      console.log('🔄 Test de connexion aux APIs mobiles...');
      
      for (const url of MOBILE_API_CONFIG.urls) {
        try {
          console.log(`Testing: ${url}`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), MOBILE_API_CONFIG.timeout);
          
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              console.log(`✅ Connecté à: ${url}`);
              return result.data;
            }
          }
        } catch (error) {
          console.log(`❌ Échec pour ${url}: ${error.message}`);
        }
      }
      
      console.log('❌ Aucune connexion établie');
      return [];
    } catch (error) {
      console.error('Erreur générale de connexion API mobile:', error);
      return [];
    }
  };

  const syncMobileSales = async () => {
    try {
      const mobileSales = await fetchMobileSales();
      
      if (mobileSales.length > 0) {
        const response = await axiosClient.post('/api/sales/sync', {
          sales: mobileSales
        });
        
        if (response.data.success) {
          console.log('✅ Ventes synchronisées avec succès');
          loadData();
        }
      } else {
        alert('❌ Impossible de se connecter à l\'application mobile. Vérifiez que le service mobile est démarré.');
      }
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      alert('❌ Erreur lors de la synchronisation: ' + error.message);
    }
  };

  const filterSalesByDate = (sales: Sale[]) => {
    const now = new Date();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      switch (dateFilter) {
        case 'today':
          return saleDate.toDateString() === now.toDateString();
        case 'week':
          return saleDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return saleDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });
  };

  const filteredSales = filterSalesByDate(sales)
    .filter((sale) =>
      sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(sale.items) &&
        sale.items.some(item =>
          item.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ventes</h2>
          <p className="text-gray-500 mt-1">Historique des ventes uniquement</p>
        </div>
        <button
          onClick={syncMobileSales}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Sync Mobile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Nombre de ventes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filteredSales.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Revenu total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatXof(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Ticket moyen</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatXof(averageSale)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro, client ou médicament..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Toutes les périodes</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">7 derniers jours</option>
          <option value="month">30 derniers jours</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune vente trouvée</h3>
            <p className="text-gray-500">
              {searchTerm || dateFilter !== 'all' 
                ? 'Aucune vente ne correspond à vos critères de recherche.'
                : 'Commencez à synchroniser les ventes depuis l\'application mobile.'
              }
            </p>
            <button
              onClick={syncMobileSales}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Sync Mobile Maintenant
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.saleNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.customerName || 'Client anonyme'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {Array.isArray(sale.items) && sale.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.medicineName}</span>
                            <span className="font-medium">×{item.quantity}</span>
                          </div>
                        ))}
                        {Array.isArray(sale.items) && sale.items.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{sale.items.length - 2} articles supplémentaires
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatXof(sale.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}