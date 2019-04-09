## Why this project?
This project introduces you to challenges faced when building out a blockchain storage method. So far, you’ve created a private blockchain that holds data in an array, but storing a blockchain dataset in an array is not only expensive for computer memory but also inefficient for long-term storage.

A core responsibility of blockchain nodes is to validate the blockchain dataset. Hence a more efficient key-value database LevelDB is ideal for such operations. In fact, Bitcoin core uses LevelDB to store block index and UTXO set.

In this project you will learn to validate the blockchain dataset by converting the current validation functions from storing data in a chain array to storing it in LevelDB and leveraging the persistence library LevelDB.

By the end of the project, you will have the skills needed to create your own private blockchain ledger that persists data and validates the blockchain ledger utilizing block hashes.

## Why LevelDB?
On the subject of why LevelDB is used in Bitcoin core, core developer Greg Maxwell stated the following to the bitcoin-dev mailing list in October 2015:

"I think people are falling into a trap of thinking "It's a , I know a for that!"; but the application and needs are very specialized here. . . It just so happens that on the back of the very bitcoin specific cryptographic consensus algorithm there was a slot where a pre-existing high performance key-value store fit; and so we're using one and saving ourselves some effort..."

Greg Maxwell stated the following in the same thread referenced above (in response to a proposal to switch to using SQLite):

"...[D]atabases sometimes have errors which cause them to fail to return records or to return stale data. And if those exist consistency must be maintained; and "fixing" the bug can cause a divergence in consensus state that could open users up to theft. Case in point, prior to LevelDB's use in Bitcoin Core it had a bug that, under rare conditions, could cause it to consistently return not found on records that were really there. . . LevelDB fixed this serious bug in a minor update."

## What You Will Learn
This project will allow you to build and expand upon the concepts and skills you’ve gained throughout this course. With this project you will:

- Differentiate Private Blockchain and Public Blockchain
- Identify the basic components in a Private Blockchain
- Define an application model
- Implement basic functionalities for your Private Blockchain
- Implement a method to persist your Private Blockchain
- Implement your application with Node.js
- Test functionalities of the application
