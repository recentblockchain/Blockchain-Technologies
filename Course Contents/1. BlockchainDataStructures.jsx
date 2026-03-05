import { useState, useEffect, useCallback, useRef } from "react";
import Footer from "../src/Footer";

// ─── FONTS & GLOBAL CSS ──────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Fira+Code:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:5px;background:#080e1a;}
  ::-webkit-scrollbar-thumb{background:#1e3355;border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,212,170,0)}50%{box-shadow:0 0 0 5px rgba(0,212,170,0.15)}}
  @keyframes hashRoll{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes reorgFlash{0%,100%{background:rgba(255,107,107,0)}50%{background:rgba(255,107,107,0.12)}}
`;

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg0:"#070d18", bg1:"#0b1422", bg2:"#0f1c30", bg3:"#152540", bg4:"#1a2e4d",
  border:"#1e3558", borderBright:"#2a4a78",
  teal:"#00d4aa", tealDim:"#008a6e", tealFaint:"#00d4aa18",
  blue:"#4a9eff", blueDim:"#2a6abf", blueFaint:"#4a9eff18",
  gold:"#ffd166", goldDim:"#cc9a2a", goldFaint:"#ffd16618",
  red:"#ff6b6b", redDim:"#cc3a3a", redFaint:"#ff6b6b18",
  green:"#51cf66", greenDim:"#2a9e3a", greenFaint:"#51cf6618",
  violet:"#9b72f5", violetFaint:"#9b72f518",
  text:"#b8d0f0", textMuted:"#4a6a90", textBright:"#ddeeff",
  mono:"'Fira Code', monospace",
  display:"'Oxanium', sans-serif",
  body:"'Lora', serif",
};

// ─── UTILITY ─────────────────────────────────────────────────────────────────
function simpleHash(str) {
  let h = 5381n;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33n ^ BigInt(str.charCodeAt(i))) & 0xFFFFFFFFFFFFFFFFn;
  }
  return h.toString(16).padStart(16,"0").repeat(4).slice(0,64);
}

function mineBlock(prevHash, txs, difficulty=2) {
  const target = "0".repeat(difficulty);
  let nonce = 0, hash = "";
  const ts = Date.now();
  do {
    nonce++;
    hash = simpleHash(prevHash + JSON.stringify(txs) + nonce + ts);
  } while (!hash.startsWith(target) && nonce < 500000);
  return { nonce, hash: hash.startsWith(target) ? hash : "0000" + hash.slice(4) };
}

function shortHash(h) { return h.slice(0,8)+"…"+h.slice(-4); }
function feeRate(tx) { return tx.fee / (tx.size || 250); }

// ─── SHARED UI ATOMS ─────────────────────────────────────────────────────────
const Tag = ({children, color=T.teal}) => (
  <span style={{display:"inline-block",padding:"2px 9px",borderRadius:2,background:color+"22",
    border:`1px solid ${color}44`,color,fontFamily:T.mono,fontSize:10,letterSpacing:"0.06em",fontWeight:600}}>
    {children}
  </span>
);

const SecLabel = ({children}) => (
  <div style={{fontFamily:T.mono,fontSize:10,color:T.teal,letterSpacing:"0.18em",
    textTransform:"uppercase",marginBottom:6}}>{children}</div>
);

const H2 = ({children}) => (
  <h2 style={{fontFamily:T.display,fontSize:26,fontWeight:700,color:T.textBright,
    lineHeight:1.2,marginBottom:4}}>{children}</h2>
);

const H3 = ({children, color=T.teal}) => (
  <h3 style={{fontFamily:T.mono,fontSize:11,fontWeight:600,color,
    letterSpacing:"0.1em",textTransform:"uppercase",margin:"22px 0 10px",
    display:"flex",alignItems:"center",gap:8}}>
    <span style={{display:"inline-block",width:12,height:1,background:color,opacity:0.6}}/>
    {children}
    <span style={{flex:1,height:1,background:color,opacity:0.15}}/>
  </h3>
);

const Body = ({children, style={}}) => (
  <p style={{fontFamily:T.body,fontSize:15,lineHeight:1.85,color:T.text,
    margin:"12px 0",...style}}>{children}</p>
);

const Code = ({children,title,compact}) => (
  <div style={{background:"#040912",border:`1px solid ${T.border}`,
    borderRadius:5,margin:compact?"8px 0":"14px 0",overflow:"hidden"}}>
    {title&&<div style={{background:T.bg2,borderBottom:`1px solid ${T.border}`,
      padding:"5px 12px",fontFamily:T.mono,fontSize:10,color:T.textMuted}}>{title}</div>}
    <pre style={{padding:compact?"10px 12px":"14px 16px",fontFamily:T.mono,fontSize:12,
      color:T.teal,lineHeight:1.75,overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
      {children}
    </pre>
  </div>
);

const InfoBox = ({title,children,color=T.teal,icon="◈"}) => (
  <div style={{background:T.bg2,border:`1px solid ${color}33`,
    borderLeft:`3px solid ${color}`,borderRadius:5,padding:"14px 18px",margin:"16px 0",
    animation:"fadeUp 0.35s ease"}}>
    <div style={{fontFamily:T.mono,fontSize:10,color,letterSpacing:"0.1em",
      textTransform:"uppercase",marginBottom:7}}>{icon} {title}</div>
    <div style={{fontFamily:T.body,fontSize:14,color:T.text,lineHeight:1.75}}>{children}</div>
  </div>
);

const HR = () => (
  <div style={{height:1,background:`linear-gradient(90deg,${T.teal}55,${T.border},transparent)`,
    margin:"28px 0"}}/>
);

const Btn = ({onClick,children,color=T.teal,disabled,small}) => (
  <button onClick={onClick} disabled={disabled}
    style={{padding:small?"6px 14px":"9px 20px",
      background:disabled?T.bg3:color+"22",
      border:`1px solid ${disabled?T.border:color+"66"}`,
      borderRadius:4,cursor:disabled?"not-allowed":"pointer",
      color:disabled?T.textMuted:color,fontFamily:T.mono,
      fontSize:small?10:11,fontWeight:600,letterSpacing:"0.06em",
      transition:"all 0.18s",opacity:disabled?0.5:1}}>
    {children}
  </button>
);

// ─── CHAPTERS ────────────────────────────────────────────────────────────────
const CHAPTERS = [
  {id:"intro",   label:"§1 Overview",         short:"§1"},
  {id:"blocks",  label:"§2 Block Structure",   short:"§2"},
  {id:"reorgs",  label:"§3 Chain Selection",   short:"§3"},
  {id:"mempool", label:"§4 Mempools & Fees",   short:"§4"},
  {id:"state",   label:"§5 State & Storage",   short:"§5"},
  {id:"lab",     label:"§6 Interactive Lab",   short:"§6"},
  {id:"quiz",    label:"§7 Quizzes",           short:"§7"},
  {id:"assess",  label:"§8 Assessment",        short:"§8"},
];

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const QUIZZES = [
  {
    section:"§2 Block Structure",
    q:"What is the PRIMARY purpose of the Merkle root stored in a block header?",
    opts:[
      "To record the exact time the block was mined",
      "To commit to the set of all transactions in the block in O(log n) verifiable space",
      "To identify the miner who found the valid nonce",
      "To store the previous block's full transaction list as a checksum",
    ],
    ans:1,
    explain:"The Merkle root is the root hash of a binary hash tree over all transactions. It lets a light client verify that a specific transaction is in the block by providing only a logarithmic-size proof path — without downloading all transactions.",
  },
  {
    section:"§2 Block Structure",
    q:"Why does a block header contain prev_hash but NOT the transactions themselves?",
    opts:[
      "Transactions are stored in a separate sidechain for efficiency",
      "The header is intentionally minimal so light nodes only need ~80 bytes per block while still being able to validate chain structure",
      "Transactions are encrypted and cannot be included in headers",
      "The block body is added by a different set of nodes than those that mine the header",
    ],
    ans:1,
    explain:"Block headers (~80 bytes for Bitcoin) form the 'skeleton' of the chain. Full blocks can be gigabytes. SPV wallets download only headers to follow the chain and request Merkle proofs for specific transactions — a critical scalability mechanism.",
  },
  {
    section:"§3 Chain Selection & Reorgs",
    q:"During a blockchain reorganization (reorg), what happens to transactions that were only in the now-orphaned branch?",
    opts:[
      "They are permanently lost and must be re-signed",
      "They are automatically included in the next block on the new canonical chain",
      "They return to the mempool and may be re-mined, but their previous confirmations are voided",
      "They are archived in a special orphan pool and cannot be resubmitted",
    ],
    ans:2,
    explain:"A reorg removes blocks from the canonical chain. Any transactions that were confirmed only in those removed blocks go back to 'unconfirmed' status — they are typically re-broadcast to the mempool. Merchants who accepted 0-confirmation or shallow-confirmation transactions face double-spend risk.",
  },
  {
    section:"§3 Chain Selection & Reorgs",
    q:"Why is 'the latest block' described as a moving target in practice?",
    opts:[
      "Miners continuously update the latest block's timestamp",
      "Different nodes may have received different competing blocks at the same height due to propagation delays, creating temporary disagreement",
      "The block height counter resets every 2016 blocks during difficulty adjustment",
      "Smart contract execution changes the block's hash after mining",
    ],
    ans:1,
    explain:"Network propagation is not instantaneous. Two miners can find valid blocks at nearly the same height at nearly the same time. For a brief window, different parts of the network consider different blocks 'latest.' The fork resolves when one chain grows longer and nodes reorganize.",
  },
  {
    section:"§4 Mempools & Fees",
    q:"A miner rationally maximizes revenue. Given two transactions — Tx A (fee=0.001 BTC, size=250 bytes) and Tx B (fee=0.0005 BTC, size=100 bytes) — which should the miner prefer and why?",
    opts:[
      "Tx A, because its absolute fee is higher",
      "Tx B, because its fee rate (sat/vbyte) is higher: 5 sat/vbyte vs 4 sat/vbyte",
      "Tx A, because larger transactions fill blocks faster, earning more rewards overall",
      "Neither; miners are protocol-obligated to include transactions in order of arrival",
    ],
    ans:1,
    explain:"Miners optimize fee revenue per unit of block space consumed. Tx B has fee rate = 0.0005/100 = 5 sat/byte; Tx A has 0.001/250 = 4 sat/byte. If block space is constrained, Tx B earns more per byte. Fee-rate-based selection (by fee/vbyte) is the standard mempool ordering.",
  },
  {
    section:"§4 Mempools & Fees",
    q:"What is 'mempool eviction' and when does it occur?",
    opts:[
      "When a miner deliberately excludes transactions from a block to collect higher fees later",
      "When a node removes low-fee-rate transactions from its local pool because the pool has exceeded its memory limit",
      "When a transaction expires after exactly 144 blocks (~24 hours) in Bitcoin",
      "When the mempool is reset after a new genesis block is announced",
    ],
    ans:1,
    explain:"Node mempools have configurable maximum sizes (default 300MB in Bitcoin Core). When full, nodes evict the lowest fee-rate transactions to make room for higher-fee ones. This is why setting fees too low can cause a transaction to be 'dropped' from propagation even if technically valid.",
  },
  {
    section:"§5 State, Storage & Logs",
    q:"In Ethereum, what is the difference between 'storage' and 'memory' in the context of smart contract execution?",
    opts:[
      "Storage is RAM used during a transaction; memory persists permanently on-chain",
      "Storage is a persistent key-value map in the contract's account on-chain (expensive); memory is a temporary byte array only available during a single transaction call (cheap)",
      "Memory is stored in the block header; storage is stored in the block body",
      "There is no difference — they are synonyms for the EVM's persistent state trie",
    ],
    ans:1,
    explain:"EVM 'storage' (SSTORE/SLOAD) persists across transactions — each slot costs ~20,000 gas to write cold. EVM 'memory' (MLOAD/MSTORE) is a temporary scratch space allocated fresh for each call, cleared when execution ends. Gas costs: ~3 gas/32 bytes for memory expansion vs thousands for storage writes.",
  },
  {
    section:"§5 State, Storage & Logs",
    q:"Why are Ethereum event logs (emit) cheaper than storage writes, and what is their key limitation?",
    opts:[
      "Logs are cheaper because they skip validation; their limitation is a 256-byte size cap",
      "Logs cost ~375 gas per topic vs ~20,000 gas for storage. Their key limitation: smart contracts cannot read their own logs — logs are only accessible to off-chain clients (indexers, dApps)",
      "Logs are stored in the block header and therefore replicated less; they cannot be signed",
      "Logs bypass mempool inclusion and are therefore cheaper; their limitation is that they are pruned after 1024 blocks",
    ],
    ans:1,
    explain:"Logs (bloom-indexed events) are stored in transaction receipts, not the state trie, making them ~50x cheaper than SSTORE. However, the EVM has no opcode to read past logs — they're write-only from the contract's perspective. Off-chain indexers (like The Graph) reconstruct state by replaying events.",
  },
];

// ─── ASSESSMENT DATA ─────────────────────────────────────────────────────────
const ASSESSMENTS = [
  {
    id:"P1", diff:"Foundational", color:T.green,
    problem:"Draw and label the fields of a Bitcoin block header. For each field, state its size in bytes and its conceptual role in the protocol.",
    answer:`Bitcoin Block Header — 80 bytes total:

┌─────────────────┬────────┬───────────────────────────────────────────────────┐
│ Field           │ Bytes  │ Role                                              │
├─────────────────┼────────┼───────────────────────────────────────────────────┤
│ version         │   4    │ Protocol version; signals soft fork readiness     │
│ prev_block_hash │  32    │ SHA256d of previous block header → creates chain  │
│ merkle_root     │  32    │ Root of Merkle tree over all txids in block body  │
│ timestamp       │   4    │ Unix time miner claims block was found            │
│ bits            │   4    │ Encoded difficulty target (T); valid if hash ≤ T  │
│ nonce           │   4    │ 32-bit value iterated by miner to satisfy PoW     │
└─────────────────┴────────┴───────────────────────────────────────────────────┘

Key relationships:
- hash(header) must be ≤ target encoded in 'bits'
- Changing ANY field changes the hash → PoW must be redone
- prev_block_hash links blocks into an immutable chain
- merkle_root binds the header to its transaction set`,
  },
  {
    id:"P2", diff:"Foundational", color:T.green,
    problem:"Explain why a 3-block reorg in Bitcoin is considered far more severe than a 1-block reorg. Your answer should reference the economic cost of reversal and practical business impact.",
    answer:`Severity scales exponentially, not linearly.

1-block reorg:
- Happens naturally ~1-2x/day due to near-simultaneous mining
- Only transactions in 1 block are de-confirmed
- Economic cost to attacker: re-mine 1 block of work
- Business impact: merchants accepting 0-conf are at risk; 1-conf tx returns to mempool
- Generally regarded as routine — most exchanges require 3-6 confirmations precisely for this reason

3-block reorg:
- Extremely rare; last notable instance was BSV in 2021
- Attacker must have secretly mined 3+ blocks faster than the honest chain (requires ~50% hash power sustained OR a selfish mining strategy with >33%)
- Economic cost: 3× block rewards foregone + massive hardware/energy spend
- Business impact: ALL transactions confirmed in those 3 blocks are invalidated — exchanges, DEXes, and merchants who accepted 3-conf payments face double-spend losses
- A $600M USD double-spend at 3 confs is theoretically feasible vs near-impossible at 6 confs

Formula (Nakamoto 2008):
P(successful reorg after k confs | attacker has q fraction of hashrate):
  ≈ (q/p)^k for q < p
  e.g., q=0.3, k=1: 43% chance; k=3: 8%; k=6: 0.6%`,
  },
  {
    id:"P3", diff:"Intermediate", color:T.gold,
    problem:`A node's mempool has 500MB of transactions and a maximum size limit of 300MB. The current minimum fee rate to enter the mempool is 5 sat/vbyte. Describe the algorithm a production node (e.g., Bitcoin Core) uses to handle this situation, and explain what happens to a user who submits a transaction with fee=3 sat/vbyte.`,
    answer:`Mempool Management Algorithm (Bitcoin Core):

1. ACCEPTANCE GATE: Incoming tx checked against minRelayTxFee (dynamic floor).
   - tx.feeRate = tx.fee / tx.vsize
   - If feeRate < current_min_floor → reject immediately, do NOT propagate

2. EVICTION POLICY when pool is full:
   a. Calculate "eviction score" = fee_rate for each tx package
      (packages: parent txs are weighted with their unconfirmed descendants)
   b. Sort ascending by eviction score
   c. Evict lowest-scoring txs until pool is under max size
   d. Update min_pool_fee = fee_rate of the lowest tx still in pool + 1 increment

3. For the 3 sat/vbyte submission:
   STEP 1: Node checks 3 < 5 (current min fee rate)
   STEP 2: Returns "insufficient fee, min is 5 sat/vbyte"
   STEP 3: Transaction is NOT added, NOT propagated to peers
   STEP 4: Tx is effectively "invisible" to the network

4. User's options:
   a. RBF (Replace-by-Fee, BIP 125): if original tx has nSequence < 0xFFFFFFFE,
      user can broadcast a new tx spending same inputs with higher fee
   b. CPFP (Child-Pays-for-Parent): spend an output of the stuck tx with a
      high-fee child; miners consider the parent+child package fee rate
   c. Wait: if fee market drops below 3 sat/vbyte, tx may become acceptable again`,
  },
  {
    id:"P4", diff:"Intermediate", color:T.gold,
    problem:"Describe the Ethereum state trie architecture. What four tries does a block commit to? What is stored in each? Why does Ethereum use Merkle Patricia Tries (MPT) rather than a simple hash of all state?",
    answer:`Ethereum's Four-Trie Architecture (per block):

┌──────────────────────┬────────────────────────────────────────────────┐
│ Trie                 │ Contents                                       │
├──────────────────────┼────────────────────────────────────────────────┤
│ State Trie           │ address → {nonce, balance, codeHash,           │
│ (stateRoot)          │            storageRoot}                        │
│                      │ One global trie; root in block header          │
├──────────────────────┼────────────────────────────────────────────────┤
│ Storage Trie         │ slot (uint256) → value (uint256)               │
│ (per contract)       │ Each contract has its own storage trie;        │
│                      │ root = storageRoot in account state            │
├──────────────────────┼────────────────────────────────────────────────┤
│ Transaction Trie     │ tx_index → RLP-encoded transaction             │
│ (txRoot)             │ Per-block; immutable after mining              │
├──────────────────────┼────────────────────────────────────────────────┤
│ Receipt Trie         │ tx_index → {status, gasUsed, bloom, logs}      │
│ (receiptRoot)        │ Per-block; enables log filtering via bloom     │
└──────────────────────┴────────────────────────────────────────────────┘

Why Merkle Patricia Trie (MPT) over a flat hash?

1. EFFICIENT PROOFS: A Merkle proof for a specific account is O(log n) nodes
   (~15 hashes for 150M accounts), not O(n). Light clients can verify account
   state without syncing all state.

2. EFFICIENT UPDATES: Only the path from changed leaf to root needs rehashing.
   Updating one account in a flat hash requires rehashing all n accounts.

3. ORDERED KEY LOOKUP: Patricia trie enables efficient key-value access
   by address prefix. A flat hash has no structure for lookup.

4. DETERMINISM: Given the same key-value pairs, any node produces the
   identical root hash regardless of insertion order — essential for consensus.`,
  },
  {
    id:"P5", diff:"Advanced", color:T.red,
    problem:`Write Python pseudocode for a minimal blockchain simulation that supports: (a) creating and mining blocks, (b) maintaining two competing chains, (c) implementing the longest-chain selection rule with reorg detection, and (d) reporting confirmation depth for a given transaction ID.`,
    answer:`import hashlib, json, time
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class Tx:
    id: str
    sender: str
    receiver: str
    amount: float
    fee: float
    size: int = 250

    @property
    def fee_rate(self): return self.fee / self.size

@dataclass
class Block:
    index: int
    prev_hash: str
    transactions: List[Tx]
    nonce: int = 0
    hash: str = ""
    timestamp: float = field(default_factory=time.time)

    def compute_hash(self) -> str:
        data = json.dumps({
            "index": self.index, "prev_hash": self.prev_hash,
            "txids": [t.id for t in self.transactions],
            "nonce": self.nonce, "timestamp": self.timestamp,
        }, sort_keys=True)
        return hashlib.sha256(data.encode()).hexdigest()

    def mine(self, difficulty=4) -> None:
        target = "0" * difficulty
        while True:
            self.hash = self.compute_hash()
            if self.hash.startswith(target): break
            self.nonce += 1

class Blockchain:
    def __init__(self, name: str):
        self.name = name
        self.chain: List[Block] = []
        self._init_genesis()

    def _init_genesis(self):
        g = Block(0, "0"*64, [])
        g.mine()
        self.chain.append(g)

    @property
    def tip(self) -> Block:
        return self.chain[-1]          # latest (possibly unstable) block

    @property
    def height(self) -> int:
        return len(self.chain) - 1

    def add_block(self, txs: List[Tx]) -> Block:
        # (a) Mine a new block extending current tip
        b = Block(self.height + 1, self.tip.hash, txs)
        b.mine()
        self.chain.append(b)
        return b

    def get_all_txids(self) -> Dict[str, int]:
        # maps txid → block index it was included in
        return {tx.id: blk.index
                for blk in self.chain for tx in blk.transactions}

    def confirmation_depth(self, txid: str) -> Optional[int]:
        # (d) Confirmations = (current height) - (block height of tx) + 1
        txmap = self.get_all_txids()
        if txid not in txmap:
            return None          # not yet confirmed (still in mempool)
        return self.height - txmap[txid] + 1

# ─── (b) Two competing chains ─────────────────────────────────────────────
class ForkSimulator:
    def __init__(self, fork_point: Block):
        # Both chains share history up to fork_point
        self.chain_a = Blockchain("A")
        self.chain_b = Blockchain("B")
        # In a real sim, share the common prefix; here we track separately

    # (c) Longest-chain selection rule + reorg detection
    def canonical_chain(self) -> Blockchain:
        # Nakamoto rule: heaviest chain by cumulative work (simplified: longest)
        return self.chain_a if self.chain_a.height >= self.chain_b.height \
               else self.chain_b

    def detect_reorg(self, prev_canonical: str) -> bool:
        new_canonical = self.canonical_chain().name
        if new_canonical != prev_canonical:
            loser = self.chain_a if new_canonical == "B" else self.chain_b
            print(f"REORG: Chain {new_canonical} overtakes Chain {prev_canonical}")
            print(f"  Orphaned blocks: {loser.height} blocks removed from canonical view")
            # Transactions in orphaned chain return to mempool
            orphaned_txs = [tx for blk in loser.chain[1:] for tx in blk.transactions]
            print(f"  {len(orphaned_txs)} transactions return to mempool")
            return True
        return False

# ─── Usage Example ────────────────────────────────────────────────────────
sim = ForkSimulator(None)
tx1 = Tx("tx_abc", "Alice", "Bob",   1.0, 0.001)
tx2 = Tx("tx_def", "Bob",   "Carol", 0.5, 0.005)

sim.chain_a.add_block([tx1])
sim.chain_a.add_block([tx2])
sim.chain_b.add_block([tx1])          # same tx — double spend attempt!

prev = sim.canonical_chain().name     # currently "A" (height 2 vs 1)
sim.chain_b.add_block([])             # chain B now catches up (height 2)
sim.chain_b.add_block([])             # chain B overtakes (height 3)
sim.detect_reorg(prev)                # → REORG detected

# Confirmation depth
depth = sim.chain_a.confirmation_depth("tx_abc")  # still 2 on chain A
print(f"tx_abc has {depth} confirmations on chain A (now orphaned)")
# → 2 confirmations (but chain A is no longer canonical!)`,
  },
];

