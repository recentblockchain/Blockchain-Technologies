import{r as c,j as e}from"./index-OP-F52N7.js";import{F as _}from"./Footer-h1z9N8Ct.js";const X=()=>{const[b,f]=c.useState("intro"),[a,g]=c.useState({}),[m,k]=c.useState(!1),[d,C]=c.useState(!1),[r,u]=c.useState({confirmationDepth:12,indexingStrategy:"eventual",clientUXRule:"show-pending",reorgBlockHeight:null,scenarioRunning:!1,scenarioOutput:""}),x=[{id:"intro",label:"0. Intro & Learning Objectives",type:"intro"},{id:"section1",label:"1. Wallet UX and Key Custody",type:"content"},{id:"quiz1",label:"Quiz: Wallet UX (1.0–1.7)",type:"quiz"},{id:"section2",label:"2. RPC Providers & Chain Connectivity",type:"content"},{id:"quiz2",label:"Quiz: RPC Providers (2.0–2.5)",type:"quiz"},{id:"section3",label:"3. Event Indexing & Reorg Safety",type:"content"},{id:"quiz3",label:"Quiz: Event Indexing (3.0–3.8)",type:"quiz"},{id:"section4",label:"4. Minimal Indexer Patterns",type:"content"},{id:"quiz4",label:"Quiz: Indexer Patterns (4.0–4.5)",type:"quiz"},{id:"section5",label:"5. Operational Considerations",type:"content"},{id:"quiz5",label:"Quiz: Operations (5.0–5.4)",type:"quiz"},{id:"casestudy",label:"6. Mini Case Study: Indexer Failure",type:"content"},{id:"lab",label:"7. Hands-On Lab: Build a Reorg-Safe Indexer",type:"content"},{id:"tabletop",label:"8. Reorg Tabletop Exercise",type:"interactive"},{id:"final",label:"9. Final Assessment",type:"quiz"},{id:"summary",label:"10. Summary & References",type:"content"}],y=c.useMemo(()=>x.filter(t=>t.type==="quiz"&&Object.keys(a).some(s=>s.startsWith(t.id))||t.type==="content"&&a[`${t.id}-viewed`]||t.type==="intro"&&a[`${t.id}-viewed`]||t.type==="interactive"&&a[`${t.id}-completed`]),[a]),A=Math.round(y.length/x.length*100),j={quiz1:{title:"Quiz: Wallet UX and Key Custody (sections 1.0–1.7)",questions:[{id:"q1-1",type:"mc",question:"What is the primary engineering difference between an EOA (Externally Owned Account) and a smart contract wallet?",options:["EOAs are user-controlled; smart contract wallets are contracts whose code defines behavior.","EOAs are more secure because they use cryptography; smart contract wallets do not.","EOAs support complex business logic; smart contract wallets only sign transactions.","EOA keys cannot be rotated; smart contract wallets are always updatable."],correct:0,explanation:'EOAs use secp256k1 signing with a private key; smart contract wallets are smart contracts that can implement arbitrary "approval" logic via fallback/execute functions. This shapes custody, recovery, and UX.'},{id:"q1-2",type:"mc",question:"Which of the following is *not* a genuine UX burden imposed by transaction signing in typical dApps?",options:["Nonce collision if the user signs two transactions but only one gets mined before the second is sent.","Approval fatigue when users must sign contracts that interact with multiple token addresses.","Private key compromise if the user's hardware is infected with malware.","Inability to rotate keys because Ethereum does not support key updates."],correct:3,explanation:"Smart contract wallets *can* implement key rotation via upgradeable proxy patterns. The other three are real engineering constraints that shape dApp architecture."},{id:"q1-3",type:"ms",question:"Which of the following are valid trust boundaries to think about in wallet UX? (select all)",options:["The user's device vs. the dApp front-end code.","The RPC provider vs. the blockchain consensus.","The dApp backend vs. the indexer that supplies historical state.","The hardware wallet vs. the ETH protocol itself."],correct:[0,1,2,3],explanation:"All four are legitimate trust boundaries: device malware, RPC dishonesty, stale indexer state, and firmware bugs are all operational realities."},{id:"q1-4",type:"sa",question:'Explain in 1–2 sentences: why does "sign-in with Ethereum" reduce phishing risk compared to username/password?',expectedKeywords:["private key","domain","signature","replay"],explanation:"Sign-in with Ethereum signs a message containing the dApp domain, preventing a phishing site from reusing a signature intended for the real dApp. The user never shares the private key."},{id:"q1-5",type:"mc",question:'A user signs a high-value transaction on a mobile wallet, but the dApp front-end has a bug that converts the "to" address. What governance or technical measure best prevents this class of error?',options:['Use a smart contract wallet with an approval hook that validates the "to" address against a governance list.',"Require the RPC provider to validate all transactions before broadcasting.","Use password authentication instead of signatures.","Switch to a centralized exchange for all transactions."],correct:0,explanation:'Smart contract wallets with custom "approve" hooks can implement domain-specific validation logic. RPCs do not validate transaction semantics; passwords do not help; centralized exchanges do not solve the dApp architecture problem.'},{id:"q1-6",type:"mc",question:"Mobile deep links in dApps expose which of the following risks? (choose most serious technical risk)",options:["The Android/iOS OS may not support deep links.","An attacker can craft a deep link URI to a malicious dApp that mimics the real one.","Deep links always require the user to approve the transaction twice.","Mobile wallets have higher gas fees than desktop wallets."],correct:1,explanation:"Deep link spoofing (URI hijacking) is a classic mobile security attack where a phishing dApp can trigger a deep link to a trusted wallet. The user may not notice the subtle URI difference."},{id:"q1-7",type:"sa",question:"Name one recoverability tradeoff between a self-custodied EOA and a smart contract wallet with a multisig recovery guardian module.",expectedKeywords:["EOA loss","social","time delay","guardian","tradeoff"],explanation:"With an EOA, if the private key is lost, the account is unrecoverable. A smart contract wallet with a guardian can recover access, but it introduces a time delay and trust in the guardian(s), creating a tradeoff between security and recoverability."}]},quiz2:{title:"Quiz: RPC Providers & Chain Connectivity (sections 2.0–2.5)",questions:[{id:"q2-1",type:"mc",question:"An RPC provider can *guarantee* which of the following? (choose the strongest true guarantee)",options:["Every transaction sent to the RPC will be mined in the next block.",'The historical block the RPC returns for "latest" has been finalized by consensus.',"The RPC will return the same block hash for a given block number every time (determinism within that RPC).","The RPC will never experience network downtime."],correct:2,explanation:"RPCs are deterministic for finalized (or canonical) blocks within their own view, but they cannot guarantee inclusion, finality, or uptime. Stale caches or reorgs can cause different RPC nodes to serve different block data."},{id:"q2-2",type:"mc",question:"Rate limiting on RPC providers is primarily an engineering constraint that forces dApps to:",options:["Use multi-signature wallets instead of EOAs.","Implement caching, batching, or fallback to alternative RPC endpoints.","Use only centralized exchanges for all transactions.","Avoid reading the blockchain entirely."],correct:1,explanation:"Rate limits are real; good dApp architecture batches requests, caches state, and falls back to secondary RPCs. Alternatives (1, 3, 4) do not solve the problem."},{id:"q2-3",type:"ms",question:"Which of the following are reasons a client should *not* rely on a single RPC endpoint? (select all that apply)",options:["The endpoint may lag behind the canonical chain tip, serving stale data.","The endpoint may experience network downtime or rate limiting.","The endpoint's view of the chain may diverge from consensus (e.g., a reorg that the endpoint has not yet seen).","The endpoint may charge different gas fees than other RPC providers."],correct:[0,1,2],explanation:"Stale data, downtime, and reorg divergence are real risks. Gas fees are set by the network, not the RPC endpoint—that is a distractor."},{id:"q2-4",type:"sa",question:"Describe in 1–2 sentences what happens to a dApp if it sends a transaction via RPC A, but then immediately reads state from RPC B that has not yet seen the transaction mempool.",expectedKeywords:["race condition","stale","confirmation","eventually consistent"],explanation:"The dApp may incorrectly believe the transaction was rejected because state reads show no change. This is a common race condition in distributed systems; the fix is to wait for confirmations or read from the same RPC used for sending."},{id:"q2-5",type:"mc",question:`In the context of block tags ("latest", "safe", "finalized"), which tag is most appropriate for reading a user's token balance in a dApp front-end?`,options:['"latest" is always okay because Ethereum has 1-second blocks.','"safe" is a good balance because it trades freshness for reorg resistance in most cases.','"finalized" is always required to prevent the user seeing incorrect balances.',"Block tags do not exist; use only block numbers."],correct:1,explanation:'"Safe" (typically ~34 blocks of reorg protection on mainnet) is a pragmatic default for user-facing reads; "finalized" (true consensus finality) is more expensive but not always necessary. "Latest" risks reorg-induced balance flaps.'}]},quiz3:{title:"Quiz: Event Indexing & Reorg Safety (sections 3.0–3.8)",questions:[{id:"q3-1",type:"mc",question:'A smart contract emits a "Transfer" log. The primary engineering advantage of indexing logs vs. reading contract state is:',options:["Logs are cheaper to read because they are not stored on-chain.","Logs provide a *time-ordered, immutable audit trail* that state reads cannot reconstruct.","Logs are always finalized; state reads can be reorged.","Logs do not require an RPC; you can derive them from signatures alone."],correct:1,explanation:"Logs are event records; state is the result of those events. Logs let you replay history and detect reorgs; state reads only show the current result. Both can be reorged, but logs give you the trail."},{id:"q3-2",type:"mc",question:"A reorg at block height H means:",options:["All blocks after H are lost forever.","The canonical chain at H is replaced; transactions in the old chain may appear in a new block or not at all.","The blockchain splits into two independent chains.","Users lose their private keys."],correct:1,explanation:"Reorgs are normal consensus operations; a few blocks may be reorganized. Transactions are not lost—they may be mined in a different order or drop to mempool."},{id:"q3-3",type:"ms",question:"Which of the following are real problems if an indexer does not handle reorgs? (select all)",options:["The indexer may serve stale or incorrect state if logs are removed.","The indexer may miss reorg-displaced transactions that remint in a new block.","The indexer will no longer accept new transactions.","The blockchain will halt."],correct:[0,1],explanation:"Reorg-unaware indexers double-count transactions, serve incorrect state, and miss events. (2) and (3) are false—the blockchain network is unaffected by a single indexer bug."},{id:"q3-4",type:"sa",question:'Define "canonical chain tracking" in the context of an indexer and explain why it is crucial for reorg-safe indexing.',expectedKeywords:["block hash","reorganization","checkpoint","revert"],explanation:"Canonical chain tracking means the indexer maintains a checkpoint of block hashes (or block height + hash pairs) and reverts its derived state if it detects a reorganization (new tip has a different hash at a previously recorded height). This enables safe rollback."},{id:"q3-5",type:"mc",question:'What does "idempotent processing" mean in the context of event indexing?',options:["Processing the same event multiple times gives the same final result.","The indexer can only process one event at a time.","Events are automatically duplicated by Ethereum.","Transactions always succeed on the first attempt."],correct:0,explanation:"Idempotency means reprocessing an event (e.g., during backfill or recovery) does not corrupt state. Example: incrementing a counter *once* per log, not *once per replay*."},{id:"q3-6",type:"mc",question:"An indexer detects that a log at block 100 was removed. What should it do?",options:["Ignore the removed log; it is not important.","Stop indexing and alert an operator.",'Revert derived state to before block 100, reprocess logs from block 100 onward, and mark affected events as "pending" until finality.',"Delete the entire database and restart."],correct:2,explanation:"Removed logs indicate a reorg; proper handling is rollback + reprocess. Ignoring causes inconsistency; stopping is not resilient; deleting the DB is excessive."},{id:"q3-7",type:"sa",question:'Explain the relationship between "confirmation depth" and "confirmation risk". How should a dApp choose a confirmation depth for displaying finalized user balances?',expectedKeywords:["reorg depth","probability","finality","tradeoff","consensus"],explanation:"Confirmation depth is the number of blocks after an event; confirmation risk is the probability that event will be reorged. Greater depth = lower risk but longer latency. A dApp should choose depth based on the risk tolerance of the use case (e.g., 12 blocks for most, 32+ for high-value transfers)."},{id:"q3-8",type:"mc",question:'Which of the following is an example of "exactly-once illusion"?',options:["A log that appears in two blocks due to a reorg.","A dApp that increments a user balance counter every time it sees a Transfer log, without dedup keys or idempotency.","A user sending the same transaction twice.","An RPC returning two different block hashes for the same block number."],correct:1,explanation:"During reorg + reprocess, a log may be seen twice if the indexer lacks dedup keys or idempotent upsert logic. The user never sent two transactions; the indexer failed to deduplicate."}]},quiz4:{title:"Quiz: Minimal Indexer Patterns (sections 4.0–4.5)",questions:[{id:"q4-1",type:"mc",question:'A minimal indexer pipeline has four stages: ingest, normalize, store, query. The "normalize" stage primarily:',options:["Compresses log data to save disk space.","Transforms raw logs into idempotent, timestamped events with dedup keys.","Encrypts logs for security.","Sends logs to Ethereum miners."],correct:1,explanation:'Normalization adds schema, timestamps, and dedup keys (e.g., "blockNumber-txHash-logIndex") to enable idempotent storage and prevent double-counting on replays.'},{id:"q4-2",type:"ms",question:"Which of the following are reasons to denormalize state in an indexer database? (select all)",options:["Denormalized tables allow fast range queries without joins.","Denormalization reduces the need for backups.","Denormalization enables fast balance lookups without recalculating from 1000s of Transfer logs.","Denormalized tables are always more space-efficient."],correct:[0,2],explanation:"Denormalization trades write cost for query speed; it avoids expensive joins and replay. Backup and space claims are false—denormalization may increase space."},{id:"q4-3",type:"sa",question:"Describe a simple caching strategy that allows a dApp to serve user balance queries while the indexer is temporarily behind the chain tip.",expectedKeywords:["cache","timestamp","stale","TTL","eventual consistency"],explanation:'Cache user balances with a short TTL (10–60 seconds); serve stale balances with a "as of X blocks ago" disclaimer while the indexer catches up. This trades freshness for availability.'},{id:"q4-4",type:"mc",question:"Pagination in an indexer API is primarily important to:",options:["Make the database faster.","Prevent clients from requesting millions of rows and crashing.","Hide sensitive data.","Increase server throughput indefinitely."],correct:1,explanation:"Large result sets cause memory and bandwidth issues. Pagination (limit, offset, or cursor) forces clients to fetch data incrementally."},{id:"q4-5",type:"sa",question:'What is "reconciliation against on-chain truth" and why should an indexer implement periodic reconciliation jobs?',expectedKeywords:["background job","state","log","divergence","corrective"],explanation:"Reconciliation periodically recalculates derived state from raw logs (or queries the contract directly) to detect indexer bugs or missing logs. Divergences can be logged and corrected, catching silent data corruption."}]},quiz5:{title:"Quiz: Operational Considerations (sections 5.0–5.4)",questions:[{id:"q5-1",type:"mc",question:"In the context of indexer observability, which metric is most important to alert on?",options:["The total number of rows in the database.","The indexer lag: the difference between the chain tip and the indexer head block.","The CPU temperature of the server.","The number of typos in log messages."],correct:1,explanation:"Indexer lag directly indicates whether the indexer is serving stale state. Unexpectedly high lag signals an indexing bug or RPC issue and requires immediate investigation."},{id:"q5-2",type:"ms",question:"Which of the following are key components of an incident playbook for a reorg that affected the indexer? (select all)",options:["Document the reorg depth and which blocks were affected.","Identify which events were removed and which user queries were invalidated.","Execute a rollback and reprocess from the reorg height.","Silently drop all affected data without alerting users."],correct:[0,1,2],explanation:"A good playbook documents the incident, identifies impact, and executes corrective actions. Silently dropping data (4) is unacceptable and violates trust."},{id:"q5-3",type:"sa",question:'Explain the difference between "replay" and "backfill" in the context of indexer maintenance.',expectedKeywords:["replay blocks","backfill","missing","reorg","historical"],explanation:"Replay processes known blocks again in order (e.g., after a reorg) to recalculate state. Backfill fetches historical blocks that were never indexed before (e.g., when deploying a new indexer). Both are idempotent if the indexer uses dedup keys."},{id:"q5-4",type:"mc",question:"An indexer experiences an RPC outage. What is a resilient response?",options:["Stop and wait for the RPC to recover.","Switch to a secondary RPC endpoint and continue indexing if possible.","Delete all data and restart.","Ignore the outage and continue serving stale data without alerts."],correct:1,explanation:"Resilience means having fallback RPC endpoints and continuing operation (or gracefully degrading) rather than halting. (4) is dangerous because users will not know the data is stale."}]},final:{title:"Final Assessment: Comprehensive Scenario & Synthesis",questions:[{id:"final-1",type:"sa",question:"A decentralized exchange (DEX) dApp integrates with a public RPC provider and a custom indexer. Users report that their token balances fluctuate unexpectedly after each block. Describe (in 3–5 sentences) at least two possible root causes and how you would diagnose each.",expectedKeywords:["reorg","indexer lag","RPC stale","confirmation depth","double-count"]},{id:"final-2",type:"mc",question:"A mobile dApp uses deep links to interact with a hardware wallet. An attacker creates a phishing dApp that hijacks the deep link URI. Which of the following is the *best* mitigation?",options:["Require all deep links to be signed by the dApp backend.","Use URL schemes that include a cryptographic hash of the legitimate dApp domain.","Implement a custom hardware wallet that only works on your dApp.","Remove deep link support entirely."],correct:1,explanation:"Hashing the legitimate domain into the URI scheme prevents spoofing. Signing does not prevent URI hijacking; custom hardware is impractical; removing deep links breaks user experience."},{id:"final-3",type:"ms",question:"Which of the following are valid arguments for using a smart contract wallet instead of an EOA for dApp custody? (select all)",options:["Smart contract wallets enable recovery via guardian mechanisms.","Smart contract wallets can implement spend limits or transaction hooks.","Smart contract wallets are cheaper because they use less storage.","Smart contract wallets allow users to rotate signing keys without losing the account."],correct:[0,1,3],explanation:"Guardians, hooks, and key rotation are real benefits. Cost is false—smart contract wallets are *more* expensive because they execute code on-chain."},{id:"final-4",type:"sa",question:"You are designing an indexer for a lending protocol. Explain how confirmation depth and your indexer's reorg-safety strategy should be coordinated so that interest rates calculated from indexer state do not cause cascading liquidations if a reorg occurs.",expectedKeywords:["confirmation depth","pending vs finalized","reorg detection","grace period","user notification"]},{id:"final-5",type:"sa",question:'Describe the "trust boundary" between an RPC provider and a dApp client. What assumptions should a dApp *not* make about RPC honesty?',expectedKeywords:["RPC may lag","RPC can be sybil","RPC may censor","canonical chain","consensus"]}]}},o=c.useCallback(t=>{g(s=>({...s,[`${t}-viewed`]:!0}))},[]),p=c.useCallback((t,s)=>{g(i=>({...i,[t]:s}))},[]),v=c.useCallback(t=>{g(s=>({...s,[`${t}-submitted`]:!0}))},[]),T=c.useCallback(()=>{g({}),k(!1),f("intro")},[]),w=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"dApp Architecture and Off-Chain Infrastructure"}),e.jsxs("p",{className:"abstract",children:[e.jsx("strong",{children:"Abstract:"})," This module covers the engineering principles and operational realities of decentralized application (dApp) architecture, focusing on five core pillars: (1) wallet UX and key custody as engineering constraints, (2) RPC provider reliability and failover, (3) event indexing with reorg safety, (4) minimal indexer patterns that translate logs into queryable state, and (5) operational discipline through observability, incident response, and resilience testing. By the end, learners will understand why dApp architecture is fundamentally about managing distributed systems uncertainty."]}),e.jsx("h2",{children:"Learning Objectives"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Understand wallet UX constraints: EOAs vs. smart contract wallets, signing vs. sending, approval fatigue, device/browser limitations, and recoverability tradeoffs."}),e.jsx("li",{children:"Design for RPC uncertainty: rate limits, reliability, multi-RPC failover, and block tag semantics."}),e.jsx("li",{children:"Build reorg-safe indexers: handle logs, confirmations, reorgs, idempotent deduplication, and checkpointing."}),e.jsx("li",{children:"Implement minimal indexer pipelines: ingest → normalize → store → query, with denormalization and caching."}),e.jsx("li",{children:"Establish operational discipline: observability, incident playbooks, and resilience testing."})]}),e.jsx("h2",{children:"Key Terms"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"EOA (Externally Owned Account):"})," A user-controlled account with a private key (secp256k1 signature)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Smart Contract Wallet:"})," A contract that holds funds and executes transactions via custom logic."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Nonce:"})," A counter that prevents replay attacks; each EOA transaction increments nonce."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"RPC Provider:"})," A node that serves JSON-RPC requests to read/write chain state."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Block Tag:"})," A symbolic reference (latest, safe, finalized) to a block instead of a raw number."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Event / Log:"})," Immutable record emitted by a smart contract during execution."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reorg (Reorganization):"})," A change in the canonical chain tip; blocks are unmined and remined."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Indexer:"})," An off-chain service that reads logs and events, normalizes them, and serves queries."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confirmation Depth:"})," Number of blocks after an event; higher depth = lower reorg risk."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Idempotent:"})," Processing the same input multiple times yields the same result."]})]}),e.jsx("h2",{children:"Prerequisites"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Familiarity with Ethereum accounts, transactions, and smart contracts (Modules 1–3)."}),e.jsx("li",{children:"Understanding of JSON-RPC basics."}),e.jsx("li",{children:"Basic knowledge of event logs and the EVM."})]}),e.jsx("button",{className:"btn-primary",onClick:()=>f("section1"),children:"Start Module →"})]}),E=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"1. Wallet UX and Key Custody: Engineering Constraints, Not Ideology"}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Wallet UX is not a UX problem—it is a distributed systems problem. Users must manage nonces, sign transactions, handle device state, and operate within strict trust boundaries. dApp architecture must either hide these constraints or give users tools to manage them safely."]}),e.jsx("h2",{children:"1.0 EOAs vs. Smart Contract Wallets: A Technical Primer"}),e.jsxs("p",{children:["An ",e.jsx("strong",{children:"EOA (Externally Owned Account)"})," is defined by its ability to sign transactions with a private key (secp256k1). The account has a nonce, balance, and code (always empty for EOAs). Transactions are validated by checking the signature against the EOA's public key."]}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"smart contract wallet"})," is a contract that receives calls and executes arbitrary logic. It has no private key; instead, a signer (human or bot) calls a public function (e.g., ",e.jsx("code",{children:"execute"}),") on the contract, which then performs the desired action. The contract can implement approval logic, rate limiting, multi-signature rules, etc."]}),e.jsx("div",{className:"code-block",children:`// Simplified EOA transaction
{
    from: "0x1234...",
    to: "0x5678...",
    value: "100000000000000000", // 0.1 ETH
    data: "0x",
    nonce: 42,
    gasPrice: "20000000000"
}

// Signed by private key; RPC broadcasts it
// Nonce must be exactly 42 if the account currently has nonce 42


// Smart contract wallet (simplified)
contract SimpleWallet {
    address owner;
    
    function execute(address to, uint256 value, bytes calldata data) external {
        require(msg.sender == owner);
        (bool success, ) = to.call{value: value}(data);
        require(success);
    }
}

// Instead of signing a transaction, the owner sends a regular transaction
// that calls execute(...). The contract's code decides the outcome.`}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"}),' "Smart contract wallets are always better."',e.jsx("br",{}),e.jsx("strong",{children:"Reality:"})," Smart contract wallets add deployment cost, execution cost, and complexity. An EOA is simpler and cheaper for users who do not need recovery or spending limits. The choice depends on the use case."]}),e.jsx("h2",{children:"1.1 Signing vs. Sending: User Agency and Nonce Management"}),e.jsxs("p",{children:["In an EOA, ",e.jsx("strong",{children:"signing"})," (creating a signature) is instantaneous and off-chain.",e.jsx("strong",{children:"Sending"})," (broadcasting the transaction) is network-dependent and asynchronous. This gap creates UX chaos:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Nonce collision:"})," If a user signs two transactions (tx1 with nonce 42, tx2 with nonce 43) but only tx1 is mined, then tx2 becomes stuck because the account nonce is now 43, invalidating any future tx with nonce 43."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Race conditions:"})," The user may sign a transaction and believe it is sent, but if the RPC crashes, the tx never reaches mempool. The user does not know and reuses the nonce."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dual transmission:"})," The app may broadcast to two RPC providers with different nonces, causing one to fail after the other is mined (or vice versa)."]})]}),e.jsx("div",{className:"code-block",children:`// User clicks "Send"
// 1. App requests user signature for { ..., nonce: 42 }
// 2. User signs in wallet
// 3. App broadcasts signed tx to RPC

// Meanwhile:
// 4. Another window of the same app auto-broadcasts a different tx with nonce 42
// 5. Only one tx mines
// 6. Other tx is stuck because nonce is already consumed

// Result: Stuck transaction, user support burden, lost trust`}),e.jsx("h2",{children:"1.2 Approval Fatigue and Signature Cascades"}),e.jsxs("p",{children:["Each interaction with a dApp that touches user funds (swaps, lending, staking, etc.) typically requires the user to sign a transaction. If a user is juggling 5 dApps and makes 10 swaps, they sign 10+ times. Signature clicking is ",e.jsx("strong",{children:"friction"}),", and friction is abandonment."]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Minimize signature requests by batching, using permit() / secp256k1 message signing for approvals, and designing flows that bundle related operations into a single transaction."]}),e.jsx("h2",{children:"1.3 Device and Browser Limitations"}),e.jsx("p",{children:"Wallets run on devices with limited resources, varying browser support, and competing security constraints:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Mobile browsers:"})," Limited storage, no access to hardware, no background execution."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hardware wallets:"})," Cannot execute arbitrary transactions; must be verified by the device screen."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Browser extensions:"})," Subject to browser sandbox restrictions; cannot inject into iframes (security feature)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Session management:"})," If the user closes the browser, did they authorize additional transactions? For how long?"]})]}),e.jsx("h2",{children:"1.4 Sign-in with Ethereum and Phishing Resistance"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Sign-in with Ethereum (SIWE)"})," uses a signed message (not a transaction) to authenticate. The message includes:"]}),e.jsx("div",{className:"code-block",children:`Sign this message to prove you own the account:

