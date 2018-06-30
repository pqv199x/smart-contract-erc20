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

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  /**
  * Transfer
  */
  function transfer(address _to, uint256 _value) public returns(bool success) {
    // Check account have enought token
    require(balanceOf[msg.sender] >= _value);

    // Deducting amount from sending account
    balanceOf[msg.sender] -= _value;

    // For receiver
    balanceOf[_to] += _value;

    // Transfer event
    Transfer(msg.sender, _to, _value);

    // Return boolean
    return true;
  }
}