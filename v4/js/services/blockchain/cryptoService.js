/**
 * Provides cryptographic operations for hashing messages.
 */
export class CryptoService {
  constructor() {}

  /**
   * Hashes the given message using the SHA-256 algorithm.
   * @param {string} message - The message to be hashed.
   * @returns {Promise<string>} The hashed message as a hexadecimal string.
   */
  async digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }
}
