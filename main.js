// Imporing a libary that we'll use to calculate our hash
const SHA256 = require('crypto-js/sha256')

// Lets start by defining what a Block on our Blockchain will look like
class Block{
// The constructor will receive the properties of the block,
// Soo each Block will have: 
// index(tells us where the block sits on the chain), 
// timestamp(when the block was create)
// data(this will hold the details of the transaction such as(the sender, the receiver, and the amount received))
// prevHash (contains the hash of the block before this one) this ensures our blockchian is not being tampered with
    constructor(index, timestamp, data, prevHash = ""){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.prevHash = prevHash
        this.hash = this.calculateHash();
    }

    // take the block properties run it through a hash function and get the hash of the block
    calculateHash(){
    // Calculating our Hash using SHA256
        return SHA256(this.index + this.timestamp + this.prevHash + JSON.stringify(this.data)).toString();
    }
} 

// Creating our blockchain where all the valid block will be added chronologically 
class Blockchain{
    // The constructor is responsible for initilizing our Blockchain
    constructor(){
        // This is going to be an array of blocks where all the blocks are added
        this.chain = [this.createGenesisBlock()]
    }

    // Creating our first block called the Genesis block
    createGenesisBlock(){
        return new Block(0, "4:55", "Genesis Block", 0)
    }

    // A function that gets the latest block on the Blockchain
    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    // This method is responsible for Creating adding a block to the chain 
    addBlock(newBlock){
        // Setting the new block previoushash to the previous block hash
        newBlock.prevHash = this.getLatestBlock().hash
        // Calculating the hash of the new block again
        newBlock.hash = newBlock.calculateHash()
        this.chain.push(newBlock)
        // console.log("NewBlock: ", newBlock)
        // console.log("Block", JSON.stringify(Block, null, 2))
    }

    // Verifying if the blockchain has been tampered with
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const prevBlock = this.chain[i - 1]

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.prevHash !== prevBlock.hash){
                return false;
            }

        }

        return true;
    }
}

let myBlockChain = new Blockchain();
myBlockChain.addBlock(new Block(1, "5:20", {amount: 10, sender: "Alice", }))
myBlockChain.addBlock(new Block(2, "5:30", {amount: 20, sender: "Bob"}))

console.log("Is BlockChain Valid? ", myBlockChain.isChainValid())
myBlockChain.chain[1].data = { amount: 20}
myBlockChain.chain[1].hash = myBlockChain.chain[1].calculateHash()
console.log("Is BlockChain Valid? ", myBlockChain.isChainValid())

console.log(JSON.stringify(myBlockChain, null, 1))