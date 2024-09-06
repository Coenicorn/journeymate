const mysql = require("mysql");

// get environment variables
const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBHOST = process.env.DBSERVERNAME;

// connect to database
const pool = mysql.createPool({
    connectionLimit: 100,
    debug: false,
    host: DBHOST,
    user: DBUSER,
    database: DBNAME,
    password: DBPASSWORD
});

// async helper function for that sweet sweet async/await refactoring
/*

Voor Lucas en evt anderen die dit lezen:

- https://www.w3schools.com/js/js_promise.asp

*/
async function executeQuery(query) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) reject(err);
            else if (con)
                con.query(query, (err, result)=>{
                    if (err) reject(err);
                    else resolve(result);
                });
            else reject("No connection");
        });
    });
}

// try and create database
executeQuery(`CREATE DATABASE ${DBNAME}`).catch(err => {
    // don't throw error if database creation fails; this is normal
    // upon program restart if database has already been created
    if (err.code !== "ER_DB_CREATE_EXISTS") throw err;
});

// try and create table for userdata
// line continuation ("\") so that the line is not interpreted with newline characters ("\n")
executeQuery(`CREATE TABLE userdata (\
id VARCHAR(36) NOT NULL PRIMARY KEY,\
firstname VARCHAR(30) NOT NULL,\
lastname VARCHAR(30) NOT NULL,\
email VARCHAR(50) NOT NULL,\
password VARCHAR(50) NOT NULL,\
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    
)`).catch(err => {
    if (err.code !== "ER_TABLE_EXISTS_ERROR") throw err;
});

module.exports = executeQuery;