"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onBookDemo: () => void;
}

export default function Navbar({ onBookDemo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 20);
    const updateMobile = () => setIsMobile(window.innerWidth <= 960);
    updateMobile();
    window.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateMobile);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "Why Infispark", href: "/#why-infispark" },
    { title: "Contact", href: "/#contact" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* ─── Announcement Bar ─── */}
      <div
        style={{
          background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-purple))",
          color: "#fff",
          textAlign: "center",
          padding: "7px 16px",
          fontSize: "clamp(0.6rem, 2vw, 0.7rem)",
          fontWeight: 600,
          letterSpacing: "0.03em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          position: "relative",
          zIndex: 1001,
        }}
      >
        <span
          style={{
            background: "rgba(255,255,255,0.22)",
            borderRadius: "4px",
            padding: "1px 6px",
            fontSize: "0.58rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            flexShrink: 0,
          }}
        >
          NEW
        </span>
        <span style={{ lineHeight: 1.3 }}>Enterprise AI integrations now live </span>
        <a
          href="/services/ai-custom-software"
          style={{
            color: "#ffffff",
            textDecoration: "underline",
            fontSize: "0.68rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          See it →
        </a>
      </div>

      <nav
        style={{
          padding: scrolled ? "8px 0" : "12px 0",
          background: scrolled
            ? "rgba(255, 255, 255, 0.98)"
            : "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: scrolled
            ? "1px solid rgba(226, 232, 240, 0.8)"
            : "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: scrolled
            ? "0 4px 20px -4px rgba(99, 102, 241, 0.12)"
            : "none",
          transition: "all 0.3s ease",
        }}
        className="navbar-content"
      >
        <div
          className="container-main"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}
        >
          {/* Logo */}
          <Link href="/">
            <motion.div
              style={{ cursor: "pointer", position: "relative", width: 110, height: 32 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="navbar-logo"
            >
              <Image
                src="/logo.png"
                alt="Infispark Logo"
                fill
                style={{ objectFit: "contain", objectPosition: "left" }}
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="desktop-nav">
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  aria-label={link.title}
                  className="nav-link"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#475569",
                    textDecoration: "none",
                    position: "relative",
                    transition: "color 0.3s ease",
                    padding: "3px 0",
                    letterSpacing: "0.01em",
                  }}
                >
                  {link.title}
                  <div className="nav-link-underline" />
                </Link>
              ))}
            </div>

            {/* Phone quick link */}
            <a
              href="tel:+919958399157"
              aria-label="Call Infispark at +91 99583 99157"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#10B981",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.18)",
                transition: "all 0.3s ease",
                letterSpacing: "0.01em",
              }}
              className="phone-link-nav"
            >
              <Phone size={12} strokeWidth={2.5} />
              +91 99583 99157
            </a>

            <motion.button
              onClick={onBookDemo}
              aria-label="Request a Quote"
              className="glow-btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "8px 18px",
                borderRadius: "50px",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Request a Quote
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            whileTap={{ scale: 0.9 }}
            style={{
              background: isOpen ? "rgba(99, 102, 241, 0.1)" : "white",
              border: "1px solid rgba(99, 102, 241, 0.22)",
              borderRadius: "10px",
              color: "var(--color-primary)", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
            className="mobile-nav-toggle"
          >
            {isOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(226,232,240,0.8)",
                overflow: "hidden",
                boxShadow: "0 16px 32px -8px rgba(99,102,241,0.08)",
              }}
            >
              <div
                className="container-main"
                style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 4 }}
              >
                {navLinks.map((link, i) => (
                  <Link key={link.title} href={link.href} passHref legacyBehavior>
                    <motion.a
                      aria-label={link.title}
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "#0F172A",
                        textDecoration: "none",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        display: "block",
                        transition: "background 0.2s ease",
                        letterSpacing: "0.01em",
                      }}
                      className="mobile-link"
                    >
                      {link.title}
                    </motion.a>
                  </Link>
                ))}
                <div style={{ height: 1, background: "rgba(226,232,240,0.7)", margin: "6px 0" }} />
                {/* Phone row */}
                <a
                  href="tel:+919958399157"
                  aria-label="Call Infispark at +91 99583 99157"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#10B981",
                    textDecoration: "none",
                    borderRadius: "10px",
                    background: "rgba(16,185,129,0.04)",
                    border: "1px solid rgba(16,185,129,0.14)",
                    marginBottom: 6,
                  }}
                >
                  <Phone size={13} />
                  +91 99583 99157
                </a>
                <motion.button
                  onClick={() => { onBookDemo(); setIsOpen(false); }}
                  aria-label="Request a Quote"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="glow-btn-primary"
                  style={{
                    padding: "13px",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                    marginTop: 2,
                  }}
                >
                  Request a Quote →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
