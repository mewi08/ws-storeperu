const env = require('./env');
const mysql = require('mysql2/promise');
const db = mysql.createPool({
    //toma todas las propiedades configuradas en .env
    ...env.db,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;