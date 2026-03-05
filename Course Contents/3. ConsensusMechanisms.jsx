import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Spectral:ital,wght@0,300;0,400;0,600;1,400&family=Space+Mono:wght@400;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:5px;background:#040a06;}
  ::-webkit-scrollbar-thumb{background:#1a3d24;border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
  @keyframes pulse{0%,100%{opacity:0.7}50%{opacity:1}}
  @keyframes nodePing{0%{transform:scale(1);opacity:1}50%{transform:scale(1.35);opacity:0.5}100%{transform:scale(1);opacity:1}}
  @keyframes msgFly{0%{opacity:0;transform:scale(0.4)}40%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.4)}}
  @keyframes borderPulse{0%,100%{border-color:#22d68044}50%{border-color:#22d680cc}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
`;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg0:"#040a06", bg1:"#070f09", bg2:"#0c1810", bg3:"#122014", bg4:"#192c1c",
  border:"#1e3825", borderBright:"#2d5438",
  em:"#22d680",   emDim:"#117a3e",   emFaint:"#22d68016",
  amber:"#f5a623", amberDim:"#8f5d0a", amberFaint:"#f5a62316",
  red:"#f06060",  redDim:"#8a2828",   redFaint:"#f0606016",
  indigo:"#818cf8",indigoDim:"#3730a3",indigoFaint:"#818cf816",
  sky:"#38bdf8",  skyFaint:"#38bdf816",
  gold:"#fbbf24", goldFaint:"#fbbf2416",
  text:"#8db89a", textMuted:"#3a6045", textBright:"#d4edda",
  mono:"'Space Mono', monospace",
  disp:"'Rajdhani', sans-serif",
  body:"'Spectral', serif",
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const SecLabel = ({children}) => (
  <div style={{fontFamily:T.mono,fontSize:10,color:T.em,letterSpacing:"0.2em",
    textTransform:"uppercase",marginBottom:7}}>{children}</div>
);
const H2 = ({children}) => (
  <h2 style={{fontFamily:T.disp,fontSize:28,fontWeight:700,color:T.textBright,
    lineHeight:1.15,marginBottom:4,letterSpacing:"0.03em"}}>{children}</h2>
);
const H3 = ({children,color=T.em}) => (
  <h3 style={{display:"flex",alignItems:"center",gap:9,fontFamily:T.mono,
    fontSize:11,fontWeight:700,color,letterSpacing:"0.12em",
    textTransform:"uppercase",margin:"22px 0 10px"}}>
    <span style={{width:14,height:1,background:color,display:"inline-block"}}/>
    {children}
    <span style={{flex:1,height:1,background:color,opacity:0.18}}/>
  </h3>
);
const Body = ({children,style={}}) => (
  <p style={{fontFamily:T.body,fontSize:15.5,lineHeight:1.9,color:T.text,
    margin:"12px 0",...style}}>{children}</p>
);
const Code = ({children,title,compact}) => (
  <div style={{background:"#020704",border:`1px solid ${T.border}`,
    borderRadius:5,margin:compact?"7px 0":"13px 0",overflow:"hidden"}}>
    {title&&<div style={{background:T.bg2,borderBottom:`1px solid ${T.border}`,
      padding:"5px 12px",fontFamily:T.mono,fontSize:10,color:T.textMuted}}>{title}</div>}
    <pre style={{padding:compact?"10px 13px":"14px 16px",fontFamily:T.mono,
      fontSize:12,color:T.em,lineHeight:1.75,overflowX:"auto",
      whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{children}</pre>
  </div>
);
const InfoBox = ({title,children,color=T.em,icon="◈"}) => (
  <div style={{background:T.bg2,border:`1px solid ${color}30`,
    borderLeft:`3px solid ${color}`,borderRadius:5,
    padding:"14px 18px",margin:"16px 0",animation:"fadeUp 0.35s ease"}}>
    <div style={{fontFamily:T.mono,fontSize:10,color,letterSpacing:"0.12em",
      textTransform:"uppercase",marginBottom:7}}>{icon} {title}</div>
    <div style={{fontFamily:T.body,fontSize:14,color:T.text,lineHeight:1.78}}>
      {children}
    </div>
  </div>
);
const HR = () => (
  <div style={{height:1,margin:"28px 0",
    background:`linear-gradient(90deg,${T.em}55,${T.border},transparent)`}}/>
);
const Tag = ({children,color=T.em}) => (
  <span style={{display:"inline-block",padding:"2px 9px",borderRadius:2,
    background:`${color}20`,border:`1px solid ${color}44`,color,
    fontFamily:T.mono,fontSize:10,letterSpacing:"0.06em",fontWeight:700}}>
    {children}
  </span>
);
const Btn = ({onClick,children,color=T.em,disabled,small}) => (
  <button onClick={onClick} disabled={disabled}
    style={{padding:small?"6px 14px":"9px 20px",
      background:disabled?T.bg3:`${color}20`,
      border:`1px solid ${disabled?T.border:`${color}55`}`,
      borderRadius:4,cursor:disabled?"not-allowed":"pointer",
      color:disabled?T.textMuted:color,fontFamily:T.mono,
      fontSize:small?10:11,fontWeight:700,letterSpacing:"0.06em",
      transition:"all 0.18s",opacity:disabled?0.55:1}}>{children}</button>
);

const CHAPTERS = [
  {id:"intro",   label:"§1 Overview",          short:"§1"},
  {id:"safety",  label:"§2 Safety vs Liveness", short:"§2"},
  {id:"compare", label:"§3 PoW / PoS / BFT",   short:"§3"},
  {id:"finality",label:"§4 Finality Models",    short:"§4"},
  {id:"lab",     label:"§5 Interactive Lab",    short:"§5"},
  {id:"quiz",    label:"§6 Quizzes",            short:"§6"},
  {id:"assess",  label:"§7 Assessment",         short:"§7"},
];

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const QUIZZES = [
  {
    sec:"§2 Safety vs Liveness",
    q:"Which consensus property does Bitcoin's Nakamoto consensus prioritize — and what does it sacrifice during a temporary network partition?",
    opts:[
      "Safety: Bitcoin halts until the partition heals, never allowing a fork",
      "Liveness: Bitcoin continues accepting transactions and may temporarily fork; it sacrifices consistency (safety) during the partition, resolving via the longest-chain rule afterward",
      "Both equally: Bitcoin uses a special tie-breaking rule that prevents any property from being compromised",
      "Neither: Bitcoin defers all decisions to a trusted third party during partitions",
    ],
    ans:1,
    explain:"Bitcoin is an AP system (Available + Partition-tolerant). During a network split, both sides keep producing blocks → temporary fork. Safety (all nodes agree on one chain) is violated briefly. Liveness (transactions are processed) is preserved. The fork resolves naturally: whichever partition accumulates more work wins, and the other side reorganizes. BFT systems make the opposite choice — halt (sacrifice liveness) to preserve safety.",
  },
  {
    sec:"§2 Safety vs Liveness",
    q:"The FLP Impossibility result (Fischer, Lynch, Paterson 1985) proves that in an asynchronous network with even one crash failure, no algorithm can guarantee both safety and liveness. How do real blockchains work around this?",
    opts:[
      "They use synchronous networks with bounded message delays, making FLP inapplicable",
      "They assume partial synchrony (GST model): a 'Global Stabilization Time' after which the network eventually becomes synchronous, allowing protocols to progress without abandoning safety guarantees",
      "They ignore liveness entirely, accepting that transactions may never confirm",
      "They replace crash failures with Byzantine failures, which FLP does not cover",
    ],
    ans:1,
    explain:"FLP applies to purely async networks. Real protocols (PBFT, Tendermint, HotStuff) use the partial synchrony model (Dwork, Lynch, Stockmeyer 1988): safety holds always; liveness holds once the network stabilizes. Timeouts and view-change protocols handle detected failures. PoW sidesteps FLP via probabilistic guarantees and the synchrony assumption embedded in difficulty adjustment.",
  },
  {
    sec:"§3 PoW / PoS / BFT",
    q:"Why can't a rational validator simply vote on every competing fork simultaneously in a naive Proof-of-Stake system?",
    opts:[
      "The protocol cryptographically prevents validators from signing two different blocks at the same height",
      "In naive PoS there's no cost to voting on multiple forks (nothing-at-stake), so rational validators WOULD do this — which is why modern PoS adds slashing: validators who equivocate lose their entire staked deposit",
      "Voting on multiple forks is allowed and encouraged as a redundancy mechanism",
      "Validators are randomly shuffled between forks so double-voting is statistically impossible",
    ],
    ans:1,
    explain:"Nothing-at-stake: in early PoS designs, creating a block cost nothing (unlike PoW's energy), so validators had no reason not to sign every fork — maximizing fee income while eliminating the economic deterrent to forking. Modern PoS (Ethereum, Cardano, Cosmos) solves this with slashing: provable equivocation (two signatures at same height/round) causes the validator to lose a large portion (often 100%) of their stake deposit.",
  },
  {
    sec:"§3 PoW / PoS / BFT",
    q:"PBFT and Tendermint tolerate f Byzantine faults in a network of n validators. What is the minimum n for a given f, and why can't f reach n/3?",
    opts:[
      "n ≥ 2f+1; because 2f honest nodes always outvote f Byzantine ones",
      "n ≥ 3f+1; because the protocol needs enough honest nodes to form a quorum (2f+1) that cannot be blocked or corrupted by f adversaries simultaneously",
      "n ≥ 4f+1; the extra f is needed for crash tolerance on top of Byzantine tolerance",
      "n ≥ f²; the quadratic relationship comes from the all-to-all messaging complexity",
    ],
    ans:1,
    explain:"With n=3f+1, quorum size is 2f+1. Even if all f Byzantine nodes are in every quorum, at least f+1 honest nodes are also present → honest majority. With f=n/3 (i.e., n=3f), quorum would be 2f — exactly the number of Byzantine nodes, giving them full control. The intuition: any two quorums of size 2f+1 must overlap in at least f+1 nodes, ensuring at least one honest node witnessed both messages — the 'common honest witness' that makes Byzantine agreement possible.",
  },
  {
    sec:"§4 Finality Models",
    q:"Bitcoin has 'probabilistic finality.' After 6 confirmations, an attacker with 10% of total hashrate tries to revert a transaction. What is the approximate probability of success?",
    opts:[
      "~50% — randomness makes all reversal attempts equally likely",
      "~0.024% — using Nakamoto's formula P ≈ (q/p)^k with q=0.1, p=0.9, k=6: (0.1/0.9)^6 ≈ 0.000244",
      "~10% — same as the attacker's hashrate fraction",
      "Exactly 0% — 6 confirmations is the absolute finality threshold in Bitcoin",
    ],
    ans:1,
    explain:"Nakamoto (2008) §11: For attacker with q fraction of hashrate (q<0.5), probability of catching up from k blocks behind ≈ (q/p)^k where p=1-q. With q=0.1, p=0.9, k=6: (0.111...)^6 ≈ 0.000214 ≈ 0.021%. With q=0.3: (0.429)^6 ≈ 0.6% at k=6. With q=0.4: (0.667)^6 ≈ 8.8%. This exponential decay is why more confirmations matter greatly for high-value transactions.",
  },
  {
    sec:"§4 Finality Models",
    q:"Ethereum's Gasper consensus combines LMD-GHOST (fork choice) with Casper FFG (finality). What specifically happens to a validator who votes to finalize two conflicting checkpoints?",
    opts:[
      "Their vote is simply ignored; the minority checkpoint is abandoned automatically",
      "They are slashed: their entire staked ETH (32 ETH minimum) is destroyed (burned), and they are forcibly ejected from the validator set — creating cryptoeconomic finality",
      "They are penalized with a small inactivity leak but may continue validating",
      "They trigger an automatic fork choice that selects the heavier-attested checkpoint",
    ],
    ans:1,
    explain:"Casper FFG introduces 'accountable safety': if finality is ever violated (two conflicting checkpoints both finalized), it is cryptographically provable that ≥1/3 of validators equivocated. Those validators are slashable. Because reverting finality requires >1/3 stake to be destroyed (hundreds of billions of USD at current prices), Ethereum achieves economic finality — reverting is not 'computationally infeasible' but 'economically irrational at any scale.'",
  },
  {
    sec:"§2 Safety vs Liveness",
    q:"Under a 51% hashrate attack, which of the following CAN the attacker do, and which CAN'T they?",
    opts:[
      "CAN: mint arbitrary new coins. CANNOT: double-spend their own transactions",
      "CAN: double-spend their own transactions and reorder recent blocks. CANNOT: steal funds from other addresses, forge signatures, or create coins beyond the block reward",
      "CAN: change the consensus rules in real time. CANNOT: reverse transactions more than 100 blocks deep",
      "CAN: do all of the above. CANNOT: be detected by honest nodes",
    ],
    ans:1,
    explain:"A 51% attacker controls the canonical chain selection — they can mine a secret longer chain to double-spend their own outputs (sending to an exchange, then reversing). They CANNOT: forge ECDSA signatures (requires private keys), spend others' UTXOs, create coins beyond protocol rules (nodes would reject invalid coinbase), or retroactively change blocks that honest nodes have already finalized economically. The attack is costly, detectable, and limited to recent history.",
  },
  {
    sec:"§3 PoW / PoS / BFT",
    q:"HotStuff (the consensus protocol underlying Facebook's Diem and many modern BFT chains) achieves 'linear message complexity' — O(n) per round instead of PBFT's O(n²). How?",
    opts:[
      "HotStuff reduces the number of consensus phases from 3 to 1",
      "HotStuff uses a leader that aggregates votes into a threshold signature (one combined signature per round), so only the leader sends n messages and only one aggregate flows back — eliminating the all-to-all broadcast",
      "HotStuff uses a gossip protocol where each node only communicates with log(n) neighbors",
      "HotStuff batches all rounds together and processes them in a single superround",
    ],
    ans:1,
    explain:"PBFT's O(n²) comes from every node broadcasting to every other node in prepare/commit phases. HotStuff's key insight: threshold signatures (BLS aggregation) let the leader collect votes into a single 'quorum certificate' (QC) — one aggregate signature representing 2f+1 votes. Each round: n nodes → leader (n msgs), leader aggregates → broadcasts QC (n msgs) = O(n) total. The pipelined variant further overlaps phases across blocks, achieving both linear complexity AND pipelined throughput.",
  },
];

// ─── ASSESSMENT DATA ─────────────────────────────────────────────────────────
const ASSESSMENTS = [
  {
    id:"P1", diff:"Foundational", color:T.em,
    problem:"Explain the Byzantine Generals Problem. Define 'Byzantine fault tolerance.' Why is this problem directly relevant to blockchains, and which class of blockchain consensus mechanisms were designed specifically to solve it?",
    answer:`THE BYZANTINE GENERALS PROBLEM (Lamport, Shostak, Pease 1982)

  Scenario: Several generals with armies surround an enemy city. They must agree
  on ONE plan: attack or retreat. They communicate only by messenger. Some generals
  may be TRAITORS who send conflicting messages to prevent agreement.

  Formal statement:
  - n parties must agree on a single value (binary: 0 or 1)
  - f of them may be "Byzantine" (arbitrarily malicious: lie, delay, equivocate)
  - Requirement: all HONEST parties reach the same decision

  The impossible threshold: it is IMPOSSIBLE to solve with n ≤ 3f
  (i.e., you need n ≥ 3f+1 to guarantee agreement with f traitors)

  WHY? With n=3f, an adversary can create 3 equal-sized groups and make
  each think the others voted differently — no honest quorum can form.

BYZANTINE FAULT TOLERANCE (BFT) DEFINED:
  A system is BFT if it continues to operate correctly (safety + liveness)
  despite up to f of n participants behaving arbitrarily maliciously,
  provided n ≥ 3f+1.

  "Arbitrarily malicious" includes:
  • Sending different messages to different nodes (equivocation)
  • Selective silence or delay
  • Collusion with other Byzantine nodes
  • Any computationally feasible deception

RELEVANCE TO BLOCKCHAINS:
  In a permissionless network, any node may be:
  • An attacker running modified software
  • A compromised server
  • A colluding mining pool / validator cartel
  
  Blockchains must reach consensus (agree on a canonical transaction history)
  in the presence of these Byzantine participants.

BFT-DESIGNED CONSENSUS MECHANISMS:
  • PBFT (Practical BFT, Castro & Liskov 1999) — first practical BFT protocol
  • Tendermint — PBFT variant with chain-specific adaptations (Cosmos)
  • HotStuff — linear-complexity BFT (LibraBFT, Diem, Aptos, Flow)
  • Casper FFG — BFT finality layer over PoS (Ethereum)
  • Hotstuff-based: DiemBFT, Jolteon, Bullshark

  NOTE: PoW (Nakamoto) is NOT BFT in the traditional sense — it tolerates
  Byzantine behavior through economic incentives + probabilistic agreement,
  not through a provable agreement protocol.`,
  },
  {
    id:"P2", diff:"Foundational", color:T.em,
    problem:"Create a detailed comparison table of Proof-of-Work, Proof-of-Stake, and BFT-style consensus across the following dimensions: (a) security assumption, (b) finality type, (c) energy use, (d) decentralization tendency, (e) attack cost model, (f) liveness under partition.",
    answer:`CONSENSUS MECHANISM COMPARISON

┌──────────────────────┬───────────────────────────┬──────────────────────────┬──────────────────────────┐
│ Dimension            │ Proof-of-Work (PoW)        │ Proof-of-Stake (PoS)     │ BFT-style (PBFT/Tendermint)│
├──────────────────────┼───────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Security assumption  │ >50% honest hashrate       │ >2/3 stake honest        │ >2/3 validators honest   │
│                      │ (computational work)       │ (economic stake)         │ (n ≥ 3f+1)               │
├──────────────────────┼───────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Finality type        │ Probabilistic — grows      │ Can be deterministic     │ Deterministic — single   │
│                      │ with each confirmation,    │ (Casper FFG ~12.8 min)   │ round = final, provably  │
│                      │ never absolute             │ or probabilistic (LMD)   │ irreversible             │
├──────────────────────┼───────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Energy use           │ Extremely high (~150 TWh/  │ ~99.95% less than PoW    │ Negligible — only compute│
│                      │ yr for Bitcoin; equivalent │ (Ethereum: ~0.01 TWh/yr) │ for signing + hashing    │
│                      │ to medium-sized country)   │                          │ messages                 │
├──────────────────────┼───────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Decentralization     │ High at protocol level but │ Moderate — stake tends   │ Low — fixed validator set│
│                      │ mining pool centralization │ to concentrate; but open │ must be known in advance;│
│                      │ is an empirical concern    │ participation possible   │ permissioned by default  │
├──────────────────────┼───────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Attack cost model    │ Must acquire >50% of       │ Must acquire >33% of     │ Must corrupt >33% of     │
│                      │ physical hashrate (CAPEX + │ total staked value       │ known validators         │
│                      │ OPEX ongoing energy cost)  │ (recoverable if benign;  │ (typically easier once   │
│                      │ Attack is external         │ destroyed by slashing)   │ validators are known)    │
├──────────────────────┼───────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Liveness under       │ PRESERVED — both sides     │ Depends on implementation│ SACRIFICED — protocol    │
│ partition            │ keep mining; fork resolves │ Casper: may sacrifice    │ halts if quorum not      │
│                      │ when partition heals (AP)  │ liveness for safety      │ reachable (CP system)    │
└──────────────────────┴───────────────────────────┴──────────────────────────┴──────────────────────────┘

KEY TAKEAWAYS:
  • PoW: battle-tested, energy-intensive, probabilistic — best for permissionless open networks
  • PoS: energy-efficient, can achieve deterministic finality, still maturing — best for open
         networks willing to accept economic security model and slashing complexity
  • BFT: instant finality, known validator sets, doesn't scale beyond ~200 validators —
         best for consortium/permissioned chains or as a finality layer on top of PoS`,
  },
  {
    id:"P3", diff:"Intermediate", color:T.amber,
    problem:"A PoW chain targets 10-minute blocks. An attacker secretly mines an alternative chain with 35% of total hashrate (the honest network has 65%). Using Nakamoto's formula, calculate the probability of a successful double-spend at confirmation depths k=1, 3, 6, and 12. At what depth does the risk fall below 1%? Below 0.1%?",
    answer:`NAKAMOTO DOUBLE-SPEND PROBABILITY

Given: q = 0.35 (attacker), p = 0.65 (honest), q/p = 0.5385

Formula (from Bitcoin whitepaper §11):
  P(k) ≈ (q/p)^k   when q < p and attacker starts from 0 blocks behind

CALCULATIONS:

  k=1:   (0.35/0.65)^1 = 0.5385^1 = 53.85%   ← More likely than not!
  k=3:   (0.5385)^3    = 0.1562    = 15.62%
  k=6:   (0.5385)^6    = 0.02440   =  2.44%
  k=10:  (0.5385)^10   = 0.002488  =  0.25%
  k=12:  (0.5385)^12   = 0.000721  =  0.072%

Below 1%:  Need (0.5385)^k < 0.01
           k > log(0.01)/log(0.5385) = -2/(-0.2686) ≈ 8.6 → k = 9 confirmations

Below 0.1%: k > log(0.001)/log(0.5385) = -3/(-0.2686) ≈ 11.2 → k = 12 confirmations

COMPARISON: Honest majority attacker (q=0.10):
  k=6:  (0.1111)^6 ≈ 0.000214 = 0.021%   ← Safe at 6 confs
  k=1:  0.111 = 11.1%                     ← Still risky at 1 conf!

PRACTICAL IMPLICATIONS:
  • A 35% attacker is EXTREMELY dangerous — not even 6 confirmations gives <5% risk.
  • Standard Bitcoin "6 confirmations" was designed assuming attackers have <10% hashrate.
  • For high-value transfers (>$1M) vs a suspected 35% attacker:
    - Need ~9-12 confirmations (~90-120 minutes) to bring risk below 1-0.1%
  • This is why major exchanges require 3-6 confs for BTC but exchanges
    that were historically attacked (ETC, BSV) now require 100-5000 confs.

NOTE: This formula assumes the attacker starts mining from the same height as
the honest chain. If the attacker pre-mines a secret chain BEFORE broadcasting
the spend transaction, the probability is modeled by Poisson distribution of
the "gap" and is generally slightly higher.`,
  },
  {
    id:"P4", diff:"Intermediate", color:T.amber,
    problem:"Explain the 'long-range attack' specific to Proof-of-Stake. Why can't this attack be executed against Proof-of-Work? What are the two primary defenses PoS systems use, and what tradeoffs do they introduce?",
    answer:`LONG-RANGE ATTACK IN PROOF-OF-STAKE

DEFINITION:
  An attacker who held a large amount of stake at some past point in time
  uses those (now possibly sold/transferred) historical keys to re-mine
  the entire chain history from that fork point, creating a longer alternative
  chain that looks valid by stake-weighting rules.

WHY THIS IS UNIQUE TO PoS:
  In PoS, "signing a block" costs essentially nothing computationally.
  An attacker with old keys can sign millions of blocks at zero marginal cost,
  potentially constructing a completely different history from the genesis block.

WHY PoW IS IMMUNE:
  In PoW, creating valid blocks requires performing real SHA-256 work.
  Rewriting k blocks of history requires re-expending all that energy.
  There is no "old work" that can be reused — the computational cost is
  intrinsic and unavoidable for every block, making long-range rewriting
  economically prohibitive.

  PoW's computational immutability is physical, not logical.

THREE ATTACK VARIANTS:
  1. Simple attack: Use old large-stake keys to fork from genesis
  2. Posterior corruption: Buy old keys from former validators cheaply
     (they have no current stake to lose), then fork
  3. Stake-bleeding: Gradually bias the random validator selection
     on the alternative chain to earn disproportionate rewards

DEFENSE 1 — WEAK SUBJECTIVITY CHECKPOINTS
  Mechanism: Nodes must sync from a checkpoint within a "weak subjectivity
  period" (e.g., 2 weeks for Ethereum). Nodes reject forks older than
  this window without subjective trust in the checkpoint source.
  
  Tradeoff: New nodes must obtain a recent checkpoint from a trusted source
  (bootstrapping problem). Not fully trustless for nodes that have been
  offline longer than the subjectivity window. Violates Bitcoin's
  "sync from genesis without trust" property.

DEFENSE 2 — SLASHING + KEY EVOLUTION
  Mechanism: Private keys evolve forward (forward-secure signatures).
  Old keys literally cannot sign new messages — cryptographically,
  they are deleted/evolved past. Even if an attacker recovers old keys,
  they cannot forge new signatures.
  
  Tradeoff: Key management complexity increases significantly.
  Validators must maintain operational security of evolving key state.
  Software complexity increases → larger attack surface.

ETHEREUM'S APPROACH:
  Combines: weak subjectivity checkpoints + Casper FFG finality (2 epochs)
  Once finalized, reverting requires provably slashing >1/3 of all validators.
  Long-range attacks against finalized checkpoints would require
  coordination of >1/3 validators AND detection evasion — practically infeasible.`,
  },
  {
    id:"P5", diff:"Advanced", color:T.red,
    problem:"Design a consensus protocol for a 100-validator permissioned blockchain that must achieve: (1) sub-second block finality, (2) tolerance of up to 30 Byzantine validators, (3) horizontal throughput scaling. Describe the protocol phases, message complexity, liveness conditions, and any tradeoffs you must accept.",
    answer:`PROTOCOL DESIGN: HotStuff-BFT Variant for n=100, f=30

PARAMETERS:
  n = 100 validators, f = 30 Byzantine (≤ n/3 - 1 = 32), honest ≥ 70
  Quorum size Q = 2f+1 = 61 (BLS threshold signature)
  Block time target: <500ms
  Safety threshold: requires 61/100 honest signatures (BFT-safe)

PROTOCOL PHASES (3-phase Linear HotStuff):

  ┌─────────────────────────────────────────────────────────────────────┐
  │ PREPARE PHASE                                                       │
  │   Leader (round-robin) proposes block B with prepareQC from prev   │
  │   All 100 validators send signed PREPARE votes to leader           │
  │   Leader waits for 61 votes → forms prepareQC (BLS aggregate)      │
  │                                                                     │
  │ PRE-COMMIT PHASE                                                    │
  │   Leader broadcasts prepareQC                                       │
  │   Validators send PRE-COMMIT votes if prepareQC is valid           │
  │   Leader waits for 61 votes → forms precommitQC                    │
  │                                                                     │
  │ COMMIT PHASE                                                        │
  │   Leader broadcasts precommitQC                                     │
  │   Validators send COMMIT votes                                      │
  │   Leader waits for 61 votes → forms commitQC                       │
  │   Block is FINALIZED — broadcast commitQC                          │
  └─────────────────────────────────────────────────────────────────────┘

MESSAGE COMPLEXITY ANALYSIS:
  Naive PBFT:   O(n²) per phase = 100² × 3 = 30,000 messages/block
  HotStuff:     O(n)  per phase = 100 × 3 = 300 messages/block
  
  Mechanism: BLS threshold signatures allow leader to aggregate 61 votes
  into a SINGLE 48-byte signature. All other nodes verify in O(1).
  Net: 100 msgs (validators → leader) + 1 broadcast = O(n) per phase

TIMING ANALYSIS (targeting <500ms finality):
  Network RTT (LAN/fast WAN): ~20ms
  BLS signature aggregation: ~5ms
  Block execution (100 simple txs): ~10ms
  Phase timing:
    PREPARE:     20ms (broadcast) + 20ms (collect 61 votes) = 40ms
    PRE-COMMIT:  20ms + 20ms = 40ms
    COMMIT:      20ms + 20ms = 40ms
  Total: ~120ms + safety margin = ~200ms per block ✓

LIVENESS CONDITIONS:
  Safety holds ALWAYS as long as ≤f validators Byzantine
  Liveness holds when:
    1. Leader is honest (enforced by timeout + round-robin rotation)
    2. Network delivers messages within timeout Δ
    3. ≥ Q honest validators online and responsive
  
  Synchrony assumption: GST model — after Global Stabilization Time,
  message delays bounded by Δ. Protocol halts during severe partition,
  resumes when partition heals.

  View-change (liveness recovery): if leader fails to produce block
  within timeout T_view (e.g., 2s), validators broadcast NEW-VIEW
  messages with their highest QC. New leader collects 2f+1 NEW-VIEW
  msgs → advances to next view with highest prepareQC.

HORIZONTAL SCALING SOLUTION:
  Sharding: Divide validator set into 5 shards of 20 each
  (tolerate 6 Byzantine per shard, n=20, f=6: n ≥ 3f+1 = 19 ✓)
  
  Each shard runs independent HotStuff for its transaction subset
  Cross-shard: atomic commit protocol (2PC with shard committee leaders)
  
  Throughput: 5× parallel chains → 5× TPS
  Tradeoff: Cross-shard transactions have 2× latency (~400ms)

TRADEOFFS ACCEPTED:
  1. Permissioned: validator set must be known → no open participation
  2. Liveness sacrificed during partition (CP not AP)
  3. Leader bottleneck: single leader per round → DDoS target
     (mitigated by threshold relay, leader rotation randomization)
  4. Weak subjectivity: new nodes must trust a checkpoint
  5. BLS dependency: cryptographic assumption on pairing-friendly curves`,
  },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function nakamotoProb(q, k) {
  if (q <= 0) return 0;
  if (q >= 0.5) return 1;
  return Math.pow(q / (1 - q), k);
}

function bftCanReach(n, f) {
  const quorum = Math.floor((2 * n) / 3) + 1;
  const honest = n - f;
  return { quorum, honest, ok: honest >= quorum, ratio: f / n };
}

// ─── SECTION: INTRO ───────────────────────────────────────────────────────────
const IntroSection = () => (
  <div style={{animation:"fadeUp 0.4s ease"}}>
    <SecLabel>§1 — Chapter Overview</SecLabel>
    <H2>Consensus Mechanisms & Finality Models</H2>
    <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,letterSpacing:"0.1em",
      marginBottom:22}}>ACM Educational Series · Distributed Systems Track · Chapter 4</div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,margin:"18px 0"}}>
      {[
        {icon:"⚔",t:"Safety vs Liveness",s:"What breaks, what holds"},
        {icon:"⚙",t:"PoW / PoS / BFT",s:"Tradeoffs compared"},
        {icon:"🏁",t:"Finality Models",s:"Probabilistic vs deterministic"},
        {icon:"🌐",t:"Adversarial Nets",s:"Attacks & partitions"},
        {icon:"🔬",t:"Interactive Lab",s:"Simulate consensus live"},
      ].map(c=>(
        <div key={c.t} style={{background:T.bg2,border:`1px solid ${T.border}`,
          borderRadius:6,padding:"14px 12px",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:8}}>{c.icon}</div>
          <div style={{fontFamily:T.mono,fontSize:10,color:T.em,fontWeight:700,marginBottom:4}}>{c.t}</div>
          <div style={{fontFamily:T.body,fontSize:11,color:T.textMuted,lineHeight:1.5}}>{c.s}</div>
        </div>
      ))}
    </div>

    <Body>
      Consensus is the hardest problem in distributed systems. Given a set of
      nodes that cannot trust each other, communicate over unreliable networks,
      and may actively try to subvert the protocol — how do you get them to
      agree on <em>anything</em>? This chapter answers that question
      with the rigor it demands.
    </Body>
    <Body>
      We start with the theoretical limits (FLP, CAP), dissect the three major
      consensus families used in production blockchains, and end with a live
      lab where you observe — first-hand — how consensus breaks under latency
      and adversarial conditions.
    </Body>

    <InfoBox title="The Core Question" icon="⚔" color={T.amber}>
      A blockchain is ultimately a replicated state machine. Every node must
      execute the same transactions in the same order. Consensus is the protocol
      that enforces this ordering — in the presence of crashes, network splits,
      and active attackers who profit from causing disagreement.
    </InfoBox>

    <HR/>
    <H3 color={T.amber}>The Byzantine Generals Problem</H3>
    <Body>
      Lamport, Shostak & Pease (1982) formalized the problem: N generals must
      coordinate an attack. Some are <strong style={{color:T.red}}>traitors</strong> who
      send conflicting orders. The honest generals must still reach the same decision.
    </Body>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,margin:"14px 0"}}>
      {[
        {g:"AGREEMENT",c:T.em,d:"All honest nodes decide the same value"},
        {g:"VALIDITY",c:T.amber,d:"If all honest nodes propose v, they decide v"},
        {g:"TERMINATION",c:T.indigo,d:"Every honest node eventually decides"},
      ].map(p=>(
        <div key={p.g} style={{background:T.bg2,border:`1px solid ${p.c}22`,
          borderTop:`2px solid ${p.c}`,borderRadius:5,padding:"12px 13px"}}>
          <div style={{fontFamily:T.mono,fontSize:10,color:p.c,fontWeight:700,marginBottom:6}}>{p.g}</div>
          <div style={{fontFamily:T.body,fontSize:13,color:T.text,lineHeight:1.55}}>{p.d}</div>
        </div>
      ))}
    </div>
    <Code title="The fundamental impossibility">{`# FLP Impossibility (Fischer, Lynch, Paterson 1985):
# In a purely asynchronous network with even 1 crash failure:
# → No deterministic algorithm can guarantee BOTH safety AND liveness.
#
# CAP Theorem (Brewer 2000, proven by Gilbert & Lynch 2002):
# A distributed system can provide at most 2 of 3:
#   C — Consistency   (all nodes see same data)
#   A — Availability  (every request gets a response)
#   P — Partition tol (works despite network splits)
#
# Real blockchains resolve this via partial synchrony (Dwork et al 1988):
#   → Safety holds ALWAYS (even during async/partition)
#   → Liveness holds once network stabilizes (GST assumption)`}
    </Code>
  </div>
);

// ─── SECTION: SAFETY vs LIVENESS ─────────────────────────────────────────────
const SafetySection = () => {
  const [scenario, setScenario] = useState("normal");

  const scenarios = {
    normal: {
      label:"Normal Operation", color:T.em,
      bft:{safety:"✓ Holds",liveness:"✓ Holds",note:"Quorum of 2f+1 honest nodes can vote and finalize blocks normally."},
      pow:{safety:"✓ Holds",liveness:"✓ Holds",note:"Honest majority mines the canonical chain; all nodes converge."},
    },
    partition: {
      label:"Network Partition (50/50 split)", color:T.amber,
      bft:{safety:"✓ Holds (halts)",liveness:"✗ Violated",note:"Neither partition can form a 2f+1 quorum → protocol halts. No block finalized. Resumes when partition heals."},
      pow:{safety:"✗ Temporarily violated",liveness:"✓ Holds",note:"Both partitions keep mining → temporary fork. Resolves via longest-chain when partition heals. Short-conf txs double-spend risk."},
    },
    byzantine: {
      label:"f Byzantine Nodes (f < n/3)", color:T.amber,
      bft:{safety:"✓ Holds",liveness:"✓ Holds",note:"BFT protocol designed for exactly this — tolerates f < n/3 arbitrary faults."},
      pow:{safety:"✓ Holds (probabilistically)",liveness:"✓ Holds",note:"Byzantine nodes can mine invalid blocks (rejected by honest nodes) or withhold blocks, but cannot override honest majority hashrate."},
    },
    attack51: {
      label:"51% Attack / f ≥ n/3 Byzantine", color:T.red,
      bft:{safety:"✗ VIOLATED",liveness:"✗ VIOLATED",note:"With f ≥ n/3: adversary can form two conflicting quorums → equivocate, finalize two different chains. Both safety AND liveness broken."},
      pow:{safety:"✗ VIOLATED",liveness:"✓ Holds",note:"Attacker controls chain selection → can double-spend, reorder, censor. Liveness holds (chain advances) but safety is broken — two valid histories possible."},
    },
    eclipse: {
      label:"Eclipse Attack (node isolation)", color:T.red,
      bft:{safety:"✓ Holds (network-wide)",liveness:"✓ Holds (network-wide)",note:"Eclipsed nodes are cut off and see stale state, but global consensus continues. Eclipsed node can be fed a fake chain."},
      pow:{safety:"✓ Holds (global chain)",liveness:"✓ Holds",note:"Eclipsed miner wastes hashrate on a fake chain (fed by attacker). Depletes honest hashrate without global safety impact, but enables targeted double-spends against eclipsed node."},
    },
  };

  const s = scenarios[scenario];

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§2 — Theoretical Foundations</SecLabel>
      <H2>Safety vs Liveness: What Can Break</H2>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"16px 0"}}>
        <div style={{background:T.bg2,border:`1px solid ${T.em}33`,
          borderTop:`2px solid ${T.em}`,borderRadius:5,padding:"14px 16px"}}>
          <div style={{fontFamily:T.disp,fontSize:18,color:T.em,fontWeight:700,marginBottom:8}}>
            SAFETY
          </div>
          <div style={{fontFamily:T.body,fontStyle:"italic",fontSize:14,color:T.sky,marginBottom:8}}>
            "Nothing bad ever happens"
          </div>
          <div style={{fontFamily:T.body,fontSize:14,color:T.text,lineHeight:1.7}}>
            No two honest nodes finalize different blocks at the same height.
            The ledger is consistent — there is exactly one canonical history.
          </div>
          <div style={{fontFamily:T.mono,fontSize:11,color:T.em,marginTop:10,
            background:"#020704",padding:"8px 10px",borderRadius:3}}>
            Violated by: 51% attacks, f ≥ n/3 Byzantine, long-range attacks
          </div>
        </div>
        <div style={{background:T.bg2,border:`1px solid ${T.amber}33`,
          borderTop:`2px solid ${T.amber}`,borderRadius:5,padding:"14px 16px"}}>
          <div style={{fontFamily:T.disp,fontSize:18,color:T.amber,fontWeight:700,marginBottom:8}}>
            LIVENESS
          </div>
          <div style={{fontFamily:T.body,fontStyle:"italic",fontSize:14,color:T.sky,marginBottom:8}}>
            "Something good eventually happens"
          </div>
          <div style={{fontFamily:T.body,fontSize:14,color:T.text,lineHeight:1.7}}>
            Every valid transaction eventually gets included in a finalized block.
            The chain keeps making progress — it never permanently stalls.
          </div>
          <div style={{fontFamily:T.mono,fontSize:11,color:T.amber,marginTop:10,
            background:"#020704",padding:"8px 10px",borderRadius:3}}>
            Violated by: network partitions, BFT without quorum, censorship attacks
          </div>
        </div>
      </div>

      <H3 color={T.amber}>The Fundamental Tradeoff: CAP Theorem</H3>
      <Body>
        Under a network partition, you must choose: keep all nodes <strong style={{color:T.em}}>consistent</strong> (refuse
        to serve requests until partition heals) or keep all nodes <strong style={{color:T.amber}}>available</strong> (serve
        requests that may diverge). You cannot do both.
      </Body>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"14px 0"}}>
        {[
          {label:"Bitcoin / PoW blockchains",type:"AP — Available + Partition-tolerant",
           color:T.amber,icon:"⛏",
           desc:"Keeps producing blocks during partition. Both sides mine their own chain. Sacrifices Consistency temporarily. Fork resolves when partition heals."},
          {label:"PBFT / Tendermint / HotStuff",type:"CP — Consistent + Partition-tolerant",
           color:T.indigo,icon:"🏛",
           desc:"Halts if quorum unavailable. Never finalizes two different values. Sacrifices Availability. Resumes immediately when quorum reconnects."},
        ].map(p=>(
          <div key={p.label} style={{background:T.bg2,border:`1px solid ${p.color}30`,
            borderLeft:`3px solid ${p.color}`,borderRadius:5,padding:"12px 14px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:18}}>{p.icon}</span>
              <div>
                <div style={{fontFamily:T.mono,fontSize:10,color:p.color,fontWeight:700}}>{p.label}</div>
                <Tag color={p.color}>{p.type}</Tag>
              </div>
            </div>
            <div style={{fontFamily:T.body,fontSize:13,color:T.text,lineHeight:1.6}}>{p.desc}</div>
          </div>
        ))}
      </div>

      <HR/>
      <H3 color={T.red}>Interactive: Scenario Analysis</H3>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,
        padding:"18px 20px",margin:"12px 0"}}>
        <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:10}}>
          SELECT A NETWORK SCENARIO
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
          {Object.entries(scenarios).map(([k,v])=>(
            <button key={k} onClick={()=>setScenario(k)}
              style={{padding:"6px 13px",border:`1px solid ${scenario===k?v.color:T.border}`,
                borderRadius:4,background:scenario===k?`${v.color}18`:T.bg3,
                color:scenario===k?v.color:T.textMuted,
                fontFamily:T.mono,fontSize:10,cursor:"pointer",transition:"all 0.15s"}}>
              {v.label}
            </button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{key:"bft",label:"BFT-style (Tendermint/PBFT)",icon:"🏛"},{key:"pow",label:"PoW (Bitcoin/Nakamoto)",icon:"⛏"}].map(m=>{
            const data = s[m.key];
            const safetyOk = data.safety.startsWith("✓");
            const livenessOk = data.liveness.startsWith("✓");
            return (
              <div key={m.key} style={{background:T.bg3,border:`1px solid ${T.border}`,
                borderRadius:5,padding:"14px 16px",animation:"fadeIn 0.3s ease"}}>
                <div style={{fontFamily:T.mono,fontSize:11,color:T.textBright,
                  fontWeight:700,marginBottom:12}}>
                  {m.icon} {m.label}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div style={{background:safetyOk?T.emFaint:T.redFaint,
                    border:`1px solid ${safetyOk?T.em:T.red}44`,
                    borderRadius:4,padding:"8px 10px"}}>
                    <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:3}}>SAFETY</div>
                    <div style={{fontFamily:T.mono,fontSize:11,
                      color:safetyOk?T.em:T.red,fontWeight:700}}>{data.safety}</div>
                  </div>
                  <div style={{background:livenessOk?T.emFaint:T.redFaint,
                    border:`1px solid ${livenessOk?T.em:T.red}44`,
                    borderRadius:4,padding:"8px 10px"}}>
                    <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:3}}>LIVENESS</div>
                    <div style={{fontFamily:T.mono,fontSize:11,
                      color:livenessOk?T.em:T.red,fontWeight:700}}>{data.liveness}</div>
                  </div>
                </div>
                <div style={{fontFamily:T.body,fontSize:13,color:T.text,lineHeight:1.65}}>
                  {data.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── SECTION: CONSENSUS TYPES ─────────────────────────────────────────────────
const ConsensusSection = () => {
  const [activeTab, setActiveTab] = useState("pow");
  const tabs = [
    {id:"pow",   label:"⛏  Proof-of-Work",    color:T.amber},
    {id:"pos",   label:"♦  Proof-of-Stake",   color:T.indigo},
    {id:"bft",   label:"🏛  BFT-style",        color:T.sky},
    {id:"compare",label:"⇄  Comparison",      color:T.em},
  ];

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§3 — Consensus Families</SecLabel>
      <H2>PoW, PoS, and BFT-Style Consensus</H2>

      <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:6,
        overflow:"hidden",margin:"16px 0 0"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{flex:1,padding:"10px 4px",border:"none",cursor:"pointer",
              background:activeTab===t.id?T.bg3:T.bg2,
              color:activeTab===t.id?t.color:T.textMuted,
              fontFamily:T.mono,fontSize:10,letterSpacing:"0.04em",
              borderBottom:`2px solid ${activeTab===t.id?t.color:"transparent"}`,
              transition:"all 0.15s"}}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderTop:"none",
        borderRadius:"0 0 6px 6px",padding:"20px",animation:"fadeIn 0.25s ease"}}>

        {activeTab==="pow" && (
          <>
            <H3 color={T.amber}>Proof-of-Work: Nakamoto Consensus</H3>
            <Body>
              Miners compete to find a nonce such that <code style={{fontFamily:T.mono,color:T.em,fontSize:13}}>hash(header||nonce) ≤ target</code>.
              The probability of finding a valid nonce is proportional to hashrate expended.
              The longest valid chain (most cumulative work) wins — no voting required.
            </Body>
            <Code title="Nakamoto Consensus — The Core Invariant">{`# FORK CHOICE RULE (Bitcoin):
# Always follow the chain with the most cumulative proof-of-work.
# "Longest chain" is a simplification — technically MOST WORK.

def nakamoto_fork_choice(chain_a, chain_b):
    work_a = sum(2**256 / block.target for block in chain_a)
    work_b = sum(2**256 / block.target for block in chain_b)
    return chain_a if work_a >= work_b else chain_b

# SECURITY ASSUMPTION:
# Attacker cannot produce more work than honest network → needs >50% hashrate.
# Game-theoretic incentive: mining the honest chain is MORE PROFITABLE
# than attacking it (block rewards + fees outweigh attack cost).

# FINALITY: Probabilistic
# P(successful reorg after k blocks | q < 0.5) ≈ (q/p)^k
# At q=0.1, k=6: probability ≈ 0.021%  ← "Safe" for most uses
# At q=0.3, k=6: probability ≈ 0.6%    ← Risky for large sums`}
            </Code>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
              {[
                {label:"✦ Strengths",color:T.em,items:["Permissionless — any hardware can participate","Battle-tested (Bitcoin: 15+ years, $0 successful double-spend)","Sybil resistance via physical resource cost","No validator set — decentralized by design"]},
                {label:"⚠ Weaknesses",color:T.red,items:["Enormous energy waste (~150 TWh/yr Bitcoin)","Mining pool centralization (~4 pools > 50% hashrate)","Probabilistic finality only (~60 min for high value)","ASIC arms race disadvantages small miners"]},
              ].map(p=>(
                <div key={p.label} style={{background:T.bg3,border:`1px solid ${p.color}28`,
                  borderTop:`2px solid ${p.color}`,borderRadius:5,padding:"12px 14px"}}>
                  <div style={{fontFamily:T.mono,fontSize:10,color:p.color,fontWeight:700,marginBottom:8}}>{p.label}</div>
                  {p.items.map((v,i)=>(
                    <div key={i} style={{fontFamily:T.body,fontSize:13,color:T.text,
                      marginBottom:5,display:"flex",gap:8}}>
                      <span style={{color:p.color}}>•</span>{v}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab==="pos" && (
          <>
            <H3 color={T.indigo}>Proof-of-Stake: Economic Security</H3>
            <Body>
              Validators lock up (<em>stake</em>) cryptocurrency as collateral. They are randomly
              selected to propose and attest to blocks proportional to their stake.
              Misbehavior is punished by <strong style={{color:T.red}}>slashing</strong> — burning part or
              all of their stake. Security is economic, not physical.
            </Body>
            <Code title="PoS: Validator Selection + Slashing Conditions">{`# VALIDATOR SELECTION (simplified):
validator_weight = validator.staked_eth / total_staked_eth
# Selected proportionally — 32 ETH → ~1/total_validators probability

# ETHEREUM SLASHING CONDITIONS (Casper FFG):
# 1. EQUIVOCATION: signing two different blocks at same slot
if len([v for v in validator.signatures if v.slot == s]) > 1:
    slash(validator, penalty=validator.balance)  # full slash

# 2. SURROUND VOTE: signing a vote that surrounds a prior finalized checkpoint
if vote.source.epoch < prev_vote.source.epoch and \
   vote.target.epoch > prev_vote.target.epoch:
    slash(validator, penalty=validator.balance)

# NOTHING-AT-STAKE PROBLEM (naive PoS):
# Without slashing, rational validators sign ALL forks — no cost!
# Slashing SOLVES this: signing multiple forks = provable slashable offense
# Economic deterrent: 32 ETH stake at risk (~$50,000+)

# FINALITY (Ethereum Casper FFG):
# Two consecutive "justified" checkpoints → first is FINALIZED
# Reverting finalized block requires slashing >1/3 of all staked ETH
# (~$30B+ at current prices → economic finality)`}
            </Code>
            <InfoBox title="The Nothing-at-Stake Problem" icon="◈" color={T.indigo}>
              In naive PoS, signing a block costs nothing computationally. A rational validator
              should sign <em>every fork</em> to maximize rewards. This prevents consensus from ever
              resolving. Slashing makes equivocation costly: the validator loses their
              entire bonded deposit. Modern PoS systems (Ethereum, Cosmos, Polkadot) all implement slashing.
            </InfoBox>
          </>
        )}

        {activeTab==="bft" && (
          <>
            <H3 color={T.sky}>BFT-Style: Practical Byzantine Fault Tolerance</H3>
            <Body>
              BFT protocols replace probabilistic agreement with deterministic rounds.
              A <strong style={{color:T.sky}}>leader</strong> proposes, validators vote in structured phases,
              and a block is <strong style={{color:T.sky}}>immediately final</strong> once 2f+1 validators commit.
              No forks — ever.
            </Body>
            <Code title="PBFT Three-Phase Protocol">{`# PBFT (Castro & Liskov 1999) — Three phases per block:
# n = total replicas, f = faulty, n ≥ 3f+1, quorum Q = 2f+1

# PHASE 1 — PRE-PREPARE (leader → all):
leader.broadcast(PRE_PREPARE, view=v, seq=n, block=B, sig=leader_sig)

# PHASE 2 — PREPARE (all → all):  ← O(n²) messages HERE
for node in honest_nodes:
    node.broadcast(PREPARE, view=v, seq=n, block_hash=H(B), sig=node_sig)
    # Node accepts if it received 2f+1 PREPARE msgs for same (v, n, H(B))

# PHASE 3 — COMMIT (all → all):   ← O(n²) messages HERE
for node in honest_nodes:
    node.broadcast(COMMIT, view=v, seq=n, block_hash=H(B), sig=node_sig)
    # Node FINALIZES if it received 2f+1 COMMIT msgs for same (v, n, H(B))
    # Finalization is IMMEDIATE and IRREVERSIBLE

# HOTSTUFF IMPROVEMENT (O(n) via BLS threshold signatures):
# Leader aggregates 2f+1 votes into ONE QuorumCertificate (QC)
# QC = BLS_aggregate(sigs)  ← single 48-byte signature
# Broadcast QC instead of n individual votes → O(n) total messages`}
            </Code>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"12px 0"}}>
              {[
                {l:"n ≥ 3f+1",c:T.sky,d:"Minimum validator count to tolerate f Byzantine faults"},
                {l:"Quorum = 2f+1",c:T.em,d:"Minimum votes needed to finalize any decision"},
                {l:"O(n) HotStuff",c:T.indigo,d:"Linear message complexity via BLS aggregation"},
              ].map(p=>(
                <div key={p.l} style={{background:T.bg3,border:`1px solid ${p.c}28`,
                  borderRadius:4,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontFamily:T.disp,fontSize:18,color:p.c,fontWeight:700,marginBottom:4}}>{p.l}</div>
                  <div style={{fontFamily:T.body,fontSize:12,color:T.text,lineHeight:1.5}}>{p.d}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab==="compare" && (
          <>
            <H3 color={T.em}>Side-by-Side Comparison</H3>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:T.body,fontSize:13}}>
                <thead>
                  <tr>
                    {["Property","⛏ PoW","♦ PoS","🏛 BFT"].map((h,i)=>(
                      <th key={h} style={{padding:"9px 10px",textAlign:"left",
                        fontFamily:T.mono,fontSize:10,color:[T.textMuted,T.amber,T.indigo,T.sky][i],
                        letterSpacing:"0.08em",borderBottom:`1px solid ${T.border}`,
                        background:T.bg3}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Security model","50% hashrate","33% stake","33% validators"],
                    ["Finality","Probabilistic","Deterministic (FFG)","Deterministic (1 round)"],
                    ["Time to finality","~60 min (Bitcoin)","~12.8 min (Ethereum)","~1-3 seconds"],
                    ["Energy use","Very High (150 TWh/yr)","Very Low (~0.01 TWh/yr)","Negligible"],
                    ["Validator set","Open (anyone w/ hardware)","Open (32+ ETH)","Permissioned"],
                    ["Max validators","Unlimited","~1M (Ethereum)","~100-200 practical"],
                    ["Throughput","~7 TPS (Bitcoin)","~100k TPS (theoretical)","~10k-100k TPS"],
                    ["Message complexity","O(1) (no voting rounds)","O(n) (attestations)","O(n) HotStuff / O(n²) PBFT"],
                    ["Long-range attacks","Immune (PoW cost)","Vulnerable (needs WSC)","Immune (known validators)"],
                    ["Fork behavior","Expected (frequent)","Rare (slashing deterrent)","Never (instant finality)"],
                  ].map((row,i)=>(
                    <tr key={row[0]} style={{background:i%2===0?T.bg2:T.bg3}}>
                      <td style={{padding:"8px 10px",fontFamily:T.mono,fontSize:10,
                        color:T.em,borderRight:`1px solid ${T.border}`,fontWeight:700}}>{row[0]}</td>
                      {row.slice(1).map((v,j)=>(
                        <td key={j} style={{padding:"8px 10px",color:T.text,
                          borderRight:j<2?`1px solid ${T.border}`:"none"}}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: FINALITY ────────────────────────────────────────────────────────
const FinalitySection = () => {
  const [q, setQ] = useState(0.10);
  const [activeTab, setActiveTab] = useState("prob");

  const kValues = [1,2,3,4,5,6,7,8,9,10,12,15,20];
  const probs = kValues.map(k => ({k, p: nakamotoProb(q, k)}));

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§4 — Finality Theory</SecLabel>
      <H2>Probabilistic vs Deterministic Finality</H2>

      <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:6,
        overflow:"hidden",margin:"16px 0 0"}}>
        {[["prob","Probabilistic (PoW)"],["det","Deterministic (BFT/PoS)"],["hybrid","Hybrid (Ethereum)"]].map(([id,l])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{flex:1,padding:"10px 5px",border:"none",cursor:"pointer",
              background:activeTab===id?T.bg3:T.bg2,
              color:activeTab===id?T.em:T.textMuted,
              fontFamily:T.mono,fontSize:10,
              borderBottom:`2px solid ${activeTab===id?T.em:"transparent"}`,
              transition:"all 0.15s"}}>{l}</button>
        ))}
      </div>

      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderTop:"none",
        borderRadius:"0 0 6px 6px",padding:"20px",animation:"fadeIn 0.25s ease"}}>

        {activeTab==="prob" && (
          <>
            <H3>Nakamoto Probabilistic Finality</H3>
            <Body>
              In PoW, a transaction is never <em>absolutely</em> final. Each new block
              on top of it makes reversal exponentially harder. The probability of a
              successful reorg decreases geometrically with confirmation depth.
            </Body>
            <Code title="Nakamoto (2008) §11 — Double-Spend Probability">{`# P(attacker successfully reverses transaction at depth k)
# q = attacker's fraction of hashrate (q < 0.5)
# p = honest fraction = 1 - q

P(q, k) ≈ (q/p)^k   [when attacker starts from same height]

# More precisely (Poisson model):
# P = 1 - Σ[i=0..k] (λ^i * e^(-λ) / i!) * (1 - (q/p)^(k-i))
# where λ = k * (q/p)  [expected attacker blocks]

# Example (q=0.30, p=0.70):
P(0.30, k=1)  = (0.30/0.70)^1  = 42.9%   ← DO NOT ACCEPT
P(0.30, k=3)  = (0.429)^3      =  7.8%   ← Still risky!
P(0.30, k=6)  = (0.429)^6      =  0.6%   ← Acceptable for small tx
P(0.30, k=10) = (0.429)^10     =  0.03%  ← Acceptable for large tx`}
            </Code>

            <H3 color={T.amber}>Interactive: Confirmation Depth Calculator</H3>
            <div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:6,
              padding:"16px 18px",margin:"12px 0"}}>
              <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:6}}>
                    ATTACKER HASHRATE: <span style={{color:T.amber}}>{(q*100).toFixed(0)}%</span>
                  </div>
                  <input type="range" min="1" max="49" value={Math.round(q*100)}
                    onChange={e=>setQ(Number(e.target.value)/100)}
                    style={{width:"100%",accentColor:T.amber}}/>
                  <div style={{display:"flex",justifyContent:"space-between",
                    fontFamily:T.mono,fontSize:9,color:T.textMuted,marginTop:4}}>
                    <span>1% (weak)</span><span>25% (serious)</span><span>49% (critical)</span>
                  </div>
                </div>
                <div style={{textAlign:"center",minWidth:120}}>
                  <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:4}}>
                    RISK AT 6 CONFS
                  </div>
                  <div style={{fontFamily:T.disp,fontSize:28,fontWeight:700,
                    color:nakamotoProb(q,6)<0.001?T.em:nakamotoProb(q,6)<0.01?T.amber:T.red}}>
                    {(nakamotoProb(q,6)*100).toFixed(3)}%
                  </div>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {probs.map(({k,p})=>{
                  const pct = p*100;
                  const barColor = pct < 0.01 ? T.em : pct < 0.5 ? T.amber : T.red;
                  const barW = Math.min(100, Math.max(0.5, pct*2));
                  return (
                    <div key={k} style={{display:"grid",gridTemplateColumns:"40px 1fr 100px",
                      gap:10,alignItems:"center"}}>
                      <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>k={k}</div>
                      <div style={{height:12,background:T.bg4,borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${barW}%`,
                          background:barColor,borderRadius:2,transition:"width 0.3s ease"}}/>
                      </div>
                      <div style={{fontFamily:T.mono,fontSize:10,
                        color:barColor,textAlign:"right"}}>
                        {pct < 0.0001 ? "<0.0001" : pct.toFixed(4)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab==="det" && (
          <>
            <H3>Deterministic Finality: BFT Guarantees</H3>
            <Body>
              In BFT-style consensus, once a block receives a <em>commit certificate</em>
              (2f+1 signed commit messages), it is <strong style={{color:T.sky}}>immediately and absolutely final</strong>.
              There is no probability involved — reverting would require violating the
              cryptographic assumptions of the signature scheme.
            </Body>
            <Code title="Why BFT finality is absolute">{`# After COMMIT phase with 2f+1 honest signatures:
def is_final(block, commit_certs, f):
    # Quorum = 2f+1 validators signed this commit certificate
    honest_signers = [v for v in commit_certs if is_honest(v)]
    return len(honest_signers) >= f + 1  # always True if n ≥ 3f+1

# KEY THEOREM (BFT safety):
# Two conflicting blocks B and B' cannot both be committed in the same view.
# PROOF: Both would need 2f+1 commit signatures. Total validators = n = 3f+1.
# Two quorums of 2f+1 overlap in at least 2(2f+1)-(3f+1) = f+1 nodes.
# ≥ 1 honest node signed both → contradicts "honest nodes never equivocate."
# Therefore: at most ONE block can be committed per view. □

# WHAT CAN GO WRONG:
# If f ≥ n/3 Byzantine validators COLLUDE:
#   They can vote for BOTH blocks in different quorums.
#   Two conflicting commits become possible → safety VIOLATED.
#   This is why n ≥ 3f+1 is a hard requirement, not a guideline.

# LIVENESS caveat:
# BFT can stall if quorum is unavailable (network partition, node failures).
# View-change / leader rotation protocols recover liveness once ≥2f+1 nodes online.`}
            </Code>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
              {[
                {t:"Safety guarantee",c:T.em,v:"Mathematically proven: two conflicting blocks cannot both get 2f+1 commits. No probability — it's a theorem."},
                {t:"Liveness condition",c:T.amber,v:"Requires ≥2f+1 honest nodes online AND synchronous network. Partition → halts. Partition heals → resumes immediately."},
              ].map(p=>(
                <div key={p.t} style={{background:T.bg3,border:`1px solid ${p.c}28`,
                  borderLeft:`3px solid ${p.c}`,borderRadius:4,padding:"11px 13px"}}>
                  <div style={{fontFamily:T.mono,fontSize:10,color:p.c,marginBottom:5}}>{p.t}</div>
                  <div style={{fontFamily:T.body,fontSize:13,color:T.text,lineHeight:1.65}}>{p.v}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab==="hybrid" && (
          <>
            <H3 color={T.indigo}>Ethereum's Hybrid: LMD-GHOST + Casper FFG</H3>
            <Body>
              Ethereum post-Merge uses a two-layer finality design: a fast fork-choice
              rule (LMD-GHOST) for liveness, overlaid with a BFT finality gadget (Casper FFG)
              for deterministic finality every two epochs (~12.8 minutes).
            </Body>
            <Code title="Ethereum Gasper: Two-Layer Finality">{`# LAYER 1 — LMD-GHOST (Latest Message Driven Greedy Heaviest Observed SubTree)
# Fork choice: at each fork, follow the branch with the most RECENT validator votes.
# "Latest message" prevents long-range attacks on recent history.
# Provides fast probabilistic finality (every 12 seconds).

# LAYER 2 — CASPER FFG (Friendly Finality Gadget)
# Every 32-slot epoch (~6.4 minutes), validators vote to JUSTIFY a checkpoint.
# Two consecutive JUSTIFIED checkpoints → the earlier one is FINALIZED.
# Timeline: ~12.8 minutes from block creation to deterministic finality.

# FINALITY ECONOMICS (accountable safety):
# Reverting a finalized checkpoint requires:
#   1. >1/3 of all staked ETH to equivocate (provably slashable)
#   2. ~$30B+ in ETH would be destroyed (as of 2024)
#   3. Protocol would detect and slash all equivocating validators automatically
# → Finality is "economically absolute" not just mathematically absolute

# INACTIVITY LEAK:
# If >1/3 validators go offline (liveness failure):
# Protocol slowly LEAKS their stake until offline validators drop below 1/3.
# Remaining 2/3 can then finalize again.
# Tradeoff: major outage → permanent loss of offline validators' stake.
# Design choice: prioritize eventual liveness over protecting negligent validators.`}
            </Code>
            <div style={{display:"flex",flexDirection:"column",gap:0,margin:"14px 0"}}>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:8}}>
                ETHEREUM FINALITY TIMELINE
              </div>
              {[
                {t:"Block proposed (slot 0)",c:T.textMuted,d:"12 seconds"},
                {t:"1 slot confirmation (probabilistic)",c:T.amber,d:"12 sec"},
                {t:"1 epoch checkpoint (32 slots)",c:T.indigo,d:"6.4 min"},
                {t:"First checkpoint JUSTIFIED",c:T.sky,d:"6.4 min"},
                {t:"Second consecutive checkpoint JUSTIFIED → FINALIZED",c:T.em,d:"12.8 min total"},
              ].map((s,i,arr)=>(
                <div key={i} style={{display:"flex",gap:10}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{width:10,height:10,borderRadius:"50%",
                      background:s.c,flexShrink:0,marginTop:2}}/>
                    {i<arr.length-1&&<div style={{width:1,height:22,background:T.border}}/>}
                  </div>
                  <div style={{paddingBottom:8}}>
                    <span style={{fontFamily:T.body,fontSize:13,color:T.text}}>{s.t}</span>
                    <span style={{fontFamily:T.mono,fontSize:10,color:s.c,marginLeft:10}}>
                      {s.d}
                    </span>
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

// ─── SECTION: INTERACTIVE LAB ─────────────────────────────────────────────────
const LabSection = () => {
  const [labTab, setLabTab] = useState("bft");

  // ── BFT TOLERANCE LAB ────────────────────────────────────────────────────
  const [bftN, setBftN] = useState(7);
  const [bftF, setBftF] = useState(2);
  const bftResult = useMemo(()=>bftCanReach(bftN,bftF),[bftN,bftF]);

  // ── CONSENSUS SIMULATION LAB ─────────────────────────────────────────────
  const SIM_PHASES = ["idle","pre-prepare","prepare","commit","finalized","failed"];
  const [simN, setSimN] = useState(7);
  const [simF, setSimF] = useState(2);
  const [simLatency, setSimLatency] = useState("normal");
  const [simPhase, setSimPhase] = useState("idle");
  const [simLog, setSimLog] = useState([]);
  const [simRunning, setSimRunning] = useState(false);
  const [simDecision, setSimDecision] = useState(null);
  const simTimeoutRef = useRef(null);

  const latencyMs = {normal:300, high:500, partition:700};
  const getNodeColor = (i)=>i<simF?T.red:T.em;

  const addLog = (msg,color=T.text)=>{
    setSimLog(l=>[...l,{msg,color,ts:Date.now()}]);
  };

  const runSimulation = useCallback(()=>{
    if(simRunning) return;
    const {ok, quorum, honest} = bftCanReach(simN, simF);
    const delay = latencyMs[simLatency];
    const extraLatency = simLatency==="partition"?1200:0;

    setSimRunning(true);
    setSimLog([]);
    setSimDecision(null);
    setSimPhase("idle");

    const sequence = [
      ["pre-prepare", `LEADER (node 0) broadcasts PRE-PREPARE for block B to all ${simN} validators`, T.sky, 0],
      ["prepare", `${simN} validators verify proposal. ${honest} honest + ${simF} Byzantine nodes vote PREPARE`, T.amber, delay],
      ["prepare-count", `Collecting PREPARE votes... need ${quorum} of ${simN}`, T.textMuted, delay*1.6],
      ["commit", ok ? `Quorum reached: ${quorum}/${simN} PREPARE votes collected. Broadcasting COMMIT phase` : `Only ${honest}/${simN} honest votes — insufficient quorum (need ${quorum}). Protocol halts.`, ok?T.em:T.red, delay*2.2+extraLatency],
      ["commit-count", ok ? `Collecting COMMIT votes... ${simF} Byzantine nodes may equivocate` : null, T.textMuted, delay*2.8],
      ["result", ok ? `✓ FINALIZED: ${quorum} COMMIT certificates collected. Block B is final — irreversible.` : null, T.em, delay*3.4],
    ];

    sequence.forEach(([phase, msg, color, t])=>{
      if(!msg) return;
      simTimeoutRef.current = setTimeout(()=>{
        setSimPhase(phase==="prepare-count"||phase==="commit-count"?"collect":phase);
        addLog(msg,color);
        if(phase==="result") { setSimDecision(ok?"success":"failure"); setSimRunning(false); setSimPhase(ok?"finalized":"failed"); }
        if(phase==="commit"&&!ok) { setSimDecision("failure"); setSimRunning(false); setSimPhase("failed"); }
      }, t);
    });
  },[simN,simF,simLatency,simRunning]);

  const resetSim = ()=>{
    if(simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    setSimRunning(false); setSimPhase("idle"); setSimLog([]); setSimDecision(null);
  };

  // ── NETWORK PARTITION LAB ────────────────────────────────────────────────
  const [partMode, setPartMode] = useState("consistent");
  const [partStep, setPartStep] = useState(0);
  const maxStep = 4;

  const partSteps = {
    consistent:[
      {label:"Normal: 6 nodes online",desc:"All 6 validators communicate freely. Both BFT and AP chains make normal progress.",g1:3,g2:3,state:"normal"},
      {label:"Partition detected",desc:"Network splits: Group A (3 nodes) and Group B (3 nodes) cannot communicate.",g1:3,g2:3,state:"partitioned"},
      {label:"CP system halts",desc:"BFT protocol: neither group can form a quorum of 2f+1=5. Both halts. No new blocks finalized.",g1:3,g2:3,state:"halted"},
      {label:"Partition heals",desc:"Network reconnects. Nodes reconcile state — they both had the same last finalized block.",g1:3,g2:3,state:"healing"},
      {label:"Consensus resumes",desc:"Single canonical chain continues from shared finalized checkpoint. No inconsistency.",g1:3,g2:3,state:"recovered"},
    ],
    available:[
      {label:"Normal: 6 nodes online",desc:"All 6 nodes communicate freely.",g1:3,g2:3,state:"normal"},
      {label:"Partition detected",desc:"Network splits: Group A and Group B isolated.",g1:3,g2:3,state:"partitioned"},
      {label:"AP system: both keep producing",desc:"PoW/AP chains: both groups keep mining. Group A mines block B5a, Group B mines block B5b — a fork!",g1:3,g2:3,state:"forked"},
      {label:"Partition heals",desc:"Network reconnects. Nodes see two competing chains of equal length.",g1:3,g2:3,state:"healing"},
      {label:"Fork resolves: one branch orphaned",desc:"Longest-chain rule: one branch wins. Transactions ONLY in the losing branch return to mempool.",g1:3,g2:3,state:"reorg"},
    ],
  };

  const ps = (partSteps[partMode]||[])[partStep]||partSteps[partMode][0];
  const psColor = ps.state==="normal"?T.em:ps.state==="partitioned"||ps.state==="forked"?T.amber:
    ps.state==="halted"||ps.state==="reorg"?T.red:ps.state==="recovered"||ps.state==="healing"?T.indigo:T.em;

  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§5 — Hands-On Laboratory</SecLabel>
      <H2>Simulate Consensus: Faults · Latency · Partition</H2>
      <Body>Three live experiments. All logic runs in your browser — no server required.</Body>

      <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:6,
        overflow:"hidden",margin:"16px 0 0"}}>
        {[["bft","Lab 1: BFT Tolerance"],["sim","Lab 2: Consensus Simulation"],["partition","Lab 3: Network Partition"]].map(([id,l])=>(
          <button key={id} onClick={()=>setLabTab(id)}
            style={{flex:1,padding:"11px 4px",border:"none",cursor:"pointer",
              background:labTab===id?T.bg3:T.bg2,
              color:labTab===id?T.em:T.textMuted,
              fontFamily:T.mono,fontSize:10,letterSpacing:"0.04em",
              borderBottom:`2px solid ${labTab===id?T.em:"transparent"}`,
              transition:"all 0.15s"}}>{l}</button>
        ))}
      </div>

      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderTop:"none",
        borderRadius:"0 0 6px 6px",padding:"20px",animation:"fadeIn 0.25s ease"}}>

        {/* ── LAB 1: BFT TOLERANCE ── */}
        {labTab==="bft" && (
          <>
            <div style={{fontFamily:T.mono,fontSize:10,color:T.em,letterSpacing:"0.1em",marginBottom:14}}>
              ▸ OBJECTIVE: Find the exact n and f values where BFT consensus breaks. Observe the n≥3f+1 threshold in action.
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
              {[
                {label:"Total Validators (n)",val:bftN,setVal:setBftN,min:3,max:21,color:T.em,step:1},
                {label:"Byzantine Faults (f)",val:bftF,setVal:setBftF,min:0,max:10,color:T.red,step:1},
              ].map(s=>(
                <div key={s.label}>
                  <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:6}}>
                    {s.label}: <span style={{color:s.color,fontWeight:700}}>{s.val}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} value={s.val}
                    onChange={e=>s.setVal(Number(e.target.value))}
                    style={{width:"100%",accentColor:s.color}}/>
                </div>
              ))}
            </div>

            {/* Node grid */}
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16,
              background:T.bg3,border:`1px solid ${T.border}`,borderRadius:6,padding:"14px"}}>
              {Array.from({length:bftN},(_,i)=>{
                const isByz = i<bftF;
                return (
                  <div key={i}
                    style={{width:40,height:40,borderRadius:"50%",
                      background:isByz?T.redFaint:T.emFaint,
                      border:`2px solid ${isByz?T.red:T.em}`,
                      display:"flex",flexDirection:"column",alignItems:"center",
                      justifyContent:"center",transition:"all 0.3s",
                      animation:isByz?"pulse 1.5s ease infinite":"none"}}>
                    <div style={{fontFamily:T.mono,fontSize:8,color:isByz?T.red:T.em,fontWeight:700}}>
                      N{i}
                    </div>
                    <div style={{fontFamily:T.mono,fontSize:7,color:isByz?T.red:T.textMuted}}>
                      {isByz?"BYZ":"OK"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Result */}
            <div style={{background:bftResult.ok?T.emFaint:T.redFaint,
              border:`2px solid ${bftResult.ok?T.em:T.red}`,
              borderRadius:6,padding:"16px 18px",
              animation:bftResult.ok?"borderPulse 2s ease infinite":"shake 0.4s ease"}}>
              <div style={{fontFamily:T.disp,fontSize:22,fontWeight:700,
                color:bftResult.ok?T.em:T.red,marginBottom:10}}>
                {bftResult.ok ? "✓ CONSENSUS REACHABLE" : "✗ CONSENSUS IMPOSSIBLE"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:10}}>
                {[
                  {l:"Total nodes",v:bftN,c:T.em},
                  {l:"Byzantine",v:bftF,c:T.red},
                  {l:"Honest",v:bftResult.honest,c:T.em},
                  {l:"Quorum needed",v:bftResult.quorum,c:T.sky},
                ].map(r=>(
                  <div key={r.l} style={{textAlign:"center"}}>
                    <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:3}}>{r.l}</div>
                    <div style={{fontFamily:T.disp,fontSize:24,color:r.c,fontWeight:700}}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{fontFamily:T.mono,fontSize:11,color:bftResult.ok?T.em:T.red}}>
                {bftResult.ok
                  ? `n=${bftN} ≥ 3×${bftF}+1=${3*bftF+1} ✓ — Honest nodes (${bftResult.honest}) exceed quorum (${bftResult.quorum})`
                  : `n=${bftN} < 3×${bftF}+1=${3*bftF+1} ✗ — Need at least ${3*bftF+1} validators to tolerate ${bftF} Byzantine faults`}
              </div>
              {!bftResult.ok && (
                <div style={{fontFamily:T.body,fontSize:13,color:T.text,marginTop:8}}>
                  Byzantine nodes can control {bftF} of {bftN} validators. Two quorums of {bftResult.quorum} nodes
                  could overlap entirely in Byzantine territory — no honest common witness exists.
                  Try increasing n to {3*bftF+1} or decreasing f to {Math.floor((bftN-1)/3)}.
                </div>
              )}
            </div>

            <InfoBox title="The 3f+1 Intuition" icon="◈" color={T.sky}>
              Need at least <strong>3 groups of size f+1</strong>: one group that only the attacker talks to,
              one group that only the honest leader talks to, and one group in the middle that must
              break ties. With n=3f, those groups collapse — the middle group is entirely Byzantine.
              With n=3f+1, the middle always contains at least one honest node.
            </InfoBox>
          </>
        )}

        {/* ── LAB 2: CONSENSUS SIMULATION ── */}
        {labTab==="sim" && (
          <>
            <div style={{fontFamily:T.mono,fontSize:10,color:T.em,letterSpacing:"0.1em",marginBottom:14}}>
              ▸ OBJECTIVE: Watch a BFT protocol run round-by-round. Observe how Byzantine nodes and latency affect outcome.
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
              <div>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:5}}>
                  TOTAL NODES (n): <span style={{color:T.em}}>{simN}</span>
                </div>
                <input type="range" min={4} max={13} value={simN}
                  onChange={e=>{setSimN(Number(e.target.value));resetSim();}}
                  style={{width:"100%",accentColor:T.em}}/>
              </div>
              <div>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:5}}>
                  BYZANTINE NODES (f): <span style={{color:T.red}}>{simF}</span>
                </div>
                <input type="range" min={0} max={Math.floor((simN-1)/3)+1} value={simF}
                  onChange={e=>{setSimF(Number(e.target.value));resetSim();}}
                  style={{width:"100%",accentColor:T.red}}/>
              </div>
              <div>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginBottom:5}}>
                  NETWORK LATENCY
                </div>
                <div style={{display:"flex",gap:5}}>
                  {[["normal","Normal"],["high","High"],["partition","Partition"]].map(([k,l])=>(
                    <button key={k} onClick={()=>{setSimLatency(k);resetSim();}}
                      style={{flex:1,padding:"5px 4px",border:`1px solid ${simLatency===k?T.amber:T.border}`,
                        borderRadius:3,background:simLatency===k?T.amberFaint:T.bg3,
                        color:simLatency===k?T.amber:T.textMuted,
                        fontFamily:T.mono,fontSize:9,cursor:"pointer"}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Node ring */}
            <div style={{position:"relative",height:160,marginBottom:14}}>
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible"}}>
                {Array.from({length:simN},(_,i)=>{
                  const angle = (i/simN)*Math.PI*2 - Math.PI/2;
                  const cx = 50+40*Math.cos(angle), cy = 50+35*Math.sin(angle);
                  const isByz = i<simF;
                  const isLeader = i===0;
                  const isActive = simPhase!=="idle"&&simPhase!=="failed";
                  return (
                    <g key={i}>
                      {isActive&&!isByz&&Array.from({length:Math.min(3,simN-1)},(_,j)=>{
                        const ti = (i+j+1)%simN;
                        const ta = (ti/simN)*Math.PI*2-Math.PI/2;
                        const tx = 50+40*Math.cos(ta), ty = 50+35*Math.sin(ta);
                        return simPhase==="prepare"||simPhase==="commit"?(
                          <line key={j} x1={`${cx}%`} y1={`${cy}%`}
                            x2={`${tx}%`} y2={`${ty}%`}
                            stroke={T.em} strokeWidth="0.3"
                            strokeOpacity="0.3" strokeDasharray="2,2"/>
                        ):null;
                      })}
                      <circle cx={`${cx}%`} cy={`${cy}%`} r="4%"
                        fill={isByz?T.redFaint:T.emFaint}
                        stroke={isByz?T.red:isLeader?T.sky:T.em}
                        strokeWidth={isLeader?"0.5%":"0.3%"}
                        style={{animation:isActive&&!isByz?"nodePing 1.5s ease infinite":"none",
                          animationDelay:`${i*0.15}s`}}/>
                      <text x={`${cx}%`} y={`${cy+1.2}%`} textAnchor="middle"
                        fill={isByz?T.red:isLeader?T.sky:T.em}
                        fontSize="2.2%" fontFamily={T.mono} fontWeight="700">
                        {isLeader?"L":isByz?"B":"H"}
                      </text>
                      <text x={`${cx}%`} y={`${cy+3.5}%`} textAnchor="middle"
                        fill={T.textMuted} fontSize="1.8%" fontFamily={T.mono}>
                        N{i}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div style={{position:"absolute",right:0,top:0,fontFamily:T.mono,fontSize:9,
                color:T.textMuted,lineHeight:1.8}}>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",border:`1px solid ${T.sky}`}}/> Leader
                </div>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",border:`1px solid ${T.em}`}}/> Honest
                </div>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",border:`1px solid ${T.red}`}}/> Byzantine
                </div>
              </div>
              <div style={{position:"absolute",left:"50%",top:"50%",
                transform:"translate(-50%,-50%)",textAlign:"center"}}>
                <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted}}>PHASE</div>
                <div style={{fontFamily:T.disp,fontSize:16,fontWeight:700,
                  color:simPhase==="finalized"?T.em:simPhase==="failed"?T.red:T.amber}}>
                  {simPhase.toUpperCase()}
                </div>
              </div>
            </div>

            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <Btn onClick={runSimulation} disabled={simRunning} color={T.em} small>
                {simRunning?"⟳ Running…":"▶ Run Simulation"}
              </Btn>
              <Btn onClick={resetSim} color={T.red} small>↺ Reset</Btn>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,
                display:"flex",alignItems:"center",gap:6}}>
                {bftCanReach(simN,simF).ok
                  ? <span style={{color:T.em}}>✓ Protocol CAN reach consensus</span>
                  : <span style={{color:T.red}}>✗ Protocol CANNOT reach consensus (f≥n/3)</span>}
              </div>
            </div>

            <div style={{background:"#020704",border:`1px solid ${T.border}`,borderRadius:5,
              padding:"12px 14px",maxHeight:160,overflowY:"auto",fontFamily:T.mono,fontSize:11}}>
              <div style={{color:T.textMuted,fontSize:9,marginBottom:6,letterSpacing:"0.1em"}}>
                CONSENSUS LOG
              </div>
              {simLog.length===0
                ? <div style={{color:T.textMuted}}>Press "Run Simulation" to start…</div>
                : simLog.map((l,i)=>(
                  <div key={i} style={{color:l.color,marginBottom:4,lineHeight:1.5}}>
                    [{String(i).padStart(2,"0")}] {l.msg}
                  </div>
                ))}
              {simDecision && (
                <div style={{marginTop:8,fontFamily:T.disp,fontSize:18,fontWeight:700,
                  color:simDecision==="success"?T.em:T.red}}>
                  {simDecision==="success"
                    ? "✓ BLOCK FINALIZED — Deterministic, irreversible."
                    : "✗ CONSENSUS FAILED — Protocol halts to preserve safety."}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── LAB 3: NETWORK PARTITION ── */}
        {labTab==="partition" && (
          <>
            <div style={{fontFamily:T.mono,fontSize:10,color:T.em,letterSpacing:"0.1em",marginBottom:14}}>
              ▸ OBJECTIVE: See how CP systems (BFT) and AP systems (PoW) respond differently to a network partition.
            </div>

            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,display:"flex",
                alignItems:"center",gap:8}}>SYSTEM TYPE:</div>
              {[["consistent","CP: BFT (Halt to preserve consistency)"],
                ["available","AP: PoW/Nakamoto (Keep mining, resolve later)"]].map(([k,l])=>(
                <button key={k} onClick={()=>{setPartMode(k);setPartStep(0);}}
                  style={{padding:"6px 12px",border:`1px solid ${partMode===k?T.em:T.border}`,
                    borderRadius:4,background:partMode===k?T.emFaint:T.bg3,
                    color:partMode===k?T.em:T.textMuted,
                    fontFamily:T.mono,fontSize:10,cursor:"pointer",transition:"all 0.15s"}}>
                  {l}
                </button>
              ))}
            </div>

            {/* Step display */}
            <div style={{background:T.bg3,border:`1px solid ${psColor}33`,
              borderRadius:6,padding:"16px 18px",marginBottom:12,animation:"fadeIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",
                alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
                <div style={{fontFamily:T.mono,fontSize:11,color:psColor,fontWeight:700}}>
                  Step {partStep+1}/5: {ps.label}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn small onClick={()=>setPartStep(s=>Math.max(0,s-1))} disabled={partStep===0} color={T.textMuted}>← Back</Btn>
                  <Btn small onClick={()=>setPartStep(s=>Math.min(maxStep,s+1))} disabled={partStep===maxStep} color={T.em}>Next →</Btn>
                </div>
              </div>
              <div style={{fontFamily:T.body,fontSize:13.5,color:T.text,
                lineHeight:1.7,marginBottom:14}}>{ps.desc}</div>

              {/* Two-group visualization */}
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center"}}>
                {[{label:"Group A",nodes:3},{label:"Group B",nodes:3}].map((g,gi)=>(
                  <div key={g.label} style={{background:T.bg4,border:`1px solid ${
                    ps.state==="partitioned"||ps.state==="forked"||ps.state==="halted"
                      ?T.amber:ps.state==="reorg"?T.red:T.border}`,
                    borderRadius:5,padding:"12px"}}>
                    <div style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,
                      marginBottom:8,textAlign:"center"}}>{g.label}</div>
                    <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:8}}>
                      {Array.from({length:g.nodes},(_,i)=>(
                        <div key={i} style={{width:28,height:28,borderRadius:"50%",
                          background:T.emFaint,border:`1px solid ${T.em}`,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontFamily:T.mono,fontSize:9,color:T.em}}>
                          N{gi*3+i}
                        </div>
                      ))}
                    </div>
                    {ps.state==="forked"&&(
                      <div style={{textAlign:"center",fontFamily:T.mono,fontSize:10,
                        color:T.amber}}>Mining B{5+gi}…</div>
                    )}
                    {ps.state==="halted"&&partMode==="consistent"&&(
                      <div style={{textAlign:"center",fontFamily:T.mono,fontSize:10,
                        color:T.red}}>HALTED</div>
                    )}
                    {(ps.state==="recovered"||ps.state==="healing")&&(
                      <div style={{textAlign:"center",fontFamily:T.mono,fontSize:10,
                        color:T.indigo}}>Reconciling…</div>
                    )}
                  </div>
                ))}
                <div style={{textAlign:"center"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",
                    background:ps.state==="partitioned"||ps.state==="halted"||ps.state==="forked"
                      ?T.redFaint:T.emFaint,
                    border:`2px solid ${ps.state==="partitioned"||ps.state==="halted"||ps.state==="forked"
                      ?T.red:T.em}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    margin:"0 auto",transition:"all 0.3s"}}>
                    <div style={{fontFamily:T.mono,fontSize:9,color:
                      ps.state==="partitioned"||ps.state==="halted"||ps.state==="forked"
                        ?T.red:T.em}}>
                      {ps.state==="partitioned"||ps.state==="halted"||ps.state==="forked"?"✗":"⇄"}
                    </div>
                  </div>
                  <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginTop:4}}>
                    {ps.state==="partitioned"||ps.state==="halted"||ps.state==="forked"
                      ?"SPLIT":"NET"}
                  </div>
                </div>
              </div>
            </div>

            {/* Step indicator */}
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:12}}>
              {Array.from({length:5},(_,i)=>(
                <div key={i} onClick={()=>setPartStep(i)}
                  style={{width:i===partStep?20:8,height:4,borderRadius:2,
                    background:i===partStep?psColor:T.border,
                    cursor:"pointer",transition:"all 0.2s"}}/>
              ))}
            </div>

            <InfoBox title={partMode==="consistent"?"CP Trade-off: Halt > Inconsistency":"AP Trade-off: Fork > Halt"} icon="◈" color={psColor}>
              {partMode==="consistent"
                ? "BFT systems choose to HALT during a partition rather than risk producing conflicting finalized blocks. This preserves the ledger's integrity at the cost of availability. Once the partition heals, the chain resumes from the last agreed checkpoint — no data loss, no reorgs."
                : "PoW/AP systems keep producing blocks during a partition, accepting the risk of a temporary fork. When the partition heals, the shorter fork is orphaned. Transactions only in orphaned blocks return to the mempool — potentially causing double-spends for shallow-confirmation transactions."}
            </InfoBox>
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
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§6 — Knowledge Checks</SecLabel>
      <H2>In-Class Quizzes</H2>
      <Body>Select your answer, then submit to reveal the full explanation. Score calculated after all questions.</Body>

      {score!==null&&(
        <div style={{background:score>=6?T.emFaint:score>=4?T.amberFaint:T.redFaint,
          border:`1px solid ${score>=6?T.em:score>=4?T.amber:T.red}55`,
          borderRadius:7,padding:"18px 22px",margin:"16px 0",textAlign:"center",
          animation:"fadeUp 0.4s ease"}}>
          <div style={{fontFamily:T.disp,fontSize:46,fontWeight:700,
            color:score>=6?T.em:score>=4?T.amber:T.red}}>{score}/{QUIZZES.length}</div>
          <div style={{fontFamily:T.mono,fontSize:12,color:T.text,marginTop:8}}>
            {score===QUIZZES.length?"Perfect. Complete command of consensus theory and practice."
              :score>=6?"Strong understanding. Review any missed explanations."
              :score>=4?"Solid foundation. Re-read §2–§4 before the assessment."
              :"Revisit the chapter content and retry."}
          </div>
        </div>
      )}

      {Object.entries(bySec).map(([sec,qs])=>(
        <div key={sec} style={{marginBottom:28}}>
          <div style={{fontFamily:T.mono,fontSize:10,color:T.amber,letterSpacing:"0.14em",
            margin:"22px 0 12px",borderBottom:`1px solid ${T.border}`,paddingBottom:8}}>{sec}</div>
          {qs.map(q=>{
            const i=q.idx, isRev=revealed[i], ok=answers[i]===q.ans;
            return (
              <div key={i} style={{background:T.bg2,
                border:`1px solid ${isRev?(ok?T.em+"55":T.red+"55"):T.border}`,
                borderRadius:6,padding:"16px 18px",marginBottom:14,animation:"fadeIn 0.3s ease"}}>
                <div style={{fontFamily:T.body,fontSize:15,color:T.textBright,
                  marginBottom:14,lineHeight:1.78}}>
                  <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginRight:8}}>Q{i+1}.</span>
                  {q.q}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {q.opts.map((opt,oi)=>{
                    let bg=T.bg3, border=T.border, color=T.text;
                    if(isRev){
                      if(oi===q.ans){bg=T.emFaint;border=T.em;color=T.em;}
                      else if(oi===answers[i]&&oi!==q.ans){bg=T.redFaint;border=T.red;color=T.red;}
                    } else if(answers[i]===oi){bg=T.emFaint;border=T.em;color=T.em;}
                    return (
                      <button key={oi} onClick={()=>!isRev&&setAnswers(p=>({...p,[i]:oi}))}
                        style={{background:bg,border:`1px solid ${border}`,borderRadius:5,
                          padding:"9px 13px",cursor:isRev?"default":"pointer",
                          textAlign:"left",fontFamily:T.body,fontSize:13.5,color,
                          lineHeight:1.55,transition:"all 0.15s"}}>
                        <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted,marginRight:9}}>
                          {String.fromCharCode(65+oi)}.
                        </span>{opt}
                        {isRev&&oi===q.ans&&<span style={{marginLeft:7,fontSize:12}}>✓</span>}
                        {isRev&&oi===answers[i]&&oi!==q.ans&&<span style={{marginLeft:7,fontSize:12}}>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {!isRev&&(
                  <button onClick={()=>answers[i]!==undefined&&setRevealed(p=>({...p,[i]:true}))}
                    disabled={answers[i]===undefined}
                    style={{marginTop:11,padding:"7px 18px",
                      background:answers[i]!==undefined?T.emFaint:T.bg3,
                      border:`1px solid ${answers[i]!==undefined?T.em+"55":T.border}`,
                      borderRadius:4,cursor:answers[i]!==undefined?"pointer":"default",
                      color:answers[i]!==undefined?T.em:T.textMuted,
                      fontFamily:T.mono,fontSize:10,fontWeight:700,transition:"all 0.2s"}}>
                    Submit Answer
                  </button>
                )}
                {isRev&&(
                  <div style={{marginTop:12,background:"#020704",borderRadius:5,
                    padding:"11px 13px",borderLeft:`3px solid ${ok?T.em:T.amber}`,
                    animation:"slideRight 0.3s ease"}}>
                    <div style={{fontFamily:T.mono,fontSize:9,color:ok?T.em:T.amber,
                      letterSpacing:"0.1em",marginBottom:6}}>
                      {ok?"✓ CORRECT":"✗ INCORRECT"} — EXPLANATION
                    </div>
                    <div style={{fontFamily:T.body,fontSize:13.5,color:T.text,lineHeight:1.78}}>
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
            style={{padding:"11px 34px",background:T.em,color:T.bg0,border:"none",
              borderRadius:5,cursor:"pointer",fontFamily:T.mono,fontSize:12,
              fontWeight:700,letterSpacing:"0.1em"}}>CALCULATE SCORE</button>
        </div>
      )}
    </div>
  );
};

// ─── SECTION: ASSESSMENT ─────────────────────────────────────────────────────
const AssessSection = () => {
  const [revealed, setRevealed] = useState({});
  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <SecLabel>§7 — Assessment Problems</SecLabel>
      <H2>End-of-Chapter Problems</H2>
      <Body>Five graded problems. Attempt each independently. Model answers include formal proofs, quantitative analysis, and protocol design.</Body>

      <div style={{display:"flex",gap:8,margin:"14px 0 22px",flexWrap:"wrap"}}>
        {[[T.em,"Foundational"],[T.amber,"Intermediate"],[T.red,"Advanced"]].map(([c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:10,height:10,background:c,borderRadius:2}}/>
            <span style={{fontFamily:T.mono,fontSize:10,color:T.textMuted}}>{l}</span>
          </div>
        ))}
      </div>

      {ASSESSMENTS.map(a=>(
        <div key={a.id} style={{background:T.bg2,border:`1px solid ${T.border}`,
          borderLeft:`3px solid ${a.color}`,borderRadius:6,padding:"18px 20px",
          marginBottom:18,animation:"fadeUp 0.4s ease"}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
            <span style={{fontFamily:T.disp,fontSize:22,fontWeight:700,
              color:a.color,letterSpacing:"0.05em"}}>{a.id}</span>
            <Tag color={a.color}>{a.diff}</Tag>
          </div>
          <div style={{fontFamily:T.body,fontSize:15.5,color:T.textBright,
            lineHeight:1.85,marginBottom:14}}>{a.problem}</div>
          <Btn onClick={()=>setRevealed(p=>({...p,[a.id]:!p[a.id]}))} color={a.color} small>
            {revealed[a.id]?"▲ Hide Answer":"▼ Reveal Model Answer"}
          </Btn>
          {revealed[a.id]&&(
            <div style={{marginTop:14,animation:"slideRight 0.3s ease"}}>
              <div style={{fontFamily:T.mono,fontSize:9,color:a.color,
                letterSpacing:"0.14em",marginBottom:9}}>MODEL ANSWER</div>
              <Code title={`${a.id} — Model Answer`}>{a.answer}</Code>
            </div>
          )}
        </div>
      ))}

      <InfoBox title="Further Reading" icon="◈" color={T.indigo}>
        <strong>Foundational papers:</strong> Lamport, Shostak & Pease (1982). Byzantine Generals Problem. · Fischer, Lynch & Paterson (1985). Impossibility of Distributed Consensus with One Faulty Process (FLP). · Dwork, Lynch & Stockmeyer (1988). Consensus in the presence of partial synchrony.<br/><br/>
        <strong>Protocols:</strong> Castro & Liskov (1999). Practical Byzantine Fault Tolerance (PBFT). · Buchman (2016). Tendermint Thesis. · Yin et al. (2019). HotStuff: BFT Consensus with Linearity and Responsiveness. · Buterin & Griffith (2017). Casper FFG.<br/><br/>
        <strong>Modern PoS:</strong> ethereum.org/en/developers/docs/consensus-mechanisms/ · Rocket, Maofan & Gün Sirer (2019). Scalable and Probabilistic Leaderless BFT Consensus through Metastability (Avalanche).
      </InfoBox>
    </div>
  );
};

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function ConsensusMechanisms() {
  const [active, setActive] = useState("intro");
  const contentRef = useRef(null);

  useEffect(()=>{
    if(contentRef.current) contentRef.current.scrollTop=0;
  },[active]);

  const SECTIONS = {
    intro:   <IntroSection/>,
    safety:  <SafetySection/>,
    compare: <ConsensusSection/>,
    finality:<FinalitySection/>,
    lab:     <LabSection/>,
    quiz:    <QuizSection/>,
    assess:  <AssessSection/>,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{display:"flex",height:"100vh",background:T.bg0,
        color:T.text,overflow:"hidden"}}>

        {/* SIDEBAR */}
        <div style={{width:218,background:T.bg1,borderRight:`1px solid ${T.border}`,
          display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontFamily:T.mono,fontSize:8,color:T.textMuted,
              letterSpacing:"0.24em",textTransform:"uppercase",marginBottom:8}}>
              ACM Educational Series
            </div>
            <div style={{fontFamily:T.disp,fontSize:17,fontWeight:700,
              color:T.textBright,lineHeight:1.2,marginBottom:3,letterSpacing:"0.04em"}}>
              Consensus<br/>Mechanisms
            </div>
            <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,marginBottom:10}}>
              &amp; Finality Models
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:T.em,
                animation:"blink 1.8s ease infinite"}}/>
              <span style={{fontFamily:T.mono,fontSize:9,color:T.textMuted}}>Chapter 4 · Live</span>
            </div>
          </div>

          <nav style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
            {CHAPTERS.map(ch=>(
              <button key={ch.id} onClick={()=>setActive(ch.id)}
                style={{width:"100%",padding:"9px 14px",
                  background:active===ch.id?T.emFaint:"none",border:"none",
                  borderLeft:`3px solid ${active===ch.id?T.em:"transparent"}`,
                  cursor:"pointer",textAlign:"left",display:"flex",
                  gap:10,alignItems:"center",transition:"all 0.15s"}}>
                <span style={{fontFamily:T.mono,fontSize:9,
                  color:active===ch.id?T.em:T.textMuted,minWidth:18}}>{ch.short}</span>
                <span style={{fontFamily:T.body,fontSize:13,
                  color:active===ch.id?T.textBright:T.textMuted,lineHeight:1.3}}>
                  {ch.label.replace(/^§\d+ /,"")}
                </span>
              </button>
            ))}
          </nav>

          <div style={{padding:"10px 14px",borderTop:`1px solid ${T.border}`}}>
            <div style={{fontFamily:T.mono,fontSize:9,color:T.textMuted,lineHeight:1.75}}>
              8 Quizzes · 5 Problems<br/>
              3 Interactive Labs<br/>
              Distributed Systems
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div ref={contentRef}
          style={{flex:1,overflowY:"auto",padding:"38px 46px",
            maxWidth:860,margin:"0 auto",width:"100%"}}>
          {SECTIONS[active]}

          <div style={{display:"flex",justifyContent:"space-between",
            marginTop:44,paddingTop:22,borderTop:`1px solid ${T.border}`}}>
            {(()=>{
              const idx=CHAPTERS.findIndex(c=>c.id===active);
              const prev=CHAPTERS[idx-1], next=CHAPTERS[idx+1];
              return (<>
                {prev?<Btn onClick={()=>setActive(prev.id)} color={T.textMuted} small>← {prev.label}</Btn>:<div/>}
                {next&&<Btn onClick={()=>setActive(next.id)} color={T.em} small>{next.label} →</Btn>}
              </>);
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
