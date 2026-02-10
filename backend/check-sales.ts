import { AppDataSource } from "./src/config/db";
import { Sale } from "./src/entities/Sale";

async function checkSales() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const saleRepo = AppDataSource.getRepository(Sale);
    const sales = await saleRepo.find();
    
    console.log(`📊 Found ${sales.length} sales in database:`);
    sales.forEach((sale, index) => {
      console.log(`${index + 1}. Sale #${sale.saleNumber}`);
      console.log(`   Date: ${sale.date}`);
      console.log(`   Customer: ${sale.customerName || 'N/A'}`);
      console.log(`   Total: ${sale.total} F CFA`);
      console.log(`   Items: ${sale.items?.length || 0}`);
      console.log(`   Status: ${sale.status}`);
      console.log('---');
    });

    if (sales.length === 0) {
      console.log("⚠️  No sales found in database");
    }

  } catch (error) {
    console.error("❌ Error checking sales:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkSales();