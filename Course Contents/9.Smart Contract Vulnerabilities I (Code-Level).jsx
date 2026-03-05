import React, { useState, useCallback, useMemo } from 'react';

//  M4 Design System 
const _S=`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');::-webkit-scrollbar{width:4px;background:#080c10}::-webkit-scrollbar-thumb{background:#1a3a4a;border-radius:2px}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`;
const _D=`.m4{background:#060a0e!important;color:#7eb8cc;font-family:'Merriweather',serif}.m4 h1,.m4 h2,.m4 h3,.m4 h4,.m4 h5,.m4 h6{color:#d6eef5!important;font-family:'Orbitron',sans-serif!important;background:transparent!important;border-color:#1c3344!important}.m4 p,.m4 li,.m4 td,.m4 span,.m4 label{color:#7eb8cc!important;background:transparent!important}.m4 div,.m4 section,.m4 ul,.m4 ol{background:transparent!important;background-color:transparent!important;border-color:#1c3344!important}.m4 pre,.m4 code{background:#030608!important;color:#00e5ff!important;border-color:#1c3344!important;font-family:'IBM Plex Mono',monospace!important}.m4 button{background:#00e5ff18!important;background-color:#00e5ff18!important;border:1px solid rgba(0,229,255,.31)!important;color:#00e5ff!important;font-family:'IBM Plex Mono',monospace!important;border-radius:4px!important}.m4 button:disabled{background:#121f2a!important;color:#2e5a6e!important}.m4 input,.m4 textarea,.m4 select{background:#0e1820!important;color:#7eb8cc!important;border-color:#1c3344!important}.m4 th{background:#0e1820!important;color:#d6eef5!important}.m4 tr{background:transparent!important}.m4 tr:nth-child(even){background:#0d1825!important}.m4 table *{border-color:#1c3344!important}.m4 strong,.m4 b{color:#d6eef5!important;background:transparent!important}.m4 a{color:#00e5ff!important;background:transparent!important}.m4 hr{border-color:#1c3344!important}.m4 .callout,.m4 .feedback,.m4 .quiz-section,.m4 .quiz-question{background:#0a1018!important;border-color:#1c3344!important}.m4 .callout.pitfall{border-color:#ff5252!important}.m4 .codeblock{background:#030608!important;color:#00e5ff!important;font-family:'IBM Plex Mono',monospace!important}`;
const _C={bg0:"#060a0e",bg1:"#0a1018",bg2:"#0e1820",border:"#1c3344",cyan:"#00e5ff",cyanFaint:"#00e5ff14",text:"#7eb8cc",textMuted:"#2e5a6e",textBright:"#d6eef5",mono:"'IBM Plex Mono',monospace",disp:"'Orbitron',sans-serif",body:"'Merriweather',serif"};
// 

const ModuleContent = () => {
    const [currentSection, setCurrentSection] = useState('intro');
    const [expandedQuiz, setExpandedQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState(false);
    const [assessmentAnswers, setAssessmentAnswers] = useState({});
    const [showFinalFeedback, setShowFinalFeedback] = useState(false);
    const [simulationStep, setSimulationStep] = useState(0);
    const [simulationChoices, setSimulationChoices] = useState([]);

    const sections = [
        { id: 'intro', label: '0. Introduction', icon: '📖' },
        { id: 'reentrancy', label: '1. Reentrancy', icon: '🔄' },
        { id: 'access', label: '2. Access Control', icon: '🔐' },
        { id: 'delegatecall', label: '3. Delegatecall', icon: '📍' },
        { id: 'dos', label: '4. Denial-of-Service', icon: '⛔' },
        { id: 'lab', label: 'Lab: Exploit & Patch', icon: '🔧' },
        { id: 'simulation', label: 'Guided Simulation', icon: '🎮' },
        { id: 'assessment', label: 'Final Assessment', icon: '✅' },
    ];

    const quizzes = {
        intro_q1: {
            question: 'What is the primary threat model for code-level smart contract vulnerabilities?',
            type: 'mc',
            options: [
                { text: 'An authenticated user with legitimate permissions making mistakes', id: 'a' },
                { text: 'An attacker or untrusted caller exploiting logic flaws, state inconsistency, or missing checks', id: 'b' },
                { text: 'Network layer attacks on the Ethereum protocol', id: 'c' },
            ],
            correct: 'b',
            explanation: 'Code-level vulnerabilities assume an attacker can call contract functions. The threat model is: untrusted external input, no guarantees on call ordering or timing, and contract logic faults lead to loss of funds or control.',
        },
        reentrancy_q1: {
            question: 'In reentrancy, why does the attacker\'s fallback function call withdraw() again?',
            type: 'mc',
            options: [
                { text: 'To lock up gas and cause a denial of service', id: 'a' },
                { text: 'Because the contract\'s balance check happens *after* the transfer, the balance hasn\'t been decremented yet', id: 'b' },
                { text: 'To exploit a race condition in the blockchain', id: 'c' },
            ],
            correct: 'b',
            explanation: 'The classic reentrancy bug: balance -= amount happens *after* the external call (transfer or call). When the attacker\'s fallback fires, the balance is still high, so the second withdrawal succeeds. This is the "Checks-Effects-Interactions" violation.',
        },
        reentrancy_q2: {
            question: 'Which defense pattern prevents reentrancy by changing the *order* of operations?',
            type: 'mc',
            options: [
                { text: 'A mutex lock (reentrancy guard)', id: 'a' },
                { text: 'Decrementing balance *before* the external call (Checks-Effects-Interactions)', id: 'b' },
                { text: 'Using low-level assembly', id: 'c' },
            ],
            correct: 'b',
            explanation: 'Checks-Effects-Interactions (CEI) is a code pattern: validate first (checks), modify state (effects), then call externals (interactions). If the attacker reents during the interaction, the state is already updated.',
        },
        access_q1: {
            question: 'Why is tx.origin dangerous for access control?',
            type: 'mc',
            options: [
                { text: 'It is slower than msg.sender', id: 'a' },
                { text: 'It refers to the *original* caller in the chain, not the immediate caller. A compromised/malicious contract can call your function and tx.origin is still the user.', id: 'b' },
                { text: 'It costs more gas', id: 'c' },
            ],
            correct: 'b',
            explanation: 'Phishing via tx.origin: Eve tricks Alice into calling Eve\'s contract. Eve\'s contract calls your vault. Your check `require(tx.origin == owner)` sees Alice, not Eve, and allows theft. Always use msg.sender.',
        },
        access_q2: {
            question: 'What is the most common access control failure in smart contracts?',
            type: 'ms',
            options: [
                { text: 'Missing or incorrect visibility modifiers (internal vs external)', id: 'a' },
                { text: 'Forgetting to apply `onlyOwner` or role modifiers to sensitive functions', id: 'b' },
                { text: 'Using tx.origin instead of msg.sender for privilege checks', id: 'c' },
                { text: 'Hardcoding admin addresses and never allowing revocation', id: 'd' },
            ],
            correct: ['a', 'b', 'c', 'd'],
            explanation: 'All of these are common! The lesson: secure by default (private/internal first), apply modifiers consistently, use msg.sender, and design revocable admin patterns.',
        },
        delegatecall_q1: {
            question: 'When Contract A delegatecalls Contract B, whose storage does Contract B modify?',
            type: 'mc',
            options: [
                { text: 'Contract B\'s storage', id: 'a' },
                { text: 'Contract A\'s storage (B runs in A\'s context)', id: 'b' },
                { text: 'A temporary storage that is discarded', id: 'c' },
            ],
            correct: 'b',
            explanation: 'delegatecall is dangerous because B\'s code executes in A\'s storage context. If A and B have different storage layouts, B can corrupt A\'s critical state (e.g., owner, balances).',
        },
        dos_q1: {
            question: 'What is a "state-lock" denial-of-service pattern?',
            type: 'mc',
            options: [
                { text: 'An attacker unable to steal funds, but able to halt progress by reverting in a critical callback', id: 'a' },
                { text: 'A gas limit issue that prevents large transfers', id: 'b' },
                { text: 'A race condition in mempool ordering', id: 'c' },
            ],
            correct: 'a',
            explanation: 'Example: a contract loops through recipients and transfers funds. If one recipient\'s fallback reverts, the entire tx reverts and *nobody* gets paid. The state is "locked" unless the bad recipient is removed.',
        },
    };

    const calculateScore = useCallback((answers, quiz_keys) => {
        let correct = 0;
        quiz_keys.forEach((key) => {
            const quiz = quizzes[key];
            const answer = answers[key];
            if (!answer) return;
            if (quiz.type === 'mc') {
                if (answer === quiz.correct) correct++;
            } else if (quiz.type === 'ms') {
                if (
                    Array.isArray(answer) &&
                    Array.isArray(quiz.correct) &&
                    answer.length === quiz.correct.length &&
                    answer.every((a) => quiz.correct.includes(a))
                ) {
                    correct++;
                }
            }
        });
        return { correct, total: quiz_keys.length };
    }, [quizzes]);

    const handleQuizAnswer = (quizKey, answer) => {
        setQuizAnswers((prev) => ({ ...prev, [quizKey]: answer }));
    };

    const toggleMSAnswer = (quizKey, optionId) => {
        setQuizAnswers((prev) => {
            const current = prev[quizKey] || [];
            const updated = current.includes(optionId)
                ? current.filter((id) => id !== optionId)
                : [...current, optionId];
            return { ...prev, [quizKey]: updated };
        });
    };

    const handleAssessmentAnswer = (questionId, answer) => {
        setAssessmentAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const assessmentQuestions = [
        {
            id: 'a1',
            question: 'A vault allows withdrawals via external call. The balance is decremented *after* the call. Describe the reentrancy attack and identify the CEI violation.',
            type: 'sa',
            keyPoints: ['external call before state change', 'attacker fallback re-enters', 'balance check fails to block second withdrawal'],
        },
        {
            id: 'a2',
            question: 'You inherit an upgradeable contract using delegatecall. The old version has `uint owner; mapping balances;`. The new version adds `bool paused;` as the first storage var. What happens?',
            type: 'sa',
            keyPoints: ['storage collision', 'paused overwrite owner field', 'loss of ownership', 'upgrade must preserve layout'],
        },
        {
            id: 'a3',
            question: 'A contract function is marked `public` and transfers funds without access control. An attacker can call it. What are three fixes?',
            type: 'sa',
            keyPoints: ['change visibility to internal/private', 'add onlyOwner or role-based modifier', 'require msg.sender == owner (not tx.origin)'],
        },
        {
            id: 'a4',
            question: 'Your contract calls an external address to transfer funds in a loop over 100 recipients. If one reverts, all revert and funds are locked. How do you mitigate?',
            type: 'sa',
            keyPoints: ['use pull pattern (recipient withdraws, not contract pushes)', 'or store failed transfers and retry', 'or use no-revert external calls with error handling'],
        },
    ];

    const QuizComponent = ({ quizKey, quiz }) => {
        const isAnswered = quizAnswers[quizKey] !== undefined;
        const isCorrect =
            quiz.type === 'mc'
                ? quizAnswers[quizKey] === quiz.correct
                : quiz.type === 'ms'
                ? Array.isArray(quizAnswers[quizKey]) &&
                    quizAnswers[quizKey].length === quiz.correct.length &&
                    quizAnswers[quizKey].every((a) => quiz.correct.includes(a))
                : false;

        return (
            <div
                style={{
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                }}
            >
                <div style={{ marginBottom: '12px', fontWeight: '600' }}>{quiz.question}</div>
                {quiz.type === 'mc' && (
                    <div>
                        {quiz.options.map((opt) => (
                            <label key={opt.id} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name={quizKey}
                                    value={opt.id}
                                    checked={quizAnswers[quizKey] === opt.id}
                                    onChange={() => handleQuizAnswer(quizKey, opt.id)}
                                    style={{ marginRight: '8px' }}
                                    aria-label={opt.text}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                )}
                {quiz.type === 'ms' && (
                    <div>
                        {quiz.options.map((opt) => (
                            <label key={opt.id} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={(quizAnswers[quizKey] || []).includes(opt.id)}
                                    onChange={() => toggleMSAnswer(quizKey, opt.id)}
                                    style={{ marginRight: '8px' }}
                                    aria-label={opt.text}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                )}
                {isAnswered && showAnswers && (
                    <div
                        style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: isCorrect ? '#d4edda' : '#f8d7da',
                            border: `1px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`,
                            borderRadius: '4px',
                            color: isCorrect ? '#155724' : '#721c24',
                        }}
                    >
                        <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                            {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
                        </div>
                        <div>{quiz.explanation}</div>
                    </div>
                )}
            </div>
        );
    };

    const renderIntro = () => (
        <div>
            <h1>Smart Contract Vulnerabilities I: Code-Level Threats</h1>
            <div style={{ background: '#e7f3ff', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>Abstract:</strong> This chapter examines four critical categories of code-level smart contract vulnerabilities: reentrancy, access control failures, delegatecall hazards, and denial-of-service patterns. We adopt a threat-model-first approach, starting from first principles (call stacks, state consistency, privilege boundaries) and scaling to real-world defense patterns and their tradeoffs. Each section includes interactive quizzes, a hands-on lab with exploit and patch, and a guided simulation.
            </div>

            <div style={{ marginBottom: '16px' }}>
                <strong>Learning Objectives:</strong>
                <ul>
                    <li>Understand reentrancy from the call stack up: why it happens, how CEI/guards/patterns prevent it.</li>
                    <li>Identify and fix access control failures: visibility, modifiers, tx.origin traps, privilege escalation.</li>
                    <li>Recognize delegatecall storage and context hazards in proxy contracts.</li>
                    <li>Detect and mitigate denial-of-service vectors: gas griefing, state locks, reverting callees.</li>
                    <li>Design threat models for each vulnerability class and reason about attacker capabilities.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <strong>Prerequisites:</strong> Solidity fundamentals (functions, storage, modifiers); Ethereum execution model (call stack, gas, msg.sender/msg.value); basic access control (owner/role patterns).
            </div>

            <div style={{ marginBottom: '16px' }}>
                <strong>Key Terms:</strong> Reentrancy, call stack, external call, fallback/receive, checks-effects-interactions, reentrancy guard, access control, tx.origin, delegatecall, storage collision, denial-of-service, state lock, threat model.
            </div>

            <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #ffc107' }}>
                <strong>📌 Key Takeaway:</strong> Code-level vulnerabilities exploit state inconsistency, missing guards, and incorrect privilege checks. Secure by default: make functions internal, validate inputs early, update state before calling externals, and always use msg.sender for identity.
            </div>

            <h3>0.1 Threat Model Overview</h3>
            <p>
                We assume an <strong>attacker with the ability to call any external function</strong> with any arguments and any Ether value. The attacker may:
            </p>
            <ul>
                <li>Deploy a contract with arbitrary fallback/receive logic.</li>
                <li>Reenter your contract during callbacks.</li>
                <li>Call functions in unexpected orders and at unexpected times.</li>
                <li>Drain gas, cause reverts in critical callbacks, or exploit state inconsistencies.</li>
            </ul>
            <p>
                The <strong>contract developer's job</strong> is to ensure that no sequence of calls—no matter how adversarial—can (1) violate invariants, (2) steal funds, (3) escalate privilege, or (4) halt critical operations.
            </p>

            <h3>0.2 Course Structure</h3>
            <p>
                Each section follows the same scaffold:
            </p>
            <ol>
                <li><strong>First Principles:</strong> Minimal toy example, core concepts.</li>
                <li><strong>The Vulnerability:</strong> Attack scenario, why it works, code walkthrough.</li>
                <li><strong>Defense Patterns:</strong> Multiple approaches (guards, CEI, pull-vs-push, etc.), tradeoffs.</li>
                <li><strong>Quiz:</strong> Check understanding; answer reveal with explanation.</li>
                <li><strong>Lab:</strong> Exploit the vulnerable contract and patch it; tests prove the fix.</li>
            </ol>

            <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '4px', marginTop: '16px' }}>
                <strong>Next Step:</strong> Navigate to Section 1 (Reentrancy) to begin.
            </div>
        </div>
    );

    const renderReetrancy = () => (
        <div>
            <h1>1. Reentrancy: The Call Stack Trap</h1>

            <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #ffc107' }}>
                <strong>⚠️ Common Pitfall:</strong> Developers think "my contract is safe because it checks the balance before withdrawing." But if the check happens *after* an external call, the attacker can reenter during that call before the balance is updated.
            </div>

            <h2>1.1 First Principles: The Call Stack and State Consistency</h2>
            <p>
                When a contract calls an external address (via <code>transfer</code>, <code>send</code>, or <code>call</code>), control flows out to that address. If the address is a contract, its fallback or receive function runs. <strong>During this execution, your contract's state has not changed yet</strong>—unless you explicitly updated it before the call.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`// Toy Vault: withdraw funds
contract Vault {
    mapping(address => uint) balance;

    function withdraw(uint amount) external {
        // VULNERABLE: check balance AFTER external call!
        // Sequence: call(transfer) -> attacker fallback -> re-enter withdraw
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
        balance[msg.sender] -= amount;  // Updated AFTER call!
    }
}`}
            </pre>

            <p>
                <strong>The Reentrancy Loop:</strong>
            </p>
            <ol>
                <li>Alice calls <code>withdraw(1 ether)</code>. Balance is 1 ether.</li>
                <li><code>call&#123;value: 1 ether&#125;</code> sends ether to Alice's attacker contract.</li>
                <li>Alice's <span style={{fontFamily: 'monospace'}}>fallback()</span> fires. Balance is still 1 ether (not yet decremented).</li>
                <li>Fallback calls <code>withdraw(1 ether)</code> again.</li>
                <li>Same check passes (balance is still 1 ether). Another ether is sent.</li>
                <li>This loops until the vault is drained or gas runs out.</li>
            </ol>

            <div style={{ background: '#e7f3ff', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                <strong>💡 Why it works:</strong> The balance check (or absence thereof) happens *after* the external call. The attacker's code runs with the old state, sees the old balance, and can call withdraw again.
            </div>

            <h2>1.2 Defense Pattern 1: Checks-Effects-Interactions (CEI)</h2>
            <p>
                <strong>The Pattern:</strong> (1) Validate inputs and conditions (checks), (2) update contract state (effects), (3) call externals (interactions).
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract VaultFixed {
    mapping(address => uint) balance;

    function withdraw(uint amount) external {
        // 1. Checks: validate
        require(balance[msg.sender] >= amount, "insufficient balance");
        
        // 2. Effects: update state BEFORE calling out
        balance[msg.sender] -= amount;
        
        // 3. Interactions: call external (now balance is already updated)
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
    }
}`}
            </pre>

            <p>
                <strong>Why it works:</strong> If the attacker reents during the <span style={{fontFamily: 'monospace'}}>call</span>, their balance is already 0. The second call to <span style={{fontFamily: 'monospace'}}>withdraw</span> fails the check (insufficient balance), and the reentry is blocked.
            </p>

            <div style={{ background: '#d4edda', padding: '12px', borderRadius: '4px', marginBottom: '16px', borderLeft: '4px solid #28a745' }}>
                <strong>✓ Advantage:</strong> Simple, no performance cost, easy to audit. Follow CEI as your default.
            </div>

            <h2>1.3 Defense Pattern 2: Reentrancy Guard (Mutex Lock)</h2>
            <p>
                A guard ensures that a function cannot be called again while it is still executing.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract VaultWithGuard {
    mapping(address => uint) balance;
    bool locked = false;

    modifier nonReentrant() {
        require(!locked, "reentrancy detected");
        locked = true;
        _;
        locked = false;
    }

    function withdraw(uint amount) external nonReentrant {
        require(balance[msg.sender] >= amount, "insufficient");
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "failed");
        balance[msg.sender] -= amount;
    }
}`}
            </pre>

            <p>
                <strong>How it works:</strong> When <span style={{fontFamily: 'monospace'}}>withdraw</span> is entered, <span style={{fontFamily: 'monospace'}}>locked</span> is set to true. If the attacker reents, the second call sees <span style={{fontFamily: 'monospace'}}>locked = true</span> and reverts.
            </p>

            <div style={{ background: '#f8d7da', padding: '12px', borderRadius: '4px', marginBottom: '16px', borderLeft: '4px solid #dc3545' }}>
                <strong>⚠️ Tradeoff:</strong> Guards cost extra gas and add complexity. They are a *second line of defense*; CEI should be your first.
            </div>

            <h2>1.4 Defense Pattern 3: Pull vs. Push Payments</h2>
            <p>
                <strong>Push:</strong> Contract calls <code>transfer(recipient, amount)</code>. Recipient's fallback might reenter.
            </p>
            <p>
                <strong>Pull:</strong> Contract records an amount owed; recipient calls a <code>withdraw()</code> function to pull their funds.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`// Pull pattern: recipient withdraws, not contract pushes
contract VaultPull {
    mapping(address => uint) pending;

    function settle(address recipient, uint amount) external {
        // No external call; just record the debt
        pending[recipient] += amount;
    }

    function withdraw() external {
        uint amount = pending[msg.sender];
        require(amount > 0, "nothing to withdraw");
        pending[msg.sender] = 0;  // Clear before call (CEI!)
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "failed");
    }
}`}
            </pre>

            <p>
                <strong>Why it's safer:</strong> The contract doesn't directly call recipients. Reentrancy is less likely because the attacker must explicitly call <code>withdraw()</code>, and the state is already updated.
            </p>

            <h2>1.5 Mini Case Study: The DAO Hack (Simplified)</h2>
            <p>
                In 2016, the DAO (a decentralized fund) was drained of ~$60M via reentrancy. Simplified:
            </p>
            <ul>
                <li>Users could call <code>withdraw(amount)</code> to get Ether back.</li>
                <li>The contract sent Ether via <code>call</code> *before* updating the user's balance.</li>
                <li>An attacker deployed a contract with a fallback that called <code>withdraw</code> again.</li>
                <li>The attacker looped until the DAO was drained.</li>
            </ul>
            <p>
                <strong>Prevention Playbook:</strong>
            </p>
            <ol>
                <li>Always use Checks-Effects-Interactions by default.</li>
                <li>Add a reentrancy guard if you must call externals.</li>
                <li>Consider pull payments for recipient-initiated withdrawals.</li>
                <li>Test with a malicious receiver contract that reents.</li>
                <li>Use static analyzers to flag external calls before state updates.</li>
            </ol>

            <h2>1.6 Quiz: Reentrancy</h2>
            <QuizComponent quizKey="reentrancy_q1" quiz={quizzes['reentrancy_q1']} />
            <QuizComponent quizKey="reentrancy_q2" quiz={quizzes['reentrancy_q2']} />
        </div>
    );

    const renderAccess = () => (
        <div>
            <h1>2. Access Control Failures and Authentication Bypasses</h1>

            <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #ffc107' }}>
                <strong>⚠️ Common Pitfall:</strong> Developers use `tx.origin` for authentication, forgetting that a malicious contract can call your function and tx.origin still refers to the user, not the contract. Phishing via delegated calls.
            </div>

            <h2>2.1 First Principles: Identity, Privilege, and Visibility</h2>
            <p>
                <strong>Identity:</strong> Which caller is this? Use <code>msg.sender</code> (immediate caller) never <code>tx.origin</code> (original EOA).
            </p>
            <p>
                <strong>Privilege:</strong> What role does the caller have? Owner, admin, user, etc.
            </p>
            <p>
                <strong>Visibility:</strong> Which functions are external (anyone can call) vs. internal (only contract internals)?
            </p>

            <p>
                <strong>Three Common Failures:</strong>
            </p>
            <ol>
                <li><strong>Missing Modifiers:</strong> Sensitive function has no access check.</li>
                <li><strong>Incorrect Identity Check:</strong> Using <code>tx.origin</code> instead of <code>msg.sender</code>.</li>
                <li><strong>Wrong Visibility:</strong> Marking a sensitive function <code>public</code> instead of <code>internal</code>.</li>
            </ol>

            <h2>2.2 Failure Mode 1: Missing Access Control Modifier</h2>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Vault {
    address admin;
    mapping(address => uint) balance;

    constructor() {
        admin = msg.sender;
    }

    // VULNERABLE: anyone can call!
    function transferAdmin(address newAdmin) external {
        admin = newAdmin;
    }

    function withdraw(uint amount) external {
        require(balance[msg.sender] >= amount);
        balance[msg.sender] -= amount;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok);
    }
}`}
            </pre>

            <p>
                <strong>Attack:</strong> Attacker calls <span style={{fontFamily: 'monospace'}}>transferAdmin(attacker_address)</span>. Admin is now the attacker. Attacker can now drain the vault or make other changes.
            </p>

            <p>
                <strong>Fix:</strong> Add an <span style={{fontFamily: 'monospace'}}>onlyAdmin</span> modifier.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract VaultFixed {
    address admin;
    mapping(address => uint) balance;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "not admin");
        _;
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }
}`}
            </pre>

            <h2>2.3 Failure Mode 2: tx.origin Phishing</h2>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Vault {
    address owner;
    constructor() { owner = msg.sender; }

    // VULNERABLE: uses tx.origin
    function withdraw(uint amount) external {
        require(tx.origin == owner, "not owner");
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok);
    }
}

// Attacker's contract
contract Phisher {
    address vault;
    constructor(address _vault) { vault = _vault; }

    fallback() external payable {
        // Ether from vault
    }

    function trick() external {
        // Attacker calls this; it calls vault.withdraw
        // tx.origin is still the original user
        // So the check passes!
        Vault(vault).withdraw(someAmount);
    }
}`}
            </pre>

            <p>
                <strong>Exploit Scenario:</strong>
            </p>
            <ol>
                <li>Alice owns a vault. Alice calls Eve's contract via a phishing link.</li>
                <li>Eve's contract calls <span style={{fontFamily: 'monospace'}}>vault.withdraw()</span>.</li>
                <li>Inside the vault, <span style={{fontFamily: 'monospace'}}>tx.origin == Alice</span> (Alice initiated the original tx), so the check passes.</li>
                <li>Ether is sent to Eve.</li>
            </ol>

            <p>
                <strong>Fix:</strong> Always use <code>msg.sender</code>, not <code>tx.origin</code>.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract VaultFixed {
    address owner;
    constructor() { owner = msg.sender; }

    // CORRECT: use msg.sender
    function withdraw(uint amount) external {
        require(msg.sender == owner, "not owner");
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok);
    }
}`}
            </pre>

            <div style={{ background: '#d4edda', padding: '12px', borderRadius: '4px', marginBottom: '16px', borderLeft: '4px solid #28a745' }}>
                <strong>✓ Lesson:</strong> <code>msg.sender</code> is the immediate caller. If a contract calls you, it's that contract. If an EOA calls you, it's that EOA. <code>tx.origin</code> is only the original EOA. For access control, use <code>msg.sender</code>.
            </div>

            <h2>2.4 Defense Patterns: Secure-by-Default Access Control</h2>

            <p><strong>Pattern 1: Default Private/Internal</strong></p>
            <p>
                Make functions <span style={{fontFamily: 'monospace'}}>internal</span> by default. Only mark as <span style={{fontFamily: 'monospace'}}>external</span> if deliberately exposed.
            </p>

            <p><strong>Pattern 2: Role-Based Access Control (RBAC)</strong></p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract RBAC {
    mapping(bytes32 => mapping(address => bool)) roles;
    bytes32 constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 constant MINTER_ROLE = keccak256("MINTER");

    function grant(bytes32 role, address user) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "not admin");
        roles[role][user] = true;
    }

    function revoke(bytes32 role, address user) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "not admin");
        roles[role][user] = false;
    }

    function hasRole(bytes32 role, address user) public view returns (bool) {
        return roles[role][user];
    }

    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "access denied");
        _;
    }

    function mint(address to, uint amount) external onlyRole(MINTER_ROLE) {
        // Only MINTER can call
    }
}`}
            </pre>

            <p><strong>Pattern 3: Safe Delegated Calls via Signatures</strong></p>
            <p>
                For more advanced: instead of relying on <code>msg.sender</code> in a single tx, use ecrecover to verify a signature. This allows a user to delegate an action to a relayer while proving their identity.
            </p>

            <h2>2.5 Mini Case Study: Privilege Escalation via Internal/External Visibility</h2>
            <p>
                A contract has two functions:
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Treasury {
    address owner;
    mapping(address => uint) balance;

    // VULNERABLE: marked public when should be internal
    function updateBalance(address user, uint newBalance) public {
        balance[user] = newBalance;
    }

    function adminSetBalance(address user, uint newBalance) external {
        require(msg.sender == owner);
        updateBalance(user, newBalance);
    }
}`}
            </pre>

            <p>
                Because <span style={{fontFamily: 'monospace'}}>updateBalance</span> is <span style={{fontFamily: 'monospace'}}>public</span>, any attacker can call it directly and set anyone's balance to 0. The intent was for it to be internal (helper) only.
            </p>

            <p>
                <strong>Prevention Playbook:</strong>
            </p>
            <ol>
                <li>Mark functions <span style={{fontFamily: 'monospace'}}>internal</span> or <span style={{fontFamily: 'monospace'}}>private</span> by default; only expose via <span style={{fontFamily: 'monospace'}}>external</span> with intent.</li>
                <li>Always apply access control modifiers to sensitive functions.</li>
                <li>Use role-based patterns for multi-admin scenarios.</li>
                <li>Never use <span style={{fontFamily: 'monospace'}}>tx.origin</span> for access checks.</li>
                <li>Test that unpermissioned callers are blocked.</li>
            </ol>

            <h2>2.6 Quiz: Access Control</h2>
            <QuizComponent quizKey="access_q1" quiz={quizzes['access_q1']} />
            <QuizComponent quizKey="access_q2" quiz={quizzes['access_q2']} />
        </div>
    );

    const renderDelegatecall = () => (
        <div>
            <h1>3. Delegatecall and Proxy Hazards</h1>

            <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #ffc107' }}>
                <strong>⚠️ Common Pitfall:</strong> Developers upgrade a contract using delegatecall without realizing that B's code runs in A's storage context. If A and B have different storage layouts, critical state is corrupted.
            </div>

            <h2>3.1 First Principles: Storage Context and Delegatecall</h2>
            <p>
                When A calls B:
            </p>
            <ul>
                <li>
                    <strong>Regular call:</strong> B's code runs in B's storage context. B modifies B's state.
                </li>
                <li>
                    <strong>delegatecall:</strong> B's code runs in A's storage context. B modifies A's state using B's code logic.
                </li>
            </ul>

            <p>
                <strong>Use case:</strong> Upgradeable contracts. A (proxy) holds funds and admin; B (implementation) holds logic. When A delegatecalls B, B's new logic runs but modifies A's storage, allowing "upgrades" without moving funds.
            </p>

            <h2>3.2 The Hazard: Storage Layout Collision</h2>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`// Version 1 of implementation
contract VaultV1 {
    address owner;
    mapping(address => uint) balance;
}

// Version 2: developer adds a new field
contract VaultV2 {
    address owner;
    bool paused;  // NEW FIELD ADDED
    mapping(address => uint) balance;
}

// Proxy delegatecalls implementation
contract Proxy {
    address owner;
    mapping(address => uint) balance;

    function upgrade(address newImpl) external {
        require(msg.sender == owner);
        impl = newImpl;
    }

    fallback() external payable {
        // delegatecall to impl; impl's code runs in proxy's storage
        impl.delegatecall(msg.data);
    }
}`}
            </pre>

            <p>
                <strong>What goes wrong:</strong>
            </p>
            <ol>
                <li>Proxy has storage: [owner, balance].</li>
                <li>VaultV1 matches: [owner, balance].</li>
                <li>Developer upgrades to VaultV2 which expects: [owner, paused, balance].</li>
                <li>Now VaultV2's <span style={{fontFamily: 'monospace'}}>paused</span> field writes to proxy's balance storage slot!</li>
                <li>A simple <span style={{fontFamily: 'monospace'}}>paused = true</span> in V2 overwrites the balance mapping, corrupting funds.</li>
            </ol>

            <div style={{ background: '#f8d7da', padding: '12px', borderRadius: '4px', marginBottom: '16px', borderLeft: '4px solid #dc3545' }}>
                <strong>⚠️ The Risk:</strong> Storage layout must be preserved across upgrades. New fields must be appended, never inserted. Use tools like hardhat-upgrades to validate layout.
            </div>

            <h2>3.3 Hazard 2: Unexpected msg.sender Context</h2>
            <p>
                When B is delegatecalled from A, <code>msg.sender</code> in B still refers to the *original caller*, not A. This can be surprising.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Impl {
    function transferOwner(address newOwner) external {
        // Developer thinks msg.sender is the proxy, but it's the original caller!
        // If caller is attacker, they become owner.
        owner = newOwner;
    }
}

contract Proxy {
    address owner;
    address impl;

    function upgrade(address newImpl) external {
        require(msg.sender == owner, "not owner");
        impl = newImpl;
    }

    fallback() external payable {
        impl.delegatecall(msg.data);
    }
}

// Attack: attacker calls proxy, which delegatecalls impl
// impl sees msg.sender = attacker, not proxy
// So attacker can directly call proxy.transferOwner(attacker)`}
            </pre>

            <p>
                <strong>Lesson:</strong> In delegatecalled code, always assume the original caller is in control. If you need to enforce that "only the proxy can call this," you must pass that context explicitly or use self-calls.
            </p>

            <h2>3.4 Hazard 3: Function Selector Clashing</h2>
            <p>
                A proxy implements a fallback that delegatecalls to impl. But what if both proxy and impl define the same function signature (e.g., both have <code>transfer()</code>)? Solidity dispatches based on the selector, so the proxy's version is called, bypassing impl.
            </p>

            <p>
                <strong>Best Practice:</strong> Proxy should be minimal (only admin functions); implementation should not override proxy functions.
            </p>

            <h2>3.5 Defense Pattern: Transparent Proxy</h2>
            <p>
                A proxy that forbids the admin from calling functions through the proxy (to prevent selector clashes and accidental state changes).
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract TransparentProxy {
    address admin;
    address impl;

    constructor(address _impl, address _admin) {
        impl = _impl;
        admin = _admin;
    }

    fallback() external payable {
        // If caller is admin, only allow admin functions
        if (msg.sender == admin) {
            // Only upgrade and admin management allowed
            revert("admin cannot call via proxy");
        }
        impl.delegatecall(msg.data);
    }

    function upgrade(address newImpl) external {
        require(msg.sender == admin);
        impl = newImpl;
    }
}`}
            </pre>

            <h2>3.6 Mini Case Study: Proxy Admin Takeover</h2>
            <p>
                A team deploys an upgradeable contract. The admin key is shared among 3 signers (multisig). An upgradeable contract's admin is stored in storage slot 0. A bug in the implementation allows writing to storage slot 0. Attacker exploits this, changes the admin to their address, then calls upgrade() to inject malicious code.
            </p>

            <p>
                <strong>Prevention Playbook:</strong>
            </p>
            <ol>
                <li>Use a battle-tested proxy pattern (OpenZeppelin UUPS or Transparent Proxy).</li>
                <li>Validate storage layout before each upgrade (use hardhat-upgrades plugin).</li>
                <li>Store admin/critical state in fixed, non-colliding slots.</li>
                <li>Minimize proxy logic; keep implementation stateless or carefully scoped.</li>
                <li>Use a multiSig or timelock for admin functions.</li>
            </ol>

            <h2>3.7 Quiz: Delegatecall</h2>
            <QuizComponent quizKey="delegatecall_q1" quiz={quizzes['delegatecall_q1']} />
        </div>
    );

    const renderDoS = () => (
        <div>
            <h1>4. Denial-of-Service: Halting Progress</h1>

            <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #ffc107' }}>
                <strong>⚠️ Common Pitfall:</strong> A function loops through recipients and transfers funds. If one recipient's fallback reverts, the entire loop reverts and nobody gets paid—the contract is "locked."
            </div>

            <h2>4.1 First Principles: External Calls and Execution Flow</h2>
            <p>
                Every external call is a potential failure point. If a call fails (reverts or throws), the entire transaction reverts and state is rolled back. A contract that depends on external calls without error handling is vulnerable to denial-of-service.
            </p>

            <h2>4.2 Failure Mode 1: State Lock via Reverting Receiver</h2>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Distributor {
    function distribute(address[] calldata recipients, uint[] calldata amounts) external {
        for (uint i = 0; i < recipients.length; i++) {
            // VULNERABLE: if any recipient reverts, entire distribution fails
            (bool ok, ) = recipients[i].call{value: amounts[i]}("");
            require(ok, "transfer failed");  // Reverts if ANY transfer fails
        }
    }
}`}
            </pre>

            <p>
                <strong>Attack:</strong> An attacker places a contract in the recipients array with a fallback that always reverts. When distribute() is called, it hits the attacker's contract, reverts, and *nobody* gets paid. The contract is locked.
            </p>

            <p>
                <strong>Fix: Handle failures gracefully.</strong>
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract DistributorFixed {
    mapping(address => uint) pending;

    function distribute(address[] calldata recipients, uint[] calldata amounts) external {
        for (uint i = 0; i < recipients.length; i++) {
            // Don't revert on failure; record as pending instead
            (bool ok, ) = recipients[i].call{value: amounts[i]}("");
            if (!ok) {
                pending[recipients[i]] += amounts[i];
            }
        }
    }

    function withdraw() external {
        uint amount = pending[msg.sender];
        require(amount > 0);
        pending[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok);
    }
}`}
            </pre>

            <p>
                Now if a recipient reverts, their amount is recorded in pending. They can claim it later by calling withdraw(). The distribution always succeeds.
            </p>

            <h2>4.3 Failure Mode 2: Unbounded Loops and Gas Griefing</h2>
            <p>
                A loop that iterates over a growing array (e.g., list of users) can eventually consume so much gas that the transaction fails.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Token {
    address[] holders;
    mapping(address => uint) balance;

    function transfer(address to, uint amount) external {
        balance[msg.sender] -= amount;
        balance[to] += amount;
        if (balance[to] == amount) {  // First time receiving
            holders.push(to);  // Array grows unbounded
        }
    }

    // VULNERABLE: this runs in O(holders.length) and can run out of gas
    function distributeRewards() external {
        uint reward = address(this).balance / holders.length;
        for (uint i = 0; i < holders.length; i++) {
            (bool ok, ) = holders[i].call{value: reward}("");
            require(ok);
        }
    }
}`}
            </pre>

            <p>
                <strong>Attack:</strong> Attacker creates many holder accounts. Now distributeRewards() iterates over thousands of holders and runs out of gas, preventing any real distribution.
            </p>

            <p>
                <strong>Fix: Use a pull pattern or pagination.</strong>
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract TokenFixed {
    mapping(address => uint) balance;
    mapping(address => uint) claimable;

    function addRewards(address[] calldata users, uint[] calldata amounts) external {
        for (uint i = 0; i < users.length; i++) {
            claimable[users[i]] += amounts[i];
        }
    }

    // Users call this to claim (pull); no loop needed
    function claim() external {
        uint amount = claimable[msg.sender];
        require(amount > 0);
        claimable[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok);
    }
}`}
            </pre>

            <h2>4.4 Failure Mode 3: External Dependency Assumptions</h2>
            <p>
                Some contracts assume an external call will always succeed (e.g., a price oracle call). If the oracle is down or returns unexpected data, the contract halts.
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Vault {
    address oracle;

    // VULNERABLE: if oracle call reverts, entire liquidation fails
    function liquidate() external {
        uint price = Oracle(oracle).getPrice();  // Revert if oracle is down
        require(price > threshold);
        // ... liquidation logic
    }
}`}
            </pre>

            <p>
                <strong>Fix: Handle oracle failures gracefully with timeouts or fallback prices.</strong>
            </p>

            <h2>4.5 Defense Patterns</h2>

            <p>
                <strong>1. Try-Catch (for calls to well-known ABIs):</strong>
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`function safeTransfer(address recipient, uint amount) internal {
    try recipient.call{value: amount}("") returns (bool ok) {
        // Handle success or fail gracefully
    } catch {
        // Log failure; don't revert
    }
}`}
            </pre>

            <p>
                <strong>2. Pull Pattern:</strong> Users withdraw their own funds; contract doesn't push to them.
            </p>

            <p>
                <strong>3. Pagination:</strong> For loops, provide start/end indices to avoid unbounded iteration.
            </p>

            <p>
                <strong>4. Fallback Mechanisms:</strong> If an external call fails, use a cached value or a backup.
            </p>

            <h2>4.6 Mini Case Study: The Parity Multisig Wallet Freeze</h2>
            <p>
                In 2017, a bug in the Parity multisig wallet allowed an attacker to call a "suicide" function, destroying the contract and locking ~$280M in funds. While not strictly a DoS, it demonstrates how a single unchecked external call or logic error can halt all operations.
            </p>

            <p>
                <strong>Prevention Playbook:</strong>
            </p>
            <ol>
                <li>Use pull patterns for fund transfers when possible.</li>
                <li>Handle external call failures gracefully (try-catch, checks for return values).</li>
                <li>Avoid unbounded loops; use pagination or pull-based withdrawal.</li>
                <li>Don't assume external calls will always succeed; have fallback logic.</li>
                <li>Test with reverting receivers and missing/slow oracles.</li>
            </ol>

            <h2>4.7 Quiz: Denial-of-Service</h2>
            <QuizComponent quizKey="dos_q1" quiz={quizzes['dos_q1']} />
        </div>
    );

    const renderLab = () => (
        <div>
            <h1>Lab: Exploit, Patch, and Test</h1>

            <h2>Lab Objective</h2>
            <p>
                In this lab, you will:
            </p>
            <ol>
                <li>Analyze a vulnerable contract (a simple Vault with reentrancy).</li>
                <li>Write an exploit contract that demonstrates the vulnerability.</li>
                <li>Understand why the attack works (threat model, call sequence).</li>
                <li>Patch the vulnerable contract using Checks-Effects-Interactions.</li>
                <li>Write tests (Hardhat/Foundry style) that verify the exploit fails and the patch succeeds.</li>
            </ol>

            <h2>Lab Setup</h2>
            <p>You'll need:</p>
            <ul>
                <li>Solidity compiler (0.8+)</li>
                <li>Hardhat or Foundry</li>
                <li>Basic testing knowledge</li>
            </ul>

            <h2>Step 1: The Vulnerable Contract</h2>
            <p>
                Deploy and study this contract:
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VaultVulnerable {
    mapping(address => uint) public balance;

    function deposit() external payable {
        balance[msg.sender] += msg.value;
    }

    // VULNERABLE: external call before state update
    function withdraw(uint amount) external {
        require(balance[msg.sender] >= amount, "insufficient balance");
        // Call external before updating state!
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
        balance[msg.sender] -= amount;  // State update AFTER call
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}`}
            </pre>

            <h2>Step 2: The Exploit Contract</h2>
            <p>
                Write a contract that exploits reentrancy:
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract Attacker {
    VaultVulnerable public vault;
    uint public amountToSteal;

    constructor(address _vault) {
        vault = VaultVulnerable(_vault);
    }

    function attack(uint amount) external {
        amountToSteal = amount;
        vault.deposit{value: amount}();  // Deposit so we have a balance
        vault.withdraw(amount);  // Trigger the reentrancy
    }

    // Fallback receives ether and reents
    receive() external payable {
        if (address(vault).balance >= amountToSteal) {
            vault.withdraw(amountToSteal);
        }
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}`}
            </pre>

            <h2>Step 3: Write the Exploit Test</h2>
            <p>
                Using Hardhat:
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`const { expect } = require("chai");

describe("Reentrancy Exploit", () => {
    let vault, attacker;

    beforeEach(async () => {
        const VaultVulnerable = await ethers.getContractFactory("VaultVulnerable");
        vault = await VaultVulnerable.deploy();
        
        const Attacker = await ethers.getContractFactory("Attacker");
        attacker = await Attacker.deploy(vault.address);
    });

    it("should demonstrate reentrancy vulnerability", async () => {
        // Deposit 10 ether into vault
        const [owner] = await ethers.getSigners();
        await owner.sendTransaction({
            to: vault.address,
            value: ethers.utils.parseEther("10"),
        });

        // Attacker exploits
        const attackAmount = ethers.utils.parseEther("1");
        await attacker.attack(attackAmount);

        // Vault is drained (or nearly so)
        const vaultBalance = await vault.getBalance();
        expect(vaultBalance).to.be.lt(ethers.utils.parseEther("1"));
        expect(await attacker.getBalance()).to.be.gt(attackAmount);
    });
});`}
            </pre>

            <h2>Step 4: Patch the Contract</h2>
            <p>
                Use Checks-Effects-Interactions:
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`contract VaultPatched {
    mapping(address => uint) public balance;

    function deposit() external payable {
        balance[msg.sender] += msg.value;
    }

    // PATCHED: Checks-Effects-Interactions
    function withdraw(uint amount) external {
        // 1. Checks
        require(balance[msg.sender] >= amount, "insufficient balance");
        
        // 2. Effects: update state BEFORE call
        balance[msg.sender] -= amount;
        
        // 3. Interactions: call external
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}`}
            </pre>

            <h2>Step 5: Test the Patch</h2>
            <p>
                The same attack should now fail:
            </p>

            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '12px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    marginBottom: '16px',
                }}
            >
                {`describe("Reentrancy Patched", () => {
    let vault, attacker;

    beforeEach(async () => {
        const VaultPatched = await ethers.getContractFactory("VaultPatched");
        vault = await VaultPatched.deploy();
        
        const Attacker = await ethers.getContractFactory("Attacker");
        attacker = await Attacker.deploy(vault.address);
    });

    it("should prevent reentrancy with CEI", async () => {
        const [owner] = await ethers.getSigners();
        await owner.sendTransaction({
            to: vault.address,
            value: ethers.utils.parseEther("10"),
        });

        const attackAmount = ethers.utils.parseEther("1");
        await attacker.attack(attackAmount);

        // Attacker only steals 1 ether (one withdrawal), not the whole vault
        const vaultBalance = await vault.getBalance();
        expect(vaultBalance).to.be.closeTo(
            ethers.utils.parseEther("9"),
            ethers.utils.parseEther("0.01")
        );
        expect(await attacker.getBalance()).to.be.closeTo(
            attackAmount,
            ethers.utils.parseEther("0.01")
        );
    });
});`}
            </pre>

            <h2>Challenge Extensions</h2>

            <p>
                <strong>1. Cross-Function Reentrancy:</strong> Write a vault with both withdraw() and transfer() functions. Show how an attacker can reenter via transfer() while withdraw() is executing.
            </p>

            <p>
                <strong>2. Guard Pattern:</strong> Implement a nonReentrant modifier and patch the vulnerable contract using it instead of CEI. Compare gas costs.
            </p>

            <p>
                <strong>3. Reverting Receiver DoS:</strong> Write a test where a recipient's fallback always reverts, and show how it locks the distributor. Then patch using a pull pattern.
            </p>

            <p>
                <strong>4. Fuzz Testing:</strong> Use Foundry's fuzz testing to generate random withdrawal amounts and verify the CEI-patched version is safe.
            </p>

            <p>
                <strong>5. Access Control Exploit:</strong> Write a vault with an admin function to drain balance. Forget the onlyOwner modifier. Write an exploit contract that calls it, then patch.
            </p>

            <div style={{ background: '#d4edda', padding: '12px', borderRadius: '4px', marginTop: '16px', borderLeft: '4px solid #28a745' }}>
                <strong>✓ Lab Deliverable:</strong> Submit a test file that demonstrates the exploit, the patch, and verification that the patch works.
            </div>
        </div>
    );

    const renderSimulation = () => {
        const simulationSteps = [
            {
                title: "You are a smart contract auditor.",
                description: "A team asks you to audit their vault. They show you this code:",
                code: `function withdraw(uint amount) external {
    require(balance[msg.sender] >= amount);
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok);
    balance[msg.sender] -= amount;
}`,
                choices: [
                    { text: "Approve it; the require statements look good.", id: "a" },
                    {
                        text: "Flag it as vulnerable: external call before state update (reentrancy).",
                        id: "b",
                    },
                    {
                        text: "Suggest adding tx.origin check for extra safety.",
                        id: "c",
                    },
                ],
                consequence: {
                    b: "✓ Correct! This is a classic reentrancy bug (Checks-Effects-Interactions violation). The balance update happens AFTER the external call, allowing reentrancy.",
                    a: "✗ The require statements are there, but the STATE UPDATE happens after the external call. An attacker can reenter during the call and pass the require again.",
                    c: '✗ tx.origin is dangerous and unrelated to this vulnerability. You\'d still have reentrancy.',
                },
            },
            {
                title: "Mitigation Strategy",
                description:
                    "The team asks how to fix it. You suggest three approaches. Rank them by security/gas efficiency:",
                choices: [
                    { text: "1. Checks-Effects-Interactions (CEI)", id: "a" },
                    { text: "2. Nonreentrant guard (mutex lock)", id: "b" },
                    { text: "3. Pull pattern (user withdraws, not contract pushes)", id: "c" },
                ],
                consequence: {
                    a: "✓ Best first-line defense for this case: update balance before the call. No extra gas or complexity.",
                    b: "This also works but costs more gas and is overkill if CEI is used.",
                    c: "This works but changes the API (users must call withdraw()); suitable for some patterns but not a drop-in fix.",
                },
            },
            {
                title: "A New Vulnerability",
                description:
                    "The team has a second function: transferAdmin(address newAdmin) which is public (not onlyAdmin). An attacker calls it. What is the damage?",
                choices: [
                    { text: "Attacker becomes the new admin and can drain the vault.", id: "a" },
                    { text: "Transaction reverts because of insufficient permissions.", id: "b" },
                    {
                        text:
                            "The function is harmless; only an internal helper.",
                        id: "c",
                    },
                ],
                consequence: {
                    a: "✓ Correct! Missing access control (onlyAdmin modifier) on a sensitive function. The attack is privilege escalation.",
                    b: "✗ There's no permission check in the function, so it doesn't revert.",
                    c: "✗ A public function with no access control is not harmless; it's exposed to anyone.",
                },
            },
            {
                title: "Fixing Access Control",
                description:
                    "How should you fix transferAdmin? Choose the BEST approach:",
                choices: [
                    {
                        text: 'require(tx.origin == admin, "not admin");',
                        id: "a",
                    },
                    {
                        text: 'require(msg.sender == admin, "not admin");',
                        id: "b",
                    },
                    {
                        text: "Change visibility to internal; only certain functions can call it.",
                        id: "c",
                    },
                ],
                consequence: {
                    b: "✓ Correct! Always use msg.sender (immediate caller), not tx.origin. tx.origin is the original EOA, which can be exploited via delegated calls.",
                    a: '✗ tx.origin is dangerous. A phishing attack (attacker tricks user into calling attacker\'s contract, which calls your function) would bypass this check.',
                    c: "This helps as a secondary measure (default private), but you still need a check to ensure the internals caller is authorized.",
                },
            },
            {
                title: "Delegatecall Hazard",
                description:
                    "The team uses an upgradeable proxy pattern. The old implementation has storage [owner, balance]. The new version adds [owner, bool active, balance] (inserted before balance). What happens?",
                choices: [
                    {
                        text: "No problem; the proxy adjusts storage slots automatically.",
                        id: "a",
                    },
                    {
                        text: "The new 'active' field overwrites the 'balance' field, corrupting funds.",
                        id: "b",
                    },
                    {
                        text:
                            "The upgrade is rejected because contracts detect mismatched layouts.",
                        id: "c",
                    },
                ],
                consequence: {
                    b: "✓ Correct! Storage layout is determined by declaration order. The new 'active' now occupies the 'balance' slot. Data is corrupted.",
                    a: "✗ Storage slots are fixed by declaration order; new fields must be appended, not inserted.",
                    c: "✗ Solidity doesn't automatically detect layout mismatches. You must use tools (hardhat-upgrades, slither) or manual review.",
                },
            },
            {
                title: "Final: Denial-of-Service",
                description:
                    "A contract loops over 100 recipients and sends ether. If one recipient's fallback reverts, the entire tx reverts and nobody gets paid. How do you fix this?",
                choices: [
                    {
                        text: "Use try-catch to skip reverts and continue the loop.",
                        id: "a",
                    },
                    { text: "Record failed transfers as pending; let users claim later.", id: "b" },
                    {
                        text: "Use a pull pattern (users call withdraw(), not contract pushes).",
                        id: "c",
                    },
                ],
                consequence: {
                    a: "✓ This works. Try-catch silently handles reverts and the loop continues.",
                    b: "✓ Also correct! Record the amount owed; recipient can claim by calling withdraw().",
                    c: "✓ Also works! Shifts responsibility to users; no need to loop.",
                },
            },
        ];

        return (
            <div>
                <h1>Guided Simulation: Audit Decision Tree</h1>
                <p>
                    Work through a series of audit scenarios. For each, choose the best answer and see the consequence revealed.
                </p>

                {simulationSteps.length > 0 && simulationStep < simulationSteps.length && (
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '16px' }}>
                        <h3>{simulationSteps[simulationStep].title}</h3>
                        <p>{simulationSteps[simulationStep].description}</p>
                        {simulationSteps[simulationStep].code && (
                            <pre
                                style={{
                                    background: '#fff',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    overflowX: 'auto',
                                    marginBottom: '16px',
                                    border: '1px solid #ddd',
                                }}
                            >
                                {simulationSteps[simulationStep].code}
                            </pre>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            {simulationSteps[simulationStep].choices.map((choice, idx) => (
                                <button
                                    key={idx}
                                    onClick={() =>
                                        setSimulationChoices([
                                            ...simulationChoices,
                                            { step: simulationStep, answer: choice.id },
                                        ])
                                    }
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '8px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                    aria-label={`Choose: ${choice.text}`}
                                >
                                    {choice.text}
                                </button>
                            ))}
                        </div>

                        {simulationChoices.some((c) => c.step === simulationStep) && (
                            <div
                                style={{
                                    background: '#d4edda',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    marginBottom: '16px',
                                }}
                            >
                                <div>
                                    {
                                        simulationSteps[simulationStep].consequence[
                                            simulationChoices.find((c) => c.step === simulationStep).answer
                                        ]
                                    }
                                </div>
                                <button
                                    onClick={() => setSimulationStep(simulationStep + 1)}
                                    style={{
                                        marginTop: '12px',
                                        padding: '8px 16px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    aria-label="Go to next scenario"
                                >
                                    Next Scenario →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {simulationStep >= simulationSteps.length && (
                    <div style={{ background: '#d4edda', padding: '20px', borderRadius: '8px' }}>
                        <h3>✓ Simulation Complete!</h3>
                        <p>You have reviewed all major vulnerability categories. You are now ready to audit contracts independently.</p>
                        <button
                            onClick={() => {
                                setSimulationStep(0);
                                setSimulationChoices([]);
                            }}
                            style={{
                                padding: '8px 16px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            aria-label="Restart simulation"
                        >
                            Restart
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderAssessment = () => {
        const assessmentScore = useMemo(() => {
            let correct = 0;
            assessmentQuestions.forEach((q) => {
                if (assessmentAnswers[q.id]) {
                    correct++;
                }
            });
            return { correct, total: assessmentQuestions.length };
        }, [assessmentAnswers]);

        return (
            <div>
                <h1>Final Assessment</h1>
                <p>
                    Answer all questions. Short-answer responses are evaluated by comparing your submission with the key points provided.
                </p>

                {assessmentQuestions.map((q, idx) => (
                    <div
                        key={q.id}
                        style={{
                            background: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '16px',
                        }}
                    >
                        <div style={{ fontWeight: '600', marginBottom: '12px' }}>
                            Q{idx + 1}. {q.question}
                        </div>
                        <textarea
                            placeholder="Your answer..."
                            value={assessmentAnswers[q.id] || ''}
                            onChange={(e) => handleAssessmentAnswer(q.id, e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '8px',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                            aria-label={`Answer for ${q.question}`}
                        />
                        {showFinalFeedback && (
                            <div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
                                <strong>Key Points to Cover:</strong>
                                <ul style={{ marginTop: '8px' }}>
                                    {q.keyPoints.map((kp, i) => (
                                        <li key={i}>{kp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    onClick={() => setShowFinalFeedback(!showFinalFeedback)}
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '16px',
                    }}
                    aria-label={showFinalFeedback ? 'Hide feedback' : 'Show feedback'}
                >
                    {showFinalFeedback ? 'Hide Feedback' : 'Show Feedback & Key Points'}
                </button>

                <div
                    style={{
                        background: '#e7f3ff',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                    }}
                >
                    <strong>Score: {assessmentScore.correct} / {assessmentScore.total}</strong>
                    {assessmentScore.correct === assessmentScore.total && (
                        <p style={{ marginTop: '8px', color: '#28a745' }}>
                            ✓ Excellent! You have mastered this module.
                        </p>
                    )}
                    {assessmentScore.correct >= assessmentScore.total * 0.8 && assessmentScore.correct < assessmentScore.total && (
                        <p style={{ marginTop: '8px', color: '#ffc107' }}>
                            ≈ Good! Review sections 2 (Access Control) and 4 (DoS) for deeper understanding.
                        </p>
                    )}
                    {assessmentScore.correct < assessmentScore.total * 0.8 && (
                        <p style={{ marginTop: '8px', color: '#dc3545' }}>
                            → Review all sections and redo the quizzes to strengthen understanding.
                        </p>
                    )}
                </div>

                <h2>Summary & Further Reading</h2>
                <p>
                    In this module, we examined four critical code-level vulnerabilities and their defenses:
                </p>
                <ul>
                    <li>
                        <strong>Reentrancy:</strong> Update state before calling externals (CEI) or use a guard.
                    </li>
                    <li>
                        <strong>Access Control:</strong> Use msg.sender (not tx.origin), apply modifiers consistently, and make functions internal by default.
                    </li>
                    <li>
                        <strong>Delegatecall:</strong> Validate storage layout and context; use battle-tested proxy patterns.
                    </li>
                    <li>
                        <strong>Denial of Service:</strong> Handle failures gracefully, use pull patterns, and avoid unbounded loops.
                    </li>
                </ul>

                <p style={{ marginTop: '16px' }}>
                    <strong>Further Reading & References:</strong>
                </p>
                <ul>
                    <li>
                        Solidity Documentation: <code>delegatecall</code>, fallback functions, error handling.
                    </li>
                    <li>OpenZeppelin Contracts: reference implementations of guards, access control, proxy patterns.</li>
                    <li>
                        "The DAO Hack" (2016): seminal reentrancy exploit; see Ethereum Foundation postmortems.
                    </li>
                    <li>SLITHER static analyzer: automates detection of common vulnerabilities.</li>
                    <li>Echidna fuzzing tool: automated property-based testing for invariants.</li>
                    <li>Hardhat and Foundry: best-in-class testing frameworks for Solidity.</li>
                </ul>
            </div>
        );
    };

    const renderSection = () => {
        switch (currentSection) {
            case 'intro':
                return renderIntro();
            case 'reentrancy':
                return renderReetrancy();
            case 'access':
                return renderAccess();
            case 'delegatecall':
                return renderDelegatecall();
            case 'dos':
                return renderDoS();
            case 'lab':
                return renderLab();
            case 'simulation':
                return renderSimulation();
            case 'assessment':
                return renderAssessment();
            default:
                return renderIntro();
        }
    };

    const progressPercentage = (sections.findIndex((s) => s.id === currentSection) / sections.length) * 100;

    return (
        <>
        <style>{_S+_D}</style>
        <div style={{display:'flex',height:'100vh',background:_C.bg0,color:_C.text,overflow:'hidden'}}>
            {/* Left Sidebar Navigation */}
            <div style={{width:218,background:_C.bg1,borderRight:`1px solid ${_C.border}`,display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
                <div style={{padding:'18px 16px 14px',borderBottom:`1px solid ${_C.border}`}}>
                    <div style={{fontFamily:_C.mono,fontSize:8,color:_C.textMuted,letterSpacing:'0.24em',textTransform:'uppercase',marginBottom:8}}>ACM Educational Series</div>
                    <div style={{fontFamily:_C.disp,fontSize:13,fontWeight:700,color:_C.textBright,lineHeight:1.25,letterSpacing:'0.05em'}}>Smart Contract Security</div>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10}}>
                        <div style={{width:5,height:5,borderRadius:'50%',background:_C.cyan,animation:'blink 1.8s ease infinite'}}/>
                        <span style={{fontFamily:_C.mono,fontSize:9,color:_C.textMuted}}>Chapter 9  Live</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '8px' }}>Progress</div>
                    <div
                        style={{
                            width: '100%',
                            height: '8px',
                            background: '#34495e',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${progressPercentage}%`,
                                background: '#3498db',
                                transition: 'width 0.3s',
                            }}
                        />
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#bdc3c7' }}>
                        {`${Math.round(progressPercentage)}%`}
                    </div>
                </div>

                {/* Section Links */}
                <nav style={{flex:1,overflowY:'auto',padding:'6px 0'}}>
                {sections.map((section, idx) => (
                    <button key={section.id} onClick={() => setCurrentSection(section.id)}
                        style={{
                            width:'100%',padding:'9px 14px',
                            background:currentSection===section.id?_C.cyanFaint:'none',
                            border:'none',borderLeft:`3px solid ${currentSection===section.id?_C.cyan:'transparent'}`,
                            cursor:'pointer',textAlign:'left',display:'flex',gap:10,alignItems:'center',transition:'all 0.15s'
                        }}
                    >
                        <span style={{fontFamily:_C.mono,fontSize:9,color:currentSection===section.id?_C.cyan:_C.textMuted,minWidth:22}}>{idx+1}</span>
                        <span style={{fontFamily:_C.body,fontSize:12,color:currentSection===section.id?_C.textBright:_C.textMuted,lineHeight:1.3}}>{section.label}</span>
                    </button>
                ))}
                </nav>

                {/* Control Buttons */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #34495e', paddingTop: '20px' }}>
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '8px',
                            fontSize: '12px',
                        }}
                        aria-label={showAnswers ? 'Hide all answers' : 'Show all answers'}
                    >
                        {showAnswers ? '⊘ Hide Answers' : '✓ Show Answers'}
                    </button>
                    <button
                        onClick={() => {
                            setQuizAnswers({});
                            setShowAnswers(false);
                            setAssessmentAnswers({});
                            setShowFinalFeedback(false);
                            setSimulationStep(0);
                            setSimulationChoices([]);
                            setCurrentSection('intro');
                        }}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: '#95a5a6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                        aria-label="Reset all progress"
                    >
                        ↺ Reset Activity
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{flex:1,overflowY:'auto',padding:'38px 46px',maxWidth:860,margin:'0 auto',width:'100%'}}>
                <div className="m4">
                {renderSection()}
                </div>
            </div>
        </div>
    </>
    );
};

export default ModuleContent;