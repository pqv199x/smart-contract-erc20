pragma solidity ^0.4.2;
import './DappToken.sol';

contract DappTokenSale {
  address admin;
  DappToken public tokenContract;
  uint256 public tokensSold;

  // Trigger Events
  event LogSell(address _buyer, uint256 _amount);

  // Constructor
  function DappTokenSale(DappToken _tokenContract) public {
    // Assign an admin
    admin = msg.sender;

    // Assign Token contract
    tokenContract = _tokenContract;
  }

  // multiply
  function multiply(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x);
  }

  // Buy token
  function buyTokens(uint256 _numberOfTokens) public payable {
    // Require value is equal tokens
    require(msg.value == _numberOfTokens);

    // Require contract has enough tokens
    require(tokenContract.balanceOf(this) >= _numberOfTokens);

    // Require that a transfer is succesful
    require(tokenContract.transfer(msg.sender, _numberOfTokens));

    // Keep track of toke Sold
    tokensSold += _numberOfTokens;
    // Trigger Sell Event
    LogSell(msg.sender, _numberOfTokens);
  }

  // Ending Token DappTokenSale
  function endSale() public {
    // Require admin
    require(msg.sender == admin);

    // Transfer remaining tokens to admin
    require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));

    // Transfer the balance to the admin
    admin.transfer(address(this).balance);
  }
}