// ─── LAB STATE & LOGIC ───────────────────────────────────────────────────────
const GENESIS_HASH = "0000a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6";
const mkBlock = (index,prevHash,txs,nonce,hash) => ({index,prevHash,txs,nonce,hash,ts:Date.now()});
const GENESIS = mkBlock(0,"0".repeat(64),[],0,GENESIS_HASH);

function initChain() {
  return { name:"Main", chain:[GENESIS], color:T.teal };
}
function initForkChains() {
  const shared = [GENESIS,
    mkBlock(1,GENESIS_HASH,[{id:"tx0",from:"Alice",to:"Bob",amount:1,fee:0.005,size:250}],
      42,"0000deadbeef1234deadbeef1234deadbeef1234deadbeef1234deadbeef1234"),
    mkBlock(2,"0000deadbeef1234deadbeef1234deadbeef1234deadbeef1234deadbeef1234",
      [{id:"tx1",from:"Bob",to:"Carol",amount:0.5,fee:0.003,size:250}],
      99,"0000cafe0001cafe0001cafe0001cafe0001cafe0001cafe0001cafe0001cafe00"),
  ];
  return [
    { name:"Chain A", chain:[...shared], color:T.teal },
    { name:"Chain B", chain:[...shared], color:T.gold },
  ];
}

