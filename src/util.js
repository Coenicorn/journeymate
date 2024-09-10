const argon2 = require("argon2");
const config = require("./config.js");
const uuid = require("uuid");

/**
 * @returns Promise<string> of password hash
 */
async function hashString(inputString, salt) {
    // using argon2 recommended best practices: https://argon2-cffi.readthedocs.io/en/stable/parameters.html
    return argon2.hash(inputString);
}

async function hashPasswordSalt(password, salt) {
    const combinedString = `${password} . ${salt}`;

    return hashString(combinedString);
}

async function verifyPasswordSalt(password, salt, passwordhash) {
    const combinedString = `${password} . ${salt}`;

    return argon2.verify(passwordhash, combinedString);
}

function generateUUID() {
    // https://en.wikipedia.org/wiki/Universally_unique_identifier --> version 4
    return uuid.v4();
}

module.exports = { hashString, hashPasswordSalt, generateUUID, verifyPasswordSalt };