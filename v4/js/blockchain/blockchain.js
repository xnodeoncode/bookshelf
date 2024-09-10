import { Block } from "./block.js";
import { CryptoService } from "../services/cryptoService.js";

/**
 * Represents a blockchain.
 * @class
 */
export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.CryptoService = new CryptoService();
  }

  /**
   * Creates the genesis block of the blockchain.
   * @returns {Block} The genesis block.
   */
  createGenesisBlock() {
    //create a new block
    let block = new Block("0", new Date.now(), "Genesis block", "0");

    //override the default hash with the hash of the block
    block.hash = this.CryptoService.digestMessage(
      block.timestamp + block.previousHash + JSON.stringify(block.data)
    );

    return block;
  }

  /**
   * Returns the latest block in the blockchain.
   *
   * @returns {Object} The latest block in the blockchain.
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Adds a new block to the blockchain.
   * @param {Block} newBlock - The new block to be added.
   */
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = this.CryptoService.digestMessage(
      newBlock.timestamp + newBlock.previousHash + JSON.stringify(newBlock.data)
    );
    this.chain.push(newBlock);
  }

  /**
   * Checks if the blockchain is valid by verifying the integrity of each block.
   * @returns {boolean} True if the blockchain is valid, false otherwise.
   */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}
