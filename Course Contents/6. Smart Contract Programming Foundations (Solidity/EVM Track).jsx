import React, { useState } from 'react';
import Footer from "../../src/Footer";

/**
 * ACM-Style Chapter Activity
 * Smart Contract Programming Foundations (Solidity / EVM Track)
 */
const SmartContractFoundations = () => {
  const [section, setSection] = useState('intro');
  const sections = [
    { id: 'intro',           label: 'Chapter Overview' },
    { id: 'contractAnatomy', label: 'Contract Anatomy' },
    { id: 'storage',         label: 'Storage & Memory' },
    { id: 'interface',       label: 'Interface Design' },
    { id: 'lab',             label: 'Lab: Vault Contract' },
    { id: 'assessment',      label: 'Assessment & Answers' },
  ];
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', padding: '1.5rem', maxWidth: 1100, margin: '0 auto', lineHeight: 1.6 }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>Smart Contract Programming Foundations</h1>
      <h2 style={{ textAlign: 'center', fontWeight: 400, fontSize: '1.1rem', marginTop: 0 }}>
        Solidity / EVM Track — ACM-Style Chapter Activity
      </h2>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', margin: '1.5rem 0' }}>
        {sections.map((s) => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ padding: '0.4rem 0.75rem', borderRadius: 4,
              border: section === s.id ? '2px solid #0077bb' : '1px solid #ccc',
              background: section === s.id ? '#e8f6ff' : '#f8f8f8', cursor: 'pointer', fontSize: '0.9rem' }}>
            {s.label}
          </button>
        ))}
      </nav>
      {section === 'intro'           && <Intro />}
      {section === 'contractAnatomy' && <ContractAnatomy />}
      {section === 'storage'         && <StorageSection />}
      {section === 'interface'       && <InterfaceDesign />}
      {section === 'lab'             && <Lab />}
      {section === 'assessment'      && <Assessment />}
    </div>
  );
};
export default SmartContractFoundations;

/* ─── Reusable helpers ─────────────────────────────────────────────────────── */

