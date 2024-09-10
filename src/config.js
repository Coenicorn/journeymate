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

globalConfig.databasePassword = process.env.DBPASSWORD;
globalConfig.databaseName = process.env.DBNAME;
globalConfig.databaseHost = process.env.DBHOST;
globalConfig.databaseUser = process.env.DBUSER;

globalConfig.nsApiKey = process.env.NSAPIKEY;
globalConfig.geoapifyKey = process.env.GEOAPIKEY;
globalConfig.geoapifyEndpoint = process.env.GEOAPIFYENDPOINT;
globalConfig.nsStationsEndpoint = process.env.NSSTATIONSENDPOINT;

globalConfig.authUuidLength = 36;
globalConfig.authMaxUsernameLength = 30;
globalConfig.authMaxEmailLength = 254;
globalConfig.authMaxPasswordLength = 128;

globalConfig.maxSessionMinutes = 1

module.exports = globalConfig;