// Polyfill global crypto for Node 18 environments (Mongoose 9 / BSON 7 compatibility)
const nodeCrypto = require('crypto');
if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.randomUUID) {
  try {
    globalThis.crypto = nodeCrypto.webcrypto || nodeCrypto;
  } catch (e) {
    globalThis.crypto = nodeCrypto;
  }
}
if (typeof global.crypto === 'undefined') {
  global.crypto = globalThis.crypto;
}

// Root entrypoint for Hostinger / Phusion Passenger / LiteSpeed
const app = require('./Backend/server.js');
module.exports = app;
