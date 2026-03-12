

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Rides", "Community", "Equipment", "Routes", "Blog"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scrolled ? "12px 48px" : "18px 48px",
        background: scrolled ? "rgba(15,15,15,0.98)" : "rgba(15,15,15,0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(181,242,61,0.15)",
        transition: "padding .3s, background .3s",
      }}
    >
      {/* Logo */}
      <a
        href="#home"
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 26,
          letterSpacing: 2,
          color: "#b5f23d",
          textDecoration: "none",
        }}
      >
        RideGrounds
      </a>

      {/* Links */}
      <ul style={{ display: "flex", gap: 32, listStyle: "none" }}>
        {links.map((l) => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              style={{
                color: "rgba(248,248,244,0.7)",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 500,
                transition: "color .2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#b5f23d")
              }
              onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color =
                "rgba(248,248,244,0.7)")
              }
            >
              {l}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        style={{
          background: "#b5f23d",
          color: "#0f0f0f",
          border: "none",
          padding: "10px 24px",
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 1,
          textTransform: "uppercase",
          cursor: "pointer",
          clipPath:
            "polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))",
          transition: "transform .15s, box-shadow .15s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = "translateY(-2px)";
          (e.target as HTMLElement).style.boxShadow =
            "0 6px 20px rgba(181,242,61,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "none";
          (e.target as HTMLElement).style.boxShadow = "none";
        }}
      >
        Join Free
      </button>
    </nav>
  );
}