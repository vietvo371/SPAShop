"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/cau-chuyen-chan-an", label: "Về Tâm An" },
  { href: "/dich-vu-cham-soc", label: "Dịch vụ chăm sóc" },
  { href: "/san-pham", label: "Sản phẩm công nghệ" },
  { href: "/kien-thuc", label: "Kiến thức" },
  { href: "/hop-tac-cung-chan-an", label: "Hợp tác" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="header" style={scrolled ? { boxShadow: "0 4px 20px rgba(0,0,0,0.12)" } : {}}>
        <div className="header-top">
          <div className="header-top-inner">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
              YouTube
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              Facebook
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
              TikTok
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              Instagram
            </a>
          </div>
        </div>

        <div className="header-main">
          <Link href="/" className="logo">
            <Image
              src="/images/logo.png"
              alt="Tâm An Logo"
              width={150}
              height={45}
              className="logo-img"
              style={{ objectFit: "contain" }}
            />
          </Link>

          <nav className="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu */}
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
          ✕
        </button>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
