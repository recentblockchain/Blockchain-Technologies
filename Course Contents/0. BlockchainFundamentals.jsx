import { useState, useEffect, useRef } from "react";

// ─── Palette & Fonts ────────────────────────────────────────────────────────
const G = {
  bg0: "#0a0c10",
  bg1: "#10141c",
  bg2: "#161c28",
  bg3: "#1e2636",
  border: "#2a3448",
  amber: "#f5a623",
  amberDim: "#c47f12",
  cyan: "#4dd9e0",
  cyanDim: "#2a8a90",
  red: "#e05c5c",
  green: "#4ec994",
  purple: "#9b72f5",
  text: "#d4dbe8",
  textMuted: "#7a8ba8",
  textBright: "#edf2f8",
  chain: "#f5a623",
};

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Mono:wght@400;600&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${G.bg0}; }
  ::-webkit-scrollbar { width: 6px; background: ${G.bg1}; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 3px; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes chainPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(245,166,35,0); } 50% { box-shadow: 0 0 0 6px rgba(245,166,35,0.18); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  { id: "intro", label: "§1 Introduction", short: "§1" },
  { id: "ledger", label: "§2 Ledger vs State Machine", short: "§2" },
  { id: "decentralization", label: "§3 Why Decentralization", short: "§3" },
  { id: "coreconcepts", label: "§4 Core Concepts", short: "§4" },
  { id: "blessings", label: "§5 Blessings & Curses", short: "§5" },
  { id: "quiz", label: "§6 Quizzes", short: "§6" },
  { id: "assessment", label: "§7 Assessment", short: "§7" },
];

const QUIZ_DATA = [
  {
    section: "§2 Ledger vs State Machine",
    q: "Which description best defines a blockchain as a distributed ledger?",
    options: [
      "A single server recording all account balances for users worldwide",
      "A replicated, append-only log of value-transfer transactions shared by many nodes",
      "A cloud database with a tamper-proof primary key",
      "A peer-to-peer file sharing network for arbitrary data",
    ],
    answer: 1,
    explanation:
      "A distributed ledger is an append-only, replicated record shared across nodes. Unlike a single server, no one party controls it. Unlike a generic database, entries are cryptographically linked.",
  },
  {
    section: "§2 Ledger vs State Machine",
    q: "In the state machine model of a blockchain, what represents a 'state transition'?",
    options: [
      "A miner adding a new node to the network",
      "A transaction changing the stored world-state (e.g., updating an account balance or a smart-contract variable)",
      "The replacement of an old block with a newer one",
      "A fork in the chain caused by simultaneous mining",
    ],
    answer: 1,
    explanation:
      "Each valid transaction is a function f(state, tx) → new_state. The blockchain records every such transition deterministically, so any node can replay history and arrive at the same current state.",
  },
  {
    section: "§3 Why Decentralization",
    q: "Which property of decentralization specifically prevents a government or corporation from freezing a user's funds?",
    options: [
      "Trust minimization",
      "Auditability",
      "Censorship resistance",
      "Transparency",
    ],
    answer: 2,
    explanation:
      "Censorship resistance means no single gatekeeper can block or reverse a valid transaction. Users interact directly with a permissionless network rather than requiring approval from a central authority.",
  },
  {
    section: "§3 Why Decentralization",
    q: "Trust minimization means participants rely on _____ rather than _____ to verify correctness.",
    options: [
      "third-party auditors … cryptographic proofs",
      "cryptographic proofs and consensus rules … the reputation of a central institution",
      "majority voting … open-source code",
      "hardware security modules … software validators",
    ],
    answer: 1,
    explanation:
      "Trust minimization replaces 'trust me, I'm a bank' with 'verify it yourself using math and code.' Anyone can run a node and independently confirm every rule was followed.",
  },
  {
    section: "§4 Core Concepts",
    q: "A transaction is considered to have reached practical finality after many confirmations because:",
    options: [
      "The protocol mathematically prevents any future modification",
      "Reversing the transaction would require re-mining an exponentially growing amount of proof-of-work",
      "The transaction was signed by a trusted certificate authority",
      "All nodes voted to accept the transaction via a BFT round",
    ],
    answer: 1,
    explanation:
      "In Nakamoto-style PoW, the attacker must outpace the honest chain. After k confirmations, this requires controlling >50% of hash power and re-doing k+ blocks of work—economically infeasible after 6+ confirmations in Bitcoin.",
  },
  {
    section: "§4 Core Concepts",
    q: "What distinguishes a hard fork from a soft fork?",
    options: [
      "Hard forks are planned; soft forks arise spontaneously from network latency",
      "In a hard fork, old-version nodes reject blocks produced by new-version nodes, splitting the network; a soft fork is backward-compatible",
      "A hard fork only affects miners; a soft fork only affects full nodes",
      "Hard forks increase block size; soft forks decrease it",
    ],
    answer: 1,
    explanation:
      "Backward compatibility is the key distinction. A soft fork tightens rules so old nodes still accept new blocks. A hard fork loosens or changes rules so old nodes reject them, potentially creating two permanent chains (e.g., ETH/ETC).",
  },
  {
    section: "§5 Blessings & Curses",
    q: "Which pairing correctly matches a blockchain 'blessing' with its corresponding 'curse'?",
    options: [
      "Transparency → enables surveillance of all wallet balances; Privacy → hides validator identities",
      "Resilience → no single point of failure; Complexity → harder upgrades, slower throughput, governance challenges",
      "Immutability → protects data; Scalability → too many nodes increase speed",
      "Decentralization → lowers fees; Auditability → requires identity verification",
    ],
    answer: 1,
    explanation:
      "Resilience through replication is bought at the cost of extreme operational complexity—every node replicates everything, consensus overhead slows finality, and protocol upgrades require global coordination.",
  },
  {
    section: "§5 Blessings & Curses",
    q: "A patient's blockchain-stored medical record illustrates which tension?",
    options: [
      "Resilience vs. Complexity",
      "Transparency vs. Privacy",
      "Trust minimization vs. Auditability",
      "Censorship resistance vs. Throughput",
    ],
    answer: 1,
    explanation:
      "Public blockchains make all data visible to every node—ideal for audit trails but catastrophic for personal health data. Mitigations include storing only hashes on-chain and encrypting off-chain payloads.",
  },
];

