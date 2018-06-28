const DappToken = artifacts.require('./DappToken.sol');

contract('DappToken', (accounts) => {
  it('Set the total supply upon deployment', () => {
    return DappToken.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then((totalSupply) => {
      assert.equal(totalSupply.toNumber(), 100000000, 'Sets the total suplly to 1,000,000')
    })
  });
});