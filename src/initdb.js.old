// THIS CODE MAY ONLY BE RUN ONCE
// it just won't do anything the 2nd time

/*

database structure:

table #1:

...
[uuid, username, email, passwordhash]
...

table #2:

...
[uuid, location_lat, location_long]
...

*/

const mysql = require("mysql");

const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBHOST = process.env.DBSERVERNAME;

const con = mysql.createConnection({
    host: DBHOST,
    user: DBUSER,
    password: DBPASSWORD
});

// try and create database
// executeQuery(`CREATE DATABASE ${DBNAME}`).catch(err => {
//     // don't throw error if database creation fails; this is normal
//     // upon program restart if database has already been created
//     if (err) throw err;
// });
con.query(`CREATE DATABASE ${DBNAME}`);

// try and create table for userdata
// line continuation ("\") so that the line is not interpreted with newline characters ("\n")
// executeQuery(`CREATE TABLE userdata (\
// id VARCHAR(36) NOT NULL PRIMARY KEY,\
// name VARCHAR(30) NOT NULL,\
// email VARCHAR(30) NOT NULL,\
// password VARCHAR(50) NOT NULL,\
// location_lat VARCHAR(50) NOT NULL,\
// location_long VARCHAR(50) NOT NULL,\
// reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// )`).catch(err => {
//     if (err) throw err;
// });
con.query(`USE journeymate`);

con.query(`CREATE TABLE userdata (\
id VARCHAR(36) NOT NULL PRIMARY KEY,\
name VARCHAR(30) NOT NULL,\
email VARCHAR(30) NOT NULL,\
passwordhash VARCHAR(50) NOT NULL,\
location_lat VARCHAR(50) NOT NULL,\
location_long VARCHAR(50) NOT NULL,\
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`);