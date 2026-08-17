const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

async function testConnection() {
    try {
        await db.query('SELECT 1');
        console.log('Connected to MySQL!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

testConnection();

module.exports = db;