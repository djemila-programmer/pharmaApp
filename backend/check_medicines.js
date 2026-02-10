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
    
    const [rows] = await connection.execute('SELECT id, name, dosage FROM medicine');
    console.log('Medicines in database:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Dosage: ${row.dosage}`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();