// ─── SECTION: INTRO ──────────────────────────────────────────────────────────
const IntroSection = () => (
  <div style={{animation:"fadeUp 0.4s ease"}}>
    <SecLabel>§1 — Chapter Overview</SecLabel>
    <H2>Blockchain Data Structures & Transaction Lifecycle</H2>
    <div style={{fontFamily:T.mono,fontSize:11,color:T.textMuted,marginBottom:24,marginTop:4,
      letterSpacing:"0.08em"}}>ACM Educational Series · Distributed Systems Track · Chapter 2</div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,margin:"18px 0"}}>
      {[
        {icon:"🧱",t:"Block Structure",s:"Header fields, Merkle trees, body layout"},
        {icon:"⛓",t:"Chain Selection",s:"Reorgs, orphans, finality depth"},
        {icon:"🔀",t:"Mempools & Fees",s:"Inclusion incentives, eviction policy"},
        {icon:"💾",t:"State & Storage",s:"Tries, logs, receipts"},
        {icon:"🔬",t:"Interactive Lab",s:"Mine blocks, simulate forks"},
      ].map(c=>(
        <div key={c.t} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,
          padding:"14px 12px",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:8}}>{c.icon}</div>
          <div style={{fontFamily:T.mono,fontSize:10,color:T.teal,fontWeight:600,marginBottom:4}}>{c.t}</div>
          <div style={{fontFamily:T.body,fontSize:11,color:T.textMuted,lineHeight:1.5}}>{c.s}</div>
        </div>
      ))}
    </div>

    <Body>
      Chapter 1 established <em>why</em> blockchains exist. This chapter dissects <strong style={{color:T.teal}}>how they work mechanically</strong> — the exact data layouts, selection algorithms, economic game theory of transaction ordering, and the persistent storage model that makes smart contracts possible.
    </Body>
    <Body>
      By the end, you will build and fork a toy chain in the interactive lab, directly observing the phenomena (reorgs, orphaned blocks, mempool dynamics) that every blockchain engineer must reason about daily.
    </Body>

    <InfoBox title="Prerequisites" icon="◈" color={T.blue}>
      Chapter 1 (Blockchain Fundamentals). Comfort with hexadecimal notation, basic hash functions, and Python pseudocode. No cryptography background required.
    </InfoBox>

    <HR/>
    <H3>Roadmap: How a Transaction Moves Through the System</H3>
    <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,padding:"16px",margin:"12px 0",overflowX:"auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:0,minWidth:620,flexWrap:"nowrap"}}>
        {[
          {step:"User Signs Tx",color:T.blue},
          {step:"Broadcast to Peers",color:T.blue},
          {step:"Mempool Entry",color:T.gold},
          {step:"Miner Selects",color:T.gold},
          {step:"Block Mined",color:T.teal},
          {step:"Propagated",color:T.teal},
          {step:"Confirmed",color:T.green},
        ].map((s,i,arr)=>(
          <div key={s.step} style={{display:"flex",alignItems:"center"}}>
            <div style={{background:s.color+"20",border:`1px solid ${s.color}44`,borderRadius:4,
              padding:"8px 10px",textAlign:"center",minWidth:78}}>
              <div style={{fontFamily:T.mono,fontSize:9,color:s.color,fontWeight:600,letterSpacing:"0.05em"}}>{s.step}</div>
            </div>
            {i<arr.length-1&&<div style={{fontSize:14,color:T.textMuted,padding:"0 3px"}}>→</div>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── SECTION: BLOCK STRUCTURE ─────────────────────────────────────────────────
const BlockStructureSection = () => {
  const [activeTab,setActiveTab] = useState("header");
  const [showMerkle,setShowMerkle] = useState(false);

  const tabs = [
    {id:"header",label:"Block Header"},
    {id:"body",label:"Block Body"},
    {id:"merkle",label:"Merkle Tree"},
  ];

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§2 — Data Structures</SecLabel>
      <H2>Block Structure & Anatomy</H2>

      <Body>Every block is a two-part data structure: a compact <strong style={{color:T.teal}}>header</strong> (80 bytes in Bitcoin) that participates in consensus, and a <strong style={{color:T.gold}}>body</strong> holding the full transaction list. Understanding this split is foundational to grasping light clients, SPV proofs, and scalability limits.</Body>

      <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:6,
        overflow:"hidden",margin:"16px 0 0"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{flex:1,padding:"10px",border:"none",cursor:"pointer",
              background:activeTab===t.id?T.bg3:T.bg2,
              color:activeTab===t.id?T.teal:T.textMuted,
              fontFamily:T.mono,fontSize:11,
              borderBottom:`2px solid ${activeTab===t.id?T.teal:"transparent"}`,
              transition:"all 0.15s"}}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderTop:"none",
        borderRadius:"0 0 6px 6px",padding:"20px",animation:"fadeIn 0.25s ease"}}>

        {activeTab==="header"&&(
          <>
            <H3>Bitcoin Block Header — 80 bytes</H3>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[
                {field:"version",bytes:4,color:T.violet,desc:"Protocol version & soft-fork signaling bits",example:"0x20000000"},
                {field:"prev_block_hash",bytes:32,color:T.teal,desc:"SHA256d of previous block's header → forms the chain",example:"00000000000000000003..."},
                {field:"merkle_root",bytes:32,color:T.gold,desc:"Root of Merkle tree over all txids — binds body to header",example:"f4184fc596403b9d..."},
                {field:"timestamp",bytes:4,color:T.blue,desc:"Unix time (seconds) when miner started hashing this header",example:"1231006505"},
                {field:"bits",bytes:4,color:T.green,desc:"Compact encoding of current difficulty target T",example:"0x1d00ffff"},
                {field:"nonce",bytes:4,color:T.red,desc:"32-bit counter iterated by miner to satisfy hash(header) ≤ T",example:"2083236893"},
              ].map(r=>(
                <div key={r.field} style={{display:"grid",
                  gridTemplateColumns:"140px 45px 1fr 120px",
                  gap:0,background:T.bg3,borderRadius:4,overflow:"hidden",
                  border:`1px solid ${r.color}28`}}>
                  <div style={{padding:"8px 10px",borderRight:`1px solid ${T.border}`,
                    fontFamily:T.mono,fontSize:11,color:r.color,fontWeight:600}}>{r.field}</div>
                  <div style={{padding:"8px 8px",borderRight:`1px solid ${T.border}`,
                    fontFamily:T.mono,fontSize:11,color:T.textMuted,textAlign:"center"}}>{r.bytes}B</div>
                  <div style={{padding:"8px 10px",fontFamily:T.body,fontSize:12,
                    color:T.text,lineHeight:1.4,borderRight:`1px solid ${T.border}`}}>{r.desc}</div>
                  <div style={{padding:"8px 10px",fontFamily:T.mono,fontSize:10,
                    color:T.textMuted,wordBreak:"break-all"}}>{r.example}</div>
                </div>
              ))}
            </div>
            <InfoBox title="Why only 80 bytes?" icon="◈" color={T.teal}>
              SPV (Simple Payment Verification) wallets only download block headers to follow the chain — ~4.7 MB/year at current Bitcoin rates. The 80-byte limit was a deliberate design constraint enabling lightweight verification on embedded and mobile devices.
            </InfoBox>
          </>
        )}

        {activeTab==="body"&&(
          <>
            <H3>Block Body — Variable Size</H3>
            <Body>The block body contains the full serialized transaction list. In Bitcoin, blocks are limited to 4 million weight units (~1-4 MB). In Ethereum, the gas limit determines block body size indirectly.</Body>
            <Code title="Block Body — Serialized Layout (Bitcoin)">{`Block {
  // HEADER (80 bytes, fixed)
  header: BlockHeader,

  // BODY (variable)
  tx_count: VarInt,               // number of txs (1-9 bytes)
  transactions: [                 // array of serialized transactions
    Transaction_0,                // always the coinbase (miner reward)
    Transaction_1,
    ...
    Transaction_n,
  ]
}

// Coinbase (Transaction_0) is special:
// - No inputs (creates new coins from thin air)
// - Input field contains arbitrary "coinbase data" (miner message)
// - Output(s) = block_reward + sum(all_fees)
// Example coinbase data: "The Times 03/Jan/2009 Chancellor on brink..."
//                         ^^ Satoshi's embedded message in genesis block`}</Code>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
              {[
                {label:"Max Block Size",val:"4,000,000 weight units (~1MB stripped, ~4MB segwit)",color:T.teal},
                {label:"Avg Tx Size",val:"~250 vbytes → ~3,500 txs/block",color:T.gold},
                {label:"Block Time Target",val:"10 minutes (Bitcoin) / 12 seconds (Ethereum)",color:T.blue},
                {label:"Max Throughput",val:"~7 tx/sec (Bitcoin) / ~15-100 tx/sec (Ethereum)",color:T.green},
              ].map(r=>(
                <div key={r.label} style={{background:T.bg3,borderRadius:4,padding:"10px 12px",
                  border:`1px solid ${r.color}22`}}>
                  <div style={{fontFamily:T.mono,fontSize:10,color:r.color,marginBottom:4}}>{r.label}</div>
                  <div style={{fontFamily:T.body,fontSize:13,color:T.text}}>{r.val}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab==="merkle"&&(
          <>
            <H3>The Merkle Tree</H3>
            <Body>A Merkle tree is a complete binary hash tree. Leaf nodes are transaction IDs (TXIDs). Each internal node is <code style={{fontFamily:T.mono,fontSize:13,color:T.teal}}>hash(left_child || right_child)</code>. The root commits to all transactions in O(1) space.</Body>

            {/* Visual Merkle Tree */}
            <div style={{background:"#040912",border:`1px solid ${T.border}`,borderRadius:6,
              padding:"20px 16px",margin:"14px 0",overflowX:"auto"}}>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:16,
                letterSpacing:"0.1em"}}>MERKLE TREE — 4 TRANSACTIONS</div>
              <div style={{minWidth:480}}>
                {/* Root */}
                <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                  <div style={{background:T.teal+"22",border:`1px solid ${T.teal}`,borderRadius:4,
                    padding:"6px 14px",fontFamily:T.mono,fontSize:11,color:T.teal,textAlign:"center"}}>
                    <div style={{fontSize:9,color:T.textMuted,marginBottom:2}}>MERKLE ROOT</div>
                    Hab = H(Hcd||Hef)
                  </div>
                </div>
                {/* Connectors */}
                <div style={{display:"flex",justifyContent:"center",gap:0}}>
                  <svg width="200" height="24" style={{overflow:"visible"}}>
                    <line x1="100" y1="0" x2="50" y2="24" stroke={T.border} strokeWidth={1.5}/>
                    <line x1="100" y1="0" x2="150" y2="24" stroke={T.border} strokeWidth={1.5}/>
                  </svg>
                </div>
                {/* Level 1 */}
                <div style={{display:"flex",justifyContent:"center",gap:40,marginBottom:8}}>
                  {[{label:"Hcd",sub:"H(Htx1||Htx2)",color:T.gold},{label:"Hef",sub:"H(Htx3||Htx4)",color:T.gold}].map(n=>(
                    <div key={n.label} style={{background:T.gold+"18",border:`1px solid ${T.gold}55`,
                      borderRadius:4,padding:"5px 12px",fontFamily:T.mono,fontSize:11,
                      color:T.gold,textAlign:"center",minWidth:120}}>
                      <div style={{fontSize:9,color:T.textMuted,marginBottom:1}}>{n.sub}</div>
                      {n.label}
                    </div>
                  ))}
                </div>
                {/* Level 2 connectors */}
                <div style={{display:"flex",justifyContent:"space-around",padding:"0 40px"}}>
                  {[0,1].map(i=>(
                    <svg key={i} width="120" height="24" style={{overflow:"visible"}}>
                      <line x1="60" y1="0" x2="20" y2="24" stroke={T.border} strokeWidth={1.5}/>
                      <line x1="60" y1="0" x2="100" y2="24" stroke={T.border} strokeWidth={1.5}/>
                    </svg>
                  ))}
                </div>
                {/* Leaves */}
                <div style={{display:"flex",justifyContent:"space-around",gap:8}}>
                  {["TXID₁","TXID₂","TXID₃","TXID₄"].map(tx=>(
                    <div key={tx} style={{background:T.blue+"18",border:`1px solid ${T.blue}44`,
                      borderRadius:4,padding:"5px 10px",fontFamily:T.mono,fontSize:10,
                      color:T.blue,textAlign:"center",flex:1}}>
                      {tx}
                    </div>
                  ))}
                </div>
                <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginTop:12,textAlign:"center"}}>
                  Merkle Proof for TXID₂: [TXID₁, Hef] → verify in 2 hashes regardless of total tx count
                </div>
              </div>
            </div>

            <InfoBox title="Why this matters for light clients" icon="◈" color={T.blue}>
              A Merkle proof for 1 transaction in a 3,500-tx block requires only log₂(3500) ≈ 12 hashes (~384 bytes). Without the Merkle structure, verifying inclusion would require downloading all 3,500 transactions (~875 KB). This 2,000× compression enables mobile wallets.
            </InfoBox>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: CHAIN SELECTION & REORGS ───────────────────────────────────────
const ReorgSection = () => {
  const [step, setStep] = useState(0);
  const maxStep = 4;

  const steps = [
    {label:"Normal Chain Growth", desc:"Blocks extend cleanly one at a time. Every node agrees on the tip."},
    {label:"Near-Simultaneous Mining", desc:"Miners A and B find valid blocks at height 5 at nearly the same time. Both are valid — a fork begins."},
    {label:"Propagation Split", desc:"~50% of nodes accept Block 5a; ~50% accept Block 5b. Each group builds on their version."},
    {label:"Tie-Breaker: New Block", desc:"A miner on the 5a branch mines Block 6a. The 5a chain is now longer."},
    {label:"Reorg Complete", desc:"All nodes adopt the 5a→6a chain. Block 5b is orphaned. Its transactions return to the mempool."},
  ];

  const blocks = {
    0: [{h:1},{h:2},{h:3},{h:4}],
    1: [{h:1},{h:2},{h:3},{h:4},{h:"5a?",note:"fork!"},{h:"5b?",note:"fork!",offset:true}],
    2: [{h:1},{h:2},{h:3},{h:4},{h:"5a",c:T.teal,note:"50%"},{h:"5b",c:T.gold,note:"50%",offset:true}],
    3: [{h:1},{h:2},{h:3},{h:4},{h:"5a",c:T.teal},{h:"6a",c:T.teal},{h:"5b",c:T.gold,offset:true,orphan:false}],
    4: [{h:1},{h:2},{h:3},{h:4},{h:"5a",c:T.teal},{h:"6a",c:T.teal},{h:"5b",c:T.red,offset:true,orphan:true,note:"ORPHANED"}],
  };

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§3 — Chain Dynamics</SecLabel>
      <H2>Chain Selection, Reorgs & the Moving Tip</H2>

      <Body>The <strong style={{color:T.teal}}>"latest block"</strong> is not a stable, globally-agreed fact — it is a local opinion that can change. Understanding why requires understanding how nodes select the canonical chain and what happens when two valid blocks compete.</Body>

      <H3>The Longest-Chain Rule (Nakamoto Consensus)</H3>
      <Body>When a node sees two valid competing chains, it always adopts the one with <strong style={{color:T.gold}}>the most cumulative proof-of-work</strong> (in PoW) or the most validator attestations (in PoS). "Longest" technically means "most work," not just "most blocks."</Body>

      <Code title="Pseudocode: Node's Chain Selection Logic">{`def on_receive_block(new_block, current_chain):
    # Validate the block first
    if not validate_block(new_block):
        return "reject"

    # Find which chain this block extends
    parent = find_block(new_block.prev_hash)
    candidate_chain = parent.chain + [new_block]

    # Nakamoto rule: adopt if cumulative work is greater
    if cumulative_work(candidate_chain) > cumulative_work(current_chain):
        # REORG: switch to new chain
        orphaned = blocks_not_in(candidate_chain, current_chain)
        for block in orphaned:
            return_txs_to_mempool(block.transactions)

        current_chain = candidate_chain
        broadcast(new_block)       # propagate to peers
        return "reorg + adopt"

    elif new_block extends current_chain tip:
        current_chain.append(new_block)
        broadcast(new_block)
        return "normal append"

    else:
        # Valid block on a shorter fork → keep as candidate
        store_as_side_chain(new_block)
        return "store fork"`}</Code>

      <H3 color={T.gold}>Interactive: Visualize a Reorg</H3>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,padding:"18px 20px",margin:"12px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{fontFamily:T.mono,fontSize:11,color:T.textBright}}>{steps[step].label}</div>
          <div style={{display:"flex",gap:8}}>
            <Btn small onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>← Back</Btn>
            <Btn small onClick={()=>setStep(s=>Math.min(maxStep,s+1))} disabled={step===maxStep}>Next →</Btn>
          </div>
        </div>
        <div style={{fontFamily:T.body,fontSize:13,color:T.textMuted,marginBottom:16,
          fontStyle:"italic"}}>{steps[step].desc}</div>

        {/* Chain visual */}
        <div style={{overflowX:"auto"}}>
          <div style={{position:"relative",minWidth:420,height:step>=1?90:50}}>
            {/* Main chain */}
            <div style={{display:"flex",alignItems:"center",position:"absolute",top:0}}>
              {(blocks[step]||[]).filter(b=>!b.offset).map((b,i,arr)=>(
                <div key={i} style={{display:"flex",alignItems:"center"}}>
                  <div style={{background:b.orphan?T.red+"22":(b.c||T.teal)+"22",
                    border:`1px solid ${b.orphan?T.red:(b.c||T.teal)}`,
                    borderRadius:4,padding:"6px 10px",minWidth:50,textAlign:"center",
                    animation:"fadeIn 0.3s ease",position:"relative"}}>
                    <div style={{fontFamily:T.mono,fontSize:11,color:b.orphan?T.red:(b.c||T.teal),fontWeight:600}}>B{b.h}</div>
                    {b.note&&<div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted}}>{b.note}</div>}
                  </div>
                  {i<arr.length-1&&<div style={{width:16,height:1,background:T.border,margin:"0 1px"}}/>}
                </div>
              ))}
            </div>
            {/* Fork branch */}
            {step>=1&&(blocks[step]||[]).filter(b=>b.offset).map((b,i)=>(
              <div key={i} style={{position:"absolute",top:48,display:"flex",alignItems:"center"}}>
                {/* connector line going up */}
                <svg style={{position:"absolute",top:-34,left:step>=3?168:168,width:2,height:36,overflow:"visible"}}>
                  <line x1="1" y1="0" x2="1" y2="36" stroke={b.orphan?T.red:T.gold} strokeWidth={1.5} strokeDasharray="3,2"/>
                </svg>
                <div style={{marginLeft: step>=3?168:168,background:b.orphan?T.red+"18":T.gold+"18",
                  border:`1px solid ${b.orphan?T.red:T.gold}`,
                  borderRadius:4,padding:"6px 10px",minWidth:50,textAlign:"center",
                  animation:"fadeIn 0.3s ease"}}>
                  <div style={{fontFamily:T.mono,fontSize:11,color:b.orphan?T.red:T.gold,fontWeight:600}}>B{b.h}</div>
                  {b.note&&<div style={{fontFamily:T.mono,fontSize:9,color:b.orphan?T.red:T.textMuted}}>{b.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step indicator */}
        <div style={{display:"flex",gap:5,marginTop:16,justifyContent:"center"}}>
          {steps.map((_,i)=>(
            <div key={i} onClick={()=>setStep(i)}
              style={{width:i===step?20:8,height:4,borderRadius:2,
                background:i===step?T.teal:T.border,cursor:"pointer",transition:"all 0.2s"}}/>
          ))}
        </div>
      </div>

      <H3>Practical Consequences for Applications</H3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
        {[
          {t:"0 confirmations",v:"Transaction is in mempool — NO guarantee of inclusion. High double-spend risk.",c:T.red},
          {t:"1 confirmation",v:"Included in one block. Can be undone by a 1-block reorg (happens ~daily).",c:T.gold},
          {t:"3 confirmations",v:"Requires 3-block reorg. Attackers need sustained >50% hash power. Low risk.",c:T.blue},
          {t:"6 confirmations",v:"Bitcoin standard for large transfers. Economic cost to revert ≈ $millions.",c:T.green},
        ].map(r=>(
          <div key={r.t} style={{background:T.bg3,border:`1px solid ${r.c}33`,
            borderLeft:`3px solid ${r.c}`,borderRadius:4,padding:"10px 12px"}}>
            <div style={{fontFamily:T.mono,fontSize:10,color:r.c,marginBottom:5}}>{r.t}</div>
            <div style={{fontFamily:T.body,fontSize:13,color:T.text,lineHeight:1.55}}>{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SECTION: MEMPOOL & FEES ──────────────────────────────────────────────────
const MempoolSection = () => {
  const [pool, setPool] = useState([
    {id:"tx_A",from:"Alice",to:"Bob",amount:1.2,fee:5000,size:200,ts:1000},
    {id:"tx_B",from:"Carol",to:"Dave",amount:0.5,fee:1200,size:250,ts:1001},
    {id:"tx_C",from:"Eve",to:"Frank",amount:3.0,fee:8000,size:180,ts:1002},
    {id:"tx_D",from:"Grace",to:"Heidi",amount:0.1,fee:300,size:220,ts:1003},
    {id:"tx_E",from:"Ivan",to:"Judy",amount:2.5,fee:4500,size:260,ts:1004},
    {id:"tx_F",from:"Karl",to:"Lena",amount:0.8,fee:600,size:190,ts:1005},
  ]);
  const [sortBy, setSortBy] = useState("feeRate");
  const [mined, setMined] = useState([]);
  const [blockSize] = useState(700); // vbytes budget

  const sorted = [...pool].sort((a,b)=>sortBy==="feeRate"
    ? feeRate(b)-feeRate(a) : b.fee-a.fee);

  const greedySelect = () => {
    let used=0, selected=[];
    for(const tx of sorted){
      if(used+tx.size<=blockSize){ selected.push(tx); used+=tx.size; }
    }
    return selected;
  };
  const toMine = greedySelect();
  const toMineIds = new Set(toMine.map(t=>t.id));

  const handleMine = () => {
    setMined(prev=>[...prev,...toMine]);
    setPool(prev=>prev.filter(t=>!toMineIds.has(t.id)));
  };

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§4 — Transaction Economics</SecLabel>
      <H2>Mempools, Fees & Inclusion Incentives</H2>

      <Body>
        Before a transaction is confirmed, it waits in the <strong style={{color:T.teal}}>mempool</strong> (memory pool) — each node's local set of valid, unconfirmed transactions. This is <em>not</em> a shared global structure; different nodes may have different mempools depending on propagation timing and local policy.
      </Body>

      <H3>Fee Market Mechanics</H3>
      <Code title="Transaction Fee Calculation">{`# Absolute fee vs fee rate
fee_rate_satoshis_per_vbyte = tx.fee / tx.virtual_size

# Example:
tx_A = {fee: 5000 satoshis, vsize: 200 vbytes}
tx_A.fee_rate = 5000 / 200 = 25 sat/vbyte   ← HIGH priority

tx_B = {fee: 1200 satoshis, vsize: 250 vbytes}
tx_B.fee_rate = 1200 / 250 = 4.8 sat/vbyte  ← LOWER priority

# Even though tx_A has a higher absolute fee (5000 > 1200),
# fee RATE determines mining priority — not absolute fee.
# A miner maximizes: sum(fees) / sum(vsizes)  for selected transactions`}</Code>

      <H3 color={T.gold}>Interactive Mempool Simulator</H3>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,
        padding:"16px 18px",margin:"12px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>SORT:</span>
            {[["feeRate","Fee Rate (sat/vB)"],["absFee","Absolute Fee"]].map(([k,l])=>(
              <button key={k} onClick={()=>setSortBy(k)}
                style={{padding:"4px 10px",border:`1px solid ${sortBy===k?T.teal:T.border}`,
                  borderRadius:3,background:sortBy===k?T.teal+"22":T.bg3,
                  color:sortBy===k?T.teal:T.textMuted,fontFamily:T.mono,fontSize:10,cursor:"pointer"}}>
                {l}
              </button>
            ))}
          </div>
          <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>
            Block budget: {blockSize} vbytes
          </div>
        </div>

        {pool.length===0?(
          <div style={{textAlign:"center",padding:"20px",fontFamily:T.mono,fontSize:12,color:T.textMuted}}>
            Mempool empty — all transactions mined.
          </div>
        ):(
          <>
            <div style={{display:"grid",gridTemplateColumns:"60px 1fr 70px 70px 70px 80px",
              gap:0,marginBottom:6}}>
              {["TXID","From → To","Amount","Fee","vBytes","Rate"].map(h=>(
                <div key={h} style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,
                  padding:"4px 8px",borderBottom:`1px solid ${T.border}`}}>{h}</div>
              ))}
            </div>
            {sorted.map(tx=>{
              const selected = toMineIds.has(tx.id);
              const rate = (tx.fee/tx.size).toFixed(1);
              return (
                <div key={tx.id}
                  style={{display:"grid",gridTemplateColumns:"60px 1fr 70px 70px 70px 80px",
                    gap:0,background:selected?T.teal+"12":T.bg3,
                    border:`1px solid ${selected?T.teal+"44":T.border}`,
                    borderRadius:3,marginBottom:3,transition:"all 0.2s"}}>
                  <div style={{padding:"7px 8px",fontFamily:T.mono,fontSize:10,color:T.textMuted}}>{tx.id.slice(0,6)}</div>
                  <div style={{padding:"7px 8px",fontFamily:T.mono,fontSize:10,color:T.text}}>{tx.from}→{tx.to}</div>
                  <div style={{padding:"7px 8px",fontFamily:T.mono,fontSize:10,color:T.text}}>{tx.amount} BTC</div>
                  <div style={{padding:"7px 8px",fontFamily:T.mono,fontSize:10,color:T.gold}}>{tx.fee} sat</div>
                  <div style={{padding:"7px 8px",fontFamily:T.mono,fontSize:10,color:T.textMuted}}>{tx.size}</div>
                  <div style={{padding:"7px 8px",fontFamily:T.mono,fontSize:10,
                    color:selected?T.teal:T.textMuted,fontWeight:selected?600:400}}>
                    {rate} s/vB {selected&&"✓"}
                  </div>
                </div>
              );
            })}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              marginTop:14,padding:"10px 8px",background:T.bg3,borderRadius:4,
              border:`1px solid ${T.border}`}}>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>
                <span style={{color:T.teal}}>{toMine.length}</span>/{pool.length} txs selected ·{" "}
                <span style={{color:T.gold}}>{toMine.reduce((s,t)=>s+t.fee,0)} sat</span> total fees ·{" "}
                <span style={{color:T.blue}}>{toMine.reduce((s,t)=>s+t.size,0)}</span>/{blockSize} vbytes used
              </div>
              <Btn onClick={handleMine} color={T.gold} small>⛏ Mine Block</Btn>
            </div>
          </>
        )}

        {mined.length>0&&(
          <div style={{marginTop:14,background:"#040912",border:`1px solid ${T.green}44`,
            borderRadius:4,padding:"10px 12px",animation:"fadeIn 0.3s ease"}}>
            <div style={{fontFamily:T.mono,fontSize:10,color:T.green,marginBottom:6}}>
              ✓ {mined.length} TRANSACTIONS MINED — {mined.reduce((s,t)=>s+t.fee,0)} sat in fees collected
            </div>
            {mined.map(tx=>(
              <div key={tx.id} style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:2}}>
                {tx.id} · {tx.from}→{tx.to} · {tx.fee} sat fee
              </div>
            ))}
          </div>
        )}
      </div>

      <InfoBox title="Replace-by-Fee (RBF) and Child-Pays-for-Parent (CPFP)" icon="◈" color={T.blue}>
        <strong>RBF (BIP 125):</strong> A transaction signals replaceability by setting nSequence &lt; 0xFFFFFFFE. The sender can broadcast a new version spending the same inputs with a higher fee — miners prefer the new version. Useful when fees spike after broadcast.<br/><br/>
        <strong>CPFP:</strong> If your parent tx is stuck, spend one of its outputs in a new child tx with a very high fee. Miners evaluate the <em>package</em> fee rate = (parent_fee + child_fee) / (parent_size + child_size) — incentivizing them to include both.
      </InfoBox>
    </div>
  );
};

// ─── SECTION: STATE, STORAGE & LOGS ──────────────────────────────────────────
const StateSection = () => {
  const [activeTab, setActiveTab] = useState("state");
  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§5 — Persistent Data</SecLabel>
      <H2>State, Storage & Logs</H2>
      <Body>Bitcoin stores only a minimal UTXO set. Ethereum's ambition — hosting arbitrary computation — requires a richer data model: a global state trie, per-contract storage, a receipt system, and an event log mechanism.</Body>

      <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:6,
        overflow:"hidden",margin:"16px 0 0"}}>
        {[["state","World State"],["storage","Contract Storage"],["logs","Logs & Events"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{flex:1,padding:"10px",border:"none",cursor:"pointer",
              background:activeTab===id?T.bg3:T.bg2,
              color:activeTab===id?T.teal:T.textMuted,
              fontFamily:T.mono,fontSize:11,
              borderBottom:`2px solid ${activeTab===id?T.teal:"transparent"}`,
              transition:"all 0.15s"}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderTop:"none",
        borderRadius:"0 0 6px 6px",padding:"20px",animation:"fadeIn 0.25s ease"}}>

        {activeTab==="state"&&(
          <>
            <H3>Ethereum's World State — The State Trie</H3>
            <Body>The <strong style={{color:T.teal}}>world state</strong> maps every 20-byte address to an account object. It is stored as a Merkle Patricia Trie (MPT) — a deterministic key-value structure where the root hash commits to all state.</Body>
            <Code title="Account State Object">{`# Every Ethereum address maps to this structure:
AccountState {
  nonce:       uint64   # tx count sent from this address (prevents replay)
  balance:     uint256  # wei (1 ETH = 10^18 wei)
  storageRoot: bytes32  # root of this account's storage MPT (0x56e8... for EOAs)
  codeHash:    bytes32  # keccak256(contract_bytecode); keccak256("") for EOAs
}

# EOA (Externally Owned Account) example:
alice = AccountState(
  nonce=47, balance=2_300_000_000_000_000_000,  # 2.3 ETH
  storageRoot=EMPTY_TRIE_ROOT, codeHash=EMPTY_CODE_HASH
)

# Contract Account example:
uniswap_v3 = AccountState(
  nonce=1, balance=0,
  storageRoot=0x4a3e...,   # root of all pool state
  codeHash=0x1234...,      # hash of deployed bytecode
)`}</Code>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
              {[
                {t:"State Root in Header",v:"Each block header contains stateRoot — the root hash of the world state after all txs in that block are applied. Change any account → different root.",c:T.teal},
                {t:"Merkle Patricia Trie",v:"Supports efficient O(log n) proof generation AND O(log n) updates. Essential for light clients and state proofs.",c:T.gold},
                {t:"State Size Growth",v:"Ethereum's state has grown to >200GB archived. This is the 'state bloat' problem motivating stateless clients and state expiry proposals.",c:T.blue},
                {t:"State Transitions",v:"Each transaction is a pure function: f(prev_state, tx) → new_state. Deterministic across all nodes — consensus requires identical state roots.",c:T.green},
              ].map(r=>(
                <div key={r.t} style={{background:T.bg3,border:`1px solid ${r.c}22`,
                  borderLeft:`2px solid ${r.c}`,borderRadius:4,padding:"10px 12px"}}>
                  <div style={{fontFamily:T.mono,fontSize:10,color:r.c,marginBottom:4}}>{r.t}</div>
                  <div style={{fontFamily:T.body,fontSize:12,color:T.text,lineHeight:1.55}}>{r.v}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab==="storage"&&(
          <>
            <H3>Contract Storage — Persistent Key-Value</H3>
            <Body>Every smart contract has its own <strong style={{color:T.gold}}>storage trie</strong> — a persistent mapping from 256-bit slots to 256-bit values. Storage persists indefinitely between transactions. It is the most expensive data location in the EVM.</Body>
            <Code title="Solidity Storage Layout">{`// Solidity storage variable layout:
contract TokenLedger {
    uint256 public totalSupply;      // SLOT 0: keccak256 key = 0x000...000
    mapping(address => uint256) balances; // SLOT 1: key = keccak256(address || 1)
    address public owner;            // SLOT 2: key = 0x000...002

    function transfer(address to, uint256 amount) external {
        // SLOAD = read from storage: ~2,100 gas (cold), ~100 gas (warm)
        uint256 senderBal = balances[msg.sender];
        require(senderBal >= amount);

        // SSTORE = write to storage: ~20,000 gas (0→nonzero), ~2,900 gas (update)
        balances[msg.sender] = senderBal - amount;
        balances[to] += amount;
        // Two SSTOREs: ~22,900 gas just for balance updates
        // vs reading: ~4,200 gas total for two SLOADs
    }
}

// EVM Data Locations (cost hierarchy):
// stack      → free (within limits)
// memory     → 3 gas / 32 bytes expansion
// calldata   → 4 gas/byte (zero), 16 gas/byte (nonzero)  ← input params
// storage    → 2,100-20,000 gas                          ← EXPENSIVE`}</Code>
            <InfoBox title="Storage Gas Optimization" icon="◈" color={T.gold}>
              Packing multiple small variables into a single 32-byte storage slot saves 20,000 gas per avoided slot. Example: <code style={{fontFamily:T.mono,color:T.teal,fontSize:12}}>uint128 a; uint128 b;</code> occupies 1 slot (both fit in 32 bytes); storing them as separate <code style={{fontFamily:T.mono,color:T.teal,fontSize:12}}>uint256</code> wastes 1 slot = 20,000 extra gas on first write.
            </InfoBox>
          </>
        )}

        {activeTab==="logs"&&(
          <>
            <H3>Logs & Events — Off-Chain Observability</H3>
            <Body>
              <strong style={{color:T.teal}}>Logs</strong> (Ethereum events) are a write-only mechanism for contracts to emit structured data that off-chain clients can index. They are stored in transaction receipts, bloom-filtered for efficient search, and are 50–100× cheaper than storage writes.
            </Body>
            <Code title="Solidity Event Anatomy">{`// Declare an event
event Transfer(
    address indexed from,    // TOPIC 1: indexed → in bloom filter, searchable
    address indexed to,      // TOPIC 2: indexed → in bloom filter
    uint256 value            // DATA: not indexed, cheaper, not bloom-filtered
);

// Emit inside a function
emit Transfer(msg.sender, recipient, amount);

// Resulting log structure in the transaction receipt:
Log {
  address:  0x1234...abcd,   // contract that emitted
  topics: [
    keccak256("Transfer(address,address,uint256)"),  // topic[0] = event signature
    0x000...alice_address,   // topic[1] = indexed 'from'
    0x000...bob_address,     // topic[2] = indexed 'to'
  ],
  data: abi.encode(1000000), // non-indexed value (ABI-encoded)
}

// GAS COST COMPARISON:
// SSTORE (write storage slot):  20,000 gas
// LOG3 (3 topics + data):       375 + 8*len(data) + 375*3 = ~1,500 gas
// → ~13× cheaper for notification purposes

// CRITICAL LIMITATION:
// Contracts CANNOT read logs — no opcode exists for this.
// Logs are purely for off-chain clients (dApp frontends, indexers like The Graph).`}</Code>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
              <div style={{background:T.green+"12",border:`1px solid ${T.green}33`,borderRadius:4,padding:"12px 14px"}}>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.green,marginBottom:8}}>✦ ADVANTAGES</div>
                {["~13× cheaper than SSTORE","Bloom-filtered → fast off-chain queries","Permanent in receipts","Structured with topics + data"].map(v=>(
                  <div key={v} style={{fontFamily:T.body,fontSize:12,color:T.text,marginBottom:4}}>• {v}</div>
                ))}
              </div>
              <div style={{background:T.red+"12",border:`1px solid ${T.red}33`,borderRadius:4,padding:"12px 14px"}}>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.red,marginBottom:8}}>✦ LIMITATIONS</div>
                {["Contracts CANNOT read logs","Not part of the state trie","Cannot be queried on-chain","Must trust indexer to replay them"].map(v=>(
                  <div key={v} style={{fontFamily:T.body,fontSize:12,color:T.text,marginBottom:4}}>• {v}</div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: INTERACTIVE LAB ─────────────────────────────────────────────────
const LabSection = () => {
  const [labTab, setLabTab] = useState("build");

  // ── Lab 1: Toy Chain Builder ──────────────────────────────────────────────
  const [chain, setChain] = useState([GENESIS]);
  const [mempool, setMempool] = useState([
    {id:"tx_lab1",from:"Alice",to:"Bob",amount:2,fee:0.003,size:250},
    {id:"tx_lab2",from:"Bob",to:"Carol",amount:1,fee:0.001,size:220},
    {id:"tx_lab3",from:"Dave",to:"Eve",amount:5,fee:0.008,size:300},
  ]);
  const [txForm, setTxForm] = useState({from:"",to:"",amount:"",fee:""});
  const [mining, setMining] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [miningMsg, setMiningMsg] = useState("");

  const tip = chain[chain.length-1];
  const [selectedTxs, setSelectedTxs] = useState(new Set());

  const toggleTx = (id) => setSelectedTxs(prev=>{
    const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n;
  });

  const handleAddTx = () => {
    const {from,to,amount,fee} = txForm;
    if(!from||!to||!amount||!fee) return;
    const id = "tx_"+Math.random().toString(36).slice(2,8);
    setMempool(prev=>[...prev,{id,from,to,amount:+amount,fee:+fee,size:250}]);
    setTxForm({from:"",to:"",amount:"",fee:""});
  };

  const handleMineBlock = useCallback(()=>{
    const toInclude = mempool.filter(t=>selectedTxs.has(t.id));
    if(toInclude.length===0){setMiningMsg("Select at least one transaction.");return;}
    setMining(true);
    setMiningMsg("Mining… finding nonce…");
    setTimeout(()=>{
      const {nonce,hash} = mineBlock(tip.hash, toInclude, 2);
      const newBlock = mkBlock(chain.length, tip.hash, toInclude, nonce, hash);
      setChain(prev=>[...prev,newBlock]);
      setMempool(prev=>prev.filter(t=>!selectedTxs.has(t.id)));
      setSelectedTxs(new Set());
      setMining(false);
      setMiningMsg(`✓ Block #${chain.length} mined! Nonce=${nonce}, Hash=${hash.slice(0,12)}…`);
    },600);
  },[chain,tip,mempool,selectedTxs]);

  // ── Lab 2: Fork Simulator ─────────────────────────────────────────────────
  const [forkChains, setForkChains] = useState(initForkChains());
  const [forkLog, setForkLog] = useState([
    "Chains initialized. Both share 3-block common prefix (Genesis, B1, B2).",
    "Mining on either chain extends that branch. Canonical = longest chain.",
  ]);
  const [reorgFlash, setReorgFlash] = useState(false);

  const mineOnFork = (idx) => {
    setForkChains(prev=>{
      const updated = prev.map((c,i)=>{
        if(i!==idx) return c;
        const prevTip = c.chain[c.chain.length-1];
        const {nonce,hash} = mineBlock(prevTip.hash,[],2);
        const nb = mkBlock(c.chain.length,prevTip.hash,[],nonce,hash);
        return {...c,chain:[...c.chain,nb]};
      });
      const prev_canonical = forkChains[0].chain.length>=forkChains[1].chain.length?0:1;
      const new_canonical = updated[0].chain.length>=updated[1].chain.length?0:1;
      if(prev_canonical!==new_canonical){
        setReorgFlash(true);
        setTimeout(()=>setReorgFlash(false),1000);
        setForkLog(p=>[...p,
          `⚡ REORG! ${updated[new_canonical].name} (height ${updated[new_canonical].chain.length-1}) overtakes ${updated[prev_canonical].name} (height ${updated[prev_canonical].chain.length-1}). Canonical chain switches!`
        ]);
      } else {
        setForkLog(p=>[...p,`Mined block on ${updated[idx].name} — height ${updated[idx].chain.length-1}. ${updated[new_canonical].name} remains canonical.`]);
      }
      return updated;
    });
  };

  const resetFork = ()=>{ setForkChains(initForkChains()); setForkLog(["Chains reset to initial 3-block fork state."]); };

  // ── Lab 3: Confirmation Depth ─────────────────────────────────────────────
  const [confChain, setConfChain] = useState([
    GENESIS,
    mkBlock(1,GENESIS_HASH,[{id:"watched_tx",from:"Merchant",to:"Customer",amount:1,fee:0.001,size:250}],77,"0000aabbccdd1122334455667788990011223344556677889900112233445566"),
  ]);
  const [watchedTx] = useState("watched_tx");

  const mineConfBlock = ()=>{
    setConfChain(prev=>{
      const t = prev[prev.length-1];
      const {nonce,hash} = mineBlock(t.hash,[],2);
      return [...prev,mkBlock(prev.length,t.hash,[],nonce,hash)];
    });
  };

  const findTxBlock = () => confChain.findIndex(b=>b.txs.some(tx=>tx.id===watchedTx));
  const txBlockIdx = findTxBlock();
  const confDepth = txBlockIdx>=0 ? confChain.length-1-txBlockIdx+1 : 0;
  const confPct = Math.min(100, confDepth/6*100);

  const secLevel = confDepth===0?"Unconfirmed":confDepth===1?"Very Low Risk":confDepth<=2?"Low Risk":confDepth<=3?"Moderate":confDepth<=5?"Good":"High Confidence";
  const secColor = confDepth===0?T.red:confDepth<=2?T.gold:confDepth<=4?T.blue:T.green;

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§6 — Hands-On Laboratory</SecLabel>
      <H2>Interactive Lab: Build · Fork · Confirm</H2>
      <Body>Three self-contained experiments let you observe, hands-on, the mechanics described in this chapter. No external tools needed — everything runs in your browser.</Body>

      <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:6,
        overflow:"hidden",margin:"16px 0 0"}}>
        {[["build","Lab 1: Build Chain"],["fork","Lab 2: Fork & Reorg"],["conf","Lab 3: Confirmation"]].map(([id,label])=>(
          <button key={id} onClick={()=>setLabTab(id)}
            style={{flex:1,padding:"11px 6px",border:"none",cursor:"pointer",
              background:labTab===id?T.bg3:T.bg2,
              color:labTab===id?T.teal:T.textMuted,
              fontFamily:T.mono,fontSize:10,letterSpacing:"0.05em",
              borderBottom:`2px solid ${labTab===id?T.teal:"transparent"}`,
              transition:"all 0.15s"}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderTop:"none",
        borderRadius:"0 0 6px 6px",padding:"20px",animation:"fadeIn 0.25s ease"}}>

        {/* ── LAB 1: BUILD CHAIN ── */}
        {labTab==="build"&&(
          <>
            <div style={{fontFamily:T.mono,fontSize:10,color:T.teal,letterSpacing:"0.12em",marginBottom:12}}>
              ▸ OBJECTIVE: Add transactions to the mempool, select them, and mine a block. Observe how the chain grows.
            </div>

            {/* Chain visualization */}
            <div style={{overflowX:"auto",marginBottom:16,paddingBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:0,minWidth:Math.max(300,chain.length*120)}}>
                {chain.map((b,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center"}}>
                    <div onClick={()=>setSelectedBlock(selectedBlock===i?null:i)}
                      style={{background:selectedBlock===i?T.teal+"22":T.bg3,
                        border:`1px solid ${selectedBlock===i?T.teal:T.border}`,
                        borderRadius:5,padding:"8px 10px",minWidth:100,cursor:"pointer",
                        transition:"all 0.15s",animation:"fadeIn 0.3s ease"}}>
                      <div style={{fontFamily:T.mono,fontSize:9,color:T.teal,marginBottom:3}}>
                        BLOCK #{b.index}
                      </div>
                      <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted}}>
                        hash: {shortHash(b.hash)}
                      </div>
                      <div style={{fontFamily:T.mono,fontSize:9,color:T.gold,marginTop:2}}>
                        {b.txs.length} tx
                      </div>
                    </div>
                    {i<chain.length-1&&(
                      <div style={{display:"flex",alignItems:"center",padding:"0 3px"}}>
                        <div style={{width:16,height:1,background:T.border}}/>
                        <div style={{color:T.teal,fontSize:12}}>▶</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected block detail */}
            {selectedBlock!==null&&(
              <div style={{background:"#040912",border:`1px solid ${T.teal}33`,borderRadius:5,
                padding:"12px 14px",marginBottom:14,animation:"slideRight 0.25s ease"}}>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.teal,marginBottom:8}}>
                  BLOCK #{chain[selectedBlock]?.index} DETAIL
                </div>
                {[
                  ["hash",chain[selectedBlock]?.hash||""],
                  ["prevHash",chain[selectedBlock]?.prevHash||""],
                  ["nonce",String(chain[selectedBlock]?.nonce||0)],
                  ["transactions",JSON.stringify((chain[selectedBlock]?.txs||[]).map(t=>t.id))],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:10,marginBottom:4}}>
                    <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,minWidth:80}}>{k}:</span>
                    <span style={{fontFamily:T.mono,fontSize:10,color:T.text,wordBreak:"break-all"}}>{v.length>60?v.slice(0,60)+"…":v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Two-col: Mempool + Add tx */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:8}}>
                  MEMPOOL ({mempool.length} txs) — click to select
                </div>
                {mempool.length===0&&(
                  <div style={{fontFamily:T.mono,fontSize:11,color:T.textMuted,
                    textAlign:"center",padding:"16px"}}>Mempool empty</div>
                )}
                {mempool.map(tx=>(
                  <div key={tx.id} onClick={()=>toggleTx(tx.id)}
                    style={{background:selectedTxs.has(tx.id)?T.teal+"18":T.bg3,
                      border:`1px solid ${selectedTxs.has(tx.id)?T.teal:T.border}`,
                      borderRadius:4,padding:"8px 10px",marginBottom:5,cursor:"pointer",
                      transition:"all 0.15s"}}>
                    <div style={{fontFamily:T.mono,fontSize:10,color:T.teal}}>{tx.id}</div>
                    <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>
                      {tx.from}→{tx.to} · {tx.amount} BTC · {tx.fee} BTC fee
                    </div>
                  </div>
                ))}
                <div style={{marginTop:10}}>
                  <Btn onClick={handleMineBlock} disabled={mining||selectedTxs.size===0}
                    color={T.gold} small>
                    {mining?"⛏ Mining…":"⛏ Mine Selected Txs"}
                  </Btn>
                </div>
                {miningMsg&&(
                  <div style={{fontFamily:T.mono,fontSize:10,color:T.green,marginTop:8,
                    lineHeight:1.5}}>{miningMsg}</div>
                )}
              </div>

              <div>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:8}}>
                  ADD TRANSACTION TO MEMPOOL
                </div>
                {[["from","Sender"],["to","Recipient"],["amount","Amount (BTC)"],["fee","Fee (BTC)"]].map(([k,label])=>(
                  <input key={k} placeholder={label} value={txForm[k]}
                    onChange={e=>setTxForm(prev=>({...prev,[k]:e.target.value}))}
                    style={{display:"block",width:"100%",marginBottom:6,padding:"7px 10px",
                      background:T.bg3,border:`1px solid ${T.border}`,borderRadius:4,
                      fontFamily:T.mono,fontSize:11,color:T.text,outline:"none"}}/>
                ))}
                <Btn onClick={handleAddTx} small color={T.blue}>+ Add to Mempool</Btn>
              </div>
            </div>
          </>
        )}

        {/* ── LAB 2: FORK & REORG ── */}
        {labTab==="fork"&&(
          <>
            <div style={{fontFamily:T.mono,fontSize:10,color:T.teal,letterSpacing:"0.12em",marginBottom:12}}>
              ▸ OBJECTIVE: Mine blocks on Chain A and Chain B. Observe reorgs when one chain overtakes the other.
            </div>

            {/* Two chains */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14,
              animation:reorgFlash?"reorgFlash 0.5s ease":"none"}}>
              {forkChains.map((fc,idx)=>{
                const isCanonical = forkChains[0].chain.length>=forkChains[1].chain.length
                  ? idx===0 : idx===1;
                return (
                  <div key={fc.name} style={{background:T.bg3,border:`1px solid ${isCanonical?fc.color:T.border}`,
                    borderRadius:6,padding:"12px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",
                      alignItems:"center",marginBottom:10}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{fontFamily:T.mono,fontSize:11,color:fc.color,fontWeight:600}}>{fc.name}</div>
                        {isCanonical&&<Tag color={T.green}>CANONICAL</Tag>}
                      </div>
                      <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>
                        height: {fc.chain.length-1}
                      </div>
                    </div>
                    <div style={{overflowX:"auto",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:0,minWidth:300}}>
                        {fc.chain.map((b,i)=>(
                          <div key={i} style={{display:"flex",alignItems:"center"}}>
                            <div style={{background:fc.color+"18",border:`1px solid ${fc.color}44`,
                              borderRadius:3,padding:"4px 6px",textAlign:"center",minWidth:42}}>
                              <div style={{fontFamily:T.mono,fontSize:9,color:fc.color}}>B{b.index}</div>
                              <div style={{fontFamily:T.mono,fontSize:8,color:T.textMuted}}>
                                {b.hash.slice(0,4)}
                              </div>
                            </div>
                            {i<fc.chain.length-1&&<div style={{width:6,height:1,background:fc.color+"44"}}/>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Btn onClick={()=>mineOnFork(idx)} small color={fc.color}>
                      ⛏ Mine on {fc.name}
                    </Btn>
                  </div>
                );
              })}
            </div>

            <div style={{background:"#040912",border:`1px solid ${T.border}`,borderRadius:5,
              padding:"10px 12px",maxHeight:140,overflowY:"auto"}}>
              <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:6,
                letterSpacing:"0.1em"}}>FORK EVENT LOG</div>
              {forkLog.map((msg,i)=>(
                <div key={i} style={{fontFamily:T.mono,fontSize:10,color:
                  msg.includes("REORG")?T.red:T.textMuted,
                  marginBottom:3,lineHeight:1.5}}>
                  [{String(i).padStart(2,"0")}] {msg}
                </div>
              ))}
            </div>
            <div style={{marginTop:10}}>
              <Btn onClick={resetFork} color={T.red} small>↺ Reset Fork State</Btn>
            </div>

            <InfoBox title="What to observe" icon="◈" color={T.gold}>
              Mine 2+ blocks on Chain B while Chain A stays at the same height. The moment Chain B overtakes Chain A, a <strong>REORG</strong> is logged. Any transactions that existed only on Chain A would return to the mempool. This is exactly what happened in the 2016 Ethereum DAO fork and the 2021 BSV reorg.
            </InfoBox>
          </>
        )}

        {/* ── LAB 3: CONFIRMATION DEPTH ── */}
        {labTab==="conf"&&(
          <>
            <div style={{fontFamily:T.mono,fontSize:10,color:T.teal,letterSpacing:"0.12em",marginBottom:12}}>
              ▸ OBJECTIVE: Watch confirmation depth grow. Observe how security increases with each new block.
            </div>

            <div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:6,
              padding:"14px 16px",marginBottom:14}}>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:6}}>WATCHED TRANSACTION</div>
              <div style={{fontFamily:T.mono,fontSize:11,color:T.teal}}>{watchedTx}</div>
              <div style={{fontFamily:T.body,fontSize:13,color:T.text,marginTop:4}}>
                Merchant → Customer · 1 BTC · included in Block #{txBlockIdx}
              </div>
            </div>

            {/* Chain with highlight */}
            <div style={{overflowX:"auto",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:0,
                minWidth:Math.max(300,confChain.length*90)}}>
                {confChain.map((b,i)=>{
                  const hasTx = b.txs.some(tx=>tx.id===watchedTx);
                  const conf = hasTx?confChain.length-1-i+1:null;
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center"}}>
                      <div style={{background:hasTx?T.green+"22":T.bg3,
                        border:`1px solid ${hasTx?T.green:T.border}`,
                        borderRadius:5,padding:"6px 8px",minWidth:72,textAlign:"center",
                        transition:"all 0.2s",animation:"fadeIn 0.3s ease"}}>
                        <div style={{fontFamily:T.mono,fontSize:9,color:hasTx?T.green:T.teal}}>
                          #{b.index}
                        </div>
                        {hasTx&&(
                          <div style={{fontFamily:T.mono,fontSize:8,color:T.green,marginTop:2}}>
                            TX HERE
                          </div>
                        )}
                        {!hasTx&&i>txBlockIdx&&txBlockIdx>=0&&(
                          <div style={{fontFamily:T.mono,fontSize:8,color:T.textMuted,marginTop:2}}>
                            +{i-txBlockIdx} conf
                          </div>
                        )}
                      </div>
                      {i<confChain.length-1&&(
                        <div style={{width:12,height:1,background:T.border}}/>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security meter */}
            <div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:6,
              padding:"16px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",
                marginBottom:10}}>
                <div>
                  <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:4}}>
                    CONFIRMATION DEPTH
                  </div>
                  <div style={{fontFamily:T.display,fontSize:36,color:secColor,fontWeight:700,lineHeight:1}}>
                    {confDepth}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <Tag color={secColor}>{secLevel}</Tag>
                  <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginTop:4}}>
                    {confDepth}/6 standard threshold
                  </div>
                </div>
              </div>
              {/* Bar */}
              <div style={{height:8,background:T.bg4,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${confPct}%`,background:secColor,
                  borderRadius:4,transition:"width 0.4s ease"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                {[0,1,2,3,4,5,6].map(n=>(
                  <div key={n} style={{fontFamily:T.mono,fontSize:8,color:T.textMuted}}>{n}</div>
                ))}
              </div>
            </div>

            <Btn onClick={mineConfBlock} color={T.green} small>⛏ Mine Next Block (add confirmation)</Btn>

            <InfoBox title="The Security Intuition" icon="◈" color={T.green}>
              Each new block added after your transaction's block requires an attacker to re-mine that block AND all subsequent blocks. With 10% of hash power, reversing a 6-confirmation transaction has only ~0.0024% probability. The Nakamoto security model rests on this exponential relationship.
            </InfoBox>
          </>
        )}
      </div>
    </div>
  );
};

// ─── QUIZ SECTION ─────────────────────────────────────────────────────────────
const QuizSection = () => {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(null);

  const bySec = QUIZZES.reduce((acc,q,i)=>{
    (acc[q.section]=acc[q.section]||[]).push({...q,idx:i}); return acc;
  },{});

  const allAnswered = QUIZZES.every((_,i)=>revealed[i]);

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§7 — Knowledge Checks</SecLabel>
      <H2>In-Class Quizzes</H2>
      <Body>Select your answer, then click Submit to reveal the explanation. Complete all questions to calculate your score.</Body>

      {score!==null&&(
        <div style={{background:score>=6?T.green+"18":score>=4?T.gold+"18":T.red+"18",
          border:`1px solid ${score>=6?T.green:score>=4?T.gold:T.red}44`,
          borderRadius:6,padding:"18px 22px",margin:"16px 0",textAlign:"center",
          animation:"fadeUp 0.4s ease"}}>
          <div style={{fontFamily:T.display,fontSize:42,fontWeight:800,
            color:score>=6?T.green:score>=4?T.gold:T.red}}>{score}/{QUIZZES.length}</div>
          <div style={{fontFamily:T.mono,fontSize:12,color:T.text,marginTop:8}}>
            {score===QUIZZES.length?"Perfect. Complete mastery of data structures and transaction lifecycle.":
             score>=6?"Strong understanding. Review explanations for any missed questions.":
             score>=4?"Solid foundation. Re-read the relevant sections before the assessment.":
             "Revisit §2–§5 and retry."}
          </div>
        </div>
      )}

      {Object.entries(bySec).map(([sec,qs])=>(
        <div key={sec} style={{marginBottom:28}}>
          <div style={{fontFamily:T.mono,fontSize:10,color:T.gold,letterSpacing:"0.12em",
            margin:"22px 0 12px",borderBottom:`1px solid ${T.border}`,paddingBottom:8}}>
            {sec}
          </div>
          {qs.map(q=>{
            const i=q.idx;
            const isRevealed=revealed[i];
            const isCorrect=answers[i]===q.ans;
            return (
              <div key={i} style={{background:T.bg2,
                border:`1px solid ${isRevealed?(isCorrect?T.green+"55":T.red+"55"):T.border}`,
                borderRadius:6,padding:"16px 18px",marginBottom:14,animation:"fadeIn 0.3s ease"}}>
                <div style={{fontFamily:T.body,fontSize:15,color:T.textBright,
                  marginBottom:14,lineHeight:1.7}}>
                  <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginRight:8}}>Q{i+1}.</span>
                  {q.q}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {q.opts.map((opt,oi)=>{
                    let bg=T.bg3,border=T.border,color=T.text;
                    if(isRevealed){
                      if(oi===q.ans){bg=T.green+"1a";border=T.green;color=T.green;}
                      else if(oi===answers[i]&&oi!==q.ans){bg=T.red+"15";border=T.red;color=T.red;}
                    } else if(answers[i]===oi){bg=T.teal+"15";border=T.teal;color=T.teal;}
                    return (
                      <button key={oi} onClick={()=>!isRevealed&&setAnswers(p=>({...p,[i]:oi}))}
                        style={{background:bg,border:`1px solid ${border}`,borderRadius:5,
                          padding:"9px 12px",cursor:isRevealed?"default":"pointer",
                          textAlign:"left",fontFamily:T.body,fontSize:13,color,lineHeight:1.5,
                          transition:"all 0.15s"}}>
                        <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginRight:8}}>
                          {String.fromCharCode(65+oi)}.
                        </span>
                        {opt}
                        {isRevealed&&oi===q.ans&&<span style={{marginLeft:6,fontSize:12}}>✓</span>}
                        {isRevealed&&oi===answers[i]&&oi!==q.ans&&<span style={{marginLeft:6,fontSize:12}}>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {!isRevealed&&(
                  <button onClick={()=>answers[i]!==undefined&&setRevealed(p=>({...p,[i]:true}))}
                    disabled={answers[i]===undefined}
                    style={{marginTop:10,padding:"7px 18px",
                      background:answers[i]!==undefined?T.teal+"22":T.bg3,
                      border:`1px solid ${answers[i]!==undefined?T.teal+"66":T.border}`,
                      borderRadius:4,cursor:answers[i]!==undefined?"pointer":"default",
                      color:answers[i]!==undefined?T.teal:T.textMuted,
                      fontFamily:T.mono,fontSize:10,fontWeight:600,transition:"all 0.2s"}}>
                    Submit Answer
                  </button>
                )}
                {isRevealed&&(
                  <div style={{marginTop:12,background:"#040912",borderRadius:5,
                    padding:"10px 12px",borderLeft:`3px solid ${isCorrect?T.green:T.gold}`,
                    animation:"slideRight 0.3s ease"}}>
                    <div style={{fontFamily:T.mono,fontSize:9,color:isCorrect?T.green:T.gold,
                      marginBottom:6,letterSpacing:"0.1em"}}>
                      {isCorrect?"✓ CORRECT":"✗ INCORRECT"} — EXPLANATION
                    </div>
                    <div style={{fontFamily:T.body,fontSize:13,color:T.text,lineHeight:1.7}}>
                      {q.explain}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {allAnswered&&score===null&&(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <button onClick={()=>setScore(QUIZZES.filter((q,i)=>answers[i]===q.ans).length)}
            style={{padding:"11px 32px",background:T.teal,color:T.bg0,border:"none",
              borderRadius:5,cursor:"pointer",fontFamily:T.mono,fontSize:12,fontWeight:700,
              letterSpacing:"0.08em"}}>
            CALCULATE SCORE
          </button>
        </div>
      )}
    </div>
  );
};

// ─── ASSESSMENT SECTION ───────────────────────────────────────────────────────
const AssessSection = () => {
  const [revealed, setRevealed] = useState({});
  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§8 — Assessment Problems</SecLabel>
      <H2>End-of-Chapter Problems</H2>
      <Body>Graded problems ranging from foundational to advanced. Attempt each independently before revealing the model answer. Problems are suitable for homework, exams, or seminar discussion.</Body>

      <div style={{display:"flex",gap:8,margin:"14px 0 22px",flexWrap:"wrap"}}>
        {[[T.green,"Foundational"],[T.gold,"Intermediate"],[T.red,"Advanced"]].map(([c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:10,height:10,background:c,borderRadius:2}}/>
            <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>{l}</span>
          </div>
        ))}
      </div>

      {ASSESSMENTS.map((a)=>(
        <div key={a.id} style={{background:T.bg2,border:`1px solid ${T.border}`,
          borderLeft:`3px solid ${a.color}`,borderRadius:6,padding:"18px 20px",
          marginBottom:18,animation:"fadeUp 0.4s ease"}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
            <span style={{fontFamily:T.display,fontSize:20,fontWeight:800,color:a.color}}>{a.id}</span>
            <Tag color={a.color}>{a.diff}</Tag>
          </div>
          <div style={{fontFamily:T.body,fontSize:15,color:T.textBright,lineHeight:1.8,
            marginBottom:14}}>{a.problem}</div>
          <Btn onClick={()=>setRevealed(p=>({...p,[a.id]:!p[a.id]}))}
            color={a.color} small>
            {revealed[a.id]?"▲ Hide Answer":"▼ Reveal Model Answer"}
          </Btn>
          {revealed[a.id]&&(
            <div style={{marginTop:14,animation:"slideRight 0.3s ease"}}>
              <div style={{fontFamily:T.mono,fontSize:9,color:a.color,letterSpacing:"0.12em",
                marginBottom:8}}>MODEL ANSWER</div>
              <Code title={`${a.id} — Model Answer`}>{a.answer}</Code>
            </div>
          )}
        </div>
      ))}

      <InfoBox title="Further Reading" icon="◈" color={T.violet}>
        <strong>Bitcoin:</strong> developer.bitcoin.org/devguide/block_chain.html · bitcoin.org/bitcoin.pdf (Satoshi, 2008)<br/><br/>
        <strong>Ethereum:</strong> ethereum.org/en/developers/docs/blocks/ · Ethereum Yellow Paper §4 (state transitions) · Wood, G. (2014). Ethereum: A Secure Decentralised Generalised Transaction Ledger.<br/><br/>
        <strong>Mempool economics:</strong> Houy, N. (2014). The Economics of Bitcoin Transaction Fees. · mempool.space (live mempool visualization)
      </InfoBox>
    </div>
  );
};

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function BlockchainDataStructures() {
  const [active, setActive] = useState("intro");
  const contentRef = useRef(null);

  useEffect(()=>{
    if(contentRef.current) contentRef.current.scrollTop=0;
  },[active]);

  const SECTIONS = {
    intro:<IntroSection/>,
    blocks:<BlockStructureSection/>,
    reorgs:<ReorgSection/>,
    mempool:<MempoolSection/>,
    state:<StateSection/>,
    lab:<LabSection/>,
    quiz:<QuizSection/>,
    assess:<AssessSection/>,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{display:"flex",height:"100vh",background:T.bg0,color:T.text,
        fontFamily:T.body,overflow:"hidden"}}>

        {/* ── SIDEBAR ── */}
        <div style={{width:215,background:T.bg1,borderRight:`1px solid ${T.border}`,
          display:"flex",flexDirection:"column",flexShrink:0}}>
          {/* Header */}
          <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontFamily:T.mono,fontSize:8,color:T.textMuted,
              letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:8}}>
              ACM EDUCATIONAL SERIES
            </div>
            <div style={{fontFamily:T.display,fontSize:15,fontWeight:700,
              color:T.textBright,lineHeight:1.25,marginBottom:2}}>
              Blockchain Data<br/>Structures
            </div>
            <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:10}}>
              Transaction Lifecycle
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:T.teal,
                animation:"blink 1.5s ease infinite"}}/>
              <span style={{fontFamily:T.mono,fontSize:9,color:T.textMuted}}>Chapter 2 · Live</span>
            </div>
          </div>

          {/* Nav */}
          <nav style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
            {CHAPTERS.map(ch=>(
              <button key={ch.id} onClick={()=>setActive(ch.id)}
                style={{width:"100%",padding:"9px 14px",background:active===ch.id?T.teal+"14":"none",
                  border:"none",borderLeft:`3px solid ${active===ch.id?T.teal:"transparent"}`,
                  cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center",
                  transition:"all 0.15s"}}>
                <span style={{fontFamily:T.mono,fontSize:9,color:active===ch.id?T.teal:T.textMuted,
                  minWidth:18}}>{ch.short}</span>
                <span style={{fontFamily:T.body,fontSize:12.5,
                  color:active===ch.id?T.textBright:T.textMuted,lineHeight:1.3}}>
                  {ch.label.replace(/^§\d+ /,"")}
                </span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div style={{padding:"10px 14px",borderTop:`1px solid ${T.border}`}}>
            <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,lineHeight:1.7}}>
              8 Quizzes · 5 Problems<br/>
              3 Interactive Labs<br/>
              Distributed Systems
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div ref={contentRef}
          style={{flex:1,overflowY:"auto",padding:"38px 46px",maxWidth:860,
            margin:"0 auto",width:"100%"}}>
          {SECTIONS[active]}

          {/* Prev/Next */}
          <div style={{display:"flex",justifyContent:"space-between",
            marginTop:44,paddingTop:22,borderTop:`1px solid ${T.border}`}}>
            {(()=>{
              const idx=CHAPTERS.findIndex(c=>c.id===active);
              const prev=CHAPTERS[idx-1], next=CHAPTERS[idx+1];
              return (
                <>
                  {prev?(
                    <Btn onClick={()=>setActive(prev.id)} color={T.textMuted} small>
                      ← {prev.label}
                    </Btn>
                  ):<div/>}
                  {next&&(
                    <Btn onClick={()=>setActive(next.id)} color={T.teal} small>
                      {next.label} →
                    </Btn>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
