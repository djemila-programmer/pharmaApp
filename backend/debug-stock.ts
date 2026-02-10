import { AppDataSource } from "./src/config/db";
import { Medicine } from "./src/entities/Medicine";
import { Batch } from "./src/entities/Batch";

async function debugMedicinesAndBatches() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const medicineRepo = AppDataSource.getRepository(Medicine);
    const batchRepo = AppDataSource.getRepository(Batch);

    // Get all medicines
    const medicines = await medicineRepo.find({
      relations: ['batches']
    });
    
    console.log(`\n📊 Found ${medicines.length} medicines:`);
    medicines.forEach((medicine, index) => {
      console.log(`${index + 1}. ${medicine.name}`);
      console.log(`   ID: ${medicine.id}`);
      console.log(`   Total Quantity: ${medicine.totalQuantity}`);
      console.log(`   Batches: ${medicine.batches?.length || 0}`);
      
      if (medicine.batches && medicine.batches.length > 0) {
        medicine.batches.forEach((batch, batchIndex) => {
          console.log(`     Batch ${batchIndex + 1}: ${batch.batchNumber} - Qty: ${batch.quantity}`);
        });
      } else {
        console.log(`     ❌ No batches found for this medicine`);
      }
      console.log('---');
    });

    // Get all batches separately
    const allBatches = await batchRepo.find();
    console.log(`\n💊 Found ${allBatches.length} total batches:`);
    allBatches.forEach((batch, index) => {
      const medicine = medicines.find(m => m.id === batch.medicineId);
      console.log(`${index + 1}. ${batch.batchNumber} - ${medicine?.name || 'Unknown'} - Qty: ${batch.quantity}`);
    });

    // Count medicines with available stock
    const medicinesWithStock = medicines.filter(m => 
      m.batches && m.batches.some(b => b.quantity > 0)
    );
    
    console.log(`\n📈 Medicines with available stock: ${medicinesWithStock.length}/${medicines.length}`);

  } catch (error) {
    console.error("❌ Error debugging data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

debugMedicinesAndBatches();