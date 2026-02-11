const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pharmacy_db'
    });
    
    console.log('🔍 Diagnostic de la base de données...\n');
    
    // Vérifier l'état des tables
    const tables = ['order', 'medicine', 'batch', 'supplier'];
    
    for (const table of tables) {
      try {
        const [autoIncrement] = await connection.execute(
          `SHOW TABLE STATUS LIKE '${table}'`
        );
        
        if (autoIncrement[0]) {
          console.log(`📋 Table ${table}:`);
          console.log(`   Auto_increment: ${autoIncrement[0].Auto_increment}`);
          console.log(`   Rows: ${autoIncrement[0].Rows}`);
          console.log(`   Max value (32-bit): 2147483647`);
          const usage = ((autoIncrement[0].Auto_increment / 2147483647) * 100).toFixed(2);
          console.log(`   Utilisation: ${usage}%`);
          
          if (autoIncrement[0].Auto_increment > 2147483000) {
            console.log('   ⚠️  PROBLÈME: Proche de la limite 32-bit!');
          }
          console.log('');
        }
      } catch (error) {
        console.log(`❌ Erreur pour la table ${table}:`, error.message);
      }
    }
    
    // Vérifier les doublons dans la table order
    console.log('🔍 Vérification des doublons dans la table order...');
    const [duplicates] = await connection.execute(`
      SELECT id, COUNT(*) as count 
      FROM \`order\` 
      GROUP BY id 
      HAVING COUNT(*) > 1
    `);
    
    if (duplicates.length > 0) {
      console.log('❌ Doublons trouvés:');
      duplicates.forEach(dup => {
        console.log(`   ID ${dup.id}: ${dup.count} occurrences`);
      });
    } else {
      console.log('✅ Aucun doublon trouvé dans la table order');
    }
    
    // Vérifier les IDs problématiques
    console.log('\n🔍 Vérification des IDs problématiques...');
    const [problematicIds] = await connection.execute(`
      SELECT id, orderNumber, createdAt 
      FROM \`order\` 
      WHERE id >= 2147483600 
      ORDER BY id DESC
      LIMIT 10
    `);
    
    if (problematicIds.length > 0) {
      console.log('⚠️ IDs proches de la limite:');
      problematicIds.forEach(order => {
        console.log(`   ID: ${order.id}, Commande: ${order.orderNumber}, Date: ${order.createdAt}`);
      });
    } else {
      console.log('✅ Aucun ID problématique trouvé');
    }
    
    // Compter les commandes totales
    console.log('\n📊 Statistiques des commandes:');
    const [orderStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_orders,
        MIN(id) as min_id,
        MAX(id) as max_id,
        COUNT(DISTINCT id) as unique_ids
      FROM \`order\`
    `);
    
    if (orderStats[0]) {
      console.log(`   Total commandes: ${orderStats[0].total_orders}`);
      console.log(`   ID minimum: ${orderStats[0].min_id}`);
      console.log(`   ID maximum: ${orderStats[0].max_id}`);
      console.log(`   IDs uniques: ${orderStats[0].unique_ids}`);
      
      if (orderStats[0].total_orders !== orderStats[0].unique_ids) {
        console.log('   ⚠️  IL Y A DES DOUBLONS!');
      }
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Erreur de diagnostic:', error.message);
    console.log('💡 Essayez avec les identifiants de votre base de données');
  }
})();