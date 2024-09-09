const argon2 = require("argon2");
const config = require("./config.js");
const uuid = require("uuid");

/**
 * @returns Promise<string> of password hash
 */
async function hashString(inputString) {
    // using argon2 recommended best practices: https://argon2-cffi.readthedocs.io/en/stable/parameters.html
    return argon2.hash(inputString, {
        type: argon2.argon2id,
        parallelism: 4,
        memoryCost: 1024,
    });
}

function generateUUID() {
    // https://en.wikipedia.org/wiki/Universally_unique_identifier --> version 4
    return uuid.v4();
}

module.exports = { hashString };