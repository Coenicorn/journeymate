const mysql = require("mysql");

// get environment variables
const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBHOST = process.env.DBSERVERNAME;

// connect to database
const pool = mysql.createPool({
    connectionLimit: 100,
    debug: true,
    host: DBHOST,
    user: DBUSER,
    password: DBPASSWORD
});

// async helper function for that sweet sweet async/await refactoring
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

executeQuery("CREATE DATABASE userdata").catch((err) => {
    // don't throw error if database creation fails; this is normal
    // upon program restart if database has already been created
    if (err.code != "ER_DB_CREATE_EXISTS") throw err;
});

module.exports = executeQuery;