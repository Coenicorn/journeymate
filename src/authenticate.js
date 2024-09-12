const argon2 = require("argon2");
const { executeQuery, dbEscape } = require("./db.js");
const { hashPasswordSalt, verifyPasswordSalt, getUsers, sleep, log } = require("./util.js");
const config = require("./config.js");
const uuid = require("uuid");


/**
 * @description starts session for user
 * @returns session object or error string
 */
async function newSession(userUUID) {
    // check if user exists
    const users = await getUsers(null, userUUID, null);
    
    if (users.length !== 1) return "no user matching uuid";

    log(`session token provided to user ${users[0].username}`);

    // generate random session token
    const token = uuid.v4();

    // add session to database
    let query = `INSERT INTO sessiondata (token, uuid, starttime) VALUES (${dbEscape(token)}, ${dbEscape(userUUID)}, NOW())`;
    const result = await executeQuery(query);

    return { token: token };
}

/**
 * @description validates session token
 * @returns 0 on failure, json object on success
 */
async function validateSessionToken(token) {
    if (typeof(token) !== "string") return 0;
    if (token.length !== config.authUuidLength) return 0;


    let query = "SELECT * FROM sessiondata WHERE token = " + dbEscape(token);
    const session = await executeQuery(query);

    if (session[0].length !== 1) return 0;

    return session[0];
}

async function removeExpiredSessions() {
    let query = "DELETE FROM sessiondata WHERE starttime < NOW() - INTERVAL " + dbEscape(config.maxSessionSeconds) + " SECOND";
    const result = await executeQuery(query);
    if (result[0].affectedRows > 0) {
        log(`revoked ${result[0].affectedRows} session tokens`);
    }
}

// periodically reset tokens
(async () => {

    while (1) {

        removeExpiredSessions();

        await sleep(10000);
        
    }

})();


/**
 * @description verifies input credentials. All arguments are optional, provided that one or more are defined. All arguments MUST be typeof string
 * @note all arguments must be either typeof string or typeof null
 * @returns error string or number of defined arguments
 */
function checkCredentialCorrectFormat(uuid, username, email, password) {
    errorstatus = "";
    nDefined = 0;

    if (uuid) {
        if (typeof(uuid) !== "string") errorstatus = "typeof uuid must be string";
        if (uuid.length !== config.authUuidLength) errorstatus = `length of uuid must match ${config.authUuidLength}`;
        nDefined += 1;
    }
    if (username) {
        if (typeof(username) !== "string") errorstatus = "typeof username must be string";
        if (username.length > config.authMaxUsernameLength) errorstatus = "username is too long";
        nDefined += 1;
    }
    if (email) {
        if (typeof(email) !== "string") errorstatus = "typeof email must be string";
        if (email.length > config.authMaxEmailLength) errorstatus = "How did we get here?";
        nDefined += 1;
    }
    if (password) {
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
    if (typeof(formatResult) === "string") return formatResult;

    if (formatResult < 4) return "not enough arguments";

    // get (if any) existing users
    let query = "SELECT * FROM usercredentials WHERE username = " + dbEscape(username);
    let output = (await executeQuery(query))[0];

    if (output.length > 0) return "user already registered";

    // insert new user into database
    const passwordhash = await hashPasswordSalt(password, uuid);

    query = `INSERT INTO usercredentials (uuid, username, email, passwordhash) VALUES (${dbEscape(uuid)}, ${dbEscape(username)}, ${dbEscape(email)}, ${dbEscape(passwordhash)})`;
    output = await executeQuery(query);

    return 0;
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

    if (formatResult !== 2) return "not all input arguments are defined";

    // get existing user, if any
    let query = "SELECT * FROM usercredentials WHERE uuid = " + dbEscape(uuid);
    let user = (await executeQuery(query).catch(err => console.error(err)))[0];

    if (user.length === 0) {
        // no users
        return "no user matching input";
    }

    const match = await verifyPasswordSalt(password, uuid, user[0].passwordhash);

    if (match) {
        // succesful authentication
        return 0;
    } else {
        return "passwords do not match";
    }
}

module.exports = { storeCredentials, updateCredentials, verifyCredentials, newSession, validateSessionToken };