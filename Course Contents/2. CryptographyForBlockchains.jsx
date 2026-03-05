import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:5px;background:#090610;}
  ::-webkit-scrollbar-thumb{background:#301e50;border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
  @keyframes hashReveal{from{opacity:0;letter-spacing:0.3em;filter:blur(3px)}to{opacity:1;letter-spacing:0.06em;filter:blur(0)}}
  @keyframes sealGlow{0%,100%{box-shadow:0 0 0 0 rgba(220,100,130,0)}50%{box-shadow:0 0 0 8px rgba(220,100,130,0.12)}}
  @keyframes diffPulse{0%,100%{background:rgba(220,100,130,0.25)}50%{background:rgba(220,100,130,0.45)}}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
`;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg0:"#090610", bg1:"#0e0a18", bg2:"#140e22", bg3:"#1b1430", bg4:"#231b3e",
  border:"#2c1e48", borderBright:"#4a306e",
  rose:"#dc6482",   roseDim:"#922048",   roseFaint:"#dc648218",
  silver:"#b8c4dc", silverDim:"#6070a0", silverFaint:"#b8c4dc14",
  violet:"#a87ef5", violetDim:"#6a3eb8", violetFaint:"#a87ef514",
  mint:"#5ecdb8",   mintFaint:"#5ecdb814",
  gold:"#e8c24a",   goldFaint:"#e8c24a14",
  green:"#52c98a",  greenFaint:"#52c98a14",
  red:"#e05858",
  text:"#c0aed8",  textMuted:"#58427a", textBright:"#ede0f8",
  mono:"'JetBrains Mono', monospace",
  disp:"'Cinzel', serif",
  body:"'Crimson Pro', serif",
};

// ─── CRYPTO UTILITIES (all in-browser, no libraries) ─────────────────────────

/** Toy hash → 64 hex chars. Demonstrates avalanche, determinism, fixed-size output. */
function toyHash(str) {
  const PRIME = 0x9e3779b97f4a7c15n, MASK = 0xFFFFFFFFn;
  let h = [0x6a09e667n,0xbb67ae85n,0x3c6ef372n,0xa54ff53an,
            0x510e527fn,0x9b05688cn,0x1f83d9abn,0x5be0cd19n];
  const src = str + "\x00blockchain-crypto\xff";
  for (let i = 0; i < src.length; i++) {
    const c = BigInt(src.charCodeAt(i));
    for (let j = 0; j < 8; j++) {
      h[j] = ((h[j] ^ (c << BigInt(j & 7))) * PRIME) & MASK;
      h[j] = ((h[j] << 13n) | (h[j] >> 19n)) & MASK;
      h[j] = (h[j] ^ h[(j + 1) & 7]) & MASK;
    }
  }
  for (let r = 0; r < 6; r++)
    for (let j = 0; j < 8; j++) {
      h[j] = ((h[j] ^ h[(j+3)&7]) * PRIME) & MASK;
      h[j] = ((h[j] << 7n) | (h[j] >> 25n)) & MASK;
      h[j] = (h[j] ^ h[(j+5)&7]) & MASK;
    }
  return h.map(v => v.toString(16).padStart(8,"0")).join("");
}

/** Count differing bits between two 64-char hex strings */
function bitDiff(a, b) {
  let diff = 0;
  for (let i = 0; i < a.length; i += 2) {
    let x = (parseInt(a.slice(i,i+2),16) ^ parseInt(b.slice(i,i+2),16)) >>> 0;
    while (x) { diff += x & 1; x >>= 1; }
  }
  return diff;
}

/** Simulated Base58 (demo only) */
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58Sim(hex, maxLen = 34) {
  let n = BigInt("0x" + (hex || "0"));
  let s = "";
  while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n; }
  return (s || "1").padStart(maxLen,"1").slice(0, maxLen);
}

/** Derive a deterministic simulated key pair from a seed string */
function deriveKeyPair(seed) {
  const privKey  = toyHash("PRIVKEY_DERIVE:" + seed + ":secp256k1");
  const pubX     = toyHash("PUBKEY_X:" + privKey);
  const pubY     = toyHash("PUBKEY_Y:" + privKey);
  const parity   = parseInt(pubY.slice(-1), 16) % 2 === 0 ? "02" : "03";
  const pubKeyUncomp = "04" + pubX + pubY;
  const pubKeyComp   = parity + pubX;
  const ethRaw   = toyHash("KECCAK_SIMULATED:" + pubX + pubY);
  const ethAddr  = "0x" + ethRaw.slice(24).toUpperCase();
  const btcRaw   = toyHash("HASH160_SIMULATED:" + pubKeyComp);
  const btcAddr  = "1" + base58Sim(btcRaw, 33);
  return { seed, privKey, pubKeyUncomp, pubKeyComp, ethAddr, btcAddr };
}

/** Simulate signing: (privKey, message) → {r, s, msgHash} */
function signMsg(message, privKey) {
  const msgHash = toyHash("MSG_HASH_SHA256:" + message);
  const k       = toyHash("NONCE_k:" + privKey + msgHash); // ephemeral nonce
  const r       = toyHash("SIG_R:" + k + privKey).slice(0, 64);
  const s       = toyHash("SIG_S:" + msgHash + r + privKey).slice(0, 64);
  return { msgHash, r, s };
}

/** Merkle tree builder → returns array of levels (level[0]=leaves) */
function buildMerkle(items) {
  if (!items.length) return [];
  const levels = [];
  let current = items.map(it => ({ label: it, hash: toyHash(it) }));
  levels.push(current);
  while (current.length > 1) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      const L = current[i];
      const R = current[i + 1] || current[i];
      next.push({ hash: toyHash(L.hash + R.hash), left: L.hash, right: R.hash,
                  leftIdx: i, rightIdx: Math.min(i+1, current.length-1) });
    }
    levels.push(next);
    current = next;
  }
  return levels;
}

/** Get proof path for leaf at targetIdx */
function merkleProof(levels, targetIdx) {
  const proof = [];
  let idx = targetIdx;
  for (let lv = 0; lv < levels.length - 1; lv++) {
    const sibling = idx % 2 === 0 ? idx + 1 : idx - 1;
    const sibNode = levels[lv][Math.min(sibling, levels[lv].length - 1)];
    proof.push({ hash: sibNode.hash, side: idx % 2 === 0 ? "right" : "left", level: lv, idx: sibling });
    idx = Math.floor(idx / 2);
  }
  return proof;
}

// ─── SHARED UI ATOMS ──────────────────────────────────────────────────────────

const SecLabel = ({ children }) => (
  <div style={{ fontFamily:T.mono, fontSize:10, color:T.rose, letterSpacing:"0.2em",
    textTransform:"uppercase", marginBottom:7 }}>{children}</div>
);

const H2 = ({ children }) => (
  <h2 style={{ fontFamily:T.disp, fontSize:24, fontWeight:700, color:T.textBright,
    lineHeight:1.2, marginBottom:5, letterSpacing:"0.04em" }}>{children}</h2>
);

const H3 = ({ children, color = T.rose }) => (
  <h3 style={{ display:"flex", alignItems:"center", gap:9, fontFamily:T.mono,
    fontSize:11, fontWeight:600, color, letterSpacing:"0.1em",
    textTransform:"uppercase", margin:"22px 0 10px" }}>
    <span style={{ display:"inline-block", width:14, height:1, background:color }}/>
    {children}
    <span style={{ flex:1, height:1, background:color, opacity:0.18 }}/>
  </h3>
);

const Body = ({ children, style = {} }) => (
  <p style={{ fontFamily:T.body, fontSize:15.5, lineHeight:1.88, color:T.text,
    margin:"12px 0", ...style }}>{children}</p>
);

const Code = ({ children, title, compact = false }) => (
  <div style={{ background:"#050310", border:`1px solid ${T.border}`,
    borderRadius:5, margin: compact ? "7px 0" : "13px 0", overflow:"hidden" }}>
    {title && (
      <div style={{ background:T.bg2, borderBottom:`1px solid ${T.border}`,
        padding:"5px 12px", fontFamily:T.mono, fontSize:10, color:T.textMuted }}>{title}</div>
    )}
    <pre style={{ padding: compact ? "10px 13px" : "14px 16px", fontFamily:T.mono,
      fontSize:12, color:T.mint, lineHeight:1.75, overflowX:"auto",
      whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
      {children}
    </pre>
  </div>
);

const InfoBox = ({ title, children, color = T.rose, icon = "◈" }) => (
  <div style={{ background:T.bg2, border:`1px solid ${color}30`,
    borderLeft:`3px solid ${color}`, borderRadius:5,
    padding:"14px 18px", margin:"16px 0", animation:"fadeUp 0.35s ease" }}>
    <div style={{ fontFamily:T.mono, fontSize:10, color, letterSpacing:"0.12em",
      textTransform:"uppercase", marginBottom:7 }}>{icon} {title}</div>
    <div style={{ fontFamily:T.body, fontSize:14, color:T.text, lineHeight:1.78 }}>
      {children}
    </div>
  </div>
);

const HR = () => (
  <div style={{ height:1, margin:"28px 0",
    background:`linear-gradient(90deg,${T.rose}55,${T.border},transparent)` }}/>
);

const Tag = ({ children, color = T.rose }) => (
  <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:2,
    background:`${color}20`, border:`1px solid ${color}44`, color,
    fontFamily:T.mono, fontSize:10, letterSpacing:"0.06em", fontWeight:600 }}>
    {children}
  </span>
);

const Btn = ({ onClick, children, color = T.rose, disabled, small }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ padding: small ? "6px 14px" : "9px 20px",
      background: disabled ? T.bg3 : `${color}20`,
      border:`1px solid ${disabled ? T.border : `${color}55`}`,
      borderRadius:4, cursor: disabled ? "not-allowed" : "pointer",
      color: disabled ? T.textMuted : color, fontFamily:T.mono,
      fontSize: small ? 10 : 11, fontWeight:600, letterSpacing:"0.06em",
      transition:"all 0.18s", opacity: disabled ? 0.55 : 1 }}>
    {children}
  </button>
);

// ─── NAVIGATION DATA ──────────────────────────────────────────────────────────
const CHAPTERS = [
  { id:"intro",    label:"§1 Overview",             short:"§1" },
  { id:"hash",     label:"§2 Hash Functions",        short:"§2" },
  { id:"pubkey",   label:"§3 Public-Key Crypto",     short:"§3" },
  { id:"merkle",   label:"§4 Merkle Trees",          short:"§4" },
  { id:"wallets",  label:"§5 Keys & Wallets",        short:"§5" },
  { id:"lab",      label:"§6 Interactive Lab",       short:"§6" },
  { id:"quiz",     label:"§7 Quizzes",               short:"§7" },
  { id:"assess",   label:"§8 Assessment",            short:"§8" },
];

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const QUIZZES = [
  {
    sec:"§2 Hash Functions",
    q:"Why does changing even ONE character in a document completely change its hash — a property called the avalanche effect?",
    opts:[
      "Because the hash function counts characters modulo the document length",
      "Because each input bit influences many output bits through non-linear mixing; a single-bit change cascades unpredictably, flipping ~50% of output bits",
      "Because hash functions sort characters alphabetically before encoding, so any change reorders the sort",
      "Because the hash stores the document's timestamp, and even one character delays processing slightly",
    ],
    ans:1,
    explain:"Good hash functions achieve the strict avalanche criterion: flipping 1 input bit must flip ~50% of output bits on average. This is engineered through rounds of XOR, rotation, and multiplication that propagate and amplify any change. Without this property, attackers could find similar inputs producing similar hashes — a catastrophic weakness.",
  },
  {
    sec:"§2 Hash Functions",
    q:"A blockchain ensures 'immutability.' More precisely, what does a cryptographic hash actually guarantee?",
    opts:[
      "That no one can ever modify a block under any circumstances, including the original miner",
      "Tamper-EVIDENCE: any modification changes the hash, which breaks the prev_hash chain link, making tampering computationally detectable by every node",
      "That the network will automatically reject any transaction with a known duplicate hash",
      "That blocks are encrypted so only authorized nodes can read their contents",
    ],
    ans:1,
    explain:"Cryptographic hashes provide tamper-evidence, not absolute immutability. An attacker who controls sufficient hash power COULD technically re-mine a chain. What hashing guarantees is that any tampering is immediately detectable — changed content → changed hash → broken chain link → every honest node rejects it. The economic cost of undetected tampering is what makes it practically 'immutable.'",
  },
  {
    sec:"§3 Public-Key Cryptography",
    q:"Alice wants to prove to Bob that she authored a message. Which key does she use to create the signature, and which key does Bob use to verify it?",
    opts:[
      "Alice encrypts with Bob's public key; Bob decrypts with his private key",
      "Alice signs with her PRIVATE key; Bob verifies with Alice's PUBLIC key",
      "Alice signs with her PUBLIC key; Bob verifies with Alice's private key",
      "Both parties use a shared symmetric key established during a prior handshake",
    ],
    ans:1,
    explain:"This is the core asymmetry of digital signatures. Only Alice holds her private key → only she could have produced the signature. Anyone with her public key (which is public!) can verify the math checks out. Swapping these (signing with public, verifying with private) would let anyone forge signatures.",
  },
  {
    sec:"§3 Public-Key Cryptography",
    q:"What does 'non-repudiation' mean in the context of digital signatures on a blockchain?",
    opts:[
      "A transaction cannot be repeated because nonces prevent replay attacks",
      "The sender cannot later deny having authorized a transaction — the valid signature over their private key is cryptographic proof of intent",
      "Validators cannot repudiate a block they helped finalize under BFT consensus",
      "The recipient cannot refuse a transaction once it has one confirmation",
    ],
    ans:1,
    explain:"Non-repudiation means the signer cannot plausibly deny having produced the signature. Since only the private key holder can create a valid signature over a message, a confirmed on-chain transaction is mathematical evidence of authorization — unlike a handwritten signature, it cannot be forged or denied without claiming the private key was stolen.",
  },
  {
    sec:"§4 Merkle Trees",
    q:"A Merkle proof allows a light client to verify that transaction T exists in a block with 4,096 transactions. How many hashes does the proof require?",
    opts:[
      "4,095 hashes (all other transactions)",
      "log₂(4,096) = 12 hashes — one sibling hash per level of the binary tree",
      "64 hashes — one per character of the SHA-256 output",
      "1 hash — just the Merkle root stored in the block header",
    ],
    ans:1,
    explain:"A Merkle tree over N leaves has depth log₂(N). A proof requires exactly one sibling hash per level — the partner needed at each step to recompute the parent. For 4,096 transactions: log₂(4096) = 12 hashes. The client hashes up the 12-step path and compares the resulting root to the block header's merkle_root. Download cost: 12 × 32 bytes = 384 bytes instead of 4,096 full transactions.",
  },
  {
    sec:"§4 Merkle Trees",
    q:"Why is the Merkle root stored in the block HEADER rather than just storing a hash of the entire block body?",
    opts:[
      "Headers are signed by miners; storing Merkle root there prevents body modification after signing",
      "Storing the root enables efficient partial verification: a single header hash + a short proof proves any transaction, without downloading or trusting the entire block body",
      "The block body is too large to hash in real time during mining",
      "Merkle roots are required by the UTXO model to locate unspent outputs efficiently",
    ],
    ans:1,
    explain:"The key insight is selective verification. SPV wallets download only 80-byte headers (~50 MB for Bitcoin's full history). To verify a specific payment, they request a Merkle proof from a full node — a tiny logarithmic-size certificate. The header's merkle_root is the 'anchor' that makes this proof trustworthy without trusting the full node for anything else.",
  },
  {
    sec:"§5 Keys & Wallets",
    q:"An Ethereum address is derived from a public key, NOT stored in it. What is the derivation process?",
    opts:[
      "Address = first 20 bytes of the private key, encoded in hexadecimal",
      "Address = last 20 bytes of Keccak-256(public_key), where the full 64-byte uncompressed public key (minus the 04 prefix) is hashed",
      "Address = SHA-256(SHA-256(compressed_public_key)), truncated to 20 bytes",
      "Address = RIPEMD-160(public_key), encoded as Base58Check — same as Bitcoin",
    ],
    ans:1,
    explain:"Ethereum: strip the 04 prefix from the 65-byte uncompressed public key → take the Keccak-256 hash of the 64-byte X||Y coordinates → use only the last 20 bytes (40 hex chars) → prepend 0x. Bitcoin uses a different pipeline: RIPEMD-160(SHA-256(public_key)) then Base58Check encoding. Both pipelines are one-way: you cannot recover the public key from the address alone.",
  },
  {
    sec:"§5 Keys & Wallets",
    q:"A user 'stores crypto in their wallet app.' What does a wallet actually store, and where are the 'coins'?",
    opts:[
      "The wallet stores actual token balances locally; the blockchain is a backup database",
      "The wallet stores private keys; the 'coins' are entries in the blockchain's global state (UTXO set or account balance) that the private key has the authority to spend",
      "The wallet stores an encrypted copy of the user's transaction history for quick access",
      "The wallet holds tokens in escrow during transactions, releasing them after confirmation",
    ],
    ans:1,
    explain:"A wallet is a KEY MANAGER, not a coin container. The 'coins' (UTXOs in Bitcoin; account balances in Ethereum) live entirely on the blockchain. The wallet holds the private key that proves authorization to move those on-chain entries. Losing your private keys = losing access to the funds. The funds themselves still exist on-chain forever — just irrecoverably locked.",
  },
];

// ─── ASSESSMENT DATA ──────────────────────────────────────────────────────────
const ASSESSMENTS = [
  {
    id:"P1", diff:"Foundational", color:T.green,
    problem:"List and explain in plain language the four essential properties of a cryptographic hash function. For each property, give a specific example of what would go wrong in a blockchain if that property were broken.",
    answer:`PROPERTY 1 — DETERMINISM
  Definition: The same input ALWAYS produces the same output.
  If broken: Two nodes computing hash("block data") would get different results → no consensus on valid chain tip possible. The entire protocol collapses.

PROPERTY 2 — PRE-IMAGE RESISTANCE (One-Way)
  Definition: Given output hash H, it is computationally infeasible to find any input M such that hash(M) = H.
  If broken: An attacker could reverse-engineer a valid nonce from a target hash, solving Proof-of-Work instantly without expending real energy. Mining becomes free → 51% attack becomes trivial.

PROPERTY 3 — SECOND PRE-IMAGE RESISTANCE
  Definition: Given input M1, it is infeasible to find M2 ≠ M1 such that hash(M1) = hash(M2).
  If broken: An attacker could replace legitimate transaction data with malicious data that produces the same Merkle root → insertion of fraudulent transactions while maintaining a valid block header.

PROPERTY 4 — COLLISION RESISTANCE
  Definition: It is infeasible to find ANY two distinct inputs M1 ≠ M2 with hash(M1) = hash(M2).
  If broken (stronger than #3): Attackers could pre-compute colliding document pairs (e.g., a legitimate contract and a fraudulent version with the same hash), then swap them after signing — a devastating attack on the integrity of any hash-committed data structure.

NOTE ON AVALANCHE EFFECT (bonus property):
  Changing 1 bit of input must change ~50% of output bits. Without this, hash analysis could leak information about the input, breaking pre-image resistance in practice.`,
  },
  {
    id:"P2", diff:"Foundational", color:T.green,
    problem:"Walk through the complete lifecycle of Alice digitally signing a blockchain transaction and Bob (or any node) verifying it. Your answer must use the terms: private key, public key, message hash, signature, verification equation.",
    answer:`STEP 1 — ALICE CONSTRUCTS THE TRANSACTION MESSAGE
  msg = {
    from: "Alice_address", to: "Bob_address",
    amount: 1.0, nonce: 47, gas_price: 20_gwei
  }

STEP 2 — ALICE HASHES THE MESSAGE
  msg_hash = keccak256(RLP_encode(msg))
  # Fixed-size 32-byte digest. She signs the HASH, not the raw message.
  # Why hash first? Signature schemes operate on fixed-size inputs.

STEP 3 — ALICE SIGNS WITH HER PRIVATE KEY
  (r, s, v) = ECDSA_sign(msg_hash, alice_private_key)
  # r, s: two 32-byte integers forming the signature
  # v: recovery bit (allows recovering the public key from signature)
  # Security guarantee: Only someone possessing alice_private_key
  # can produce a valid (r,s) for this msg_hash.

STEP 4 — ALICE BROADCASTS {msg, signature}
  # The private key is NEVER transmitted. Only msg + (r,s,v).

STEP 5 — BOB/NODE VERIFIES
  # Recover the public key from the signature:
  recovered_pubkey = ECDSA_recover(msg_hash, r, s, v)

  # Derive expected address from recovered public key:
  expected_address = keccak256(recovered_pubkey)[-20 bytes]

  # Verification equation passes if:
  assert expected_address == msg["from"]  # "Alice_address"

STEP 6 — RESULT
  ✓ If assertion passes: the node confirms Alice (and only Alice) authorized this transaction.
  ✗ If assertion fails: transaction rejected — possibly forged or tampered.

NON-REPUDIATION: Alice cannot later claim "I didn't sign this."
  The valid signature is mathematical proof her private key was used.
  (Unless she claims key theft — a separate operational security issue.)`,
  },
  {
    id:"P3", diff:"Intermediate", color:T.gold,
    problem:"Explain why Ethereum derives addresses from a HASH of the public key (not the public key itself). What specific attack does this address structure defend against, and why does it matter for long-term network security?",
    answer:`WHY HASH THE PUBLIC KEY?

1. SIZE REDUCTION
   Uncompressed public key = 65 bytes (04 || X || Y)
   Ethereum address = 20 bytes (last 20 bytes of keccak256(X||Y))
   Shorter addresses reduce storage and UX error rates.

2. QUANTUM RESISTANCE (primary security reason)
   The attack scenario:
   a) Today: You publish your Ethereum address (a HASH of your public key).
      Your public key is NOT revealed until you spend from this address.
   b) A quantum adversary with Shor's algorithm can break ECDSA:
      given public_key → private_key in polynomial time.
   c) If your address were your raw public key, a quantum computer
      could immediately derive your private key and steal your funds
      even BEFORE you transact.
   d) With address = hash(public_key):
      - Your public key is hidden until your first outgoing transaction.
      - After that, your public key IS revealed on-chain. But by then
        you've already spent those coins (prudent practice: use each
        address only once).
      - A "fresh" address that has never sent coins → public key unknown
        → quantum adversary has nothing to apply Shor's algorithm TO.

