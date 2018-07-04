const DappToken = artifacts.require("./DappToken.sol");
const DappTokenSale = artifacts.require("./DappTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(DappToken).then(() => {
    return deployer.deploy(DappTokenSale, DappToken.address);
  });
};
