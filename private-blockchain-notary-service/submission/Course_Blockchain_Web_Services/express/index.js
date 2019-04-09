const express = require('express')
const bodyParser = require('body-parser')
const hex2ascii = require('hex2ascii')

const Block = require('../../Course_Blockchain_Data/Project_2_es6_starter_code/Block.js')
const Blockchain = require('../../Course_Blockchain_Data/Project_2_es6_starter_code/BlockChain.js')
const MemoryPool = require('./memorypool.js')

const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

let myBlockChain = new Blockchain.Blockchain();
let memoryPool = new MemoryPool.Memorypool();

app.get('/block/:blockId', (req, res) => {
    try {
        var blockId = sanitizeBlockId(req.params.blockId)
        var blockPromise = myBlockChain.getBlock(blockId)

        return blockPromise
            .then((result) => res.send(appendStoryDecoded(result)))
            .catch((err) => {
                if (err.type == 'NotFoundError') res.sendStatus(404)
            })
    } catch(err) {
        if (err instanceof RangeError) {
            return res.status(400).json({error: err.message})
        }
    }
})

app.post('/requestValidation', (req, res) => {
    if (!req.body.address) {
        return res.status(400).json({error: '\'address\' must be present and be non-empty'})
    }

    return memoryPool.addRequestValidation(req.body.address)
        .then((result) => res.send(result))
})

app.post('/message-signature/validate', (req, res) => {
    if (!req.body.address || !req.body.signature) {
        return res.status(400).json({error: '\'address\' and \'signature\' must be present and be non-empty'})
    }

    return memoryPool.validateRequestByWallet(req.body.address, req.body.signature)
        .then((result) => res.send(result))
        .catch((err) => res.status(400).json({error: err.message}))
})

app.post('/block', (req, res) => {
    if (!req.body.address || !req.body.star) {
        return res.status(400).json({error: '\'address\' and \'star\' must be present and be non-empty'})
    }

    if (!req.body.star.dec || !req.body.star.ra || !req.body.star.story) {
        return res.status(400).json({error: '\'star\' must contain \'dec\', \'ra\' and \'story\''})
    }

    if (Buffer.byteLength(req.body.star.story, 'utf8') > 500) {
        return res.status(400).json({error: '\'star\'\'s\'story\' field\'s length must be less than 500 bytes'})
    }

    let isValid = memoryPool.verifyAddressRequest(req.body.address)

    if (!isValid) {
        return res.status(400).json({error: 'Address has not been validated yet'})
    }

    req.body.star.story = Buffer(req.body.star.story).toString('hex')

    return myBlockChain.addBlock(new Block.Block(req.body))
        .then((result) => {
            memoryPool.removeVerifiedAddress(req.body.address)

            res.send(appendStoryDecoded(JSON.parse(result)))
        })
})

app.get('/stars/hash::hash', (req, res) => {
    try {
        var blockPromise = myBlockChain.getBlockByHash(req.params.hash)

        return blockPromise
            .then((result) => res.send(appendStoryDecoded(JSON.parse(result.value))))
            .catch((err) => res.sendStatus(404))
    } catch(err) {
        if (err instanceof RangeError) {
            return res.status(400).json({error: err.message})
        }
    }
})

app.get('/stars/address::address', (req, res) => {
    try {
        var blockPromise = myBlockChain.getBlocksByWalletAddress(req.params.address)

        return blockPromise
            .then((result) => {
                response = []

                for (var i in result) {
                    response.push(appendStoryDecoded(JSON.parse(result[i].value)))
                }
                
                res.send(response)
            })
            .catch((err) => res.sendStatus(404))
    } catch(err) {
        if (err instanceof RangeError) {
            return res.status(400).json({error: err.message})
        }
    }
})

function appendStoryDecoded(result) {
    if (result && result.body && result.body.star) {
        result.body.star.storyDecoded = hex2ascii(result.body.star.story)
    }

    return result
}

app.listen(port, () => console.log(`Blockchain App listening on port ${port}!`))

/**
 * Sanitizes the user entered block id
 * @param {string} blockId
 * @throws RangeError if the block id is not an integer >= 0
 */
function sanitizeBlockId(blockId) {
    let blockIdInt = parseInt(blockId, 10)

    if (blockId != blockIdInt || blockIdInt < 0) {
        throw new RangeError('blockId must be >= 0')
    }

    return blockIdInt
}
