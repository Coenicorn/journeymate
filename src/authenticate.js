const argon2 = require("argon2");
const { executeQuery } = require("./dbconnection.js");
const { hashString } = require("./util.js");
const config = require("./config.js");

/**
 * @description verifies input credentials. All arguments are optional, provided that one or more are defined. All arguments MUST be typeof string
 * @note all arguments must be either typeof string or typeof null
 * @returns 0 on success, error string on failure
 * 
 * 
 * TODO write unit tests
 */
function checkCredentialCorrectFormat(uuid, username, email, password) {
    let returnstatus = "no arguments were provided"; // track if no arguments were provided

    if (uuid !== null) {
        if (typeof(uuid) !== "string") return "typeof uuid must be string";
        if (uuid.length !== config.authUuidLength) return `length of uuid must match ${config.authUuidLength}`;
        empty = 0;
    }
    if (username !== null) {
        if (typeof(username) !== "string") return "typeof username must be string";
        if (username.length > config.authMaxUsernameLength) return "username is too long";
        empty = 0;
    }
    if (email !== null) {
        if (typeof(email) !== "string") return "typeof email must be string";
        if (email.length > config.authMaxEmailLength) return "How did we get here?";
        empty = 0;
    }
    if (password !== null) {
        if (typeof(password) !== "string") return "typeof password must be string";
        if (password.length > config.authMaxPasswordLength) return "password is too long";
        empty = 0;
    }

    return returnstatus;
}

/**
 * @description stores credentials for a user. All arguments are required. All arguments MUST be typeof string
 * @returns 0 on succes, error string on failure
 */
async function storeCredentials(uuid, username, email, password) {
    return new Promise((resolve, reject) => {

        const correctFormat = checkCredentialCorrectFormat(uuid, username, email, password);

        if (correctFormat !== 0) reject(correctFormat);

        //

    });
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