const mysql = require("mysql2");
const config = require("./config.js");

// connect to database
const pool = mysql.createPool({
    connectionLimit: 100,
    debug: false,
    host: config.databaseHost,
    user: config.databaseUser,
    database: config.databaseName,
    password: config.databasePassword,
    port: config.databasePort
}).promise();

/**
 * @description attempts to fetch database connection
 * @returns database connection object or error string
 */
async function getDatabaseConnection() {
    try {
        return await pool.getConnection();
    } catch(e) {
        throw e; // abort because database cannot be reached for some reason
    }
}

/**
 * @description executes database query
 * @note DOES NOT SANITIZE INPUT
 * @returns result object or error string
 */
async function executeQuery(query) {
    try {
        const connection = await getDatabaseConnection();
        const result = await connection.query(query);

        connection.release();

        return result;
    } catch(e) {
        throw e; // abort because database cannot be reached for some reason
    }
}

function dbEscape(string) {
    return mysql.escape(string);
}

module.exports = { executeQuery, getDatabaseConnection, dbEscape };