const ASSESSMENT = [
  {
    id: "A1",
    difficulty: "Foundational",
    color: G.green,
    problem:
      "Explain in your own words the difference between a distributed ledger and a distributed state machine. Give one example use-case best suited to each model.",
    answer: `Distributed Ledger: Records only transfers of value between parties. Nodes share an append-only log. Best for: cross-border payments, digital asset ownership registries (e.g., Bitcoin).

Distributed State Machine: Stores arbitrary evolving state. Any node running the same rules reaches the same current state. Transactions are state-transition functions. Best for: programmable DeFi protocols, on-chain governance, NFT marketplaces (e.g., Ethereum).

Key insight: Every blockchain is logically a state machine; "distributed ledger" is a conceptual simplification emphasizing the bookkeeping role rather than the computational model.`,
  },
  {
    id: "A2",
    difficulty: "Intermediate",
    color: G.amber,
    problem:
      "A startup proposes replacing a city's property registry with a public blockchain. Identify TWO specific advantages and TWO specific risks this introduces, referencing the properties of decentralized systems discussed in this chapter.",
    answer: `Advantages:
1. Auditability — Every ownership transfer is permanently visible; fraud (e.g., double-selling a property) is trivially detectable by any inspector.
2. Censorship Resistance — No corrupt official can secretly delete or alter a deed; the registry survives even institutional collapse.

Risks:
1. Transparency vs. Privacy — All parcel values and owner pseudonyms are public. Sophisticated analysis could de-anonymize wealthy owners, enabling targeted crime or tax evasion scrutiny.
2. Immutability vs. Error Correction — Legitimate errors (clerical mistakes, court-ordered corrections) are expensive or impossible to fix without a hard fork or an off-chain governance layer—introducing the complexity curse.`,
  },
  {
    id: "A3",
    difficulty: "Intermediate",
    color: G.amber,
    problem:
      "Trace the lifecycle of a single Bitcoin transaction from creation to practical finality. Your answer should mention: digital signature, mempool, block header, Merkle tree, confirmations, and the 51% attack threshold.",
    answer: `1. Creation & Signing: Alice constructs a transaction (UTXO inputs → outputs) and signs it with her private key via ECDSA. The digital signature proves ownership without revealing the key.

2. Broadcast & Mempool: Alice's wallet broadcasts the signed transaction to neighbor nodes. Each node validates the signature and UTXO existence, then places the tx in its mempool (unconfirmed pool).

3. Mining & Block Formation: A miner selects transactions, assembles them into a Merkle tree (leaf = txid, root = single hash summarizing all txs), and builds a block header: [prev_hash | Merkle_root | nonce | timestamp | target].

4. Proof of Work: The miner iterates the nonce until SHA256(SHA256(header)) < target. Finding this satisfies PoW; the block is broadcast.

5. Chain Inclusion (1 Confirmation): Other nodes validate the block and append it. Alice's tx has 1 confirmation.

6. Growing Confirmations: Each subsequent block adds 1 confirmation. After 6 confirmations (~60 min), reversing Alice's tx requires an attacker to control >50% of total hash power (51% attack threshold) AND re-mine 6+ blocks faster than the honest chain—economically infeasible at Bitcoin's current hash rate (~600 EH/s). Practical finality is reached.`,
  },
  {
    id: "A4",
    difficulty: "Advanced",
    color: G.red,
    problem:
      "Compare and contrast Proof of Work (PoW) and Proof of Stake (PoS) with respect to: (a) the resource used to earn block-production rights, (b) the nature of finality, and (c) the trade-off between security and complexity.",
    answer: `(a) Resource Used:
- PoW: Computational energy (hash rate). Miners burn electricity to solve puzzles; attack requires purchasing/renting real hardware → economic cost anchored to physical reality.
- PoS: Staked capital (native tokens). Validators lock coins as collateral; attack requires acquiring a large fraction of outstanding supply → economic cost anchored to token market value.

(b) Nature of Finality:
- PoW (Nakamoto): Probabilistic finality. Transactions become "practically final" after k confirmations; 100% certainty is asymptotically approached, never achieved.
- PoS (BFT-style, e.g., Ethereum's Casper FFG): Cryptoeconomic finality. After two checkpoint epochs, a supermajority of validators attest; reverting requires slashing ≥1/3 of all staked ETH (billions of dollars)—discrete, faster finality.

(c) Security vs. Complexity:
- PoW: Simpler protocol logic (add the heaviest chain); security derived from physical energy expenditure. Curse: enormous electricity waste, hardware centralization pressure.
- PoS: No energy waste. Curse: significantly more complex—validator selection, slashing conditions, long-range attack mitigations (weak subjectivity), liquid staking derivatives, and MEV dynamics all add protocol surface area and governance challenges.`,
  },
  {
    id: "A5",
    difficulty: "Advanced",
    color: G.red,
    problem:
      "Design a minimal Python pseudocode function that models a block in a Proof-of-Work blockchain. Your function should: create a block with (index, previous_hash, transactions, nonce), compute its hash, and implement a basic mine() loop. Annotate each step with its conceptual role.",
  answer: `import hashlib, json, time

class Block:
    def __init__(self, index, prev_hash, transactions):
        self.index       = index          # block height in chain
        self.prev_hash   = prev_hash      # links this block to its parent → chain integrity
        self.transactions = transactions  # payload: list of tx dicts
        self.timestamp   = time.time()
        self.nonce       = 0             # the variable miners iterate to find valid PoW

    def compute_hash(self):
        # Canonical serialization → deterministic hashing
        block_data = json.dumps({
            "index":        self.index,
            "prev_hash":    self.prev_hash,
            "transactions": self.transactions,
            "timestamp":    self.timestamp,
            "nonce":        self.nonce,
        }, sort_keys=True)
        return hashlib.sha256(block_data.encode()).hexdigest()

    def mine(self, difficulty: int) -> str:
        target = "0" * difficulty        # target: hash must start with 'difficulty' zeros
        # PoW loop — brute-force nonce until hash meets target
        while True:
            h = self.compute_hash()
            if h.startswith(target):     # found valid nonce → broadcast block
                return h
            self.nonce += 1              # try next nonce

# Usage
genesis = Block(0, "0" * 64, [])
genesis_hash = genesis.mine(difficulty=4)   # ~65000 iterations on average
# Each additional block: Block(1, genesis_hash, [tx1, tx2]).mine(4)
# Changing any field changes the hash → must re-mine → immutability`,
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const Chip = ({ children, color = G.amber }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 3,
      background: color + "22",
      border: `1px solid ${color}55`,
      color,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.05em",
    }}
  >
    {children}
  </span>
);

const SectionTag = ({ children }) => (
  <span
    style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
      color: G.amber,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </span>
);

const Divider = () => (
  <div
    style={{
      height: 1,
      background: `linear-gradient(90deg, ${G.amber}44, ${G.border}, transparent)`,
      margin: "32px 0",
    }}
  />
);

const InfoBox = ({ title, children, color = G.cyan, icon = "ℹ" }) => (
  <div
    style={{
      background: G.bg2,
      border: `1px solid ${color}44`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 6,
      padding: "16px 20px",
      margin: "20px 0",
      animation: "fadeIn 0.4s ease",
    }}
  >
    <div
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        color,
        marginBottom: 8,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {icon} {title}
    </div>
    <div style={{ color: G.text, fontSize: 14, lineHeight: 1.7 }}>
      {children}
    </div>
  </div>
);

