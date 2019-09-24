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
}

calculateHash() {
    return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data)).toString();
}



}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
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
        newBlock.hash = newBlock.calculateHash();
        // newBlock.timestamp = "07/16/1956";

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

coolCoin.addBlock(new Block(1, "07/16/1902", { doggies: 10}));

console.log('Is blockchain valid? ' + coolCoin.isChainValid());

coolCoin.addBlock(new Block(2, "08/17/1903", { kitties: 12}));

coolCoin.chain[1].data = { fishies: 200 };

console.log(JSON.stringify(coolCoin, null, 4));

console.log('Is blockchain valid? ' + coolCoin.isChainValid());
console.log('');
console.log('');


