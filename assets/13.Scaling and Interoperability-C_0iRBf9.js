import{r as x,j as e}from"./index-_agJ5g7C.js";const G="@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');::-webkit-scrollbar{width:4px;background:#080c10}::-webkit-scrollbar-thumb{background:#1a3a4a;border-radius:2px}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}",Z=".m4{background:#060a0e!important;color:#7eb8cc;font-family:'Merriweather',serif}.m4 h1,.m4 h2,.m4 h3,.m4 h4,.m4 h5,.m4 h6{color:#d6eef5!important;font-family:'Orbitron',sans-serif!important;background:transparent!important;border-color:#1c3344!important}.m4 p,.m4 li,.m4 td,.m4 span,.m4 label{color:#7eb8cc!important;background:transparent!important}.m4 div,.m4 section,.m4 ul,.m4 ol{background:transparent!important;background-color:transparent!important;border-color:#1c3344!important}.m4 pre,.m4 code{background:#030608!important;color:#00e5ff!important;border-color:#1c3344!important;font-family:'IBM Plex Mono',monospace!important}.m4 button{background:#00e5ff18!important;background-color:#00e5ff18!important;border:1px solid rgba(0,229,255,.31)!important;color:#00e5ff!important;font-family:'IBM Plex Mono',monospace!important;border-radius:4px!important}.m4 button:disabled{background:#121f2a!important;color:#2e5a6e!important}.m4 input,.m4 textarea,.m4 select{background:#0e1820!important;color:#7eb8cc!important;border-color:#1c3344!important}.m4 th{background:#0e1820!important;color:#d6eef5!important}.m4 tr{background:transparent!important}.m4 tr:nth-child(even){background:#0d1825!important}.m4 table *{border-color:#1c3344!important}.m4 strong,.m4 b{color:#d6eef5!important;background:transparent!important}.m4 a{color:#00e5ff!important;background:transparent!important}.m4 hr{border-color:#1c3344!important}.m4 .callout,.m4 .feedback,.m4 .quiz-section,.m4 .quiz-question{background:#0a1018!important;border-color:#1c3344!important}.m4 .callout.pitfall{border-color:#ff5252!important}.m4 .codeblock{background:#030608!important;color:#00e5ff!important;font-family:'IBM Plex Mono',monospace!important}",m={bg0:"#060a0e",bg1:"#0a1018",border:"#1c3344",cyan:"#00e5ff",cyanFaint:"#00e5ff14",text:"#7eb8cc",textMuted:"#2e5a6e",textBright:"#d6eef5",mono:"'IBM Plex Mono',monospace",disp:"'Orbitron',sans-serif",body:"'Merriweather',serif"},ae=()=>{const[n,a]=x.useState("intro"),[r,h]=x.useState(0),[o,l]=x.useState({}),[u,f]=x.useState(!1),[t,i]=x.useState(null),[p,c]=x.useState(0),[d,b]=x.useState([]),[L,A]=x.useState(!1),I=[{id:"intro",label:"0. Introduction",type:"content"},{id:"why-hard",label:"1. Why Scaling is Hard",type:"content"},{id:"l2-rollups",label:"2. Layer 2 Rollups",type:"content"},{id:"bridges",label:"3. Bridges & Cross-Chain Messaging",type:"content"},{id:"product-guidance",label:"4. Product & Engineering Guidance",type:"content"},{id:"lab",label:"5. Hands-On Lab",type:"lab"},{id:"tabletop",label:"6. Bridge Incident Tabletop",type:"interactive"},{id:"final-assessment",label:"7. Final Assessment",type:"assessment"}],S={"why-hard":{questions:[{id:"q1",type:"multiple-choice",text:"Which of these is NOT a fundamental scaling bottleneck in blockchain?",options:[{text:"Execution throughput (TPS)",correct:!1},{text:"Data availability bandwidth",correct:!1},{text:"State bloat and storage",correct:!1},{text:"Network latency is the only hard limit",correct:!0}],explanation:"All three—execution, data availability, and state growth—are independent bottlenecks. Network latency contributes but is not the sole constraint. You can have infinite TPS with no DA or face computation limits."},{id:"q2",type:"multi-select",text:"Which tradeoffs are inherent when moving computation off-chain? (Select all that apply)",options:[{text:"Reduced L1 gas cost",correct:!0},{text:"Increased latency for user confirmation",correct:!0},{text:"Weaker liveness guarantees if sequencer goes offline",correct:!0},{text:"Elimination of all smart contract risk",correct:!1}],explanation:"Off-chain execution saves gas but introduces latency and liveness risks. Off-chain does NOT eliminate smart contract bugs—the L2 or bridge contract can still be buggy or exploited."},{id:"q3",type:"short-answer",text:"Why does atomic composability (calling contract A which calls contract B synchronously) become a scaling bottleneck?",expectedKeywords:["shared state","write conflict","ordering","single sequencer","consensus"],explanation:"Atomic composability requires shared state consistency and strict ordering. Multiple independent sequencers cannot safely execute conflicting calls in parallel; you need consensus or a single sequencer, which bottlenecks throughput."}]},"l2-rollups":{questions:[{id:"q4",type:"multiple-choice",text:"In an optimistic rollup, what is a fraud proof?",options:[{text:"A cryptographic proof that a batch is valid",correct:!1},{text:"A claim that a batch is invalid, and a challenge-response protocol to prove it within a dispute game",correct:!0},{text:"A zero-knowledge proof of execution",correct:!1},{text:"A signature from the sequencer",correct:!1}],explanation:"Optimistic rollups assume batches are valid by default. Fraud proofs are interactive disputes. ZK rollups use validity proofs instead (non-interactive, different model)."},{id:"q5",type:"multiple-choice",text:"What is the main security assumption for a ZK rollup verifier on L1?",options:[{text:"The sequencer is honest",correct:!1},{text:"The ZK proof is cryptographically sound (no false proofs accepted)",correct:!0},{text:"Majority of validators are honest",correct:!1},{text:"Users run full L2 nodes",correct:!1}],explanation:"ZK rollups move trust to cryptography: if the proof verifies, the batch is valid. No social consensus needed. However, implementation bugs in the proof system, circuit, or verifier can break this."},{id:"q6",type:"multi-select",text:"Which statements about L2 finality are correct? (Select all)",options:[{text:"An optimistic rollup withdrawal is safe once the L1 confirmation block is finalized",correct:!1},{text:"An optimistic rollup needs a challenge window (typically 7 days) after L1 finalization before withdrawal is final",correct:!0},{text:"A ZK rollup is final as soon as the proof is verified on L1",correct:!0},{text:"L2 soft finality (sequencer confirmation) equals hard finality (L1 settlement)",correct:!1}],explanation:"Optimistic rollups have dual finality: soft (sequencer) and hard (L1 + challenge period). ZK rollups finalize on L1 proof verification but you must wait for L1 finalization of the proof tx itself."}]},bridges:{questions:[{id:"q7",type:"multiple-choice",text:"What is the key difference between lock-and-mint and burn-and-mint bridge models?",options:[{text:"Lock-and-mint locks assets on the source chain; burn-and-mint destroys them.",correct:!0},{text:"Burn-and-mint is safer",correct:!1},{text:"Lock-and-mint requires multisig validators",correct:!1},{text:"There is no meaningful difference",correct:!1}],explanation:"Lock-and-mint preserves the original asset elsewhere; burn-and-mint destroys on source and creates a new wrapped token. Both can fail, but the implications differ (e.g., lockup exploit vs. wrapped token inflation)."},{id:"q8",type:"multi-select",text:"Which are common bridge failure modes? (Select all)",options:[{text:"Validator set compromise",correct:!0},{text:"Replay attacks across chains",correct:!0},{text:"Race condition in message ordering",correct:!0},{text:"None; bridges are proven secure by math",correct:!1}],explanation:"Bridges are a top attack surface. Validators can collude, message replay must be prevented per-chain, and ordering matters for state consistency. No mathematical guarantee; operational and cryptographic care required."},{id:"q9",type:"short-answer",text:"Why is domain separation important in cross-chain messages?",expectedKeywords:["replay","chain ID","prevent","different chain","fork"],explanation:"Domain separation (e.g., chain ID, bridge address in message hash) prevents a message signed for Chain A from being replayed on Chain B. Without it, an attacker can replay a valid message on a fork or different chain."}]},"final-assessment":{questions:[{id:"fa1",type:"scenario",text:"Your team is building a DEX. You have $10M TVL on Ethereum and want to expand to Polygon. You can (A) deploy a new DEX on Polygon with separate liquidity, (B) build a canonical bridge and use atomic swaps across chains, or (C) use a third-party multi-chain router (e.g., Across, Hop). Consider user experience, security, and operational burden. Which would you choose and why?",expectedKeywords:["fragmentation","latency","trust","liquidity","risk","operational"],explanation:`
                        A (separate): Simple, isolated risk, but liquidity fragmented; low user experience for cross-chain swaps (manual bridges needed).
                        B (canonical): Higher risk (complex bridge, you maintain it), but unified liquidity and UX. Needs fraud/proof systems, sequencer/prover infrastructure, incident response.
                        C (third-party): Low operational burden, but you depend on third-party security and censorship resistance. Adds latency, fee cuts. Better UX than (A).
                        
                        Tradeoff: Isolated safety (A) vs. better UX (B/C). Most teams start with (C) for UX without ops burden, then graduate to (B) once TVL justifies the engineering investment. (A) is acceptable if you accept liquidity fragmentation.
                    `},{id:"fa2",type:"scenario",text:"You discover a bug in your L2 rollup's state transition code that could allow an attacker to forge withdrawals. It's not yet exploited. Do you (A) pause the rollup, (B) upgrade the verifier contract, or (C) disable fraud proof challenges? What are the tradeoffs?",expectedKeywords:["liveness","security","user impact","upgrade","trustlessness"],explanation:`
                        (A) Pause: Safest. No new attacks, but users lose liveness. High reputational/financial cost.
                        (B) Upgrade verifier: Fast fix if you have an upgrade path. Requires multisig coordination. Reduces trustlessness (users must trust the upgrade). But liveness preserved.
                        (C) Disable fraud proofs: Catastrophic; removes the security model entirely. Converts optimistic rollup to a trusted sequencer.
                        
                        Best practice: Have a secure upgrade path (e.g., timelock, governance) for exactly this scenario. Pause while upgrading if possible. Disable fraud proofs only if you can migrate users off.
                    `},{id:"fa3",type:"multiple-choice",text:"When breaking down a $1000 cross-chain transfer cost, which is NOT typically included?",options:[{text:"Source chain gas (e.g., Ethereum)",correct:!1},{text:"Bridge relayer/proof submission cost",correct:!1},{text:"Destination chain gas",correct:!1},{text:"The market price of the token on the destination",correct:!0}],explanation:"Token price is not a transfer cost; it is the value of the asset. Costs are: source gas (initiate message), relayer cost (post proof/message), dest gas (execute message), plus bridge fees/slippage."}]}},_={title:"Bridge Incident Tabletop: Ronin Bridge Exploit (2022)",description:"A bridge protecting $625M in Ethereum and USDC was compromised via validator key theft. Attackers minted 173.6 WETH and 25.5M USDC on Ronin. The team did not detect it for 6 days.",steps:[{phase:"Setup",text:"Choose your bridge model: (A) multisig-based (N-of-M validators sign), (B) light-client-based (on-chain verification of source chain state), (C) third-party oracle/relayer network.",options:[{text:"(A) Multisig with 9-of-15 validators",chosenModel:"multisig",notes:"Fast, simple, but key management critical. Single validator compromise has high impact."},{text:"(B) Light-client verifier contract",chosenModel:"light-client",notes:"More trustless, but complex and gas-intensive. Requires robust source chain tracking."},{text:"(C) Third-party relayer network",chosenModel:"oracle",notes:"Outsourced trust. Easy to deploy but depends on relayer security and incentives."}]},{phase:"Incident Detection",text:"An external security researcher notices 173.6 WETH minted on the Ronin bridge in a single tx. Your monitoring system did not alert. What happened and how would you have detected it?",options:[{text:"Validator keys stolen; would have detected with balance-change alerts and validator-set monitoring.",failureMode:"Key compromise",detection:["Unexpected mints","Off-chain validator monitoring","Secure enclave checks"]},{text:"Light-client code bug allowed forged proofs; monitoring off-chain relayer would not help.",failureMode:"Code bug",detection:["Proof verification logs","Audit trails","Source chain re-verification"]},{text:"Relayer was compromised; would have detected with encrypted relay logs and multi-sig release.",failureMode:"Relayer compromise",detection:["Relay audit logs","Threshold signatures","Failover relayers"]}]},{phase:"Response",text:"The attacker is now actively moving the stolen tokens. You have 3 options: (A) pause the bridge (freeze all in-flight messages), (B) freeze only outbound withdrawals from the bridge, or (C) do nothing and let users redeem.",options:[{text:"(A) Pause entirely—no further risk, but breaks liveness for all users.",impact:"High confidence stop, max liveness impact."},{text:"(B) Freeze outbound only—attacker cannot cash out, but users cannot withdraw deposits; middle ground.",impact:"Medium trust, controllable."},{text:"(C) Passive response—users can still redeem against the bridge, attacker might drain it further.",impact:"Trusts market dynamics; very risky."}]},{phase:"Communication & Recovery",text:"Now draft a brief public statement and recovery plan.",template:`
                    INCIDENT STATEMENT:
                    - What happened (technical): 
                    - Impact (amount, users affected): 
                    - Root cause (preliminary): 
                    - Immediate action:
                    - Investigation timeline:
                    - Compensation/recovery plan:
                    - Preventive improvements:
                `}]},$=[{id:1,asset:"WETH on Bridge",threat:"Validator key compromise",attackPath:"Attacker steals 8+ of 15 validator keys → signs forged withdrawal tx",likelihood:"Medium (keys in hot wallets)",impact:"Critical ($100M+ minting)",detectionSignal:"Unexpected mints, validator anomalies",mitigation:"Upgrade to threshold signing, HSM keys, continuous monitoring",residualRisk:"Medium (still depends on validator ops)",owner:"Security & Infrastructure"},{id:2,asset:"Messages (any)",threat:"Replay attack across fork",attackPath:"Chain reorg → message replayed on re-org fork → double-confirmation on both branches",likelihood:"Low (rare on finalized chains)",impact:"High (double-spend, user confusion)",detectionSignal:"Dual-chain tx graph, message ID logs",mitigation:"Domain separation (chain ID, bridge addr in hash), nonce tracking",residualRisk:"Low (with proper domain separation)",owner:"Core Protocol"},{id:3,asset:"Liquidity pool on L2",threat:"Censorship by L2 sequencer",attackPath:"Sequencer refuses to include withdrawal tx → funds locked until sequencer replaced",likelihood:"Medium (centralized sequencer)",impact:"High (temp locking, but not loss)",detectionSignal:"Tx stuck in mempool > liveness timeout",mitigation:"Decentralized sequencing, liveness gadget, timeout escape hatch, public sequencer infra",residualRisk:"Medium (liveness gadgets have edge cases)",owner:"Product & Operations"}];x.useEffect(()=>{const s=I.length,g=I.findIndex(w=>w.id===n);h(Math.round((g+1)/s*100))},[n]),x.useEffect(()=>{d.length===0&&b($)},[]);const E=(s,g)=>{l(w=>({...w,[s]:g}))},P=()=>{let s=0,g=0;return Object.keys(S).forEach(w=>{w!=="final-assessment"&&S[w].questions.forEach(y=>{var C;g+=1;const k=(C=o[w])==null?void 0:C[y.id];if(k){if(y.type==="multiple-choice"&&k.selected===y.options.findIndex(v=>v.correct))s+=1;else if(y.type==="multi-select"&&Array.isArray(k.selected)&&k.selected.every(v=>{var N;return(N=y.options[v])==null?void 0:N.correct})&&k.selected.length===y.options.filter(v=>v.correct).length)s+=1;else if(y.type==="short-answer"){const v=y.expectedKeywords||[],N=(k.text||"").toLowerCase();v.filter(T=>N.includes(T.toLowerCase())).length>=v.length*.6&&(s+=1)}}})}),{correct:s,total:g,percentage:Math.round(s/g*100)}},Y=()=>n==="intro"?e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-4xl font-bold",children:"Scaling and Interoperability in Blockchain"}),e.jsx("p",{className:"text-lg text-gray-700",children:"An Engineering-First Guide to Layer 2 Rollups, Bridges, and Cross-Chain Architecture"}),e.jsxs("div",{className:"bg-blue-50 border-l-4 border-blue-500 p-4",children:[e.jsx("p",{className:"font-semibold text-blue-900",children:"Abstract"}),e.jsx("p",{className:"text-sm text-blue-800 mt-2",children:"Blockchain scaling and interoperability are not purely technical problems—they are engineering tradeoffs between throughput, latency, security, and operational complexity. This chapter deconstructs scaling from first principles (execution, data, state), explains Layer 2 rollup architectures (optimistic vs. ZK), explores bridge designs and their failure modes, and provides practical guidance for when and how to deploy these systems in production. Real-world incidents (Ronin, Poly Network, Wormhole) are analyzed to build defensive intuition. Learners will emerge with a risk-aware mental model for cross-chain systems."})]}),e.jsxs("div",{className:"bg-gray-50 p-4 border rounded",children:[e.jsx("p",{className:"font-semibold mb-3",children:"Learning Objectives"}),e.jsxs("ul",{className:"text-sm space-y-1 list-disc list-inside",children:[e.jsx("li",{children:"Understand why scaling is fundamentally hard: execution, DA, and state bottlenecks"}),e.jsx("li",{children:"Explain optimistic vs. ZK rollup design, including sequencer/prover/verifier roles"}),e.jsx("li",{children:"Analyze bridge models (canonical, light-client, multisig) and common attack vectors"}),e.jsx("li",{children:"Identify trust assumptions and failure modes in cross-chain architectures"}),e.jsx("li",{children:"Apply risk management frameworks to L2 and bridge deployments"}),e.jsx("li",{children:"Measure gas, latency, and operational overhead; make informed product decisions"})]})]}),e.jsxs("div",{className:"bg-gray-50 p-4 border rounded",children:[e.jsx("p",{className:"font-semibold mb-3",children:"Prerequisites"}),e.jsx("p",{className:"text-sm",children:"Module 4 (Smart Contracts), Module 5 (Consensus). Familiarity with Ethereum, gas costs, and basic cryptography (digital signatures, Merkle trees)."})]}),e.jsxs("div",{className:"bg-gray-50 p-4 border rounded",children:[e.jsx("p",{className:"font-semibold mb-3",children:"Key Terms"}),e.jsxs("div",{className:"text-sm grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Layer 2 (L2):"})," Off-chain computation posted to L1"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Rollup:"})," Batched txs compressed and settled on L1"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Sequencer:"})," Entity that orders L2 txs"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Fraud proof:"})," Interactive challenge to prove batch invalid"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Validity proof:"})," ZK/SNARK proof that batch is valid"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Bridge:"})," Protocol to move assets/messages between chains"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Domain separation:"})," Prevent replay across different chains/contexts"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Finality:"})," Certainty that a tx cannot be reverted"]})]})]}),e.jsx("button",{onClick:()=>a("why-hard"),className:"mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Continue to Section 1"})]}):n==="why-hard"?e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"1. Why Scaling Is Hard: From First Principles"}),e.jsxs("div",{className:"bg-green-50 border-l-4 border-green-500 p-4",children:[e.jsx("p",{className:"font-semibold text-green-900",children:"Key Takeaway"}),e.jsx("p",{className:"text-sm text-green-800 mt-2",children:"Blockchain scaling is constrained by three independent bottlenecks: execution (CPU), data availability (bandwidth), and state growth (storage). These do not scale linearly, and moving computation off-chain trades throughput for latency and liveness risk."})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"1.1 The Three Bottlenecks"}),e.jsx("p",{className:"mb-3",children:"Consider a simple Ethereum block: validators execute ~150 transactions, each manipulating contract state. Three limits apply independently:"}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`┌─────────────────────────────────────────┐
│ Block (12 seconds)                      │
├─────────────────────────────────────────┤
│ EXECUTION                                │
│ - CPU: run ~150 txs sequentially         │
│ - Gas limit: 30M per block               │
│ - Bottleneck: single-threaded VM        │
│                                          │
│ DATA AVAILABILITY                        │
│ - Post full block (txs + state root)     │
│ - ~100 KB per block                      │
│ - DA bandwidth: 100 KB * (6 blocks/min) │
│                                          │
│ STATE GROWTH                             │
│ - Store account balances, contract code │
│ - ~500 GB Ethereum full node today       │
│ - Grows ~50 GB/year                      │
└─────────────────────────────────────────┘`})}),e.jsxs("p",{className:"text-sm mb-3",children:[e.jsx("strong",{children:"Execution:"})," A validator is a commodity machine. It can execute only so many EVM operations per second (~1M ops/sec realistically). Ethereum's 30M gas limit / 12 sec ≈ 2.5M gas/sec, so we are near the limit already. Adding CPUs does not help because all validators must execute the same sequence (consensus requirement)."]}),e.jsxs("p",{className:"text-sm mb-3",children:[e.jsx("strong",{children:"Data Availability:"})," Every validator downloads the full block. At ~100 KB/block and 6 blocks/min, that is 600 KB/min or 10 KB/sec aggregate bandwidth. Light-clients cannot verify data availability without downloading all data, so DA is not shardable (everyone must see everything for security)."]}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"State:"})," Contracts accumulate storage entries. Accessing old state requires reading disk; updating state tree requires recomputing Merkle proofs. A full node must store the entire state to validate new blocks. Pruning breaks security (validator cannot verify history)."]})]}),e.jsxs("div",{className:"bg-red-50 border-l-4 border-red-500 p-4",children:[e.jsx("p",{className:"font-semibold text-red-900",children:"Common Pitfall"}),e.jsx("p",{className:"text-sm text-red-800 mt-2",children:'"If we just increase the block size, we scale to 1000 TPS." No. A 10x larger block means 10x more data to download (DA bottleneck) and 10x more execution time (execution bottleneck). Centralization pressure increases because only large server farms can participate.'})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"1.2 The Composability Constraint"}),e.jsx("p",{className:"mb-3",children:"Atomic composability—the ability for tx A to call contract B which calls contract C and all changes finalize together—is a hidden scaling constraint."}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`Example: Atomic swap via DEX

Tx: User calls DEX.swap(UNI → ETH)
    → DEX calls USDC.transferFrom(user, DEX.vault)
         → USDC updates user.balance and vault.balance
    → DEX calls WETH.transfer(user, amount)
         → WETH updates DEX.balance and user.balance

All four state mutations happen atomically. If USDC succeeds
but WETH fails, the whole Tx reverts. Atomicity requires:

1. Mutual exclusion on shared state (UNI, USDC, WETH entries)
2. Total ordering (same Tx order for all validators)
3. Consensus (all validators agree on result)

If two Txs touch the same contract, they CANNOT be parallelized.
If you have 100 Txs all swapping USDC ↔ WETH, you can only
process them sequentially. No scaling.`})}),e.jsxs("p",{className:"text-sm",children:["The lesson: ",e.jsx("strong",{children:"Atomicity requires ordering and consensus"}),". You cannot have a scalable atomic system without a leader (sequencer) or complex conflict resolution. This is why L2s often keep a single sequencer (even if decentralized later)—it trivializes ordering."]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"1.3 On-Chain vs. Off-Chain Tradeoffs"}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`┌────────────────────────────────────────────────────────┐
│          Do More On-Chain                                │
├────────────────────────────────────────────────────────┤
│ ✓ Instant finality (L1 consensus)                       │
│ ✓ No dependency on off-chain actors (sequencer)         │
│ ✓ Censorship-resistant (protocol-level)                 │
│ ✗ Low throughput (execution bottleneck)                 │
│ ✗ High gas cost (pay for DA, state)                     │
│ ✗ Users lock liquidity in L1 (fragmentation)            │
│                                                          │
│                                                          │
│          Do More Off-Chain                               │
├────────────────────────────────────────────────────────┤
│ ✓ High throughput (no consensus needed locally)         │
│ ✓ Low cost (batch amortizes L1 cost)                    │
│ ✓ Unified liquidity (on L2)                             │
│ ✗ Latency for finality (wait for L1 batch)              │
│ ✗ Liveness risk (sequencer goes down)                   │
│ ✗ Dependency on bridge for exiting                      │
└────────────────────────────────────────────────────────┘`})}),e.jsx("p",{className:"text-sm",children:'Most systems do not live at extremes. Ethereum mainnet does "a lot on-chain" (high security, low throughput). Optimistic rollups do "most computation off-chain, settle periodically on L1." Validity rollups (ZK) add a cryptographic proof instead of consensus. Payment channels do nearly everything off-chain but require locked liquidity and complex logic for disputes.'})]}),e.jsxs("div",{className:"bg-gray-50 p-4 border rounded mt-6 mb-6",children:[e.jsx("p",{className:"font-semibold mb-3",children:"Quiz: Why Scaling is Hard"}),e.jsx(B,{sectionId:"why-hard",questions:S["why-hard"].questions,onSubmit:s=>E("why-hard",s),answers:o["why-hard"]||{},showAnswers:u})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>a("intro"),className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500",children:"← Back"}),e.jsx("button",{onClick:()=>a("l2-rollups"),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Next →"})]})]}):n==="l2-rollups"?e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"2. Layer 2 Rollups: Architecture & Security"}),e.jsxs("div",{className:"bg-green-50 border-l-4 border-green-500 p-4",children:[e.jsx("p",{className:"font-semibold text-green-900",children:"Key Takeaway"}),e.jsx("p",{className:"text-sm text-green-800 mt-2",children:"Rollups compress execution off-chain, post data and a commitment (fraud proof or validity proof) to L1. Optimistic rollups assume validity by default; ZK rollups prove it cryptographically. Both inherit L1 security, but differ in finality, prover complexity, and liveness assumptions."})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"2.1 Architecture Overview: Sequencer, Prover, Verifier"}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Users     │ Txs   │  Sequencer   │       │    L1       │
│  (L2 RPC)   │ ──→   │  (Builder)   │       │  (Verifier) │
└─────────────┘       └──────────────┘       └─────────────┘
                                                        │                      ▲
                                                        │ Batch (100 txs)      │
                                                        │ State Δ              │ Proof
                                                        ▼                      │
                                            ┌──────────────┐            │
                                            │   Prover     │ (Optional) │
                                            │   (ZK only)  │ ────────→  │
                                            └──────────────┘            │
                                                                                                    │
                                                        (Optimistic: skip     │
                                                         prover, submit batch,│
                                                         wait for challenge)  │


KEY ROLES:

1. Sequencer
     - Orders L2 txs
     - Executes them off-chain
     - Publishes batch + state root to L1
     - Receives L2 fees
     - Liveness: single point of failure (often centralized, initially)

2. Prover (ZK rollups only)
     - Generates ZK proof of batch validity
     - Computationally expensive (minutes to hours per batch)
     - Incentivized via proof market or operator

3. Verifier (on L1)
     - Checks fraud proof or validity proof
     - Updates canonical state root
     - Holds bridge contracts (locks/unlocks L1 assets)`})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"2.2 Optimistic Rollups: Fraud Proofs and the Challenge Window"}),e.jsx("p",{className:"mb-3",children:"An optimistic rollup assumes batches are valid by default. If an attacker tries to post an invalid batch, a challenger (anyone with the L2 data) can dispute it within a challenge window (typically 7 days)."}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`TIMELINE:

Day 0, Block 100:
    Sequencer posts batch #10: claim state root = 0x123
    Sequencer receives batch fee
    
Day 0-7: Challenge Window
    Challenger (anyone) can prove batch #10 invalid by:
    1. Downloading the L2 block data
    2. Re-executing the batch locally
    3. Computing correct state root (0x456)
    4. Submitting fraud proof on L1 showing 0x123 ≠ 0x456
    5. Engaging in dispute game (bisection, execution trace)
    
    If fraud proof is valid:
        - L1 verifier reverts the batch
        - Sequencer's bond is slashed
        - Challenger is rewarded
    
Day 7:
    If no valid fraud proof, batch is finalized
    Users can now withdraw to L1 safely
    
FINALITY TIMELINE:
    - Soft finality (sequencer promise): 1 sec (next block)
    - Hard finality (L1 batch + challenge): ~7 days
    - User perspective: very slow exit`})}),e.jsxs("p",{className:"text-sm mb-3",children:[e.jsx("strong",{children:"Security model:"})," An optimistic rollup is secure if at least one honest node exists that will challenge invalid batches. The honest node must have L2 data (data availability) and L1 block space to post the fraud proof. If DA is missing, even an honest node cannot challenge. If L1 is congested, proof may not land in time."]}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"Fraud proof mechanics:"})," Instead of re-executing the entire batch, optimistic rollups use ",e.jsx("em",{children:"interactive proof"})," (bisection): challenger and proposer narrow down which instruction caused the divergence, then one party re-executes it on L1. This saves L1 computation but requires multiple rounds."]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"2.3 ZK Rollups: Validity Proofs and Instant Finality"}),e.jsxs("p",{className:"mb-3",children:["A ZK rollup generates a ",e.jsx("em",{children:"SNARK"})," or ",e.jsx("em",{children:"STARK"})," proof that the batch was executed correctly. The proof is verified on L1. If the proof verifies, the batch is final—no challenge window."]}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`TIMELINE:

Block 0:
    Sequencer posts batch #10 + claims state root = 0x123
    Sequencer does NOT receive fee yet (no proof)
    
Block 0-10 (minutes):
    Prover generates ZK proof:
        - Encodes L2 execution as arithmetic circuit
        - Generates satisfying assignment (witness)
        - Creates SNARK/STARK proof (~100 KB, ~200 ms verify on L1)
    
Block 10:
    Prover submits proof to L1 contract
    Verifier checks proof: can only accept if proof is valid
    
Block 11 (L1 finality):
    L1 finalizes proof submission tx
    Batch is now FINAL and IMMUTABLE
    
FINALITY TIMELINE:
    - Soft finality: 1 sec (batch posted)
    - Hard finality: 12+ sec (batch + proof settled on L1)
    - Exit to L1: ~12 sec (compared to 7 days on optimistic!)

TRADE-OFFS vs. OPTIMISTIC:

✓ Instant finality (no challenge window)
✓ Users can exit 7 days faster
✗ Prover is expensive (SNARK/STARK computation)
✗ Prover complexity = attack surface (circuit bugs, cryptography)
✗ Requires a live prover (liveness risk just moved)
✓ No dispute game = no L1 re-execution needed
✓ Smaller L1 footprint (proof + state root, no data)`})}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"Cryptographic security:"})," A ZK rollup assumes the proof system is sound (no attacker can forge a proof) and the circuit is correct (no arithmetic bugs that allow invalid states to pass). Both are strong assumptions; real ZK circuits have been buggy, and proof systems have had implementation flaws (e.g., invalid curve arithmetic)."]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"2.4 Data Availability and Rollup Security"}),e.jsxs("div",{className:"bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-3",children:[e.jsx("p",{className:"font-semibold text-yellow-900",children:"Critical Assumption"}),e.jsx("p",{className:"text-sm text-yellow-800 mt-2",children:"Both optimistic and ZK rollups require L2 transaction data to be available to all users. If data is hidden, users cannot verify the state root or generate fraud proofs. The sequencer becomes a trusted custodian."})]}),e.jsxs("p",{className:"text-sm mb-3",children:[e.jsx("strong",{children:"On-chain data:"})," Rollups post full tx calldata to L1 (Ethereum). Cost is ~16 gas/byte (~68k transactions). Data is redundantly stored in L1 history forever. Users can retrieve it from L1 archives."]}),e.jsxs("p",{className:"text-sm mb-3",children:[e.jsx("strong",{children:"Data availability layers (DAL):"})," Newer L2s (e.g., Celestia, EigenLayer AVS) separate data availability from consensus. A DAL attests that data is available without storing it on Ethereum mainnet. This is cheaper but introduces new trust assumptions (DAL validators)."]}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"Missing data risk:"})," If the sequencer withholds data (and later goes offline), users cannot exit without the data. Some rollups add an escape hatch: after a timeout, users can exit on L1 using older state proofs. But this is complex and risky."]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"2.5 Bridges: Getting Assets On and Off L2"}),e.jsx("p",{className:"mb-3",children:"An L2 bridge allows users to lock assets on L1 and receive wrapped versions on L2 (deposit), and vice versa (withdrawal)."}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`DEPOSIT (L1 → L2):

User calls L1 Bridge.deposit(100 ETH)
    → Bridge locks 100 ETH in escrow
    → Emits event "DepositInitiated(100 ETH, destAddress)"
    → Sequencer observes event, mints 100 WETH on L2
    → User now has 100 WETH on L2
    → Instant (once Sequencer includes the mint tx)


WITHDRAWAL (L2 → L1):

User calls L2 Bridge.withdraw(100 WETH)
    → L2 contract burns 100 WETH
    → Emits event "WithdrawalInitiated(100 WETH, destAddress)"
    → Batch is posted to L1 (includes withdrawal)
    
Optimistic rollup:
    → Wait 7 days for challenge window to pass
    → Finality gadget confirms no fraud proof
    → Call L1 Bridge.finalize(proof_batch_#)
    → Bridge releases 100 ETH to user
    → Slow (7+ days)
    
ZK rollup:
    → Wait for proof to be posted (minutes)
    → L1 finalizes proof
    → Call L1 Bridge.finalize(proof_batch_#)
    → Bridge releases 100 ETH to user
    → Fast (minutes)`})}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"Key insight:"})," The bridge is the weakest link. It holds real assets (L1 side) and has a contract that mints wrapped versions (L2 side). If either is compromised, the entire L2's security is broken."]})]}),e.jsxs("div",{className:"bg-red-50 border-l-4 border-red-500 p-4",children:[e.jsx("p",{className:"font-semibold text-red-900",children:"Common Pitfall: Finality Confusion"}),e.jsxs("p",{className:"text-sm text-red-800 mt-2",children:[`"I submitted a ZK rollup proof on L1, so my L2 transaction is final." No. Your L2 tx is part of a batch that was final on L2 once the sequencer gave soft finality. But the L2's `,e.jsx("em",{children:"hard"})," finality (L1 proof) is separate. And to exit (withdraw), you must wait for both the batch to settle on L1 AND the exit proof to verify. Do not confuse soft, hard, and exit finality."]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"2.6 Failure Modes and Real-World Examples"}),e.jsxs("p",{className:"mb-3",children:[e.jsx("strong",{children:"Arbitrum Nitro (2021):"})," Optimistic rollup. Security model is sound. No major exploits. Sequencer centralized (Offchain Labs, initially), now moving to decentralized sequencing."]}),e.jsxs("p",{className:"mb-3",children:[e.jsx("strong",{children:"Optimism (2021):"})," Optimistic rollup. Early version had a bug allowing infinite minting via reentrancy on L1 exit. Fixed in Bedrock upgrade. Current version is secure, but long 7-day withdrawal window limits UX."]}),e.jsxs("p",{className:"mb-3",children:[e.jsx("strong",{children:"zkSync Era, StarkNet:"})," ZK rollups. Proof system is new (less battle-tested than ECDSA). Circuit bugs are a known risk. Both are still young."]}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"Lesson:"}),' Even "proven" architectures have bugs. Implementation matters more than design. Assume all L2s have risk; manage capital accordingly.']})]}),e.jsxs("div",{className:"bg-gray-50 p-4 border rounded mt-6 mb-6",children:[e.jsx("p",{className:"font-semibold mb-3",children:"Quiz: Layer 2 Rollups"}),e.jsx(B,{sectionId:"l2-rollups",questions:S["l2-rollups"].questions,onSubmit:s=>E("l2-rollups",s),answers:o["l2-rollups"]||{},showAnswers:u})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>a("why-hard"),className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500",children:"← Back"}),e.jsx("button",{onClick:()=>a("bridges"),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Next →"})]})]}):n==="bridges"?e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"3. Bridges and Cross-Chain Messaging: The Hardest Problem"}),e.jsxs("div",{className:"bg-green-50 border-l-4 border-green-500 p-4",children:[e.jsx("p",{className:"font-semibold text-green-900",children:"Key Takeaway"}),e.jsx("p",{className:"text-sm text-green-800 mt-2",children:"Cross-chain bridges are the top source of exploits in DeFi ($14B+ lost since 2021). Bridges must choose between security (depends on external validators/light-clients) and decentralization (many validators = hard to coordinate). Most production bridges sacrifice decentralization for speed. Map your threat model: who can steal funds, who can censor, what happens if a chain reorgs."})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"3.1 Bridge Models"}),e.jsx("p",{className:"mb-3",children:"Bridges differ in how they verify that an action happened on the source chain before minting wrapped tokens on the destination."}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-lg mb-2",children:"Model 1: Multisig/Validator Set"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`User: "Lock 100 USDC on Ethereum"
    → L1 Bridge contract: locks USDC
    → Emit event: "DepositInitiated(100 USDC, Polygon addr)"
    → 9 of 15 validators observe event on L1
    → Each signs message: "mint 100 USDC to Polygon addr"
    → One validator (relayer) collects 9 sigs, posts to Polygon
    → Polygon Bridge: verifies 9 sigs, mints 100 USDC
    → User receives wrapped USDC on Polygon

TRUST MODEL:
    - Assumes 8 of 15 validators are honest
    - Single compromised validator can be tolerated
    - 9 compromised → can mint unbacked tokens
    - Fast (seconds to minutes)
    - Centralized (depends on validator set)

EXAMPLES: WBTC (governance multisig), Luna Bridge (pre-collapse)`})})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-lg mb-2",children:"Model 2: Light Client / On-Chain Verification"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`User: "Lock 100 USDC on Ethereum"
    → L1 Bridge: locks USDC
    → Relayer observes event
    → Relayer constructs Merkle proof of event in L1 block
    → Relayer posts proof + block header to Polygon Bridge
    → Polygon Bridge: verifies header (against L1 consensus)
    → Polygon Bridge: verifies Merkle proof
    → Polygon Bridge: mints 100 USDC
    → User receives USDC (trustless!)

TRUST MODEL:
    - Assumes L1 consensus is live (validators do their job)
    - Bridge does not trust any L2 validators
    - Relayer is untrusted (can post old proofs or fake data)
    - But proof verification is cryptographic (cannot lie)
    - Slower (must wait for L1 finality, then Merkle proof)
    - More complex (light-client implementation)

SECURITY RISK:
    - Light-client bug: accept invalid headers
    - Relayer liveness: bridge is offline if relayer goes down
    - Proof replay: old proof accepted again (needs nonce)

EXAMPLES: IBC (Cosmos), Poly Network (pre-exploit), Wormhole`})})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-lg mb-2",children:"Model 3: Token Issuer / Canonical Bridge"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`If Polygon is "official," users trust Polygon's bridge for USDC.
Polygon's team runs validators and light-client.
USDC is minted on Polygon by an authorized Polygon account.

TRUST MODEL:
    - Assumes Polygon team is not malicious
    - Also assumes Polygon security (consensus)
    - Fastest (Polygon controls both sides)
    - Most centralized (one team decides security params)

EXAMPLES: Polygon's official bridge, Arbitrum's bridge`})})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"3.2 Lock-and-Mint vs. Burn-and-Mint"}),e.jsxs("p",{className:"mb-3",children:[e.jsx("strong",{children:"Lock-and-mint:"})," Original asset locked on source, wrapped minted on destination. If destination is compromised, attacker mints unbacked (but original asset is safe, locked)."]}),e.jsxs("p",{className:"mb-3",children:[e.jsx("strong",{children:"Burn-and-mint:"})," Original asset destroyed on source (burned), wrapped minted on destination. If destination is compromised, attacker mints unbacked. If source is compromised, attacker can burn legitimate user assets without them receiving wrapped tokens."]}),e.jsx("p",{className:"text-sm",children:"Both have tradeoffs. Lock-and-mint is more common for ERC20-to-ERC20 bridges. Burn-and-mint is used for L2 native tokens."})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"3.3 Message Ordering, Replay, and Domain Separation"}),e.jsx("p",{className:"mb-3",children:'Bridges do not just transfer assets; they relay messages. A message might be: "call this contract with this data." Without careful design, messages can be replayed (accepted twice) or reordered (executed in wrong order).'}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`ATTACK 1: SIMPLE REPLAY

Legitimate Tx:
    User signs: "I approve Bridge to use 100 USDC"
    Tx on Ethereum (chain ID 1)

Attacker replays the same signature:
    Same signature + data posted again
    Bridge accepts it (no nonce tracking)
    Attacker now has 200 USDC approved (or bridge minted twice)

Fix: Add nonce to message hash
    Signature includes: (amount, recipient, nonce, chainID)
    Bridge increments nonce after each message
    Replay is rejected (nonce already seen)


ATTACK 2: CROSS-CHAIN REPLAY

Legitimate Tx:
    Bridge message on Ethereum: "mint 100 WBTC on Polygon"
    (not signed with Ethereum chain ID)

Attacker waits for Ethereum to fork
    Same message is valid on Ethereum alternative fork
    Attacker extracts signature from fork, rebuilds proof
    Posts proof to Polygon claiming "mint 100 WBTC"
    If Polygon bridge does not validate source chain ID...
    Attacker gets 100 WBTC on Polygon too

Fix: Domain separation
    Message includes: source_chain_id, dest_chain_id, bridge_addr
    Proof verifies that source_chain_id matches Ethereum
    Fork cannot forge proof (would need fork's light-client state)


ATTACK 3: MESSAGE ORDERING

User submits two txs in sequence:
    Tx 1: "Swap 100 USDC for 50 WETH via bridge" (depends on liquidity)
    Tx 2: "Claim reward if balance > 100 WETH"

Relayer processes Tx 2 before Tx 1 (out of order)
    Tx 2 fails (balance is 0)
    Tx 1 succeeds later
    User is sad (expected atomic execution)

Fix: Sequence numbers
    Store nonce_user per user
    Message includes: user_nonce
    Bridge only executes if nonce = stored_nonce + 1
    Out-of-order messages are queued or rejected`})}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"Domain separation summary:"})," Include in message hash: source_chain_id, destination_chain_id, bridge_address, nonce, and optional version. This ensures a message is (a) not replayed on the same chain, (b) not accepted on a different chain, (c) not accepted by a different bridge."]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"3.4 Relayer and Guardian Models"}),e.jsx("p",{className:"mb-3",children:"Most bridges need someone (relayer) to post messages from source to destination. This introduces a liveness risk: if the relayer is offline, the bridge is broken."}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`RELAYER LIVENESS:

Scenario 1: Relayer is honest but offline
    User locks ETH → event emitted on Ethereum
    Relayer is down (hardware failure, DDoS, developer vacation)
    User cannot get Polygon side for hours/days
    => Asset is locked

Scenario 2: Relayer is malicious
    User locks ETH → event emitted
    Relayer censors the message (refuses to relay)
    Purpose: extortion, market manipulation, or just vandalism
    => Asset is locked

MITIGATION 1: Decentralized Relayers
    Multiple relayers, any one can relay (incentivized by fee)
    If one is down, another steps in
    Attacker must control all relayers to censor
    Cost: higher fee (multiple relayers share), complexity

MITIGATION 2: Guardian / Safety Net
    Separate set of validators (guardians) watch relayers
    If message is stuck for N blocks, guardian can force relay
    Adds latency (N block delay) but guarantees eventual delivery
    Requires guardian to be live and honest
    Example: Across Protocol

MITIGATION 3: User-Initiated Relay
    Users can relay their own messages if relayer is slow
    No fee if user relays
    Empowers user, but requires user to run infrastructure
    Most users will never relay (UX friction)`})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"3.5 Real-World Incident: Ronin Bridge (2022)"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto",children:e.jsx("pre",{children:`March 23, 2022: Ronin Bridge, $625M exploit

SETUP:
    Ronin Bridge: 9-of-15 validator multisig
    Validators are run by Sky Mavis (Axie Infinity team)
    Stores WETH and USDC on Ethereum side
    Stakes AXIE on Ronin side
    
ATTACK:
    Jan: Axis Security runs audit, finds no issues
    Feb: Attacker compromises 4 non-essential validators via API keys
             (developers left access credentials in unsecured repo)
    Mar 23: Attacker steals private keys of 4 validators
                 Collaborates with insider / compromises 1 more validator
                 Now controls 5 of 9 signers (quorum is 5 of 9)
    
    Attacker:
        1. Mints 173.6 WETH on Ronin side (fake withdrawal)
        2. Mints 25.5M USDC on Ronin side (fake withdrawal)
        3. Sells WETH on dexes for ~$500M
        4. Bridges USDC to Ethereum side (unwraps)
    
DETECTION:
    March 29: Chainalysis researcher notices unusual WETH transfers
    Ronin team does not auto-detect (no monitoring of validator-signed txs)
    ~$625M already gone
    
ROOT CAUSES:
    1. API keys were not in HSM/secure enclave
    2. Validator keys were in hot wallets (not in secure storage)
    3. No monitoring of bridge deposits/withdrawals
    4. 5-of-9 quorum is low (higher centralization risk)
    5. Ronin validators were not geographically diverse (easier to target)
    
RESPONSE:
    Ronin paused bridge (stopped deposits/withdrawals)
    Notified exchanges to freeze stolen WETH
    ~$500M recovered by law enforcement + exchange cooperation
    Users were compensated from Axie Infinity treasury
    
IMPROVEMENTS:
    - Moved validator keys to Fireblocks (HSM)
    - Retired old validators, added new ones
    - Implemented validator rotation
    - Added monitoring/alerting on bridges
    - Upgraded quorum to 8-of-12`})}),e.jsxs("p",{className:"text-sm mt-3",children:[e.jsx("strong",{children:"Lessons from Ronin:"})," (1) Key management is critical. Hot wallets are not enough. (2) Multisig validators need geographic diversity and isolation. (3) You cannot see an attack if you do not monitor. (4) Assume validator infrastructure will be targeted. (5) Decentralized bridges are not immune; they just change the attack surface."]})]}),e.jsxs("div",{className:"bg-red-50 border-l-4 border-red-500 p-4",children:[e.jsx("p",{className:"font-semibold text-red-900",children:"Common Pitfall: Magical Decentralization"}),e.jsx("p",{className:"text-sm text-red-800 mt-2",children:'"If we add 20 validators, the bridge is decentralized and safe." No. You have 20 new attack surfaces (each validator key is a potential compromise). You have 20 operators to coordinate (slower governance). Most "decentralized" bridges still have a core team with master keys. Decentralization is not magical; it requires discipline, infrastructure, and incentives.'})]}),e.jsxs("div",{className:"bg-gray-50 p-4 border rounded mt-6 mb-6",children:[e.jsx("p",{className:"font-semibold mb-3",children:"Quiz: Bridges and Cross-Chain Messaging"}),e.jsx(B,{sectionId:"bridges",questions:S.bridges.questions,onSubmit:s=>E("bridges",s),answers:o.bridges||{},showAnswers:u})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>a("l2-rollups"),className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500",children:"← Back"}),e.jsx("button",{onClick:()=>a("product-guidance"),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Next →"})]})]}):n==="product-guidance"?e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"4. Product and Engineering Guidance: When to Scale"}),e.jsxs("div",{className:"bg-green-50 border-l-4 border-green-500 p-4",children:[e.jsx("p",{className:"font-semibold text-green-900",children:"Key Takeaway"}),e.jsx("p",{className:"text-sm text-green-800 mt-2",children:"Scaling should not be a goal; it should be a solution to a specific problem. Measure first (cost, latency), then decide. L2 and bridges solve different problems; they introduce new operational and security risks. Most teams should NOT deploy L2s until gas costs become a hard blocker, TVL justifies the engineering investment, and they have incident response capability."})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"4.1 Quantifying the Problem: Gas, Latency, and UX"}),e.jsx("p",{className:"mb-3",children:"Before scaling, measure the problem. Three metrics matter:"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`METRIC 1: Gas cost per transaction

L1 Ethereum (as of 2024):
    Simple ERC20 transfer: ~21k gas @ 50 gwei = $0.05 - $1 (depends on network)
    DEX swap (UniswapV3): ~30-50k gas = $0.50 - $5+
    Complex DeFi (borrow, collateral): ~100k gas = $1 - $10+

L2 Optimistic Rollup (Arbitrum, Optimism):
    Simple swap: 3-5k gas × 50 gwei + batch cost = $0.01 - $0.05
    Same swap: 10-20x cheaper than L1

L2 ZK Rollup (zkSync, StarkNet):
    Simple swap: 1-2k gas + proof cost = $0.01 - $0.02
    Same swap: 50-100x cheaper than L1

DECISION: If user pays > $1 per transaction, consider L2. If < $0.10, L1 is fine.


METRIC 2: Latency / Finality

L1 Ethereum:
    Soft finality (next block): ~12 sec
    Hard finality (Casper): ~48 min (6.4 epochs)
    But in practice: users accept after 1 sec (optimistic)

L2Optimistic Rollup:
    Soft finality (sequencer): ~1 sec
    Hard finality (L1 batch + challenge): 7+ days (oof)
    For withdrawal: 7+ days
    For users: 1 sec feels fast, but exiting is slow

L2 ZK Rollup:
    Soft finality (sequencer): ~1 sec
    Hard finality (proof onL1): ~5 min
    For withdrawal: ~5 min
    Much better UX

DECISION: If users need < 5 sec finality, L2 is OK. If they need to exit in < 1 hour, avoid optimistic.


METRIC 3: TVL / Liquidity

L1 Ethereum:
    One pool, all liquidity in one place
    Deep liquidity, low slippage
    Example: USDC/ETH $50B liquidity

L2 Fragmented:
    Separate USDC/ETH pool on Arbitrum, Optimism, zkSync
    Each has ~$100M liquidity
    High slippage on each, can differ by 5-10%
    Users must choose which L2 to trade on

DECISION: If TVL < $10M and slippage is unbearable, consolidate on L1. If TVL > $100M, fragment is OK.`})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"4.2 Operational Costs: The Hidden Expense"}),e.jsx("p",{className:"mb-3",children:"Scaling introduces operational costs that are not always visible:"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`COST 1: Support and Education

Users do not understand L2.
"Why is my withdrawal taking 7 days?" (optimistic rollup)
"How do I bridge my tokens to Arbitrum?" (technical, error-prone)
"My transaction failed, refund my $0.50 transaction fee" (now they cost you $5 in support)

Support overhead: 2-3 FTE per L2 (for a mid-size exchange/DEX)
Cost: $200k-300k/year per person = $600k-900k/year

Mitigation: Hire L2 experts, write docs, build UX that hides L2 complexity


COST 2: Bridge Infrastructure

Monitoring, relayers, guardians, HSMs, upgrades
    Professional bridge setup: $50k-500k initial + $30k/month ops
    Off-the-shelf bridge: Free, but you depend on someone else's security

Incident response:
    Bridge hacks happen. You must be ready to pause, investigate, compensate.
    One Ronin-style incident can cost > $1M in losses + reputation
    You need: incident response plan, on-call rotations, legal counsel

Cost: $500k+ for serious bridge infrastructure


COST 3: Sequencer & Prover Infrastructure

If you run your own L2 (rare, expensive):
    Sequencer: $50k-500k/month (depends on hardware + reliability)
    Prover (ZK): $100k-500k/month (PC hardware, cloud compute)
    Validators: $20k-100k/month each (distributed validators)

If you use managed service (Alchemy, Infura):
    Still $10k-50k/month for serious traffic


COST 4: Regulatory & Compliance

Bridges are sexy targets for regulators.
May need to comply with AML/KYC for cross-chain transfers.
Legal cost: $100k-500k for analysis + $50k/month for ongoing compliance
(varies by jurisdiction)


TOTAL FIRST-YEAR COST: $1M-3M for a serious multi-chain operation
Compare to: average DEX makes $1-10M/year in fees

=> Scaling is only worth it if revenue justifies it`})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"4.3 Decision Framework: Should We Scale?"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`QUESTION 1: Are users complaining about gas cost?
    YES  → Measure: avg tx cost >= $1 per user?
                     YES  → Scale (L2 or reduce on-chain operations)
                     NO   → Problem is perception, not reality (educate, don't scale)
    NO   → Do not scale (no problem to solve)

QUESTION 2: Is your TVL > $50M?
    YES  → Scaling may pay for itself (ops cost is % of TVL)
                 Proceed with engineering assessment
    NO   → Scaling is too expensive per unit TVL
                 Only scale if Q1 = YES and ops overhead is <10% of fee revenue

QUESTION 3: Do you have a team that can manage L2 + bridge risk?
    YES  → Dedicated IRP, on-call, monitoring, incident playbook
    NO   -> Do not deploy (you will regret it)

QUESTION 4: Are you OK with complexity?
    YES  -> Pick L2 model (optimistic for decentralization, ZK for finality)
    NO   -> Use third-party bridge (Across, Stargate, Wormhole)
                    Lower control, higher trust, less complexity

DECISION TREE:

Q1 YES + Q2 YES + Q3 YES + Q4 YES
    → Build canonical L2 bridge (full commitment)
    → 18-36 month project, $2-5M investment

Q1 YES + Q2 YES + Q3 YES + Q4 NO
    → Integrate third-party bridge (Across, Stargate, Wormhole)
    → 3-6 month project, $200k investment
    → Accept: 0.1-0.5% bridging fee, third-party security risk

Q1 YES + Q2 NO + Q3 YES
    → Deploy to L2, use existing bridge and liquidity aggregator
    → No bridge ops, just serve existing L2 infrastructure
    → Cost: $50-200k integration

Q1 NO or Q2 NO
    → Do not scale
    → Focus on product and user experience on L1`})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"4.4 Monitoring and Incident Response"}),e.jsx("p",{className:"mb-3",children:"If you scale, assume something will break. Build an incident response capability:"}),e.jsx("div",{className:"bg-gray-100 p-3 font-mono text-xs overflow-x-auto mb-3",children:e.jsx("pre",{children:`MONITORING CHECKLIST:

Bridge Health:
    [ ] Sequencer liveness (posting batches every N blocks)
    [ ] Batch finality (does proof settle on L1?)
    [ ] Relayer health (messages relayed within SLA)
    [ ] Validator/signer key health (HSM operational?)

Asset Health:
    [ ] Deposit/withdrawal volume trending
    [ ] Stuck messages (older than SLA threshold)
    [ ] Suspicious minting (unexpected supply increase)
    [ ] Unusual token flows (wash trades? attacks?)

Operational Health:
    [ ] L1 gas prices (affects batch cost)
    [ ] Prover performance (proof submission latency)
    [ ] Storage/state size (bloat detect)
    [ ] Error rates (contract failures, reverts)


INCIDENT RESPONSE TEMPLATE:

Severity 1 (Critical: funds at risk):
    - Freeze bridge (pause deposits/withdrawals) within 5 min
    - Alert incident commander + all team leads
    - Establish war room (Slack, video call)
    - Investigate root cause (parallel)
    - Prepare public statement (draft in 30 min)
    - Determine mitigation (upgrade, rollback, manual recovery)
    
Severity 2 (High: partial service down):
    - Notify support team + incident manager
    - Investigate within 30 min
    - Public status update within 1 hour
    - ETA for fix
    
Severity 3 (Medium: degraded performance):
    - Log incident, monitor closely
    - Fix in next release or urgent hotfix


COMMUNICATION:
    [ ] Twitter status (within 30 min of discovery)
    [ ] Blog post (within 2-4 hours with technical details)
    [ ] Discord/community outreach
    [ ] Major trader/institutional customers (direct notification)
    [ ] Law enforcement (if funds stolen, ASAP)
    
POST-INCIDENT (24 hours after resolution):
    [ ] Root cause analysis (RCA)
    [ ] Action items (prevent recurrence)
    [ ] Compensation plan (if users lost funds)
    [ ] Timeline: when will each fix be deployed`})})]}),e.jsxs("div",{className:"bg-red-50 border-l-4 border-red-500 p-4",children:[e.jsx("p",{className:"font-semibold text-red-900",children:"Common Pitfall: Insufficient Monitoring"}),e.jsx("p",{className:"text-sm text-red-800 mt-2",children:'"We deployed bridge, but did not set up monitoring." Ronin learned this the hard way. The exploit was not detected for 6 days because no one was watching the bridge. By then, $625M was gone. Do not assume "nothing bad will happen." Implement monitoring before you launch.'})]}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>a("bridges"),className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500",children:"← Back"}),e.jsx("button",{onClick:()=>a("lab"),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Next →"})]})]}):n==="lab"?e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"5. Hands-On Lab: Measuring Costs, Latency, and Building Risk Registers"}),e.jsx("p",{className:"mb-4",children:"In this lab, you will measure real costs and latencies across L1 and L2, then build a risk register for a sample bridge. Use the templates provided or tools like Etherscan, L2Beat, and Tenderly."}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Lab 1: Cost and Latency Measurements"}),e.jsxs("div",{className:"bg-blue-50 p-4 border-l-4 border-blue-500 mb-4",children:[e.jsx("p",{className:"font-semibold text-blue-900",children:"Objective"}),e.jsx("p",{className:"text-sm text-blue-800",children:"Compare gas costs and finality latency for a simple transaction (ERC20 transfer) across L1 (Ethereum), L2 optimistic (Arbitrum, Optimism), and L2 ZK (zkSync)."})]}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto mb-4",children:e.jsx("pre",{children:`STEP 1: PREPARE TESTNET ACCOUNTS

1.1 Get ETH on testnet (Sepolia, Goerli, Mumbai, Sepolia Arbitrum, etc.)
        Use faucet: https://faucet.sepolia.dev
        Amount: 0.5 ETH per network (enough for ~10 txs)

1.2 Deploy a test ERC20 token on L1 testnet
        Contract code (Solidity):
        
        pragma solidity 0.8.0;
        contract TestToken is ERC20 {
                constructor() ERC20("TestToken", "TST") {
                        _mint(msg.sender, 1000000 ether);
                }
        }
        
        Deploy on Sepolia via Remix or Hardhat
        Record token address (L1)

1.3 Bridge tokens to L2 using canonical bridge
        Arbitrum: Use Arbitrum Portal (bridge.arbitrum.io)
        Optimism: Use Optimism Gateway (app.optimism.io/bridge)
        zkSync: Use zkSync Portal (portal.zksync.io)
        Bridge 100 TST to each L2
        Wait for confirmation


STEP 2: MEASURE GAS COSTS

2.1 Execute simple ERC20 transfer on L1
        Tool: Remix IDE or Hardhat
        Code: token.transfer(recipient, 1 ether)
        
        Record:
            - Gas used (from Etherscan receipt)
            - Gas price (from receipt)
            - Total cost in ETH: gas * price / 10^9
            - Total cost in USD: ETH_amount * current_ETH_price
        
        Example:
            Gas used: 45000
            Gas price: 50 gwei
            Cost: 45000 * 50 / 10^9 = 0.00225 ETH
            @ $2500 ETH = $5.62

2.2 Execute same transfer on L2 Optimistic (Arbitrum)
        Change RPC to: https://rpc.arbitrum.io
        Execute same code
        
        Record:
            - L2 gas used
            - L2 gas price
            - L2 cost
            - (Arbitrum also posts calldata to L1, but that's baked into fee)
        
        Typical result: 2-5x cheaper than L1

2.3 Execute on L2 ZK (zkSync)
        Change RPC to: https://mainnet.era.zksync.io
        Execute same code
        
        Record: same as 2.2
        
        Typical result: 10-50x cheaper than L1

2.4 Summarize in table:

        ┌─────────────────────────────────────────────┐
        │ L1 (Ethereum):             $5.62            │
        │ L2 Optimistic (Arbitrum):  $0.40 (12.5x)   │
        │ L2 ZK (zkSync):            $0.10 (56x)      │
        └─────────────────────────────────────────────┘


STEP 3: MEASURE LATENCY

3.1 L1 Finality (Ethereum Sepolia)
        Concept: time from tx submission to L1 consensus finality
        
        Method:
            - Submit transfer tx, record timestamp (T0)
            - Poll Etherscan API for receipt (until confirmed)
            - Record block number (B_start)
            - Wait for ~12.8 minutes (6.4 epochs * 12 sec, Casper finality)
            - Record when tx is finalized (T_finality)
            - Latency = T_finality - T0
        
        Alternative (simplified): Wait for 5 confirmations (~60 sec)
        
        Typical result: 1-2 min soft finality, ~13 min hard finality

3.2 L2 Optimistic Finality (Arbitrum One Testnet)
        Concept: time for soft finality (sequencer) + hard finality (L1 batch)
        
        Method:
            - Submit transfer tx on L2, record timestamp (T0)
            - Poll Arbitrum RPC for receipt (usually <1 sec)
            - That's soft finality
            - For hard finality: wait for sequencer batch to settle on L1
                (Arbitrum posts batches every ~1-2 minutes)
            - Check Arbitrum Explorer or Etherscan for batch settlement
            - Record T_hard_finality
            - Hard finality latency: T_hard_finality - T0
        
        Typical result:
            - Soft: <1 sec
            - Hard: 1-2 minutes
            - BUT for withdrawals: 7 days (challenge window)

3.3 L2 ZK Finality (zkSync Era Testnet)
        Concept: time for soft finality + proof generation + verification on L1
        
        Method:
            - Submit tx on L2, record T0
            - Poll for receipt (soft finality, <1 sec)
            - Wait for prover to generate proof (~2-5 min per batch)
            - Proof is submitted to L1
            - Wait for L1 confirmation of proof tx (~12 sec)
            - Record T_proof_finality
            - Latency: T_proof_finality - T0
        
        Typical result:
            - Soft: <1 sec
            - Hard: 2-10 minutes
            - Much better for withdrawals

3.4 Summary table:

        ┌──────────────────────────────────────────┐
        │        Soft Finality  Hard Finality       │
        ├──────────────────────────────────────────┤
        │ L1          ~1 sec        ~13 min         │
        │ Optimistic  <1 sec        1-2 min*        │
        │ ZK          <1 sec        2-10 min        │
        │                                          │
        │ * Optimistic 7+ days for withdrawals    │
        └──────────────────────────────────────────┘

3.5 Withdrawal latency
        For optimistic rollup:
            - Submit withdrawal on L2
            - Wait 7 days
            - Call finalize on L1
            - Wait ~1 min confirmationon L1
            - Total: 7 days + 1 min
        
        For ZK rollup:
            - Submit withdrawal on L2
            - Wait for proof (2-10 min)
            - Call finalize on L1
            - Wait ~1 min confirmation on L1
            - Total: ~10-15 min`})}),e.jsxs("p",{className:"text-sm mt-4 mb-4",children:[e.jsx("strong",{children:"Deliverable:"})," Fill out the template below and record your measurements."]}),e.jsx(X,{})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Lab 2: Risk Register for Cross-Chain Features"}),e.jsxs("div",{className:"bg-blue-50 p-4 border-l-4 border-blue-500 mb-4",children:[e.jsx("p",{className:"font-semibold text-blue-900",children:"Objective"}),e.jsx("p",{className:"text-sm text-blue-800",children:"Build a risk register for a sample bridge (lock-and-mint ERC20 bridge from Ethereum to a hypothetical L2, with a multisig validator set). Identify threats, quantify likelihood and impact, and propose mitigations."})]}),e.jsx("p",{className:"text-sm mb-4",children:"Use the template below. For each row, assess: likelihood (how plausible?), impact (what is the damage if it happens?), detection signals (how would we know?), and mitigations (how do we reduce risk?)."}),e.jsx(Q,{rows:d,setRows:b}),e.jsxs("div",{className:"mt-4 p-4 bg-gray-50 border rounded",children:[e.jsx("p",{className:"font-semibold mb-2",children:"Template: Add New Risk"}),e.jsx("textarea",{placeholder:`Asset: ...
Threat: ...
Attack Path: ...
Likelihood: ...
Impact: ...
Detection Signal: ...
Mitigation: ...
Residual Risk: ...
Owner: ...`,className:"w-full p-2 border rounded text-xs font-mono",rows:10,onKeyPress:s=>{var g,w,y,k,C,v,N,M,T,D,O,U,H,z,q,F,K,W;if(s.key==="Enter"&&s.ctrlKey){const j=s.currentTarget.value.split(`
`).filter(R=>R.trim()),V={id:Math.max(...d.map(R=>R.id),0)+1,asset:((w=(g=j[0])==null?void 0:g.split(":")[1])==null?void 0:w.trim())||"",threat:((k=(y=j[1])==null?void 0:y.split(":")[1])==null?void 0:k.trim())||"",attackPath:((v=(C=j[2])==null?void 0:C.split(":")[1])==null?void 0:v.trim())||"",likelihood:((M=(N=j[3])==null?void 0:N.split(":")[1])==null?void 0:M.trim())||"",impact:((D=(T=j[4])==null?void 0:T.split(":")[1])==null?void 0:D.trim())||"",detectionSignal:((U=(O=j[5])==null?void 0:O.split(":")[1])==null?void 0:U.trim())||"",mitigation:((z=(H=j[6])==null?void 0:H.split(":")[1])==null?void 0:z.trim())||"",residualRisk:((F=(q=j[7])==null?void 0:q.split(":")[1])==null?void 0:F.trim())||"",owner:((W=(K=j[8])==null?void 0:K.split(":")[1])==null?void 0:W.trim())||""};b([...d,V]),s.currentTarget.value=""}}})]})]}),e.jsxs("div",{className:"mt-6",children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Challenge Extension: Message Format with Domain Separation"}),e.jsx("p",{className:"mb-3",children:"For advanced learners: Design a minimal cross-chain message format that includes replay protection and domain separation. Pseudocode:"}),e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-x-auto",children:e.jsx("pre",{children:`// Minimal cross-chain message format

struct CrossChainMessage {
    sourceChainId: uint256,      // e.g., 1 (Ethereum)
    destChainId: uint256,        // e.g., 42161 (Arbitrum)
    sourceBridgeAddr: address,   // Ethereum bridge contract
    destBridgeAddr: address,     // Arbitrum bridge contract
    nonce: uint256,              // Per-user nonce, prevent replay
    userAddr: address,           // User executing tx
    targetContract: address,     // Where to send payload on dest
    payload: bytes,              // Calldata
    timestamp: uint256,          // When created (for timeout)
}

// Domain separator (prevent replay on different context)
domainSeparator = keccak256(abi.encodePacked(
    "CROSS_CHAIN_BRIDGE_V1",      // Schema version
    sourceChainId,
    sourceBridgeAddr,
    destChainId,
    destBridgeAddr
))

// Message hash (what users sign)
messageHash = keccak256(abi.encodePacked(
    domainSeparator,
    userAddr,
    nonce,
    sourceChainId,
    destChainId,
    targetContract,
    payload,
    timestamp
))

// On source chain (Ethereum):
// User signs messageHash with their private key
signature = sign(messageHash, privateKey)

// Relay submits signature + message to destination chain
// On destination chain:
// 1. Verify sourceChainId & destChainId in message match current context
// 2. Verify signature matches userAddr
// 3. Verify nonce is new (hasn't been used before)
// 4. Verify timestamp is recent (< 10 minutes old)
// 5. Execute payload on targetContract
// 6. Increment nonce for userAddr

EXERCISE:
    a) Implement verification logic in Solidity
    b) Test that a message signed on Ethereum cannot be replayed on Polygon
    c) Test that an attacker cannot change the payload after signing
    d) Test that a message with old timestamp is rejected`})})]}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>a("product-guidance"),className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500",children:"← Back"}),e.jsx("button",{onClick:()=>a("tabletop"),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Next →"})]})]}):n==="tabletop"?e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"6. Bridge Incident Tabletop Exercise"}),e.jsx("p",{className:"mb-4",children:"Work through a simulated bridge exploit scenario. Choose your bridge model, respond to security failures, and draft incident communications. This is text-based and collaborative."}),e.jsx(J,{scenario:_,currentStep:p,onNextStep:()=>c(p+1),onPrevStep:()=>c(Math.max(0,p-1))}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>a("lab"),className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500",children:"← Back"}),e.jsx("button",{onClick:()=>a("final-assessment"),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Next →"})]})]}):n==="final-assessment"?(t||P(),e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"7. Final Assessment"}),e.jsx("p",{className:"mb-4",children:"Answer the following questions to test your understanding. These cover conceptual knowledge and scenario-based reasoning."}),e.jsx(ee,{questions:S["final-assessment"].questions,onSubmit:s=>{E("final-assessment",s);const g=P();i(g)},answers:o["final-assessment"]||{},showAnswers:u,score:t}),t&&e.jsxs("div",{className:"bg-blue-50 p-4 border-l-4 border-blue-500",children:[e.jsx("p",{className:"font-semibold text-blue-900 mb-2",children:"Score Summary"}),e.jsxs("p",{className:"text-sm text-blue-800",children:["You scored ",e.jsx("strong",{children:t.correct})," of"," ",e.jsx("strong",{children:t.total})," (",t.percentage,"%)"]}),t.percentage>=80&&e.jsx("p",{className:"text-sm text-green-800 mt-2 font-semibold",children:"✓ Excellent! You have strong grasp of scaling and interoperability concepts."}),t.percentage>=60&&t.percentage<80&&e.jsx("p",{className:"text-sm text-yellow-800 mt-2 font-semibold",children:"Good progress! Review weak areas below."}),t.percentage<60&&e.jsx("p",{className:"text-sm text-red-800 mt-2 font-semibold",children:"Keep studying. Revisit sections where you struggled."})]}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>a("tabletop"),className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500",children:"← Back"}),t&&e.jsx("button",{onClick:()=>{i(null),l({}),c(0),a("intro")},className:"px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",children:"Reset and Start Over"})]}),e.jsxs("div",{className:"mt-8 pt-8 border-t",children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Further Reading and References"}),e.jsxs("div",{className:"text-sm space-y-2",children:[e.jsx("p",{children:e.jsx("strong",{children:"L1 Scaling Literature:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-2",children:[e.jsx("li",{children:"Ethereum Roadmap: https://ethereum.org/en/roadmap/"}),e.jsx("li",{children:'Vitalik Buterin: "Endgame" (L2 centralization risks): https://vitalik.eth.limo/general/2024/05/09/endgame.html'})]}),e.jsx("p",{className:"mt-4",children:e.jsx("strong",{children:"Rollups:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-2",children:[e.jsx("li",{children:"The Optimism Bedrock Upgrade Explanation: https://blog.optimism.io/introducing-bedrock/"}),e.jsx("li",{children:"StarkWare ZK Rollup Architecture: https://docs.starkware.co/starkex/index.html"}),e.jsx("li",{children:"Arbitrum Nitro: https://offchain.medium.com/arbitrum-nitro-rollup-architecture-7c89989dafb"})]}),e.jsx("p",{className:"mt-4",children:e.jsx("strong",{children:"Bridges and Cross-Chain:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-2",children:[e.jsx("li",{children:"CrossChain Risk Framework (Chainalysis): https://go.chainalysis.com/l/476392/2023-10-11/d476nb"}),e.jsx("li",{children:"Ronin Bridge Exploit Post-Mortem (Sky Mavis): https://ronin.co/news/ronin-bridge-post-mortem"}),e.jsx("li",{children:"Poly Network Exploit Analysis (CertiK): https://www.certik.com/blog/post/poly-network-hack-4-root-causes-analysis"})]}),e.jsx("p",{className:"mt-4",children:e.jsx("strong",{children:"Operational Security:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-2",children:[e.jsx("li",{children:"HSM Best Practices (Fireblocks): https://www.fireblocks.com/blog/"}),e.jsx("li",{children:"OWASP Cryptocurrency & Blockchain Security: https://owasp.org/www-community/attacks/"})]})]})]})]})):null;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:G+Z}),e.jsxs("div",{style:{display:"flex",height:"100vh",background:m.bg0,color:m.text,overflow:"hidden"},children:[e.jsxs("div",{style:{width:218,background:m.bg1,borderRight:`1px solid ${m.border}`,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"},children:[e.jsxs("div",{style:{padding:"18px 16px 14px",borderBottom:`1px solid ${m.border}`},children:[e.jsx("div",{style:{fontFamily:m.mono,fontSize:8,color:m.textMuted,letterSpacing:"0.24em",textTransform:"uppercase",marginBottom:8},children:"ACM Educational Series"}),e.jsx("div",{style:{fontFamily:m.disp,fontSize:13,fontWeight:700,color:m.textBright,lineHeight:1.25,letterSpacing:"0.05em"},children:"Scaling & Interop"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginTop:10},children:[e.jsx("div",{style:{width:5,height:5,borderRadius:"50%",background:m.cyan,animation:"blink 1.8s ease infinite"}}),e.jsx("span",{style:{fontFamily:m.mono,fontSize:9,color:m.textMuted},children:"Chapter 13  Live"})]})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("p",{className:"text-xs font-semibold text-gray-600 uppercase",children:"Progress"}),e.jsx("div",{className:"w-full bg-gray-300 rounded-full h-2 mt-2",children:e.jsx("div",{className:"bg-blue-600 h-2 rounded-full transition-all duration-300",style:{width:`${r}%`}})}),e.jsxs("p",{className:"text-xs text-gray-600 mt-1",children:[r,"% Complete"]})]}),e.jsx("nav",{style:{flex:1,overflowY:"auto",padding:"6px 0"},children:I.map((s,g)=>e.jsxs("button",{onClick:()=>a(s.id),style:{width:"100%",padding:"9px 14px",background:n===s.id?m.cyanFaint:"none",border:"none",borderLeft:`3px solid ${n===s.id?m.cyan:"transparent"}`,cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center",transition:"all 0.15s"},children:[e.jsx("span",{style:{fontFamily:m.mono,fontSize:9,color:n===s.id?m.cyan:m.textMuted,minWidth:22},children:g+1}),e.jsx("span",{style:{fontFamily:m.body,fontSize:12,color:n===s.id?m.textBright:m.textMuted,lineHeight:1.3},children:s.label})]},s.id))}),e.jsxs("div",{className:"mt-8 pt-4 border-t space-y-2",children:[e.jsxs("label",{className:"flex items-center text-sm",children:[e.jsx("input",{type:"checkbox",checked:L,onChange:s=>A(s.target.checked),className:"mr-2"}),e.jsx("span",{children:"Instructor Mode"})]}),L&&e.jsx("button",{onClick:()=>f(!u),className:"w-full px-3 py-2 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700",children:u?"Hide Answers":"Show Answers"}),e.jsx("button",{onClick:()=>{a("intro"),l({}),i(null),c(0)},className:"w-full px-3 py-2 text-xs bg-gray-400 text-white rounded hover:bg-gray-500",children:"Reset Activity"})]})]}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"38px 46px",maxWidth:860,margin:"0 auto",width:"100%"},children:e.jsx("div",{className:"m4",children:Y()})})]})]})},B=({sectionId:n,questions:a,onSubmit:r,answers:h,showAnswers:o})=>{const[l,u]=x.useState(h),f=(i,p)=>{u(c=>({...c,[i]:p}))},t=(i,p)=>{u(c=>{var L;const d=((L=c[i])==null?void 0:L.selected)||[],b=d.includes(p)?d.filter(A=>A!==p):[...d,p];return{...c,[i]:{selected:b}}})};return e.jsxs("div",{className:"space-y-6",children:[a.map(i=>{var p;return e.jsxs("div",{className:"bg-white p-4 border rounded",children:[e.jsx("p",{className:"font-semibold text-sm mb-3",children:i.text}),i.type==="multiple-choice"&&e.jsx("div",{className:"space-y-2",children:i.options.map((c,d)=>{var b;return e.jsxs("label",{className:"flex items-start cursor-pointer",children:[e.jsx("input",{type:"radio",name:i.id,value:d,checked:(((b=l[i.id])==null?void 0:b.selected)||-1)===d,onChange:()=>f(i.id,{selected:d}),className:"mt-1 mr-2"}),e.jsx("span",{className:"text-sm",children:c.text})]},d)})}),i.type==="multi-select"&&e.jsx("div",{className:"space-y-2",children:i.options.map((c,d)=>{var b;return e.jsxs("label",{className:"flex items-start cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:(((b=l[i.id])==null?void 0:b.selected)||[]).includes(d),onChange:()=>t(i.id,d),className:"mt-1 mr-2"}),e.jsx("span",{className:"text-sm",children:c.text})]},d)})}),i.type==="short-answer"&&e.jsx("textarea",{value:((p=l[i.id])==null?void 0:p.text)||"",onChange:c=>f(i.id,{text:c.target.value}),placeholder:"Type your answer...",className:"w-full p-2 border rounded text-sm",rows:3}),o&&e.jsxs("div",{className:"mt-4 p-3 bg-green-50 border-l-2 border-green-500 text-xs text-green-800",children:[e.jsx("p",{className:"font-semibold",children:"Answer Explanation:"}),e.jsx("p",{className:"mt-1",children:i.explanation})]})]},i.id)}),e.jsx("button",{onClick:()=>r(l),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm",children:"Submit Answers"})]})},X=()=>{const[n,a]=x.useState({l1_gas:"",l1_price:"",l1_usd:"",arb_gas:"",arb_price:"",arb_usd:"",zk_gas:"",zk_price:"",zk_usd:"",l1_finality:"",arb_finality:"",zk_finality:""});return e.jsxs("div",{className:"bg-gray-50 p-4 border rounded",children:[e.jsx("p",{className:"font-semibold mb-4",children:"Cost Measurements (Fill in your results)"}),e.jsx("div",{className:"grid grid-cols-3 gap-4 text-xs mb-6",children:[{label:"L1 Gas Used",key:"l1_gas"},{label:"L1 Gas Price (gwei)",key:"l1_price"},{label:"L1 Cost (USD)",key:"l1_usd"},{label:"Arbitrum Gas",key:"arb_gas"},{label:"Arbitrum Price (gwei)",key:"arb_price"},{label:"Arbitrum Cost (USD)",key:"arb_usd"},{label:"zkSync Gas",key:"zk_gas"},{label:"zkSync Price (gwei)",key:"zk_price"},{label:"zkSync Cost (USD)",key:"zk_usd"}].map(({label:r,key:h})=>e.jsxs("div",{children:[e.jsx("label",{className:"block font-semibold mb-1",children:r}),e.jsx("input",{type:"text",value:n[h],onChange:o=>a(l=>({...l,[h]:o.target.value})),className:"w-full p-2 border rounded",placeholder:"0"})]},h))}),e.jsx("p",{className:"font-semibold mb-4",children:"Latency Measurements (seconds)"}),e.jsx("div",{className:"grid grid-cols-3 gap-4 text-xs",children:[{label:"L1 Soft Finality (sec)",key:"l1_finality"},{label:"Arbitrum Hard Finality (sec)",key:"arb_finality"},{label:"zkSync Hard Finality (sec)",key:"zk_finality"}].map(({label:r,key:h})=>e.jsxs("div",{children:[e.jsx("label",{className:"block font-semibold mb-1",children:r}),e.jsx("input",{type:"text",value:n[h],onChange:o=>a(l=>({...l,[h]:o.target.value})),className:"w-full p-2 border rounded",placeholder:"0"})]},h))}),e.jsx("button",{onClick:()=>{alert(`Results saved:
`+JSON.stringify(n,null,2))},className:"mt-4 px-4 py-2 bg-green-600 text-white rounded text-xs hover:bg-green-700",children:"Save Measurements"})]})},Q=({rows:n,setRows:a})=>e.jsxs("div",{className:"overflow-x-auto bg-gray-50 border rounded p-4 mb-4",children:[e.jsxs("table",{className:"w-full text-xs border-collapse",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-gray-200",children:["Asset","Threat","Attack Path","Likelihood","Impact","Detection","Mitigation","Residual","Owner"].map(r=>e.jsx("th",{className:"border p-2 text-left",children:r},r))})}),e.jsx("tbody",{children:n.map(r=>e.jsxs("tr",{className:"border-b hover:bg-gray-100",children:[e.jsx("td",{className:"border p-2",children:r.asset}),e.jsx("td",{className:"border p-2",children:r.threat}),e.jsx("td",{className:"border p-2",children:r.attackPath}),e.jsx("td",{className:"border p-2",children:r.likelihood}),e.jsx("td",{className:"border p-2",children:r.impact}),e.jsx("td",{className:"border p-2",children:r.detectionSignal}),e.jsx("td",{className:"border p-2",children:r.mitigation}),e.jsx("td",{className:"border p-2",children:r.residualRisk}),e.jsx("td",{className:"border p-2",children:r.owner})]},r.id))})]}),e.jsx("button",{onClick:()=>{const r=[["Asset","Threat","Attack Path","Likelihood","Impact","Detection","Mitigation","Residual","Owner"],...n.map(o=>[o.asset,o.threat,o.attackPath,o.likelihood,o.impact,o.detectionSignal,o.mitigation,o.residualRisk,o.owner])].map(o=>o.map(l=>`"${l}"`).join(",")).join(`
`),h=document.createElement("a");h.href="data:text/csv;charset=utf-8,"+encodeURIComponent(r),h.download="risk_register.csv",h.click()},className:"mt-4 px-4 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700",children:"Export as CSV"})]}),J=({scenario:n,currentStep:a,onNextStep:r,onPrevStep:h})=>{const[o,l]=x.useState({}),u=n.steps[a];return u?e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-blue-50 p-4 border-l-4 border-blue-500",children:[e.jsxs("p",{className:"font-semibold text-blue-900",children:["Phase: ",u.phase]}),e.jsx("p",{className:"text-sm text-blue-800 mt-2",children:u.text})]}),u.options&&e.jsx("div",{className:"space-y-3",children:u.options.map((f,t)=>e.jsxs("label",{className:"flex items-start p-3 border rounded hover:bg-gray-50 cursor-pointer",children:[e.jsx("input",{type:"radio",name:`step-${a}`,value:t,checked:(o[a]||-1)===t,onChange:()=>l(i=>({...i,[a]:t})),className:"mt-1 mr-3"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-sm",children:f.text}),f.notes&&e.jsx("p",{className:"text-xs text-gray-600 mt-1",children:f.notes})]})]},t))}),u.template&&e.jsx("div",{className:"bg-gray-100 p-4 font-mono text-xs overflow-auto rounded border",children:e.jsx("pre",{children:u.template})}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:h,disabled:a===0,className:"px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50",children:"← Back"}),e.jsx("button",{onClick:r,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Next →"})]})]}):e.jsxs("div",{className:"bg-green-50 p-4 border-l-4 border-green-500",children:[e.jsx("p",{className:"font-semibold text-green-900",children:"Tabletop Complete"}),e.jsx("p",{className:"text-sm text-green-800 mt-2",children:"You have completed the bridge incident tabletop exercise. Key takeaways: choose your trust model carefully, implement monitoring before incidents, and have an incident response plan ready."})]})},ee=({questions:n,onSubmit:a,answers:r,showAnswers:h,score:o})=>{const[l,u]=x.useState(r),f=(t,i)=>{u(p=>({...p,[t]:i}))};return e.jsxs("div",{className:"space-y-6",children:[n.map(t=>{var i;return e.jsxs("div",{className:"bg-white p-4 border rounded",children:[e.jsx("p",{className:"font-semibold text-sm mb-3",children:t.text}),t.type==="multiple-choice"&&e.jsx("div",{className:"space-y-2",children:t.options.map((p,c)=>{var d;return e.jsxs("label",{className:"flex items-start cursor-pointer",children:[e.jsx("input",{type:"radio",name:t.id,value:c,checked:(((d=l[t.id])==null?void 0:d.selected)||-1)===c,onChange:()=>f(t.id,{selected:c}),className:"mt-1 mr-2"}),e.jsx("span",{className:"text-sm",children:p.text})]},c)})}),(t.type==="scenario"||t.type==="short-answer")&&e.jsx("textarea",{value:((i=l[t.id])==null?void 0:i.text)||"",onChange:p=>f(t.id,{text:p.target.value}),placeholder:"Type your response...",className:"w-full p-2 border rounded text-sm font-serif",rows:4}),h&&e.jsxs("div",{className:"mt-4 p-3 bg-green-50 border-l-2 border-green-500 text-xs text-green-800",children:[e.jsx("p",{className:"font-semibold",children:"Sample Answer / Explanation:"}),e.jsx("p",{className:"mt-1 whitespace-pre-wrap",children:t.explanation})]})]},t.id)}),!o&&e.jsx("button",{onClick:()=>a(l),className:"px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold",children:"Submit Assessment"})]})};export{ae as default};
