const mysql = require('mysql2/promise');

async function seedDatabase() {
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
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await connection.execute('DELETE FROM batch');
    await connection.execute('DELETE FROM medicine');
    await connection.execute('DELETE FROM supplier');
    await connection.execute('ALTER TABLE batch AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE medicine AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE supplier AUTO_INCREMENT = 1');
    
    // Insert suppliers
    console.log('🏢 Inserting suppliers...');
    const suppliers = [
      { name: 'PharmaLab Distribution', phone: '+221 33 123 45 67', email: 'contact@pharmalab.sn', address: 'Dakar, Sénégal' },
      { name: 'MediSupply International', phone: '+221 33 987 65 43', email: 'info@medisupply.sn', address: 'Thiès, Sénégal' },
      { name: 'AfroPharma Group', phone: '+221 33 456 78 90', email: 'sales@afropharma.sn', address: 'Saint-Louis, Sénégal' },
      { name: 'HealthCare Partners', phone: '+221 33 234 56 78', email: 'support@healthcare.sn', address: 'Kaolack, Sénégal' }
    ];
    
    for (const supplier of suppliers) {
      await connection.execute(
        'INSERT INTO supplier (name, phone, email, address) VALUES (?, ?, ?, ?)',
        [supplier.name, supplier.phone, supplier.email, supplier.address]
      );
    }
    
    // Insert medicines
    console.log('💊 Inserting medicines...');
    const medicines = [
      // Antibiotics
      { name: 'Amoxicilline 500mg', category: 'Antibiotique', purchasePrice: 800, salePrice: 1200, totalQuantity: 150, minStock: 20 },
      { name: 'Azithromycine 250mg', category: 'Antibiotique', purchasePrice: 1200, salePrice: 1800, totalQuantity: 100, minStock: 15 },
      { name: 'Ciprofloxacine 500mg', category: 'Antibiotique', purchasePrice: 1500, salePrice: 2200, totalQuantity: 80, minStock: 10 },
      
      // Pain relievers
      { name: 'Paracétamol 500mg', category: 'Antidouleur', purchasePrice: 300, salePrice: 500, totalQuantity: 300, minStock: 50 },
      { name: 'Ibuprofène 400mg', category: 'Antidouleur', purchasePrice: 400, salePrice: 700, totalQuantity: 200, minStock: 30 },
      { name: 'Diclofénac 50mg', category: 'Antidouleur', purchasePrice: 500, salePrice: 800, totalQuantity: 120, minStock: 20 },
      
      // Vitamins
      { name: 'Vitamine C 1000mg', category: 'Vitamines', purchasePrice: 600, salePrice: 1000, totalQuantity: 180, minStock: 25 },
      { name: 'Complexe B', category: 'Vitamines', purchasePrice: 800, salePrice: 1300, totalQuantity: 150, minStock: 20 },
      { name: 'Vitamine D3 1000UI', category: 'Vitamines', purchasePrice: 900, salePrice: 1500, totalQuantity: 100, minStock: 15 },
      
      // Cardiovascular
      { name: 'Amlodipine 5mg', category: 'Cardiovasculaire', purchasePrice: 1000, salePrice: 1600, totalQuantity: 90, minStock: 15 },
      { name: 'Aténolol 50mg', category: 'Cardiovasculaire', purchasePrice: 900, salePrice: 1400, totalQuantity: 85, minStock: 12 },
      
      // Digestive
      { name: 'Oméprazole 20mg', category: 'Digestif', purchasePrice: 700, salePrice: 1100, totalQuantity: 140, minStock: 20 },
      { name: 'Domperidone 10mg', category: 'Digestif', purchasePrice: 600, salePrice: 950, totalQuantity: 110, minStock: 18 },
      
      // Respiratory
      { name: 'Salbutamol 100µg', category: 'Respiratoire', purchasePrice: 1100, salePrice: 1700, totalQuantity: 75, minStock: 10 },
      { name: 'Ambroxol 30mg', category: 'Respiratoire', purchasePrice: 500, salePrice: 800, totalQuantity: 130, minStock: 20 }
    ];
    
    for (const medicine of medicines) {
      await connection.execute(
        'INSERT INTO medicine (name, category, purchasePrice, salePrice, totalQuantity, minStock) VALUES (?, ?, ?, ?, ?, ?)',
        [medicine.name, medicine.category, medicine.purchasePrice, medicine.salePrice, medicine.totalQuantity, medicine.minStock]
      );
    }
    
    // Insert batches with realistic 2025-2026 dates
    console.log('📦 Inserting batches with 2025-2026 dates...');
    const batches = [
      // 2025 expirations
      { medicineId: 1, batchNumber: 'AMX2025A001', manufacturingDate: '2024-12-01', expiryDate: '2025-12-01', purchasePrice: 800, sellPrice: 1200, quantity: 50, supplierId: 1, receivedDate: '2024-12-15' },
      { medicineId: 1, batchNumber: 'AMX2025A002', manufacturingDate: '2025-01-15', expiryDate: '2025-11-15', purchasePrice: 800, sellPrice: 1200, quantity: 40, supplierId: 2, receivedDate: '2025-01-20' },
      { medicineId: 1, batchNumber: 'AMX2025A003', manufacturingDate: '2025-03-01', expiryDate: '2025-10-01', purchasePrice: 800, sellPrice: 1200, quantity: 60, supplierId: 1, receivedDate: '2025-03-05' },
      
      { medicineId: 4, batchNumber: 'PAR2025B001', manufacturingDate: '2024-11-01', expiryDate: '2025-11-01', purchasePrice: 300, sellPrice: 500, quantity: 100, supplierId: 3, receivedDate: '2024-11-10' },
      { medicineId: 4, batchNumber: 'PAR2025B002', manufacturingDate: '2025-02-01', expiryDate: '2025-08-01', purchasePrice: 300, sellPrice: 500, quantity: 80, supplierId: 4, receivedDate: '2025-02-05' },
      { medicineId: 4, batchNumber: 'PAR2025B003', manufacturingDate: '2025-04-01', expiryDate: '2025-09-01', purchasePrice: 300, sellPrice: 500, quantity: 120, supplierId: 2, receivedDate: '2025-04-05' },
      
      // 2026 expirations
      { medicineId: 2, batchNumber: 'AZI2026C001', manufacturingDate: '2025-01-01', expiryDate: '2026-01-01', purchasePrice: 1200, sellPrice: 1800, quantity: 30, supplierId: 1, receivedDate: '2025-01-10' },
      { medicineId: 2, batchNumber: 'AZI2026C002', manufacturingDate: '2025-03-15', expiryDate: '2026-03-15', purchasePrice: 1200, sellPrice: 1800, quantity: 35, supplierId: 3, receivedDate: '2025-03-20' },
      { medicineId: 2, batchNumber: 'AZI2026C003', manufacturingDate: '2025-05-01', expiryDate: '2026-05-01', purchasePrice: 1200, sellPrice: 1800, quantity: 35, supplierId: 2, receivedDate: '2025-05-05' },
      
      { medicineId: 7, batchNumber: 'VITC2026D001', manufacturingDate: '2025-02-01', expiryDate: '2026-02-01', purchasePrice: 600, sellPrice: 1000, quantity: 60, supplierId: 4, receivedDate: '2025-02-08' },
      { medicineId: 7, batchNumber: 'VITC2026D002', manufacturingDate: '2025-04-15', expiryDate: '2026-04-15', purchasePrice: 600, sellPrice: 1000, quantity: 60, supplierId: 1, receivedDate: '2025-04-20' },
      { medicineId: 7, batchNumber: 'VITC2026D003', manufacturingDate: '2025-06-01', expiryDate: '2026-06-01', purchasePrice: 600, sellPrice: 1000, quantity: 60, supplierId: 3, receivedDate: '2025-06-05' },
      
      // Some expired batches for testing
      { medicineId: 5, batchNumber: 'IBU2024E001', manufacturingDate: '2023-06-01', expiryDate: '2024-06-01', purchasePrice: 400, sellPrice: 700, quantity: 25, supplierId: 2, receivedDate: '2023-06-10' },
      { medicineId: 5, batchNumber: 'IBU2024E002', manufacturingDate: '2023-08-15', expiryDate: '2024-08-15', purchasePrice: 400, sellPrice: 700, quantity: 30, supplierId: 1, receivedDate: '2023-08-20' },
      
      // Near expiration batches
      { medicineId: 8, batchNumber: 'COMB2025F001', manufacturingDate: '2024-09-01', expiryDate: '2025-03-01', purchasePrice: 800, sellPrice: 1300, quantity: 40, supplierId: 4, receivedDate: '2024-09-10' },
      { medicineId: 9, batchNumber: 'VITD2025G001', manufacturingDate: '2024-10-01', expiryDate: '2025-04-01', purchasePrice: 900, sellPrice: 1500, quantity: 35, supplierId: 2, receivedDate: '2024-10-08' },
      
      // Future expirations
      { medicineId: 10, batchNumber: 'AML2026H001', manufacturingDate: '2025-01-01', expiryDate: '2026-07-01', purchasePrice: 1000, sellPrice: 1600, quantity: 25, supplierId: 3, receivedDate: '2025-01-08' },
      { medicineId: 11, batchNumber: 'ATE2026I001', manufacturingDate: '2025-02-01', expiryDate: '2026-08-01', purchasePrice: 900, sellPrice: 1400, quantity: 25, supplierId: 1, receivedDate: '2025-02-08' }
    ];
    
    for (const batch of batches) {
      await connection.execute(
        'INSERT INTO batch (medicineId, batchNumber, manufacturingDate, expiryDate, purchasePrice, sellPrice, quantity, supplierId, receivedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [batch.medicineId, batch.batchNumber, batch.manufacturingDate, batch.expiryDate, batch.purchasePrice, batch.sellPrice, batch.quantity, batch.supplierId, batch.receivedDate]
      );
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${suppliers.length} suppliers added`);
    console.log(`   - ${medicines.length} medicines added`);
    console.log(`   - ${batches.length} batches added`);
    console.log(`📅 Date ranges: 2024-2026 with some expired/test batches`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();