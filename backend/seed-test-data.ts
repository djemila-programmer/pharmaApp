import { AppDataSource } from "./src/config/db";
import { User } from "./src/entities/User";
import { Medicine } from "./src/entities/Medicine";
import { Batch } from "./src/entities/Batch";
import { Supplier } from "./src/entities/Supplier";
import bcrypt from "bcryptjs";

async function seedTestData() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const userRepo = AppDataSource.getRepository(User);
    const medicineRepo = AppDataSource.getRepository(Medicine);
    const batchRepo = AppDataSource.getRepository(Batch);
    const supplierRepo = AppDataSource.getRepository(Supplier);

    // Create admin user if not exists
    const existingAdmin = await userRepo.findOne({ where: { username: "admin" } });
    if (!existingAdmin) {
      const admin = userRepo.create({
        name: "Administrateur",
        username: "admin",
        email: "admin@pharmacy.com",
        password: await bcrypt.hash("admin@123", 10),
        role: "admin"
      });
      await userRepo.save(admin);
      console.log("✅ Admin user created");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Create supplier if not exists
    const existingSupplier = await supplierRepo.findOne({ where: { name: "Fournisseur Principal" } });
    let supplier;
    if (!existingSupplier) {
      supplier = supplierRepo.create({
        name: "Fournisseur Principal",
        phone: "+33123456789",
        email: "contact@fournisseur.fr",
        address: "123 Rue des Fournisseurs, Paris"
      });
      await supplierRepo.save(supplier);
      console.log("✅ Supplier created");
    } else {
      supplier = existingSupplier;
      console.log("✅ Supplier already exists");
    }

    // Create test medicines if not exist
    const medicinesData = [
      {
        name: "Paracétamol",
        genericName: "Paracétamol",
        dosage: "500mg",
        form: "Comprimé",
        category: "Antalgique",
        minStock: 50
      },
      {
        name: "Amoxicilline",
        genericName: "Amoxicilline",
        dosage: "500mg",
        form: "Gélule",
        category: "Antibiotique",
        minStock: 30
      }
    ];

    for (const medData of medicinesData) {
      const existingMed = await medicineRepo.findOne({ where: { name: medData.name } });
      if (!existingMed) {
        const medicine = medicineRepo.create(medData);
        await medicineRepo.save(medicine);
        console.log(`✅ Medicine ${medData.name} created`);
      } else {
        console.log(`✅ Medicine ${medData.name} already exists`);
      }
    }

    // Get medicines to create batches
    const medicines = await medicineRepo.find();
    
    // Create test batches
    for (const medicine of medicines) {
      const existingBatches = await batchRepo.find({ where: { medicineId: medicine.id } });
      if (existingBatches.length === 0) {
        // Create 2 batches per medicine
        for (let i = 1; i <= 2; i++) {
          const batch = batchRepo.create({
            medicineId: medicine.id,
            batchNumber: `LOT-${medicine.name.substring(0, 3).toUpperCase()}-${Date.now()}-${i}`,
            quantity: Math.floor(Math.random() * 100) + 20, // 20-120 units
            purchasePrice: parseFloat((Math.random() * 5 + 2).toFixed(2)), // 2-7 EUR
            sellPrice: parseFloat((Math.random() * 8 + 5).toFixed(2)), // 5-13 EUR
            expiryDate: new Date(Date.now() + (Math.random() * 365 + 180) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            manufacturingDate: new Date(Date.now() - (Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            receivedDate: new Date().toISOString().split('T')[0],
            supplierId: supplier!.id
          });
          await batchRepo.save(batch);
        }
        console.log(`✅ Created 2 batches for ${medicine.name}`);
      } else {
        console.log(`✅ Batches already exist for ${medicine.name}`);
      }
    }

    console.log("\n🎉 Test data seeding completed!");
    console.log("Login credentials:");
    console.log("- Username: admin");
    console.log("- Password: admin@123");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedTestData();