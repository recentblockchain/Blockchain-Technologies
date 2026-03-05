import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Footer from "../src/Footer";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; background: #080c10; }
  ::-webkit-scrollbar-thumb { background: #1a3a4a; border-radius: 2px; }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideR    { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes radarSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ping      { 0%{transform:scale(1);opacity:0.9} 60%{transform:scale(2.2);opacity:0} 100%{transform:scale(2.2);opacity:0} }
  @keyframes ripple    { 0%{transform:scale(0.4);opacity:1} 100%{transform:scale(3);opacity:0} }
  @keyframes logScroll { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:translateX(0)} }
  @keyframes eclipseIn { 0%{box-shadow:0 0 0 0 rgba(255,80,80,0)} 100%{box-shadow:0 0 0 12px rgba(255,80,80,0.12)} }
  @keyframes dash      { to{stroke-dashoffset:0} }
  @keyframes hpulse    { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes floatUp   { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-28px)} }
`;

// ─── PALETTE + TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg0:"#060a0e", bg1:"#0a1018", bg2:"#0e1820", bg3:"#121f2a", bg4:"#182836",
  border:"#1c3344", borderBright:"#2a5066",
  cyan:"#00e5ff",  cyanDim:"#006680",  cyanFaint:"#00e5ff14",
  orange:"#ff9800",orangeDim:"#7a4400",orangeFaint:"#ff980014",
  red:"#ff5252",   redDim:"#7a1414",   redFaint:"#ff525214",
  lime:"#76ff03",  limeFaint:"#76ff0312",
  yellow:"#ffe066",yellowFaint:"#ffe06614",
  violet:"#c084fc",violetFaint:"#c084fc12",
  text:"#7eb8cc",  textMuted:"#2e5a6e", textBright:"#d6eef5",
  mono:"'IBM Plex Mono', monospace",
  disp:"'Orbitron', sans-serif",
  body:"'Merriweather', serif",
};

// ─── DETERMINISTIC LAYOUT: fixed node positions for 12 nodes ─────────────────
const NODE_POS = [
  {x:50,y:50},  // 0 center
  {x:20,y:20},  // 1 top-left
  {x:50,y:12},  // 2 top
  {x:80,y:20},  // 3 top-right
  {x:88,y:50},  // 4 right
  {x:80,y:80},  // 5 bottom-right
  {x:50,y:88},  // 6 bottom
  {x:20,y:80},  // 7 bottom-left
  {x:12,y:50},  // 8 left
  {x:35,y:35},  // 9 inner top-left
  {x:65,y:35},  // 10 inner top-right
  {x:65,y:65},  // 11 inner bottom-right
];

// Edges for the P2P mesh (each node connects to 3–4 others)
const EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,9],[0,10],
  [1,2],[1,8],[1,9],
  [2,3],[2,10],
  [3,4],[3,10],
  [4,5],[4,11],
  [5,6],[5,11],
  [6,7],[6,11],
  [7,8],[7,9],
  [8,9],
  [9,10],[9,11],
  [10,11],
];

// ─── SHARED UI ATOMS ──────────────────────────────────────────────────────────
const SecLabel = ({ children }) => (
  <div style={{ fontFamily:C.mono, fontSize:10, color:C.cyan, letterSpacing:"0.22em",
    textTransform:"uppercase", marginBottom:7 }}>{children}</div>
);
const H2 = ({ children }) => (
  <h2 style={{ fontFamily:C.disp, fontSize:24, fontWeight:700, color:C.textBright,
    lineHeight:1.2, marginBottom:5, letterSpacing:"0.05em" }}>{children}</h2>
);
const H3 = ({ children, color=C.cyan }) => (
  <h3 style={{ display:"flex", alignItems:"center", gap:9, fontFamily:C.mono,
    fontSize:11, fontWeight:600, color, letterSpacing:"0.13em",
    textTransform:"uppercase", margin:"22px 0 10px" }}>
    <span style={{ display:"inline-block", width:14, height:1, background:color }}/>
    {children}
    <span style={{ flex:1, height:1, background:color, opacity:0.15 }}/>
  </h3>
);
const Body = ({ children, style={} }) => (
  <p style={{ fontFamily:C.body, fontSize:15, lineHeight:1.95, color:C.text,
    margin:"11px 0", ...style }}>{children}</p>
);
const Code = ({ children, title, compact=false }) => (
  <div style={{ background:"#030608", border:`1px solid ${C.border}`,
    borderRadius:4, margin:compact?"6px 0":"12px 0", overflow:"hidden" }}>
    {title && <div style={{ background:C.bg2, borderBottom:`1px solid ${C.border}`,
      padding:"5px 12px", fontFamily:C.mono, fontSize:10, color:C.textMuted }}>{title}</div>}
    <pre style={{ padding:compact?"9px 13px":"13px 16px", fontFamily:C.mono,
      fontSize:12, color:C.cyan, lineHeight:1.78, overflowX:"auto",
      whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{children}</pre>
  </div>
);
const InfoBox = ({ title, children, color=C.cyan, icon="▸" }) => (
  <div style={{ background:C.bg2, border:`1px solid ${color}28`,
    borderLeft:`3px solid ${color}`, borderRadius:4,
    padding:"13px 17px", margin:"15px 0" }}>
    <div style={{ fontFamily:C.mono, fontSize:10, color, letterSpacing:"0.12em",
      textTransform:"uppercase", marginBottom:7 }}>{icon} {title}</div>
    <div style={{ fontFamily:C.body, fontSize:14, color:C.text, lineHeight:1.8 }}>{children}</div>
  </div>
);
const HR = () => (
  <div style={{ height:1, margin:"26px 0",
    background:`linear-gradient(90deg,${C.cyan}44,${C.border},transparent)` }}/>
);
const Tag = ({ children, color=C.cyan }) => (
  <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:2,
    background:`${color}18`, border:`1px solid ${color}38`, color,
    fontFamily:C.mono, fontSize:10, letterSpacing:"0.06em", fontWeight:600 }}>{children}</span>
);
const Btn = ({ onClick, children, color=C.cyan, disabled=false, small=false }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ padding:small?"6px 14px":"9px 20px",
      background:disabled?C.bg3:`${color}18`,
      border:`1px solid ${disabled?C.border:`${color}50`}`,
      borderRadius:3, cursor:disabled?"not-allowed":"pointer",
      color:disabled?C.textMuted:color, fontFamily:C.mono,
      fontSize:small?10:11, fontWeight:600, letterSpacing:"0.07em",
      transition:"all 0.15s", opacity:disabled?0.5:1 }}>{children}</button>
);

const CHAPTERS = [
  { id:"intro",    label:"§1 Overview",          short:"§1" },
  { id:"gossip",   label:"§2 Gossip & Latency",  short:"§2" },
  { id:"attacks",  label:"§3 Network Attacks",    short:"§3" },
  { id:"observe",  label:"§4 Observability",      short:"§4" },
  { id:"lab",      label:"§5 Interactive Lab",    short:"§5" },
  { id:"quiz",     label:"§6 Quizzes",            short:"§6" },
  { id:"assess",   label:"§7 Assessment",         short:"§7" },
];

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const QUIZZES = [
  {
    sec:"§2 Gossip Propagation",
    q:"Bitcoin uses 'inventory-based' gossip (INV → GETDATA → block). Why doesn't it just broadcast the full block immediately to all peers, which would be faster?",
    opts:[
      "Full-block broadcast is forbidden by the Bitcoin protocol specification",
      "Immediate full broadcast causes bandwidth amplification: each of 8 peers sends the full block to their 8 peers recursively — a node with 1,000 peers would receive the same 1 MB block ~1,000 times. INV-based gossip lets nodes deduplicate via the inventory hash before downloading the block body.",
      "Full blocks cannot be serialized for network transmission without first computing an inventory hash",
      "The Bitcoin P2P protocol predates TCP/IP and cannot send variable-length messages",
    ],
    ans:1,
    explain:"Without inventory deduplication, a network of N nodes receiving a block simultaneously would generate O(N × connections) redundant transmissions. INV messages (36 bytes) serve as lightweight advertisements. A node that already has a block ignores the INV; only nodes that lack it respond with GETDATA. Compact Block Relay (BIP 152) extends this further: it sends only short transaction IDs, assuming most txs are already in the recipient's mempool.",
  },
  {
    sec:"§2 Gossip Propagation",
    q:"A new Bitcoin block takes 2–4 seconds to reach 50% of the network and ~15 seconds to reach 95%. During this propagation window, what network-level phenomenon can occur?",
    opts:[
      "Nodes receiving the block early begin rebroadcasting it to nodes that already have it, causing bandwidth storms",
      "Two miners who haven't yet received each other's block can simultaneously mine valid blocks at the same height, creating a natural (stale) fork — the block propagation latency window is the primary driver of accidental forks in Bitcoin",
      "The mempool is temporarily locked during propagation, preventing new transactions from being broadcast",
      "Nodes receiving the block late are automatically penalized with a temporary ban score",
    ],
    ans:1,
    explain:"Stale/orphan blocks arise when miner A mines block B_A at height H, and miner B (who hasn't yet received B_A) also mines B_B at height H. For the propagation latency window (~15 seconds), both branches coexist. Miners on each branch waste hashrate on the losing fork. Bitcoin's stale block rate is ~0.4–1.0% precisely because of this latency. Faster propagation (via compact blocks, FIBRE relay) reduces stale rates. Ethereum's shorter target block time (~12 seconds) historically had stale rates of 6–12% before the Merge.",
  },
  {
    sec:"§3 Network Attacks",
    q:"An Eclipse attack successfully isolates a Bitcoin node. What can the attacker do with this access, and what CAN'T they do?",
    opts:[
      "CAN: read the victim's private keys from P2P messages. CANNOT: affect the victim's view of the chain",
      "CAN: feed the victim a fake chain view (delayed/fabricated blocks), enable targeted double-spends against the victim, waste the victim's mining hashrate on a stale branch. CANNOT: forge ECDSA signatures, create coins, or affect the global chain state seen by non-eclipsed nodes",
      "CAN: steal all funds in the victim's wallet by intercepting transaction signatures. CANNOT: prevent the victim from connecting to Tor nodes",
      "CAN: modify blocks the victim has already confirmed. CANNOT: prevent the victim from mining new blocks",
    ],
    ans:1,
    explain:"An eclipse attack controls the victim's entire peer set — all 8 of their connections. The attacker fully controls the victim's view of the blockchain. Practical attacks: (1) 0-confirmation double-spend: attacker accepts a tx from victim on their fake chain, pays an exchange on the real chain simultaneously. (2) Selfish mining amplification: victim's miner wastes hashrate on attacker-controlled stale blocks. (3) Routing-based partitioning: routing an eclipse at the BGP level can isolate entire mining pools. What the attacker cannot do: break elliptic curve cryptography, access private keys, or affect non-eclipsed nodes.",
  },
  {
    sec:"§3 Network Attacks",
    q:"Bitcoin Core's default outbound peer limit is 8 connections. Heilman et al. (2015) showed that an eclipser needs to occupy ALL of a victim's outbound slots. How did Bitcoin Core mitigate eclipse attacks after this discovery?",
    opts:[
      "Bitcoin Core switched to TLS-encrypted connections so attackers cannot distinguish peers",
      "Multiple mitigations were added: (1) Feeler connections — periodic probes that try fresh addresses and evict stale ones; (2) Anchor connections — 2 outbound connections persisted across restarts from a 'good' peer list; (3) ADDR diversification — connections spread across different /16 IP subnets; (4) Increased random jitter in connection schedules to make timing attacks harder",
      "Bitcoin Core disabled all inbound connections by default, removing the attack surface entirely",
      "A proof-of-work challenge was added to the handshake so attackers must mine to create fake peers",
    ],
    ans:1,
    explain:"The 2015 eclipse attack paper (Heilman et al.) triggered several protocol hardening measures. The key insight: attackers fill the victim's tried/new address tables with attacker IPs, then wait for the victim to restart (connections are re-established). Feeler connections actively probe fresh addresses, preventing table poisoning from being permanent. Anchor connections ensure at least 2 peers from the last session survive restarts. Subnet diversity (max 1 connection per /16) stops an attacker who controls a single IP block from eclipsing a node.",
  },
  {
    sec:"§2 Gossip Propagation",
    q:"What is the 'selfish mining' strategy, and how does block propagation latency make it more effective?",
    opts:[
      "Selfish miners broadcast blocks early to gain a larger share of fees before other miners can claim them",
      "A selfish miner withholds a found block, continuing to mine secretly. When the honest network finds a block, the selfish miner releases their withheld block(s) — if they're ahead, they cause the honest chain to reorganize. Propagation latency helps because a miner with fast internal connectivity can propagate their chain faster than the honest network can respond.",
      "Selfish mining is a social attack where miners publicly threaten to switch to a competitor chain unless paid a fee",
      "Selfish miners submit blocks with lower fees to ensure they are included in fewer candidate chains, improving their relative position",
    ],
    ans:1,
    explain:"Eyal & Sirer (2013) showed that a selfish miner with >25% (or >33% without fast propagation) hashrate can earn disproportionate rewards. Mechanism: mine block B1 secretly → honest network mines block H1 → release B1 immediately → if selfish miner is connected to >50% of network faster than H1 propagates, B1 wins the race. Propagation advantages (e.g., being directly peered with large mining pools) lower the threshold. The FIBRE (Fast Internet Bitcoin Relay Engine) network emerged partly as a response — fast relay reduces the selfish miner's propagation advantage.",
  },
  {
    sec:"§4 Observability",
    q:"A Bitcoin node operator sees the log line: '[warning] Abnormally high number of blocks received (6) with same prev_hash at height 732100'. What does this indicate?",
    opts:[
      "The node is experiencing a mempool overflow and dropping transactions",
      "A fork occurred at height 732100: six competing blocks with the same parent were received, indicating either a selfish mining attack, an eclipse attack feeding multiple competing chains, or (more likely) unusually high network latency causing simultaneous mining by multiple pools",
      "The node's block database is corrupted and returning duplicate entries",
      "Six transactions within the same block referenced the same previous output, indicating a double-spend attempt",
    ],
    ans:1,
    explain:"Multiple blocks with the same prev_hash = competing chain tips at the same height. In normal operation, at most 1–2 competing blocks appear (stale block rate ~0.4–1%). Six competing blocks is highly anomalous — it suggests either: (1) an attacker is feeding the node multiple fabricated forks (eclipse attack or network sybil), (2) a major hashrate split occurred (e.g., large pool discovered multiple blocks with similar timing), or (3) the node was partitioned and is now catching up. Operators should check peer diversity, ChainWork of each competing tip, and whether any tip is significantly behind the network.",
  },
  {
    sec:"§3 Network Attacks",
    q:"What distinguishes a 'BGP hijack' attack on a blockchain network from a standard eclipse attack?",
    opts:[
      "BGP hijacks affect only nodes running full clients; eclipse attacks target SPV clients exclusively",
      "BGP hijacks operate at the routing infrastructure level — an attacker announces false BGP routes to redirect Bitcoin's P2P traffic through attacker-controlled ASes (Autonomous Systems), allowing interception or partition at internet scale. A standard eclipse attack requires physically controlling many IP addresses to fill a specific node's peer table — it targets one node at a time.",
      "BGP hijacks only affect the TLS handshake layer of Bitcoin's P2P protocol",
      "BGP hijacks are distinguished by requiring physical access to internet exchange points, while eclipse attacks are purely software-based",
    ],
    ans:1,
    explain:"Apostolaki et al. (2017) demonstrated BGP-level Bitcoin attacks: by hijacking routing to specific ASes that host large numbers of Bitcoin nodes (or mining pools), an attacker could partition the entire Bitcoin network — not just individual nodes. The key difference: BGP hijacks are infrastructure-level (require AS-level control or collusion with ISPs), affect thousands of nodes simultaneously, and are much harder to defend against at the application layer. 60% of Bitcoin's reachable nodes were concentrated in just 13 ISPs as of 2017, making BGP attacks particularly dangerous.",
  },
  {
    sec:"§4 Observability",
    q:"When tracing block propagation, a researcher measures that median propagation time is 450ms but the 99th-percentile is 28 seconds. What does this bimodal distribution imply about the network?",
    opts:[
      "The Bitcoin network has exactly two tiers of nodes — fast and slow — that operate independently",
      "The long tail (p99 = 28s) indicates that most blocks propagate quickly through well-connected nodes (450ms median), but a small fraction of nodes have severely limited connectivity — slow links, high latency geographic regions, or nodes behind NAT/firewalls that accept fewer inbound connections. This tail matters because miners in the slow tail contribute to the stale block rate.",
      "The high p99 indicates the gossip protocol is artificially throttling block propagation to prevent bandwidth spikes",
      "The p99 measurement is noise from network monitoring probes that double-count certain block announcements",
    ],
    ans:1,
    explain:"Network measurement studies (e.g., Decker & Wattenhofer 2013) consistently show that Bitcoin block propagation is NOT normally distributed — it has a heavy tail. The median (fast) path covers well-connected backbone nodes. The long tail represents geographically isolated nodes, those behind restrictive firewalls, nodes with few peers, or nodes on slow network links. For consensus analysis, the tail matters: a miner at the p99 latency is effectively 28 seconds 'behind' the network, vastly increasing their stale block rate and vulnerability to selfish mining.",
  },
];

// ─── ASSESSMENT DATA ─────────────────────────────────────────────────────────
const ASSESSMENTS = [
  {
    id:"P1", diff:"Foundational", color:C.cyan,
    problem:"Explain in detail how Bitcoin's gossip protocol works for block propagation. Walk through the complete message sequence from when a miner finds a block to when that block has been received by 95% of the network. Include the specific P2P message types involved.",
    answer:`BITCOIN BLOCK PROPAGATION — COMPLETE MESSAGE SEQUENCE

