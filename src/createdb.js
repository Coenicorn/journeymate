const mysql = require("mysql");

// get environment variables
const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBHOST = process.env.DBSERVERNAME;

// connect to database
const con = mysql.createConnection({
    host: DBHOST,
    user: DBUSER,
    password: DBPASSWORD
});

async function executeQuery(query) {
    return new Promise((resolve, reject) => {
        
    })
}

con.connect(async (err) => {
    if (err) throw err;
    console.log("connected to db");

    con.query("CREATE DATABASE userdata", (err, result) => {
        if (err && err.code!= "ER_DB_CREATE_EXISTS") throw err;
        console.log("database created");
    });
});

module.exports = executeQuery;