example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com
Nonce: abc123
Issued At: 2025-01-15T10:00:00Z
Chain ID: 1
Version: 1`}),e.jsxs("p",{children:["The signed message is sent to the backend, which verifies the signature. Because the message includes the domain (",e.jsx("code",{children:"example.com"}),"), a phishing site cannot reuse the signature—the domain name will not match."]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," SIWE is cheaper than a transaction (no gas), prevents replay across domains, and eliminates the need for usernames/passwords. But it only authenticates the account ownership, not authorization to execute specific transactions."]}),e.jsx("h2",{children:"1.5 Phishing, Approval Fatigue, and UX Dark Patterns"}),e.jsx("p",{children:`A classic attack: dApp asks user to approve an unlimited allowance for a token contract. The user clicks "Approve" without reading. The dApp then withdraws the user's entire token balance. The user signed an approving transaction—they authorized it—but did not intend to lose all funds.`}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"}),' "The blockchain is trustless, so the user can always revoke the approval."',e.jsx("br",{}),e.jsx("strong",{children:"Reality:"})," By the time the user thinks to revoke, the attacker has already drained the account. Revocation is reactive, not preventive."]}),e.jsx("p",{children:"Mitigations:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Use ",e.jsx("code",{children:"permit()"})," (ERC-2612) to combine approval + transfer in a single tx."]}),e.jsx("li",{children:"Limit approvals to a specific amount; require a second approval if the user wants to transfer more."}),e.jsx("li",{children:"Smart contract wallets can implement approval hooks that validate the target contract against a whitelist or governance."})]}),e.jsx("h2",{children:"1.6 Mobile Deep Links and Session Hijacking"}),e.jsxs("p",{children:["Mobile dApps often use deep links to trigger wallet interactions. A deep link is a URI (e.g., ",e.jsx("code",{children:"wallet://sign?tx=..."}),") that the mobile OS routes to the wallet app."]}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"})," URI hijacking.",e.jsx("br",{}),e.jsx("strong",{children:"Attack:"})," A phishing dApp registers a similar URI scheme or spoofs the legitimate app's URI, intercepting the deep link.",e.jsx("br",{}),e.jsx("strong",{children:"Mitigation:"})," Embed a cryptographic hash of the legitimate dApp domain in the URI scheme; the mobile wallet can verify it before signing."]}),e.jsx("h2",{children:"1.7 Recoverability Tradeoffs: Self-Custody vs. Guardian Models"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Self-custodied EOA:"})," Only the owner has the private key. If the key is lost, the account is unrecoverable. No one (not even you) can help."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Smart contract wallet with guardians:"})," A set of trusted addresses (e.g., email backup, hardware wallet, trusted friend) can authorize a key rotation if the primary key is lost. But this introduces:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"A time delay (30 days?) before recovery is finalized, during which an attacker could act."}),e.jsx("li",{children:"Trust in the guardians: they must keep their keys safe."}),e.jsx("li",{children:"Added operational burden: the user must maintain guardian relationships."})]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," There is no perfect solution. Recovery trades off security (time window) vs. accessibility (who controls it). Design for the user's risk tolerance and operational capability."]}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("section1"),children:"Mark as Read"})]}),S=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"2. RPC Providers and Chain Connectivity: Not a Simple Pipe"}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," An RPC provider is not a magic pipe that reads the blockchain. It is a distributed system node with its own latency, cache, and view of consensus. Design dApps that survive RPC lag, outages, and divergence."]}),e.jsx("h2",{children:"2.0 What RPC Providers Do (and Do Not Guarantee)"}),e.jsx("p",{children:"An RPC provider exposes a JSON-RPC interface to:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Read block headers, transaction receipts, and contract storage."}),e.jsx("li",{children:"Send signed transactions to the mempool."}),e.jsx("li",{children:"Subscribe to new logs/events."})]}),e.jsx("p",{children:e.jsx("strong",{children:"What RPC providers do NOT guarantee:"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Inclusion:"})," A transaction sent to the RPC may never reach the mempool or may be dropped."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ordering:"})," Two transactions sent to an RPC do not have a guaranteed order in a block."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Finality:"}),' The block height the RPC reports as "latest" may be reorged.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Availability:"})," The RPC may timeout, rate-limit, or go offline."]})]}),e.jsx("div",{className:"code-block",children:`// Bad: Assume RPC is always available and reliable
const balance = await provider.getBalance(userAddress);
console.log(balance); // What if provider is offline?

// Better: Add retry logic and fallback
async function fetchBalanceWithFallback(address) {
    const rpcs = [primaryRpc, secondaryRpc];
    for (const rpc of rpcs) {
        try {
            return await rpc.getBalance(address);
        } catch (e) {
            // Try next RPC
        }
    }
    throw new Error('All RPCs failed');
}`}),e.jsx("h2",{children:"2.1 Rate Limiting and Reliability"}),e.jsx("p",{children:"Public RPC providers rate-limit requests to prevent abuse. If your dApp makes too many calls per second, requests are rejected."}),e.jsx("p",{children:e.jsx("strong",{children:"Design patterns:"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Batching:"})," Combine multiple ",e.jsx("code",{children:"eth_call"})," requests into a single batch."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Caching:"})," Cache recent block data (block headers, logs) for 10–30 seconds to avoid redundant RPC calls."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Indexing:"})," Instead of querying the RPC for historical data, maintain an off-chain index."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Primary + Secondary RPCs:"})," Send requests to a primary RPC; if it fails or is slow, immediately retry with a secondary."]})]}),e.jsx("h2",{children:"2.2 Multi-RPC Failover and Data Consistency"}),e.jsx("p",{children:"If you use two RPC providers (A and B), they may diverge temporarily:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"RPC A has seen block 100 and block 101; RPC B has only seen block 100."}),e.jsx("li",{children:"A transaction is in RPC A's mempool but not RPC B's."}),e.jsx("li",{children:"After a reorg, RPC A reverts block 101, but RPC B saw a different block 101."})]}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"}),' "Read from RPC A, then write from RPC B, then read from RPC A again."',e.jsx("br",{}),e.jsx("strong",{children:"Problem:"})," If RPC A and RPC B have diverged, the second read may contradict the first (race condition).",e.jsx("br",{}),e.jsx("strong",{children:"Mitigation:"})," Use the same RPC for both reads and writes in a transaction flow, or wait for confirmations."]}),e.jsx("h2",{children:"2.3 Block Tags: latest, safe, finalized"}),e.jsx("p",{children:"Instead of querying a specific block number, RPC methods accept block tags:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"latest:"})," The most recent block. Subject to reorgs."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"safe:"})," A block that has been validated by ~34 witnesses (on mainnet); probability of reorg is very low but not zero."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"finalized:"})," A block that has achieved consensus finality. Cannot be reorged under normal network conditions."]})]}),e.jsx("div",{className:"code-block",children:`// Read user balance at "safe" block (best for user-facing state)
const balance = await provider.getBalance(userAddress, 'safe');

// Read at "finalized" for high-value operations
const finalBalance = await provider.getBalance(userAddress, 'finalized');

// Avoid "latest" for balance reads unless you handle reorg risk
const latestBalance = await provider.getBalance(userAddress, 'latest');`}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"}),' For user-facing balance reads, use "safe". For settlement and high-value operations, use "finalized". Use "latest" only for data that is acceptable to re-read.']}),e.jsx("h2",{children:"2.4 Read vs. Write Paths"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Read path:"})," Fetching contract state, balances, allowances. Should be fast and tolerate some staleness. Use caching and public RPCs."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Write path:"})," Sending transactions. Should be reliable and use a dedicated RPC with high uptime SLA. A failed write (dropped from mempool) is a product incident."]}),e.jsx("p",{children:e.jsx("strong",{children:"Design:"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"Use a primary RPC for writes; have a secondary for failover."}),e.jsx("li",{children:"Broadcast writes to multiple RPC providers to increase the probability of reaching mempool."}),e.jsx("li",{children:"Implement a transaction tracking system: periodically query whether the tx was mined, is pending, or was dropped."})]}),e.jsx("h2",{children:"2.5 Designing for Partial Outages"}),e.jsx("p",{children:"A partial outage is when some RPC providers are down, but others are up. Your dApp should:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Detect which RPCs are healthy using periodic health checks."}),e.jsx("li",{children:"Route requests to healthy RPCs."}),e.jsx("li",{children:"Degrade gracefully (e.g., serve stale balance with a disclaimer) rather than error."}),e.jsx("li",{children:"Notify users of elevated latency or stale data."})]}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("section2"),children:"Mark as Read"})]}),P=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"3. Event Indexing and Reorg-Safe Application Design"}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Logs are append-only historical records. Reorgs can remove logs. An indexer must checkpoint the canonical chain, detect reorgs, and roll back derived state. Without this, derived state (e.g., a user's balance) will diverge from on-chain truth."]}),e.jsx("h2",{children:"3.0 Logs vs. State Reads: Why Logs Are Better for Indexing"}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"log"})," is an immutable record emitted by a smart contract during execution. A ",e.jsx("strong",{children:"state read"})," is a snapshot of contract storage at a block."]}),e.jsx("p",{children:'Example: A DEX token contract emits a "Transfer" log every time tokens move. To build a current balance, one could:'}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Strategy A (state read):"})," Call ",e.jsx("code",{children:"balanceOf(user, blockX)"}),". Returns the balance at block X. But does not tell you the history, and if the contract is upgraded, you cannot replay history."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Strategy B (logs):"}),' Fetch all "Transfer" logs for the user from block 0 to block X. Sum incoming transfers, subtract outgoing. This gives the balance *and* the audit trail.']})]}),e.jsx("p",{children:"Logs are superior because:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"They are time-ordered and immutable (until reorg)."}),e.jsx("li",{children:"They encode intent, not just state result."}),e.jsx("li",{children:"You can replay history to rebuild state after a bug or upgrade."})]}),e.jsx("h2",{children:"3.1 Understanding Reorgs and Chain Reorganization"}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"reorg (reorganization)"})," happens when the canonical chain tip changes. For example:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Block 100 by proposer A is mined and propagates."}),e.jsx("li",{children:"Block 101 by proposer B is mined and builds on block 100."}),e.jsx("li",{children:"But a new block 100' by proposer C is mined (with stronger justification or more attestations)."}),e.jsx("li",{children:"Consensus switches to the new chain: block 100' → block 101' → block 102' (ignoring the old 100, 101)."})]}),e.jsxs("p",{children:["Reorgs are ",e.jsx("strong",{children:"normal consensus operations"}),", not rare events. On Ethereum mainnet, reorgs happen every few hours, and most are 1–2 blocks deep. Reorg depth >10 blocks is rare but has occurred."]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Reorgs are not bugs; they are consensus behavior. An indexer that does not handle reorgs is a ticking time bomb."]}),e.jsx("h2",{children:"3.2 Confirmation Depth and Confirmation Risk"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Confirmation depth"})," is how many blocks have been mined after a log.",e.jsx("strong",{children:"Confirmation risk"})," is the probability that a log at depth D blocks will be removed by a reorg."]}),e.jsx("p",{children:"Approximation (Ethereum mainnet, typical conditions):"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Depth 1: ~0.05% risk (very high)."}),e.jsx("li",{children:"Depth 12: ~0.00001% risk (very low)."}),e.jsx("li",{children:"Depth 32: ~0% risk for practical purposes."})]}),e.jsx("p",{children:e.jsx("strong",{children:"Application guidance:"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"User-facing state (balance, history):"}),' Show "Confirmed" at depth 12, "Finalized" at depth 32.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"High-value transfers (bridging, settlement):"})," Require depth 32+ before settlement."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Liquidations, emergency actions:"}),' Use "safe" block tag (~34 depth) or request a finality proof.']})]}),e.jsx("h2",{children:"3.3 Idempotent Processing and Deduplication Keys"}),e.jsx("p",{children:"When a reorg happens, an indexer replays logs that were affected. If the indexer is not careful, it will double-count or overwrite events."}),e.jsx("div",{className:"code-block",children:`// Naive approach: increment counter for each Transfer log
const transferLog = { blockNumber: 100, transactionIndex: 5, logIndex: 2, ... };
counter += 1; // BUG: if reorg removes block 100, then replays it, counter += 2

// Correct approach: deduplicate by blockNumber-txHash-logIndex
const dedup_key = \`\${transferLog.blockNumber}-\${txHash}-\${transferLog.logIndex}\`;
if (!processedKeys.has(dedup_key)) {
    counter += 1;
    processedKeys.add(dedup_key);
}

// Even better: upsert in database with unique constraint on dedup_key
INSERT INTO events (dedup_key, counter, ...)
VALUES ('100-0xabc...-2', 1, ...)
ON CONFLICT (dedup_key) DO NOTHING; // Idempotent`}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," Use deduplication keys (block#-txHash-logIndex) and idempotent database operations (INSERT OR IGNORE, upsert) to ensure logs are processed *exactly once*, even if replayed."]}),e.jsx("h2",{children:"3.4 Canonical Chain Tracking and Rollback"}),e.jsx("p",{children:"To detect a reorg, an indexer must remember the block hash at each height. If the chain tip changes, the indexer compares hashes backward until it finds the common ancestor, then rolls back derived state."}),e.jsx("div",{className:"code-block",children:`// Indexer state
blockchainCheckpoint = {
    blockNumber: 100,
    blockHash: '0xabc...',
    derivedState: { balance: 1000 }
};

// Next block arrives
newBlock = { blockNumber: 101, parentHash: '0xabc...' };
// parentHash matches our checkpoint → continue indexing

// Later, a reorg is detected
reorgBlock = { blockNumber: 100, blockHash: '0xdef...' }; // Different hash!
// Rollback to 99, reprocess from block 99 onward`}),e.jsx("h2",{children:"3.5 Handling Removed Logs on Reorg"}),e.jsx("p",{children:"When a reorg removes a log, the log is no longer part of the canonical chain. The indexer must:"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Detect which logs were removed (compare block hashes)."}),e.jsx("li",{children:"Revert the derived state that depended on those logs (decrement counter, restore balance, etc.)."}),e.jsx("li",{children:"Re-fetch and reprocess logs from the reorg point."})]}),e.jsx("h2",{children:"3.6 Checkpointing and Backfilling"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Checkpointing:"})," Periodically save (blockNumber, blockHash, derivedState). On restart, resume from the checkpoint instead of block 0."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Backfilling:"})," If the indexer is deployed fresh, fetch all historical logs and process them. This is a one-time operation; then the indexer follows new blocks (indexing)."]}),e.jsxs("div",{className:"callout-pitfall",children:[e.jsx("strong",{children:"Common Pitfall:"}),' "Backfill is one-time; we do not need idempotent processing."',e.jsx("br",{}),e.jsx("strong",{children:"Reality:"})," Backfilt may be interrupted, restarted, or updated (e.g., new contract address added). Always use dedup keys and idempotent operations."]}),e.jsx("h2",{children:"3.7 Schema Evolution and Long-Term Indexing"}),e.jsx("p",{children:"As the contract evolves (new events, event signature changes), the indexer schema must adjust. Strategies:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Versioned events:"})," Emit different log types for different versions (e.g., TransferV1, TransferV2)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Backfill on schema change:"})," When adding a new column, backfill historical logs (if they provide the data) or mark as NULL."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Migration scripts:"})," For complex changes, write a migration that reprocesses a range of blocks."]})]}),e.jsx("h2",{children:'3.8 The "Exactly-Once" Illusion'}),e.jsx("p",{children:'Users often think "my transaction either happened or did not." In reality, with reorgs and replays:'}),e.jsxs("ul",{children:[e.jsx("li",{children:"A transaction may be mined in block 100, then unconfirmed by a reorg, then remined in block 100'."}),e.jsx("li",{children:"An indexer that does not deduplicate will count the transaction twice if both the old and new blocks are processed."})]}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"}),' Exactly-once semantics require application-level deduplication, not trust in the blockchain. The blockchain provides "at-least-once" semantics (a tx may be counted 0 or 1+ times after reorgs); the indexer must enforce exactly-once via dedup keys.']}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("section3"),children:"Mark as Read"})]}),N=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"4. Minimal Indexer Patterns: From Logs to Queries"}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," A minimal indexer has four stages: ingest (pull logs), normalize (add schema), store (persist state), query (serve dApp). Each stage can be optimized independently."]}),e.jsx("h2",{children:"4.0 Event Ingestion: Polling vs. Subscriptions"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Polling:"})," Regularly call ",e.jsx("code",{children:"eth_getLogs"})," to fetch new logs."]}),e.jsx("div",{className:"code-block",children:`async function pollLogs() {
    let lastBlock = 0;
    while (true) {
        const logs = await rpc.getLogs({
            address: CONTRACT,
            fromBlock: lastBlock + 1,
            toBlock: 'latest'
        });
        for (const log of logs) {
            await processLog(log);
        }
        lastBlock = (await rpc.getBlockNumber());
        await sleep(2000); // Poll every 2 seconds
    }
}

// Tradeoff: Simple, reliable, but ~2-second latency`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Subscriptions:"})," Use WebSocket to subscribe to log streams."]}),e.jsx("div",{className:"code-block",children:`ws.on('logs', (log) => {
    processLog(log); // Instant
});

