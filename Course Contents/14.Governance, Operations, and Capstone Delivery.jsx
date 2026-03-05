import React, { useState, useCallback, useMemo } from 'react';

//  M4 Design System 
const _S=`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');::-webkit-scrollbar{width:4px;background:#080c10}::-webkit-scrollbar-thumb{background:#1a3a4a;border-radius:2px}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`;
const _D=`.m4{background:#060a0e!important;color:#7eb8cc;font-family:'Merriweather',serif}.m4 h1,.m4 h2,.m4 h3,.m4 h4,.m4 h5,.m4 h6{color:#d6eef5!important;font-family:'Orbitron',sans-serif!important;background:transparent!important;border-color:#1c3344!important}.m4 p,.m4 li,.m4 td,.m4 span,.m4 label{color:#7eb8cc!important;background:transparent!important}.m4 div,.m4 section,.m4 ul,.m4 ol{background:transparent!important;background-color:transparent!important;border-color:#1c3344!important}.m4 pre,.m4 code{background:#030608!important;color:#00e5ff!important;border-color:#1c3344!important;font-family:'IBM Plex Mono',monospace!important}.m4 button{background:#00e5ff18!important;background-color:#00e5ff18!important;border:1px solid rgba(0,229,255,.31)!important;color:#00e5ff!important;font-family:'IBM Plex Mono',monospace!important;border-radius:4px!important}.m4 button:disabled{background:#121f2a!important;color:#2e5a6e!important}.m4 input,.m4 textarea,.m4 select{background:#0e1820!important;color:#7eb8cc!important;border-color:#1c3344!important}.m4 th{background:#0e1820!important;color:#d6eef5!important}.m4 tr{background:transparent!important}.m4 tr:nth-child(even){background:#0d1825!important}.m4 table *{border-color:#1c3344!important}.m4 strong,.m4 b{color:#d6eef5!important;background:transparent!important}.m4 a{color:#00e5ff!important;background:transparent!important}.m4 hr{border-color:#1c3344!important}.m4 .callout,.m4 .feedback,.m4 .quiz-section,.m4 .quiz-question{background:#0a1018!important;border-color:#1c3344!important}.m4 .callout.pitfall{border-color:#ff5252!important}.m4 .codeblock{background:#030608!important;color:#00e5ff!important;font-family:'IBM Plex Mono',monospace!important}`;
const _C={bg0:"#060a0e",bg1:"#0a1018",bg2:"#0e1820",border:"#1c3344",cyan:"#00e5ff",cyanFaint:"#00e5ff14",text:"#7eb8cc",textMuted:"#2e5a6e",textBright:"#d6eef5",mono:"'IBM Plex Mono',monospace",disp:"'Orbitron',sans-serif",body:"'Merriweather',serif"};
// 

