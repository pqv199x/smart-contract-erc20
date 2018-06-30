const DappToken = artifacts.require('./DappToken.sol');

contract('DappToken', (accounts) => {
  let tokenInstance;

  it('initializes the contract with the correct values', () => {
    return DappToken.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then((name) => {
      assert.equal(name, 'Test Token', 'has the correct name');
      return tokenInstance.symbol();
    }).then((symbol) => {
      assert.equal(symbol, 'TST', 'has the correct Symbol');
      return tokenInstance.standard();
    }).then((standard) => {
      assert.equal(standard, 'Test Token v1.0', 'has the correct standard');
    });
  });

  it('allocates the initial supply upon deployment', () => {
    return DappToken.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then((totalSupply) => {
      assert.equal(totalSupply.toNumber(), 100000000, 'Sets the total suplly to 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then((adminBalance) => {
      assert.equal(adminBalance.toNumber(), 100000000, 'allocate the initial supply to the admin account');
    })
  });

  it('transfer token ownership', () => {
    return DappToken.deployed().then((instance) => {
      tokenInstance = instance;
      // function call DID NOT actually create the transaction
      return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
      return tokenInstance.transfer.call(accounts[1], 10000000, { from: accounts[0] });
    }).then((success) => {
      assert.equal(success, true, 'it returns true');
      // without call() => ACTUALLY create the transaction
      return tokenInstance.transfer(accounts[1], 10000000, { from: accounts[0] });
    }).then((receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be Transfer event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the transfering account');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the receiving account');
      assert.equal(receipt.logs[0].args._value, 10000000, 'logs the transfering amount');
      return tokenInstance.balanceOf(accounts[1]);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 10000000, 'adds the amount to the receiving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 90000000, 'deducts the amount from the sending account');
    });
  });
});