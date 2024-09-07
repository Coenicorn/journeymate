const argon2 = require("argon2");

module.exports = {};

function passSaltFormat(pass, salt) {
    return `${pass} . ${salt}`;
}

/**
 * @returns password + salt hash
 */
module.exports.hashPasswordWithSalt = async (password, salt) => {
    return new Promise((resolve, reject) => {
        argon2.hash(passSaltFormat(password, salt))
            .catch(reason => reject(reason))
            .then(result => resolve(result));
    });
}

/**
 * @returns returns 1 when user SUCCESFULLY verifies
 */
module.exports.verifyPasswordWithSalt = async (hash, password, salt) => {
    return new Promise((resolve, reject) => {
        argon2.verify(hash, passSaltFormat(password, salt))
            .catch(reason => reject(reason))
            .then(result => resolve(result))
    });
}