3. THE HASH LAYER ADDS AN EXTRA SECURITY ROUND
   Even if ECDSA were broken, an adversary must ALSO break the
   hash preimage to map from address back to public key.
   This is a double-barrier: break elliptic curves AND break Keccak-256.

PRACTICAL IMPLICATION FOR DEVELOPERS:
   Best practice: never reuse addresses. Each receive-only address
   keeps your public key hidden. Once you've sent from an address
   (revealing the public key on-chain), move remaining funds to a
   fresh address immediately. This is standard hardware wallet behavior.`,
  },
  {
    id:"P4", diff:"Intermediate", color:T.gold,
    problem:"Given 8 transactions [T0..T7] in a block, construct the Merkle tree level by level. Then write out the Merkle proof for T3 (zero-indexed) and describe how a light client uses this proof to verify T3 is in the block, given only the block header.",
    answer:`STEP 1 — HASH LEAVES
  L0=H(T0)  L1=H(T1)  L2=H(T2)  L3=H(T3)
  L4=H(T4)  L5=H(T5)  L6=H(T6)  L7=H(T7)

STEP 2 — LEVEL 1 (pairs)
  P01 = H(L0 || L1)    P23 = H(L2 || L3)
  P45 = H(L4 || L5)    P67 = H(L6 || L7)

STEP 3 — LEVEL 2
  Q0123 = H(P01 || P23)
  Q4567 = H(P45 || P67)

STEP 4 — ROOT
  ROOT = H(Q0123 || Q4567)       ← stored in block header as merkle_root

MERKLE PROOF FOR T3 (path from L3 to ROOT):
  The proof consists of SIBLING hashes at each level:

  Level 0: L2   (sibling of L3; needed to compute P23 = H(L2||L3))
  Level 1: P01  (sibling of P23; needed to compute Q0123 = H(P01||P23))
  Level 2: Q4567 (sibling of Q0123; needed to compute ROOT = H(Q0123||Q4567))

  Proof = [L2, P01, Q4567]   ← only 3 × 32 bytes = 96 bytes

