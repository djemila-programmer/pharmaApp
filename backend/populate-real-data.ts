import { AppDataSource } from "./src/config/db";
import { Medicine } from "./src/entities/Medicine";
import { Batch } from "./src/entities/Batch";
import { Sale } from "./src/entities/Sale";
import { Order } from "./src/entities/Order";
import { Supplier } from "./src/entities/Supplier";

async function populateRealData() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const medicineRepo = AppDataSource.getRepository(Medicine);
    const batchRepo = AppDataSource.getRepository(Batch);
    const saleRepo = AppDataSource.getRepository(Sale);
    const orderRepo = AppDataSource.getRepository(Order);
    const supplierRepo = AppDataSource.getRepository(Supplier);

    // Get existing suppliers
    const suppliers = await supplierRepo.find();
    const mainSupplier = suppliers.find(s => s.name === "Fournisseur Principal") || suppliers[0];

    // Update existing medicines with proper data
    const medicines = await medicineRepo.find();
    
    for (const medicine of medicines) {
      // Update medicines that have zero values
      if (medicine.purchasePrice === 0 || !medicine.purchasePrice) {
        medicine.purchasePrice = parseFloat((Math.random() * 5 + 2).toFixed(2)); // 2-7 EUR
      }
      if (medicine.salePrice === 0 || !medicine.salePrice) {
        medicine.salePrice = parseFloat((Math.random() * 8 + 5).toFixed(2)); // 5-13 EUR
      }
      if (!medicine.totalQuantity) {
        medicine.totalQuantity = 0;
      }
      if (!medicine.minStock) {
        medicine.minStock = 10;
      }
      if (!medicine.category) {
        medicine.category = "Médicament";
      }
      await medicineRepo.save(medicine);
    }

    console.log("✅ Medicine data updated");

    // Create proper batches for medicines
    for (const medicine of medicines) {
      const existingBatches = await batchRepo.find({ where: { medicineId: medicine.id } });
      
      if (existingBatches.length === 0) {
        // Create 1-3 batches per medicine
        const batchCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 1; i <= batchCount; i++) {
          const quantity = Math.floor(Math.random() * 100) + 20; // 20-120 units
          const batch = batchRepo.create({
            medicineId: medicine.id,
            batchNumber: `LOT-${medicine.name.substring(0, 3).toUpperCase()}-${Date.now()}-${i}`,
            quantity: quantity,
            purchasePrice: medicine.purchasePrice,
            sellPrice: medicine.salePrice,
            expiryDate: new Date(Date.now() + (Math.random() * 365 + 180) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            manufacturingDate: new Date(Date.now() - (Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            receivedDate: new Date().toISOString().split('T')[0],
            supplierId: mainSupplier?.id || 1
          });
          
          await batchRepo.save(batch);
          
          // Update medicine total quantity
          medicine.totalQuantity = (medicine.totalQuantity || 0) + quantity;
          await medicineRepo.save(medicine);
        }
        
        console.log(`✅ Created ${batchCount} batches for ${medicine.name}`);
      }
    }

    // Create some sales data
    const medicinesWithStock = medicines.filter(m => m.totalQuantity && m.totalQuantity > 0);
    let createdSales = 0;
    
    if (medicinesWithStock.length > 0) {
      // Create 5-10 sales
      const saleCount = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < saleCount; i++) {
        // Random number of items per sale (1-3)
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items: any[] = [];
        let total = 0;
        
        for (let j = 0; j < itemCount; j++) {
          const medicine = medicinesWithStock[Math.floor(Math.random() * medicinesWithStock.length)];
          const batches = await batchRepo.find({ where: { medicineId: medicine.id } });
          
          if (batches.length > 0) {
            const batch = batches[0];
            const quantity = Math.min(Math.floor(Math.random() * 5) + 1, batch.quantity);
            
            if (quantity > 0 && batch.quantity >= quantity) {
              const itemTotal = quantity * batch.sellPrice;
              items.push({
                medicineId: medicine.id,
                medicineName: medicine.name,
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
              medicine.totalQuantity = (medicine.totalQuantity || 0) - quantity;
              await medicineRepo.save(medicine);
            }
          }
        }
        
        if (items.length > 0) {
          const sale = saleRepo.create({
            saleNumber: `VTE${Date.now()}-${i}`,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            customerName: `Client ${i + 1}`,
            prescriptionId: Math.random() > 0.7 ? `ORDO${Math.floor(Math.random() * 1000)}` : undefined,
            items: items,
            total: total,
            paymentMethod: ['cash', 'card', 'insurance'][Math.floor(Math.random() * 3)],
            status: 'completed'
          });
          
          await saleRepo.save(sale);
          createdSales++;
        }
      }
      
      console.log(`✅ Created ${createdSales} sales`);
    }

    // Create some supplier orders
    const orderCount = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < orderCount; i++) {
      const itemCount = Math.floor(Math.random() * 5) + 2;
      const items: any[] = [];
      let total = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const medicine = medicines[Math.floor(Math.random() * medicines.length)];
        const quantity = Math.floor(Math.random() * 50) + 10;
        const unitPrice = medicine.purchasePrice || 5;
        const itemTotal = quantity * unitPrice;
        
        items.push({
          medicineId: medicine.id,
          medicineName: medicine.name,
          quantity: quantity,
          unitPrice: unitPrice,
          total: itemTotal
        });
        
        total += itemTotal;
      }
      
      const order = orderRepo.create({
        orderNumber: `CMD${Date.now()}-${i}`,
        supplierId: mainSupplier?.id || 1,
        supplierName: mainSupplier?.name || "Fournisseur Principal",
        date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + (Math.random() * 10 + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: ['pending', 'confirmed', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        items: items,
        total: total
      });
      
      await orderRepo.save(order);
    }
    
    console.log(`✅ Created ${orderCount} supplier orders`);

    console.log("\n🎉 Database population completed!");
    console.log("📊 Summary:");
    console.log(`- Medicines updated: ${medicines.length}`);
    console.log(`- Sales created: ${createdSales}`);
    console.log(`- Supplier orders created: ${orderCount}`);
    console.log(`- Suppliers available: ${suppliers.length}`);

  } catch (error) {
    console.error("❌ Error populating data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

populateRealData();