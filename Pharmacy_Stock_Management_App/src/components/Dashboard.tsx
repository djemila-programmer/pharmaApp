import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Package, ShoppingCart, AlertCircle, Calendar } from 'lucide-react';
import { formatXof } from '../utils/currency';
import axiosClient from '../utils/axiosClient';
import { Medicine, Batch } from '../types/pharmacy';

export function Dashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [expiringBatches, setExpiringBatches] = useState<(Batch & { medicineName: string })[]>([]);
  const [lowStockMedicines, setLowStockMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalStock: 0,
    todaySales: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const parseSafeDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === '0000-00-00' || dateStr === '0000-00-00 00:00:00') return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const medicinesRes = await axiosClient.get('/api/medicines');

      const medicinesData: Medicine[] = (medicinesRes.data || []).map((med: any) => {
        const batches = (med.batches || []).map((batch: any) => ({
          id: batch.id?.toString(),
          batchNumber: batch.batchNumber || batch.batch_number || '',
          quantity: parseInt(batch.quantity) || 0,
          purchasePrice: parseFloat(batch.purchasePrice || batch.purchase_price || 0),
          sellPrice: parseFloat(batch.sellPrice || batch.sell_price || 0),
          expiryDate: parseSafeDate(batch.expiryDate || batch.expiry_date)?.toISOString() || '',
          manufacturingDate: parseSafeDate(batch.manufacturingDate || batch.manufacturing_date)?.toISOString() || '',
          receivedDate: parseSafeDate(batch.receivedDate || batch.received_date)?.toISOString() || '',
          supplierId: batch.supplierId || batch.supplier_id
        }));

        return {
          id: med.id?.toString() || med.id_medicine?.toString(),
          name: med.name || med.medicine_name || 'Sans nom',
          genericName: med.genericName || med.generic_name || '',
          dosage: med.dosage || '',
          form: med.form || '',
          category: med.category || '',
          minStock: med.minStock || med.min_stock || 10,
          batches
        };
      });

      setMedicines(medicinesData);

      // Lots expirants dans les 45 prochains jours (1 mois et demi)
      const today = new Date();
      const fortyFiveDaysFromNow = new Date();
      fortyFiveDaysFromNow.setDate(today.getDate() + 45);

      const expiring: (Batch & { medicineName: string })[] = [];
      const expired: (Batch & { medicineName: string })[] = [];
      
      medicinesData.forEach((medicine) => {
        (medicine.batches || []).forEach((batch) => {
          if (!batch.expiryDate) return;
          const expiryDate = new Date(batch.expiryDate);
          
          // Check for expired lots (past expiration date)
          if (expiryDate < today && batch.quantity > 0) {
            expired.push({ ...batch, medicineName: medicine.name });
          }
          // Check for expiring lots (within 45 days)
          else if (expiryDate <= fortyFiveDaysFromNow && expiryDate >= today && batch.quantity > 0) {
            expiring.push({ ...batch, medicineName: medicine.name });
          }
        });
      });
      
      expiring.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      expired.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      
      setExpiringBatches([...expired, ...expiring]);

      // Stock faible
      const lowStock = medicinesData.filter((medicine) => {
        const totalStock = (medicine.batches || []).reduce((sum, batch) => sum + (batch.quantity || 0), 0);
        return totalStock < medicine.minStock && totalStock >= 0;
      });
      setLowStockMedicines(lowStock);

      // Stock total
      const totalStock = medicinesData.reduce(
        (sum, medicine) => sum + (medicine.batches || []).reduce((s, b) => s + (b.quantity || 0), 0),
        0
      );

      // Ventes d'aujourd'hui
      let todaySalesAmount = 0;
      try {
        const salesRes = await axiosClient.get('/api/sales');
        const todayStr = new Date().toISOString().split('T')[0];
        const salesData = salesRes.data || [];
        todaySalesAmount = salesData
          .filter((sale: any) => {
            const saleDate = sale?.date || sale?.saleDate || sale?.sale_date;
            return saleDate?.startsWith(todayStr);
          })
          .reduce((sum: number, sale: any) => sum + parseFloat(sale?.total || sale?.amount || 0), 0);
      } catch (err) {
        console.warn('Impossible de charger les ventes:', err);
      }

      // Commandes en attente
      let pendingOrdersCount = 0;
      try {
        const ordersRes = await axiosClient.get('/api/orders');
        const ordersData = ordersRes.data || [];
        pendingOrdersCount = ordersData.filter((order: any) => order.status === 'pending').length;
      } catch (err) {
        console.warn('Impossible de charger les commandes:', err);
      }

      setStats({
        totalMedicines: medicinesData.length,
        totalStock,
        todaySales: todaySalesAmount,
        pendingOrders: pendingOrdersCount,
      });

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setMedicines([]);
      setExpiringBatches([]);
      setLowStockMedicines([]);
      setStats({ totalMedicines: 0, totalStock: 0, todaySales: 0, pendingOrders: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string): number => {
    if (!expiryDate) return 999;
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
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre pharmacie</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Médicaments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Médicaments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMedicines}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Stock Total */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Stock Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStock.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">unités</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Ventes Aujourd'hui */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ventes Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatXof(stats.todaySales)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Commandes en cours */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Commandes en cours</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Batches */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Lots expirés et expirants (45 jours)</h3>
            <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{expiringBatches.length}</span>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            {expiringBatches.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucun lot expiré ou proche de l'expiration</p>
            ) : (
              expiringBatches.map(batch => {
                const daysLeft = getDaysUntilExpiry(batch.expiryDate);
                const isExpired = daysLeft <= 0;
                
                // Filter out lots with extremely long expiration periods (more than 1 year)
                if (!isExpired && daysLeft > 365) {
                  return null;
                }
                
                const bgColor = isExpired ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200';
                const textColor = isExpired ? 'text-red-600' : 'text-orange-600';
                const iconColor = isExpired ? 'text-red-600' : 'text-orange-600';
                
                return (
                  <div key={batch.id} className={`flex items-start gap-3 p-3 rounded-lg border ${bgColor}`}>
                    <AlertCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{batch.medicineName}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Lot: {batch.batchNumber} • Qté: {batch.quantity} unités</p>
                      <p className={`text-xs font-medium mt-1 ${textColor}`}>
                        {isExpired ? 'Expiré depuis' : 'Expire dans'} {Math.abs(daysLeft)} jours 
                        ({batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString('fr-FR') : 'N/A'})
                        {isExpired && <span className="ml-2 bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">EXPIRÉ</span>}
                      </p>
                    </div>
                  </div>
                );
              }).filter(Boolean) // Remove null entries
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">Stock faible</h3>
            <span className="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{lowStockMedicines.length}</span>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            {lowStockMedicines.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Tous les stocks sont suffisants</p>
            ) : (
              lowStockMedicines.map(med => {
                const currentStock = (med.batches || []).reduce((sum, b) => sum + (b.quantity || 0), 0);
                const percentage = med.minStock > 0 ? Math.min((currentStock / med.minStock) * 100, 100) : 0;
                return (
                  <div key={med.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <Package className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{med.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{med.dosage} • {med.form}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-xs text-red-600 font-medium whitespace-nowrap">{currentStock} / {med.minStock}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