// Tradeoff: Lower latency, but more complex error handling (reconnect, gaps)`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Recommendation:"})," Start with polling; it is easier to reason about reorg-safety. Add subscriptions for real-time features if needed."]}),e.jsx("h2",{children:"4.1 Normalization: From Raw Logs to Events"}),e.jsx("p",{children:"Raw logs are ABI-encoded blobs. Normalization decodes them and adds metadata."}),e.jsx("div",{className:"code-block",children:`// Raw log from RPC
{
    "blockNumber": 100,
    "transactionHash": "0xabc...",
    "logIndex": 0,
    "data": "0x00...01",
    "topics": [
        "0xddf252ad...", // Transfer(address,address,uint256) topic
        "0x123...",      // from
        "0x456..."       // to
    ]
}

// Normalized event
{
    "dedup_key": "100-0xabc...-0",
    "blockNumber": 100,
    "logIndex": 0,
    "txHash": "0xabc...",
    "eventType": "Transfer",
    "from": "0x123...",
    "to": "0x456...",
    "value": "1000000000000000000",
    "timestamp": 1673000000,
    "confirmed": false // Confirmation depth < 12
}`}),e.jsx("h2",{children:"4.2 Storage: Denormalization and Derived State"}),e.jsx("p",{children:'Raw events are stored indelible. But queries often need "current state," not history. Use denormalization to precompute:'}),e.jsxs("ul",{children:[e.jsx("li",{children:"Current balance per user."}),e.jsx("li",{children:"Total supply."}),e.jsx("li",{children:"Aggregated volumes (swaps per user, lending per pool)."})]}),e.jsx("div",{className:"code-block",children:`// Raw events table (immutable)
CREATE TABLE Transfer (
    dedup_key VARCHAR PRIMARY KEY,
    from_addr VARCHAR,
    to_addr VARCHAR,
    value BIGINT,
    blockNumber INT,
    logIndex INT
);

