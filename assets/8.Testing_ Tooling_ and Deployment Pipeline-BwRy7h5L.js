import{r as f,j as e}from"./index-RYRiz1iP.js";const g={title:"Testing, Tooling, and Deployment Pipeline",abstract:"A comprehensive guide to professional-grade smart contract testing, deployment rigor, and reliable Web3 client interactions. This module bridges local development to mainnet safety through deterministic test strategies, environment hygiene, on-chain event design, and operational excellence.",learningObjectives:["Design and implement multi-layer test strategies (unit, integration, system tests) for smart contracts","Practice test organization, fixtures, coverage analysis, and identify coverage limits","Understand mock vs fork tradeoffs and apply fuzz/property-based and invariant testing","Apply deployment safety: scripts, verification, versioning, upgrade patterns, and runbooks","Design event schemas for reliability; handle reorgs, finality, and exactly-once semantics in client code","Execute a reproducible testnet deployment with CI automation and smoke testing"],prerequisites:"Modules 1–5: Solidity fundamentals, contract design patterns, security patterns, and Ethereum architecture.",keyTerms:["Unit test vs integration test vs system test","Test fixture and deterministic test data","Code coverage and coverage limitations","Mock vs mainnet fork","Fuzz testing / property-based testing","Invariant testing","CI/CD mindset","Flaky test","Deployment script and artifact","Contract verification and explorer","Secrets hygiene and key rotation","Smoke test and rollback","Event schema and indexed topics","Event-driven vs call-driven reads","Reorg and finality","Idempotency and nonce management","Exactly-once semantics"]},u=[{id:"intro",title:"1. Introduction: Why Testing and Deployment Matter",content:`Smart contracts are immutable, permissionless, and handle real value. A single bug can lock funds forever. 
Unlike traditional software, deploying to mainnet is irreversible. This module teaches how to minimize risk through rigor.

Three principles underpin this chapter:
• Repeatability: Every build, test, and deployment must be reproducible.
• Auditability: Every deployment step must be logged and reviewable.
• Defensive design: Assume networks fail, keys leak, and timelines slip.`,quiz:[{type:"conceptual",question:"Why is replicating a production deployment manually for each release dangerous?",options:["It is not dangerous; manual work is always reliable.","Human error compounds with each step; implicit knowledge is lost; rollback becomes unclear.","Because Foundry is faster.","Because test coverage is irrelevant in production."],correct:1,explanation:"Manual deployment introduces human-in-the-loop error, knowledge silos, and inconsistent state. The next engineer who deploys will not know what the first one did."}]},{id:"part1",title:"2. Professional Workflow and Test Strategy",subsections:[{id:"2.1",title:"2.1 The Test Pyramid",content:`Tests are organized in layers, from fast and numerous (unit) to slow and few (system):

BASE (Unit Tests):
    • Test a single function or contract method in isolation.
    • Use mocks for external calls (oracles, other contracts).
    • Run in milliseconds; no blockchain needed.
    • Goal: catch logic errors early and cheap.

MIDDLE (Integration Tests):
    • Test two or more contracts interacting.
    • Use a local blockchain (Anvil, Ganache).
    • Cover the happy path and common error cases.
    • Goal: verify glue logic and state transitions.

TOP (System / E2E Tests):
    • Test the whole system: contracts + client + indexer.
    • Use testnet or mainnet fork.
    • Cover deployment, upgrades, and user flows.
    • Goal: catch integration surprises.

A typical ratio is 70% unit, 20% integration, 10% system.

KEY TAKEAWAY: The pyramid inverts risk: most tests should run fast locally; fewest tests should hit the blockchain.`,quiz:[{type:"multiselect",question:"Which of the following are typical characteristics of unit tests?",options:["A. Interact with a mainnet fork","B. Run in milliseconds","C. Test a single function with mocks","D. Can be run without a blockchain","E. Require real testnet funds"],correct:[1,2,3],explanation:"Unit tests are fast, isolated, and use mocks. They do not require a blockchain or testnet funds. They catch errors early."}]},{id:"2.2",title:"2.2 Test Organization: Files, Fixtures, and Determinism",content:`A well-organized test suite is easy to extend and debug:

STRUCTURE:
    test/
        unit/
            Counter.t.sol
            ERC20.t.sol
        integration/
            CounterWithOracle.t.sol
        system/
            EndToEndDeploy.t.sol

FIXTURES (Deterministic Setup):
    Fixtures are reusable, repeatable initial states. Instead of creating fresh users, contracts, and data for each test, define a fixture once.

Example (Foundry/Solidity):
    contract CounterTest is Test {
        Counter counter;
        address alice = address(0x1111);
        address bob = address(0x2222);

        function setUp() public {
            counter = new Counter(42);
            vm.deal(alice, 10 ether);
            vm.deal(bob, 10 ether);
        }

        function testIncrement() public {
            vm.prank(alice);
            counter.increment();
            assertEq(counter.value(), 43);
        }
    }

DETERMINISM:
    Every test must produce the same result on every run. Avoid:
    • Current block.timestamp (use vm.warp instead).
    • Random number generators (seed with a fixed value).
    • Forking without specifying the block number.

COMMON PITFALL: Sharing mutable state across tests (e.g., a global counter incremented by setUp).
This causes test order dependency: test A passes alone but fails when test B runs first.

KEY TAKEAWAY: Write setUp() with a single, self-contained fixture. Never mutate it across tests.`},{id:"2.3",title:"2.3 Coverage: Metric and Limitation",content:`Code coverage is a useful metric but not a guarantee of correctness.

TYPES OF COVERAGE:
    • Line coverage: was this line executed?
    • Branch coverage: were both true and false branches taken?
    • Function coverage: was this function called?

LIMITATIONS:
    1. You can achieve 100% line coverage and still miss logic errors.
         Example: a test calls f(x) and checks the return; it covers the line but not x < 0.
    
    2. Coverage does not test interactions.
         Two functions may be covered in isolation but fail when called together.
    
    3. Coverage does not test invariants or properties.
         A loop may be covered but not tested with n=0, n=1, n=large.

PRACTICE:
    • Aim for 80%+ coverage on critical paths (e.g., token transfers, fund locking).
    • Aim for 60%+ on utilities and error handlers.
    • For any uncovered line, ask: "Is this dead code, or is it a gap?"
    
COMMON PITFALL: Chasing 100% coverage. It is a vanity metric. Focus on testing the behaviors that matter.

KEY TAKEAWAY: Use coverage as a guide, not a goal. Pair it with threat modeling and property testing.`,quiz:[{type:"shortanswer",question:"You have 100% line coverage on a contract. What might you still be missing?",sampleAnswer:"Logic errors in edge cases, contract interactions, invariants, reentry, and authorization failures. Coverage does not test reasoning.",explanation:"Coverage measures execution, not correctness. A test can call a function and assign the result without checking it."}]},{id:"2.4",title:"2.4 Mock vs Fork: A Detailed Tradeoff",content:`When testing a contract that calls an oracle or other protocol, should you mock the external contract or fork the real network?

MOCKING (Fake Implementation):
    Pros:
        • Fast and deterministic.
        • You control the oracle's behavior (return any value).
        • No testnet funds or RPC calls needed.
    Cons:
        • You test against a fiction, not reality.
        • If the oracle interface changes or returns unexpected data, your test still passes.
        • Does not catch bugs in your integration assumptions.

Example (Foundry):
    interface IOracle {
        function latestPrice() external view returns (uint256);
    }

    contract MockOracle is IOracle {
        uint256 _price = 100e18;
        
        function latestPrice() external view returns (uint256) {
            return _price;
        }
        
        function setPrice(uint256 p) external {
            _price = p;
        }
    }

FORKING (Real Network):
    Pros:
        • You test against the actual oracle contract.
        • Catches interface changes and real failure modes.
        • Builds confidence for mainnet deployment.
    Cons:
        • Slower (requires RPC calls).
        • Dependent on external network state (the oracle must exist).
        • Flaky if the RPC is slow or the state changes.

STRATEGY:
    1. Write unit tests with mocks: fast feedback loop.
    2. Write integration tests with mocks: test your contract logic.
    3. Write system tests with a fork: validate real-world assumptions.
    4. Test against the real testnet sparingly (only before mainnet).

KEY TAKEAWAY: Mocks catch logic bugs fast; forks catch integration bugs late. Use both.`},{id:"2.5",title:"2.5 Fuzz and Property-Based Testing",content:`Fuzzing generates random inputs to find edge cases your brain did not think of.

UNIT FUZZ (Foundry):
    contract CounterTest is Test {
        Counter counter;

        function setUp() public {
            counter = new Counter(0);
        }

        // Foundry will call this with random uint256 values
        function testFuzz_IncrementDoesNotOverflow(uint256 delta) public {
            vm.assume(delta < type(uint256).max);
            uint256 before = counter.value();
            counter.increment(delta);
            uint256 after = counter.value();
            assert(after >= before); // monotonic
        }
    }

PROPERTY-BASED TESTING:
    Rather than testing a specific input/output, define a property that must always hold:
    • Transfers preserve total supply.
    • Balances never go negative.
    • \`value()\` is always >= 0 and <= 10^18.

INVARIANT TESTING:
    An invariant is a condition that should be true before, after, and between every function call.
    
    Example: In a lending pool, the sum of borrows must never exceed the sum of deposits.
    
    invariant_borrowsLessThanDeposits() public {
        assert(totalBorrows <= totalDeposits);
    }

LIMITATIONS:
    • Fuzzing needs a seed and bound; it is not exhaustive.
    • Invariants must be stated explicitly; a missing invariant is undetected.
    • Fuzzing can be slow for complex contracts.

COMMON PITFALL: Writing fuzz tests that assume initial preconditions without documenting them.
Example: a fuzz test for division that assumes the divisor is nonzero but does not use vm.assume().

KEY TAKEAWAY: Start fuzzing after unit tests pass. Use invariants for critical system properties.`},{id:"2.6",title:"2.6 Mainnet-Fork Testing and CI Mindset",content:`A mainnet fork lets you test against real contracts and state without risking mainnet.

FOUNDRY EXAMPLE:
    # Test against Ethereum mainnet at a fixed block
    forge test --fork-url https://eth.llamarpc.com --fork-block-number 18000000

    In tests, use vm.startPrank(realAddress) and interact with real contracts:
    
    IERC20 usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    
    function testUSDCTransfer() public {
        assertEq(usdc.balanceOf(alice), 0);
        vm.prank(usdcWhale); // impersonate a real holder
        usdc.transfer(alice, 1e6);
        assertEq(usdc.balanceOf(alice), 1e6);
    }

CI/CD MINDSET:
    Continuous Integration means tests run automatically on every commit.
    
    Typical workflow:
        1. Developer commits and pushes to a branch.
        2. GitHub Actions (or similar) triggers test suite.
        3. All tests (unit, integration, fork) run in parallel.
        4. Coverage report is generated.
        5. Results block merge if any test fails.
    
    Example .github/workflows/test.yml:
        name: Tests
        on: [push, pull_request]
        jobs:
            test:
                runs-on: ubuntu-latest
                steps:
                    - uses: actions/checkout@v3
                    - uses: foundry-rs/foundry-toolchain@v1
                    - run: forge test
                    - run: forge coverage

FLAKY TESTS:
    A flaky test passes sometimes and fails sometimes, usually due to:
    • Non-deterministic ordering (test A affects test B).
    • Timeouts or slow RPC calls.
    • Off-by-one block numbers.
    • Reliance on external state (an oracle returning different values).
    
    Detection: Run the test suite 10 times; if any run fails, it is flaky.
    
    Root causes:
        • setUp() mutating a shared variable.
        • Hardcoded block.timestamp or block.number.
        • Assuming the RPC is fast.

COMMON PITFALL: Disabling a flaky test instead of fixing it.
The bug it hides will surface in production.

KEY TAKEAWAY: CI automates feedback; flaky tests compromise that feedback. Invest in making tests deterministic.`,quiz:[{type:"conceptual",question:"You have a test that sometimes passes and sometimes fails depending on the order tests run. How should you fix it?",options:["A. Disable it with @skip or skip() and add a TODO.","B. Increase the timeout.","C. Identify shared mutable state and isolate it in setUp().","D. Run it only on Monday."],correct:2,explanation:"Flaky tests are almost always caused by shared state or non-determinism in setUp. Isolate each test."}]}],postSectionQuiz:[{type:"multiselect",question:"Which statements about test organization are correct?",options:["A. Unit tests should use mocks and run in milliseconds.","B. Integration tests should never fork the network.","C. The test pyramid has most tests at the base (unit) and fewest at the top (system).","D. 100% code coverage guarantees no bugs.","E. Invariant testing checks properties that should always hold."],correct:[0,2,4],explanation:"A, C, E are correct. B is false (integration tests can use forks for slower tests). D is false (coverage is a metric, not a guarantee)."}]},{id:"part2",title:"3. Deployment Rigor and Chain Safety",subsections:[{id:"3.1",title:"3.1 Deployment Scripts and Artifacts",content:`A deployment script is code that creates contracts, initializes state, and records the result.

FOUNDRY DEPLOYMENT SCRIPT:
    // script/Deploy.s.sol
    pragma solidity ^0.8.0;

    contract DeployCounter is Script {
        function run() external {
            uint256 deployerKey = vm.envUint("PRIVATE_KEY");
            vm.startBroadcast(deployerKey);
            
            Counter counter = new Counter(42);
            
            vm.stopBroadcast();
        }
    }

    Run with:
        PRIVATE_KEY=0x... forge script script/Deploy.s.sol --rpc-url <RPC> --broadcast

ARTIFACTS:
    After deployment, record:
        • Contract address.
        • Block number and timestamp.
        • Bytecode hash (verify integrity).
        • Constructor arguments.
        • ABI and source code (for verification).
    
    Store in a JSON file:
        {
            "Counter": {
                "address": "0x1234...",
                "block": 18000000,
                "timestamp": 1700000000,
                "txHash": "0x5678...",
                "constructorArgs": [42]
            }
        }

HARDHAT EQUIVALENT:
    // scripts/deploy.js
    async function main() {
        const Counter = await ethers.getContractFactory("Counter");
        const counter = await Counter.deploy(42);
        await counter.deployed();

        console.log("Counter deployed to:", counter.address);
        
        // Save artifacts
        const artifacts = {
            Counter: {
                address: counter.address,
                block: await ethers.provider.getBlockNumber(),
            }
        };
        fs.writeFileSync(
            path.join(__dirname, "../deployments.json"),
            JSON.stringify(artifacts, null, 2)
        );
    }

    npx hardhat run scripts/deploy.js --network sepolia

KEY TAKEAWAY: A deployment script should be idempotent (safe to re-run) and emit machine-readable artifacts.`},{id:"3.2",title:"3.2 Secrets Hygiene and Key Management",content:`Never hardcode private keys or RPC secrets in code.

ANTI-PATTERNS:
    // BAD: hardcoded key
    const pk = "0x123456...";
    
    // BAD: in .env and committed to git
    PRIVATE_KEY=0x123456...

PATTERNS:
    1. Environment variables (CI/CD):
         PRIVATE_KEY and ETHERSCAN_API_KEY are injected by GitHub Secrets.
         Never print them in logs.
    
    2. Key management services:
         AWS KMS, Azure Key Vault, AWS Secrets Manager.
         Deployment scripts request the key at runtime; it never sits on disk.
    
    3. Hardware wallets:
         Ledger Live, Trezor, MetaMask.
         Deploy using a hardware wallet and confirm on device.

CHECKLIST:
    [ ] Private keys never appear in code, git history, or logs.
    [ ] RPC endpoints with auth (rate limits, access control) use .env.local (gitignore).
    [ ] CI/CD injects secrets as masked variables.
    [ ] Key rotation is automated (e.g., monthly).
    [ ] Access to production keys is audit-logged.
    [ ] Testnet keys are rotated weekly.

COMMON PITFALL: Cycling a deployed key through multiple machines or developers.
Once a key is touched by a human or CI job, assume it is compromised and rotate it immediately.

KEY TAKEAWAY: Treat keys like active bombs. The fewer hands they touch, the safer you are.`},{id:"3.3",title:"3.3 Contract Verification on Block Explorers",content:`Contract verification proves that the bytecode on-chain matches the published source code.

WHY VERIFY?
    • Users can inspect contract logic.
    • Wallets display readable ABIs and warnings.
    • Auditors can verify the on-chain code matches their audit.

ETHERSCAN VERIFICATION (FOUNDRY):
    1. Deploy with save-deployment-info flag:
         forge script Deploy.s.sol --broadcast --verify              --etherscan-api-key <KEY>              --rpc-url <RPC>

    2. Or, verify manually after deployment:
         forge verify-contract 0x1234... Counter:             --constructor-args $(cast abi-encode "constructor(uint256)" 42)              --etherscan-api-key <KEY>

HARDHAT VERIFICATION:
    1. Configure hardhat.config.js:
         etherscan: {
             apiKey: process.env.ETHERSCAN_API_KEY,
         }

    2. Verify:
         npx hardhat verify --network sepolia 0x1234... 42

VERIFICATION WITH PROXY PATTERNS:
    For upgradeable contracts, verify both the proxy and the implementation:
    1. Verify the implementation contract.
    2. Tell Etherscan the proxy address points to implementation.
    3. Etherscan will read proxy logs and confirm.

ISSUES WITH VERIFICATION:
    • Compiler version mismatch (deployed with 0.8.19, verified with 0.8.20).
    • Constructor arguments encoding mismatch.
    • Optimizer enabled/disabled flag difference.

COMMON PITFALL: Forgetting to verify a contract until 6 months later.
By then, the compiler and ABI have changed, and verification fails mysteriously.

KEY TAKEAWAY: Verify immediately after deployment, before leaving the chain. Automate verification in your deploy script.`,quiz:[{type:"conceptual",question:"Why should you verify a contract immediately after deployment rather than later?",options:["A. Verification is faster if done immediately.","B. Compiler versions, ABI encoding, and optimizer flags may change; verification will fail.","C. Etherscan has rate limits.","D. There is no difference; you can verify anytime."],correct:1,explanation:"Later, the compiler version, dependencies, and optimizer settings may change. Verification metadata relies on exact reproducibility."}]},{id:"3.4",title:"3.4 Versioning, Artifacts, and Reproducible Builds",content:`A reproducible build means anyone can rebuild the exact bytecode without trust.

VERSIONING DISCIPLINE:
    • Contract source code: In git with a semantic tag (v1.0.0, v1.0.1).
    • Build artifacts (ABI, bytecode, deployment addresses): In git or a pinned artifact repository.
    • Deployment metadata: Block number, timestamp, constructor arguments. Immutable once deployed.

FILE STRUCTURE:
    repo/
        src/
            Counter.sol          (v1.0.0)
        test/
            Counter.t.sol
        script/
            Deploy.s.sol
        artifacts/
            Counter.json         (includes ABI, bytecode, address)
            deployment-log.json  (block, tx, timestamp)
        README.md

REPRODUCIBLE BUILD CHECKLIST:
    [ ] Exact compiler version pinned (pragma solidity ^0.8.19 or = 0.8.19).
    [ ] Dependencies pinned (Foundry.toml or package-lock.json).
    [ ] Build environment reproducible (same OS, shell).
    [ ] Constructor args recorded and verifiable.
    [ ] Bytecode hash matches block explorer.

EXAMPLE CHECK:
    # Build locally
    forge build
    HASH1=$(cat out/Counter.sol/Counter.json | jq .bytecode.object)

    # Fetch from block explorer
    curl https://api.etherscan.io/api?module=contract&action=getabi&address=0x1234 > explorer.json
    HASH2=$(echo $explorer.json | jq .result[0].ImplementationAddress)
    
    # Should match
    [ "$HASH1" = "$HASH2" ] && echo "Verified" || echo "Mismatch"

COMMON PITFALL: Deploying from a dirty git working directory.
Six months later, you cannot rebuild the bytecode because the source code in git has changed.

KEY TAKEAWAY: Tag every production deployment with an immutable git commit and bytecode hash.`},{id:"3.5",title:"3.5 Upgrade Patterns and Safety",content:`Smart contracts are immutable, but patterns exist to upgrade logic safely.

TRANSPARENT PROXY PATTERN:
    • A proxy contract forwards calls to an implementation contract.
    • Only the admin can upgrade the implementation address.
    • Users always interact with the proxy address.

    Deployment:
        Counter implementation = deploy Counter.
        Proxy = deploy TransparentProxy(implementation, admin, "").
        Users call methods on Proxy; Proxy delegates to implementation.

    Upgrade:
        New Counter v2 = deploy Counter.
        admin.upgradeTo(Proxy, newCounterAddress).
        All future calls use the new logic.

BEWARE: Storage collision. If v1 has:
    uint256 count;
    uint256 owner;

And v2 adds:
    uint256 newField;

The proxy's storage (count, owner, newField) must match the new layout, or writes go to the wrong slots.

SAFE UPGRADE CHECKLIST:
    [ ] New implementation is backward compatible (no storage rearrangement).
    [ ] Initialization logic is in a separate init() function (not constructor).
    [ ] Non-upgradeable dependencies are tested with the new implementation.
    [ ] Upgrade is tested on a fork before mainnet.
    [ ] Timelock delays the upgrade (e.g., 48 hours for security review).

UPGRADING WITHOUT PROXY:
    • Deploy a new contract (Counter v2).
    • Migrate users and state manually (high friction).
    • Keep v1 around for reference (maintain address).
    This is safer but slower and more expensive.

KEY TAKEAWAY: Use upgradeable patterns only if you need them. Every layer of indirection is a bug surface.`},{id:"3.6",title:"3.6 Deployment Checklist, Pre-Deploy Reviews, and Smoke Tests",content:`Before deploying to mainnet, follow a rigorous checklist.

PRE-DEPLOYMENT CHECKLIST:
    [ ] All tests pass (unit, integration, fork, fuzz).
    [ ] Code reviewed by another engineer (GitHub PR approval).
    [ ] Code audited by external firm (if handling >$1M or complex logic).
    [ ] Contract compiled with exact compiler version.
    [ ] Mainnet addresses hardcoded in config (oracle, token addresses).
    [ ] Constructor arguments double-checked (no typos, correct order).
    [ ] Gas limits estimated; surprising interactions logged.
    [ ] Timelock or voting delay set (not instant admin).
    [ ] Secrets (keys, RPC) NOT in deploy logs.
    [ ] Disaster recovery plan (upgrade, pause, or rollback) in place.

PRE-DEPLOY REVIEW:
    1. Code walkthrough: Senior engineer re-reads the deploy script.
    2. Network check: Is this really mainnet or a testnet? (Common mistake!)
    3. Staging deploy: Deploy to testnet first; verify artifacts match.
    4. Smoke test: Call one critical function on testnet; confirm it works.

SMOKE TESTS (Post-Deploy):
    After deploying to mainnet, immediately run lightweight checks:
    
    [ ] Contract exists at expected address.
    [ ] Contract code matches bytecode hash.
    [ ] Owner/admin is correct.
    [ ] One happy-path function call succeeds.
    [ ] Events are emitted correctly.
    [ ] No unexpected balances or state.

    Example (Foundry):
        function testSmoke_Mainnet() public {
            require(address(counter).code.length > 0, "Contract not deployed");
            uint256 val = counter.value();
            assertTrue(val >= 0, "State readable");
        }

ROLLBACK PLANNING:
    If deployment fails:
        1. Is there a pause function? Pause immediately.
        2. Can you deploy a fixed version and migrate state? Plan the migration.
        3. Can you downgrade the proxy to the old implementation?
        4. Worst case: Accept the loss and redeploy from scratch.

    Write a rollback runbook before deployment:
        # Rollback: Counter v1.0.0
        - Pause the contract via admin (1-of-2 multisig).
        - Deploy Counter v1.0.0-hotfix.
        - Run acceptance tests on fork.
        - Admin call: proxy.upgradeTo(hotfixAddress).
        - Verify on mainnet.
        - Post-incident review (within 24 hours).

COMMON PITFALL: Assuming the contract is live and all is well.
Spend 30 minutes confirming every requirement of the checklist.

KEY TAKEAWAY: A 1-hour pre-deploy review prevents a 10-million-dollar loss. Invest the time.`,quiz:[{type:"shortanswer",question:"Why should you deploy to a testnet before mainnet, even if all tests pass?",sampleAnswer:"Testnet catch configuration errors (wrong addresses, network ID), environment issues (RPC timeouts), and allow smoke testing before irreversible mainnet deployment.",explanation:"Tests are hypothetical; testnet deployment is real. A configuration typo may not fail tests but will fail on testnet."}]},{id:"3.7",title:"3.7 Incident Runbooks and Post-Mortems",content:`When things go wrong (and they will), a runbook guides the response.

STRUCTURE OF A RUNBOOK:
    Title: [Contract] [Issue]
    Severity: (Critical / High / Medium / Low)
    Time to act: (Immediate / 1 hour / 1 day)
    
    DETECTION:
        • External price feed drops 50% in 1 minute.
        • Multisig transaction pending for >1 hour.
        • Event X stops emitting for >10 blocks.
    
    IMMEDIATE ACTIONS:
        1. Pause the contract via the pause function.
        2. Notify team on Slack (dedicated incident channel).
        3. Spin up a fork and assess damage.
    
    INVESTIGATION:
        • Replay the failed transaction on fork with verbose logs.
        • Check on-chain state and off-chain indexer state.
        • Confirm the root cause (bug, external factor, misconfiguration).
    
    REMEDIATION:
        • If a code bug: deploy fixed version and upgrade proxy.
        • If external factor: wait for resolution (oracle recovers, network issues resolve).
        • If misconfiguration: adjust settings (fee, threshold).
    
    VALIDATION:
        1. Test on fork.
        2. Run smoke tests on mainnet.
        3. Monitor for 1 hour.
    
    COMMUNICATION:
        • Status update to users every 30 minutes.
        • Root cause blog post within 48 hours.
    
    FOLLOW-UP:
        • Post-mortem meeting within 24 hours.
        • Update tests to prevent recurrence.
        • Improve monitoring.

COMMON PITFALLS:
    • No runbook exists; chaos and finger-pointing ensue.
    • Runbook is too generic (step 1: "investigate", step 2: "fix").
    • Runbook is out of date (references old contract addresses).

KEY TAKEAWAY: Write a runbook while calm; follow it exactly when panicked.`}],postSectionQuiz:[{type:"conceptual",question:"You are about to deploy a contract that handles $10M. What is the most important step you should take?",options:["Run unit tests and push to mainnet immediately.","Complete a pre-deployment checklist, staging deployment, and 30-minute senior engineer review.","Ask an AI chatbot if the code looks correct.","Manually verify the bytecode on the blockchain."],correct:1,explanation:"Code review, staging, and checklists catch errors before they cost millions. Automation is fast; rigor is irreplaceable."}]},{id:"part3",title:"4. On-Chain Events and Reliable Client Interactions",subsections:[{id:"4.1",title:"4.1 Event Design and Schema Discipline",content:`Events are the on-chain audit log and the bridge to off-chain systems.

ANATOMY OF AN EVENT:
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    • indexed: stored in a searchable log (can filter by from).
    • non-indexed: stored as data (cheaper, not filterable by name).

DESIGN PRINCIPLES:
    1. IMMUTABILITY: Events cannot be changed. Design them carefully.
    2. COMPLETENESS: Every state change should emit an event.
    3. INDEXING: Index fields you will filter by (sender, recipient).
    4. REDUNDANCY: Include derived data (e.g., both from and to balances).

GOOD SCHEMA:
    // Clear, redundant, filterable
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 fromBalance,
        uint256 toBalance
    );
    
    // Indexed: from, to (easy to query by sender).
    // Non-indexed: amount, balances (provide context).

BAD SCHEMA:
    // Missing information
    event Transfer(address indexed from, address indexed to);
    // Listener cannot know the amount; must call balanceOf (slow, stale).
    
    // Over-indexed
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed amount  // amount as index is wasteful
    );

VERSIONING EVENTS:
    If you must change an event, emit a new event with a different name:
    event Transfer(address indexed from, address indexed to, uint256 value);
    event TransferV2(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 timestamp
    );
    
    Indexers can listen to both and migrate gradually.

COMMON PITFALL: Emitting an event with wrong data.
Example: emitting Transfer(alice, bob, balanceAfter) when it should be balanceBefore.
Indexers now have wrong state, and you cannot fix it.

KEY TAKEAWAY: Events are immutable history. Spend time on schema design; it compounds over your protocol's lifetime.`},{id:"4.2",title:"4.2 Indexed Topics and Event Filtering",content:`Indexed fields are stored in the event signature, allowing efficient filtering.

EVM TOPIC STRUCTURE:
    Topic 0: event signature hash (Transfer selector).
    Topic 1, 2, 3: indexed parameters (from, to, amount if indexed).
    Data: non-indexed parameters.

EXAMPLE:
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );
    
    Logs bloom filter can quickly answer:
        "Show me all transfers FROM alice."
        "Show me all transfers TO bob."
        "Show me all transfers FROM alice TO bob."
    
    But NOT:
        "Show me all transfers of amount > 1000"
        (amount is not indexed; you must scan and filter).

FILTER IN CODE (ethers.js):
    const filter = {
        address: counterAddress,
        topics: [
            ethers.utils.id("Transfer(address,address,uint256)"),  // event signature
            ethers.utils.hexZeroPad(alice.address, 32),             // from = alice
            "0x" + "0".repeat(64)                                     // to = any
        ]
    };
    const logs = await provider.getLogs(filter);

INDEXED TOPICS COST:
    Indexed fields cost more gas (384 additional per indexed field in logs).
    Index only fields you will filter by frequently.

CHAIN OF BLAME:
    If a field is not indexed and you need to filter by it:
        1. Fetch all events for that contract.
        2. Decode each event.
        3. Filter in application logic (slow, expensive).
    
    This is why proper indexing matters at design time.

KEY TAKEAWAY: Index fields you will query; do not index what you will never filter by.`},{id:"4.3",title:"4.3 Event-Driven vs Call-Driven Reads",content:`Two strategies to sync off-chain state with on-chain state.

EVENT-DRIVEN (Indexing):
    Listen to events; update off-chain state reactively.
    
    Flow:
        Contract emits Transfer(alice, bob, 100).
        Indexer hears the event.
        Indexer updates alice.balance and bob.balance.
        Client reads the indexer (fast, reliable read).
    
    Pros:
        • Scalable (one indexer serves many clients).
        • Consistent (secondary index matches primary state).
    Cons:
        • Delayed (indexer may lag 1–10 blocks).
        • Complex (indexer logic can have bugs).
    
    Tools: The Graph, Subgraph, Envio, Ponder.

CALL-DRIVEN (Direct RPC):
    Query the contract on-demand.
    
    Flow:
        Client calls counter.balanceOf(alice).
        Node executes the function and returns the value.
        Client reads the direct result.
    
    Pros:
        • Always up-to-date (latest block state).
        • Simple (one RPC call).
    Cons:
        • Slow (RPC call to node, then EVM execution).
        • Expensive at scale (many clients = many RPC calls).
    
    Tools: ethers.js, web3.py, direct RPC.

HYBRID:
    Use event-driven for fast reads and call-driven for validation.
    
    Example:
        1. Indexer watches Transfer events and caches balances.
        2. Client reads from cache (fast).
        3. Client calls balanceOf to verify (slow but trust-minimal).

REORG IMPLICATIONS:
    Events are not final until N blocks have been produced since the event.
    Call-driven reads are final when the block is finalized.
    
    If you show a user state based on a 1-block-old event, and a reorg happens, the state is wrong.

COMMON PITFALL: Assuming events are immutable.
They are, IF you index them at the finalized block. Until then, they can disappear.

KEY TAKEAWAY: Event-driven is faster; call-driven is more trustworthy. Use both for confidence.`},{id:"4.4",title:"4.4 Reorgs, Finality, and Safe Block Confirmation",content:`A reorg (re-organization) happens when a crypto network forks and one branch becomes the canonical chain.

SIMPLIFIED REORG EXAMPLE:
    Block 100 (canonical): Miner A produces block, emits Transfer(alice, bob).
    Blocks 101-105:        Miner A extends chain.
    
    Miner B produces blocks 100'-105' with more total difficulty.
    Network switches to Miner B's chain.
    
    Transfer(alice, bob) in block 100 DISAPPEARS.
    
    Your indexer had recorded it; now the state is out of sync.

FINALITY (By Network):
    • Ethereum PoW (pre-2022): ~N blocks where N ≈ 6–15 (practical).
    • Ethereum PoS (post-2022): ~2 blocks canonical, ~32 blocks absolute.
    • Bitcoin: ~6 blocks (convention) or ~100 blocks (certainty).
    • Solana: ~32 blocks.
    
    "Safe" block: Not finalized but unlikely to reorg (consumed by many users, economic cost high).
    "Finalized" block: Cryptographically impossible to reorg.

SAFE INDEXING STRATEGY:
    1. Index only events from blocks >= current_head - CONFIRMATION_DEPTH.
    2. CONFIRMATION_DEPTH = 12 on Ethereum (conservative).
    3. When a new block arrives, if it reorgs old blocks, rewind indexer and re-index.

    Pseudocode:
        while True:
            head = provider.blockNumber()
            latest_indexed = indexer.lastBlock()
            
            if head > latest_indexed + 1:
                // Reorg detected; rewind to safe point
                indexer.rewind(latest_indexed - CONFIRMATION_DEPTH)
            
            indexed_events = get_events(latest_indexed + 1, head - CONFIRMATION_DEPTH)
            indexer.update(indexed_events)

REORG DETECTION:
    Monitor provider.getBlockNumber() and provider.getBlock(height).
    If provider.getBlock(N) changes between calls, a reorg occurred.

COMMON PITFALL: Notifying users of state that is not finalized.
"Your transfer is complete" (at block 100), then reorg happens (block 100 disappears), and the user thinks they got paid but did not.

KEY TAKEAWAY: Distinguish between "included" (in a block) and "finalized" (irreversible). Show users "finalized" state.`,quiz:[{type:"conceptual",question:"You index a transfer event at block 100. One hour later, a 7-block reorg occurs, and the transfer is gone. How could you have prevented this?",options:["A. Index only events from blocks >= current_head - 12.","B. Wait for block finality before using the event.","C. Continuously monitor for reorgs and rewind when detected.","D. All of the above."],correct:3,explanation:"All are correct practices. Indexing from conservative depth, waiting for finality, and monitoring for reorgs all reduce risk."}]},{id:"4.5",title:"4.5 Idempotency and Nonce Management",content:`Distributed systems have failures. Idempotency makes retries safe.

IDEMPOTENCY IN TRANSACTIONS:
    A transaction is idempotent if calling it twice with the same inputs has the same effect as calling it once.
    
    IDEMPOTENT (safe to retry):
        approve(spender, amount)  // Side effect: set allowance; retrying does not double it.
    
    NON-IDEMPOTENT (dangerous to retry):
        transfer(to, amount)      // Side effect: subtract amount from sender. Retrying transfers twice!

NONCE MANAGEMENT:
    Every transaction from an account has a nonce (0, 1, 2, ...).
    Blockchain enforces strict ordering: nonce N must be processed before nonce N+1.
    
    // Transaction 1: nonce=0, transfer alice 10.
    // Transaction 2: nonce=1, transfer bob 5.
    // Transaction 3: nonce=2, transfer carol 3.
    
    If transaction 2 fails, transaction 3 is stuck until transaction 2 succeeds (or times out).

STUCK NONCE ISSUE:
    1. Send tx with nonce=5 (gets stuck; low gas price).
    2. Try to send tx with nonce=6 (rejected; must wait for nonce=5).
    3. Wait hours for nonce=5 to be dropped (timeout, 12–24 hours).

RECOVERY:
    • Replace transaction: send a new tx with the same nonce and higher gas price.
    • Cancel transaction: send a 0-value transfer to yourself with that nonce.

ENSURING EXACTLY-ONCE SEMANTICS:
    In Web3, "exactly once" is an illusion. But you can approximate it:
    
    1. Assign each operation a unique idempotency key (UUID).
    2. Record the key on-chain in a mapping:
         mapping(bytes32 => bool) processed;
         
    3. Check before processing:
         require(!processed[opKey], "Already processed");
         processed[opKey] = true;
         _transfer(to, amount);
    
    4. Off-chain, store the key and check before retrying:
         if (offChainDB.hasKey(opKey)) {
             return prevResult;  // Already done; return cached result
         }

NONCE AND ORDERING VULNERABILITIES:
    Attackers can send high-nonce transactions to lock up future transactions.
    Convention: ignore txs with nonce >> current nonce (gap > 5).

COMMON PITFALL: Retrying transaction logic at the application level without on-chain idempotency checks.
A user clicks "send" twice; you send two transfers. Both succeed; the user loses 2x the amount.

KEY TAKEAWAY: Design operations to be idempotent. Use idempotency keys and on-chain checks to prevent double-spending.`},{id:"4.6",title:"4.6 Transaction Lifecycle and Reliable Submission",content:`A transaction goes through states from submission to finality. Monitoring each state is critical.

LIFECYCLE:
    1. PENDING: Submitted to mempool; miners see it.
    2. MINED: Included in a block; visible in node state; not finalized yet.
    3. CONFIRMED: Several blocks after inclusion; still re-org able on PoS.
    4. FINALIZED: Impossible to reorg (PoS: ~2 epochs; PoW: convention is 6 blocks).

MONITORING IN ethers.js:
    const tx = await contract.transfer(to, amount);
    console.log("Pending:", tx.hash);
    
    const receipt = await tx.wait(1);  // Wait for 1 confirmation (not finalized!)
    console.log("Mined:", receipt.blockNumber);
    
    // For finality
    const finalReceipt = await tx.wait(32);  // Conservative depth on PoS
    console.log("Finalized:", receipt.blockNumber);

COMMON ISSUES:
    
    1. Transaction Dropped:
         If gas price is too low or mempool clears, the tx is dropped (reverted to pending).
         Monitor mempool and re-submit with higher gas after timeout.
    
    2. Out of Gas:
         Tx reverts on execution; gas is consumed; no state change.
         Check estimation: const gas = await contract.transfer.estimateGas(to, amount).
    
    3. Revert (Logic Error):
         Transaction meets an require() or assert().
         Trace the tx on-chain to see the revert reason.

GAS PRICE MANAGEMENT:
    Estimate then bump if needed:
        est_gas = estimateGas()
        gas_price = currentGasPrice + (10% buffer)
        submit(est_gas, gas_price)
        
        If not mined after 5 minutes:
            gas_price = currentGasPrice + (50% bump)
            submit(est_gas, gas_price)  // Replace-by-fee (RBF)

ERROR RECOVERY:
    try {
        const tx = await contract.transfer(to, amount);
        await tx.wait(12);  // Safe confirmation depth
    } catch (err) {
        if (err.reason === "Insufficient balance") {
            // User error; inform user
        } else if (err.code === "TIMEOUT") {
            // Network timeout; retry with higher gas
            retry()
        }
    }

REORG RESILIENCE:
    Never show "transaction finalized" until block depth >= 12 (Ethereum PoS).
    Monitor reorg events and be prepared to reverse.

KEY TAKEAWAY: Transactions are not final immediately. Monitor lifecycle states and respond to failures with retries or bumps.`}],postSectionQuiz:[{type:"multiselect",question:"Which of the following are true about events and finality?",options:["A. Events are immutable on-chain.","B. Events included in a block are finalized; they will never reorg.","C. An indexer should only sync events from blocks >= head - 12.","D. Indexed event fields can be filtered efficiently.","E. Event-driven reads are always more up-to-date than call-driven reads."],correct:[0,2,3],explanation:"A, C, D are true. B is false (reorgs can remove blocks). E is false (call-driven is more current; event-driven may lag blocks)."}]},{id:"part4",title:"5. Hands-On Lab: Reproducible Testnet Deployment",subsections:[{id:"5.1",title:"5.1 Lab Setup and Goals",content:`In this lab, you will:
    1. Write a simple smart contract with an initialize function and an event.
    2. Create unit and integration tests.
    3. Write a deployment script.
    4. Deploy to Sepolia testnet.
    5. Verify the contract on Etherscan.
    6. Write a README and verify another engineer can reproduce it.

PREREQUISITES:
    • Foundry installed (or Hardhat).
    • A Sepolia testnet account with some ETH (faucet: sepoliafaucet.com).
    • Etherscan API key (register at etherscan.io).

ESTIMATED TIME: 2 hours.

DELIVERABLES:
    1. Verified contract on Sepolia.
    2. Reproducible README.
    3. Deployment artifacts (address, ABI).
    4. A partner confirms they can run your flow.`},{id:"5.2",title:"5.2 Step 1: Contract and Tests",content:`Create a minimal contract with state and events.

FILE: src/Deposit.sol

pragma solidity ^0.8.19;

contract Deposit {
    address public owner;
    uint256 public totalDeposited;
    
    event Initialized(address indexed owner);
    event DepositMade(address indexed depositor, uint256 amount, uint256 totalAfter);
    
    constructor() {
        owner = msg.sender;
    }
    
    function initialize(address initialOwner) external {
        require(owner == address(0), "Already initialized");
        owner = initialOwner;
        emit Initialized(initialOwner);
    }
    
    function deposit() external payable {
        require(msg.value > 0, "Must deposit > 0");
        totalDeposited += msg.value;
        emit DepositMade(msg.sender, msg.value, totalDeposited);
    }
    
    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        require(amount <= address(this).balance, "Insufficient balance");
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "Withdraw failed");
    }
}

FILE: test/Deposit.t.sol

pragma solidity ^0.8.19;

contract DepositTest is Test {
    Deposit deposit;
    address alice = address(0x1111);
    address bob = address(0x2222);

    function setUp() public {
        deposit = new Deposit();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
    }

    function test_DepositIncreaseTotal() public {
        vm.prank(alice);
        deposit.deposit{value: 1 ether}();
        assertEq(deposit.totalDeposited(), 1 ether);
    }

    function test_WithdrawOnlyOwner() public {
        vm.deal(address(deposit), 1 ether);
        vm.prank(bob);
        vm.expectRevert("Only owner");
        deposit.withdraw(0.5 ether);
    }

    function test_EmitDepositEvent() public {
        vm.prank(alice);
        vm.expectEmit();
        emit Deposit.DepositMade(alice, 1 ether, 1 ether);
        deposit.deposit{value: 1 ether}();
    }
}

Run tests:
    foundry test

All should pass.`},{id:"5.3",title:"5.3 Step 2: Deployment Script",content:`Create a script to deploy and initialize on testnet.

FILE: script/Deploy.s.sol

pragma solidity ^0.8.19;

contract DeployDeposit is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerKey);
        
        vm.startBroadcast(deployerKey);
        
        Deposit deposit = new Deposit();
        
        // Optionally initialize with a different owner
        address initialOwner = vm.envAddress("INITIAL_OWNER");
        if (initialOwner != address(0)) {
            deposit.initialize(initialOwner);
        }
        
        vm.stopBroadcast();
        
        // Log results
        console.log("Deposit deployed to:", address(deposit));
        console.log("Owner:", deposit.owner());
        console.log("Deployer:", deployerAddress);
    }
}

FILE: .env.example (commit to git, do NOT commit actual values)

PRIVATE_KEY=0x<your-private-key-here>
INITIAL_OWNER=0x<owner-address-here>
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<your-alchemy-key>
ETHERSCAN_API_KEY=<your-etherscan-api-key>

FILE: .env (gitignore, never commit)

PRIVATE_KEY=0x...actual...key
INITIAL_OWNER=0x...actual...address
SEPOLIA_RPC_URL=https://...actual...url
ETHERSCAN_API_KEY=...actual...key

Copy .env.example to .env and fill in real values.

Deploy to Sepolia:
    source .env
    forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY

Record the contract address (example: 0xABC123...).`},{id:"5.4",title:"5.4 Step 3: Verification on Etherscan",content:`After deployment, verify the contract.

If using --verify flag above, it should be automatic. If not:

    forge verify-contract \\
        --chain-id 11155111 \\
        --etherscan-api-key $ETHERSCAN_API_KEY \\
        0xABC123... Deposit

Check on Etherscan:
    1. Navigate to https://sepolia.etherscan.io/address/0xABC123...
    2. Click "Code" tab.
    3. Confirm the source code matches your src/Deposit.sol.
    4. Click "Read Contract" to verify state (owner, totalDeposited).`},{id:"5.5",title:"5.5 Step 4: Smoke Tests",content:`After verification, test the contract on testnet.

FILE: test/SmokeTest.t.sol

pragma solidity ^0.8.19;

contract SmokeTest is Test {
    function testSmoke_DeployedContractExists() public {
        // Replace with actual deployed address
        address deployedAddress = 0xABC123...;
        require(deployedAddress.code.length > 0, "Contract not deployed");
    }

    function testSmoke_CanCallOwner() public {
        address deployedAddress = 0xABC123...;
        Deposit deposit = Deposit(deployedAddress);
        address owner = deposit.owner();
        assertTrue(owner != address(0), "Owner is not set");
    }
}

Run against testnet:
    forge test --fork-url $SEPOLIA_RPC_URL`},{id:"5.6",title:"5.5 Step 5: Reproducible README",content:`Create a README that another engineer can follow exactly.

FILE: README.md

# Deposit Contract

## Overview
A simple contract for accepting deposits and allowing the owner to withdraw.

## Prerequisites
- Foundry (https://book.getfoundry.sh/)
- Sepolia testnet ETH (faucet: sepoliafaucet.com)
- Etherscan API key (https://etherscan.io/apis)

## Setup

1. Clone the repo and install dependencies:
     \`\`\`bash
     git clone <repo>
     cd deposit-contract
     forge install
     \`\`\`

2. Create .env from .env.example:
     \`\`\`bash
     cp .env.example .env
     # Edit .env with your private key, RPC URL, Etherscan API key
     \`\`\`

3. Run tests:
     \`\`\`bash
     forge test
     \`\`\`

## Deploy to Sepolia

\`\`\`bash
source .env
forge script script/Deploy.s.sol \\
    --rpc-url $SEPOLIA_RPC_URL \\
    --broadcast \\
    --verify \\
    --etherscan-api-key $ETHERSCAN_API_KEY
\`\`\`

Record the deployed contract address.

## Verify on Etherscan

After deployment, check:
https://sepolia.etherscan.io/address/<DEPLOYED_ADDRESS>

## Running Smoke Tests

After deployment, verify the contract is live:

Create test/SmokeTest.t.sol with the deployed address, then:
\`\`\`bash
forge test --fork-url $SEPOLIA_RPC_URL
\`\`\`

## Deployment Record

| Date | Chain | Address | Block | Deployer |
|------|-------|---------|-------|----------|
| 2024-01-15 | Sepolia | 0xABC123... | 5000000 | 0xDEF456... |

## Key Files

- src/Deposit.sol: Main contract
- test/Deposit.t.sol: Unit and integration tests
- script/Deploy.s.sol: Deployment script
- .env.example: Environment variable template

## Notes

- Always test on Sepolia before mainnet.
- Verify contracts immediately after deployment.
- Back up the deployment address and ABI.

## Troubleshooting

**"Insufficient balance"**: Ensure your Sepolia account has ETH.

**Verification fails**: Check that the Foundry compiler version matches the contract pragma.

**Timeouts**: Use a faster RPC endpoint or increase timeout in forge config.`},{id:"5.7",title:"5.6 Step 6: Pair Review and Reproducibility",content:`Pair with another engineer to verify reproducibility.

CHECKLIST (Partner runs your README):
    [ ] Clone your repo.
    [ ] Has .env.example (no secrets).
    [ ] Runs \`forge test\` successfully.
    [ ] Has clear setup instructions.
    [ ] Deploy script is clear and deterministic.
    [ ] Verification step is documented.
    [ ] Partner can see contract on Etherscan.
    [ ] Smoke tests pass.

COMMON ISSUES PARTNERS MAY HIT:
    • Missing .env (expected, but instruction is unclear).
    • Compiler version mismatch (fixed with foundry.toml).
    • RPC endpoint timeout (switch to a faster provider).
    • Constructor args not recorded (add to README).

FIX ISSUES and ITERATE.
When partner verifies reproducibility, record it:

REPRODUCIBILITY VERIFICATION

Verified by: Alice Code (alice@company.com)
Date: 2024-01-15
Steps followed: All steps in README.md
Result: Contract deployed to Sepolia 0xABC123..., verified on Etherscan.
Issues: None.

Commit this note to git.`}],postSectionQuiz:[{type:"shortanswer",question:"After deploying your contract to Sepolia and verifying it on Etherscan, a partner says they cannot verify the contract on Etherscan. What could be wrong?",sampleAnswer:"Possible causes: compiler version mismatch, constructor arguments not recorded, optimizer settings different, or source code does not match. Check foundry.toml, verify.sh script, and re-run verification manually.",explanation:"Verification is deterministic; any difference in build environment or constructor args causes verification to fail."}]},{id:"part5",title:"6. Advanced Topic: Case Study and Failures",subsections:[{id:"6.1",title:"6.1 Mini Case Study: The Incorrect Chain ID Incident",content:`INCIDENT: Protocol X deployed a contract on mainnet, but the deployment script hardcoded the wrong chain ID check.

TIMELINE:
    • Monday 2pm: Deploy contract Y to Ethereum mainnet.
    • Monday 2:15pm: Contract is live. Users begin depositing.
    • Tuesday 10am: A user notices event logs show chainId = 1 (wrong; should be 56 for Polygon).
        The contract was supposed to multi-chain but is now restricted to one.
    • Tuesday 11am: Team realizes the bug: a hardcoded constant, not read from block.chainid.
    • Tuesday 1pm: Pause the contract (10 users affected, ~$5M locked).
    • Wednesday 9am: Deploy a patched contract, migrate users (manual, error-prone).
    • Wednesday 5pm: Migration complete. 2 users lost funds due to migration error.

ROOT CAUSES:
    1. Chain ID not read from on-chain (hardcoded instead).
    2. No pre-deployment review on testnet (only mainnet).
    3. No smoke test that checked chain ID.
    4. Tests did not validate multi-chain behavior.

PREVENTION:
    1. Read chainId from block.chainid, never hardcode.
    2. Test on testnet that matches the deployment target.
    3. Add a smoke test:
         function testSmoke_ChainID() public {
             uint256 cid = block.chainid;
             assertTrue(cid == 1 || cid == 56, "Unexpected chain");
         }
    4. Checklist item: "Is chain ID correct for target network?"
    5. Code review by two engineers, one familiar with multi-chain systems.

LESSON: Small assumptions (hardcoded constants) compound into major incidents.

KEY TAKEAWAY: Review assumptions as carefully as you review logic.`},{id:"6.2",title:"6.2 Mini Case Study: The Flaky Test That Hid a Regression",content:`INCIDENT: Contract Z's test suite had a flaky test that sometimes passed and sometimes failed.

TIMELINE:
    • Week 1: Test added to check reentrancy protection. Passes 9/10 runs; flaky.
    • Week 2: Developer sees test failure, disables it with @skip. Leaves TODO comment.
    • Week 3: Another developer refactors reentrancy protection for gas optimization.
    • Week 4: Code review passes (the flaky test is skipped, so no one notices the regression).
    • Week 5: Deploy to mainnet.
    • Week 6: Attacker exploits the reentrancy bug. $50M drained.

ROOT CAUSES:
    1. Flaky test was not fixed; it was disabled.
    2. Code review did not check for disabled tests.
    3. No CI rule to catch skipped tests.

PREVENTION:
    1. Fix flaky tests immediately. Root cause: shared state or non-determinism.
    2. Run tests 10 times in CI to detect flakiness.
    3. Fail the build if any test is skipped: 
         grep -r "@skip|@ignore" test/ && exit 1
    4. Review: "Why is this test skipped? What is the TODO?"

LESSON: A cheap fix (disable the test) led to a catastrophic loss. Rigor compounds.

KEY TAKEAWAY: Flaky tests are not just annoying; they hide bugs. Fix them.`},{id:"6.3",title:"6.3 Mini Case Study: Event Schema Mismatch and Indexer Chaos",content:`INCIDENT: A protocol upgraded its transfer event schema without versioning.

OLD SCHEMA:
    event Transfer(address indexed from, address indexed to, uint256 amount);

NEW SCHEMA (after upgrade):
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 fromBalance,
        uint256 toBalance
    );

PROBLEM:
    Indexers listening to Transfer events parse the first two indexed fields and the amount from data.
    After the upgrade, the event signature changed (new parameters added).
    Old indexers stopped seeing Transfer events (they listened to the old signature).
    Off-chain state diverged from on-chain state.

TIMELINE:
    • Day 1: Upgrade deployed.
    • Day 2: Indexer operators notice: "No Transfer events since block X."
    • Day 3: Indexer teams manually restart, re-index from day 1.
    • Day 4: Services using indexer data are 3 days out of sync.
    • Day 5: Manual corrections applied. Some users were double-credited.

ROOT CAUSES:
    1. Event signature was changed without versioning.
    2. No coordination with indexer operators (no warning).
    3. No integration test that simulated old and new event streams.

PREVENTION:
    1. Never modify an existing event. Create a new event with a different name:
         event Transfer_v1(address indexed from, address indexed to, uint256 amount);
         event Transfer_v2(address indexed from, address indexed to, uint256 amount, uint256 fromBalance, uint256 toBalance);
    2. Emit both during transition period (backward compatible).
    3. Notify indexer operators 1 week before deployment.
    4. Test with real indexers on testnet for 1 week.

LESSON: Event changes cascade to off-chain infrastructure. Plan carefully.

KEY TAKEAWAY: Treat events as immutable contracts. Versioning is your friend.`}]},{id:"part6",title:"7. Summary and Key Takeaways",content:`This module covered three interconnected pillars of smart contract operations:

TESTING:
    • Organize tests in a pyramid: unit (fast, many), integration (medium, some), system (slow, few).
    • Use fixtures for determinism and coverage as a guide, not a goal.
    • Balance mocks (fast, hypothetical) and forks (slow, real).
    • Fuzz, property, and invariant testing catch edge cases.
    • Flaky tests hide bugs; fix them immediately.

DEPLOYMENT:
    • Write idempotent deploy scripts and record artifacts.
    • Verify contracts immediately after deployment.
    • Treat secrets with paranoia: rotate keys, inject via CI, never commit.
    • Follow a pre-deploy checklist and get a senior review.
    • Run smoke tests before declaring victory.
    • Write incident runbooks while calm; follow them when panicked.

CLIENT INTERACTIONS:
    • Design event schemas with immutability in mind. Version them.
    • Index fields you will filter by; do not over-index.
    • Combine event-driven and call-driven reads for speed and safety.
    • Reorgs happen; index only at finalized blocks.
    • Idempotency and nonce management prevent double-spending.
    • Monitor transaction lifecycle; retry with bumps when needed.

OPERATIONALLY:
    • Repeatability beats cleverness. Document every step.
    • Auditability beats speed. Record decisions and changes.
    • Defensive design assumes networks fail; plan for it.

FINAL PRINCIPLE: In Web3, you cannot call a customer and fix a bug. Design like every deployment is your last.`}],P=[{type:"conceptual",question:"A contract handles $100M in user funds. What is the most critical thing to do before mainnet deployment?",options:["Achieve 100% test coverage.","Complete a thorough checklist, staging deploy, and senior engineer review.","Use the most advanced testing tools (fuzz, invariant, formal verification).","Deploy to a private testnet first."],correct:1},{type:"multiselect",question:"Which statements are true about event design?",options:["A. Indexed fields are efficient for filtering.","B. You can modify an event after deployment without consequence.","C. Events are immutable; design them carefully.","D. Over-indexing all fields is best practice.","E. Events should include redundant data for context."],correct:[0,2,4]},{type:"shortanswer",question:"You discover a deployed contract has a bug. What steps should you take?",sampleAnswer:"1) Pause the contract if possible. 2) Notify users. 3) Spin up a fork and investigate. 4) Deploy a fix and test on testnet. 5) Follow the upgrade/rollback plan. 6) Monitor for 1 hour. 7) Post-mortem within 24 hours.",explanation:"A structured incident response minimizes damage and prevents recurrence."},{type:"conceptual",question:"A reorg causes a transfer event to disappear. How could you have prevented showing it to users as 'finalized'?",options:["You cannot; reorgs are random.","Index only events from blocks >= head - 12 (conservative depth).","Use call-driven reads instead of events.","Wait for absolute finality (32 blocks on PoS)."],correct:1}];function K(){const[m,b]=f.useState("intro"),[B,Y]=f.useState({}),[C,I]=f.useState({}),[x,S]=f.useState(!1),[E,R]=f.useState({}),[v,N]=f.useState(!1),s=u.find(t=>t.id===m),c=u.findIndex(t=>t.id===m),D=Math.round((c+1)/u.length*100),M=()=>{c<u.length-1&&b(u[c+1].id)},F=()=>{c>0&&b(u[c-1].id)},w=(t,i)=>{I({...C,[t]:i})},A=(t,i)=>{R({...E,[t]:i})},y=((t,i)=>{let n=0;return i.forEach((a,l)=>{const o=t[l];(typeof a.correct=="number"&&o===a.correct||Array.isArray(a.correct)&&JSON.stringify(o)===JSON.stringify(a.correct))&&n++}),Math.round(n/i.length*100)})(Object.values(E),P),L=()=>{b("intro"),I({}),R({}),N(!1),S(!1)},k=(t,i)=>e.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"2px solid #ddd"},children:[e.jsx("h4",{children:"✓ Self-Check Questions"}),t.map((n,a)=>{const l=`${i}_q${a}`,o=C[l],p=o!==void 0,r=Array.isArray(n.correct)?JSON.stringify(o)===JSON.stringify(n.correct):o===n.correct;return e.jsxs("div",{style:{marginBottom:"16px",padding:"12px",backgroundColor:"#f9f9f9",borderRadius:"4px"},children:[e.jsx("p",{style:{fontWeight:"bold"},children:n.question}),n.type==="multiselect"&&e.jsx("div",{children:n.options.map((h,d)=>e.jsxs("label",{style:{display:"block",marginBottom:"8px"},children:[e.jsx("input",{type:"checkbox",checked:Array.isArray(o)&&o.includes(d),onChange:T=>{const O=o||[];w(l,T.target.checked?[...O,d]:O.filter(j=>j!==d))},"aria-label":h})," ",h]},d))}),n.type==="conceptual"&&e.jsx("div",{children:n.options.map((h,d)=>e.jsxs("label",{style:{display:"block",marginBottom:"8px"},children:[e.jsx("input",{type:"radio",name:l,checked:o===d,onChange:()=>w(l,d),"aria-label":h})," ",h]},d))}),n.type==="shortanswer"&&e.jsx("textarea",{value:o||"",onChange:h=>w(l,h.target.value),style:{width:"100%",minHeight:"80px",padding:"8px",fontFamily:"monospace"},placeholder:"Type your answer...","aria-label":"Short answer"}),p&&x&&e.jsxs("div",{style:{marginTop:"8px",padding:"8px",backgroundColor:r?"#d4edda":"#f8d7da",borderRadius:"4px"},children:[e.jsx("p",{style:{color:r?"#155724":"#721c24"},children:r?"✓ Correct!":"✗ Review this."}),e.jsx("p",{children:n.explanation})]})]},l)})]});return e.jsxs("div",{style:{display:"flex",fontFamily:"system-ui, sans-serif",color:"#333"},children:[e.jsxs("div",{style:{width:"280px",padding:"20px",backgroundColor:"#f0f0f0",maxHeight:"100vh",overflowY:"auto",borderRight:"1px solid #ddd"},children:[e.jsx("h2",{style:{fontSize:"16px",marginBottom:"16px"},children:"Navigation"}),e.jsxs("div",{style:{marginBottom:"16px"},children:[e.jsxs("p",{style:{fontSize:"12px",color:"#666"},children:["Progress: ",D,"%"]}),e.jsx("div",{style:{width:"100%",height:"8px",backgroundColor:"#ddd",borderRadius:"4px",overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${D}%`,backgroundColor:"#4CAF50",transition:"width 0.3s"}})})]}),u.map(t=>e.jsx("button",{onClick:()=>b(t.id),style:{display:"block",width:"100%",paddingLeft:"12px",paddingRight:"8px",paddingTop:"8px",paddingBottom:"8px",textAlign:"left",borderRadius:"4px",border:"none",backgroundColor:m===t.id?"#4CAF50":"transparent",color:m===t.id?"white":"#333",cursor:"pointer",marginBottom:"4px",fontSize:"13px",fontWeight:m===t.id?"bold":"normal"},"aria-label":`Go to section ${t.title}`,children:t.title.split(":")[0]},t.id))]}),e.jsxs("div",{style:{flex:1,padding:"40px",maxWidth:"900px",margin:"0 auto"},children:[m==="intro"&&e.jsxs("div",{style:{marginBottom:"32px"},children:[e.jsx("h1",{children:g.title}),e.jsxs("p",{style:{fontSize:"16px",lineHeight:"1.6",color:"#555"},children:[e.jsx("strong",{children:"Abstract:"})," ",g.abstract]}),e.jsxs("div",{style:{marginTop:"24px"},children:[e.jsx("h3",{children:"Learning Objectives"}),e.jsx("ul",{style:{lineHeight:"1.8"},children:g.learningObjectives.map((t,i)=>e.jsx("li",{children:t},i))})]}),e.jsxs("div",{style:{marginTop:"24px"},children:[e.jsx("h3",{children:"Prerequisites"}),e.jsx("p",{children:g.prerequisites})]}),e.jsxs("div",{style:{marginTop:"24px"},children:[e.jsx("h3",{children:"Key Terms"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},children:g.keyTerms.map((t,i)=>e.jsx("div",{style:{fontSize:"13px",padding:"8px",backgroundColor:"#f9f9f9",borderRadius:"4px"},children:t},i))})]})]}),s&&m!=="intro"&&e.jsxs("div",{children:[e.jsx("h1",{children:s.title}),e.jsx("p",{style:{fontSize:"15px",lineHeight:"1.7",whiteSpace:"pre-wrap",color:"#444"},children:s.content}),s.subsections&&s.subsections.map(t=>e.jsxs("div",{style:{marginTop:"32px"},children:[e.jsx("h2",{style:{borderLeft:"4px solid #4CAF50",paddingLeft:"12px",marginBottom:"12px"},children:t.title}),e.jsx("p",{style:{fontSize:"14px",lineHeight:"1.7",whiteSpace:"pre-wrap",color:"#555"},children:t.content}),t.quiz&&k(t.quiz,`${s.id}_${t.id}`)]},t.id)),s.postSectionQuiz&&k(s.postSectionQuiz,`${s.id}_post`),s.quiz&&s.quiz.length>0&&!s.subsections&&k(s.quiz,s.id)]}),m==="part6"&&e.jsxs("div",{style:{marginTop:"40px",padding:"20px",backgroundColor:"#f0f8ff",borderRadius:"8px"},children:[e.jsx("h2",{children:"Final Assessment"}),e.jsx("p",{children:"These questions synthesize the module. Answer honestly; your score is private feedback for learning."}),P.map((t,i)=>{const n=`final_${i}`,a=E[n],l=a!==void 0,o=Array.isArray(t.correct)?JSON.stringify(a)===JSON.stringify(t.correct):a===t.correct;return e.jsxs("div",{style:{marginBottom:"20px",padding:"16px",backgroundColor:"white",borderRadius:"6px",border:"1px solid #ddd"},children:[e.jsxs("p",{style:{fontWeight:"bold",marginBottom:"12px"},children:[i+1,". ",t.question]}),t.type==="multiselect"&&e.jsx("div",{children:t.options.map((p,r)=>e.jsxs("label",{style:{display:"block",marginBottom:"8px"},children:[e.jsx("input",{type:"checkbox",checked:Array.isArray(a)&&a.includes(r),onChange:h=>{const d=a||[];A(n,h.target.checked?[...d,r]:d.filter(T=>T!==r))},"aria-label":p})," ",p]},r))}),t.type==="conceptual"&&e.jsx("div",{children:t.options.map((p,r)=>e.jsxs("label",{style:{display:"block",marginBottom:"8px"},children:[e.jsx("input",{type:"radio",name:n,checked:a===r,onChange:()=>A(n,r),"aria-label":p})," ",p]},r))}),t.type==="shortanswer"&&e.jsx("textarea",{value:a||"",onChange:p=>A(n,p.target.value),style:{width:"100%",minHeight:"80px",padding:"8px",fontFamily:"monospace"},placeholder:"Type your answer...","aria-label":"Short answer"}),v&&l&&e.jsxs("div",{style:{marginTop:"12px",padding:"12px",backgroundColor:o?"#d4edda":"#f8d7da",borderRadius:"4px"},children:[e.jsx("p",{style:{color:o?"#155724":"#721c24",fontWeight:"bold"},children:o?"✓ Correct!":"✗ Review this."}),e.jsx("p",{style:{fontSize:"13px",color:o?"#155724":"#721c24"},children:t.explanation})]})]},n)}),e.jsx("button",{onClick:()=>N(!v),style:{marginTop:"20px",padding:"10px 20px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontWeight:"bold"},"aria-label":"Show final assessment results",children:v?"Hide Feedback":"Show Feedback"}),v&&e.jsxs("div",{style:{marginTop:"20px",padding:"20px",backgroundColor:"#e8f5e9",borderRadius:"6px",border:"2px solid #4CAF50"},children:[e.jsx("h3",{style:{color:"#2e7d32"},children:"Assessment Score"}),e.jsxs("p",{style:{fontSize:"32px",fontWeight:"bold",color:"#2e7d32"},children:[y,"%"]}),e.jsxs("p",{style:{marginTop:"12px",lineHeight:"1.6"},children:[y>=80&&"Excellent! You have mastered the material. You are ready to deploy with confidence.",y>=60&&y<80&&"Good progress! Review the sections where you had difficulty, especially around incident response and event design.",y<60&&"Keep learning! Re-read sections on testing strategy, deployment checklists, and event finality. Practice with the lab."]})]})]}),e.jsxs("div",{style:{marginTop:"40px",display:"flex",gap:"12px",justifyContent:"space-between"},children:[e.jsx("button",{onClick:F,disabled:c===0,style:{padding:"10px 20px",backgroundColor:c===0?"#ccc":"#2196F3",color:"white",border:"none",borderRadius:"4px",cursor:c===0?"not-allowed":"pointer",fontWeight:"bold"},"aria-label":"Previous section",children:"← Previous"}),e.jsx("button",{onClick:()=>S(!x),style:{padding:"10px 20px",backgroundColor:"#FF9800",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontWeight:"bold"},"aria-label":"Toggle answer visibility",children:x?"Hide Answers":"Show Answers"}),e.jsx("button",{onClick:L,style:{padding:"10px 20px",backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontWeight:"bold"},"aria-label":"Reset module",children:"Reset Activity"}),e.jsx("button",{onClick:M,disabled:c===u.length-1,style:{padding:"10px 20px",backgroundColor:c===u.length-1?"#ccc":"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:c===u.length-1?"not-allowed":"pointer",fontWeight:"bold"},"aria-label":"Next section",children:"Next →"})]}),e.jsxs("div",{style:{marginTop:"60px",paddingTop:"20px",borderTop:"1px solid #ddd",fontSize:"12px",color:"#888"},children:[e.jsx("h4",{children:"Further Reading"}),e.jsxs("ul",{style:{lineHeight:"1.8"},children:[e.jsx("li",{children:"Foundry Book: https://book.getfoundry.sh/"}),e.jsx("li",{children:"Hardhat Documentation: https://hardhat.org/"}),e.jsx("li",{children:"Ethereum Yellow Paper (reorg/finality): https://ethereum.org/en/developers/"}),e.jsx("li",{children:"The Graph: https://thegraph.com/ (event indexing)"}),e.jsx("li",{children:"Smart Contract Audit RFPs: CertiK, OpenZeppelin, Trail of Bits"})]})]})]})]})}export{K as default};
