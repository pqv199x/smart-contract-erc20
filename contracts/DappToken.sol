pragma solidity ^0.4.4;

contract DappToken {
  uint256 public totalSupply;

  // Name
  string public name = "Test Token";
  // Symbol
  string public symbol = "TST";
  // Standard
  string public standard = "Test Token v1.0";

  mapping(address => uint256) public balanceOf;
  
  /**
  * Contructor || Read the total number of tokens
  */
  function DappToken (uint256 _initialSupply) public {
    // msg keyword global || sender: the address that call function
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  /**
  * Transfer
  */
}