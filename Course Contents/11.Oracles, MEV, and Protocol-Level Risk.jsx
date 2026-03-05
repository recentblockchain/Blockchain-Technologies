import React, { useState, useCallback, useMemo } from 'react';
import Footer from "../src/Footer";

const OraclesMEVModule = () => {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const [currentSection, setCurrentSection] = useState('intro');
    const [completedSections, setCompletedSections] = useState(new Set());
    const [quizAnswers, setQuizAnswers] = useState({});
    const [revealAnswers, setRevealAnswers] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [showInstructor, setShowInstructor] = useState(false);
    const [tabletopParams, setTabletopParams] = useState({
        oracleType: 'spot',
        updateFreq: '1min',
        aggregation: 'single',
        mevMitigation: 'none',
        liquidationThreshold: '150',
    });

    const sections = [
        'intro',
        'oracle-fundamentals',
        'oracle-design',
        'oracle-attacks',
        'mev-fundamentals',
        'mev-extraction',
        'mev-mitigations',
        'flash-loans',
        'economic-bugs',
        'lab',
        'tabletop',
        'final-assessment',
    ];

    const markSectionComplete = useCallback((sectionId) => {
        setCompletedSections((prev) => new Set([...prev, sectionId]));
    }, []);

    const progressPercent = useMemo(
        () => Math.round((completedSections.size / sections.length) * 100),
        [completedSections.size, sections.length]
    );

    // ============================================================================
    // QUIZ LOGIC
    // ============================================================================
    const handleQuizAnswer = (quizId, answer) => {
        setQuizAnswers((prev) => ({
            ...prev,
            [quizId]: answer,
        }));
    };

    const quizzes = {
        'q-oracle-01': {
            question: 'What is the primary difference between push and pull oracle architectures?',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'Push: oracle updates data on-chain continuously; Pull: protocol queries oracle when needed',
                    correct: true,
                },
                {
                    id: 'b',
                    text: 'Push oracles are always more secure',
                    correct: false,
                    why: "Security depends on the oracle's design, not the push/pull distinction. Both have tradeoffs.",
                },
                {
                    id: 'c',
                    text: 'Pull oracles cannot be manipulated',
                    correct: false,
                    why: 'Pull oracles can be manipulated through the underlying data source (e.g., AMM spot prices).',
                },
            ],
            explanation:
                'Push oracles proactively update state; pull oracles are queried on demand. Push offers freshness guarantees at the cost of gas and latency. Pull offers lower costs but shifts staleness risk to the caller.',
        },
        'q-oracle-02': {
            question:
                'A TWAP (Time-Weighted Average Price) oracle is more robust than spot price because (select all that apply):',
            type: 'ms',
            options: [
                {
                    id: 'a',
                    text: 'It smooths short-term volatility and manipulation attempts',
                    correct: true,
                },
                {
                    id: 'b',
                    text: 'It requires an attacker to keep the price impact sustained across the window',
                    correct: true,
                },
                {
                    id: 'c',
                    text: 'It is immune to large trades',
                    correct: false,
                    why: 'Large trades still impact TWAP if sustained; the cost is higher but not impossible.',
                },
                {
                    id: 'd',
                    text: 'It trades off latency: the price is always lagged by the window length',
                    correct: true,
                },
            ],
            explanation:
                'TWAPs shift the attack cost from a single large transaction to sustained price impact over the window. This raises the bar but does not eliminate the risk; a multi-block attack or flash loan combo can still manipulate.',
        },
        'q-oracle-03': {
            question:
                'In a medianizer (multi-source aggregator), using median instead of mean is preferred because:',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'Median is resistant to outliers: an attacker must manipulate >50% of sources to move the final price',
                    correct: true,
                },
                {
                    id: 'b',
                    text: 'Median is always cheaper to compute',
                    correct: false,
                    why: 'Median sorting is O(n log n); mean is O(n). Cost depends on implementation and number of sources.',
                },
                {
                    id: 'c',
                    text: 'Median cannot be gamed at all',
                    correct: false,
                    why: 'If >50% of sources are compromised or incentivized badly, median can be moved. Decentralization is the real defense.',
                },
            ],
            explanation:
                'Median has a built-in Byzantine fault tolerance: up to 49% of sources can be corrupt or manipulated without moving the final price. Mean offers no such guarantee and is sensitive to even one outlier.',
        },
        'q-mev-01': {
            question: 'Which of the following is NOT a primary MEV extraction method?',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'Front-running: placing a transaction before the target in the block',
                    correct: false,
                    why: 'Front-running is a primary MEV extraction method.',
                },
                {
                    id: 'b',
                    text: 'Back-running: placing a transaction after the target in the block',
                    correct: false,
                    why: 'Back-running is a primary MEV extraction method.',
                },
                {
                    id: 'c',
                    text: 'Selecting a random validator to produce the block',
                    correct: true,
                },
                {
                    id: 'd',
                    text: 'Sandwiching: placing transactions both before and after a target swap',
                    correct: false,
                    why: 'Sandwiching is a common MEV extraction method combining front and back-running.',
                },
            ],
            explanation:
                'MEV extraction requires knowledge and control of transaction ordering. Validator selection is random by protocol design; MEV extractors influence ordering through the mempool and relay, not by choosing validators.',
        },
        'q-mev-02': {
            question:
                'Why is MEV a protocol-level security concern, not just a market efficiency issue?',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'MEV changes the incentive model: users face adversarial ordering, and protocols must defend against price manipulation and liquidation cascades',
                    correct: true,
                },
                {
                    id: 'b',
                    text: 'MEV always reduces total system revenue',
                    correct: false,
                    why: 'MEV is wealth redistribution, not always a net loss; but it breaks fairness and trust assumptions.',
                },
                {
                    id: 'c',
                    text: 'MEV is only a concern for DeFi protocols',
                    correct: false,
                    why: 'MEV affects any protocol with valuable transaction ordering (e.g., governance, L2 sequencers).',
                },
            ],
            explanation:
                'MEV transforms how we model security. A protocol must now assume that an attacker with visibility into pending transactions can read, reorder, and suppress them. This breaks traditional fairness and can trigger cascading failures in leveraged systems.',
        },
        'q-mev-03': {
            question: 'Flashbots Protect (private order flow) changes the threat model by:',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'Eliminating MEV entirely',
                    correct: false,
                    why: 'Protect hides your tx from public mempool but MEV can still be extracted in the block.',
                },
                {
                    id: 'b',
                    text: 'Shifting MEV extraction from public mempool watchers to the trusted relay, which may have its own incentives',
                    correct: true,
                },
                {
                    id: 'c',
                    text: 'Making sandwich attacks impossible',
                    correct: false,
                    why: 'The relay/builder can still front-run or back-run your tx; you are trusting a different party.',
                },
            ],
            explanation:
                'Private order flow trades off MEV reduction (fewer mempool watchers) for centralization risk (one relay knows all the secrets). This is a risk shift, not a solution; the guardrail is transparency and relay competition.',
        },
        'q-flash-01': {
            question:
                'A flash loan is different from a regular loan because it must be repaid in the same transaction. Why does this matter for security?',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'Flash loans allow an attacker to amplify price impact and manipulate oracles across multiple protocols in a single atomic step, matching cost with benefit',
                    correct: true,
                },
                {
                    id: 'b',
                    text: 'Flash loans are always safer because no real capital is at risk',
                    correct: false,
                    why: 'Flash loans are very dangerous precisely because the capital can be used to trigger cascades with no collateral.',
                },
                {
                    id: 'c',
                    text: 'Flash loans make protocols immune to manipulation',
                    correct: false,
                    why: 'Flash loans enable new attack vectors, especially when combined with oracle reliance.',
                },
            ],
            explanation:
                'Flash loans create a novel attack surface: an attacker can borrow huge sums, use them to push prices, manipulate oracles, trigger liquidations, or arbitrage, and repay within the same block. This is only profitable if the attack extracts more value than the loan fee.',
        },
        'q-econ-01': {
            question:
                'An "economic bug" is a vulnerability that passes unit tests but fails under adversarial incentive pressure. Which scenario is an economic bug?',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'A liquidation function that does not revert on collateral shortage; an attacker liquidates, collateral is transferred, and the protocol becomes insolvent',
                    correct: true,
                },
                {
                    id: 'b',
                    text: 'A memory leak in the smart contract code',
                    correct: false,
                    why: 'Memory leaks are code bugs, not economic bugs.',
                },
                {
                    id: 'c',
                    text: 'A user sending funds to the wrong address',
                    correct: false,
                    why: 'User error is not a protocol vulnerability.',
                },
            ],
            explanation:
                "Economic bugs arise when the protocol's incentive model breaks down. Liquidations may pass tests in benign market conditions but fail when an attacker with capital can push prices and trigger insolvency. The bug is the assumption that liquidators and prices are honest.",
        },
        'q-econ-02': {
            question: 'To defend against liquidation cascades, a protocol should (select all that apply):',
            type: 'ms',
            options: [
                {
                    id: 'a',
                    text: 'Use circuit breakers: pause liquidations if prices move >X% in a short window',
                    correct: true,
                },
                {
                    id: 'b',
                    text: 'Enforce strict collateralization ratios with a large buffer above liquidation threshold',
                    correct: true,
                },
                {
                    id: 'c',
                    text: 'Use decentralized oracle medianizers to smooth spot price manipulation',
                    correct: true,
                },
                {
                    id: 'd',
                    text: 'Unlimited leverage is safe as long as liquidations are automated',
                    correct: false,
                    why: 'Unlimited leverage is fundamentally unstable; liquidations can be MEV-gamed or cascade.',
                },
            ],
            explanation:
                'Defense is multi-layered: oracles resist manipulation, collateralization buffers buy time, and circuit breakers halt cascades. No single mechanism suffices; all together raise the cost of an attack to the point of unprofitability.',
        },
        'q-final-01': {
            question:
                'You are designing a collateralized lending protocol. Which oracle + MEV protection combo minimizes risk while keeping costs reasonable?',
            type: 'mc',
            options: [
                {
                    id: 'a',
                    text: 'Spot price oracle + no MEV protection: cheapest, sufficient if users understand slippage risk',
                    correct: false,
                    why: 'Spot oracles are trivially manipulable by flash loans or large trades; this is too risky for collateral pricing.',
                },
                {
                    id: 'b',
                    text: 'TWAP oracle from major DEX + slippage limits on user actions + circuit breakers on liquidations',
                    correct: true,
                },
                {
                    id: 'c',
                    text: 'Centralized price feed: always accurate, no MEV concern',
                    correct: false,
                    why: 'Centralized sources are single-point-of-failure; if the source is compromised, all users are at risk.',
                },
                {
                    id: 'd',
                    text: 'Decentralized medianizer of 3 sources + no other protection: sufficient due to median robustness',
                    correct: false,
                    why: 'Even median aggregators can be manipulated if >50% of sources are compromised or if the window is short.',
                },
            ],
            explanation:
                'The best approach layers defense: use TWAP to raise the attack cost, add slippage limits so users control their worst-case outcome, and back-stop with circuit breakers that catch cascades. This is pragmatic: oracles are not bulletproof, but multi-layer mitigations make attacks expensive.',
        },
    };

    const evaluateQuiz = (quizId) => {
        const quiz = quizzes[quizId];
        if (!quiz) return null;
        const answer = quizAnswers[quizId];
        if (!answer) return null;

        if (quiz.type === 'mc') {
            const selected = quiz.options.find((opt) => opt.id === answer);
            return selected ? selected.correct : false;
        } else if (quiz.type === 'ms') {
            const isArray = Array.isArray(answer);
            if (!isArray) return false;
            const selected = new Set(answer);
            const correct = new Set(
                quiz.options.filter((opt) => opt.correct).map((opt) => opt.id)
            );
            return selected.size === correct.size && [...selected].every((id) => correct.has(id));
        }
        return false;
    };

    const calculateFinalScore = () => {
        const quizIds = Object.keys(quizzes);
        let correct = 0;
        quizIds.forEach((id) => {
            if (evaluateQuiz(id)) correct += 1;
        });
        return { correct, total: quizIds.length };
    };

    // ============================================================================
    // COMPONENTS
    // ============================================================================

    const NavBar = () => (
        <div style={styles.navBar}>
            <h2 style={styles.navTitle}>Oracles, MEV, & Protocol Risk</h2>
            <div style={styles.progressBar}>
                <div
                    style={{
                        ...styles.progressFill,
                        width: `${progressPercent}%`,
                    }}
                />
            </div>
            <p style={styles.progressText}>{progressPercent}% Complete</p>
            <div style={styles.navMenu}>
                {sections.map((sec) => (
                    <button
                        key={sec}
                        onClick={() => setCurrentSection(sec)}
                        style={{
                            ...styles.navButton,
                            ...(currentSection === sec ? styles.navButtonActive : {}),
                            ...(completedSections.has(sec) ? styles.navButtonComplete : {}),
                        }}
                        aria-label={`Jump to ${sec}`}
                    >
                        {sec.charAt(0).toUpperCase() +
                            sec.slice(1).replace('-', ' ').substring(0, 20)}
                        {completedSections.has(sec) && ' ✓'}
                    </button>
                ))}
            </div>
            <div style={styles.controls}>
                <button
                    onClick={() => setShowInstructor(!showInstructor)}
                    style={styles.button}
                    aria-label="Toggle instructor answers"
                >
                    {showInstructor ? 'Hide' : 'Show'} Answers
                </button>
                <button
                    onClick={() => {
                        setQuizAnswers({});
                        setCompletedSections(new Set());
                        setCurrentSection('intro');
                        setFinalScore(null);
                    }}
                    style={styles.button}
                    aria-label="Reset module"
                >
                    Reset Activity
                </button>
            </div>
        </div>
    );

    const QuizComponent = ({ quizId }) => {
        const quiz = quizzes[quizId];
        if (!quiz) return null;

        const answer = quizAnswers[quizId];
        const isCorrect = answer ? evaluateQuiz(quizId) : null;

        return (
            <div style={styles.quiz}>
                <p style={styles.quizQuestion}>
                    <strong>Question:</strong> {quiz.question}
                </p>
                <div style={styles.quizOptions}>
                    {quiz.type === 'mc' && (
                        <>
                            {quiz.options.map((opt) => (
                                <label key={opt.id} style={styles.quizLabel}>
                                    <input
                                        type="radio"
                                        name={quizId}
                                        value={opt.id}
                                        checked={answer === opt.id}
                                        onChange={(e) => handleQuizAnswer(quizId, e.target.value)}
                                        style={styles.quizInput}
                                    />
                                    {opt.text}
                                    {showInstructor && !opt.correct && opt.why && (
                                        <span style={styles.distractor}> [Why not: {opt.why}]</span>
                                    )}
                                </label>
                            ))}
                        </>
                    )}
                    {quiz.type === 'ms' && (
                        <>
                            {quiz.options.map((opt) => (
                                <label key={opt.id} style={styles.quizLabel}>
                                    <input
                                        type="checkbox"
                                        name={quizId}
                                        value={opt.id}
                                        checked={Array.isArray(answer) && answer.includes(opt.id)}
                                        onChange={(e) => {
                                            const arr = Array.isArray(answer) ? [...answer] : [];
                                            if (e.target.checked) {
                                                arr.push(opt.id);
                                            } else {
                                                arr.splice(arr.indexOf(opt.id), 1);
                                            }
                                            handleQuizAnswer(quizId, arr);
                                        }}
                                        style={styles.quizInput}
                                    />
                                    {opt.text}
                                    {showInstructor && !opt.correct && opt.why && (
                                        <span style={styles.distractor}> [Why not: {opt.why}]</span>
                                    )}
                                </label>
                            ))}
                        </>
                    )}
                </div>
                {answer && isCorrect !== null && (
                    <div
                        style={{
                            ...styles.feedback,
                            ...(isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect),
                        }}
                    >
                        {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
                        {showInstructor && <p>{quiz.explanation}</p>}
                    </div>
                )}
            </div>
        );
    };

    const KeyTakeaway = ({ children }) => (
        <div style={styles.keyTakeaway}>
            <strong style={styles.calloutTitle}>Key Takeaway:</strong>
            <p>{children}</p>
        </div>
    );

    const CommonPitfall = ({ children }) => (
        <div style={styles.commonPitfall}>
            <strong style={styles.calloutTitle}>⚠ Common Pitfall:</strong>
            <p>{children}</p>
        </div>
    );

    const CodeBlock = ({ code, language = 'solidity' }) => (
        <pre style={styles.codeBlock}>
            <code>{code}</code>
        </pre>
    );

    // ============================================================================
    // SECTION RENDERERS
    // ============================================================================

    const IntroSection = () => (
        <div style={styles.section}>
            <h2>Module Overview: Oracles, MEV, and Protocol-Level Risk</h2>
            <h3>Abstract</h3>
            <p>
                Smart contracts are "blind"—they cannot directly access off-chain data or observe the true cost of
                computation. This limitation gives rise to two intertwined security challenges:
            </p>
            <ul style={styles.list}>
                <li>
                    <strong>Oracle Risk:</strong> How do protocols reliably and decentralley get prices and data
                    on-chain without creating a single point of failure or incentivizing manipulation?
                </li>
                <li>
                    <strong>MEV (Maximal/Miner Extractable Value):</strong> Once transactions are in the mempool,
                    who decides their order? And how can an attacker with ordering power manipulate prices,
                    trigger liquidations, or steal value?
                </li>
                <li>
                    <strong>Economic Bugs:</strong> How do we reason about adversarial incentives and system
                    invariants? Many DeFi failures pass unit tests but break under real market stress.
                </li>
            </ul>
            <h3>Learning Objectives</h3>
            <ul style={styles.list}>
                <li>Understand oracle designs (push/pull, spot/TWAP, centralized/decentralized) and their security tradeoffs</li>
                <li>
                    Identify how oracles can be manipulated (thin liquidity, flash loans, large trades, delayed updates)
                </li>
                <li>Grasp MEV extraction methods (front-running, back-running, sandwiching) and why they matter to protocol security</li>
                <li>
                    Apply practical mitigations: price oracles, slippage limits, commit-reveal, batch auctions, and circuit breakers
                </li>
                <li>
                    Reason about economic models under adversarial pressure and test invariants that ensure bounded losses
                </li>
                <li>Build and attack a toy protocol in the lab to see these risks firsthand</li>
            </ul>
            <h3>Prerequisites</h3>
            <ul style={styles.list}>
                <li>Understanding of DEXs, AMMs, and how prices form on-chain</li>
                <li>Basic Solidity or pseudocode familiarity</li>
                <li>Familiarity with concepts from Modules 4–5 (access control, reentrancy, upgradability)</li>
            </ul>
            <h3>Key Terms</h3>
            <ul style={styles.list}>
                <li>
                    <strong>Push Oracle:</strong> Oracle updates state proactively; protocol consumes latest data
                </li>
                <li>
                    <strong>Pull Oracle:</strong> Protocol calls oracle function on demand; oracle returns data
                </li>
                <li>
                    <strong>TWAP (Time-Weighted Average Price):</strong> Price averaged over a lookback window,
                    resistant to spot-price shocks
                </li>
                <li>
                    <strong>Medianizer:</strong> Aggregates multiple price feeds and returns the median,
                    resilient to minority outlier sources
                </li>
                <li>
                    <strong>Flash Loan:</strong> Uncollateralized loan that must be repaid within the same transaction
                </li>
                <li>
                    <strong>MEV:</strong> Profit available to whoever controls transaction ordering in a block
                </li>
                <li>
                    <strong>Sandwich Attack:</strong> Placing transactions before and after a target to profit from price movement
                </li>
                <li>
                    <strong>Circuit Breaker:</strong> Automatic pause of protocol operations if a sudden large change
                    (price, volume, etc.) is detected
                </li>
            </ul>
            <KeyTakeaway>
                Protocol security is not only about code correctness; it is about incentive design. Assume
                attackers have capital, can see pending transactions, and will exploit any profitable imbalance.
            </KeyTakeaway>
            <button
                onClick={() => {
                    markSectionComplete('intro');
                    setCurrentSection('oracle-fundamentals');
                }}
                style={styles.button}
            >
                Next: Oracle Fundamentals →
            </button>
        </div>
    );

    const OracleFundamentalsSection = () => (
        <div style={styles.section}>
            <h2>1. Oracle Fundamentals: How Protocols Get Data</h2>
            <h3>1.1 The Oracle Problem</h3>
            <p>
                Smart contracts run deterministically and immutably on-chain. They can read blockchain state
                (balances, contract storage) but cannot directly query the internet, call external APIs, or observe
                real-world events. Yet DeFi protocols need prices, sports scores, weather data, and other off-chain
                information to function.
            </p>
            <p>
                <strong>The oracle problem:</strong> How can an on-chain protocol trustlessly and decentrally get
                accurate off-chain data?
            </p>
            <KeyTakeaway>
                Oracles are not a solved problem. They remain a major attack surface. No oracle design is "perfectly
                secure"; all involve trust assumptions or economic trade-offs.
            </KeyTakeaway>

            <h3>1.2 Push vs. Pull Oracle Architectures</h3>
            <p>
                <strong>Push Oracle:</strong> A trusted or decentralized set of entities periodically submit verified
                data on-chain. Protocols read the latest state.
            </p>
            <CodeBlock
                code={`// Push oracle pseudocode
contract PushOracle {
    uint256 price;
    uint256 lastUpdate;
    
    // Oracle operator pushes updates
    function updatePrice(uint256 newPrice) {
        require(msg.sender == oracle, "unauthorized");
        price = newPrice;
        lastUpdate = block.timestamp;
    }
    
    // Protocol reads the latest price
    function getPrice() external view returns (uint256) {
        return price;
    }
}`}
            />
            <p>
                <strong>Pros:</strong> Protocols always have the latest data. Gas cost is paid by the oracle operator,
                not the user.
            </p>
            <p>
                <strong>Cons:</strong> Oracle operator must be trusted or must operate a decentralized consensus (hard
                and expensive). Update frequency is fixed, so protocols cannot cherry-pick low prices.
            </p>

            <p style={{ marginTop: '20px' }}>
                <strong>Pull Oracle:</strong> Protocol calls a function to fetch the current price from an external data
                source (e.g., Uniswap spot price) or oracle service.
            </p>
            <CodeBlock
                code={`// Pull oracle pseudocode (e.g., DEX spot price)
contract Vault {
    IUniswapV3Pool pool;
    
    function getLoanPrice() external view returns (uint256) {
        // Read spot price directly from DEX state
        return pool.slot0().sqrtPriceX96;
    }
    
    function liquidate(address borrower) external {
        uint256 collateral = balances[borrower];
        uint256 price = getLoanPrice();
        uint256 debt = debts[borrower];
        
        if (collateral * price < debt * threshold) {
            // liquidate
        }
    }
}`}
            />
            <p>
                <strong>Pros:</strong> No trusted operator. Pricing comes directly from market data (DEX liquidity).
                Gas cost is paid by the caller (user or liquidator), not a global oracle.
            </p>
            <p>
                <strong>Cons:</strong> Data is only as fresh as the last block. Attacker can flash loan, move prices,
                and trigger protocol actions in the same block.
            </p>

            <CommonPitfall>
                Pull oracles from spot prices (DEX reserves) are not "decentralized" just because DEX is decentralized.
                An attacker with flash loans or large capital can move the spot price in a single block, and the
                protocol will trust it.
            </CommonPitfall>

            <h3>1.3 Update Frequency and Staleness</h3>
            <p>
                Push oracles update at fixed intervals (e.g., every 1 minute, every 12 seconds). If the real price
                moves faster, the oracle stales.
            </p>
            <p>
                <strong>Staleness risk:</strong> A liquidation or lending action happens at an outdated price, and
                the protocol is either too lenient or too harsh.
            </p>
            <p>
                Example: Oracle shows ${' '}
                <code>ETH = $2000</code>, but spot price crashes to ${' '}
                <code>$1500</code> in the next block. If liquidations use the stale oracle price, liquidators profit
                and borrowers lose value.
            </p>
            <KeyTakeaway>
                Staleness is the tradeoff for push oracles. Faster updates reduce staleness but cost more gas and
                require more infrastructure.
            </KeyTakeaway>

            <QuizComponent quizId="q-oracle-01" />

            <button
                onClick={() => {
                    markSectionComplete('oracle-fundamentals');
                    setCurrentSection('oracle-design');
                }}
                style={styles.button}
            >
                Next: Oracle Designs and Aggregation →
            </button>
        </div>
    );

    const OracleDesignSection = () => (
        <div style={styles.section}>
            <h2>2. Oracle Designs: Aggregation, Decentralization, and Robustness</h2>

            <h3>2.1 Spot Prices vs. Time-Weighted Average Prices (TWAP)</h3>
            <p>
                <strong>Spot Price:</strong> The price at the most recent transaction (last block state).
            </p>
            <p>
                <strong>TWAP:</strong> The arithmetic mean of prices over a lookback window (e.g., 30 min).
            </p>
            <p>
                <strong>Key insight:</strong> TWAP raises the cost of manipulation. An attacker who wants to move
                the TWAP must sustain a price impact across the entire window, not just push the spot once.
            </p>
            <CodeBlock
                code={`// Simplified TWAP logic
contract UniswapV3TWAP {
    IUniswapV3Pool pool;
    uint32 lookbackWindow = 1800; // 30 min
    
    function getTWAP() external view returns (uint256) {
        // Uniswap V3 stores cumulative ticks; compute avg over window
        (int56 tickCumulative0, int56 tickCumulative1) = 
            OracleLibrary.consult(pool, lookbackWindow);
        
        int56 tickDelta = tickCumulative1 - tickCumulative0;
        int24 avgTick = int24(tickDelta / int32(lookbackWindow));
        
        return TickMath.getSqrtRatioAtTick(avgTick);
    }
}`}
            />
            <p>
                <strong>Latency tradeoff:</strong> A longer window (30 min) is harder to manipulate but the price
                is older. A short window (1 min) is fresher but cheaper to attack.
            </p>

            <h3>2.2 Medianizers and Multi-Source Aggregation</h3>
            <p>
                Instead of trusting one oracle, a protocol can aggregate multiple sources and take the median price.
            </p>
            <CodeBlock
                code={`// Simplified medianizer
contract Medianizer {
    address[] public sources;
    
    function getMedianPrice() external view returns (uint256) {
        uint256[] memory prices = new uint256[](sources.length);
        
        for (uint i = 0; i < sources.length; i++) {
            prices[i] = IOracle(sources[i]).getPrice();
        }
        
        // Sort and return middle value
        // (pseudo: actual sorting left to implementation)
        uint256 mid = prices.length / 2;
        return prices[mid];
    }
}`}
            />
            <p>
                <strong>Byzantine fault tolerance:</strong> The median is resistant to outliers. If 50% or more of
                sources are corrupt, the median moves; if &lt;49% are corrupt, the median is unaffected.
            </p>
            <KeyTakeaway>
                Medianizers work well if sources are truly independent. However, if >50% of sources are owned by the
                same entity, compromised, or financially incentivized (e.g., all are major DEXs under one AUM footprint),
                the "decentralization" is illusory.
            </KeyTakeaway>

            <h3>2.3 Data Provenance and Signed Data</h3>
            <p>
                Some oracles (e.g., Chainlink) use off-chain computation and validation. A trusted set of nodes run the
                same computation (e.g., aggregate spot prices from 30 exchanges) and cryptographically sign the result.
            </p>
            <p>
                <strong>Advantage:</strong> The on-chain contract verifies signatures, so the protocol does not need to
                trust a single node or DEX.
            </p>
            <p>
                <strong>Tradeoff:</strong> Trust is shifted to the oracle operator who chooses the inputs, aggregation
                method, and signing threshold. If operators collude or are incentivized, the result is still manipulated.
            </p>

            <h3>2.4 What Oracles Guarantee and What They Don't</h3>
            <ul style={styles.list}>
                <li>
                    <strong>Oracles do NOT guarantee accuracy.</strong> Even a decentralized oracle can be wrong if all
                    sources are wrong (e.g., all DEXs have thin liquidity and an attacker moves prices).
                </li>
                <li>
                    <strong>Oracles do NOT eliminate manipulation risk.</strong> They raise the cost and latency, but
                    attackers with large capital or flash loans can still exploit the window.
                </li>
                <li>
                    <strong>Oracles do NOT prevent cascading failures.</strong> If an oracle fails or is outdated, a
                    protocol with tight collateralization can enter a "death spiral" of liquidations.
                </li>
            </ul>

            <CommonPitfall>
                Developers often assume that using a "reputable" oracle (e.g., Chainlink) means prices are safe.
                In reality, no oracle can prevent manipulation if the underlying asset is illiquid or if the attack
                window is wide enough.
            </CommonPitfall>

            <QuizComponent quizId="q-oracle-02" />
            <QuizComponent quizId="q-oracle-03" />

            <button
                onClick={() => {
                    markSectionComplete('oracle-design');
                    setCurrentSection('oracle-attacks');
                }}
                style={styles.button}
            >
                Next: Oracle Attack Vectors →
            </button>
        </div>
    );

    const OracleAttacksSection = () => (
        <div style={styles.section}>
            <h2>3. Oracle Attacks: How Protocols Get Manipulated</h2>

            <h3>3.1 Spot Price Manipulation via Large Trades</h3>
            <p>
                An attacker with capital can push the spot price of a thin-liquidity asset by trading in a DEX. If
                the protocol trusts the spot price, the attacker can trigger liquidations, borrowing with inflated
                collateral value, or extract arbitrage.
            </p>
            <CodeBlock
                code={`// Attack scenario: thin asset X with low liquidity on DEX
// Attacker owns $10M, protocol has $50M X lent out

// Step 1: DEX reserves are $100k X : $2M USDC (spot = 20 USDC per X)
// Step 2: Attacker buys $2M USDC of X, moving price to $40/X
//   - DEX reserves become $50k X : $4M USDC
//   - Collateral denominated in X is now worth 2x more

// Step 3: Attacker's own collateral (which they borrowed X to build) 
//   now triggers massive over-collateralization 
// Step 4: Attacker liquidates other borrowers at the inflated price
//         or simply keeps the profit

// Problem: Oracle trusted the spot price. No medium-term reference.`}
            />
            <p>
                <strong>Defense:</strong> Use TWAP, medianizer, or external data source so a single large trade does
                not move the price.
            </p>

            <h3>3.2 Flash Loan Amplified Attacks</h3>
            <p>
                Flash loans enable attackers to borrow huge sums for a single block. Combined with a spot oracle,
                this is devastating.
            </p>
            <CodeBlock
                code={`// Flash loan attack on a spot-price oracle
contract FlashAttack {
    IFlashLoanProvider lender;
    IUniswap dex;
    ILendingProtocol lending;
    
    function attack() external {
        // Step 1: Request flash loan of E (all available X)
        lender.flashLoan(address(this), tokenX, amount, data);
    }
    
    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32) {
        // Step 2: Now we hold amount of X
        // Step 3: Buy USDC with X to flip the DEX price
        dex.swap(tokenX, tokenUSDC, amount);
        
        // Step 4: Price is now high; our collateral (denominated in X) is valued up
        // Step 5: Borrow against it at the inflated price
        lending.borrow(borrowedAsset);
        
        // Step 6: Sell the borrowed asset for USDC
        // Step 7: Use USDC to repay flash loan + fee
        // Step 8: Profit = borrowed - fee
        
        // Repay
        lender.repay(fee);
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}`}
            />
            <p>
                <strong>Why it works:</strong> The entire attack (borrow, trade, liquidate, repay) happens in one
                block. The oracle sees only the final state and trusts it.
            </p>

            <h3>3.3 Delayed Update and Stale Price Attacks</h3>
            <p>
                Push oracles update on a schedule. An attacker can observe the next update window and front-run it
                if the update is predictable.
            </p>
            <p>
                Alternatively, if a market moves sharply (crash), the oracle is 5 minutes stale, and protocols
                using the oracle get liquidated at the wrong price.
            </p>

            <h3>3.4 Multi-Protocol Composability Attacks</h3>
            <p>
                Many DeFi protocols depend on the same oracle (e.g., Chainlink ETH/USD). If the oracle is
                manipulated or fails, multiple protocols are affected simultaneously, creating systemic risk.
            </p>
            <KeyTakeaway>
                Oracle attacks often benefit from leverage and composability. A $10M attack on an oracle can trigger
                $100M+ in liquidations if 10x leverage is common. Mitigations must account for cascades.
            </KeyTakeaway>

            <CommonPitfall>
                Developers build protocols that liquidate on a single oracle update without a circuit breaker or
                time delay. This makes cascades unstoppable: a surprised market change triggers mass liquidations,
                which trigger more, creating a spiral.
            </CommonPitfall>

            <button
                onClick={() => {
                    markSectionComplete('oracle-attacks');
                    setCurrentSection('mev-fundamentals');
                }}
                style={styles.button}
            >
                Next: MEV Fundamentals →
            </button>
        </div>
    );

    const MEVFundamentalsSection = () => (
        <div style={styles.section}>
            <h2>4. MEV Fundamentals: Ordering as a Security Threat</h2>

            <h3>4.1 What is MEV?</h3>
            <p>
                <strong>Maximal/Miner Extractable Value (MEV):</strong> Profit available to a validator/miner who can
                choose the order of transactions in a block.
            </p>
            <p>
                In traditional finance, order execution is regulated (FIFO, best execution rules). In blockchain,
                ordering is a valuable resource, and there is no enforced fairness. The builder/validator can:
            </p>
            <ul style={styles.list}>
                <li>See all pending transactions in the mempool</li>
                <li>Reorder them</li>
                <li>Include transactions they create</li>
                <li>Exclude transactions</li>
            </ul>
            <p>
                This creates a <strong>new attack surface</strong> that traditional finance does not have.
            </p>

            <h3>4.2 The Mempool and Transaction Visibility</h3>
            <p>
                When a user submits a transaction, it enters the public mempool. Validators see it and can observe:
            </p>
            <ul style={styles.list}>
                <li>Sender</li>
                <li>Target contract and calldata</li>
                <li>Gas price offered</li>
            </ul>
            <p>
                <strong>Example:</strong> A user broadcasts a DEX swap: "swap 1 ETH for USDC at MinOut=1900 USDC".
                Everyone in the mempool sees this and knows:
            </p>
            <ul style={styles.list}>
                <li>There is a profitable arbitrage opportunity (e.g., USDC is worth more elsewhere)</li>
                <li>The user is willing to accept ≥1900 USDC</li>
                <li>The validator can insert a transaction before the user to move the price, making the user's
                execution worse</li>
            </ul>

            <h3>4.3 Front-Running, Back-Running, Sandwiching</h3>
            <p>
                <strong>Front-running:</strong> A validator inserts a transaction <em>before</em> a pending
                transaction to profit from the side effects.
            </p>
            <CodeBlock
                code={`// User broadcasts: Swap 1 ETH for USDC (min 1900)
// Validator sees this and front-runs:

// Validator Tx 1: Buy USDC (pump price)
// User Tx:        Swap 1 ETH for USDC (now worse, e.g., 1850)
// Validator Tx 2: Sell USDC (dump price)
// Validator profit = (sell price - buy price) ≈ user's slippage loss`}
            />

            <p style={{ marginTop: '20px' }}>
                <strong>Back-running:</strong> A validator inserts a transaction <em>after</em> a pending transaction
                to profit from the impact.
            </p>
            <CodeBlock
                code={`// User broadcasts: Liquidate borrower (collateral in ETH)
// Validator sees this and:

// User Tx:        Liquidate (collateral transferred to liquidator, price moves)
// Validator Tx:   Buy/sell the moved collateral for profit`}
            />

            <p style={{ marginTop: '20px' }}>
                <strong>Sandwiching:</strong> A validator places transactions both before <em>and</em> after.
            </p>

            <h3>4.4 Why MEV is a Protocol Security Threat</h3>
            <p>
                MEV is not just a fairness issue; it breaks protocol trust assumptions:
            </p>
            <ul style={styles.list}>
                <li>
                    <strong>Slippage protection fails:</strong> A user sets "min out = 1900 USDC" expecting a safety
                    buffer, but MEV front-running eats it.
                </li>
                <li>
                    <strong>Liquidations can be gamed:</strong> A validator reorders transactions to ensure a specific
                    liquidator wins, or triggers liquidations at the worst price for borrowers.
                </li>
                <li>
                    <strong>Oracle prices can be front-run:</strong> An oracle updates a price, users react, a validator
                    reorders to break the assumption.
                </li>
                <li>
                    <strong>Governance is vulnerable:</strong> A validator can vote, see the tally, and change their
                    vote in a next block.
                </li>
            </ul>

            <QuizComponent quizId="q-mev-01" />
            <QuizComponent quizId="q-mev-02" />

            <button
                onClick={() => {
                    markSectionComplete('mev-fundamentals');
                    setCurrentSection('mev-extraction');
                }}
                style={styles.button}
            >
                Next: MEV Extraction Strategies →
            </button>
        </div>
    );

    const MEVExtractionSection = () => (
        <div style={styles.section}>
            <h2>5. MEV Extraction in Detail: Who Extracts and How</h2>

            <h3>5.1 Validators and Builders</h3>
            <p>
                After The Merge (Ethereum 2.0), block production is separated from block proposal:
            </p>
            <ul style={styles.list}>
                <li>
                    <strong>Validators:</strong> Stake ETH; propose blocks (but often outsource building)
                </li>
                <li>
                    <strong>Builders:</strong> Construct bundles of transactions, sold to validators via MEV-Boost
                </li>
                <li>
                    <strong>Relays:</strong> Intermediaries that match builders with validators
                </li>
                <li>
                    <strong>Searchers:</strong> Independent entities that identify MEV opportunities and bid for ordering
                </li>
            </ul>

            <h3>5.2 Public and Private Mempools</h3>
            <p>
                <strong>Public mempool:</strong> All nodes see all pending transactions. Searchers and MEV bots
                monitor it and extract value.
            </p>
            <p>
                <strong>Private order flow (e.g., Flashbots Protect):</strong> Users send txs to a relay, not the
                public mempool. The relay hides the tx and sells ordering rights.
            </p>
            <p>
                <strong>Tradeoff:</strong> Privacy reduces MEV exposure but shifts trust to the relay. Some relays
                have been censored or have gone down.
            </p>

            <h3>5.3 Priority Fees and MEV Auctions</h3>
            <p>
                Validators prioritize txs by gas price. Searchers boost the gas price to compete for ordering.
            </p>
            <p>
                Example: A liquidation is profitable at 100 USDC gain. If gas cost is 50 gwei, searchers will pay up
                to 100 USDC in priority tips. This drives up the cost of being first.
            </p>

            <KeyTakeaway>
                MEV does not disappear; it is transferred. Protocols cannot stop MEV extraction, only shift where the
                value goes (to searchers, validators, builders, or users). Good protocol design recognizes this and
                limits damage.
            </KeyTakeaway>

            <QuizComponent quizId="q-mev-03" />

            <button
                onClick={() => {
                    markSectionComplete('mev-extraction');
                    setCurrentSection('mev-mitigations');
                }}
                style={styles.button}
            >
                Next: MEV Mitigations →
            </button>
        </div>
    );

    const MEVMitigationsSection = () => (
        <div style={styles.section}>
            <h2>6. MEV Mitigations and Protocol Design</h2>

            <h3>6.1 Slippage Limits and Price Impact Protection</h3>
            <p>
                Users specify a minimum acceptable output. If the actual output is worse, the transaction reverts.
            </p>
            <CodeBlock
                code={`// User-controlled slippage
function swap(uint amountIn, uint minAmountOut) {
    uint amountOut = getAmountOut(amountIn);
    require(amountOut >= minAmountOut, "Slippage!");
    // execute
}`}
            />
            <p>
                <strong>Defense against:</strong> Front-running, where a validator moves the price before the user's
                tx.
            </p>
            <p>
                <strong>Limitation:</strong> If slippage is too loose, it does not help. If too tight, users cannot
                execute trades. MEV still happens; users just refuse bad outcomes.
            </p>

            <h3>6.2 Batch Auctions and Frequent Batch Auctions (FBAs)</h3>
            <p>
                Instead of allowing real-time ordering, a protocol collects all txs in an interval and executes them
                at a single agreed-upon price.
            </p>
            <CodeBlock
                code={`// Simplified batch auction
contract BatchSwap {
    uint256 batchNumber;
    mapping(uint => Order[]) orders;
    mapping(uint => uint256) settlePrice;
    
    function submitOrder(uint[] calldata amounts, bool[] buy) {
        orders[batchNumber].push(Order(msg.sender, amounts, buy));
    }
    
    function settleBatch(uint256 price) {
        // All orders execute at the same price
        // No front-running possible
    }
}`}
            />
            <p>
                <strong>Advantage:</strong> Everyone in a batch has the same execution price; no ordering games.
            </p>
            <p>
                <strong>Disadvantage:</strong> Users must wait for the next batch. Price may move; slippage is
                unpredictable.
            </p>

            <h3>6.3 Commit-Reveal Schemes</h3>
            <p>
                Users commit to a transaction hash without revealing content. In a later block, they reveal it.
                By the time the tx is revealed, the front-runner cannot exploit it.
            </p>
            <CodeBlock
                code={`// Commit-reveal
function commit(bytes32 hash) {
    commitments[msg.sender] = hash;
    commitBlock = block.number;
}

function reveal(uint[] calldata data, bool buy) {
    require(block.number > commitBlock + delayBlocks);
    require(keccak256(data, buy) == commitments[msg.sender]);
    // execute
}`}
            />
            <p>
                <strong>Advantage:</strong> Content is hidden until reveal, so no mempool spying.
            </p>
            <p>
                <strong>Disadvantage:</strong> Requires two transactions. Commitment can be front-run if the attacker
                sees the reveal call or guesses the data.
            </p>

            <h3>6.4 RFQ and Intent-Based Designs</h3>
            <p>
                Instead of publishing a swap on-chain, a user requests a quote from a market maker. The maker signs
                a firm bid; only the filler (market maker) can execute it.
            </p>
            <p>
                <strong>Advantage:</strong> Market maker bears the inventory risk; no slippage for the user.
            </p>
            <p>
                <strong>Disadvantage:</strong> Requires liquidity providers to be willing; may not work for all assets.
            </p>

            <h3>6.5 Oracle-Based Price Protections</h3>
            <p>
                A protocol uses an oracle (TWAP, medianizer) as a reference and rejects any execution far from the
                oracle price.
            </p>
            <CodeBlock
                code={`// Oracle price as reference
function swapWithOracleCheck(uint amountIn, uint maxSlippage) {
    uint refPrice = oracle.getPrice();
    uint executionPrice = dex.getPrice(amountIn);
    
    uint tolerance = refPrice * maxSlippage / 100;
    require(
        executionPrice <= refPrice + tolerance &&
        executionPrice >= refPrice - tolerance,
        "Execution price out of bounds"
    );
}`}
            />
            <p>
                <strong>Advantage:</strong> Protection is algorithm-driven, not dependent on user-set slippage.
            </p>
            <p>
                <strong>Disadvantage:</strong> Depends on oracle reliability. If oracle is outdated or manipulated,
                the check is useless.
            </p>

            <h3>6.6 Time Delays and Staged Execution</h3>
            <p>
                Some operations (e.g., liquidations, withdrawals) are delayed by a timelock. This gives users /
                other participants time to react.
            </p>
            <CodeBlock
                code={`// Simple timelock for liquidation
function requestLiquidation(address borrower) {
    pendingLiquidations[borrower] = block.timestamp;
}

function executeLiquidation(address borrower) {
    require(block.timestamp >= pendingLiquidations[borrower] + delaySeconds);
    // do liquidation
}`}
            />
            <p>
                <strong>Advantage:</strong> Gives time for off-chain actors to respond (e.g., borrowers to add
                collateral, or arbitrage bots to fix the price).
            </p>
            <p>
                <strong>Disadvantage:</strong> Increases latency; powerful if the market is liquid but fails in
                stress.
            </p>

            <CommonPitfall>
                Developers often assume one mitigation suffices. Best practice is defense-in-depth: use oracle,
                slippage, and circuit breaker all together.
            </CommonPitfall>

            <button
                onClick={() => {
                    markSectionComplete('mev-mitigations');
                    setCurrentSection('flash-loans');
                }}
                style={styles.button}
            >
                Next: Flash Loans and Composed Attacks →
            </button>
        </div>
    );

    const FlashLoansSection = () => (
        <div style={styles.section}>
            <h2>7. Flash Loans: Amplifying Attacks and Economic Risk</h2>

            <h3>7.1 What is a Flash Loan?</h3>
            <p>
                A flash loan is an uncollateralized, instantly available loan that must be repaid within the same
                transaction (plus a small fee).
            </p>
            <CodeBlock
                code={`// Flash loan interface (ERC-3156 standard)
interface IFlashLoanReceiver {
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32);
}

contract FlashLoanProvider {
    function flashLoan(
        address receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external {
        // Transfer amount to receiver
        IERC20(token).transfer(receiver, amount);
        
        // Call receiver's onFlashLoan callback
        IFlashLoanReceiver(receiver).onFlashLoan(msg.sender, token, amount, 0, data);
        
        // Verify amount + fee is repaid
        require(
            IERC20(token).balanceOf(address(this)) >= amount + fee,
            "Flash loan not repaid"
        );
    }
}`}
            />

            <h3>7.2 Why Flash Loans Are Dangerous for Protocols</h3>
            <p>
                Flash loans create a unique attack surface because an attacker can:
            </p>
            <ul style={styles.list}>
                <li>Borrow any amount of a token, limited only by the lender's liquidity</li>
                <li>Use the capital to manipulate prices, trigger liquidations, or vote in governance</li>
                <li>Repay the loan within the same block, so no actual capital is at risk</li>
            </ul>
            <p>
                <strong>Key advantage for attacker:</strong> If the attack extracts > fee, it is profitable.
            </p>

            <h3>7.3 Flash Loan + Oracle Attack Example</h3>
            <p>
                Combining flash loans with oracle manipulation is a classic attack vector.
            </p>
            <CodeBlock
                code={`// Scenario: Lending protocol with spot-price oracle
// Asset X: $100M collateral, $50M lent
// DEX reserves: $1M X : $20M USDC (1 X = 20 USDC)

contract FlashLoanAttack is IFlashLoanReceiver {
    IFlashLoanProvider lender;
    IUniswap dex;
    ILending lending;
    
    function attack() external {
        // Step 1: Request flash loan of $20M USDC
        lender.flashLoan(address(this), USDC, 20e6 * 1e6, "");
    }
    
    function onFlashLoan(
        address, address token, uint256 amount, uint256 fee, bytes calldata
    ) external override returns (bytes32) {
        // Step 2: We have $20M USDC; buy X in DEX
        // This flips the price to $40/X (half the liquidity left)
        dex.swap(USDC, amount, address(this)); // receive 500k X
        
        // Step 3: Oracle reads spot price: now $40/X
        // Our collateral (denominated in X) is now worth 2x more
        
        // Step 4: Borrow more assets against the inflated collateral
        uint256 borrowed = lending.borrow(borrowableToken, highAmount);
        
        // Step 5: Swap the borrowed assets back to USDC
        // Step 6: Use USDC to buy back X at a higher price
        dex.swap(borrowed, ..., address(this)); // repay some amount
        
        // Step 7: Repay flash loan
        IERC20(token).approve(msg.sender, amount + fee);
        
        // Profit = amount borrowed - amount repaid - flash fee
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}`}
            />

            <KeyTakeaway>
                Flash loans amplify the cost of a protocol failure from the attacker's capital to the lender's
                entire pool. A $10M lending pool can be drained if the protocol has any exploitable assumption under
                adversarial capital.
            </KeyTakeaway>

            <h3>7.4 Defense Against Flash Loan Attacks</h3>
            <ul style={styles.list}>
                <li>
                    <strong>Do not trust spot prices in lending/collateral:</strong> Use TWAP or external oracles.
                </li>
                <li>
                    <strong>Add a flash loan guard:</strong> Check if the protocol's state changed in the same block and
                    revert if suspected.
                </li>
                <li>
                    <strong>Use medianizers and multiple sources:</strong> Harder to manipulate all sources in one block.
                </li>
                <li>
                    <strong>Cap leverage and enforce collateral ratios:</strong> Even if prices are gamed, a high ratio
                    means liquidations cannot drain the protocol.
                </li>
            </ul>

            <QuizComponent quizId="q-flash-01" />

            <button
                onClick={() => {
                    markSectionComplete('flash-loans');
                    setCurrentSection('economic-bugs');
                }}
                style={styles.button}
            >
                Next: Economic Bugs and Incentive Analysis →
            </button>
        </div>
    );

    const EconomicBugsSection = () => (
        <div style={styles.section}>
            <h2>8. Economic Bugs: When Incentives Break the Protocol</h2>

            <h3>8.1 What is an Economic Bug?</h3>
            <p>
                An economic bug is a vulnerability that passes unit tests and code review but fails under adversarial
                incentive pressure or market stress.
            </p>
            <p>
                Unlike a reentrancy or overflow (which fail on any run), an economic bug only fails when the attacker
                has capital, visibility, and market conditions are right.
            </p>

            <h3>8.2 Case Study: Cascade Liquidation in Aave</h3>
            <p>
                <strong>Scenario:</strong> Aave is a large lending protocol. Collateral is diverse (ETH, stETH,
                USDC, etc.). LTV (loan-to-value) ratios are tight (e.g., 80% for ETH).
            </p>
            <p>
                <strong>The attack:</strong>
            </p>
            <ol style={styles.list}>
                <li>Market tanks: ETH crashes 20% in one block (maybe due to an oracle/MEV cascade).</li>
                <li>Many borrowers cross the liquidation threshold (LTV >80%).</li>
                <li>Liquidators rush to execute liquidations, each selling collateral for USDC.</li>
                <li>This selling pressure drops ETH further (low liquidity in liquidation market).</li>
                <li>More borrowers are liquidated; more collateral is sold.</li>
                <li>
                    A "death spiral" begins. Even if ETH should recover, the protocol has already become insolvent.
                </li>
            </ol>

            <p>
                <strong>Root cause:</strong> The protocol's liquidation mechanism assumes:
            </p>
            <ul style={styles.list}>
                <li>Liquidators are rational and have capital to execute liquidations.</li>
                <li>The liquidation market has enough liquidity to absorb collateral sales.</li>
                <li>Prices do not drop faster than liquidations can execute.</li>
            </ul>

            <p>
                <strong>Reality under attack:</strong> An adversary with capital can:
            </p>
            <ul style={styles.list}>
                <li>Flash loan large amounts of stETH.</li>
                <li>Dump it in DEXs to crash the ETH price.</li>
                <li>Trigger liquidations in Aave (since collateral value dropped).</li>
                <li>Buy the liquidated collateral at fire-sale prices.</li>
            </ul>

            <p>
                <strong>Impact:</strong> Aave becomes insolvent (liabilities > assets) if the liquidity premium during
                liquidations is too high.
            </p>

            <KeyTakeaway>
                Economic bugs arise from the gap between "happy path" assumptions and "adversarial capital"
                realities. A protocol that works perfectly with honest users fails when someone stakes capital to
                break it.
            </KeyTakeaway>

            <h3>8.3 Governance Attacks via Flash Votes</h3>
            <p>
                Some protocols measure voting power via token balance at a snapshot block. A flash loan attack can:
            </p>
            <ol style={styles.list}>
                <li>Borrow a large amount of the governance token.</li>
                <li>Use it to vote on a proposal (gaining quorum or passing a vote).</li>
                <li>Repay the flash loan.</li>
            </ol>
            <p>
                The protocol's assumption was that governance is "decentralized," but an attacker with one block of
                borrowed capital can override it.
            </p>

            <ComputeSecurityMeasure
                description="Flash Loan Governance Attack"
                costOfAttack="$1M (flash loan) + $10k (fee)"
                costOfDefense="Snapshot voting at a prior block"
            />

            <h3>8.4 Incentive Analysis Frameworks</h3>
            <p>
                To catch economic bugs before deployment, reason about:
            </p>
            <ul style={styles.list}>
                <li>
                    <strong>Threat Model:</strong> Who attacks and what is their goal? (Profit, destruction, political
                    impact)
                </li>
                <li>
                    <strong>Attacker Capital:</strong> What resources do they have? (Liquid funds, flash loans, MEV
                    visibility)
                </li>
                <li>
                    <strong>Protocol Invariants:</strong> What must always be true for the protocol to remain solvent?
                    (Total collateral ≥ total debt × LTV, liquidations must be profitable, etc.)
                </li>
                <li>
                    <strong>Attack Surface:</strong> What actions can move the protocol away from invariants?
                    (Large price moves, liquidity drains, ordering games)
                </li>
            </ul>

            <h3>8.5 Guardrails Against Economic Bugs</h3>
            <p>
                <strong>Circuit Breakers:</strong> Pause riskier operations if conditions change sharply.
            </p>
            <CodeBlock
                code={`// Circuit breaker for liquidations
contract LendingWithCircuitBreaker {
    uint256 lastPrice;
    uint256 maxPriceChange = 10; // 10%
    
    function liquidate(address borrower) external {
        uint256 currentPrice = oracle.getPrice();
        
        // Check if price moved >10% since last update
        uint256 change = abs(currentPrice - lastPrice) * 100 / lastPrice;
        if (change > maxPriceChange) {
            revert("Circuit breaker triggered");
        }
        
        // do liquidation
        lastPrice = currentPrice;
    }
}`}
            />

            <p>
                <strong>Caps and Limits:</strong> Enforce per-user and per-protocol limits on leverage, borrowing, and
                liquidations.
            </p>
            <CodeBlock
                code={`// Caps on leverage
function borrow(uint256 amount) external {
    require(amount <= maxBorrowPerUser, "Exceeds user limit");
    require(totalBorrowed + amount <= maxTotalBorrow, "Exceeds protocol limit");
    // do borrow
}`}
            />

            <p>
                <strong>Dynamic Fees:</strong> Increase liquidation fees and slippage penalties in high-stress
                conditions.
            </p>

            <p>
                <strong>Bounded-Risk Parameters:</strong> Start conservative and only increase limits after proving
                safety under stress tests.
            </p>

            <QuizComponent quizId="q-econ-01" />
            <QuizComponent quizId="q-econ-02" />

            <button
                onClick={() => {
                    markSectionComplete('economic-bugs');
                    setCurrentSection('lab');
                }}
                style={styles.button}
            >
                Next: Lab Exercise →
            </button>
        </div>
    );

    const ComputeSecurityMeasure = ({ description, costOfAttack, costOfDefense }) => (
        <div style={styles.callout}>
            <strong>{description}</strong>
            <p>Cost of Attack: {costOfAttack}</p>
            <p>Cost of Defense: {costOfDefense}</p>
            <p style={{ fontSize: '0.9em', color: '#666' }}>
                (If cost of defense is much lower than cost of attack, the protocol has good margins.)
            </p>
        </div>
    );

    const LabSection = () => (
        <div style={styles.section}>
            <h2>9. Lab: Build, Attack, and Defend a Toy Lending Protocol</h2>

            <h3>9.1 Lab Overview</h3>
            <p>
                We will build a simplified collateralized lending pool in Solidity, then:
            </p>
            <ol style={styles.list}>
                <li>Demonstrate an oracle manipulation attack via flash loan</li>
                <li>Show how MEV-style reordering causes liquidation cascades</li>
                <li>Implement mitigations (TWAP oracle, circuit breaker, slippage limit)</li>
                <li>Write tests that verify both the exploit and the defense</li>
            </ol>

            <h3>9.2 Part 1: Simple Lending Protocol (Toy Example)</h3>
            <CodeBlock
                code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IOracle {
    function getPrice(address token) external view returns (uint256);
}

contract SimpleLendingPool {
    // State
    IERC20 public collateralToken;
    IERC20 public loanToken;
    IOracle public oracle;
    
    uint256 public totalCollateral;
    uint256 public totalBorrowed;
    uint256 public constant LTV = 80; // 80% loan-to-value
    
    mapping(address => uint256) public collateral;
    mapping(address => uint256) public borrowed;
    
    constructor(address _collateral, address _loan, address _oracle) {
        collateralToken = IERC20(_collateral);
        loanToken = IERC20(_loan);
        oracle = IOracle(_oracle);
    }
    
    // Deposit collateral
    function deposit(uint256 amount) external {
        collateralToken.transferFrom(msg.sender, address(this), amount);
        collateral[msg.sender] += amount;
        totalCollateral += amount;
    }
    
    // Borrow against collateral
    function borrow(uint256 amount) external {
        uint256 collateralValue = (collateral[msg.sender] * oracle.getPrice(address(collateralToken))) / 1e18;
        uint256 borrowingPower = (collateralValue * LTV) / 100;
        
        require(borrowed[msg.sender] + amount <= borrowingPower, "Insufficient collateral");
        
        borrowed[msg.sender] += amount;
        totalBorrowed += amount;
        loanToken.transfer(msg.sender, amount);
    }
    
    // Repay
    function repay(uint256 amount) external {
        loanToken.transferFrom(msg.sender, address(this), amount);
        borrowed[msg.sender] -= amount;
        totalBorrowed -= amount;
    }
    
    // Liquidate undercollateralized position
    function liquidate(address borrower) external {
        uint256 collateralValue = (collateral[borrower] * oracle.getPrice(address(collateralToken))) / 1e18;
        uint256 borrowingPower = (collateralValue * LTV) / 100;
        
        require(borrowed[borrower] > borrowingPower, "Not underwater");
        
        // Transfer collateral to liquidator
        uint256 collateralToSeize = collateral[borrower];
        collateral[borrower] = 0;
        totalCollateral -= collateralToSeize;
        collateralToken.transfer(msg.sender, collateralToSeize);
        
        // Clear debt
        totalBorrowed -= borrowed[borrower];
        borrowed[borrower] = 0;
    }
}`}
            />

            <h3>9.3 Part 2: Naive Oracle (Vulnerable to Flash Loans)</h3>
            <CodeBlock
                code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapV3Pool {
    function slot0() external view returns (
        uint160 sqrtPriceX96,
        int24 tick,
        uint16 observationIndex,
        uint16 observationCardinality,
        uint16 observationCardinalityNext,
        uint8 feeProtocol,
        bool unlocked
    );
}

contract SpotOracle {
    IUniswapV3Pool public pool;
    
    constructor(address _pool) {
        pool = IUniswapV3Pool(_pool);
    }
    
    function getPrice(address) external view returns (uint256) {
        // Returns spot price from DEX
        // VULNERABLE: Can be manipulated by flash loans or large trades
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        return uint256(sqrtPriceX96);
    }
}`}
            />

            <h3>9.4 Part 3: The Attack Test</h3>
            <CodeBlock
                code={`// Flash loan attack test (foundry style)
pragma solidity ^0.8.0;


interface IFlashLoanProvider {
    function flashLoan(address receiver, address token, uint256 amount, bytes calldata data) external;
}

contract FlashLoanAttacker is IFlashLoanReceiver {
    SimpleLendingPool public lending;
    IERC20 public collateral;
    IERC20 public loan;
    IUniswap public dex;
    
    constructor(address _lending, address _collateral, address _loan, address _dex) {
        lending = SimpleLendingPool(_lending);
        collateral = IERC20(_collateral);
        loan = IERC20(_loan);
        dex = IUniswap(_dex);
    }
    
    function attack(address lender, uint256 flashAmount) external {
        // Step 1: Request flash loan
        IFlashLoanProvider(lender).flashLoan(
            address(this),
            address(collateral),
            flashAmount,
            ""
        );
    }
    
    function onFlashLoan(
        address, address, uint256 amount, uint256 fee, bytes calldata
    ) external override returns (bytes32) {
        // Step 2: Dump collateral on DEX to crash price
        collateral.approve(address(dex), amount);
        dex.swap(address(collateral), amount, address(this)); // get loan tokens
        
        // Step 3: Oracle now sees crashed price
        // We can borrow more than before or manipulate other borrowers
        
        // For simplicity, let's say we liquidate an existing borrower
        // at the crashed price, profiting from their liquidation
        
        // Step 4: Repay flash loan
        uint256 balance = collateral.balanceOf(address(this));
        collateral.approve(msg.sender, balance + fee);
        
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}

contract FlashLoanAttackTest is Test {
    SimpleLendingPool lending;
    SpotOracle oracle;
    IERC20 collateral;
    IERC20 loan;
    FlashLoanAttacker attacker;
    
    function setUp() public {
        // Deploy contracts, set up users, etc.
    }
    
    function testFlashLoanAttack() public {
        // Setup: a borrower has 100 units of collateral, borrowed 80 units of loan token
        // Attacker has 10000 units of collateral available as flash loan
        
        // Attack: flash borrow, crash price, liquidate borrower
        // Expected: attacker profits, protocol becomes insolvent
        
        uint256 flashAmount = 10000e18;
        attacker.attack(address(lender), flashAmount);
        
        // Check: attacker's profit, protocol's solvency, etc.
        // (details depend on implementation)
    }
}`}
            />

            <h3>9.5 Part 4: Mitigations – TWAP Oracle</h3>
            <CodeBlock
                code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TWAPOracle {
    IUniswapV3Pool public pool;
    uint32 public constant WINDOW = 1800; // 30 minutes
    
    function getPrice(address) external view returns (uint256) {
        // Fetch time-weighted average price from Uniswap V3
        (int56 tickCumulativeLast,,,,,,) = pool.observations(pool.slot0().observationIndex);
        (int56 tickCumulativeStart,,,,,,) = pool.observations((pool.slot0().observationIndex + 1) % pool.slot0().observationCardinality);
        
        int56 tickDelta = tickCumulativeLast - tickCumulativeStart;
        int24 avgTick = int24(tickDelta / int32(WINDOW));
        
        // Convert tick to price
        return uint256(TickMath.getSqrtRatioAtTick(avgTick));
    }
}`}
            />

            <h3>9.6 Part 5: Mitigations – Circuit Breaker and Slippage Limit</h3>
            <CodeBlock
                code={`// Enhanced lending pool with circuit breaker
contract HardenedLendingPool is SimpleLendingPool {
    uint256 public lastPrice;
    uint256 public constant MAX_PRICE_CHANGE = 10; // 10%
    
    function liquidate(address borrower) external override {
        uint256 currentPrice = oracle.getPrice(address(collateralToken));
        
        // Circuit breaker: if price moved >10%, revert
        if (lastPrice > 0) {
            uint256 change = abs(int256(currentPrice) - int256(lastPrice)) * 100 / lastPrice;
            require(change <= MAX_PRICE_CHANGE, "Circuit breaker activated");
        }
        
        // Continue with liquidation
        super.liquidate(borrower);
        lastPrice = currentPrice;
    }
}`}
            />

            <h3>9.7 Test Verification of Mitigations</h3>
            <CodeBlock
                code={`contract MitigationTest is Test {
    HardenedLendingPool lending;
    TWAPOracle oracle;
    
    function testCircuitBreakerPreventsAttack() public {
        // Same setup as attack test
        // But with circuit breaker enabled
        
        // Attempt attack: flash borrow, crash price
        // Expected: liquidate() reverts due to circuit breaker
        vm.expectRevert("Circuit breaker activated");
        attacker.attack(address(lender), 10000e18);
        
        // Protocol remains solvent
        assert(lending.totalBorrowed <= lending.totalCollateral);
    }
    
    function testTWAPOracleResistsManipulation() public {
        // Flash loan attack now costs more
        // because TWAP average is harder to move
        
        // Attacker's profit should be < flash loan fee
        // (so the attack is not profitable)
    }
}`}
            />

            <h3>9.8 Challenge Extensions (For Advanced Learners)</h3>
            <ul style={styles.list}>
                <li>
                    <strong>Multi-source medianizer:</strong> Aggregate prices from 3 independent DEXs and return the
                    median. Show how >50% of sources must be compromised to manipulate.
                </li>
                <li>
                    <strong>Stale price handling:</strong> If oracle has no fresh data (e.g., no trades in 1 hour),
                    freeze lending/liquidation until data is fresh.
                </li>
                <li>
                    <strong>Parameter tuning:</strong> Vary LTV, circuit breaker threshold, and TWAP window. Show how
                    each affects the cost of the attack.
                </li>
                <li>
                    <strong>Invariant testing:</strong> Write property-based tests (using fuzzing) that assert:
                    `totalCollateral * avgPrice >= totalBorrowed * 1.5` (simplified). Show that mitigations maintain
                    this invariant even under adversarial inputs.
                </li>
            </ul>

            <button
                onClick={() => {
                    markSectionComplete('lab');
                    setCurrentSection('tabletop');
                }}
                style={styles.button}
            >
                Next: MEV Tabletop Exercise →
            </button>
        </div>
    );

    const TabletopSection = () => {
        const simulateOutcome = () => {
            const outcomes = {
                spot_none: {
                    risk: 'CRITICAL',
                    desc: 'Vulnerable to flash loan attacks, liquidation cascades inevitable.',
                    profitability: 'Very profitable for attacker',
                },
                spot_circuit: {
                    risk: 'HIGH',
                    desc: 'Circuit breaker helps, but attacker can still manipulate within the threshold.',
                    profitability: 'Profitable if threshold is >5%',
                },
                twap_none: {
                    risk: 'MEDIUM',
                    desc: 'TWAP raises the cost, but attacker can sustain an attack over the window.',
                    profitability: 'Profitable only for very large attacks',
                },
                twap_circuit: {
                    risk: 'MEDIUM-LOW',
                    desc: 'TWAP + circuit breaker makes the attack very expensive.',
                    profitability: 'Barely profitable; good guards.',
                },
                medianizer_none: {
                    risk: 'MEDIUM',
                    desc: 'Multiple sources resist manipulation if >50% are independent.',
                    profitability: 'Requires controlling multiple sources',
                },
                medianizer_circuit: {
                    risk: 'LOW',
                    desc: 'Excellent defense: multi-method oracle + circuit breaker.',
                    profitability: 'Not profitable; attack cost >> expected gain',
                },
            };

            const key = `${tabletopParams.oracleType}_${tabletopParams.mevMitigation}`;
            return outcomes[key] || outcomes.spot_none;
        };

        const outcome = simulateOutcome();

        return (
            <div style={styles.section}>
                <h2>10. MEV Tabletop Exercise: Design a Protocol</h2>
                <p>
                    You are designing a lending protocol for a new, illiquid asset. Choose your oracle design,
                    update frequency, and MEV mitigations. See how your choices affect attack cost and protocol safety.
                </p>

                <div style={styles.tabletopContainer}>
                    <div style={styles.tabletopParam}>
                        <label>
                            <strong>Oracle Type:</strong>
                            <select
                                value={tabletopParams.oracleType}
                                onChange={(e) =>
                                    setTabletopParams({ ...tabletopParams, oracleType: e.target.value })
                                }
                                style={styles.select}
                            >
                                <option value="spot">Spot Price (DEX spot)</option>
                                <option value="twap">TWAP (30 min window)</option>
                                <option value="medianizer">Medianizer (3 sources)</option>
                            </select>
                        </label>
                        <p style={styles.description}>
                            {tabletopParams.oracleType === 'spot' &&
                                'Cheap, fresh, vulnerable to flash loans.'}
                            {tabletopParams.oracleType === 'twap' &&
                                'Raises attack cost, but outdated by window length.'}
                            {tabletopParams.oracleType === 'medianizer' &&
                                'Robust if >50% of sources are independent.'}
                        </p>
                    </div>

                    <div style={styles.tabletopParam}>
                        <label>
                            <strong>Update Frequency:</strong>
                            <select
                                value={tabletopParams.updateFreq}
                                onChange={(e) =>
                                    setTabletopParams({ ...tabletopParams, updateFreq: e.target.value })
                                }
                                style={styles.select}
                            >
                                <option value="1min">Every 1 minute</option>
                                <option value="5min">Every 5 minutes</option>
                                <option value="1hour">Every 1 hour</option>
                            </select>
                        </label>
                        <p style={styles.description}>
                            Faster = fresher but more staleness on crash; slower = lagged but less gas.
                        </p>
                    </div>

                    <div style={styles.tabletopParam}>
                        <label>
                            <strong>MEV Mitigation:</strong>
                            <select
                                value={tabletopParams.mevMitigation}
                                onChange={(e) =>
                                    setTabletopParams({ ...tabletopParams, mevMitigation: e.target.value })
                                }
                                style={styles.select}
                            >
                                <option value="none">None</option>
                                <option value="circuit">Circuit Breaker</option>
                                <option value="slippage">Slippage Limit + Oracle Check</option>
                            </select>
                        </label>
                        <p style={styles.description}>
                            None: minimal cost, maximal risk. Circuit: pauses on shock. Slippage: user-controlled.
                        </p>
                    </div>

                    <div style={styles.tabletopParam}>
                        <label>
                            <strong>Liquidation Threshold (LTV):</strong>
                            <input
                                type="range"
                                min="50"
                                max="95"
                                value={tabletopParams.liquidationThreshold}
                                onChange={(e) =>
                                    setTabletopParams({
                                        ...tabletopParams,
                                        liquidationThreshold: e.target.value,
                                    })
                                }
                                style={styles.slider}
                            />
                            {tabletopParams.liquidationThreshold}%
                        </label>
                        <p style={styles.description}>
                            Higher = more capital efficiency but more cascade risk. Lower = safer but less capital utilization.
                        </p>
                    </div>
                </div>

                <div style={styles.outcomeBox}>
                    <h3>Simulated Outcome</h3>
                    <p>
                        <strong>Risk Level:</strong> {outcome.risk}
                    </p>
                    <p>
                        <strong>Assessment:</strong> {outcome.desc}
                    </p>
                    <p>
                        <strong>Attack Profitability:</strong> {outcome.profitability}
                    </p>
                    <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                        (This is a simplified simulation. Real attacks depend on market conditions, competition, and
                        specific parameters.)
                    </p>
                </div>
            </div>
        );
    };

    const FinalAssessmentSection = () => {
        const handleSubmitFinal = () => {
            const score = calculateFinalScore();
            setFinalScore(score);
            markSectionComplete('final-assessment');
        };

        if (finalScore) {
            const percent = Math.round((finalScore.correct / finalScore.total) * 100);
            return (
                <div style={styles.section}>
                    <h2>Final Assessment Results</h2>
                    <div style={styles.scoreBox}>
                        <h3>Your Score: {finalScore.correct}/{finalScore.total}</h3>
                        <p style={styles.scorePercent}>{percent}%</p>
                        {percent >= 80 && (
                            <p style={styles.feedbackCorrect}>🎉 Excellent! You have mastered the core concepts.</p>
                        )}
                        {percent >= 65 && percent < 80 && (
                            <p style={styles.feedbackIncorrect}>
                                Good effort! Review the sections below to strengthen weak areas.
                            </p>
                        )}
                        {percent < 65 && (
                            <p style={styles.feedbackIncorrect}>
                                Keep practicing! Focus on the key takeaways and reread sections with challenges.
                            </p>
                        )}
                    </div>
                    <h3>Recommended Review Areas</h3>
                    {!evaluateQuiz('q-oracle-01') && (
                        <p>• Oracle architectures (push vs. pull): Section 1.2</p>
                    )}
                    {!evaluateQuiz('q-oracle-02') && (
                        <p>• TWAP oracle design: Section 2.1</p>
                    )}
                    {!evaluateQuiz('q-oracle-03') && (
                        <p>• Medianizers and aggregation: Section 2.2</p>
                    )}
                    {!evaluateQuiz('q-mev-01') && (
                        <p>• MEV extraction methods: Section 5</p>
                    )}
                    {!evaluateQuiz('q-mev-02') && (
                        <p>• MEV as protocol security threat: Section 4.4</p>
                    )}
                    {!evaluateQuiz('q-mev-03') && (
                        <p>• Private order flow and centralization: Section 5.2</p>
                    )}
                    {!evaluateQuiz('q-flash-01') && (
                        <p>• Flash loan amplification: Section 7.1–7.2</p>
                    )}
                    {!evaluateQuiz('q-econ-01') && (
                        <p>• Economic bugs definition: Section 8.1</p>
                    )}
                    {!evaluateQuiz('q-econ-02') && (
                        <p>• Defenses against cascades: Section 8.5</p>
                    )}
                    {!evaluateQuiz('q-final-01') && (
                        <p>• Protocol design tradeoffs: Section 6</p>
                    )}

                    <h3>Next Steps</h3>
                    <ul style={styles.list}>
                        <li>Re-read the "Key Takeaway" and "Common Pitfall" sections for the quizzes you missed.</li>
                        <li>Work through the lab exercise (Section 9) hands-on in a local Foundry repo.</li>
                        <li>Explore real DeFi protocols (Aave, Uniswap, Compound) to see these concepts in action.</li>
                        <li>Subscribe to DeFi security research (e.g., Flashbots, Trail of Bits, Certora) for latest
                        attack vectors.</li>
                    </ul>

                    <button
                        onClick={() => {
                            setFinalScore(null);
                            setCurrentSection('intro');
                            setQuizAnswers({});
                        }}
                        style={styles.button}
                    >
                        Retake Final Assessment
                    </button>
                </div>
            );
        }

        return (
            <div style={styles.section}>
                <h2>Final Assessment</h2>
                <p>
                    Test your understanding of oracles, MEV, and protocol-level risk. Answer all questions, then click
                    "Submit" to see your score and recommendations.
                </p>

                <QuizComponent quizId="q-oracle-01" />
                <QuizComponent quizId="q-oracle-02" />
                <QuizComponent quizId="q-oracle-03" />
                <QuizComponent quizId="q-mev-01" />
                <QuizComponent quizId="q-mev-02" />
                <QuizComponent quizId="q-mev-03" />
                <QuizComponent quizId="q-flash-01" />
                <QuizComponent quizId="q-econ-01" />
                <QuizComponent quizId="q-econ-02" />
                <QuizComponent quizId="q-final-01" />

                <button onClick={handleSubmitFinal} style={styles.submitButton}>
                    Submit Final Assessment
                </button>
            </div>
        );
    };

    const SummarySection = () => {
        setCurrentSection('tabletop');
        return null;
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    const renderSection = () => {
        switch (currentSection) {
            case 'intro':
                return <IntroSection />;
            case 'oracle-fundamentals':
                return <OracleFundamentalsSection />;
            case 'oracle-design':
                return <OracleDesignSection />;
            case 'oracle-attacks':
                return <OracleAttacksSection />;
            case 'mev-fundamentals':
                return <MEVFundamentalsSection />;
            case 'mev-extraction':
                return <MEVExtractionSection />;
            case 'mev-mitigations':
                return <MEVMitigationsSection />;
            case 'flash-loans':
                return <FlashLoansSection />;
            case 'economic-bugs':
                return <EconomicBugsSection />;
            case 'lab':
                return <LabSection />;
            case 'tabletop':
                return <TabletopSection />;
            case 'final-assessment':
                return <FinalAssessmentSection />;
            default:
                return <IntroSection />;
        }
    };

    return (
        <div style={styles.container}>
            <NavBar />
            <div style={styles.content}>{renderSection()}</div>
            <Footer />
        </div>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = {
    container: {
        display: 'flex',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
    },
    navBar: {
        width: '280px',
        backgroundColor: '#1e1e2e',
        color: '#fff',
        padding: '20px',
        overflowY: 'auto',
        maxHeight: '100vh',
        borderRight: '1px solid #333',
    },
    navTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#4a9eff',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#333',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '5px',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4a9eff',
        transition: 'width 0.3s ease',
    },
    progressText: {
        fontSize: '11px',
        color: '#aaa',
        marginBottom: '15px',
    },
    navMenu: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '20px',
    },
    navButton: {
        backgroundColor: 'transparent',
        color: '#aaa',
        border: '1px solid #444',
        padding: '8px 10px',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '12px',
        borderRadius: '4px',
        transition: 'all 0.2s',
    },
    navButtonActive: {
        backgroundColor: '#4a9eff',
        color: '#fff',
        borderColor: '#4a9eff',
    },
    navButtonComplete: {
        opacity: '0.6',
    },
    controls: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '20px',
    },
    button: {
        backgroundColor: '#4a9eff',
        color: '#fff',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '20px',
    },
    content: {
        flex: 1,
        padding: '40px',
        overflowY: 'auto',
        backgroundColor: '#fff',
    },
    section: {
        maxWidth: '900px',
        margin: '0 auto',
        lineHeight: '1.6',
        color: '#333',
    },
    list: {
        marginLeft: '20px',
        listStyleType: 'disc',
    },
    keyTakeaway: {
        backgroundColor: '#e0f2fe',
        border: '2px solid #0ea5e9',
        borderLeft: '6px solid #0ea5e9',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '4px',
    },
    commonPitfall: {
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderLeft: '6px solid #f59e0b',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '4px',
    },
    callout: {
        backgroundColor: '#f3f4f6',
        border: '1px solid #d1d5db',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '4px',
        fontSize: '14px',
    },
    calloutTitle: {
        color: '#1e3a8a',
        fontSize: '13px',
    },
    codeBlock: {
        backgroundColor: '#282c34',
        color: '#abb2bf',
        padding: '15px',
        borderRadius: '4px',
        overflowX: 'auto',
        fontSize: '13px',
        fontFamily: 'Monaco, Courier New, monospace',
        marginBottom: '20px',
    },
    quiz: {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
    },
    quizQuestion: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '12px',
    },
    quizOptions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '12px',
    },
    quizLabel: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        fontSize: '13px',
    },
    quizInput: {
        marginTop: '2px',
        cursor: 'pointer',
    },
    distractor: {
        color: '#dc2626',
        fontSize: '12px',
        fontStyle: 'italic',
    },
    feedback: {
        padding: '10px',
        borderRadius: '4px',
        fontSize: '13px',
    },
    feedbackCorrect: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        border: '1px solid #a7f3d0',
    },
    feedbackIncorrect: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fecaca',
    },
    scoreBox: {
        backgroundColor: '#f3f4f6',
        border: '2px solid #10b981',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '30px',
    },
    scorePercent: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#10b981',
    },
    tabletopContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '30px',
    },
    tabletopParam: {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        padding: '15px',
        borderRadius: '4px',
    },
    select: {
        width: '100%',
        padding: '8px',
        marginTop: '8px',
        borderRadius: '4px',
        border: '1px solid #d1d5db',
        fontSize: '13px',
    },
    slider: {
        width: '100%',
        marginTop: '8px',
    },
    description: {
        fontSize: '12px',
        color: '#666',
        marginTop: '8px',
    },
    outcomeBox: {
        backgroundColor: '#eff6ff',
        border: '2px solid #3b82f6',
        padding: '20px',
        borderRadius: '4px',
    },
};

export default OraclesMEVModule;