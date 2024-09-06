// THIS CODE MAY ONLY BE RUN ONCE
// it just won't do anything the 2nd time

const executeQuery = require("./dbconnection.js");

const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBHOST = process.env.DBSERVERNAME;

// try and create database
executeQuery(`CREATE DATABASE ${DBNAME}`).catch(err => {
    // don't throw error if database creation fails; this is normal
    // upon program restart if database has already been created
    if (err.code !== "ER_DB_CREATE_EXISTS") throw err;
    else console.log(err);
});

// try and create table for userdata
// line continuation ("\") so that the line is not interpreted with newline characters ("\n")
executeQuery(`CREATE TABLE userdata (\
id VARCHAR(36) NOT NULL PRIMARY KEY,\
name VARCHAR(30) NOT NULL,\
email VARCHAR(30) NOT NULL,\
password VARCHAR(50) NOT NULL,\
location_lat VARCHAR(50) NOT NULL,\
location_long VARCHAR(50) NOT NULL,\
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    
)`).catch(err => {
    if (err.code !== "ER_TABLE_EXISTS_ERROR") throw err;
    else console.log(err);
});