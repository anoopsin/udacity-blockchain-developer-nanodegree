/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {
    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getBlock(key){
        let self = this;
    
        return new Promise(function(resolve, reject) {
            self.db.get(key)
                .then((result) => resolve(result))
                .catch((err) => reject(err))
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.db.put(key, value)
                .then((result) => resolve(value))
                .catch((err) => reject(err))
        });
    }

    // Method that return the height
    getBlocksCount() {
        let blockCount = 0;
        let self = this;

        return new Promise(function(resolve, reject){
            self.db.createReadStream()
                .on('data', function (data) {
                    blockCount++;
                })
                .on('error', function (err) {
                    reject(err);
                })
                .on('close', function () {
                    resolve(blockCount);
                })
        });
    }

    // Get block by hash
    getBlockByHash(hash) {
        let self = this;
        let block = null;

        return new Promise(function(resolve, reject){
            self.db.createReadStream()
            .on('data', function (data) {
                if(JSON.parse(data.value).hash === hash){
                    block = data;
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                if (block === null) reject(new Error("Unable to find block"));
                else resolve(block);
            });
        });
    }

    // Get blocks by address
    getBlocksByWalletAddress(address) {
        let self = this;
        let blocks = [];

        return new Promise(function(resolve, reject){
            self.db.createReadStream()
            .on('data', function (data) {
                var json = JSON.parse(data.value);

                if(json && json.body && json.body.address == address){
                    blocks.push(data);
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                if (blocks.length == 0) reject(new Error("Unable to find blocks"));
                else resolve(blocks);
            });
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;