const GovernanceOperationsCapstone = () => {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const [currentSection, setCurrentSection] = useState('intro');
    const [completedSections, setCompletedSections] = useState(new Set());
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState(false);
    const [assessmentAnswers, setAssessmentAnswers] = useState({});
    const [capstoneStep, setCapstoneStep] = useState('governance');
    const [capstoneData, setCapstoneData] = useState({
        governance: {},
        upgrade: {},
        incident: {},
        demo: {},
    });
    const [tabletopPhase, setTabletopPhase] = useState('setup');
    const [tabletopChoices, setTabletopChoices] = useState({});
    const [instructorMode, setInstructorMode] = useState(false);

    const markSectionComplete = useCallback((sectionId) => {
        setCompletedSections(prev => new Set([...prev, sectionId]));
    }, []);

    const handleQuizAnswer = useCallback((questionId, answer) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
    }, []);

    const handleAssessmentAnswer = useCallback((questionId, answer) => {
        setAssessmentAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
    }, []);

    const handleCapstoneInput = useCallback((step, field, value) => {
        setCapstoneData(prev => ({
            ...prev,
            [step]: {
                ...prev[step],
                [field]: value,
            },
        }));
    }, []);

    const calculateProgress = useMemo(() => {
        const totalSections = 8;
        return Math.round((completedSections.size / totalSections) * 100);
    }, [completedSections]);

    const calculateQuizScore = useCallback(() => {
        const quizzes = {
            'q1.1': { correct: 'c', weight: 1 },
            'q1.2': { correct: ['a', 'b', 'd'], weight: 1 },
            'q2.1': { correct: 'b', weight: 1 },
            'q2.2': { correct: ['a', 'c', 'd'], weight: 1 },
            'q3.1': { correct: 'c', weight: 1 },
            'q3.2': { correct: 'a', weight: 1 },
        };

        let score = 0;
        let total = 0;

        Object.entries(quizzes).forEach(([qId, config]) => {
            total += config.weight;
            const userAnswer = quizAnswers[qId];
            if (!userAnswer) return;

            if (Array.isArray(config.correct)) {
                if (Array.isArray(userAnswer) &&
                        userAnswer.sort().join(',') === config.correct.sort().join(',')) {
                    score += config.weight;
                }
            } else {
                if (userAnswer === config.correct) {
                    score += config.weight;
                }
            }
        });

        return { score, total };
    }, [quizAnswers]);

    // ============================================================================
    // QUIZ DATA AND HELPERS
    // ============================================================================
    const quizData = {
        'q1.1': {
            section: '1',
            question: 'In a 2-of-3 multisig governance model, what is the primary security advantage?',
            type: 'single',
            options: [
                { id: 'a', text: 'It requires all three signers to approve every action' },
                { id: 'b', text: 'It is cheaper to deploy than a 1-of-1 model' },
                { id: 'c', text: 'A single compromised signer cannot unilaterally execute privileged actions' },
                { id: 'd', text: 'It eliminates the need for timelocks' },
            ],
            correct: 'c',
            explanation: 'A 2-of-3 threshold means at least 2 of the 3 signers must agree, so a single compromised key cannot act alone. This is the core security property. Timelocks remain necessary as a separate control.',
        },
        'q1.2': {
            section: '1',
            question: 'Which of the following are valid failure modes in multisig governance? (Select all that apply)',
            type: 'multi',
            options: [
                { id: 'a', text: 'Collusion: two signers agree to execute a harmful action without consensus' },
                { id: 'b', text: 'Key loss: one signer becomes permanently unavailable, blocking all upgrades' },
                { id: 'c', text: 'Governance is too slow and flexible' },
                { id: 'd', text: 'Inadequate signer diversity (same exchange, region, organization)' },
            ],
            correct: ['a', 'b', 'd'],
            explanation: 'Collusion, key loss, and signer homogeneity are realistic threats. "Too slow and flexible" is a contradiction (slow means safe, flexible means risky).',
        },
        'q2.1': {
            section: '2',
            question: 'What is the primary purpose of a timelock in upgrade workflows?',
            type: 'single',
            options: [
                { id: 'a', text: 'To reduce gas costs' },
                { id: 'b', text: 'To allow users and validators time to review and potentially exit before a change takes effect' },
                { id: 'c', text: 'To enable multisig voting' },
                { id: 'd', text: 'To replace the need for unit tests' },
            ],
            correct: 'b',
            explanation: 'A timelock (delay) between governance approval and execution enables stakeholders to review, test, and exit if needed. It is a critical operational safety control.',
        },
        'q2.2': {
            section: '2',
            question: 'Which steps should be in every upgrade playbook? (Select all that apply)',
            type: 'multi',
            options: [
                { id: 'a', text: 'Pre-deploy security review and testing' },
                { id: 'b', text: 'Staged rollout / canary (e.g., 10% of liquidity)' },
                { id: 'c', text: 'Pause/rollback mechanism if issues arise' },
                { id: 'd', text: 'Executive summary of changes in plain language for the community' },
            ],
            correct: ['a', 'b', 'c'],
            explanation: 'Pre-deploy review, staged rollout, and rollback are standard operational controls. Community comms are helpful but not strictly part of the "playbook" structure.',
        },
        'q3.1': {
            section: '3',
            question: 'In incident response, what does "triage" mean?',
            type: 'single',
            options: [
                { id: 'a', text: 'Restarting all systems' },
                { id: 'b', text: 'Publishing a blog post' },
                { id: 'c', text: 'Assessing severity, scope, and whether immediate containment is needed' },
                { id: 'd', text: 'Writing a postmortem' },
            ],
            correct: 'c',
            explanation: 'Triage is the critical assessment phase: what happened, how bad is it, and do we need to pause/freeze immediately?',
        },
        'q3.2': {
            section: '3',
            question: 'Which disclosure practice best balances security with community trust?',
            type: 'single',
            options: [
                { id: 'a', text: 'Responsible disclosure: private bug report → vendor fix → coordinated public announcement' },
                { id: 'b', text: 'Immediate public disclosure of all vulnerabilities' },
                { id: 'c', text: 'Never disclose vulnerabilities' },
                { id: 'd', text: 'Disclose only if a competitor finds it' },
            ],
            correct: 'a',
            explanation: 'Responsible disclosure gives the team time to fix before attackers exploit, while maintaining transparency.',
        },
    };

    // ============================================================================
    // COMPONENT SECTIONS
    // ============================================================================

    const IntroSection = () => (
        <section className="section-container">
            <h1>14. Governance, Operations, and Capstone Delivery</h1>

            <div className="abstract-box">
                <h3>Abstract</h3>
                <p>
                    This chapter bridges protocol design and continuous operations. We examine multisig and on-chain
                    governance models, their failure modes, and operational playbooks for safe upgrades and incident
                    response. Critical focus: explicit risk boundaries, least privilege, and reproducible controls.
                    Finally, we define capstone deliverables—a portfolio-quality protocol with governance design,
                    threat model, test evidence, and operational runbooks—that another engineer could safely take over.
                </p>
            </div>

            <div className="learning-objectives">
                <h3>Learning Objectives</h3>
                <ul>
                    <li>Design and evaluate multisig and token-weighted governance models with clear tradeoff analysis.</li>
                    <li>Identify 10+ governance failure modes (compromise, collusion, key loss, capture, etc.) and prevention.</li>
                    <li>Implement a safe upgrade lifecycle: pre-deploy review, timelock, staged rollout, rollback, postmortem.</li>
                    <li>Operate incident response: detect, triage, contain, eradicate, recover, postmortem.</li>
                    <li>Document a production-grade protocol: threat model, runbooks, governance/upgrade guides, known risks.</li>
                    <li>Deliver a capstone: governance+upgrade playbook, deployment proof, peer review, final audit.</li>
                </ul>
            </div>

            <div className="prerequisites">
                <h3>Prerequisites</h3>
                <p>Modules 1–5 (smart contract basics, testing, security review); familiarity with DAO governance concepts.</p>
            </div>

            <div className="key-terms">
                <h3>Key Terms</h3>
                <ul>
                    <li><strong>Multisig:</strong> M-of-N threshold signature scheme; requires M of N signers to authorize action.</li>
                    <li><strong>Timelock:</strong> Enforced delay between approval and execution, enabling review/exit window.</li>
                    <li><strong>Governance Capture:</strong> Majority stakeholder (whale) or colluding minority controls decisions against community.</li>
                    <li><strong>Least Privilege:</strong> Admin keys have minimal scope; emergency roles separate from routine upgrades.</li>
                    <li><strong>Canary Deployment:</strong> Limited rollout (e.g., 10% TVL) to detect issues before full deployment.</li>
                    <li><strong>Incident Response Lifecycle:</strong> Detect → Triage → Contain → Eradicate → Recover → Postmortem.</li>
                    <li><strong>Responsible Disclosure:</strong> Private bug report → vendor fix → coordinated announcement.</li>
                </ul>
            </div>

            <button
                className="primary-btn"
                onClick={() => {
                    setCurrentSection('section1');
                    markSectionComplete('intro');
                }}
            >
                Begin →
            </button>
        </section>
    );

    const Section1 = () => (
        <section className="section-container">
            <h2>§1. Governance Models and Control Planes</h2>

            <p>
                Governance is how a system makes decisions: who can change code, parameters, or access control lists,
                under what conditions, and what safeguards apply. Poor governance is the #1 reason protocols lose funds.
            </p>

            <h3>1.1 The Minimal Trust Boundary: 2-of-3 Multisig</h3>

            <p>
                A 2-of-3 multisig is the simplest starting point for protocol governance. Three independent signers hold
                keys; any two can jointly approve a change. This is a <em>trust boundary</em>: one compromised or absent
                signer does not break the system.
            </p>

            <div className="code-block">
{`// Conceptual Solidity multisig interface
interface IMultisig {
    function proposeUpgrade( 
        address implementation, 
        string calldata description
    ) external returns (bytes32 proposalId);

    function signProposal(bytes32 proposalId) external;
    
    function executeProposal(bytes32 proposalId) external
        onlyAfterTimelock(proposalId);
}

// Example governance config:
// signers: [Alice, Bob, Charlie] (3 independent, geographically dispersed)
// threshold: 2 of 3
// timelock delay: 2 days (172,800 seconds on mainnet)`}
            </div>

            <p>
                <strong>Why 2-of-3 works:</strong> It avoids single points of failure (1-of-1 keys compromise everything)
                and dodges governance paralysis (3-of-3 requires all signers, so one absent signer blocks everything).
            </p>

            <div className="key-takeaway">
                <strong>Key Takeaway:</strong> A 2-of-3 multisig is a practical minimum for early protocols.
                It trades flexibility for safety: changes take longer (timelock delay) but are unlikely to be
                unilateral.
            </div>

            <h3>1.2 Scaling Governance: On-Chain Voting and Token Delegation</h3>

            <p>
                As a protocol grows, 2-of-3 becomes a bottleneck: three human signers can collude, go offline, or
                face regulatory pressure. Decentralized alternatives shift decisions to the token-holding community.
            </p>

            <p>
                <strong>Token-Weighted Voting:</strong> Hold 1 token = 1 vote. Typically requires a quorum (e.g., 4% of
                total tokens voting) and a majority (e.g., 50%+ to pass). Voters submit proposals and the vote is recorded
                on-chain.
            </p>

            <p>
                <strong>Delegation:</strong> Token holders can delegate their vote to a representative (e.g., a protocol
                team member, researcher, or other token holder). This lowers participation friction: holders who don't have
                time to vote can still be heard.
            </p>

            <div className="code-block">
{`// Conceptual token voting interface
interface IGovernanceToken {
    function delegate(address delegatee) external;
    
    function propose(
        address[] calldata targets,
        uint[] calldata values,
        string[] calldata signatures,
        bytes[] calldata calldatas,
        string calldata description
    ) external returns (uint proposalId);

    function castVote(uint proposalId, uint8 support) external;
    // support: 0 = Against, 1 = For, 2 = Abstain

    function queue(uint proposalId) external;
    function execute(uint proposalId) external;
}

// Typical on-chain governance parameters:
// Voting delay: 1 block (let transactions settle)
// Voting period: ~1 week (50,400 blocks on mainnet)
// Quorum: 4% of total token supply
// Proposal threshold: 65,000 tokens (expensive enough to prevent spam)`}
            </div>

            <div className="common-pitfall">
                <strong>Common Pitfall:</strong> On-chain governance does not automatically fix governance risk.
                Token concentration (whale holders) can still dominate. Delegation reveals vote direction before
                the vote closes, enabling MEV and bribery. Low participation (often 5–10% of tokens) means a
                small coordinated group can steer decisions.
            </div>

            <h3>1.3 Multisig vs. On-Chain Voting: The Tradeoff Matrix</h3>

            <div className="tradeoff-table">
                <table>
                    <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>2-of-3 Multisig</th>
                            <th>Token-Weighted On-Chain Vote</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Speed</strong></td>
                            <td>Fast (hours)</td>
                            <td>Slow (1–2 weeks min)</td>
                        </tr>
                        <tr>
                            <td><strong>Decentralization</strong></td>
                            <td>Low (3 humans)</td>
                            <td>Higher (many token holders)</td>
                        </tr>
                        <tr>
                            <td><strong>Regulatory risk</strong></td>
                            <td>Higher (identified signers)</td>
                            <td>Lower (distributed)</td>
                        </tr>
                        <tr>
                            <td><strong>Collusion risk</strong></td>
                            <td>2 signers can collude</td>
                            <td>Multitude of bribery vectors (whale, centralized exchange)</td>
                        </tr>
                        <tr>
                            <td><strong>Key loss risk</strong></td>
                            <td>1 signer lost → needs M-of-N revocation ceremony</td>
                            <td>Protocol state (token contract) does not change</td>
                        </tr>
                        <tr>
                            <td><strong>Emergency response</strong></td>
                            <td>2 signers can pause immediately</td>
                            <td>Requires separate emergency multisig or privileged pause key</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>1.4 Failure Modes: 10 Governance Failure Modes and Prevention</h3>

            <p>
                Here are the most common ways governance goes wrong, with concrete prevention measures:
            </p>

            <div className="failure-mode">
                <h4>Failure Mode 1: Signer Compromise</h4>
                <p>
                    <strong>Risk:</strong> One signer's key is stolen or leaked. If using M-of-N with M &lt; N, the
                    attacker may only have 1 key and cannot act alone. But if using 1-of-1, game over.
                </p>
                <p>
                    <strong>Prevention:</strong> Avoid 1-of-1. Use M-of-N with M ≥ 2. Store keys in hardware wallets (Ledger,
                    Trezor) or multisig-as-a-service (e.g., Gnosis Safe). Rotate keys regularly.
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 2: Signer Collusion</h4>
                <p>
                    <strong>Risk:</strong> Two or more signers agree to execute a harmful action (e.g., draining treasury,
                    stealing user funds). In a 2-of-3, two signers colluding = consent of majority.
                </p>
                <p>
                    <strong>Prevention:</strong> Ensure signers are truly independent (different companies, geographies, key
                    custody methods). Use timelock: even if two collude, users have time to exit. Implement social recovery
                    (if community suspects foul play, a large vote can override or veto). Monitor on-chain events for suspicious
                    patterns.
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 3: Signer Key Loss</h4>
                <p>
                    <strong>Risk:</strong> One signer loses their key (hardware wallet dies, password forgotten, key file
                    corrupted). In an M-of-N scheme, if M signers are lost, the protocol cannot execute any upgrades or
                    emergency actions.
                </p>
                <p>
                    <strong>Prevention:</strong> (a) Use redundancy: each signer maintains 2+ copies of the key (one on hardware
                    wallet, one in encrypted backup). (b) Plan a "key rotation" ceremony in advance: if a key is lost, the
                    remaining signers pre-authorize a new signer through the multisig. (c) Avoid high threshold (e.g.,
                    don't use 3-of-3 unless absolutely necessary).
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 4: Inadequate Signer Diversity</h4>
                <p>
                    <strong>Risk:</strong> All three signers use the same exchange (e.g., Celsius) to custody keys, or are
                    all employees of the same company. A single breach or company-wide event compromises all signers at once.
                </p>
                <p>
                    <strong>Prevention:</strong> Enforce geographic, organizational, and technical diversity: (a) different
                    custody methods (one on Ledger, one on Trezor, one on air-gapped server), (b) different regions/countries,
                    (c) different organizations (e.g., signer 1 = core team, signer 2 = major community delegate, signer 3 =
                    independent security firm).
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 5: Timelock Bypass via Privileged Path</h4>
                <p>
                    <strong>Risk:</strong> The protocol claims timelock-protected governance, but an "emergency admin" role or
                    upgrade proxy can bypass the timelock. For example, an upgradeable proxy with an immediate-execution
                    "pause" function. A single compromised admin key = no timelock protection.
                </p>
                <p>
                    <strong>Prevention:</strong> (a) Timelock ALL state-changing actions, including pause/unpause. (b) Separate
                    emergency roles: a "pause" role (used only to pause the protocol, subject to timelock) and a "recovery"
                    role (used to restart after pause, also subject to timelock). (c) Review proxy implementations carefully;
                    use UUPS or transparent proxies, not opaque ones. (d) Disable any emergency backdoors once protocol is live.
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 6: Governance Capture</h4>
                <p>
                    <strong>Risk:</strong> A whale (large token holder) or coordinated bribery network controls governance
                    decisions. Minority token holders cannot defend against a 51% attack-style takeover of voting rights.
                </p>
                <p>
                    <strong>Prevention:</strong> (a) Distribute tokens widely; avoid high Gini coefficient. (b) Enforce quorum
                    (e.g., 4% of tokens must vote); low participation means governance is easily swayed. (c) Use delegation and
                    transparent vote-counting to discourage last-minute bribery. (d) Implement timelock: even if one proposal passes,
                    users have time to exit before execution. (e) Consider quadratic voting or other voting mechanisms that reduce
                    whale dominance.
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 7: Low Participation</h4>
                <p>
                    <strong>Risk:</strong> Only 3–5% of token holders vote. A small, organized group (even without whale status)
                    can coordinate and pass any proposal. Quorum is met but the decision is not representative.
                </p>
                <p>
                    <strong>Prevention:</strong> (a) Raise quorum to 4%+ to force broader participation. (b) Incentivize voting:
                    reward voters with a small additional token or airdrop. (c) Simplify voting UI (make it easy). (d) Publish
                    governance calendar and rationale; give token holders time to consider. (e) Use delegation to let passive
                    holders participate indirectly.
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 8: Bribery and MEV Dynamics</h4>
                <p>
                    <strong>Risk:</strong> An attacker observes a governance proposal during voting, then bribes token holders
                    (or a cartel of validators) to vote in the attacker's favor. Or, a MEV bot front-runs the vote commit to
                    extract value.
                </p>
                <p>
                    <strong>Prevention:</strong> (a) Use vote commit-reveal (two-phase voting): vote is hashed first; reveal is
                    posted later. Harder to bribe if vote direction is not known until reveal. (b) Use voting delay and voting
                    period to reduce time window for bribery. (c) Accept that on-chain governance has inherent MEV risk; mitigate
                    with timelock (even if vote is corrupted, users can exit during timelock window).
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 9: Parameter Foot-Guns</h4>
                <p>
                    <strong>Risk:</strong> Governance can change a critical parameter (e.g., liquidation threshold, maximum
                    leverage, oracle price tolerance) to reckless values. For example, lowering the liquidation threshold from
                    85% to 5% enables underwater liquidations.
                </p>
                <p>
                    <strong>Prevention:</strong> (a) Whitelist safe parameter ranges; disallow changes outside those ranges. (b)
                    Enforce per-parameter timelocks (e.g., interest rate changes require 3-day timelock, liquidation threshold
                    requires 7-day timelock). (c) Unit test each parameter; verify that the extremes are safe. (d) Document
                    assumptions: "if liquidation threshold &lt; 50%, protocol can be exploited."
                </p>
            </div>

            <div className="failure-mode">
                <h4>Failure Mode 10: Upgradeability Hazards</h4>
                <p>
                    <strong>Risk:</strong> An upgradeable proxy is supposed to be governed by a multisig or DAO vote, but a
                    backdoor (e.g., ProxyAdmin key) allows anyone to upgrade immediately. Or, a previous admin left a "self-destruct"
                    function in the proxy that an attacker can trigger.
                </p>
                <p>
                    <strong>Prevention:</strong> (a) Transfer proxy admin keys to the governance contract (multisig or DAO vault)
                    at launch. Do not keep a dev keyhold on proxy admin. (b) Disable any emergency upgrade or self-destruct functions
                    before mainnet deployment. (c) Use transparent proxies with explicit role assignments; avoid ambiguous proxy
                    patterns. (d) Lock proxy implementation: once live, no one should be able to upgrade without governance consent
                    AND timelock.
                </p>
            </div>

            <h3>1.5 Mini Case Study: The Rushed Upgrade Without Timelock</h3>

            <div className="case-study-box">
                <h4>Background</h4>
                <p>
                    A DeFi lending protocol uses a 3-of-5 multisig to govern upgrades. The team is aware of inflation governance risk
                    and decides to migrate to a DAO vote. However, they want to launch the DAO quickly and deploy an upgraded lending
                    contract that improves capital efficiency.
                </p>

                <h4>The Incident</h4>
                <p>
                    The team proposes an upgrade to the lending contract, claiming it increases collateral reuse efficiency from 70%
                    to 90%. The 3-of-5 multisig approves the upgrade within 4 hours. No timelock. No staged rollout testing.
                </p>

                <p>
                    Within 1 hour of deployment, a researcher notices the contract contains a subtle accounting bug: uncollateralized
                    borrows are possible via recursive flash loan calls. The researcher cannot pause the contract because pause is
                    also behind the multisig (and the multisig has gone offline for the weekend). $50M in user deposits are drained
                    within 30 minutes.
                </p>

                <h4>Root Causes</h4>
                <ul>
                    <li>No timelock: governance change took effect immediately without user review/exit window.</li>
                    <li>No staged rollout: the entire protocol was upgraded at once, and the bug's blast radius was maximal.</li>
                    <li>Pause logic is behind multisig: emergency response unavailable when multisig is offline.</li>
                    <li>Insufficient pre-deploy testing: the accounting bug should have been caught in a testnet simulation.</li>
                </ul>

                <h4>Prevention Playbook</h4>
                <ol>
                    <li>
                        <strong>Enforce mandatory timelock:</strong> All governance changes (including contract upgrades) must have
                        a minimum 2-day timelock. Users and validators have time to review.
                    </li>
                    <li>
                        <strong>Staged rollout:</strong> Deploy the new lending contract to a "canary" pool with 10% of TVL first.
                        Monitor for 1 day before rolling out to the full protocol.
                    </li>
                    <li>
                        <strong>Separate emergency pause:</strong> A technical operator (e.g., security firm) has an independent pause
                        key that can pause the protocol immediately (no multisig needed, no timelock) if a critical bug is detected.
                    </li>
                    <li>
                        <strong>Pre-deploy security review:</strong> All upgrades must pass formal code review and symbolic execution
                        (e.g., invariant testing with Certora). The review checklist must include accounting correctness.
                    </li>
                    <li>
                        <strong>Testnet and mainnet fork testing:</strong> Run the upgrade on mainnet fork with realistic load patterns
                        (high-velocity borrows, liquidations, flash loans). Measure gas, collateral ratios, and edge cases for 24 hours
                        before mainnet deployment.
                    </li>
                    <li>
                        <strong>Rollback plan:</strong> Prepare the reverse upgrade (e.g., downgrade to previous contract version) and
                        test it in staging. If issues arise during the 2-day timelock, execute the rollback instead of the upgrade.
                    </li>
                </ol>
            </div>

            <div className="key-takeaway">
                <strong>Key Takeaway:</strong> Timelock is not optional. Every governance change must have a meaningful delay
                (2–7 days depending on risk). Use that time to review, test, and prepare rollback. Separate emergency pause from
                governance upgrade pathway.
            </div>

            <div className="quiz-section">
                <h3>Quick Quiz: §1</h3>

                <div className="quiz-item">
                    <p><strong>Q1:</strong> {quizData['q1.1'].question}</p>
                    <div className="quiz-options">
                        {quizData['q1.1'].options.map(opt => (
                            <label key={opt.id}>
                                <input
                                    type="radio"
                                    name="q1.1"
                                    value={opt.id}
                                    checked={quizAnswers['q1.1'] === opt.id}
                                    onChange={e => handleQuizAnswer('q1.1', e.target.value)}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                    {quizAnswers['q1.1'] && showAnswers && (
                        <div className={quizAnswers['q1.1'] === quizData['q1.1'].correct ? 'correct-answer' : 'incorrect-answer'}>
                            <p>{quizData['q1.1'].explanation}</p>
                        </div>
                    )}
                </div>

                <div className="quiz-item">
                    <p><strong>Q2:</strong> {quizData['q1.2'].question}</p>
                    <div className="quiz-options">
                        {quizData['q1.2'].options.map(opt => (
                            <label key={opt.id}>
                                <input
                                    type="checkbox"
                                    name="q1.2"
                                    value={opt.id}
                                    checked={(quizAnswers['q1.2'] || []).includes(opt.id)}
                                    onChange={e => {
                                        const current = quizAnswers['q1.2'] || [];
                                        const updated = e.target.checked
                                            ? [...current, opt.id]
                                            : current.filter(x => x !== opt.id);
                                        handleQuizAnswer('q1.2', updated);
                                    }}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                    {quizAnswers['q1.2'] && showAnswers && (
                        <div className={
                            Array.isArray(quizAnswers['q1.2']) &&
                            quizAnswers['q1.2'].sort().join(',') === quizData['q1.2'].correct.sort().join(',')
                                ? 'correct-answer'
                                : 'incorrect-answer'
                        }>
                            <p>{quizData['q1.2'].explanation}</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                className="primary-btn"
                onClick={() => {
                    markSectionComplete('section1');
                    setCurrentSection('section2');
                }}
            >
                Next: Operational Security →
            </button>
        </section>
    );

    const Section2 = () => (
        <section className="section-container">
            <h2>§2. Operational Security: Safe Upgrade Lifecycle</h2>

            <p>
                Governance defines who makes decisions. Operations defines how those decisions are executed safely:
                code review, testing, staged deployment, pause mechanisms, monitoring, and incident response.
            </p>

            <h3>2.1 The Upgrade Lifecycle: From Proposal to Mainnet</h3>

            <p>
                A safe upgrade is not a single action; it is a sequence of reversible, reviewable steps.
            </p>

            <div className="upgrade-lifecycle">
                <div className="lifecycle-step">
                    <h4>Step 1: Proposal and Code Review (1–3 days)</h4>
                    <p>
                        A team member proposes an upgrade (new contract, parameter change, emergency fix). The proposal
                        includes a clear description, code diff, and risk assessment. At least two independent reviewers
                        (ideally external security firm or experienced team members) must sign off.
                    </p>
                    <p className="code-snippet">
{`// Proposal checklist:
☐ Clear description of change (why, what, risk)
☐ Link to code diff (GitHub commit or Pull Request)
☐ Unit test coverage (>95% new code)
☐ Invariant property verification (Certora, Dafny, or similar)
☐ Gas cost estimation and optimization
☐ Security review by 2+ people
☐ Backwards compatibility analysis
☐ Rollback plan documented`}
                    </p>
                </div>

                <div className="lifecycle-step">
                    <h4>Step 2: Testnet and Mainnet Fork Testing (1–2 days)</h4>
                    <p>
                        Deploy to testnet (e.g., Sepolia, Goerli) and run realistic test scenarios:
                        high-velocity trades, liquidations, governance votes, flash loans, edge cases.
                        Then, run integration tests on a mainnet fork with realistic state snapshot.
                    </p>
                    <p className="code-snippet">
{`// Testnet/fork test checklist:
☐ Deploy to testnet; verify ABI, initialization, roles
☐ Run scenario tests: normal operation, edge cases, extreme parameters
☐ Measure gas costs (ensure no unexpectedly high costs)
☐ Run mainnet fork with snapshot from block N
☐ Simulate 1000s of transactions; measure invariants
☐ Monitor logs for unexpected events or warnings
☐ Check storage layout (if proxy upgrade); ensure no slot collisions`}
                    </p>
                </div>

                <div className="lifecycle-step">
                    <h4>Step 3: Governance Proposal (1–2 weeks)</h4>
                    <p>
                        Submit the upgrade to governance (multisig or on-chain vote). For multisig, prepare a proposal
                        for the signers; for DAO vote, create a governance proposal describing the change in plain language
                        and include a link to audit results.
                    </p>
                    <p className="code-snippet">
{`// Governance proposal template (on-chain vote or multisig):
Title: Upgrade LendingPool to v2 (collateral reuse)

Description:
This proposal upgrades the LendingPool contract to v2, improving
capital efficiency from 70% to 90% via recursive collateral reuse.

Key Changes:
- Introduce CollateralResolver interface for flexible collateral sources
- Implement recursive reuse with circuit breaker (max 3 levels)
- New test coverage: 97% of LendingPool v2 code

Artifacts:
- Code: https://github.com/protocol/contracts/pull/456
- Audit: https://audit.firm.security/protocol-v2-2024.pdf
- Mainnet fork test: https://github.com/protocol/fork-test/...
- Rollback plan: Downgrade to v1 via YUL assembly selfdestruct

Timelock Delay: 2 days
Staged Rollout: Phase 1 (10% TVL, 1 day), Phase 2 (100% TVL)`}
                    </p>
                </div>

                <div className="lifecycle-step">
                    <h4>Step 4: Governance Voting and Timelock (1–2 weeks)</h4>
                    <p>
                        For on-chain vote: voting period (e.g., 1 week), then timelock delay (e.g., 2 days) before execution.
                        For multisig: signers review over 1–2 days, then execute with hardcoded timelock delay.
                        Users and validators have this window to review and exit if needed.
                    </p>
                </div>

                <div className="lifecycle-step">
                    <h4>Step 5: Staged Rollout (1–7 days, depending on protocol)</h4>
                    <p>
                        Do NOT upgrade the entire protocol at once. Deploy to a limited "canary" first:
                    </p>
                    <ul>
                        <li>
                            <strong>Phase 1 Canary:</strong> Deploy to a limited pool (e.g., 10% of total TVL, or a single market).
                            Monitor for 24 hours for unexpected behavior, gas costs, invariant violations.
                        </li>
                        <li>
                            <strong>Phase 2 Partial:</strong> If Phase 1 is healthy, expand to 50% of TVL. Monitor for another 24 hours.
                        </li>
                        <li>
                            <strong>Phase 3 Full:</strong> After 48 hours of stability, upgrade remaining pools.
                        </li>
                    </ul>

                    <p className="code-snippet">
{`// Staging rollout implementation pattern (Solidity)
contract LendingPoolProxy is ILendingPool {
    enum Phase { CANARY, PARTIAL, FULL }
    Phase public deploymentPhase = Phase.CANARY;
    
    mapping(address => bool) public canaryMarkets; // whitelisted canary pools
    mapping(address => bool) public partialMarkets; // partial rollout pools
    
    function borrow(address market, uint amount) external {
        // Enforce phase-based routing
        if (deploymentPhase == Phase.CANARY) {
            require(canaryMarkets[market], "Canary phase: use whitelisted markets only");
        }
        // ... delegation to new implementation
    }
    
    function advancePhase() external onlyGovernance {
        // Advancement requires human review + manual call
        require(deploymentPhase < Phase.FULL);
        deploymentPhase = Phase(uint(deploymentPhase) + 1);
    }
}`}
                    </p>
                </div>

                <div className="lifecycle-step">
                    <h4>Step 6: Monitoring and On-Call Response (ongoing)</h4>
                    <p>
                        Once upgraded, monitor key metrics continuously: transaction success rate, gas costs, collateral ratios,
                        liquidation events, oracle prices, user withdrawal rates, and smart contract logs for warnings.
                    </p>
                    <p className="code-snippet">
{`// Core monitoring metrics
Uptime:
- Successful transaction rate (target: >99%)
- RPC latency (p95 < 500ms)

Protocol Health:
- Total value locked (TVL), by market
- Collateral ratio distribution
- Liquidation rate (liquidations per day)
- Bad debt / write-offs (should be ~0)

Contract Events:
- Pause events (should only occur in emergency)
- Upgrade events (all governance changes logged)
- Oracle price updates (frequency, volatility)
- Governance proposal submissions and votes`}
                    </p>
                </div>

                <div className="lifecycle-step">
                    <h4>Step 7: Rollback/Emergency Pause (if issues arise)</h4>
                    <p>
                        If an issue is detected during Phase 1 or 2, immediately pause the affected pools (without timelock;
                        pause is a privileged function held by security team). Prepare a rollback proposal (downgrade to previous
                        contract version) and submit to governance after triage.
                    </p>
                </div>
            </div>

            <h3>2.2 Admin Access: Separation of Duties and Least Privilege</h3>

            <p>
                Admin functions (pause, upgrade, parameter change) should have distinct roles and minimal privileges.
            </p>

            <div className="code-block">
{`// Role-based access control pattern (Solidity)
contract Governance {
    bytes32 public constant UPGRADE_ROLE = keccak256("UPGRADE_ROLE");
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 public constant PARAMETER_ROLE = keccak256("PARAMETER_ROLE");
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");

    function upgradeImplementation(address newImpl)
        external
        onlyRole(UPGRADE_ROLE)
        onlyAfterTimelock(2 days)
    {
        // All upgrades delayed by 2 days; cannot be overridden
    }

    function pauseProtocol(string calldata reason)
        external
        onlyRole(PAUSE_ROLE)
    {
        // Pause is immediate (no timelock); used only in emergency
        // Can only pause, not unpause or upgrade
        require(bytes(reason).length > 0);
        _pause();
        emit ProtocolPaused(msg.sender, reason);
    }

    function setInterestRate(uint newRate)
        external
        onlyRole(PARAMETER_ROLE)
        onlyAfterTimelock(1 day)
    {
        // Parameter changes have shorter timelock (1 day) 
        // because they are less risky than code changes
        require(newRate >= MIN_RATE && newRate <= MAX_RATE);
        _interestRate = newRate;
    }

    function recoverFromPause()
        external
        onlyRole(RECOVERY_ROLE)
        onlyAfterTimelock(3 days)
    {
        // Unpause is slow (3 days) to avoid hasty recovery attempts
        _unpause();
    }
}

// Role assignment (example):
// UPGRADE_ROLE → 2-of-3 multisig or DAO governance vault
// PAUSE_ROLE → trusted security firm (independent of core team)
// PARAMETER_ROLE → 2-of-3 multisig
// RECOVERY_ROLE → same as UPGRADE_ROLE (careful, slow recovery)`}
            </div>

            <div className="key-takeaway">
                <strong>Key Takeaway:</strong> Least privilege means each role has the minimum power needed for its function.
                Pause is separate from upgrade (pause is immediate, upgrade is delayed). Parameter changes have different timelocks
                than code changes. No single key can do everything.
            </div>

            <h3>2.3 Key Custody and Storage</h3>

            <p>
                Admin and governance keys must be stored securely. Common options:
            </p>

            <div className="custody-options">
                <div className="option">
                    <h4>Option A: Hardware Wallet (Ledger, Trezor)</h4>
                    <p>
                        <strong>Pros:</strong> Private key never exposed to internet; user must physically approve each transaction.
                    </p>
                    <p>
                        <strong>Cons:</strong> Single point of failure (if device lost/damaged); slower to use; requires careful seed backup.
                    </p>
                    <p>
                        <strong>Use case:</strong> Multisig signers; especially for slow governance (1 signer per person).
                    </p>
                </div>

                <div className="option">
                    <h4>Option B: Multisig-as-a-Service (Gnosis Safe, Coinbase Custody)</h4>
                    <p>
                        <strong>Pros:</strong> No key management burden; professional infrastructure; audit trails.
                    </p>
                    <p>
                        <strong>Cons:</strong> Trust in third party; potential regulatory/compliance overhead; fees.
                    </p>
                    <p>
                        <strong>Use case:</strong> Corporate protocol teams; protocols with many transactions.
                    </p>
                </div>

                <div className="option">
                    <h4>Option C: Air-Gapped Key Storage (Encrypted Backup, YubiKey)</h4>
                    <p>
                        <strong>Pros:</strong> Full control; lower cost than MaaS; private key never on internet-connected device.
                    </p>
                    <p>
                        <strong>Cons:</strong> Requires discipline (never expose private key); backup/recovery ceremony must be practiced.
                    </p>
                    <p>
                        <strong>Use case:</strong> Protocols that want maximum autonomy and paranoia. Requires dedicated security team.
                    </p>
                </div>
            </div>

            <div className="common-pitfall">
                <strong>Common Pitfall:</strong> Storing keys in .env files or GitHub secrets. These are not secure.
                If the repository is ever compromised, the keys are compromised. Use only for testnet and dev keys, never mainnet.
            </div>

            <h3>2.4 Monitoring, Alerting, and Incident Detection</h3>

            <p>
                Proactive monitoring catches issues early.
            </p>

            <div className="code-block">
{`// Alerting thresholds (examples for a lending protocol)
Critical Alerts (page on-call engineer):
- Pause event triggered
- Total bad debt > 1% of TVL
- Oracle price deviation > 10% in 5 minutes
- Contract balance < expected (potential drain)
- Governance proposal with unusual code (diff>1000 lines)

High Alerts (create incident and review next day):
- Liquidation rate > 5% per hour
- TVL drop > 20% in 1 hour
- RPC latency > 2 seconds (95th percentile)
- Unusual gas price spike (>200 Gwei for >10 blocks)

Low Alerts (log and review in weekly operational review):
- New governance proposal submitted
- Parameter change detected
- Upgrade event
- Interest rate adjustment

Automated Responses:
- If TVL drop > 50% in 10 minutes AND liquidation rate > 10%/hr
    → Trigger PAUSE_ROLE (security team) to pause protocol
    → Alert core team in private Slack channel
    → Inhibit automatic unpause (manual recovery required)`}
            </div>

            <h3>2.5 Incident Response Lifecycle</h3>

            <p>
                When something goes wrong, a structured process containing damage and restoring service is critical.
            </p>

            <div className="incident-lifecycle">
                <div className="phase">
                    <h4>Phase 1: Detect (hours)</h4>
                    <p>
                        Monitoring alert fires, or user reports suspicious activity.
                        <strong>Action:</strong> Route alert to on-call engineer; create incident channel; start talking.
                    </p>
                </div>

                <div className="phase">
                    <h4>Phase 2: Triage (15–60 min)</h4>
                    <p>
                        Assess severity: Is protocol losing money RIGHT NOW? Is it still losing? What is the scope?
                    </p>
                    <p className="code-block">
{`// Severity classification
CRITICAL: Live loss of user funds, protocol insolvency risk
    → Immediate pause (no voting); all-hands response; 24/7 comms

HIGH: Potential exploit, but not yet active loss; or, significant bug
    → Pause within 1 hour; technical response team mobilized; daily updates

MEDIUM: Parameter misconfiguration, minor bug, no loss yet
    → Staged response; fix in next upgrade; post-mortem in 1 week

LOW: Documentation error, non-critical code path, no user impact
    → Track in backlog; review in weekly ops meeting`}
                    </p>
                </div>

                <div className="phase">
                    <h4>Phase 3: Contain (1–24 hours)</h4>
                    <p>
                        Stop the bleeding. If protocol is being drained, pause immediately (use PAUSE_ROLE; no timelock).
                        If data loss is ongoing, stop accepting new transactions in affected markets.
                    </p>
                </div>

                <div className="phase">
                    <h4>Phase 4: Eradicate (24 hours – 1 week)</h4>
                    <p>
                        Identify root cause and prepare fix. Write a new contract version, test it thoroughly, and prepare
                        a rollback/upgrade proposal. Do NOT rush this step; thorough analysis prevents re-introducing the bug.
                    </p>
                </div>

                <div className="phase">
                    <h4>Phase 5: Recover (1–7 days)</h4>
                    <p>
                        Deploy fix to testnet, validate in mainnet fork, then submit to governance (if timelock is required).
                        Once timelock expires and governance approves, execute the fix. Monitor closely for side effects.
                    </p>
                </div>

                <div className="phase">
                    <h4>Phase 6: Postmortem (1–2 weeks)</h4>
                    <p>
                        Document what happened, why it was not caught, and what systemic changes are needed.
                        Share postmortem publicly (with responsible disclosure delay if needed).
                    </p>
                </div>
            </div>

            <h3>2.6 Responsible Disclosure and Bug Bounty Process</h3>

            <p>
                If a user or security researcher finds a bug, you want them to report it privately (not publicly).
            </p>

            <div className="code-block">
{`// Responsible disclosure workflow

1. Researcher finds a bug and reports to security@protocol.io
     (or via bug bounty platform: Immunefi, HackerOne, etc.)
     
2. Team responds within 24 hours: acknowledge receipt, assign severity, 
     provide timeline for fix.
     
3. Researcher waits; team investigates, develops fix, and tests in staging.
     
4. Team coordinates public disclosure:
     - If HIGH/CRITICAL: coordinated announcement 48–96 hours after fix deployment
     - If MEDIUM: public announcement after public fix is tested
     - If LOW: can be disclosed immediately if non-critical
     
5. Team rewards researcher per bug bounty policy
     (e.g., 10K USDC for CRITICAL, 1K USDC for MEDIUM, etc.)

6. Team publishes postmortem + lessons learned

Example Disclosure Timeline:
Day 0: Researcher reports vulnerability
Day 1: Team confirms and begins fix
Day 5: Fix deployed to testnet
Day 7: Fix deployed to mainnet (after timelock + governance vote)
Day 10: Public disclosure announcement + postmortem
Day 11: Researcher paid bounty`}
            </div>

            <div className="key-takeaway">
                <strong>Key Takeaway:</strong> Responsible disclosure incentivizes finding and fixing bugs before attackers exploit them.
                Advertise your bug bounty clearly and pay promptly. Responsible disclosure is not weakness; it is strength.
            </div>

            <div className="quiz-section">
                <h3>Quick Quiz: §2</h3>

                <div className="quiz-item">
                    <p><strong>Q1:</strong> {quizData['q2.1'].question}</p>
                    <div className="quiz-options">
                        {quizData['q2.1'].options.map(opt => (
                            <label key={opt.id}>
                                <input
                                    type="radio"
                                    name="q2.1"
                                    value={opt.id}
                                    checked={quizAnswers['q2.1'] === opt.id}
                                    onChange={e => handleQuizAnswer('q2.1', e.target.value)}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                    {quizAnswers['q2.1'] && showAnswers && (
                        <div className={quizAnswers['q2.1'] === quizData['q2.1'].correct ? 'correct-answer' : 'incorrect-answer'}>
                            <p>{quizData['q2.1'].explanation}</p>
                        </div>
                    )}
                </div>

                <div className="quiz-item">
                    <p><strong>Q2:</strong> {quizData['q2.2'].question}</p>
                    <div className="quiz-options">
                        {quizData['q2.2'].options.map(opt => (
                            <label key={opt.id}>
                                <input
                                    type="checkbox"
                                    name="q2.2"
                                    value={opt.id}
                                    checked={(quizAnswers['q2.2'] || []).includes(opt.id)}
                                    onChange={e => {
                                        const current = quizAnswers['q2.2'] || [];
                                        const updated = e.target.checked
                                            ? [...current, opt.id]
                                            : current.filter(x => x !== opt.id);
                                        handleQuizAnswer('q2.2', updated);
                                    }}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                    {quizAnswers['q2.2'] && showAnswers && (
                        <div className={
                            Array.isArray(quizAnswers['q2.2']) &&
                            quizAnswers['q2.2'].sort().join(',') === quizData['q2.2'].correct.sort().join(',')
                                ? 'correct-answer'
                                : 'incorrect-answer'
                        }>
                            <p>{quizData['q2.2'].explanation}</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                className="primary-btn"
                onClick={() => {
                    markSectionComplete('section2');
                    setCurrentSection('section3');
                }}
            >
                Next: Incident Response & Disclosure →
            </button>
        </section>
    );

    const Section3 = () => (
        <section className="section-container">
            <h2>§3. Incident Response Details and Disclosure Norms</h2>

            <p>
                We covered the incident lifecycle outline in §2. Here we go deeper into operational discipline,
                communication, and postmortem culture.
            </p>

            <h3>3.1 Incident Response Team Structure</h3>

            <p>
                Assign clear roles to avoid chaos during an incident:
            </p>

            <div className="team-roles">
                <div className="role">
                    <h4>Incident Commander (IC)</h4>
                    <p>
                        Makes final decisions about containment and recovery.
                        Drives triage, coordinates comms, and declares incident resolved. Usually the most senior engineer
                        or ops manager on call.
                    </p>
                </div>

                <div className="role">
                    <h4>Technical Lead (TL)</h4>
                    <p>
                        Investigates root cause and develops fix. Owns testnet and staging validation. Reports findings to IC.
                    </p>
                </div>

                <div className="role">
                    <h4>Communications Lead (Comms)</h4>
                    <p>
                        Drafts external messages (Twitter, Discord, blog post). Coordinates with legal/compliance if needed.
                        Does NOT speak until IC and TL give final facts; prevents misinformation.
                    </p>
                </div>

                <div className="role">
                    <h4>Operations Lead (Ops)</h4>
                    <p>
                        Executes operational actions: pause contracts, sign governance proposals, deploy fixes to testnet.
                        Works closely with TL.
                    </p>
                </div>
            </div>

            <h3>3.2 Incident Severity Scale and Response Time SLAs</h3>

            <div className="severity-sla">
                <table>
                    <thead>
                        <tr>
                            <th>Severity</th>
                            <th>Definition</th>
                            <th>Triage SLA</th>
                            <th>Response</th>
                            <th>Communication Cadence</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>P0 / CRITICAL</strong></td>
                            <td>Active loss of user funds; protocol insolvency risk</td>
                            <td>15 min</td>
                            <td>Immediate pause (no voting); escalate to all leads</td>
                            <td>Every 30 min (public update); stakeholders on group call</td>
                        </tr>
                        <tr>
                            <td><strong>P1 / HIGH</strong></td>
                            <td>Exploit or critical bug detected; loss is potential, not active</td>
                            <td>1 hour</td>
                            <td>Pause within 1 hour; begin root cause analysis</td>
                            <td>Every 4 hours (public update); daily all-hands</td>
                        </tr>
                        <tr>
                            <td><strong>P2 / MEDIUM</strong></td>
                            <td>Significant bug or misconfiguration; no immediate loss</td>
                            <td>4 hours</td>
                            <td>Staged fix; prepare for next upgrade window</td>
                            <td>Daily update; postmortem within 1 week</td>
                        </tr>
                        <tr>
                            <td><strong>P3 / LOW</strong></td>
                            <td>Minor issue, edge case, cosmetic problem</td>
                            <td>1 day</td>
                            <td>Track in backlog; fix in routine maintenance</td>
                            <td>Weekly update; postmortem optional</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>3.3 Communication During Incident</h3>

            <p>
                Silence breeds rumors. Communicate frequently and honestly, even if there is no news.
            </p>

            <div className="code-block">
{`// Communication template (for each status update)

🚨 Incident Update: [Title] | Severity: [P0/P1/P2/P3] | Status: [INVESTIGATING / CONTAINED / RECOVERING]

Last Update: [timestamp UTC]
Current Time: [current timestamp UTC]

Status Summary:
- [1–2 sentence summary of current state]
- Active loss? [Yes/No and amount if known]

Investigation:
- Root cause: [identified? in progress?]
- Affected users: [~number and impact]

Actions Taken:
- ☑ Protocol paused (if applicable)
- ☑ Testnet rollback verified (if applicable)
- ☑ Root cause identified (if applicable)
- ☐ Fix deployed to mainnet (pending)
- ☐ Incident resolved

Next Steps:
- Time estimate for next major update: [T+0:30 / T+4h / etc.]
- Will we pause/unpause/upgrade before next update? [Yes/No]

Contact: security@protocol.io

---

Example P0 Update:

🚨 Incident Update: LendingPool Flash Loan Reentrancy | P0 | CONTAINED

Status: We detected unusual liquidation patterns at 2024-01-15T03:45:15 UTC.
Preliminary analysis: attacker exploited reentrancy in flash loan callback.
We paused all LendingPool markets at 03:47 UTC. No further loss is occurring.

Estimated loss so far: $2.3M (1.2% TVL)

Actions taken:
- ☑ All lending markets paused
- ☑ Triage complete; root cause identified (reentrancy in callback)
- ☑ Testnet rollback verified (upgrade to v1 successful)
- ☐ Fix governance proposal submitted (2-hour ETA)
- ☐ Timelock expires and execution (28-hour ETA)

We are prioritizing a more thorough fix over speed. We will NOT rush
an emergency governance proposal. Instead, we are preparing two options:
1) Rollback to v1 (safe, but no new features)
2) Surgical fix to v2 callback guard (preserves new features, more risk)

We will post detailed postmortem 24 hours after recovery.

Next update: 2024-01-15T07:45:15 UTC (4 hours from now)`}
            </div>

            <div className="key-takeaway">
                <strong>Key Takeaway:</strong> Frequent, honest communication prevents panic and misinformation.
                Do not assume silence is safety; it is worse. Tell your community what you know and don't know.
            </div>

            <h3>3.4 Postmortem Culture and Lessons Learned</h3>

            <p>
                A postmortem is NOT about blame. It is about improving the system so the same incident does not happen again.
            </p>

            <div className="code-block">
{`// Postmortem template (blameless, forward-looking)

Title: Flash Loan Reentrancy in LendingPool v2 (2024-01-15)

Date: 2024-01-15
Severity: P0 (CRITICAL)
Confirmed Loss: $2.3M (1.2% of TVL)
Time to Detect: ~15 min
Time to Contain: ~3 min (pause executed)
Time to Recover: ~28 hours (governance + timelock)

Executive Summary:
Version 2 of the LendingPool contract introduced a flash loan callback
feature to support external integrations. The callback did not guard against
reentrancy, allowing an attacker to recursively call borrow() and drain
collateral without repaying flash loan principal.

Timeline:
2024-01-15 03:45:15 UTC - Unusual liquidation pattern detected by monitor
2024-01-15 03:47:00 UTC - Protocol paused by security team
2024-01-15 04:30:00 UTC - Root cause confirmed (reentrancy in callback)
2024-01-15 05:15:00 UTC - Fix option #1 (rollback) verified on testnet
2024-01-15 07:00:00 UTC - Rollback governance proposal published
2024-01-15 13:00:00 UTC - Timelock expired; rollback executed
2024-01-15 13:30:00 UTC - Protocol unpaused on v1 code
2024-01-16 15:00:00 UTC - Post-mortem published

Root Cause Analysis (5 Whys):
1. Why was the contract exploited?
     → Flash loan callback did not check for reentrancy.
     
2. Why did the callback not guard against reentrancy?
     → Callback was a last-minute feature request, added 2 days before launch.
     
3. Why was a feature added 2 days before launch?
     → Integrator needed it for their product; team felt pressure to include it.
     
4. Why did the team feel pressure?
     → Launch timeline was fixed; no buffer for additional features.
     
5. Why was the timeline fixed?
     → Marketing had committed to a launch date before development was complete.

Systemic Issues (not individual blame):
- No explicit "feature freeze" date; features added right until launch
- Code review process did not focus on reentrancy guards
- No symbol checking or invariant testing for flash loan scenarios
- Testnet and fork testing ran with limited flash loan scenarios

Immediate Actions (within 1 week):
- Detailed code review of v2 implementation; all reentrancy vectors audited
- Add "reentrant call" scenario to invariant test suite
- Implement circuit breaker on callback depth (max 2 levels)
- Formal verification of callback guard using Certora

Mid-term (next 1–2 months):
- Extend prelaunch review process to 3 weeks (not 2 days)
- Require external security audit for any "last-minute feature"
- Implement continuous monitoring of flash loan activity
- Document known risks for all new features

Long-term (next quarter):
- Migrate to transparent proxy and publish upgrade roadmap
- Conduct security pre-audit before feature development (not after)
- Establish clearer launch criteria: "we ship when ready, not on deadline"

Lessons Learned:
1. Timeline pressure is the enemy of security. Fix launch date, not feature list.
2. Reentrancy is universal; every external callback needs explicit guards.
3. Testnet scenarios must include adversarial patterns (reentrant calls, flash loans).
4. Incident detection systems worked perfectly; the team paused immediately.
5. Timelock delay + rollback plan enabled fast recovery without governance paralysis.

What Went Right:
- Monitoring detected the incident within 15 minutes
- Pause was immediate (security team has direct PAUSE_ROLE, no voting)
- Rollback was prepared and tested before the incident (proof of the playbook)
- Communication was frequent and honest
- No secondary issues during recovery

How We Will Prevent This:
- Every new callback = mandatory external audit before testnet
- Every contract change = invariant test for reentrancy scenarios
- Quarterly security review of all callback contracts
- Pre-launch security checkpoint (no PR merges 1 week before mainnet)`}
            </div>

            <h3>3.5 Disclosure Timelines and Community Transparency</h3>

            <p>
                After a P0/P1 incident, when should you publish details?
            </p>

            <p>
                <strong>Industry Practice:</strong> Publish a public postmortem 24–72 hours after incident resolution.
                This gives time for (a) investigation to be thorough, (b) communications team to draft clearly, (c) partners
                to be notified privately first.
            </p>

            <p>
                <strong>What to include:</strong> Root cause, timeline, what happened, why it was not caught, and what changed.
                Do NOT include unreleased security fixes or exploitable details until the fix is deployed and tested.
            </p>

            <div className="code-block">
{`// Disclosure timeline example (P0 incident, loss of funds)

Day 0 (incident discovered):
- Internal postmortem begins (TL, Ops, IC)
- Decision: rollback vs. surgical fix
- Governance proposal drafted (depends on decision)
- Private notification to exchange partners, insurance providers
- Public status page: "LendingPool v2 paused pending investigation"

Day 1:
- Root cause confirmed
- Testnet rollback/fix validated
- Governance proposal published (if requires vote)
- Daily public update (status, no new details yet)

Days 2–3:
- Timelock expires; fix executed
- Protocol unpaused and monitored closely
- Public postmortem drafted (in progress)

Day 4:
- Postmortem published publicly (Twitter, Discord, blog, GitHub)
- Detailed explanation of root cause and changed processes
- Analysis of what monitoring missed and why
- Thanks to community and researchers

Days 5–30:
- Media/analyst questions answered
- Community governance vote on "what happens next" (compensation? formal audit?)
- Executive summary published on website

Responsible Disclosure Checklist:
☐ Affected users notified (email + in-app alert)
☐ Partners notified 2 hours before public announcement
☐ Legal/Insurance alerted
☐ Insurance claim filed (if applicable)
☐ Root cause verified on multiple code paths
☐ Postmortem written and reviewed (no blame language)
☐ Lessons learned = concrete actions (not just "we will do better")
☐ Security review passed (no unreleased exploits disclosed)`}
            </div>

            <div className="quiz-section">
                <h3>Quick Quiz: §3</h3>

                <div className="quiz-item">
                    <p><strong>Q1:</strong> {quizData['q3.1'].question}</p>
                    <div className="quiz-options">
                        {quizData['q3.1'].options.map(opt => (
                            <label key={opt.id}>
                                <input
                                    type="radio"
                                    name="q3.1"
                                    value={opt.id}
                                    checked={quizAnswers['q3.1'] === opt.id}
                                    onChange={e => handleQuizAnswer('q3.1', e.target.value)}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                    {quizAnswers['q3.1'] && showAnswers && (
                        <div className={quizAnswers['q3.1'] === quizData['q3.1'].correct ? 'correct-answer' : 'incorrect-answer'}>
                            <p>{quizData['q3.1'].explanation}</p>
                        </div>
                    )}
                </div>

                <div className="quiz-item">
                    <p><strong>Q2:</strong> {quizData['q3.2'].question}</p>
                    <div className="quiz-options">
                        {quizData['q3.2'].options.map(opt => (
                            <label key={opt.id}>
                                <input
                                    type="radio"
                                    name="q3.2"
                                    value={opt.id}
                                    checked={quizAnswers['q3.2'] === opt.id}
                                    onChange={e => handleQuizAnswer('q3.2', e.target.value)}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                    {quizAnswers['q3.2'] && show答答showAnswers && (
                        <div className={quizAnswers['q3.2'] === quizData['q3.2'].correct ? 'correct-answer' : 'incorrect-answer'}>
                            <p>{quizData['q3.2'].explanation}</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                className="primary-btn"
                onClick={() => {
                    markSectionComplete('section3');
                    setCurrentSection('capstone-intro');
                }}
            >
                Next: Capstone Requirements →
            </button>
        </section>
    );

    const CapstoneIntro = () => (
        <section className="section-container">
            <h2>§4. Capstone Delivery: Portfolio-Quality Protocol</h2>

            <p>
                The capstone is not a final exam; it is a portfolio piece. You are building a protocol that another engineer
                could take over, operate safely, and extend. We define concrete expectations for governance, upgrades,
                incident response, and documentation.
            </p>

            <h3>4.1 Capstone Expectations: Overview</h3>

            <p>
                By the end of this section, you will assemble a "Capstone Delivery Packet" including:
            </p>

            <ul>
                <li><strong>Governance Design:</strong> Multisig configuration, signer policy, timelock strategy, emergency roles.</li>
                <li><strong>Upgrade Playbook:</strong> Step-by-step procedure with gates, roll-forward/rollback paths, staging phases.</li>
                <li><strong>Incident Response Runbook:</strong> Decision tree, communication template, containment actions, escalation paths.</li>
                <li><strong>Demo Script and Narrative:</strong> How you present the protocol: problem, design, assumptions, proof.</li>
                <li><strong>Deployment Proof:</strong> Testnet contract addresses, deployment scripts, verification checklist.</li>
                <li><strong>Portfolio Documentation:</strong> README, threat model, test evidence, architecture overview, known risks.</li>
                <li><strong>Peer Review Results:</strong> External feedback and your responses.</li>
                <li><strong>Final Audit Pass:</strong> Checklist verifying all critical controls are working.</li>
            </ul>

            <button
                className="primary-btn"
                onClick={() => {
                    setCurrentSection('capstone-workshop');
                }}
            >
                Start Capstone Workshop →
            </button>
        </section>
    );

    const CapstoneWorkshop = () => {
        const tabs = ['governance', 'upgrade', 'incident', 'demo'];
        const currentTab = capstoneStep;

        return (
            <section className="section-container">
                <h2>Capstone Workshop: Assemble Your Delivery Packet</h2>

                <div className="capstone-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`capstone-tab ${currentTab === tab ? 'active' : ''}`}
                            onClick={() => setCapstoneStep(tab)}
                            aria-selected={currentTab === tab}
                            aria-label={`Go to ${tab} section`}
                        >
                            {tab === 'governance' && '1. Governance Design'}
                            {tab === 'upgrade' && '2. Upgrade Playbook'}
                            {tab === 'incident' && '3. Incident Runbook'}
                            {tab === 'demo' && '4. Demo Script'}
                        </button>
                    ))}
                </div>

                {currentTab === 'governance' && (
                    <div className="capstone-panel">
                        <h3>1. Governance Design</h3>

                        <p>
                            Document your protocol's governance model. If you are building a real protocol, fill in the details.
                            If this is a demo/learning exercise, create a realistic hypothetical.
                        </p>

                        <h4>Multisig Configuration</h4>
                        <div className="form-group">
                            <label>Multisig Threshold (M-of-N):</label>
                            <input
                                type="text"
                                placeholder="e.g., 2-of-3"
                                value={capstoneData.governance.multisigThreshold || ''}
                                onChange={e => handleCapstoneInput('governance', 'multisigThreshold', e.target.value)}
                            />
                        </div>

                        <h4>Signers (Name, Role, Key Custody)</h4>
                        <div className="form-group">
                            <label>Signer 1:</label>
                            <input
                                type="text"
                                placeholder="e.g., Alice (Core Team) - Hardware Wallet (Ledger)"
                                value={capstoneData.governance.signer1 || ''}
                                onChange={e => handleCapstoneInput('governance', 'signer1', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Signer 2:</label>
                            <input
                                type="text"
                                placeholder="e.g., Bob (Security Firm) - Air-Gapped"
                                value={capstoneData.governance.signer2 || ''}
                                onChange={e => handleCapstoneInput('governance', 'signer2', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Signer 3:</label>
                            <input
                                type="text"
                                placeholder="e.g., Carol (Community Delegate) - Gnosis Safe"
                                value={capstoneData.governance.signer3 || ''}
                                onChange={e => handleCapstoneInput('governance', 'signer3', e.target.value)}
                            />
                        </div>

                        <h4>Timelock Configuration</h4>
                        <div className="form-group">
                            <label>Upgrade Timelock Delay (days):</label>
                            <input
                                type="text"
                                placeholder="e.g., 2 days"
                                value={capstoneData.governance.upgradeLockDays || ''}
                                onChange={e => handleCapstoneInput('governance', 'upgradeLockDays', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Parameter Change Timelock Delay (days):</label>
                            <input
                                type="text"
                                placeholder="e.g., 1 day"
                                value={capstoneData.governance.parameterLockDays || ''}
                                onChange={e => handleCapstoneInput('governance', 'parameterLockDays', e.target.value)}
                            />
                        </div>

                        <h4>Emergency Roles</h4>
                        <div className="form-group">
                            <label>Pause Role (who can pause immediately, for how long before recovery is required):</label>
                            <input
                                type="text"
                                placeholder="e.g., Security Team, max 7 days before governance vote required to unpause"
                                value={capstoneData.governance.pauseRole || ''}
                                onChange={e => handleCapstoneInput('governance', 'pauseRole', e.target.value)}
                            />
                        </div>

                        <h4>Governance Failure Mode Mitigation (checklist)</h4>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={capstoneData.governance.checklist1 || false}
                                    onChange={e => handleCapstoneInput('governance', 'checklist1', e.target.checked)}
                                />
                                Signers are truly independent (different orgs, geographies, custody methods)
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={capstoneData.governance.checklist2 || false}
                                    onChange={e => handleCapstoneInput('governance', 'checklist2', e.target.checked)}
                                />
                                Key loss procedure: if 1 signer goes offline, M-of-N revocation and replacement ceremony is documented
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={capstoneData.governance.checklist3 || false}
                                    onChange={e => handleCapstoneInput('governance', 'checklist3', e.target.checked)}
                                />
                                Governance capture risk acknowledged: token distribution is documented; voting threshold/quorum defined
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={capstoneData.governance.checklist4 || false}
                                    onChange={e => handleCapstoneInput('governance', 'checklist4', e.target.checked)}
                                />
                                Upgrade bypass paths audited: no "emergency admin" backdoor; all upgrades go through timelock
                            </label>
                        </div>

                        <button
                            className="primary-btn"
                            onClick={() => setCapstoneStep('upgrade')}
                        >
                            Next: Upgrade Playbook →
                        </button>
                    </div>
                )}

                {currentTab === 'upgrade' && (
                    <div className="capstone-panel">
                        <h3>2. Upgrade Playbook</h3>

                        <p>
                            Write the step-by-step procedure for deploying a protocol upgrade from proposal to mainnet.
                            Include gates, checks, and rollback paths.
                        </p>

                        <h4>Project Description (what are you upgrading?)</h4>
                        <div className="form-group">
                            <label>Brief upgrade description:</label>
                            <textarea
                                placeholder="e.g., Upgrade LendingPool to v2 with collateral reuse feature. Addresses: improve capital efficiency from 70% to 90%. Risk: reentrancy in callback (mitigated by invariant tests)."
                                value={capstoneData.upgrade.description || ''}
                                onChange={e => handleCapstoneInput('upgrade', 'description', e.target.value)}
                                rows={4}
                            />
                        </div>

                        <h4>Upgrade Steps</h4>

                        <div className="upgrade-step">
                            <h5>Step 1: Code Review and Testing (Pre-Deploy)</h5>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step1_review || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step1_review', e.target.checked)}
                                    />
                                    ☐ Code diff reviewed by 2+ people
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step1_test || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step1_test', e.target.checked)}
                                    />
                                    ☐ Unit tests: >95% coverage of new code
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step1_invariant || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step1_invariant', e.target.checked)}
                                    />
                                    ☐ Invariant tests (Certora/Foundry) pass for 48 hours
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step1_fork || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step1_fork', e.target.checked)}
                                    />
                                    ☐ Mainnet fork test: simulate 1000s of transactions; collect metrics
                                </label>
                            </div>
                        </div>

                        <div className="upgrade-step">
                            <h5>Step 2: Governance Proposal (Public Review Period)</h5>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step2_proposal || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step2_proposal', e.target.checked)}
                                    />
                                    ☐ Governance proposal published (plain-English description + links)
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step2_multisig || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step2_multisig', e.target.checked)}
                                    />
                                    ☐ Multisig signers review and approve (1–2 days elapsed)
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step2_community || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step2_community', e.target.checked)}
                                    />
                                    ☐ Community given time to review and exit if concerned
                                </label>
                            </div>
                        </div>

                        <div className="upgrade-step">
                            <h5>Step 3: Timelock Wait</h5>
                            <div className="form-group">
                                <label>Timelock delay: {capstoneData.governance.upgradeLockDays || '2'} days</label>
                            </div>
                            <p>
                                During this time, monitors are running on production. Any unusual activity triggers pause.
                            </p>
                        </div>

                        <div className="upgrade-step">
                            <h5>Step 4: Phase 1 Canary Deploy (10% TVL, 1 day)</h5>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step4_phase1 || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step4_phase1', e.target.checked)}
                                    />
                                    ☐ Deploy new implementation to canary pool
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step4_monitor || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step4_monitor', e.target.checked)}
                                    />
                                    ☐ Monitor for 24 hours: gas costs, invariants, user errors
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step4_decision || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step4_decision', e.target.checked)}
                                    />
                                    ☐ Human review: proceed to Phase 2 or halt/rollback?
                                </label>
                            </div>
                        </div>

                        <div className="upgrade-step">
                            <h5>Step 5: Phase 2 Partial Deploy (50% TVL, 24 hours)</h5>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step5_phase2 || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step5_phase2', e.target.checked)}
                                    />
                                    ☐ Deploy to additional pools
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step5_monitor2 || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step5_monitor2', e.target.checked)}
                                    />
                                    ☐ Monitor for 24 hours
                                </label>
                            </div>
                        </div>

                        <div className="upgrade-step">
                            <h5>Step 6: Phase 3 Full Deploy</h5>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step6_full || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step6_full', e.target.checked)}
                                    />
                                    ☐ Deploy to remaining pools
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={capstoneData.upgrade.step6_settle || false}
                                        onChange={e => handleCapstoneInput('upgrade', 'step6_settle', e.target.checked)}
                                    />
                                    ☐ All pools running new implementation; 48h+ monitoring
                                </label>
                            </div>
                        </div>

                        <h4>Rollback Plan</h4>
                        <div className="form-group">
                            <label>If issues arise at any phase, what is the rollback procedure?</label>
                            <textarea
                                placeholder="e.g., Execute emergency multisig action to downgrade proxy to previous implementation. Does NOT require governance vote (timelock is bypassed for emergency rollback). Downgrade tested on testnet and fork."
                                value={capstoneData.upgrade.rollbackPlan || ''}
                                onChange={e => handleCapstoneInput('upgrade', 'rollbackPlan', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <button
                            className="primary-btn"
                            onClick={() => setCapstoneStep('incident')}
                        >
                            Next: Incident Runbook →
                        </button>
                    </div>
                )}

                {currentTab === 'incident' && (
                    <div className="capstone-panel">
                        <h3>3. Incident Response Runbook</h3>

                        <p>
                            Write the decision tree and procedure for responding to a critical incident.
                            Do not assume you know the incident in advance; instead, define categories and response patterns.
                        </p>

                        <h4>Incident Escalation and Contacts</h4>
                        <div className="form-group">
                            <label>Primary On-Call (security team lead):</label>
                            <input
                                type="text"
                                placeholder="e.g., Alice (alice@protocol.security)"
                                value={capstoneData.incident.primaryOnCall || ''}
                                onChange={e => handleCapstoneInput('incident', 'primaryOnCall', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Secondary On-Call (backup):</label>
                            <input
                                type="text"
                                placeholder="e.g., Bob (bob@protocol.security)"
                                value={capstoneData.incident.secondaryOnCall || ''}
                                onChange={e => handleCapstoneInput('incident', 'secondaryOnCall', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Incident Commander (executive decision-maker):</label>
                            <input
                                type="text"
                                placeholder="e.g., CEO or Chief Security Officer"
                                value={capstoneData.incident.incidentCommander || ''}
                                onChange={e => handleCapstoneInput('incident', 'incidentCommander', e.target.value)}
                            />
                        </div>

                        <h4>Severity Classification and Immediate Actions</h4>

                        <div className="severity-response">
                            <h5>P0 / CRITICAL: Active Loss of User Funds</h5>
                            <div className="form-group">
                                <label>Detection signal (what you see):</label>
                                <input
                                    type="text"
                                    placeholder="e.g., TVL drops 50% in 10 min; liquidation rate > 10%/hr; contract balance < expected"
                                    value={capstoneData.incident.p0_signal || ''}
                                    onChange={e => handleCapstoneInput('incident', 'p0_signal', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Immediate action (first 5 minutes):</label>
                                <textarea
                                    placeholder="e.g., 1) Page on-call engineer. 2) Execute PAUSE immediately (no vote). 3) Create #incident Slack channel. 4) Call in IC, TL, Ops. 5) Do NOT communicate externally yet."
                                    value={capstoneData.incident.p0_action || ''}
                                    onChange={e => handleCapstoneInput('incident', 'p0_action', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Triage checklist (next 30 minutes):</label>
                                <textarea
                                    placeholder="☐ Confirm loss is real (not monitoring glitch). ☐ Identify affected contracts/users. ☐ Quantify loss in USD. ☐ Root cause hypothesis (reentrancy? oracle manipulation? parameter bug?). ☐ Is loss ongoing or stopped? ☐ Can we roll back immediately or do we need governance?"
                                    value={capstoneData.incident.p0_triage || ''}
                                    onChange={e => handleCapstoneInput('incident', 'p0_triage', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="severity-response">
                            <h5>P1 / HIGH: Exploit Detected (Loss Potential, Not Active)</h5>
                            <div className="form-group">
                                <label>Detection signal:</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Security researcher reports reentrancy bug; no active exploitation yet. Or, unusual transaction pattern detected by monitor."
                                    value={capstoneData.incident.p1_signal || ''}
                                    onChange={e => handleCapstoneInput('incident', 'p1_signal', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Immediate action (first 1 hour):</label>
                                <textarea
                                    placeholder="1) Confirm bug is real (reproduce on testnet). 2) Estimate impact if exploited. 3) Decide: immediate pause or wait for fix? 4) Begin root cause analysis. 5) Prepare fix and testnet deployment."
                                    value={capstoneData.incident.p1_action || ''}
                                    onChange={e => handleCapstoneInput('incident', 'p1_action', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <h4>Communication Plan</h4>
                        <div className="form-group">
                            <label>How do you announce incident to community (e.g., first tweet)?</label>
                            <textarea
                                placeholder="Example: '🚨 We detected an issue in [contract]. We have paused the protocol as a precaution. Technical team is investigating. Updates every 4 hours. See [status page]'"
                                value={capstoneData.incident.commTemplate || ''}
                                onChange={e => handleCapstoneInput('incident', 'commTemplate', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <h4>Freeze/Pause Actions</h4>
                        <div className="form-group">
                            <label>List all actions the security team can take immediately (no governance vote):</label>
                            <textarea
                                placeholder="e.g., 1) Pause LendingPool (PAUSE_ROLE). 2) Pause oracle updates (to prevent price manipulation). 3) Disable flash loans. 4) Set max withdrawal to 1% per block. [Other emergency controls?]"
                                value={capstoneData.incident.pauseActions || ''}
                                onChange={e => handleCapstoneInput('incident', 'pauseActions', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <button
                            className="primary-btn"
                            onClick={() => setCapstoneStep('demo')}
                        >
                            Next: Demo Script →
                        </button>
                    </div>
                )}

                {currentTab === 'demo' && (
                    <div className="capstone-panel">
                        <h3>4. Demo Script and Protocol Narrative</h3>

                        <p>
                            Write your final presentation. This is how you explain the protocol to a non-technical audience,
                            to investors, or to another engineer who will take over operations.
                        </p>

                        <h4>Problem Statement</h4>
                        <div className="form-group">
                            <label>What problem are you solving?</label>
                            <textarea
                                placeholder="e.g., 'Current DeFi lending protocols have low capital efficiency (70%) because collateral can be used only once. This leads to fragmented liquidity and poor user experience. Our protocol enables collateral reuse with recursive borrowing, improving efficiency to 90% while maintaining safety through circuit breakers.'"
                                value={capstoneData.demo.problem || ''}
                                onChange={e => handleCapstoneInput('demo', 'problem', e.target.value)}
                                rows={4}
                            />
                        </div>

                        <h4>Design Overview</h4>
                        <div className="form-group">
                            <label>How does your architecture work? (High-level, non-technical)</label>
                            <textarea
                                placeholder="e.g., 'Users deposit collateral into our pool. When they borrow, the loan amount is added back as collateral (recursive reuse). A circuit breaker limits reuse depth to 3 levels, preventing infinite loops. All borrows are backed by oracles (Chainlink + Uniswap TWAP). If collateral falls below a safety threshold, liquidators can buy it at a discount, ensuring solvency.'"
                                value={capstoneData.demo.design || ''}
                                onChange={e => handleCapstoneInput('demo', 'design', e.target.value)}
                                rows={4}
                            />
                        </div>

                        <h4>Key Assumptions and Risks</h4>
                        <div className="form-group">
                            <label>What assumptions are critical to safety?</label>
                            <textarea
                                placeholder="1) Chainlink oracle is honest and not manipulated. 2) Liquidation incentive is sufficient to attract liquidators. 3) Collateral volatility < 50% per day. 4) Network does not partition (breaks oracle); if it does, circuit breaker prevents max damage. [Add more...]"
                                value={capstoneData.demo.assumptions || ''}
                                onChange={e => handleCapstoneInput('demo', 'assumptions', e.target.value)}
                                rows={4}
                            />
                        </div>

                        <h4>Deployment Proof</h4>
                        <div className="form-group">
                            <label>Testnet contract addresses and verification links:</label>
                            <textarea
                                placeholder="LendingPool: 0x1234... (Etherscan: https://sepolia.etherscan.io/address/0x1234)\nGovernance: 0x5678... \nToken: 0xabcd..."
                                value={capstoneData.demo.addresses || ''}
                                onChange={e => handleCapstoneInput('demo', 'addresses', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <h4>Test Evidence</h4>
                        <div className="form-group">
                            <label>Links to test results (coverage, invariant tests, mainnet fork simulations):</label>
                            <textarea
                                placeholder="Unit test report: https://github.com/.../coverage\nInvariant test results (Certora): https://github.com/.../invariant_test.md\nMainnet fork simulation (1000s of txs): https://github.com/.../fork_test_results.json"
                                value={capstoneData.demo.testLinks || ''}
                                onChange={e => handleCapstoneInput('demo', 'testLinks', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <h4>What We Did NOT Build (Scope Statement)</h4>
                        <div className="form-group">
                            <label>List scope exclusions (what you deliberately did not build):</label>
                            <textarea
                                placeholder="- No flash loan guards (circuit breaker is sufficient for v1). - No insurance fund (coverage by external insurance). - No yield farming / incentive system (future upgrade). - No cross-chain bridging. - No UI (API-only for now)."
                                value={capstoneData.demo.scopeExclusions || ''}
                                onChange={e => handleCapstoneInput('demo', 'scopeExclusions', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <h4>Governance and Operations Summary</h4>
                        <div className="form-group">
                            <label>Who controls the protocol and how?</label>
                            <textarea
                                placeholder={`Governance: 2-of-3 multisig (Alice/Bob/Carol). Timelock: 2 days for upgrades, 1 day for parameter changes. Emergency pause: security team (no timelock). All state changes logged; all upgrades staged (canary → partial → full).`}
                                value={capstoneData.demo.govSummary || ''}
                                onChange={e => handleCapstoneInput('demo', 'govSummary', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="key-takeaway">
                            <strong>Key Takeaway:</strong> Your demo script tells a coherent story: problem → design → proof → safety.
                            It should be clear enough for a non-technical investor to understand, and rigorous enough for an engineer
                            to operate the protocol safely.
                        </div>

                        <button
                            className="primary-btn"
                            onClick={() => {
                                markSectionComplete('capstone-workshop');
                                setCurrentSection('audit-checklist');
                            }}
                        >
                            Next: Final Audit Checklist →
                        </button>
                    </div>
                )}
            </section>
        );
    };

    const AuditChecklist = () => (
        <section className="section-container">
            <h2>§5. Final Delivery: Audit Pass & Portfolio Documentation</h2>

            <p>
                Before you ship your protocol, run through this checklist. Every item must be verified and documented.
            </p>

            <h3>5.1 Critical Controls Verification Checklist</h3>

            <div className="audit-checklist">
                <div className="checklist-section">
                    <h4>Governance and Upgrade Controls</h4>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit1" />
                        <label htmlFor="audit1">
                            <strong>Timelock Enforced:</strong> All state-changing actions (upgrades, parameter changes, pause/unpause)
                            are delayed by documented timelock. Emergency bypass is explicitly disabled.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit2" />
                        <label htmlFor="audit2">
                            <strong>Multisig Setup:</strong> Governance uses M-of-N threshold (M ≥ 2); signers are verified to be
                            independent (different orgs, geographies, custody methods).
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit3" />
                        <label htmlFor="audit3">
                            <strong>Proxy Admin Transfer:</strong> If using upgradeable proxy, proxy admin has been transferred to
                            governance contract. Dev team no longer holds proxy admin key.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit4" />
                        <label htmlFor="audit4">
                            <strong>Pause Mechanism:</strong> Protocol has an explicit pause() function gated by a separate PAUSE_ROLE
                            (not behind multisig vote). Pause is immediate (no timelock). Unpause requires governance vote (with timelock).
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit5" />
                        <label htmlFor="audit5">
                            <strong>Role-Based Access:</strong> At least 3 distinct roles: UPGRADE_ROLE (code changes), PAUSE_ROLE
                            (emergency, independent), PARAMETER_ROLE (admin functions). No single role can do everything.
                        </label>
                    </div>
                </div>

                <div className="checklist-section">
                    <h4>Upgrade and Deployment Safety</h4>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit6" />
                        <label htmlFor="audit6">
                            <strong>Staged Rollout Implemented:</strong> Upgrade process includes canary phase (10% TVL, 24h),
                            partial phase (50% TVL), and full phase. Each phase is manual (human review before advancing).
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit7" />
                        <label htmlFor="audit7">
                            <strong>Rollback Plan Tested:</strong> Downgrade to previous contract version has been tested on testnet
                            and mainnet fork. Team has practiced the rollback ceremony.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit8" />
                        <label htmlFor="audit8">
                            <strong>Deployment Scripts Verified:</strong> All deployment scripts are version-controlled, reviewed,
                            and produce verifiable results (e.g., contract addresses match expected values).
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit9" />
                        <label htmlFor="audit9">
                            <strong>Initialization Hardening:</strong> Constructor and initializer functions cannot be called
                            twice (guards against re-initialization attack). Initialization is tested explicitly.
                        </label>
                    </div>
                </div>

                <div className="checklist-section">
                    <h4>Security and Testing</h4>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit10" />
                        <label htmlFor="audit10">
                            <strong>Code Coverage:</strong> All user-facing functions and admin functions have >95% code coverage.
                            Critical paths (borrow, repay, liquidate, pause) are 100% covered.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit11" />
                        <label htmlFor="audit11">
                            <strong>Invariant Tests:</strong> Invariant properties (e.g., "total deposits >= total borrows", 
                            "collateral ratios respecting circuit breaker") are tested for 48+ hours on mainnet fork.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit12" />
                        <label htmlFor="audit12">
                            <strong>Threat Model Documented:</strong> Threat model lists assets (user funds, governance), actors 
                            (users, liquidators, attacker), boundaries (oracle trust, contract code), and attack surfaces 
                            (external calls, price manipulation, reentrancy).
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit13" />
                        <label htmlFor="audit13">
                            <strong>External Audit Complete:</strong> Protocol has undergone external security audit by reputable firm.
                            All audit findings (except acknowledged risks) are resolved.
                        </label>
                    </div>
                </div>

                <div className="checklist-section">
                    <h4>Monitoring and Incident Response</h4>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit14" />
                        <label htmlFor="audit14">
                            <strong>Monitoring Deployed:</strong> Key metrics (TVL, collateral ratios, liquidation rates, oracle prices,
                            transaction success rate) are monitored in real-time. Alerts fire for critical thresholds.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit15" />
                        <label htmlFor="audit15">
                            <strong>On-Call Rotation Established:</strong> Dedicated on-call engineer (24/7 rotation) is responsible
                            for monitoring and incident response. Contact info is maintained and tested monthly.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit16" />
                        <label htmlFor="audit16">
                            <strong>Incident Response Runbook Tested:</strong> Team has conducted incident response tabletop exercises
                            (simulated P0 scenarios) at least once. Runbook has been reviewed and is >= 95% complete.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit17" />
                        <label htmlFor="audit17">
                            <strong>Bug Bounty Program Active:</strong> Public bug bounty program (Immunefi or equivalent) is published.
                            Bounty amounts are defined for P0, P1, P2 severity. Team responds to reports within 24 hours.
                        </label>
                    </div>
                </div>

                <div className="checklist-section">
                    <h4>Documentation and Handoff</h4>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit18" />
                        <label htmlFor="audit18">
                            <strong>README Complete:</strong> Repository README includes: problem statement, design overview,
                            deployment instructions (testnet + mainnet), usage examples, governance model, and known risks.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit19" />
                        <label htmlFor="audit19">
                            <strong>Architecture Documentation:</strong> High-level architecture diagram + written overview of
                            contract relationships, data flows, and trust boundaries.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit20" />
                        <label htmlFor="audit20">
                            <strong>Operations Runbook:</strong> Step-by-step runbooks for: upgrade procedure, emergency pause/unpause,
                            key rotation, incident response, monitoring setup.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit21" />
                        <label htmlFor="audit21">
                            <strong>Known Risks and Limitations:</strong> Document acknowledged risks (e.g., "oracle trust assumption",
                            "liquidation incentive may fail in extreme market conditions"). Include mitigation strategies.
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit22" />
                        <label htmlFor="audit22">
                            <strong>Deployment Artifacts:</strong> Store and version-control: deployment scripts, upgrade proposals,
                            governance decisions, test reports, and signed transactions (or transaction hashes).
                        </label>
                    </div>
                    <div className="checklist-item">
                        <input type="checkbox" id="audit23" />
                        <label htmlFor="audit23">
                            <strong>Peer Review Evidence:</strong> External reviewer has audited governance + operations design.
                            Feedback and resolutions are documented.
                        </label>
                    </div>
                </div>
            </div>

            <h3>5.2 Deliverables Checklist: What Your Capstone Must Include</h3>

            <div className="deliverables">
                <div className="deliverable-group">
                    <h4>Documentation Package</h4>
                    <ul>
                        <li>
                            <strong>README.md:</strong> Overview, problem, design, deployment, usage, governance, known risks.
                        </li>
                        <li>
                            <strong>ARCHITECTURE.md:</strong> Detailed design, contract roles, data structures, upgrade patterns.
                        </li>
                        <li>
                            <strong>THREAT_MODEL.md:</strong> Assets, actors, boundaries, attack surfaces, mitigations.
                        </li>
                        <li>
                            <strong>OPERATIONS.md:</strong> Governance design, upgrade playbook, incident response, monitoring.
                        </li>
                        <li>
                            <strong>GOVERNANCE.md:</strong> Multisig configuration, signer info, timelock params, emergency roles.
                        </li>
                    </ul>
                </div>

                <div className="deliverable-group">
                    <h4>Code and Tests</h4>
                    <ul>
                        <li>
                            <strong>Smart Contracts:</strong> Full source code with inline comments explaining complex logic.
                        </li>
                        <li>
                            <strong>Unit Tests:</strong> >95% coverage; organized by contract and function.
                        </li>
                        <li>
                            <strong>Integration Tests:</strong> Multi-contract scenarios (e.g., user deposits → borrows → liquidation).
                        </li>
                        <li>
                            <strong>Invariant Tests:</strong> Foundry or Certora specs verifying safety properties.
                        </li>
                        <li>
                            <strong>Deployment Scripts:</strong> Hardhat/Foundry scripts for testnet and mainnet (with notes on manual steps).
                        </li>
                    </ul>
                </div>

                <div className="deliverable-group">
                    <h4>Audit and Review Evidence</h4>
                    <ul>
                        <li>
                            <strong>External Audit Report:</strong> From reputable firm (e.g., OpenZeppelin, Trail of Bits, etc.).
                        </li>
                        <li>
                            <strong>Peer Review Feedback:</strong> Comments from external reviewer + team responses.
                        </li>
                        <li>
                            <strong>Test Coverage Report:</strong> Coverage percentages and critical path verification.
                        </li>
                        <li>
                            <strong>Security Review Checklist:</strong> Reentrancy, arithmetic, access control, oracle, etc.
                        </li>
                    </ul>
                </div>

                <div className="deliverable-group">
                    <h4>Operational Artifacts</h4>
                    <ul>
                        <li>
                            <strong>Governance Design Doc:</strong> Multisig signer list, roles, timelock params, failure mode analysis.
                        </li>
                        <li>
                            <strong>Upgrade Playbook:</strong> Step-by-step procedure with gates and rollback plan.
                        </li>
                        <li>
                            <strong>Incident Response Runbook:</strong> Severity classification, triage procedure, comms template, freeze actions.
                        </li>
                        <li>
                            <strong>Monitoring Setup:</strong> Key metrics, alert thresholds, log examples.
                        </li>
                        <li>
                            <strong>Bug Bounty Policy:</strong> Severity levels, bounty amounts, responsible disclosure process.
                        </li>
                    </ul>
                </div>

                <div className="deliverable-group">
                    <h4>Deployment and Proof</h4>
                    <ul>
                        <li>
                            <strong>Testnet Deployment Report:</strong> Contract addresses, constructor args, verification links.
                        </li>
                        <li>
                            <strong>Governance Proposal Examples:</strong> Sample proposal + execution details.
                        </li>
                        <li>
                            <strong>Upgrade Example:</strong> Step-by-step walkthrough of a staged canary → partial → full upgrade.
                        </li>
                        <li>
                            <strong>Mainnet Fork Test Report:</strong> Simulation with realistic load, invariant verification, gas measurements.
                        </li>
                    </ul>
                </div>

                <div className="deliverable-group">
                    <h4>Presentation / Demo</h4>
                    <ul>
                        <li>
                            <strong>Live Demo:</strong> Show deployement on testnet; walk through a user deposit, borrow, liquidation flow.
                        </li>
                        <li>
                            <strong>Narrative Slide Deck:</strong> Problem → Design → Proof → Safety (5–10 slides).
                        </li>
                        <li>
                            <strong>Q&A Prep:</strong> Anticipate questions about governance, risks, and operations.
                        </li>
                    </ul>
                </div>
            </div>

            <button
                className="primary-btn"
                onClick={() => {
                    markSectionComplete('audit-checklist');
                    setCurrentSection('tabletop');
                }}
            >
                Next: Governance Tabletop Exercise →
            </button>
        </section>
    );

    const TabletopExercise = () => {
        const phases = {
            setup: () => (
                <div>
                    <h3>Phase 1: Setup Your Hypothetical</h3>
                    <p>
                        You are the Incident Commander for a DeFi protocol. Choose your governance model and incident scenario,
                        then walk through your response step by step.
                    </p>

                    <h4>Step 1: Choose Your Governance Model</h4>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="gov_model"
                                value="multisig"
                                checked={tabletopChoices.gov_model === 'multisig'}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, gov_model: e.target.value, phase: 'setup' })}
                            />
                            2-of-3 Multisig (2-day upgrade timelock)
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="gov_model"
                                value="dao"
                                checked={tabletopChoices.gov_model === 'dao'}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, gov_model: e.target.value, phase: 'setup' })}
                            />
                            Token-Weighted DAO Vote (1-week voting, 2-day timelock)
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="gov_model"
                                value="hybrid"
                                checked={tabletopChoices.gov_model === 'hybrid'}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, gov_model: e.target.value, phase: 'setup' })}
                            />
                            Hybrid: 2-of-3 Multisig for routine, DAO vote for major upgrades
                        </label>
                    </div>

                    <h4>Step 2: Choose Your Incident</h4>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="incident"
                                value="reentrancy"
                                checked={tabletopChoices.incident === 'reentrancy'}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, incident: e.target.value })}
                            />
                            Scenario A: Reentrancy Bug (discovered by security researcher, not yet exploited)
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="incident"
                                value="oracle"
                                checked={tabletopChoices.incident === 'oracle'}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, incident: e.target.value })}
                            />
                            Scenario B: Oracle Manipulation (attacker exploits Chainlink price feed, $5M loss)
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="incident"
                                value="parameter"
                                checked={tabletopChoices.incident === 'parameter'}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, incident: e.target.value })}
                            />
                            Scenario C: Governance Capture (attacker bribes whale to set liquidation threshold to 5%)
                        </label>
                    </div>

                    <button
                        className="primary-btn"
                        disabled={!tabletopChoices.gov_model || !tabletopChoices.incident}
                        onClick={() => setTabletopChoices({ ...tabletopChoices, phase: 'response' })}
                    >
                        Start Response Exercise →
                    </button>
                </div>
            ),

            response: () => (
                <div>
                    <h3>Phase 2: Tabletop Response</h3>
                    <p>
                        <strong>Governance Model:</strong> {tabletopChoices.gov_model === 'multisig' ? '2-of-3 Multisig' : tabletopChoices.gov_model === 'dao' ? 'DAO Vote' : 'Hybrid'}
                    </p>
                    <p>
                        <strong>Incident:</strong> {
                            tabletopChoices.incident === 'reentrancy' ? 'Reentrancy bug (potential, not active)' :
                            tabletopChoices.incident === 'oracle' ? 'Oracle manipulation ($5M loss, active)' :
                            'Governance capture (bad parameter change)'
                        }
                    </p>

                    <div className="response-section">
                        <h4>Step 1: Triage (0–15 minutes)</h4>
                        <p>As the IC, what is your immediate assessment?</p>
                        <div className="form-group">
                            <label>Severity (P0=critical loss, P1=high risk, P2=medium, P3=low):</label>
                            <select
                                value={tabletopChoices.severity || ''}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, severity: e.target.value })}
                            >
                                <option value="">-- Select --</option>
                                <option value="p0">P0 (CRITICAL)</option>
                                <option value="p1">P1 (HIGH)</option>
                                <option value="p2">P2 (MEDIUM)</option>
                                <option value="p3">P3 (LOW)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>First action (what do you do in the first 5 minutes)?</label>
                            <textarea
                                placeholder="e.g., 'Page on-call engineer. Confirm loss on testnet. Execute PAUSE if P0.'"
                                value={tabletopChoices.firstAction || ''}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, firstAction: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="response-section">
                        <h4>Step 2: Contain (15 min – 1 hour)</h4>
                        <div className="form-group">
                            <label>What is your containment strategy?</label>
                            <textarea
                                placeholder="e.g., 'Pause the entire protocol immediately (PAUSE_ROLE can do this without vote). Notify team. Begin root cause analysis in parallel.'"
                                value={tabletopChoices.contain || ''}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, contain: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <div className="form-group">
                            <label>Can your governance model execute a pause immediately, or is there a delay?</label>
                            <textarea
                                placeholder="e.g., 'PAUSE_ROLE can execute immediately (no timelock). Upgrade_role requires 2-day timelock.' Then think: is this acceptable for this scenario?"
                                value={tabletopChoices.pauseCapability || ''}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, pauseCapability: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="response-section">
                        <h4>Step 3: Eradicate (1 hour – 7 days)</h4>
                        <div className="form-group">
                            <label>What is your fix strategy? (Rollback vs. surgical fix vs. parameter change?)</label>
                            <textarea
                                placeholder="e.g., 'For reentrancy: prepare surgical fix (add nonReentrant guard). Test on testnet for 48h. If no issues, deploy to mainnet (staged rollout).'"
                                value={tabletopChoices.fix || ''}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, fix: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <div className="form-group">
                            <label>What governance action is required (multisig approval, DAO vote)?</label>
                            <textarea
                                placeholder="e.g., 'Multisig: Alice + Bob approve upgrade proposal. 2-day timelock. Then staged canary → partial → full deployment.'"
                                value={tabletopChoices.govAction || ''}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, govAction: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="response-section">
                        <h4>Step 4: Communicate Throughout</h4>
                        <div className="form-group">
                            <label>Draft your first public update (Twitter, Discord, etc.):</label>
                            <textarea
                                placeholder="Example: '🚨 We detected a [reentrancy / oracle] issue in LendingPool. We have paused the protocol out of caution. Technical team is investigating. Updates every 4 hours.'"
                                value={tabletopChoices.publicUpdate || ''}
                                onChange={e => setTabletopChoices({ ...tabletopChoices, publicUpdate: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={() => setTabletopChoices({ ...tabletopChoices, phase: 'debrief' })}
                    >
                        See Debrief & Best Practices →
                    </button>
                </div>
            ),

            debrief: () => (
                <div>
                    <h3>Phase 3: Debrief & Best Practices</h3>

                    {tabletopChoices.incident === 'reentrancy' && (
                        <div className="incident-debrief">
                            <h4>Scenario A: Reentrancy Bug (Potential, Not Exploited)</h4>

                            <p>
                                <strong>Best Practice Response:</strong>
                            </p>
                            <ol>
                                <li>
                                    <strong>Severity:</strong> P1 (HIGH) because exploit exists but is not active. Damage is potential only.
                                </li>
                                <li>
                                    <strong>Do NOT Pause Yet:</strong> If not actively exploited, pause is not warranted (risks unnecessary losses from liquidations). Instead, prepare for surgical fix.
                                </li>
                                <li>
                                    <strong>Root Cause Analysis:</strong> Verify reentrancy vector: what functions can be called recursively? Can an attacker profit? By how much?
                                </li>
                                <li>
                                    <strong>Fix:</strong> Add nonReentrant guard to callback function. Test the fix exhaustively: unit tests, invariant tests, mainnet fork simulation.
                                </li>
                                <li>
                                    <strong>Governance & Timelock:</strong> If using multisig, signers review and approve the upgrade proposal. 2-day timelock. During timelock, community can review and exit if concerned.
                                </li>
                                <li>
                                    <strong>Governance & Timelock:</strong> If using multisig, signers review and approve the upgrade proposal. 2-day timelock. During timelock, community can review and exit if concerned.
                                </li>
                                <li>
                                    <strong>Staged Deployment:</strong> Phase 1 canary (10% TVL), Phase 2 partial (50% TVL), Phase 3 full. Monitor each phase for 24h.
                                </li>
                                <li>
                                    <strong>Post-Incident Review:</strong> Within 2 weeks, conduct a blameless post-mortem. Document the full timeline, root cause, and contributing factors. Share a summary with the community — transparency builds long-term trust.
                                </li>
                            </ol>
                            <p>
                                <strong>Key Takeaway:</strong> For a potential (not active) vulnerability, slow down and act surgically. Pause only if actively exploited. Transparent communication at every step builds community confidence.
                            </p>
                        </div>
                    )}

                    {tabletopChoices.incident === 'oracle' && (
                        <div className="incident-debrief">
                            <h4>Scenario B: Oracle Manipulation ($5M Loss, Active)</h4>
                            <p><strong>Best Practice Response:</strong></p>
                            <ol>
                                <li><strong>Severity:</strong> P0 (CRITICAL). Active loss in progress. Pause immediately.</li>
                                <li><strong>Pause Protocol:</strong> Execute PAUSE_ROLE immediately. Stop all new borrows, liquidations, and withdrawals. Some in-flight liquidations may fail — accept this tradeoff.</li>
                                <li><strong>Notify Community:</strong> Post a brief public update within 15 minutes: "We detected an anomaly and paused as a precaution. Full update in 2 hours."</li>
                                <li><strong>Root Cause:</strong> Was the oracle price feed manipulated via flash loan? Via spot price griefing? Identify the exact attack path and quantify the loss.</li>
                                <li><strong>Fix:</strong> Add oracle price circuit breakers (max deviation per block). Use multiple oracle sources with median aggregation. Consider TWAP instead of spot prices for sensitive operations.</li>
                                <li><strong>Recovery:</strong> Snapshot balances pre-attack. Develop a reimbursement plan via protocol treasury or insurance fund. Engage with legal counsel if needed.</li>
                            </ol>
                        </div>
                    )}

                    {tabletopChoices.incident === 'parameter' && (
                        <div className="incident-debrief">
                            <h4>Scenario C: Governance Capture (Bad Parameter Change)</h4>
                            <p><strong>Best Practice Response:</strong></p>
                            <ol>
                                <li><strong>Severity:</strong> P1 (HIGH). Parameter is live but catastrophic losses have not occurred yet. Time is limited.</li>
                                <li><strong>Use Timelock:</strong> If the timelock has not yet expired, cancel the queued transaction immediately. This is precisely why timelocks exist — they provide a review window.</li>
                                <li><strong>Emergency Multisig Override:</strong> If the parameter was changed by abusing an emergency multisig, revoke that emergency role immediately and investigate the key compromise.</li>
                                <li><strong>Community Vote:</strong> Initiate an emergency governance vote to reverse the harmful parameter. Use clear, transparent communication to rally legitimate token holders.</li>
                                <li><strong>Post-Mortem:</strong> Review how the attacker acquired sufficient voting power. Consider vote-escrow mechanisms, delegation caps, or supermajority requirements for critical parameter changes.</li>
                            </ol>
                        </div>
                    )}

                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400" style={{ marginTop: 24 }}>
                        <h4>General Incident Response Principles</h4>
                        <ul>
                            <li><strong>Slow is smooth, smooth is fast.</strong> Rushing a fix introduces more vulnerabilities.</li>
                            <li><strong>Communicate early and often.</strong> Silence breeds fear and speculation in the community.</li>
                            <li><strong>Use your runbook.</strong> The heat of a crisis is not the time to improvise procedures.</li>
                            <li><strong>Blameless post-mortem.</strong> Focus on improving systems and processes, not assigning blame to individuals.</li>
                        </ul>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={() => setTabletopChoices({ ...tabletopChoices, phase: 'setup' })}
                        style={{ marginTop: 24 }}
                    >
                        ↺ Restart Tabletop
                    </button>
                </div>
            ),
        };

        const currentPhase = tabletopChoices.phase || 'setup';
        const PhaseComponent = phases[currentPhase] || phases.setup;

        return (
            <section className="section-container">
                <h2>Governance Tabletop Exercise</h2>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    {['setup', 'response', 'debrief'].map((p) => (
                        <span
                            key={p}
                            style={{
                                padding: '4px 16px',
                                borderRadius: 20,
                                fontSize: 13,
                                background: currentPhase === p ? '#2563eb' : '#e5e7eb',
                                color: currentPhase === p ? '#fff' : '#374151',
                                fontWeight: currentPhase === p ? 700 : 400,
                            }}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </span>
                    ))}
                </div>
                <PhaseComponent />
            </section>
        );
    };

    const sectionComponents = {
        intro: IntroSection,
        section1: Section1,
        section2: Section2,
        section3: Section3,
        'capstone-intro': CapstoneIntro,
        'capstone-workshop': CapstoneWorkshop,
        'audit-checklist': AuditChecklist,
        tabletop: TabletopExercise,
    };

    const navItems = [
        { id: 'intro', label: '0. Introduction' },
        { id: 'section1', label: '1. Governance Models' },
        { id: 'section2', label: '2. Upgrade Playbook' },
        { id: 'section3', label: '3. Incident Response' },
        { id: 'capstone-intro', label: '4. Capstone Overview' },
        { id: 'capstone-workshop', label: '5. Capstone Workshop' },
        { id: 'audit-checklist', label: '6. Audit Checklist' },
        { id: 'tabletop', label: '7. Tabletop Exercise' },
    ];

    const progress = calculateProgress;
    const ActiveSection = sectionComponents[currentSection] || sectionComponents.intro;

    return (
        <>
        <style>{_S+_D}</style>
        <div style={{display:'flex',height:'100vh',background:_C.bg0,color:_C.text,overflow:'hidden'}}>
                <div style={{width:218,background:_C.bg1,borderRight:`1px solid ${_C.border}`,display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
                <div style={{padding:'18px 16px 14px',borderBottom:`1px solid ${_C.border}`}}>
                    <div style={{fontFamily:_C.mono,fontSize:8,color:_C.textMuted,letterSpacing:'0.24em',textTransform:'uppercase',marginBottom:8}}>ACM Educational Series</div>
                    <div style={{fontFamily:_C.disp,fontSize:13,fontWeight:700,color:_C.textBright,lineHeight:1.25,letterSpacing:'0.05em'}}>Governance & Capstone</div>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10}}>
                        <div style={{width:5,height:5,borderRadius:'50%',background:_C.cyan,animation:'blink 1.8s ease infinite'}}/>
                        <span style={{fontFamily:_C.mono,fontSize:9,color:_C.textMuted}}>Chapter 14  Live</span>
                    </div>
                </div>
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</p>
                        <div style={{ width: '100%', background: '#d1d5db', borderRadius: 4, height: 8, marginTop: 8 }}>
                            <div style={{ width: `${progress}%`, background: '#2563eb', height: 8, borderRadius: 4, transition: 'width 0.3s' }} />
                        </div>
                        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{progress}% Complete</p>
                    </div>
                    <nav>
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentSection(item.id)}
                                style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '8px 12px', borderRadius: 4, border: 'none',
                                    cursor: 'pointer', fontSize: 13, marginBottom: 2,
                                    background: currentSection === item.id ? '#2563eb' : 'transparent',
                                    color: currentSection === item.id ? '#fff' : '#374151',
                                    fontWeight: currentSection === item.id ? 700 : 400,
                                    transition: 'all 0.15s',
                                }}
                            >
                                {completedSections.has(item.id) && '✓ '}{item.label}
                            </button>
                        ))}
                    </nav>
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #d1d5db' }}>
                        <label style={{ display: 'flex', alignItems: 'center', fontSize: 13, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={instructorMode}
                                onChange={(e) => setInstructorMode(e.target.checked)}
                                style={{ marginRight: 8 }}
                            />
                            Instructor Mode
                        </label>
                        {instructorMode && (
                            <button
                                onClick={() => setShowAnswers(!showAnswers)}
                                style={{ marginTop: 8, width: '100%', padding: '6px 0', background: '#d97706', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
                            >
                                {showAnswers ? 'Hide Answers' : 'Show Answers'}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setCurrentSection('intro');
                                setQuizAnswers({});
                                setShowAnswers(false);
                                setCapstoneStep('governance');
                                setTabletopChoices({});
                            }}
                            style={{ marginTop: 8, width: '100%', padding: '6px 0', background: '#9ca3af', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
                        >
                            Reset Module
                        </button>
                    </div>
                </div>
                <div style={{flex:1,overflowY:'auto',padding:'38px 46px',maxWidth:860,margin:'0 auto',width:'100%'}}>
                    <div className="m4">
                    <ActiveSection />
                    </div>
                </div>
        </div>
    </>
    );
};

export default GovernanceOperationsCapstone;