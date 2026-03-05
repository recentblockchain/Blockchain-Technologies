import{r as l,j as e}from"./index-Z3qH07gz.js";import{F as z}from"./Footer-nn-veu6z.js";const{ethers:H}=require("hardhat"),X=()=>{const[u,v]=l.useState("intro"),[U,O]=l.useState(null),[c,g]=l.useState({}),[p,k]=l.useState(!1),[m,A]=l.useState({}),[x,R]=l.useState(!1),[i,f]=l.useState(0),[b,y]=l.useState([]),j=[{id:"intro",label:"0. Introduction",icon:"📖"},{id:"reentrancy",label:"1. Reentrancy",icon:"🔄"},{id:"access",label:"2. Access Control",icon:"🔐"},{id:"delegatecall",label:"3. Delegatecall",icon:"📍"},{id:"dos",label:"4. Denial-of-Service",icon:"⛔"},{id:"lab",label:"Lab: Exploit & Patch",icon:"🔧"},{id:"simulation",label:"Guided Simulation",icon:"🎮"},{id:"assessment",label:"Final Assessment",icon:"✅"}],o={intro_q1:{question:"What is the primary threat model for code-level smart contract vulnerabilities?",type:"mc",options:[{text:"An authenticated user with legitimate permissions making mistakes",id:"a"},{text:"An attacker or untrusted caller exploiting logic flaws, state inconsistency, or missing checks",id:"b"},{text:"Network layer attacks on the Ethereum protocol",id:"c"}],correct:"b",explanation:"Code-level vulnerabilities assume an attacker can call contract functions. The threat model is: untrusted external input, no guarantees on call ordering or timing, and contract logic faults lead to loss of funds or control."},reentrancy_q1:{question:"In reentrancy, why does the attacker's fallback function call withdraw() again?",type:"mc",options:[{text:"To lock up gas and cause a denial of service",id:"a"},{text:"Because the contract's balance check happens *after* the transfer, the balance hasn't been decremented yet",id:"b"},{text:"To exploit a race condition in the blockchain",id:"c"}],correct:"b",explanation:`The classic reentrancy bug: balance -= amount happens *after* the external call (transfer or call). When the attacker's fallback fires, the balance is still high, so the second withdrawal succeeds. This is the "Checks-Effects-Interactions" violation.`},reentrancy_q2:{question:"Which defense pattern prevents reentrancy by changing the *order* of operations?",type:"mc",options:[{text:"A mutex lock (reentrancy guard)",id:"a"},{text:"Decrementing balance *before* the external call (Checks-Effects-Interactions)",id:"b"},{text:"Using low-level assembly",id:"c"}],correct:"b",explanation:"Checks-Effects-Interactions (CEI) is a code pattern: validate first (checks), modify state (effects), then call externals (interactions). If the attacker reents during the interaction, the state is already updated."},access_q1:{question:"Why is tx.origin dangerous for access control?",type:"mc",options:[{text:"It is slower than msg.sender",id:"a"},{text:"It refers to the *original* caller in the chain, not the immediate caller. A compromised/malicious contract can call your function and tx.origin is still the user.",id:"b"},{text:"It costs more gas",id:"c"}],correct:"b",explanation:"Phishing via tx.origin: Eve tricks Alice into calling Eve's contract. Eve's contract calls your vault. Your check `require(tx.origin == owner)` sees Alice, not Eve, and allows theft. Always use msg.sender."},access_q2:{question:"What is the most common access control failure in smart contracts?",type:"ms",options:[{text:"Missing or incorrect visibility modifiers (internal vs external)",id:"a"},{text:"Forgetting to apply `onlyOwner` or role modifiers to sensitive functions",id:"b"},{text:"Using tx.origin instead of msg.sender for privilege checks",id:"c"},{text:"Hardcoding admin addresses and never allowing revocation",id:"d"}],correct:["a","b","c","d"],explanation:"All of these are common! The lesson: secure by default (private/internal first), apply modifiers consistently, use msg.sender, and design revocable admin patterns."},delegatecall_q1:{question:"When Contract A delegatecalls Contract B, whose storage does Contract B modify?",type:"mc",options:[{text:"Contract B's storage",id:"a"},{text:"Contract A's storage (B runs in A's context)",id:"b"},{text:"A temporary storage that is discarded",id:"c"}],correct:"b",explanation:"delegatecall is dangerous because B's code executes in A's storage context. If A and B have different storage layouts, B can corrupt A's critical state (e.g., owner, balances)."},dos_q1:{question:'What is a "state-lock" denial-of-service pattern?',type:"mc",options:[{text:"An attacker unable to steal funds, but able to halt progress by reverting in a critical callback",id:"a"},{text:"A gas limit issue that prevents large transfers",id:"b"},{text:"A race condition in mempool ordering",id:"c"}],correct:"a",explanation:`Example: a contract loops through recipients and transfers funds. If one recipient's fallback reverts, the entire tx reverts and *nobody* gets paid. The state is "locked" unless the bad recipient is removed.`}};l.useCallback((t,a)=>{let r=0;return a.forEach(s=>{const n=o[s],d=t[s];d&&(n.type==="mc"?d===n.correct&&r++:n.type==="ms"&&Array.isArray(d)&&Array.isArray(n.correct)&&d.length===n.correct.length&&d.every(M=>n.correct.includes(M))&&r++)}),{correct:r,total:a.length}},[o]);const E=(t,a)=>{g(r=>({...r,[t]:a}))},C=(t,a)=>{g(r=>{const s=r[t]||[],n=s.includes(a)?s.filter(d=>d!==a):[...s,a];return{...r,[t]:n}})},S=(t,a)=>{A(r=>({...r,[t]:a}))},w=[{id:"a1",question:"A vault allows withdrawals via external call. The balance is decremented *after* the call. Describe the reentrancy attack and identify the CEI violation.",type:"sa",keyPoints:["external call before state change","attacker fallback re-enters","balance check fails to block second withdrawal"]},{id:"a2",question:"You inherit an upgradeable contract using delegatecall. The old version has `uint owner; mapping balances;`. The new version adds `bool paused;` as the first storage var. What happens?",type:"sa",keyPoints:["storage collision","paused overwrite owner field","loss of ownership","upgrade must preserve layout"]},{id:"a3",question:"A contract function is marked `public` and transfers funds without access control. An attacker can call it. What are three fixes?",type:"sa",keyPoints:["change visibility to internal/private","add onlyOwner or role-based modifier","require msg.sender == owner (not tx.origin)"]},{id:"a4",question:"Your contract calls an external address to transfer funds in a loop over 100 recipients. If one reverts, all revert and funds are locked. How do you mitigate?",type:"sa",keyPoints:["use pull pattern (recipient withdraws, not contract pushes)","or store failed transfers and retry","or use no-revert external calls with error handling"]}],h=({quizKey:t,quiz:a})=>{const r=c[t]!==void 0,s=a.type==="mc"?c[t]===a.correct:a.type==="ms"?Array.isArray(c[t])&&c[t].length===a.correct.length&&c[t].every(n=>a.correct.includes(n)):!1;return e.jsxs("div",{style:{background:"#f8f9fa",border:"1px solid #dee2e6",borderRadius:"8px",padding:"16px",marginBottom:"16px"},children:[e.jsx("div",{style:{marginBottom:"12px",fontWeight:"600"},children:a.question}),a.type==="mc"&&e.jsx("div",{children:a.options.map(n=>e.jsxs("label",{style:{display:"block",marginBottom:"8px",cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:t,value:n.id,checked:c[t]===n.id,onChange:()=>E(t,n.id),style:{marginRight:"8px"},"aria-label":n.text}),n.text]},n.id))}),a.type==="ms"&&e.jsx("div",{children:a.options.map(n=>e.jsxs("label",{style:{display:"block",marginBottom:"8px",cursor:"pointer"},children:[e.jsx("input",{type:"checkbox",checked:(c[t]||[]).includes(n.id),onChange:()=>C(t,n.id),style:{marginRight:"8px"},"aria-label":n.text}),n.text]},n.id))}),r&&p&&e.jsxs("div",{style:{marginTop:"12px",padding:"12px",background:s?"#d4edda":"#f8d7da",border:`1px solid ${s?"#c3e6cb":"#f5c6cb"}`,borderRadius:"4px",color:s?"#155724":"#721c24"},children:[e.jsx("div",{style:{fontWeight:"600",marginBottom:"8px"},children:s?"✓ Correct!":"✗ Not quite."}),e.jsx("div",{children:a.explanation})]})]})},T=()=>e.jsxs("div",{children:[e.jsx("h1",{children:"Smart Contract Vulnerabilities I: Code-Level Threats"}),e.jsxs("div",{style:{background:"#e7f3ff",padding:"16px",borderRadius:"8px",marginBottom:"20px"},children:[e.jsx("strong",{children:"Abstract:"})," This chapter examines four critical categories of code-level smart contract vulnerabilities: reentrancy, access control failures, delegatecall hazards, and denial-of-service patterns. We adopt a threat-model-first approach, starting from first principles (call stacks, state consistency, privilege boundaries) and scaling to real-world defense patterns and their tradeoffs. Each section includes interactive quizzes, a hands-on lab with exploit and patch, and a guided simulation."]}),e.jsxs("div",{style:{marginBottom:"16px"},children:[e.jsx("strong",{children:"Learning Objectives:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Understand reentrancy from the call stack up: why it happens, how CEI/guards/patterns prevent it."}),e.jsx("li",{children:"Identify and fix access control failures: visibility, modifiers, tx.origin traps, privilege escalation."}),e.jsx("li",{children:"Recognize delegatecall storage and context hazards in proxy contracts."}),e.jsx("li",{children:"Detect and mitigate denial-of-service vectors: gas griefing, state locks, reverting callees."}),e.jsx("li",{children:"Design threat models for each vulnerability class and reason about attacker capabilities."})]})]}),e.jsxs("div",{style:{marginBottom:"16px"},children:[e.jsx("strong",{children:"Prerequisites:"})," Solidity fundamentals (functions, storage, modifiers); Ethereum execution model (call stack, gas, msg.sender/msg.value); basic access control (owner/role patterns)."]}),e.jsxs("div",{style:{marginBottom:"16px"},children:[e.jsx("strong",{children:"Key Terms:"})," Reentrancy, call stack, external call, fallback/receive, checks-effects-interactions, reentrancy guard, access control, tx.origin, delegatecall, storage collision, denial-of-service, state lock, threat model."]}),e.jsxs("div",{style:{background:"#fff3cd",padding:"12px",borderRadius:"4px",marginBottom:"20px",borderLeft:"4px solid #ffc107"},children:[e.jsx("strong",{children:"📌 Key Takeaway:"})," Code-level vulnerabilities exploit state inconsistency, missing guards, and incorrect privilege checks. Secure by default: make functions internal, validate inputs early, update state before calling externals, and always use msg.sender for identity."]}),e.jsx("h3",{children:"0.1 Threat Model Overview"}),e.jsxs("p",{children:["We assume an ",e.jsx("strong",{children:"attacker with the ability to call any external function"})," with any arguments and any Ether value. The attacker may:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Deploy a contract with arbitrary fallback/receive logic."}),e.jsx("li",{children:"Reenter your contract during callbacks."}),e.jsx("li",{children:"Call functions in unexpected orders and at unexpected times."}),e.jsx("li",{children:"Drain gas, cause reverts in critical callbacks, or exploit state inconsistencies."})]}),e.jsxs("p",{children:["The ",e.jsx("strong",{children:"contract developer's job"})," is to ensure that no sequence of calls—no matter how adversarial—can (1) violate invariants, (2) steal funds, (3) escalate privilege, or (4) halt critical operations."]}),e.jsx("h3",{children:"0.2 Course Structure"}),e.jsx("p",{children:"Each section follows the same scaffold:"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"First Principles:"})," Minimal toy example, core concepts."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"The Vulnerability:"})," Attack scenario, why it works, code walkthrough."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Defense Patterns:"})," Multiple approaches (guards, CEI, pull-vs-push, etc.), tradeoffs."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quiz:"})," Check understanding; answer reveal with explanation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lab:"})," Exploit the vulnerable contract and patch it; tests prove the fix."]})]}),e.jsxs("div",{style:{background:"#f0f0f0",padding:"12px",borderRadius:"4px",marginTop:"16px"},children:[e.jsx("strong",{children:"Next Step:"})," Navigate to Section 1 (Reentrancy) to begin."]})]}),F=()=>e.jsxs("div",{children:[e.jsx("h1",{children:"1. Reentrancy: The Call Stack Trap"}),e.jsxs("div",{style:{background:"#fff3cd",padding:"12px",borderRadius:"4px",marginBottom:"20px",borderLeft:"4px solid #ffc107"},children:[e.jsx("strong",{children:"⚠️ Common Pitfall:"}),' Developers think "my contract is safe because it checks the balance before withdrawing." But if the check happens *after* an external call, the attacker can reenter during that call before the balance is updated.']}),e.jsx("h2",{children:"1.1 First Principles: The Call Stack and State Consistency"}),e.jsxs("p",{children:["When a contract calls an external address (via ",e.jsx("code",{children:"transfer"}),", ",e.jsx("code",{children:"send"}),", or ",e.jsx("code",{children:"call"}),"), control flows out to that address. If the address is a contract, its fallback or receive function runs. ",e.jsx("strong",{children:"During this execution, your contract's state has not changed yet"}),"—unless you explicitly updated it before the call."]}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`// Toy Vault: withdraw funds
contract Vault {
    mapping(address => uint) balance;

    function withdraw(uint amount) external {
        // VULNERABLE: check balance AFTER external call!
        // Sequence: call(transfer) -> attacker fallback -> re-enter withdraw
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
        balance[msg.sender] -= amount;  // Updated AFTER call!
    }
}`}),e.jsx("p",{children:e.jsx("strong",{children:"The Reentrancy Loop:"})}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Alice calls ",e.jsx("code",{children:"withdraw(1 ether)"}),". Balance is 1 ether."]}),e.jsxs("li",{children:[e.jsx("code",{children:"call{value: 1 ether}"})," sends ether to Alice's attacker contract."]}),e.jsxs("li",{children:["Alice's ",e.jsx("span",{style:{fontFamily:"monospace"},children:"fallback()"})," fires. Balance is still 1 ether (not yet decremented)."]}),e.jsxs("li",{children:["Fallback calls ",e.jsx("code",{children:"withdraw(1 ether)"})," again."]}),e.jsx("li",{children:"Same check passes (balance is still 1 ether). Another ether is sent."}),e.jsx("li",{children:"This loops until the vault is drained or gas runs out."})]}),e.jsxs("div",{style:{background:"#e7f3ff",padding:"12px",borderRadius:"4px",marginBottom:"16px"},children:[e.jsx("strong",{children:"💡 Why it works:"})," The balance check (or absence thereof) happens *after* the external call. The attacker's code runs with the old state, sees the old balance, and can call withdraw again."]}),e.jsx("h2",{children:"1.2 Defense Pattern 1: Checks-Effects-Interactions (CEI)"}),e.jsxs("p",{children:[e.jsx("strong",{children:"The Pattern:"})," (1) Validate inputs and conditions (checks), (2) update contract state (effects), (3) call externals (interactions)."]}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract VaultFixed {
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Why it works:"})," If the attacker reents during the ",e.jsx("span",{style:{fontFamily:"monospace"},children:"call"}),", their balance is already 0. The second call to ",e.jsx("span",{style:{fontFamily:"monospace"},children:"withdraw"})," fails the check (insufficient balance), and the reentry is blocked."]}),e.jsxs("div",{style:{background:"#d4edda",padding:"12px",borderRadius:"4px",marginBottom:"16px",borderLeft:"4px solid #28a745"},children:[e.jsx("strong",{children:"✓ Advantage:"})," Simple, no performance cost, easy to audit. Follow CEI as your default."]}),e.jsx("h2",{children:"1.3 Defense Pattern 2: Reentrancy Guard (Mutex Lock)"}),e.jsx("p",{children:"A guard ensures that a function cannot be called again while it is still executing."}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract VaultWithGuard {
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"How it works:"})," When ",e.jsx("span",{style:{fontFamily:"monospace"},children:"withdraw"})," is entered, ",e.jsx("span",{style:{fontFamily:"monospace"},children:"locked"})," is set to true. If the attacker reents, the second call sees ",e.jsx("span",{style:{fontFamily:"monospace"},children:"locked = true"})," and reverts."]}),e.jsxs("div",{style:{background:"#f8d7da",padding:"12px",borderRadius:"4px",marginBottom:"16px",borderLeft:"4px solid #dc3545"},children:[e.jsx("strong",{children:"⚠️ Tradeoff:"})," Guards cost extra gas and add complexity. They are a *second line of defense*; CEI should be your first."]}),e.jsx("h2",{children:"1.4 Defense Pattern 3: Pull vs. Push Payments"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Push:"})," Contract calls ",e.jsx("code",{children:"transfer(recipient, amount)"}),". Recipient's fallback might reenter."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pull:"})," Contract records an amount owed; recipient calls a ",e.jsx("code",{children:"withdraw()"})," function to pull their funds."]}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`// Pull pattern: recipient withdraws, not contract pushes
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Why it's safer:"})," The contract doesn't directly call recipients. Reentrancy is less likely because the attacker must explicitly call ",e.jsx("code",{children:"withdraw()"}),", and the state is already updated."]}),e.jsx("h2",{children:"1.5 Mini Case Study: The DAO Hack (Simplified)"}),e.jsx("p",{children:"In 2016, the DAO (a decentralized fund) was drained of ~$60M via reentrancy. Simplified:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Users could call ",e.jsx("code",{children:"withdraw(amount)"})," to get Ether back."]}),e.jsxs("li",{children:["The contract sent Ether via ",e.jsx("code",{children:"call"})," *before* updating the user's balance."]}),e.jsxs("li",{children:["An attacker deployed a contract with a fallback that called ",e.jsx("code",{children:"withdraw"})," again."]}),e.jsx("li",{children:"The attacker looped until the DAO was drained."})]}),e.jsx("p",{children:e.jsx("strong",{children:"Prevention Playbook:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Always use Checks-Effects-Interactions by default."}),e.jsx("li",{children:"Add a reentrancy guard if you must call externals."}),e.jsx("li",{children:"Consider pull payments for recipient-initiated withdrawals."}),e.jsx("li",{children:"Test with a malicious receiver contract that reents."}),e.jsx("li",{children:"Use static analyzers to flag external calls before state updates."})]}),e.jsx("h2",{children:"1.6 Quiz: Reentrancy"}),e.jsx(h,{quizKey:"reentrancy_q1",quiz:o.reentrancy_q1}),e.jsx(h,{quizKey:"reentrancy_q2",quiz:o.reentrancy_q2})]}),P=()=>e.jsxs("div",{children:[e.jsx("h1",{children:"2. Access Control Failures and Authentication Bypasses"}),e.jsxs("div",{style:{background:"#fff3cd",padding:"12px",borderRadius:"4px",marginBottom:"20px",borderLeft:"4px solid #ffc107"},children:[e.jsx("strong",{children:"⚠️ Common Pitfall:"})," Developers use `tx.origin` for authentication, forgetting that a malicious contract can call your function and tx.origin still refers to the user, not the contract. Phishing via delegated calls."]}),e.jsx("h2",{children:"2.1 First Principles: Identity, Privilege, and Visibility"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Identity:"})," Which caller is this? Use ",e.jsx("code",{children:"msg.sender"})," (immediate caller) never ",e.jsx("code",{children:"tx.origin"})," (original EOA)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Privilege:"})," What role does the caller have? Owner, admin, user, etc."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Visibility:"})," Which functions are external (anyone can call) vs. internal (only contract internals)?"]}),e.jsx("p",{children:e.jsx("strong",{children:"Three Common Failures:"})}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Missing Modifiers:"})," Sensitive function has no access check."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Incorrect Identity Check:"})," Using ",e.jsx("code",{children:"tx.origin"})," instead of ",e.jsx("code",{children:"msg.sender"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Wrong Visibility:"})," Marking a sensitive function ",e.jsx("code",{children:"public"})," instead of ",e.jsx("code",{children:"internal"}),"."]})]}),e.jsx("h2",{children:"2.2 Failure Mode 1: Missing Access Control Modifier"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Vault {
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Attack:"})," Attacker calls ",e.jsx("span",{style:{fontFamily:"monospace"},children:"transferAdmin(attacker_address)"}),". Admin is now the attacker. Attacker can now drain the vault or make other changes."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fix:"})," Add an ",e.jsx("span",{style:{fontFamily:"monospace"},children:"onlyAdmin"})," modifier."]}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract VaultFixed {
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
}`}),e.jsx("h2",{children:"2.3 Failure Mode 2: tx.origin Phishing"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Vault {
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
}`}),e.jsx("p",{children:e.jsx("strong",{children:"Exploit Scenario:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Alice owns a vault. Alice calls Eve's contract via a phishing link."}),e.jsxs("li",{children:["Eve's contract calls ",e.jsx("span",{style:{fontFamily:"monospace"},children:"vault.withdraw()"}),"."]}),e.jsxs("li",{children:["Inside the vault, ",e.jsx("span",{style:{fontFamily:"monospace"},children:"tx.origin == Alice"})," (Alice initiated the original tx), so the check passes."]}),e.jsx("li",{children:"Ether is sent to Eve."})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fix:"})," Always use ",e.jsx("code",{children:"msg.sender"}),", not ",e.jsx("code",{children:"tx.origin"}),"."]}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract VaultFixed {
    address owner;
    constructor() { owner = msg.sender; }

    // CORRECT: use msg.sender
    function withdraw(uint amount) external {
        require(msg.sender == owner, "not owner");
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok);
    }
}`}),e.jsxs("div",{style:{background:"#d4edda",padding:"12px",borderRadius:"4px",marginBottom:"16px",borderLeft:"4px solid #28a745"},children:[e.jsx("strong",{children:"✓ Lesson:"})," ",e.jsx("code",{children:"msg.sender"})," is the immediate caller. If a contract calls you, it's that contract. If an EOA calls you, it's that EOA. ",e.jsx("code",{children:"tx.origin"})," is only the original EOA. For access control, use ",e.jsx("code",{children:"msg.sender"}),"."]}),e.jsx("h2",{children:"2.4 Defense Patterns: Secure-by-Default Access Control"}),e.jsx("p",{children:e.jsx("strong",{children:"Pattern 1: Default Private/Internal"})}),e.jsxs("p",{children:["Make functions ",e.jsx("span",{style:{fontFamily:"monospace"},children:"internal"})," by default. Only mark as ",e.jsx("span",{style:{fontFamily:"monospace"},children:"external"})," if deliberately exposed."]}),e.jsx("p",{children:e.jsx("strong",{children:"Pattern 2: Role-Based Access Control (RBAC)"})}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract RBAC {
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
}`}),e.jsx("p",{children:e.jsx("strong",{children:"Pattern 3: Safe Delegated Calls via Signatures"})}),e.jsxs("p",{children:["For more advanced: instead of relying on ",e.jsx("code",{children:"msg.sender"})," in a single tx, use ecrecover to verify a signature. This allows a user to delegate an action to a relayer while proving their identity."]}),e.jsx("h2",{children:"2.5 Mini Case Study: Privilege Escalation via Internal/External Visibility"}),e.jsx("p",{children:"A contract has two functions:"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Treasury {
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
}`}),e.jsxs("p",{children:["Because ",e.jsx("span",{style:{fontFamily:"monospace"},children:"updateBalance"})," is ",e.jsx("span",{style:{fontFamily:"monospace"},children:"public"}),", any attacker can call it directly and set anyone's balance to 0. The intent was for it to be internal (helper) only."]}),e.jsx("p",{children:e.jsx("strong",{children:"Prevention Playbook:"})}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Mark functions ",e.jsx("span",{style:{fontFamily:"monospace"},children:"internal"})," or ",e.jsx("span",{style:{fontFamily:"monospace"},children:"private"})," by default; only expose via ",e.jsx("span",{style:{fontFamily:"monospace"},children:"external"})," with intent."]}),e.jsx("li",{children:"Always apply access control modifiers to sensitive functions."}),e.jsx("li",{children:"Use role-based patterns for multi-admin scenarios."}),e.jsxs("li",{children:["Never use ",e.jsx("span",{style:{fontFamily:"monospace"},children:"tx.origin"})," for access checks."]}),e.jsx("li",{children:"Test that unpermissioned callers are blocked."})]}),e.jsx("h2",{children:"2.6 Quiz: Access Control"}),e.jsx(h,{quizKey:"access_q1",quiz:o.access_q1}),e.jsx(h,{quizKey:"access_q2",quiz:o.access_q2})]}),I=()=>e.jsxs("div",{children:[e.jsx("h1",{children:"3. Delegatecall and Proxy Hazards"}),e.jsxs("div",{style:{background:"#fff3cd",padding:"12px",borderRadius:"4px",marginBottom:"20px",borderLeft:"4px solid #ffc107"},children:[e.jsx("strong",{children:"⚠️ Common Pitfall:"})," Developers upgrade a contract using delegatecall without realizing that B's code runs in A's storage context. If A and B have different storage layouts, critical state is corrupted."]}),e.jsx("h2",{children:"3.1 First Principles: Storage Context and Delegatecall"}),e.jsx("p",{children:"When A calls B:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Regular call:"})," B's code runs in B's storage context. B modifies B's state."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"delegatecall:"})," B's code runs in A's storage context. B modifies A's state using B's code logic."]})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Use case:"}),` Upgradeable contracts. A (proxy) holds funds and admin; B (implementation) holds logic. When A delegatecalls B, B's new logic runs but modifies A's storage, allowing "upgrades" without moving funds.`]}),e.jsx("h2",{children:"3.2 The Hazard: Storage Layout Collision"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`// Version 1 of implementation
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
}`}),e.jsx("p",{children:e.jsx("strong",{children:"What goes wrong:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Proxy has storage: [owner, balance]."}),e.jsx("li",{children:"VaultV1 matches: [owner, balance]."}),e.jsx("li",{children:"Developer upgrades to VaultV2 which expects: [owner, paused, balance]."}),e.jsxs("li",{children:["Now VaultV2's ",e.jsx("span",{style:{fontFamily:"monospace"},children:"paused"})," field writes to proxy's balance storage slot!"]}),e.jsxs("li",{children:["A simple ",e.jsx("span",{style:{fontFamily:"monospace"},children:"paused = true"})," in V2 overwrites the balance mapping, corrupting funds."]})]}),e.jsxs("div",{style:{background:"#f8d7da",padding:"12px",borderRadius:"4px",marginBottom:"16px",borderLeft:"4px solid #dc3545"},children:[e.jsx("strong",{children:"⚠️ The Risk:"})," Storage layout must be preserved across upgrades. New fields must be appended, never inserted. Use tools like hardhat-upgrades to validate layout."]}),e.jsx("h2",{children:"3.3 Hazard 2: Unexpected msg.sender Context"}),e.jsxs("p",{children:["When B is delegatecalled from A, ",e.jsx("code",{children:"msg.sender"})," in B still refers to the *original caller*, not A. This can be surprising."]}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Impl {
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
// So attacker can directly call proxy.transferOwner(attacker)`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Lesson:"}),' In delegatecalled code, always assume the original caller is in control. If you need to enforce that "only the proxy can call this," you must pass that context explicitly or use self-calls.']}),e.jsx("h2",{children:"3.4 Hazard 3: Function Selector Clashing"}),e.jsxs("p",{children:["A proxy implements a fallback that delegatecalls to impl. But what if both proxy and impl define the same function signature (e.g., both have ",e.jsx("code",{children:"transfer()"}),")? Solidity dispatches based on the selector, so the proxy's version is called, bypassing impl."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Best Practice:"})," Proxy should be minimal (only admin functions); implementation should not override proxy functions."]}),e.jsx("h2",{children:"3.5 Defense Pattern: Transparent Proxy"}),e.jsx("p",{children:"A proxy that forbids the admin from calling functions through the proxy (to prevent selector clashes and accidental state changes)."}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract TransparentProxy {
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
}`}),e.jsx("h2",{children:"3.6 Mini Case Study: Proxy Admin Takeover"}),e.jsx("p",{children:"A team deploys an upgradeable contract. The admin key is shared among 3 signers (multisig). An upgradeable contract's admin is stored in storage slot 0. A bug in the implementation allows writing to storage slot 0. Attacker exploits this, changes the admin to their address, then calls upgrade() to inject malicious code."}),e.jsx("p",{children:e.jsx("strong",{children:"Prevention Playbook:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Use a battle-tested proxy pattern (OpenZeppelin UUPS or Transparent Proxy)."}),e.jsx("li",{children:"Validate storage layout before each upgrade (use hardhat-upgrades plugin)."}),e.jsx("li",{children:"Store admin/critical state in fixed, non-colliding slots."}),e.jsx("li",{children:"Minimize proxy logic; keep implementation stateless or carefully scoped."}),e.jsx("li",{children:"Use a multiSig or timelock for admin functions."})]}),e.jsx("h2",{children:"3.7 Quiz: Delegatecall"}),e.jsx(h,{quizKey:"delegatecall_q1",quiz:o.delegatecall_q1})]}),q=()=>e.jsxs("div",{children:[e.jsx("h1",{children:"4. Denial-of-Service: Halting Progress"}),e.jsxs("div",{style:{background:"#fff3cd",padding:"12px",borderRadius:"4px",marginBottom:"20px",borderLeft:"4px solid #ffc107"},children:[e.jsx("strong",{children:"⚠️ Common Pitfall:"}),` A function loops through recipients and transfers funds. If one recipient's fallback reverts, the entire loop reverts and nobody gets paid—the contract is "locked."`]}),e.jsx("h2",{children:"4.1 First Principles: External Calls and Execution Flow"}),e.jsx("p",{children:"Every external call is a potential failure point. If a call fails (reverts or throws), the entire transaction reverts and state is rolled back. A contract that depends on external calls without error handling is vulnerable to denial-of-service."}),e.jsx("h2",{children:"4.2 Failure Mode 1: State Lock via Reverting Receiver"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Distributor {
    function distribute(address[] calldata recipients, uint[] calldata amounts) external {
        for (uint i = 0; i < recipients.length; i++) {
            // VULNERABLE: if any recipient reverts, entire distribution fails
            (bool ok, ) = recipients[i].call{value: amounts[i]}("");
            require(ok, "transfer failed");  // Reverts if ANY transfer fails
        }
    }
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Attack:"})," An attacker places a contract in the recipients array with a fallback that always reverts. When distribute() is called, it hits the attacker's contract, reverts, and *nobody* gets paid. The contract is locked."]}),e.jsx("p",{children:e.jsx("strong",{children:"Fix: Handle failures gracefully."})}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract DistributorFixed {
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
}`}),e.jsx("p",{children:"Now if a recipient reverts, their amount is recorded in pending. They can claim it later by calling withdraw(). The distribution always succeeds."}),e.jsx("h2",{children:"4.3 Failure Mode 2: Unbounded Loops and Gas Griefing"}),e.jsx("p",{children:"A loop that iterates over a growing array (e.g., list of users) can eventually consume so much gas that the transaction fails."}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Token {
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
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Attack:"})," Attacker creates many holder accounts. Now distributeRewards() iterates over thousands of holders and runs out of gas, preventing any real distribution."]}),e.jsx("p",{children:e.jsx("strong",{children:"Fix: Use a pull pattern or pagination."})}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract TokenFixed {
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
}`}),e.jsx("h2",{children:"4.4 Failure Mode 3: External Dependency Assumptions"}),e.jsx("p",{children:"Some contracts assume an external call will always succeed (e.g., a price oracle call). If the oracle is down or returns unexpected data, the contract halts."}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Vault {
    address oracle;

    // VULNERABLE: if oracle call reverts, entire liquidation fails
    function liquidate() external {
        uint price = Oracle(oracle).getPrice();  // Revert if oracle is down
        require(price > threshold);
        // ... liquidation logic
    }
}`}),e.jsx("p",{children:e.jsx("strong",{children:"Fix: Handle oracle failures gracefully with timeouts or fallback prices."})}),e.jsx("h2",{children:"4.5 Defense Patterns"}),e.jsx("p",{children:e.jsx("strong",{children:"1. Try-Catch (for calls to well-known ABIs):"})}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`function safeTransfer(address recipient, uint amount) internal {
    try recipient.call{value: amount}("") returns (bool ok) {
        // Handle success or fail gracefully
    } catch {
        // Log failure; don't revert
    }
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"2. Pull Pattern:"})," Users withdraw their own funds; contract doesn't push to them."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3. Pagination:"})," For loops, provide start/end indices to avoid unbounded iteration."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4. Fallback Mechanisms:"})," If an external call fails, use a cached value or a backup."]}),e.jsx("h2",{children:"4.6 Mini Case Study: The Parity Multisig Wallet Freeze"}),e.jsx("p",{children:'In 2017, a bug in the Parity multisig wallet allowed an attacker to call a "suicide" function, destroying the contract and locking ~$280M in funds. While not strictly a DoS, it demonstrates how a single unchecked external call or logic error can halt all operations.'}),e.jsx("p",{children:e.jsx("strong",{children:"Prevention Playbook:"})}),e.jsxs("ol",{children:[e.jsx("li",{children:"Use pull patterns for fund transfers when possible."}),e.jsx("li",{children:"Handle external call failures gracefully (try-catch, checks for return values)."}),e.jsx("li",{children:"Avoid unbounded loops; use pagination or pull-based withdrawal."}),e.jsx("li",{children:"Don't assume external calls will always succeed; have fallback logic."}),e.jsx("li",{children:"Test with reverting receivers and missing/slow oracles."})]}),e.jsx("h2",{children:"4.7 Quiz: Denial-of-Service"}),e.jsx(h,{quizKey:"dos_q1",quiz:o.dos_q1})]}),D=()=>e.jsxs("div",{children:[e.jsx("h1",{children:"Lab: Exploit, Patch, and Test"}),e.jsx("h2",{children:"Lab Objective"}),e.jsx("p",{children:"In this lab, you will:"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Analyze a vulnerable contract (a simple Vault with reentrancy)."}),e.jsx("li",{children:"Write an exploit contract that demonstrates the vulnerability."}),e.jsx("li",{children:"Understand why the attack works (threat model, call sequence)."}),e.jsx("li",{children:"Patch the vulnerable contract using Checks-Effects-Interactions."}),e.jsx("li",{children:"Write tests (Hardhat/Foundry style) that verify the exploit fails and the patch succeeds."})]}),e.jsx("h2",{children:"Lab Setup"}),e.jsx("p",{children:"You'll need:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Solidity compiler (0.8+)"}),e.jsx("li",{children:"Hardhat or Foundry"}),e.jsx("li",{children:"Basic testing knowledge"})]}),e.jsx("h2",{children:"Step 1: The Vulnerable Contract"}),e.jsx("p",{children:"Deploy and study this contract:"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`// SPDX-License-Identifier: MIT
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
}`}),e.jsx("h2",{children:"Step 2: The Exploit Contract"}),e.jsx("p",{children:"Write a contract that exploits reentrancy:"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract Attacker {
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
}`}),e.jsx("h2",{children:"Step 3: Write the Exploit Test"}),e.jsx("p",{children:"Using Hardhat:"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`const { expect } = require("chai");

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
});`}),e.jsx("h2",{children:"Step 4: Patch the Contract"}),e.jsx("p",{children:"Use Checks-Effects-Interactions:"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`contract VaultPatched {
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
}`}),e.jsx("h2",{children:"Step 5: Test the Patch"}),e.jsx("p",{children:"The same attack should now fail:"}),e.jsx("pre",{style:{background:"#f4f4f4",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px"},children:`describe("Reentrancy Patched", () => {
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
});`}),e.jsx("h2",{children:"Challenge Extensions"}),e.jsxs("p",{children:[e.jsx("strong",{children:"1. Cross-Function Reentrancy:"})," Write a vault with both withdraw() and transfer() functions. Show how an attacker can reenter via transfer() while withdraw() is executing."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2. Guard Pattern:"})," Implement a nonReentrant modifier and patch the vulnerable contract using it instead of CEI. Compare gas costs."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3. Reverting Receiver DoS:"})," Write a test where a recipient's fallback always reverts, and show how it locks the distributor. Then patch using a pull pattern."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4. Fuzz Testing:"})," Use Foundry's fuzz testing to generate random withdrawal amounts and verify the CEI-patched version is safe."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"5. Access Control Exploit:"})," Write a vault with an admin function to drain balance. Forget the onlyOwner modifier. Write an exploit contract that calls it, then patch."]}),e.jsxs("div",{style:{background:"#d4edda",padding:"12px",borderRadius:"4px",marginTop:"16px",borderLeft:"4px solid #28a745"},children:[e.jsx("strong",{children:"✓ Lab Deliverable:"})," Submit a test file that demonstrates the exploit, the patch, and verification that the patch works."]})]}),V=()=>{const t=[{title:"You are a smart contract auditor.",description:"A team asks you to audit their vault. They show you this code:",code:`function withdraw(uint amount) external {
    require(balance[msg.sender] >= amount);
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok);
    balance[msg.sender] -= amount;
}`,choices:[{text:"Approve it; the require statements look good.",id:"a"},{text:"Flag it as vulnerable: external call before state update (reentrancy).",id:"b"},{text:"Suggest adding tx.origin check for extra safety.",id:"c"}],consequence:{b:"✓ Correct! This is a classic reentrancy bug (Checks-Effects-Interactions violation). The balance update happens AFTER the external call, allowing reentrancy.",a:"✗ The require statements are there, but the STATE UPDATE happens after the external call. An attacker can reenter during the call and pass the require again.",c:"✗ tx.origin is dangerous and unrelated to this vulnerability. You'd still have reentrancy."}},{title:"Mitigation Strategy",description:"The team asks how to fix it. You suggest three approaches. Rank them by security/gas efficiency:",choices:[{text:"1. Checks-Effects-Interactions (CEI)",id:"a"},{text:"2. Nonreentrant guard (mutex lock)",id:"b"},{text:"3. Pull pattern (user withdraws, not contract pushes)",id:"c"}],consequence:{a:"✓ Best first-line defense for this case: update balance before the call. No extra gas or complexity.",b:"This also works but costs more gas and is overkill if CEI is used.",c:"This works but changes the API (users must call withdraw()); suitable for some patterns but not a drop-in fix."}},{title:"A New Vulnerability",description:"The team has a second function: transferAdmin(address newAdmin) which is public (not onlyAdmin). An attacker calls it. What is the damage?",choices:[{text:"Attacker becomes the new admin and can drain the vault.",id:"a"},{text:"Transaction reverts because of insufficient permissions.",id:"b"},{text:"The function is harmless; only an internal helper.",id:"c"}],consequence:{a:"✓ Correct! Missing access control (onlyAdmin modifier) on a sensitive function. The attack is privilege escalation.",b:"✗ There's no permission check in the function, so it doesn't revert.",c:"✗ A public function with no access control is not harmless; it's exposed to anyone."}},{title:"Fixing Access Control",description:"How should you fix transferAdmin? Choose the BEST approach:",choices:[{text:'require(tx.origin == admin, "not admin");',id:"a"},{text:'require(msg.sender == admin, "not admin");',id:"b"},{text:"Change visibility to internal; only certain functions can call it.",id:"c"}],consequence:{b:"✓ Correct! Always use msg.sender (immediate caller), not tx.origin. tx.origin is the original EOA, which can be exploited via delegated calls.",a:"✗ tx.origin is dangerous. A phishing attack (attacker tricks user into calling attacker's contract, which calls your function) would bypass this check.",c:"This helps as a secondary measure (default private), but you still need a check to ensure the internals caller is authorized."}},{title:"Delegatecall Hazard",description:"The team uses an upgradeable proxy pattern. The old implementation has storage [owner, balance]. The new version adds [owner, bool active, balance] (inserted before balance). What happens?",choices:[{text:"No problem; the proxy adjusts storage slots automatically.",id:"a"},{text:"The new 'active' field overwrites the 'balance' field, corrupting funds.",id:"b"},{text:"The upgrade is rejected because contracts detect mismatched layouts.",id:"c"}],consequence:{b:"✓ Correct! Storage layout is determined by declaration order. The new 'active' now occupies the 'balance' slot. Data is corrupted.",a:"✗ Storage slots are fixed by declaration order; new fields must be appended, not inserted.",c:"✗ Solidity doesn't automatically detect layout mismatches. You must use tools (hardhat-upgrades, slither) or manual review."}},{title:"Final: Denial-of-Service",description:"A contract loops over 100 recipients and sends ether. If one recipient's fallback reverts, the entire tx reverts and nobody gets paid. How do you fix this?",choices:[{text:"Use try-catch to skip reverts and continue the loop.",id:"a"},{text:"Record failed transfers as pending; let users claim later.",id:"b"},{text:"Use a pull pattern (users call withdraw(), not contract pushes).",id:"c"}],consequence:{a:"✓ This works. Try-catch silently handles reverts and the loop continues.",b:"✓ Also correct! Record the amount owed; recipient can claim by calling withdraw().",c:"✓ Also works! Shifts responsibility to users; no need to loop."}}];return e.jsxs("div",{children:[e.jsx("h1",{children:"Guided Simulation: Audit Decision Tree"}),e.jsx("p",{children:"Work through a series of audit scenarios. For each, choose the best answer and see the consequence revealed."}),t.length>0&&i<t.length&&e.jsxs("div",{style:{background:"#f8f9fa",padding:"20px",borderRadius:"8px",marginBottom:"16px"},children:[e.jsx("h3",{children:t[i].title}),e.jsx("p",{children:t[i].description}),t[i].code&&e.jsx("pre",{style:{background:"#fff",padding:"12px",borderRadius:"4px",overflowX:"auto",marginBottom:"16px",border:"1px solid #ddd"},children:t[i].code}),e.jsx("div",{style:{marginBottom:"16px"},children:t[i].choices.map((a,r)=>e.jsx("button",{onClick:()=>y([...b,{step:i,answer:a.id}]),style:{display:"block",width:"100%",padding:"12px",marginBottom:"8px",background:"#007bff",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"14px"},"aria-label":`Choose: ${a.text}`,children:a.text},r))}),b.some(a=>a.step===i)&&e.jsxs("div",{style:{background:"#d4edda",padding:"12px",borderRadius:"4px",marginBottom:"16px"},children:[e.jsx("div",{children:t[i].consequence[b.find(a=>a.step===i).answer]}),e.jsx("button",{onClick:()=>f(i+1),style:{marginTop:"12px",padding:"8px 16px",background:"#28a745",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},"aria-label":"Go to next scenario",children:"Next Scenario →"})]})]}),i>=t.length&&e.jsxs("div",{style:{background:"#d4edda",padding:"20px",borderRadius:"8px"},children:[e.jsx("h3",{children:"✓ Simulation Complete!"}),e.jsx("p",{children:"You have reviewed all major vulnerability categories. You are now ready to audit contracts independently."}),e.jsx("button",{onClick:()=>{f(0),y([])},style:{padding:"8px 16px",background:"#007bff",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},"aria-label":"Restart simulation",children:"Restart"})]})]})},L=()=>{const t=l.useMemo(()=>{let a=0;return w.forEach(r=>{m[r.id]&&a++}),{correct:a,total:w.length}},[m]);return e.jsxs("div",{children:[e.jsx("h1",{children:"Final Assessment"}),e.jsx("p",{children:"Answer all questions. Short-answer responses are evaluated by comparing your submission with the key points provided."}),w.map((a,r)=>e.jsxs("div",{style:{background:"#f8f9fa",border:"1px solid #dee2e6",borderRadius:"8px",padding:"16px",marginBottom:"16px"},children:[e.jsxs("div",{style:{fontWeight:"600",marginBottom:"12px"},children:["Q",r+1,". ",a.question]}),e.jsx("textarea",{placeholder:"Your answer...",value:m[a.id]||"",onChange:s=>S(a.id,s.target.value),style:{width:"100%",minHeight:"100px",padding:"8px",fontFamily:"monospace",fontSize:"12px",border:"1px solid #ddd",borderRadius:"4px"},"aria-label":`Answer for ${a.question}`}),x&&e.jsxs("div",{style:{marginTop:"12px",fontSize:"14px",color:"#666"},children:[e.jsx("strong",{children:"Key Points to Cover:"}),e.jsx("ul",{style:{marginTop:"8px"},children:a.keyPoints.map((s,n)=>e.jsx("li",{children:s},n))})]})]},a.id)),e.jsx("button",{onClick:()=>R(!x),style:{padding:"10px 20px",background:"#007bff",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",marginBottom:"16px"},"aria-label":x?"Hide feedback":"Show feedback",children:x?"Hide Feedback":"Show Feedback & Key Points"}),e.jsxs("div",{style:{background:"#e7f3ff",padding:"16px",borderRadius:"8px",marginBottom:"16px"},children:[e.jsxs("strong",{children:["Score: ",t.correct," / ",t.total]}),t.correct===t.total&&e.jsx("p",{style:{marginTop:"8px",color:"#28a745"},children:"✓ Excellent! You have mastered this module."}),t.correct>=t.total*.8&&t.correct<t.total&&e.jsx("p",{style:{marginTop:"8px",color:"#ffc107"},children:"≈ Good! Review sections 2 (Access Control) and 4 (DoS) for deeper understanding."}),t.correct<t.total*.8&&e.jsx("p",{style:{marginTop:"8px",color:"#dc3545"},children:"→ Review all sections and redo the quizzes to strengthen understanding."})]}),e.jsx("h2",{children:"Summary & Further Reading"}),e.jsx("p",{children:"In this module, we examined four critical code-level vulnerabilities and their defenses:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Reentrancy:"})," Update state before calling externals (CEI) or use a guard."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Access Control:"})," Use msg.sender (not tx.origin), apply modifiers consistently, and make functions internal by default."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Delegatecall:"})," Validate storage layout and context; use battle-tested proxy patterns."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Denial of Service:"})," Handle failures gracefully, use pull patterns, and avoid unbounded loops."]})]}),e.jsx("p",{style:{marginTop:"16px"},children:e.jsx("strong",{children:"Further Reading & References:"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Solidity Documentation: ",e.jsx("code",{children:"delegatecall"}),", fallback functions, error handling."]}),e.jsx("li",{children:"OpenZeppelin Contracts: reference implementations of guards, access control, proxy patterns."}),e.jsx("li",{children:'"The DAO Hack" (2016): seminal reentrancy exploit; see Ethereum Foundation postmortems.'}),e.jsx("li",{children:"SLITHER static analyzer: automates detection of common vulnerabilities."}),e.jsx("li",{children:"Echidna fuzzing tool: automated property-based testing for invariants."}),e.jsx("li",{children:"Hardhat and Foundry: best-in-class testing frameworks for Solidity."})]})]})},W=()=>{switch(u){case"intro":return T();case"reentrancy":return F();case"access":return P();case"delegatecall":return I();case"dos":return q();case"lab":return D();case"simulation":return V();case"assessment":return L();default:return T()}},B=j.findIndex(t=>t.id===u)/j.length*100;return e.jsxs("div",{style:{display:"flex",minHeight:"100vh",fontFamily:"system-ui, sans-serif",backgroundColor:"#f5f5f5"},children:[e.jsxs("div",{style:{width:"250px",background:"#2c3e50",color:"white",padding:"20px",overflowY:"auto",flexShrink:0},role:"navigation","aria-label":"Module navigation",children:[e.jsx("h3",{style:{marginTop:0,marginBottom:"20px"},children:"Smart Contract Vulnerabilities I"}),e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx("div",{style:{fontSize:"12px",marginBottom:"8px"},children:"Progress"}),e.jsx("div",{style:{width:"100%",height:"8px",background:"#34495e",borderRadius:"4px",overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${B}%`,background:"#3498db",transition:"width 0.3s"}})}),e.jsx("div",{style:{fontSize:"12px",marginTop:"4px",color:"#bdc3c7"},children:`${Math.round(B)}%`})]}),j.map((t,a)=>e.jsxs("button",{onClick:()=>v(t.id),style:{width:"100%",padding:"12px",marginBottom:"8px",background:u===t.id?"#3498db":"transparent",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",textAlign:"left",fontSize:"14px",transition:"background 0.2s"},"aria-current":u===t.id?"page":void 0,"aria-label":`${t.label}`,children:[e.jsx("span",{style:{marginRight:"8px"},children:t.icon}),t.label]},t.id)),e.jsxs("div",{style:{marginTop:"20px",borderTop:"1px solid #34495e",paddingTop:"20px"},children:[e.jsx("button",{onClick:()=>k(!p),style:{width:"100%",padding:"8px",background:"#e74c3c",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",marginBottom:"8px",fontSize:"12px"},"aria-label":p?"Hide all answers":"Show all answers",children:p?"⊘ Hide Answers":"✓ Show Answers"}),e.jsx("button",{onClick:()=>{g({}),k(!1),A({}),R(!1),f(0),y([]),v("intro")},style:{width:"100%",padding:"8px",background:"#95a5a6",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"12px"},"aria-label":"Reset all progress",children:"↺ Reset Activity"})]})]}),e.jsx("div",{style:{flex:1,padding:"40px",overflow:"auto",background:"white"},children:W()}),e.jsx(z,{})]})};export{X as default};
