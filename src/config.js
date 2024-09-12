/*

ALL CONFIGURATION MUST GO THROUGH THIS FILE TO PROMOTE APPLICATION STRUCTURE
This file also doubles as .env definitions, which must be implemented in a .env
Also I got tired of .env lack of intellisense, so this is easier

USAGE:

const config = require("./config") <--- path relative to current file

// example
authenticate(config.databasePassword);

*/


const dotenv = require("@dotenvx/dotenvx").config();

const globalConfig = {};

globalConfig.debug = true;

globalConfig.databasePassword = process.env.DBPASSWORD;
globalConfig.databaseName = process.env.DBNAME;
globalConfig.databaseHost = process.env.DBHOST;
globalConfig.databaseUser = process.env.DBUSER;
globalConfig.databasePort = process.env.DBPORT;

globalConfig.geoApiKey = process.env.GEOAPIKEY;
globalConfig.nsApiKey = process.env.NSAPIKEY;
globalConfig.geoapifyEndpoint = "https://api.geoapify.com/v1/geocode/search?text={search}&apiKey=" + process.env.GEOAPIKEY;
globalConfig.nsStationsEndpoint = "https://gateway.apiportal.ns.nl/nsapp-stations/v2/nearest?lat={lat}&lng={lng}&includeNonPlannableStations=false";
globalConfig.nsReisInfoEndpoint = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?fromStation={fromStation}&toStation={toStation}&dateTime={dateTime}&searchForArrival=true&addChangeTime=5";

globalConfig.authUuidLength = 36;
globalConfig.authMaxUsernameLength = 30;
globalConfig.authMaxEmailLength = 254;
globalConfig.authMaxPasswordLength = 128;

globalConfig.maxSessionSeconds = 300;

module.exports = globalConfig;