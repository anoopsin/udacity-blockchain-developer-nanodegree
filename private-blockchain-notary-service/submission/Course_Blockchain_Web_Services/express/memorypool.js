const bitcoinMessage = require('bitcoinjs-message')

const TimeoutRequestsWindowTime = 5*60*1000

class Memorypool {
	constructor(){
        this.addressToRequestTimeStamp = []
        this.validAddresses = []
	}

    addRequestValidation(address) {
        let self = this

        return new Promise(function(resolve) {
            if (!(address in self.addressToRequestTimeStamp)) {
                self.addressToRequestTimeStamp[address] = Date.now()
            
                setTimeout(
                    function(){
                        delete self.addressToRequestTimeStamp[address]
                    }, TimeoutRequestsWindowTime
                )
            }

            resolve({
                walletAddress: address,
                requestTimeStamp: self.addressToRequestTimeStamp[address].toString(),
                message: self.generateMessage(address),
                validationWindow: self.calculateValidationWindow(address)
            })
        })
    }

    validateRequestByWallet(address, signature) {
        let self = this

        return new Promise(function(resolve, reject) {
            if (!(address in self.addressToRequestTimeStamp)) {
                reject(new Error('Address is absent from memory pool'))
            }

            let message = self.generateMessage(address)
            let isValid = bitcoinMessage.verify(message, address, signature)

            if (!isValid) reject(new Error('Unable to verify signature'))

            let response = {
                registerStar: true,
                status: {
                    address: address,
                    requestTimeStamp: self.addressToRequestTimeStamp[address].toString(),
                    message: self.generateMessage(address),
                    validationWindow: self.calculateValidationWindow(address),
                    messageSignature: true
                }
            }

            self.validAddresses.push(address)
            delete self.addressToRequestTimeStamp[address]
            
            resolve(response)
        })
    }

    verifyAddressRequest(address) {
        return this.validAddresses.indexOf(address) != -1
    }

    calculateValidationWindow(address) {
        let timeElapse = Date.now() - this.addressToRequestTimeStamp[address]

        return (TimeoutRequestsWindowTime - timeElapse).toString().slice(0, -3)
    }

    generateMessage(address) {
        return address + ':' + this.addressToRequestTimeStamp[address] + ':starRegistry'
    }

    removeVerifiedAddress(address) {
        this.validAddresses = this.validAddresses.filter(e => e !== address)
    }
}

module.exports.Memorypool = Memorypool
