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

module.exports = { executeQuery };