const CodeBlock = ({ children, title }) => (
  <div
    style={{
      background: "#090c12",
      border: `1px solid ${G.border}`,
      borderRadius: 6,
      margin: "16px 0",
      overflow: "hidden",
    }}
  >
    {title && (
      <div
        style={{
          background: G.bg2,
          borderBottom: `1px solid ${G.border}`,
          padding: "6px 14px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: G.textMuted,
        }}
      >
        {title}
      </div>
    )}
    <pre
      style={{
        padding: "16px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12.5,
        color: G.cyan,
        lineHeight: 1.7,
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {children}
    </pre>
  </div>
);

const BodyText = ({ children, style = {} }) => (
  <p
    style={{
      fontFamily: "'Source Serif 4', serif",
      fontSize: 15.5,
      lineHeight: 1.85,
      color: G.text,
      margin: "14px 0",
      ...style,
    }}
  >
    {children}
  </p>
);

const H2 = ({ children }) => (
  <h2
    style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 28,
      fontWeight: 700,
      color: G.textBright,
      marginBottom: 6,
      lineHeight: 1.2,
    }}
  >
    {children}
  </h2>
);

const H3 = ({ children, color = G.amber }) => (
  <h3
    style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13,
      fontWeight: 600,
      color,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      margin: "24px 0 10px",
    }}
  >
    ▸ {children}
  </h3>
);

// ─── Visual: Chain diagram ───────────────────────────────────────────────────
const ChainDiagram = ({ animate = true }) => {
  const blocks = [
    { id: "B0", label: "Genesis", hash: "000a3f…", prev: "0000…", txs: 1, bg: G.bg3 },
    { id: "B1", label: "Block 1", hash: "000c7d…", prev: "000a3f…", txs: 3, bg: G.bg3 },
    { id: "B2", label: "Block 2", hash: "000912…", prev: "000c7d…", txs: 5, bg: G.bg3 },
    { id: "B3", label: "Block 3", hash: "000b44…", prev: "000912…", txs: 4, bg: `${G.amber}18` },
  ];
  return (
    <div style={{ overflowX: "auto", padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 520 }}>
        {blocks.map((b, i) => (
          <div key={b.id} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: b.bg,
                border: `1px solid ${i === 3 ? G.amber : G.border}`,
                borderRadius: 6,
                padding: "12px 14px",
                minWidth: 120,
                animation: animate ? `fadeIn 0.4s ease ${i * 0.12}s both` : "none",
              }}
            >
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.amber, marginBottom: 6, letterSpacing: "0.1em" }}>
                {b.id} {i === 3 && "← LATEST"}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.textBright, marginBottom: 4 }}>{b.label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.cyan }}>hash: {b.hash}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted }}>prev: {b.prev}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.green, marginTop: 4 }}>{b.txs} txs</div>
            </div>
            {i < blocks.length - 1 && (
              <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
                <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${G.border}, ${G.amber}88)` }} />
                <div style={{ color: G.amber, fontSize: 14 }}>▶</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted, marginTop: 10 }}>
        ↑ Each block's "prev" field equals the previous block's hash — creating the unbreakable chain.
      </div>
    </div>
  );
};

// ─── Visual: Node Network ────────────────────────────────────────────────────
const NodeNetwork = () => {
  const nodes = [
    { x: 50, y: 20, label: "Node A" },
    { x: 15, y: 55, label: "Node B" },
    { x: 85, y: 55, label: "Node C" },
    { x: 30, y: 85, label: "Node D" },
    { x: 70, y: 85, label: "Node E" },
  ];
  const edges = [[0,1],[0,2],[1,3],[2,4],[3,4],[1,2],[0,3]];
  return (
    <div style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 8, padding: 16, margin: "16px 0" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted, marginBottom: 8 }}>PEER-TO-PEER NETWORK — NO CENTRAL SERVER</div>
      <div style={{ position: "relative", height: 160 }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
              x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
              stroke={G.border} strokeWidth={1.5}
            />
          ))}
        </svg>
        {nodes.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: "translate(-50%,-50%)",
              textAlign: "center",
              animation: `chainPulse 2s ease ${i * 0.3}s infinite`,
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: G.bg3, border: `2px solid ${G.amber}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 13 }}>
              ⬡
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: G.textMuted, marginTop: 3 }}>{n.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Visual: Transaction Anatomy ─────────────────────────────────────────────
const TxDiagram = () => (
  <div style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 8, padding: 16, margin: "16px 0" }}>
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted, marginBottom: 12 }}>ANATOMY OF A BITCOIN TRANSACTION</div>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[
        { label: "VERSION", val: "02 00 00 00", color: G.purple, note: "Protocol version" },
        { label: "INPUTS", val: "UTXO ref + sig", color: G.cyan, note: "Who is sending" },
        { label: "OUTPUTS", val: "amount + pubkey", color: G.green, note: "Who receives" },
        { label: "LOCKTIME", val: "00 00 00 00", color: G.amberDim, note: "Earliest valid block" },
      ].map((f) => (
        <div key={f.label} style={{ background: G.bg3, border: `1px solid ${f.color}44`, borderTop: `2px solid ${f.color}`, borderRadius: 4, padding: "10px 12px", minWidth: 100, flex: 1 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: f.color, letterSpacing: "0.1em", marginBottom: 4 }}>{f.label}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textBright }}>{f.val}</div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 11, color: G.textMuted, marginTop: 4 }}>{f.note}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Visual: Fork Diagram ────────────────────────────────────────────────────
