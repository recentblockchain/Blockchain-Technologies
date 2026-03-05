export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1e3a5f",
        padding: "10px 24px",
        textAlign: "center",
        background: "#0d1b2a",
      }}
    >
      <p style={{ margin: 0, fontSize: 11, color: "#4a90d9", fontFamily: "'IBM Plex Mono', monospace" }}>
        © {new Date().getFullYear()}{" "}
        <a href="https://blockchain.cse.psu.edu/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#4a90d9", textDecoration: "none" }}>
          Blockchain Data Intelligence Lab
        </a>
        {" · "}
        <a href="https://www.psu.edu/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#4a90d9", textDecoration: "none" }}>
          Penn State University
        </a>
        {" · CMPSC Blockchain Technologies"}
      </p>
    </footer>
  );
}
