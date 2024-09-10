/**
 * Represents a block in a blockchain.
 */
export class Block {
  /**
   * Creates a new Block instance.
   * @param {string} previousHash - The hash of the previous block.
   * @param {number} timestamp - The timestamp of when the block was created.
   * @param {any} data - The data stored in the block.
   * @param {string} [hash=""] - The hash of the current block.
   */
  constructor(previousHash, timestamp, data, hash = "") {
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
  }
}