1. BLOCK DISCOVERY
   Miner finds valid nonce: hash(header||nonce) ≤ target
   Miner immediately begins propagation to all connected peers (~8 peers)

2. INITIAL ANNOUNCEMENT — INV message
   Miner → each peer:  MSG_BLOCK INV { hash: "000000...abc123" }
   Size: 36 bytes (4-byte type + 32-byte hash)
   Purpose: lightweight advertisement; avoids sending 1MB block to nodes that already have it

3. REQUEST — GETDATA message
   Peer (if it doesn't have block) → Miner:
   MSG_BLOCK GETDATA { hash: "000000...abc123" }
   Size: 36 bytes

4. DELIVERY — block message (or CMPCTBLOCK for BIP 152 peers)
   Standard: Miner → Peer: full serialized block (~1 MB)
   Compact (BIP 152): Miner → Peer: CMPCTBLOCK
     { header, short_tx_ids[], prefilled_txns[] }
     Size: ~10 KB (uses 6-byte short IDs for known txs)
     Peer reconstructs block from mempool → requests missing txs via GETBLOCKTXN if needed

5. VALIDATION
   Receiving node validates: PoW, Merkle root, all transactions, UTXO state
   Validation time: ~50-200ms for a full 1MB block

6. RE-PROPAGATION (fan-out)
   Validated node → all its other peers: INV { hash }
   Each step repeats from step 2
   Network diameter: ~6-8 hops for full coverage

PROPAGATION TIMING (empirical, Bitcoin 2023):
   0ms    — Block found, announced to 8 direct peers
   50ms   — First 8 peers receive and validate
   200ms  — Second hop: ~50-64 peers
   450ms  — Median peer receives block (50th percentile)
   2s     — ~80% of network has block
   15s    — ~95% of network has block
   60s+   — Geographic tail (high-latency nodes)

KEY OPTIMIZATIONS:
   BIP 152 (Compact Blocks):  reduces repeated full-block download
   FIBRE relay network:        UDP-based dedicated relay, <50ms cross-continent
   Erlay (BIP 330, 2020):     set reconciliation for INV messages, cuts bandwidth 40%
   XThin/Xtreme Thin Blocks:  similar to compact blocks, BU implementation`,
  },
  {
    id:"P2", diff:"Foundational", color:C.cyan,
    problem:"Describe the structure of a fully-executed eclipse attack on a Bitcoin node. What are the setup phase, execution phase, and exploitation phase? What specific properties of Bitcoin's peer discovery mechanism does the attacker exploit?",
    answer:`ECLIPSE ATTACK — FULL LIFECYCLE (Heilman et al. 2015)

TARGET: Fill victim node's address tables (tried/new) and ALL outbound connections
        with attacker-controlled IP addresses.

BITCOIN PEER DISCOVERY VULNERABILITIES EXPLOITED:
   1. Address tables: Bitcoin stores ~20,600 "tried" and ~57,600 "new" addresses
      in two tables. These are persisted to disk across restarts.
   2. ADDR flooding: Bitcoin accepts and relays ADDR messages containing up to
      1,000 IP addresses. Attacker floods victim's tables with attacker IPs.
   3. Restart dependency: On startup, Bitcoin connects to 8 outbound peers
      randomly drawn from the tried table. If all tried entries are attacker-controlled,
      all 8 connections go to attackers.
   4. Inbound connections: victim accepts up to 117 inbound connections —
      attacker fills these too for complete isolation.

PHASE 1 — SETUP (weeks or months before attack):
   a) Attacker acquires thousands of IP addresses (botnet, cloud VMs, /24 blocks)
   b) Attacker floods victim with ADDR messages containing attacker IPs
      → victim's "new" table gradually fills with attacker addresses
   c) Attacker establishes connections from attacker IPs → victim marks
      them as "tried" (higher-trust table)
   d) Victim node is now "pre-poisoned": tried table dominated by attacker IPs

PHASE 2 — EXECUTION (triggering isolation):
   a) Wait for victim to restart (routine maintenance, power outage, client update)
      OR actively cause restart (crash via malformed messages in some client versions)
   b) On restart: victim connects to 8 random "tried" addresses → all attacker-controlled
   c) Attacker fills all 117 inbound slots with attacker nodes
   d) Victim is now fully isolated: 100% of peers are attacker-controlled

PHASE 3 — EXPLOITATION (depends on victim type):
   Scenario A — Merchant/exchange:
   Attacker: real chain → pay exchange (spend UTXO X)
   Victim sees: fake chain where UTXO X was never spent
   Victim accepts 0-confirmation payment from attacker using UTXO X again → double-spend
   
   Scenario B — Mining pool:
   Attacker feeds victim fake chain head at height H (withholds real blocks)
   Victim mines on stale parent → wastes ~100% of hashrate
   Attacker earns disproportionate block rewards on the real chain
   
   Scenario C — Light client:
   Attacker feeds fabricated "transaction included" proof
   Light client accepts payment that was never broadcast to the real network

DEFENSES (implemented in Bitcoin Core):
   - Feeler connections: periodic probes of new addresses, evict stale entries
   - Anchor connections: 2 peers persisted across restarts from a "good" list
   - Subnet bucketing: max 1 connection per /16 IP subnet
   - ADDR rate limiting: accept max 1 ADDR per peer per 10 minutes
   - Asmap: diversify connections across different Autonomous Systems (BGP routing diversity)`,
  },
  {
    id:"P3", diff:"Intermediate", color:C.orange,
    problem:"A blockchain researcher measures that block propagation in a test network follows: P(t) = 1 - e^(-λt) where λ = 0.23/second. Calculate: (a) median propagation time, (b) probability that two miners simultaneously find blocks within 5 seconds of each other (given ~10 minute block intervals), (c) expected stale block rate, (d) how reducing λ to 0.69/second (3× faster propagation) would affect the stale rate.",
    answer:`BLOCK PROPAGATION ANALYSIS — EXPONENTIAL MODEL

Given: P(t) = 1 - e^(-λt),  λ = 0.23/second

(a) MEDIAN PROPAGATION TIME
    P(t_median) = 0.5
    0.5 = 1 - e^(-0.23 × t_median)
    e^(-0.23 × t_median) = 0.5
    -0.23 × t_median = ln(0.5) = -0.6931
    t_median = 0.6931 / 0.23 = 3.01 seconds

    Interpretation: 50% of nodes receive the block within ~3 seconds.

(b) PROBABILITY OF SIMULTANEOUS BLOCK DISCOVERY
    Block interval = 600 seconds (Bitcoin 10-minute target)
    "Collision window" = time during which a second miner can find a block
    before first block has fully propagated.

    Using mean propagation time (1/λ = 4.35 seconds) as collision window:
    
    In a Poisson process with rate r = 1/600 blocks/second:
    P(another block found within window w) ≈ 1 - e^(-w/600)
    
    For w = 1/λ = 4.35s:
    P ≈ 1 - e^(-4.35/600) = 1 - e^(-0.00725) ≈ 0.00725 = 0.725%
    
    For w = t_median = 3.01s:
    P ≈ 1 - e^(-3.01/600) ≈ 0.5% per block

(c) EXPECTED STALE BLOCK RATE
    Stale rate ≈ fraction of blocks that arrive while a competing block is being mined.
    
    Stale rate ≈ (mean propagation time) / (mean block interval)
                = (1/λ) / (1/r)
                = r/λ
                = (1/600) / 0.23
                = 0.00724
                ≈ 0.72% stale blocks

    Real Bitcoin measurement (Decker & Wattenhofer 2013): ~0.41% at the time,
    reduced to ~0.2% after compact blocks (BIP 152) deployment in 2016.
    
    Ethereum pre-Merge (12-second blocks): stale rate ~6-9% due to shorter block time.

(d) EFFECT OF 3× FASTER PROPAGATION (λ = 0.69/second)
    New mean propagation time = 1/0.69 = 1.45 seconds
    New stale rate = (1/600) / 0.69 = 0.00242 ≈ 0.24%
    
    Reduction: 0.72% → 0.24% = 67% reduction in stale blocks
    
    New median: t_median = 0.6931/0.69 = 1.005 seconds
    
    SELFISH MINING THRESHOLD IMPACT:
    Eyal & Sirer (2013) showed selfish mining profitable above:
    α_threshold ≈ γ/(1 + γ) where γ = fraction of network reached first by selfish miner
    
    Faster propagation = harder for selfish miner to leverage propagation advantage:
    With λ=0.23: 10% propagation advantage → threshold ≈ 30% hashrate
    With λ=0.69: same 10% advantage → threshold increases toward 33% (ideal)
    
    Conclusion: improving propagation speed is a direct security improvement.`,
  },
  {
    id:"P4", diff:"Intermediate", color:C.orange,
    problem:"Design a node log analysis system for detecting anomalous network behavior. Specify: (1) which log events to monitor, (2) what thresholds indicate an attack vs. normal variance, (3) what the response procedure should be for three different attack types: eclipse attempt, selfish mining detection, and BGP hijack.",
    answer:`NODE LOG ANALYSIS SYSTEM — ANOMALY DETECTION DESIGN

1. LOG EVENTS TO MONITOR AND THEIR SIGNIFICANCE

   PEER CONNECTIVITY EVENTS:
   - peer_connect{ip, port, services, version}       → track peer diversity
   - peer_disconnect{ip, reason, duration}            → detect churning
   - peer_ban{ip, reason, ban_score}                  → track bans by type
   - addr_received{count, from_ip}                    → detect ADDR flooding
   Anomaly signal: >3 connections from same /16 subnet
   Anomaly signal: >10 peer_disconnect events per minute

   BLOCK EVENTS:
   - block_received{hash, height, from_peer, latency_ms}
   - block_validated{hash, height, valid, reason}
   - block_orphaned{hash, height, competing_hash}
   - chain_reorg{depth, old_tip, new_tip, tx_count_reverted}
   Anomaly signal: >2 orphaned blocks at same height
   Anomaly signal: reorg depth > 3 (extremely rare in honest network)
   Anomaly signal: block received from peer with unusual latency distribution

   MEMPOOL EVENTS:
   - tx_received{txid, fee_rate, size}
   - tx_evicted{txid, reason}                         → "insufficient fee" vs "mempool full"
   - tx_replaced{txid, replacing_txid}                → RBF events
   Anomaly signal: sudden mempool size spike (>300% of rolling average)
   Anomaly signal: high volume of conflicting transactions from single IP

2. THRESHOLDS: ATTACK VS. NORMAL VARIANCE

   ECLIPSE DETECTION THRESHOLDS:
   Normal:   peer /16 distribution: <5% from any single /16
   Warning:  2 outbound connections to same /16 subnet
   Critical: 3+ outbound connections from same /16 OR same AS
   
   Normal:   addr_received rate: <100 addresses/hour from any peer
   Warning:  >500 addresses/hour from single peer
   Critical: >1000 addresses/hour (ADDR flooding in progress)
   
   SELFISH MINING THRESHOLDS:
   Normal:   orphan rate: <1% of blocks (rolling 24h window)
   Warning:  >2% orphan rate sustained over 1 hour
   Critical: >5% orphan rate, or: receiving "late" blocks from specific pool
             that consistently arrive AFTER a competing block at same height
   
   BGP HIJACK THRESHOLDS:
   Normal:   peer AS diversity: connections spread across >10 ASes
   Warning:  >50% of connections through same AS (sudden change)
   Critical: All block sources suddenly routing through new AS path
             + blocks arriving with unusual timing patterns

