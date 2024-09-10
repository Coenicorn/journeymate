CREATE DATABASE journeymate;
USE journeymate;
CREATE TABLE usercredentials (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(254) NOT NULL,
    passwordhash VARCHAR(128) NOT NULL
);
CREATE TABLE userdata (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    location_lat VARCHAR(50) NOT NULL,
    location_long VARCHAR(50) NOT NULL,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE sessiondata (
    token CHAR(36) NOT NULL PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    starttime DATETIME NOT NULL
);