function QuizMCQ({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const styleForOption = (idx) => {
    const base = { padding: '0.4rem 0.6rem', margin: '0.2rem 0', borderRadius: 4, border: '1px solid #ccc',
      cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '0.4rem', textAlign: 'left', background: '#fff' };
    if (!submitted) return idx === selected ? { ...base, borderColor: '#0077bb', background: '#eef7ff' } : base;
    if (idx === correctIndex) return { ...base, borderColor: '#1b8a2f', background: '#e7f7eb' };
    if (idx === selected && idx !== correctIndex) return { ...base, borderColor: '#c52828', background: '#fdeaea' };
    return base;
  };
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.75rem 0.9rem', margin: '1rem 0', background: '#fafafa' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Check your understanding</div>
      <div style={{ marginBottom: '0.5rem' }}>{question}</div>
      <div>
        {options.map((opt, idx) => (
          <div key={idx} style={styleForOption(idx)} onClick={() => !submitted && setSelected(idx)}>
            <span style={{ fontWeight: 600 }}>{String.fromCharCode(65 + idx)}.</span>
            <span>{opt}</span>
          </div>
        ))}
      </div>
      <button onClick={() => selected !== null && setSubmitted(true)} disabled={submitted || selected === null}
        style={{ marginTop: '0.5rem', padding: '0.3rem 0.8rem', borderRadius: 4, border: 'none',
          background: submitted ? '#ccc' : '#0077bb', color: 'white',
          cursor: selected === null || submitted ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
        {submitted ? 'Submitted' : 'Submit answer'}
      </button>
      {submitted && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <strong>{selected === correctIndex ? 'Correct: ' : 'Explanation: '}</strong>{explanation}
        </div>
      )}
    </div>
  );
}

function ExampleBox({ title, description, bullets }) {
  return (
    <div style={{ borderLeft: '4px solid #0077bb', padding: '0.75rem 0.9rem', margin: '1rem 0', background: '#f4f9ff' }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {description && <div style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>{description}</div>}
      <ul style={{ marginTop: '0.4rem', paddingLeft: '1.25rem' }}>
        {bullets.map((b, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{b}</li>)}
      </ul>
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: '1rem', borderRadius: 6,
      overflowX: 'auto', fontSize: '0.82rem', lineHeight: 1.5, margin: '0.75rem 0' }}>
      <code>{code}</code>
    </pre>
  );
}

/* ─── Sections ──────────────────────────────────────────────────────────────── */

function Intro() {
  return (
    <section>
      <h3>1. Chapter Overview</h3>
      <p>Smart contracts are self-executing programs stored and run on the blockchain. Solidity is the dominant high-level language targeting the EVM, and contract correctness depends on a precise understanding of structure, data location, access control, and gas economics.</p>
      <p>By the end of this module you should be able to describe the anatomy of a Solidity contract, explain the difference between storage, memory, and calldata, apply interface-first design thinking, and reason about the security properties of a simple Vault.</p>
      <ExampleBox
        title="Motivating scenario: a student payment vault"
        description="A university cafeteria stores student meal credits on-chain."
        bullets={[
          'Each student deposits ETH into a shared Vault contract.',
          'The contract must track individual balances privately, emit events on every change, and reject invalid withdrawals.',
          'Gas costs matter: every storage write costs ~20,000 gas, so layout choices affect both cost and security.',
        ]}
      />
      <QuizMCQ
        question="Which statement best describes why smart contract code correctness is especially critical?"
        options={[
          'Smart contracts can be patched immediately after deployment by the owner.',
          'Once deployed, smart contract logic is immutable and controls real assets, so bugs are difficult or impossible to reverse.',
          'Smart contracts run off-chain so errors only affect user interfaces.',
          'Solidity automatically prevents all security vulnerabilities at compile time.',
        ]}
        correctIndex={1}
        explanation="Smart contracts are deployed as immutable bytecode. Because they control assets or enforce rules, bugs can result in permanent loss of funds with no recourse, making correctness critical from the first deployment."
      />
    </section>
  );
}

/* ── Contract Anatomy ──────────────────────────────────────────────────────── */

const VISIBILITY_DATA = {
  public:   { label: 'public',   color: '#1b8a2f', bg: '#e7f7eb', border: '#1b8a2f',
    reach: ['Within this contract','Derived (child) contracts','External callers','Auto-generates a getter for state variables'],
    useCase: 'User-facing functions and state variables you want anyone to read or call.' },
  external: { label: 'external', color: '#0077bb', bg: '#eef7ff', border: '#0077bb',
    reach: ['External callers only','Cannot be called from within the same contract (except via this.fn())'],
    useCase: 'Gas-efficient interface functions where internal access is never needed.' },
  internal: { label: 'internal', color: '#b07800', bg: '#fff9e6', border: '#e6a800',
    reach: ['Within this contract','Derived (child) contracts','NOT accessible to external callers'],
    useCase: 'Shared helper logic intended for reuse by inheriting contracts.' },
  private:  { label: 'private',  color: '#c52828', bg: '#fdeaea', border: '#c52828',
    reach: ['Only within this exact contract','NOT in derived contracts','NOT to external callers'],
    useCase: 'Sensitive logic or state variables that must not be overridden or exposed.' },
};

function VisibilityExplorer() {
  const [active, setActive] = useState(null);
  const info = active ? VISIBILITY_DATA[active] : null;
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.75rem 0.9rem', margin: '1rem 0', background: '#fdfdfd' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Interactive Visibility Explorer</div>
      <p style={{ fontSize: '0.95rem' }}>Click a visibility modifier to see where it grants access.</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {Object.keys(VISIBILITY_DATA).map((key) => {
          const d = VISIBILITY_DATA[key];
          return (
            <button key={key} onClick={() => setActive(active === key ? null : key)}
              style={{ padding: '0.35rem 0.9rem', borderRadius: 4,
                border: `2px solid ${active === key ? d.border : '#ccc'}`,
                background: active === key ? d.bg : '#f8f8f8',
                color: active === key ? d.color : '#333',
                cursor: 'pointer', fontWeight: active === key ? 700 : 400,
                fontFamily: 'monospace', fontSize: '0.9rem', transition: 'all 0.15s' }}>
              {key}
            </button>
          );
        })}
      </div>
      {info ? (
        <div style={{ background: info.bg, border: `1px solid ${info.border}`, borderRadius: 5, padding: '0.7rem 0.9rem' }}>
          <div style={{ fontWeight: 700, color: info.color, fontFamily: 'monospace', fontSize: '1rem' }}>{info.label}</div>
          <div style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>
            <strong>Where it is accessible:</strong>
            <ul style={{ margin: '0.3rem 0 0.5rem 1.2rem' }}>
              {info.reach.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            <strong>Typical use case:</strong> {info.useCase}
          </div>
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: '0.9rem' }}>Select a modifier above to explore its access rules.</div>
      )}
    </div>
  );
}

function ContractAnatomy() {
  return (
    <section>
      <h3>2. Contract Anatomy — Types, Visibility, Modifiers, Events, Errors</h3>
      <p>A Solidity contract groups state variables, functions, modifiers, and events into a single deployable unit on the EVM.</p>
      <ExampleBox
        title="Minimal contract structure"
        description="A SimpleBank illustrates all four building blocks."
        bullets={[
          'State variable: mapping(address => uint256) public balances — persistent per-user balance.',
          'Constructor: runs once at deployment, sets msg.sender as owner.',
          'Modifier: onlyOwner() — reusable precondition; any function can inherit it with a single keyword.',
          'Event: Deposit(address indexed user, uint256 amount) — cheap, filterable log entry.',
        ]}
      />
      <CodeBlock code={`pragma solidity ^0.8.0;\n\ncontract SimpleBank {\n    mapping(address => uint256) public balances;\n    address public owner;\n\n    modifier onlyOwner() {\n        require(msg.sender == owner, "Not authorized");\n        _;  // continues function body\n    }\n\n    constructor() { owner = msg.sender; }\n\n    function deposit() public payable {\n        balances[msg.sender] += msg.value;\n        emit Deposit(msg.sender, msg.value);\n    }\n\n    event Deposit(address indexed user, uint256 amount);\n}`} />
      <h4>2.1 Visibility Modifiers</h4>
      <p>Every function and state variable has a visibility specifier that controls which callers may access it. Choosing the wrong visibility is one of the most common sources of security bugs.</p>
      <VisibilityExplorer />
      <QuizMCQ
        question="A helper function that should only be reused by contracts that inherit from yours, but never called externally, should be marked:"
        options={['public', 'external', 'internal', 'private']}
        correctIndex={2}
        explanation="internal restricts access to the contract itself and any derived contracts, making it right for shared helper logic that must not be exposed as a public API."
      />
      <h4>2.2 Custom Errors vs require strings</h4>
      <p>Since Solidity 0.8.4, custom errors replace long revert strings with typed, ABI-decodable values. They cost significantly less gas because the error selector is only 4 bytes.</p>
      <CodeBlock code={`// Old style — stores full string in bytecode\nrequire(balances[msg.sender] >= amount, "Insufficient balance");\n\n// New style — gas-efficient custom error\nerror InsufficientBalance(uint256 available, uint256 requested);\n\nfunction withdraw(uint256 amount) public {\n    if (balances[msg.sender] < amount)\n        revert InsufficientBalance(balances[msg.sender], amount);\n    // ...\n}`} />
      <QuizMCQ
        question="Why do custom errors (error keyword) cost less gas than require(condition, 'message') string reverts?"
        options={[
          'Custom errors skip the EVM revert opcode entirely.',
          'Custom errors encode only a 4-byte selector from a keccak256 hash, whereas string literals store every character on-chain.',
          'Custom errors are compiled to a no-op when the condition is false.',
          'Custom errors are only checked off-chain by the client.',
        ]}
        correctIndex={1}
        explanation="A custom error is identified by its 4-byte ABI selector. The descriptive string is never stored in deployed bytecode, so deployment is cheaper and reverts encode less data, reducing gas costs."
      />
    </section>
  );
}

/* ── Storage & Memory ──────────────────────────────────────────────────────── */

const LOC_COSTS = { storageWrite: 20000, storageRead: 800, memoryWord: 3, calldataByte: 4 };

