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
    
    const [suppliers] = await connection.execute('SELECT id, name FROM supplier');
    console.log('Suppliers in database:');
    suppliers.forEach(supplier => {
      console.log(`ID: ${supplier.id}, Name: ${supplier.name}`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();