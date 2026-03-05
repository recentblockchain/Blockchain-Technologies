import { lazy, Suspense, useState } from "react";

// Lazy-load each course module for code-splitting
const modules = [
  {
    id: 0,
    label: "Blockchain Fundamentals",
    short: "Module 0",
    Component: lazy(
      () => import("../Course Contents/0. BlockchainFundamentals")
    ),
  },
  {
    id: 1,
    label: "Blockchain Data Structures",
    short: "Module 1",
    Component: lazy(
      () => import("../Course Contents/1. BlockchainDataStructures")
    ),
  },
  {
    id: 2,
    label: "Cryptography for Blockchains",
    short: "Module 2",
    Component: lazy(
      () => import("../Course Contents/2. CryptographyForBlockchains")
    ),
  },
  {
    id: 3,
    label: "Consensus Mechanisms",
    short: "Module 3",
    Component: lazy(
      () => import("../Course Contents/3. ConsensusMechanisms")
    ),
  },
  {
    id: 4,
    label: "P2P Networking",
    short: "Module 4",
    Component: lazy(() => import("../Course Contents/4. P2PNetworking")),
  },
  {
    id: 5,
    label: "Execution & State Model",
    short: "Module 5",
    Component: lazy(
      () => import("../Course Contents/5. Execution & StateModel")
    ),
  },
  {
    id: 6,
    label: "Smart Contract Programming Foundations",
    short: "Module 6",
    Component: lazy(
      () =>
        import(
          "../Course Contents/6. Smart Contract Programming Foundations (Solidity/EVM Track)"
        )
    ),
  },
  {
    id: 7,
    label: "Standards, Patterns, and Composability",
    short: "Module 7",
    Component: lazy(
      () => import("../Course Contents/7. Standards, Patterns, and Composability")
    ),
  },
  {
    id: 8,
    label: "Testing, Tooling, and Deployment Pipeline",
    short: "Module 8",
    Component: lazy(
      () => import("../Course Contents/8.Testing, Tooling, and Deployment Pipeline")
    ),
  },
  {
    id: 9,
    label: "Smart Contract Vulnerabilities I",
    short: "Module 9",
    Component: lazy(
      () => import("../Course Contents/9.Smart Contract Vulnerabilities I (Code-Level)")
    ),
  },
  {
    id: 10,
    label: "Threat Modeling and Audit Methods",
    short: "Module 10",
    Component: lazy(
      () => import("../Course Contents/10.Threat Modeling and Audit Methods")
    ),
  },
  {
    id: 11,
    label: "Oracles, MEV, and Protocol-Level Risk",
    short: "Module 11",
    Component: lazy(
      () => import("../Course Contents/11.Oracles, MEV, and Protocol-Level Risk")
    ),
  },
  {
    id: 12,
    label: "dApp Architecture and Off-Chain Infrastructure",
    short: "Module 12",
    Component: lazy(
      () => import("../Course Contents/12. dApp Architecture and Off-Chain Infrastructure")
    ),
  },
  {
    id: 13,
    label: "Scaling and Interoperability",
    short: "Module 13",
    Component: lazy(
      () => import("../Course Contents/13.Scaling and Interoperability")
    ),
  },
  {
    id: 14,
    label: "Governance, Operations, and Capstone Delivery",
    short: "Module 14",
    Component: lazy(
      () => import("../Course Contents/14.Governance, Operations, and Capstone Delivery")
    ),
  },
];

const G = {
  bg0: "#0a0c10",
  bg1: "#10141c",
  bg2: "#161c28",
  bg3: "#1e2636",
  border: "#2a3448",
  amber: "#f5a623",
  cyan: "#4dd9e0",
  text: "#d4dbe8",
  textMuted: "#7a8ba8",
  textBright: "#edf2f8",
};

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        color: G.amber,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "14px",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `2px solid ${G.border}`,
          borderTopColor: G.amber,
          animation: "spin 0.8s linear infinite",
        }}
      />
      Loading module…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const { Component } = modules[active];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: G.bg0,
        color: G.text,
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      {/* ── Top Navigation Bar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: G.bg1,
          borderBottom: `1px solid ${G.border}`,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          overflowX: "auto",
          minHeight: 52,
        }}
      >
        <span
          style={{
            color: G.amber,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: 13,
            marginRight: 12,
            whiteSpace: "nowrap",
            letterSpacing: "0.06em",
          }}
        >
          ⛓ BLOCKCHAIN TECH
        </span>
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            style={{
              background: active === m.id ? G.amber : "transparent",
              color: active === m.id ? G.bg0 : G.textMuted,
              border: `1px solid ${active === m.id ? G.amber : G.border}`,
              borderRadius: 6,
              padding: "5px 12px",
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              whiteSpace: "nowrap",
              fontWeight: active === m.id ? 700 : 400,
              transition: "all 0.15s",
            }}
          >
            {m.short}
          </button>
        ))}
      </nav>

      {/* ── Module Title ── */}
      <div
        style={{
          borderBottom: `1px solid ${G.border}`,
          background: G.bg2,
          padding: "10px 24px",
        }}
      >
        <span
          style={{
            color: G.cyan,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.08em",
          }}
        >
          {modules[active].label}
        </span>
      </div>

      {/* ── Module Content ── */}
      <Suspense fallback={<Spinner />}>
        <Component />
      </Suspense>
    </div>
  );
}
