const crypto = require('crypto');
/**
 * This is being used to generate secret keys for acces token and refresh token
 * In future if you feel in any miss use of your application you can generate new keys
 * and set up in the env file
 */
const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');
console.table({key1,key2})