function StorageCostEstimator() {
  const [sWrites, setSWrites] = useState(1);
  const [sReads,  setSReads]  = useState(2);
  const [mWords,  setMWords]  = useState(10);
  const [cdBytes, setCdBytes] = useState(64);

  const total =
    sWrites * LOC_COSTS.storageWrite + sReads  * LOC_COSTS.storageRead +
    mWords  * LOC_COSTS.memoryWord   + cdBytes * LOC_COSTS.calldataByte;
  const pct = (val) => Math.round((val / (total || 1)) * 100);
  const breakdown = [
    { label: 'Storage writes', cost: sWrites * LOC_COSTS.storageWrite, color: '#c52828' },
    { label: 'Storage reads',  cost: sReads  * LOC_COSTS.storageRead,  color: '#e6a800' },
    { label: 'Memory words',   cost: mWords  * LOC_COSTS.memoryWord,   color: '#1b8a2f' },
    { label: 'Calldata bytes', cost: cdBytes * LOC_COSTS.calldataByte, color: '#0077bb' },
  ];

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.75rem 0.9rem', margin: '1rem 0', background: '#fdfdfd' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Interactive Data-Location Cost Estimator (conceptual)</div>
      <p style={{ fontSize: '0.95rem' }}>Adjust the sliders to see how data location choices affect a transaction's gas footprint. Values are approximate pedagogical costs.</p>
      {[
        { label: `Storage writes  (+${LOC_COSTS.storageWrite.toLocaleString()} gas each)`, val: sWrites, set: setSWrites, max: 5,   step: 1  },
        { label: `Storage reads   (+${LOC_COSTS.storageRead.toLocaleString()} gas each)`,  val: sReads,  set: setSReads,  max: 20,  step: 1  },
        { label: `Memory words    (+${LOC_COSTS.memoryWord} gas each)`,                    val: mWords,  set: setMWords,  max: 200, step: 10 },
        { label: `Calldata bytes  (+${LOC_COSTS.calldataByte} gas each)`,                  val: cdBytes, set: setCdBytes, max: 512, step: 32 },
      ].map(({ label, val, set, max, step }) => (
        <div key={label} style={{ margin: '0.5rem 0' }}>
          <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem' }}>{label}</label>
          <input type="range" min={0} max={max} step={step} value={val}
            onChange={(e) => set(Number(e.target.value))} style={{ width: 200 }} />
          <span style={{ marginLeft: '0.5rem' }}>{val}</span>
        </div>
      ))}
      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', borderRadius: 4, background: '#f4f9ff' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Estimated gas: {total.toLocaleString()} units</div>
        {breakdown.map(({ label, cost, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
            <div style={{ width: `${Math.max(pct(cost), 1)}%`, maxWidth: 300, minWidth: 4, height: 14,
              background: color, borderRadius: 3, transition: 'width 0.25s' }} />
            <span>{label}: {cost.toLocaleString()} ({pct(cost)}%)</span>
          </div>
        ))}
        <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: '#555' }}>
          Storage writes dominate because persistent state is charged ~20,000 gas for new slot values.
        </div>
      </div>
    </div>
  );
}

function StorageSection() {
  return (
    <section>
      <h3>3. Storage vs Memory vs Calldata — Data Location Awareness</h3>
      <p>Every variable in Solidity must live somewhere. The choice determines persistence, gas cost, and mutability. Choosing the wrong location can waste thousands of gas or introduce subtle bugs.</p>
      <ExampleBox
        title="Three data locations at a glance"
        description={null}
        bullets={[
          "storage — persists between transactions; every slot is a 32-byte entry in the contract's on-chain state trie. Writes cost ~20,000 gas for a new slot.",
          'memory — temporary scratch space for a single transaction execution. Cleared when the call returns.',
          'calldata — read-only data passed in with the transaction. Cheapest to read; ideal for external function parameters.',
        ]}
      />
      <CodeBlock code={`contract StorageExample {\n    uint256 public value = 100;       // storage slot 0\n    address public owner;             // storage slot 1 (first 20 bytes)\n    bool    public initialized;       // storage slot 1 (packed, byte 20)\n    uint64  public timestamp;         // storage slot 2\n\n    mapping(address => uint256) public balances; // keccak256(key || slot)\n\n    function process(\n        uint256[] calldata prices,   // calldata: read-only, no copy\n        string   memory  label       // memory:   writable, temporary\n    ) public returns (uint256) {\n        uint256 sum = 0;\n        for (uint i = 0; i < prices.length; i++) { sum += prices[i]; }\n        return sum;\n    }\n}`} />
      <h4>3.1 Storage Layout Packing</h4>
      <ExampleBox
        title="Packing example: same types, fewer slots"
        description="Reordering variables with the same set of types can reduce the slot count."
        bullets={[
          'Unpacked: uint256 (slot 0), uint8 (slot 1), uint8 (slot 2) → 3 storage slots.',
          'Packed:   uint8 + uint8 (slot 0, 2 bytes used), uint256 (slot 1) → 2 storage slots.',
          'Rule of thumb: group small types together; place uint256 and mappings last.',
        ]}
      />
      <StorageCostEstimator />
      <QuizMCQ
        question="A public function receives a large dynamic array from an external caller and only reads it without modifying it. Which data location should the parameter use?"
        options={[
          'storage — so the array persists for future calls.',
          'memory — so the data can be modified inside the function.',
          'calldata — read-only, avoids copying data and minimises gas.',
          'stack — the default for dynamic arrays.',
        ]}
        correctIndex={2}
        explanation="calldata is the cheapest location for external function parameters that are not modified. It avoids an unnecessary copy into memory and marks the data as immutable, saving gas."
      />
      <QuizMCQ
        question="Why do storage writes cost far more gas than memory writes?"
        options={[
          'Storage writes use a slower hashing algorithm.',
          'Storage modifications update persistent on-chain state in the Merkle trie, which every node must record indefinitely.',
          'Memory writes are batched and processed at end of block.',
          'Storage writes require validator signatures.',
        ]}
        correctIndex={1}
        explanation="Persistent state lives in the global Merkle Patricia trie that all nodes replicate. Updating a storage slot adds long-term overhead to every full node, so the EVM charges ~20,000 gas for new storage writes."
      />
    </section>
  );
}

