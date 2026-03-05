// Footer component with Blockchain Data Intelligence Lab branding
const G = {
  bg0: "#0a0c10",
  bg1: "#10141c",
  bg2: "#161c28",
  border: "#2a3448",
  text: "#d4dbe8",
  textMuted: "#7a8ba8",
  amber: "#f5a623",
};

export default function Footer() {
  return (
    <footer
      style={{
        background: G.bg1,
        borderTop: `1px solid ${G.border}`,
        padding: "32px 24px",
        marginTop: "64px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <a
          href="https://blockchain.cse.psu.edu/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <img
            src="https://blockchain.cse.psu.edu/images/bdil-logo.png"
            alt="Blockchain Data Intelligence Lab Logo"
            style={{
              height: "60px",
              width: "auto",
            }}
            onError={(e) => {
              // Fallback if logo doesn't load
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div style="
                  font-family: 'IBM Plex Mono', monospace;
                  font-size: 18px;
                  font-weight: 600;
                  color: ${G.amber};
                  letter-spacing: 0.05em;
                ">
                  ⛓ Blockchain Data Intelligence Lab
                </div>
              `;
            }}
          />
        </a>

        {/* Copyright */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            color: G.textMuted,
            letterSpacing: "0.02em",
          }}
        >
          © {new Date().getFullYear()} Blockchain Data Intelligence Lab
        </div>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "12px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          <a
            href="https://blockchain.cse.psu.edu/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: G.text,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = G.amber)}
            onMouseLeave={(e) => (e.target.style.color = G.text)}
          >
            Lab Website
          </a>
          <span style={{ color: G.border }}>•</span>
          <a
            href="https://www.psu.edu/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: G.text,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = G.amber)}
            onMouseLeave={(e) => (e.target.style.color = G.text)}
          >
            Penn State University
          </a>
        </div>
      </div>
    </footer>
  );
}
