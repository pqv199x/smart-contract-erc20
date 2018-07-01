# smart-contract-erc20

### Run test from terminal
#### Check token's information
##### Run this command to enter truffle development command
```sh
truffle console
```
##### Prerequisites
```sh
DappToken.deployed().then(function(instance) {tokenInstance = instance});
```
```sh
tokenInstance.name(); // to check name of token
tokenInstance.symbol(); // to check symbol of token
```
Check total supply
```sh
tokenInstance.totalSupply().then(function(s) {supply = s});
supply.toNumber();
```
##### Transfer token
```sh
admin = web3.eth.accounts[0]
receiver = web3.eth.accounts[1];
tokenInstance.transfer(receiver, 100, { from: admin });
/* Then check balance of receiver and admin accounts */
tokenInstance.balanceOf(receiver); // plus 100 tokens
tokenInstance.balanceOf(admin); // deducts 100 tokens
```
##### Approval
```sh
fromAccount = web3.eth.accounts[2]
toAccount = web3.eth.accounts[3]
spendingAccount = web3.eth.accounts[4]
tokenInstance.transfer(fromAccount, 100, {from: web3.eth.accounts[0]});
/* Set approve allowance amount */
tokenIsntance.approve(spendingAccount, 18, {from: fromAccount});
/* transfer from fromAccount to toAccount under the owner spendingAccount */
tokenInstance.transferFrom(fromAccount, toAccount, 18, {from: spendingAccount});
/* Check the balance*/
tokenInstance.balanceOf(fromAccount); // plus 10 tokens
tokenInstance.balanceOf(toAccount); // deducts 10 tokens
tokenInstance.allowance(fromAccount, spendingAccount) // equals 0
```