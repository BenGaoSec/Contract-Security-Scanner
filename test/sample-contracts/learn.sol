// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DemoCollision {
    VulnerableProxy public proxy;
    LogicV1 public logic;

    constructor() {
        logic = new LogicV1();
        proxy = new VulnerableProxy(address(logic));
    }

    // Helper to call proxy using logic selector
    function callThroughProxy(bytes memory data) internal {
        (bool ok, ) = address(proxy).call(data);
        require(ok, "call failed");
    }

    function testCollision() external {
        // BEFORE: check proxy storage
        // implementation = logic address
        // admin = deployer
        
        // STEP 1: Call proxy -> delegatecall -> Logic.setX(123)
        callThroughProxy(abi.encodeWithSelector(LogicV1.setX.selector, 123));

        // ❗ Effect:
        // Logic executes SSTORE(slot=0, value=123)
        // But slot 0 belongs to proxy -> overwrites proxy.implementation

        address implAfter = proxy.implementation();
        // implAfter is now address(123) (truncated)
        
        // Proxy is now BRICKED because implementation is garbage.

        // STEP 2: Overwrite admin too
        callThroughProxy(abi.encodeWithSelector(LogicV1.setOwner.selector, address(0xBEEF)));

        address adminAfter = proxy.admin();
        // adminAfter == 0x000000000000000000000000000000000000BEEF
    }
}
