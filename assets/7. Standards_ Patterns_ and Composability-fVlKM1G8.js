import{r as l,j as e}from"./index-OP-F52N7.js";import{F as N}from"./Footer-h1z9N8Ct.js";const U=()=>{const[r,c]=l.useState(0),[b,w]=l.useState(!1),[P,O]=l.useState({}),[d,x]=l.useState({}),[h,f]=l.useState(new Set),[g,u]=l.useState(null),R=l.useRef(null),p=[{id:"intro",title:"Introduction & Learning Objectives",type:"content",content:e.jsxs("div",{children:[e.jsx("h2",{children:"Standards, Patterns, and Composability in Blockchain"}),e.jsxs("p",{className:"abstract",children:[e.jsx("strong",{children:"Abstract:"})," This chapter synthesizes token standards (ERC-20, ERC-721, ERC-1155), access control patterns, and composability design principles into a cohesive framework for secure, scalable blockchain systems. We emphasize what standards guarantee versus what they do not, dissect access control tradeoffs, and expose composability risks with practical mitigations. Through hands-on labs and real-world case studies, learners progressing from beginner to advanced will understand how to architect systems that are functionally correct, economically sound, and resilient to common failure modes."]}),e.jsx("h3",{children:"Learning Objectives"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Articulate the guarantees and non-guarantees of ERC-20, ERC-721, and ERC-1155 standards."}),e.jsx("li",{children:"Design and implement role-based access control with least-privilege principles."}),e.jsx("li",{children:"Identify and mitigate composability risks including reentrancy, callback hazards, and dependency coupling."}),e.jsx("li",{children:"Apply industry patterns (e.g., Checks-Effects-Interactions, reentrancy guards, function selectors) to real systems."}),e.jsx("li",{children:"Evaluate tradeoffs between owner-based and role-based control and between monolithic and modular architectures."})]}),e.jsx("h3",{children:"Prerequisites"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Familiarity with blockchain basics (transactions, accounts, smart contracts)."}),e.jsx("li",{children:"Working knowledge of Solidity (functions, state, events, inheritance)."}),e.jsx("li",{children:"Understanding of access control and permission models (Unix-style, capability systems)."})]}),e.jsx("h3",{children:"Key Terms"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Token Standard:"})," A specification defining required interfaces and behaviors for fungible or non-fungible assets."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Least Privilege:"})," A security principle limiting actors to the minimum permissions needed for their role."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Composability:"})," The ability to combine independent components; in blockchain, a feature enabling rich DeFi but also introducing risk."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reentrancy:"})," A callback hazard where an external call invokes code that re-enters the calling contract before the first call completes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Non-guarantee:"})," A property or behavior not enforced by a standard, leaving it to implementers and users."]})]})]})},{id:"erc20",title:"1. ERC-20: Fungible Tokens",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"1.1 Standard Overview"}),e.jsx("p",{children:"ERC-20 is the most widely adopted Ethereum token standard. It defines a minimal interface for fungible (interchangeable) assets. Any ERC-20 token can be transferred, approved, and managed by the same tooling and contracts that recognize the standard."}),e.jsx("h4",{children:"Required Interface"}),e.jsx("pre",{className:"codeblock",children:`// ERC-20 Core Interface
interface IERC20 {
    // State-changing functions
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    // View functions
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    
    // Required events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}`}),e.jsx("h3",{children:"1.2 What ERC-20 Guarantees"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Interface compliance:"})," A contract implementing ERC-20 will emit Transfer on moves and Approval on allowance changes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Predictable ABI:"})," Tooling can interact with any ERC-20 without custom ABIs."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Balance tracking:"})," The standard assumes a mapping from address to balance; transfers update balances."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Allowance mechanism:"})," Enables delegation: owner approves a spender to transfer on their behalf."]})]}),e.jsx("h3",{children:"1.3 What ERC-20 Does NOT Guarantee"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Economic scarcity:"})," The standard does not enforce a cap or limit on supply. A contract could mint infinite tokens."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Immutability of decimals or name:"})," These metadata fields can be changed or omitted."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Accuracy of balanceOf:"})," A buggy or malicious implementation could return incorrect balances."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Prevention of double-spends within a block:"})," Reentrancy or logic bugs can cause the same tokens to be spent multiple times in a single transaction."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Atomicity across multiple transfers:"})," If a contract issues two transfers, one might succeed and one fail, leaving the system in an inconsistent state."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reversal or pause capability:"})," The standard does not mandate pause functions or the ability to reverse transactions."]})]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Key Takeaway:"})," ERC-20 is a ",e.jsx("em",{children:"minimal"})," standard. Its job is to define interfaces so wallets and contracts can recognize and move tokens. It explicitly does not solve economic design, governance, or security. Those are the implementer's responsibility."]}),e.jsx("h3",{children:"1.4 Example: Minimal ERC-20 Implementation"}),e.jsx("pre",{className:"codeblock",children:`pragma solidity ^0.8.0;

contract SimpleERC20 {
    string public name = "Simple Token";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
}`}),e.jsx("h3",{children:"1.5 Common Pitfalls"}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Common Pitfall: Unbounded Mint."})," An ERC-20 contract might allow anyone (or the owner) to mint tokens without limit. This destroys scarcity. If governance or access control is weak, a compromised key can hyper-inflate the supply."]}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Common Pitfall: Approval Race Condition."})," If Alice approves Bob for 100 tokens, then later approves him for 50 tokens (to reduce his allowance), Bob could front-run the second approval and call transferFrom for 100 before the reduction takes effect, then call transferFrom again for 50 after, spending 150 total. Modern practice: use ",e.jsx("code",{children:"increaseAllowance()"})," and ",e.jsx("code",{children:"decreaseAllowance()"})," instead."]}),e.jsx("h3",{children:"1.6 When to Use ERC-20"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Fungible assets where units are interchangeable (currencies, voting tokens, utility tokens)."}),e.jsx("li",{children:"Need compatibility with existing wallets, exchanges, and DeFi protocols."}),e.jsx("li",{children:"Governance tokens where voting power is proportional to balance."})]})]}),quiz:[{id:"erc20_q1",question:"Which of the following is guaranteed by the ERC-20 standard?",type:"multiple-choice",options:["A limited, immutable total supply","Emission of Transfer and Approval events for state-changing operations","Prevention of reentrancy attacks","Immutability of decimals and name metadata"],correctAnswer:1,explanation:"ERC-20 specifies that Transfer and Approval events must be emitted. It does not enforce supply limits, prevent reentrancy, or guarantee metadata immutability."},{id:"erc20_q2",question:"What is a non-guarantee of ERC-20?",type:"multi-select",options:["The standard interface will be present","Economic scarcity of the token","Accuracy of balanceOf reports","Proper initialization of totalSupply"],correctAnswers:[1,2],explanation:"Non-guarantees include economic design (supply caps, deflation) and correctness of implementations. Accuracy of balanceOf and totalSupply are implementation-specific and can be buggy or malicious."}]},{id:"erc721",title:"2. ERC-721: Non-Fungible Tokens",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"2.1 Standard Overview"}),e.jsxs("p",{children:["ERC-721 defines fungible assets that are ",e.jsx("em",{children:"unique"}),". Each token has a distinct identity (tokenId) and metadata. Common use cases: collectibles, digital art, game items, domain names."]}),e.jsx("h4",{children:"Required Interface"}),e.jsx("pre",{className:"codeblock",children:`interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
    function getApproved(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}`}),e.jsx("h3",{children:"2.2 What ERC-721 Guarantees"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Unique ownership:"})," Each tokenId is owned by at most one address at a time."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Transfer events:"})," Transfers emit Transfer events for tracking and indexing."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Approval mechanism:"})," Owners can approve a single address per token, or an operator for all their tokens."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Safe transfer callback:"}),' safeTransferFrom will invoke onERC721Received on recipient contracts, enabling "pull" semantics.']})]}),e.jsx("h3",{children:"2.3 What ERC-721 Does NOT Guarantee"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Metadata truthfulness:"})," The standard does not enforce that a URI points to valid, immutable, or authentic metadata."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Uniqueness of tokenId across contracts:"})," Multiple ERC-721 contracts can mint tokenId 1. Uniqueness is per-contract."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Immutability of token attributes:"})," A contract can update tokenURI or other properties after minting."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Creator, royalty, or ownership history:"})," The standard does not track who minted a token or legacy of ownership."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Prevention of duplicate mints:"})," A buggy contract might mint the same tokenId twice."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Enumeration of all tokens:"})," The core ERC-721 does not require a way to list all tokens; only the optional extension (ERC-721Enumerable) adds this."]})]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Key Takeaway:"})," ERC-721 standardizes the ",e.jsx("em",{children:"transfer mechanism"})," and ",e.jsx("em",{children:"ownership registry"}),", not the semantics or authenticity of what the token represents. A valid ERC-721 NFT could point to any metadata, including false, misleading, or mutable claims."]}),e.jsx("h3",{children:"2.4 Common Pitfalls"}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Common Pitfall: Metadata Centralization and Mutability."}),` If a contract's tokenURI points to a mutable server or database (e.g., "https://api.site.com/nft/123"), the issuer can change what the NFT "is" by editing that endpoint. This breaks immutability assumptions. Consider pinning metadata to IPFS or using on-chain storage.`]}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Common Pitfall: Missing onERC721Received Check."})," If a contract uses transferFrom instead of safeTransferFrom, it will not validate that the recipient can handle NFTs. Tokens can be sent to contracts with no on-ramp to retrieve them, permanently locking them."]}),e.jsx("h3",{children:"2.5 When to Use ERC-721"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Unique digital assets: art, collectibles, certificates of authenticity."}),e.jsx("li",{children:"Game items where each instance has distinct properties."}),e.jsx("li",{children:"Domain names or namespace registries."}),e.jsx("li",{children:"Bounded membership tokens (where total supply is limited and each instance is distinct)."})]}),e.jsx("h3",{children:"2.6 ERC-721 Extensions"}),e.jsxs("p",{children:[e.jsx("strong",{children:"ERC-721Enumerable:"})," Adds the ability to list all tokens and their owners. Useful for UIs and off-chain indexing, but adds gas cost."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"ERC-721Metadata:"})," Standardizes name(), symbol(), and tokenURI(). Widely supported by marketplaces."]})]}),quiz:[{id:"erc721_q1",question:"What is NOT guaranteed by ERC-721?",type:"multiple-choice",options:["Each tokenId has a unique owner","Transfer events are emitted","Metadata at tokenURI is immutable and truthful","Safe transfer callbacks invoke onERC721Received"],correctAnswer:2,explanation:"ERC-721 does not enforce metadata immutability or truthfulness. A contract can change tokenURI or point to mutable data. Metadata authenticity is not part of the standard."}]},{id:"erc1155",title:"3. ERC-1155: Multi-Token Standard",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"3.1 Standard Overview"}),e.jsx("p",{children:"ERC-1155 combines the flexibility of ERC-20 (many fungible tokens) and ERC-721 (uniqueness and metadata). A single contract can manage both fungible and non-fungible tokens. Each token has an id, and each id can exist in multiple copies (if fungible) or singular (if non-fungible)."}),e.jsx("h4",{children:"Core Interface"}),e.jsx("pre",{className:"codeblock",children:`interface IERC1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] memory accounts, uint256[] memory ids) 
        external view returns (uint256[] memory);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address account, address operator) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;
    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) external;
    
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);
}`}),e.jsx("h3",{children:"3.2 What ERC-1155 Guarantees"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Unified interface:"})," One contract manages multiple token types (id-based)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fungibility per id:"})," An id can represent a fungible asset (e.g., 1000 copies) or non-fungible (only one copy exists)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Batch operations:"})," safeBatchTransferFrom enables efficient multi-token transfers in one transaction."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Operator approval:"})," An address can approve an operator for all its tokens of any id."]})]}),e.jsx("h3",{children:"3.3 What ERC-1155 Does NOT Guarantee"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Supply semantics:"})," The standard does not enforce whether an id has a max supply, is capped, or is infinite."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Metadata structure:"})," uri(id) returns a URI but does not dictate format or immutability."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Enumeration:"})," No standard way to list all ids or all holders of an id without custom indexing."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Atomicity of batch operations:"})," A safeBatchTransferFrom might partially succeed, leaving inconsistent state if the receiving contract rejects some ids."]})]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Key Takeaway:"})," ERC-1155 is a ",e.jsx("em",{children:"flexible"})," standard that unifies fungible and non-fungible assets. However, flexibility introduces design choices left to the implementer: supply caps, metadata schemes, and batch behavior are not constrained."]}),e.jsx("h3",{children:"3.4 When to Use ERC-1155"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Games with both fungible currency and unique items in the same contract."}),e.jsx("li",{children:"DeFi protocols managing multiple collateral types."}),e.jsx("li",{children:'Marketplaces bundling heterogeneous assets (e.g., "crafting bundle").'}),e.jsx("li",{children:"Efficiency gains: batch operations reduce transaction count."})]}),e.jsx("h3",{children:"3.5 ERC-1155 vs. ERC-721 vs. ERC-20"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"2px solid #333"},children:[e.jsx("th",{style:{textAlign:"left",padding:"8px"},children:"Feature"}),e.jsx("th",{style:{textAlign:"left",padding:"8px"},children:"ERC-20"}),e.jsx("th",{style:{textAlign:"left",padding:"8px"},children:"ERC-721"}),e.jsx("th",{style:{textAlign:"left",padding:"8px"},children:"ERC-1155"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Fungible"}),e.jsx("td",{style:{padding:"8px"},children:"Yes"}),e.jsx("td",{style:{padding:"8px"},children:"No"}),e.jsx("td",{style:{padding:"8px"},children:"Both"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Unique Assets"}),e.jsx("td",{style:{padding:"8px"},children:"No"}),e.jsx("td",{style:{padding:"8px"},children:"Yes"}),e.jsx("td",{style:{padding:"8px"},children:"Yes"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Metadata"}),e.jsx("td",{style:{padding:"8px"},children:"None"}),e.jsx("td",{style:{padding:"8px"},children:"Per token"}),e.jsx("td",{style:{padding:"8px"},children:"Per id"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Batch Transfer"}),e.jsx("td",{style:{padding:"8px"},children:"No"}),e.jsx("td",{style:{padding:"8px"},children:"No"}),e.jsx("td",{style:{padding:"8px"},children:"Yes"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"8px"},children:"Exchangeability"}),e.jsx("td",{style:{padding:"8px"},children:"Universal"}),e.jsx("td",{style:{padding:"8px"},children:"Limited"}),e.jsx("td",{style:{padding:"8px"},children:"Per contract"})]})]})]})]}),quiz:[{id:"erc1155_q1",question:"Which scenario is best suited for ERC-1155?",type:"multiple-choice",options:["A purely fungible token like a stablecoin","Unique digital art with 1 copy each","A game managing both fungible currency and unique NFT items in one contract","A simple one-owner key-value registry"],correctAnswer:2,explanation:"ERC-1155 excels at mixed scenarios where you need both fungible and non-fungible tokens. Its batch operations and unified interface make it ideal for games and complex ecosystems."}]},{id:"access-control",title:"4. Access Control Patterns & Least Privilege",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"4.1 Owner-Based Control (Monolithic)"}),e.jsx("p",{children:"The simplest access control: one owner address can perform all privileged operations (mint, pause, update settings). This is often a single key or multisig."}),e.jsx("pre",{className:"codeblock",children:`contract SimpleToken {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        // Mint logic
    }
    
    function pause() external onlyOwner {
        // Pause logic
    }
}`}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Common Pitfall: God-Mode Admin."})," When one address has all permissions (mint, pause, transfer, upgrade), a compromised key compromises the entire system. There's no separation of duties, no rate-limiting, and no opportunity for a second opinion."]}),e.jsx("h3",{children:"4.2 Role-Based Control (Least Privilege)"}),e.jsx("p",{children:"Instead of one owner, define granular roles. Each role grants only the permissions needed for that function. OpenZeppelin's AccessControl is the reference implementation."}),e.jsx("pre",{className:"codeblock",children:`import "@openzeppelin/contracts/access/AccessControl.sol";

