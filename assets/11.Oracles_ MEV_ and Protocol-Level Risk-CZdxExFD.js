import{r as m,j as e}from"./index-_agJ5g7C.js";const Y=()=>{const[P,c]=m.useState("intro"),[j,T]=m.useState(new Set),[A,k]=m.useState({}),[G,Q]=m.useState(!1),[f,w]=m.useState(null),[b,I]=m.useState(!1),[l,y]=m.useState({oracleType:"spot",updateFreq:"1min",aggregation:"single",mevMitigation:"none",liquidationThreshold:"150"}),q=["intro","oracle-fundamentals","oracle-design","oracle-attacks","mev-fundamentals","mev-extraction","mev-mitigations","flash-loans","economic-bugs","lab","tabletop","final-assessment"],h=m.useCallback(r=>{T(a=>new Set([...a,r]))},[]),C=m.useMemo(()=>Math.round(j.size/q.length*100),[j.size,q.length]),E=(r,a)=>{k(i=>({...i,[r]:a}))},S={"q-oracle-01":{question:"What is the primary difference between push and pull oracle architectures?",type:"mc",options:[{id:"a",text:"Push: oracle updates data on-chain continuously; Pull: protocol queries oracle when needed",correct:!0},{id:"b",text:"Push oracles are always more secure",correct:!1,why:"Security depends on the oracle's design, not the push/pull distinction. Both have tradeoffs."},{id:"c",text:"Pull oracles cannot be manipulated",correct:!1,why:"Pull oracles can be manipulated through the underlying data source (e.g., AMM spot prices)."}],explanation:"Push oracles proactively update state; pull oracles are queried on demand. Push offers freshness guarantees at the cost of gas and latency. Pull offers lower costs but shifts staleness risk to the caller."},"q-oracle-02":{question:"A TWAP (Time-Weighted Average Price) oracle is more robust than spot price because (select all that apply):",type:"ms",options:[{id:"a",text:"It smooths short-term volatility and manipulation attempts",correct:!0},{id:"b",text:"It requires an attacker to keep the price impact sustained across the window",correct:!0},{id:"c",text:"It is immune to large trades",correct:!1,why:"Large trades still impact TWAP if sustained; the cost is higher but not impossible."},{id:"d",text:"It trades off latency: the price is always lagged by the window length",correct:!0}],explanation:"TWAPs shift the attack cost from a single large transaction to sustained price impact over the window. This raises the bar but does not eliminate the risk; a multi-block attack or flash loan combo can still manipulate."},"q-oracle-03":{question:"In a medianizer (multi-source aggregator), using median instead of mean is preferred because:",type:"mc",options:[{id:"a",text:"Median is resistant to outliers: an attacker must manipulate >50% of sources to move the final price",correct:!0},{id:"b",text:"Median is always cheaper to compute",correct:!1,why:"Median sorting is O(n log n); mean is O(n). Cost depends on implementation and number of sources."},{id:"c",text:"Median cannot be gamed at all",correct:!1,why:"If >50% of sources are compromised or incentivized badly, median can be moved. Decentralization is the real defense."}],explanation:"Median has a built-in Byzantine fault tolerance: up to 49% of sources can be corrupt or manipulated without moving the final price. Mean offers no such guarantee and is sensitive to even one outlier."},"q-mev-01":{question:"Which of the following is NOT a primary MEV extraction method?",type:"mc",options:[{id:"a",text:"Front-running: placing a transaction before the target in the block",correct:!1,why:"Front-running is a primary MEV extraction method."},{id:"b",text:"Back-running: placing a transaction after the target in the block",correct:!1,why:"Back-running is a primary MEV extraction method."},{id:"c",text:"Selecting a random validator to produce the block",correct:!0},{id:"d",text:"Sandwiching: placing transactions both before and after a target swap",correct:!1,why:"Sandwiching is a common MEV extraction method combining front and back-running."}],explanation:"MEV extraction requires knowledge and control of transaction ordering. Validator selection is random by protocol design; MEV extractors influence ordering through the mempool and relay, not by choosing validators."},"q-mev-02":{question:"Why is MEV a protocol-level security concern, not just a market efficiency issue?",type:"mc",options:[{id:"a",text:"MEV changes the incentive model: users face adversarial ordering, and protocols must defend against price manipulation and liquidation cascades",correct:!0},{id:"b",text:"MEV always reduces total system revenue",correct:!1,why:"MEV is wealth redistribution, not always a net loss; but it breaks fairness and trust assumptions."},{id:"c",text:"MEV is only a concern for DeFi protocols",correct:!1,why:"MEV affects any protocol with valuable transaction ordering (e.g., governance, L2 sequencers)."}],explanation:"MEV transforms how we model security. A protocol must now assume that an attacker with visibility into pending transactions can read, reorder, and suppress them. This breaks traditional fairness and can trigger cascading failures in leveraged systems."},"q-mev-03":{question:"Flashbots Protect (private order flow) changes the threat model by:",type:"mc",options:[{id:"a",text:"Eliminating MEV entirely",correct:!1,why:"Protect hides your tx from public mempool but MEV can still be extracted in the block."},{id:"b",text:"Shifting MEV extraction from public mempool watchers to the trusted relay, which may have its own incentives",correct:!0},{id:"c",text:"Making sandwich attacks impossible",correct:!1,why:"The relay/builder can still front-run or back-run your tx; you are trusting a different party."}],explanation:"Private order flow trades off MEV reduction (fewer mempool watchers) for centralization risk (one relay knows all the secrets). This is a risk shift, not a solution; the guardrail is transparency and relay competition."},"q-flash-01":{question:"A flash loan is different from a regular loan because it must be repaid in the same transaction. Why does this matter for security?",type:"mc",options:[{id:"a",text:"Flash loans allow an attacker to amplify price impact and manipulate oracles across multiple protocols in a single atomic step, matching cost with benefit",correct:!0},{id:"b",text:"Flash loans are always safer because no real capital is at risk",correct:!1,why:"Flash loans are very dangerous precisely because the capital can be used to trigger cascades with no collateral."},{id:"c",text:"Flash loans make protocols immune to manipulation",correct:!1,why:"Flash loans enable new attack vectors, especially when combined with oracle reliance."}],explanation:"Flash loans create a novel attack surface: an attacker can borrow huge sums, use them to push prices, manipulate oracles, trigger liquidations, or arbitrage, and repay within the same block. This is only profitable if the attack extracts more value than the loan fee."},"q-econ-01":{question:'An "economic bug" is a vulnerability that passes unit tests but fails under adversarial incentive pressure. Which scenario is an economic bug?',type:"mc",options:[{id:"a",text:"A liquidation function that does not revert on collateral shortage; an attacker liquidates, collateral is transferred, and the protocol becomes insolvent",correct:!0},{id:"b",text:"A memory leak in the smart contract code",correct:!1,why:"Memory leaks are code bugs, not economic bugs."},{id:"c",text:"A user sending funds to the wrong address",correct:!1,why:"User error is not a protocol vulnerability."}],explanation:"Economic bugs arise when the protocol's incentive model breaks down. Liquidations may pass tests in benign market conditions but fail when an attacker with capital can push prices and trigger insolvency. The bug is the assumption that liquidators and prices are honest."},"q-econ-02":{question:"To defend against liquidation cascades, a protocol should (select all that apply):",type:"ms",options:[{id:"a",text:"Use circuit breakers: pause liquidations if prices move >X% in a short window",correct:!0},{id:"b",text:"Enforce strict collateralization ratios with a large buffer above liquidation threshold",correct:!0},{id:"c",text:"Use decentralized oracle medianizers to smooth spot price manipulation",correct:!0},{id:"d",text:"Unlimited leverage is safe as long as liquidations are automated",correct:!1,why:"Unlimited leverage is fundamentally unstable; liquidations can be MEV-gamed or cascade."}],explanation:"Defense is multi-layered: oracles resist manipulation, collateralization buffers buy time, and circuit breakers halt cascades. No single mechanism suffices; all together raise the cost of an attack to the point of unprofitability."},"q-final-01":{question:"You are designing a collateralized lending protocol. Which oracle + MEV protection combo minimizes risk while keeping costs reasonable?",type:"mc",options:[{id:"a",text:"Spot price oracle + no MEV protection: cheapest, sufficient if users understand slippage risk",correct:!1,why:"Spot oracles are trivially manipulable by flash loans or large trades; this is too risky for collateral pricing."},{id:"b",text:"TWAP oracle from major DEX + slippage limits on user actions + circuit breakers on liquidations",correct:!0},{id:"c",text:"Centralized price feed: always accurate, no MEV concern",correct:!1,why:"Centralized sources are single-point-of-failure; if the source is compromised, all users are at risk."},{id:"d",text:"Decentralized medianizer of 3 sources + no other protection: sufficient due to median robustness",correct:!1,why:"Even median aggregators can be manipulated if >50% of sources are compromised or if the window is short."}],explanation:"The best approach layers defense: use TWAP to raise the attack cost, add slippage limits so users control their worst-case outcome, and back-stop with circuit breakers that catch cascades. This is pragmatic: oracles are not bulletproof, but multi-layer mitigations make attacks expensive."}},d=r=>{const a=S[r];if(!a)return null;const i=A[r];if(!i)return null;if(a.type==="mc"){const p=a.options.find(o=>o.id===i);return p?p.correct:!1}else if(a.type==="ms"){if(!Array.isArray(i))return!1;const o=new Set(i),g=new Set(a.options.filter(u=>u.correct).map(u=>u.id));return o.size===g.size&&[...o].every(u=>g.has(u))}return!1},z=()=>{const r=Object.keys(S);let a=0;return r.forEach(i=>{d(i)&&(a+=1)}),{correct:a,total:r.length}},D=()=>e.jsxs("div",{style:t.navBar,children:[e.jsx("h2",{style:t.navTitle,children:"Oracles, MEV, & Protocol Risk"}),e.jsx("div",{style:t.progressBar,children:e.jsx("div",{style:{...t.progressFill,width:`${C}%`}})}),e.jsxs("p",{style:t.progressText,children:[C,"% Complete"]}),e.jsx("div",{style:t.navMenu,children:q.map(r=>e.jsxs("button",{onClick:()=>c(r),style:{...t.navButton,...P===r?t.navButtonActive:{},...j.has(r)?t.navButtonComplete:{}},"aria-label":`Jump to ${r}`,children:[r.charAt(0).toUpperCase()+r.slice(1).replace("-"," ").substring(0,20),j.has(r)&&" ✓"]},r))}),e.jsxs("div",{style:t.controls,children:[e.jsxs("button",{onClick:()=>I(!b),style:t.button,"aria-label":"Toggle instructor answers",children:[b?"Hide":"Show"," Answers"]}),e.jsx("button",{onClick:()=>{k({}),T(new Set),c("intro"),w(null)},style:t.button,"aria-label":"Reset module",children:"Reset Activity"})]})]}),n=({quizId:r})=>{const a=S[r];if(!a)return null;const i=A[r],p=i?d(r):null;return e.jsxs("div",{style:t.quiz,children:[e.jsxs("p",{style:t.quizQuestion,children:[e.jsx("strong",{children:"Question:"})," ",a.question]}),e.jsxs("div",{style:t.quizOptions,children:[a.type==="mc"&&e.jsx(e.Fragment,{children:a.options.map(o=>e.jsxs("label",{style:t.quizLabel,children:[e.jsx("input",{type:"radio",name:r,value:o.id,checked:i===o.id,onChange:g=>E(r,g.target.value),style:t.quizInput}),o.text,b&&!o.correct&&o.why&&e.jsxs("span",{style:t.distractor,children:[" [Why not: ",o.why,"]"]})]},o.id))}),a.type==="ms"&&e.jsx(e.Fragment,{children:a.options.map(o=>e.jsxs("label",{style:t.quizLabel,children:[e.jsx("input",{type:"checkbox",name:r,value:o.id,checked:Array.isArray(i)&&i.includes(o.id),onChange:g=>{const u=Array.isArray(i)?[...i]:[];g.target.checked?u.push(o.id):u.splice(u.indexOf(o.id),1),E(r,u)},style:t.quizInput}),o.text,b&&!o.correct&&o.why&&e.jsxs("span",{style:t.distractor,children:[" [Why not: ",o.why,"]"]})]},o.id))})]}),i&&p!==null&&e.jsxs("div",{style:{...t.feedback,...p?t.feedbackCorrect:t.feedbackIncorrect},children:[p?"✓ Correct!":"✗ Not quite.",b&&e.jsx("p",{children:a.explanation})]})]})},x=({children:r})=>e.jsxs("div",{style:t.keyTakeaway,children:[e.jsx("strong",{style:t.calloutTitle,children:"Key Takeaway:"}),e.jsx("p",{children:r})]}),v=({children:r})=>e.jsxs("div",{style:t.commonPitfall,children:[e.jsx("strong",{style:t.calloutTitle,children:"⚠ Common Pitfall:"}),e.jsx("p",{children:r})]}),s=({code:r,language:a="solidity"})=>e.jsx("pre",{style:t.codeBlock,children:e.jsx("code",{children:r})}),M=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"Module Overview: Oracles, MEV, and Protocol-Level Risk"}),e.jsx("h3",{children:"Abstract"}),e.jsx("p",{children:'Smart contracts are "blind"—they cannot directly access off-chain data or observe the true cost of computation. This limitation gives rise to two intertwined security challenges:'}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Oracle Risk:"})," How do protocols reliably and decentralley get prices and data on-chain without creating a single point of failure or incentivizing manipulation?"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MEV (Maximal/Miner Extractable Value):"})," Once transactions are in the mempool, who decides their order? And how can an attacker with ordering power manipulate prices, trigger liquidations, or steal value?"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Economic Bugs:"})," How do we reason about adversarial incentives and system invariants? Many DeFi failures pass unit tests but break under real market stress."]})]}),e.jsx("h3",{children:"Learning Objectives"}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"Understand oracle designs (push/pull, spot/TWAP, centralized/decentralized) and their security tradeoffs"}),e.jsx("li",{children:"Identify how oracles can be manipulated (thin liquidity, flash loans, large trades, delayed updates)"}),e.jsx("li",{children:"Grasp MEV extraction methods (front-running, back-running, sandwiching) and why they matter to protocol security"}),e.jsx("li",{children:"Apply practical mitigations: price oracles, slippage limits, commit-reveal, batch auctions, and circuit breakers"}),e.jsx("li",{children:"Reason about economic models under adversarial pressure and test invariants that ensure bounded losses"}),e.jsx("li",{children:"Build and attack a toy protocol in the lab to see these risks firsthand"})]}),e.jsx("h3",{children:"Prerequisites"}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"Understanding of DEXs, AMMs, and how prices form on-chain"}),e.jsx("li",{children:"Basic Solidity or pseudocode familiarity"}),e.jsx("li",{children:"Familiarity with concepts from Modules 4–5 (access control, reentrancy, upgradability)"})]}),e.jsx("h3",{children:"Key Terms"}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Push Oracle:"})," Oracle updates state proactively; protocol consumes latest data"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pull Oracle:"})," Protocol calls oracle function on demand; oracle returns data"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"TWAP (Time-Weighted Average Price):"})," Price averaged over a lookback window, resistant to spot-price shocks"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Medianizer:"})," Aggregates multiple price feeds and returns the median, resilient to minority outlier sources"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Flash Loan:"})," Uncollateralized loan that must be repaid within the same transaction"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MEV:"})," Profit available to whoever controls transaction ordering in a block"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sandwich Attack:"})," Placing transactions before and after a target to profit from price movement"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Circuit Breaker:"})," Automatic pause of protocol operations if a sudden large change (price, volume, etc.) is detected"]})]}),e.jsx(x,{children:"Protocol security is not only about code correctness; it is about incentive design. Assume attackers have capital, can see pending transactions, and will exploit any profitable imbalance."}),e.jsx("button",{onClick:()=>{h("intro"),c("oracle-fundamentals")},style:t.button,children:"Next: Oracle Fundamentals →"})]}),F=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"1. Oracle Fundamentals: How Protocols Get Data"}),e.jsx("h3",{children:"1.1 The Oracle Problem"}),e.jsx("p",{children:"Smart contracts run deterministically and immutably on-chain. They can read blockchain state (balances, contract storage) but cannot directly query the internet, call external APIs, or observe real-world events. Yet DeFi protocols need prices, sports scores, weather data, and other off-chain information to function."}),e.jsxs("p",{children:[e.jsx("strong",{children:"The oracle problem:"})," How can an on-chain protocol trustlessly and decentrally get accurate off-chain data?"]}),e.jsx(x,{children:'Oracles are not a solved problem. They remain a major attack surface. No oracle design is "perfectly secure"; all involve trust assumptions or economic trade-offs.'}),e.jsx("h3",{children:"1.2 Push vs. Pull Oracle Architectures"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Push Oracle:"})," A trusted or decentralized set of entities periodically submit verified data on-chain. Protocols read the latest state."]}),e.jsx(s,{code:`// Push oracle pseudocode
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pros:"})," Protocols always have the latest data. Gas cost is paid by the oracle operator, not the user."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Cons:"})," Oracle operator must be trusted or must operate a decentralized consensus (hard and expensive). Update frequency is fixed, so protocols cannot cherry-pick low prices."]}),e.jsxs("p",{style:{marginTop:"20px"},children:[e.jsx("strong",{children:"Pull Oracle:"})," Protocol calls a function to fetch the current price from an external data source (e.g., Uniswap spot price) or oracle service."]}),e.jsx(s,{code:`// Pull oracle pseudocode (e.g., DEX spot price)
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pros:"})," No trusted operator. Pricing comes directly from market data (DEX liquidity). Gas cost is paid by the caller (user or liquidator), not a global oracle."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Cons:"})," Data is only as fresh as the last block. Attacker can flash loan, move prices, and trigger protocol actions in the same block."]}),e.jsx(v,{children:'Pull oracles from spot prices (DEX reserves) are not "decentralized" just because DEX is decentralized. An attacker with flash loans or large capital can move the spot price in a single block, and the protocol will trust it.'}),e.jsx("h3",{children:"1.3 Update Frequency and Staleness"}),e.jsx("p",{children:"Push oracles update at fixed intervals (e.g., every 1 minute, every 12 seconds). If the real price moves faster, the oracle stales."}),e.jsxs("p",{children:[e.jsx("strong",{children:"Staleness risk:"})," A liquidation or lending action happens at an outdated price, and the protocol is either too lenient or too harsh."]}),e.jsxs("p",{children:["Example: Oracle shows $"," ",e.jsx("code",{children:"ETH = $2000"}),", but spot price crashes to $"," ",e.jsx("code",{children:"$1500"})," in the next block. If liquidations use the stale oracle price, liquidators profit and borrowers lose value."]}),e.jsx(x,{children:"Staleness is the tradeoff for push oracles. Faster updates reduce staleness but cost more gas and require more infrastructure."}),e.jsx(n,{quizId:"q-oracle-01"}),e.jsx("button",{onClick:()=>{h("oracle-fundamentals"),c("oracle-design")},style:t.button,children:"Next: Oracle Designs and Aggregation →"})]}),L=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"2. Oracle Designs: Aggregation, Decentralization, and Robustness"}),e.jsx("h3",{children:"2.1 Spot Prices vs. Time-Weighted Average Prices (TWAP)"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Spot Price:"})," The price at the most recent transaction (last block state)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"TWAP:"})," The arithmetic mean of prices over a lookback window (e.g., 30 min)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Key insight:"})," TWAP raises the cost of manipulation. An attacker who wants to move the TWAP must sustain a price impact across the entire window, not just push the spot once."]}),e.jsx(s,{code:`// Simplified TWAP logic
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Latency tradeoff:"})," A longer window (30 min) is harder to manipulate but the price is older. A short window (1 min) is fresher but cheaper to attack."]}),e.jsx("h3",{children:"2.2 Medianizers and Multi-Source Aggregation"}),e.jsx("p",{children:"Instead of trusting one oracle, a protocol can aggregate multiple sources and take the median price."}),e.jsx(s,{code:`// Simplified medianizer
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Byzantine fault tolerance:"})," The median is resistant to outliers. If 50% or more of sources are corrupt, the median moves; if <49% are corrupt, the median is unaffected."]}),e.jsx(x,{children:'Medianizers work well if sources are truly independent. However, if >50% of sources are owned by the same entity, compromised, or financially incentivized (e.g., all are major DEXs under one AUM footprint), the "decentralization" is illusory.'}),e.jsx("h3",{children:"2.3 Data Provenance and Signed Data"}),e.jsx("p",{children:"Some oracles (e.g., Chainlink) use off-chain computation and validation. A trusted set of nodes run the same computation (e.g., aggregate spot prices from 30 exchanges) and cryptographically sign the result."}),e.jsxs("p",{children:[e.jsx("strong",{children:"Advantage:"})," The on-chain contract verifies signatures, so the protocol does not need to trust a single node or DEX."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Tradeoff:"})," Trust is shifted to the oracle operator who chooses the inputs, aggregation method, and signing threshold. If operators collude or are incentivized, the result is still manipulated."]}),e.jsx("h3",{children:"2.4 What Oracles Guarantee and What They Don't"}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Oracles do NOT guarantee accuracy."})," Even a decentralized oracle can be wrong if all sources are wrong (e.g., all DEXs have thin liquidity and an attacker moves prices)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Oracles do NOT eliminate manipulation risk."})," They raise the cost and latency, but attackers with large capital or flash loans can still exploit the window."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Oracles do NOT prevent cascading failures."}),' If an oracle fails or is outdated, a protocol with tight collateralization can enter a "death spiral" of liquidations.']})]}),e.jsx(v,{children:'Developers often assume that using a "reputable" oracle (e.g., Chainlink) means prices are safe. In reality, no oracle can prevent manipulation if the underlying asset is illiquid or if the attack window is wide enough.'}),e.jsx(n,{quizId:"q-oracle-02"}),e.jsx(n,{quizId:"q-oracle-03"}),e.jsx("button",{onClick:()=>{h("oracle-design"),c("oracle-attacks")},style:t.button,children:"Next: Oracle Attack Vectors →"})]}),V=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"3. Oracle Attacks: How Protocols Get Manipulated"}),e.jsx("h3",{children:"3.1 Spot Price Manipulation via Large Trades"}),e.jsx("p",{children:"An attacker with capital can push the spot price of a thin-liquidity asset by trading in a DEX. If the protocol trusts the spot price, the attacker can trigger liquidations, borrowing with inflated collateral value, or extract arbitrage."}),e.jsx(s,{code:`// Attack scenario: thin asset X with low liquidity on DEX
// Attacker owns $10M, protocol has $50M X lent out

// Step 1: DEX reserves are $100k X : $2M USDC (spot = 20 USDC per X)
// Step 2: Attacker buys $2M USDC of X, moving price to $40/X
//   - DEX reserves become $50k X : $4M USDC
//   - Collateral denominated in X is now worth 2x more

// Step 3: Attacker's own collateral (which they borrowed X to build) 
//   now triggers massive over-collateralization 
// Step 4: Attacker liquidates other borrowers at the inflated price
//         or simply keeps the profit

// Problem: Oracle trusted the spot price. No medium-term reference.`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Defense:"})," Use TWAP, medianizer, or external data source so a single large trade does not move the price."]}),e.jsx("h3",{children:"3.2 Flash Loan Amplified Attacks"}),e.jsx("p",{children:"Flash loans enable attackers to borrow huge sums for a single block. Combined with a spot oracle, this is devastating."}),e.jsx(s,{code:`// Flash loan attack on a spot-price oracle
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Why it works:"})," The entire attack (borrow, trade, liquidate, repay) happens in one block. The oracle sees only the final state and trusts it."]}),e.jsx("h3",{children:"3.3 Delayed Update and Stale Price Attacks"}),e.jsx("p",{children:"Push oracles update on a schedule. An attacker can observe the next update window and front-run it if the update is predictable."}),e.jsx("p",{children:"Alternatively, if a market moves sharply (crash), the oracle is 5 minutes stale, and protocols using the oracle get liquidated at the wrong price."}),e.jsx("h3",{children:"3.4 Multi-Protocol Composability Attacks"}),e.jsx("p",{children:"Many DeFi protocols depend on the same oracle (e.g., Chainlink ETH/USD). If the oracle is manipulated or fails, multiple protocols are affected simultaneously, creating systemic risk."}),e.jsx(x,{children:"Oracle attacks often benefit from leverage and composability. A $10M attack on an oracle can trigger $100M+ in liquidations if 10x leverage is common. Mitigations must account for cascades."}),e.jsx(v,{children:"Developers build protocols that liquidate on a single oracle update without a circuit breaker or time delay. This makes cascades unstoppable: a surprised market change triggers mass liquidations, which trigger more, creating a spiral."}),e.jsx("button",{onClick:()=>{h("oracle-attacks"),c("mev-fundamentals")},style:t.button,children:"Next: MEV Fundamentals →"})]}),B=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"4. MEV Fundamentals: Ordering as a Security Threat"}),e.jsx("h3",{children:"4.1 What is MEV?"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Maximal/Miner Extractable Value (MEV):"})," Profit available to a validator/miner who can choose the order of transactions in a block."]}),e.jsx("p",{children:"In traditional finance, order execution is regulated (FIFO, best execution rules). In blockchain, ordering is a valuable resource, and there is no enforced fairness. The builder/validator can:"}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"See all pending transactions in the mempool"}),e.jsx("li",{children:"Reorder them"}),e.jsx("li",{children:"Include transactions they create"}),e.jsx("li",{children:"Exclude transactions"})]}),e.jsxs("p",{children:["This creates a ",e.jsx("strong",{children:"new attack surface"})," that traditional finance does not have."]}),e.jsx("h3",{children:"4.2 The Mempool and Transaction Visibility"}),e.jsx("p",{children:"When a user submits a transaction, it enters the public mempool. Validators see it and can observe:"}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"Sender"}),e.jsx("li",{children:"Target contract and calldata"}),e.jsx("li",{children:"Gas price offered"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Example:"}),' A user broadcasts a DEX swap: "swap 1 ETH for USDC at MinOut=1900 USDC". Everyone in the mempool sees this and knows:']}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"There is a profitable arbitrage opportunity (e.g., USDC is worth more elsewhere)"}),e.jsx("li",{children:"The user is willing to accept ≥1900 USDC"}),e.jsx("li",{children:"The validator can insert a transaction before the user to move the price, making the user's execution worse"})]}),e.jsx("h3",{children:"4.3 Front-Running, Back-Running, Sandwiching"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Front-running:"})," A validator inserts a transaction ",e.jsx("em",{children:"before"})," a pending transaction to profit from the side effects."]}),e.jsx(s,{code:`// User broadcasts: Swap 1 ETH for USDC (min 1900)
// Validator sees this and front-runs:

// Validator Tx 1: Buy USDC (pump price)
// User Tx:        Swap 1 ETH for USDC (now worse, e.g., 1850)
// Validator Tx 2: Sell USDC (dump price)
// Validator profit = (sell price - buy price) ≈ user's slippage loss`}),e.jsxs("p",{style:{marginTop:"20px"},children:[e.jsx("strong",{children:"Back-running:"})," A validator inserts a transaction ",e.jsx("em",{children:"after"})," a pending transaction to profit from the impact."]}),e.jsx(s,{code:`// User broadcasts: Liquidate borrower (collateral in ETH)
// Validator sees this and:

// User Tx:        Liquidate (collateral transferred to liquidator, price moves)
// Validator Tx:   Buy/sell the moved collateral for profit`}),e.jsxs("p",{style:{marginTop:"20px"},children:[e.jsx("strong",{children:"Sandwiching:"})," A validator places transactions both before ",e.jsx("em",{children:"and"})," after."]}),e.jsx("h3",{children:"4.4 Why MEV is a Protocol Security Threat"}),e.jsx("p",{children:"MEV is not just a fairness issue; it breaks protocol trust assumptions:"}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Slippage protection fails:"}),' A user sets "min out = 1900 USDC" expecting a safety buffer, but MEV front-running eats it.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Liquidations can be gamed:"})," A validator reorders transactions to ensure a specific liquidator wins, or triggers liquidations at the worst price for borrowers."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Oracle prices can be front-run:"})," An oracle updates a price, users react, a validator reorders to break the assumption."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Governance is vulnerable:"})," A validator can vote, see the tally, and change their vote in a next block."]})]}),e.jsx(n,{quizId:"q-mev-01"}),e.jsx(n,{quizId:"q-mev-02"}),e.jsx("button",{onClick:()=>{h("mev-fundamentals"),c("mev-extraction")},style:t.button,children:"Next: MEV Extraction Strategies →"})]}),O=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"5. MEV Extraction in Detail: Who Extracts and How"}),e.jsx("h3",{children:"5.1 Validators and Builders"}),e.jsx("p",{children:"After The Merge (Ethereum 2.0), block production is separated from block proposal:"}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Validators:"})," Stake ETH; propose blocks (but often outsource building)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Builders:"})," Construct bundles of transactions, sold to validators via MEV-Boost"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Relays:"})," Intermediaries that match builders with validators"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Searchers:"})," Independent entities that identify MEV opportunities and bid for ordering"]})]}),e.jsx("h3",{children:"5.2 Public and Private Mempools"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Public mempool:"})," All nodes see all pending transactions. Searchers and MEV bots monitor it and extract value."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Private order flow (e.g., Flashbots Protect):"})," Users send txs to a relay, not the public mempool. The relay hides the tx and sells ordering rights."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Tradeoff:"})," Privacy reduces MEV exposure but shifts trust to the relay. Some relays have been censored or have gone down."]}),e.jsx("h3",{children:"5.3 Priority Fees and MEV Auctions"}),e.jsx("p",{children:"Validators prioritize txs by gas price. Searchers boost the gas price to compete for ordering."}),e.jsx("p",{children:"Example: A liquidation is profitable at 100 USDC gain. If gas cost is 50 gwei, searchers will pay up to 100 USDC in priority tips. This drives up the cost of being first."}),e.jsx(x,{children:"MEV does not disappear; it is transferred. Protocols cannot stop MEV extraction, only shift where the value goes (to searchers, validators, builders, or users). Good protocol design recognizes this and limits damage."}),e.jsx(n,{quizId:"q-mev-03"}),e.jsx("button",{onClick:()=>{h("mev-extraction"),c("mev-mitigations")},style:t.button,children:"Next: MEV Mitigations →"})]}),R=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"6. MEV Mitigations and Protocol Design"}),e.jsx("h3",{children:"6.1 Slippage Limits and Price Impact Protection"}),e.jsx("p",{children:"Users specify a minimum acceptable output. If the actual output is worse, the transaction reverts."}),e.jsx(s,{code:`// User-controlled slippage
function swap(uint amountIn, uint minAmountOut) {
    uint amountOut = getAmountOut(amountIn);
    require(amountOut >= minAmountOut, "Slippage!");
    // execute
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Defense against:"})," Front-running, where a validator moves the price before the user's tx."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Limitation:"})," If slippage is too loose, it does not help. If too tight, users cannot execute trades. MEV still happens; users just refuse bad outcomes."]}),e.jsx("h3",{children:"6.2 Batch Auctions and Frequent Batch Auctions (FBAs)"}),e.jsx("p",{children:"Instead of allowing real-time ordering, a protocol collects all txs in an interval and executes them at a single agreed-upon price."}),e.jsx(s,{code:`// Simplified batch auction
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Advantage:"})," Everyone in a batch has the same execution price; no ordering games."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Disadvantage:"})," Users must wait for the next batch. Price may move; slippage is unpredictable."]}),e.jsx("h3",{children:"6.3 Commit-Reveal Schemes"}),e.jsx("p",{children:"Users commit to a transaction hash without revealing content. In a later block, they reveal it. By the time the tx is revealed, the front-runner cannot exploit it."}),e.jsx(s,{code:`// Commit-reveal
function commit(bytes32 hash) {
    commitments[msg.sender] = hash;
    commitBlock = block.number;
}

function reveal(uint[] calldata data, bool buy) {
    require(block.number > commitBlock + delayBlocks);
    require(keccak256(data, buy) == commitments[msg.sender]);
    // execute
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Advantage:"})," Content is hidden until reveal, so no mempool spying."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Disadvantage:"})," Requires two transactions. Commitment can be front-run if the attacker sees the reveal call or guesses the data."]}),e.jsx("h3",{children:"6.4 RFQ and Intent-Based Designs"}),e.jsx("p",{children:"Instead of publishing a swap on-chain, a user requests a quote from a market maker. The maker signs a firm bid; only the filler (market maker) can execute it."}),e.jsxs("p",{children:[e.jsx("strong",{children:"Advantage:"})," Market maker bears the inventory risk; no slippage for the user."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Disadvantage:"})," Requires liquidity providers to be willing; may not work for all assets."]}),e.jsx("h3",{children:"6.5 Oracle-Based Price Protections"}),e.jsx("p",{children:"A protocol uses an oracle (TWAP, medianizer) as a reference and rejects any execution far from the oracle price."}),e.jsx(s,{code:`// Oracle price as reference
function swapWithOracleCheck(uint amountIn, uint maxSlippage) {
    uint refPrice = oracle.getPrice();
    uint executionPrice = dex.getPrice(amountIn);
    
    uint tolerance = refPrice * maxSlippage / 100;
    require(
        executionPrice <= refPrice + tolerance &&
        executionPrice >= refPrice - tolerance,
        "Execution price out of bounds"
    );
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Advantage:"})," Protection is algorithm-driven, not dependent on user-set slippage."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Disadvantage:"})," Depends on oracle reliability. If oracle is outdated or manipulated, the check is useless."]}),e.jsx("h3",{children:"6.6 Time Delays and Staged Execution"}),e.jsx("p",{children:"Some operations (e.g., liquidations, withdrawals) are delayed by a timelock. This gives users / other participants time to react."}),e.jsx(s,{code:`// Simple timelock for liquidation
function requestLiquidation(address borrower) {
    pendingLiquidations[borrower] = block.timestamp;
}

function executeLiquidation(address borrower) {
    require(block.timestamp >= pendingLiquidations[borrower] + delaySeconds);
    // do liquidation
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Advantage:"})," Gives time for off-chain actors to respond (e.g., borrowers to add collateral, or arbitrage bots to fix the price)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Disadvantage:"})," Increases latency; powerful if the market is liquid but fails in stress."]}),e.jsx(v,{children:"Developers often assume one mitigation suffices. Best practice is defense-in-depth: use oracle, slippage, and circuit breaker all together."}),e.jsx("button",{onClick:()=>{h("mev-mitigations"),c("flash-loans")},style:t.button,children:"Next: Flash Loans and Composed Attacks →"})]}),U=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"7. Flash Loans: Amplifying Attacks and Economic Risk"}),e.jsx("h3",{children:"7.1 What is a Flash Loan?"}),e.jsx("p",{children:"A flash loan is an uncollateralized, instantly available loan that must be repaid within the same transaction (plus a small fee)."}),e.jsx(s,{code:`// Flash loan interface (ERC-3156 standard)
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
}`}),e.jsx("h3",{children:"7.2 Why Flash Loans Are Dangerous for Protocols"}),e.jsx("p",{children:"Flash loans create a unique attack surface because an attacker can:"}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"Borrow any amount of a token, limited only by the lender's liquidity"}),e.jsx("li",{children:"Use the capital to manipulate prices, trigger liquidations, or vote in governance"}),e.jsx("li",{children:"Repay the loan within the same block, so no actual capital is at risk"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Key advantage for attacker:"})," If the attack extracts > fee, it is profitable."]}),e.jsx("h3",{children:"7.3 Flash Loan + Oracle Attack Example"}),e.jsx("p",{children:"Combining flash loans with oracle manipulation is a classic attack vector."}),e.jsx(s,{code:`// Scenario: Lending protocol with spot-price oracle
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
}`}),e.jsx(x,{children:"Flash loans amplify the cost of a protocol failure from the attacker's capital to the lender's entire pool. A $10M lending pool can be drained if the protocol has any exploitable assumption under adversarial capital."}),e.jsx("h3",{children:"7.4 Defense Against Flash Loan Attacks"}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Do not trust spot prices in lending/collateral:"})," Use TWAP or external oracles."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Add a flash loan guard:"})," Check if the protocol's state changed in the same block and revert if suspected."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Use medianizers and multiple sources:"})," Harder to manipulate all sources in one block."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cap leverage and enforce collateral ratios:"})," Even if prices are gamed, a high ratio means liquidations cannot drain the protocol."]})]}),e.jsx(n,{quizId:"q-flash-01"}),e.jsx("button",{onClick:()=>{h("flash-loans"),c("economic-bugs")},style:t.button,children:"Next: Economic Bugs and Incentive Analysis →"})]}),W=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"8. Economic Bugs: When Incentives Break the Protocol"}),e.jsx("h3",{children:"8.1 What is an Economic Bug?"}),e.jsx("p",{children:"An economic bug is a vulnerability that passes unit tests and code review but fails under adversarial incentive pressure or market stress."}),e.jsx("p",{children:"Unlike a reentrancy or overflow (which fail on any run), an economic bug only fails when the attacker has capital, visibility, and market conditions are right."}),e.jsx("h3",{children:"8.2 Case Study: Cascade Liquidation in Aave"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Scenario:"})," Aave is a large lending protocol. Collateral is diverse (ETH, stETH, USDC, etc.). LTV (loan-to-value) ratios are tight (e.g., 80% for ETH)."]}),e.jsx("p",{children:e.jsx("strong",{children:"The attack:"})}),e.jsxs("ol",{style:t.list,children:[e.jsx("li",{children:"Market tanks: ETH crashes 20% in one block (maybe due to an oracle/MEV cascade)."}),e.jsx("li",{children:"Many borrowers cross the liquidation threshold (LTV >80%)."}),e.jsx("li",{children:"Liquidators rush to execute liquidations, each selling collateral for USDC."}),e.jsx("li",{children:"This selling pressure drops ETH further (low liquidity in liquidation market)."}),e.jsx("li",{children:"More borrowers are liquidated; more collateral is sold."}),e.jsx("li",{children:'A "death spiral" begins. Even if ETH should recover, the protocol has already become insolvent.'})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Root cause:"})," The protocol's liquidation mechanism assumes:"]}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"Liquidators are rational and have capital to execute liquidations."}),e.jsx("li",{children:"The liquidation market has enough liquidity to absorb collateral sales."}),e.jsx("li",{children:"Prices do not drop faster than liquidations can execute."})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Reality under attack:"})," An adversary with capital can:"]}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:"Flash loan large amounts of stETH."}),e.jsx("li",{children:"Dump it in DEXs to crash the ETH price."}),e.jsx("li",{children:"Trigger liquidations in Aave (since collateral value dropped)."}),e.jsx("li",{children:"Buy the liquidated collateral at fire-sale prices."})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Impact:"})," Aave becomes insolvent (liabilities > assets) if the liquidity premium during liquidations is too high."]}),e.jsx(x,{children:'Economic bugs arise from the gap between "happy path" assumptions and "adversarial capital" realities. A protocol that works perfectly with honest users fails when someone stakes capital to break it.'}),e.jsx("h3",{children:"8.3 Governance Attacks via Flash Votes"}),e.jsx("p",{children:"Some protocols measure voting power via token balance at a snapshot block. A flash loan attack can:"}),e.jsxs("ol",{style:t.list,children:[e.jsx("li",{children:"Borrow a large amount of the governance token."}),e.jsx("li",{children:"Use it to vote on a proposal (gaining quorum or passing a vote)."}),e.jsx("li",{children:"Repay the flash loan."})]}),e.jsx("p",{children:`The protocol's assumption was that governance is "decentralized," but an attacker with one block of borrowed capital can override it.`}),e.jsx(X,{description:"Flash Loan Governance Attack",costOfAttack:"$1M (flash loan) + $10k (fee)",costOfDefense:"Snapshot voting at a prior block"}),e.jsx("h3",{children:"8.4 Incentive Analysis Frameworks"}),e.jsx("p",{children:"To catch economic bugs before deployment, reason about:"}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Threat Model:"})," Who attacks and what is their goal? (Profit, destruction, political impact)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Attacker Capital:"})," What resources do they have? (Liquid funds, flash loans, MEV visibility)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Protocol Invariants:"})," What must always be true for the protocol to remain solvent? (Total collateral ≥ total debt × LTV, liquidations must be profitable, etc.)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Attack Surface:"})," What actions can move the protocol away from invariants? (Large price moves, liquidity drains, ordering games)"]})]}),e.jsx("h3",{children:"8.5 Guardrails Against Economic Bugs"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Circuit Breakers:"})," Pause riskier operations if conditions change sharply."]}),e.jsx(s,{code:`// Circuit breaker for liquidations
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Caps and Limits:"})," Enforce per-user and per-protocol limits on leverage, borrowing, and liquidations."]}),e.jsx(s,{code:`// Caps on leverage
function borrow(uint256 amount) external {
    require(amount <= maxBorrowPerUser, "Exceeds user limit");
    require(totalBorrowed + amount <= maxTotalBorrow, "Exceeds protocol limit");
    // do borrow
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Dynamic Fees:"})," Increase liquidation fees and slippage penalties in high-stress conditions."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Bounded-Risk Parameters:"})," Start conservative and only increase limits after proving safety under stress tests."]}),e.jsx(n,{quizId:"q-econ-01"}),e.jsx(n,{quizId:"q-econ-02"}),e.jsx("button",{onClick:()=>{h("economic-bugs"),c("lab")},style:t.button,children:"Next: Lab Exercise →"})]}),X=({description:r,costOfAttack:a,costOfDefense:i})=>e.jsxs("div",{style:t.callout,children:[e.jsx("strong",{children:r}),e.jsxs("p",{children:["Cost of Attack: ",a]}),e.jsxs("p",{children:["Cost of Defense: ",i]}),e.jsx("p",{style:{fontSize:"0.9em",color:"#666"},children:"(If cost of defense is much lower than cost of attack, the protocol has good margins.)"})]}),N=()=>e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"9. Lab: Build, Attack, and Defend a Toy Lending Protocol"}),e.jsx("h3",{children:"9.1 Lab Overview"}),e.jsx("p",{children:"We will build a simplified collateralized lending pool in Solidity, then:"}),e.jsxs("ol",{style:t.list,children:[e.jsx("li",{children:"Demonstrate an oracle manipulation attack via flash loan"}),e.jsx("li",{children:"Show how MEV-style reordering causes liquidation cascades"}),e.jsx("li",{children:"Implement mitigations (TWAP oracle, circuit breaker, slippage limit)"}),e.jsx("li",{children:"Write tests that verify both the exploit and the defense"})]}),e.jsx("h3",{children:"9.2 Part 1: Simple Lending Protocol (Toy Example)"}),e.jsx(s,{code:`// SPDX-License-Identifier: MIT
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
}`}),e.jsx("h3",{children:"9.3 Part 2: Naive Oracle (Vulnerable to Flash Loans)"}),e.jsx(s,{code:`// SPDX-License-Identifier: MIT
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
}`}),e.jsx("h3",{children:"9.4 Part 3: The Attack Test"}),e.jsx(s,{code:`// Flash loan attack test (foundry style)
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
}`}),e.jsx("h3",{children:"9.5 Part 4: Mitigations – TWAP Oracle"}),e.jsx(s,{code:`// SPDX-License-Identifier: MIT
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
}`}),e.jsx("h3",{children:"9.6 Part 5: Mitigations – Circuit Breaker and Slippage Limit"}),e.jsx(s,{code:`// Enhanced lending pool with circuit breaker
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
}`}),e.jsx("h3",{children:"9.7 Test Verification of Mitigations"}),e.jsx(s,{code:`contract MitigationTest is Test {
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
}`}),e.jsx("h3",{children:"9.8 Challenge Extensions (For Advanced Learners)"}),e.jsxs("ul",{style:t.list,children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Multi-source medianizer:"})," Aggregate prices from 3 independent DEXs and return the median. Show how >50% of sources must be compromised to manipulate."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Stale price handling:"})," If oracle has no fresh data (e.g., no trades in 1 hour), freeze lending/liquidation until data is fresh."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Parameter tuning:"})," Vary LTV, circuit breaker threshold, and TWAP window. Show how each affects the cost of the attack."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Invariant testing:"})," Write property-based tests (using fuzzing) that assert: `totalCollateral * avgPrice >= totalBorrowed * 1.5` (simplified). Show that mitigations maintain this invariant even under adversarial inputs."]})]}),e.jsx("button",{onClick:()=>{h("lab"),c("tabletop")},style:t.button,children:"Next: MEV Tabletop Exercise →"})]}),H=()=>{const a=(()=>{const i={spot_none:{risk:"CRITICAL",desc:"Vulnerable to flash loan attacks, liquidation cascades inevitable.",profitability:"Very profitable for attacker"},spot_circuit:{risk:"HIGH",desc:"Circuit breaker helps, but attacker can still manipulate within the threshold.",profitability:"Profitable if threshold is >5%"},twap_none:{risk:"MEDIUM",desc:"TWAP raises the cost, but attacker can sustain an attack over the window.",profitability:"Profitable only for very large attacks"},twap_circuit:{risk:"MEDIUM-LOW",desc:"TWAP + circuit breaker makes the attack very expensive.",profitability:"Barely profitable; good guards."},medianizer_none:{risk:"MEDIUM",desc:"Multiple sources resist manipulation if >50% are independent.",profitability:"Requires controlling multiple sources"},medianizer_circuit:{risk:"LOW",desc:"Excellent defense: multi-method oracle + circuit breaker.",profitability:"Not profitable; attack cost >> expected gain"}},p=`${l.oracleType}_${l.mevMitigation}`;return i[p]||i.spot_none})();return e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"10. MEV Tabletop Exercise: Design a Protocol"}),e.jsx("p",{children:"You are designing a lending protocol for a new, illiquid asset. Choose your oracle design, update frequency, and MEV mitigations. See how your choices affect attack cost and protocol safety."}),e.jsxs("div",{style:t.tabletopContainer,children:[e.jsxs("div",{style:t.tabletopParam,children:[e.jsxs("label",{children:[e.jsx("strong",{children:"Oracle Type:"}),e.jsxs("select",{value:l.oracleType,onChange:i=>y({...l,oracleType:i.target.value}),style:t.select,children:[e.jsx("option",{value:"spot",children:"Spot Price (DEX spot)"}),e.jsx("option",{value:"twap",children:"TWAP (30 min window)"}),e.jsx("option",{value:"medianizer",children:"Medianizer (3 sources)"})]})]}),e.jsxs("p",{style:t.description,children:[l.oracleType==="spot"&&"Cheap, fresh, vulnerable to flash loans.",l.oracleType==="twap"&&"Raises attack cost, but outdated by window length.",l.oracleType==="medianizer"&&"Robust if >50% of sources are independent."]})]}),e.jsxs("div",{style:t.tabletopParam,children:[e.jsxs("label",{children:[e.jsx("strong",{children:"Update Frequency:"}),e.jsxs("select",{value:l.updateFreq,onChange:i=>y({...l,updateFreq:i.target.value}),style:t.select,children:[e.jsx("option",{value:"1min",children:"Every 1 minute"}),e.jsx("option",{value:"5min",children:"Every 5 minutes"}),e.jsx("option",{value:"1hour",children:"Every 1 hour"})]})]}),e.jsx("p",{style:t.description,children:"Faster = fresher but more staleness on crash; slower = lagged but less gas."})]}),e.jsxs("div",{style:t.tabletopParam,children:[e.jsxs("label",{children:[e.jsx("strong",{children:"MEV Mitigation:"}),e.jsxs("select",{value:l.mevMitigation,onChange:i=>y({...l,mevMitigation:i.target.value}),style:t.select,children:[e.jsx("option",{value:"none",children:"None"}),e.jsx("option",{value:"circuit",children:"Circuit Breaker"}),e.jsx("option",{value:"slippage",children:"Slippage Limit + Oracle Check"})]})]}),e.jsx("p",{style:t.description,children:"None: minimal cost, maximal risk. Circuit: pauses on shock. Slippage: user-controlled."})]}),e.jsxs("div",{style:t.tabletopParam,children:[e.jsxs("label",{children:[e.jsx("strong",{children:"Liquidation Threshold (LTV):"}),e.jsx("input",{type:"range",min:"50",max:"95",value:l.liquidationThreshold,onChange:i=>y({...l,liquidationThreshold:i.target.value}),style:t.slider}),l.liquidationThreshold,"%"]}),e.jsx("p",{style:t.description,children:"Higher = more capital efficiency but more cascade risk. Lower = safer but less capital utilization."})]})]}),e.jsxs("div",{style:t.outcomeBox,children:[e.jsx("h3",{children:"Simulated Outcome"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Risk Level:"})," ",a.risk]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Assessment:"})," ",a.desc]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Attack Profitability:"})," ",a.profitability]}),e.jsx("p",{style:{marginTop:"10px",fontSize:"0.9em",color:"#666"},children:"(This is a simplified simulation. Real attacks depend on market conditions, competition, and specific parameters.)"})]})]})},$=()=>{const r=()=>{const a=z();w(a),h("final-assessment")};if(f){const a=Math.round(f.correct/f.total*100);return e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"Final Assessment Results"}),e.jsxs("div",{style:t.scoreBox,children:[e.jsxs("h3",{children:["Your Score: ",f.correct,"/",f.total]}),e.jsxs("p",{style:t.scorePercent,children:[a,"%"]}),a>=80&&e.jsx("p",{style:t.feedbackCorrect,children:"🎉 Excellent! You have mastered the core concepts."}),a>=65&&a<80&&e.jsx("p",{style:t.feedbackIncorrect,children:"Good effort! Review the sections below to strengthen weak areas."}),a<65&&e.jsx("p",{style:t.feedbackIncorrect,children:"Keep practicing! Focus on the key takeaways and reread sections with challenges."})]}),e.jsx("h3",{children:"Recommended Review Areas"}),!d("q-oracle-01")&&e.jsx("p",{children:"• Oracle architectures (push vs. pull): Section 1.2"}),!d("q-oracle-02")&&e.jsx("p",{children:"• TWAP oracle design: Section 2.1"}),!d("q-oracle-03")&&e.jsx("p",{children:"• Medianizers and aggregation: Section 2.2"}),!d("q-mev-01")&&e.jsx("p",{children:"• MEV extraction methods: Section 5"}),!d("q-mev-02")&&e.jsx("p",{children:"• MEV as protocol security threat: Section 4.4"}),!d("q-mev-03")&&e.jsx("p",{children:"• Private order flow and centralization: Section 5.2"}),!d("q-flash-01")&&e.jsx("p",{children:"• Flash loan amplification: Section 7.1–7.2"}),!d("q-econ-01")&&e.jsx("p",{children:"• Economic bugs definition: Section 8.1"}),!d("q-econ-02")&&e.jsx("p",{children:"• Defenses against cascades: Section 8.5"}),!d("q-final-01")&&e.jsx("p",{children:"• Protocol design tradeoffs: Section 6"}),e.jsx("h3",{children:"Next Steps"}),e.jsxs("ul",{style:t.list,children:[e.jsx("li",{children:'Re-read the "Key Takeaway" and "Common Pitfall" sections for the quizzes you missed.'}),e.jsx("li",{children:"Work through the lab exercise (Section 9) hands-on in a local Foundry repo."}),e.jsx("li",{children:"Explore real DeFi protocols (Aave, Uniswap, Compound) to see these concepts in action."}),e.jsx("li",{children:"Subscribe to DeFi security research (e.g., Flashbots, Trail of Bits, Certora) for latest attack vectors."})]}),e.jsx("button",{onClick:()=>{w(null),c("intro"),k({})},style:t.button,children:"Retake Final Assessment"})]})}return e.jsxs("div",{style:t.section,children:[e.jsx("h2",{children:"Final Assessment"}),e.jsx("p",{children:'Test your understanding of oracles, MEV, and protocol-level risk. Answer all questions, then click "Submit" to see your score and recommendations.'}),e.jsx(n,{quizId:"q-oracle-01"}),e.jsx(n,{quizId:"q-oracle-02"}),e.jsx(n,{quizId:"q-oracle-03"}),e.jsx(n,{quizId:"q-mev-01"}),e.jsx(n,{quizId:"q-mev-02"}),e.jsx(n,{quizId:"q-mev-03"}),e.jsx(n,{quizId:"q-flash-01"}),e.jsx(n,{quizId:"q-econ-01"}),e.jsx(n,{quizId:"q-econ-02"}),e.jsx(n,{quizId:"q-final-01"}),e.jsx("button",{onClick:r,style:t.submitButton,children:"Submit Final Assessment"})]})},_=()=>{switch(P){case"intro":return e.jsx(M,{});case"oracle-fundamentals":return e.jsx(F,{});case"oracle-design":return e.jsx(L,{});case"oracle-attacks":return e.jsx(V,{});case"mev-fundamentals":return e.jsx(B,{});case"mev-extraction":return e.jsx(O,{});case"mev-mitigations":return e.jsx(R,{});case"flash-loans":return e.jsx(U,{});case"economic-bugs":return e.jsx(W,{});case"lab":return e.jsx(N,{});case"tabletop":return e.jsx(H,{});case"final-assessment":return e.jsx($,{});default:return e.jsx(M,{})}};return e.jsxs("div",{style:t.container,children:[e.jsx(D,{}),e.jsx("div",{style:t.content,children:_()})]})},t={container:{display:"flex",fontFamily:"system-ui, -apple-system, sans-serif",backgroundColor:"#f5f5f5",minHeight:"100vh"},navBar:{width:"280px",backgroundColor:"#1e1e2e",color:"#fff",padding:"20px",overflowY:"auto",maxHeight:"100vh",borderRight:"1px solid #333"},navTitle:{fontSize:"16px",fontWeight:"bold",marginBottom:"15px",color:"#4a9eff"},progressBar:{width:"100%",height:"8px",backgroundColor:"#333",borderRadius:"4px",overflow:"hidden",marginBottom:"5px"},progressFill:{height:"100%",backgroundColor:"#4a9eff",transition:"width 0.3s ease"},progressText:{fontSize:"11px",color:"#aaa",marginBottom:"15px"},navMenu:{display:"flex",flexDirection:"column",gap:"5px",marginBottom:"20px"},navButton:{backgroundColor:"transparent",color:"#aaa",border:"1px solid #444",padding:"8px 10px",textAlign:"left",cursor:"pointer",fontSize:"12px",borderRadius:"4px",transition:"all 0.2s"},navButtonActive:{backgroundColor:"#4a9eff",color:"#fff",borderColor:"#4a9eff"},navButtonComplete:{opacity:"0.6"},controls:{display:"flex",flexDirection:"column",gap:"10px",marginTop:"20px"},button:{backgroundColor:"#4a9eff",color:"#fff",border:"none",padding:"10px",borderRadius:"4px",cursor:"pointer",fontSize:"12px",fontWeight:"bold"},submitButton:{backgroundColor:"#10b981",color:"#fff",border:"none",padding:"12px 20px",borderRadius:"4px",cursor:"pointer",fontSize:"14px",fontWeight:"bold",marginTop:"20px"},content:{flex:1,padding:"40px",overflowY:"auto",backgroundColor:"#fff"},section:{maxWidth:"900px",margin:"0 auto",lineHeight:"1.6",color:"#333"},list:{marginLeft:"20px",listStyleType:"disc"},keyTakeaway:{backgroundColor:"#e0f2fe",border:"2px solid #0ea5e9",borderLeft:"6px solid #0ea5e9",padding:"15px",marginBottom:"20px",borderRadius:"4px"},commonPitfall:{backgroundColor:"#fef3c7",border:"2px solid #f59e0b",borderLeft:"6px solid #f59e0b",padding:"15px",marginBottom:"20px",borderRadius:"4px"},callout:{backgroundColor:"#f3f4f6",border:"1px solid #d1d5db",padding:"15px",marginBottom:"20px",borderRadius:"4px",fontSize:"14px"},calloutTitle:{color:"#1e3a8a",fontSize:"13px"},codeBlock:{backgroundColor:"#282c34",color:"#abb2bf",padding:"15px",borderRadius:"4px",overflowX:"auto",fontSize:"13px",fontFamily:"Monaco, Courier New, monospace",marginBottom:"20px"},quiz:{backgroundColor:"#f9fafb",border:"1px solid #e5e7eb",padding:"15px",borderRadius:"4px",marginBottom:"20px"},quizQuestion:{fontSize:"14px",fontWeight:"bold",marginBottom:"12px"},quizOptions:{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"12px"},quizLabel:{display:"flex",alignItems:"flex-start",gap:"8px",fontSize:"13px"},quizInput:{marginTop:"2px",cursor:"pointer"},distractor:{color:"#dc2626",fontSize:"12px",fontStyle:"italic"},feedback:{padding:"10px",borderRadius:"4px",fontSize:"13px"},feedbackCorrect:{backgroundColor:"#d1fae5",color:"#065f46",border:"1px solid #a7f3d0"},feedbackIncorrect:{backgroundColor:"#fee2e2",color:"#991b1b",border:"1px solid #fecaca"},scoreBox:{backgroundColor:"#f3f4f6",border:"2px solid #10b981",padding:"30px",borderRadius:"8px",textAlign:"center",marginBottom:"30px"},scorePercent:{fontSize:"2.5em",fontWeight:"bold",color:"#10b981"},tabletopContainer:{display:"flex",flexDirection:"column",gap:"20px",marginBottom:"30px"},tabletopParam:{backgroundColor:"#f9fafb",border:"1px solid #e5e7eb",padding:"15px",borderRadius:"4px"},select:{width:"100%",padding:"8px",marginTop:"8px",borderRadius:"4px",border:"1px solid #d1d5db",fontSize:"13px"},slider:{width:"100%",marginTop:"8px"},description:{fontSize:"12px",color:"#666",marginTop:"8px"},outcomeBox:{backgroundColor:"#eff6ff",border:"2px solid #3b82f6",padding:"20px",borderRadius:"4px"}};export{Y as default};
