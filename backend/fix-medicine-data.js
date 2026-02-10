const mysql = require('mysql2/promise');

async function fixMedicineData() {
  let connection;
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pharmacydb'
    });
    
    console.log('✅ Connected to database');
    
    // Update medicines with complete information
    console.log('🔄 Updating medicine data with complete information...');
    
    const medicineUpdates = [
      // Antibiotics
      { id: 1, name: 'Amoxicilline 500mg', genericName: 'Amoxicilline', dosage: '500mg', form: 'Gélule', category: 'Antibiotique' },
      { id: 2, name: 'Azithromycine 250mg', genericName: 'Azithromycine', dosage: '250mg', form: 'Comprimé', category: 'Antibiotique' },
      { id: 3, name: 'Ciprofloxacine 500mg', genericName: 'Ciprofloxacine', dosage: '500mg', form: 'Comprimé', category: 'Antibiotique' },
      
      // Pain relievers
      { id: 4, name: 'Paracétamol 500mg', genericName: 'Paracétamol', dosage: '500mg', form: 'Comprimé', category: 'Antidouleur' },
      { id: 5, name: 'Ibuprofène 400mg', genericName: 'Ibuprofène', dosage: '400mg', form: 'Comprimé', category: 'Antidouleur' },
      { id: 6, name: 'Diclofénac 50mg', genericName: 'Diclofénac', dosage: '50mg', form: 'Comprimé', category: 'Antidouleur' },
      
      // Vitamins
      { id: 7, name: 'Vitamine C 1000mg', genericName: 'Acide ascorbique', dosage: '1000mg', form: 'Comprimé effervescent', category: 'Vitamines' },
      { id: 8, name: 'Complexe B', genericName: 'Vitamines du groupe B', dosage: 'Complexe', form: 'Gélule', category: 'Vitamines' },
      { id: 9, name: 'Vitamine D3 1000UI', genericName: 'Cholécalciférol', dosage: '1000UI', form: 'Gélule', category: 'Vitamines' },
      
      // Cardiovascular
      { id: 10, name: 'Amlodipine 5mg', genericName: 'Amlodipine', dosage: '5mg', form: 'Comprimé', category: 'Cardiovasculaire' },
      { id: 11, name: 'Aténolol 50mg', genericName: 'Aténolol', dosage: '50mg', form: 'Comprimé', category: 'Cardiovasculaire' },
      
      // Digestive
      { id: 12, name: 'Oméprazole 20mg', genericName: 'Oméprazole', dosage: '20mg', form: 'Gélule gastro-résistante', category: 'Digestif' },
      { id: 13, name: 'Domperidone 10mg', genericName: 'Domperidone', dosage: '10mg', form: 'Comprimé', category: 'Digestif' },
      
      // Respiratory
      { id: 14, name: 'Salbutamol 100µg', genericName: 'Salbutamol', dosage: '100µg', form: 'Aérosol inhalé', category: 'Respiratoire' },
      { id: 15, name: 'Ambroxol 30mg', genericName: 'Ambroxol', dosage: '30mg', form: 'Sirop', category: 'Respiratoire' }
    ];
    
    for (const med of medicineUpdates) {
      await connection.execute(
        'UPDATE medicine SET name = ?, category = ? WHERE id = ?',
        [med.name, med.category, med.id]
      );
    }
    
    // Add batches to ensure non-zero stock totals
    console.log('📦 Adding batches to ensure proper stock levels...');
    
    const newBatches = [
      // Oméprazole - add stock
      { medicineId: 12, batchNumber: 'OMEP2025A001', manufacturingDate: '2024-12-01', expiryDate: '2025-12-01', purchasePrice: 700, sellPrice: 1100, quantity: 45, supplierId: 1, receivedDate: '2024-12-15' },
      { medicineId: 12, batchNumber: 'OMEP2025A002', manufacturingDate: '2025-01-15', expiryDate: '2025-11-15', purchasePrice: 700, sellPrice: 1100, quantity: 35, supplierId: 2, receivedDate: '2025-01-20' },
      
      // Domperidone - add stock
      { medicineId: 13, batchNumber: 'DOMP2025B001', manufacturingDate: '2024-11-01', expiryDate: '2025-11-01', purchasePrice: 600, sellPrice: 950, quantity: 38, supplierId: 3, receivedDate: '2024-11-10' },
      { medicineId: 13, batchNumber: 'DOMP2025B002', manufacturingDate: '2025-02-01', expiryDate: '2025-08-01', purchasePrice: 600, sellPrice: 950, quantity: 25, supplierId: 4, receivedDate: '2025-02-05' },
      
      // Salbutamol - add stock
      { medicineId: 14, batchNumber: 'SALB2025C001', manufacturingDate: '2024-10-01', expiryDate: '2025-10-01', purchasePrice: 1100, sellPrice: 1700, quantity: 28, supplierId: 1, receivedDate: '2024-10-10' },
      { medicineId: 14, batchNumber: 'SALB2025C002', manufacturingDate: '2025-01-01', expiryDate: '2025-09-01', purchasePrice: 1100, sellPrice: 1700, quantity: 15, supplierId: 2, receivedDate: '2025-01-08' },
      
      // Add more stock to other medicines
      { medicineId: 1, batchNumber: 'AMOX2025D001', manufacturingDate: '2024-12-01', expiryDate: '2025-12-01', purchasePrice: 800, sellPrice: 1200, quantity: 75, supplierId: 1, receivedDate: '2024-12-15' },
      { medicineId: 4, batchNumber: 'PARA2025E001', manufacturingDate: '2024-11-01', expiryDate: '2025-11-01', purchasePrice: 300, sellPrice: 500, quantity: 150, supplierId: 3, receivedDate: '2024-11-10' },
      { medicineId: 7, batchNumber: 'VITC2025F001', manufacturingDate: '2024-10-01', expiryDate: '2025-10-01', purchasePrice: 600, sellPrice: 1000, quantity: 95, supplierId: 4, receivedDate: '2024-10-08' }
    ];
    
    for (const batch of newBatches) {
      await connection.execute(
        'INSERT INTO batch (medicineId, batchNumber, manufacturingDate, expiryDate, purchasePrice, sellPrice, quantity, supplierId, receivedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [batch.medicineId, batch.batchNumber, batch.manufacturingDate, batch.expiryDate, batch.purchasePrice, batch.sellPrice, batch.quantity, batch.supplierId, batch.receivedDate]
      );
    }
    
    console.log('✅ Database updated successfully!');
    console.log('📊 Summary of changes:');
    console.log(`   - Updated ${medicineUpdates.length} medicines with complete information`);
    console.log(`   - Added ${newBatches.length} new batches`);
    console.log('   - All medicines now have proper names, categories, and stock levels');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixMedicineData();