const SHA256 = require('crypto-js/sha256')

class Transaction {
    // transactions always come from someone, go to someone, and carry a certain amount of coinz

    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}

class Block {

// this is where you type out messages to yourself so you know what your code does after you don't look at it for a few days.

// index: tells us where the block sits on the chain
// timestamp: tells us when the block was created
// data: any type of data you want, for example: the details of a transaction
// previousHash: 

constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash(); // calculates hash based on information contained in the block
    this.nonce = 0;
}

calculateHash() {
    return SHA256(this.previousHash + this.timeStamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 1000;
    }

    // we always need a genesis block when a blockchain is created
    createGenesisBlock() {
        return new Block("09/24/2098", "Genesis Block", "0");
    }


    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);

        // clears the pendingTransactions, adds a single blank transaction with no from, the to address, and the mining reward
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // get the balance of the address so we know if it can send stuff, and also check that transactions clear.
    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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

coolCoin.createTransaction(new Transaction('dug', 'doog', 10));
coolCoin.createTransaction(new Transaction('cat', 'kitty', 80));
coolCoin.createTransaction(new Transaction('dug', 'cat', 900));

console.log('\n Starting the miner...');
coolCoin.minePendingTransactions('doog');

console.log('\nBalance of doog is', coolCoin.getBalanceOfAddress('doog'));
coolCoin.minePendingTransactions('kitty');

console.log('\nBalance of doog is', coolCoin.getBalanceOfAddress('doog'));
console.log('\nBalance of kitty is', coolCoin.getBalanceOfAddress('kitty'));

coolCoin.minePendingTransactions('doog');

console.log('\nBalance of doog is', coolCoin.getBalanceOfAddress('doog'));
console.log('\nBalance of kitty is', coolCoin.getBalanceOfAddress('kitty'));





console.log('');
console.log('');


