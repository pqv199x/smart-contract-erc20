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
});