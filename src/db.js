const mysql = require("mysql2");
const config = require("./config.js");

// connect to database
const pool = mysql.createPool({
    connectionLimit: 100,
    debug: false,
    host: config.databaseHost,
    user: config.databaseUser,
    database: config.databaseName,
    password: config.databasePassword
}).promise();

/**
 * @description executes database query
 * @note DOES NOT SANITIZE INPUT
 */
async function executeQuery(query) {
    const connection = await pool.getConnection();
    const result = await connection.query(query);
    connection.release();
    return result;
}

async function getDatabaseConnection() {
    return await pool.getConnection();
}

function dbEscape(string) {
    return mysql.escape(string);
}

module.exports = { executeQuery, getDatabaseConnection, dbEscape };