const ForkDiagram = () => (
  <div style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 8, padding: 16, margin: "16px 0", overflowX: "auto" }}>
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted, marginBottom: 12 }}>CHAIN FORK — TEMPORARY SPLIT</div>
    <div style={{ minWidth: 380, position: "relative" }}>
      {/* Shared base */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <div style={{ background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 4, padding: "6px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.textBright }}>B4</div>
        <div style={{ width: 20, height: 2, background: G.border }} />
        <div style={{ background: G.bg3, border: `1px solid ${G.amber}`, borderRadius: 4, padding: "6px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.textBright }}>B5</div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 8, gap: 14 }}>
          {/* Upper fork */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 20, height: 2, background: G.green }} />
            <div style={{ background: G.bg3, border: `1px solid ${G.green}`, borderRadius: 4, padding: "6px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.green }}>B6a ✓ (wins)</div>
            <div style={{ width: 20, height: 2, background: G.green }} />
            <div style={{ background: G.bg3, border: `1px solid ${G.green}`, borderRadius: 4, padding: "6px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.green }}>B7a</div>
          </div>
          {/* Lower fork */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 20, height: 2, background: G.red + "88" }} />
            <div style={{ background: G.bg3, border: `1px solid ${G.red}55`, borderRadius: 4, padding: "6px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.red + "99" }}>B6b ✗ (orphaned)</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted }}>
        → Nodes switch to the longer chain (B6a→B7a). B6b becomes an orphan — its transactions re-enter the mempool.
      </div>
    </div>
  </div>
);

// ─── SECTION COMPONENTS ──────────────────────────────────────────────────────

const IntroSection = () => (
  <div style={{ animation: "fadeIn 0.5s ease" }}>
    <SectionTag>§1 — Introduction</SectionTag>
    <H2>Blockchain Fundamentals</H2>
    <div style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", color: G.textMuted, fontSize: 14, marginBottom: 24, marginTop: 8 }}>
      ACM Educational Series · Distributed Systems Track
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, margin: "20px 0" }}>
      {[
        { icon: "⛓", label: "Distributed Ledger", sub: "Shared append-only log" },
        { icon: "⚙", label: "State Machine", sub: "Deterministic transitions" },
        { icon: "🔒", label: "Cryptographic Links", sub: "Hash-chained blocks" },
        { icon: "🌐", label: "Peer-to-Peer", sub: "No central authority" },
      ].map((c) => (
        <div key={c.label} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 8, padding: "16px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.amber, fontWeight: 600 }}>{c.label}</div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: G.textMuted, marginTop: 4 }}>{c.sub}</div>
        </div>
      ))}
    </div>

    <BodyText>
      A <strong style={{ color: G.amber }}>blockchain</strong> is a distributed, append-only data structure in which records are grouped into cryptographically linked blocks. First described operationally by Satoshi Nakamoto in the 2008 Bitcoin whitepaper, the concept has since generalized into a foundational primitive for trustless coordination among mutually distrusting parties.
    </BodyText>
    <BodyText>
      This chapter builds intuition from first principles, covering the conceptual models, motivating forces, key operational primitives, and the inherent engineering trade-offs that every practitioner must understand before deploying or analyzing blockchain-based systems.
    </BodyText>

    <InfoBox title="Learning Objectives" icon="🎯" color={G.green}>
      After completing this chapter you will be able to: (1) distinguish the ledger and state-machine views of a blockchain; (2) articulate the three pillars of decentralization; (3) trace a transaction from creation to finality; (4) identify and analyze the core tensions in blockchain system design.
    </InfoBox>

    <Divider />
    <H3 color={G.textMuted}>Historical Context</H3>
    <BodyText>
      Distributed ledgers predate cryptocurrency—inter-bank settlement systems such as SWIFT use replicated ledgers. What Bitcoin introduced was a <em>permissionless</em>, <em>trustless</em> variant: anyone can join, and correctness is enforced by cryptography and economic incentives rather than by legal contracts between known parties.
    </BodyText>
  </div>
);

const LedgerSection = () => {
  const [tab, setTab] = useState("ledger");
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <SectionTag>§2 — Core Models</SectionTag>
      <H2>Distributed Ledger vs. Distributed State Machine</H2>

      <BodyText>
        A blockchain can be understood through two complementary conceptual lenses. Choosing the right lens depends on what the system is primarily used for.
      </BodyText>

      <div style={{ display: "flex", gap: 0, margin: "20px 0 0", border: `1px solid ${G.border}`, borderRadius: 8, overflow: "hidden" }}>
        {[["ledger", "Distributed Ledger"], ["state", "Distributed State Machine"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1, padding: "12px 16px", border: "none", cursor: "pointer",
              background: tab === key ? G.bg3 : G.bg2,
              color: tab === key ? G.amber : G.textMuted,
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
              borderBottom: tab === key ? `2px solid ${G.amber}` : `2px solid transparent`,
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: G.bg2, border: `1px solid ${G.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "20px", animation: "fadeIn 0.3s ease" }}>
        {tab === "ledger" ? (
          <>
            <H3>The Distributed Ledger Model</H3>
            <BodyText>
              A <strong style={{ color: G.cyan }}>distributed ledger</strong> is conceptually a shared bookkeeping record. Like an accounting ledger, it tracks who owns what value. The "distributed" aspect means thousands of nodes each hold a full copy.
            </BodyText>
            <InfoBox title="Simple Example: Bitcoin" icon="₿" color={G.amber}>
              Alice has 1 BTC. She sends 0.4 BTC to Bob. The ledger records: <br />
              <code style={{ fontFamily: "'IBM Plex Mono', monospace", color: G.cyan }}>Alice: 1 BTC → Bob: 0.4 BTC, Alice: 0.6 BTC (change)</code><br /><br />
              All 15,000+ Bitcoin full nodes independently verify and record this entry. There is no "Bitcoin Bank" approving transfers.
            </InfoBox>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { k: "Data Type", v: "Value transfers (who → who, how much)" },
                { k: "Storage", v: "UTXO set or account balance map" },
                { k: "Key Property", v: "Append-only; no deletion or editing" },
                { k: "Example", v: "Bitcoin, Litecoin, basic payment chains" },
              ].map(r => (
                <div key={r.k} style={{ background: G.bg3, borderRadius: 4, padding: "10px 12px" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.amber }}>{r.k}</div>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, marginTop: 4 }}>{r.v}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <H3>The Distributed State Machine Model</H3>
            <BodyText>
              A <strong style={{ color: G.purple }}>distributed state machine (DSM)</strong> is a more general model. The blockchain stores an arbitrary <em>world state</em>—not just balances, but any data structure. Every transaction is a <em>state-transition function</em>:
            </BodyText>
            <CodeBlock title="State Machine Formalism">
{`f(current_state, transaction) → next_state

# Ethereum example — ERC-20 token transfer:
state = { alice: 100, bob: 50, total_supply: 1000 }
tx    = transfer(from=alice, to=bob, amount=20)
f(state, tx) → { alice: 80, bob: 70, total_supply: 1000 }

# Smart contract call — any arbitrary logic:
tx = swap(tokenIn=ETH, tokenOut=USDC, amount=1)
f(state, tx) → new AMM reserve ratios, new balances`}
            </CodeBlock>
            <InfoBox title="Why This Matters" icon="⚙" color={G.purple}>
              The DSM model enables <strong>smart contracts</strong>: self-executing code stored on-chain. Every node runs the same code deterministically, so the result is globally verifiable without trusting any single executor. This powers DeFi, DAOs, NFTs, and on-chain governance.
            </InfoBox>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { k: "Data Type", v: "Arbitrary structured state + code" },
                { k: "Storage", v: "Merkle Patricia trie (Ethereum) or similar" },
                { k: "Key Property", v: "Deterministic transitions; Turing-complete logic" },
                { k: "Example", v: "Ethereum, Solana, Avalanche" },
              ].map(r => (
                <div key={r.k} style={{ background: G.bg3, borderRadius: 4, padding: "10px 12px" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.purple }}>{r.k}</div>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, marginTop: 4 }}>{r.v}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Divider />
      <H3>Visual: The Chain Structure</H3>
      <ChainDiagram />

      <InfoBox title="Key Insight: Both Models are Compatible" icon="💡" color={G.green}>
        Every blockchain is technically a state machine (the ledger model is just a restricted version where state = balances). The distinction is useful because it tells us what we <em>can store</em> and <em>how complex</em> the consensus overhead becomes.
      </InfoBox>
    </div>
  );
};

const DecentralizationSection = () => {
  const [expanded, setExpanded] = useState(null);
  const pillars = [
    {
      id: "trust",
      icon: "🔐",
      title: "Trust Minimization",
      color: G.amber,
      short: "Replace institutional trust with cryptographic proof.",
      detail: `Traditional systems require you to trust a bank, a government, or a corporation to behave correctly. Blockchain replaces this with mathematical verification: you don't need to trust a node operator because you can verify every rule was followed using your own copy of the software.\n\nExample: When Alice sends Bob 1 BTC, neither needs to trust a payment processor. They both verify the transaction satisfies: (a) Alice's digital signature is valid, (b) the UTXO exists and is unspent, and (c) input amounts ≥ output amounts. The code enforces these rules identically on every node worldwide.`,
      code: `# Trust minimization in action
# Traditional: "Trust our bank records"
bank.transfer(alice, bob, amount=100)  # black box

# Blockchain: Anyone can verify
assert verify_signature(tx.sig, alice.pubkey)
assert utxo_exists(tx.input)
assert tx.input.value >= tx.output.value + tx.fee
# All nodes run this — no trust required`,
    },
    {
      id: "censorship",
      icon: "🚫",
      title: "Censorship Resistance",
      color: G.cyan,
      short: "No single gatekeeper can block or reverse valid transactions.",
      detail: `In a permissioned system, a bank, government, or platform operator can freeze accounts, reverse transactions, or exclude users. Blockchain networks are designed so that any node with the right fee can submit a valid transaction, and no majority of honest miners/validators can be compelled to exclude it indefinitely.\n\nExample: Journalists in authoritarian regimes can receive donations without their local payment processor blocking the transfer. Dissidents can store proof of human rights violations in an immutable, global record that no single government can delete.`,
      code: `# Censorship resistance: permissionless submission
# Any node can broadcast a valid tx
def broadcast(tx):
    if is_valid(tx):                  # only rule: validity
        propagate_to_peers(tx)        # no identity check
        # no "is sender approved?" gate
        # no geographic restriction
        return "accepted"
    return "invalid"

# Contrast: PayPal ToS §4.2 — can freeze for "risk"`,
    },
    {
      id: "audit",
      icon: "🔍",
      title: "Auditability",
      color: G.green,
      short: "Every historical state transition is publicly inspectable.",
      detail: `All transactions on a public blockchain are permanently recorded and globally accessible. Anyone with a block explorer can trace the provenance of any coin, verify that a smart contract executed correctly, or audit an organization's on-chain treasury.\n\nExample: A non-profit publishes its Ethereum address. Donors can independently verify that every dollar was spent as claimed—no auditor or accountant required. Contrast this with corporate financial reporting, where the public depends entirely on auditors they didn't choose.`,
      code: `# Auditability: independent verification
import requests

def audit_address(addr):
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={addr}"
    txs = requests.get(url).json()["result"]
    
    total_in  = sum(int(t["value"]) for t in txs if t["to"]   == addr)
    total_out = sum(int(t["value"]) for t in txs if t["from"] == addr)
    
    return {"received": total_in, "sent": total_out}
# Anyone can run this — no permission needed`,
    },
  ];

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <SectionTag>§3 — Motivations</SectionTag>
      <H2>Why Decentralization Exists</H2>
      <BodyText>
        Decentralization is not a goal in itself—it is a set of <em>mechanisms</em> that achieve properties impossible or impractical under centralized control. Three pillars motivate almost every design decision in blockchain systems.
      </BodyText>

      <NodeNetwork />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" }}>
        {pillars.map((p) => (
          <div
            key={p.id}
            style={{ background: G.bg2, border: `1px solid ${expanded === p.id ? p.color + "66" : G.border}`, borderRadius: 8, overflow: "hidden", transition: "border-color 0.2s" }}
          >
            <button
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              style={{ width: "100%", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}
            >
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: p.color, fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.textMuted, marginTop: 3 }}>{p.short}</div>
              </div>
              <div style={{ color: G.textMuted, fontSize: 18, transform: expanded === p.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>▶</div>
            </button>
            {expanded === p.id && (
              <div style={{ borderTop: `1px solid ${G.border}`, padding: "16px 18px", animation: "fadeIn 0.3s ease" }}>
                <BodyText>{p.detail}</BodyText>
                <CodeBlock title={`Example: ${p.title}`}>{p.code}</CodeBlock>
              </div>
            )}
          </div>
        ))}
      </div>

      <InfoBox title="The Trilemma" icon="△" color={G.purple}>
        Vitalik Buterin articulated the <strong>Blockchain Trilemma</strong>: a system can optimize for at most two of {"{"}Decentralization, Security, Scalability{"}"} simultaneously. This explains why Bitcoin sacrifices throughput (7 tx/s) to preserve security and decentralization, while some chains sacrifice decentralization (fewer validators) to achieve speed.
      </InfoBox>
    </div>
  );
};

const CoreConceptsSection = () => {
  const [activeConcept, setActiveConcept] = useState("transactions");
  const concepts = {
    transactions: {
      label: "Transactions",
      icon: "📄",
      color: G.cyan,
      content: (
        <>
          <BodyText>A <strong style={{ color: G.cyan }}>transaction</strong> is an atomic instruction that moves value or triggers computation on the blockchain. It must be cryptographically signed by the initiating party.</BodyText>
          <TxDiagram />
          <H3 color={G.cyan}>Transaction Lifecycle</H3>
          <CodeBlock title="Bitcoin Transaction Flow">{`1. Creation:   Alice creates tx: UTXO(Alice,1BTC) → Bob:0.4BTC, Alice:0.599BTC (fee=0.001)
2. Signing:    sig = ECDSA_sign(tx_hash, alice_private_key)
3. Broadcast:  tx + sig sent to connected peers
4. Validation: each node checks: sig valid? UTXO unspent? inputs ≥ outputs?
5. Mempool:    valid tx enters memory pool, awaiting inclusion
6. Mining:     miner includes tx in next block
7. Confirmed:  tx has 1 confirmation (depth = 1 in chain)`}</CodeBlock>
          <InfoBox title="UTXO vs Account Model" icon="⚖" color={G.cyan}>
            <strong>Bitcoin</strong> uses the UTXO (Unspent Transaction Output) model — each tx consumes previous outputs and creates new ones. <strong>Ethereum</strong> uses an account model — addresses have explicit balances, like bank accounts. UTXOs enable higher parallelism; accounts enable simpler smart contract state.
          </InfoBox>
        </>
      ),
    },
    blocks: {
      label: "Blocks",
      icon: "📦",
      color: G.amber,
      content: (
        <>
          <BodyText>A <strong style={{ color: G.amber }}>block</strong> is a batch of transactions bundled with metadata. Transactions are committed to the chain in bulk, not individually, which amortizes the overhead of consensus.</BodyText>
          <CodeBlock title="Block Structure (Bitcoin-style)">{`Block Header:
  version        4 bytes   — protocol version
  prev_hash     32 bytes   — hash of previous block (the "chain link")
  merkle_root   32 bytes   — root hash of all transactions in this block
  timestamp      4 bytes   — approximate mining time
  bits           4 bytes   — encoded difficulty target
  nonce          4 bytes   — the value miners iterate to solve PoW

Block Body:
  tx_count      varint     — number of transactions
  transactions  []         — list of raw serialized transactions`}</CodeBlock>
          <InfoBox title="Why the Merkle Root Matters" icon="🌳" color={G.amber}>
            Transactions in a block are hashed in a binary Merkle tree. The root hash commits to all of them in O(log n) space. Light clients (SPV wallets) only need the block header + a Merkle proof to verify a specific transaction — they don't download the entire block.
          </InfoBox>
          <ChainDiagram />
        </>
      ),
    },
    nodes: {
      label: "Nodes",
      icon: "🖥",
      color: G.green,
      content: (
        <>
          <BodyText>A <strong style={{ color: G.green }}>node</strong> is any participant in the blockchain network running protocol software. Nodes form the substrate of decentralization.</BodyText>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, margin: "16px 0" }}>
            {[
              { type: "Full Node", color: G.green, desc: "Stores entire blockchain history. Independently validates every block and transaction. The backbone of decentralization." },
              { type: "Light Node (SPV)", color: G.cyan, desc: "Stores only block headers (~80 bytes each). Verifies transactions with Merkle proofs. Used in mobile wallets." },
              { type: "Miner / Validator", color: G.amber, desc: "Proposes new blocks. In PoW: solves hash puzzles. In PoS: selected proportional to stake." },
              { type: "Archive Node", color: G.purple, desc: "Stores full history including all intermediate states. Required for historical queries and smart contract debugging." },
            ].map(n => (
              <div key={n.type} style={{ background: G.bg3, border: `1px solid ${n.color}33`, borderTop: `2px solid ${n.color}`, borderRadius: 6, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: n.color, fontWeight: 600, marginBottom: 8 }}>{n.type}</div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, lineHeight: 1.6 }}>{n.desc}</div>
              </div>
            ))}
          </div>
          <NodeNetwork />
        </>
      ),
    },
    forks: {
      label: "Forks",
      icon: "🍴",
      color: G.red,
      content: (
        <>
          <BodyText>A <strong style={{ color: G.red }}>fork</strong> occurs when two valid but conflicting blocks extend the chain at the same height. Forks arise naturally from network latency or are deliberately introduced via protocol upgrades.</BodyText>
          <ForkDiagram />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0" }}>
            <div style={{ background: G.bg3, border: `1px solid ${G.amber}44`, borderRadius: 6, padding: "14px" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.amber, marginBottom: 8 }}>SOFT FORK</div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, lineHeight: 1.6 }}>Tightens existing rules. Old nodes still accept new blocks (backward-compatible). Example: Bitcoin's SegWit (2017) — restructured tx format, old nodes see it as valid "anyone can spend" output.</div>
            </div>
            <div style={{ background: G.bg3, border: `1px solid ${G.red}44`, borderRadius: 6, padding: "14px" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.red, marginBottom: 8 }}>HARD FORK</div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, lineHeight: 1.6 }}>Changes rules incompatibly. Old nodes reject new blocks. Can permanently split the chain into two if both sides continue mining. Example: Ethereum/Ethereum Classic split (2016) after the DAO hack.</div>
            </div>
          </div>
        </>
      ),
    },
    finality: {
      label: "Confirmations & Finality",
      icon: "✅",
      color: G.purple,
      content: (
        <>
          <BodyText>
            <strong style={{ color: G.purple }}>Finality</strong> is the guarantee that a committed transaction cannot be reversed. In blockchain systems, finality exists on a spectrum from probabilistic to cryptoeconomic.
          </BodyText>
          <H3 color={G.purple}>Confirmations in Proof of Work</H3>
          <BodyText>
            Each new block added on top of the block containing your transaction adds one <em>confirmation</em>. Reversing a transaction requires re-mining all blocks from that point — an exponentially growing task.
          </BodyText>
          <CodeBlock title="Probabilistic Finality (Bitcoin)">{`# P(attacker reverses tx) after k confirmations
# Assuming attacker controls fraction q of hash power

import math

def reversal_probability(q: float, k: int) -> float:
    """Nakamoto (2008) formula — attacker with q < 0.5"""
    p = 1 - q  # honest fraction
    lam = k * (q / p)  # Poisson parameter
    total = 1.0
    for i in range(k):
        poisson = math.exp(-lam) * (lam**i) / math.factorial(i)
        total -= poisson * (1 - (q/p)**(k-i))
    return max(0, total)

# q=0.1 (10% attacker), k=6 confirmations
print(reversal_probability(0.1, 6))  # ≈ 0.000024 (0.0024%)
print(reversal_probability(0.3, 6))  # ≈ 0.1773 (17.7% — still risky!)`}</CodeBlock>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, margin: "16px 0" }}>
            {[["1 conf", "~10 min", "Low-value tx", G.green + "55"],["3 conf", "~30 min", "Standard", G.amber + "55"],["6 conf", "~60 min", "High value", G.cyan + "55"],["100+ conf", "~17 hr", "Coinbase reward", G.purple + "55"]].map(([c, t, u, bg]) => (
              <div key={c} style={{ background: bg, border: `1px solid ${G.border}`, borderRadius: 4, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: G.textBright }}>{c}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted }}>{t}</div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 11, color: G.text, marginTop: 4 }}>{u}</div>
              </div>
            ))}
          </div>
          <InfoBox title="Proof of Stake: Cryptoeconomic Finality" icon="⚡" color={G.purple}>
            Ethereum's Casper FFG achieves <em>finality</em> after two checkpoint epochs (~12.8 min). Reversing a finalized block requires slashing ≥1/3 of all staked ETH — currently billions of dollars. This is deterministic finality with economic cost, not probabilistic finality with time cost.
          </InfoBox>
        </>
      ),
    },
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <SectionTag>§4 — Core Concepts</SectionTag>
      <H2>Transactions, Blocks, Nodes, Forks & Finality</H2>
      <BodyText>Five interlocking concepts form the operational vocabulary of every blockchain system. Understanding each in isolation and in combination is essential for reasoning about security, performance, and correctness.</BodyText>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0 0" }}>
        {Object.entries(concepts).map(([key, c]) => (
          <button
            key={key}
            onClick={() => setActiveConcept(key)}
            style={{
              padding: "8px 16px", border: `1px solid ${activeConcept === key ? c.color : G.border}`, borderRadius: 20, cursor: "pointer",
              background: activeConcept === key ? c.color + "22" : G.bg2,
              color: activeConcept === key ? c.color : G.textMuted,
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, transition: "all 0.2s",
            }}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 8, padding: "20px", marginTop: 0, borderTopLeftRadius: 0, animation: "fadeIn 0.3s ease" }}>
        {concepts[activeConcept].content}
      </div>
    </div>
  );
};

