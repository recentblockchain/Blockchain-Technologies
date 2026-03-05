import React, { useState } from "react";
import Footer from "../src/Footer";

/**
 * ACM-Style Chapter Activity
 * Execution and State Models (UTXO vs Account-Based)
 * Single component, default export.
 */
export default function ExecutionStateModels() {
  const [section, setSection] = useState("intro");

  const sections = [
    { id: "intro", label: "Chapter Overview" },
    { id: "models", label: "UTXO vs Account Model" },
    { id: "evm", label: "Ethereum / EVM" },
    { id: "gas", label: "Gas & Cost Engineering" },
    { id: "lab", label: "Lab: Local Transactions & Gas" },
    { id: "assessment", label: "Assessment & Answers" }
  ];

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        padding: "1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
        lineHeight: 1.6
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "0.25rem" }}>
        Execution and State Models in Blockchain Systems
      </h1>
      <h2
        style={{
          textAlign: "center",
          fontWeight: 400,
          fontSize: "1.1rem",
          marginTop: 0
        }}
      >
        UTXO vs Account-Based Models – ACM-Style Chapter Activity
      </h2>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
          margin: "1.5rem 0"
        }}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: 4,
              border: section === s.id ? "2px solid #0077bb" : "1px solid #ccc",
              background: section === s.id ? "#e8f6ff" : "#f8f8f8",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {section === "intro" && <Intro />}
      {section === "models" && <Models />}
      {section === "evm" && <EVM />}
      {section === "gas" && <GasSection />}
      {section === "lab" && <Lab />}
      {section === "assessment" && <Assessment />}
    </div>
  );
}

/* Reusable helpers */

