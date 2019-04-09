/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {
    constructor() {
        this.db = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have two options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        let self = this;

        return new Promise(function(resolve, reject) {
            self.addBlock(new Block.Block('First block in the chain - Genesis block'))
                .then((result) => resolve(result))
                .catch((err) => reject(err))
        });
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        let self = this;
    
        return new Promise(function(resolve, reject) {
            self.db.getBlocksCount()
                .then((result) => resolve(result - 1))
                .catch((err) => reject(err))
        });
    }

    // Add new block
    addBlock(block) {
        let self = this;
        
        var previousBlockPromise = new Promise(function(resolve, reject) {
            self.getBlockHeight()
                .then((result) => {
                    if (result >= 0) {
                        self.getBlock(result).then((result) => {
                            resolve(result);
                        })
                    } else resolve(undefined);
                })
            });

            return new Promise(function(resolve, reject) {
                previousBlockPromise
                    .then((result) => {
                        let isGenesisBlock = result === undefined;
                        
                        // Block height
                        block.height = isGenesisBlock ? 0 : result.height + 1;

                        // UTC timestamp
                        block.time = new Date().getTime().toString().slice(0,-3);

                        if (!isGenesisBlock) {
                            // previous block hash
                            block.previousBlockHash = result.hash;
                        }

                        // Block hash with SHA256 using newBlock and converting to a string
                        block.hash = SHA256(JSON.stringify(block)).toString();

                        if (isGenesisBlock) {
                            console.log(JSON.stringify(block).toString());
                        }

                        // Adding block object to chain
                        self.db.addLevelDBData(block.height, JSON.stringify(block).toString())
                            .then((result) => resolve(result))
                    })
                    .catch((err) => reject(err))
                });
    }

    // Get Block By Height
    getBlock(height) {
        let self = this;
        
        return new Promise(function(resolve, reject) {
            self.db.getBlock(height)
                // return object as a single string
                .then((result) => resolve(JSON.parse(result)))
                .catch((err) => reject(err))
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        let self = this;

        return new Promise(function(resolve) {
            // get block object
            self.getBlock(height)
                .then((result) => {
                    // get block hash
                    let blockHash = result.hash;

                    // remove block hash to test block integrity
                    result.hash = '';

                    // generate block hash
                    let validBlockHash = SHA256(JSON.stringify(result)).toString();

                    // Compare
                    resolve(blockHash === validBlockHash);
                });
        });
    }

    // Validate Blockchain
    validateChain() {
        let promises = [];

        let self = this;

        return new Promise(function(resolve, reject) {
            self.getBlockHeight()
                .then((result) => {
                    for (let height = 0; height <= result; height++) {
                        promises.push(self.validateBlock(height), self.validateHashLink(height));
                    }

                    return Promise.all(promises).then((result) => {
                        resolve(result.filter(x => x !== true));
                    })
                }).catch((err) => reject(err))      
        });
    }

    // Validate Hash link
    validateHashLink(height) {
        let self = this;

        return new Promise(function(resolve, reject) {
            if (height < 1) resolve(true);

            self.getBlock(height)
                .then((block) => {
                    self.getBlock(height - 1)
                        .then((previousBlock) => {
                            resolve(block.previousBlockHash === previousBlock.hash);
                        }).catch((err) => reject(err))
                }).catch((err) => reject(err))
        });
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.db.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
}

module.exports.Blockchain = Blockchain;
