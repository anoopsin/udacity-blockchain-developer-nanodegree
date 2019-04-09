## Build a Private Blockchain Notary Service
Welcome to Project 4: Secure Digital Assets on a Private Blockchain
In this project, you will build a Star Registry Service that allows users to claim ownership of their favorite star in the night sky.

## What will you need to do?
### Create a Blockchain dataset that allow you to store a Star (You should have this done in Projects 2 and 3)
- The application will persist the data (using LevelDB).
- The application will allow users to identify the Star data with the owner.

### Create a Mempool component
- The mempool component will store temporal validation requests for 5 minutes (300 seconds).
- The mempool component will store temporal valid requests for 30 minutes (1800 seconds).
- The mempool component will manage the validation time window.

### Create a REST API that allows users to interact with the application.
- The API will allow users to submit a validation request.
- The API will allow users to validate the request.
- The API will be able to encode and decode the star data.
- The API will allow be able to submit the Star data.
- The API will allow lookup of Stars by hash, wallet address, and height.

## How will these skills help me as a Blockchain Developer?
In Project 1, you worked with the concept of identity in the Blockchain platform, as an example you used Electrum Wallet to manage your identity in the Bitcoin Platform.

In Project 2, you built your first private blockchain. In that project you created what could be the base of any blockchain platform and learned how to use one way (LevelDB) to store the block data.

In Project 3, you built a REST API for your private blockchain that allow your users to interact with your blockchain application.

All this are great achievements in your journey as a Blockchain Developer. Building upon those concepts, in this project, Project 4, you will code an integral part into your blockchain - the Mempool component. Additionally, you'll demonstrate how to store any data in the blockchain by Encoding and Decoding it.

Finally, this project will help you practice how all this components can be integrated to build a more robust blockchain application.

After this project you will be ready to advance your blockchain and creating decentralized applications (DApps) by integrating components such as smart contracts. Let's get started on this project!