LIGHT CLIENT VERIFICATION:
  Given: T3 (the transaction), proof=[L2, P01, Q4567], claimed ROOT from header

  1. Compute leaf:  current = H(T3)   → reproduces L3
  2. Apply proof[0]: current = H(L2 || current)  → reproduces P23
     (Note: L2 is on LEFT because T3 is at odd index 3; L2 is at index 2)
  3. Apply proof[1]: current = H(P01 || current)  → reproduces Q0123
     (P01 is on LEFT)
  4. Apply proof[2]: current = H(current || Q4567) → reproduces ROOT
     (Q4567 is on RIGHT)
  5. Assert: current == ROOT from block header

  ✓ If equal: T3 is provably in this block.
  ✗ If different: proof is invalid or T3 was tampered with.

  Cost: 3 hash computations + 3 × 32 bytes downloaded. Compare to downloading
  all 8 transactions to verify T3 membership naively.`,
  },
  {
    id:"P5", diff:"Advanced", color:T.red,
    problem:"Describe the BIP-32 Hierarchical Deterministic (HD) wallet derivation scheme. What problem does it solve? What is the mathematical relationship between a parent key and a child key? Discuss the security implications of an exposed child private key vs. an exposed chain code.",
    answer:`PROBLEM SOLVED BY HD WALLETS
  Before HD wallets: users needed to back up every individual private key.
  Managing 100 addresses = 100 separate backup operations.
  One missed backup = permanent loss of funds at that address.

BIP-32 HD WALLET ARCHITECTURE

  Seed (128-256 bits of entropy from BIP-39 mnemonic)
    │
    └─ HMAC-SHA512(key="Bitcoin seed", data=seed)
         ├─ Left 32 bytes → Master Private Key (m)
         └─ Right 32 bytes → Master Chain Code (c)

  From master key, derive any child key at path m/purpose'/coin'/account'/change/index:

CHILD KEY DERIVATION (hardened vs normal):

  Normal child (index < 2^31):
    I = HMAC-SHA512(key=parent_chain_code,
                    data=parent_PUBLIC_key || uint32(index))
    child_private_key = (I_left + parent_private_key) mod n
    child_chain_code  = I_right

  Hardened child (index ≥ 2^31, denoted with '):
    I = HMAC-SHA512(key=parent_chain_code,
                    data=0x00 || parent_PRIVATE_key || uint32(index))
    child_private_key = (I_left + parent_private_key) mod n
    child_chain_code  = I_right

  Where n = order of the secp256k1 elliptic curve

CRITICAL SECURITY DISTINCTION:

  SCENARIO A — Exposed NORMAL child private key + chain code:
    An attacker who knows:
    • A normal child private key (child_priv)
    • The parent's chain code
    • The derivation index
    Can compute: parent_private_key = child_priv - I_left  (mod n)
    → CATASTROPHIC: entire wallet tree is compromised.
    This is called a "key compromise cascade."

  SCENARIO B — Exposed HARDENED child private key + chain code:
    Hardened derivation uses the PRIVATE key in the HMAC input.
    An attacker cannot reverse from a hardened child to the parent
    without knowing the parent private key itself → no cascade.
    → Only that one child key is compromised.

  SCENARIO C — Exposed chain code alone:
    Not directly harmful. But combined with any public key in the
    non-hardened subtree, allows computing all sibling public keys
    (watch-only compromise — privacy loss, not key theft).

BEST PRACTICE:
  Use hardened derivation (') for account-level keys (m/44'/60'/0').
  Use normal derivation only for address-level keys within an account
  where the parent is already hardened-protected.

  One 12-word mnemonic → ∞ addresses, one backup forever.`,
  },
];

// ─── SECTION: INTRO ───────────────────────────────────────────────────────────
const IntroSection = () => (
  <div style={{ animation:"fadeUp 0.45s ease" }}>
    <SecLabel>§1 — Chapter Overview</SecLabel>
    <H2>Cryptography for Blockchains</H2>
    <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, letterSpacing:"0.1em",
      marginTop:3, marginBottom:22 }}>
      ACM Educational Series · Distributed Systems Track · Chapter 3
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
      gap:10, margin:"18px 0" }}>
      {[
        { icon:"🔏", t:"Hash Functions",     s:"Fingerprints & tamper-evidence" },
        { icon:"🗝",  t:"Public-Key Crypto",  s:"Identity & digital signatures" },
        { icon:"🌳", t:"Merkle Trees",       s:"Integrity at scale" },
        { icon:"👛", t:"Keys & Wallets",     s:"Operational key management" },
        { icon:"⚗",  t:"Interactive Lab",    s:"Hash, sign, verify — live" },
      ].map(c => (
        <div key={c.t} style={{ background:T.bg2, border:`1px solid ${T.border}`,
          borderRadius:6, padding:"14px 12px", textAlign:"center" }}>
          <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
          <div style={{ fontFamily:T.mono, fontSize:10, color:T.rose,
            fontWeight:600, marginBottom:4 }}>{c.t}</div>
          <div style={{ fontFamily:T.body, fontSize:11, color:T.textMuted,
            lineHeight:1.5 }}>{c.s}</div>
        </div>
      ))}
    </div>

    <Body>
      A blockchain is only as trustworthy as the cryptography underneath it. This chapter demystifies
      the three cryptographic primitives that make blockchain systems work — <strong style={{color:T.rose}}>hash functions</strong>,{" "}
      <strong style={{color:T.violet}}>public-key cryptography</strong>, and <strong style={{color:T.mint}}>Merkle trees</strong> — explaining
      what each does, why it matters, and how they compose into the tamper-evident, self-authenticating
      system you interact with when you send a transaction.
    </Body>
    <Body>
      <em>No heavy math required.</em> We use concrete analogies, visual demonstrations, and a
      live interactive lab that lets you observe these properties directly in your browser.
    </Body>

    <InfoBox title="A Note on 'No Math'" icon="◈" color={T.silver}>
      We will not derive ECDSA or SHA-256 from first principles. Instead, we treat these as
      well-tested black boxes and reason about their <em>behavioral contracts</em> — the properties
      they guarantee that make blockchain protocols secure. Understanding the contracts is
      sufficient for 95% of blockchain engineering practice.
    </InfoBox>

    <HR/>
    <H3 color={T.silver}>The Three Pillars</H3>
    <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"12px 0" }}>
      {[
        { color:T.rose,   icon:"🔏", pillar:"Hash Functions",
          role:"INTEGRITY", desc:"Detect any change to any data — blocks, transactions, code." },
        { color:T.violet, icon:"🗝",  pillar:"Public-Key Crypto",
          role:"IDENTITY + AUTHORIZATION", desc:"Prove who you are and authorize actions without a trusted third party." },
        { color:T.mint,   icon:"🌳", pillar:"Merkle Trees",
          role:"SCALABLE VERIFICATION", desc:"Prove one piece of data is part of a large set without downloading it all." },
      ].map(p => (
        <div key={p.pillar} style={{ display:"flex", gap:14, alignItems:"flex-start",
          background:T.bg2, border:`1px solid ${p.color}22`, borderRadius:6,
          padding:"12px 16px" }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{p.icon}</span>
          <div>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
              <span style={{ fontFamily:T.mono, fontSize:11, color:p.color, fontWeight:600 }}>{p.pillar}</span>
              <Tag color={p.color}>{p.role}</Tag>
            </div>
            <div style={{ fontFamily:T.body, fontSize:14, color:T.text }}>{p.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── SECTION: HASH FUNCTIONS ──────────────────────────────────────────────────
const HashSection = () => {
  const [input, setInput] = useState("The Times 03/Jan/2009 Chancellor on brink");
  const [showAvalanche, setShowAvalanche] = useState(false);

  const hash1 = useMemo(() => toyHash(input), [input]);
  const tweaked = useMemo(() => {
    if (!input.length) return "";
    const arr = [...input];
    arr[arr.length - 1] = String.fromCharCode(arr[arr.length - 1].charCodeAt(0) + 1);
    return arr.join("");
  }, [input]);
  const hash2 = useMemo(() => toyHash(tweaked), [tweaked]);
  const diffBits  = useMemo(() => (hash1 && hash2 ? bitDiff(hash1, hash2) : 0), [hash1, hash2]);
  const diffChars = useMemo(() => hash1.split("").filter((c,i) => c !== hash2[i]).length, [hash1, hash2]);

  return (
    <div style={{ animation:"fadeUp 0.45s ease" }}>
      <SecLabel>§2 — Cryptographic Primitives I</SecLabel>
      <H2>Hash Functions & Tamper-Evidence</H2>

      <Body>
        A <strong style={{color:T.rose}}>cryptographic hash function</strong> is a mathematical machine
        that takes any input — a byte, a novel, a blockchain block — and produces a fixed-size
        <strong style={{color:T.rose}}> "fingerprint"</strong> (usually 256 bits = 64 hex characters).
        Think of it as a tamper-evident seal on an envelope: if anything inside changes,
        the seal looks completely different.
      </Body>

      <H3>The Four Guarantees</H3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"12px 0" }}>
        {[
          { g:"Deterministic", color:T.rose,
            analogy:"Same recipe → same dish, every time, everywhere.",
            why:"If two nodes compute hash(block) and get different results, they can never agree on the chain state." },
          { g:"Fixed-Size Output", color:T.violet,
            analogy:"No matter the book's length, the ISBN is always 13 digits.",
            why:"Bitcoin's SHA-256 always outputs 256 bits whether the input is 1 byte or 1 GB." },
          { g:"One-Way (Pre-image Resistant)", color:T.mint,
            analogy:"Easy to scramble an egg; impossible to unscramble it.",
            why:"Given a block hash, you cannot reverse-engineer the block contents or find a nonce faster than brute force." },
          { g:"Avalanche Effect", color:T.gold,
            analogy:"One wrong ingredient ruins the whole batch — unrecognizably.",
            why:"A 1-bit change in a Bitcoin transaction flips ~128 of 256 output bits, making fraud immediately detectable." },
        ].map(p => (
          <div key={p.g} style={{ background:T.bg2, border:`1px solid ${p.color}28`,
            borderTop:`2px solid ${p.color}`, borderRadius:5, padding:"12px 14px" }}>
            <div style={{ fontFamily:T.mono, fontSize:11, color:p.color,
              fontWeight:600, marginBottom:6 }}>{p.g}</div>
            <div style={{ fontFamily:T.body, fontStyle:"italic", fontSize:13,
              color:T.silver, marginBottom:6 }}>"{p.analogy}"</div>
            <div style={{ fontFamily:T.body, fontSize:13, color:T.text,
              lineHeight:1.6 }}>{p.why}</div>
          </div>
        ))}
      </div>

      <HR/>
      <H3>Tamper-Evidence vs. Immutability</H3>
      <Body>
        Blockchains are often called "immutable." This is a slight simplification.
        What cryptographic hashing actually provides is <strong style={{color:T.rose}}>tamper-evidence</strong>:
        any modification to any block changes its hash, which changes the <code style={{fontFamily:T.mono,color:T.mint,fontSize:13}}>prev_hash</code> pointer
        in the next block, which cascades to every subsequent block. Every honest node
        immediately detects the break and rejects the tampered chain.
      </Body>

      <Code title="Why the hash chain creates tamper-evidence">{`Block 1: {txs: [...], prev: "0000...a1b2", nonce: 9821}
  hash → "0000...c3d4"

Block 2: {txs: [...], prev: "0000...c3d4", nonce: 7741}
  hash → "0000...e5f6"

Block 3: {txs: [...], prev: "0000...e5f6", nonce: 3312}
  hash → "0000...0a1b"

# Attacker modifies a transaction in Block 2:
Block 2': {txs: [...TAMPERED...], prev: "0000...c3d4", nonce: ???}
  hash → "abcd...XXXX"  ← completely different!

# Now Block 3's prev_hash doesn't match Block 2's new hash
Block 3:  prev: "0000...e5f6"  ≠  Block 2' hash: "abcd...XXXX"
# Every node sees the break instantly → rejects the tampered chain
# Attacker must re-mine Block 2 AND Block 3 AND all subsequent blocks`}
      </Code>

      <HR/>
      <H3 color={T.violet}>Interactive: Live Hash Explorer</H3>
      <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6,
        padding:"18px 20px", margin:"12px 0" }}>
        <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:10 }}>
          TYPE ANYTHING — watch the hash update in real time
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
          style={{ width:"100%", padding:"10px 13px", background:"#050310",
            border:`1px solid ${T.borderBright}`, borderRadius:4,
            fontFamily:T.mono, fontSize:12, color:T.textBright,
            resize:"vertical", outline:"none", marginBottom:12 }}
        />

        <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
          SHA-256 (simulated) → 256 bits / 64 hex chars
        </div>
        <div style={{ background:"#050310", border:`1px solid ${T.rose}33`,
          borderRadius:4, padding:"10px 13px", fontFamily:T.mono,
          fontSize:12, color:T.rose, letterSpacing:"0.06em",
          wordBreak:"break-all", animation:"hashReveal 0.2s ease" }}>
          {hash1}
        </div>

        <div style={{ marginTop:14, display:"flex", gap:10, alignItems:"center",
          flexWrap:"wrap" }}>
          <Btn small onClick={() => setShowAvalanche(!showAvalanche)} color={T.violet}>
            {showAvalanche ? "▲ Hide" : "⚡ Show"} Avalanche Comparison
          </Btn>
          <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted }}>
            (last character incremented by 1)
          </div>
        </div>

        {showAvalanche && (
          <div style={{ marginTop:14, animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:6 }}>
                  ORIGINAL INPUT
                </div>
                <div style={{ background:"#050310", border:`1px solid ${T.rose}44`,
                  borderRadius:4, padding:"8px 11px", fontFamily:T.mono,
                  fontSize:11, color:T.silver, wordBreak:"break-all", marginBottom:8 }}>
                  "{input}"
                </div>
                <div style={{ fontFamily:T.mono, fontSize:10, wordBreak:"break-all",
                  lineHeight:1.7 }}>
                  {hash1.split("").map((c, i) => (
                    <span key={i} style={{ color: c !== hash2[i] ? T.rose : T.textMuted,
                      fontWeight: c !== hash2[i] ? 700 : 400,
                      background: c !== hash2[i] ? T.roseFaint : "transparent" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:6 }}>
                  MODIFIED INPUT (one char changed)
                </div>
                <div style={{ background:"#050310", border:`1px solid ${T.violet}44`,
                  borderRadius:4, padding:"8px 11px", fontFamily:T.mono,
                  fontSize:11, color:T.silver, wordBreak:"break-all", marginBottom:8 }}>
                  "{tweaked}"
                </div>
                <div style={{ fontFamily:T.mono, fontSize:10, wordBreak:"break-all",
                  lineHeight:1.7 }}>
                  {hash2.split("").map((c, i) => (
                    <span key={i} style={{ color: c !== hash1[i] ? T.violet : T.textMuted,
                      fontWeight: c !== hash1[i] ? 700 : 400,
                      background: c !== hash1[i] ? T.violetFaint : "transparent" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:16, marginTop:14, padding:"10px 14px",
              background:T.bg3, borderRadius:4, flexWrap:"wrap" }}>
              <div style={{ fontFamily:T.mono, fontSize:11 }}>
                <span style={{ color:T.textMuted }}>Hex chars changed: </span>
                <span style={{ color:T.rose, fontWeight:600 }}>{diffChars}/64</span>
                <span style={{ color:T.textMuted }}> ({Math.round(diffChars/64*100)}%)</span>
              </div>
              <div style={{ fontFamily:T.mono, fontSize:11 }}>
                <span style={{ color:T.textMuted }}>Bits changed: </span>
                <span style={{ color:T.violet, fontWeight:600 }}>{diffBits}/256</span>
                <span style={{ color:T.textMuted }}> ({Math.round(diffBits/256*100)}%)</span>
              </div>
              <div style={{ fontFamily:T.mono, fontSize:11, color:T.textMuted }}>
                Ideal avalanche: ~50% → <span style={{ color:T.gold }}>128 bits</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <InfoBox title="Real-World Hash Functions in Blockchains" icon="◈" color={T.silver}>
        <strong>Bitcoin:</strong> SHA-256 (double-hashed as SHA-256(SHA-256(x)) for blocks; RIPEMD-160(SHA-256(x)) for addresses)<br/><br/>
        <strong>Ethereum:</strong> Keccak-256 (a SHA-3 variant — notably NOT the NIST-standardized SHA3-256, which uses different padding)<br/><br/>
        <strong>Both are 256-bit outputs.</strong> A birthday attack on 256-bit hash requires ~2¹²⁸ operations — more than the estimated number of atoms in the observable universe.
      </InfoBox>
    </div>
  );
};

// ─── SECTION: PUBLIC-KEY CRYPTOGRAPHY ────────────────────────────────────────
const PubKeySection = () => {
  const [activeTab, setActiveTab] = useState("concepts");
  const [signMsg2, setSignMsg2] = useState("Transfer 1 ETH to Bob — nonce: 42");
  const [privKeyDemo] = useState("a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2");
  const [showSig, setShowSig] = useState(false);
  const [tampered, setTampered] = useState(false);

  const sigResult = useMemo(() => signMsg(signMsg2, privKeyDemo), [signMsg2, privKeyDemo]);
  const displayedMsg = tampered ? signMsg2 + " [TAMPERED]" : signMsg2;
  const verifyHash = useMemo(() => toyHash("MSG_HASH_SHA256:" + displayedMsg), [displayedMsg]);
  const verifyPasses = useMemo(() => verifyHash === sigResult.msgHash, [verifyHash, sigResult]);

  return (
    <div style={{ animation:"fadeUp 0.45s ease" }}>
      <SecLabel>§3 — Cryptographic Primitives II</SecLabel>
      <H2>Public-Key Cryptography & Digital Signatures</H2>

      <div style={{ display:"flex", gap:0, border:`1px solid ${T.border}`,
        borderRadius:6, overflow:"hidden", margin:"16px 0 0" }}>
        {[["concepts","Core Concepts"],["signing","How Signing Works"],["demo","Interactive Demo"]].map(([id,label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ flex:1, padding:"10px 6px", border:"none", cursor:"pointer",
              background: activeTab===id ? T.bg3 : T.bg2,
              color: activeTab===id ? T.violet : T.textMuted,
              fontFamily:T.mono, fontSize:11,
              borderBottom:`2px solid ${activeTab===id ? T.violet : "transparent"}`,
              transition:"all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderTop:"none",
        borderRadius:"0 0 6px 6px", padding:"20px", animation:"fadeIn 0.25s ease" }}>

        {activeTab === "concepts" && (
          <>
            <H3 color={T.violet}>The Mailbox Analogy</H3>
            <Body>
              Imagine a special mailbox with two components: a <strong style={{color:T.violet}}>slot anyone can
              push mail into</strong> (your public key), and a <strong style={{color:T.rose}}>key only you possess</strong> to
              open the box (your private key). Anyone can send you encrypted messages;
              only you can read them.
            </Body>
            <Body>
              For digital signatures, the analogy inverts: you use your private key to
              <em> stamp</em> a message with a seal only you could produce, and anyone
              with your public key can <em>verify</em> the stamp is authentic.
            </Body>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"16px 0" }}>
              <div style={{ background:T.bg3, border:`1px solid ${T.violet}33`,
                borderTop:`2px solid ${T.violet}`, borderRadius:5, padding:"14px" }}>
                <div style={{ fontFamily:T.mono, fontSize:11, color:T.violet,
                  fontWeight:600, marginBottom:10 }}>🔓 PUBLIC KEY</div>
                {["Share with everyone — it's public by design",
                  "Derived from private key (one-way — cannot reverse)",
                  "Used by others to VERIFY your signatures",
                  "Used by others to ENCRYPT messages to you",
                  "In Ethereum: 64 bytes (X,Y coordinates on secp256k1)",
                ].map((v,i) => (
                  <div key={i} style={{ fontFamily:T.body, fontSize:13, color:T.text,
                    marginBottom:5, display:"flex", gap:8 }}>
                    <span style={{ color:T.violet }}>•</span>{v}
                  </div>
                ))}
              </div>
              <div style={{ background:T.bg3, border:`1px solid ${T.rose}33`,
                borderTop:`2px solid ${T.rose}`, borderRadius:5, padding:"14px" }}>
                <div style={{ fontFamily:T.mono, fontSize:11, color:T.rose,
                  fontWeight:600, marginBottom:10 }}>🔐 PRIVATE KEY</div>
                {["Keep SECRET — never share, never transmit",
                  "256 bits of pure randomness (must be truly random!)",
                  "Used to CREATE (sign) transactions and messages",
                  "Loss = permanent loss of access to your funds",
                  "In Bitcoin/Ethereum: 32-byte integer < secp256k1 order n",
                ].map((v,i) => (
                  <div key={i} style={{ fontFamily:T.body, fontSize:13, color:T.text,
                    marginBottom:5, display:"flex", gap:8 }}>
                    <span style={{ color:T.rose }}>•</span>{v}
                  </div>
                ))}
              </div>
            </div>

            <H3 color={T.silver}>The Three Guarantees of Digital Signatures</H3>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { g:"IDENTITY", color:T.rose,
                  d:"A valid signature proves the message was created by the holder of a specific private key — i.e., the owner of that blockchain address." },
                { g:"AUTHORIZATION", color:T.violet,
                  d:"A signature over a transaction proves the owner explicitly approved this specific action (this amount, this recipient, this nonce). No signature = no authorization = transaction rejected." },
                { g:"NON-REPUDIATION", color:T.gold,
                  d:"The signer cannot later deny having signed. The valid signature is mathematical proof. Unlike a handwritten signature, it cannot be forged or disputed without claiming key theft." },
              ].map(p => (
                <div key={p.g} style={{ display:"flex", gap:12, alignItems:"flex-start",
                  background:T.bg3, border:`1px solid ${p.color}22`,
                  borderLeft:`3px solid ${p.color}`, borderRadius:4, padding:"11px 14px" }}>
                  <div>
                    <Tag color={p.color}>{p.g}</Tag>
                    <div style={{ fontFamily:T.body, fontSize:13.5, color:T.text,
                      lineHeight:1.65, marginTop:6 }}>{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "signing" && (
          <>
            <H3 color={T.violet}>Step-by-Step: Alice Signs → Bob Verifies</H3>

            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {[
                { step:"1", actor:"Alice", color:T.rose,
                  title:"Construct the transaction",
                  detail:`msg = { from: "0xAlice", to: "0xBob", amount: "1 ETH", nonce: 42 }`,
                  note:"The raw message — not yet authenticated." },
                { step:"2", actor:"Alice", color:T.rose,
                  title:"Hash the message",
                  detail:`msg_hash = keccak256(RLP_encode(msg))\n→ "a1b2c3d4..."  ← 32 bytes, fixed size`,
                  note:"Why hash first? ECDSA operates on fixed-size inputs. Hashing also hides raw message content from the signing process." },
                { step:"3", actor:"Alice", color:T.rose,
                  title:"Sign with her PRIVATE key",
                  detail:`(r, s, v) = ECDSA_sign(msg_hash, alice_private_key)\n# r, s: two 32-byte integers\n# v: recovery byte (1 bit)`,
                  note:"The private key is NEVER transmitted. Only msg + signature is broadcast." },
                { step:"4", actor:"Network", color:T.silver,
                  title:"Broadcast {msg, r, s, v}",
                  detail:`p2p_broadcast({ msg, sig: {r, s, v} })\n# ~65 bytes of signature overhead`,
                  note:"Thousands of nodes receive this simultaneously." },
                { step:"5", actor:"Bob / Any Node", color:T.violet,
                  title:"Recover public key & verify",
                  detail:`recovered_pub = ecrecover(msg_hash, r, s, v)\nderived_addr   = keccak256(recovered_pub)[-20:]\nassert derived_addr == msg["from"]  # "0xAlice"`,
                  note:"If this assertion passes, Alice definitely signed this. No third-party trust required." },
              ].map((s, i, arr) => (
                <div key={s.step} style={{ display:"flex", gap:12 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%",
                      background:`${s.color}22`, border:`1px solid ${s.color}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:T.mono, fontSize:11, color:s.color, flexShrink:0 }}>
                      {s.step}
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width:1, flex:1, minHeight:20,
                        background:`${s.color}30`, margin:"4px 0" }}/>
                    )}
                  </div>
                  <div style={{ paddingBottom:16 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                      <span style={{ fontFamily:T.mono, fontSize:11,
                        color:s.color, fontWeight:600 }}>{s.title}</span>
                      <Tag color={s.color}>{s.actor}</Tag>
                    </div>
                    <Code compact>{s.detail}</Code>
                    <div style={{ fontFamily:T.body, fontStyle:"italic",
                      fontSize:12, color:T.textMuted, marginTop:4 }}>
                      ↳ {s.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "demo" && (
          <>
            <H3 color={T.violet}>Sign a Message — Tamper & Verify</H3>
            <Body>Enter a message below. A simulated private key signs it.
              Then try tampering with the message to see verification fail.</Body>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                MESSAGE TO SIGN
              </div>
              <textarea value={signMsg2} onChange={e => { setSignMsg2(e.target.value); setTampered(false); setShowSig(false); }}
                rows={2}
                style={{ width:"100%", padding:"9px 12px", background:"#050310",
                  border:`1px solid ${T.borderBright}`, borderRadius:4,
                  fontFamily:T.mono, fontSize:12, color:T.textBright, outline:"none", resize:"vertical" }}/>
            </div>

            <div style={{ background:"#050310", border:`1px solid ${T.border}`,
              borderRadius:4, padding:"10px 12px", marginBottom:12 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:4 }}>
                PRIVATE KEY (demo — never use real keys in UIs)
              </div>
              <div style={{ fontFamily:T.mono, fontSize:11, color:T.rose,
                wordBreak:"break-all" }}>{privKeyDemo}</div>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <Btn onClick={() => setShowSig(true)} color={T.violet} small>✍ Sign Message</Btn>
              {showSig && (
                <Btn onClick={() => setTampered(!tampered)}
                  color={tampered ? T.green : T.rose} small>
                  {tampered ? "↩ Restore Original" : "⚠ Tamper Message"}
                </Btn>
              )}
            </div>

            {showSig && (
              <div style={{ animation:"slideRight 0.3s ease" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <div>
                    <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                      MESSAGE HASH (keccak256 simulated)
                    </div>
                    <div style={{ background:"#050310", border:`1px solid ${T.violet}33`,
                      borderRadius:4, padding:"8px 10px", fontFamily:T.mono,
                      fontSize:10, color:T.violet, wordBreak:"break-all" }}>
                      {sigResult.msgHash}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                      SIGNATURE r (32 bytes)
                    </div>
                    <div style={{ background:"#050310", border:`1px solid ${T.rose}33`,
                      borderRadius:4, padding:"8px 10px", fontFamily:T.mono,
                      fontSize:10, color:T.rose, wordBreak:"break-all" }}>
                      {sigResult.r}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                    SIGNATURE s (32 bytes)
                  </div>
                  <div style={{ background:"#050310", border:`1px solid ${T.rose}33`,
                    borderRadius:4, padding:"8px 10px", fontFamily:T.mono,
                    fontSize:10, color:T.rose, wordBreak:"break-all" }}>
                    {sigResult.s}
                  </div>
                </div>

                <div style={{ background: verifyPasses ? T.greenFaint : T.roseFaint,
                  border:`1px solid ${verifyPasses ? T.green : T.red}55`,
                  borderRadius:6, padding:"14px 16px", animation:"fadeIn 0.3s ease" }}>
                  <div style={{ fontFamily:T.mono, fontSize:11, fontWeight:600,
                    color: verifyPasses ? T.green : T.red, marginBottom:8 }}>
                    {verifyPasses ? "✓ SIGNATURE VALID" : "✗ SIGNATURE INVALID — MESSAGE TAMPERED"}
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted }}>
                    Verifying against message: "{displayedMsg.slice(0,55)}{displayedMsg.length>55?"…":""}"
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginTop:4 }}>
                    Expected hash: {sigResult.msgHash.slice(0,32)}…
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10,
                    color: verifyPasses ? T.mint : T.red, marginTop:4 }}>
                    Computed hash: {verifyHash.slice(0,32)}…{" "}
                    {verifyPasses ? "(matches ✓)" : "(MISMATCH ✗)"}
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

// ─── SECTION: MERKLE TREES ────────────────────────────────────────────────────
const MerkleSection = () => {
  const DEFAULT_TXS = ["tx:Alice→Bob:1.0","tx:Carol→Dave:0.5","tx:Eve→Frank:3.0","tx:Grace→Heidi:0.2",
                        "tx:Ivan→Judy:0.8","tx:Karl→Lena:2.5","tx:Mia→Noah:0.1","tx:Oscar→Pam:4.0"];
  const [txs, setTxs] = useState(DEFAULT_TXS);
  const [newTx, setNewTx] = useState("");
  const [selectedLeaf, setSelectedLeaf] = useState(2);

  const levels = useMemo(() => buildMerkle(txs), [txs]);
  const proof  = useMemo(() => merkleProof(levels, selectedLeaf), [levels, selectedLeaf]);
  const proofSet = useMemo(() => new Set(proof.map(p => p.hash)), [proof]);
  const root   = levels[levels.length - 1]?.[0]?.hash || "";

  const addTx = () => {
    if (newTx.trim()) { setTxs(p => [...p, newTx.trim()]); setNewTx(""); setSelectedLeaf(txs.length); }
  };

  const getLevelColor = (lv) => [T.rose, T.violet, T.mint, T.gold, T.silver][lv % 5];

  return (
    <div style={{ animation:"fadeUp 0.45s ease" }}>
      <SecLabel>§4 — Cryptographic Primitives III</SecLabel>
      <H2>Merkle Trees & Proofs</H2>

      <Body>
        A <strong style={{color:T.mint}}>Merkle tree</strong> (named after Ralph Merkle, 1979)
        is a binary hash tree where each leaf is the hash of a data item, and each
        internal node is the hash of its two children. The root — <strong style={{color:T.mint}}>the Merkle root</strong> — is
        a single 32-byte value that cryptographically commits to every item in the set.
      </Body>

      <InfoBox title="The Core Insight" icon="◈" color={T.mint}>
        Changing <em>any</em> leaf changes every ancestor node up to the root.
        This means the Merkle root is a <strong>tamper-evident fingerprint of the entire transaction set</strong> —
        and yet you can prove any individual transaction is included using only
        log₂(N) sibling hashes, not the entire set.
      </InfoBox>

      <H3>Why blockchains need Merkle trees</H3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"12px 0" }}>
        {[
          { t:"Without Merkle trees", color:T.red,
            items:["Verify Tx in 4,096-tx block → download ALL 4,096 txs (~1 MB)",
                   "Light client must trust the full node's word",
                   "Mobile wallet impossible without trusting a server"] },
          { t:"With Merkle trees", color:T.mint,
            items:["Verify Tx in 4,096-tx block → download 12 hashes (384 bytes)",
                   "Light client verifies the math independently",
                   "SPV wallets: sync 80-byte headers only; prove payments on demand"] },
        ].map(p => (
          <div key={p.t} style={{ background:T.bg2, border:`1px solid ${p.color}33`,
            borderTop:`2px solid ${p.color}`, borderRadius:5, padding:"12px 14px" }}>
            <div style={{ fontFamily:T.mono, fontSize:10, color:p.color,
              fontWeight:600, marginBottom:8 }}>{p.t}</div>
            {p.items.map((v,i) => (
              <div key={i} style={{ fontFamily:T.body, fontSize:13, color:T.text,
                marginBottom:5, display:"flex", gap:8, lineHeight:1.5 }}>
                <span style={{ color:p.color, flexShrink:0 }}>•</span>{v}
              </div>
            ))}
          </div>
        ))}
      </div>

      <HR/>
      <H3 color={T.mint}>Interactive: Build & Prove</H3>
      <div style={{ background:T.bg2, border:`1px solid ${T.border}`,
        borderRadius:6, padding:"18px 20px", margin:"12px 0" }}>

        {/* Transaction list */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",
          gap:6, marginBottom:14 }}>
          {txs.map((tx, i) => (
            <div key={i} onClick={() => setSelectedLeaf(i)}
              style={{ background: i === selectedLeaf ? T.mint+"20" : T.bg3,
                border:`1px solid ${i === selectedLeaf ? T.mint : T.border}`,
                borderRadius:4, padding:"7px 10px", cursor:"pointer",
                transition:"all 0.15s" }}>
              <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted,
                marginBottom:2 }}>LEAF {i}</div>
              <div style={{ fontFamily:T.body, fontSize:12, color:T.textBright,
                lineHeight:1.4, wordBreak:"break-all" }}>{tx}</div>
            </div>
          ))}
        </div>

        {/* Add tx */}
        <div style={{ display:"flex", gap:8, marginBottom:18 }}>
          <input value={newTx} onChange={e => setNewTx(e.target.value)}
            placeholder="Add custom transaction (e.g. tx:Quinn→Rose:9.0)"
            onKeyDown={e => e.key === "Enter" && addTx()}
            style={{ flex:1, padding:"7px 11px", background:"#050310",
              border:`1px solid ${T.borderBright}`, borderRadius:4,
              fontFamily:T.mono, fontSize:11, color:T.textBright, outline:"none" }}/>
          <Btn onClick={addTx} small color={T.mint}>+ Add</Btn>
        </div>

        {/* Tree visualization */}
        <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted,
          marginBottom:10 }}>MERKLE TREE — click a leaf to see its proof path</div>

        {[...levels].reverse().map((level, revLv) => {
          const lv = levels.length - 1 - revLv;
          const isRoot = lv === levels.length - 1;
          const color = isRoot ? T.rose : getLevelColor(lv);
          return (
            <div key={lv} style={{ display:"flex", justifyContent:"center",
              gap: Math.max(4, 32 - lv * 6), marginBottom:8,
              flexWrap: lv === 0 ? "wrap" : "nowrap" }}>
              {level.map((node, idx) => {
                const isProof = proofSet.has(node.hash);
                const isSelected = lv === 0 && idx === selectedLeaf;
                const isOnPath = lv > 0 && (() => {
                  let i = selectedLeaf;
                  for (let l = 0; l < lv; l++) i = Math.floor(i / 2);
                  return i === idx;
                })();
                return (
                  <div key={idx}
                    style={{ background: isSelected ? T.mint+"28" : isOnPath ? T.violet+"20" : isProof ? T.gold+"20" : T.bg3,
                      border:`1px solid ${isSelected ? T.mint : isOnPath ? T.violet : isProof ? T.gold : color}55`,
                      borderRadius:3, padding:"4px 8px", textAlign:"center",
                      minWidth: lv === 0 ? 56 : 52, flexShrink:0, transition:"all 0.2s" }}>
                    <div style={{ fontFamily:T.mono, fontSize:8,
                      color: isSelected ? T.mint : isOnPath ? T.violet : isProof ? T.gold : color,
                      marginBottom:1, fontWeight: isOnPath||isSelected ? 700 : 400 }}>
                      {isRoot ? "ROOT" : lv === 0 ? `L${idx}` : `N${lv}.${idx}`}
                    </div>
                    <div style={{ fontFamily:T.mono, fontSize:8, color:T.textMuted }}>
                      {node.hash.slice(0,6)}…
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ display:"flex", gap:14, marginBottom:14, flexWrap:"wrap" }}>
          {[["Selected leaf",T.mint],["Proof path",T.violet],["Proof siblings",T.gold]].map(([l,c]) => (
            <div key={l} style={{ display:"flex", gap:5, alignItems:"center" }}>
              <div style={{ width:10, height:10, background:`${c}30`,
                border:`1px solid ${c}`, borderRadius:2 }}/>
              <span style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Proof display */}
        <div style={{ background:"#050310", border:`1px solid ${T.gold}33`,
          borderRadius:5, padding:"12px 14px" }}>
          <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold,
            letterSpacing:"0.1em", marginBottom:8 }}>
            MERKLE PROOF FOR LEAF {selectedLeaf} — {proof.length} hashes ({proof.length * 32} bytes)
          </div>
          {proof.map((p, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:5 }}>
              <Tag color={T.gold}>Step {i+1}</Tag>
              <span style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted }}>
                hash_{p.side === "right" ? "right" : "left"}: {p.hash.slice(0,20)}…
              </span>
            </div>
          ))}
          <div style={{ fontFamily:T.mono, fontSize:10, color:T.mint, marginTop:8 }}>
            Root: {root.slice(0,32)}…
          </div>
          <div style={{ fontFamily:T.body, fontSize:13, color:T.textMuted,
            marginTop:8, fontStyle:"italic" }}>
            Light client verifies: hash up the proof path, compare final result to block header's merkle_root.
            Total work: {proof.length} hash computations.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SECTION: KEYS & WALLETS ──────────────────────────────────────────────────
const WalletSection = () => {
  const [tab, setTab] = useState("derivation");
  return (
    <div style={{ animation:"fadeUp 0.45s ease" }}>
      <SecLabel>§5 — Applied Cryptography</SecLabel>
      <H2>Addresses, Keys & Wallets</H2>

      <Body>
        Understanding blockchain cryptography at the user level means understanding
        the <strong style={{color:T.gold}}>key derivation pipeline</strong> — how raw randomness
        becomes a private key, becomes a public key, becomes an address you share with others.
        Every step is a one-way function: derivable forward, computationally impossible to reverse.
      </Body>

      <div style={{ display:"flex", gap:0, border:`1px solid ${T.border}`,
        borderRadius:6, overflow:"hidden", margin:"16px 0 0" }}>
        {[["derivation","Key Derivation"],["wallets","Wallets & HD Keys"],["security","Key Management"]].map(([id,l]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex:1, padding:"10px", border:"none", cursor:"pointer",
              background: tab===id ? T.bg3 : T.bg2,
              color: tab===id ? T.gold : T.textMuted,
              fontFamily:T.mono, fontSize:11,
              borderBottom:`2px solid ${tab===id ? T.gold : "transparent"}`,
              transition:"all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderTop:"none",
        borderRadius:"0 0 6px 6px", padding:"20px", animation:"fadeIn 0.25s ease" }}>

        {tab === "derivation" && (
          <>
            <H3 color={T.gold}>From Entropy to Address — The Pipeline</H3>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {[
                { step:"1", label:"Entropy (Randomness)", color:T.rose,
                  desc:"256 bits from a cryptographically secure random source (hardware RNG, OS entropy pool). This is your seed. Treat it like cash.",
                  example:"Entropy: 0f 1a 2b 3c 4d 5e 6f ... (256 bits, 32 bytes)" },
                { step:"2", label:"Private Key", color:T.red,
                  desc:"The entropy IS the private key if it's in the valid range [1, n-1] where n is the secp256k1 curve order. For Bitcoin/Ethereum, almost all 256-bit numbers qualify.",
                  example:"privKey: 0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a" },
                { step:"3", label:"Public Key", color:T.violet,
                  desc:"Computed via elliptic curve point multiplication: pubKey = privKey × G where G is the generator point of secp256k1. This is ONE-WAY — you cannot recover privKey from pubKey without breaking ECDLP (Elliptic Curve Discrete Log Problem).",
                  example:"pubKey (uncompressed): 04 <64-byte X> <64-byte Y>  (65 bytes total)\npubKey (compressed):   02 <64-byte X>  or  03 <64-byte X>  (33 bytes)" },
                { step:"4a", label:"Ethereum Address", color:T.mint,
                  desc:"Take Keccak-256 of the 64-byte pubkey (X||Y, no 04 prefix). Take the LAST 20 bytes. Prepend 0x. Apply EIP-55 checksum (mixed case).",
                  example:"address = 0x + keccak256(X||Y)[-20 bytes]\n→ 0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
                { step:"4b", label:"Bitcoin Address", color:T.gold,
                  desc:"Hash160(pubKey) = RIPEMD-160(SHA-256(compressed_pubKey)). Add version byte (0x00 for mainnet). Compute checksum (first 4 bytes of SHA-256(SHA-256(payload))). Encode with Base58Check.",
                  example:"address = Base58Check(0x00 || RIPEMD160(SHA256(compressed_pubkey)))\n→ 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa  (genesis block)" },
              ].map((s, i, arr) => (
                <div key={s.step} style={{ display:"flex", gap:12 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%",
                      background:`${s.color}22`, border:`1px solid ${s.color}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:T.mono, fontSize:11, color:s.color, flexShrink:0 }}>
                      {s.step}
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width:1, flex:1, minHeight:16,
                        background:`${s.color}28`, margin:"4px 0" }}/>
                    )}
                  </div>
                  <div style={{ paddingBottom:14 }}>
                    <div style={{ fontFamily:T.mono, fontSize:11, color:s.color,
                      fontWeight:600, marginBottom:5 }}>{s.label}</div>
                    <div style={{ fontFamily:T.body, fontSize:13.5, color:T.text,
                      lineHeight:1.7, marginBottom:6 }}>{s.desc}</div>
                    <Code compact>{s.example}</Code>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "wallets" && (
          <>
            <H3 color={T.gold}>HD Wallets — One Seed, Infinite Keys</H3>
            <Body>
              Before HD wallets (BIP-32/39/44), every address required a separate random key — backup
              one, lose another. HD wallets derive all keys deterministically from a
              single <strong style={{color:T.gold}}>master seed</strong>, usually represented as a
              12–24 word mnemonic phrase.
            </Body>
            <Code title="BIP-32 Hierarchical Deterministic Derivation">{`# From mnemonic → master seed
mnemonic = "abandon abandon abandon ... about" (12 words from BIP-39 wordlist)
seed     = PBKDF2_HMAC_SHA512(mnemonic + passphrase, iterations=2048)

# Master key generation
I = HMAC_SHA512(key="Bitcoin seed", data=seed)
master_private_key = I[:32]   # left 32 bytes
master_chain_code  = I[32:]   # right 32 bytes

# Child key derivation at path m/44'/60'/0'/0/0 (Ethereum default)
# m       = master
# 44'     = purpose (hardened, BIP-44 standard)
# 60'     = coin type (Ethereum = 60, hardened)
# 0'      = account 0 (hardened)
# 0       = external chain (not hardened)
# 0       = first address index (not hardened)

# For HARDENED child (i >= 2^31):
I = HMAC_SHA512(key=parent_chain_code, data=0x00 || parent_PRIV_key || i)
child_key = (I[:32] + parent_priv_key) mod curve_order

# For NORMAL child (i < 2^31):
I = HMAC_SHA512(key=parent_chain_code, data=parent_PUB_key || i)
child_key = (I[:32] + parent_priv_key) mod curve_order

# Result: m/44'/60'/0'/0/0 → address[0], m/44'/60'/0'/0/1 → address[1], ...`}
            </Code>
            <InfoBox title="Hardened vs Normal Derivation" icon="◈" color={T.gold}>
              <strong>Normal derivation</strong> allows deriving child PUBLIC keys without the private key
              (useful for watch-only wallets, payment servers). BUT: if a normal child's private key
              leaks AND the parent chain code is known, the parent private key can be reconstructed.<br/><br/>
              <strong>Hardened derivation</strong> (apostrophe notation: 44') uses the private key in
              the HMAC — impossible to derive children without private key. No cascade attack possible.
              Best practice: harden all account-level keys.
            </InfoBox>
          </>
        )}

        {tab === "security" && (
          <>
            <H3 color={T.gold}>Key Management: Operational Realities</H3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"12px 0" }}>
              {[
                { t:"Custodial Wallet", color:T.red,
                  icon:"🏦", pro:"Convenient; recoverable if you lose password",
                  con:'You do not hold your private keys. "Not your keys, not your coins." Exchange can freeze, get hacked, or go bankrupt (FTX: $8B lost).' },
                { t:"Software Wallet", color:T.gold,
                  icon:"📱", pro:"Self-custody; free; convenient for daily use",
                  con:"Private key encrypted on your device. Malware, screen recorders, cloud backup sync, or lost/stolen device all pose risks." },
                { t:"Hardware Wallet", color:T.mint,
                  icon:"🔒", pro:"Private key never leaves the secure element chip. Signing happens on-device. Safe even on compromised computers.",
                  con:"Physical loss/damage without seed backup = total loss. Supply chain attack risk if purchased from unofficial sellers." },
                { t:"Paper/Metal Wallet", color:T.silver,
                  icon:"📄", pro:"Fully offline ('cold') storage. Immune to remote attacks. Metal versions survive fire/water.",
                  con:"Physical security becomes the entire threat model. Loss, theft, fire, or poor storage = irrecoverable loss." },
              ].map(p => (
                <div key={p.t} style={{ background:T.bg3, border:`1px solid ${p.color}28`,
                  borderTop:`2px solid ${p.color}`, borderRadius:5, padding:"12px 14px" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:18 }}>{p.icon}</span>
                    <span style={{ fontFamily:T.mono, fontSize:11, color:p.color,
                      fontWeight:600 }}>{p.t}</span>
                  </div>
                  <div style={{ fontFamily:T.body, fontSize:12, color:T.green,
                    marginBottom:5, lineHeight:1.5 }}>✦ {p.pro}</div>
                  <div style={{ fontFamily:T.body, fontSize:12, color:T.text,
                    lineHeight:1.5 }}>⚠ {p.con}</div>
                </div>
              ))}
            </div>
            <InfoBox title="The Golden Rule" icon="◈" color={T.rose}>
              Write down your 12/24-word seed phrase on paper (or metal). Store it in multiple
              physical locations. <strong>Never photograph it, type it into any website, or store it
              digitally.</strong> The seed phrase <em>is</em> your private key in human-readable form —
              anyone who has it has complete and irrevocable control of your funds.
            </InfoBox>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SECTION: INTERACTIVE LAB ─────────────────────────────────────────────────
const LabSection = () => {
  const [labTab, setLabTab] = useState("hashing");

  // ── Lab 1: Hash Explorer ─────────────────────────────────────────────────
  const [hashInput, setHashInput] = useState("Blockchain Cryptography 2024");
  const hash = useMemo(() => toyHash(hashInput), [hashInput]);
  const [compareWith, setCompareWith] = useState("Blockchain Cryptography 2025");
  const hash2 = useMemo(() => toyHash(compareWith), [compareWith]);
  const bDiff = useMemo(() => bitDiff(hash, hash2), [hash, hash2]);
  const emptyHash = useMemo(() => toyHash(""), []);
  const sameHash = useMemo(() => toyHash(hashInput), [hashInput]);

  // ── Lab 2: Key Pair Generator ─────────────────────────────────────────────
  const [seedInput, setSeedInput] = useState("my very secret seed phrase demo");
  const [generated, setGenerated] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!seedInput.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerated(deriveKeyPair(seedInput.trim()));
      setGenerating(false);
    }, 350);
  }, [seedInput]);

  // ── Lab 3: Sign & Verify ──────────────────────────────────────────────────
  const [sv_msg, setSvMsg]   = useState("Authorize withdrawal: 2.5 ETH to 0xBob");
  const [sv_seed, setSvSeed] = useState("lab-demo-private-key-seed-42");
  const [sv_result, setSvResult] = useState(null);
  const [sv_tamper, setSvTamper] = useState(false);

  const sv_kp = useMemo(() => deriveKeyPair(sv_seed), [sv_seed]);
  const handleSign = () => {
    const sig = signMsg(sv_msg, sv_kp.privKey);
    setSvResult(sig);
    setSvTamper(false);
  };
  const sv_verifyMsg = sv_tamper ? sv_msg + " [ATTACKER MODIFIED]" : sv_msg;
  const sv_verifyHash = useMemo(() => toyHash("MSG_HASH_SHA256:" + sv_verifyMsg), [sv_verifyMsg]);
  const sv_passes = sv_result && sv_verifyHash === sv_result.msgHash;

  return (
    <div style={{ animation:"fadeUp 0.45s ease" }}>
      <SecLabel>§6 — Hands-On Laboratory</SecLabel>
      <H2>Interactive Lab: Hash · KeyGen · Sign & Verify</H2>
      <Body>Three live experiments — everything computed in your browser with no external libraries.</Body>

      <div style={{ display:"flex", gap:0, border:`1px solid ${T.border}`,
        borderRadius:6, overflow:"hidden", margin:"16px 0 0" }}>
        {[["hashing","Lab 1: Hash Explorer"],["keygen","Lab 2: Key Pair Generator"],["signverify","Lab 3: Sign & Verify"]].map(([id,l]) => (
          <button key={id} onClick={() => setLabTab(id)}
            style={{ flex:1, padding:"11px 4px", border:"none", cursor:"pointer",
              background: labTab===id ? T.bg3 : T.bg2,
              color: labTab===id ? T.rose : T.textMuted,
              fontFamily:T.mono, fontSize:10, letterSpacing:"0.04em",
              borderBottom:`2px solid ${labTab===id ? T.rose : "transparent"}`,
              transition:"all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderTop:"none",
        borderRadius:"0 0 6px 6px", padding:"20px", animation:"fadeIn 0.25s ease" }}>

        {/* ── LAB 1: HASH EXPLORER ── */}
        {labTab === "hashing" && (
          <>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.rose, letterSpacing:"0.1em",
              marginBottom:12 }}>▸ OBJECTIVE: Observe determinism, fixed-size output, and the avalanche effect.</div>

            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:6 }}>
                INPUT A — type anything
              </div>
              <textarea value={hashInput} onChange={e => setHashInput(e.target.value)}
                rows={2} style={{ width:"100%", padding:"9px 12px", background:"#050310",
                  border:`1px solid ${T.borderBright}`, borderRadius:4,
                  fontFamily:T.mono, fontSize:12, color:T.textBright, outline:"none",
                  resize:"vertical", marginBottom:7 }}/>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                SHA-256 OUTPUT ({hash.length * 4} bits)
              </div>
              <div style={{ background:"#050310", border:`1px solid ${T.rose}33`,
                borderRadius:4, padding:"9px 12px", fontFamily:T.mono,
                fontSize:12, color:T.rose, letterSpacing:"0.04em",
                wordBreak:"break-all", animation:"hashReveal 0.15s ease" }}>
                {hash}
              </div>
            </div>

            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:6 }}>
                INPUT B — compare
              </div>
              <textarea value={compareWith} onChange={e => setCompareWith(e.target.value)}
                rows={2} style={{ width:"100%", padding:"9px 12px", background:"#050310",
                  border:`1px solid ${T.borderBright}`, borderRadius:4,
                  fontFamily:T.mono, fontSize:12, color:T.textBright, outline:"none",
                  resize:"vertical", marginBottom:7 }}/>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                SHA-256 OUTPUT
              </div>
              <div style={{ background:"#050310", border:`1px solid ${T.violet}33`,
                borderRadius:4, padding:"9px 12px", fontFamily:T.mono,
                fontSize:12, wordBreak:"break-all", lineHeight:1.7 }}>
                {hash2.split("").map((c, i) => (
                  <span key={i} style={{ color: c !== hash[i] ? T.violet : T.textMuted,
                    fontWeight: c !== hash[i] ? 600 : 400 }}>{c}</span>
                ))}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, margin:"12px 0" }}>
              {[
                { l:"Bits changed", v:`${bDiff}/256`, sub:`${Math.round(bDiff/256*100)}%`, color:T.rose },
                { l:"Chars changed", v:`${hash.split("").filter((c,i)=>c!==hash2[i]).length}/64`,
                  sub:`${Math.round(hash.split("").filter((c,i)=>c!==hash2[i]).length/64*100)}%`, color:T.violet },
                { l:"Ideal avalanche", v:"~128 bits", sub:"≈50%", color:T.mint },
              ].map(r => (
                <div key={r.l} style={{ background:T.bg3, border:`1px solid ${r.color}28`,
                  borderRadius:4, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted, marginBottom:4 }}>{r.l}</div>
                  <div style={{ fontFamily:T.disp, fontSize:20, color:r.color, fontWeight:700 }}>{r.v}</div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted }}>{r.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, margin:"12px 0" }}>
              <div style={{ background:T.bg3, border:`1px solid ${T.border}`,
                borderRadius:4, padding:"10px 12px" }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                  DETERMINISM CHECK: hash(A) twice
                </div>
                <div style={{ fontFamily:T.mono, fontSize:9, color: sameHash === hash ? T.green : T.red }}>
                  {sameHash === hash ? "✓ Identical — deterministic" : "✗ Different — NOT deterministic"}
                </div>
                <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted,
                  wordBreak:"break-all", marginTop:3 }}>
                  {sameHash.slice(0,20)}…
                </div>
              </div>
              <div style={{ background:T.bg3, border:`1px solid ${T.border}`,
                borderRadius:4, padding:"10px 12px" }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                  EMPTY STRING HASH
                </div>
                <div style={{ fontFamily:T.mono, fontSize:9, color:T.silver,
                  wordBreak:"break-all", lineHeight:1.5 }}>
                  {emptyHash}
                </div>
                <div style={{ fontFamily:T.mono, fontSize:8, color:T.textMuted, marginTop:3 }}>
                  (non-zero! empty input still has a unique fingerprint)
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── LAB 2: KEY PAIR GENERATOR ── */}
        {labTab === "keygen" && (
          <>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.rose, letterSpacing:"0.1em",
              marginBottom:12 }}>
              ▸ OBJECTIVE: Observe one-way key derivation: seed → private key → public key → address.
            </div>

            <InfoBox title="Demo Only" icon="⚠" color={T.red}>
              This uses a simplified hash-based simulation for educational purposes.
              Real key derivation uses secp256k1 elliptic curve multiplication — computationally equivalent
              in terms of one-way properties, but with standardized, audited cryptography.
              <strong> Never use these outputs for real funds.</strong>
            </InfoBox>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                SEED PHRASE / ENTROPY SOURCE
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={seedInput} onChange={e => setSeedInput(e.target.value)}
                  placeholder="Enter any seed phrase..."
                  style={{ flex:1, padding:"9px 12px", background:"#050310",
                    border:`1px solid ${T.borderBright}`, borderRadius:4,
                    fontFamily:T.mono, fontSize:12, color:T.textBright, outline:"none" }}/>
                <Btn onClick={handleGenerate} disabled={generating} color={T.gold}>
                  {generating ? "⟳ Deriving…" : "⚗ Generate Keys"}
                </Btn>
              </div>
            </div>

            {generated && (
              <div style={{ animation:"fadeUp 0.35s ease" }}>
                {/* Derivation pipeline visual */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { label:"SEED INPUT", color:T.silver,
                      value:generated.seed, icon:"🎲",
                      note:"Your passphrase — the source of entropy" },
                    { label:"PRIVATE KEY (256-bit)", color:T.rose,
                      value:generated.privKey, icon:"🔐",
                      note:"SECRET — never share. Grants complete control over funds." },
                    { label:"PUBLIC KEY (Uncompressed, 520-bit)", color:T.violet,
                      value:generated.pubKeyUncomp.slice(0,66)+"…"+generated.pubKeyUncomp.slice(-8),
                      icon:"🔓", note:"Safe to share. 04 || X (32 bytes) || Y (32 bytes)" },
                    { label:"PUBLIC KEY (Compressed, 264-bit)", color:T.mint,
                      value:generated.pubKeyComp, icon:"🗜",
                      note:"Compact form. Prefix 02=even Y, 03=odd Y. Used in Bitcoin addresses." },
                    { label:"ETHEREUM ADDRESS (160-bit)", color:T.gold,
                      value:generated.ethAddr, icon:"⟠",
                      note:"Last 20 bytes of Keccak-256(pubX||pubY). Add 0x prefix." },
                    { label:"BITCOIN ADDRESS (Base58Check)", color:T.green,
                      value:generated.btcAddr, icon:"₿",
                      note:"Base58Check( 0x00 || RIPEMD160(SHA256(compressed_pubkey)) )" },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{ display:"flex", gap:10 }}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:16, flexShrink:0, lineHeight:1 }}>{row.icon}</div>
                        {i < arr.length - 1 && (
                          <div style={{ width:1, flex:1, minHeight:12,
                            background:`${row.color}30`, margin:"4px 0" }}/>
                        )}
                      </div>
                      <div style={{ flex:1, paddingBottom:4 }}>
                        <div style={{ fontFamily:T.mono, fontSize:9, color:row.color,
                          letterSpacing:"0.1em", marginBottom:3 }}>{row.label}</div>
                        <div style={{ background:"#050310", border:`1px solid ${row.color}30`,
                          borderRadius:3, padding:"6px 10px", fontFamily:T.mono,
                          fontSize:10, color:row.color, wordBreak:"break-all",
                          letterSpacing:"0.03em" }}>
                          {row.value}
                        </div>
                        <div style={{ fontFamily:T.body, fontSize:11, color:T.textMuted,
                          marginTop:3 }}>{row.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:14, background:T.bg3,
                  border:`1px solid ${T.border}`, borderRadius:4, padding:"10px 14px" }}>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted }}>
                    ⟳ Try different seeds — notice how every character change produces completely different keys (deterministic chaos)
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── LAB 3: SIGN & VERIFY ── */}
        {labTab === "signverify" && (
          <>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.rose, letterSpacing:"0.1em",
              marginBottom:12 }}>
              ▸ OBJECTIVE: Sign a message, observe the signature, tamper the message, watch verification fail.
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                  SIGNER'S SEED (generates key pair)
                </div>
                <input value={sv_seed} onChange={e => { setSvSeed(e.target.value); setSvResult(null); }}
                  style={{ width:"100%", padding:"8px 11px", background:"#050310",
                    border:`1px solid ${T.borderBright}`, borderRadius:4,
                    fontFamily:T.mono, fontSize:11, color:T.rose, outline:"none" }}/>
                <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted, marginTop:4 }}>
                  Private key: {sv_kp.privKey.slice(0,20)}…
                </div>
              </div>
              <div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                  PUBLIC ADDRESS (derived)
                </div>
                <div style={{ background:"#050310", border:`1px solid ${T.violet}33`,
                  borderRadius:4, padding:"8px 11px", fontFamily:T.mono,
                  fontSize:11, color:T.violet, wordBreak:"break-all" }}>
                  {sv_kp.ethAddr}
                </div>
                <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted, marginTop:4 }}>
                  Ethereum address (share publicly)
                </div>
              </div>
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:5 }}>
                MESSAGE TO SIGN
              </div>
              <textarea value={sv_msg} onChange={e => { setSvMsg(e.target.value); setSvResult(null); setSvTamper(false); }}
                rows={2}
                style={{ width:"100%", padding:"8px 11px", background:"#050310",
                  border:`1px solid ${T.borderBright}`, borderRadius:4,
                  fontFamily:T.mono, fontSize:12, color:T.textBright, outline:"none", resize:"vertical" }}/>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <Btn onClick={handleSign} color={T.violet} small>✍ Sign with Private Key</Btn>
              {sv_result && (
                <Btn onClick={() => setSvTamper(!sv_tamper)}
                  color={sv_tamper ? T.green : T.rose} small>
                  {sv_tamper ? "↩ Restore" : "⚠ Simulate Attack (tamper message)"}
                </Btn>
              )}
            </div>

            {sv_result && (
              <div style={{ animation:"slideRight 0.3s ease" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <div>
                    <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted, marginBottom:4 }}>
                      MESSAGE HASH (keccak256)
                    </div>
                    <div style={{ background:"#050310", border:`1px solid ${T.mint}33`,
                      borderRadius:3, padding:"7px 10px", fontFamily:T.mono,
                      fontSize:9, color:T.mint, wordBreak:"break-all" }}>
                      {sv_result.msgHash}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted, marginBottom:4 }}>
                      SIGNATURE r || s (64 + 64 bytes)
                    </div>
                    <div style={{ background:"#050310", border:`1px solid ${T.rose}33`,
                      borderRadius:3, padding:"7px 10px", fontFamily:T.mono,
                      fontSize:9, color:T.rose, wordBreak:"break-all" }}>
                      r: {sv_result.r.slice(0,24)}…<br/>s: {sv_result.s.slice(0,24)}…
                    </div>
                  </div>
                </div>

                <div style={{ background: sv_passes ? T.greenFaint : T.roseFaint,
                  border:`1px solid ${sv_passes ? T.green : T.red}55`,
                  borderRadius:6, padding:"14px 16px", animation:"fadeIn 0.3s ease" }}>
                  <div style={{ fontFamily:T.mono, fontSize:12, fontWeight:700,
                    color: sv_passes ? T.green : T.red, marginBottom:8 }}>
                    {sv_passes ? "✓ SIGNATURE VALID — Transaction Authorized" : "✗ SIGNATURE INVALID — Attack Detected"}
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:4 }}>
                    Message being verified: "{sv_verifyMsg.slice(0,60)}{sv_verifyMsg.length>60?"…":""}"
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted, marginBottom:2 }}>
                    Expected msg_hash: {sv_result.msgHash.slice(0,32)}…
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10,
                    color: sv_passes ? T.mint : T.red, marginBottom:8 }}>
                    Computed msg_hash: {sv_verifyHash.slice(0,32)}…{" "}
                    {sv_passes ? "✓ match" : "✗ MISMATCH"}
                  </div>
                  {!sv_passes && (
                    <div style={{ fontFamily:T.body, fontSize:13, color:T.text,
                      borderTop:`1px solid ${T.border}`, paddingTop:8 }}>
                      The attacker changed the message, but the signature was computed over the original
                      message hash. The hashes don't match → the node rejects this transaction completely.
                      The attacker would need Alice's private key to produce a valid signature for
                      the tampered message.
                    </div>
                  )}
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

  const bySec = QUIZZES.reduce((acc, q, i) => {
    (acc[q.sec] = acc[q.sec] || []).push({ ...q, idx:i });
    return acc;
  }, {});

  const allAnswered = QUIZZES.every((_, i) => revealed[i]);

  return (
    <div style={{ animation:"fadeUp 0.45s ease" }}>
      <SecLabel>§7 — Knowledge Checks</SecLabel>
      <H2>In-Class Quizzes</H2>
      <Body>Select an answer, then click Submit to see the explanation. Score is calculated once all questions are answered.</Body>

      {score !== null && (
        <div style={{ background: score >= 6 ? T.greenFaint : score >= 4 ? T.goldFaint : T.roseFaint,
          border:`1px solid ${score>=6?T.green:score>=4?T.gold:T.rose}55`,
          borderRadius:7, padding:"18px 22px", margin:"16px 0", textAlign:"center",
          animation:"fadeUp 0.4s ease" }}>
          <div style={{ fontFamily:T.disp, fontSize:44, fontWeight:900,
            color: score>=6?T.green:score>=4?T.gold:T.rose }}>{score}/{QUIZZES.length}</div>
          <div style={{ fontFamily:T.mono, fontSize:12, color:T.text, marginTop:8 }}>
            {score===QUIZZES.length
              ? "Perfect. You have mastered the cryptographic foundations of blockchain."
              : score>=6 ? "Strong understanding. Review any missed explanations carefully."
              : score>=4 ? "Good foundation. Re-read §2–§5 before the assessment."
              : "Revisit the chapter content and retry."}
          </div>
        </div>
      )}

      {Object.entries(bySec).map(([sec, qs]) => (
        <div key={sec} style={{ marginBottom:28 }}>
          <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:"0.14em",
            margin:"22px 0 12px", borderBottom:`1px solid ${T.border}`, paddingBottom:8 }}>
            {sec}
          </div>
          {qs.map(q => {
            const i = q.idx;
            const isRev = revealed[i];
            const ok = answers[i] === q.ans;
            return (
              <div key={i} style={{ background:T.bg2,
                border:`1px solid ${isRev?(ok?T.green+"55":T.red+"55"):T.border}`,
                borderRadius:6, padding:"16px 18px", marginBottom:14,
                animation:"fadeIn 0.3s ease" }}>
                <div style={{ fontFamily:T.body, fontSize:15, color:T.textBright,
                  marginBottom:14, lineHeight:1.75 }}>
                  <span style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted,
                    marginRight:8 }}>Q{i+1}.</span>
                  {q.q}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {q.opts.map((opt, oi) => {
                    let bg=T.bg3, border=T.border, color=T.text;
                    if (isRev) {
                      if (oi===q.ans) { bg=T.green+"1a"; border=T.green; color=T.green; }
                      else if (oi===answers[i]&&oi!==q.ans) { bg=T.roseFaint; border=T.red; color=T.red; }
                    } else if (answers[i]===oi) {
                      bg=T.roseFaint; border=T.rose; color=T.rose;
                    }
                    return (
                      <button key={oi}
                        onClick={() => !isRev && setAnswers(p => ({...p,[i]:oi}))}
                        style={{ background:bg, border:`1px solid ${border}`, borderRadius:5,
                          padding:"9px 13px", cursor:isRev?"default":"pointer",
                          textAlign:"left", fontFamily:T.body, fontSize:13.5, color,
                          lineHeight:1.55, transition:"all 0.15s" }}>
                        <span style={{ fontFamily:T.mono, fontSize:10,
                          color:T.textMuted, marginRight:9 }}>
                          {String.fromCharCode(65+oi)}.
                        </span>
                        {opt}
                        {isRev && oi===q.ans && <span style={{ marginLeft:8, fontSize:12 }}>✓</span>}
                        {isRev && oi===answers[i] && oi!==q.ans && <span style={{ marginLeft:7, fontSize:12 }}>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {!isRev && (
                  <button onClick={() => answers[i]!==undefined && setRevealed(p=>({...p,[i]:true}))}
                    disabled={answers[i]===undefined}
                    style={{ marginTop:11, padding:"7px 18px",
                      background:answers[i]!==undefined?T.roseFaint:T.bg3,
                      border:`1px solid ${answers[i]!==undefined?T.rose+"55":T.border}`,
                      borderRadius:4, cursor:answers[i]!==undefined?"pointer":"default",
                      color:answers[i]!==undefined?T.rose:T.textMuted,
                      fontFamily:T.mono, fontSize:10, fontWeight:600, transition:"all 0.2s" }}>
                    Submit Answer
                  </button>
                )}
                {isRev && (
                  <div style={{ marginTop:12, background:"#050310", borderRadius:5,
                    padding:"11px 13px", borderLeft:`3px solid ${ok?T.green:T.gold}`,
                    animation:"slideRight 0.3s ease" }}>
                    <div style={{ fontFamily:T.mono, fontSize:9, letterSpacing:"0.1em",
                      color:ok?T.green:T.gold, marginBottom:6 }}>
                      {ok?"✓ CORRECT":"✗ INCORRECT"} — EXPLANATION
                    </div>
                    <div style={{ fontFamily:T.body, fontSize:13.5, color:T.text,
                      lineHeight:1.75 }}>{q.explain}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {allAnswered && score === null && (
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <button onClick={() => setScore(QUIZZES.filter((_,i)=>answers[i]===QUIZZES[i].ans).length)}
            style={{ padding:"11px 34px", background:T.rose, color:T.bg0,
              border:"none", borderRadius:5, cursor:"pointer",
              fontFamily:T.mono, fontSize:12, fontWeight:700, letterSpacing:"0.1em" }}>
            CALCULATE SCORE
          </button>
        </div>
      )}
    </div>
  );
};

// ─── SECTION: ASSESSMENT ─────────────────────────────────────────────────────
const AssessSection = () => {
  const [revealed, setRevealed] = useState({});
  return (
    <div style={{ animation:"fadeUp 0.45s ease" }}>
      <SecLabel>§8 — Assessment Problems</SecLabel>
      <H2>End-of-Chapter Problems</H2>
      <Body>Five graded problems suitable for homework, exams, or seminar discussion. Ordered by difficulty. Attempt independently before revealing the model answer.</Body>

      <div style={{ display:"flex", gap:8, margin:"14px 0 22px", flexWrap:"wrap" }}>
        {[[T.green,"Foundational"],[T.gold,"Intermediate"],[T.red,"Advanced"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, background:c, borderRadius:2 }}/>
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.textMuted }}>{l}</span>
          </div>
        ))}
      </div>

      {ASSESSMENTS.map(a => (
        <div key={a.id} style={{ background:T.bg2, border:`1px solid ${T.border}`,
          borderLeft:`3px solid ${a.color}`, borderRadius:6,
          padding:"18px 20px", marginBottom:18, animation:"fadeUp 0.4s ease" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
            <span style={{ fontFamily:T.disp, fontSize:22, fontWeight:900,
              color:a.color, letterSpacing:"0.05em" }}>{a.id}</span>
            <Tag color={a.color}>{a.diff}</Tag>
          </div>
          <div style={{ fontFamily:T.body, fontSize:15.5, color:T.textBright,
            lineHeight:1.82, marginBottom:14 }}>{a.problem}</div>
          <Btn onClick={() => setRevealed(p => ({...p,[a.id]:!p[a.id]}))}
            color={a.color} small>
            {revealed[a.id] ? "▲ Hide Answer" : "▼ Reveal Model Answer"}
          </Btn>
          {revealed[a.id] && (
            <div style={{ marginTop:14, animation:"slideRight 0.3s ease" }}>
              <div style={{ fontFamily:T.mono, fontSize:9, color:a.color,
                letterSpacing:"0.14em", marginBottom:9 }}>MODEL ANSWER</div>
              <Code title={`${a.id} — Model Answer`}>{a.answer}</Code>
            </div>
          )}
        </div>
      ))}

      <InfoBox title="Further Reading" icon="◈" color={T.violet}>
        <strong>Seminal papers:</strong> Merkle, R. (1979). Secrecy, Authentication, and Public Key Systems (PhD Thesis). · Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System (§4 Proof-of-Work, §7 Reclaiming Disk Space).<br/><br/>
        <strong>Standards:</strong> NIST FIPS 180-4 (SHA-2). · SEC 2 (secp256k1 curve parameters). · BIP-32/39/44 (HD wallets).<br/><br/>
        <strong>Accessible books:</strong> Antonopoulos (2017) Mastering Bitcoin, Ch. 4 (Keys, Addresses) and Ch. 7 (Transactions). · Boneh & Shoup (2023) A Graduate Course in Applied Cryptography (free online) — Chapters 8 (hash functions) and 13 (digital signatures).
      </InfoBox>
    </div>
  );
};

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function CryptographyForBlockchains() {
  const [active, setActive] = useState("intro");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [active]);

  const SECTIONS = {
    intro:   <IntroSection/>,
    hash:    <HashSection/>,
    pubkey:  <PubKeySection/>,
    merkle:  <MerkleSection/>,
    wallets: <WalletSection/>,
    lab:     <LabSection/>,
    quiz:    <QuizSection/>,
    assess:  <AssessSection/>,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ display:"flex", height:"100vh", background:T.bg0,
        color:T.text, overflow:"hidden" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width:218, background:T.bg1, borderRight:`1px solid ${T.border}`,
          display:"flex", flexDirection:"column", flexShrink:0 }}>

          {/* Header */}
          <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontFamily:T.mono, fontSize:8, color:T.textMuted,
              letterSpacing:"0.24em", textTransform:"uppercase", marginBottom:8 }}>
              ACM Educational Series
            </div>
            <div style={{ fontFamily:T.disp, fontSize:15, fontWeight:700,
              color:T.textBright, lineHeight:1.3, marginBottom:3, letterSpacing:"0.05em" }}>
              Cryptography<br/>for Blockchains
            </div>
            <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted, marginBottom:10 }}>
              No Heavy Math
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:T.rose,
                animation:"blink 1.8s ease infinite" }}/>
              <span style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted }}>
                Chapter 3 · Live
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
            {CHAPTERS.map(ch => (
              <button key={ch.id} onClick={() => setActive(ch.id)}
                style={{ width:"100%", padding:"9px 14px",
                  background: active===ch.id ? `${T.rose}12` : "none",
                  border:"none",
                  borderLeft:`3px solid ${active===ch.id ? T.rose : "transparent"}`,
                  cursor:"pointer", textAlign:"left",
                  display:"flex", gap:10, alignItems:"center",
                  transition:"all 0.15s" }}>
                <span style={{ fontFamily:T.mono, fontSize:9,
                  color: active===ch.id ? T.rose : T.textMuted, minWidth:18 }}>
                  {ch.short}
                </span>
                <span style={{ fontFamily:T.body, fontSize:13,
                  color: active===ch.id ? T.textBright : T.textMuted,
                  lineHeight:1.3 }}>
                  {ch.label.replace(/^§\d+ /, "")}
                </span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontFamily:T.mono, fontSize:9, color:T.textMuted, lineHeight:1.75 }}>
              8 Quizzes · 5 Problems<br/>
              3 Interactive Labs<br/>
              Distributed Systems
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div ref={contentRef}
          style={{ flex:1, overflowY:"auto", padding:"38px 46px",
            maxWidth:860, margin:"0 auto", width:"100%" }}>
          {SECTIONS[active]}

          {/* Prev / Next */}
          <div style={{ display:"flex", justifyContent:"space-between",
            marginTop:44, paddingTop:22, borderTop:`1px solid ${T.border}` }}>
            {(() => {
              const idx = CHAPTERS.findIndex(c => c.id === active);
              const prev = CHAPTERS[idx - 1];
              const next = CHAPTERS[idx + 1];
              return (
                <>
                  {prev
                    ? <Btn onClick={() => setActive(prev.id)} color={T.textMuted} small>← {prev.label}</Btn>
                    : <div/>}
                  {next && (
                    <Btn onClick={() => setActive(next.id)} color={T.rose} small>{next.label} →</Btn>
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