contract RolefulToken is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        // Mint logic
    }
    
    function pause() external onlyRole(PAUSER_ROLE) {
        // Pause logic
    }
    
    function grantMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }
}`}),e.jsx("h4",{children:"Key Principles"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Separation of Duties:"})," Different keys hold different roles. Minting is separate from pausing, which is separate from governance."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Capability Minimization:"}),' A key for "minting" should not also have "pause" or "upgrade" rights.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Time Locks:"})," Sensitive operations (e.g., changing admin, setting fees) can be delayed by a timelock contract, allowing users to exit if they disagree."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multi-Signature Controls:"})," Use a multisig for admin roles, e.g., 3-of-5 governance members must approve critical changes."]})]}),e.jsx("h3",{children:"4.3 Emergency Controls & Fail-Safe Defaults"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Pause Function:"})," Allows an authorized role to halt transfers, minting, etc., in response to a discovered exploit."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Circuit Breakers:"})," Automatically pause if abnormal behavior is detected (e.g., flash loan spike)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rate Limits:"})," Restrict the rate of sensitive operations (e.g., max mint per block)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Allowlists:"})," Start with no one being able to do X, then selectively grant permission. Safer than blacklists."]})]}),e.jsx("h3",{children:"4.4 Admin Rotation & Revocation"}),e.jsx("p",{children:"To reduce single-point-of-failure risk:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Rotate keys:"})," Periodically change which address holds a role."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Revocation mechanism:"})," A governance process to revoke compromised or malicious admins."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Two-step role transfer:"})," Instead of directly assigning a role, nominate then confirm in a second transaction. This prevents accidental transfers to wrong addresses."]})]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Key Takeaway:"})," Least privilege is a ",e.jsx("em",{children:"design principle"})," that reduces blast radius. If a minting key is compromised, only minting is at risk, not pausing or governance. Use role-based control and minimize overlap of permissions."]}),e.jsx("h3",{children:"4.5 Common Pitfalls"}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Overbroad Roles:"}),' Defining a role like "MAINTAINER" that includes minting, pausing, and metadata updates defeats the purpose. Break it into finer-grained roles.']}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Missing Revocation:"})," If a role can be granted but never revoked (no renounceRole or revokeRole), a malicious or compromised key holder keeps their power forever."]}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Admin Centralization:"})," Even with role separation, if the admin role (which grants and revokes other roles) is a single key, you've just moved the problem up one level. Use governance or multisig for admin."]})]}),quiz:[{id:"ac_q1",question:'Which best describes "least privilege"?',type:"multiple-choice",options:["All users have equal permissions","Each role gets only the minimum permissions needed for its function","The admin has all permissions","No one can change permissions"],correctAnswer:1,explanation:"Least privilege means granting each actor only the permissions they need. A minter role should not include pause or governance rights."},{id:"ac_q2",question:"What is a benefit of role-based control over simple owner-based control?",type:"multiple-choice",options:["It eliminates the need for audits","It separates duties and reduces blast radius if a key is compromised","It automatically prevents all hacks","It reduces gas costs"],correctAnswer:1,explanation:"Role-based control isolates permissions. A compromised minting key does not give access to pausing or governance. Blast radius is minimized."}]},{id:"composability",title:"5. Composability: Feature and Risk",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"5.1 Composability as a Feature"}),e.jsx("p",{children:"Composability is the ability to combine independent building blocks. A DeFi protocol can compose with any ERC-20 token, a lending pool can compose with an oracle, a DEX can compose with a token and a pricing mechanism. This creates rich functionality with minimal duplication."}),e.jsxs("p",{children:[e.jsx("strong",{children:"Example:"})," A user can deposit USDC into Compound (lending protocol), which automatically lends it out and earns interest. The user can then wrap cUSDC (Compound's receipt token) and use it as collateral elsewhere. Each protocol trusts the interface but not the internals of others."]}),e.jsx("h3",{children:"5.2 Composability as a Risk: External Calls"}),e.jsx("p",{children:"Every external call is a potential trust assumption. When your contract calls another contract, you:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Trust that the callee will execute as expected."}),e.jsx("li",{children:"Cede control: the callee can do anything until it returns."}),e.jsx("li",{children:"Risk reentrancy: the callee can call back into your contract before your first call finishes."})]}),e.jsx("h3",{children:"5.3 Reentrancy: The Callback Hazard"}),e.jsx("p",{children:"A classic reentrancy attack exploits the flow of control:"}),e.jsx("pre",{className:"codeblock",children:`// Vulnerable: Checks-Effect-Interaction (wrong order)
contract Vault {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount;  // <-- Updated AFTER external call!
    }
}`}),e.jsx("p",{children:"An attacker with a malicious contract can:"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Call withdraw(100)."}),e.jsx("li",{children:"The Vault sends 100 ETH via call()."}),e.jsx("li",{children:"Inside the fallback function, the attacker calls withdraw(100) again."}),e.jsx("li",{children:"The Vault checks balances[attacker] (still 100, not yet decremented), so the check passes."}),e.jsx("li",{children:"The Vault sends another 100 ETH."}),e.jsx("li",{children:"This repeats until the contract runs out of funds."})]}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Common Pitfall: Reentrancy."})," A contract can be drained by repeatedly calling a function before internal state is updated. Use Checks-Effects-Interactions (CEI) pattern: check conditions, update state, then call external functions."]}),e.jsx("h3",{children:"5.4 Mitigations: Checks-Effects-Interactions (CEI)"}),e.jsx("pre",{className:"codeblock",children:`// Correct: Checks-Effects-Interactions (correct order)
function withdraw(uint256 amount) external {
    // 1. CHECKS
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // 2. EFFECTS
    balances[msg.sender] -= amount;
    
    // 3. INTERACTIONS
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}`}),e.jsx("p",{children:"Now if the attacker re-enters, the balance has already been decremented, so the second check fails."}),e.jsx("h3",{children:"5.5 Reentrancy Guards"}),e.jsx("p",{children:"An additional layer: a flag that prevents re-entry."}),e.jsx("pre",{className:"codeblock",children:`import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeVault is ReentrancyGuard {
    function withdraw(uint256 amount) external nonReentrant {
        // Re-entry is blocked during this call
    }
}`}),e.jsx("h3",{children:"5.6 Pull vs. Push Patterns"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Push Pattern (you send):"})," The contract directly transfersTo() the user. Risk: if the user's address is a contract with a malicious fallback, reentrancy occurs. Also, a large transfer might fail, halting the entire transaction."]}),e.jsx("pre",{className:"codeblock",children:`// PUSH: Contract sends to users
function distributeRewards() external {
    for (uint i = 0; i < recipients.length; i++) {
        token.transfer(recipients[i], amounts[i]);  // Risk: one failure halts all
    }
}`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pull Pattern (users withdraw):"})," The contract records how much each user can claim, and users call a withdraw function to pull their funds. If one user's withdrawal fails, others are not affected."]}),e.jsx("pre",{className:"codeblock",children:`// PULL: Users withdraw themselves
function claimRewards(uint256 amount) external nonReentrant {
    require(rewards[msg.sender] >= amount, "Insufficient rewards");
    rewards[msg.sender] -= amount;
    token.transfer(msg.sender, amount);
}`}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Key Takeaway:"})," Pull patterns are safer: they isolate per-user risk and avoid reentrancy during a mass distribution. Use pull when possible; if you must use push, use reentrancy guards and follow CEI."]}),e.jsx("h3",{children:"5.7 Approvals and Front-Running"}),e.jsx("p",{children:"When a contract approves a spender to use its tokens, the spender can call transferFrom up to the approved amount. But front-running can occur:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Alice approves Bob for 100 USDC, then approves him for 50 USDC (reducing his allowance)."}),e.jsx("li",{children:"Bob sees the reduce transaction in the mempool and front-runs it with transferFrom(100)."}),e.jsx("li",{children:"Bob's transferFrom processes first (spending 100), then the approve(50) processed, leaving Bob with 50 more allowance."}),e.jsx("li",{children:"Bob can then call transferFrom(50)."})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Mitigation:"})," Use increaseAllowance() and decreaseAllowance() instead of setting an absolute amount."]}),e.jsx("h3",{children:"5.8 Dependency Coupling: Trust and Assumptions"}),e.jsx("p",{children:"When your contract integrates with another (e.g., a DEX, an oracle, a token), you inherit their risk profile:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Oracle Risk:"})," If you fetch prices from a centralized oracle, a stale or manipulated price breaks your system."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Token Contract Risk:"})," If you use an ERC-20, you must trust its transfer() implementation. A buggy or malicious token can steal your funds."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Upgradeability Coupling:"})," If you depend on a contract that can be upgraded via a proxy, the new version might break compatibility or steal funds."]})]}),e.jsx("h3",{children:"5.9 Interface Boundaries & Try-Catch"}),e.jsx("p",{children:"To isolate risk and prevent one failure from halting the whole transaction, use try-catch around external calls:"}),e.jsx("pre",{className:"codeblock",children:`function transferTokens(address token, address to, uint256 amount) external {
    try IERC20(token).transfer(to, amount) returns (bool success) {
        require(success, "Transfer returned false");
    } catch {
        // Handle failure gracefully
        emit TransferFailed(token, to, amount);
    }
}`}),e.jsx("h3",{children:"5.10 Allowlists and Opt-In Risk"}),e.jsx("p",{children:"Instead of trusting all external contracts, use an allowlist of vetted dependencies:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Only accept specific token addresses."}),e.jsx("li",{children:"Only call specific oracles."}),e.jsx("li",{children:"Disable composability with untrusted contracts."})]}),e.jsx("h3",{children:"5.11 Pausing and Circuit Breakers"}),e.jsx("p",{children:"If a composability risk is discovered (e.g., a token contract was hacked), pause operations immediately:"}),e.jsx("pre",{className:"codeblock",children:`contract RiskyComposition {
    bool public paused;
    
    function setPaused(bool p) external onlyRole(PAUSER_ROLE) {
        paused = p;
    }
    
    function interact(address external_contract) external {
        require(!paused, "System is paused");
        // Interact
    }
}`}),e.jsx("h3",{children:"5.12 Invariant Thinking"}),e.jsx("p",{children:"Define the invariants your system must maintain despite external calls and reentrancy:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Invariant:"})," balances[user] + rewards[user] == total owed to user."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Invariant:"})," sum of all balances == token balance of contract."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"After every external call, re-check invariants."})," If they are violated, revert."]})]}),e.jsxs("div",{className:"callout pitfall",children:[e.jsx("strong",{children:"Common Pitfall: Callback Hazards with ERC-721."})," safeTransferFrom calls onERC721Received on the recipient, which can re-enter the contract. If not protected by nonReentrant, an attacker can:",e.jsxs("ol",{style:{marginLeft:"20px"},children:[e.jsx("li",{children:"Receive an NFT in onERC721Received."}),e.jsx("li",{children:"Re-enter the contract to transfer another NFT or burn it."}),e.jsx("li",{children:"Accomplish actions that should not be available mid-transfer."})]})]})]}),quiz:[{id:"comp_q1",question:"Which order is correct in the Checks-Effects-Interactions pattern?",type:"multiple-choice",options:["Interactions, Effects, Checks","Checks, Interactions, Effects","Checks, Effects, Interactions","Effects, Checks, Interactions"],correctAnswer:2,explanation:"CEI order: first verify conditions (Checks), then update internal state (Effects), then call external functions (Interactions). This prevents reentrancy."},{id:"comp_q2",question:"What is an advantage of the pull pattern over the push pattern?",type:"multiple-choice",options:["It always costs less gas","It isolates per-user risk and avoids reentrancy in distributions","It guarantees that all users receive funds","It eliminates the need for access control"],correctAnswer:1,explanation:"Pull pattern isolates risk: if one user's withdrawal fails or reenters, other users can still withdraw. Push pattern risks one failure halting the entire distribution."},{id:"comp_q3",question:"Which is a non-guarantee of composability?",type:"multiple-choice",options:["External contracts will behave as expected","Multiple contracts can be combined safely","The interface is standardized","Oracles will always return accurate prices"],correctAnswer:3,explanation:"Composability does not guarantee correctness of external data sources or the reliability of called contracts. You must audit and validate external dependencies."}]},{id:"case-study",title:"6. Case Study: Token + Marketplace + Escrow",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"6.1 Scenario"}),e.jsx("p",{children:"A user (Alice) wants to sell an ERC-721 NFT to another user (Bob). The NFT is on contract NFTContract, and they trade for 100 USDC. To prevent cheating:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Alice does not want to transfer the NFT until she receives USDC."}),e.jsx("li",{children:"Bob does not want to transfer USDC until he receives the NFT."})]}),e.jsx("p",{children:"Solution: an Escrow contract holds both assets and releases them atomically only if both parties agree."}),e.jsx("h3",{children:"6.2 Architecture"}),e.jsx("pre",{className:"codeblock",children:`contract Escrow {
    struct Deal {
        address nftSeller;
        address nftBuyer;
        address nftContract;
        uint256 tokenId;
        address usdcToken;
        uint256 usdcAmount;
        bool nftDeposited;
        bool usdcDeposited;
    }
    
    mapping(uint256 => Deal) public deals;
    uint256 public dealCounter;
    
    // Alice initiates: she will sell an NFT for 100 USDC
    function initiateDeal(
        address nftContract,
        uint256 tokenId,
        uint256 usdcAmount
    ) external returns (uint256 dealId) {
        dealId = dealCounter++;
        deals[dealId] = Deal({
            nftSeller: msg.sender,
            nftBuyer: address(0),
            nftContract: nftContract,
            tokenId: tokenId,
            usdcToken: USDC_ADDRESS,
            usdcAmount: usdcAmount,
            nftDeposited: false,
            usdcDeposited: false
        });
    }
    
    // Alice deposits her NFT
    function depositNFT(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(msg.sender == deal.nftSeller, "Only seller");
        require(!deal.nftDeposited, "Already deposited");
        
        // Transfer NFT to escrow
        IERC721(deal.nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            deal.tokenId
        );
        deal.nftDeposited = true;
    }
    
    // Bob joins the deal and deposits USDC
    function depositUSDC(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(deal.nftDeposited, "Seller must deposit NFT first");
        require(deal.nftBuyer == address(0), "Buyer already set");
        
        deal.nftBuyer = msg.sender;
        
        // Transfer USDC to escrow
        require(
            IERC20(deal.usdcToken).transferFrom(
                msg.sender,
                address(this),
                deal.usdcAmount
            ),
            "USDC transfer failed"
        );
        deal.usdcDeposited = true;
    }
    
    // Both have deposited; now settle
    function settle(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(deal.nftDeposited && deal.usdcDeposited, "Both assets required");
        
        // Send NFT to buyer
        IERC721(deal.nftContract).safeTransferFrom(
            address(this),
            deal.nftBuyer,
            deal.tokenId
        );
        
        // Send USDC to seller
        require(
            IERC20(deal.usdcToken).transfer(
                deal.nftSeller,
                deal.usdcAmount
            ),
            "USDC transfer failed"
        );
        
        // Clean up
        delete deals[dealId];
    }
}`}),e.jsx("h3",{children:"6.3 Composability Risks in This System"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"NFT Contract Risk:"})," If nftContract is malicious, its safeTransferFrom could reenters the Escrow contract during onERC721Received callback."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"USDC Risk:"})," If USDC is hacked or behaves unexpectedly, transfers might fail or revert mid-settlement."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Escrow contract vulnerability:"})," The settle() function performs two transfers. If the first succeeds and the second fails, the system is inconsistent."]})]}),e.jsx("h3",{children:"6.4 Mitigations"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Reentrancy Guard:"})," Add nonReentrant to depositNFT and settle."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Order of operations:"})," Perform internal state updates (e.g., delete deals[dealId]) before external calls."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Allowlist:"})," Only accept specific NFT and USDC contracts."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pause function:"})," If a token contract is found to be malicious, pause the escrow."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fallback logic:"})," If settle fails, provide a claim function for participants to recover their assets."]})]}),e.jsx("h3",{children:"6.5 Improved Version"}),e.jsx("pre",{className:"codeblock",children:`import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeEscrow is ReentrancyGuard {
    // ... (struct and mappings as before)
    
    mapping(address => bool) public allowedNFT;
    IERC20 public usdc;
    mapping(address => uint256) public claimable;  // Fallback: users can claim their assets
    
    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }
    
    function setAllowedNFT(address nft, bool allowed) external onlyOwner {
        allowedNFT[nft] = allowed;
    }
    
    function depositNFT(uint256 dealId) external nonReentrant {
        Deal storage deal = deals[dealId];
        require(allowedNFT[deal.nftContract], "NFT not allowed");
        require(msg.sender == deal.nftSeller, "Only seller");
        require(!deal.nftDeposited, "Already deposited");
        
        IERC721(deal.nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            deal.tokenId
        );
        deal.nftDeposited = true;
    }
    
    function settle(uint256 dealId) external nonReentrant {
        Deal storage deal = deals[dealId];
        require(deal.nftDeposited && deal.usdcDeposited, "Both assets required");
        
        address nftSeller = deal.nftSeller;
        address nftBuyer = deal.nftBuyer;
        uint256 amount = deal.usdcAmount;
        address nftContract = deal.nftContract;
        uint256 tokenId = deal.tokenId;
        
        delete deals[dealId];  // State update before external calls
        
        // Try NFT transfer
        try IERC721(nftContract).safeTransferFrom(
            address(this),
            nftBuyer,
            tokenId
        ) {
            // Try USDC transfer
            if (!usdc.transfer(nftSeller, amount)) {
                // Fallback: refund NFT and allow manual recovery
                claimable[nftBuyer] += amount;  // USDC claimable
                claimable[nftSeller] += 1;  // NFT claimable (encode as special value)
            }
        } catch {
            claimable[nftBuyer] += amount;  // USDC claimable if NFT transfer failed
        }
    }
    
    function claim(uint256 dealId) external nonReentrant {
        uint256 amount = claimable[msg.sender];
        require(amount > 0, "Nothing to claim");
        claimable[msg.sender] = 0;
        require(usdc.transfer(msg.sender, amount), "Claim failed");
    }
}`}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Key Takeaway:"})," In a multi-contract system, isolate risks with reentrancy guards, follow CEI, and always provide fallback paths. One failed external call should not leave the system in an inconsistent state."]})]}),quiz:[{id:"cs_q1",question:"In the Escrow case study, why could reentrancy be a risk?",type:"multiple-choice",options:["The escrow contract is not an ERC-721","An NFT contract could re-enter during safeTransferFrom callback","USDC cannot be reentered","Reentrancy can never happen in escrow contracts"],correctAnswer:1,explanation:"safeTransferFrom calls onERC721Received on the recipient (the Escrow contract), which can reenters the contract, potentially calling settle() again or other functions during the callback."}]},{id:"lab",title:"7. Hands-On Lab: Implement a Token with RBAC",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"7.1 Objective"}),e.jsx("p",{children:"Build an ERC-20 token with role-based access control (RBAC) using OpenZeppelin patterns. The token should:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Follow the ERC-20 standard (interface compliance, events)."}),e.jsx("li",{children:"Support role-based minting (only MINTER_ROLE can mint)."}),e.jsx("li",{children:"Support role-based pausing (only PAUSER_ROLE can pause)."}),e.jsx("li",{children:"Prevent transfers when paused."}),e.jsx("li",{children:"Use ReentrancyGuard for _beforeTokenTransfer hooks."})]}),e.jsx("h3",{children:"7.2 Starter Code"}),e.jsx("pre",{className:"codeblock",children:`pragma solidity ^0.8.0;


contract SecureToken is ERC20, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    event TokenMinted(address indexed to, uint256 amount);
    event TokenBurned(address indexed from, uint256 amount);
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
        nonReentrant 
    {
        _mint(to, amount);
        emit TokenMinted(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokenBurned(msg.sender, amount);
    }
    
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}`}),e.jsx("h3",{children:"7.3 Step-by-Step Instructions"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Inherit from ERC20, AccessControl, Pausable."})," These provide the base functionality."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Define roles:"})," MINTER_ROLE, PAUSER_ROLE, and DEFAULT_ADMIN_ROLE (inherited)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"In constructor:"})," Grant yourself all roles initially. In production, this should be a governance contract."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Implement mint():"})," Only MINTER_ROLE can call; emit TokenMinted event."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Implement pause/unpause():"})," Only PAUSER_ROLE can call."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Override _beforeTokenTransfer():"})," Check whenNotPaused to prevent transfers when paused."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Add reentrancy guard:"})," Protect mint() and burn() with nonReentrant."]})]}),e.jsx("h3",{children:"7.4 Testing Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Deploy the contract. Verify initial supply is 0."}),e.jsx("li",{children:"Call mint(alice, 1000). Verify alice's balance is 1000."}),e.jsx("li",{children:"Call transfer(bob, 100) from alice. Verify bob receives 100."}),e.jsx("li",{children:'Call pause(). Attempt to transfer → should revert with "Pausable: paused".'}),e.jsx("li",{children:"Call unpause(). Transfer should work again."}),e.jsx("li",{children:"Call burn(500). Verify balance decreases."}),e.jsx("li",{children:'Test access control: attempt to mint as a non-MINTER → should revert "AccessControl: account 0x... is missing role...".'})]}),e.jsx("h3",{children:"7.5 Advanced Challenges"}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Challenge 1: Mint Cap."})," Add a maxSupply variable. Prevent minting beyond this cap. Emit MintCapExceeded if exceeded."]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Challenge 2: Role Timelock."})," When admin revokes a role, enforce a 2-day delay before the revocation takes effect. This allows users to exit if they disagree with governance."]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Challenge 3: Multi-Sig Admin."})," Instead of a single address as admin, use a multisig contract (e.g., 3-of-5 signers) to approve critical changes (role grants, revokes)."]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Challenge 4: Integrate with a DEX."})," Deploy your token and a simple Uniswap-like DEX (2 tokens, constant product formula). Verify that your token works with external contracts and that your pause function prevents DEX interactions."]}),e.jsx("h3",{children:"7.6 Summary of Lab Takeaways"}),e.jsxs("ul",{children:[e.jsx("li",{children:"OpenZeppelin contracts are vetted and battle-tested. Use them as building blocks."}),e.jsx("li",{children:"Role-based access control scales better than monolithic owner control."}),e.jsx("li",{children:"Pausable is a critical emergency control for composed systems."}),e.jsx("li",{children:"Reentrancy guards and CEI order protect against callback hazards."}),e.jsx("li",{children:"Emit events for auditing; off-chain indexers depend on them."})]})]}),quiz:[{id:"lab_q1",question:"In the SecureToken lab, what happens if you call transfer() while paused?",type:"multiple-choice",options:["The transfer always succeeds",'The transfer reverts with "Pausable: paused"',"The transfer is delayed until unpause() is called","Pausing only affects minting, not transfers"],correctAnswer:1,explanation:"The _beforeTokenTransfer() override includes whenNotPaused, which reverts all token transfers when the contract is paused."}]},{id:"summary",title:"8. Summary & Further Reading",type:"content",content:e.jsxs("div",{children:[e.jsx("h3",{children:"8.1 Key Takeaways"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Token standards (ERC-20, ERC-721, ERC-1155) define interfaces, not economic or security properties."})," Implementers must design supply, upgradability, and safety."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Least privilege and role-based access control reduce blast radius."})," A god-mode admin is a single point of failure."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Composability is powerful but risky."})," Every external call is a trust assumption. Use Checks-Effects-Interactions, reentrancy guards, and invariant thinking."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pull patterns isolate risk; push patterns are convenient but error-prone."})," Use pull for critical systems."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Pause, allowlists, and circuit breakers are not "nice-to-have"; they are essential for production systems.'})," They provide an emergency off-ramp when a composed dependency fails."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Audit vetted libraries like OpenZeppelin."})," Don't reimplement access control or token standards; the cost of bugs is too high."]})]}),e.jsx("h3",{children:"8.2 Threat Model Summary"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"2px solid #333"},children:[e.jsx("th",{style:{textAlign:"left",padding:"8px"},children:"Threat"}),e.jsx("th",{style:{textAlign:"left",padding:"8px"},children:"Mitigation"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Reentrancy"}),e.jsx("td",{style:{padding:"8px"},children:"CEI pattern, nonReentrant guard"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"God-mode admin"}),e.jsx("td",{style:{padding:"8px"},children:"Role-based access control, least privilege"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Malicious external contract"}),e.jsx("td",{style:{padding:"8px"},children:"Allowlist, try-catch, pause"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Approval race condition"}),e.jsx("td",{style:{padding:"8px"},children:"increaseAllowance/decreaseAllowance"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Metadata mutability (NFT)"}),e.jsx("td",{style:{padding:"8px"},children:"Pin to IPFS or on-chain storage"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #ccc"},children:[e.jsx("td",{style:{padding:"8px"},children:"Hyper-inflation"}),e.jsx("td",{style:{padding:"8px"},children:"Supply cap, MINTER_ROLE, governance"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"8px"},children:"Oracle manipulation"}),e.jsx("td",{style:{padding:"8px"},children:"Multiple oracles, price bounds, circuit breaker"})]})]})]}),e.jsx("h3",{children:"8.3 Further Reading"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"EIP-20 (ERC-20):"})," https://eips.ethereum.org/EIPS/eip-20 — Official token standard specification."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"EIP-721 (ERC-721):"})," https://eips.ethereum.org/EIPS/eip-721 — Non-fungible token standard."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"EIP-1155:"})," https://eips.ethereum.org/EIPS/eip-1155 — Multi-token standard."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"OpenZeppelin Contracts:"})," https://docs.openzeppelin.com/ — Audited, production-grade implementations of standards and patterns."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Solidity Docs on Security:"})," https://docs.soliditylang.org/en/latest/security-considerations.html — Official guidance on reentrancy, call depth, and more."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"DeFi Security:"})," Trail of Bits, Certora, and other auditors publish public reports detailing composability failures and mitigations."]})]}),e.jsx("h3",{children:"8.4 Recommended Next Steps"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Implement the lab (SecureToken with RBAC)."}),e.jsx("li",{children:"Write unit tests covering all roles, pausing, and edge cases."}),e.jsx("li",{children:"Run a mainnet fork test to verify composability with a real DEX."}),e.jsx("li",{children:"Read the OpenZeppelin source code for AccessControl and ReentrancyGuard; understand how they work."}),e.jsx("li",{children:"Audit your own token contract using static tools (Slither) and manual review."}),e.jsx("li",{children:"Study published exploits and case studies (e.g., the DAO, Parity Wallet, recent DEX hacks) to internalize why these patterns matter."})]}),e.jsxs("div",{className:"callout",children:[e.jsx("strong",{children:"Final Thought:"})," Standards and patterns exist because consensus is hard and security failures are expensive. By using vetted building blocks and applying proven patterns, you shift effort from reinventing the wheel to thoughtful architectural design. The goal is not perfection (impossible in a Turing-complete system), but rather a clear threat model, documented assumptions, and defense-in-depth mitigations."]})]})},{id:"final-assessment",title:"Final Assessment",type:"assessment",content:e.jsxs("div",{children:[e.jsx("h3",{children:"Final Assessment: Comprehensive Exam"}),e.jsx("p",{children:"Below are scenario-based and conceptual questions covering all major topics. Answer each honestly to identify weak areas and deepen understanding."})]})}],m=[{id:"fa_q1",question:"You are designing a token for a DAO. The token is used for voting and governance. Should you use ERC-20, ERC-721, or ERC-1155? Justify your choice.",type:"short-answer",rubric:{correctPoints:10,keyPoints:["ERC-20 is most appropriate","Fungible units allow one-token-one-vote easily","ERC-721 would be impractical (unique tokens, unequal voting)","ERC-1155 is overkill but could work if voting power varies by id"]}},{id:"fa_q2",question:"Your token contract has three privileged functions: mint(), pause(), and upgrade(). You have three operations teams. How would you structure access control to enforce least privilege?",type:"short-answer",rubric:{correctPoints:10,keyPoints:["Define three separate roles: MINTER_ROLE, PAUSER_ROLE, UPGRADER_ROLE","Assign each team to one role (no overlaps)","Default admin or governance controls role grants/revokes","Mentions timelock or multisig for admin actions"]}},{id:"fa_q3",question:"A contract has a function that calls an external token.transfer(). Before the transfer, the function updates internal state. After the transfer, it decrements a counter. Is this order vulnerable to reentrancy? Why or why not?",type:"short-answer",rubric:{correctPoints:10,keyPoints:["Yes, vulnerable","Problem: internal state is updated BEFORE the external call","If token contract re-enters before returning, the counter is not yet decremented","Correct order is: Checks, Update state, Then external call (CEI)"]}},{id:"fa_q4",question:'An ERC-721 contract allows users to mint an NFT for 1 ETH. The metadata is stored at "https://api.nftsite.com/meta/[tokenId]". Is there a risk? How would you mitigate it?',type:"short-answer",rubric:{correctPoints:10,keyPoints:['Risk: metadata centralization; issuer can change what the NFT "is" anytime',"Mitigations include: pin metadata to IPFS and store hash on-chain, or store metadata entirely on-chain","Immutability is critical for NFT authenticity and value"]}},{id:"fa_q5",question:"Compare push and pull distribution patterns. Which is safer and why?",type:"short-answer",rubric:{correctPoints:10,keyPoints:["Pull is safer","Pull isolates per-user risk and avoids reentrancy","Push requires mass transfers in a loop; one failure halts all","Pull allows users to withdraw independently"]}}],C=t=>{const n=new Set(h);n.add(t),f(n)},y=(t,n,o)=>{const i=`${t}-${n}`;x({...d,[i]:o})},E=()=>{let t=0;m.forEach(n=>{const o=`final-${n.id}`,i=d[o];i&&i.trim().length>0&&(t+=5)}),u(t)},k=()=>(h.size/(p.length-2)*100).toFixed(0),T=()=>p[r],A=t=>t.quiz?e.jsxs("div",{className:"quiz-section",children:[e.jsxs("h4",{children:["Knowledge Check: ",t.title]}),t.quiz.map((n,o)=>e.jsxs("div",{className:"quiz-question",style:{marginBottom:"20px"},children:[e.jsx("p",{children:e.jsxs("strong",{children:["Q",o+1,": ",n.question]})}),n.type==="multiple-choice"&&e.jsx("div",{children:n.options.map((i,s)=>e.jsxs("label",{style:{display:"block",marginBottom:"8px"},children:[e.jsx("input",{type:"radio",name:n.id,value:s,onChange:j=>y(t.id,n.id,parseInt(j.target.value)),checked:d[`${t.id}-${n.id}`]===s})," ",i]},s))}),n.type==="multi-select"&&e.jsx("div",{children:n.options.map((i,s)=>e.jsxs("label",{style:{display:"block",marginBottom:"8px"},children:[e.jsx("input",{type:"checkbox",name:n.id,value:s,onChange:j=>{const v=d[`${t.id}-${n.id}`]||[],S=j.target.checked?[...v,s]:v.filter(F=>F!==s);y(t.id,n.id,S)},checked:(d[`${t.id}-${n.id}`]||[]).includes(s)})," ",i]},s))}),b&&n.explanation&&e.jsxs("div",{className:"feedback",style:{marginTop:"10px",padding:"10px",backgroundColor:"#e8f5e9",borderRadius:"4px"},children:[e.jsx("strong",{children:"Explanation:"})," ",n.explanation]})]},n.id))]}):null,I=()=>g!==null?e.jsxs("div",{style:{padding:"20px",backgroundColor:"#f5f5f5",borderRadius:"8px"},children:[e.jsx("h3",{children:"Assessment Complete"}),e.jsx("p",{children:e.jsxs("strong",{children:["Score: ",g," / ",m.length*5," points"]})}),e.jsxs("p",{children:["Percentage: ",(g/(m.length*5)*100).toFixed(1),"%"]}),e.jsx("p",{style:{marginTop:"20px",fontSize:"14px",color:"#666"},children:"Scores below 70% suggest reviewing: access control patterns, composability risks, and token standards non-guarantees."}),e.jsx("button",{onClick:()=>u(null),style:{padding:"10px 15px",backgroundColor:"#2196F3",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",marginRight:"10px"},children:"Review Answers"}),e.jsx("button",{onClick:()=>{c(0),f(new Set),x({}),u(null)},style:{padding:"10px 15px",backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Reset Module"})]}):e.jsxs("div",{children:[m.map((t,n)=>e.jsxs("div",{className:"quiz-question",style:{marginBottom:"20px"},children:[e.jsx("p",{children:e.jsxs("strong",{children:["Q",n+1,": ",t.question]})}),e.jsx("textarea",{value:d[`final-${t.id}`]||"",onChange:o=>y("final",t.id,o.target.value),style:{width:"100%",height:"80px",padding:"10px",fontFamily:"monospace",border:"1px solid #ddd",borderRadius:"4px"}})]},t.id)),e.jsx("button",{onClick:E,style:{padding:"10px 15px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Submit Assessment"})]}),a=T();return e.jsxs("div",{style:{display:"flex",fontFamily:"Arial, sans-serif",minHeight:"100vh",backgroundColor:"#fafafa"},children:[e.jsxs("div",{style:{width:"250px",backgroundColor:"#1f1f1f",color:"white",overflowY:"auto",padding:"20px",position:"fixed",height:"100vh",boxShadow:"2px 0 5px rgba(0,0,0,0.2)"},children:[e.jsx("h2",{style:{marginTop:0,fontSize:"18px",borderBottom:"1px solid #555",paddingBottom:"10px"},children:"Blockchain Standards"}),e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("label",{style:{fontSize:"12px",color:"#aaa"},children:["Progress: ",k(),"%"]}),e.jsx("div",{style:{width:"100%",backgroundColor:"#444",borderRadius:"4px",height:"8px",marginTop:"5px",overflow:"hidden"},children:e.jsx("div",{style:{width:`${k()}%`,height:"100%",backgroundColor:"#4CAF50",transition:"width 0.3s"}})})]}),e.jsx("div",{style:{fontSize:"12px",marginBottom:"20px"},children:e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",checked:b,onChange:t=>w(t.target.checked)})," ",e.jsx("strong",{children:"Show Answers"})," (Instructor Mode)"]})}),e.jsx("nav",{children:p.map((t,n)=>e.jsxs("button",{onClick:()=>c(n),style:{display:"block",width:"100%",padding:"12px",margin:"5px 0",backgroundColor:r===n?"#4CAF50":h.has(t.id)?"#2196F3":"#333",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",textAlign:"left",fontSize:"12px",fontWeight:r===n?"bold":"normal"},"aria-current":r===n?"page":void 0,children:[h.has(t.id)&&"✓ ",t.title]},t.id))}),e.jsx("button",{onClick:()=>{c(0),f(new Set),x({}),u(null)},style:{display:"block",width:"100%",padding:"12px",marginTop:"20px",backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"12px",fontWeight:"bold"},children:"Reset Activity"})]}),e.jsxs("div",{style:{marginLeft:"250px",flex:1,padding:"40px",maxWidth:"1000px",margin:"0 auto"},children:[e.jsxs("div",{ref:R,style:{backgroundColor:"white",padding:"30px",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"},children:[a.type==="content"&&e.jsxs(e.Fragment,{children:[a.content,a.quiz&&A(a),e.jsxs("div",{style:{marginTop:"30px",padding:"15px",backgroundColor:"#f9f9f9",borderRadius:"4px"},children:[e.jsx("button",{onClick:()=>{C(a.id),r<p.length-1&&c(r+1)},style:{padding:"10px 20px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",marginRight:"10px"},children:"Mark Complete & Continue"}),r>0&&e.jsx("button",{onClick:()=>c(r-1),style:{padding:"10px 20px",backgroundColor:"#2196F3",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Previous"})]})]}),a.type==="assessment"&&e.jsxs(e.Fragment,{children:[a.content,I()]})]}),e.jsx("style",{children:`
                    .callout {
                        padding: 15px;
                        margin: 15px 0;
                        border-left: 4px solid #2196F3;
                        background-color: #e3f2fd;
                        border-radius: 4px;
                    }
                    .callout.pitfall {
                        border-left-color: #f44336;
                        background-color: #ffebee;
                    }
                    .codeblock {
                        background-color: #f5f5f5;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        padding: 15px;
                        overflow-x: auto;
                        font-family: monospace;
                        font-size: 12px;
                        line-height: 1.4;
                        margin: 15px 0;
                    }
                    .quiz-section {
                        margin-top: 20px;
                        padding: 20px;
                        background-color: #f9f9f9;
                        border-radius: 4px;
                    }
                    .quiz-question {
                        background-color: white;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .feedback {
                        margin-top: 10px;
                        padding: 10px;
                        background-color: #e8f5e9;
                        border-radius: 4px;
                        font-size: 13px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 15px 0;
                    }
                    table th, table td {
                        padding: 10px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    table th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                    }
                `})]}),e.jsx(N,{})]})};export{U as default};