// Denormalized balance state (mutable)
CREATE TABLE UserBalance (
    user_addr VARCHAR PRIMARY KEY,
    balance BIGINT,
    updated_at INT
);

// On each Transfer event:
UPDATE UserBalance SET balance = balance - value WHERE user_addr = from_addr;
UPDATE UserBalance SET balance = balance + value WHERE user_addr = to_addr;

// Tradeoff: Denormalization adds write cost (2 UPDATEs per event) but makes
// balance queries O(1) instead of O(total transfer count)`}),e.jsx("h2",{children:"4.3 Caching and Pagination"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Caching:"})," In-memory cache of recent balances (TTL 10–60 seconds) eliminates database round-trips."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pagination:"})," Prevent clients from fetching millions of rows. Use limit, offset, or cursor-based pagination."]}),e.jsx("div",{className:"code-block",children:`// API: GET /transfers?user=0x123&limit=20&offset=0
// Returns 20 oldest transfers for user 0x123

// Better: cursor-based (stable across re-indexing)
// GET /transfers?user=0x123&limit=20&after=blockNumber-logIndex
// Returns 20 transfers after the cursor`}),e.jsx("h2",{children:"4.4 Reconciliation Against On-Chain Truth"}),e.jsx("p",{children:"Periodically verify that the indexer's derived state matches the contract's actual state."}),e.jsx("div",{className:"code-block",children:`async function reconcile() {
    const indexedBalance = await db.query(
        'SELECT balance FROM UserBalance WHERE user = ?',
        [userAddr]
    );
    const onChainBalance = await contract.balanceOf(userAddr);
    
    if (indexedBalance !== onChainBalance) {
        console.error('Mismatch:', { indexed: indexedBalance, onChain: onChainBalance });
        // Reprocess logs for this user or flag for manual review
    }
}

// Run daily or after detecting indexer lag`}),e.jsx("h2",{children:"4.5 Query API Design"}),e.jsx("p",{children:"Expose a REST or GraphQL API for the dApp to query:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"GET /balance?user=0x123"})," → Current balance."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GET /transfers?user=0x123&limit=20"})," → Historical transfers."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GET /health"})," → Indexer lag, confirmations, sync status."]})]}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("section4"),children:"Mark as Read"})]}),I=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"5. Operational Considerations: Observability, Monitoring, Resilience"}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Key Takeaway:"})," An indexer in production is not a one-time script; it is a service with SLAs, alerts, incident response, and observability."]}),e.jsx("h2",{children:"5.0 Observability: What to Monitor"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Indexer lag:"})," Distance between chain tip and indexer head. Should be near zero (<1 minute in normal conditions). Alert if lag > 5 minutes."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Processing rate:"})," Logs processed per second. Should be stable. A sudden drop indicates a bottleneck (database, RPC, CPU)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Reorg detection rate:"})," How often reorgs are detected and handled. Expected: low frequency, but should be > 0 (if zero, reorg handling may be broken)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Reconciliation mismatches:"})," Derived state vs. on-chain state. Should be zero. Any mismatch is a P1 incident."]}),e.jsx("h2",{children:"5.1 Alerting"}),e.jsx("p",{children:e.jsx("strong",{children:"Critical alerts:"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"Indexer lag > 10 minutes."}),e.jsx("li",{children:"Reconciliation mismatch detected."}),e.jsx("li",{children:"Database connection failure."}),e.jsx("li",{children:"RPC endpoint down (none of the RPCs are responding)."})]}),e.jsx("p",{children:e.jsx("strong",{children:"Warning alerts:"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"Indexer lag slowly increasing."}),e.jsx("li",{children:"Processing rate below threshold."}),e.jsx("li",{children:"High number of reorgs in a short window (possible chain instability)."})]}),e.jsx("h2",{children:"5.2 Incident Playbooks"}),e.jsx("p",{children:e.jsx("strong",{children:"RPC outage:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Switch to secondary RPC."}),e.jsx("li",{children:"Monitor for data divergence (reorg detection)."}),e.jsx("li",{children:"If secondary is also down, pause indexing and alert."}),e.jsx("li",{children:"When RPC recovers, backfill any missed blocks."})]}),e.jsx("p",{children:e.jsx("strong",{children:"Reorg deeper than expected (e.g., 50 blocks):"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Detect the reorg via block hash mismatch."}),e.jsx("li",{children:"Roll back to the common ancestor."}),e.jsx("li",{children:"Reprocess affected blocks."}),e.jsx("li",{children:"Alert operators; this may indicate network instability."})]}),e.jsx("p",{children:e.jsx("strong",{children:"Reconciliation mismatch:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Identify affected user/event."}),e.jsx("li",{children:"Check if logs are missing (contract not emitted event) or indexer bug."}),e.jsx("li",{children:"If indexer bug: replay affected blocks, verify dedup keys, check for NULL handling."}),e.jsx("li",{children:"Update state, notify user if needed."})]}),e.jsx("h2",{children:"5.3 Replay and Backfill Tooling"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Replay:"})," Reprocess known blocks (useful after a bug fix or schema change)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Backfill:"})," Fetch and process historical blocks (useful when deploying a new indexer or adding a new contract)."]}),e.jsx("div",{className:"code-block",children:`// Replay blocks 100-110
async function replay(fromBlock, toBlock) {
    for (let bn = fromBlock; bn <= toBlock; bn++) {
        const logs = await rpc.getLogs({
            address: CONTRACT,
            fromBlock: bn,
            toBlock: bn
        });
        for (const log of logs) {
            await processLog(log); // Idempotent: dedup key prevents double-count
        }
    }
}

