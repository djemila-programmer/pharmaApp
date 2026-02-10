import { AppDataSource } from "./src/config/db";
import { Sale } from "./src/entities/Sale";
import { Batch } from "./src/entities/Batch";
import { Medicine } from "./src/entities/Medicine";

async function fixSalesData() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const saleRepo = AppDataSource.getRepository(Sale);
    const batchRepo = AppDataSource.getRepository(Batch);
    const medicineRepo = AppDataSource.getRepository(Medicine);

    // Clear existing sales with corrupted data
    console.log("🗑️  Clearing existing sales...");
    await saleRepo.query('DELETE FROM sale');
    
    // Get medicines and batches
    const medicines = await medicineRepo.find();
    const batches = await batchRepo.find();
    
    console.log(`📊 Found ${medicines.length} medicines and ${batches.length} batches`);
    
    // Create 5 new sales with proper data
    for (let i = 0; i < 5; i++) {
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items: any[] = [];
      let total = 0;
      
      for (let j = 0; j < itemCount; j++) {
        if (batches.length > 0) {
          const batch = batches[Math.floor(Math.random() * batches.length)];
          const quantity = Math.min(Math.floor(Math.random() * 3) + 1, batch.quantity);
          
          if (quantity > 0 && batch.quantity >= quantity) {
            const itemTotal = quantity * batch.sellPrice;
            items.push({
              medicineId: batch.medicineId,
              medicineName: medicines.find(m => m.id === batch.medicineId)?.name || 'Médicament',
              batchId: batch.id,
              batchNumber: batch.batchNumber,
              quantity: quantity,
              unitPrice: batch.sellPrice,
              total: itemTotal
            });
            
            total += itemTotal;
            
            // Update batch quantity
            batch.quantity -= quantity;
            await batchRepo.save(batch);
            
            // Update medicine total quantity
            const medicine = medicines.find(m => m.id === batch.medicineId);
            if (medicine) {
              medicine.totalQuantity = (medicine.totalQuantity || 0) - quantity;
              await medicineRepo.save(medicine);
            }
          }
        }
      }
      
      if (items.length > 0) {
        const sale = saleRepo.create({
          saleNumber: `VTE2024${String(i + 1).padStart(3, '0')}`,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          customerName: `Client ${i + 1}`,
          prescriptionId: Math.random() > 0.7 ? `ORDO${Math.floor(Math.random() * 1000)}` : undefined,
          items: items,
          total: total,
          paymentMethod: ['cash', 'card', 'insurance'][Math.floor(Math.random() * 3)],
          status: 'completed'
        });
        
        await saleRepo.save(sale);
        console.log(`✅ Created sale #${sale.saleNumber} - ${items.length} items, ${total.toFixed(2)} F CFA`);
      }
    }
    
    // Verify the data
    const sales = await saleRepo.find();
    console.log(`\n🎉 Successfully created ${sales.length} sales!`);
    sales.forEach((sale, index) => {
      console.log(`${index + 1}. ${sale.saleNumber} - ${sale.total.toFixed(2)} F CFA (${sale.items?.length || 0} items)`);
    });

  } catch (error) {
    console.error("❌ Error fixing sales data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

fixSalesData();