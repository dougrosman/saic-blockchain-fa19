const SHA256 = require('crypto-js/sha256')

// #04. Create a Transaction class
class Transaction {
    // transaction always come from someone, goes to someone, and carries a certain amount of coins
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    // CONSTRUCTOR ARGUMENTS
        // 1. change data to 'transactions'. this will get an array of transactions.
        // 2. remove index. We don't set this, it is determined by its position in the array
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); // calculates hash based on information about the block.
        this.nonce = 0; // PART II
    }

    // new function/method. Calculates a new hash value by taking the properties of the current block, runs them through the hash function, and then returns the hash. This will identify our block on the blockchain. Uses SHA-256
    calculateHash() {
        // return SHA256(this.index + this.previous + this.timestamp + JSON.stringify(this.data)).toString();

        // PART II: with a nonce;
        return SHA256(this.index + this.previous + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    // mine a new block based on difficulty
    mineBlock(difficulty) {
        // loop keeps running until we find a hash with enough 0s. This is a trick to make a string of 0s that is exactly the length of difficulty
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            // this will keep calculating the same hash because the data in our block never changes. we need some number to change in order to get new hashes.
            this.hash = this.calculateHash();
            // console.log(this.nonce);
        }
        console.log("Block mined: " + this.hash);
    }
} // end Block class

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // PART II
        this.pendingTransactions = []; // PART III
        this.miningReward = 100; // PART III
    }

    // a method/function that exists specifically to create the genesis block. First block on the blockchain is called the "Genesis Block" which is added manually.
    createGenesisBlock(){
        // remove index argument
        return new Block("09/24/2019", "Genesis block", "0");
    }

    // returns the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }


    // Delete addBlock
    
    // mine the pending transactions
    minePendingTransactions(miningRewardAddress) {
        // whoever successfully mines the reward will pass their wallet address into this function here.

        // note, in the real world, we wouldn't add ALL pending transactions, because block size can't surpass 1MB
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log('Block successfylly mined!');
        this.chain.push(block);
        // clears the pendingTransactions, adds a single blank transaction with no from address, the to-address, and the mining reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    // creates a new transaction
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // gets the balance of a given address by looping through all transactions inside of all blocks.
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

    // checks the validity of the blockchain
    // blockchains are great because once a block is added, it cannot be changed without invalidating the rest of the chain. But in this implementation, there is no way for us to verify to integrity of our blockchain.
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            // grab the current block
            const currentBlock = this.chain[i];
            // grab the previous bock
            const previousBlock = this.chain[i-1];
            // we can now check if these blocks are properly linked together

            // verify the current hash by asking it to recalculate the current hash
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false; // our chain is invalid; the hash of the block doesn't match up with its properties
            }
            // next, check if our block points to a correct previous block.
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false; // if this is the case, we know the chain is invalid, because our current block does not point to the previous block. It points to something else that might not exist.
            }
        }
        return true; // if it's looped through all our blocks and returns true, then it must be valid.
    }
    

} // end Blockchain class

/* NOW LET'S TEST IT! */

// create a blockchain object
let doogCoin = new Blockchain();

// in reality, 'address1' and 'address2' would be the public key of somebody's wallet
doogCoin.createTransaction(new Transaction('address1', 'doog-address', 10));
doogCoin.createTransaction(new Transaction('address2', 'address1', 5));

console.log('\n Starting the miner...');
doogCoin.minePendingTransactions('doog-address');

console.log('\nBalance of doog is', doogCoin.getBalanceOfAddress('doog-address'));

console.log('\n Starting the miner...');
doogCoin.minePendingTransactions('doog-address');

console.log('\nBalance of doog is', doogCoin.getBalanceOfAddress('doog-address'));

console.log('\n Starting the miner...');
doogCoin.minePendingTransactions('doog-address');

console.log('\nBalance of doog is', doogCoin.getBalanceOfAddress('doog-address'));


