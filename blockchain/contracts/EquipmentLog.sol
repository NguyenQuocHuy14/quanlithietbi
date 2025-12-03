// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract EquipmentLog {
    struct Log {
        string action; // "ADD", "BORROW", "RETURN"
        string deviceName;
        address user;
        uint256 timestamp;
    }

    Log[] public logs;

    event LogCreated(string action, string deviceName, address user, uint256 timestamp);

    function addLog(string memory _action, string memory _deviceName) public {
        logs.push(Log({
            action: _action,
            deviceName: _deviceName,
            user: msg.sender,
            timestamp: block.timestamp
        }));
        emit LogCreated(_action, _deviceName, msg.sender, block.timestamp);
    }

    function getLogs() public view returns (Log[] memory) {
        return logs;
    }
}