const BlessingsCursesSection = () => {
  const pairs = [
    {
      blessing: { title: "Transparency", icon: "👁", color: G.green, desc: "All transactions are publicly visible on a public blockchain. Anyone can audit flows, verify balances, and hold participants accountable." },
      curse: { title: "Privacy Erosion", icon: "🕵", color: G.red, desc: "Wallet addresses are pseudonymous, not anonymous. Sophisticated chain analysis can de-anonymize users, exposing financial histories, health transactions, or political donations." },
      example: "A journalist can prove a corrupt official received bribes — but a domestic abuse survivor's payments to a shelter are also visible to anyone.",
    },
    {
      blessing: { title: "Resilience", icon: "🏛", color: G.cyan, desc: "No single point of failure. With 15,000+ nodes, Bitcoin can survive data center outages, country-level internet shutdowns, and targeted attacks on major operators." },
      curse: { title: "Operational Complexity", icon: "⚙", color: G.amber, desc: "Every node replicates everything. Upgrades require global coordination (and often contentious forks). Throughput is bounded by the weakest node. Governance is emergent and slow." },
      example: "Bitcoin has 99.98% uptime since 2009 — but changing a single protocol parameter required years of community debate and a contentious hard fork.",
    },
    {
      blessing: { title: "Immutability", icon: "🔒", color: G.purple, desc: "Once deeply confirmed, records cannot be altered or deleted. This is powerful for audit trails, provenance tracking, and tamper-evident timestamping." },
      curse: { title: "Error Irrecoverability", icon: "💀", color: G.red, desc: "Lost private keys mean permanently inaccessible funds (est. 3-4M BTC lost forever). Bugs in deployed smart contracts cannot be patched without contentious forks. 'Code is law' cuts both ways." },
      example: "The 2016 Ethereum DAO hack: ~$60M stolen via a smart contract bug. The only 'fix' was a hard fork that violated immutability — splitting the community.",
    },
    {
      blessing: { title: "Permissionless Access", icon: "🌐", color: G.amber, desc: "Anyone with internet access can create a wallet and transact. No KYC, credit check, or bank account required. ~1.4B unbanked adults could access financial services." },
      curse: { title: "Illicit Use", icon: "⚠", color: G.red, desc: "The same permissionless access enables ransomware payments, dark market activity, and sanctions evasion. Regulation is technically difficult, creating ongoing legal and reputational risk for the ecosystem." },
      example: "Tornado Cash (Ethereum mixer) was sanctioned by the US Treasury in 2022 — a novel legal challenge to open-source, immutable, permissionless code.",
    },
  ];

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <SectionTag>§5 — Tensions & Trade-offs</SectionTag>
      <H2>Blessings and Curses in Blockchain Systems</H2>
      <BodyText>
        Every structural property of a blockchain that enables a benefit simultaneously enables — or <em>is</em> — a liability in another context. Engineering blockchain systems requires honest confrontation with these tensions, not optimistic handwaving.
      </BodyText>

      <InfoBox title="Design Philosophy" icon="⚖" color={G.amber}>
        There are no free lunches in distributed systems. The properties that make blockchains useful — openness, immutability, decentralization — are the same properties that make them hard to govern, regulate, and scale. Every design decision moves along these trade-off axes.
      </InfoBox>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "20px 0" }}>
        {pairs.map((pair, i) => (
          <div key={i} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "16px 18px", borderRight: `1px solid ${G.border}`, background: pair.blessing.color + "0a" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: pair.blessing.color, letterSpacing: "0.12em", marginBottom: 8 }}>✦ BLESSING</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: pair.blessing.color, fontWeight: 600, marginBottom: 8 }}>{pair.blessing.icon} {pair.blessing.title}</div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, lineHeight: 1.65 }}>{pair.blessing.desc}</div>
              </div>
              <div style={{ padding: "16px 18px", background: pair.curse.color + "0a" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: pair.curse.color, letterSpacing: "0.12em", marginBottom: 8 }}>✦ CURSE</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: pair.curse.color, fontWeight: 600, marginBottom: 8 }}>{pair.curse.icon} {pair.curse.title}</div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, lineHeight: 1.65 }}>{pair.curse.desc}</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${G.border}`, padding: "10px 18px", background: G.bg3 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted, marginRight: 8 }}>REAL-WORLD TENSION →</span>
              <span style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", fontSize: 13, color: G.textMuted }}>{pair.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── QUIZ COMPONENT ───────────────────────────────────────────────────────────
const QuizSection = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [score, setScore] = useState(null);

  const handleSelect = (qi, oi) => {
    if (submitted[qi]) return;
    setAnswers((p) => ({ ...p, [qi]: oi }));
  };

  const handleSubmit = (qi) => {
    if (answers[qi] === undefined) return;
    setSubmitted((p) => ({ ...p, [qi]: true }));
  };

  const handleFinalScore = () => {
    let correct = 0;
    QUIZ_DATA.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
  };

  const allAnswered = QUIZ_DATA.every((_, i) => submitted[i]);

  const bySection = QUIZ_DATA.reduce((acc, q, i) => {
    (acc[q.section] = acc[q.section] || []).push({ ...q, idx: i });
    return acc;
  }, {});

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <SectionTag>§6 — In-Class Quizzes</SectionTag>
      <H2>Knowledge Checks</H2>
      <BodyText>Answer each question, then click Submit to reveal the explanation. Your score is tallied at the bottom once all questions are answered.</BodyText>

      {score !== null && (
        <div style={{ background: score >= 6 ? G.green + "18" : score >= 4 ? G.amber + "18" : G.red + "18", border: `1px solid ${score >= 6 ? G.green : score >= 4 ? G.amber : G.red}55`, borderRadius: 8, padding: "20px 24px", margin: "20px 0", textAlign: "center", animation: "fadeIn 0.4s ease" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: score >= 6 ? G.green : score >= 4 ? G.amber : G.red }}>{score}/{QUIZ_DATA.length}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: G.text, marginTop: 8 }}>
            {score === QUIZ_DATA.length ? "Perfect score! Outstanding mastery of blockchain fundamentals." : score >= 6 ? "Strong understanding. Review any missed questions below." : score >= 4 ? "Good foundation. Revisit the sections covering your missed questions." : "Review the chapter content before retrying."}
          </div>
        </div>
      )}

      {Object.entries(bySection).map(([section, qs]) => (
        <div key={section} style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.amber, letterSpacing: "0.1em", margin: "24px 0 12px", borderBottom: `1px solid ${G.border}`, paddingBottom: 8 }}>{section}</div>
          {qs.map((q) => {
            const i = q.idx;
            const isSubmitted = submitted[i];
            const isCorrect = answers[i] === q.answer;
            return (
              <div key={i} style={{ background: G.bg2, border: `1px solid ${isSubmitted ? (isCorrect ? G.green + "55" : G.red + "55") : G.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: G.textBright, marginBottom: 14, lineHeight: 1.6 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.textMuted, marginRight: 8 }}>Q{i + 1}.</span>
                  {q.q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt, oi) => {
                    let bg = G.bg3;
                    let border = G.border;
                    let color = G.text;
                    if (isSubmitted) {
                      if (oi === q.answer) { bg = G.green + "22"; border = G.green; color = G.green; }
                      else if (oi === answers[i] && oi !== q.answer) { bg = G.red + "18"; border = G.red; color = G.red; }
                    } else if (answers[i] === oi) {
                      bg = G.amber + "18"; border = G.amber; color = G.amber;
                    }
                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelect(i, oi)}
                        style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px", cursor: isSubmitted ? "default" : "pointer", textAlign: "left", fontFamily: "'Source Serif 4', serif", fontSize: 14, color, lineHeight: 1.5, transition: "all 0.15s" }}
                      >
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: G.textMuted, marginRight: 10 }}>{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                        {isSubmitted && oi === q.answer && <span style={{ marginLeft: 8, fontSize: 12 }}>✓</span>}
                        {isSubmitted && oi === answers[i] && oi !== q.answer && <span style={{ marginLeft: 8, fontSize: 12 }}>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {!isSubmitted && (
                  <button
                    onClick={() => handleSubmit(i)}
                    disabled={answers[i] === undefined}
                    style={{ marginTop: 12, padding: "8px 20px", background: answers[i] !== undefined ? G.amber : G.bg3, color: answers[i] !== undefined ? G.bg0 : G.textMuted, border: "none", borderRadius: 4, cursor: answers[i] !== undefined ? "pointer" : "default", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, transition: "all 0.2s" }}
                  >
                    Submit Answer
                  </button>
                )}
                {isSubmitted && (
                  <div style={{ marginTop: 14, background: G.bg3, borderRadius: 6, padding: "12px 14px", borderLeft: `3px solid ${isCorrect ? G.green : G.amber}`, animation: "slideIn 0.3s ease" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: isCorrect ? G.green : G.amber, marginBottom: 6 }}>
                      {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"} — EXPLANATION
                    </div>
                    <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: G.text, lineHeight: 1.7 }}>{q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {allAnswered && score === null && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <button
            onClick={handleFinalScore}
            style={{ padding: "12px 36px", background: G.amber, color: G.bg0, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}
          >
            CALCULATE FINAL SCORE
          </button>
        </div>
      )}
    </div>
  );
};

// ─── ASSESSMENT COMPONENT ─────────────────────────────────────────────────────
const AssessmentSection = () => {
  const [revealed, setRevealed] = useState({});
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <SectionTag>§7 — Assessment Problems</SectionTag>
      <H2>End-of-Chapter Problems</H2>
      <BodyText>
        The following problems are suitable for homework, exams, or in-class discussion. They are ordered by difficulty. Attempt each independently before revealing the model answer.
      </BodyText>

      <div style={{ display: "flex", gap: 8, margin: "16px 0 24px", flexWrap: "wrap" }}>
        {[["Foundational", G.green], ["Intermediate", G.amber], ["Advanced", G.red]].map(([d, c]) => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: G.textMuted }}>{d}</span>
          </div>
        ))}
      </div>

      {ASSESSMENT.map((a, i) => (
        <div key={a.id} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderLeft: `3px solid ${a.color}`, borderRadius: 8, padding: "20px 22px", marginBottom: 20, animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: a.color, fontWeight: 900 }}>{a.id}</span>
              <Chip color={a.color}>{a.difficulty}</Chip>
            </div>
          </div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: G.textBright, lineHeight: 1.75, marginBottom: 16 }}>{a.problem}</div>
          <button
            onClick={() => setRevealed((p) => ({ ...p, [a.id]: !p[a.id] }))}
            style={{ padding: "8px 18px", background: revealed[a.id] ? G.bg3 : a.color + "22", border: `1px solid ${a.color}55`, borderRadius: 4, cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: a.color, transition: "all 0.2s" }}
          >
            {revealed[a.id] ? "▲ HIDE ANSWER" : "▼ REVEAL MODEL ANSWER"}
          </button>
          {revealed[a.id] && (
            <div style={{ marginTop: 16, animation: "slideIn 0.3s ease" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: a.color, letterSpacing: "0.1em", marginBottom: 10 }}>MODEL ANSWER</div>
              <CodeBlock title={`${a.id} — Model Answer`}>{a.answer}</CodeBlock>
            </div>
          )}
        </div>
      ))}

      <InfoBox title="Further Reading" icon="📚" color={G.purple}>
        <strong>Foundational Papers:</strong> Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System. · Buterin, V. (2014). A Next-Generation Smart Contract and Decentralized Application Platform (Ethereum Whitepaper).<br /><br />
        <strong>Books:</strong> Antonopoulos, A. M. (2017). Mastering Bitcoin. O'Reilly. · Narayanan et al. (2016). Bitcoin and Cryptocurrency Technologies. Princeton UP.<br /><br />
        <strong>Online Resources:</strong> ethereum.org/en/developers/docs/ · developer.bitcoin.org/devguide/ · arxiv.org (search: "blockchain consensus")
      </InfoBox>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function BlockchainFundamentals() {
  const [active, setActive] = useState("intro");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [active]);

  const SECTION_MAP = {
    intro: <IntroSection />,
    ledger: <LedgerSection />,
    decentralization: <DecentralizationSection />,
    coreconcepts: <CoreConceptsSection />,
    blessings: <BlessingsCursesSection />,
    quiz: <QuizSection />,
    assessment: <AssessmentSection />,
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div style={{ display: "flex", height: "100vh", background: G.bg0, fontFamily: "'Source Serif 4', serif", color: G.text }}>
        {/* SIDEBAR */}
        <div style={{ width: 220, background: G.bg1, borderRight: `1px solid ${G.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
          {/* Logo */}
          <div style={{ padding: "20px 16px 14px", borderBottom: `1px solid ${G.border}` }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: G.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>ACM Educational Series</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 900, color: G.textBright, lineHeight: 1.25 }}>Blockchain<br />Fundamentals</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.green, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: G.textMuted }}>Interactive Edition</span>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActive(ch.id)}
                style={{
                  width: "100%", padding: "10px 16px", background: active === ch.id ? G.amber + "18" : "none",
                  border: "none", borderLeft: `3px solid ${active === ch.id ? G.amber : "transparent"}`,
                  cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
                }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: active === ch.id ? G.amber : G.textMuted, minWidth: 20 }}>{ch.short}</span>
                <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: active === ch.id ? G.textBright : G.textMuted, lineHeight: 1.3 }}>
                  {ch.label.replace(/^§\d+ /, "")}
                </span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${G.border}` }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: G.textMuted, lineHeight: 1.6 }}>
              8 Quizzes · 5 Problems<br />Distributed Systems Track
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 48px", maxWidth: 860, margin: "0 auto" }}>
          {SECTION_MAP[active]}

          {/* Navigation footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: `1px solid ${G.border}` }}>
            {(() => {
              const idx = CHAPTERS.findIndex((c) => c.id === active);
              const prev = CHAPTERS[idx - 1];
              const next = CHAPTERS[idx + 1];
              return (
                <>
                  {prev ? (
                    <button onClick={() => setActive(prev.id)} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 6, padding: "10px 18px", cursor: "pointer", color: G.textMuted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, transition: "all 0.2s" }}>
                      ← {prev.label}
                    </button>
                  ) : <div />}
                  {next && (
                    <button onClick={() => setActive(next.id)} style={{ background: G.amber + "22", border: `1px solid ${G.amber}55`, borderRadius: 6, padding: "10px 18px", cursor: "pointer", color: G.amber, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, transition: "all 0.2s" }}>
                      {next.label} →
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
