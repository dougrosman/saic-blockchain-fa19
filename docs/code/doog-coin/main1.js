const SHA256 = require('crypto-js/sha256')

class Block {
    // CONSTRUCTOR ARGUMENTS
        // index: optional, tells us where the block sits on the chain
        // timestamp: tells us when the block was created
        // data: any type of data you want to associate with this block. In the case of a currency, you might want to store the details of the transaction in here, such as: how much money was transferred, who was the sender, receiver.
        // previousHash: a string that contains the hash of the block before this one. This is very important, and insures the integrity of our blockchain
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        //step 1 this.hash = ''; // contains the hash of the current block, so we need to wait to calculate it. Empty for now.
        // step 2
        this.hash = this.calculateHash(); // calculates hash based on information about the block.
        // a nonce value used for guessing/calculating hashes
        this.nonce = 0; // PART II
    }

    // new function/method. Calculates a new hash value by taking the properties of the current block, runs them through the hash function, and then returns the hash. This will identify our block on the blockchain. Uses SHA-256
    calculateHash() {
        // return SHA256(this.index + this.previous + this.timestamp + JSON.stringify(this.data)).toString();

        // PART II: with a nonce;
        return SHA256(this.index + this.previous + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // mine a new block based on difficulty
    mineBlock(difficulty) {
        // loop keeps running until we find a hash with enough 0s. This is a trick to make a string of 0s that is exactly the length of difficulty
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            // this will keep calculating the same hash because the data in our block never changes. we need some number to change in order to get new hashes.
            this.hash = this.calculateHash();
            console.log(this.nonce);
        }
        console.log("Block mined: " + this.hash);
    }
} // end Block class

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // PART II
    }

    // a method/function that exists specifically to create the genesis block. First block on the blockchain is called the "Genesis Block" which is added manually.
    createGenesisBlock(){
        // the genesis block doesn't have a previous hash, so we can put whatever data we want inside of that field. "0" is fine.
        return new Block(0, "09/24/2019", "Genesis block", "0");
    }

    // returns the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // adds a new block onto the chain
    // addBlock(newBlock) {
    //     // 1. set the previous hash of the new block to the hash of the last block on the chain.
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // 2. Once we get a block, we need to recalculate its hash. Anytime any properites within a block are changed, we need to change its hash function.
    //     newBlock.hash = newBlock.calculateHash();
    //     // 3. push the new block onto the chain
    //     this.chain.push(newBlock);

    //     // NOTE: in reality, you can't add a new block so easily, because there are numerous checks in place. But it's enough for our purposes. It demonstrates how a blockchain actually works.
    // }

    // PART II: addBlock with mining
    addBlock(newBlock)
    {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock);
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

console.log('Mining block 1...'); // PART II

// add some blocks with some "transaction" data. This can be whatever
doogCoin.addBlock(new Block(1, "09/24/2019", { doggies: 4 }));

console.log('Mining block 2...'); // PART II
doogCoin.addBlock(new Block(2, "09/24/2219", { kitties: 400 }));





/* UNCOMMENT FOR PART 1 */
// // log 2
// // true
// console.log('Is blockchain valid? ' + doogCoin.isChainValid());

// // manually override data in a block. This immediately fails because of the first check in isChainValid, where we check the validity of the hash.
// doogCoin.chain[1].data = { amount: 300};
// // after manually overriding data, recalculate the hash based on the new new data. This passes the first check, but not the second, because the relationship with the previous block is broken.
// doogCoin.chain[1].hash = doogCoin.chain[1].calculateHash();

// // false
// console.log('Is blockchain valid? ' + doogCoin.isChainValid());


// let's see what our blockchain looks like!
// log 1
// console.log(JSON.stringify(doogCoin, null, 4));


// The blockchain is made to add blocks, but to never delete or change a block. But if you detect a bad block in your chain, there should be a mechanism to roll back the bad block and puts it back in the correct chain.

// so far, this basic implementation is pretty straightforward, and easy for the computer to compute. So anyone could add blocks to this quickly and spam. You can also change the contents of a block, and recalculate the hashes for all the following blocks on the chain, making it a valid chain, even though its been tampered with. So let's add Proof-of-Work!

// With Bitcoin, Proof-of-Work tries to find a hash with a certain number of 0s in front, and since you can't influence the hash function, you have to keep guessing...This is called the 'difficulty'

// The aim is to create a new block every 10 minutes. Difficulty increases over time as computers get faster.