3. RESPONSE PROCEDURES

   ECLIPSE ATTEMPT RESPONSE:
   Step 1: Log all current peer IPs, ASes, and /16 subnets
   Step 2: Run bitcoin-cli getpeerinfo — check 'inbound' vs 'outbound' ratio
   Step 3: If >3 outbound peers from same /16: addnode trusted_seed_ip — manually
           add diverse known-good peers
   Step 4: Verify tip against public block explorers (out-of-band check)
   Step 5: If active eclipse confirmed: bitcoin-cli disconnect suspect_ip for each
           suspicious peer; restart node to re-seed peer discovery
   Step 6: Report IP ranges to Bitcoin Core security team for address ban list

   SELFISH MINING RESPONSE:
   Step 1: Identify the pool/miner receiving anomalously many "wins" in races
   Step 2: Measure: time from when competing block arrives vs. winner block
           — selfish miner's blocks should arrive slightly BEFORE in a race
   Step 3: Document evidence: block hashes, timestamps, peer sources for 50+ orphans
   Step 4: Publish measurement data to bitcoin-dev mailing list
   Step 5: No direct counter-measure exists at node level — resolution requires
           miners to switch pools or community coordination to raise awareness

   BGP HIJACK RESPONSE:
   Step 1: Run traceroute to multiple Bitcoin seed nodes — compare with baseline
   Step 2: Check BGPstream.com or RIPE NCC for anomalous route announcements
   Step 3: Immediately connect via Tor (bitcoin-cli setnetworkactive true for Tor)
           to bypass compromised BGP routing
   Step 4: Alert bitcoin-dev and major mining pools via out-of-band communication
   Step 5: For mining operations: immediately halt mining until network path verified
           (risk: wasting hashrate on attacker-controlled fork)`,
  },
  {
    id:"P5", diff:"Advanced", color:C.red,
    problem:"You are designing the P2P networking layer for a new blockchain. Your goals: (1) minimize block propagation latency to under 500ms globally, (2) resist eclipse and BGP-level attacks, (3) maintain privacy (unlinkability of transaction origin). These goals conflict. Describe the design tensions and your protocol choices, with explicit tradeoffs.",
    answer:`P2P PROTOCOL DESIGN — THREE-WAY OPTIMIZATION PROBLEM

FUNDAMENTAL TENSION ANALYSIS:

  LATENCY ←→ PRIVACY conflict:
  Fast propagation requires knowing your neighbors' state (to avoid redundant sends)
  → needs node identity and topology knowledge → breaks sender unlinkability
  
  LATENCY ←→ ECLIPSE RESISTANCE conflict:
  Eclipse resistance requires connecting to diverse, verifiable peers
  → diversity checks require tracking peer metadata → reveals topology → latency optimization
  needs stable peer relationships → less diversity over time
  
  ECLIPSE RESISTANCE ←→ PRIVACY conflict:
  Eclipse resistance needs address diversity (AS-level, subnet-level diversity)
  → requires learning and tracking peer AS/subnet → metadata leaks location
  Tor hides location → defeats AS-diversity checks → worsens eclipse resistance

DESIGN CHOICES — LAYERED PROTOCOL:

LAYER 1 — TOPOLOGY (Eclipse Resistance Primary):
  Structure: Maintain 2 "classes" of connections:
    Protected (4 slots): Long-duration peers, proven AS diversity, verified via
    external AS path verification; persisted across restarts (anchor peers).
    Exploratory (4 slots): Random connections refreshed every 20 min via feeler logic.
  
  Implementation details:
  - Connect via diverse Autonomous Systems: use BGP routing data (Asmap, embedded in client)
    to bucket peers by AS. Max 1 protected peer per AS.
  - Address selection: Deterministic bucketing (src_IP XOR hash_key → bucket)
    makes coordinated flooding harder to predict.
  - Penalty: New IPs from unknown ASes get 30-minute trial period before trusted.
  
  Tradeoff accepted: 4 protected persistent peers → slower topology churn
  → slightly reduces diversity over years → acceptable; re-keyed every epoch.

LAYER 2 — BLOCK PROPAGATION (Latency Primary):
  Mechanism: Two-tier relay
  Tier 1 (Relay Network): Dedicated relay nodes run by major participants using
    UDP + erasure coding (similar to FIBRE). Low-latency, not privacy-preserving.
    Only relays BLOCK HEADERS + short tx IDs (compact format). Trusted by reputation.
    Target: 100ms median global propagation.
  Tier 2 (P2P gossip): Standard INV-based gossip via TCP for full node coverage.
    Uses Erlay (set reconciliation) to minimize bandwidth amplification.
    Target: 2s median propagation.
  
  All miners may OPTIONALLY connect to Tier 1 for competitive reasons.
  Non-mining full nodes use only Tier 2 — preserves decentralization.
  
  Tradeoff accepted: Tier 1 creates a semi-trusted relay layer. This is a mild
  centralization — mitigated by: (a) relay nodes are identifiable and accountable;
  (b) Tier 2 always available as fallback; (c) relay nodes see block headers only, not wallet data.

LAYER 3 — TRANSACTION PROPAGATION (Privacy Primary):
  Mechanism: Dandelion++ (BIP 156)
  Phase 1 (Stem): Transaction travels along a randomly selected path of 4-6 hops
    in "stem mode" — only one next hop sees it (not broadcast).
    Each hop decides with prob 0.1 to "fluff" (broadcast) or continue stem.
  Phase 2 (Fluff): Normal gossip broadcast from the fluff node.
  
  Sender unlinkability: the node that fluffs appears to be the originator;
    actual origin is 4-6 hops back in a randomly selected path.
  
  Timing obfuscation: each stem node adds Poisson(0.5s) delay before forwarding.
  
  Tradeoff accepted:
  - Dandelion++ adds ~2-5s latency to transaction propagation (acceptable; tx confirmation is minutes)
  - Stem phase requires maintaining short-lived state about which peer to forward to
  - Not perfect anonymity: sophisticated global observers can partially deanonymize via
    timing analysis across the stem path

EXPLICIT TRADEOFFS ACCEPTED:
  1. Relay network introduces semi-trusted layer → blocks propagate in 100ms
     but miners who opt in are identifiable. Non-miners unaffected.
  2. AS-diversity-based eclipse resistance reveals AS metadata to the client
     software, but this metadata is NOT transmitted to peers — local policy only.
  3. Dandelion++ reduces transaction-source privacy recovery from 90% → ~20%
     for a global observer, at cost of 2-5s additional tx latency.
  4. 4 anchor peers improve eclipse resistance but slightly reduce topology randomness.
     Mitigated by rotating anchor peers every 2 weeks.

MEASUREMENT TARGETS:
  - Block propagation p50: <500ms ✓ (Tier 1), <2s ✓ (Tier 2)
  - Eclipse success rate: <0.1% with proper AS bucketing
  - Transaction origin linkability: <25% for global passive observer
  - BGP resilience: Any single AS compromise affects <1 protected peer (by design)`,
  },
];

// ─── SECTION: INTRO ───────────────────────────────────────────────────────────
const IntroSection = () => (
  <div style={{ animation:"fadeUp 0.4s ease" }}>
    <SecLabel>§1 — Chapter Overview</SecLabel>
    <H2>P2P Networking & Adversarial Conditions</H2>
    <div style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted, letterSpacing:"0.1em",
      marginBottom:22 }}>ACM Educational Series · Distributed Systems Track · Chapter 5</div>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(136px,1fr))", gap:10, margin:"16px 0" }}>
      {[
        { icon:"📡", t:"Gossip & Latency",    s:"How blocks propagate & forks form" },
        { icon:"🌩", t:"Network Attacks",     s:"Eclipse, DoS, BGP hijacks" },
        { icon:"🔭", t:"Observability",       s:"Reading logs, tracing events" },
        { icon:"🧪", t:"Lab",                 s:"Live propagation & reorg sim" },
        { icon:"📊", t:"Measurement",         s:"Timing, stale rates, coverage" },
      ].map(c => (
        <div key={c.t} style={{ background:C.bg2, border:`1px solid ${C.border}`,
          borderRadius:5, padding:"13px 11px", textAlign:"center" }}>
          <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
          <div style={{ fontFamily:C.mono, fontSize:10, color:C.cyan, fontWeight:600, marginBottom:4 }}>{c.t}</div>
          <div style={{ fontFamily:C.body, fontSize:11, color:C.textMuted, lineHeight:1.5 }}>{c.s}</div>
        </div>
      ))}
    </div>

    <Body>
      A blockchain is, at its core, a distributed application running on a peer-to-peer
      network. Every security property we care about — immutability, censorship resistance,
      liveness — depends on the network actually delivering blocks and transactions to all
      honest nodes in a timely fashion. This chapter examines what happens when that
      delivery is delayed, corrupted, or actively subverted.
    </Body>

    <InfoBox title="Why Networking Matters for Security" icon="▸" color={C.orange}>
      The 2017 Bitcoin peer-to-peer network had its largest mining pool
      concentration routed through a single Internet Exchange Point in Frankfurt.
      A single BGP route announcement could have partitioned 30%+ of Bitcoin's
      hashrate from the rest of the network — no cryptographic attack required.
      P2P network health <em>is</em> a security property.
    </InfoBox>

    <HR/>
    <H3 color={C.orange}>The P2P Stack</H3>
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      {[
        { layer:"Application Layer",   color:C.cyan,   items:["Block/transaction validation","Mempool management","Consensus rules enforcement"] },
        { layer:"Gossip Protocol",     color:C.orange, items:["INV → GETDATA → block message sequence","Compact blocks (BIP 152), Erlay set reconciliation","Dandelion++ for tx origin privacy"] },
        { layer:"Peer Management",     color:C.violet, items:["Address discovery (DNS seeds, ADDR messages)","Peer selection, tried/new tables","Eclipse resistance: subnet diversity, anchor peers"] },
        { layer:"Transport Layer",     color:C.lime,   items:["TCP connections (Bitcoin: port 8333)","P2P encryption (BIP 324 v2 transport)","Tor/I2P onion routing for anonymity"] },
      ].map((l,i,arr) => (
        <div key={l.layer} style={{ display:"flex", gap:12 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ width:10, height:10, borderRadius:2, background:l.color, flexShrink:0, marginTop:3 }}/>
            {i < arr.length-1 && <div style={{ width:1, flex:1, background:C.border, margin:"3px 0" }}/>}
          </div>
          <div style={{ paddingBottom:12 }}>
            <div style={{ fontFamily:C.mono, fontSize:10, color:l.color, fontWeight:600, marginBottom:4 }}>{l.layer}</div>
            <div style={{ fontFamily:C.body, fontSize:13, color:C.text, lineHeight:1.7 }}>
              {l.items.join(" · ")}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── SECTION: GOSSIP & LATENCY ────────────────────────────────────────────────
const GossipSection = () => {
  const [tab, setTab] = useState("protocol");
  const [animRunning, setAnimRunning] = useState(false);
  const [nodeStates, setNodeStates] = useState(() => NODE_POS.map((_,i) => ({
    id:i, received:false, time:0, parent:-1
  })));
  const [tick, setTick] = useState(0);
  const [latencyMode, setLatencyMode] = useState("normal"); // normal | high | partition
  const animRef = useRef(null);
  const tickRef = useRef(0);

  const LATENCY_PROFILES = {
    normal:    { label:"Normal (~450ms median)",  baseDelay:300,  jitter:150, partitioned:[] },
    high:      { label:"High Latency (~3s median)",baseDelay:1200, jitter:600, partitioned:[] },
    partition: { label:"Network Partition",        baseDelay:300,  jitter:100, partitioned:[5,6,7] },
  };

  const runPropagation = useCallback(() => {
    if (animRunning) return;
    setAnimRunning(true);
    const profile = LATENCY_PROFILES[latencyMode];
    tickRef.current = 0;
    setTick(0);

    // Reset
    setNodeStates(NODE_POS.map((_,i) => ({ id:i, received:false, time:0, parent:-1 })));
    const received = new Array(NODE_POS.length).fill(false);
    received[0] = true;
    const times = new Array(NODE_POS.length).fill(Infinity);
    times[0] = 0;

    // BFS-style propagation with random delays
    const queue = [{ nodeId:0, time:0 }];
    const events = [];
    const visited = new Set([0]);

    while (queue.length > 0) {
      const { nodeId, time } = queue.shift();
      const neighbors = EDGES
        .filter(e => e[0]===nodeId || e[1]===nodeId)
        .map(e => e[0]===nodeId ? e[1] : e[0])
        .filter(n => !visited.has(n));

      for (const nb of neighbors) {
        if (profile.partitioned.includes(nb)) continue;
        const delay = time + profile.baseDelay + Math.random()*profile.jitter;
        visited.add(nb);
        times[nb] = delay;
        events.push({ nodeId:nb, time:Math.round(delay), parent:nodeId });
        queue.push({ nodeId:nb, time:delay });
      }
    }
    events.sort((a,b) => a.time-b.time);

    // Schedule state updates
    const startTime = Date.now();
    events.forEach(ev => {
      const timeout = setTimeout(() => {
        setNodeStates(s => s.map(n => n.id===ev.nodeId
          ? { ...n, received:true, time:Date.now()-startTime, parent:ev.parent }
          : n));
        setTick(t => t+1);
      }, ev.time);
    });

    const totalTime = events.length > 0 ? events[events.length-1].time + 500 : 2000;
    setTimeout(() => setAnimRunning(false), totalTime);
  }, [animRunning, latencyMode]);

  const resetProp = () => {
    setAnimRunning(false);
    setNodeStates(NODE_POS.map((_,i) => ({ id:i, received:false, time:0, parent:-1 })));
    setTick(0);
  };

  const receivedCount = nodeStates.filter(n => n.received).length;
  const totalNodes = NODE_POS.length;
  const coverage = Math.round((receivedCount/totalNodes)*100);
  const maxTime = nodeStates.filter(n=>n.received&&n.id!==0).reduce((m,n)=>Math.max(m,n.time),0);
  const p50Time = (() => {
    const sorted = nodeStates.filter(n=>n.received&&n.id!==0).map(n=>n.time).sort((a,b)=>a-b);
    return sorted.length ? sorted[Math.floor(sorted.length/2)] : 0;
  })();

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <SecLabel>§2 — Network Propagation</SecLabel>
      <H2>Gossip Propagation, Latency & Forks</H2>

      <div style={{ display:"flex", gap:0, border:`1px solid ${C.border}`, borderRadius:5,
        overflow:"hidden", margin:"16px 0 0" }}>
        {[["protocol","Protocol Design"],["latency","Latency & Forks"],["demo","Live Demo"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ flex:1, padding:"10px 4px", border:"none", cursor:"pointer",
              background:tab===id?C.bg3:C.bg2, color:tab===id?C.cyan:C.textMuted,
              fontFamily:C.mono, fontSize:10, letterSpacing:"0.04em",
              borderBottom:`2px solid ${tab===id?C.cyan:"transparent"}`, transition:"all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderTop:"none",
        borderRadius:"0 0 5px 5px", padding:"20px", animation:"fadeIn 0.25s ease" }}>

        {tab==="protocol" && (
          <>
            <H3>Bitcoin's Inventory-Based Gossip</H3>
            <Body>
              Bitcoin does not broadcast full blocks to all peers immediately — doing so
              would flood the network with 8× redundant 1 MB messages per hop.
              Instead, it uses a three-step <strong style={{color:C.cyan}}>inventory protocol</strong>:
              advertise → request → deliver.
            </Body>
            <Code title="Block propagation message sequence (Bitcoin P2P)">{`# Step 1: Miner finds block B, sends lightweight advertisement
