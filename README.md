# A sample smart contract using ERC-20 standard

This smart contract was build following the guideline from [video](https://www.youtube.com/watch?v=XdKv5uwEk5A&t=20732s)

## Development inprogess
- Developing UI using Metamask

## What is the smart contract?
The definition from [wikipedia](https://en.wikipedia.org/wiki/Smart_contract): A smart contract is a computer protocol intended to digitally facilitate, verify, or enforce the negotiation or performance of a contract. Smart contracts allow the performance of credible transactions without third parties.

## What is ERC-20 standard?
The definition from [wikipedia](https://en.wikipedia.org/wiki/ERC20): ERC20 is a technical standard used for smart contracts on the Ethereum blockchain for implementing tokens. ERC stands for Ethereum Request for Comment, and 20 is the number that was assigned to this request.

## The information of token

Token Name: Test Token

Token Symbol: TST

Total Supply: 100000000

Decimals: 18

Start selling date: 18/06/2018 Using [this](https://www.epochconverter.com/) to convert time

End selling date: 30/06/2018 Using [this](https://www.epochconverter.com/) to convert time

Maximum purchase amount: 10 ETH

Minimum purchase amount: 0.1 ETH

## Requirements:

This project requires:

- [Node 8.*](https://nodejs.org/en/)
- [Truffle framework](https://truffleframework.com/)
- [Ganache](https://truffleframework.com/ganache)

## Run test from terminal

### Prerequire

Install and run Ganache

- Run unit test

```
truffle test
```

### Test with command lines via truffle development

```
truffle console
```

- Deploy DappToken

```
DappToken.deployed().then(function(instance) {tokenInstance = instance});
```

#### Check token's information

- Check name of token
```
tokenInstance.name();
```

- Check symbol of token

```
tokenInstance.symbol();
```

- Check total supply

```
tokenInstance.totalSupply().then(function(s) {supply = s});
supply.toNumber();
```

#### Transfer token

```
admin = web3.eth.accounts[0]
receiver = web3.eth.accounts[1];
tokenInstance.transfer(receiver, 100, { from: admin });
```

- Check the balance of receiver and admin accounts

```
tokenInstance.balanceOf(receiver); // plus 100 tokens to receiver account
tokenInstance.balanceOf(admin); // deducts 100 tokens from admin account
```

#### Approval

```
fromAccount = web3.eth.accounts[2]
toAccount = web3.eth.accounts[3]
spendingAccount = web3.eth.accounts[4]
tokenInstance.transfer(fromAccount, 100, {from: web3.eth.accounts[0]});
```

- Set approve allowance amount

```
tokenIsntance.approve(spendingAccount, 18, {from: fromAccount});
```
- Transfer from fromAccount to toAccount under the owner spendingAccount

```
tokenInstance.transferFrom(fromAccount, toAccount, 18, {from: spendingAccount});
```

- Check the balance

```
tokenInstance.balanceOf(fromAccount); // plus 10 tokens
tokenInstance.balanceOf(toAccount); // deducts 10 tokens
tokenInstance.allowance(fromAccount, spendingAccount) // equals 0
```