import { useState, useEffect, useRef } from "react";
import HeroImg from "./images/Hero.png";
const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "Our Story", href: "/about/story" },
      { label: "Team", href: "/about/team" },
      { label: "Mission", href: "/about/mission" },
      { label: "Press", href: "/about/press" },
    ],
  },
  {
    label: "Membership",
    href: "/membership",
    dropdown: [
      { label: "Plans & Pricing", href: "/membership/plans" },
      { label: "Benefits", href: "/membership/benefits" },
      { label: "Corporate", href: "/membership/corporate" },
      { label: "FAQ", href: "/membership/faq" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    dropdown: [
      { label: "Upcoming Events", href: "/events/upcoming" },
      { label: "Past Events", href: "/events/past" },
      { label: "Host an Event", href: "/events/host" },
    ],
  },
  { label: "Community", href: "/community" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg:           #0b0b0b;
    --surface:      #111111;
    --surface2:     #161616;
    --accent:       #c8a96e;
    --accent-light: rgba(200,169,110,0.10);
    --accent-glow:  rgba(200,169,110,0.20);
    --text:         #ede8e0;
    --text2:        #9e9890;
    --muted:        #58534e;
    --border:       rgba(200,169,110,0.16);
    --border2:      rgba(255,255,255,0.06);
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    font-family: 'Jost', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ══════════════════════════
     NAVBAR SHELL
  ══════════════════════════ */
  .nb {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
  }

  .nb::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg,
      transparent 0%, var(--accent) 25%,
      rgba(200,169,110,.35) 50%,
      var(--accent) 75%, transparent 100%);
    z-index: 2;
    transition: opacity .4s;
  }
  .nb.scrolled::before { opacity: 0; }

  /* ══════════════════════════
     INNER BAR
  ══════════════════════════ */
  .nb-inner {
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(16px, 3.5vw, 56px);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    gap: 8px;
    transition:
      height .45s cubic-bezier(.16,1,.3,1),
      margin .45s cubic-bezier(.16,1,.3,1),
      border-radius .45s cubic-bezier(.16,1,.3,1),
      background .4s ease, box-shadow .4s ease, padding .45s ease;
  }

  .nb.scrolled .nb-inner {
    height: 54px;
    margin: 12px clamp(12px, 2.5vw, 40px);
    border-radius: 100px;
    border: 1px solid var(--border);
    background: rgba(11,11,11,.88);
    backdrop-filter: blur(22px) saturate(1.5);
    -webkit-backdrop-filter: blur(22px) saturate(1.5);
    box-shadow: 0 4px 32px rgba(0,0,0,.55), inset 0 1px 0 rgba(200,169,110,.06);
    padding: 0 clamp(12px, 2vw, 24px);
  }

  /* ══════════════════════════
     LOGO
  ══════════════════════════ */
  .nb-logo {
    display: flex; align-items: center; gap: 7px;
    text-decoration: none; flex-shrink: 0; user-select: none;
  }
  .nb-logo-mark {
    width: 30px; height: 30px;
    border: 1px solid var(--accent); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform .35s ease, box-shadow .35s ease;
  }
  .nb-logo-mark svg { width: 12px; height: 12px; fill: var(--accent); }
  .nb-logo:hover .nb-logo-mark { transform: rotate(18deg); box-shadow: 0 0 16px var(--accent-glow); }
  .nb-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600;
    color: var(--accent); letter-spacing: .1em; line-height: 1;
    transition: font-size .4s;
  }
  .nb-logo-text em { font-style: normal; color: var(--text); font-weight: 400; }
  .nb.scrolled .nb-logo-text { font-size: 1.12rem; }
  .nb.scrolled .nb-logo-mark { width: 26px; height: 26px; }
  .nb.scrolled .nb-logo-mark svg { width: 10px; height: 10px; }

  /* ══════════════════════════
     NAV LINKS
  ══════════════════════════ */
  .nb-links {
    display: flex; align-items: center;
    list-style: none; gap: 0;
    flex: 1; justify-content: center;
  }

  .nb-item { position: relative; }

  .nb-item > a, .nb-item > button {
    display: flex; align-items: center; gap: 4px;
    height: 68px;
    padding: 0 clamp(8px, 1.1vw, 16px);
    color: var(--muted);
    text-decoration: none;
    background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: .7rem; font-weight: 400;
    letter-spacing: .14em; text-transform: uppercase;
    white-space: nowrap; position: relative;
    transition: color .25s;
  }
  .nb.scrolled .nb-item > a,
  .nb.scrolled .nb-item > button { height: 54px; }

  /* chevron icon */
  .nb-chevron {
    width: 9px; height: 9px;
    stroke: currentColor; fill: none; stroke-width: 2.2;
    transition: transform .3s cubic-bezier(.16,1,.3,1);
    flex-shrink: 0;
  }
  .nb-item.open .nb-chevron { transform: rotate(180deg); }

  /* underline */
  .nb-item > a::before, .nb-item > button::before {
    content: '';
    position: absolute;
    bottom: 0; left: 50%; right: 50%; height: 1px;
    background: var(--accent);
    transition: left .35s cubic-bezier(.16,1,.3,1), right .35s cubic-bezier(.16,1,.3,1);
  }
  .nb.scrolled .nb-item > a::before,
  .nb.scrolled .nb-item > button::before { display: none; }

  .nb-item > a:hover, .nb-item > button:hover { color: var(--text2); }
  .nb-item > a:hover::before, .nb-item > button:hover::before,
  .nb-item.open > button::before {
    left: clamp(8px,1.1vw,16px); right: clamp(8px,1.1vw,16px);
  }
  .nb-item > a.active, .nb-item.active > button { color: var(--accent); }
  .nb-item > a.active::before, .nb-item.active > button::before {
    left: clamp(8px,1.1vw,16px); right: clamp(8px,1.1vw,16px);
  }

  /* ══════════════════════════
     DROPDOWN PANEL
  ══════════════════════════ */
  .nb-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    min-width: 200px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 16px 48px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.03);
    opacity: 0;
    pointer-events: none;
    transition: opacity .25s ease, transform .3s cubic-bezier(.16,1,.3,1);
    z-index: 100;
  }

  .nb-item.open .nb-dropdown {
    opacity: 1;
    pointer-events: all;
    transform: translateX(-50%) translateY(0);
  }

  /* small top arrow */
  .nb-dropdown::before {
    content: '';
    position: absolute;
    top: -5px; left: 50%; transform: translateX(-50%) rotate(45deg);
    width: 9px; height: 9px;
    background: var(--surface2);
    border-left: 1px solid var(--border);
    border-top: 1px solid var(--border);
  }

  .nb-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    color: var(--text2);
    text-decoration: none;
    font-size: .72rem; font-weight: 400;
    letter-spacing: .08em;
    white-space: nowrap;
    transition: background .2s, color .2s, padding-left .2s;
    position: relative;
  }

  .nb-dd-item::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
    opacity: 0;
    transform: scale(0);
    transition: opacity .2s, transform .2s;
  }

  .nb-dd-item:hover {
    background: var(--accent-light);
    color: var(--text);
    padding-left: 18px;
  }
  .nb-dd-item:hover::before { opacity: 1; transform: scale(1); }

  /* divider between dropdown items */
  .nb-dd-item + .nb-dd-item {
    border-top: 1px solid rgba(255,255,255,.03);
  }

  /* ══════════════════════════
     RIGHT SIDE — Login + Sign Up
  ══════════════════════════ */
  .nb-right {
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }

  /* Login — ghost */
  .nb-login {
    display: inline-flex; align-items: center;
    padding: 8px 18px;
    background: none;
    border: 1px solid var(--border2);
    border-radius: 3px;
    color: var(--text2);
    font-family: 'Jost', sans-serif;
    font-size: .68rem; font-weight: 400;
    letter-spacing: .13em; text-transform: uppercase;
    text-decoration: none; cursor: pointer; white-space: nowrap;
    transition: border-color .25s, color .25s, background .25s;
  }
  .nb-login:hover { border-color: var(--border); color: var(--text); background: rgba(255,255,255,.04); }

  /* Sign Up — gold fill */
  .nb-signup {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 20px;
    background: transparent;
    border: 1px solid var(--accent);
    border-radius: 3px;
    color: var(--accent);
    font-family: 'Jost', sans-serif;
    font-size: .68rem; font-weight: 500;
    letter-spacing: .13em; text-transform: uppercase;
    text-decoration: none; cursor: pointer; white-space: nowrap;
    overflow: hidden; position: relative;
    transition: color .3s, border-color .3s;
  }
  .nb-signup::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--accent);
    transform: translateX(-102%);
    transition: transform .35s cubic-bezier(.16,1,.3,1);
    z-index: 0;
  }
  .nb-signup span, .nb-signup svg { position: relative; z-index: 1; }
  .nb-signup:hover::before { transform: translateX(0); }
  .nb-signup:hover { color: #0b0b0b; }
  .nb-signup svg {
    width: 11px; height: 11px;
    stroke: currentColor; fill: none; stroke-width: 2;
    transition: transform .25s;
  }
  .nb-signup:hover svg { transform: translateX(2px); }

  .nb.scrolled .nb-login { padding: 6px 14px; border-radius: 100px; font-size: .65rem; }
  .nb.scrolled .nb-signup { padding: 6px 16px; border-radius: 100px; font-size: .65rem; }

  /* ══════════════════════════
     HERO
  ══════════════════════════ */
  .hero { width: 100%; height: 100vh; overflow: hidden; }
  .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ══════════════════════════
     BREAKPOINTS
  ══════════════════════════ */
  @media (min-width: 1280px) {
    .nb-inner { height: 72px; }
    .nb-item > a, .nb-item > button { height: 72px; }
    .nb.scrolled .nb-item > a,
    .nb.scrolled .nb-item > button { height: 54px; }
  }

  @media (max-width: 1100px) {
    .nb-item > a, .nb-item > button { font-size: .65rem; padding: 0 8px; }
    .nb-login { padding: 7px 13px; font-size: .63rem; }
    .nb-signup { padding: 7px 14px; font-size: .63rem; }
  }

  @media (max-width: 900px) {
    .nb-item > a, .nb-item > button { font-size: .6rem; padding: 0 6px; letter-spacing: .1em; }
    .nb-login { padding: 6px 11px; font-size: .6rem; }
    .nb-signup { padding: 6px 12px; font-size: .6rem; }
  }

  @media (max-width: 768px) {
    .nb-inner { height: 60px; }
    .nb-item > a, .nb-item > button { height: 60px; font-size: .58rem; padding: 0 5px; }
    .nb.scrolled .nb-inner { margin: 10px 14px; height: 50px; }
    .nb.scrolled .nb-item > a,
    .nb.scrolled .nb-item > button { height: 50px; }
  }

  @media (max-width: 600px) {
    .nb-inner { height: 54px; padding: 0 10px; gap: 4px; }
    .nb-logo-text { font-size: 1rem; }
    .nb-logo-mark { width: 25px; height: 25px; }
    .nb-logo-mark svg { width: 9px; height: 9px; }
    .nb-item > a, .nb-item > button { font-size: .52rem; padding: 0 4px; letter-spacing: .07em; }
    .nb-chevron { width: 7px; height: 7px; }
    .nb-login { padding: 5px 9px; font-size: .55rem; }
    .nb-signup { padding: 5px 10px; font-size: .55rem; }
    .nb.scrolled .nb-inner { margin: 8px 10px; }
    .nb-dropdown { min-width: 160px; }
    .nb-dd-item { font-size: .66rem; padding: 8px 11px; }
  }

  @media (max-width: 400px) {
    .nb-item > a, .nb-item > button { font-size: .48rem; padding: 0 3px; }
    .nb-login { display: none; }
    .nb-signup { padding: 5px 10px; }
  }

  @media (max-width: 360px) {
    .nb-logo-text { font-size: .88rem; }
    .nb-inner { padding: 0 7px; }
    .nb-item > a, .nb-item > button { font-size: .44rem; padding: 0 2px; }
  }
`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDropdown = (label) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  const handleNavClick = (e, label) => {
    e.preventDefault();
    setActive(label);
    setOpenDropdown(null);
  };

  return (
    <>
      <style>{styles}</style>

      <nav
        ref={navRef}
        className={`nb${scrolled ? " scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nb-inner">

          {/* ── Logo ── */}
          <a className="nb-logo" href="/" aria-label="AuraClub Home">
            <div className="nb-logo-mark">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 1 L10.5 6 L16 7 L12 11 L13 16 L8 13.5 L3 16 L4 11 L0 7 L5.5 6 Z"/>
              </svg>
            </div>
            <span className="nb-logo-text">AURA<em>CLUB</em></span>
          </a>

          {/* ── Nav Links ── */}
          <ul className="nb-links" role="list">
            {NAV_LINKS.map((link) => {
              const hasDropdown = link.dropdown && link.dropdown.length > 0;
              const isOpen = openDropdown === link.label;
              const isActive = active === link.label ||
                (link.dropdown?.some((d) => d.label === active));

              return (
                <li
                  key={link.label}
                  className={`nb-item${isOpen ? " open" : ""}${isActive ? " active" : ""}`}
                >
                  {hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                      >
                        {link.label}
                        <svg className="nb-chevron" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <div className="nb-dropdown" role="menu">
                        {link.dropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="nb-dd-item"
                            role="menuitem"
                            onClick={(e) => handleNavClick(e, item.label)}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <a
                      href={link.href}
                      className={isActive ? "active" : ""}
                      onClick={(e) => handleNavClick(e, link.label)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── Right: Login + Sign Up ── */}
          <div className="nb-right">
            <a className="nb-login" href="/login" onClick={(e) => e.preventDefault()}>
              Login
            </a>
            <a className="nb-signup" href="/signup" onClick={(e) => e.preventDefault()}>
              <span>Sign Up</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="hero">
        <img src={HeroImg} alt="Hero" />
      </div>
      <div style={{ height: "100vh", background: "var(--bg)" }}/>
    </>
  );
}