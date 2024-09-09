const argon2 = require("argon2");
const { executeQuery } = require("./dbconnection.js");
const { hashString } = require("./util.js");

/**
 * @description verifies input credentials. All arguments are optional, provided that one or more are defined. All arguments MUST be typeof string
 * @note all arguments must be either typeof string or typeof null
 */
function verifyCredentials(uuid, username, email, password) {
    if (uuid !== null) {
        
    }
}

/**
 * @description stores credentials for a user. All arguments are required. All arguments MUST be typeof string
 * @returns 0 on succes, error string on failure
 */
function storeCredentials(uuid, username, email, password) {
    if (typeof(uuid) !== "string") return "uuid must be a string";
    if (typeof(username) !== "string") return "username must be a string";
    if (typeof(email) !== "string") return "email must be a string";
    if (typeof(password) !== "string") return "password must be a string";
}

/**
 * @description updates one or more credentials. All arguments are optional, provided that 1 or more are defined
 * @note WARNING!!! variables that WILL NOT be used MUST be null, not the string "null", but the JAVASCRIPT PRIMITIVE null: updateCredentials([some uuid], null, null, "kinkybanana123") changes ONLY the password
 */
function updateCredentials(uuid, username, email, password) {

}

/**
 * @description verifies a user login. All arguments are required
 * @returns 0 on succes, error string on failure
 */
function verifyCredentials(uuid, password) {
    
}