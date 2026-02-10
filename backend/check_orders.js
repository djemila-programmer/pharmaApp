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
    
    const [orders] = await connection.execute(`
      SELECT id, status, orderNumber, supplierId 
      FROM \`order\` 
      ORDER BY id
    `);
    
    console.log('Toutes les commandes:');
    console.log('ID\tStatus\t\tOrder Number\tSupplier ID');
    console.log('----------------------------------------');
    orders.forEach(order => {
      console.log(`${order.id}\t${order.status}\t\t${order.orderNumber}\t\t${order.supplierId}`);
    });
    
    // Compter les commandes par statut
    const statusCounts = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    console.log('\nRépartition par statut:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`Status ${status}: ${count} commandes`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();