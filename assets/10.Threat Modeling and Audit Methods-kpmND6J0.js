import{r as j,j as e}from"./index-RYRiz1iP.js";const X=()=>{const[k,c]=j.useState("intro"),[f,S]=j.useState(new Set),[n,A]=j.useState({}),[Y,K]=j.useState(!1),[v,C]=j.useState(null),[u,I]=j.useState(!1),[g,w]=j.useState({assets:"",actors:"",boundaries:"",entryPoints:"",submitted:!1}),[p,b]=j.useState({scope:"",methodology:"",threatModel:"",findings:"",remediation:"",submitted:!1}),E=["intro","objectives","section1","section1-quiz","section2","section2-quiz","section3","section3-quiz","section4","section4-quiz","workshop","casestudy","auditexercise","final"],x=s=>{S(d=>new Set([...d,s]))},N=()=>Math.round(f.size/E.length*100),i=(s,d)=>{A(m=>({...m,[s]:d}))},M=()=>{let s=0;const d=15;Object.entries({"final-q1":"trust-boundaries","final-q2":["assets","actors","entry-points"],"final-q3":"logic-bugs","final-q4":["unit-tests","fuzz-invariants","integration"],"final-q5":"solvency"}).forEach(([a,r])=>{const l=n[a];Array.isArray(r)?Array.isArray(l)&&r.length===l.length&&r.every(q=>l.includes(q))&&(s+=3):l===r&&(s+=3)}),C(Math.min(100,s/d*100))},z=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h1",{children:"Module 10: Threat Modeling and Audit Methods"}),e.jsxs("div",{className:"abstract-box",children:[e.jsx("h3",{children:"Abstract"}),e.jsxs("p",{children:["Smart contract security extends far beyond code syntax. This module teaches the foundational discipline of ",e.jsx("strong",{children:"threat modeling"}),"—the systematic identification of what can go wrong, who can make it go wrong, and where security boundaries exist. We then translate threat models into actionable audit practices: static analysis tooling, automated invariant testing via fuzzing, and structured audit reporting. By the end, you will be able to construct a threat model from first principles, interpret static analysis results without false-confidence, design invariants that catch real exploits, and deliver professional, impact-driven audit reports."]})]}),e.jsx("button",{onClick:()=>{x("intro"),c("objectives")},className:"nav-button",children:"Next: Learning Objectives →"})]}),F=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Learning Objectives & Prerequisites"}),e.jsxs("div",{className:"objectives-box",children:[e.jsx("h3",{children:"After completing this module, you will be able to:"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Define security assets, actors, trust boundaries, and attack surfaces for a smart contract system."}),e.jsx("li",{children:"Construct a complete threat model using structured thinking (STRIDE-like reasoning adapted for DeFi)."}),e.jsx("li",{children:"Distinguish between what static analysis can and cannot reliably detect."}),e.jsx("li",{children:"Design and encode security invariants that detect economic exploits and broken assumptions."}),e.jsx("li",{children:"Write a professional audit report with severity ratings, reproducible exploits, and testable remediation."}),e.jsx("li",{children:"Integrate tooling (static analysis, fuzzing) into a CI/CD audit workflow."})]})]}),e.jsxs("div",{className:"prereq-box",children:[e.jsx("h3",{children:"Prerequisites"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Solid understanding of Solidity syntax and EVM semantics (Module 1–3)."}),e.jsx("li",{children:"Familiarity with common vulnerability classes (Module 4: Reentrancy, Module 5: Access Control & Integer Bugs)."}),e.jsx("li",{children:"Basic comfort reading security advisories and GitHub issues."})]})]}),e.jsxs("div",{className:"terms-box",children:[e.jsx("h3",{children:"Key Terms (Define As You Learn)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Threat Model:"})," A structured document describing assets, actors, entry points, and assumptions."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Attack Surface:"})," The set of methods and states where untrusted input enters a system."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trust Boundary:"})," A line separating trusted from untrusted code/data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Invariant:"})," A condition that the contract guarantees will always hold (e.g., totalSupply conservation)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Static Analysis:"})," Automated code inspection without execution."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fuzzing:"})," Randomized testing to discover edge cases and invariant violations."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Audit Severity:"})," A rating (Critical, High, Medium, Low, Informational) reflecting impact and likelihood."]})]})]}),e.jsx("button",{onClick:()=>{x("objectives"),c("section1")},className:"nav-button",children:"Next: Section 1 - Threat Modeling Fundamentals →"})]}),R=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 1: Threat Modeling from First Principles"}),e.jsx("h3",{children:"1.1 Why Threat Modeling?"}),e.jsxs("p",{children:["A threat model is your insurance policy before an exploit happens. Instead of debugging a hack, you ",e.jsx("strong",{children:"proactively ask"}),': "What is my worst-case scenario? Who could attack us? Where are they coming in?" This shifts security from reactive (finding bugs) to preventive (understanding failure modes).']}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Threat modeling is not a one-time document; it is a living map of your system's attack surface."]}),e.jsx("h3",{children:"1.2 The Core Building Blocks"}),e.jsx("p",{children:"Every threat model must define:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Assets:"})," What must be protected? (e.g., user funds, admin keys, oracle data)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Actors:"})," Who has the ability to interact with the contract? (users, admins, attackers, external contracts)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trust Boundaries:"})," Where does control change hands? (e.g., user → contract, contract → oracle)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Assumptions:"}),' What must be true for the contract to be secure? (e.g., "oracle always reports accurately").']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Attack Surfaces:"})," Which functions and state transitions are exploitable?"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Entry Points:"})," How can an attacker trigger malicious behavior?"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dependencies:"})," What external protocols must be trusted?"]})]}),e.jsx("h3",{children:"1.3 A Worked Example: Simple Token Vault"}),e.jsx("p",{children:"Consider a basic vault contract (deposits, withdrawals, governance vote to change fee). Let us build its threat model step by step."}),e.jsx("div",{className:"code-block",children:`// Mini-protocol: TokenVault
// - Users deposit ERC20 tokens and receive vault shares
// - Users can withdraw, receiving pro-rata tokens
// - Governance can vote to change the withdraw fee
// - Admin can pause deposits (but not withdrawals)

contract TokenVault {
    IERC20 public token;
    uint256 public feePercent = 1; // 1% fee
    bool public paused = false;
    address public governance;
    mapping(address => uint256) public shares;
    uint256 public totalShares;
    uint256 public totalAssets;

    function deposit(uint256 amount) external {
        require(!paused, "Paused");
        token.transferFrom(msg.sender, address(this), amount);
        shares[msg.sender] += (amount * totalShares) / totalAssets;
        totalShares += (amount * totalShares) / totalAssets;
        totalAssets += amount;
    }

    function withdraw(uint256 shareAmount) external {
        uint256 assetAmount = (shareAmount * totalAssets) / totalShares;
        uint256 fee = (assetAmount * feePercent) / 100;
        uint256 net = assetAmount - fee;
        shares[msg.sender] -= shareAmount;
        totalShares -= shareAmount;
        totalAssets -= assetAmount;
        token.transfer(msg.sender, net);
    }

    function setFee(uint256 newFee) external {
        require(msg.sender == governance, "Not governance");
        feePercent = newFee;
    }
}`}),e.jsx("h3",{children:"1.4 Building the Threat Model for TokenVault"}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"Assets"}),e.jsxs("ul",{children:[e.jsx("li",{children:"User funds deposited in the vault (ERC20 tokens)."}),e.jsx("li",{children:"Governance voting power (ability to change fees)."}),e.jsx("li",{children:"Admin pause capability."})]})]}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"Actors"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Honest Users:"})," Deposit and withdraw normally."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Governance:"})," Proposes and votes on fee changes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Admin:"})," Can pause deposits."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Malicious User/Attacker:"})," May front-run, reentrancy, or exploit rounding."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"External Token Contract:"})," The ERC20 implementation (may have hooks, may be malicious)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sandwich Bot:"})," Monitors the mempool and reorders transactions."]})]})]}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"Trust Boundaries"}),e.jsx("p",{children:"ASCII diagram of the vault trust boundaries:"}),e.jsx("pre",{children:`
┌─────────────────────────────────────────┐
│   Untrusted Layer (Users, Attackers)    │
└─────────────────────────────────────────┘
                     ↓ (External calls)
┌─────────────────────────────────────────┐
│  Token Vault Contract                   │
│  (Should enforce invariants)             │
└─────────────────────────────────────────┘
                     ↓ (External calls)
