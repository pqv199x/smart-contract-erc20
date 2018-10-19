pragma solidity ^0.4.24;

// ================= Safemath Lib ============================
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  	function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
	}

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  	function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  	function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}
// ================= Safemath Lib end ==============================

contract DappToken {
	using SafeMath for uint256;
    uint256 public totalSupply_;

    string public name = "PQV Token";// Name
    string public symbol = "PQV";// Symbol
    // string public standard = "Test Token v1.0";// Standard
    uint256 public decimals = 18;// Decimals
    uint256 public initialSupply = 100000000 * 10**decimals;// Initiate total supply

    mapping(address => uint256) public balances;

  // Read address A approving address B(C, D..) want to keep track of all address
    mapping(address => mapping(address => uint256)) public allowed;

	/**
  * @dev total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }
  
  /**
  * Contructor || Read the total number of tokens
  */
    constructor() public {
        // totalSupply = initialSupply * 10**uint(decimals);
		totalSupply_ = initialSupply;
          // msg keyword global || sender: the address that call function
        balances[msg.sender] = totalSupply_;
    }
  // function DappToken () public {
        
  // }

  // Triggered when tokens are transfered
    // event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Transfer(address indexed from, address indexed to, uint tokens);

    // event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

  // event

  /**
  * Transfer
  */
    // function transfer(address _to, uint256 _value) public returns (bool success) {
	function transfer(address _to, uint256 _value) public returns (bool) {
        require(balances[msg.sender] >= _value);// Check account have enought token

        // balances[msg.sender] -= _value;// Deducting amount from sending account
		balances[msg.sender] = balances[msg.sender].sub(_value);

        // balances[_to] += _value;// For receiver
		balances[_to] = balances[_to].add(_value);

        // Log transfer event
        emit Transfer(msg.sender, _to, _value);

        // Return boolean
        return true;
    }

    /**
    * Approve
    */
    // function approve(address _spender, uint256 _value) public returns (bool success) {
	function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;// allowed

        emit Approval(msg.sender, _spender, _value);// Log approve event

        return true;
    }

    /**
    * Transfer from
    */
    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
		require(_to != address(0));
        require(_value <= balances[_from]);// Require _from has enough tokens
        require(_value <= allowed[_from][msg.sender]);// Require allowed is big enough
        // balances[_from] -= _value;// Change the balance
		balances[_from] = balances[_from].sub(_value);
        // balances[_to] += _value;
		balances[_to] = balances[_to].add(_value);
        // allowed[_from][msg.sender] -= _value;// Update the allowed
		allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);// Log Transfer event

        return true;
    }
}