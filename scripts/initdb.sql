CREATE DATABASE journeymate;
USE journeymate;
CREATE TABLE usercredentials (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    passwordhash VARCHAR()
);
CREATE TABLE userdata (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    location_lat VARCHAR(50) NOT NULL,
    location_long VARCHAR(50) NOT NULL,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);