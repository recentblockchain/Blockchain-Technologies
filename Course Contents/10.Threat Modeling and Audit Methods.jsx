import React, { useState, useCallback } from 'react';
import Footer from "../src/Footer";

const ThreatModelingModule = () => {
    const [currentSection, setCurrentSection] = useState('intro');
    const [completedSections, setCompletedSections] = useState(new Set());
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [instructorMode, setInstructorMode] = useState(false);
    const [workshopState, setWorkshopState] = useState({
        assets: '',
        actors: '',
        boundaries: '',
        entryPoints: '',
        submitted: false,
    });
    const [reportState, setReportState] = useState({
        scope: '',
        methodology: '',
        threatModel: '',
        findings: '',
        remediation: '',
        submitted: false,
    });

    const sections = [
        'intro',
        'objectives',
        'section1',
        'section1-quiz',
        'section2',
        'section2-quiz',
        'section3',
        'section3-quiz',
        'section4',
        'section4-quiz',
        'workshop',
        'casestudy',
        'auditexercise',
        'final',
    ];

    const markSectionComplete = (sectionId) => {
        setCompletedSections(prev => new Set([...prev, sectionId]));
    };

    const calculateProgress = () => {
        return Math.round((completedSections.size / sections.length) * 100);
    };

    const handleQuizAnswer = (questionId, answer) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleFinalSubmit = () => {
        let score = 0;
        const totalQuestions = 15;

        const answers = {
            'final-q1': 'trust-boundaries',
            'final-q2': ['assets', 'actors', 'entry-points'],
            'final-q3': 'logic-bugs',
            'final-q4': ['unit-tests', 'fuzz-invariants', 'integration'],
            'final-q5': 'solvency',
        };

        Object.entries(answers).forEach(([key, expected]) => {
            const userAnswer = quizAnswers[key];
            if (Array.isArray(expected)) {
                if (Array.isArray(userAnswer) && 
                        expected.length === userAnswer.length &&
                        expected.every(e => userAnswer.includes(e))) {
                    score += 3;
                }
            } else if (userAnswer === expected) {
                score += 3;
            }
        });

        setFinalScore(Math.min(100, (score / totalQuestions) * 100));
    };

    const IntroSection = () => (
        <div className="section-content">
            <h1>Module 10: Threat Modeling and Audit Methods</h1>
            <div className="abstract-box">
                <h3>Abstract</h3>
                <p>
                    Smart contract security extends far beyond code syntax. This module teaches the foundational 
                    discipline of <strong>threat modeling</strong>—the systematic identification of what can go wrong, 
                    who can make it go wrong, and where security boundaries exist. We then translate threat models 
                    into actionable audit practices: static analysis tooling, automated invariant testing via fuzzing, 
                    and structured audit reporting. By the end, you will be able to construct a threat model from 
                    first principles, interpret static analysis results without false-confidence, design invariants 
                    that catch real exploits, and deliver professional, impact-driven audit reports.
                </p>
            </div>
            <button onClick={() => { markSectionComplete('intro'); setCurrentSection('objectives'); }} 
                            className="nav-button">
                Next: Learning Objectives →
            </button>
        </div>
    );

    const ObjectivesSection = () => (
        <div className="section-content">
            <h2>Learning Objectives & Prerequisites</h2>
            <div className="objectives-box">
                <h3>After completing this module, you will be able to:</h3>
                <ol>
                    <li>Define security assets, actors, trust boundaries, and attack surfaces for a smart contract system.</li>
                    <li>Construct a complete threat model using structured thinking (STRIDE-like reasoning adapted for DeFi).</li>
                    <li>Distinguish between what static analysis can and cannot reliably detect.</li>
                    <li>Design and encode security invariants that detect economic exploits and broken assumptions.</li>
                    <li>Write a professional audit report with severity ratings, reproducible exploits, and testable remediation.</li>
                    <li>Integrate tooling (static analysis, fuzzing) into a CI/CD audit workflow.</li>
                </ol>
            </div>
            <div className="prereq-box">
                <h3>Prerequisites</h3>
                <ul>
                    <li>Solid understanding of Solidity syntax and EVM semantics (Module 1–3).</li>
                    <li>Familiarity with common vulnerability classes (Module 4: Reentrancy, Module 5: Access Control & Integer Bugs).</li>
                    <li>Basic comfort reading security advisories and GitHub issues.</li>
                </ul>
            </div>
            <div className="terms-box">
                <h3>Key Terms (Define As You Learn)</h3>
                <ul>
                    <li><strong>Threat Model:</strong> A structured document describing assets, actors, entry points, and assumptions.</li>
                    <li><strong>Attack Surface:</strong> The set of methods and states where untrusted input enters a system.</li>
                    <li><strong>Trust Boundary:</strong> A line separating trusted from untrusted code/data.</li>
                    <li><strong>Invariant:</strong> A condition that the contract guarantees will always hold (e.g., totalSupply conservation).</li>
                    <li><strong>Static Analysis:</strong> Automated code inspection without execution.</li>
                    <li><strong>Fuzzing:</strong> Randomized testing to discover edge cases and invariant violations.</li>
                    <li><strong>Audit Severity:</strong> A rating (Critical, High, Medium, Low, Informational) reflecting impact and likelihood.</li>
                </ul>
            </div>
            <button onClick={() => { markSectionComplete('objectives'); setCurrentSection('section1'); }} 
                            className="nav-button">
                Next: Section 1 - Threat Modeling Fundamentals →
            </button>
        </div>
    );

    const Section1 = () => (
        <div className="section-content">
            <h2>Section 1: Threat Modeling from First Principles</h2>
            
            <h3>1.1 Why Threat Modeling?</h3>
            <p>
                A threat model is your insurance policy before an exploit happens. Instead of debugging a hack, 
                you <strong>proactively ask</strong>: "What is my worst-case scenario? Who could attack us? Where 
                are they coming in?" This shifts security from reactive (finding bugs) to preventive (understanding 
                failure modes).
            </p>
            <div className="callout-key">
                <strong>Key Takeaway:</strong> Threat modeling is not a one-time document; it is a living map 
                of your system's attack surface.
            </div>

            <h3>1.2 The Core Building Blocks</h3>
            <p>Every threat model must define:</p>
            <ul>
                <li><strong>Assets:</strong> What must be protected? (e.g., user funds, admin keys, oracle data).</li>
                <li><strong>Actors:</strong> Who has the ability to interact with the contract? (users, admins, attackers, external contracts).</li>
                <li><strong>Trust Boundaries:</strong> Where does control change hands? (e.g., user → contract, contract → oracle).</li>
                <li><strong>Assumptions:</strong> What must be true for the contract to be secure? (e.g., "oracle always reports accurately").</li>
                <li><strong>Attack Surfaces:</strong> Which functions and state transitions are exploitable?</li>
                <li><strong>Entry Points:</strong> How can an attacker trigger malicious behavior?</li>
                <li><strong>Dependencies:</strong> What external protocols must be trusted?</li>
            </ul>

            <h3>1.3 A Worked Example: Simple Token Vault</h3>
            <p>
                Consider a basic vault contract (deposits, withdrawals, governance vote to change fee). Let us build 
                its threat model step by step.
            </p>

            <div className="code-block">
{`// Mini-protocol: TokenVault
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
}`}
            </div>

            <h3>1.4 Building the Threat Model for TokenVault</h3>
            
            <div className="model-box">
                <h4>Assets</h4>
                <ul>
                    <li>User funds deposited in the vault (ERC20 tokens).</li>
                    <li>Governance voting power (ability to change fees).</li>
                    <li>Admin pause capability.</li>
                </ul>
            </div>

            <div className="model-box">
                <h4>Actors</h4>
                <ul>
                    <li><strong>Honest Users:</strong> Deposit and withdraw normally.</li>
                    <li><strong>Governance:</strong> Proposes and votes on fee changes.</li>
                    <li><strong>Admin:</strong> Can pause deposits.</li>
                    <li><strong>Malicious User/Attacker:</strong> May front-run, reentrancy, or exploit rounding.</li>
                    <li><strong>External Token Contract:</strong> The ERC20 implementation (may have hooks, may be malicious).</li>
                    <li><strong>Sandwich Bot:</strong> Monitors the mempool and reorders transactions.</li>
                </ul>
            </div>

            <div className="model-box">
                <h4>Trust Boundaries</h4>
                <p>
                    ASCII diagram of the vault trust boundaries:
                </p>
                <pre>{`
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
                `}</pre>
                <p>
                    Key boundaries:
                </p>
                <ul>
                    <li>User input → Vault: validate amounts, reentrancy guards.</li>
                    <li>Vault → ERC20: assume transferFrom/transfer may fail or reenter.</li>
                    <li>Governance call: only authorized address can call setFee.</li>
                </ul>
            </div>

            <div className="model-box">
                <h4>Assumptions vs. Guarantees</h4>
                <table className="assumption-table">
                    <thead>
                        <tr>
                            <th>Assumption</th>
                            <th>Reality Check</th>
                            <th>Worst Case if Violated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ERC20 token is not malicious</td>
                            <td>Many tokens are honest, but some have hooks</td>
                            <td>Reentrancy from token transfer</td>
                        </tr>
                        <tr>
                            <td>No token transfer will fail mid-call</td>
                            <td>transferFrom can revert or return false</td>
                            <td>Incomplete deposit, inconsistent state</td>
                        </tr>
                        <tr>
                            <td>Governance is trustworthy</td>
                            <td>Governance can be compromised</td>
                            <td>Fee set to 100%, vault becomes inaccessible</td>
                        </tr>
                        <tr>
                            <td>Math does not overflow/underflow</td>
                            <td>Solidity ^0.8 has checked math, but rounding can bite</td>
                            <td>Share calculation loss, unfair distribution</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="model-box">
                <h4>Attack Surfaces</h4>
                <ul>
                    <li>
                        <strong>Deposit function:</strong> Attacker deposits malicious token with hook, reenters during transfer. 
                        Also: rounding abuse if attacker crafts deposit size to steal a share.
                    </li>
                    <li>
                        <strong>Withdraw function:</strong> Attacker withdraws during a governance fee change, 
                        expecting old fee but getting new one.
                    </li>
                    <li>
                        <strong>setFee function:</strong> If governance is a multi-sig and a signer is compromised, 
                        fee can be set to 100% to lock users.
                    </li>
                </ul>
            </div>

            <div className="model-box">
                <h4>Entry Points & Dependency Risks</h4>
                <ul>
                    <li>
                        <strong>ERC20 token dependency:</strong> If token blacklists the vault, withdrawals fail. 
                        If token has a mint hook, vault state can be corrupted.
                    </li>
                    <li>
                        <strong>Governance contract dependency:</strong> Multi-sigs can delay votes. 
                        EOA governance is vulnerable to key theft.
                    </li>
                    <li>
                        <strong>Admin pause key:</strong> If compromised, vault can be permanently paused.
                    </li>
                </ul>
            </div>

            <div className="callout-pitfall">
                <strong>Common Pitfall:</strong> Threat modeling often stops at "code audit." But the real 
                security is assumptions about external contracts and human actors. A 0-bug vault can still 
                fail if the governance is compromised or the token is malicious.
            </div>

            <button onClick={() => { markSectionComplete('section1'); setCurrentSection('section1-quiz'); }} 
                            className="nav-button">
                Next: Section 1 Quiz →
            </button>
        </div>
    );

    const Section1Quiz = () => (
        <div className="section-content">
            <h2>Section 1: Knowledge Check</h2>
            
            <div className="quiz-item">
                <h4>Q1: Which of the following defines a "trust boundary"?</h4>
                <div className="quiz-options">
                    <label>
                        <input 
                            type="radio" 
                            name="q1" 
                            value="control-change"
                            checked={quizAnswers['q1'] === 'control-change'}
                            onChange={(e) => handleQuizAnswer('q1', e.target.value)}
                        />
                        A point where control or data ownership changes from trusted to untrusted code
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="q1" 
                            value="network-edge"
                            checked={quizAnswers['q1'] === 'network-edge'}
                            onChange={(e) => handleQuizAnswer('q1', e.target.value)}
                        />
                        The edge of a blockchain network
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="q1" 
                            value="function-call"
                            checked={quizAnswers['q1'] === 'function-call'}
                            onChange={(e) => handleQuizAnswer('q1', e.target.value)}
                        />
                        Every function call to an external contract
                    </label>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answer:</strong> A. A trust boundary is where assumptions change—e.g., from your 
                        code to a third-party token. Distractor B conflates network topology with contract security. 
                        Distractor C is too broad; not every external call is a trust boundary if you fully control the contract.
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q2: In the TokenVault example, list three assets that must be protected.</h4>
                <textarea 
                    value={quizAnswers['q2'] || ''}
                    onChange={(e) => handleQuizAnswer('q2', e.target.value)}
                    placeholder="Enter your answer..."
                    rows={3}
                    className="textarea-input"
                />
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Sample Answer:</strong> (1) User funds deposited in the vault, (2) Governance voting 
                        power and the right to change fees, (3) Admin pause capability. Any three from: user shares, 
                        underlying asset balance, governance keys, admin keys, vault invariants (totalShares conservation).
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q3: Why is it important to document assumptions?</h4>
                <div className="quiz-options">
                    <label>
                        <input 
                            type="radio" 
                            name="q3" 
                            value="verify-if-violated"
                            checked={quizAnswers['q3'] === 'verify-if-violated'}
                            onChange={(e) => handleQuizAnswer('q3', e.target.value)}
                        />
                        So you know what to test and what fails if the assumption is violated
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="q3" 
                            value="impress-auditors"
                            checked={quizAnswers['q3'] === 'impress-auditors'}
                            onChange={(e) => handleQuizAnswer('q3', e.target.value)}
                        />
                        To impress auditors
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="q3" 
                            value="compliance"
                            checked={quizAnswers['q3'] === 'compliance'}
                            onChange={(e) => handleQuizAnswer('q3', e.target.value)}
                        />
                        For regulatory compliance
                    </label>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answer:</strong> A. Assumptions guide testing strategy and risk acceptance. 
                        If you do not document them, you cannot plan around violations. Distractor B and C are 
                        side benefits, not the primary reason.
                    </div>
                )}
            </div>

            <button onClick={() => { markSectionComplete('section1-quiz'); setCurrentSection('section2'); }} 
                            className="nav-button">
                Next: Section 2 - Static Analysis & Tooling →
            </button>
        </div>
    );

    const Section2 = () => (
        <div className="section-content">
            <h2>Section 2: Static Analysis and Linting</h2>

            <h3>2.1 What is Static Analysis?</h3>
            <p>
                Static analysis is automated code inspection <strong>without running the contract</strong>. 
                Tools scan Solidity source and bytecode to detect:
            </p>
            <ul>
                <li>Known bug patterns (reentrancy, unchecked transfers, integer overflow in older Solidity).</li>
                <li>Style and best-practice violations.</li>
                <li>Missing access control.</li>
                <li>Unsafe external calls.</li>
            </ul>

            <h3>2.2 What Static Analysis Can Reliably Catch</h3>
            <div className="capability-box">
                <h4>✓ Strong Detections</h4>
                <ul>
                    <li><strong>Unchecked transfer return values:</strong> "Did you check if transfer() returned false?"</li>
                    <li><strong>Missing access control:</strong> "State-changing function is public, not guarded by onlyOwner."</li>
                    <li><strong>Obvious reentrancy patterns:</strong> "Call to external contract before state update."</li>
                    <li><strong>Use of tx.origin:</strong> "tx.origin is used for auth, but this is spoofable via delegatecall."</li>
                    <li><strong>Deprecated functions:</strong> "selfdestruct is dangerous."</li>
                    <li><strong>Unsafe math:</strong> "Solidity &lt;0.8: subtract before checking if numerator &lt; denominator."</li>
                    <li><strong>Magic numbers:</strong> "Hard-coded constant should be a named constant."</li>
                </ul>
            </div>

            <h3>2.3 What Static Analysis Often Misses</h3>
            <div className="limitation-box">
                <h4>✗ Weak or Missing Detections</h4>
                <ul>
                    <li>
                        <strong>Logic bugs:</strong> "The code does what you wrote, not what you meant." 
                        E.g., checking `if (a > 0 || b > 0)` when you meant `&&`.
                    </li>
                    <li>
                        <strong>Economic exploits:</strong> "Attacker profits by manipulating price, flash-loaning, 
                        or sandwich-attacking the order." Static analysis sees the math is correct but does not see 
                        the incentive.
                    </li>
                    <li>
                        <strong>Cross-contract composability issues:</strong> "Token A calls Token B calls Token A, 
                        and now invariant X is broken." Requires whole-system reasoning.
                    </li>
                    <li>
                        <strong>Oracle manipulation:</strong> "The price feed is stale or can be flash-loaned." 
                        Requires understanding the oracle's trust model.
                    </li>
                    <li>
                        <strong>Broken invariants due to rounding:</strong> "Shares conservation is off by 1 due to 
                        truncation in division." Requires formal reasoning about arithmetic.
                    </li>
                    <li>
                        <strong>Insufficient access control design:</strong> "Function is guarded by onlyOwner, 
                        but there is no timelock, so a compromised owner can instantly drain funds." 
                        Requires threat model thinking.
                    </li>
                    <li>
                        <strong>Replay attacks:</strong> "If the contract is deployed across two chains and domain 
                        separation is missing, a signed message on chain A can replay on chain B." 
                        Requires domain knowledge.
                    </li>
                </ul>
            </div>

            <div className="callout-key">
                <strong>Key Takeaway:</strong> Static analysis is a <strong>necessary but insufficient</strong> 
                security gate. Use it to eliminate obvious mistakes, but do not rely on it for deep logic validation.
            </div>

            <h3>2.4 Common Tools & Integration</h3>
            
            <div className="tool-box">
                <h4>Slither (Trail of Bits)</h4>
                <p>
                    <strong>What it does:</strong> Analyzes Solidity AST for known patterns. Outputs severity-rated 
                    issues (High, Medium, Low, Informational).
                </p>
                <p>
                    <strong>Example findings:</strong> reentrancy, missing zero-address checks, unused return values, 
                    shadowed variables.
                </p>
                <p>
                    <strong>CI Integration:</strong>
                </p>
                <pre>{`# GitHub Actions example
- name: Run Slither
    run: slither . --exclude-dependencies
    continue-on-error: true  # Do not block CI; report issues but allow merge
`}</pre>
            </div>

            <div className="tool-box">
                <h4>Solhint (Standard community linter)</h4>
                <p>
                    <strong>What it does:</strong> Style and best-practice checking. Enforces naming conventions, 
                    documenting functions, avoiding gas anti-patterns.
                </p>
                <p>
                    <strong>Example rules:</strong> camelCase variable names, NatSpec comments on public functions, 
                    no use of `now` (deprecated).
                </p>
            </div>

            <div className="tool-box">
                <h4>Mythril (Consensys)</h4>
                <p>
                    <strong>What it does:</strong> Symbolic execution and bytecode analysis. Can catch some 
                    uninitialized storage, unreachable code, and out-of-bounds array access.
                </p>
                <p>
                    <strong>Drawback:</strong> Slower and more false positives than pattern-matching tools.
                </p>
            </div>

            <h3>2.5 Interpreting False Positives and Negatives</h3>
            
            <div className="model-box">
                <h4>False Positive Example</h4>
                <p>
                    Slither flags a reentrancy in this pattern:
                </p>
                <pre>{`function withdraw(uint256 amount) external {
    uint256 balance = balances[msg.sender];
    require(balance >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;  // State update first
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}`}</pre>
                <p>
                    <strong>Slither's complaint:</strong> "External call to msg.sender.call before state finalized."
                </p>
                <p>
                    <strong>Reality:</strong> State is updated <strong>before</strong> the call, so reentrancy is 
                    blocked. This is a *false positive* (state-update-first is the standard Checks-Effects-Interactions pattern).
                </p>
                <p>
                    <strong>Action:</strong> Review the flag in context. If it is a false positive, document why in 
                    a comment or suppress it in the config.
                </p>
            </div>

            <div className="model-box">
                <h4>False Negative Example</h4>
                <p>
                    A contract uses an oracle price feed to calculate collateral value:
                </p>
                <pre>{`uint256 collateralUSD = (collateralAmount * oraclePrice) / 1e18;
require(collateralUSD >= requiredUSD, "Insufficient collateral");`}</pre>
                <p>
                    <strong>Static analysis result:</strong> No finding (math is syntactically correct).
                </p>
                <p>
                    <strong>Reality:</strong> If the oracle can be flashloan-attacked or is stale, an attacker can 
                    inflate collateralUSD, then dump collateral at the real price off-chain and profit. 
                    This is a *false negative* (tool missed it because it does not reason about external data).
                </p>
                <p>
                    <strong>Action:</strong> Add invariant testing or manual review for oracle dependencies.
                </p>
            </div>

            <h3>2.6 Best Practices for Tooling in CI/CD</h3>
            <ul>
                <li>
                    <strong>Run tools early:</strong> Integrate Solhint in pre-commit hooks; run Slither on every PR.
                </li>
                <li>
                    <strong>Do not let tool failures block merges:</strong> Treat static analysis as a signal, not a gate. 
                    Allow merge with auditor sign-off on reviewed issues.
                </li>
                <li>
                    <strong>Suppress known false positives:</strong> Document why in a config file so reviewers 
                    understand the override.
                </li>
                <li>
                    <strong>Layer multiple tools:</strong> Slither + Solhint + Mythril catch different patterns. 
                    More coverage, more false positives, but fewer blind spots.
                </li>
                <li>
                    <strong>Track findings over time:</strong> If Slither reports 10 issues on v1 and 3 on v2, 
                    verify that 7 were fixed (not suppressed).
                </li>
            </ul>

            <div className="callout-pitfall">
                <strong>Common Pitfall:</strong> Teams run static analysis once, see 100 "issues," and either 
                (a) ignore all of them or (b) spend days "fixing" style warnings. Instead, triage by severity, 
                fix true positives, suppress false positives with justification, and iterate. Automated tools 
                are a starting point, not the finish line.
            </div>

            <button onClick={() => { markSectionComplete('section2'); setCurrentSection('section2-quiz'); }} 
                            className="nav-button">
                Next: Section 2 Quiz →
            </button>
        </div>
    );

    const Section2Quiz = () => (
        <div className="section-content">
            <h2>Section 2: Knowledge Check</h2>

            <div className="quiz-item">
                <h4>Q1: Which of the following is a *false negative* (tool misses it)?</h4>
                <div className="quiz-options">
                    <label>
                        <input 
                            type="radio" 
                            name="s2q1" 
                            value="stale-oracle"
                            checked={quizAnswers['s2q1'] === 'stale-oracle'}
                            onChange={(e) => handleQuizAnswer('s2q1', e.target.value)}
                        />
                        A stale oracle price used in collateral valuation (attackable via flashloan)
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="s2q1" 
                            value="unchecked-return"
                            checked={quizAnswers['s2q1'] === 'unchecked-return'}
                            onChange={(e) => handleQuizAnswer('s2q1', e.target.value)}
                        />
                        An unchecked return value from transfer()
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="s2q1" 
                            value="missing-guard"
                            checked={quizAnswers['s2q1'] === 'missing-guard'}
                            onChange={(e) => handleQuizAnswer('s2q1', e.target.value)}
                        />
                        A public state-changing function without onlyOwner guard
                    </label>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answer:</strong> A. Oracle freshness is an economic trust model issue that static 
                        analysis cannot detect; it requires domain knowledge and testing. B and C are classic static 
                        analysis findings that tools reliably catch.
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q2: Which of the following should you do with a static analysis tool finding? (Select all that apply)</h4>
                <div className="quiz-options multi">
                    <label>
                        <input 
                            type="checkbox" 
                            name="s2q2" 
                            value="context-review"
                            checked={quizAnswers['s2q2']?.includes('context-review') || false}
                            onChange={(e) => {
                                const curr = quizAnswers['s2q2'] || [];
                                if (e.target.checked) {
                                    handleQuizAnswer('s2q2', [...curr, 'context-review']);
                                } else {
                                    handleQuizAnswer('s2q2', curr.filter(v => v !== 'context-review'));
                                }
                            }}
                        />
                        Review the finding in context to understand if it is a true positive or false positive
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="s2q2" 
                            value="always-suppress"
                            checked={quizAnswers['s2q2']?.includes('always-suppress') || false}
                            onChange={(e) => {
                                const curr = quizAnswers['s2q2'] || [];
                                if (e.target.checked) {
                                    handleQuizAnswer('s2q2', [...curr, 'always-suppress']);
                                } else {
                                    handleQuizAnswer('s2q2', curr.filter(v => v !== 'always-suppress'));
                                }
                            }}
                        />
                        Always suppress findings to reduce noise
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="s2q2" 
                            value="document-decision"
                            checked={quizAnswers['s2q2']?.includes('document-decision') || false}
                            onChange={(e) => {
                                const curr = quizAnswers['s2q2'] || [];
                                if (e.target.checked) {
                                    handleQuizAnswer('s2q2', [...curr, 'document-decision']);
                                } else {
                                    handleQuizAnswer('s2q2', curr.filter(v => v !== 'document-decision'));
                                }
                            }}
                        />
                        If you suppress or dismiss a finding, document why in a comment or config file
                    </label>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answer:</strong> A and C. Always review findings in context and document your 
                        decisions. Indiscriminate suppression (B) defeats the purpose of tooling and hides real issues.
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q3: What is the main difference between Slither and Solhint?</h4>
                <textarea 
                    value={quizAnswers['s2q3'] || ''}
                    onChange={(e) => handleQuizAnswer('s2q3', e.target.value)}
                    placeholder="Enter your answer..."
                    rows={3}
                    className="textarea-input"
                />
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Sample Answer:</strong> Slither focuses on *security* patterns and known vulns 
                        (reentrancy, unsafe calls). Solhint focuses on *style* and *best practices* (naming, 
                        documentation, gas optimization). Different goals; run both.
                    </div>
                )}
            </div>

            <button onClick={() => { markSectionComplete('section2-quiz'); setCurrentSection('section3'); }} 
                            className="nav-button">
                Next: Section 3 - Fuzzing & Invariants →
            </button>
        </div>
    );

    const Section3 = () => (
        <div className="section-content">
            <h2>Section 3: Fuzzing, Invariants, and Property-Based Testing</h2>

            <h3>3.1 Why Invariants?</h3>
            <p>
                An <strong>invariant</strong> is a condition that must always hold in a correct contract. 
                For a token vault:
            </p>
            <ul>
                <li><strong>Sum invariant:</strong> ∑(user shares) == totalShares.</li>
                <li><strong>Solvency invariant:</strong> totalAssets >= sum of all redeemable tokens.</li>
                <li><strong>Monotonicity invariant:</strong> totalAssets must be non-decreasing (or decrease only via fees).</li>
            </ul>
            <p>
                Instead of asking "is this function correct?", you ask "did this operation preserve the invariants?" 
                This is <strong>property-based testing</strong>: you define the property (invariant) and let a fuzzer 
                try to break it.
            </p>

            <h3>3.2 Designing Invariants</h3>
            <p>
                Good invariants are:
            </p>
            <ul>
                <li><strong>Precise:</strong> Not vague ("system is secure") but measurable ("balance[A] + balance[B] == totalSupply").</li>
                <li><strong>Testable:</strong> Can be encoded as a function that returns true/false.</li>
                <li><strong>Tight:</strong> Not so loose that they never fail (e.g., "totalSupply >= 0" is always true in Solidity).</li>
                <li><strong>Meaningful:</strong> If broken, it indicates a real vulnerability.</li>
            </ul>

            <h3>3.3 Encoding Invariants in Solidity</h3>
            <div className="code-block">
{`// TokenVault with explicit invariant functions
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
}`}
            </div>

            <h3>3.4 Fuzzing Frameworks</h3>
            <p>
                Two main approaches:
            </p>

            <div className="tool-box">
                <h4>Echidna (Trail of Bits)</h4>
                <p>
                    <strong>How it works:</strong> Generates random sequences of contract calls and checks if 
                    invariants remain true. If an invariant fails, Echidna shrinks the counterexample to the 
                    minimal sequence that breaks it.
                </p>
                <p>
                    <strong>Example:</strong> Fuzz the TokenVault with random deposit/withdraw sequences. 
                    If totalShares ever becomes &lt; 0, or solvency fails, Echidna will find it.
                </p>
                <pre>{`# Echidna config
echidna . --contract TokenVault --test-limit 10000
`}</pre>
            </div>

            <div className="tool-box">
                <h4>Foundry Fuzz Testing</h4>
                <p>
                    <strong>How it works:</strong> Integrated into Foundry test framework. Write fuzz tests that 
                    take parameterized inputs; Foundry tries random values.
                </p>
                <pre>{`// Foundry fuzz test
function testWithdrawalPreservesSolvency(uint256 amount) public {
    amount = bound(amount, 1, MAX_DEPOSIT);
    vault.deposit(amount);
    
    uint256 before = vault.invariant_solvency() ? 1 : 0;
    vault.withdraw(vault.shares(address(this)));
    uint256 after = vault.invariant_solvency() ? 1 : 0;
    
    assert(after == 1, "Solvency broken!");
}`}</pre>
            </div>

            <h3>3.5 What Fuzzing Catches Well</h3>
            <ul>
                <li><strong>Rounding errors:</strong> Over 10,000 random deposit/withdrawal sequences, a 1-wei 
                loss per operation accumulates and breaks conservation.</li>
                <li><strong>State machine violations:</strong> Fuzzer tries unexpected state transitions: 
                e.g., withdraw before deposit, setFee during withdrawal, pause during withdrawal.</li>
                <li><strong>Overflow/underflow in calculation:</strong> Even with checked math, rounding 
                can cause underflow if not careful.</li>
                <li><strong>Reentrancy under specific conditions:</strong> If a fuzzer finds a sequence 
                (callA, callB, callA) that breaks invariants, reentrancy may be the cause.</li>
            </ul>

            <h3>3.6 What Fuzzing Misses</h3>
            <ul>
                <li><strong>Incorrect invariant definitions:</strong> If you write an invariant that should fail 
                but doesn't, fuzzing will not catch it.</li>
                <li><strong>Economic exploits requiring off-chain knowledge:</strong> "Attacker buys governance 
                tokens from Uniswap" requires integration testing with mocked DEX.</li>
                <li><strong>Complex oracle or cross-chain interactions:</strong> Fuzzer does not know how oracle 
                behaves in extreme scenarios.</li>
                <li><strong>Gas limit attacks:</strong> Fuzzer may not explore state space large enough to hit 
                gas limits.</li>
            </ul>

            <h3>3.7 Common Invariants by System Type</h3>
            
            <div className="invariant-table">
                <h4>Example Invariants for Common Systems</h4>
                <table>
                    <thead>
                        <tr>
                            <th>System Type</th>
                            <th>Invariant</th>
                            <th>Why It Matters</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Token or Vault</td>
                            <td>∑(balances[user]) == totalSupply</td>
                            <td>Catch double-spending or lost tokens</td>
                        </tr>
                        <tr>
                            <td>Staking Contract</td>
                            <td>totalStaked == ∑(stakes[user]); totalStaked &lt;= ERC20.balanceOf(this)</td>
                            <td>Ensure staked amount matches locked funds</td>
                        </tr>
                        <tr>
                            <td>Lending Protocol</td>
                            <td>totalBorrows &lt;= totalAssets (accounting for reserves) </td>
                            <td>Catch over-lending or insolvency</td>
                        </tr>
                        <tr>
                            <td>NFT Marketplace</td>
                            <td>No user's NFT can be listed twice; escrow balance &gt;= sum of escrowed amounts</td>
                            <td>Prevent double-selling and fund loss</td>
                        </tr>
                        <tr>
                            <td>Governance</td>
                            <td>votingPower[user] &lt;= totalVotingPower; quorum must be met for approval</td>
                            <td>Prevent vote manipulation and tyranny of the minority</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>3.8 Combining Unit, Integration, and Fuzzing Tests</h3>
            <p>
                Build a testing pyramid:
            </p>
            <ul>
                <li>
                    <strong>Unit tests:</strong> Test single functions with known inputs. 
                    E.g., "calling withdraw(100) should reduce shares by 100."
                </li>
                <li>
                    <strong>Integration tests:</strong> Test multi-step workflows. 
                    E.g., "deposit 1000, then withdraw 500, then check balance is correct."
                </li>
                <li>
                    <strong>Fuzz/invariant tests:</strong> Test that invariants hold under random sequences. 
                    E.g., "after any sequence of deposits and withdrawals, solvency holds."
                </li>
            </ul>

            <div className="callout-key">
                <strong>Key Takeaway:</strong> Fuzzing is most powerful when paired with crisp invariants. 
                Invest time defining invariants; the fuzzer does the rest.
            </div>

            <button onClick={() => { markSectionComplete('section3'); setCurrentSection('section3-quiz'); }} 
                            className="nav-button">
                Next: Section 3 Quiz →
            </button>
        </div>
    );

    const Section3Quiz = () => (
        <div className="section-content">
            <h2>Section 3: Knowledge Check</h2>

            <div className="quiz-item">
                <h4>Q1: What is the main goal of fuzzing in contract security?</h4>
                <div className="quiz-options">
                    <label>
                        <input 
                            type="radio" 
                            name="s3q1" 
                            value="random-testing"
                            checked={quizAnswers['s3q1'] === 'random-testing'}
                            onChange={(e) => handleQuizAnswer('s3q1', e.target.value)}
                        />
                        To generate random test data and hope we find a bug
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="s3q1" 
                            value="invariant-checking"
                            checked={quizAnswers['s3q1'] === 'invariant-checking'}
                            onChange={(e) => handleQuizAnswer('s3q1', e.target.value)}
                        />
                        To verify that defined invariants hold under a wide range of state transitions
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="s3q1" 
                            value="gas-optimization"
                            checked={quizAnswers['s3q1'] === 'gas-optimization'}
                            onChange={(e) => handleQuizAnswer('s3q1', e.target.value)}
                        />
                        To measure gas consumption
                    </label>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answer:</strong> B. Fuzzing is directed property-based testing. You define invariants 
                        (properties that must always be true), and the fuzzer generates sequences of calls to try to 
                        break them. Distractor A is passive; distractor C is unrelated.
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q2: Which of the following is a good invariant for a staking contract? (Select all that apply)</h4>
                <div className="quiz-options multi">
                    <label>
                        <input 
                            type="checkbox" 
                            name="s3q2" 
                            value="sum-stakes"
                            checked={quizAnswers['s3q2']?.includes('sum-stakes') || false}
                            onChange={(e) => {
                                const curr = quizAnswers['s3q2'] || [];
                                if (e.target.checked) {
                                    handleQuizAnswer('s3q2', [...curr, 'sum-stakes']);
                                } else {
                                    handleQuizAnswer('s3q2', curr.filter(v => v !== 'sum-stakes'));
                                }
                            }}
                        />
                        Sum of all user stakes equals totalStaked
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="s3q2" 
                            value="all-positive"
                            checked={quizAnswers['s3q2']?.includes('all-positive') || false}
                            onChange={(e) => {
                                const curr = quizAnswers['s3q2'] || [];
                                if (e.target.checked) {
                                    handleQuizAnswer('s3q2', [...curr, 'all-positive']);
                                } else {
                                    handleQuizAnswer('s3q2', curr.filter(v => v !== 'all-positive'));
                                }
                            }}
                        />
                        All stake amounts are non-negative
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            name="s3q2" 
                            value="total-locked"
                            checked={quizAnswers['s3q2']?.includes('total-locked') || false}
                            onChange={(e) => {
                                const curr = quizAnswers['s3q2'] || [];
                                if (e.target.checked) {
                                    handleQuizAnswer('s3q2', [...curr, 'total-locked']);
                                } else {
                                    handleQuizAnswer('s3q2', curr.filter(v => v !== 'total-locked'));
                                }
                            }}
                        />
                        totalStaked &lt;= ERC20.balanceOf(contract) (ensures tokens are actually locked)
                    </label>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answer:</strong> A, B, and C. All three are meaningful: A catches lost or double-staked 
                        amounts, B is enforced by Solidity but documenting it is good practice, C ensures the contract 
                        is solvent (cannot promise more staking rewards than it has tokens).
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q3: Describe one scenario where fuzzing would catch a bug that unit tests might miss.</h4>
                <textarea 
                    value={quizAnswers['s3q3'] || ''}
                    onChange={(e) => handleQuizAnswer('s3q3', e.target.value)}
                    placeholder="Enter your answer..."
                    rows={4}
                    className="textarea-input"
                />
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Sample Answer:</strong> A unit test might check "deposit 100, withdraw 100." 
                        Fuzzing might generate "deposit 7, withdraw 3, deposit 5, withdraw 1, deposit 100, withdraw 108" 
                        and discover that rounding errors accumulate, breaking the conservation invariant. Or fuzzing 
                        might find that calling setFee(100) during a withdrawal breaks the fee accounting.
                    </div>
                )}
            </div>

            <button onClick={() => { markSectionComplete('section3-quiz'); setCurrentSection('section4'); }} 
                            className="nav-button">
                Next: Section 4 - Audit Reporting →
            </button>
        </div>
    );

    const Section4 = () => (
        <div className="section-content">
            <h2>Section 4: Audit Deliverables and Reporting</h2>

            <h3>4.1 The Purpose of an Audit Report</h3>
            <p>
                An audit report is a <strong>risk-management document</strong>. It answers:
            </p>
            <ul>
                <li>What was reviewed and with what methodology?</li>
                <li>What assumptions did we make about the system?</li>
                <li>What are the security risks, ranked by severity?</li>
                <li>How can each risk be fixed?</li>
                <li>What are the residual risks we are accepting?</li>
            </ul>
            <p>
                A good report is <strong>actionable:</strong> a developer should be able to read it and 
                implement fixes; a business stakeholder should understand the impact and prioritize resources.
            </p>

            <h3>4.2 Audit Report Structure</h3>
            
            <div className="report-structure">
                <h4>1. Executive Summary (1–2 pages)</h4>
                <ul>
                    <li>1-2 sentence overview of the system.</li>
                    <li>Critical or high-severity findings (if any).</li>
                    <li>Confidence level ("Low risk," "Moderate risk," "High risk").</li>
                    <li>Recommendation: deploy, require fixes, or do not deploy.</li>
                </ul>

                <h4>2. Scope & Methodology (1–2 pages)</h4>
                <ul>
                    <li>Which contracts/functions were reviewed.</li>
                    <li>Which were out of scope (e.g., "We did not review the external oracle contract").</li>
                    <li>Tools used: Slither, Echidna, manual review, Mythril.</li>
                    <li>Assumptions: e.g., "We assumed the ERC20 token is not malicious," 
                            "Admins are trusted," "No flash-loan attacks."</li>
                    <li>Timeline: hours spent, review depth.</li>
                </ul>

                <h4>3. Threat Model Summary (1–2 pages)</h4>
                <ul>
                    <li>Key assets and actors (from Section 1).</li>
                    <li>Trust boundaries and external dependencies.</li>
                    <li>Known attack vectors: rounding, oracle starkness, reentrancy, etc.</li>
                </ul>

                <h4>4. Findings (Variable length)</h4>
                <p>
                    For each finding:
                </p>
                <ul>
                    <li><strong>Title:</strong> Red Hat's Privilege Escalation in setFee().</li>
                    <li><strong>Severity:</strong> Critical / High / Medium / Low / Informational (see rubric below).</li>
                    <li><strong>Description:</strong> What is the issue?</li>
                    <li><strong>Impact:</strong> What happens if this is exploited? (e.g., "Attacker steals $1M in user funds").</li>
                    <li><strong>Likelihood:</strong> How easy is it to exploit? (e.g., "Trivial; a single txn with public function").</li>
                    <li><strong>Proof of Concept (PoC):</strong> Code or sequence that demonstrates the bug.</li>
                    <li><strong>Remediation:</strong> How to fix it (with code example if possible).</li>
                </ul>

                <h4>5. Severity Rubric</h4>
                <table className="severity-table">
                    <thead>
                        <tr>
                            <th>Severity</th>
                            <th>Impact</th>
                            <th>Likelihood</th>
                            <th>Examples</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Critical</strong></td>
                            <td>Direct loss of user funds or total protocol failure</td>
                            <td>Trivial; no special conditions</td>
                            <td>Reentrancy in withdraw; unchecked transfer; missing access control on critical function</td>
                        </tr>
                        <tr>
                            <td><strong>High</strong></td>
                            <td>Significant loss of funds or major functionality breakdown</td>
                            <td>Easy; requires minimal attacker setup or miner collusion</td>
                            <td>Oracle manipulation; insufficient validation; broken invariant under specific conditions</td>
                        </tr>
                        <tr>
                            <td><strong>Medium</strong></td>
                            <td>Partial loss or limited DoS</td>
                            <td>Moderate; requires some external condition or attacker sophistication</td>
                            <td>Unnecessary revert on edge case; expensive operation; rounding loss of 1 wei per 1M txns</td>
                        </tr>
                        <tr>
                            <td><strong>Low</strong></td>
                            <td>Minimal impact; quality-of-life issue</td>
                            <td>Difficult or requires multiple failures</td>
                            <td>Missing event; suboptimal gas usage; style issue</td>
                        </tr>
                        <tr>
                            <td><strong>Informational</strong></td>
                            <td>No direct impact; educational</td>
                            <td>N/A</td>
                            <td>Code comment suggestion; architecture note; gas tip</td>
                        </tr>
                    </tbody>
                </table>

                <h4>6. Risk Acceptance (1–2 pages)</h4>
                <ul>
                    <li>Which findings were acknowledged but not fixed (and why).</li>
                    <li>What is the residual risk? E.g., "We accept the oracle latency risk because 
                            (1) Uniswap TWAP is resistant to short-term attacks, (2) our price bounds allow 5% slippage, 
                            (3) we monitor off-chain."</li>
                </ul>

                <h4>7. Conclusion</h4>
                <ul>
                    <li>Overall assessment: system is ready for production, or needs changes.</li>
                    <li>Verification: statement that fixes were re-reviewed if applicable.</li>
                </ul>
            </div>

            <h3>4.3 Writing a Finding: The Full Example</h3>
            <div className="finding-example">
                <h4>Finding: Unguarded setFee Allows Arbitrary Fee Changes</h4>
                <p><strong>Severity:</strong> High</p>
                <p>
                    <strong>Description:</strong> The setFee() function in TokenVault requires that msg.sender == governance, 
                    but governance is an EOA address set at initialization. There is no governance contract, multi-sig, or 
                    timelock. If the governance private key is compromised or lost, the protocol is unmanageable or 
                    arbitrarily ruined.
                </p>
                <p>
                    <strong>Impact:</strong> An attacker who compromises the governance EOA can set feePercent to 100%, 
                    making all withdrawals revert (fee > assetAmount). This effectively locks user funds forever, resulting 
                    in a complete loss of confidence and potential liability.
                </p>
                <p>
                    <strong>Likelihood:</strong> High. EOA key compromise is a well-known risk vector. Governance keys are 
                    frequent targets.
                </p>
                <p><strong>Proof of Concept:</strong></p>
                <pre>{`
// Assume attacker has compromised the governance EOA
address attacker = # compromised governance key
vault.setFee(100); // Fee is now 100%

// Any user's withdrawal reverts
uint256 assetAmount = (shareAmount * totalAssets) / totalShares;
uint256 fee = (assetAmount * feePercent) / 100; // fee == assetAmount
uint256 net = assetAmount - fee; // net == 0, but reverts if net < minAmount
// -> User cannot withdraw
`}</pre>
                <p>
                    <strong>Remediation:</strong>
                </p>
                <ol>
                    <li>Replace the governance EOA with a multi-sig wallet (e.g., Gnosis Safe) or a governance token + voting contract.</li>
                    <li>Add a timelock: new fee only takes effect 48 hours after proposal, giving users time to farm or withdraw.</li>
                    <li>Add bounds on fee: require(newFee &lt;= 50, "Fee capped at 50%") to prevent 100% fees.</li>
                    <li>Add a pause mechanism that governance can trigger, but not setFee.</li>
                </ol>
                <p>
                    <strong>Recommended Fix (Code):</strong>
                </p>
                <pre>{`
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
`}</pre>
            </div>

            <h3>4.4 Red Flags in Audit Reports</h3>
            <ul>
                <li><strong>Vague findings:</strong> "Code quality issues found" without specifics.</li>
                <li><strong>Missing PoCs:</strong> A finding without a PoC is hard to believe or reproduce.</li>
                <li><strong>No remediation:</strong> Auditor points out a problem but offers no fix.</li>
                <li><strong>Ignored assumptions:</strong> Report does not mention external dependencies 
                        (e.g., oracle or multi-sig governance) that could fail.</li>
                <li><strong>Overstated severity:</strong> A style issue marked Critical.</li>
            </ul>

            <h3>4.5 Audit Checklist for Reviewers</h3>
            <ul>
                <li>[ ] Threat model documented and realistic?</li>
                <li>[ ] Scope is clear: in vs. out?</li>
                <li>[ ] All Critical/High findings have PoCs?</li>
                <li>[ ] Remediation is specific and testable (not "improve security")?</li>
                <li>[ ] Risk acceptance is explicit: "We accept this because..."?</li>
                <li>[ ] No unexplained false negatives: "This tool found X, why did not Slither?"</li>
                <li>[ ] Assumptions are reasonable and documented?</li>
            </ul>

            <div className="callout-key">
                <strong>Key Takeaway:</strong> An audit report is a <strong>negotiation</strong> between 
                the auditor (what can go wrong) and the team (what we can afford to fix). A great report 
                helps the team make informed bets about which risks to accept.
            </div>

            <button onClick={() => { markSectionComplete('section4'); setCurrentSection('section4-quiz'); }} 
                            className="nav-button">
                Next: Section 4 Quiz →
            </button>
        </div>
    );

    const Section4Quiz = () => (
        <div className="section-content">
            <h2>Section 4: Knowledge Check</h2>

            <div className="quiz-item">
                <h4>Q1: A finding is marked "Critical." What must it contain at minimum?</h4>
                <div className="quiz-options">
                    <label>
                        <input 
                            type="radio" 
                            name="s4q1" 
                            value="description"
                            checked={quizAnswers['s4q1'] === 'description'}
                            onChange={(e) => handleQuizAnswer('s4q1', e.target.value)}
                        />
                        Just a description of the problem
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="s4q1" 
                            value="poc-remediation"
                            checked={quizAnswers['s4q1'] === 'poc-remediation'}
                            onChange={(e) => handleQuizAnswer('s4q1', e.target.value)}
                        />
                        A PoC demonstrating the issue and a specific, testable remediation
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="s4q1" 
                            value="severity-only"
                            checked={quizAnswers['s4q1'] === 'severity-only'}
                            onChange={(e) => handleQuizAnswer('s4q1', e.target.value)}
                        />
                        Just the severity rating
                    </label>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answer:</strong> B. A Critical finding is actionable only if the team can reproduce 
                        and fix it. PoC + remediation are non-negotiable. Distractor A is incomplete; distractor C is useless.
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q2: Why should an audit report include a "Risk Acceptance" section?</h4>
                <textarea 
                    value={quizAnswers['s4q2'] || ''}
                    onChange={(e) => handleQuizAnswer('s4q2', e.target.value)}
                    placeholder="Enter your answer..."
                    rows={3}
                    className="textarea-input"
                />
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Sample Answer:</strong> Risk acceptance clarifies that the team is aware of a finding 
                        (e.g., oracle latency risk) and has decided it is acceptable given mitigations (e.g., TWAP, 
                        monitoring) or business constraints. It shifts responsibility from "auditor missed this" to 
                        "team accepted this." This is critical for liability and decision-making.
                    </div>
                )}
            </div>

            <div className="quiz-item">
                <h4>Q3: Match each to its severity:</h4>
                <div className="matching-questions">
                    <div className="match-item">
                        <label>
                            "A missing event emitted in a state-changing function"
                            <select value={quizAnswers['s4q3a'] || ''} onChange={(e) => handleQuizAnswer('s4q3a', e.target.value)}>
                                <option value="">-- Select --</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                                <option value="info">Informational</option>
                            </select>
                        </label>
                    </div>
                    <div className="match-item">
                        <label>
                            "Unguarded setFee() allows attacker to set fee to 100%, locking users"
                            <select value={quizAnswers['s4q3b'] || ''} onChange={(e) => handleQuizAnswer('s4q3b', e.target.value)}>
                                <option value="">-- Select --</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                                <option value="info">Informational</option>
                            </select>
                        </label>
                    </div>
                    <div className="match-item">
                        <label>
                            "Rounding loss of 1 wei per every billion-token withdrawal"
                            <select value={quizAnswers['s4q3c'] || ''} onChange={(e) => handleQuizAnswer('s4q3c', e.target.value)}>
                                <option value="">-- Select --</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                                <option value="info">Informational</option>
                            </select>
                        </label>
                    </div>
                </div>
                {instructorMode && (
                    <div className="answer-reveal">
                        <strong>Answers:</strong> Missing event = Informational (nice-to-have, no security impact). 
                        Unguarded setFee = Critical (direct loss of user funds). 
                        Tiny rounding = Low (impact is negligible, only matters at extreme scale).
                    </div>
                )}
            </div>

            <button onClick={() => { markSectionComplete('section4-quiz'); setCurrentSection('workshop'); }} 
                            className="nav-button">
                Next: Interactive Threat Modeling Workshop →
            </button>
        </div>
    );

    const Workshop = () => (
        <div className="section-content">
            <h2>Interactive Workshop: Build a Threat Model</h2>
            <p>
                In this activity, you will create a threat model for a simplified borrowing protocol. 
                Review the spec and fill in the key components below.
            </p>

            <h3>Protocol Specification: SimpleLend</h3>
            <div className="spec-box">
                <h4>SimpleLend Overview</h4>
                <ul>
                    <li>Users deposit ERC20 stablecoins (USDC) to a lending pool.</li>
                    <li>Borrowers can take loans up to 80% of their collateral value (computed via a Chainlink price oracle).</li>
                    <li>Loans accrue interest daily (1% per day, compounded).</li>
                    <li>A liquidation bot monitors undercollateralized loans and sells collateral to repay debt.</li>
                    <li>Admin can set the collateral ratio and interest rate.</li>
                </ul>
            </div>

            <div className="workshop-section">
                <h3>Step 1: Identify Assets</h3>
                <p>What critical assets must SimpleLend protect? List at least 3.</p>
                <textarea 
                    value={workshopState.assets}
                    onChange={(e) => setWorkshopState({...workshopState, assets: e.target.value})}
                    placeholder={`Example: User deposits (USDC), Borrower collateral (ETH, USDC), Admin keys...`}
                    rows={4}
                    className="textarea-input"
                />
            </div>

            <div className="workshop-section">
                <h3>Step 2: Identify Actors</h3>
                <p>Who can interact with SimpleLend? List the actors and their roles.</p>
                <textarea 
                    value={workshopState.actors}
                    onChange={(e) => setWorkshopState({...workshopState, actors: e.target.value})}
                    placeholder={`Example: Honest lender (deposits and waits for interest), dishonest borrower (defaults)...`}
                    rows={4}
                    className="textarea-input"
                />
            </div>

            <div className="workshop-section">
                <h3>Step 3: Define Trust Boundaries</h3>
                <p>Where does control transfer between trusted and untrusted parties?</p>
                <textarea 
                    value={workshopState.boundaries}
                    onChange={(e) => setWorkshopState({...workshopState, boundaries: e.target.value})}
                    placeholder={`Example: User input -> SimpleLend contract; SimpleLend -> Chainlink Oracle; SimpleLend -> liquidator (untrusted)...`}
                    rows={4}
                    className="textarea-input"
                />
            </div>

            <div className="workshop-section">
                <h3>Step 4: Attack Surface</h3>
                <p>Where can attackers exploit SimpleLend? List 2–3 potential attack vectors.</p>
                <textarea 
                    value={workshopState.entryPoints}
                    onChange={(e) => setWorkshopState({...workshopState, entryPoints: e.target.value})}
                    placeholder={`Example: Flash-loan a stablecoin, wait for oracle price to spike, take a massive loan...`}
                    rows={4}
                    className="textarea-input"
                />
            </div>

            <button onClick={() => setWorkshopState({...workshopState, submitted: true})} className="nav-button">
                Submit & Compare to Reference Answer
            </button>

            {workshopState.submitted && (
                <div className="reference-answer">
                    <h3>Reference Threat Model</h3>
                    <div className="ref-section">
                        <h4>Assets:</h4>
                        <ul>
                            <li>Lender deposits (USDC locked in pool).</li>
                            <li>Borrower collateral (ETH or other assets pledged).</li>
                            <li>Admin keys (power to change collateral ratio and interest rate).</li>
                            <li>Oracle feed (Chainlink price; if manipulated, collateral valuation fails).</li>
                            <li>Liquidation incentives (bot may collude with borrowers or manipulate market).</li>
                        </ul>
                    </div>

                    <div className="ref-section">
                        <h4>Actors:</h4>
                        <ul>
                            <li><strong>Honest Lender:</strong> Deposits USDC, earns interest, withdraws later.</li>
                            <li><strong>Honest Borrower:</strong> Pledges collateral, takes a loan, repays on time.</li>
                            <li><strong>Dishonest Borrower:</strong> Takes a loan and defaults, hoping collateral value drops.</li>
                            <li><strong>Liquidator Bot:</strong> Monitors loans and sells undercollateralized collateral. May be compromised or manipulated.</li>
                            <li><strong>Admin:</strong> Trusted but may be compromised; can change rates and collateral ratios.</li>
                            <li><strong>Oracle Operator (Chainlink):</strong> Report prices; we trust them but must account for staleness/manipulation.</li>
                            <li><strong>Attacker (Flash-loaner, arbitrageur):</strong> Uses flash loans and DEX manipulations to exploit the protocol.</li>
                        </ul>
                    </div>

                    <div className="ref-section">
                        <h4>Trust Boundaries:</h4>
                        <pre>{`┌─────────────────────────────────────┐
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
`}</pre>
                    </div>

                    <div className="ref-section">
                        <h4>Attack Surfaces (Top 3):</h4>
                        <ol>
                            <li>
                                <strong>Oracle price manipulation:</strong> Flash-lend a large amount of ETH on Uniswap, 
                                drive ETH price down, then borrow against now-cheap collateral. Liquidator does not trigger 
                                (price only temporary).
                            </li>
                            <li>
                                <strong>Liquidation front-running:</strong> Liquidator sees a loan underwater in mempool. 
                                Attacker fronts the liquidation, buys the collateral cheaper, sells it for profit while 
                                liquidator loses on slippage.
                            </li>
                            <li>
                                <strong>Admin collusion:</strong> Admin lowers collateral ratio to 10%, allowing a borrower 
                                to overborrow. Both profit if collateral value fails.
                            </li>
                        </ol>
                    </div>

                    <p className="workshop-note">
                        <strong>Your model is strong if it covers:</strong> external dependencies (oracle, token), 
                        external actors (liquidator, flash-loaner), and multi-actor collusion (admin + borrower). 
                        Economic incentives matter as much as code bugs.
                    </p>
                </div>
            )}

            <button onClick={() => { markSectionComplete('workshop'); setCurrentSection('casestudy'); }} 
                            className="nav-button">
                Next: Case Study - A Real Exploit →
            </button>
        </div>
    );

    const CaseStudy = () => (
        <div className="section-content">
            <h2>Case Study: Yield Protocol "Trust Boundary" Exploit (2023)</h2>

            <h3>The System</h3>
            <p>
                Yield Protocol is a fixed-rate lending protocol. Users can lend out stablecoins via "fyTokens" 
                (fixed-yield tokens) or borrow by putting up collateral. The protocol uses an oracle to price 
                collateral and dynamically adjusts borrow rates.
            </p>

            <h3>The Threat Model (Stated by Yield)</h3>
            <ul>
                <li><strong>Assumption:</strong> "The oracle is a reliable price feed; it may be 1 hour stale but not worse."</li>
                <li><strong>Assumption:</strong> "The collateral (USDC, wETH) is liquid and can be liquidated quickly."</li>
                <li><strong>Trust boundary:</strong> "Contracts are upgradeable via a multi-sig governance. Multi-sig is 5-of-8, trusted."</li>
            </ul>

            <h3>The Attack</h3>
            <p>
                In March 2023, a liquidation event occurred:
            </p>
            <ol>
                <li>
                    <strong>Market turmoil:</strong> A major stablecoin (USDC) briefly depegged to $0.87 on some DEXs 
                    (due to bank-run fears). The oracle was stale and reported $0.99.
                </li>
                <li>
                    <strong>Liquidation cascade:</strong> As USDC-denominated collateral fell in real value, liquidators 
                    triggered liquidations based on the oracle price ($0.99), not the real market price ($0.87).
                </li>
                <li>
                    <strong>Bad liquidations:</strong> Liquidators sold collateral for $0.87 USDC to repay debt valued at $0.99, 
                    resulting in a ~$12M loss that was not recovered.
                </li>
            </ol>

            <h3>What Went Wrong</h3>
            <p>
                The threat model <strong>failed to account for oracle staleness under extreme market conditions</strong>:
            </p>
            <ul>
                <li>
                    <strong>Assumption violated:</strong> "Oracle is at most 1 hour stale" did not hold during the TVL crisis. 
                    Oracle fell behind by 3+ hours as DEXs were congested.
                </li>
                <li>
                    <strong>Trust boundary ignored:</strong> The protocol treated oracle data as "trusted," but failed to 
                    validate against on-chain prices (Uniswap TWAP, Balancer LP rates, etc.).
                </li>
                <li>
                    <strong>Market assumption:</strong> "Collateral is liquid" failed: during bank-run fears, 
                    USDC liquidity evaporated, prices diverged across DEXs, and liquidators could not rebalance.
                </li>
            </ul>

            <h3>Prevention Playbook</h3>
            <div className="playbook-box">
                <h4>✓ What Yield Should Have Done (Post-Mortem)</h4>
                <ol>
                    <li>
                        <strong>Document oracle assumptions explicitly:</strong> "Oracle is reliable within ±5% and 
                        &lt; 30 min staleness under normal conditions. During extreme volatility or network congestion, 
                        we may disable liquidations."
                    </li>
                    <li>
                        <strong>Deploy a circuit breaker:</strong> If oracle price diverges &gt; 5% from Uniswap TWAP 
                        for &gt; 5 min, disable liquidations until they re-converge. (This is exactly what Aave and Compound do.)
                    </li>
                    <li>
                        <strong>Add price bounds:</strong> If USDC price reported by oracle is &lt; $0.95, flag it as 
                        suspicious and require human review before liquidation.
                    </li>
                    <li>
                        <strong>Liquidation grace period:</strong> When a loan becomes undercollateralized, wait 2 hours 
                        before allowing liquidation, giving markets time to stabilize.
                    </li>
                    <li>
                        <strong>Fuzz & invariant test:</strong> Encode invariant: "A borrower never loses more than 
                        2% of collateral value in a liquidation." Fuzz under oracle price scenarios; detect violations.
                    </li>
                    <li>
                        <strong>Threat model audit:</strong> Have an external auditor re-review assumptions annually. 
                        Market conditions change; assumptions must be re-validated.
                    </li>
                </ol>
            </div>

            <div className="callout-pitfall">
                <strong>Common Pitfall:</strong> Teams build threat models before mainnet, mark them "complete," 
                and never revisit. But markets evolve, attackers devise new techniques, and off-chain events 
                (regulation, bank failures) can invalidate assumptions. <strong>Threat models are living documents.</strong>
            </div>

            <button onClick={() => { markSectionComplete('casestudy'); setCurrentSection('auditexercise'); }} 
                            className="nav-button">
                Next: Hands-On Audit Exercise →
            </button>
        </div>
    );

    const AuditExercise = () => (
        <div className="section-content">
            <h2>Hands-On: Write an Audit Report</h2>
            <p>
                Below is a mini-protocol specification. You will write an audit-style report covering 
                scope, threat model, and findings. Use the template and guidelines from Section 4.
            </p>

            <h3>Mini Protocol: SimpleSwap</h3>
            <div className="spec-box">
                <p>
                    SimpleSwap is a 2-token constant-product AMM (like Uniswap v2). Users deposit liquidity in pairs; 
                    traders swap one token for another. There is a 0.3% swap fee. The contract is owned by an EOA admin.
                </p>
                <pre>{`contract SimpleSwap {
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
}`}
                </pre>
            </div>

            <div className="report-form">
                <h3>Your Audit Report</h3>
                
                <div className="form-section">
                    <h4>1. Executive Summary</h4>
                    <textarea 
                        value={reportState.scope}
                        onChange={(e) => setReportState({...reportState, scope: e.target.value})}
                        placeholder="Write a 2-3 sentence overview: what was reviewed, critical findings (if any), and a recommendation."
                        rows={4}
                        className="textarea-input"
                    />
                </div>

                <div className="form-section">
                    <h4>2. Scope & Methodology</h4>
                    <textarea 
                        value={reportState.methodology}
                        onChange={(e) => setReportState({...reportState, methodology: e.target.value})}
                        placeholder={`Contracts reviewed: SimpleSwap.sol. Out of scope: token implementations. Tools: manual review, Slither. Assumptions: tokens are ERC20-compliant, owner is not malicious (but key may be compromised).`}
                        rows={4}
                        className="textarea-input"
                    />
                </div>

                <div className="form-section">
                    <h4>3. Threat Model Summary</h4>
                    <textarea 
                        value={reportState.threatModel}
                        onChange={(e) => setReportState({...reportState, threatModel: e.target.value})}
                        placeholder={`Assets: liquidity pool, trader funds, owner keys. Actors: LP (trusts protocol), Trader (untrusted), owner (trusted but key may be stolen). Trust boundaries: user input -> contract, contract -> ERC20 token. Attack surfaces: swap function (sandwich attacks), setOwner (unguarded if key is stolen).`}
                        rows={5}
                        className="textarea-input"
                    />
                </div>

                <div className="form-section">
                    <h4>4. Findings</h4>
                    <p>
                        List at least two findings in the format: 
                        <br/><strong>Title | Severity | Description | Impact | Likelihood | Remediation</strong>
                    </p>
                    <textarea 
                        value={reportState.findings}
                        onChange={(e) => setReportState({...reportState, findings: e.target.value})}
                        placeholder={`Example:
Unguarded setOwner() | High | The setOwner function only checks msg.sender == owner, but there is no multi-sig or timelock. If owner key is stolen, attacker can transfer ownership. | Attacker gains control of the protocol and can rug-pull liquidity. | High - EOA keys are commonly compromised. | Upgrade to multi-sig (Gnosis Safe); add 48-hour timelock.

Sandwich Attack Vulnerability | Medium | Traders' swap txns are visible in mempool. Front-runner can submit identical swap with higher gas, get better price, then do the victim's swap at worse price. | Traders lose 0.1-1% to sandwiching. | Moderate - requires mempool visibility and gas arbitrage. | Add MEV-resistant routing via MEV-Relay or private mempools.`}
                        rows={8}
                        className="textarea-input"
                    />
                </div>

                <div className="form-section">
                    <h4>5. Risk Acceptance & Remediation Prioritization</h4>
                    <textarea 
                        value={reportState.remediation}
                        onChange={(e) => setReportState({...reportState, remediation: e.target.value})}
                        placeholder={`We recommend fixing High and above before mainnet. Sandwich attacks (Medium) are an AMM-wide problem; we accept this risk if you deploy via MEV-resistant routing (MEV-Relay, MEV-Share) or front-running protection. We will re-verify fixes in a follow-up review.`}
                        rows={4}
                        className="textarea-input"
                    />
                </div>

                <button onClick={() => setReportState({...reportState, submitted: true})} className="nav-button">
                    Submit Report & See Feedback
                </button>
            </div>

            {reportState.submitted && (
                <div className="evaluation">
                    <h3>Feedback on Your Report</h3>
                    <div className="feedback-box">
                        <h4>Strong Points to Look For:</h4>
                        <ul>
                            <li>
                                <strong>Identified unguarded setOwner:</strong> This is a critical finding. Ownership transfer 
                                is an irreversible, high-impact function that should be heavily defended. Bonus points if you 
                                mentioned the EOA key compromise risk.
                            </li>
                            <li>
                                <strong>Mentioned sandwich attacks:</strong> This is a realistic AMM vulnerability. Good if you 
                                noted that it is hard to prevent entirely but can be mitigated.
                            </li>
                            <li>
                                <strong>Threat model includes actors and boundaries:</strong> If you identified the LP, trader, 
                                owner, and ERC20 contract as separate trust zones, you are thinking correctly.
                            </li>
                        </ul>

                        <h4>Common Gaps to Avoid:</h4>
                        <ul>
                            <li>
                                <strong>Missing findings:</strong> Did you spot the rounding issue? 
                                (Constant product = reserve0 * reserve1 should be preserved, but truncation in division breaks it.)
                            </li>
                            <li>
                                <strong>Vague remediation:</strong> "Improve security" is not actionable. Good remediation 
                                includes code changes, e.g., "add multi-sig via Gnosis Safe."
                            </li>
                            <li>
                                <strong>Ignored assumptions:</strong> Did you note that the protocol assumes ERC20 tokens are 
                                safe and don't have hooks or reentrancy bugs? This matters.
                            </li>
                        </ul>

                        <h4>Severity Calibration:</h4>
                        <p>
                            <strong>Critical:</strong> Unguarded setOwner (loss of control). <br/>
                            <strong>High:</strong> Rounding/dust attacks in swap. <br/>
                            <strong>Medium:</strong> Sandwich attacks, oracle staleness (if added). <br/>
                            <strong>Low:</strong> Missing event, style issues.
                        </p>

                        <h4>Next Steps:</h4>
                        <p>
                            If the team fixes all Critical/High issues, run static analysis tools (Slither, Solhint) and 
                            fuzz the invariant: <code>reserve0_before * reserve1_before == reserve0_after * reserve1_after</code> 
                            (allowing for the 0.3% fee difference).
                        </p>
                    </div>
                </div>
            )}

            <button onClick={() => { markSectionComplete('auditexercise'); setCurrentSection('final'); }} 
                            className="nav-button">
                Next: Final Assessment →
            </button>
        </div>
    );

    const FinalAssessment = () => (
        <div className="section-content">
            <h2>Final Assessment</h2>
            <p>
                This assessment mixes conceptual questions, scenario reasoning, and design tasks. 
                Answer all questions, then submit for scoring.
            </p>

            <div className="assessment-quiz">
                <div className="quiz-item">
                    <h4>Q1: Which of the following is the PRIMARY benefit of threat modeling before coding?</h4>
                    <div className="quiz-options">
                        <label>
                            <input 
                                type="radio" 
                                name="final1" 
                                value="design-surface"
                                checked={quizAnswers['final-q1'] === 'design-surface'}
                                onChange={(e) => handleQuizAnswer('final-q1', e.target.value)}
                            />
                            To define security requirements and attack surfaces before architecture decisions are locked
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="final1" 
                                value="impress"
                                checked={quizAnswers['final-q1'] === 'impress'}
                                onChange={(e) => handleQuizAnswer('final-q1', e.target.value)}
                            />
                            To impress investors and insurance companies
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="final1" 
                                value="replace-audit"
                                checked={quizAnswers['final-q1'] === 'replace-audit'}
                                onChange={(e) => handleQuizAnswer('final-q1', e.target.value)}
                            />
                            To replace the need for a security audit
                        </label>
                    </div>
                </div>

                <div className="quiz-item">
                    <h4>Q2: In a threat model, which elements are essential? (Select all that apply)</h4>
                    <div className="quiz-options multi">
                        <label>
                            <input 
                                type="checkbox" 
                                name="final2" 
                                value="assets"
                                checked={quizAnswers['final-q2']?.includes('assets') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q2'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q2', [...curr, 'assets']);
                                    } else {
                                        handleQuizAnswer('final-q2', curr.filter(v => v !== 'assets'));
                                    }
                                }}
                            />
                            Assets (what must be protected)
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="final2" 
                                value="actors"
                                checked={quizAnswers['final-q2']?.includes('actors') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q2'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q2', [...curr, 'actors']);
                                    } else {
                                        handleQuizAnswer('final-q2', curr.filter(v => v !== 'actors'));
                                    }
                                }}
                            />
                            Actors (who can interact)
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="final2" 
                                value="entry-points"
                                checked={quizAnswers['final-q2']?.includes('entry-points') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q2'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q2', [...curr, 'entry-points']);
                                    } else {
                                        handleQuizAnswer('final-q2', curr.filter(v => v !== 'entry-points'));
                                    }
                                }}
                            />
                            Entry points and attack surfaces
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="final2" 
                                value="colors"
                                checked={quizAnswers['final-q2']?.includes('colors') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q2'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q2', [...curr, 'colors']);
                                    } else {
                                        handleQuizAnswer('final-q2', curr.filter(v => v !== 'colors'));
                                    }
                                }}
                            />
                            Color schemes for diagrams
                        </label>
                    </div>
                </div>

                <div className="quiz-item">
                    <h4>Q3: Static analysis tools like Slither are MOST LIKELY to miss which of the following?</h4>
                    <div className="quiz-options">
                        <label>
                            <input 
                                type="radio" 
                                name="final3" 
                                value="logic-bugs"
                                checked={quizAnswers['final-q3'] === 'logic-bugs'}
                                onChange={(e) => handleQuizAnswer('final-q3', e.target.value)}
                            />
                            Logic bugs where the code does what was written but not what was intended
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="final3" 
                                value="missing-guard"
                                checked={quizAnswers['final-q3'] === 'missing-guard'}
                                onChange={(e) => handleQuizAnswer('final-q3', e.target.value)}
                            />
                            Missing access control guards (onlyOwner, etc.)
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="final3" 
                                value="unchecked"
                                checked={quizAnswers['final-q3'] === 'unchecked'}
                                onChange={(e) => handleQuizAnswer('final-q3', e.target.value)}
                            />
                            Unchecked return values from transfer()
                        </label>
                    </div>
                </div>

                <div className="quiz-item">
                    <h4>Q4: Which of the following is a valid way to test that an invariant holds? (Select all that apply)</h4>
                    <div className="quiz-options multi">
                        <label>
                            <input 
                                type="checkbox" 
                                name="final4" 
                                value="unit-tests"
                                checked={quizAnswers['final-q4']?.includes('unit-tests') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q4'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q4', [...curr, 'unit-tests']);
                                    } else {
                                        handleQuizAnswer('final-q4', curr.filter(v => v !== 'unit-tests'));
                                    }
                                }}
                            />
                            Unit tests: check invariant holds before and after one function call
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="final4" 
                                value="fuzz-invariants"
                                checked={quizAnswers['final-q4']?.includes('fuzz-invariants') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q4'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q4', [...curr, 'fuzz-invariants']);
                                    } else {
                                        handleQuizAnswer('final-q4', curr.filter(v => v !== 'fuzz-invariants'));
                                    }
                                }}
                            />
                            Fuzz/property-based testing: randomized sequences of calls to check invariant
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="final4" 
                                value="integration"
                                checked={quizAnswers['final-q4']?.includes('integration') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q4'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q4', [...curr, 'integration']);
                                    } else {
                                        handleQuizAnswer('final-q4', curr.filter(v => v !== 'integration'));
                                    }
                                }}
                            />
                            Integration tests: multi-step workflows with manual assertions
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="final4" 
                                value="prayer"
                                checked={quizAnswers['final-q4']?.includes('prayer') || false}
                                onChange={(e) => {
                                    const curr = quizAnswers['final-q4'] || [];
                                    if (e.target.checked) {
                                        handleQuizAnswer('final-q4', [...curr, 'prayer']);
                                    } else {
                                        handleQuizAnswer('final-q4', curr.filter(v => v !== 'prayer'));
                                    }
                                }}
                            />
                            Hope and prayer
                        </label>
                    </div>
                </div>

                <div className="quiz-item">
                    <h4>Q5: Consider a lending protocol with an oracle. Which invariant is MOST critical to encode?</h4>
                    <div className="quiz-options">
                        <label>
                            <input 
                                type="radio" 
                                name="final5" 
                                value="solvency"
                                checked={quizAnswers['final-q5'] === 'solvency'}
                                onChange={(e) => handleQuizAnswer('final-q5', e.target.value)}
                            />
                            Solvency: totalAssets >= totalBorrows (accounting for collateral and reserves)
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="final5" 
                                value="interest"
                                checked={quizAnswers['final-q5'] === 'interest'}
                                onChange={(e) => handleQuizAnswer('final-q5', e.target.value)}
                            />
                            Interest rates are always between 0% and 100%
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="final5" 
                                value="gas"
                                checked={quizAnswers['final-q5'] === 'gas'}
                                onChange={(e) => handleQuizAnswer('final-q5', e.target.value)}
                            />
                            No transaction uses more than 5M gas
                        </label>
                    </div>
                </div>
            </div>

            <button onClick={handleFinalSubmit} className="nav-button">
                Submit Final Assessment
            </button>

            {finalScore !== null && (
                <div className="final-results">
                    <h3>Results</h3>
                    <div className="score-display">
                        <div className="score-circle">{Math.round(finalScore)}</div>
                        <p className="score-label">/ 100</p>
                    </div>

                    {finalScore >= 80 && (
                        <div className="result-excellent">
                            <h4>Excellent! You have mastered threat modeling and audit methods.</h4>
                            <p>
                                You demonstrated strong understanding of threat modeling fundamentals, static analysis 
                                limitations, invariant design, and audit reporting. You are ready to lead security reviews 
                                and design secure protocols. Next: dive into formal verification and economic modeling.
                            </p>
                        </div>
                    )}

                    {finalScore >= 60 && finalScore < 80 && (
                        <div className="result-good">
                            <h4>Good progress! Review the weak areas below.</h4>
                            <ul>
                                <li><strong>If you missed Q1 or Q2:</strong> Revisit Section 1 and the threat modeling examples. Focus on documenting assets, actors, and boundaries explicitly.</li>
                                <li><strong>If you missed Q3:</strong> Read Section 2.3 again. Static analysis misses logic bugs and economic exploits; remember the false-negative examples.</li>
                                <li><strong>If you missed Q4 or Q5:</strong> Review Section 3. Practice encoding invariants and running Echidna or Foundry fuzzing on a toy contract.</li>
                            </ul>
                        </div>
                    )}

                    {finalScore < 60 && (
                        <div className="result-needs-review">
                            <h4>You would benefit from a re-read of the material.</h4>
                            <p>
                                Threat modeling and self-assessment are critical to secure contract design. 
                                Please revisit the sections where you struggled, and try the workshops again. 
                                Consider working through the TokenVault and SimpleLend examples by hand.
                            </p>
                        </div>
                    )}

                    <button onClick={() => { 
                        setQuizAnswers({});
                        setFinalScore(null);
                        setCurrentSection('intro');
                        setCompletedSections(new Set());
                    }} className="nav-button">
                        Reset and Start Over
                    </button>
                </div>
            )}
        </div>
    );

    const renderSection = () => {
        switch(currentSection) {
            case 'intro': return <IntroSection />;
            case 'objectives': return <ObjectivesSection />;
            case 'section1': return <Section1 />;
            case 'section1-quiz': return <Section1Quiz />;
            case 'section2': return <Section2 />;
            case 'section2-quiz': return <Section2Quiz />;
            case 'section3': return <Section3 />;
            case 'section3-quiz': return <Section3Quiz />;
            case 'section4': return <Section4 />;
            case 'section4-quiz': return <Section4Quiz />;
            case 'workshop': return <Workshop />;
            case 'casestudy': return <CaseStudy />;
            case 'auditexercise': return <AuditExercise />;
            case 'final': return <FinalAssessment />;
            default: return <IntroSection />;
        }
    };

    const getSectionLabel = (sec) => {
        const labels = {
            'intro': 'Introduction',
            'objectives': 'Objectives',
            'section1': '1. Threat Modeling',
            'section1-quiz': '1. Quiz',
            'section2': '2. Static Analysis',
            'section2-quiz': '2. Quiz',
            'section3': '3. Fuzzing & Invariants',
            'section3-quiz': '3. Quiz',
            'section4': '4. Audit Reporting',
            'section4-quiz': '4. Quiz',
            'workshop': 'Workshop',
            'casestudy': 'Case Study',
            'auditexercise': 'Audit Exercise',
            'final': 'Final Assessment',
        };
        return labels[sec] || sec;
    };

    return (
        <div className="module-container">
            <style>{`
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
            `}</style>

            <div className="header">
                <h1>Module 10: Threat Modeling & Audit Methods</h1>
                <div className="controls">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${calculateProgress()}%`}} />
                    </div>
                    <span style={{color: 'white', fontSize: '12px', fontWeight: 'bold'}}>
                        {calculateProgress()}% Complete
                    </span>
                    <button 
                        className="instructor-toggle"
                        onClick={() => setInstructorMode(!instructorMode)}
                        aria-label="Toggle instructor mode"
                    >
                        {instructorMode ? '✓ Instructor Mode' : 'Instructor Mode'}
                    </button>
                </div>
            </div>

            <div className="main-layout">
                <div className="nav-panel">
                    <div className="nav-section">
                        <div className="nav-section-title">Fundamentals</div>
                        <div className="nav-button-list">
                            {['intro', 'objectives'].map(sec => (
                                <button
                                    key={sec}
                                    className={`nav-option ${currentSection === sec ? 'active' : ''} ${completedSections.has(sec) ? 'completed' : ''}`}
                                    onClick={() => setCurrentSection(sec)}
                                    aria-label={`Navigate to ${getSectionLabel(sec)}`}
                                >
                                    {completedSections.has(sec) ? '✓ ' : ''}{getSectionLabel(sec)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">Core Content</div>
                        <div className="nav-button-list">
                            {['section1', 'section1-quiz', 'section2', 'section2-quiz', 'section3', 'section3-quiz', 'section4', 'section4-quiz'].map(sec => (
                                <button
                                    key={sec}
                                    className={`nav-option ${currentSection === sec ? 'active' : ''} ${completedSections.has(sec) ? 'completed' : ''}`}
                                    onClick={() => setCurrentSection(sec)}
                                    aria-label={`Navigate to ${getSectionLabel(sec)}`}
                                >
                                    {completedSections.has(sec) ? '✓ ' : ''}{getSectionLabel(sec)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">Application</div>
                        <div className="nav-button-list">
                            {['workshop', 'casestudy', 'auditexercise', 'final'].map(sec => (
                                <button
                                    key={sec}
                                    className={`nav-option ${currentSection === sec ? 'active' : ''} ${completedSections.has(sec) ? 'completed' : ''}`}
                                    onClick={() => setCurrentSection(sec)}
                                    aria-label={`Navigate to ${getSectionLabel(sec)}`}
                                >
                                    {completedSections.has(sec) ? '✓ ' : ''}{getSectionLabel(sec)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="content-area" role="main">
                    {renderSection()}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ThreatModelingModule;