const DappTokenSale = artifacts.require('./DappTokenSale.sol');
const DappToken = artifacts.require('./DappToken.sol');

contract('DappTokenSale', (accounts) => {
  const admin = accounts[0];
  const buyer = accounts[1];
  let tokensAvailable = 75000000;
  let numberOfTokens;
  let tokenSaleInstance;
  let tokenInstance;

  it('initializes the contract with the correct values', () => {
    return DappTokenSale.deployed().then((instance) => {
      tokenSaleInstance = instance;
      return tokenSaleInstance;
    }).then((address) => {
      assert.notEqual(address, 0x0, 'has the correct contract');
      return tokenSaleInstance.tokenContract();
    }).then((address) => {
      assert.notEqual(address, 0x0, 'has token contract address');
    })
  });

  it('facilitates token buying', function() {
    return DappToken.deployed().then((instance) => {
      // Grab token instance first
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then((saleInstance) => {
      // Then grab token sale instance
      tokenSaleInstance = saleInstance;
      // Provision 75% of all tokens to the token sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
    }).then(function(receipt) {
      // Buying 1000000 number of tokens
      numberOfTokens = 1000000;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens })
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'LogSell', 'should be the LogSell event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      // Try to buy tokens different from the ether value
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
      return tokenSaleInstance.buyTokens(9e+30, { from: buyer, value: numberOfTokens })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than avaialable');
    });
  });

  it('ends tokens sale', () => {
    return DappToken.deployed().then((instance) => {
      tokenInstance = instance;

      return DappTokenSale.deployed();
    }).then((instance) => {
      tokenSaleInstance = instance;

      return tokenSaleInstance.endSale({ from: buyer });
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf('revert') >= 0, 'must be admin to end the sale');
      // End the sale as admin
      return tokenSaleInstance.endSale({ from: admin });
    }).then((receipt) => {
      return tokenInstance.balanceOf(admin);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 1e+26, 'returns all unsold tokens to admin');
      // Check that the contract has no balance
      balance = web3.eth.getBalance(tokenSaleInstance.address)
      assert.equal(balance.toNumber(), 0);
    });
  });
});
