import React, { useState, useRef, useEffect } from 'react';

const BlockchainStandardsModule = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [showAnswers, setShowAnswers] = useState(false);
    const [quizScores, setQuizScores] = useState({});
    const [userAnswers, setUserAnswers] = useState({});
    const [completedSections, setCompletedSections] = useState(new Set());
    const [finalScore, setFinalScore] = useState(null);
    const contentRef = useRef(null);

    const sections = [
        {
            id: 'intro',
            title: 'Introduction & Learning Objectives',
            type: 'content',
            content: (
                <div>
                    <h2>Standards, Patterns, and Composability in Blockchain</h2>
                    <p className="abstract"><strong>Abstract:</strong> This chapter synthesizes token standards (ERC-20, ERC-721, ERC-1155), access control patterns, and composability design principles into a cohesive framework for secure, scalable blockchain systems. We emphasize what standards guarantee versus what they do not, dissect access control tradeoffs, and expose composability risks with practical mitigations. Through hands-on labs and real-world case studies, learners progressing from beginner to advanced will understand how to architect systems that are functionally correct, economically sound, and resilient to common failure modes.</p>

                    <h3>Learning Objectives</h3>
                    <ul>
                        <li>Articulate the guarantees and non-guarantees of ERC-20, ERC-721, and ERC-1155 standards.</li>
                        <li>Design and implement role-based access control with least-privilege principles.</li>
                        <li>Identify and mitigate composability risks including reentrancy, callback hazards, and dependency coupling.</li>
                        <li>Apply industry patterns (e.g., Checks-Effects-Interactions, reentrancy guards, function selectors) to real systems.</li>
                        <li>Evaluate tradeoffs between owner-based and role-based control and between monolithic and modular architectures.</li>
                    </ul>

                    <h3>Prerequisites</h3>
                    <ul>
                        <li>Familiarity with blockchain basics (transactions, accounts, smart contracts).</li>
                        <li>Working knowledge of Solidity (functions, state, events, inheritance).</li>
                        <li>Understanding of access control and permission models (Unix-style, capability systems).</li>
                    </ul>

                    <h3>Key Terms</h3>
                    <ul>
                        <li><strong>Token Standard:</strong> A specification defining required interfaces and behaviors for fungible or non-fungible assets.</li>
                        <li><strong>Least Privilege:</strong> A security principle limiting actors to the minimum permissions needed for their role.</li>
                        <li><strong>Composability:</strong> The ability to combine independent components; in blockchain, a feature enabling rich DeFi but also introducing risk.</li>
                        <li><strong>Reentrancy:</strong> A callback hazard where an external call invokes code that re-enters the calling contract before the first call completes.</li>
                        <li><strong>Non-guarantee:</strong> A property or behavior not enforced by a standard, leaving it to implementers and users.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'erc20',
            title: '1. ERC-20: Fungible Tokens',
            type: 'content',
            content: (
                <div>
                    <h3>1.1 Standard Overview</h3>
                    <p>ERC-20 is the most widely adopted Ethereum token standard. It defines a minimal interface for fungible (interchangeable) assets. Any ERC-20 token can be transferred, approved, and managed by the same tooling and contracts that recognize the standard.</p>

                    <h4>Required Interface</h4>
                    <pre className="codeblock">{`// ERC-20 Core Interface
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
}`}</pre>

                    <h3>1.2 What ERC-20 Guarantees</h3>
                    <ul>
                        <li><strong>Interface compliance:</strong> A contract implementing ERC-20 will emit Transfer on moves and Approval on allowance changes.</li>
                        <li><strong>Predictable ABI:</strong> Tooling can interact with any ERC-20 without custom ABIs.</li>
                        <li><strong>Balance tracking:</strong> The standard assumes a mapping from address to balance; transfers update balances.</li>
                        <li><strong>Allowance mechanism:</strong> Enables delegation: owner approves a spender to transfer on their behalf.</li>
                    </ul>

                    <h3>1.3 What ERC-20 Does NOT Guarantee</h3>
                    <ul>
                        <li><strong>Economic scarcity:</strong> The standard does not enforce a cap or limit on supply. A contract could mint infinite tokens.</li>
                        <li><strong>Immutability of decimals or name:</strong> These metadata fields can be changed or omitted.</li>
                        <li><strong>Accuracy of balanceOf:</strong> A buggy or malicious implementation could return incorrect balances.</li>
                        <li><strong>Prevention of double-spends within a block:</strong> Reentrancy or logic bugs can cause the same tokens to be spent multiple times in a single transaction.</li>
                        <li><strong>Atomicity across multiple transfers:</strong> If a contract issues two transfers, one might succeed and one fail, leaving the system in an inconsistent state.</li>
                        <li><strong>Reversal or pause capability:</strong> The standard does not mandate pause functions or the ability to reverse transactions.</li>
                    </ul>

                    <div className="callout">
                        <strong>Key Takeaway:</strong> ERC-20 is a <em>minimal</em> standard. Its job is to define interfaces so wallets and contracts can recognize and move tokens. It explicitly does not solve economic design, governance, or security. Those are the implementer's responsibility.
                    </div>

                    <h3>1.4 Example: Minimal ERC-20 Implementation</h3>
                    <pre className="codeblock">{`pragma solidity ^0.8.0;

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
}`}</pre>

                    <h3>1.5 Common Pitfalls</h3>
                    <div className="callout pitfall">
                        <strong>Common Pitfall: Unbounded Mint.</strong> An ERC-20 contract might allow anyone (or the owner) to mint tokens without limit. This destroys scarcity. If governance or access control is weak, a compromised key can hyper-inflate the supply.
                    </div>

                    <div className="callout pitfall">
                        <strong>Common Pitfall: Approval Race Condition.</strong> If Alice approves Bob for 100 tokens, then later approves him for 50 tokens (to reduce his allowance), Bob could front-run the second approval and call transferFrom for 100 before the reduction takes effect, then call transferFrom again for 50 after, spending 150 total. Modern practice: use <code>increaseAllowance()</code> and <code>decreaseAllowance()</code> instead.
                    </div>

                    <h3>1.6 When to Use ERC-20</h3>
                    <ul>
                        <li>Fungible assets where units are interchangeable (currencies, voting tokens, utility tokens).</li>
                        <li>Need compatibility with existing wallets, exchanges, and DeFi protocols.</li>
                        <li>Governance tokens where voting power is proportional to balance.</li>
                    </ul>
                </div>
            ),
            quiz: [
                {
                    id: 'erc20_q1',
                    question: 'Which of the following is guaranteed by the ERC-20 standard?',
                    type: 'multiple-choice',
                    options: [
                        'A limited, immutable total supply',
                        'Emission of Transfer and Approval events for state-changing operations',
                        'Prevention of reentrancy attacks',
                        'Immutability of decimals and name metadata'
                    ],
                    correctAnswer: 1,
                    explanation: 'ERC-20 specifies that Transfer and Approval events must be emitted. It does not enforce supply limits, prevent reentrancy, or guarantee metadata immutability.'
                },
                {
                    id: 'erc20_q2',
                    question: 'What is a non-guarantee of ERC-20?',
                    type: 'multi-select',
                    options: [
                        'The standard interface will be present',
                        'Economic scarcity of the token',
                        'Accuracy of balanceOf reports',
                        'Proper initialization of totalSupply'
                    ],
                    correctAnswers: [1, 2],
                    explanation: 'Non-guarantees include economic design (supply caps, deflation) and correctness of implementations. Accuracy of balanceOf and totalSupply are implementation-specific and can be buggy or malicious.'
                }
            ]
        },
        {
            id: 'erc721',
            title: '2. ERC-721: Non-Fungible Tokens',
            type: 'content',
            content: (
                <div>
                    <h3>2.1 Standard Overview</h3>
                    <p>ERC-721 defines fungible assets that are <em>unique</em>. Each token has a distinct identity (tokenId) and metadata. Common use cases: collectibles, digital art, game items, domain names.</p>

                    <h4>Required Interface</h4>
                    <pre className="codeblock">{`interface IERC721 {
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
}`}</pre>

                    <h3>2.2 What ERC-721 Guarantees</h3>
                    <ul>
                        <li><strong>Unique ownership:</strong> Each tokenId is owned by at most one address at a time.</li>
                        <li><strong>Transfer events:</strong> Transfers emit Transfer events for tracking and indexing.</li>
                        <li><strong>Approval mechanism:</strong> Owners can approve a single address per token, or an operator for all their tokens.</li>
                        <li><strong>Safe transfer callback:</strong> safeTransferFrom will invoke onERC721Received on recipient contracts, enabling "pull" semantics.</li>
                    </ul>

                    <h3>2.3 What ERC-721 Does NOT Guarantee</h3>
                    <ul>
                        <li><strong>Metadata truthfulness:</strong> The standard does not enforce that a URI points to valid, immutable, or authentic metadata.</li>
                        <li><strong>Uniqueness of tokenId across contracts:</strong> Multiple ERC-721 contracts can mint tokenId 1. Uniqueness is per-contract.</li>
                        <li><strong>Immutability of token attributes:</strong> A contract can update tokenURI or other properties after minting.</li>
                        <li><strong>Creator, royalty, or ownership history:</strong> The standard does not track who minted a token or legacy of ownership.</li>
                        <li><strong>Prevention of duplicate mints:</strong> A buggy contract might mint the same tokenId twice.</li>
                        <li><strong>Enumeration of all tokens:</strong> The core ERC-721 does not require a way to list all tokens; only the optional extension (ERC-721Enumerable) adds this.</li>
                    </ul>

                    <div className="callout">
                        <strong>Key Takeaway:</strong> ERC-721 standardizes the <em>transfer mechanism</em> and <em>ownership registry</em>, not the semantics or authenticity of what the token represents. A valid ERC-721 NFT could point to any metadata, including false, misleading, or mutable claims.
                    </div>

                    <h3>2.4 Common Pitfalls</h3>
                    <div className="callout pitfall">
                        <strong>Common Pitfall: Metadata Centralization and Mutability.</strong> If a contract's tokenURI points to a mutable server or database (e.g., "https://api.site.com/nft/123"), the issuer can change what the NFT "is" by editing that endpoint. This breaks immutability assumptions. Consider pinning metadata to IPFS or using on-chain storage.
                    </div>

                    <div className="callout pitfall">
                        <strong>Common Pitfall: Missing onERC721Received Check.</strong> If a contract uses transferFrom instead of safeTransferFrom, it will not validate that the recipient can handle NFTs. Tokens can be sent to contracts with no on-ramp to retrieve them, permanently locking them.
                    </div>

                    <h3>2.5 When to Use ERC-721</h3>
                    <ul>
                        <li>Unique digital assets: art, collectibles, certificates of authenticity.</li>
                        <li>Game items where each instance has distinct properties.</li>
                        <li>Domain names or namespace registries.</li>
                        <li>Bounded membership tokens (where total supply is limited and each instance is distinct).</li>
                    </ul>

                    <h3>2.6 ERC-721 Extensions</h3>
                    <p><strong>ERC-721Enumerable:</strong> Adds the ability to list all tokens and their owners. Useful for UIs and off-chain indexing, but adds gas cost.</p>
                    <p><strong>ERC-721Metadata:</strong> Standardizes name(), symbol(), and tokenURI(). Widely supported by marketplaces.</p>
                </div>
            ),
            quiz: [
                {
                    id: 'erc721_q1',
                    question: 'What is NOT guaranteed by ERC-721?',
                    type: 'multiple-choice',
                    options: [
                        'Each tokenId has a unique owner',
                        'Transfer events are emitted',
                        'Metadata at tokenURI is immutable and truthful',
                        'Safe transfer callbacks invoke onERC721Received'
                    ],
                    correctAnswer: 2,
                    explanation: 'ERC-721 does not enforce metadata immutability or truthfulness. A contract can change tokenURI or point to mutable data. Metadata authenticity is not part of the standard.'
                }
            ]
        },
        {
            id: 'erc1155',
            title: '3. ERC-1155: Multi-Token Standard',
            type: 'content',
            content: (
                <div>
                    <h3>3.1 Standard Overview</h3>
                    <p>ERC-1155 combines the flexibility of ERC-20 (many fungible tokens) and ERC-721 (uniqueness and metadata). A single contract can manage both fungible and non-fungible tokens. Each token has an id, and each id can exist in multiple copies (if fungible) or singular (if non-fungible).</p>

                    <h4>Core Interface</h4>
                    <pre className="codeblock">{`interface IERC1155 {
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
}`}</pre>

                    <h3>3.2 What ERC-1155 Guarantees</h3>
                    <ul>
                        <li><strong>Unified interface:</strong> One contract manages multiple token types (id-based).</li>
                        <li><strong>Fungibility per id:</strong> An id can represent a fungible asset (e.g., 1000 copies) or non-fungible (only one copy exists).</li>
                        <li><strong>Batch operations:</strong> safeBatchTransferFrom enables efficient multi-token transfers in one transaction.</li>
                        <li><strong>Operator approval:</strong> An address can approve an operator for all its tokens of any id.</li>
                    </ul>

                    <h3>3.3 What ERC-1155 Does NOT Guarantee</h3>
                    <ul>
                        <li><strong>Supply semantics:</strong> The standard does not enforce whether an id has a max supply, is capped, or is infinite.</li>
                        <li><strong>Metadata structure:</strong> uri(id) returns a URI but does not dictate format or immutability.</li>
                        <li><strong>Enumeration:</strong> No standard way to list all ids or all holders of an id without custom indexing.</li>
                        <li><strong>Atomicity of batch operations:</strong> A safeBatchTransferFrom might partially succeed, leaving inconsistent state if the receiving contract rejects some ids.</li>
                    </ul>

                    <div className="callout">
                        <strong>Key Takeaway:</strong> ERC-1155 is a <em>flexible</em> standard that unifies fungible and non-fungible assets. However, flexibility introduces design choices left to the implementer: supply caps, metadata schemes, and batch behavior are not constrained.
                    </div>

                    <h3>3.4 When to Use ERC-1155</h3>
                    <ul>
                        <li>Games with both fungible currency and unique items in the same contract.</li>
                        <li>DeFi protocols managing multiple collateral types.</li>
                        <li>Marketplaces bundling heterogeneous assets (e.g., "crafting bundle").</li>
                        <li>Efficiency gains: batch operations reduce transaction count.</li>
                    </ul>

                    <h3>3.5 ERC-1155 vs. ERC-721 vs. ERC-20</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #333' }}>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
                                <th style={{ textAlign: 'left', padding: '8px' }}>ERC-20</th>
                                <th style={{ textAlign: 'left', padding: '8px' }}>ERC-721</th>
                                <th style={{ textAlign: 'left', padding: '8px' }}>ERC-1155</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Fungible</td>
                                <td style={{ padding: '8px' }}>Yes</td>
                                <td style={{ padding: '8px' }}>No</td>
                                <td style={{ padding: '8px' }}>Both</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Unique Assets</td>
                                <td style={{ padding: '8px' }}>No</td>
                                <td style={{ padding: '8px' }}>Yes</td>
                                <td style={{ padding: '8px' }}>Yes</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Metadata</td>
                                <td style={{ padding: '8px' }}>None</td>
                                <td style={{ padding: '8px' }}>Per token</td>
                                <td style={{ padding: '8px' }}>Per id</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Batch Transfer</td>
                                <td style={{ padding: '8px' }}>No</td>
                                <td style={{ padding: '8px' }}>No</td>
                                <td style={{ padding: '8px' }}>Yes</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px' }}>Exchangeability</td>
                                <td style={{ padding: '8px' }}>Universal</td>
                                <td style={{ padding: '8px' }}>Limited</td>
                                <td style={{ padding: '8px' }}>Per contract</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ),
            quiz: [
                {
                    id: 'erc1155_q1',
                    question: 'Which scenario is best suited for ERC-1155?',
                    type: 'multiple-choice',
                    options: [
                        'A purely fungible token like a stablecoin',
                        'Unique digital art with 1 copy each',
                        'A game managing both fungible currency and unique NFT items in one contract',
                        'A simple one-owner key-value registry'
                    ],
                    correctAnswer: 2,
                    explanation: 'ERC-1155 excels at mixed scenarios where you need both fungible and non-fungible tokens. Its batch operations and unified interface make it ideal for games and complex ecosystems.'
                }
            ]
        },
        {
            id: 'access-control',
            title: '4. Access Control Patterns & Least Privilege',
            type: 'content',
            content: (
                <div>
                    <h3>4.1 Owner-Based Control (Monolithic)</h3>
                    <p>The simplest access control: one owner address can perform all privileged operations (mint, pause, update settings). This is often a single key or multisig.</p>

                    <pre className="codeblock">{`contract SimpleToken {
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
}`}</pre>

                    <div className="callout pitfall">
                        <strong>Common Pitfall: God-Mode Admin.</strong> When one address has all permissions (mint, pause, transfer, upgrade), a compromised key compromises the entire system. There's no separation of duties, no rate-limiting, and no opportunity for a second opinion.
                    </div>

                    <h3>4.2 Role-Based Control (Least Privilege)</h3>
                    <p>Instead of one owner, define granular roles. Each role grants only the permissions needed for that function. OpenZeppelin's AccessControl is the reference implementation.</p>

                    <pre className="codeblock">{`import "@openzeppelin/contracts/access/AccessControl.sol";

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
}`}</pre>

                    <h4>Key Principles</h4>
                    <ul>
                        <li><strong>Separation of Duties:</strong> Different keys hold different roles. Minting is separate from pausing, which is separate from governance.</li>
                        <li><strong>Capability Minimization:</strong> A key for "minting" should not also have "pause" or "upgrade" rights.</li>
                        <li><strong>Time Locks:</strong> Sensitive operations (e.g., changing admin, setting fees) can be delayed by a timelock contract, allowing users to exit if they disagree.</li>
                        <li><strong>Multi-Signature Controls:</strong> Use a multisig for admin roles, e.g., 3-of-5 governance members must approve critical changes.</li>
                    </ul>

                    <h3>4.3 Emergency Controls & Fail-Safe Defaults</h3>
                    <ul>
                        <li><strong>Pause Function:</strong> Allows an authorized role to halt transfers, minting, etc., in response to a discovered exploit.</li>
                        <li><strong>Circuit Breakers:</strong> Automatically pause if abnormal behavior is detected (e.g., flash loan spike).</li>
                        <li><strong>Rate Limits:</strong> Restrict the rate of sensitive operations (e.g., max mint per block).</li>
                        <li><strong>Allowlists:</strong> Start with no one being able to do X, then selectively grant permission. Safer than blacklists.</li>
                    </ul>

                    <h3>4.4 Admin Rotation & Revocation</h3>
                    <p>To reduce single-point-of-failure risk:</p>
                    <ul>
                        <li><strong>Rotate keys:</strong> Periodically change which address holds a role.</li>
                        <li><strong>Revocation mechanism:</strong> A governance process to revoke compromised or malicious admins.</li>
                        <li><strong>Two-step role transfer:</strong> Instead of directly assigning a role, nominate then confirm in a second transaction. This prevents accidental transfers to wrong addresses.</li>
                    </ul>

                    <div className="callout">
                        <strong>Key Takeaway:</strong> Least privilege is a <em>design principle</em> that reduces blast radius. If a minting key is compromised, only minting is at risk, not pausing or governance. Use role-based control and minimize overlap of permissions.
                    </div>

                    <h3>4.5 Common Pitfalls</h3>
                    <div className="callout pitfall">
                        <strong>Overbroad Roles:</strong> Defining a role like "MAINTAINER" that includes minting, pausing, and metadata updates defeats the purpose. Break it into finer-grained roles.
                    </div>

                    <div className="callout pitfall">
                        <strong>Missing Revocation:</strong> If a role can be granted but never revoked (no renounceRole or revokeRole), a malicious or compromised key holder keeps their power forever.
                    </div>

                    <div className="callout pitfall">
                        <strong>Admin Centralization:</strong> Even with role separation, if the admin role (which grants and revokes other roles) is a single key, you've just moved the problem up one level. Use governance or multisig for admin.
                    </div>
                </div>
            ),
            quiz: [
                {
                    id: 'ac_q1',
                    question: 'Which best describes "least privilege"?',
                    type: 'multiple-choice',
                    options: [
                        'All users have equal permissions',
                        'Each role gets only the minimum permissions needed for its function',
                        'The admin has all permissions',
                        'No one can change permissions'
                    ],
                    correctAnswer: 1,
                    explanation: 'Least privilege means granting each actor only the permissions they need. A minter role should not include pause or governance rights.'
                },
                {
                    id: 'ac_q2',
                    question: 'What is a benefit of role-based control over simple owner-based control?',
                    type: 'multiple-choice',
                    options: [
                        'It eliminates the need for audits',
                        'It separates duties and reduces blast radius if a key is compromised',
                        'It automatically prevents all hacks',
                        'It reduces gas costs'
                    ],
                    correctAnswer: 1,
                    explanation: 'Role-based control isolates permissions. A compromised minting key does not give access to pausing or governance. Blast radius is minimized.'
                }
            ]
        },
        {
            id: 'composability',
            title: '5. Composability: Feature and Risk',
            type: 'content',
            content: (
                <div>
                    <h3>5.1 Composability as a Feature</h3>
                    <p>Composability is the ability to combine independent building blocks. A DeFi protocol can compose with any ERC-20 token, a lending pool can compose with an oracle, a DEX can compose with a token and a pricing mechanism. This creates rich functionality with minimal duplication.</p>

                    <p><strong>Example:</strong> A user can deposit USDC into Compound (lending protocol), which automatically lends it out and earns interest. The user can then wrap cUSDC (Compound's receipt token) and use it as collateral elsewhere. Each protocol trusts the interface but not the internals of others.</p>

                    <h3>5.2 Composability as a Risk: External Calls</h3>
                    <p>Every external call is a potential trust assumption. When your contract calls another contract, you:</p>
                    <ul>
                        <li>Trust that the callee will execute as expected.</li>
                        <li>Cede control: the callee can do anything until it returns.</li>
                        <li>Risk reentrancy: the callee can call back into your contract before your first call finishes.</li>
                    </ul>

                    <h3>5.3 Reentrancy: The Callback Hazard</h3>
                    <p>A classic reentrancy attack exploits the flow of control:</p>

                    <pre className="codeblock">{`// Vulnerable: Checks-Effect-Interaction (wrong order)
contract Vault {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount;  // <-- Updated AFTER external call!
    }
}`}</pre>

                    <p>An attacker with a malicious contract can:</p>
                    <ol>
                        <li>Call withdraw(100).</li>
                        <li>The Vault sends 100 ETH via call().</li>
                        <li>Inside the fallback function, the attacker calls withdraw(100) again.</li>
                        <li>The Vault checks balances[attacker] (still 100, not yet decremented), so the check passes.</li>
                        <li>The Vault sends another 100 ETH.</li>
                        <li>This repeats until the contract runs out of funds.</li>
                    </ol>

                    <div className="callout pitfall">
                        <strong>Common Pitfall: Reentrancy.</strong> A contract can be drained by repeatedly calling a function before internal state is updated. Use Checks-Effects-Interactions (CEI) pattern: check conditions, update state, then call external functions.
                    </div>

                    <h3>5.4 Mitigations: Checks-Effects-Interactions (CEI)</h3>

                    <pre className="codeblock">{`// Correct: Checks-Effects-Interactions (correct order)
function withdraw(uint256 amount) external {
    // 1. CHECKS
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // 2. EFFECTS
    balances[msg.sender] -= amount;
    
    // 3. INTERACTIONS
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}`}</pre>

                    <p>Now if the attacker re-enters, the balance has already been decremented, so the second check fails.</p>

                    <h3>5.5 Reentrancy Guards</h3>
                    <p>An additional layer: a flag that prevents re-entry.</p>

                    <pre className="codeblock">{`import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeVault is ReentrancyGuard {
    function withdraw(uint256 amount) external nonReentrant {
        // Re-entry is blocked during this call
    }
}`}</pre>

                    <h3>5.6 Pull vs. Push Patterns</h3>
                    <p><strong>Push Pattern (you send):</strong> The contract directly transfersTo() the user. Risk: if the user's address is a contract with a malicious fallback, reentrancy occurs. Also, a large transfer might fail, halting the entire transaction.</p>

                    <pre className="codeblock">{`// PUSH: Contract sends to users
function distributeRewards() external {
    for (uint i = 0; i < recipients.length; i++) {
        token.transfer(recipients[i], amounts[i]);  // Risk: one failure halts all
    }
}`}</pre>

                    <p><strong>Pull Pattern (users withdraw):</strong> The contract records how much each user can claim, and users call a withdraw function to pull their funds. If one user's withdrawal fails, others are not affected.</p>

                    <pre className="codeblock">{`// PULL: Users withdraw themselves
function claimRewards(uint256 amount) external nonReentrant {
    require(rewards[msg.sender] >= amount, "Insufficient rewards");
    rewards[msg.sender] -= amount;
    token.transfer(msg.sender, amount);
}`}</pre>

                    <div className="callout">
                        <strong>Key Takeaway:</strong> Pull patterns are safer: they isolate per-user risk and avoid reentrancy during a mass distribution. Use pull when possible; if you must use push, use reentrancy guards and follow CEI.
                    </div>

                    <h3>5.7 Approvals and Front-Running</h3>
                    <p>When a contract approves a spender to use its tokens, the spender can call transferFrom up to the approved amount. But front-running can occur:</p>

                    <ul>
                        <li>Alice approves Bob for 100 USDC, then approves him for 50 USDC (reducing his allowance).</li>
                        <li>Bob sees the reduce transaction in the mempool and front-runs it with transferFrom(100).</li>
                        <li>Bob's transferFrom processes first (spending 100), then the approve(50) processed, leaving Bob with 50 more allowance.</li>
                        <li>Bob can then call transferFrom(50).</li>
                    </ul>

                    <p><strong>Mitigation:</strong> Use increaseAllowance() and decreaseAllowance() instead of setting an absolute amount.</p>

                    <h3>5.8 Dependency Coupling: Trust and Assumptions</h3>
                    <p>When your contract integrates with another (e.g., a DEX, an oracle, a token), you inherit their risk profile:</p>

                    <ul>
                        <li><strong>Oracle Risk:</strong> If you fetch prices from a centralized oracle, a stale or manipulated price breaks your system.</li>
                        <li><strong>Token Contract Risk:</strong> If you use an ERC-20, you must trust its transfer() implementation. A buggy or malicious token can steal your funds.</li>
                        <li><strong>Upgradeability Coupling:</strong> If you depend on a contract that can be upgraded via a proxy, the new version might break compatibility or steal funds.</li>
                    </ul>

                    <h3>5.9 Interface Boundaries & Try-Catch</h3>
                    <p>To isolate risk and prevent one failure from halting the whole transaction, use try-catch around external calls:</p>

                    <pre className="codeblock">{`function transferTokens(address token, address to, uint256 amount) external {
    try IERC20(token).transfer(to, amount) returns (bool success) {
        require(success, "Transfer returned false");
    } catch {
        // Handle failure gracefully
        emit TransferFailed(token, to, amount);
    }
}`}</pre>

                    <h3>5.10 Allowlists and Opt-In Risk</h3>
                    <p>Instead of trusting all external contracts, use an allowlist of vetted dependencies:</p>

                    <ul>
                        <li>Only accept specific token addresses.</li>
                        <li>Only call specific oracles.</li>
                        <li>Disable composability with untrusted contracts.</li>
                    </ul>

                    <h3>5.11 Pausing and Circuit Breakers</h3>
                    <p>If a composability risk is discovered (e.g., a token contract was hacked), pause operations immediately:</p>

                    <pre className="codeblock">{`contract RiskyComposition {
    bool public paused;
    
    function setPaused(bool p) external onlyRole(PAUSER_ROLE) {
        paused = p;
    }
    
    function interact(address external_contract) external {
        require(!paused, "System is paused");
        // Interact
    }
}`}</pre>

                    <h3>5.12 Invariant Thinking</h3>
                    <p>Define the invariants your system must maintain despite external calls and reentrancy:</p>

                    <ul>
                        <li><strong>Invariant:</strong> balances[user] + rewards[user] == total owed to user.</li>
                        <li><strong>Invariant:</strong> sum of all balances == token balance of contract.</li>
                        <li><strong>After every external call, re-check invariants.</strong> If they are violated, revert.</li>
                    </ul>

                    <div className="callout pitfall">
                        <strong>Common Pitfall: Callback Hazards with ERC-721.</strong> safeTransferFrom calls onERC721Received on the recipient, which can re-enter the contract. If not protected by nonReentrant, an attacker can:
                        <ol style={{ marginLeft: '20px' }}>
                            <li>Receive an NFT in onERC721Received.</li>
                            <li>Re-enter the contract to transfer another NFT or burn it.</li>
                            <li>Accomplish actions that should not be available mid-transfer.</li>
                        </ol>
                    </div>
                </div>
            ),
            quiz: [
                {
                    id: 'comp_q1',
                    question: 'Which order is correct in the Checks-Effects-Interactions pattern?',
                    type: 'multiple-choice',
                    options: [
                        'Interactions, Effects, Checks',
                        'Checks, Interactions, Effects',
                        'Checks, Effects, Interactions',
                        'Effects, Checks, Interactions'
                    ],
                    correctAnswer: 2,
                    explanation: 'CEI order: first verify conditions (Checks), then update internal state (Effects), then call external functions (Interactions). This prevents reentrancy.'
                },
                {
                    id: 'comp_q2',
                    question: 'What is an advantage of the pull pattern over the push pattern?',
                    type: 'multiple-choice',
                    options: [
                        'It always costs less gas',
                        'It isolates per-user risk and avoids reentrancy in distributions',
                        'It guarantees that all users receive funds',
                        'It eliminates the need for access control'
                    ],
                    correctAnswer: 1,
                    explanation: "Pull pattern isolates risk: if one user's withdrawal fails or reenters, other users can still withdraw. Push pattern risks one failure halting the entire distribution."
                },
                {
                    id: 'comp_q3',
                    question: 'Which is a non-guarantee of composability?',
                    type: 'multiple-choice',
                    options: [
                        'External contracts will behave as expected',
                        'Multiple contracts can be combined safely',
                        'The interface is standardized',
                        'Oracles will always return accurate prices'
                    ],
                    correctAnswer: 3,
                    explanation: 'Composability does not guarantee correctness of external data sources or the reliability of called contracts. You must audit and validate external dependencies.'
                }
            ]
        },
        {
            id: 'case-study',
            title: '6. Case Study: Token + Marketplace + Escrow',
            type: 'content',
            content: (
                <div>
                    <h3>6.1 Scenario</h3>
                    <p>A user (Alice) wants to sell an ERC-721 NFT to another user (Bob). The NFT is on contract NFTContract, and they trade for 100 USDC. To prevent cheating:</p>
                    <ul>
                        <li>Alice does not want to transfer the NFT until she receives USDC.</li>
                        <li>Bob does not want to transfer USDC until he receives the NFT.</li>
                    </ul>
                    <p>Solution: an Escrow contract holds both assets and releases them atomically only if both parties agree.</p>

                    <h3>6.2 Architecture</h3>
                    <pre className="codeblock">{`contract Escrow {
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
}`}</pre>

                    <h3>6.3 Composability Risks in This System</h3>
                    <ul>
                        <li><strong>NFT Contract Risk:</strong> If nftContract is malicious, its safeTransferFrom could reenters the Escrow contract during onERC721Received callback.</li>
                        <li><strong>USDC Risk:</strong> If USDC is hacked or behaves unexpectedly, transfers might fail or revert mid-settlement.</li>
                        <li><strong>Escrow contract vulnerability:</strong> The settle() function performs two transfers. If the first succeeds and the second fails, the system is inconsistent.</li>
                    </ul>

                    <h3>6.4 Mitigations</h3>
                    <ul>
                        <li><strong>Reentrancy Guard:</strong> Add nonReentrant to depositNFT and settle.</li>
                        <li><strong>Order of operations:</strong> Perform internal state updates (e.g., delete deals[dealId]) before external calls.</li>
                        <li><strong>Allowlist:</strong> Only accept specific NFT and USDC contracts.</li>
                        <li><strong>Pause function:</strong> If a token contract is found to be malicious, pause the escrow.</li>
                        <li><strong>Fallback logic:</strong> If settle fails, provide a claim function for participants to recover their assets.</li>
                    </ul>

                    <h3>6.5 Improved Version</h3>
                    <pre className="codeblock">{`import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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
}`}</pre>

                    <div className="callout">
                        <strong>Key Takeaway:</strong> In a multi-contract system, isolate risks with reentrancy guards, follow CEI, and always provide fallback paths. One failed external call should not leave the system in an inconsistent state.
                    </div>
                </div>
            ),
            quiz: [
                {
                    id: 'cs_q1',
                    question: 'In the Escrow case study, why could reentrancy be a risk?',
                    type: 'multiple-choice',
                    options: [
                        'The escrow contract is not an ERC-721',
                        'An NFT contract could re-enter during safeTransferFrom callback',
                        'USDC cannot be reentered',
                        'Reentrancy can never happen in escrow contracts'
                    ],
                    correctAnswer: 1,
                    explanation: 'safeTransferFrom calls onERC721Received on the recipient (the Escrow contract), which can reenters the contract, potentially calling settle() again or other functions during the callback.'
                }
            ]
        },
        {
            id: 'lab',
            title: '7. Hands-On Lab: Implement a Token with RBAC',
            type: 'content',
            content: (
                <div>
                    <h3>7.1 Objective</h3>
                    <p>Build an ERC-20 token with role-based access control (RBAC) using OpenZeppelin patterns. The token should:</p>
                    <ul>
                        <li>Follow the ERC-20 standard (interface compliance, events).</li>
                        <li>Support role-based minting (only MINTER_ROLE can mint).</li>
                        <li>Support role-based pausing (only PAUSER_ROLE can pause).</li>
                        <li>Prevent transfers when paused.</li>
                        <li>Use ReentrancyGuard for _beforeTokenTransfer hooks.</li>
                    </ul>

                    <h3>7.2 Starter Code</h3>
                    <pre className="codeblock">{`pragma solidity ^0.8.0;


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
}`}</pre>

                    <h3>7.3 Step-by-Step Instructions</h3>
                    <ol>
                        <li><strong>Inherit from ERC20, AccessControl, Pausable.</strong> These provide the base functionality.</li>
                        <li><strong>Define roles:</strong> MINTER_ROLE, PAUSER_ROLE, and DEFAULT_ADMIN_ROLE (inherited).</li>
                        <li><strong>In constructor:</strong> Grant yourself all roles initially. In production, this should be a governance contract.</li>
                        <li><strong>Implement mint():</strong> Only MINTER_ROLE can call; emit TokenMinted event.</li>
                        <li><strong>Implement pause/unpause():</strong> Only PAUSER_ROLE can call.</li>
                        <li><strong>Override _beforeTokenTransfer():</strong> Check whenNotPaused to prevent transfers when paused.</li>
                        <li><strong>Add reentrancy guard:</strong> Protect mint() and burn() with nonReentrant.</li>
                    </ol>

                    <h3>7.4 Testing Checklist</h3>
                    <ul>
                        <li>Deploy the contract. Verify initial supply is 0.</li>
                        <li>Call mint(alice, 1000). Verify alice's balance is 1000.</li>
                        <li>Call transfer(bob, 100) from alice. Verify bob receives 100.</li>
                        <li>Call pause(). Attempt to transfer → should revert with "Pausable: paused".</li>
                        <li>Call unpause(). Transfer should work again.</li>
                        <li>Call burn(500). Verify balance decreases.</li>
                        <li>Test access control: attempt to mint as a non-MINTER → should revert "AccessControl: account 0x... is missing role...".</li>
                    </ul>

                    <h3>7.5 Advanced Challenges</h3>
                    <div className="callout">
                        <strong>Challenge 1: Mint Cap.</strong> Add a maxSupply variable. Prevent minting beyond this cap. Emit MintCapExceeded if exceeded.
                    </div>

                    <div className="callout">
                        <strong>Challenge 2: Role Timelock.</strong> When admin revokes a role, enforce a 2-day delay before the revocation takes effect. This allows users to exit if they disagree with governance.
                    </div>

                    <div className="callout">
                        <strong>Challenge 3: Multi-Sig Admin.</strong> Instead of a single address as admin, use a multisig contract (e.g., 3-of-5 signers) to approve critical changes (role grants, revokes).
                    </div>

                    <div className="callout">
                        <strong>Challenge 4: Integrate with a DEX.</strong> Deploy your token and a simple Uniswap-like DEX (2 tokens, constant product formula). Verify that your token works with external contracts and that your pause function prevents DEX interactions.
                    </div>

                    <h3>7.6 Summary of Lab Takeaways</h3>
                    <ul>
                        <li>OpenZeppelin contracts are vetted and battle-tested. Use them as building blocks.</li>
                        <li>Role-based access control scales better than monolithic owner control.</li>
                        <li>Pausable is a critical emergency control for composed systems.</li>
                        <li>Reentrancy guards and CEI order protect against callback hazards.</li>
                        <li>Emit events for auditing; off-chain indexers depend on them.</li>
                    </ul>
                </div>
            ),
            quiz: [
                {
                    id: 'lab_q1',
                    question: 'In the SecureToken lab, what happens if you call transfer() while paused?',
                    type: 'multiple-choice',
                    options: [
                        'The transfer always succeeds',
                        'The transfer reverts with "Pausable: paused"',
                        'The transfer is delayed until unpause() is called',
                        'Pausing only affects minting, not transfers'
                    ],
                    correctAnswer: 1,
                    explanation: 'The _beforeTokenTransfer() override includes whenNotPaused, which reverts all token transfers when the contract is paused.'
                }
            ]
        },
        {
            id: 'summary',
            title: '8. Summary & Further Reading',
            type: 'content',
            content: (
                <div>
                    <h3>8.1 Key Takeaways</h3>
                    <ul>
                        <li><strong>Token standards (ERC-20, ERC-721, ERC-1155) define interfaces, not economic or security properties.</strong> Implementers must design supply, upgradability, and safety.</li>
                        <li><strong>Least privilege and role-based access control reduce blast radius.</strong> A god-mode admin is a single point of failure.</li>
                        <li><strong>Composability is powerful but risky.</strong> Every external call is a trust assumption. Use Checks-Effects-Interactions, reentrancy guards, and invariant thinking.</li>
                        <li><strong>Pull patterns isolate risk; push patterns are convenient but error-prone.</strong> Use pull for critical systems.</li>
                        <li><strong>Pause, allowlists, and circuit breakers are not "nice-to-have"; they are essential for production systems.</strong> They provide an emergency off-ramp when a composed dependency fails.</li>
                        <li><strong>Audit vetted libraries like OpenZeppelin.</strong> Don't reimplement access control or token standards; the cost of bugs is too high.</li>
                    </ul>

                    <h3>8.2 Threat Model Summary</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #333' }}>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Threat</th>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Mitigation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Reentrancy</td>
                                <td style={{ padding: '8px' }}>CEI pattern, nonReentrant guard</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>God-mode admin</td>
                                <td style={{ padding: '8px' }}>Role-based access control, least privilege</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Malicious external contract</td>
                                <td style={{ padding: '8px' }}>Allowlist, try-catch, pause</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Approval race condition</td>
                                <td style={{ padding: '8px' }}>increaseAllowance/decreaseAllowance</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Metadata mutability (NFT)</td>
                                <td style={{ padding: '8px' }}>Pin to IPFS or on-chain storage</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>Hyper-inflation</td>
                                <td style={{ padding: '8px' }}>Supply cap, MINTER_ROLE, governance</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px' }}>Oracle manipulation</td>
                                <td style={{ padding: '8px' }}>Multiple oracles, price bounds, circuit breaker</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>8.3 Further Reading</h3>
                    <ul>
                        <li><strong>EIP-20 (ERC-20):</strong> https://eips.ethereum.org/EIPS/eip-20 — Official token standard specification.</li>
                        <li><strong>EIP-721 (ERC-721):</strong> https://eips.ethereum.org/EIPS/eip-721 — Non-fungible token standard.</li>
                        <li><strong>EIP-1155:</strong> https://eips.ethereum.org/EIPS/eip-1155 — Multi-token standard.</li>
                        <li><strong>OpenZeppelin Contracts:</strong> https://docs.openzeppelin.com/ — Audited, production-grade implementations of standards and patterns.</li>
                        <li><strong>Solidity Docs on Security:</strong> https://docs.soliditylang.org/en/latest/security-considerations.html — Official guidance on reentrancy, call depth, and more.</li>
                        <li><strong>DeFi Security:</strong> Trail of Bits, Certora, and other auditors publish public reports detailing composability failures and mitigations.</li>
                    </ul>

                    <h3>8.4 Recommended Next Steps</h3>
                    <ol>
                        <li>Implement the lab (SecureToken with RBAC).</li>
                        <li>Write unit tests covering all roles, pausing, and edge cases.</li>
                        <li>Run a mainnet fork test to verify composability with a real DEX.</li>
                        <li>Read the OpenZeppelin source code for AccessControl and ReentrancyGuard; understand how they work.</li>
                        <li>Audit your own token contract using static tools (Slither) and manual review.</li>
                        <li>Study published exploits and case studies (e.g., the DAO, Parity Wallet, recent DEX hacks) to internalize why these patterns matter.</li>
                    </ol>

                    <div className="callout">
                        <strong>Final Thought:</strong> Standards and patterns exist because consensus is hard and security failures are expensive. By using vetted building blocks and applying proven patterns, you shift effort from reinventing the wheel to thoughtful architectural design. The goal is not perfection (impossible in a Turing-complete system), but rather a clear threat model, documented assumptions, and defense-in-depth mitigations.
                    </div>
                </div>
            ),
        },
        {
            id: 'final-assessment',
            title: 'Final Assessment',
            type: 'assessment',
            content: (
                <div>
                    <h3>Final Assessment: Comprehensive Exam</h3>
                    <p>Below are scenario-based and conceptual questions covering all major topics. Answer each honestly to identify weak areas and deepen understanding.</p>
                </div>
            ),
        }
    ];

    const assessmentQuestions = [
        {
            id: 'fa_q1',
            question: 'You are designing a token for a DAO. The token is used for voting and governance. Should you use ERC-20, ERC-721, or ERC-1155? Justify your choice.',
            type: 'short-answer',
            rubric: {
                correctPoints: 10,
                keyPoints: [
                    'ERC-20 is most appropriate',
                    'Fungible units allow one-token-one-vote easily',
                    'ERC-721 would be impractical (unique tokens, unequal voting)',
                    'ERC-1155 is overkill but could work if voting power varies by id'
                ]
            }
        },
        {
            id: 'fa_q2',
            question: 'Your token contract has three privileged functions: mint(), pause(), and upgrade(). You have three operations teams. How would you structure access control to enforce least privilege?',
            type: 'short-answer',
            rubric: {
                correctPoints: 10,
                keyPoints: [
                    'Define three separate roles: MINTER_ROLE, PAUSER_ROLE, UPGRADER_ROLE',
                    'Assign each team to one role (no overlaps)',
                    'Default admin or governance controls role grants/revokes',
                    'Mentions timelock or multisig for admin actions'
                ]
            }
        },
        {
            id: 'fa_q3',
            question: 'A contract has a function that calls an external token.transfer(). Before the transfer, the function updates internal state. After the transfer, it decrements a counter. Is this order vulnerable to reentrancy? Why or why not?',
            type: 'short-answer',
            rubric: {
                correctPoints: 10,
                keyPoints: [
                    'Yes, vulnerable',
                    'Problem: internal state is updated BEFORE the external call',
                    'If token contract re-enters before returning, the counter is not yet decremented',
                    'Correct order is: Checks, Update state, Then external call (CEI)'
                ]
            }
        },
        {
            id: 'fa_q4',
            question: 'An ERC-721 contract allows users to mint an NFT for 1 ETH. The metadata is stored at "https://api.nftsite.com/meta/[tokenId]". Is there a risk? How would you mitigate it?',
            type: 'short-answer',
            rubric: {
                correctPoints: 10,
                keyPoints: [
                    'Risk: metadata centralization; issuer can change what the NFT "is" anytime',
                    'Mitigations include: pin metadata to IPFS and store hash on-chain, or store metadata entirely on-chain',
                    'Immutability is critical for NFT authenticity and value'
                ]
            }
        },
        {
            id: 'fa_q5',
            question: 'Compare push and pull distribution patterns. Which is safer and why?',
            type: 'short-answer',
            rubric: {
                correctPoints: 10,
                keyPoints: [
                    'Pull is safer',
                    'Pull isolates per-user risk and avoids reentrancy',
                    'Push requires mass transfers in a loop; one failure halts all',
                    'Pull allows users to withdraw independently'
                ]
            }
        }
    ];

    const markSection = (sectionId) => {
        const newCompleted = new Set(completedSections);
        newCompleted.add(sectionId);
        setCompletedSections(newCompleted);
    };

    const handleQuizSubmit = (sectionId, questionId, answer) => {
        const key = `${sectionId}-${questionId}`;
        setUserAnswers({ ...userAnswers, [key]: answer });
    };

    const handleFinalAssessment = () => {
        let score = 0;
        assessmentQuestions.forEach((q) => {
            const key = `final-${q.id}`;
            const answer = userAnswers[key];
            if (answer && answer.trim().length > 0) {
                score += 5; // Partial credit for attempting
            }
        });
        setFinalScore(score);
    };

    const calculateProgress = () => {
        return ((completedSections.size / (sections.length - 2)) * 100).toFixed(0);
    };

    const getCurrentSection = () => {
        return sections[currentSection];
    };

    const renderSectionQuiz = (section) => {
        if (!section.quiz) return null;

        return (
            <div className="quiz-section">
                <h4>Knowledge Check: {section.title}</h4>
                {section.quiz.map((q, idx) => (
                    <div key={q.id} className="quiz-question" style={{ marginBottom: '20px' }}>
                        <p><strong>Q{idx + 1}: {q.question}</strong></p>
                        {q.type === 'multiple-choice' && (
                            <div>
                                {q.options.map((opt, optIdx) => (
                                    <label key={optIdx} style={{ display: 'block', marginBottom: '8px' }}>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={optIdx}
                                            onChange={(e) => handleQuizSubmit(section.id, q.id, parseInt(e.target.value))}
                                            checked={userAnswers[`${section.id}-${q.id}`] === optIdx}
                                        />
                                        {' '}{opt}
                                    </label>
                                ))}
                            </div>
                        )}
                        {q.type === 'multi-select' && (
                            <div>
                                {q.options.map((opt, optIdx) => (
                                    <label key={optIdx} style={{ display: 'block', marginBottom: '8px' }}>
                                        <input
                                            type="checkbox"
                                            name={q.id}
                                            value={optIdx}
                                            onChange={(e) => {
                                                const current = userAnswers[`${section.id}-${q.id}`] || [];
                                                const newCurrent = e.target.checked
                                                    ? [...current, optIdx]
                                                    : current.filter(v => v !== optIdx);
                                                handleQuizSubmit(section.id, q.id, newCurrent);
                                            }}
                                            checked={(userAnswers[`${section.id}-${q.id}`] || []).includes(optIdx)}
                                        />
                                        {' '}{opt}
                                    </label>
                                ))}
                            </div>
                        )}
                        {showAnswers && q.explanation && (
                            <div className="feedback" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                                <strong>Explanation:</strong> {q.explanation}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderFinalAssessment = () => {
        if (finalScore !== null) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <h3>Assessment Complete</h3>
                    <p><strong>Score: {finalScore} / {assessmentQuestions.length * 5} points</strong></p>
                    <p>Percentage: {((finalScore / (assessmentQuestions.length * 5)) * 100).toFixed(1)}%</p>
                    <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        Scores below 70% suggest reviewing: access control patterns, composability risks, and token standards non-guarantees.
                    </p>
                    <button
                        onClick={() => setFinalScore(null)}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Review Answers
                    </button>
                    <button
                        onClick={() => {
                            setCurrentSection(0);
                            setCompletedSections(new Set());
                            setUserAnswers({});
                            setFinalScore(null);
                        }}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Reset Module
                    </button>
                </div>
            );
        }

        return (
            <div>
                {assessmentQuestions.map((q, idx) => (
                    <div key={q.id} className="quiz-question" style={{ marginBottom: '20px' }}>
                        <p><strong>Q{idx + 1}: {q.question}</strong></p>
                        <textarea
                            value={userAnswers[`final-${q.id}`] || ''}
                            onChange={(e) => handleQuizSubmit('final', q.id, e.target.value)}
                            style={{
                                width: '100%',
                                height: '80px',
                                padding: '10px',
                                fontFamily: 'monospace',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                ))}
                <button
                    onClick={handleFinalAssessment}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Submit Assessment
                </button>
            </div>
        );
    };

    const current = getCurrentSection();

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#fafafa' }}>
            {/* Left Navigation */}
            <div style={{
                width: '250px',
                backgroundColor: '#1f1f1f',
                color: 'white',
                overflowY: 'auto',
                padding: '20px',
                position: 'fixed',
                height: '100vh',
                boxShadow: '2px 0 5px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>
                    Blockchain Standards
                </h2>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', color: '#aaa' }}>Progress: {calculateProgress()}%</label>
                    <div style={{
                        width: '100%',
                        backgroundColor: '#444',
                        borderRadius: '4px',
                        height: '8px',
                        marginTop: '5px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${calculateProgress()}%`,
                            height: '100%',
                            backgroundColor: '#4CAF50',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                </div>

                <div style={{ fontSize: '12px', marginBottom: '20px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                        />
                        {' '}<strong>Show Answers</strong> (Instructor Mode)
                    </label>
                </div>

                <nav>
                    {sections.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setCurrentSection(idx)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '12px',
                                margin: '5px 0',
                                backgroundColor: currentSection === idx ? '#4CAF50' : (completedSections.has(s.id) ? '#2196F3' : '#333'),
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '12px',
                                fontWeight: currentSection === idx ? 'bold' : 'normal'
                            }}
                            aria-current={currentSection === idx ? 'page' : undefined}
                        >
                            {completedSections.has(s.id) && '✓ '}{s.title}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={() => {
                        setCurrentSection(0);
                        setCompletedSections(new Set());
                        setUserAnswers({});
                        setFinalScore(null);
                    }}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px',
                        marginTop: '20px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    Reset Activity
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: '250px',
                flex: 1,
                padding: '40px',
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                <div ref={contentRef} style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {/* Initial intro section */}
                    {current.type === 'content' && (
                        <>
                            {current.content}
                            {current.quiz && renderSectionQuiz(current)}
                            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                <button
                                    onClick={() => {
                                        markSection(current.id);
                                        if (currentSection < sections.length - 1) {
                                            setCurrentSection(currentSection + 1);
                                        }
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    Mark Complete & Continue
                                </button>
                                {currentSection > 0 && (
                                    <button
                                        onClick={() => setCurrentSection(currentSection - 1)}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#2196F3',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Previous
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Assessment section */}
                    {current.type === 'assessment' && (
                        <>
                            {current.content}
                            {renderFinalAssessment()}
                        </>
                    )}
                </div>

                {/* Inline styled callout and code blocks */}
                <style>{`
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
                `}</style>
            </div>
        </div>
    );
};

export default BlockchainStandardsModule;