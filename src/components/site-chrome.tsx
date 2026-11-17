import { useEffect, useRef, useState } from "react";
import { REPO_URL } from "../lib/site";

const navigationLinks = [
  { href: "#workflow", label: "How it works" },
  { href: "#principles", label: "Built for your team" },
  { href: "/docs", label: "Docs" },
];

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}

function GitHubLink({ onClick }: { onClick?: () => void }) {
  return (
    <a href={REPO_URL} className="github-link" onClick={onClick}>
      GitHub{" "}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0 1 12 6.097c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.628-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.29 0 .322.216.694.825.576C20.565 22.092 24 17.594 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </a>
  );
}

function Mark() {
  return (
    <span className="wordmark">
      <img src="/repodesk-mark.svg" width="32" height="32" alt="" />
      RepoDesk
    </span>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("hashchange", close);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("hashchange", close);
    };
  }, [menuOpen]);

  return (
    <header className="site-header wrap">
      <a href="/" aria-label="RepoDesk home">
        <Mark />
      </a>
      <button
        ref={menuButton}
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>
      <nav
        id="site-nav"
        aria-label="Main navigation"
        className={menuOpen ? "nav open" : "nav"}
      >
        {navigationLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <GitHubLink onClick={closeMenu} />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <a href="/" aria-label="RepoDesk home">
        <Mark />
      </a>
      <p>From conversation to contribution.</p>
      <div>
        <GitHubLink />
        <a href="/docs">
          Documentation <Arrow diagonal />
        </a>
      </div>
    </footer>
  );
}