/* ── Interface-First Design ─────────────────────────────────────────────────── */

const INVARIANTS = [
  { id: 'supply',  label: 'totalSupply = \u03A3 balances',
    description: 'The sum of every account balance must always equal totalSupply. This invariant is violated if tokens are created or destroyed outside the mint/burn path.' },
  { id: 'nounder', label: 'balance[sender] \u2265 transfer amount',
    description: "A transfer must never allow a sender's balance to underflow below zero. The EVM uint256 wraps on underflow prior to Solidity 0.8, so an unchecked subtraction was a classic attack vector." },
  { id: 'vault',   label: 'contract.balance \u2265 totalDeposited',
    description: 'The ETH held by the Vault must never be less than what users collectively deposited. Violations indicate a reentrancy or accounting bug.' },
  { id: 'cei',     label: 'State updated before external call (CEI)',
    description: 'The Checks-Effects-Interactions pattern requires that internal state is updated before any external call, so a re-entrant call sees the already-modified state and cannot withdraw twice.' },
];

function InvariantExplorer() {
  const [active, setActive] = useState(null);
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.75rem 0.9rem', margin: '1rem 0', background: '#fdfdfd' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Interactive Invariant Explorer</div>
      <p style={{ fontSize: '0.95rem' }}>Click an invariant to understand why it matters and how it can be violated.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {INVARIANTS.map((inv) => (
          <div key={inv.id} onClick={() => setActive(active === inv.id ? null : inv.id)}
            style={{ padding: '0.45rem 0.75rem', borderRadius: 4,
              border: `1px solid ${active === inv.id ? '#0077bb' : '#ccc'}`,
              background: active === inv.id ? '#e8f6ff' : '#f8f8f8',
              cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.9rem', userSelect: 'none' }}>
            {inv.label}
          </div>
        ))}
      </div>
      {active && (
        <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', borderRadius: 4,
          background: '#f4f9ff', borderLeft: '4px solid #0077bb', fontSize: '0.9rem' }}>
          <strong>{INVARIANTS.find((i) => i.id === active).label}</strong>
          <p style={{ marginTop: '0.3rem' }}>{INVARIANTS.find((i) => i.id === active).description}</p>
        </div>
      )}
    </div>
  );
}

