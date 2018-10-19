/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

'use strict'
const HDWalletProvider = require('truffle-hdwallet-provider')
const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")
const mnemonic = 'some crazy words'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // connect to local
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: "7545",
    //   network_id: "*" ,// match any network id,
    //   gasPrice: 40000000000
    // },
    tomo: {
      provider: function () {
          // return new HDWalletProvider(mnemonic, 'https://testnet.tomochain.com')
          const wallet = new HDWalletProvider(mnemonic, 'https://testnet.tomochain.com')
          const nonceTracker = new NonceTrackerSubprovider()
          wallet.engine._providers.unshift(nonceTracker)
          nonceTracker.setEngine(wallet.engine)
          return wallet
      },
      network_id: 89,
      gas: 4800000,
      gasPrice: 1 // 1 Gwei
    }
  }
};
