import { AppDataSource } from "./src/config/db";
import { Sale } from "./src/entities/Sale";
import { Batch } from "./src/entities/Batch";
import { Medicine } from "./src/entities/Medicine";

async function resetSalesData() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const saleRepo = AppDataSource.getRepository(Sale);
    const batchRepo = AppDataSource.getRepository(Batch);
    const medicineRepo = AppDataSource.getRepository(Medicine);

    // Clear existing sales
    console.log("🗑️  Clearing existing sales...");
    await saleRepo.query('DELETE FROM sale');
    
    // Get fresh data
    const medicines = await medicineRepo.find({
      relations: ['batches']
    });
    
    const batches = await batchRepo.find();
    
    console.log(`📊 Found ${medicines.length} medicines with batches`);
    
    // Create sample sales only if there are medicines with stock
    let salesCreated = 0;
    
    // Filter medicines that have batches with positive quantities
    const medicinesWithStock = medicines.filter(medicine => 
      medicine.batches && medicine.batches.some(batch => batch.quantity > 0)
    );
    
    console.log(`📈 Medicines with available stock: ${medicinesWithStock.length}`);
    
    if (medicinesWithStock.length > 0) {
      // Create 3-5 sales
      const saleCount = Math.min(medicinesWithStock.length, 5);
      
      for (let i = 0; i < saleCount; i++) {
        const medicine = medicinesWithStock[i % medicinesWithStock.length];
        const availableBatches = medicine.batches?.filter(b => b.quantity > 0) || [];
        
        if (availableBatches.length > 0) {
          const batch = availableBatches[0];
          const quantity = Math.min(2, batch.quantity); // Sell max 2 units
          
          if (quantity > 0) {
            const items = [{
              medicineId: medicine.id,
              medicineName: medicine.name,
              batchId: batch.id,
              batchNumber: batch.batchNumber,
              quantity: quantity,
              unitPrice: batch.sellPrice,
              total: quantity * batch.sellPrice
            }];
            
            const sale = saleRepo.create({
              saleNumber: `VTE2024${String(i + 1).padStart(3, '0')}`,
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
              customerName: `Client ${i + 1}`,
              prescriptionId: i % 3 === 0 ? `ORDO${Math.floor(Math.random() * 1000)}` : undefined,
              items: items,
              total: quantity * batch.sellPrice,
              paymentMethod: ['cash', 'card', 'insurance'][i % 3],
              status: 'completed'
            });
            
            await saleRepo.save(sale);
            
            // Update batch quantity
            batch.quantity -= quantity;
            await batchRepo.save(batch);
            
            // Update medicine total quantity
            medicine.totalQuantity = (medicine.totalQuantity || 0) - quantity;
            await medicineRepo.save(medicine);
            
            console.log(`✅ Created sale ${sale.saleNumber} - ${medicine.name} (${quantity} units)`);
            salesCreated++;
          }
        }
      }
    }
    
    console.log(`\n🎉 Successfully created ${salesCreated} sales!`);
    
    // Verify the data
    const sales = await saleRepo.find();
    console.log(`Total sales in database: ${sales.length}`);
    
  } catch (error) {
    console.error("❌ Error resetting sales data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

resetSalesData();