function InterfaceDesign() {
  return (
    <section>
      <h3>4. Interface-First Design — APIs and Invariants</h3>
      <p>Interface-first design means writing the public API and documenting invariants before any implementation. This forces you to reason about what the contract guarantees rather than how it achieves it.</p>
      <ExampleBox
        title="Workflow: define before implement"
        description={null}
        bullets={[
          '1. Write an interface (interface keyword) — function signatures only, no logic.',
          '2. List invariants as NatSpec comments above the contract.',
          '3. Implement the contract (contract MyToken is IERC20) — every function must preserve the invariants.',
          '4. Test that invariants hold across all reachable states (unit tests + fuzzing).',
        ]}
      />
      <CodeBlock code={`// Step 1 – define the public API\ninterface IERC20 {\n    function totalSupply()                            external view returns (uint256);\n    function balanceOf(address account)               external view returns (uint256);\n    function transfer(address to, uint256 amount)     external       returns (bool);\n    function approve(address spender, uint256 amount) external       returns (bool);\n}\n\n// Step 2 – document invariants before implementation\n/// @custom:invariant totalSupply == sum(balances[all accounts])\ncontract MyToken is IERC20 {\n    mapping(address => uint256) private _balances;\n    uint256 private _totalSupply;\n\n    // Checks-Effects-Interactions on every mutating function\n    function transfer(address to, uint256 amount) external returns (bool) {\n        require(_balances[msg.sender] >= amount, "ERC20: insufficient");\n        _balances[msg.sender] -= amount;   // Effect\n        _balances[to]         += amount;   // Effect\n        emit Transfer(msg.sender, to, amount);\n        return true;\n    }\n    event Transfer(address indexed from, address indexed to, uint256 value);\n}`} />
      <h4>4.1 Checks-Effects-Interactions (CEI)</h4>
      <p>CEI is the most important pattern for preventing reentrancy attacks: validate inputs (Checks), update state (Effects), then call external addresses (Interactions).</p>
      <InvariantExplorer />
      <QuizMCQ
        question="What is the primary benefit of writing an interface before implementing a smart contract?"
        options={[
          'Interfaces compile to smaller bytecode, saving deployment gas.',
          'Defining the API and invariants first separates concerns and ensures implementers reason about guarantees before internal details.',
          'Solidity requires an interface to be present before a contract can be compiled.',
          'Interfaces automatically generate unit tests for each function signature.',
        ]}
        correctIndex={1}
        explanation="Defining the public API and invariants first forces the designer to articulate what the contract guarantees for all callers, catching security and logic assumptions early before they become implementation bugs."
      />
      <QuizMCQ
        question="In the Checks-Effects-Interactions pattern, why must state variables be updated before external calls?"
        options={[
          'External calls revert if state has not changed.',
          'A re-entrant external call will observe the old (not yet updated) state, potentially allowing the same funds to be withdrawn multiple times.',
          'The EVM executes state updates asynchronously so they must be queued first.',
          'Updating state after an external call causes a gas refund.',
        ]}
        correctIndex={1}
        explanation="If a vulnerable function calls an external address before updating the caller's balance, a malicious contract can call back into the function. On re-entry, the balance has not yet been reduced, so the check passes again and funds are drained. CEI prevents this."
      />
    </section>
  );
}

/* ── Lab — Vault Simulator ───────────────────────────────────────────────────── */

const VAULT_USERS = ['Alice', 'Bob', 'Carol'];