miner → peer_A:  INV { type: MSG_BLOCK, hash: "0000000...a1b2c3" }  # 36 bytes

# Step 2: Peer requests the full block (only if it doesn't already have it)
peer_A → miner:  GETDATA { type: MSG_BLOCK, hash: "0000000...a1b2c3" }  # 36 bytes

# Step 3: Miner sends the full block
miner → peer_A:  block { header, transactions[] }  # ~1 MB

# Step 4: peer_A validates and re-announces to ITS peers (fan-out continues)
peer_A → peer_B: INV { type: MSG_BLOCK, hash: "0000000...a1b2c3" }

# BIP 152 COMPACT BLOCKS (2016 optimization):
# Instead of sending the full 1 MB block, send a compact representation:
miner → peer_A:  CMPCTBLOCK {
  header:          80 bytes (full header),
  short_tx_ids[]:  6-byte IDs for each transaction (assumes peer has tx in mempool),
  prefilled_txns:  coinbase + any unknown txs
}
# Total: ~10-15 KB instead of 1 MB → 66× bandwidth reduction
# Peer reconstructs from mempool: GETBLOCKTXN for any missing txs`}
            </Code>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, margin:"14px 0" }}>
              {[
                { l:"INV message size", v:"36 bytes", s:"vs 1 MB full block = 27,800× smaller", c:C.cyan },
                { l:"Compact block size", v:"~10 KB", s:"66× smaller than full block", c:C.orange },
                { l:"Erlay reduction", v:"~40%",s:"bandwidth cut via set reconciliation (BIP 330)", c:C.lime },
              ].map(r => (
                <div key={r.l} style={{ background:C.bg3, border:`1px solid ${r.c}22`,
                  borderTop:`2px solid ${r.c}`, borderRadius:4, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:4 }}>{r.l}</div>
                  <div style={{ fontFamily:C.disp, fontSize:20, color:r.c, fontWeight:700 }}>{r.v}</div>
                  <div style={{ fontFamily:C.body, fontSize:11, color:C.textMuted, marginTop:3 }}>{r.s}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==="latency" && (
          <>
            <H3>How Latency Creates Forks</H3>
            <Body>
              Bitcoin targets 10-minute block intervals. Block propagation to 95% of
              nodes takes ~15 seconds. During this window,
              a second miner who hasn't yet received the first block can independently
              mine a valid competing block — creating a <strong style={{color:C.orange}}>stale fork</strong>.
            </Body>
            <Code title="Fork creation from propagation latency">{`# T=0ms    Miner A finds block B_A at height 732,100
# T=0ms    Miner A starts propagating B_A via gossip

# T=1200ms  Miner B (in Australia, hasn't received B_A yet)
#           independently finds block B_B at height 732,100
#           B_B.prev_hash == B_A.prev_hash  ← FORK

# T=1200ms  Two valid chains now exist simultaneously:
#   Chain 1: ... → 732,099 → B_A (seen by 40% of network)
#   Chain 2: ... → 732,099 → B_B (seen by 20% of network)
#   No chain:                     (40% still mining on parent)

# T=2000ms  B_A propagates to 70% of network
# T=3000ms  B_B propagates to 50% of network
# T=8000ms  Most nodes have both; chain selection begins

# RESOLUTION: longest-chain (most-work) rule
# Whichever chain gets a NEW block first at height 732,101 WINS
# The losing block becomes "orphaned" or "stale"
# Transactions ONLY in the stale block return to mempool

# STALE RATE EMPIRICAL DATA:
# Bitcoin 2013:     ~2.1% stale rate  (before header-first sync)
# Bitcoin 2015:     ~0.4% stale rate  (after various optimizations)
# Bitcoin 2016+:    ~0.2% stale rate  (after BIP 152 compact blocks)
# Ethereum (12s):   ~6-9% stale rate  (shorter target = more collisions)`}
            </Code>
            <InfoBox title="Selfish Mining: Weaponizing Propagation Latency" icon="▸" color={C.red}>
              A <strong>selfish miner</strong> (Eyal &amp; Sirer, 2013) withholds a found block,
              continuing to mine secretly. When the honest network finds a competing block,
              the selfish miner releases theirs. If the selfish miner has faster internal
              connectivity (e.g., co-located with major peers), their block reaches the
              network first — the honest block becomes stale. With ≥25% hashrate and
              propagation advantages, selfish mining earns disproportionate rewards.
            </InfoBox>
          </>
        )}

        {tab==="demo" && (
          <>
            <H3>Live Propagation Simulator</H3>
            <div style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted, marginBottom:12 }}>
              ▸ Block originates at Node 0 (center). Watch it propagate hop-by-hop through the P2P mesh.
            </div>

            <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted }}>LATENCY PROFILE:</div>
              {Object.entries(LATENCY_PROFILES).map(([k,v])=>(
                <button key={k} onClick={()=>{setLatencyMode(k);resetProp();}}
                  style={{ padding:"5px 12px", border:`1px solid ${latencyMode===k?C.cyan:C.border}`,
                    borderRadius:3, background:latencyMode===k?C.cyanFaint:C.bg3,
                    color:latencyMode===k?C.cyan:C.textMuted,
                    fontFamily:C.mono, fontSize:10, cursor:"pointer", transition:"all 0.15s" }}>
                  {v.label}
                </button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"start" }}>
              {/* SVG Network */}
              <div style={{ background:"#030608", border:`1px solid ${C.border}`, borderRadius:5,
                position:"relative", paddingBottom:"70%", overflow:"hidden" }}>
                <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
                  viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  {/* Edges */}
                  {EDGES.map(([a,b],i) => {
                    const na = NODE_POS[a], nb = NODE_POS[b];
                    const isPartitionEdge = latencyMode==="partition" &&
                      (LATENCY_PROFILES.partition.partitioned.includes(a) ||
                       LATENCY_PROFILES.partition.partitioned.includes(b));
                    const bothReceived = nodeStates[a].received && nodeStates[b].received;
                    return (
                      <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                        stroke={isPartitionEdge?"#ff525230":bothReceived?C.cyan+"50":C.border}
                        strokeWidth={bothReceived?"0.6":"0.4"}
                        strokeDasharray={isPartitionEdge?"2,2":"none"}
                        style={{ transition:"stroke 0.4s, stroke-width 0.4s" }}/>
                    );
                  })}
                  {/* Nodes */}
                  {NODE_POS.map((pos,i) => {
                    const ns = nodeStates[i];
                    const isPartitioned = latencyMode==="partition" &&
                      LATENCY_PROFILES.partition.partitioned.includes(i);
                    const nodeColor = isPartitioned ? C.red :
                      ns.received ? C.cyan : C.textMuted;
                    return (
                      <g key={i}>
                        {ns.received && !isPartitioned && (
                          <circle cx={pos.x} cy={pos.y} r="4"
                            fill="none" stroke={C.cyan} strokeWidth="0.5"
                            style={{ animation:"ripple 1s ease-out 1" }}/>
                        )}
                        <circle cx={pos.x} cy={pos.y} r="3.2"
                          fill={ns.received && !isPartitioned ? C.cyanFaint : isPartitioned ? C.redFaint : C.bg3}
                          stroke={nodeColor} strokeWidth="0.5"
                          style={{ transition:"fill 0.3s, stroke 0.3s" }}/>
                        <text x={pos.x} y={pos.y+0.9} textAnchor="middle"
                          fill={nodeColor} fontSize="2.2" fontFamily={C.mono} fontWeight="600">
                          {i===0?"SRC":i}
                        </text>
                        {ns.received && ns.time > 0 && (
                          <text x={pos.x} y={pos.y-4.5} textAnchor="middle"
                            fill={C.cyan} fontSize="1.8" fontFamily={C.mono}
                            style={{ animation:"floatUp 1.5s ease forwards" }}>
                            {ns.time}ms
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Stats panel */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:140 }}>
                {[
                  { l:"Coverage", v:`${coverage}%`, sub:`${receivedCount}/${totalNodes} nodes`, c:C.cyan },
                  { l:"P50 latency", v:p50Time?`${p50Time}ms`:"—", sub:"median receipt time", c:C.orange },
                  { l:"Max latency", v:maxTime?`${maxTime}ms`:"—", sub:"slowest node", c:C.red },
                ].map(r => (
                  <div key={r.l} style={{ background:C.bg3, border:`1px solid ${r.c}22`,
                    borderLeft:`2px solid ${r.c}`, borderRadius:3, padding:"9px 11px" }}>
                    <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:3 }}>{r.l}</div>
                    <div style={{ fontFamily:C.disp, fontSize:19, color:r.c, fontWeight:700 }}>{r.v}</div>
                    <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginTop:2 }}>{r.sub}</div>
                  </div>
                ))}
                <div style={{ marginTop:4, display:"flex", flexDirection:"column", gap:6 }}>
                  <Btn onClick={runPropagation} disabled={animRunning} color={C.cyan} small>
                    {animRunning?"▶ Propagating…":"▶ Propagate Block"}
                  </Btn>
                  <Btn onClick={resetProp} color={C.orange} small>↺ Reset</Btn>
                </div>
                {latencyMode==="partition" && (
                  <div style={{ background:C.redFaint, border:`1px solid ${C.red}33`,
                    borderRadius:3, padding:"8px 10px", marginTop:4 }}>
                    <div style={{ fontFamily:C.mono, fontSize:9, color:C.red, marginBottom:3 }}>
                      PARTITION ACTIVE
                    </div>
                    <div style={{ fontFamily:C.body, fontSize:11, color:C.text, lineHeight:1.5 }}>
                      Nodes 5, 6, 7 are isolated. They will never receive this block.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: ATTACKS ─────────────────────────────────────────────────────────
const AttacksSection = () => {
  const [tab, setTab] = useState("eclipse");
  const [eclipseStep, setEclipseStep] = useState(0);

  const ECLIPSE_STEPS = [
    { label:"Normal state", color:C.cyan,
      desc:"Victim node V connects to 8 diverse outbound peers across different IP subnets and ASes. Block data arrives correctly from the honest majority network.",
      vCenter:C.cyan, vLabel:"V (healthy)", attackerVisible:false },
    { label:"ADDR flooding begins", color:C.orange,
      desc:"Attacker sends thousands of ADDR messages to victim, each containing attacker-controlled IP addresses. Victim's 'new' address table fills with attacker IPs over days/weeks.",
      vCenter:C.orange, vLabel:"V (table poisoning)", attackerVisible:true },
    { label:"Table poisoning complete", color:C.orange,
      desc:"Victim's 'tried' table is now mostly attacker IPs (from attacker-initiated connections). Victim is 'pre-eclipsed' — awaiting restart.",
      vCenter:C.orange, vLabel:"V (pre-eclipsed)", attackerVisible:true },
    { label:"Victim restarts", color:C.red,
      desc:"Victim reboots (software update, power cycle). On startup, it selects 8 outbound peers from tried table — all attacker controlled. Attacker also fills all 117 inbound slots.",
      vCenter:C.red, vLabel:"V (eclipsed!)", attackerVisible:true },
    { label:"Exploitation", color:C.red,
      desc:"Victim is fully isolated. Attacker feeds fake/stale chain. Double-spend: attacker pays victim on fake chain, simultaneously spends same coins on the real chain.",
      vCenter:C.red, vLabel:"V (exploited)", attackerVisible:true },
  ];

  const es = ECLIPSE_STEPS[eclipseStep];

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <SecLabel>§3 — Adversarial Network Conditions</SecLabel>
      <H2>Common Network Attacks</H2>

      <div style={{ display:"flex", gap:0, border:`1px solid ${C.border}`, borderRadius:5,
        overflow:"hidden", margin:"16px 0 0" }}>
        {[["eclipse","Eclipse Attack"],["bgp","BGP Hijack"],["dos","DoS Vectors"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ flex:1, padding:"10px 5px", border:"none", cursor:"pointer",
              background:tab===id?C.bg3:C.bg2, color:tab===id?C.red:C.textMuted,
              fontFamily:C.mono, fontSize:10, letterSpacing:"0.04em",
              borderBottom:`2px solid ${tab===id?C.red:"transparent"}`, transition:"all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderTop:"none",
        borderRadius:"0 0 5px 5px", padding:"20px", animation:"fadeIn 0.25s ease" }}>

        {tab==="eclipse" && (
          <>
            <H3 color={C.red}>Eclipse Attack — Step-by-Step</H3>
            <Body>
              An eclipse attack isolates a single node from the honest network by
              filling all of its peer connections with attacker-controlled nodes.
              The attacker gains complete control over the victim's view of the blockchain.
            </Body>

            {/* Step controls */}
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              {ECLIPSE_STEPS.map((s,i)=>(
                <button key={i} onClick={()=>setEclipseStep(i)}
                  style={{ padding:"5px 11px", border:`1px solid ${eclipseStep===i?s.color:C.border}`,
                    borderRadius:3, background:eclipseStep===i?`${s.color}18`:C.bg3,
                    color:eclipseStep===i?s.color:C.textMuted,
                    fontFamily:C.mono, fontSize:10, cursor:"pointer", transition:"all 0.15s" }}>
                  {i+1}. {s.label}
                </button>
              ))}
            </div>

            {/* Visual */}
            <div style={{ background:"#030608", border:`1px solid ${es.color}30`,
              borderRadius:5, padding:"16px", marginBottom:14, animation:"fadeIn 0.3s ease",
              minHeight:180 }}>
              <svg viewBox="0 0 300 140" style={{ width:"100%", maxHeight:180 }}>
                {/* Attacker nodes (surround victim) */}
                {es.attackerVisible && [0,1,2,3,4,5,6,7].map(i=>{
                  const angle = (i/8)*Math.PI*2;
                  const cx = 150 + 95*Math.cos(angle), cy = 70 + 50*Math.sin(angle);
                  return (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="8" fill={C.redFaint}
                        stroke={C.red} strokeWidth="0.8"/>
                      <text x={cx} y={cy+1.5} textAnchor="middle"
                        fill={C.red} fontSize="5" fontFamily={C.mono}>A{i}</text>
                      <line x1={150} y1={70} x2={cx} y2={cy}
                        stroke={C.red} strokeWidth="0.5"
                        strokeDasharray={eclipseStep>=3?"none":"4,3"}
                        strokeOpacity={eclipseStep>=3?0.8:0.4}/>
                    </g>
                  );
                })}
                {/* Honest network (grayed out when eclipsed) */}
                {[-50,50].map((dy,i)=>(
                  <g key={i} opacity={eclipseStep>=3?0.15:0.6}>
                    <circle cx={i===0?30:270} cy={70+dy} r="8" fill={C.cyanFaint} stroke={C.cyan} strokeWidth="0.8"/>
                    <text x={i===0?30:270} y={71+dy+1.5} textAnchor="middle"
                      fill={C.cyan} fontSize="4.5" fontFamily={C.mono}>H{i+1}</text>
                    {eclipseStep<3&&(
                      <line x1={150} y1={70} x2={i===0?30:270} y2={70+dy}
                        stroke={C.cyan} strokeWidth="0.5" strokeDasharray="3,2"/>
                    )}
                  </g>
                ))}
                {/* Victim */}
                <circle cx={150} cy={70} r={eclipseStep>=3?14:11}
                  fill={`${es.vCenter}20`} stroke={es.vCenter} strokeWidth="1"
                  style={{ animation:eclipseStep>=3?"eclipseIn 1s ease":"none" }}/>
                <text x={150} y={70+1.5} textAnchor="middle"
                  fill={es.vCenter} fontSize="6" fontFamily={C.mono} fontWeight="700">V</text>
                {/* Labels */}
                <text x={150} y={130} textAnchor="middle" fill={es.vCenter}
                  fontSize="5.5" fontFamily={C.mono}>{es.vLabel}</text>
                {es.attackerVisible&&(
                  <text x={150} y={12} textAnchor="middle" fill={C.red}
                    fontSize="5" fontFamily={C.mono}>Attacker-controlled peers</text>
                )}
              </svg>
            </div>

            <div style={{ background:C.bg3, border:`1px solid ${es.color}22`,
              borderLeft:`3px solid ${es.color}`, borderRadius:4, padding:"13px 15px",
              animation:"fadeIn 0.3s ease" }}>
              <div style={{ fontFamily:C.body, fontSize:14, color:C.text, lineHeight:1.75 }}>
                {es.desc}
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:12 }}>
              <Btn small onClick={()=>setEclipseStep(s=>Math.max(0,s-1))} disabled={eclipseStep===0} color={C.textMuted}>← Prev</Btn>
              <Btn small onClick={()=>setEclipseStep(s=>Math.min(4,s+1))} disabled={eclipseStep===4} color={C.red}>Next →</Btn>
            </div>

            <Code title="Eclipse defense mechanisms (Bitcoin Core)">{`# DEFENSE 1: Feeler connections
# Every 2 minutes, Bitcoin Core tries one "feeler" connection
# to a randomly selected address from the 'new' table.
# If connection succeeds → move to 'tried' table.
# This continuously refreshes tried table with real/live peers,
# preventing attacker from permanently poisoning it.

# DEFENSE 2: Anchor connections (2021, Bitcoin Core 0.21)
# On shutdown: save 2 "anchor" peer IPs to anchors.dat
# On startup: connect to these 2 anchors FIRST, before random selection.
# Attacker must control both anchor IPs across a restart to maintain eclipse.

# DEFENSE 3: IP diversity (subnet bucketing)
# Bitcoin Core limits connections per /16 IPv4 subnet:
#   max_connections_per_subnet = 1 (outbound)
# Attacker must control IPs in 8+ different /16 blocks (~65K IPs each).

# DEFENSE 4: Asmap (AS-level diversity, 2021)
# Maps IPs to Autonomous System Numbers (ASNs).
# Bitcoin Core now diversifies connections across ASNs, not just /16 subnets.
# Much harder for attacker to control IPs in 8+ different ASNs.

# DEFENSE 5: ADDR rate limiting
# Max ADDR messages accepted per peer: 1 per 10 minutes
# Prevents rapid table flooding from a single malicious peer.`}
            </Code>
          </>
        )}

        {tab==="bgp" && (
          <>
            <H3 color={C.red}>BGP Hijack — Routing-Level Attack</H3>
            <Body>
              A BGP (Border Gateway Protocol) hijack attacks the internet's routing
              infrastructure rather than individual node connections. An adversary
              announces fraudulent BGP routes, redirecting Bitcoin P2P traffic
              through attacker-controlled network paths.
            </Body>
            <InfoBox title="BGP Hijack vs Eclipse: Key Difference" icon="▸" color={C.red}>
              Eclipse: target ONE node, fill its peer table. Takes weeks of preparation.
              BGP hijack: target ALL nodes in a network segment simultaneously.
              Takes minutes. Requires AS-level control or ISP collusion.
              Apostolaki et al. (2017): 60% of Bitcoin's reachable nodes were hosted
              in just 13 ISPs — any of which could execute a partition attack.
            </InfoBox>
            <Code title="BGP hijack attack anatomy">{`# NORMAL ROUTING:
# Bitcoin node in US → [AS7018 AT&T] → [AS1299 Telia] → Bitcoin node in EU
# Each AS advertises its own prefixes; traffic routes via BGP "best path" rules.

# BGP HIJACK:
# Attacker AS (AS9999) announces: "I own 147.28.0.0/20"
# (Normally owned by a major Bitcoin node cluster)
# Other ASes accept the false announcement (BGP has no cryptographic verification!)
# Traffic to 147.28.0.0/20 now routes through AS9999 (attacker).

# WHAT ATTACKER CAN DO:
# Option A — Drop packets: partition the hijacked nodes from the rest of the network
# Option B — Intercept: act as man-in-the-middle, read/modify P2P messages
# Option C — Delay: introduce artificial latency to amplify stale block rate
#             (useful for selfish mining coordination)

# REAL INCIDENT (2014):
# Canadian ISP Hivelocity accidentally announced routes for 51 /24 prefixes
# belonging to Bitcoin mining pools → ~$83,000 in hashrate temporarily rerouted.
# Unintentional — shows how easy accidental BGP hijacks are.

# DEFENSES:
# RPKI (Resource Public Key Infrastructure):
#   Route Origin Authorization (ROA) certificates sign prefix ownership.
#   Routers reject BGP announcements not matching ROA.
#   Bitcoin network: ~40% of paths RPKI-validated as of 2023.
# 
# Application-layer defense: Bitcoin nodes can use Tor / I2P
#   → traffic routed through onion network, immune to BGP manipulation.
#   Trade-off: higher latency (~100-300ms added), reduced throughput.
#
# Asmap: avoid connecting only to nodes in same AS — limits blast radius.`}
            </Code>
          </>
        )}

        {tab==="dos" && (
          <>
            <H3 color={C.red}>DoS Pressure Points</H3>
            <Body>
              Bitcoin's P2P protocol exposes several resource-consumption vectors.
              Nodes must process incoming messages without knowing in advance
              whether they are valid — creating denial-of-service surfaces.
            </Body>
            <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"14px 0" }}>
              {[
                { name:"Block withholding / INV flooding", severity:"Medium", color:C.orange,
                  desc:"Attacker sends thousands of INV announcements for non-existent blocks. Victim sends GETDATA for each → connection slots consumed waiting for data that never arrives.",
                  mitigation:"Bitcoin Core: GETDATA timeout; evict peers that don't deliver requested data within 20 minutes. Max 100 outstanding GETDATA requests per peer." },
                { name:"Transaction flooding (mempool DoS)", severity:"High", color:C.red,
                  desc:"Attacker broadcasts millions of valid low-fee transactions, filling victims' mempools (default: 300 MB). Legitimate transactions are evicted; mempool fee floor rises artificially.",
                  mitigation:"Mempool fee floor (minRelayTxFee), rate limiting per peer (100 tx/s), descendant/ancestor count limits per UTXO chain (25 levels max)." },
                { name:"Compact block reconstruction abuse", severity:"Medium", color:C.orange,
                  desc:"Attacker sends compact blocks referencing transactions the victim doesn't have in mempool, forcing GETBLOCKTXN requests for each → amplified per-block processing cost.",
                  mitigation:"Compact blocks sent only to peers with known mempool overlap. High-bandwidth mode (sendcmpct 2) restricted to trusted peers." },
                { name:"Addr message amplification", severity:"Low-Medium", color:C.yellow,
                  desc:"Bitcoin relays ADDR messages containing up to 1000 addresses. Attacker crafts cascading ADDR relay chains → O(n²) address propagation across entire network.",
                  mitigation:"ADDR relay limited: max 1 ADDR message forwarded per peer per 24 hours. ADDRV2 message (BIP 155) rate-limited separately." },
                { name:"Time-bandit (clock skew)", severity:"Low", color:C.yellow,
                  desc:"Bitcoin accepts blocks with timestamps ±2 hours from network median. Attacker manipulates median node time by peering with many nodes broadcasting false timestamps.",
                  mitigation:"Bitcoin Core ignores time adjustments >70 minutes from system clock. Uses at most 200 peers' time, excludes outliers." },
              ].map(v => (
                <div key={v.name} style={{ background:C.bg3, border:`1px solid ${v.color}22`,
                  borderLeft:`3px solid ${v.color}`, borderRadius:4, padding:"11px 14px" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontFamily:C.mono, fontSize:11, color:v.color, fontWeight:600 }}>{v.name}</span>
                    <Tag color={v.color}>{v.severity}</Tag>
                  </div>
                  <div style={{ fontFamily:C.body, fontSize:13, color:C.text, lineHeight:1.65, marginBottom:6 }}>{v.desc}</div>
                  <div style={{ fontFamily:C.mono, fontSize:11, color:C.textMuted, lineHeight:1.6 }}>
                    ⇒ Mitigation: {v.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: OBSERVABILITY ───────────────────────────────────────────────────
const LOG_TEMPLATES = [
  { time:"2024-01-15 14:23:01", level:"INFO",  category:"net",      text:"Added connection to 185.220.101.47:8333 [inbound]", color:C.cyan },
  { time:"2024-01-15 14:23:04", level:"INFO",  category:"net",      text:"version handshake: peer=42, peerheight=827350, version=70016", color:C.cyan },
  { time:"2024-01-15 14:24:11", level:"INFO",  category:"mempool",  text:"AcceptToMemoryPool: txn=a1b2c3d4...ef01, fee=0.000042 BTC/kB, size=226 bytes", color:C.lime },
  { time:"2024-01-15 14:25:33", level:"INFO",  category:"net",      text:"receive version message: /Satoshi:25.0.0/: version 70016, blocks=827350, us=98.123.0.1:55842, peer=42", color:C.cyan },
  { time:"2024-01-15 14:26:01", level:"INFO",  category:"blockstorage", text:"UpdateTip: new best=000000000000000000025...height=827351 version=0x20800000 log2_work=94.002 tx=940123456 date='2024-01-15T14:25:58Z' progress=1.000000 cache=448.3MiB(3427256txo)", color:C.orange },
  { time:"2024-01-15 14:26:01", level:"INFO",  category:"validation","text":"ConnectBlock 000000...827351 took 143ms", color:C.orange },
  { time:"2024-01-15 14:26:02", level:"INFO",  category:"net",      text:"Relaying block 000000...827351 with 2847 transactions to 7 peers", color:C.cyan },
  { time:"2024-01-15 14:26:08", level:"WARN",  category:"net",      text:"Stale tip detected: height=827351, age=7s, peer=38 still on previous tip", color:C.yellow },
  { time:"2024-01-15 14:27:44", level:"WARN",  category:"mempool",  text:"AcceptToMemoryPool: FAILED (txn-mempool-conflict): tx=b2c3d4e5..., conflicts with mempool tx a1b2c3d4... spending same input", color:C.yellow },
  { time:"2024-01-15 14:28:15", level:"INFO",  category:"net",      text:"ban score increased 10 for peer=55 reason: 'non-continuous headers sequence'", color:C.red },
  { time:"2024-01-15 14:29:01", level:"INFO",  category:"blockstorage","text":"UpdateTip: new best=000000...height=827352 took 0.18s, 2989 tx, progress=1.000000", color:C.orange },
  { time:"2024-01-15 14:29:01", level:"WARN",  category:"validation","text":"WARNING: 2 blocks received at height 827352 (competing tips)", color:C.yellow },
  { time:"2024-01-15 14:29:02", level:"INFO",  category:"validation","text":"Rolling back 1 blocks from 000000...827352a to 000000...827351", color:C.red },
  { time:"2024-01-15 14:29:03", level:"INFO",  category:"validation","text":"ChainReorg: reverting block 827352a, 1 txns returned to mempool", color:C.red },
  { time:"2024-01-15 14:29:03", level:"INFO",  category:"blockstorage","text":"UpdateTip: new best=000000...827352b height=827352 (canonical chain after reorg)", color:C.orange },
  { time:"2024-01-15 14:29:10", level:"ERROR", category:"net",      text:"Disconnected peer=55: ban threshold exceeded (ban score=100)", color:C.red },
];

const ObserveSection = () => {
  const [filter, setFilter] = useState("ALL");
  const [highlighted, setHighlighted] = useState(null);
  const [tab, setTab] = useState("logs");

  const FILTERS = ["ALL","INFO","WARN","ERROR","net","mempool","validation","blockstorage"];
  const filtered = LOG_TEMPLATES.filter(l => {
    if (filter==="ALL") return true;
    if (["INFO","WARN","ERROR"].includes(filter)) return l.level===filter;
    return l.category===filter;
  });

  const ANNOTATIONS = {
    4:  { title:"Block received & accepted", color:C.orange, detail:"UpdateTip fires when a new best chain tip is established. 'log2_work' is cumulative PoW. 'progress' is sync completion. 'cache' is UTXO set size." },
    5:  { title:"Block validation timing", color:C.orange, detail:"ConnectBlock: runs all script validations, updates UTXO set, applies state transitions. 143ms is typical for a full block." },
    7:  { title:"Stale tip warning", color:C.yellow, detail:"A peer is still on the previous chain tip 7 seconds after we advanced. May indicate: high latency peer, network partition, or selfish mining behavior." },
    8:  { title:"Double-spend detected", color:C.red, detail:"'txn-mempool-conflict' means this transaction tries to spend an input already consumed by another mempool transaction. This is a double-spend attempt (0-conf)." },
    9:  { title:"Peer ban score increase", color:C.red, detail:"Bitcoin Core tracks misbehavior. 'non-continuous headers' = the peer sent headers with gaps. Could be a confused peer or an attacker trying to probe header acceptance logic." },
    11: { title:"FORK DETECTED: 2 blocks at same height", color:C.yellow, detail:"Two competing blocks arrived at height 827352. This is a natural stale fork from propagation race. The node must now choose the canonical chain." },
    12: { title:"Chain reorg begins", color:C.red, detail:"The node is rolling back 1 block to accept the competing chain. All transactions in the abandoned block are returned to the mempool for re-inclusion." },
    13: { title:"Reorg complete: txns returned", color:C.red, detail:"After the reorg, any transactions that were in the orphaned block but not in the winner block return to mempool. If a double-spend was confirmed in the winner block, these txns may be invalidated." },
    15: { title:"Peer banned (exceeded threshold)", color:C.red, detail:"Ban score 100 triggers a 24-hour ban. The peer repeatedly sent malformed data. Could be: buggy client, or active attacker probing message handling." },
  };

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <SecLabel>§4 — Network Observability</SecLabel>
      <H2>Reading Node Logs & Tracing Propagation</H2>

      <div style={{ display:"flex", gap:0, border:`1px solid ${C.border}`, borderRadius:5,
        overflow:"hidden", margin:"16px 0 0" }}>
        {[["logs","Annotated Log Reader"],["tracing","Propagation Tracing"],["metrics","Key Metrics"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ flex:1, padding:"10px 5px", border:"none", cursor:"pointer",
              background:tab===id?C.bg3:C.bg2, color:tab===id?C.lime:C.textMuted,
              fontFamily:C.mono, fontSize:10, letterSpacing:"0.04em",
              borderBottom:`2px solid ${tab===id?C.lime:"transparent"}`, transition:"all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderTop:"none",
        borderRadius:"0 0 5px 5px", padding:"20px", animation:"fadeIn 0.25s ease" }}>

        {tab==="logs" && (
          <>
            <div style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted, marginBottom:10 }}>
              ▸ Click any log line for annotation. Filter by level or category.
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
              {FILTERS.map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  style={{ padding:"4px 10px", border:`1px solid ${filter===f?C.lime:C.border}`,
                    borderRadius:3, background:filter===f?C.limeFaint:C.bg3,
                    color:filter===f?C.lime:C.textMuted,
                    fontFamily:C.mono, fontSize:9, cursor:"pointer", transition:"all 0.15s" }}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ background:"#020406", border:`1px solid ${C.border}`, borderRadius:4,
              fontFamily:C.mono, fontSize:11, lineHeight:1.65, maxHeight:340, overflowY:"auto" }}>
              {filtered.map((log,i)=>{
                const origIdx = LOG_TEMPLATES.indexOf(log);
                const ann = ANNOTATIONS[origIdx];
                const isHl = highlighted===origIdx;
                return (
                  <div key={i} onClick={()=>setHighlighted(isHl?null:origIdx)}
                    style={{ padding:"5px 12px", cursor:"pointer",
                      background:isHl?`${log.color}12`:undefined,
                      borderLeft:`2px solid ${isHl?log.color:"transparent"}`,
                      transition:"all 0.15s",
                      borderBottom:`1px solid ${C.border}33` }}>
                    <span style={{ color:C.textMuted }}>{log.time} </span>
                    <span style={{ color:log.level==="WARN"?C.yellow:log.level==="ERROR"?C.red:C.textMuted,
                      fontWeight:600 }}>[{log.level}] </span>
                    <span style={{ color:C.cyan }}>[{log.category}] </span>
                    <span style={{ color:log.color }}>{log.text}</span>
                    {ann && <span style={{ marginLeft:8, color:C.lime, fontSize:9 }}>📌</span>}
                  </div>
                );
              })}
            </div>

            {highlighted !== null && ANNOTATIONS[highlighted] && (
              <div style={{ marginTop:12, background:C.bg3,
                border:`1px solid ${ANNOTATIONS[highlighted].color}44`,
                borderLeft:`3px solid ${ANNOTATIONS[highlighted].color}`,
                borderRadius:4, padding:"12px 15px", animation:"slideR 0.25s ease" }}>
                <div style={{ fontFamily:C.mono, fontSize:10,
                  color:ANNOTATIONS[highlighted].color, fontWeight:600, marginBottom:6 }}>
                  ANNOTATION: {ANNOTATIONS[highlighted].title}
                </div>
                <div style={{ fontFamily:C.body, fontSize:13.5, color:C.text, lineHeight:1.75 }}>
                  {ANNOTATIONS[highlighted].detail}
                </div>
              </div>
            )}
          </>
        )}

        {tab==="tracing" && (
          <>
            <H3 color={C.lime}>Block Propagation Tracing</H3>
            <Body>
              Researchers measure propagation by deploying "listening nodes" across
              many geographic regions that record the timestamp when each block
              first arrives from any peer.
            </Body>
            <Code title="Propagation tracing: research methodology">{`# METHOD 1: Spy node network (Decker & Wattenhofer 2013)
# Deploy listening nodes in 13+ countries.
# Each node records: {block_hash, first_received_at, from_peer_ip, peer_latency}
# Measure: time from earliest recorded receipt to each node's receipt.

# METHOD 2: getpeerinfo + ping latency correlation
bitcoin-cli getpeerinfo | jq '.[] | {
  id:         .id,
  addr:       .addr,
  subver:     .subver,
  latency_ms: (.pingtime * 1000),
  blocks:     .synced_blocks,
  services:   .services,
  last_send:  (.lastsend | todate),
  last_recv:  (.lastrecv | todate)
}'

# METHOD 3: debug log timestamp analysis
# Filter logs for "UpdateTip" events across multiple nodes:
grep "UpdateTip.*height=827351" ~/.bitcoin/debug.log | \
  awk '{print $1, $2, $NF}' | sort -k1,2

# Example multi-node propagation trace:
# Node in NY:        14:26:01.021  (received first, 0ms reference)
# Node in London:    14:26:01.187  (+166ms)
# Node in Frankfurt: 14:26:01.234  (+213ms)
# Node in Sydney:    14:26:02.488  (+1467ms)
# Node in Nairobi:   14:26:04.112  (+3091ms)  ← high-latency tail
# Node in (eclipsed) 14:26:01.021  (never receives it)

# WHAT ABNORMAL PATTERNS LOOK LIKE:
# Normal:     monotonic timestamps, exponential coverage curve
# Partition:  some nodes never receive block (flat line after partition)
# Selfish mining: winner block arrives with suspiciously low latency from
#                 specific pool's IP range (pre-mined with fast internal relay)
# Eclipse:    eclipsed node receives a DIFFERENT block at same height from attacker`}
            </Code>
            <InfoBox title="FIBRE: Fast Internet Bitcoin Relay Engine" icon="▸" color={C.cyan}>
              FIBRE is a dedicated relay network running UDP with forward error correction
              over direct internet paths (not routing through Bitcoin's gossip). It reduced
              cross-continent block propagation from ~4 seconds to under 50 milliseconds.
              This drastically reduced selfish mining profitability and stale block rates.
              Not part of Bitcoin Core — an optional overlay used by major miners.
            </InfoBox>
          </>
        )}

        {tab==="metrics" && (
          <>
            <H3 color={C.lime}>Key Network Health Metrics</H3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"12px 0" }}>
              {[
                { name:"Orphan/Stale Rate", cmd:"getblockstats + external explorer",
                  normal:"<0.5%", warning:">1%", critical:">3%", color:C.orange,
                  meaning:"Fraction of valid blocks that lost the propagation race. High rates indicate slow propagation, selfish mining, or chain partitioning." },
                { name:"Peer Count & Diversity", cmd:"getpeerinfo | jq length",
                  normal:"8-125 peers, 5+ ASes", warning:"<6 peers or <3 ASes", critical:"<4 peers or same /16 subnet", color:C.cyan,
                  meaning:"Fewer peers = higher eclipse risk. Low AS diversity = higher BGP hijack impact. Monitor subnet distribution of outbound connections." },
                { name:"Mempool Size", cmd:"getmempoolinfo .size + .bytes",
                  normal:"<100K tx, <250MB", warning:">200K tx or >280MB", critical:"Mempool full (evicting txs at >X sat/vB)", color:C.lime,
                  meaning:"Sudden mempool spikes may indicate DoS flooding. Sustained high mempools indicate block space demand exceeds supply (fee market pressure)." },
                { name:"Ban Score Distribution", cmd:"listbanned + getpeerinfo .banscore",
                  normal:"<5 bans/day, avg score <10", warning:">20 bans/day", critical:"Multiple peers at score 100 simultaneously", color:C.red,
                  meaning:"High ban rates suggest active probing/attacks from malicious peers. Correlated bans from same /16 subnet = potential coordinated eclipse setup." },
                { name:"Block Validation Time", cmd:"grep ConnectBlock debug.log",
                  normal:"<500ms", warning:">1000ms", critical:">3000ms", color:C.yellow,
                  meaning:"Slow validation delays re-propagation, increasing stale rate. Spikes may indicate transactions with many inputs (UTXO lookup cost) or sigop-heavy scripts." },
                { name:"Network Hashrate Estimate", cmd:"getnetworkinfo .difficulty",
                  normal:"Smooth 2-week trend", warning:"±20% sudden shift", critical:"±40%+ sudden drop", color:C.violet,
                  meaning:"Sudden hashrate drops may indicate major miner partition or eclipse attack wasting mining resources. Monitored via difficulty adjustment tracking." },
              ].map(m => (
                <div key={m.name} style={{ background:C.bg3, border:`1px solid ${m.color}22`,
                  borderTop:`2px solid ${m.color}`, borderRadius:4, padding:"11px 13px" }}>
                  <div style={{ fontFamily:C.mono, fontSize:10, color:m.color, fontWeight:600, marginBottom:5 }}>{m.name}</div>
                  <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:7,
                    background:"#020406", padding:"4px 7px", borderRadius:2 }}>$ {m.cmd}</div>
                  <div style={{ display:"flex", gap:5, marginBottom:7, flexWrap:"wrap" }}>
                    <Tag color={C.lime}>Normal: {m.normal}</Tag>
                    <Tag color={C.yellow}>Warn: {m.warning}</Tag>
                    <Tag color={C.red}>Critical: {m.critical}</Tag>
                  </div>
                  <div style={{ fontFamily:C.body, fontSize:12, color:C.text, lineHeight:1.6 }}>{m.meaning}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: LAB ─────────────────────────────────────────────────────────────
const LabSection = () => {
  const [labTab, setLabTab] = useState("propagation");

  // ── Lab 1: Propagation Race Simulator ────────────────────────────────────
  const [minerA, setMinerA] = useState({ hash:"5a3f...", lat:0, connected:8 });
  const [minerB, setMinerB] = useState({ hash:"8b2e...", lat:3200, connected:6 });
  const [running, setRunning] = useState(false);
  const [raceResult, setRaceResult] = useState(null);
  const [raceProgress, setRaceProgress] = useState({ a:0, b:0 });

  const runRace = useCallback(() => {
    if (running) return;
    setRunning(true);
    setRaceResult(null);
    setRaceProgress({ a:0, b:0 });

    const totalNodes = 12;
    const TICK_MS = 80;
    let a = 0, b = 0;
    const aRate = 100 / (300 + (0 / 100) * 200);   // faster due to lower latency
    const bRate = 100 / (600 + (minerB.lat / 100) * 400);
    let tick = 0;

    const interval = setInterval(() => {
      tick++;
      a = Math.min(100, a + aRate * TICK_MS * (1 + Math.random()*0.3));
      b = Math.min(100, b + bRate * TICK_MS * (1 + Math.random()*0.3));
      setRaceProgress({ a:Math.round(a), b:Math.round(b) });

      if (a >= 100 || b >= 100 || tick > 100) {
        clearInterval(interval);
        setRunning(false);
        const winner = a >= 100 && b < 100 ? "A" : b >= 100 && a < 100 ? "B" : "TIE";
        setRaceResult(winner);
      }
    }, TICK_MS);
  }, [running, minerB.lat]);

  // ── Lab 2: Reorg Depth Explorer ──────────────────────────────────────────
  const [reorgDepth, setReorgDepth] = useState(1);
  const [chainA, setChainA] = useState([
    { h:827349, hash:"000a...", txCount:2847 },
    { h:827350, hash:"000b...", txCount:3012 },
    { h:827351, hash:"000c...", txCount:2661 },
  ]);
  const [orphanTxs, setOrphanTxs] = useState([]);
  const [reorgDone, setReorgDone] = useState(false);

  const simulateReorg = () => {
    const revertedTxs = [];
    for (let i = 0; i < reorgDepth; i++) {
      const block = chainA[chainA.length - 1 - i];
      if (block) {
        const txCount = Math.floor(block.txCount * 0.03);
        for (let j = 0; j < txCount; j++) {
          revertedTxs.push({
            txid: `tx_${block.h}_${j}`, block:block.h,
            status: Math.random() < 0.15 ? "INVALID (double-spent in winner)" : "returned to mempool"
          });
        }
      }
    }
    setOrphanTxs(revertedTxs.slice(0, 8));
    setReorgDone(true);
  };

  // ── Lab 3: Eclipse Detection Tool ────────────────────────────────────────
  const FAKE_PEERS = [
    { id:0, ip:"45.155.204.12", subnet:"/16: 45.155", as:"AS206728", inbound:false, duration:"2d 4h", banscore:0 },
    { id:1, ip:"45.155.204.89", subnet:"/16: 45.155", as:"AS206728", inbound:false, duration:"2d 3h", banscore:0 },
    { id:2, ip:"185.220.101.4", subnet:"/16: 185.220", as:"AS205100", inbound:true,  duration:"1h 22m", banscore:12 },
    { id:3, ip:"185.220.101.7", subnet:"/16: 185.220", as:"AS205100", inbound:true,  duration:"1h 19m", banscore:0 },
    { id:4, ip:"23.92.18.150",  subnet:"/16: 23.92",   as:"AS7922",   inbound:false, duration:"5d 1h", banscore:0 },
    { id:5, ip:"91.108.4.22",   subnet:"/16: 91.108",  as:"AS62041",  inbound:false, duration:"12h 5m", banscore:0 },
    { id:6, ip:"45.155.204.33", subnet:"/16: 45.155", as:"AS206728", inbound:true,  duration:"50m",  banscore:0 },
    { id:7, ip:"104.21.3.89",   subnet:"/16: 104.21",  as:"AS13335",  inbound:false, duration:"3d 2h", banscore:0 },
  ];

  const [analyzeDone, setAnalyzeDone] = useState(false);

  const subnetCounts = FAKE_PEERS.reduce((acc,p) => {
    acc[p.subnet] = (acc[p.subnet]||0)+1; return acc;
  }, {});
  const asCounts = FAKE_PEERS.reduce((acc,p) => {
    acc[p.as] = (acc[p.as]||0)+1; return acc;
  }, {});
  const topSubnet = Object.entries(subnetCounts).sort((a,b)=>b[1]-a[1])[0];
  const topAs = Object.entries(asCounts).sort((a,b)=>b[1]-a[1])[0];
  const eclipseRisk = topSubnet[1] >= 3 ? "HIGH" : topSubnet[1] >= 2 ? "MEDIUM" : "LOW";

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <SecLabel>§5 — Hands-On Laboratory</SecLabel>
      <H2>Measure Propagation, Reorgs & Network Health</H2>
      <Body>Three experiments running entirely in your browser.</Body>

      <div style={{ display:"flex", gap:0, border:`1px solid ${C.border}`, borderRadius:5,
        overflow:"hidden", margin:"16px 0 0" }}>
        {[["propagation","Lab 1: Block Race"],["reorg","Lab 2: Reorg Depth"],["eclipse","Lab 3: Eclipse Detection"]].map(([id,l])=>(
          <button key={id} onClick={()=>setLabTab(id)}
            style={{ flex:1, padding:"11px 4px", border:"none", cursor:"pointer",
              background:labTab===id?C.bg3:C.bg2, color:labTab===id?C.cyan:C.textMuted,
              fontFamily:C.mono, fontSize:10, letterSpacing:"0.04em",
              borderBottom:`2px solid ${labTab===id?C.cyan:"transparent"}`, transition:"all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderTop:"none",
        borderRadius:"0 0 5px 5px", padding:"20px", animation:"fadeIn 0.25s ease" }}>

        {/* ── LAB 1: Block Propagation Race ── */}
        {labTab==="propagation" && (
          <>
            <div style={{ fontFamily:C.mono, fontSize:10, color:C.cyan, letterSpacing:"0.1em", marginBottom:14 }}>
              ▸ OBJECTIVE: Two miners find blocks simultaneously. Which block wins the propagation race?
            </div>
            <Body>
              Miners A and B find blocks at the same height within milliseconds.
              The block that reaches 50%+ of the network first becomes canonical.
              Adjust Miner B's latency to simulate geographic disadvantage.
            </Body>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"14px 0" }}>
              {[
                { label:"MINER A", color:C.cyan, prog:raceProgress.a, lat:0, id:"A",
                  note:"Well-connected, co-located with major relay nodes" },
                { label:"MINER B", color:C.orange, prog:raceProgress.b, lat:minerB.lat, id:"B",
                  note:"Geographic disadvantage, high propagation latency" },
              ].map(m=>(
                <div key={m.id} style={{ background:C.bg3, border:`1px solid ${m.color}33`,
                  borderTop:`2px solid ${m.color}`, borderRadius:5, padding:"14px 15px" }}>
                  <div style={{ fontFamily:C.mono, fontSize:11, color:m.color,
                    fontWeight:700, marginBottom:10 }}>{m.label}</div>
                  <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:6 }}>
                    Additional latency: <span style={{ color:m.color }}>+{m.lat}ms</span>
                  </div>
                  {m.id==="B" && (
                    <input type="range" min={0} max={8000} step={200} value={minerB.lat}
                      onChange={e=>{setMinerB({...minerB,lat:+e.target.value});setRaceResult(null);setRaceProgress({a:0,b:0});}}
                      style={{ width:"100%", accentColor:C.orange, marginBottom:10 }}/>
                  )}
                  <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:6 }}>
                    Network coverage: <span style={{ color:m.color, fontWeight:700 }}>{m.prog}%</span>
                  </div>
                  <div style={{ height:12, background:C.bg4, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${m.prog}%`, background:m.color,
                      borderRadius:3, transition:"width 0.15s ease",
                      boxShadow:`0 0 8px ${m.color}80` }}/>
                  </div>
                  <div style={{ fontFamily:C.body, fontSize:11, color:C.textMuted,
                    marginTop:7, lineHeight:1.5 }}>{m.note}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <Btn onClick={runRace} disabled={running} color={C.cyan} small>
                {running?"⟳ Racing…":"▶ Start Block Race"}
              </Btn>
              <Btn onClick={()=>{setRaceResult(null);setRaceProgress({a:0,b:0});}} color={C.orange} small>↺ Reset</Btn>
            </div>

            {raceResult && (
              <div style={{ background:raceResult==="A"?C.cyanFaint:raceResult==="B"?C.orangeFaint:C.bg3,
                border:`1px solid ${raceResult==="A"?C.cyan:raceResult==="B"?C.orange:C.border}`,
                borderRadius:5, padding:"14px 16px", animation:"fadeIn 0.35s ease" }}>
                <div style={{ fontFamily:C.disp, fontSize:20, fontWeight:700,
                  color:raceResult==="A"?C.cyan:raceResult==="B"?C.orange:C.yellow, marginBottom:8 }}>
                  {raceResult==="TIE" ? "⚡ TIE — Fork persists until next block" :
                    `✓ MINER ${raceResult} WINS — Miner ${raceResult==="A"?"B":"A"}'s block is orphaned`}
                </div>
                <div style={{ fontFamily:C.body, fontSize:13, color:C.text, lineHeight:1.7 }}>
                  {raceResult==="A"
                    ? "Miner A's faster propagation (lower latency, better connectivity) caused their block to reach 50%+ of the network first. Miner B's block is orphaned — their mining reward is lost."
                    : raceResult==="B"
                    ? "Despite higher latency, Miner B's block propagated first this round. Variance in gossip routing can sometimes favor the slower miner. Try running multiple races."
                    : "Both blocks reached ~50% of the network simultaneously. A fork persists until one side mines the next block — whichever chain grows first becomes canonical."}
                </div>
                {minerB.lat > 4000 && raceResult==="A" && (
                  <div style={{ marginTop:10, fontFamily:C.mono, fontSize:11, color:C.red }}>
                    ⚠ Miner B has {minerB.lat}ms disadvantage — selfish mining profitable above ~25% hashrate at this latency.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── LAB 2: REORG DEPTH ── */}
        {labTab==="reorg" && (
          <>
            <div style={{ fontFamily:C.mono, fontSize:10, color:C.cyan, letterSpacing:"0.1em", marginBottom:14 }}>
              ▸ OBJECTIVE: Simulate a chain reorganization. See which transactions are affected at different reorg depths.
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted, marginBottom:6 }}>
                REORG DEPTH: <span style={{ color:reorgDepth<=1?C.lime:reorgDepth<=3?C.orange:C.red,
                  fontWeight:700 }}>{reorgDepth} block{reorgDepth>1?"s":""}</span>
                {" "}<span style={{ color:C.textMuted }}>
                  ({reorgDepth===1?"routine stale":reorgDepth<=3?"unusual — check peers":reorgDepth<=6?"possible selfish mining":"CRITICAL — likely 51% attack"})
                </span>
              </div>
              <input type="range" min={1} max={12} value={reorgDepth}
                onChange={e=>{setReorgDepth(+e.target.value);setReorgDone(false);setOrphanTxs([]);}}
                style={{ width:"100%", accentColor:reorgDepth<=1?C.lime:reorgDepth<=3?C.orange:C.red }}/>
            </div>

            {/* Chain visualization */}
            <div style={{ overflowX:"auto", marginBottom:12 }}>
              <div style={{ display:"flex", gap:0, alignItems:"center", minWidth:600 }}>
                {[...Array(6)].map((_,i)=>{
                  const blockH = 827347+i;
                  const isBase = i < 3;
                  const isOrphaned = !isBase && i-3 < reorgDepth;
                  const isWinner = !isBase;
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:0 }}>
                      {i>0&&<div style={{ width:20, height:1,
                        background:isOrphaned?`${C.red}60`:C.cyan+"50" }}/>}
                      <div style={{ background:isOrphaned?C.redFaint:isBase?C.bg3:C.cyanFaint,
                        border:`1px solid ${isOrphaned?C.red:isBase?C.border:C.cyan}`,
                        borderRadius:3, padding:"7px 10px", textAlign:"center", minWidth:70 }}>
                        <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:3 }}>
                          H:{blockH}
                        </div>
                        <div style={{ fontFamily:C.mono, fontSize:9,
                          color:isOrphaned?C.red:isBase?C.text:C.cyan, fontWeight:600 }}>
                          {isOrphaned?"ORPHANED":isBase?"SHARED":"WINNER"}
                        </div>
                        {isOrphaned && (
                          <div style={{ fontFamily:C.mono, fontSize:8, color:C.red, marginTop:2 }}>
                            {Math.floor(2700*(0.8+Math.random()*0.4))} txns at risk
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <Btn onClick={simulateReorg} color={C.red} small>⚡ Execute Reorg</Btn>
              <Btn onClick={()=>{setReorgDone(false);setOrphanTxs([]);}} color={C.orange} small>↺ Reset</Btn>
            </div>

            {reorgDone && (
              <div style={{ animation:"slideR 0.3s ease" }}>
                <div style={{ fontFamily:C.mono, fontSize:10, color:C.red, marginBottom:10,
                  letterSpacing:"0.08em" }}>
                  REORG COMPLETE — {reorgDepth} block{reorgDepth>1?"s":""} orphaned
                </div>
                <div style={{ background:"#030608", border:`1px solid ${C.border}`,
                  borderRadius:4, overflow:"hidden" }}>
                  <div style={{ background:C.bg2, padding:"6px 12px",
                    fontFamily:C.mono, fontSize:10, color:C.textMuted }}>
                    Affected transactions (sample)
                  </div>
                  {orphanTxs.map((tx,i)=>(
                    <div key={i} style={{ padding:"6px 12px", fontFamily:C.mono, fontSize:11,
                      borderTop:`1px solid ${C.border}22`,
                      display:"grid", gridTemplateColumns:"120px 1fr 1fr", gap:8 }}>
                      <span style={{ color:C.cyan }}>{tx.txid}</span>
                      <span style={{ color:C.textMuted }}>block {tx.block}</span>
                      <span style={{ color:tx.status.includes("INVALID")?C.red:C.lime }}>
                        {tx.status}
                      </span>
                    </div>
                  ))}
                </div>
                {reorgDepth >= 3 && (
                  <InfoBox title="Operator Action Required" icon="▸" color={C.red}>
                    Reorg depth ≥3 is highly unusual on Bitcoin mainnet. Check:
                    (1) getpeerinfo — confirm peer diversity (not eclipsed),
                    (2) getblockchaininfo — compare local tip with block explorer,
                    (3) Inspect orphaned blocks for double-spend patterns (same inputs, different outputs).
                    A reorg of depth ≥6 may indicate a 51% attack in progress.
                  </InfoBox>
                )}
              </div>
            )}
          </>
        )}

        {/* ── LAB 3: ECLIPSE DETECTION ── */}
        {labTab==="eclipse" && (
          <>
            <div style={{ fontFamily:C.mono, fontSize:10, color:C.cyan, letterSpacing:"0.1em", marginBottom:14 }}>
              ▸ OBJECTIVE: Analyze a node's peer list for eclipse attack indicators.
            </div>
            <div style={{ fontFamily:C.body, fontSize:14, color:C.text, lineHeight:1.8, marginBottom:14 }}>
              The table below simulates output from <code style={{ fontFamily:C.mono, fontSize:13,
                color:C.cyan }}>bitcoin-cli getpeerinfo</code>. Analyze the peer distribution
              for eclipse attack signals: IP subnet concentration and AS-level clustering.
            </div>

            <div style={{ background:"#030608", border:`1px solid ${C.border}`, borderRadius:4, overflow:"hidden", marginBottom:14 }}>
              <div style={{ background:C.bg2, padding:"6px 12px",
                fontFamily:C.mono, fontSize:10, color:C.textMuted }}>
                $ bitcoin-cli getpeerinfo | jq '[.[] | {id, addr, inbound, subver, services}]'
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:C.mono, fontSize:11 }}>
                <thead>
                  <tr style={{ background:C.bg3 }}>
                    {["ID","IP Address","/16 Subnet","AS Number","Dir","Duration","Ban Score"].map(h=>(
                      <th key={h} style={{ padding:"7px 10px", textAlign:"left", color:C.textMuted,
                        fontSize:9, borderBottom:`1px solid ${C.border}`, letterSpacing:"0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FAKE_PEERS.map((p,i) => {
                    const isRisky = p.subnet === topSubnet[0];
                    return (
                      <tr key={i} style={{ background:isRisky&&analyzeDone?C.redFaint:i%2===0?C.bg2:C.bg3,
                        transition:"background 0.3s" }}>
                        <td style={{ padding:"6px 10px", color:C.textMuted }}>{p.id}</td>
                        <td style={{ padding:"6px 10px", color:isRisky&&analyzeDone?C.red:C.cyan }}>{p.ip}</td>
                        <td style={{ padding:"6px 10px", color:isRisky&&analyzeDone?C.red:C.text }}>{p.subnet}</td>
                        <td style={{ padding:"6px 10px", color:C.text }}>{p.as}</td>
                        <td style={{ padding:"6px 10px", color:p.inbound?C.textMuted:C.orange }}>
                          {p.inbound?"inbound":"outbound"}
                        </td>
                        <td style={{ padding:"6px 10px", color:C.textMuted }}>{p.duration}</td>
                        <td style={{ padding:"6px 10px", color:p.banscore>0?C.yellow:C.textMuted }}>
                          {p.banscore}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <Btn onClick={()=>setAnalyzeDone(true)} color={C.cyan} small>🔍 Analyze Peer Distribution</Btn>
              <Btn onClick={()=>setAnalyzeDone(false)} color={C.orange} small>↺ Reset</Btn>
            </div>

            {analyzeDone && (
              <div style={{ animation:"slideR 0.3s ease" }}>
                <div style={{ background:eclipseRisk==="HIGH"?C.redFaint:C.orangeFaint,
                  border:`2px solid ${eclipseRisk==="HIGH"?C.red:C.orange}`,
                  borderRadius:5, padding:"14px 16px", marginBottom:12 }}>
                  <div style={{ fontFamily:C.disp, fontSize:18, fontWeight:700,
                    color:eclipseRisk==="HIGH"?C.red:C.orange, marginBottom:10 }}>
                    ECLIPSE RISK: {eclipseRisk}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
                    {[
                      { l:"Top Subnet Count", v:`${topSubnet[1]}/8`, threshold:"≤1 = safe", c:topSubnet[1]>1?C.red:C.lime },
                      { l:"Top AS Count", v:`${topAs[1]}/8`, threshold:"≤2 = safe", c:topAs[1]>2?C.red:topAs[1]>1?C.orange:C.lime },
                      { l:"Outbound Diversity", v:`${new Set(FAKE_PEERS.filter(p=>!p.inbound).map(p=>p.subnet)).size} subnets`, threshold:"≥4 = safe", c:C.cyan },
                    ].map(r=>(
                      <div key={r.l} style={{ background:C.bg3, borderRadius:3, padding:"9px 10px",
                        border:`1px solid ${r.c}22`, textAlign:"center" }}>
                        <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:4 }}>{r.l}</div>
                        <div style={{ fontFamily:C.disp, fontSize:20, color:r.c, fontWeight:700 }}>{r.v}</div>
                        <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginTop:3 }}>{r.threshold}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily:C.body, fontSize:13.5, color:C.text, lineHeight:1.75 }}>
                    <strong style={{ color:C.red }}>⚠ Subnet {topSubnet[0]} ({topSubnet[1]} peers, AS206728)</strong> is dangerously over-represented.
                    This subnet accounts for {Math.round(topSubnet[1]/8*100)}% of your peer connections.
                    Recommended action: <code style={{ fontFamily:C.mono, fontSize:12, color:C.cyan }}>bitcoin-cli disconnectnode "45.155.204.12"</code> for
                    each suspicious peer, then <code style={{ fontFamily:C.mono, fontSize:12, color:C.cyan }}>addnode</code> diverse known-good peers.
                    Consider enabling Asmap for AS-level diversity enforcement.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: QUIZZES ────────────────────────────────────────────────────────
const QuizSection = () => {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(null);

  const bySec = QUIZZES.reduce((acc,q,i)=>{
    (acc[q.sec]=acc[q.sec]||[]).push({...q,idx:i}); return acc;
  },{});
  const allAnswered = QUIZZES.every((_,i)=>revealed[i]);

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <SecLabel>§6 — Knowledge Checks</SecLabel>
      <H2>In-Class Quizzes</H2>
      <Body>Answer all questions, then reveal explanations. Score calculated at end.</Body>

      {score!==null&&(
        <div style={{ background:score>=6?C.limeFaint:score>=4?C.orangeFaint:C.redFaint,
          border:`1px solid ${score>=6?C.lime:score>=4?C.orange:C.red}55`,
          borderRadius:6, padding:"18px 22px", margin:"16px 0", textAlign:"center" }}>
          <div style={{ fontFamily:C.disp, fontSize:42, fontWeight:900,
            color:score>=6?C.lime:score>=4?C.orange:C.red }}>{score}/{QUIZZES.length}</div>
          <div style={{ fontFamily:C.mono, fontSize:12, color:C.text, marginTop:8 }}>
            {score===QUIZZES.length?"Perfect. Complete mastery of P2P networking and adversarial models."
              :score>=6?"Strong understanding. Review any missed explanations carefully."
              :score>=4?"Good foundation. Re-read §2–§4 and retry."
              :"Revisit the chapter content and retry."}
          </div>
        </div>
      )}

      {Object.entries(bySec).map(([sec,qs])=>(
        <div key={sec} style={{ marginBottom:28 }}>
          <div style={{ fontFamily:C.mono, fontSize:10, color:C.cyan, letterSpacing:"0.14em",
            margin:"22px 0 12px", borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>{sec}</div>
          {qs.map(q=>{
            const i=q.idx, isRev=revealed[i], ok=answers[i]===q.ans;
            return (
              <div key={i} style={{ background:C.bg2,
                border:`1px solid ${isRev?(ok?C.lime+"55":C.red+"55"):C.border}`,
                borderRadius:5, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ fontFamily:C.body, fontSize:15, color:C.textBright,
                  marginBottom:14, lineHeight:1.8 }}>
                  <span style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted, marginRight:8 }}>Q{i+1}.</span>
                  {q.q}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {q.opts.map((opt,oi)=>{
                    let bg=C.bg3, border=C.border, color=C.text;
                    if(isRev){
                      if(oi===q.ans){bg=C.limeFaint;border=C.lime;color=C.lime;}
                      else if(oi===answers[i]&&oi!==q.ans){bg=C.redFaint;border=C.red;color=C.red;}
                    } else if(answers[i]===oi){bg=C.cyanFaint;border=C.cyan;color=C.cyan;}
                    return (
                      <button key={oi} onClick={()=>!isRev&&setAnswers(p=>({...p,[i]:oi}))}
                        style={{ background:bg, border:`1px solid ${border}`, borderRadius:4,
                          padding:"9px 13px", cursor:isRev?"default":"pointer",
                          textAlign:"left", fontFamily:C.body, fontSize:13.5, color,
                          lineHeight:1.55, transition:"all 0.15s" }}>
                        <span style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted, marginRight:9 }}>
                          {String.fromCharCode(65+oi)}.
                        </span>{opt}
                        {isRev&&oi===q.ans&&<span style={{ marginLeft:8 }}>✓</span>}
                        {isRev&&oi===answers[i]&&oi!==q.ans&&<span style={{ marginLeft:7 }}>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {!isRev&&(
                  <button onClick={()=>answers[i]!==undefined&&setRevealed(p=>({...p,[i]:true}))}
                    disabled={answers[i]===undefined}
                    style={{ marginTop:11, padding:"7px 18px",
                      background:answers[i]!==undefined?C.cyanFaint:C.bg3,
                      border:`1px solid ${answers[i]!==undefined?C.cyan+"55":C.border}`,
                      borderRadius:3, cursor:answers[i]!==undefined?"pointer":"default",
                      color:answers[i]!==undefined?C.cyan:C.textMuted,
                      fontFamily:C.mono, fontSize:10, fontWeight:600, transition:"all 0.2s" }}>
                    Submit Answer
                  </button>
                )}
                {isRev&&(
                  <div style={{ marginTop:12, background:"#020406", borderRadius:4,
                    padding:"11px 13px", borderLeft:`3px solid ${ok?C.lime:C.orange}` }}>
                    <div style={{ fontFamily:C.mono, fontSize:9, color:ok?C.lime:C.orange,
                      letterSpacing:"0.1em", marginBottom:6 }}>
                      {ok?"✓ CORRECT":"✗ INCORRECT"} — EXPLANATION
                    </div>
                    <div style={{ fontFamily:C.body, fontSize:13.5, color:C.text, lineHeight:1.8 }}>
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
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <button onClick={()=>setScore(QUIZZES.filter((q,i)=>answers[i]===q.ans).length)}
            style={{ padding:"11px 34px", background:C.cyan, color:C.bg0, border:"none",
              borderRadius:4, cursor:"pointer", fontFamily:C.mono, fontSize:12,
              fontWeight:700, letterSpacing:"0.1em" }}>CALCULATE SCORE</button>
        </div>
      )}
    </div>
  );
};

// ─── SECTION: ASSESSMENT ─────────────────────────────────────────────────────
const AssessSection = () => {
  const [revealed, setRevealed] = useState({});
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <SecLabel>§7 — Assessment Problems</SecLabel>
      <H2>End-of-Chapter Problems</H2>
      <Body>Five graded problems. Attempt independently before revealing model answers.</Body>
      <div style={{ display:"flex", gap:8, margin:"14px 0 22px", flexWrap:"wrap" }}>
        {[[C.cyan,"Foundational"],[C.orange,"Intermediate"],[C.red,"Advanced"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, background:c, borderRadius:2 }}/>
            <span style={{ fontFamily:C.mono, fontSize:10, color:C.textMuted }}>{l}</span>
          </div>
        ))}
      </div>
      {ASSESSMENTS.map(a=>(
        <div key={a.id} style={{ background:C.bg2, border:`1px solid ${C.border}`,
          borderLeft:`3px solid ${a.color}`, borderRadius:5, padding:"18px 20px", marginBottom:18 }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
            <span style={{ fontFamily:C.disp, fontSize:22, fontWeight:700,
              color:a.color, letterSpacing:"0.05em" }}>{a.id}</span>
            <Tag color={a.color}>{a.diff}</Tag>
          </div>
          <div style={{ fontFamily:C.body, fontSize:15.5, color:C.textBright,
            lineHeight:1.88, marginBottom:14 }}>{a.problem}</div>
          <Btn onClick={()=>setRevealed(p=>({...p,[a.id]:!p[a.id]}))} color={a.color} small>
            {revealed[a.id]?"▲ Hide Answer":"▼ Reveal Model Answer"}
          </Btn>
          {revealed[a.id]&&(
            <div style={{ marginTop:14 }}>
              <div style={{ fontFamily:C.mono, fontSize:9, color:a.color,
                letterSpacing:"0.14em", marginBottom:9 }}>MODEL ANSWER</div>
              <Code title={`${a.id} — Model Answer`}>{a.answer}</Code>
            </div>
          )}
        </div>
      ))}
      <InfoBox title="Further Reading" icon="▸" color={C.violet}>
        <strong>Network measurement:</strong> Decker &amp; Wattenhofer (2013). Information Propagation in the Bitcoin Network. · Apostolaki, Zohar &amp; Vanbever (2017). Hijacking Bitcoin: Routing Attacks on Cryptocurrencies.<br/><br/>
        <strong>Eclipse attacks:</strong> Heilman et al. (2015). Eclipse Attacks on Bitcoin's Peer-to-Peer Network. · Marcus et al. (2018). Low-Resource Eclipse Attacks on Ethereum's Peer-to-Peer Network.<br/><br/>
        <strong>Selfish mining:</strong> Eyal &amp; Sirer (2013). Majority Is Not Enough: Bitcoin Mining Is Vulnerable.<br/><br/>
        <strong>Relay networks:</strong> FIBRE: bitcoinfibre.org · Erlay (BIP 330): github.com/bitcoin/bips/blob/master/bip-0330.mediawiki · BIP 152 (Compact Blocks).
      </InfoBox>
    </div>
  );
};

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function P2PNetworking() {
  const [active, setActive] = useState("intro");
  const contentRef = useRef(null);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [active]);

  const SECTIONS = {
    intro:   <IntroSection/>,
    gossip:  <GossipSection/>,
    attacks: <AttacksSection/>,
    observe: <ObserveSection/>,
    lab:     <LabSection/>,
    quiz:    <QuizSection/>,
    assess:  <AssessSection/>,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ display:"flex", height:"100vh", background:C.bg0, color:C.text, overflow:"hidden" }}>

        {/* SIDEBAR */}
        <div style={{ width:218, background:C.bg1, borderRight:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:C.mono, fontSize:8, color:C.textMuted,
              letterSpacing:"0.24em", textTransform:"uppercase", marginBottom:8 }}>
              ACM Educational Series
            </div>
            <div style={{ fontFamily:C.disp, fontSize:15, fontWeight:700,
              color:C.textBright, lineHeight:1.25, marginBottom:3, letterSpacing:"0.05em" }}>
              P2P Networking
            </div>
            <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, marginBottom:10 }}>
              Adversarial Conditions
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:C.cyan,
                animation:"blink 1.8s ease infinite" }}/>
              <span style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted }}>Chapter 5 · Live</span>
            </div>
          </div>

          <nav style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
            {CHAPTERS.map(ch=>(
              <button key={ch.id} onClick={()=>setActive(ch.id)}
                style={{ width:"100%", padding:"9px 14px",
                  background:active===ch.id?C.cyanFaint:"none", border:"none",
                  borderLeft:`3px solid ${active===ch.id?C.cyan:"transparent"}`,
                  cursor:"pointer", textAlign:"left", display:"flex",
                  gap:10, alignItems:"center", transition:"all 0.15s" }}>
                <span style={{ fontFamily:C.mono, fontSize:9,
                  color:active===ch.id?C.cyan:C.textMuted, minWidth:18 }}>{ch.short}</span>
                <span style={{ fontFamily:C.body, fontSize:13,
                  color:active===ch.id?C.textBright:C.textMuted, lineHeight:1.3 }}>
                  {ch.label.replace(/^§\d+ /,"")}
                </span>
              </button>
            ))}
          </nav>

          <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:C.mono, fontSize:9, color:C.textMuted, lineHeight:1.75 }}>
              8 Quizzes · 5 Problems<br/>
              3 Interactive Labs<br/>
              Distributed Systems
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div ref={contentRef}
          style={{ flex:1, overflowY:"auto", padding:"38px 46px",
            maxWidth:860, margin:"0 auto", width:"100%" }}>
          {SECTIONS[active]}
          <div style={{ display:"flex", justifyContent:"space-between",
            marginTop:44, paddingTop:22, borderTop:`1px solid ${C.border}` }}>
            {(()=>{
              const idx = CHAPTERS.findIndex(c=>c.id===active);
              const prev = CHAPTERS[idx-1], next = CHAPTERS[idx+1];
              return (
                <>
                  {prev ? <Btn onClick={()=>setActive(prev.id)} color={C.textMuted} small>← {prev.label}</Btn> : <div/>}
                  {next && <Btn onClick={()=>setActive(next.id)} color={C.cyan} small>{next.label} →</Btn>}
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
