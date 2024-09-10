const argon2 = require("argon2");
const config = require("./config.js");
const uuid = require("uuid");
const { dbEscape, executeQuery } = require("./db.js");

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

/**
 * @description gets users from database based on one or more parameters
 * @note only one paramater at a time
 */
async function getUsers(username, uuid, email) {
    let query = "SELECT * FROM usercredentials";

    if (username) query += " WHERE username = " + dbEscape(username);
    if (uuid) query += " WHERE uuid = " + dbEscape(uuid);
    if (email) query += " WHERE email = " + dbEscape(email);
    
    const results = await executeQuery(query);
    return results;
}

async function sleep(ms) {
    return new Promise((res, rej) => setTimeout(res, ms));
}

module.exports = { hashString, hashPasswordSalt, generateUUID, verifyPasswordSalt, getUsers, sleep };