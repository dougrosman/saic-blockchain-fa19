const SHA256 = require('crypto-js/sha256')

class Block {

// this is where you type out messages to yourself so you know what your code does after you don't look at it for a few days.

// index: tells us where the block sits on the chain
// timestamp: tells us when the block was created
// data: any type of data you want, for example: the details of a transaction
// previousHash: 

constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash(); // calculates hash based on information contained in the block
    this.nonce = 0;
}

calculateHash() {
    return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
}

mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
    {
        this.nonce++;
        this.hash = this.calculateHash();
        console.log("nonce: " + this.nonce);
    }
    console.log("Block mined: " + this.hash);

}



}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    // we always need a genesis block when a blockchain is created
    createGenesisBlock() {
        return new Block(0, "09/24/2098", "Genesis Block", "0");
    }


    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);

        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            // grab the current block
            const currentBlock = this.chain[i];

            // grab the previous block
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

}

/* main function */

// call the constructor to create a new blockchain
let coolCoin = new Blockchain();

console.log('Mining block 1...');

coolCoin.addBlock(new Block(1, "08/17/2009", { horses: 14}));

console.log('Mining block 2...');
coolCoin.addBlock(new Block(2, "08/17/2009", { pigeons: 28}));



console.log('');
console.log('');


