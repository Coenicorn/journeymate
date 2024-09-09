const argon2 = require("argon2");
const { executeQuery } = require("./dbconnection.js");

/**
 * @description stores credentials for a user. All parameters are required.
 * @returns 0 on succes, error string on failure
 */
function storeCredentials(uuid, username, email, password) {
    
}

/**
 * @description updates one or more credentials. All arguments are optional, provided that 1 or more ARE defined
 * @note WARNING!!! variables that WILL NOT be used MUST be null, not the string "null", but the JAVASCRIPT PRIMITIVE null: updateCredentials([some uuid], null, null, "kinkybanana123") changes ONLY the password
 */
function updateCredentials(uuid, username, email, password) {

}

/**
 * @description verifies a user login. All parameters are required.
 * @returns 0 on succes, error string on failure
 */
function verifyCredentials(uuid, password) {
    
}