┌─────────────────────────────────────────┐
│  ERC20 Token Contract (Untrusted)       │
│  (May be unsafe, have hooks, etc.)      │
└─────────────────────────────────────────┘
                `}),e.jsx("p",{children:"Key boundaries:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"User input → Vault: validate amounts, reentrancy guards."}),e.jsx("li",{children:"Vault → ERC20: assume transferFrom/transfer may fail or reenter."}),e.jsx("li",{children:"Governance call: only authorized address can call setFee."})]})]}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"Assumptions vs. Guarantees"}),e.jsxs("table",{className:"assumption-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Assumption"}),e.jsx("th",{children:"Reality Check"}),e.jsx("th",{children:"Worst Case if Violated"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"ERC20 token is not malicious"}),e.jsx("td",{children:"Many tokens are honest, but some have hooks"}),e.jsx("td",{children:"Reentrancy from token transfer"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"No token transfer will fail mid-call"}),e.jsx("td",{children:"transferFrom can revert or return false"}),e.jsx("td",{children:"Incomplete deposit, inconsistent state"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Governance is trustworthy"}),e.jsx("td",{children:"Governance can be compromised"}),e.jsx("td",{children:"Fee set to 100%, vault becomes inaccessible"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Math does not overflow/underflow"}),e.jsx("td",{children:"Solidity ^0.8 has checked math, but rounding can bite"}),e.jsx("td",{children:"Share calculation loss, unfair distribution"})]})]})]})]}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"Attack Surfaces"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Deposit function:"})," Attacker deposits malicious token with hook, reenters during transfer. Also: rounding abuse if attacker crafts deposit size to steal a share."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Withdraw function:"})," Attacker withdraws during a governance fee change, expecting old fee but getting new one."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"setFee function:"})," If governance is a multi-sig and a signer is compromised, fee can be set to 100% to lock users."]})]})]}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"Entry Points & Dependency Risks"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"ERC20 token dependency:"})," If token blacklists the vault, withdrawals fail. If token has a mint hook, vault state can be corrupted."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Governance contract dependency:"})," Multi-sigs can delay votes. EOA governance is vulnerable to key theft."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Admin pause key:"})," If compromised, vault can be permanently paused."]})]})]}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"}),' Threat modeling often stops at "code audit." But the real security is assumptions about external contracts and human actors. A 0-bug vault can still fail if the governance is compromised or the token is malicious.']}),e.jsx("button",{onClick:()=>{x("section1"),c("section1-quiz")},className:"nav-button",children:"Next: Section 1 Quiz →"})]}),W=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 1: Knowledge Check"}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:'Q1: Which of the following defines a "trust boundary"?'}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"q1",value:"control-change",checked:n.q1==="control-change",onChange:s=>i("q1",s.target.value)}),"A point where control or data ownership changes from trusted to untrusted code"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"q1",value:"network-edge",checked:n.q1==="network-edge",onChange:s=>i("q1",s.target.value)}),"The edge of a blockchain network"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"q1",value:"function-call",checked:n.q1==="function-call",onChange:s=>i("q1",s.target.value)}),"Every function call to an external contract"]})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answer:"})," A. A trust boundary is where assumptions change—e.g., from your code to a third-party token. Distractor B conflates network topology with contract security. Distractor C is too broad; not every external call is a trust boundary if you fully control the contract."]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q2: In the TokenVault example, list three assets that must be protected."}),e.jsx("textarea",{value:n.q2||"",onChange:s=>i("q2",s.target.value),placeholder:"Enter your answer...",rows:3,className:"textarea-input"}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Sample Answer:"})," (1) User funds deposited in the vault, (2) Governance voting power and the right to change fees, (3) Admin pause capability. Any three from: user shares, underlying asset balance, governance keys, admin keys, vault invariants (totalShares conservation)."]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q3: Why is it important to document assumptions?"}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"q3",value:"verify-if-violated",checked:n.q3==="verify-if-violated",onChange:s=>i("q3",s.target.value)}),"So you know what to test and what fails if the assumption is violated"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"q3",value:"impress-auditors",checked:n.q3==="impress-auditors",onChange:s=>i("q3",s.target.value)}),"To impress auditors"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"q3",value:"compliance",checked:n.q3==="compliance",onChange:s=>i("q3",s.target.value)}),"For regulatory compliance"]})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answer:"})," A. Assumptions guide testing strategy and risk acceptance. If you do not document them, you cannot plan around violations. Distractor B and C are side benefits, not the primary reason."]})]}),e.jsx("button",{onClick:()=>{x("section1-quiz"),c("section2")},className:"nav-button",children:"Next: Section 2 - Static Analysis & Tooling →"})]}),D=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 2: Static Analysis and Linting"}),e.jsx("h3",{children:"2.1 What is Static Analysis?"}),e.jsxs("p",{children:["Static analysis is automated code inspection ",e.jsx("strong",{children:"without running the contract"}),". Tools scan Solidity source and bytecode to detect:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Known bug patterns (reentrancy, unchecked transfers, integer overflow in older Solidity)."}),e.jsx("li",{children:"Style and best-practice violations."}),e.jsx("li",{children:"Missing access control."}),e.jsx("li",{children:"Unsafe external calls."})]}),e.jsx("h3",{children:"2.2 What Static Analysis Can Reliably Catch"}),e.jsxs("div",{className:"capability-box",children:[e.jsx("h4",{children:"✓ Strong Detections"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Unchecked transfer return values:"}),' "Did you check if transfer() returned false?"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Missing access control:"}),' "State-changing function is public, not guarded by onlyOwner."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Obvious reentrancy patterns:"}),' "Call to external contract before state update."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Use of tx.origin:"}),' "tx.origin is used for auth, but this is spoofable via delegatecall."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Deprecated functions:"}),' "selfdestruct is dangerous."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Unsafe math:"}),' "Solidity <0.8: subtract before checking if numerator < denominator."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Magic numbers:"}),' "Hard-coded constant should be a named constant."']})]})]}),e.jsx("h3",{children:"2.3 What Static Analysis Often Misses"}),e.jsxs("div",{className:"limitation-box",children:[e.jsx("h4",{children:"✗ Weak or Missing Detections"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Logic bugs:"}),' "The code does what you wrote, not what you meant." E.g., checking `if (a > 0 || b > 0)` when you meant `&&`.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Economic exploits:"}),' "Attacker profits by manipulating price, flash-loaning, or sandwich-attacking the order." Static analysis sees the math is correct but does not see the incentive.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cross-contract composability issues:"}),' "Token A calls Token B calls Token A, and now invariant X is broken." Requires whole-system reasoning.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Oracle manipulation:"}),` "The price feed is stale or can be flash-loaned." Requires understanding the oracle's trust model.`]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Broken invariants due to rounding:"}),' "Shares conservation is off by 1 due to truncation in division." Requires formal reasoning about arithmetic.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Insufficient access control design:"}),' "Function is guarded by onlyOwner, but there is no timelock, so a compromised owner can instantly drain funds." Requires threat model thinking.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Replay attacks:"}),' "If the contract is deployed across two chains and domain separation is missing, a signed message on chain A can replay on chain B." Requires domain knowledge.']})]})]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Static analysis is a ",e.jsx("strong",{children:"necessary but insufficient"}),"security gate. Use it to eliminate obvious mistakes, but do not rely on it for deep logic validation."]}),e.jsx("h3",{children:"2.4 Common Tools & Integration"}),e.jsxs("div",{className:"tool-box",children:[e.jsx("h4",{children:"Slither (Trail of Bits)"}),e.jsxs("p",{children:[e.jsx("strong",{children:"What it does:"})," Analyzes Solidity AST for known patterns. Outputs severity-rated issues (High, Medium, Low, Informational)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Example findings:"})," reentrancy, missing zero-address checks, unused return values, shadowed variables."]}),e.jsx("p",{children:e.jsx("strong",{children:"CI Integration:"})}),e.jsx("pre",{children:`# GitHub Actions example
- name: Run Slither
    run: slither . --exclude-dependencies
    continue-on-error: true  # Do not block CI; report issues but allow merge