// Backfill from genesis to latest
async function backfill() {
    const latestBlock = await rpc.getBlockNumber();
    const batchSize = 1000; // Fetch 1000 blocks at a time to avoid RPC limits
    for (let bn = 0; bn <= latestBlock; bn += batchSize) {
        await replay(bn, Math.min(bn + batchSize, latestBlock));
    }
}`}),e.jsx("h2",{children:"5.4 Operational Checklists"}),e.jsx("p",{children:e.jsx("strong",{children:"Before production:"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"Reorg handling tested with simulated reorgs (testnet preferred)."}),e.jsx("li",{children:"Dedup keys verified (no double-counting after replays)."}),e.jsx("li",{children:"Reconciliation implemented and passing for 24+ hours."}),e.jsx("li",{children:"Alerts configured and tested."}),e.jsx("li",{children:"Runbooks written for common incidents."}),e.jsx("li",{children:"RPC failover tested (primary down, secondary serving)."})]}),e.jsx("p",{children:e.jsx("strong",{children:"During operation:"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"Check indexer health dashboard daily."}),e.jsx("li",{children:"Review logs for errors or unusual patterns."}),e.jsx("li",{children:"Verify reconciliation status weekly."}),e.jsx("li",{children:"Test RPC failover monthly (switch to secondary, verify data consistency)."})]}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("section5"),children:"Mark as Read"})]}),B=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"6. Mini Case Study: The Invalid Balance Incident"}),e.jsx("h2",{children:"6.0 The Incident"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Date:"})," March 15, 2024. ",e.jsx("strong",{children:"Impact:"})," Lending protocol showing incorrect collateral balances. Users receive liquidation warnings for accounts with sufficient collateral."]}),e.jsx("h2",{children:"6.1 Timeline"}),e.jsxs("p",{children:[e.jsx("strong",{children:"09:15 UTC:"})," Indexer detects a 12-block reorg on mainnet (unusual but not unheard of). Indexer rolls back to block 16,500,000 and reprocesses blocks 16,500,001– 16,500,012."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"09:20 UTC:"})," Monitoring alerts: reconciliation mismatch for user 0x1234... Indexed balance: 100 ETH. On-chain balance: 90 ETH. 10 ETH unaccounted."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"09:25 UTC:"}),` On-call engineer investigates. The user's Deposit log is missing in the reprocessed blocks. Query: "Why was the Deposit in the old block 16,500,003 not in the new 16,500,003'?"`]}),e.jsxs("p",{children:[e.jsx("strong",{children:"09:30 UTC:"})," Engineer fetches the old and new blocks from an archive RPC. Old block 16,500,003: contains Deposit(0x1234, 10 ETH). New block 16,500,003': no Deposit log. The transaction that emitted the Deposit is missing in the new block."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"09:35 UTC:"})," The transaction was not dropped; it was simply mined in a different block (16,500,010') after the reorg. The indexer correctly rolled back to 16,500,000 but did not reprocess blocks 16,500,010+, because the reorg detection only compared blocks 16,500,001–16,500,012."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Root cause:"})," The indexer's reorg detection logic was:"]}),e.jsx("div",{className:"code-block",children:`// BUGGY
async function detectReorg() {
    const latestBlock = await rpc.getBlockNumber();
    const checkpointBlock = 16500000; // Last known good block
    const diffBlocks = latestBlock - checkpointBlock;
    
    for (let i = 0; i < Math.min(diffBlocks, 100); i++) { // Only check last 100 blocks
        const expectedHash = checkpoint.blockHashes[latestBlock - i];
        const actualHash = await rpc.getBlock(latestBlock - i);
        if (expectedHash !== actualHash.hash) {
            console.log('Reorg detected at block', latestBlock - i);
            return latestBlock - i;
        }
    }
}

// Problem: If checkpoint is 100+ blocks old and a reorg is 50 blocks deep,
// the check never reaches back far enough to detect the divergence`}),e.jsxs("p",{children:[e.jsx("strong",{children:"09:40 UTC:"})," Engineer realizes the issue and manually triggers a full replay from block 16,500,000 to latest. Balances reconcile. The Deposit log now appears in 16,500,010', and the balance is corrected."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"09:45 UTC:"})," RootCause: The checkpoint strategy was naive. Instead of storing checkpoints at every block, the indexer only stored every 100th block, causing large reorg-detection blindness."]}),e.jsx("h2",{children:"6.2 Prevention Playbook"}),e.jsx("p",{children:e.jsx("strong",{children:"1. Robust reorg detection:"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"Store block hashes for the last N blocks (N ≥ 32 for mainnet). Detect reorgs until N blocks ago."}),e.jsx("li",{children:"If a reorg deeper than N is suspected, trigger a full backfill from a known-good block."})]}),e.jsx("p",{children:e.jsx("strong",{children:"2. Reconciliation:"})}),e.jsx("ul",{children:e.jsx("li",{children:"Run daily reconciliation for a sample of users. On mismatch, alert and backfill."})}),e.jsx("p",{children:e.jsx("strong",{children:"3. RPC diversification:"})}),e.jsx("ul",{children:e.jsx("li",{children:"Use multiple archive RPCs to fetch old blocks. Verify that all RPCs agree on old block hashes."})}),e.jsx("p",{children:e.jsx("strong",{children:"4. Testing:"})}),e.jsx("ul",{children:e.jsx("li",{children:"Simulate reorgs: inject a 50-block reorg in a testnet, verify that the indexer detects and recovers."})}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("casestudy"),children:"Mark as Read"})]}),q=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"7. Hands-On Lab: Build a Reorg-Safe Indexer"}),e.jsxs("div",{className:"callout-key",children:[e.jsx("strong",{children:"Objective:"})," Implement a minimal indexer that survives reorgs, backfills historical logs, and exposes a query API. Learners will understand the full pipeline and operational challenges."]}),e.jsx("h2",{children:"7.0 Components"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Indexer (backend):"})," Node.js/TypeScript service that polls for logs, stores events, and detects reorgs."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Client (frontend):"})," React dApp that reads from the indexer and handles RPC failover."]})]}),e.jsx("h2",{children:"7.1 Indexer Phase 1: Basic Polling and Storage"}),e.jsx("div",{className:"code-block",children:`// indexer.ts
import Alchemy from 'alchemy-sdk';
import Database from 'better-sqlite3';

const db = new Database('indexer.db');
const rpc = Alchemy.init({ apiKey: process.env.ALCHEMY_KEY });
const CONTRACT = '0x...';

// Tables
db.exec(\`
    CREATE TABLE IF NOT EXISTS block_checkpoint (
        blockNumber INTEGER PRIMARY KEY,
        blockHash TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS events (
        dedup_key TEXT PRIMARY KEY,
        blockNumber INTEGER,
        logIndex INTEGER,
        txHash TEXT,
        eventType TEXT,
        from_addr TEXT,
        to_addr TEXT,
        value TEXT,
        confirmed INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS user_balance (
        user_addr TEXT PRIMARY KEY,
        balance TEXT,
        lastUpdated INTEGER
    );
\`);

async function indexerLoop() {
    let lastProcessedBlock = (await getLastCheckpoint()) || 0;
    
    while (true) {
        try {
            const latestBlock = await rpc.core.getBlockNumber();
            
            if (latestBlock > lastProcessedBlock) {
                const logs = await rpc.core.getLogs({
                    address: CONTRACT,
                    fromBlock: lastProcessedBlock + 1,
                    toBlock: Math.min(latestBlock, lastProcessedBlock + 1000),
                });
                
                for (const log of logs) {
                    await processLog(log);
                }
                
                // Detect reorgs
                await detectReorg(lastProcessedBlock, latestBlock);
                
                lastProcessedBlock = latestBlock;
                await saveCheckpoint(latestBlock);
            }
            
            await sleep(2000);
        } catch (e) {
            console.error('Indexer error:', e);
            await sleep(5000);
        }
    }
}

async function processLog(log: any) {
    const dedup_key = \`\${log.blockNumber}-\${log.transactionHash}-\${log.logIndex}\`;
    
    // Decode log (simplified)
    const { to_addr, value } = decodeTransferLog(log);
    
    const stmt = db.prepare(\`
        INSERT OR IGNORE INTO events
        (dedup_key, blockNumber, logIndex, txHash, eventType, to_addr, value, confirmed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    \`);
    
    stmt.run(dedup_key, log.blockNumber, log.logIndex, log.transactionHash,
        'Transfer', to_addr, value, 0);
    
    // Update balance (idempotent: only insert if not exists)
    const updateStmt = db.prepare(\`
        UPDATE user_balance SET balance = balance + ?, lastUpdated = ?
        WHERE user_addr = ?
    \`);
    updateStmt.run(value, Date.now(), to_addr);
}

async function detectReorg(lastBlock: number, latestBlock: number) {
    const REORG_DEPTH = 32;
    for (let i = Math.max(1, lastBlock - REORG_DEPTH); i <= lastBlock; i++) {
        const checkpoint = db.prepare('SELECT blockHash FROM block_checkpoint WHERE blockNumber = ?').get(i);
        if (checkpoint) {
            const block = await rpc.core.getBlock(i);
            if (block.hash !== checkpoint.blockHash) {
                console.log('REORG DETECTED at block', i);
                await rollback(i - 1);
                break;
            }
        }
    }
}

async function rollback(toBlock: number) {
    // Delete events after toBlock
    db.prepare('DELETE FROM events WHERE blockNumber > ?').run(toBlock);
    db.prepare('DELETE FROM block_checkpoint WHERE blockNumber > ?').run(toBlock);
    
    // Recalculate balances (expensive, but ensures correctness)
    db.prepare('DELETE FROM user_balance').run();
    const events = db.prepare('SELECT * FROM events ORDER BY blockNumber').all();
    for (const event of events) {
        const stmt = db.prepare(\`
            INSERT OR IGNORE INTO user_balance (user_addr, balance) VALUES (?, 0)
        \`);
        stmt.run(event.to_addr);
        db.prepare('UPDATE user_balance SET balance = balance + ? WHERE user_addr = ?')
            .run(event.value, event.to_addr);
    }
}

async function getLastCheckpoint() {
    const row = db.prepare('SELECT blockNumber FROM block_checkpoint ORDER BY blockNumber DESC LIMIT 1').get();
    return row?.blockNumber || 0;
}

async function saveCheckpoint(blockNumber: number) {
    const block = await rpc.core.getBlock(blockNumber);
    db.prepare('INSERT OR REPLACE INTO block_checkpoint (blockNumber, blockHash) VALUES (?, ?)').run(blockNumber, block.hash);
}

// Query API (Express server)
import express from 'express';
const app = express();

app.get('/balance/:user', (req, res) => {
    const row = db.prepare('SELECT balance FROM user_balance WHERE user_addr = ?').get(req.params.user);
    res.json({ balance: row?.balance || '0', user: req.params.user });
});

app.get('/health', (req, res) => {
    const checkpoint = db.prepare('SELECT blockNumber FROM block_checkpoint ORDER BY blockNumber DESC LIMIT 1').get();
    const latestOnChain = await rpc.core.getBlockNumber();
    res.json({ indexedBlock: checkpoint?.blockNumber, chainBlock: latestOnChain, lag: latestOnChain - checkpoint.blockNumber });
});

app.listen(3000, () => indexerLoop());`}),e.jsx("h2",{children:"7.2 Indexer Phase 2: Confirmation Tracking"}),e.jsxs("p",{children:["Modify the ",e.jsx("code",{children:"confirmed"})," column to reflect confirmation depth. As blocks are added after an event, increment confirmation depth."]}),e.jsx("div",{className:"code-block",children:`// After each new block, update confirmations
async function updateConfirmations(latestBlock: number) {
    const CONFIRMATION_THRESHOLD = 12; // 12 blocks
    
    db.prepare(\`
        UPDATE events SET confirmed = 1
        WHERE ? - blockNumber >= ?
    \`).run(latestBlock, CONFIRMATION_THRESHOLD);
}`}),e.jsx("h2",{children:"7.3 Client Phase 1: Fetch and Display Balance"}),e.jsx("div",{className:"code-block",children:`// React client
import { useState, useEffect } from 'react';

export function BalanceViewer({ userAddress }) {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function fetch() {
            try {
                const res = await fetch(\`http://localhost:3000/balance/\${userAddress}\`);
                const data = await res.json();
                setBalance(data.balance);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        
        fetch();
        const interval = setInterval(fetch, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, [userAddress]);
    
    return (
        <div>
            {loading ? 'Loading...' : \`Balance: \${balance}\`}
            {error && <div className="error">{error}</div>}
        </div>
    );
}`}),e.jsx("h2",{children:"7.4 Challenge Extensions"}),e.jsxs("p",{children:[e.jsx("strong",{children:"1. Multi-RPC failover (client):"})," If indexer is down, fetch balance directly from contract via Multicall3."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2. Reconciliation job:"})," Schedule a background task to verify that indexer balance == contract balance. Alert on mismatch."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3. Deduplication validation:"})," Replay blocks 100–110, verify that all balances remain unchanged (dedup is working)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4. Reorg simulation:"})," Manually delete blocks 100–105 from the checkpoint table, inject a reorg, and verify rollback + reprocess."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"5. Performance testing:"})," Backfill 1,000,000 logs; measure query latency and indexing speed."]}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("lab"),children:"Mark as Read"})]}),O=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"8. Reorg Tabletop Exercise: Choose Your Destiny"}),e.jsx("p",{children:"In this interactive scenario, you control an indexer's reorg-safety strategy, and the simulation shows the consequences."}),e.jsxs("div",{className:"interactive-card",children:[e.jsx("h2",{children:"Scenario: A 20-Block Reorg Occurs at Block 16,500,000"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Chain state before reorg:"})," User Alice has a balance of 100 ETH (from 20 Transfer logs spanning blocks 16,500,000–16,500,019)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"The reorg:"})," Blocks 16,499,980–16,500,019 are replaced. Alice's Deposit log (20 ETH) at block 16,500,010 is moved to block 16,500,008."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Your decision:"})," Configure your indexer."]}),e.jsx("div",{className:"control-group",children:e.jsxs("label",{children:[e.jsx("strong",{children:'Confirmation Depth (for "finalized" balance):'}),e.jsxs("select",{value:r.confirmationDepth,onChange:t=>u({...r,confirmationDepth:parseInt(t.target.value)}),children:[e.jsx("option",{value:6,children:"6 blocks (high risk, fast)"}),e.jsx("option",{value:12,children:"12 blocks (medium, typical)"}),e.jsx("option",{value:32,children:"32 blocks (very safe, slow)"}),e.jsx("option",{value:64,children:"64 blocks (paranoid)"})]})]})}),e.jsx("div",{className:"control-group",children:e.jsxs("label",{children:[e.jsx("strong",{children:"Indexing Strategy:"}),e.jsxs("select",{value:r.indexingStrategy,onChange:t=>u({...r,indexingStrategy:t.target.value}),children:[e.jsx("option",{value:"eventual",children:"Eventual (process all blocks, handle reorgs retroactively)"}),e.jsx("option",{value:"safe",children:"Safe (only show confirmed balance, always wait for depth)"}),e.jsx("option",{value:"optimistic",children:"Optimistic (show balance immediately, revert on reorg)"})]})]})}),e.jsx("div",{className:"control-group",children:e.jsxs("label",{children:[e.jsx("strong",{children:"Client UX Rule:"}),e.jsxs("select",{value:r.clientUXRule,onChange:t=>u({...r,clientUXRule:t.target.value}),children:[e.jsx("option",{value:"show-pending",children:"Show pending + confirmed separately"}),e.jsx("option",{value:"show-confirmed-only",children:"Show confirmed only"}),e.jsx("option",{value:"show-all",children:"Show all (user bears risk)"})]})]})}),e.jsx("button",{className:"btn-primary",onClick:()=>{u({...r,scenarioRunning:!0}),setTimeout(()=>{const{confirmationDepth:t,indexingStrategy:s,clientUXRule:i}=r;let n=`Reorg Scenario Results:

`;n+=`Configuration:
`,n+=`- Confirmation Depth: ${t}
`,n+=`- Strategy: ${s}
`,n+=`- UX Rule: ${i}

`,t<=20&&(n+=`⚠️ WARNING: Your confirmation depth (${t}) is less than the reorg depth (20)!
`,n+=`   Even if the reorg is detected, you may have already served incorrect state.

`),s==="eventual"?(n+=`✓ Eventual strategy: Indexer will detect reorg at block 16,499,980, roll back, and reprocess.
`,n+=`  All 20 affected blocks are replayed. Alice's balance remains 100 ETH. ✓ CORRECT

`):s==="safe"?(n+=`✓ Safe strategy: Events only finalized after ${t} blocks.
`,n+=`  Reorg at block 16,500,000 happens ${t<=20?"before finality":"after finality"}.
`,t>20?n+=`  Alice's balance WAS finalized before reorg. Balance remains 100 ETH. ✓ CORRECT

`:n+=`  Alice's balance NOT finalized; treated as reorg during confirmation. Reprocessed. ✓ CORRECT

`):s==="optimistic"&&(n+=`⚠️ Optimistic strategy: Balance shown immediately.
`,t<=20?(n+=`  User sees 100 ETH, then reorg happens, balance reverts. User sees flapping balance!
`,n+=`  Product trust damaged. ❌ BAD UX

`):n+=`  Reorg happens after confirmation depth; reverted balance is acceptable.

`),i==="show-pending"?(n+=`Client UX: Shows pending (< ${t} blocks) and confirmed separately.
`,n+=`  User sees two numbers, understands risk. ✓ GOOD

`):i==="show-confirmed-only"?(n+=`Client UX: Shows only confirmed balance (${t}+ blocks).
`,n+=`  User sees delayed balance, but no reorg surprise. ✓ GOOD

`):i==="show-all"&&(n+=`Client UX: Shows all balance immediately.
`,n+=`  High risk of reorg-induced flapping. ❌ BAD

`),n+=`
Final Verdict:
`,t>=32||t>20&&s==="safe"?n+=`✓ SAFE: Very low risk of user seeing incorrect balance due to reorg.
`:t>=12&&s!=="optimistic"?n+=`✓ ACCEPTABLE: Low risk with typical reorg depth. Monitor for deeper reorgs.
`:n+=`⚠️ RISKY: User may see balance flapping or unconfirmed state. Educate user or increase depth.
`,u({...r,scenarioRunning:!1,scenarioOutput:n})},500)},children:"Run Simulation"}),r.scenarioOutput&&e.jsxs("div",{className:"scenario-output",children:[e.jsx("h3",{children:"Outcome:"}),e.jsx("pre",{children:r.scenarioOutput})]})]}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("tabletop"),children:"Mark as Complete"})]}),z=()=>{const t=j.final,s=a[`${t.id}-submitted`];return e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:t.title}),t.questions.map(i=>e.jsxs("div",{className:"quiz-question",children:[e.jsx("p",{children:e.jsx("strong",{children:i.question})}),i.type==="mc"&&e.jsx("div",{children:i.options.map((n,l)=>e.jsxs("label",{className:"radio-label",children:[e.jsx("input",{type:"radio",name:i.id,value:l,checked:a[i.id]==l,onChange:()=>p(i.id,l),disabled:s&&d===!1}),n]},l))}),i.type==="sa"&&e.jsx("textarea",{value:a[i.id]||"",onChange:n=>p(i.id,n.target.value),placeholder:"Your answer...",disabled:s&&d===!1}),s&&(m||d)&&e.jsx("div",{className:"answer-reveal",children:e.jsxs("p",{children:[e.jsx("strong",{children:"Explanation:"})," ",i.explanation]})})]},i.id)),e.jsx("button",{className:"btn-primary",onClick:()=>{v(t.id),o(t.id)},disabled:s,children:s?"Submitted":"Submit Assessment"})]})},D=()=>e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:"10. Summary & References"}),e.jsx("h2",{children:"Key Takeaways"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Wallet UX is a systems problem:"})," Nonce, signing, approval fatigue, and custody tradeoffs are not UX fluff—they shape dApp product requirements."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"RPCs are fallible:"})," Rate limits, latency, and divergence are normal. Design dApps that survive RPC issues."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reorgs are consensus behavior:"})," An indexer that does not handle reorgs will accumulate incorrect state. Dedup keys and idempotent processing are mandatory."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Indexing is a pipeline:"})," Ingest → normalize → store → query. Each stage can be optimized. Denormalization trades write cost for query speed."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Operations is core:"})," Observability, alerting, incident playbooks, and resilience testing separate production systems from hobby projects."]})]}),e.jsx("h2",{children:"Further Reading"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"ERC-2612 (Permit):"})," Approve-by-signature, reducing UX friction.",e.jsx("br",{}),e.jsx("code",{children:"https://eips.ethereum.org/EIPS/eip-2612"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sign-In with Ethereum (SIWE):"})," Message signing for authentication.",e.jsx("br",{}),e.jsx("code",{children:"https://eips.ethereum.org/EIPS/eip-4361"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Alchemy SDK / Ethers.js:"})," Popular libraries for RPC interaction and fallover."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"The Graph:"})," A production indexer for Ethereum. Study its architecture for ideas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MEV and Reorgs:"})," Flashbots research on reorg dynamics.",e.jsx("br",{}),e.jsx("code",{children:"https://writings.flashbots.net"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Observability in Distributed Systems:"}),' Brendan Gregg, "Systems Performance."']})]}),e.jsx("h2",{children:"Recommended Project: Build a DEX Aggregator Indexer"}),e.jsx("p",{children:"Combine an indexer with a client to show the best swap prices across DEXs. Your indexer must:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Index Swap events from Uniswap V3, Curve, and Balancer."}),e.jsx("li",{children:'Denormalize into a "best_price" table (token_in → token_out → best_price, block_num).'}),e.jsx("li",{children:"Backfill 100,000 events and handle reorgs."}),e.jsxs("li",{children:["Expose a REST API: GET /best_price?token_in=&token_out= → ",(price,block,age_blocks)]}),e.jsx("li",{children:"Client shows price with confirmation depth indicator."}),e.jsx("li",{children:"Write a reconciliation job that spots-checks prices against contract state."})]}),e.jsx("button",{className:"btn-secondary",onClick:()=>o("summary"),children:"Mark as Complete"})]}),U=t=>{const s=j[t];if(!s)return null;const i=a[`${t}-submitted`];return e.jsxs("div",{className:"content-section",children:[e.jsx("h1",{children:s.title}),s.questions.map(n=>e.jsxs("div",{className:"quiz-question",children:[e.jsx("p",{children:e.jsx("strong",{children:n.question})}),n.type==="mc"&&e.jsx("div",{children:n.options.map((l,h)=>e.jsxs("label",{className:"radio-label",children:[e.jsx("input",{type:"radio",name:n.id,value:h,checked:a[n.id]==h,onChange:()=>p(n.id,h),disabled:i&&d===!1}),l]},h))}),n.type==="ms"&&e.jsx("div",{children:n.options.map((l,h)=>e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",checked:(a[n.id]||[]).includes(h),onChange:H=>{const R=a[n.id]||[];H.target.checked?p(n.id,[...R,h]):p(n.id,R.filter(M=>M!==h))},disabled:i&&d===!1}),l]},h))}),n.type==="sa"&&e.jsx("textarea",{value:a[n.id]||"",onChange:l=>p(n.id,l.target.value),placeholder:"Your answer...",disabled:i&&d===!1}),i&&(m||d)&&e.jsx("div",{className:"answer-reveal",children:e.jsxs("p",{children:[e.jsx("strong",{children:"Explanation:"})," ",n.explanation]})})]},n.id)),e.jsx("button",{className:"btn-primary",onClick:()=>{v(t),o(t)},disabled:i,children:i?"Submitted":"Submit Quiz"})]})},L=()=>{switch(b){case"intro":return w();case"section1":return E();case"section2":return S();case"section3":return P();case"section4":return N();case"section5":return I();case"casestudy":return B();case"lab":return q();case"tabletop":return O();case"final":return z();case"summary":return D();case"quiz1":case"quiz2":case"quiz3":case"quiz4":case"quiz5":return U(b);default:return w()}};return e.jsxs("div",{className:"dapp-architecture-module",children:[e.jsx("style",{children:`
                * {
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: #f5f5f5;
                }
                
                .dapp-architecture-module {
                    display: flex;
                    height: 100vh;
                    background: #fff;
                }
                
                .sidebar {
                    width: 280px;
                    border-right: 1px solid #e0e0e0;
                    overflow-y: auto;
                    background: #fafafa;
                    padding: 20px;
                }
                
                .sidebar h3 {
                    margin-top: 0;
                    font-size: 14px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                
                .progress-fill {
                    height: 100%;
                    background: #4CAF50;
                    transition: width 0.3s;
                }
                
                .section-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .section-item {
                    padding: 8px 12px;
                    margin: 4px 0;
                    border-radius: 4px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .section-item:hover {
                    background: #e8e8e8;
                }
                
                .section-item.active {
                    background: #4CAF50;
                    color: white;
                    font-weight: 600;
                }
                
                .section-item.completed::before {
                    content: '✓';
                    font-weight: bold;
                    margin-right: 8px;
                }
                
                .controls {
                    display: flex;
                    gap: 8px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }
                
                .controls button {
                    padding: 6px 10px;
                    font-size: 11px;
                    flex: 1;
                    min-width: 80px;
                }
                
                .main-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 40px;
                }
                
                .content-section {
                    max-width: 900px;
                    margin: 0 auto;
                }
                
                h1 {
                    font-size: 32px;
                    margin-bottom: 20px;
                    color: #333;
                }
                
                h2 {
                    font-size: 22px;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    color: #444;
                    border-bottom: 2px solid #4CAF50;
                    padding-bottom: 8px;
                }
                
                h3 {
                    font-size: 16px;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    color: #555;
                }
                
                p {
                    line-height: 1.7;
                    color: #555;
                    margin: 12px 0;
                }
                
                ul, ol {
                    margin: 12px 0;
                    padding-left: 30px;
                    line-height: 1.8;
                }
                
                li {
                    margin: 8px 0;
                    color: #555;
                }
                
                .callout-key {
                    background: #e3f2fd;
                    border-left: 4px solid #2196F3;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                
                .callout-pitfall {
                    background: #fff3e0;
                    border-left: 4px solid #ff9800;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                
                .code-block {
                    background: #f5f5f5;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 15px;
                    overflow-x: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    line-height: 1.5;
                    color: #333;
                    margin: 15px 0;
                }
                
                .abstract {
                    background: #f0f0f0;
                    padding: 15px;
                    border-radius: 4px;
                    font-style: italic;
                    color: #666;
                    margin: 20px 0;
                }
                
                .btn-primary, .btn-secondary {
                    padding: 12px 24px;
                    font-size: 14px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s;
                    font-weight: 600;
                    margin-right: 10px;
                }
                
                .btn-primary {
                    background: #4CAF50;
                    color: white;
                }
                
                .btn-primary:hover {
                    background: #45a049;
                }
                
                .btn-primary:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .btn-secondary {
                    background: #2196F3;
                    color: white;
                }
                
                .btn-secondary:hover {
                    background: #0b7dda;
                }
                
                .quiz-question {
                    background: #fafafa;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                    border-left: 4px solid #2196F3;
                }
                
                .radio-label, .checkbox-label {
                    display: block;
                    padding: 8px;
                    margin: 8px 0;
                    cursor: pointer;
                    user-select: none;
                }
                
                .radio-label input, .checkbox-label input {
                    margin-right: 8px;
                    cursor: pointer;
                }
                
                .answer-reveal {
                    background: #e8f5e9;
                    padding: 12px;
                    margin-top: 12px;
                    border-radius: 4px;
                    border-left: 3px solid #4CAF50;
                }
                
                textarea {
                    width: 100%;
                    min-height: 120px;
                    padding: 10px;
                    font-family: Arial, sans-serif;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .control-group {
                    margin: 15px 0;
                }
                
                .control-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }
                
                .control-group select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .interactive-card {
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 4px;
                    margin: 20px 0;
                }
                
                .scenario-output {
                    background: #f5f5f5;
                    border: 1px solid #ccc;
                    padding: 15px;
                    border-radius: 4px;
                    margin-top: 15px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .scenario-output pre {
                    margin: 0;
                    font-family: monospace;
                    white-space: pre-wrap;
                    word-break: break-word;
                    color: #333;
                }
            `}),e.jsxs("div",{className:"sidebar",children:[e.jsx("h3",{children:"📚 Module Progress"}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${A}%`}})}),e.jsxs("p",{style:{fontSize:"12px",color:"#666",margin:"5px 0"},children:[y.length," / ",x.length," sections"]}),e.jsx("h3",{style:{marginTop:"30px"},children:"📖 Sections"}),e.jsx("ul",{className:"section-list",children:x.map(t=>e.jsx("li",{className:`section-item ${b===t.id?"active":""} ${y.find(s=>s.id===t.id)?"completed":""}`,onClick:()=>f(t.id),children:e.jsx("span",{children:t.label})},t.id))}),e.jsxs("div",{className:"controls",children:[e.jsxs("button",{className:"btn-primary",style:{fontSize:"11px",padding:"8px 12px"},onClick:()=>k(!m),children:[m?"Hide":"Show"," Answers"]}),e.jsxs("button",{className:"btn-secondary",style:{fontSize:"11px",padding:"8px 12px"},onClick:()=>C(!d),children:[d?"Student":"Instructor"," Mode"]}),e.jsx("button",{className:"btn-secondary",style:{fontSize:"11px",padding:"8px 12px"},onClick:T,children:"Reset"})]})]}),e.jsx("div",{className:"main-content",children:L()}),e.jsx(_,{})]})};export{X as default};
