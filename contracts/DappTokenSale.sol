pragma solidity ^0.4.2;
import './DappToken.sol';

contract DappTokenSale {
  address admin;
  DappToken public tokenContract;
  uint256 public tokensSold;

  // Start selling date, TYPE: timestamp
  uint256 public startDate = 1529254800; // June 18, 2018 12:00:00 AM GMT+07:00

  // End selling date, TYPE: timestamp
  uint256 public endDate = 1530291600; // June 30, 2018 12:00:00 AM GMT+07:00

  // Minimum acceptable purchase amount
  uint256 public minAmount = 0.1 ether; // 0.1 ETH

  // Maximum acceptable purchase amount
  uint256 public maxAmount = 10 ether;  // 10 ETH

  // Validate buying date
  modifier whenSaleIsActive() {
    assert(isSellingDate());
    _;
  }

  // Trigger Events
  event LogSell(address _buyer, uint256 _amount);

  // Constructor
  function DappTokenSale(DappToken _tokenContract) public {
    // Assign an admin
    admin = msg.sender;

    // Assign Token contract
    tokenContract = _tokenContract;
  }

  /**
  * Validate buying date
  */
  function isSellingDate() constant  returns (bool) {
    return (
      now >= startDate &&
      now <= endDate
    );
  }

  /**
  * Set endDate again in order to test
  */
  function newEndDate(uint256 _endDate) public {
    endDate = _endDate;
  }

  // multiply
  function multiply(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x);
  }

  // Buy token
  function buyTokens(uint256 _numberOfTokens) public payable whenSaleIsActive {
    // Require value is equal tokens
    require(msg.value == _numberOfTokens);

    // Require contract has enough tokens
    require(tokenContract.balanceOf(this) >= _numberOfTokens);

    // Require minimum acceptable purchase amount
    require(_numberOfTokens >= minAmount);

    // Require maximum acceptable purchase amount
    require(_numberOfTokens <= maxAmount);


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