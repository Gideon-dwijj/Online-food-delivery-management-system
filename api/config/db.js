const mysql = require('mysql2/promise');
require('dotenv').config();

// Log database configuration (without sensitive data)
console.log('\nDatabase Configuration Check:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST,  // From .env file
    user: process.env.DB_USER,  // From .env file
    password: process.env.DB_PASSWORD, // From .env file
    database: process.env.DB_NAME,  // From .env file
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Successfully connected to the database');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

console.log('✅ MySQL pool created (promise-based)');

module.exports = pool;
