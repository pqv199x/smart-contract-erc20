pragma solidity ^0.4.2;

contract DappToken {
  uint256 public totalSupply;

  // Name
  string public name = "Test Token";
  // Symbol
  string public symbol = "TST";
  // Standard
  string public standard = "Test Token v1.0";

  mapping(address => uint256) public balanceOf;

  // Read address A approving address B(C, D..) want to keep track of all address
  mapping(address => mapping(address => uint256)) public allowance;
  
  /**
  * Contructor || Read the total number of tokens
  */
  function DappToken (uint256 _initialSupply) public {
    // msg keyword global || sender: the address that call function
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  // Triggered when tokens are transfered
  event LogTransfer(address indexed _from, address indexed _to, uint256 _value);

  event LogApproval(address indexed _owner, address indexed _spender, uint256 _value);

  // event

  /**
  * Transfer
  */
  function transfer(address _to, uint256 _value) public returns (bool success) {
    // Check account have enought token
    require(balanceOf[msg.sender] >= _value);

    // Deducting amount from sending account
    balanceOf[msg.sender] -= _value;

    // For receiver
    balanceOf[_to] += _value;

    // Log transfer event
    LogTransfer(msg.sender, _to, _value);

    // Return boolean
    return true;
  }

  /**
  * Approve
  */
  function approve(address _spender, uint256 _value) public returns (bool success) {
    // Allowance
    allowance[msg.sender][_spender] = _value;

    // Log approve event
    LogApproval(msg.sender, _spender, _value);

    return true;
  }

  /**
  * Transfer from
  */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    // Require _from has enough tokens
    require(_value <= balanceOf[_from]);
    // Require allowance is big enough
    require(_value <= allowance[_from][msg.sender]);
    // Change the balance
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    // Update the allowance
    allowance[_from][msg.sender] -= _value;
    // Log Transfer event
    LogTransfer(_from, _to, _value);

    return true;
  }
}