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
      assert.equal(receipt.logs[0].event, 'LogTransfer', 'should be LogTransfer event');
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

  it('approve tokens for delegated transfer', () => {
    return DappToken.deployed().then((instance) => {
      tokenInstance = instance;
      // function call DID NOT actually run approve()
      return tokenInstance.approve.call(accounts[1], 10000000);
    }).then((success) => {
      assert.equal(success, true, 'it returns true');
      return tokenInstance.approve(accounts[1], 10000000, { from: accounts[0] });
    }).then((receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'LogApproval', 'should be LogApproval event');
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
      assert.equal(receipt.logs[0].args._value, 10000000, 'logs the transfering amount');
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then((allownace) => {
      assert.equal(allownace.toNumber(), 10000000, 'stores the allowance for delegated transfer');
    });
  });

  it('handle delegated transfer', () => {
    return DappToken.deployed().then((instance) => {
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      // Transfer some tokens to fromAccount
      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then((receipt) => {
      // Approve spendingAccount to spend 10000000 tokens from fromAccount
      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then((receipt) => {
      // Transfer some tokens that larger than sender's balance
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
      // Try transfering somthing larger than approved amount
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });      
    }).then((success) => {
      assert.equal(success, true, 'it returns true');
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });      
    }).then((receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'LogTransfer', 'should be LogTransfer event');
      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transfered from');
      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transfered to');
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfering amount');
      return tokenInstance.balanceOf(fromAccount);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 90, 'deducts the amount from sending amount');
      return tokenInstance.balanceOf(toAccount);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then((allowance) => {
      assert.equal(allowance, 0, 'deducts from the allowance');
    });
  });
});