function QuizMCQ({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const styleForOption = (idx) => {
    const base = {
      padding: "0.4rem 0.6rem",
      margin: "0.2rem 0",
      borderRadius: 4,
      border: "1px solid #ccc",
      cursor: "pointer",
      display: "flex",
      alignItems: "flex-start",
      gap: "0.4rem",
      textAlign: "left",
      background: "#fff"
    };
    if (!submitted) {
      if (idx === selected) {
        return { ...base, borderColor: "#0077bb", background: "#eef7ff" };
      }
      return base;
    }
    if (idx === correctIndex) {
      return { ...base, borderColor: "#1b8a2f", background: "#e7f7eb" };
    }
    if (idx === selected && idx !== correctIndex) {
      return { ...base, borderColor: "#c52828", background: "#fdeaea" };
    }
    return base;
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 6,
        padding: "0.75rem 0.9rem",
        margin: "1rem 0",
        background: "#fafafa"
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
        Check your understanding
      </div>
      <div style={{ marginBottom: "0.5rem" }}>{question}</div>
      <div>
        {options.map((opt, idx) => (
          <div
            key={idx}
            style={styleForOption(idx)}
            onClick={() => !submitted && setSelected(idx)}
          >
            <span style={{ fontWeight: 600 }}>
              {String.fromCharCode(65 + idx)}.
            </span>
            <span>{opt}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitted || selected === null}
        style={{
          marginTop: "0.5rem",
          padding: "0.3rem 0.8rem",
          borderRadius: 4,
          border: "none",
          background: submitted ? "#ccc" : "#0077bb",
          color: "white",
          cursor:
            selected === null || submitted ? "not-allowed" : "pointer",
          fontSize: "0.85rem"
        }}
      >
        {submitted ? "Submitted" : "Submit answer"}
      </button>
      {submitted && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
          <strong>
            {selected === correctIndex ? "Correct:" : "Explanation:"}
          </strong>{" "}
          {explanation}
        </div>
      )}
    </div>
  );
}

function ExampleBox({ title, description, bullets }) {
  return (
    <div
      style={{
        borderLeft: "4px solid #0077bb",
        padding: "0.75rem 0.9rem",
        margin: "1rem 0",
        background: "#f4f9ff"
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: "0.95rem", marginTop: "0.25rem" }}>
        {description}
      </div>
      <ul style={{ marginTop: "0.4rem", paddingLeft: "1.25rem" }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: "0.2rem" }}>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Sections */

function Intro() {
  return (
    <section>
      <h3>1. Chapter Overview</h3>
      <p>
        This chapter examines execution and state models in blockchain
        systems, focusing on the unspent transaction output (UTXO) model
        and the account-based model used by Ethereum and many EVM
       -compatible chains.[web:49][web:53][web:48] It highlights how these models affect programmability, parallelism, and privacy, and why gas, as a resource budget, is fundamental to correctness in account-based execution environments.[web:49][web:53][web:45][web:48]
      </p>
      <p>
        By the end of this module you should be able to explain the key
        differences between UTXO and account-based models, describe the
        Ethereum Virtual Machine conceptually, interpret gas usage as a
        cost and safety constraint, and reason about how simple local
        transactions and receipts illustrate gas drivers.[web:49][web:53][web:45][web:48]
      </p>

      <ExampleBox
        title="Motivating scenario: Two ways to track money"
        description="Imagine a digital cafe wallet system for students."
        bullets={[
          "UTXO-style: Each payment creates new 'receipts' (outputs) that must be fully spent later, with change routed to a new output.",
          "Account-style: Each student has an account balance; payments simply debit one balance and credit another.",
          "Both can represent the same payments, but they differ in how state is modeled and updated."
        ]}
      />

      <QuizMCQ
        question="Which statement best captures the state representation difference at a high level?"
        options={[
          "UTXO model tracks only smart contracts, account model tracks only user balances.",
          "UTXO model tracks owned outputs as discrete units, account model tracks aggregate balances per address.",
          "UTXO model has no cryptography, account model does.",
          "UTXO model cannot support any form of scripting."
        ]}
        correctIndex={1}
        explanation="In the UTXO model, state is represented as a set of unspent outputs; in the account model, global state maps each account to its current balance and storage.[web:49][web:53][web:48]"
      />
    </section>
  );
}

function Models() {
  return (
    <section>
      <h3>2. UTXO Model vs Account Model</h3>
      <p>
        In the UTXO model, each transaction consumes one or more
        existing unspent outputs and produces new outputs that may later
        be spent, so the global state is the set of all unspent
        outputs.[web:49][web:53][web:57] In the account-based model, the
        blockchain maintains a mapping from account addresses to
        balances and other state, and each transaction directly
        increments or decrements these balances.[web:48][web:56]
      </p>
      <p>
        These structural differences influence programmability,
        parallelism, and privacy properties of the system, which in turn
        inform which applications are best suited to each model.[web:49][web:53][web:57] UTXO-based designs often support high parallelism and good baseline privacy, while account-based designs favor expressive smart contracts and shared-state protocols.[web:49][web:53][web:48]
      </p>

      <h4>2.1 Programmability</h4>
      <ul>
        <li>
          UTXO scripts typically operate on individual outputs and
          provide conditions for spending them, which is powerful but
          less convenient for complex, shared-state protocols.[web:49][web:53]
        </li>
        <li>
          Account-based systems naturally support rich smart contracts
          that maintain internal state across many interactions, making
          it easier to build lending, automated market makers, and other
          stateful protocols.[web:48][web:56]
        </li>
      </ul>

      <h4>2.2 Parallelism</h4>
      <ul>
        <li>
          Independent UTXOs can often be spent in parallel, because they
          represent separate state fragments that do not interfere with
          one another, supporting higher throughput under suitable
          designs.[web:53][web:57]
        </li>
        <li>
          Account-based chains maintain a single logical state per
          account, so two transactions that modify the same account must
          be ordered consistently, which constrains parallel execution
          unless additional techniques are used.[web:53][web:48]
        </li>
      </ul>

      <h4>2.3 Privacy Implications</h4>
      <ul>
        <li>
          UTXO systems encourage using new addresses and change outputs,
          which can make it harder to link all outputs to a single user,
          although advanced analysis can still reveal patterns.[web:49][web:57]
        </li>
        <li>
          Account-based systems expose evolving balances and activity at
          stable addresses, which is convenient but can simplify
          linkage and profiling if no additional privacy measures are
          applied.[web:49][web:53][web:48]
        </li>
      </ul>

      <ExampleBox
        title="Example: Paying a friend in UTXO vs account model"
        description="Compare sending 5 units from Alice to Bob."
        bullets={[
          "UTXO: Alice selects a 7-unit UTXO as input, sends 5 units to Bob and 2 units back to a change address she controls.",
          "Account: Alice’s account balance decreases by 5 units, Bob’s increases by 5 units; no explicit change output is needed.",
          "Analyzing which model reveals more about Alice’s long-term balance trajectory is a privacy design question."
        ]}
      />

      <QuizMCQ
        question="Why can UTXO-based systems often parallelize transaction validation more easily than account-based systems?"
        options={[
          "Because UTXO systems have no global state at all.",
          "Because the same UTXO can be spent by multiple transactions simultaneously.",
          "Because independent UTXOs represent disjoint pieces of state that can be processed without conflicts.",
          "Because UTXO nodes ignore double-spends until later."
        ]}
        correctIndex={2}
        explanation="Independent UTXOs can be validated in parallel as long as no two transactions attempt to spend the same output, whereas account-based systems must serialize conflicting updates to the same account state.[web:53][web:57]"
      />
    </section>
  );
}

function EVM() {
  return (
    <section>
      <h3>3. Ethereum / EVM as Canonical Account-Based Execution</h3>
      <p>
        Ethereum uses an account-based model where global state is a
        mapping from account addresses to balances, nonces, contract
        code, and persistent storage.[web:48][web:56] The Ethereum Virtual
        Machine (EVM) is a deterministic execution environment that
        processes transactions by running bytecode on this state,
        ensuring that all nodes arrive at the same post-transaction
        state given the same inputs.[web:48][web:45]
      </p>
      <p>
        There are two primary account types: externally owned accounts,
        which are controlled by private keys and initiate transactions,
        and contract accounts, which contain code that executes when
        invoked and can modify storage and interact with other
        contracts.[web:56][web:48] This model makes Ethereum a general-purpose execution platform rather than a payment-only ledger.[web:48][web:45]
      </p>

      <h4>3.1 Conceptual EVM Execution</h4>
      <ul>
        <li>
          A transaction specifies a sender, recipient or contract,
          value, gas limit and fee parameters, and optional input
          data.[web:48][web:45]
        </li>
        <li>
          All nodes validate the transaction, execute the corresponding
          EVM code step by step, charge gas for each operation, and
          update the global state if execution completes successfully.[web:45][web:48]
        </li>
        <li>
          If execution runs out of gas, state changes made during that
          execution are reverted, but the gas spent up to that point is
          still charged.[web:45][web:44]
        </li>
      </ul>

      <ExampleBox
        title="Example: Simple token transfer in an EVM-based chain"
        description="Conceptual steps for a transfer method in a token contract."
        bullets={[
          "User sends a transaction calling transfer(to, amount) on the token contract.",
          "EVM loads the sender’s and recipient’s balances from contract storage.",
          "EVM checks that the sender has enough balance, subtracts amount from sender, adds to recipient, updates storage, and returns a success flag."
        ]}
      />

      <QuizMCQ
        question="In Ethereum’s account-based model, which statement is accurate?"
        options={[
          "Only contract accounts can hold balances.",
          "Each account has a nonce to ensure transactions are processed in a unique, ordered sequence.",
          "Accounts contain UTXOs that must be fully consumed.",
          "Only miners can create new accounts."
        ]}
        correctIndex={1}
        explanation="Ethereum accounts include a nonce that increments with each transaction from that account, preventing replay and enforcing a consistent ordering of operations.[web:48][web:56]"
      />
    </section>
  );
}

function GasSection() {
  return (
    <section>
      <h3>4. Gas as a Resource Budget</h3>
      <p>
        Gas in Ethereum and similar systems measures the computational
        and storage effort required to execute operations, and each
        transaction specifies a gas limit and fee parameters to pay for
        this work.[web:45][web:44] Gas acts as both a pricing mechanism for
        scarce block space and a safety mechanism to prevent infinite
        loops or excessively expensive computations from clogging the
        system.[web:45][web:48]
      </p>
      <p>
        From a correctness perspective, cost engineering is part of
        protocol and contract design, because an otherwise logically
        correct contract that is too gas-expensive may be unusable in
        practice or can fail under real fee conditions.[web:45][web:44] Designers must reason about worst-case gas consumption paths, storage growth, and user incentives when defining contract functionality.[web:45][web:48]
      </p>

      <h4>4.1 Gas, Fees, and Limits</h4>
      <ul>
        <li>
          Each EVM operation (opcode) has a specified gas cost, and
          complex actions like storage writes are more expensive than
          simple arithmetic.[web:45][web:47]
        </li>
        <li>
          The transaction’s gas limit caps how much gas the execution
          may consume; if this limit is hit, execution reverts while
          still charging for gas consumed up to the failure.[web:45][web:44]
        </li>
        <li>
          Fee mechanisms combine gas usage with a price per unit gas,
          resulting in a total transaction fee that depends on both
          execution complexity and network demand.[web:45][web:44]
        </li>
      </ul>

      <ExampleBox
        title="Example: Two contract calls with different gas profiles"
        description="Consider two functions that achieve the same high-level task."
        bullets={[
          "Function A loops over a stored array and updates each element, using many storage writes.",
          "Function B maintains a summarized value and updates only a single storage slot per call.",
          "Both may be logically correct, but B typically consumes far less gas, making it more practical for production use."
        ]}
      />

      <QuizMCQ
        question="Why is gas accounting considered part of correctness for smart contracts?"
        options={[
          "Because gas determines the legal jurisdiction of the contract.",
          "Because a contract that always runs out of gas under realistic fee conditions is effectively unusable, even if its logic is correct.",
          "Because gas is only used to limit the number of accounts on-chain.",
          "Because gas has no relation to execution."
        ]}
        correctIndex={1}
        explanation="If a contract’s design leads to prohibitive or unbounded gas usage, users cannot reliably execute its functions, so practical correctness requires reasoning about gas as a resource budget.[web:45][web:44][web:48]"
      />
    </section>
  );
}

function Lab() {
  const [txGas, setTxGas] = useState(21000);
  const [writes, setWrites] = useState(0);
  const [loops, setLoops] = useState(0);

  const baseTxCost = 21000; // baseline transfer
  const writeCost = 20000; // approximate conceptual storage write cost
  const loopCost = 100; // conceptual per-iteration cost

  const estimatedGas =
    baseTxCost + writes * writeCost + loops * loopCost;

  return (
    <section>
      <h3>5. Lab: Run Transactions Locally & Inspect Gas Drivers</h3>
      <p>
        In a real development environment you can send transactions to a
        local or simulated node, then inspect transaction receipts to
        see fields such as gas used and status, which reveal how design
        choices affect costs.[web:55][web:45] This lab models the same idea
        conceptually in the browser by letting you adjust simple
        transaction parameters and observe an estimated gas footprint.[web:45][web:48]
      </p>

      <ExampleBox
        title="Conceptual steps with a simulated client"
        description="What you would do on a local Ethereum-like dev environment."
        bullets={[
          "Create or fund accounts in a local node or simulator.",
          "Send a transaction that calls a contract function or transfers value.",
          "Wait for the transaction to be mined, then fetch the receipt which includes gasUsed, logs, and status fields.",
          "Compare gas usage across variants of the function to identify which patterns are gas-heavy."
        ]}
      />

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 6,
          padding: "0.75rem 0.9rem",
          marginTop: "1rem",
          background: "#fdfdfd"
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
          Interactive gas estimator (conceptual)
        </div>
        <p style={{ fontSize: "0.95rem" }}>
          Use the sliders to approximate how storage writes and loop
          iterations drive gas usage for a single transaction. This is a
          pedagogical toy model, not an on-chain measurement.
        </p>

        <div style={{ margin: "0.5rem 0" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Baseline transfer cost (gas)
          </label>
          <input
            type="number"
            value={txGas}
            onChange={(e) => setTxGas(Number(e.target.value) || 0)}
            style={{ padding: "0.2rem 0.4rem", width: 120 }}
          />
          <span style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}>
            (for illustration; 21,000 is typical for a simple ETH transfer)[web:45]
          </span>
        </div>

        <div style={{ margin: "0.5rem 0" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Number of storage writes (approx. +{writeCost} gas each)
          </label>
          <input
            type="range"
            min={0}
            max={5}
            value={writes}
            onChange={(e) => setWrites(Number(e.target.value))}
          />
          <span style={{ marginLeft: "0.5rem" }}>{writes}</span>
        </div>

        <div style={{ margin: "0.5rem 0" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Loop iterations (approx. +{loopCost} gas each)
          </label>
          <input
            type="range"
            min={0}
            max={500}
            step={25}
            value={loops}
            onChange={(e) => setLoops(Number(e.target.value))}
          />
          <span style={{ marginLeft: "0.5rem" }}>{loops}</span>
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.6rem 0.8rem",
            borderRadius: 4,
            background: "#f4f9ff"
          }}
        >
          <div>
            <strong>Estimated gas (conceptual):</strong>{" "}
            {estimatedGas.toLocaleString()} units
          </div>
          <div style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            This estimate increases linearly with the number of storage
            writes and loop iterations, illustrating how contract design
            choices influence gas consumption.[web:45][web:44][web:48]
          </div>
        </div>
      </div>

      <QuizMCQ
        question="In this lab’s conceptual model, what happens when you increase the number of storage writes for a transaction?"
        options={[
          "Estimated gas usage decreases because writes overwrite existing data.",
          "Estimated gas usage remains constant; only loops matter.",
          "Estimated gas usage increases significantly, reflecting the high cost of persistent storage operations.",
          "Estimated gas usage becomes unpredictable."
        ]}
        correctIndex={2}
        explanation="Persistent storage operations in EVM-like systems are relatively expensive, so designs that minimize writes tend to save substantial gas.[web:45][web:47][web:48]"
      />
    </section>
  );
}

function Assessment() {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <section>
      <h3>6. Assessment Problems</h3>
      <p>
        These questions can be used as a graded assignment or in-class
        discussion prompts. Attempt each question before revealing the
        model answers, and encourage students to justify their
        reasoning, not just match keywords.[web:49][web:53][web:45][web:48]
      </p>

      <ol>
        <li>
          <strong>State model comparison.</strong> In two to three
          sentences, explain how state is represented in the UTXO model
          versus the account-based model, and discuss one implication
          for privacy.
        </li>
        <li>
          <strong>Parallelism thought experiment.</strong> Consider a
          batch of transactions that pay different merchants from
          different customers. Explain why a UTXO-based design might
          parallelize validation of this batch more easily than a naive
          account-based design.
        </li>
        <li>
          <strong>EVM account types.</strong> Describe the roles of
          externally owned accounts and contract accounts in an
          Ethereum-like system.
        </li>
        <li>
          <strong>Gas and failure modes.</strong> Provide an example of
          how a smart contract can be logically correct but still fail
          in production because of gas-related design decisions.
        </li>
        <li>
          <strong>Gas-aware API design.</strong> Suppose you are
          designing a contract API that can either (A) process a list of
          items in a single call or (B) provide a function to process
          one item per call. Discuss trade-offs in gas usage and user
          experience.
        </li>
        <li>
          <strong>Local lab reflection.</strong> Imagine you ran a token
          transfer transaction on a local devnet and observed
          gasUsed=52,000 in the receipt. List at least two design
          factors that could contribute to this value being higher than
          a plain ETH transfer.
        </li>
      </ol>

      <button
        onClick={() => setShowAnswers((v) => !v)}
        style={{
          marginTop: "1rem",
          padding: "0.4rem 0.9rem",
          borderRadius: 4,
          border: "none",
          background: "#0077bb",
          color: "white",
          cursor: "pointer",
          fontSize: "0.9rem"
        }}
      >
        {showAnswers ? "Hide model answers" : "Show model answers"}
      </button>

      {showAnswers && (
        <div
          style={{
            marginTop: "1rem",
            borderTop: "1px solid #ddd",
            paddingTop: "0.75rem",
            fontSize: "0.95rem"
          }}
        >
          <h4>Model Answers (Instructor Reference)</h4>
          <ol>
            <li>
              <strong>State model comparison.</strong> In the UTXO
              model, global state is the set of unspent outputs, and
              each transaction consumes specific outputs and creates new
              ones, with ownership implied by spending conditions.[web:49][web:53][web:57] In the account-based model, state is a mapping from addresses to balances and storage, and transactions directly adjust these balances.[web:48][web:56] UTXO’s tendency to use fresh addresses and change outputs can make it harder to link all funds to a single user, improving baseline privacy compared with long-lived account addresses.[web:49][web:57]
            </li>
            <li>
              <strong>Parallelism thought experiment.</strong> In a
              UTXO system, transactions that spend distinct sets of
              UTXOs do not interfere and can often be validated in
              parallel, because each referenced output is an independent
              piece of state.[web:53][web:57] In a naive account-based design,
              many payments might touch the same popular accounts or
              shared contracts, forcing sequential updates to maintain a
              consistent global state.[web:53][web:48]
            </li>
            <li>
              <strong>EVM account types.</strong> Externally owned
              accounts are controlled by private keys and are the source
              of user-initiated transactions; they have balances and
              nonces but no code.[web:56][web:48] Contract accounts contain
              EVM bytecode and persistent storage; they cannot initiate
              transactions on their own, but they execute code when
              called and can read or update state and send messages to
              other accounts.[web:56][web:48]
            </li>
            <li>
              <strong>Gas and failure modes.</strong> A contract that
              loops over an unbounded list of items in a single call
              might be logically correct but can exceed gas limits when
              the list becomes large, causing transactions to revert.[web:45][web:44] Users would experience failed executions and wasted fees, so the design must include pagination, batching, or alternative patterns to keep gas usage within predictable bounds.[web:45][web:48]
            </li>
            <li>
              <strong>Gas-aware API design.</strong> A single-call
              batch API may be convenient but can hit gas limits or
              become prohibitively expensive as the list grows, limiting
              usability.[web:45][web:44] Processing one item per call
              reduces per-transaction gas and offers better composability
              but pushes complexity to clients, which must orchestrate
              multiple calls; a hybrid approach might include small
              bounded batches.[web:45][web:48]
            </li>
            <li>
              <strong>Local lab reflection.</strong> A higher gasUsed
              value for a token transfer than for a plain ETH transfer
              could stem from additional storage writes, such as
              updating multiple balances or maintaining allowances, and
              from event logging that emits transfer events.[web:45][web:47][web:48] Extra control-flow logic or safety checks inside the token contract, such as access controls or fee calculations, can also contribute to the increased gas cost.[web:45][web:44]
            </li>
          </ol>
        </div>
      )}
      <Footer />
    </section>
  );
}
