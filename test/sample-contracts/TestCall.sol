// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestCall {
    function bad(address target, bytes calldata data) external {
        // This should be flagged by Solidity Guardian
        target.call(data);
    }
}
