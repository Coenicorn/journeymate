const argon2 = require("argon2");
const { executeQuery, dbEscape } = require("./db.js");
const { hashString, hashPasswordSalt, generateUUID } = require("./util.js");
const config = require("./config.js");

/**
 * @description verifies input credentials. All arguments are optional, provided that one or more are defined. All arguments MUST be typeof string
 * @note all arguments must be either typeof string or typeof null
 * @returns error string or number of defined arguments
 * 
 * 
 * TODO write unit tests
 */
function checkCredentialCorrectFormat(uuid, username, email, password) {
    errorstatus = "";
    nDefined = 0;

    if (uuid !== null) {
        if (typeof(uuid) !== "string") errorstatus = "typeof uuid must be string";
        if (uuid.length !== config.authUuidLength) errorstatus = `length of uuid must match ${config.authUuidLength}`;
        nDefined += 1;
    }
    if (username !== null) {
        if (typeof(username) !== "string") errorstatus = "typeof username must be string";
        if (username.length > config.authMaxUsernameLength) errorstatus = "username is too long";
        nDefined += 1;
    }
    if (email !== null) {
        if (typeof(email) !== "string") errorstatus = "typeof email must be string";
        if (email.length > config.authMaxEmailLength) errorstatus = "How did we get here?";
        nDefined += 1;
    }
    if (password !== null) {
        if (typeof(password) !== "string") errorstatus = "typeof password must be string";
        if (password.length > config.authMaxPasswordLength) errorstatus = "password is too long";
        nDefined += 1;
    }

    if (errorstatus !== "") return errorstatus;
    else if (nDefined === 0) return "No input arguments";
    else return nDefined;
}

/**
 * @description stores credentials for a user. All arguments are required. All arguments MUST be typeof string
 * @returns 0 on succes, error string on failure
 */
async function storeCredentials(uuid, username, email, password) {

    let formatResult = checkCredentialCorrectFormat(uuid, username, email, password);
    if (typeof(formatResult) === "string") throw new Error(formatResult);

    if (formatResult < 4) throw new Error(formatResult);

    // get (if any) existing users
    let query = "SELECT * FROM usercredentials WHERE username = " + dbEscape(username);
    let output = (await executeQuery(query))[0];

    if (output.length > 0) throw new Error("ERROR user already registered");

    // insert new user into database
    const passwordhash = await hashPasswordSalt(password, uuid);

    query = `INSERT INTO usercredentials (uuid, username, email, passwordhash) VALUES (${dbEscape(uuid)}, ${dbEscape(username)}, ${dbEscape(email)}, ${dbEscape(passwordhash)})`;
    output = await executeQuery(query);

    return output;
}

/**
 * @description updates one or more credentials. All arguments are optional, provided that 1 or more are defined
 * @note WARNING!!! variables that WILL NOT be used MUST be null, not the string "null", but the JAVASCRIPT PRIMITIVE null: updateCredentials([some uuid], null, null, "kinkybanana123") changes ONLY the password
 */
async function updateCredentials(uuid, username, email, password) {
    // WIP
}

/**
 * @description verifies a user login. All arguments are required
 * @returns 0 on succes, error string on failure
 */
async function verifyCredentials(uuid, password) {
    const formatResult = checkCredentialCorrectFormat(uuid, null, null, password);
}

async function test() {
    storeCredentials(generateUUID(), "coenicorn", "coenicorn.blauwzee@gmail.com", "lmaocoen");
}

test();

module.exports = { storeCredentials, updateCredentials, verifyCredentials }; 