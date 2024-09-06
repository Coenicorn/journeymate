// THIS CODE MAY ONLY BE RUN ONCE
// it just won't do anything the 2nd time

const mysql = require("mysql");

const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBHOST = process.env.DBSERVERNAME;

const con = mysql.createConnection({
  host: DBHOST,
  user: DBUSER,
  password: DBPASSWORD,
});

// try and create database and needed table
con.query(`CREATE DATABASE ${DBNAME}`, () =>
  con.query(`USE journeymate`, () =>
    con.query(`CREATE TABLE userdata (\
    id VARCHAR(36) NOT NULL PRIMARY KEY,\
    name VARCHAR(30) NOT NULL,\
    email VARCHAR(30) NOT NULL,\
    password VARCHAR(50) NOT NULL,\
    location_lat VARCHAR(50) NOT NULL,\
    location_long VARCHAR(50) NOT NULL,\
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
  )
);