`})]}),e.jsxs("div",{className:"tool-box",children:[e.jsx("h4",{children:"Solhint (Standard community linter)"}),e.jsxs("p",{children:[e.jsx("strong",{children:"What it does:"})," Style and best-practice checking. Enforces naming conventions, documenting functions, avoiding gas anti-patterns."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Example rules:"})," camelCase variable names, NatSpec comments on public functions, no use of `now` (deprecated)."]})]}),e.jsxs("div",{className:"tool-box",children:[e.jsx("h4",{children:"Mythril (Consensys)"}),e.jsxs("p",{children:[e.jsx("strong",{children:"What it does:"})," Symbolic execution and bytecode analysis. Can catch some uninitialized storage, unreachable code, and out-of-bounds array access."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Drawback:"})," Slower and more false positives than pattern-matching tools."]})]}),e.jsx("h3",{children:"2.5 Interpreting False Positives and Negatives"}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"False Positive Example"}),e.jsx("p",{children:"Slither flags a reentrancy in this pattern:"}),e.jsx("pre",{children:`function withdraw(uint256 amount) external {
    uint256 balance = balances[msg.sender];
    require(balance >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;  // State update first
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Slither's complaint:"}),' "External call to msg.sender.call before state finalized."']}),e.jsxs("p",{children:[e.jsx("strong",{children:"Reality:"})," State is updated ",e.jsx("strong",{children:"before"})," the call, so reentrancy is blocked. This is a *false positive* (state-update-first is the standard Checks-Effects-Interactions pattern)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Action:"})," Review the flag in context. If it is a false positive, document why in a comment or suppress it in the config."]})]}),e.jsxs("div",{className:"model-box",children:[e.jsx("h4",{children:"False Negative Example"}),e.jsx("p",{children:"A contract uses an oracle price feed to calculate collateral value:"}),e.jsx("pre",{children:`uint256 collateralUSD = (collateralAmount * oraclePrice) / 1e18;
require(collateralUSD >= requiredUSD, "Insufficient collateral");`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Static analysis result:"})," No finding (math is syntactically correct)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Reality:"})," If the oracle can be flashloan-attacked or is stale, an attacker can inflate collateralUSD, then dump collateral at the real price off-chain and profit. This is a *false negative* (tool missed it because it does not reason about external data)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Action:"})," Add invariant testing or manual review for oracle dependencies."]})]}),e.jsx("h3",{children:"2.6 Best Practices for Tooling in CI/CD"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Run tools early:"})," Integrate Solhint in pre-commit hooks; run Slither on every PR."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Do not let tool failures block merges:"})," Treat static analysis as a signal, not a gate. Allow merge with auditor sign-off on reviewed issues."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Suppress known false positives:"})," Document why in a config file so reviewers understand the override."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Layer multiple tools:"})," Slither + Solhint + Mythril catch different patterns. More coverage, more false positives, but fewer blind spots."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Track findings over time:"})," If Slither reports 10 issues on v1 and 3 on v2, verify that 7 were fixed (not suppressed)."]})]}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"}),' Teams run static analysis once, see 100 "issues," and either (a) ignore all of them or (b) spend days "fixing" style warnings. Instead, triage by severity, fix true positives, suppress false positives with justification, and iterate. Automated tools are a starting point, not the finish line.']}),e.jsx("button",{onClick:()=>{x("section2"),c("section2-quiz")},className:"nav-button",children:"Next: Section 2 Quiz →"})]}),P=()=>{var s,d,m;return e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 2: Knowledge Check"}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q1: Which of the following is a *false negative* (tool misses it)?"}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s2q1",value:"stale-oracle",checked:n.s2q1==="stale-oracle",onChange:a=>i("s2q1",a.target.value)}),"A stale oracle price used in collateral valuation (attackable via flashloan)"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s2q1",value:"unchecked-return",checked:n.s2q1==="unchecked-return",onChange:a=>i("s2q1",a.target.value)}),"An unchecked return value from transfer()"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s2q1",value:"missing-guard",checked:n.s2q1==="missing-guard",onChange:a=>i("s2q1",a.target.value)}),"A public state-changing function without onlyOwner guard"]})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answer:"})," A. Oracle freshness is an economic trust model issue that static analysis cannot detect; it requires domain knowledge and testing. B and C are classic static analysis findings that tools reliably catch."]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q2: Which of the following should you do with a static analysis tool finding? (Select all that apply)"}),e.jsxs("div",{className:"quiz-options multi",children:[e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"s2q2",value:"context-review",checked:((s=n.s2q2)==null?void 0:s.includes("context-review"))||!1,onChange:a=>{const r=n.s2q2||[];a.target.checked?i("s2q2",[...r,"context-review"]):i("s2q2",r.filter(l=>l!=="context-review"))}}),"Review the finding in context to understand if it is a true positive or false positive"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"s2q2",value:"always-suppress",checked:((d=n.s2q2)==null?void 0:d.includes("always-suppress"))||!1,onChange:a=>{const r=n.s2q2||[];a.target.checked?i("s2q2",[...r,"always-suppress"]):i("s2q2",r.filter(l=>l!=="always-suppress"))}}),"Always suppress findings to reduce noise"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"s2q2",value:"document-decision",checked:((m=n.s2q2)==null?void 0:m.includes("document-decision"))||!1,onChange:a=>{const r=n.s2q2||[];a.target.checked?i("s2q2",[...r,"document-decision"]):i("s2q2",r.filter(l=>l!=="document-decision"))}}),"If you suppress or dismiss a finding, document why in a comment or config file"]})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answer:"})," A and C. Always review findings in context and document your decisions. Indiscriminate suppression (B) defeats the purpose of tooling and hides real issues."]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q3: What is the main difference between Slither and Solhint?"}),e.jsx("textarea",{value:n.s2q3||"",onChange:a=>i("s2q3",a.target.value),placeholder:"Enter your answer...",rows:3,className:"textarea-input"}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Sample Answer:"})," Slither focuses on *security* patterns and known vulns (reentrancy, unsafe calls). Solhint focuses on *style* and *best practices* (naming, documentation, gas optimization). Different goals; run both."]})]}),e.jsx("button",{onClick:()=>{x("section2-quiz"),c("section3")},className:"nav-button",children:"Next: Section 3 - Fuzzing & Invariants →"})]})},O=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 3: Fuzzing, Invariants, and Property-Based Testing"}),e.jsx("h3",{children:"3.1 Why Invariants?"}),e.jsxs("p",{children:["An ",e.jsx("strong",{children:"invariant"})," is a condition that must always hold in a correct contract. For a token vault:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sum invariant:"})," ∑(user shares) == totalShares."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Solvency invariant:"})," totalAssets >= sum of all redeemable tokens."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Monotonicity invariant:"})," totalAssets must be non-decreasing (or decrease only via fees)."]})]}),e.jsxs("p",{children:['Instead of asking "is this function correct?", you ask "did this operation preserve the invariants?" This is ',e.jsx("strong",{children:"property-based testing"}),": you define the property (invariant) and let a fuzzer try to break it."]}),e.jsx("h3",{children:"3.2 Designing Invariants"}),e.jsx("p",{children:"Good invariants are:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Precise:"}),' Not vague ("system is secure") but measurable ("balance[A] + balance[B] == totalSupply").']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Testable:"})," Can be encoded as a function that returns true/false."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tight:"}),' Not so loose that they never fail (e.g., "totalSupply >= 0" is always true in Solidity).']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Meaningful:"})," If broken, it indicates a real vulnerability."]})]}),e.jsx("h3",{children:"3.3 Encoding Invariants in Solidity"}),e.jsx("div",{className:"code-block",children:`// TokenVault with explicit invariant functions
contract TokenVault {
    // ... state and functions ...

    // Invariant 1: Sum of all shares equals totalShares
    function invariant_shareConservation() public view returns (bool) {
        // In practice, you'd track all users and sum them; 
        // for simplicity, this is a manual check:
        return totalShares >= 0; // IN REAL CODE, sum all users' shares
    }

    // Invariant 2: totalAssets >= tokens locked in contract
    function invariant_solvency() public view returns (bool) {
        uint256 actualBalance = IERC20(token).balanceOf(address(this));
        return totalAssets <= actualBalance + 100; // +100 for rounding slack
    }

    // Invariant 3: No user can have more shares than totalShares
    function invariant_sharesValid() public view returns (bool) {
        // Ensure shares[addr] is always <= totalShares
        // Again, need to track all users in a real implementation
        return true; // Placeholder
    }

    // Invariant 4: Withdraw amount is always >= what user should receive
    // (i.e., we do not lose user's pro-rata share)
    function invariant_shareValue() public view returns (bool) {
        // For each user, user_share_value >= (user_shares / totalShares) * totalAssets
        return true; // Placeholder
    }
}`}),e.jsx("h3",{children:"3.4 Fuzzing Frameworks"}),e.jsx("p",{children:"Two main approaches:"}),e.jsxs("div",{className:"tool-box",children:[e.jsx("h4",{children:"Echidna (Trail of Bits)"}),e.jsxs("p",{children:[e.jsx("strong",{children:"How it works:"})," Generates random sequences of contract calls and checks if invariants remain true. If an invariant fails, Echidna shrinks the counterexample to the minimal sequence that breaks it."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Example:"})," Fuzz the TokenVault with random deposit/withdraw sequences. If totalShares ever becomes < 0, or solvency fails, Echidna will find it."]}),e.jsx("pre",{children:`# Echidna config
echidna . --contract TokenVault --test-limit 10000
`})]}),e.jsxs("div",{className:"tool-box",children:[e.jsx("h4",{children:"Foundry Fuzz Testing"}),e.jsxs("p",{children:[e.jsx("strong",{children:"How it works:"})," Integrated into Foundry test framework. Write fuzz tests that take parameterized inputs; Foundry tries random values."]}),e.jsx("pre",{children:`// Foundry fuzz test
function testWithdrawalPreservesSolvency(uint256 amount) public {
    amount = bound(amount, 1, MAX_DEPOSIT);
    vault.deposit(amount);
    
    uint256 before = vault.invariant_solvency() ? 1 : 0;
    vault.withdraw(vault.shares(address(this)));
    uint256 after = vault.invariant_solvency() ? 1 : 0;
    
    assert(after == 1, "Solvency broken!");
}`})]}),e.jsx("h3",{children:"3.5 What Fuzzing Catches Well"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Rounding errors:"})," Over 10,000 random deposit/withdrawal sequences, a 1-wei loss per operation accumulates and breaks conservation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"State machine violations:"})," Fuzzer tries unexpected state transitions: e.g., withdraw before deposit, setFee during withdrawal, pause during withdrawal."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Overflow/underflow in calculation:"})," Even with checked math, rounding can cause underflow if not careful."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reentrancy under specific conditions:"})," If a fuzzer finds a sequence (callA, callB, callA) that breaks invariants, reentrancy may be the cause."]})]}),e.jsx("h3",{children:"3.6 What Fuzzing Misses"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Incorrect invariant definitions:"})," If you write an invariant that should fail but doesn't, fuzzing will not catch it."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Economic exploits requiring off-chain knowledge:"}),' "Attacker buys governance tokens from Uniswap" requires integration testing with mocked DEX.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Complex oracle or cross-chain interactions:"})," Fuzzer does not know how oracle behaves in extreme scenarios."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Gas limit attacks:"})," Fuzzer may not explore state space large enough to hit gas limits."]})]}),e.jsx("h3",{children:"3.7 Common Invariants by System Type"}),e.jsxs("div",{className:"invariant-table",children:[e.jsx("h4",{children:"Example Invariants for Common Systems"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"System Type"}),e.jsx("th",{children:"Invariant"}),e.jsx("th",{children:"Why It Matters"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Token or Vault"}),e.jsx("td",{children:"∑(balances[user]) == totalSupply"}),e.jsx("td",{children:"Catch double-spending or lost tokens"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Staking Contract"}),e.jsx("td",{children:"totalStaked == ∑(stakes[user]); totalStaked <= ERC20.balanceOf(this)"}),e.jsx("td",{children:"Ensure staked amount matches locked funds"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Lending Protocol"}),e.jsx("td",{children:"totalBorrows <= totalAssets (accounting for reserves) "}),e.jsx("td",{children:"Catch over-lending or insolvency"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"NFT Marketplace"}),e.jsx("td",{children:"No user's NFT can be listed twice; escrow balance >= sum of escrowed amounts"}),e.jsx("td",{children:"Prevent double-selling and fund loss"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Governance"}),e.jsx("td",{children:"votingPower[user] <= totalVotingPower; quorum must be met for approval"}),e.jsx("td",{children:"Prevent vote manipulation and tyranny of the minority"})]})]})]})]}),e.jsx("h3",{children:"3.8 Combining Unit, Integration, and Fuzzing Tests"}),e.jsx("p",{children:"Build a testing pyramid:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Unit tests:"}),' Test single functions with known inputs. E.g., "calling withdraw(100) should reduce shares by 100."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Integration tests:"}),' Test multi-step workflows. E.g., "deposit 1000, then withdraw 500, then check balance is correct."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fuzz/invariant tests:"}),' Test that invariants hold under random sequences. E.g., "after any sequence of deposits and withdrawals, solvency holds."']})]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Fuzzing is most powerful when paired with crisp invariants. Invest time defining invariants; the fuzzer does the rest."]}),e.jsx("button",{onClick:()=>{x("section3"),c("section3-quiz")},className:"nav-button",children:"Next: Section 3 Quiz →"})]}),L=()=>{var s,d,m;return e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 3: Knowledge Check"}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q1: What is the main goal of fuzzing in contract security?"}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s3q1",value:"random-testing",checked:n.s3q1==="random-testing",onChange:a=>i("s3q1",a.target.value)}),"To generate random test data and hope we find a bug"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s3q1",value:"invariant-checking",checked:n.s3q1==="invariant-checking",onChange:a=>i("s3q1",a.target.value)}),"To verify that defined invariants hold under a wide range of state transitions"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s3q1",value:"gas-optimization",checked:n.s3q1==="gas-optimization",onChange:a=>i("s3q1",a.target.value)}),"To measure gas consumption"]})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answer:"})," B. Fuzzing is directed property-based testing. You define invariants (properties that must always be true), and the fuzzer generates sequences of calls to try to break them. Distractor A is passive; distractor C is unrelated."]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q2: Which of the following is a good invariant for a staking contract? (Select all that apply)"}),e.jsxs("div",{className:"quiz-options multi",children:[e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"s3q2",value:"sum-stakes",checked:((s=n.s3q2)==null?void 0:s.includes("sum-stakes"))||!1,onChange:a=>{const r=n.s3q2||[];a.target.checked?i("s3q2",[...r,"sum-stakes"]):i("s3q2",r.filter(l=>l!=="sum-stakes"))}}),"Sum of all user stakes equals totalStaked"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"s3q2",value:"all-positive",checked:((d=n.s3q2)==null?void 0:d.includes("all-positive"))||!1,onChange:a=>{const r=n.s3q2||[];a.target.checked?i("s3q2",[...r,"all-positive"]):i("s3q2",r.filter(l=>l!=="all-positive"))}}),"All stake amounts are non-negative"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"s3q2",value:"total-locked",checked:((m=n.s3q2)==null?void 0:m.includes("total-locked"))||!1,onChange:a=>{const r=n.s3q2||[];a.target.checked?i("s3q2",[...r,"total-locked"]):i("s3q2",r.filter(l=>l!=="total-locked"))}}),"totalStaked <= ERC20.balanceOf(contract) (ensures tokens are actually locked)"]})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answer:"})," A, B, and C. All three are meaningful: A catches lost or double-staked amounts, B is enforced by Solidity but documenting it is good practice, C ensures the contract is solvent (cannot promise more staking rewards than it has tokens)."]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q3: Describe one scenario where fuzzing would catch a bug that unit tests might miss."}),e.jsx("textarea",{value:n.s3q3||"",onChange:a=>i("s3q3",a.target.value),placeholder:"Enter your answer...",rows:4,className:"textarea-input"}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Sample Answer:"}),' A unit test might check "deposit 100, withdraw 100." Fuzzing might generate "deposit 7, withdraw 3, deposit 5, withdraw 1, deposit 100, withdraw 108" and discover that rounding errors accumulate, breaking the conservation invariant. Or fuzzing might find that calling setFee(100) during a withdrawal breaks the fee accounting.']})]}),e.jsx("button",{onClick:()=>{x("section3-quiz"),c("section4")},className:"nav-button",children:"Next: Section 4 - Audit Reporting →"})]})},U=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 4: Audit Deliverables and Reporting"}),e.jsx("h3",{children:"4.1 The Purpose of an Audit Report"}),e.jsxs("p",{children:["An audit report is a ",e.jsx("strong",{children:"risk-management document"}),". It answers:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"What was reviewed and with what methodology?"}),e.jsx("li",{children:"What assumptions did we make about the system?"}),e.jsx("li",{children:"What are the security risks, ranked by severity?"}),e.jsx("li",{children:"How can each risk be fixed?"}),e.jsx("li",{children:"What are the residual risks we are accepting?"})]}),e.jsxs("p",{children:["A good report is ",e.jsx("strong",{children:"actionable:"})," a developer should be able to read it and implement fixes; a business stakeholder should understand the impact and prioritize resources."]}),e.jsx("h3",{children:"4.2 Audit Report Structure"}),e.jsxs("div",{className:"report-structure",children:[e.jsx("h4",{children:"1. Executive Summary (1–2 pages)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"1-2 sentence overview of the system."}),e.jsx("li",{children:"Critical or high-severity findings (if any)."}),e.jsx("li",{children:'Confidence level ("Low risk," "Moderate risk," "High risk").'}),e.jsx("li",{children:"Recommendation: deploy, require fixes, or do not deploy."})]}),e.jsx("h4",{children:"2. Scope & Methodology (1–2 pages)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Which contracts/functions were reviewed."}),e.jsx("li",{children:'Which were out of scope (e.g., "We did not review the external oracle contract").'}),e.jsx("li",{children:"Tools used: Slither, Echidna, manual review, Mythril."}),e.jsx("li",{children:'Assumptions: e.g., "We assumed the ERC20 token is not malicious," "Admins are trusted," "No flash-loan attacks."'}),e.jsx("li",{children:"Timeline: hours spent, review depth."})]}),e.jsx("h4",{children:"3. Threat Model Summary (1–2 pages)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Key assets and actors (from Section 1)."}),e.jsx("li",{children:"Trust boundaries and external dependencies."}),e.jsx("li",{children:"Known attack vectors: rounding, oracle starkness, reentrancy, etc."})]}),e.jsx("h4",{children:"4. Findings (Variable length)"}),e.jsx("p",{children:"For each finding:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Title:"})," Red Hat's Privilege Escalation in setFee()."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Severity:"})," Critical / High / Medium / Low / Informational (see rubric below)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Description:"})," What is the issue?"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Impact:"}),' What happens if this is exploited? (e.g., "Attacker steals $1M in user funds").']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Likelihood:"}),' How easy is it to exploit? (e.g., "Trivial; a single txn with public function").']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Proof of Concept (PoC):"})," Code or sequence that demonstrates the bug."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Remediation:"})," How to fix it (with code example if possible)."]})]}),e.jsx("h4",{children:"5. Severity Rubric"}),e.jsxs("table",{className:"severity-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Severity"}),e.jsx("th",{children:"Impact"}),e.jsx("th",{children:"Likelihood"}),e.jsx("th",{children:"Examples"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:"Critical"})}),e.jsx("td",{children:"Direct loss of user funds or total protocol failure"}),e.jsx("td",{children:"Trivial; no special conditions"}),e.jsx("td",{children:"Reentrancy in withdraw; unchecked transfer; missing access control on critical function"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:"High"})}),e.jsx("td",{children:"Significant loss of funds or major functionality breakdown"}),e.jsx("td",{children:"Easy; requires minimal attacker setup or miner collusion"}),e.jsx("td",{children:"Oracle manipulation; insufficient validation; broken invariant under specific conditions"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:"Medium"})}),e.jsx("td",{children:"Partial loss or limited DoS"}),e.jsx("td",{children:"Moderate; requires some external condition or attacker sophistication"}),e.jsx("td",{children:"Unnecessary revert on edge case; expensive operation; rounding loss of 1 wei per 1M txns"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:"Low"})}),e.jsx("td",{children:"Minimal impact; quality-of-life issue"}),e.jsx("td",{children:"Difficult or requires multiple failures"}),e.jsx("td",{children:"Missing event; suboptimal gas usage; style issue"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:"Informational"})}),e.jsx("td",{children:"No direct impact; educational"}),e.jsx("td",{children:"N/A"}),e.jsx("td",{children:"Code comment suggestion; architecture note; gas tip"})]})]})]}),e.jsx("h4",{children:"6. Risk Acceptance (1–2 pages)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Which findings were acknowledged but not fixed (and why)."}),e.jsx("li",{children:'What is the residual risk? E.g., "We accept the oracle latency risk because (1) Uniswap TWAP is resistant to short-term attacks, (2) our price bounds allow 5% slippage, (3) we monitor off-chain."'})]}),e.jsx("h4",{children:"7. Conclusion"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Overall assessment: system is ready for production, or needs changes."}),e.jsx("li",{children:"Verification: statement that fixes were re-reviewed if applicable."})]})]}),e.jsx("h3",{children:"4.3 Writing a Finding: The Full Example"}),e.jsxs("div",{className:"finding-example",children:[e.jsx("h4",{children:"Finding: Unguarded setFee Allows Arbitrary Fee Changes"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Severity:"})," High"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Description:"})," The setFee() function in TokenVault requires that msg.sender == governance, but governance is an EOA address set at initialization. There is no governance contract, multi-sig, or timelock. If the governance private key is compromised or lost, the protocol is unmanageable or arbitrarily ruined."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Impact:"})," An attacker who compromises the governance EOA can set feePercent to 100%, making all withdrawals revert (fee > assetAmount). This effectively locks user funds forever, resulting in a complete loss of confidence and potential liability."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Likelihood:"})," High. EOA key compromise is a well-known risk vector. Governance keys are frequent targets."]}),e.jsx("p",{children:e.jsx("strong",{children:"Proof of Concept:"})}),e.jsx("pre",{children:`
// Assume attacker has compromised the governance EOA
address attacker = # compromised governance key
vault.setFee(100); // Fee is now 100%

// Any user's withdrawal reverts
uint256 assetAmount = (shareAmount * totalAssets) / totalShares;
uint256 fee = (assetAmount * feePercent) / 100; // fee == assetAmount
uint256 net = assetAmount - fee; // net == 0, but reverts if net < minAmount
// -> User cannot withdraw
`}),e.jsx("p",{children:e.jsx("strong",{children:"Remediation:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Replace the governance EOA with a multi-sig wallet (e.g., Gnosis Safe) or a governance token + voting contract."}),e.jsx("li",{children:"Add a timelock: new fee only takes effect 48 hours after proposal, giving users time to farm or withdraw."}),e.jsx("li",{children:'Add bounds on fee: require(newFee <= 50, "Fee capped at 50%") to prevent 100% fees.'}),e.jsx("li",{children:"Add a pause mechanism that governance can trigger, but not setFee."})]}),e.jsx("p",{children:e.jsx("strong",{children:"Recommended Fix (Code):"})}),e.jsx("pre",{children:`
// Upgrade to Gnosis Safe multi-sig
address safe = 0x...; // 3-of-5 multi-sig
uint256 feeChangeDelay = 48 hours;
uint256 pendingFee;
uint256 feeChangeTime;

function proposeFeeChange(uint256 newFee) external {
    require(msg.sender == safe, "Only governance can propose");
    require(newFee <= 50, "Fee capped at 50%");
    pendingFee = newFee;
    feeChangeTime = block.timestamp + feeChangeDelay;
}

function executeFeeChange() external {
    require(block.timestamp >= feeChangeTime, "Timelock not elapsed");
    feePercent = pendingFee;
}
`})]}),e.jsx("h3",{children:"4.4 Red Flags in Audit Reports"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Vague findings:"}),' "Code quality issues found" without specifics.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Missing PoCs:"})," A finding without a PoC is hard to believe or reproduce."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"No remediation:"})," Auditor points out a problem but offers no fix."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ignored assumptions:"})," Report does not mention external dependencies (e.g., oracle or multi-sig governance) that could fail."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Overstated severity:"})," A style issue marked Critical."]})]}),e.jsx("h3",{children:"4.5 Audit Checklist for Reviewers"}),e.jsxs("ul",{children:[e.jsx("li",{children:"[ ] Threat model documented and realistic?"}),e.jsx("li",{children:"[ ] Scope is clear: in vs. out?"}),e.jsx("li",{children:"[ ] All Critical/High findings have PoCs?"}),e.jsx("li",{children:'[ ] Remediation is specific and testable (not "improve security")?'}),e.jsx("li",{children:'[ ] Risk acceptance is explicit: "We accept this because..."?'}),e.jsx("li",{children:'[ ] No unexplained false negatives: "This tool found X, why did not Slither?"'}),e.jsx("li",{children:"[ ] Assumptions are reasonable and documented?"})]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," An audit report is a ",e.jsx("strong",{children:"negotiation"})," between the auditor (what can go wrong) and the team (what we can afford to fix). A great report helps the team make informed bets about which risks to accept."]}),e.jsx("button",{onClick:()=>{x("section4"),c("section4-quiz")},className:"nav-button",children:"Next: Section 4 Quiz →"})]}),B=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Section 4: Knowledge Check"}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:'Q1: A finding is marked "Critical." What must it contain at minimum?'}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s4q1",value:"description",checked:n.s4q1==="description",onChange:s=>i("s4q1",s.target.value)}),"Just a description of the problem"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s4q1",value:"poc-remediation",checked:n.s4q1==="poc-remediation",onChange:s=>i("s4q1",s.target.value)}),"A PoC demonstrating the issue and a specific, testable remediation"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"s4q1",value:"severity-only",checked:n.s4q1==="severity-only",onChange:s=>i("s4q1",s.target.value)}),"Just the severity rating"]})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answer:"})," B. A Critical finding is actionable only if the team can reproduce and fix it. PoC + remediation are non-negotiable. Distractor A is incomplete; distractor C is useless."]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:'Q2: Why should an audit report include a "Risk Acceptance" section?'}),e.jsx("textarea",{value:n.s4q2||"",onChange:s=>i("s4q2",s.target.value),placeholder:"Enter your answer...",rows:3,className:"textarea-input"}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Sample Answer:"}),' Risk acceptance clarifies that the team is aware of a finding (e.g., oracle latency risk) and has decided it is acceptable given mitigations (e.g., TWAP, monitoring) or business constraints. It shifts responsibility from "auditor missed this" to "team accepted this." This is critical for liability and decision-making.']})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q3: Match each to its severity:"}),e.jsxs("div",{className:"matching-questions",children:[e.jsx("div",{className:"match-item",children:e.jsxs("label",{children:['"A missing event emitted in a state-changing function"',e.jsxs("select",{value:n.s4q3a||"",onChange:s=>i("s4q3a",s.target.value),children:[e.jsx("option",{value:"",children:"-- Select --"}),e.jsx("option",{value:"critical",children:"Critical"}),e.jsx("option",{value:"high",children:"High"}),e.jsx("option",{value:"medium",children:"Medium"}),e.jsx("option",{value:"low",children:"Low"}),e.jsx("option",{value:"info",children:"Informational"})]})]})}),e.jsx("div",{className:"match-item",children:e.jsxs("label",{children:['"Unguarded setFee() allows attacker to set fee to 100%, locking users"',e.jsxs("select",{value:n.s4q3b||"",onChange:s=>i("s4q3b",s.target.value),children:[e.jsx("option",{value:"",children:"-- Select --"}),e.jsx("option",{value:"critical",children:"Critical"}),e.jsx("option",{value:"high",children:"High"}),e.jsx("option",{value:"medium",children:"Medium"}),e.jsx("option",{value:"low",children:"Low"}),e.jsx("option",{value:"info",children:"Informational"})]})]})}),e.jsx("div",{className:"match-item",children:e.jsxs("label",{children:['"Rounding loss of 1 wei per every billion-token withdrawal"',e.jsxs("select",{value:n.s4q3c||"",onChange:s=>i("s4q3c",s.target.value),children:[e.jsx("option",{value:"",children:"-- Select --"}),e.jsx("option",{value:"critical",children:"Critical"}),e.jsx("option",{value:"high",children:"High"}),e.jsx("option",{value:"medium",children:"Medium"}),e.jsx("option",{value:"low",children:"Low"}),e.jsx("option",{value:"info",children:"Informational"})]})]})})]}),u&&e.jsxs("div",{className:"answer-reveal",children:[e.jsx("strong",{children:"Answers:"})," Missing event = Informational (nice-to-have, no security impact). Unguarded setFee = Critical (direct loss of user funds). Tiny rounding = Low (impact is negligible, only matters at extreme scale)."]})]}),e.jsx("button",{onClick:()=>{x("section4-quiz"),c("workshop")},className:"nav-button",children:"Next: Interactive Threat Modeling Workshop →"})]}),H=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Interactive Workshop: Build a Threat Model"}),e.jsx("p",{children:"In this activity, you will create a threat model for a simplified borrowing protocol. Review the spec and fill in the key components below."}),e.jsx("h3",{children:"Protocol Specification: SimpleLend"}),e.jsxs("div",{className:"spec-box",children:[e.jsx("h4",{children:"SimpleLend Overview"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Users deposit ERC20 stablecoins (USDC) to a lending pool."}),e.jsx("li",{children:"Borrowers can take loans up to 80% of their collateral value (computed via a Chainlink price oracle)."}),e.jsx("li",{children:"Loans accrue interest daily (1% per day, compounded)."}),e.jsx("li",{children:"A liquidation bot monitors undercollateralized loans and sells collateral to repay debt."}),e.jsx("li",{children:"Admin can set the collateral ratio and interest rate."})]})]}),e.jsxs("div",{className:"workshop-section",children:[e.jsx("h3",{children:"Step 1: Identify Assets"}),e.jsx("p",{children:"What critical assets must SimpleLend protect? List at least 3."}),e.jsx("textarea",{value:g.assets,onChange:s=>w({...g,assets:s.target.value}),placeholder:"Example: User deposits (USDC), Borrower collateral (ETH, USDC), Admin keys...",rows:4,className:"textarea-input"})]}),e.jsxs("div",{className:"workshop-section",children:[e.jsx("h3",{children:"Step 2: Identify Actors"}),e.jsx("p",{children:"Who can interact with SimpleLend? List the actors and their roles."}),e.jsx("textarea",{value:g.actors,onChange:s=>w({...g,actors:s.target.value}),placeholder:"Example: Honest lender (deposits and waits for interest), dishonest borrower (defaults)...",rows:4,className:"textarea-input"})]}),e.jsxs("div",{className:"workshop-section",children:[e.jsx("h3",{children:"Step 3: Define Trust Boundaries"}),e.jsx("p",{children:"Where does control transfer between trusted and untrusted parties?"}),e.jsx("textarea",{value:g.boundaries,onChange:s=>w({...g,boundaries:s.target.value}),placeholder:"Example: User input -> SimpleLend contract; SimpleLend -> Chainlink Oracle; SimpleLend -> liquidator (untrusted)...",rows:4,className:"textarea-input"})]}),e.jsxs("div",{className:"workshop-section",children:[e.jsx("h3",{children:"Step 4: Attack Surface"}),e.jsx("p",{children:"Where can attackers exploit SimpleLend? List 2–3 potential attack vectors."}),e.jsx("textarea",{value:g.entryPoints,onChange:s=>w({...g,entryPoints:s.target.value}),placeholder:"Example: Flash-loan a stablecoin, wait for oracle price to spike, take a massive loan...",rows:4,className:"textarea-input"})]}),e.jsx("button",{onClick:()=>w({...g,submitted:!0}),className:"nav-button",children:"Submit & Compare to Reference Answer"}),g.submitted&&e.jsxs("div",{className:"reference-answer",children:[e.jsx("h3",{children:"Reference Threat Model"}),e.jsxs("div",{className:"ref-section",children:[e.jsx("h4",{children:"Assets:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Lender deposits (USDC locked in pool)."}),e.jsx("li",{children:"Borrower collateral (ETH or other assets pledged)."}),e.jsx("li",{children:"Admin keys (power to change collateral ratio and interest rate)."}),e.jsx("li",{children:"Oracle feed (Chainlink price; if manipulated, collateral valuation fails)."}),e.jsx("li",{children:"Liquidation incentives (bot may collude with borrowers or manipulate market)."})]})]}),e.jsxs("div",{className:"ref-section",children:[e.jsx("h4",{children:"Actors:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Honest Lender:"})," Deposits USDC, earns interest, withdraws later."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Honest Borrower:"})," Pledges collateral, takes a loan, repays on time."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dishonest Borrower:"})," Takes a loan and defaults, hoping collateral value drops."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Liquidator Bot:"})," Monitors loans and sells undercollateralized collateral. May be compromised or manipulated."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Admin:"})," Trusted but may be compromised; can change rates and collateral ratios."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Oracle Operator (Chainlink):"})," Report prices; we trust them but must account for staleness/manipulation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Attacker (Flash-loaner, arbitrageur):"})," Uses flash loans and DEX manipulations to exploit the protocol."]})]})]}),e.jsxs("div",{className:"ref-section",children:[e.jsx("h4",{children:"Trust Boundaries:"}),e.jsx("pre",{children:`┌─────────────────────────────────────┐
│  Lender/Borrower (Untrusted Users)  │
└──────────────────┬──────────────────┘
                                     ↓ (Deposits, borrows)
┌──────────────────────────────────────┐
│  SimpleLend Contract                 │
│  (Core logic, accounting)            │
└──────────────────┬──────────────────┘
            ↓ (Oracle price) | ↓ (Transfer)
┌─────────────────────────────────────┐
│  Chainlink Oracle  │  USDC Token     │
│  (External Trust)  │  (ERC20 impl.)  │
└─────────────────────────────────────┘
`})]}),e.jsxs("div",{className:"ref-section",children:[e.jsx("h4",{children:"Attack Surfaces (Top 3):"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Oracle price manipulation:"})," Flash-lend a large amount of ETH on Uniswap, drive ETH price down, then borrow against now-cheap collateral. Liquidator does not trigger (price only temporary)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Liquidation front-running:"})," Liquidator sees a loan underwater in mempool. Attacker fronts the liquidation, buys the collateral cheaper, sells it for profit while liquidator loses on slippage."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Admin collusion:"})," Admin lowers collateral ratio to 10%, allowing a borrower to overborrow. Both profit if collateral value fails."]})]})]}),e.jsxs("p",{className:"workshop-note",children:[e.jsx("strong",{children:"Your model is strong if it covers:"})," external dependencies (oracle, token), external actors (liquidator, flash-loaner), and multi-actor collusion (admin + borrower). Economic incentives matter as much as code bugs."]})]}),e.jsx("button",{onClick:()=>{x("workshop"),c("casestudy")},className:"nav-button",children:"Next: Case Study - A Real Exploit →"})]}),Q=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:'Case Study: Yield Protocol "Trust Boundary" Exploit (2023)'}),e.jsx("h3",{children:"The System"}),e.jsx("p",{children:'Yield Protocol is a fixed-rate lending protocol. Users can lend out stablecoins via "fyTokens" (fixed-yield tokens) or borrow by putting up collateral. The protocol uses an oracle to price collateral and dynamically adjusts borrow rates.'}),e.jsx("h3",{children:"The Threat Model (Stated by Yield)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Assumption:"}),' "The oracle is a reliable price feed; it may be 1 hour stale but not worse."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Assumption:"}),' "The collateral (USDC, wETH) is liquid and can be liquidated quickly."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trust boundary:"}),' "Contracts are upgradeable via a multi-sig governance. Multi-sig is 5-of-8, trusted."']})]}),e.jsx("h3",{children:"The Attack"}),e.jsx("p",{children:"In March 2023, a liquidation event occurred:"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Market turmoil:"})," A major stablecoin (USDC) briefly depegged to $0.87 on some DEXs (due to bank-run fears). The oracle was stale and reported $0.99."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Liquidation cascade:"})," As USDC-denominated collateral fell in real value, liquidators triggered liquidations based on the oracle price ($0.99), not the real market price ($0.87)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bad liquidations:"})," Liquidators sold collateral for $0.87 USDC to repay debt valued at $0.99, resulting in a ~$12M loss that was not recovered."]})]}),e.jsx("h3",{children:"What Went Wrong"}),e.jsxs("p",{children:["The threat model ",e.jsx("strong",{children:"failed to account for oracle staleness under extreme market conditions"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Assumption violated:"}),' "Oracle is at most 1 hour stale" did not hold during the TVL crisis. Oracle fell behind by 3+ hours as DEXs were congested.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trust boundary ignored:"}),' The protocol treated oracle data as "trusted," but failed to validate against on-chain prices (Uniswap TWAP, Balancer LP rates, etc.).']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Market assumption:"}),' "Collateral is liquid" failed: during bank-run fears, USDC liquidity evaporated, prices diverged across DEXs, and liquidators could not rebalance.']})]}),e.jsx("h3",{children:"Prevention Playbook"}),e.jsxs("div",{className:"playbook-box",children:[e.jsx("h4",{children:"✓ What Yield Should Have Done (Post-Mortem)"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Document oracle assumptions explicitly:"}),' "Oracle is reliable within ±5% and < 30 min staleness under normal conditions. During extreme volatility or network congestion, we may disable liquidations."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Deploy a circuit breaker:"})," If oracle price diverges > 5% from Uniswap TWAP for > 5 min, disable liquidations until they re-converge. (This is exactly what Aave and Compound do.)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Add price bounds:"})," If USDC price reported by oracle is < $0.95, flag it as suspicious and require human review before liquidation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Liquidation grace period:"})," When a loan becomes undercollateralized, wait 2 hours before allowing liquidation, giving markets time to stabilize."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fuzz & invariant test:"}),' Encode invariant: "A borrower never loses more than 2% of collateral value in a liquidation." Fuzz under oracle price scenarios; detect violations.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Threat model audit:"})," Have an external auditor re-review assumptions annually. Market conditions change; assumptions must be re-validated."]})]})]}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"}),' Teams build threat models before mainnet, mark them "complete," and never revisit. But markets evolve, attackers devise new techniques, and off-chain events (regulation, bank failures) can invalidate assumptions. ',e.jsx("strong",{children:"Threat models are living documents."})]}),e.jsx("button",{onClick:()=>{x("casestudy"),c("auditexercise")},className:"nav-button",children:"Next: Hands-On Audit Exercise →"})]}),V=()=>e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Hands-On: Write an Audit Report"}),e.jsx("p",{children:"Below is a mini-protocol specification. You will write an audit-style report covering scope, threat model, and findings. Use the template and guidelines from Section 4."}),e.jsx("h3",{children:"Mini Protocol: SimpleSwap"}),e.jsxs("div",{className:"spec-box",children:[e.jsx("p",{children:"SimpleSwap is a 2-token constant-product AMM (like Uniswap v2). Users deposit liquidity in pairs; traders swap one token for another. There is a 0.3% swap fee. The contract is owned by an EOA admin."}),e.jsx("pre",{children:`contract SimpleSwap {
    IERC20 public token0;
    IERC20 public token1;
    uint256 public reserve0;
    uint256 public reserve1;
    address public owner;

    function addLiquidity(uint256 a0, uint256 a1) external {
        token0.transferFrom(msg.sender, address(this), a0);
        token1.transferFrom(msg.sender, address(this), a1);
        reserve0 += a0;
        reserve1 += a1;
        // (simplified; no LP tokens issued)
    }

    function swap(uint256 amountIn, bool isToken0) external {
        require(amountIn > 0);
        if (isToken0) {
            uint256 amountOut = (amountIn * 997 * reserve1) / (reserve0 * 1000 + amountIn * 997);
            token0.transferFrom(msg.sender, address(this), amountIn);
            reserve0 += amountIn;
            reserve1 -= amountOut;
            token1.transfer(msg.sender, amountOut);
        } else {
            uint256 amountOut = (amountIn * 997 * reserve0) / (reserve1 * 1000 + amountIn * 997);
            token1.transferFrom(msg.sender, address(this), amountIn);
            reserve1 += amountIn;
            reserve0 -= amountOut;
            token0.transfer(msg.sender, amountOut);
        }
    }

    function setOwner(address newOwner) external {
        require(msg.sender == owner);
        owner = newOwner;
    }
}`})]}),e.jsxs("div",{className:"report-form",children:[e.jsx("h3",{children:"Your Audit Report"}),e.jsxs("div",{className:"form-section",children:[e.jsx("h4",{children:"1. Executive Summary"}),e.jsx("textarea",{value:p.scope,onChange:s=>b({...p,scope:s.target.value}),placeholder:"Write a 2-3 sentence overview: what was reviewed, critical findings (if any), and a recommendation.",rows:4,className:"textarea-input"})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h4",{children:"2. Scope & Methodology"}),e.jsx("textarea",{value:p.methodology,onChange:s=>b({...p,methodology:s.target.value}),placeholder:"Contracts reviewed: SimpleSwap.sol. Out of scope: token implementations. Tools: manual review, Slither. Assumptions: tokens are ERC20-compliant, owner is not malicious (but key may be compromised).",rows:4,className:"textarea-input"})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h4",{children:"3. Threat Model Summary"}),e.jsx("textarea",{value:p.threatModel,onChange:s=>b({...p,threatModel:s.target.value}),placeholder:"Assets: liquidity pool, trader funds, owner keys. Actors: LP (trusts protocol), Trader (untrusted), owner (trusted but key may be stolen). Trust boundaries: user input -> contract, contract -> ERC20 token. Attack surfaces: swap function (sandwich attacks), setOwner (unguarded if key is stolen).",rows:5,className:"textarea-input"})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h4",{children:"4. Findings"}),e.jsxs("p",{children:["List at least two findings in the format:",e.jsx("br",{}),e.jsx("strong",{children:"Title | Severity | Description | Impact | Likelihood | Remediation"})]}),e.jsx("textarea",{value:p.findings,onChange:s=>b({...p,findings:s.target.value}),placeholder:`Example:
Unguarded setOwner() | High | The setOwner function only checks msg.sender == owner, but there is no multi-sig or timelock. If owner key is stolen, attacker can transfer ownership. | Attacker gains control of the protocol and can rug-pull liquidity. | High - EOA keys are commonly compromised. | Upgrade to multi-sig (Gnosis Safe); add 48-hour timelock.

Sandwich Attack Vulnerability | Medium | Traders' swap txns are visible in mempool. Front-runner can submit identical swap with higher gas, get better price, then do the victim's swap at worse price. | Traders lose 0.1-1% to sandwiching. | Moderate - requires mempool visibility and gas arbitrage. | Add MEV-resistant routing via MEV-Relay or private mempools.`,rows:8,className:"textarea-input"})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h4",{children:"5. Risk Acceptance & Remediation Prioritization"}),e.jsx("textarea",{value:p.remediation,onChange:s=>b({...p,remediation:s.target.value}),placeholder:"We recommend fixing High and above before mainnet. Sandwich attacks (Medium) are an AMM-wide problem; we accept this risk if you deploy via MEV-resistant routing (MEV-Relay, MEV-Share) or front-running protection. We will re-verify fixes in a follow-up review.",rows:4,className:"textarea-input"})]}),e.jsx("button",{onClick:()=>b({...p,submitted:!0}),className:"nav-button",children:"Submit Report & See Feedback"})]}),p.submitted&&e.jsxs("div",{className:"evaluation",children:[e.jsx("h3",{children:"Feedback on Your Report"}),e.jsxs("div",{className:"feedback-box",children:[e.jsx("h4",{children:"Strong Points to Look For:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Identified unguarded setOwner:"})," This is a critical finding. Ownership transfer is an irreversible, high-impact function that should be heavily defended. Bonus points if you mentioned the EOA key compromise risk."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mentioned sandwich attacks:"})," This is a realistic AMM vulnerability. Good if you noted that it is hard to prevent entirely but can be mitigated."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Threat model includes actors and boundaries:"})," If you identified the LP, trader, owner, and ERC20 contract as separate trust zones, you are thinking correctly."]})]}),e.jsx("h4",{children:"Common Gaps to Avoid:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Missing findings:"})," Did you spot the rounding issue? (Constant product = reserve0 * reserve1 should be preserved, but truncation in division breaks it.)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Vague remediation:"}),' "Improve security" is not actionable. Good remediation includes code changes, e.g., "add multi-sig via Gnosis Safe."']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ignored assumptions:"})," Did you note that the protocol assumes ERC20 tokens are safe and don't have hooks or reentrancy bugs? This matters."]})]}),e.jsx("h4",{children:"Severity Calibration:"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Critical:"})," Unguarded setOwner (loss of control). ",e.jsx("br",{}),e.jsx("strong",{children:"High:"})," Rounding/dust attacks in swap. ",e.jsx("br",{}),e.jsx("strong",{children:"Medium:"})," Sandwich attacks, oracle staleness (if added). ",e.jsx("br",{}),e.jsx("strong",{children:"Low:"})," Missing event, style issues."]}),e.jsx("h4",{children:"Next Steps:"}),e.jsxs("p",{children:["If the team fixes all Critical/High issues, run static analysis tools (Slither, Solhint) and fuzz the invariant: ",e.jsx("code",{children:"reserve0_before * reserve1_before == reserve0_after * reserve1_after"}),"(allowing for the 0.3% fee difference)."]})]})]}),e.jsx("button",{onClick:()=>{x("auditexercise"),c("final")},className:"nav-button",children:"Next: Final Assessment →"})]}),G=()=>{var s,d,m,a,r,l,q,T;return e.jsxs("div",{className:"section-content",children:[e.jsx("h2",{children:"Final Assessment"}),e.jsx("p",{children:"This assessment mixes conceptual questions, scenario reasoning, and design tasks. Answer all questions, then submit for scoring."}),e.jsxs("div",{className:"assessment-quiz",children:[e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q1: Which of the following is the PRIMARY benefit of threat modeling before coding?"}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final1",value:"design-surface",checked:n["final-q1"]==="design-surface",onChange:t=>i("final-q1",t.target.value)}),"To define security requirements and attack surfaces before architecture decisions are locked"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final1",value:"impress",checked:n["final-q1"]==="impress",onChange:t=>i("final-q1",t.target.value)}),"To impress investors and insurance companies"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final1",value:"replace-audit",checked:n["final-q1"]==="replace-audit",onChange:t=>i("final-q1",t.target.value)}),"To replace the need for a security audit"]})]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q2: In a threat model, which elements are essential? (Select all that apply)"}),e.jsxs("div",{className:"quiz-options multi",children:[e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final2",value:"assets",checked:((s=n["final-q2"])==null?void 0:s.includes("assets"))||!1,onChange:t=>{const o=n["final-q2"]||[];t.target.checked?i("final-q2",[...o,"assets"]):i("final-q2",o.filter(h=>h!=="assets"))}}),"Assets (what must be protected)"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final2",value:"actors",checked:((d=n["final-q2"])==null?void 0:d.includes("actors"))||!1,onChange:t=>{const o=n["final-q2"]||[];t.target.checked?i("final-q2",[...o,"actors"]):i("final-q2",o.filter(h=>h!=="actors"))}}),"Actors (who can interact)"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final2",value:"entry-points",checked:((m=n["final-q2"])==null?void 0:m.includes("entry-points"))||!1,onChange:t=>{const o=n["final-q2"]||[];t.target.checked?i("final-q2",[...o,"entry-points"]):i("final-q2",o.filter(h=>h!=="entry-points"))}}),"Entry points and attack surfaces"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final2",value:"colors",checked:((a=n["final-q2"])==null?void 0:a.includes("colors"))||!1,onChange:t=>{const o=n["final-q2"]||[];t.target.checked?i("final-q2",[...o,"colors"]):i("final-q2",o.filter(h=>h!=="colors"))}}),"Color schemes for diagrams"]})]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q3: Static analysis tools like Slither are MOST LIKELY to miss which of the following?"}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final3",value:"logic-bugs",checked:n["final-q3"]==="logic-bugs",onChange:t=>i("final-q3",t.target.value)}),"Logic bugs where the code does what was written but not what was intended"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final3",value:"missing-guard",checked:n["final-q3"]==="missing-guard",onChange:t=>i("final-q3",t.target.value)}),"Missing access control guards (onlyOwner, etc.)"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final3",value:"unchecked",checked:n["final-q3"]==="unchecked",onChange:t=>i("final-q3",t.target.value)}),"Unchecked return values from transfer()"]})]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q4: Which of the following is a valid way to test that an invariant holds? (Select all that apply)"}),e.jsxs("div",{className:"quiz-options multi",children:[e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final4",value:"unit-tests",checked:((r=n["final-q4"])==null?void 0:r.includes("unit-tests"))||!1,onChange:t=>{const o=n["final-q4"]||[];t.target.checked?i("final-q4",[...o,"unit-tests"]):i("final-q4",o.filter(h=>h!=="unit-tests"))}}),"Unit tests: check invariant holds before and after one function call"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final4",value:"fuzz-invariants",checked:((l=n["final-q4"])==null?void 0:l.includes("fuzz-invariants"))||!1,onChange:t=>{const o=n["final-q4"]||[];t.target.checked?i("final-q4",[...o,"fuzz-invariants"]):i("final-q4",o.filter(h=>h!=="fuzz-invariants"))}}),"Fuzz/property-based testing: randomized sequences of calls to check invariant"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final4",value:"integration",checked:((q=n["final-q4"])==null?void 0:q.includes("integration"))||!1,onChange:t=>{const o=n["final-q4"]||[];t.target.checked?i("final-q4",[...o,"integration"]):i("final-q4",o.filter(h=>h!=="integration"))}}),"Integration tests: multi-step workflows with manual assertions"]}),e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"final4",value:"prayer",checked:((T=n["final-q4"])==null?void 0:T.includes("prayer"))||!1,onChange:t=>{const o=n["final-q4"]||[];t.target.checked?i("final-q4",[...o,"prayer"]):i("final-q4",o.filter(h=>h!=="prayer"))}}),"Hope and prayer"]})]})]}),e.jsxs("div",{className:"quiz-item",children:[e.jsx("h4",{children:"Q5: Consider a lending protocol with an oracle. Which invariant is MOST critical to encode?"}),e.jsxs("div",{className:"quiz-options",children:[e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final5",value:"solvency",checked:n["final-q5"]==="solvency",onChange:t=>i("final-q5",t.target.value)}),"Solvency: totalAssets >= totalBorrows (accounting for collateral and reserves)"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final5",value:"interest",checked:n["final-q5"]==="interest",onChange:t=>i("final-q5",t.target.value)}),"Interest rates are always between 0% and 100%"]}),e.jsxs("label",{children:[e.jsx("input",{type:"radio",name:"final5",value:"gas",checked:n["final-q5"]==="gas",onChange:t=>i("final-q5",t.target.value)}),"No transaction uses more than 5M gas"]})]})]})]}),e.jsx("button",{onClick:M,className:"nav-button",children:"Submit Final Assessment"}),v!==null&&e.jsxs("div",{className:"final-results",children:[e.jsx("h3",{children:"Results"}),e.jsxs("div",{className:"score-display",children:[e.jsx("div",{className:"score-circle",children:Math.round(v)}),e.jsx("p",{className:"score-label",children:"/ 100"})]}),v>=80&&e.jsxs("div",{className:"result-excellent",children:[e.jsx("h4",{children:"Excellent! You have mastered threat modeling and audit methods."}),e.jsx("p",{children:"You demonstrated strong understanding of threat modeling fundamentals, static analysis limitations, invariant design, and audit reporting. You are ready to lead security reviews and design secure protocols. Next: dive into formal verification and economic modeling."})]}),v>=60&&v<80&&e.jsxs("div",{className:"result-good",children:[e.jsx("h4",{children:"Good progress! Review the weak areas below."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"If you missed Q1 or Q2:"})," Revisit Section 1 and the threat modeling examples. Focus on documenting assets, actors, and boundaries explicitly."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"If you missed Q3:"})," Read Section 2.3 again. Static analysis misses logic bugs and economic exploits; remember the false-negative examples."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"If you missed Q4 or Q5:"})," Review Section 3. Practice encoding invariants and running Echidna or Foundry fuzzing on a toy contract."]})]})]}),v<60&&e.jsxs("div",{className:"result-needs-review",children:[e.jsx("h4",{children:"You would benefit from a re-read of the material."}),e.jsx("p",{children:"Threat modeling and self-assessment are critical to secure contract design. Please revisit the sections where you struggled, and try the workshops again. Consider working through the TokenVault and SimpleLend examples by hand."})]}),e.jsx("button",{onClick:()=>{A({}),C(null),c("intro"),S(new Set)},className:"nav-button",children:"Reset and Start Over"})]})]})},$=()=>{switch(k){case"intro":return e.jsx(z,{});case"objectives":return e.jsx(F,{});case"section1":return e.jsx(R,{});case"section1-quiz":return e.jsx(W,{});case"section2":return e.jsx(D,{});case"section2-quiz":return e.jsx(P,{});case"section3":return e.jsx(O,{});case"section3-quiz":return e.jsx(L,{});case"section4":return e.jsx(U,{});case"section4-quiz":return e.jsx(B,{});case"workshop":return e.jsx(H,{});case"casestudy":return e.jsx(Q,{});case"auditexercise":return e.jsx(V,{});case"final":return e.jsx(G,{});default:return e.jsx(z,{})}},y=s=>({intro:"Introduction",objectives:"Objectives",section1:"1. Threat Modeling","section1-quiz":"1. Quiz",section2:"2. Static Analysis","section2-quiz":"2. Quiz",section3:"3. Fuzzing & Invariants","section3-quiz":"3. Quiz",section4:"4. Audit Reporting","section4-quiz":"4. Quiz",workshop:"Workshop",casestudy:"Case Study",auditexercise:"Audit Exercise",final:"Final Assessment"})[s]||s;return e.jsxs("div",{className:"module-container",children:[e.jsx("style",{children:`
                .module-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f8f9fa;
                    color: #333;
                }

                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 4px solid #764ba2;
                }

                .header h1 {
                    margin: 0;
                    font-size: 18px;
                }

                .controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .instructor-toggle {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid white;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                }

                .progress-bar {
                    width: 200px;
                    height: 8px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: #4CAF50;
                    transition: width 0.3s;
                }

                .main-layout {
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                }

                .nav-panel {
                    flex: 0 0 220px;
                    background: white;
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .nav-section {
                    margin-bottom: 15px;
                }

                .nav-section-title {
                    font-weight: bold;
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }

                .nav-button-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .nav-option {
                    padding: 8px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    border: 1px solid transparent;
                    background: #f0f0f0;
                    transition: all 0.2s;
                }

                .nav-option:hover {
                    background: #e0e0e0;
                }

                .nav-option.active {
                    background: #667eea;
                    color: white;
                    font-weight: bold;
                }

                .nav-option.completed {
                    color: #4CAF50;
                    font-weight: bold;
                }

                .content-area {
                    flex: 1;
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .section-content h1,
                .section-content h2,
                .section-content h3,
                .section-content h4 {
                    color: #667eea;
                    margin-top: 24px;
                    margin-bottom: 12px;
                }

                .section-content h1 {
                    border-bottom: 3px solid #667eea;
                    padding-bottom: 10px;
                }

                .section-content p,
                .section-content li {
                    line-height: 1.6;
                    margin-bottom: 12px;
                }

                .section-content ul,
                .section-content ol {
                    margin-left: 20px;
                    margin-bottom: 12px;
                }

                .abstract-box,
                .objectives-box,
                .prereq-box,
                .terms-box,
                .spec-box,
                .capability-box,
                .limitation-box,
                .model-box,
                .tool-box,
                .finding-example,
                .reference-answer {
                    background: #f0f4ff;
                    border-left: 4px solid #667eea;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                }

                .callout-key {
                    background: #e8f5e9;
                    border-left: 4px solid #4CAF50;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                    font-weight: 500;
                }

                .callout-pitfall {
                    background: #fff3e0;
                    border-left: 4px solid #ff9800;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                    font-weight: 500;
                }

                .code-block {
                    background: #1e1e1e;
                    color: #d4d4d4;
                    padding: 15px;
                    border-radius: 4px;
                    overflow-x: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    line-height: 1.5;
                    margin: 15px 0;
                }

                .assumption-table,
                .invariant-table,
                .severity-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 13px;
                }

                .assumption-table th,
                .invariant-table th,
                .severity-table th {
                    background: #667eea;
                    color: white;
                    padding: 10px;
                    text-align: left;
                }

                .assumption-table td,
                .invariant-table td,
                .severity-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                }

                .assumption-table tr:nth-child(even),
                .invariant-table tr:nth-child(even),
                .severity-table tr:nth-child(even) {
                    background: #f5f5f5;
                }

                .quiz-item {
                    background: #fafafa;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                    border-left: 3px solid #667eea;
                }

                .quiz-item h4 {
                    color: #667eea;
                    margin-top: 0;
                }

                .quiz-options,
                .quiz-options.multi {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin: 10px 0;
                }

                .quiz-options label,
                .quiz-options.multi label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .quiz-options label:hover,
                .quiz-options.multi label:hover {
                    background: #f0f0f0;
                }

                .quiz-options input[type="radio"],
                .quiz-options.multi input[type="checkbox"] {
                    margin-right: 10px;
                    cursor: pointer;
                }

                .textarea-input,
                .nav-section-title {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: 13px;
                    resize: vertical;
                }

                .textarea-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .nav-button,
                .nav-button-list button {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.2s;
                    font-size: 14px;
                }

                .nav-button:hover,
                .nav-button-list button:hover {
                    background: #764ba2;
                }

                .answer-reveal {
                    background: #e8f5e9;
                    border: 1px solid #4CAF50;
                    padding: 12px;
                    border-radius: 4px;
                    margin-top: 10px;
                    font-size: 13px;
                }

                .workshop-section {
                    background: #f0f4ff;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                    border-left: 4px solid #667eea;
                }

                .workshop-note {
                    background: #e3f2fd;
                    padding: 12px;
                    border-radius: 4px;
                    margin: 10px 0;
                    font-style: italic;
                    font-size: 13px;
                }

                .ref-section {
                    background: white;
                    padding: 12px;
                    margin: 10px 0;
                    border-left: 3px solid #4CAF50;
                }

                .playbook-box {
                    background: #f3e5f5;
                    border-left: 4px solid #9c27b0;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                }

                .evaluation,
                .result-excellent,
                .result-good,
                .result-needs-review {
                    background: #f0f4ff;
                    border: 2px solid #667eea;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                }

                .result-excellent {
                    background: #e8f5e9;
                    border-color: #4CAF50;
                }

                .result-good {
                    background: #fff3e0;
                    border-color: #ff9800;
                }

                .result-needs-review {
                    background: #ffebee;
                    border-color: #f44336;
                }

                .score-display {
                    text-align: center;
                    margin: 20px 0;
                }

                .score-circle {
                    display: inline-block;
                    width: 100px;
                    height: 100px;
                    background: #667eea;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .score-label {
                    margin: 0;
                    font-size: 18px;
                    color: #667eea;
                    font-weight: bold;
                }

                .matching-questions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin: 10px 0;
                }

                .match-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .match-item label {
                    flex: 1;
                }

                .match-item select {
                    padding: 6px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 13px;
                }

                .report-structure,
                .report-form {
                    background: white;
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 4px;
                    margin: 15px 0;
                }

                .form-section {
                    margin-bottom: 20px;
                }

                .form-section h4 {
                    color: #667eea;
                    margin-bottom: 10px;
                }

                .feedback-box {
                    background: #f0f4ff;
                    border: 1px solid #667eea;
                    padding: 15px;
                    border-radius: 4px;
                    margin: 15px 0;
                }

                .feedback-box h4 {
                    color: #667eea;
                    margin-top: 0;
                }

                pre {
                    background: #f5f5f5;
                    padding: 10px;
                    border-radius: 4px;
                    overflow-x: auto;
                    font-size: 12px;
                    font-family: monospace;
                }

                @media (max-width: 768px) {
                    .main-layout {
                        flex-direction: column;
                    }

                    .nav-panel {
                        flex: 1;
                        max-height: none;
                    }

                    .content-area {
                        max-height: none;
                    }
                }
            `}),e.jsxs("div",{className:"header",children:[e.jsx("h1",{children:"Module 10: Threat Modeling & Audit Methods"}),e.jsxs("div",{className:"controls",children:[e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${N()}%`}})}),e.jsxs("span",{style:{color:"white",fontSize:"12px",fontWeight:"bold"},children:[N(),"% Complete"]}),e.jsx("button",{className:"instructor-toggle",onClick:()=>I(!u),"aria-label":"Toggle instructor mode",children:u?"✓ Instructor Mode":"Instructor Mode"})]})]}),e.jsxs("div",{className:"main-layout",children:[e.jsxs("div",{className:"nav-panel",children:[e.jsxs("div",{className:"nav-section",children:[e.jsx("div",{className:"nav-section-title",children:"Fundamentals"}),e.jsx("div",{className:"nav-button-list",children:["intro","objectives"].map(s=>e.jsxs("button",{className:`nav-option ${k===s?"active":""} ${f.has(s)?"completed":""}`,onClick:()=>c(s),"aria-label":`Navigate to ${y(s)}`,children:[f.has(s)?"✓ ":"",y(s)]},s))})]}),e.jsxs("div",{className:"nav-section",children:[e.jsx("div",{className:"nav-section-title",children:"Core Content"}),e.jsx("div",{className:"nav-button-list",children:["section1","section1-quiz","section2","section2-quiz","section3","section3-quiz","section4","section4-quiz"].map(s=>e.jsxs("button",{className:`nav-option ${k===s?"active":""} ${f.has(s)?"completed":""}`,onClick:()=>c(s),"aria-label":`Navigate to ${y(s)}`,children:[f.has(s)?"✓ ":"",y(s)]},s))})]}),e.jsxs("div",{className:"nav-section",children:[e.jsx("div",{className:"nav-section-title",children:"Application"}),e.jsx("div",{className:"nav-button-list",children:["workshop","casestudy","auditexercise","final"].map(s=>e.jsxs("button",{className:`nav-option ${k===s?"active":""} ${f.has(s)?"completed":""}`,onClick:()=>c(s),"aria-label":`Navigate to ${y(s)}`,children:[f.has(s)?"✓ ":"",y(s)]},s))})]})]}),e.jsx("div",{className:"content-area",role:"main",children:$()})]})]})};export{X as default};
