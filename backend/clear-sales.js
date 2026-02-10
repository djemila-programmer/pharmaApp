const mysql = require('mysql2/promise');

async function clearSalesData() {
  let connection;
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pharmacydb'
    });
    
    console.log('✅ Connected to database');
    
    // Clear sales table
    const [result] = await connection.execute('DELETE FROM sale');
    console.log(`🗑️  Cleared ${result.affectedRows} sales records`);
    
    // Reset auto increment
    await connection.execute('ALTER TABLE sale AUTO_INCREMENT = 1');
    console.log('🔢 Reset auto increment');
    
    console.log('🎉 Sales table cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

clearSalesData();