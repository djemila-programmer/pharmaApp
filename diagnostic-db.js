require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
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
          console.log(`   Utilisation: ${((autoIncrement[0].Auto_increment / 2147483647) * 100).toFixed(2)}%\n`);
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
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Erreur de diagnostic:', error.message);
  }
})();