function VaultSimulator() {
  const [balances, setBalances] = useState({ Alice: 0, Bob: 0, Carol: 0 });
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [selectedUser, setSelectedUser] = useState('Alice');
  const [amount, setAmount] = useState(1);
  const [log, setLog] = useState([]);

  const addLog = (msg) =>
    setLog((prev) => [msg, ...prev].slice(0, 12));

  const deposit = () => {
    if (amount <= 0) return;
    setBalances((b) => ({ ...b, [selectedUser]: b[selectedUser] + amount }));
    setTotalDeposited((t) => t + amount);
    addLog(`\u2193 ${selectedUser} deposited ${amount} ETH`);
  };

  const withdraw = () => {
    if (amount <= 0 || balances[selectedUser] < amount) {
      addLog(`\u26a0  ${selectedUser} tried to withdraw ${amount} ETH \u2014 insufficient balance`);
      return;
    }
    setBalances((b) => ({ ...b, [selectedUser]: b[selectedUser] - amount }));
    setTotalDeposited((t) => t - amount);
    addLog(`\u2191 ${selectedUser} withdrew ${amount} ETH`);
  };

  const invariantOk = totalDeposited >= 0 && Object.values(balances).reduce((a, b) => a + b, 0) === totalDeposited;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.9rem 1rem', margin: '1rem 0', background: '#fdfdfd' }}>
      <div style={{ fontWeight: 700, marginBottom: '0.6rem' }}>Interactive Vault Simulator</div>
      <p style={{ fontSize: '0.9rem' }}>Simulate deposits and withdrawals. The invariant panel verifies that contract.balance \u2265 totalDeposited at every step.</p>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '0.7rem' }}>
        <label style={{ fontSize: '0.9rem' }}>User:</label>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
          style={{ padding: '0.3rem 0.5rem', fontSize: '0.9rem', borderRadius: 4, border: '1px solid #ccc' }}>
          {VAULT_USERS.map((u) => <option key={u}>{u}</option>)}
        </select>
        <label style={{ fontSize: '0.9rem' }}>Amount (ETH):</label>
        <input type="number" min="1" max="20" value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ width: 64, padding: '0.3rem', fontSize: '0.9rem', borderRadius: 4, border: '1px solid #ccc' }} />
        <button onClick={deposit}
          style={{ padding: '0.3rem 1rem', background: '#2a7a2a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Deposit
        </button>
        <button onClick={withdraw}
          style={{ padding: '0.3rem 1rem', background: '#a02020', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Withdraw
        </button>
      </div>

      {/* Balances */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.7rem' }}>
        {VAULT_USERS.map((u) => (
          <div key={u} style={{ flex: '1 1 120px', padding: '0.5rem 0.7rem', background: '#f0f8f0',
            border: '1px solid #b0d0b0', borderRadius: 4, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>{u}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{balances[u]} ETH</div>
          </div>
        ))}
        <div style={{ flex: '1 1 140px', padding: '0.5rem 0.7rem', background: '#f8f0e0',
          border: '1px solid #d0b070', borderRadius: 4, textAlign: 'center' }}>
          <div style={{ fontWeight: 600 }}>totalDeposited</div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{totalDeposited} ETH</div>
        </div>
      </div>

      {/* Invariant badge */}
      <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: 4,
        background: invariantOk ? '#d4edda' : '#f8d7da',
        color: invariantOk ? '#155724' : '#721c24',
        fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.7rem' }}>
        Invariant: contract.balance \u2265 totalDeposited &mdash; {invariantOk ? '\u2714 HOLDS' : '\u2718 VIOLATED'}
      </div>

      {/* Event log */}
      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>Event Log</div>
      <div style={{ background: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace',
        fontSize: '0.82rem', padding: '0.6rem 0.8rem', borderRadius: 4, minHeight: 80, maxHeight: 160, overflowY: 'auto' }}>
        {log.length === 0
          ? <span style={{ color: '#888' }}>// no events yet</span>
          : log.map((entry, i) => <div key={i}>{entry}</div>)}
      </div>
    </div>
  );
}

function Lab() {
  return (
    <section>
      <h3>5. Lab — Build and Simulate an ETH Vault</h3>
      <p>In this lab you will study a simple ETH vault contract, then use the interactive simulator to observe how the CEI pattern and invariants protect user funds.</p>

      <h4>5.1 Vault Contract (Solidity)</h4>
      <CodeBlock code={`// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract Vault {\n    mapping(address => uint256) public balances;\n    uint256 public totalDeposited;\n\n    event Deposited(address indexed user, uint256 amount);\n    event Withdrawn(address indexed user, uint256 amount);\n\n    function deposit() external payable {\n        // Checks\n        require(msg.value > 0, "Must deposit > 0");\n        // Effects\n        balances[msg.sender] += msg.value;\n        totalDeposited       += msg.value;\n        // Interactions — none\n        emit Deposited(msg.sender, msg.value);\n    }\n\n    function withdraw(uint256 amount) external {\n        // Checks\n        require(balances[msg.sender] >= amount, "Insufficient balance");\n        // Effects  \u2190 must come before Interactions!\n        balances[msg.sender] -= amount;\n        totalDeposited       -= amount;\n        // Interactions\n        (bool ok, ) = msg.sender.call{value: amount}("");\n        require(ok, "Transfer failed");\n        emit Withdrawn(msg.sender, amount);\n    }\n}`} />

      <ExampleBox
        title="What does each on-chain event encode?"
        description={null}
        bullets={[
          'Deposited(user, amount) — emitted after effects are applied; indexed on user for off-chain indexers.',
          'Withdrawn(user, amount) — emitted after the ETH transfer succeeds; provides an auditable record.',
          'Events are stored in the transaction receipt (not contract storage) so they cost ~375 gas per topic.',
          'CEI means state is already final before the .call, so a re-entrant Withdrawn call will fail the require.',
        ]}
      />

      <VaultSimulator />

      <QuizMCQ
        question="A developer rewrites withdraw() to call msg.sender.call{value: amount}('') BEFORE reducing balances[msg.sender]. What is the consequence?"
        options={[
          'The function uses more gas because the external call is made earlier.',
          'A malicious contract can re-enter withdraw() before its balance is reduced, draining the vault beyond its own deposit.',
          'The function reverts because Solidity checks for CEI violations at compile time.',
          'No consequence; Solidity 0.8 prevents reentrancy automatically.',
        ]}
        correctIndex={1}
        explanation="Breaking CEI by placing the external call before the state update allows a malicious contract's fallback function to call withdraw() again. On re-entry the require passes (balance not yet reduced) and funds are sent a second time. This is the classic DAO / reentrancy exploit."
      />
    </section>
  );
}

/* ── Assessment ─────────────────────────────────────────────────────────────── */

const ASSESSMENT_QUESTIONS = [
  {
    q: '1. A Solidity function marked external pure attempts to modify a state variable. What happens at compile time?',
    a: 'The compiler emits a type error. pure functions are statically verified to neither read nor write state; any state mutation causes a compilation failure, not a runtime revert.',
  },
  {
    q: '2. Explain why storage variables cost more gas to write than memory variables.',
    a: 'Storage persists across transactions and is stored in the world state trie, so a cold SSTORE costs 20,000 gas and a warm SSTORE costs 2,900 gas. Memory is a transient scratch-space allocated per call frame; MSTORE costs only 3 gas. The world-state update (Merkle Patricia Trie proof re-computation and disk I/O) is the economic rationale for the high storage cost.',
  },
  {
    q: '3. What does the ABI encode for a function call, and why is this important for cross-contract communication?',
    a: 'The ABI encodes the 4-byte function selector (first 4 bytes of keccak256 of the canonical signature) followed by the ABI-encoded arguments. Cross-contract calls pass this byte array in the calldata field, so the callee knows which function to dispatch to and how to decode parameters. Without a shared ABI standard, contracts on different compilers/languages could not reliably call each other.',
  },
  {
    q: '4. Describe the Checks-Effects-Interactions pattern and give a concrete example of how violating it leads to a reentrancy attack.',
    a: 'CEI requires: (1) Checks — validate inputs and access control, (2) Effects — update all state variables, (3) Interactions — make external calls. Violation example: a withdraw() function that calls msg.sender.call{value: amount}("") before decrementing balances[msg.sender]. A malicious contract can re-enter withdraw() in its receive() fallback; the require(balances[msg.sender] >= amount) passes because the balance was not yet decremented, draining the vault. The 2016 DAO hack lost 3.6M ETH this way.',
  },
  {
    q: '5. What is the difference between an interface and an abstract contract in Solidity? When would you choose each?',
    a: 'An interface (interface keyword) may only contain external function signatures, custom errors, and events — no implementation, no state, no constructor. An abstract contract (abstract contract) can have state variables, a constructor, internal functions, and partial implementations. Choose an interface when you need a pure API/standard (e.g., ERC-20, ERC-721) that multiple unrelated contracts implement. Choose an abstract contract when you want to share logic and state between related contracts via inheritance.',
  },
  {
    q: '6. A contract emits an event in a function that later reverts. Are the events still recorded on-chain?',
    a: 'No. Events are part of the transaction receipt, which is only generated for successful (non-reverted) transactions. If a function reverts, all state changes and event emissions from that call frame are discarded. The transaction receipt records a failed status (status = 0) with no logs.',
  },
];

function Assessment() {
  const [show, setShow] = useState(false);
  return (
    <section>
      <h3>6. Assessment</h3>
      <p>Answer each question in writing before revealing the model answers. Use the Vault Simulator and code examples from earlier sections to inform your responses.</p>
      <ol style={{ lineHeight: 1.8 }}>
        {ASSESSMENT_QUESTIONS.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '0.75rem' }}>{item.q}</li>
        ))}
      </ol>
      <button
        onClick={() => setShow(!show)}
        style={{ margin: '1rem 0', padding: '0.45rem 1.2rem',
          background: show ? '#555' : '#0055aa', color: '#fff',
          border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.95rem' }}>
        {show ? 'Hide model answers' : 'Show model answers'}
      </button>
      {show && (
        <div style={{ marginTop: '0.5rem' }}>
          {ASSESSMENT_QUESTIONS.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', padding: '0.75rem 1rem',
              background: '#f9fbff', borderLeft: '4px solid #0055aa', borderRadius: 4 }}>
              <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Q{idx + 1}: {item.q}</div>
              <div style={{ fontSize: '0.92rem', lineHeight: 1.6 }}><strong>Model answer:</strong> {item.a}</div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </section>
  );
}
