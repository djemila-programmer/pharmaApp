// Diagnostic dans le backend
import { AppDataSource } from "./src/config/db";

async function diagnoseDatabase() {
  try {
    console.log('🔍 Diagnostic de la base de données...\n');
    
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données établie\n');
    
    // Vérifier les commandes existantes
    const orderRepo = AppDataSource.getRepository('Order');
    const orders = await orderRepo.find();
    
    console.log(`📋 Nombre total de commandes: ${orders.length}`);
    
    // Vérifier les IDs
    const ids = orders.map(o => o.id).sort((a, b) => a - b);
    console.log(`🔢 IDs trouvés: ${ids.join(', ')}`);
    
    // Vérifier les doublons
    const uniqueIds = [...new Set(ids)];
    if (ids.length !== uniqueIds.length) {
      console.log('❌ DOUBLONS DÉTECTÉS!');
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      console.log(`   IDs dupliqués: ${[...new Set(duplicates)].join(', ')}`);
    } else {
      console.log('✅ Aucun doublon trouvé');
    }
    
    // Vérifier les IDs problématiques
    const problematicIds = ids.filter(id => id >= 2147483600);
    if (problematicIds.length > 0) {
      console.log('⚠️ IDs problématiques détectés:');
      problematicIds.forEach(id => console.log(`   ID: ${id}`));
    }
    
    // Statistiques
    console.log('\n📊 Statistiques:');
    console.log(`   Minimum ID: ${Math.min(...ids)}`);
    console.log(`   Maximum ID: ${Math.max(...ids)}`);
    console.log(`   Écart: ${Math.max(...ids) - Math.min(...ids)}`);
    
    await AppDataSource.destroy();
    
  } catch (error) {
    console.error('❌ Erreur de diagnostic:', error.message);
  }
}

diagnoseDatabase();