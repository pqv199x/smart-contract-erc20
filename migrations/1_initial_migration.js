var Migrations = artifacts.require("./Migrations.sol");

const DappToken = artifacts.require("./DappToken.sol");
const DappTokenSale = artifacts.require("./DappTokenSale.sol");
module.exports = function(deployer) {
  deployer.deploy(Migrations)
  // .then(() => Migrations.deployed())
  // .then(migrations => new Promise(resolve => setTimeout(() => resolve(migrations), 60000)))
  // .then(migrations => deployer.deploy(DappToken))
  // .then(() => DappToken.deployed())
  // .then(dappToken => new Promise(resolve => setTimeout(() => resolve(dappToken), 60000)))
  // .then(dappToken => deployer.deploy(DappTokenSale, DappTokenSale.address))



  //   .then(() => {
  //   setTimeout(() => {}, 2000);
  //   deployer.deploy(DappToken).then(() => {
  //     setTimeout(() => {}, 2000);
  //     return deployer.deploy(DappTokenSale, DappToken.address);
  //   });
  // });
};

// module.exports = function(deployer) {
//   deployer.deploy(DappToken).then(() => {
//     return deployer.deploy(DappTokenSale, DappToken.address);
//   });
// };