"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import ContactFooter from "@/app/components/ContactFooter";
import BookDemoModal from "@/app/components/BookDemoModal";
import GoToTop from "@/app/components/GoToTop";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Zap, BarChart, Globe } from "lucide-react";
import Link from "next/link";
import { Service } from "@/app/constants/servicesData";

export default function ServiceDetailClient({ service }: { service: Service }) {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setDemoOpen(true)} />
      <main style={{ paddingTop: "100px", background: "white" }}>
        {/* Service Hero */}
        <section style={{ background: "var(--bg-surface)", padding: "80px 0" }}>
          <div className="container-main" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <Link 
                href="/services" 
                style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "24px", fontSize: "0.9rem", fontWeight: 600 }}
              >
                <ArrowLeft size={16} /> Back to Services
              </Link>
              <h1 style={{ marginBottom: "20px", textAlign: "center" }}>{service.title}</h1>
              <p style={{ fontSize: "1.1rem", color: "var(--text-dim)", marginBottom: "32px", textAlign: "center" }}>{service.description} specifically tailored for your business and scalability needs.</p>
              <button 
                onClick={() => setDemoOpen(true)}
                className="glow-btn-primary"
                style={{ padding: "14px 32px", borderRadius: "12px", border: "none", color: "white", cursor: "pointer", fontWeight: 700 }}
              >
                Request a Free Quote
              </button>
            </motion.div>
          </div>
        </section>

        {/* Service Detailed Overview */}
        <section style={{ background: "var(--bg-main)", padding: "60px 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="container-main" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ 
              background: "white", 
              padding: "clamp(18px, 4vw, 36px)", 
              borderRadius: "var(--radius-lg)", 
              border: "1px solid var(--border-subtle)", 
              boxShadow: "var(--shadow-md)" 
            }}>
              <h2 style={{ 
                marginBottom: "24px", 
                fontSize: "clamp(1.25rem, 4vw, 1.6rem)", 
                fontWeight: 800, 
                color: "var(--text-main)" 
              }}>
                Strategic Solution Overview
              </h2>
              {service.detailedContent && service.detailedContent.map((para: string, idx: number) => (
                <p key={idx} style={{ 
                  fontSize: "0.9rem", 
                  lineHeight: "1.65", 
                  color: "var(--text-dim)", 
                  marginBottom: idx === service.detailedContent.length - 1 ? 0 : "18px",
                  textAlign: "left"
                }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="container-main" style={{ padding: "100px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="section-badge">Deep Dive</span>
            <h2>Advanced Capabilities &amp; Workflows</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
            <div style={{ padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", background: "white" }}>
              <Zap style={{ color: "var(--color-primary)", marginBottom: "16px" }} />
              <h4>Instant Automation</h4>
              <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Automate repetitive tasks like billing, report generation, and notifications instantly.</p>
            </div>
            <div style={{ padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", background: "white" }}>
              <BarChart style={{ color: "var(--color-purple)", marginBottom: "16px" }} />
              <h4>Real-time Analytics</h4>
              <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Get live dashboards for operational flow, financial health, and inventory status with one click.</p>
            </div>
            <div style={{ padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", background: "white" }}>
              <Globe style={{ color: "#10B981", marginBottom: "16px" }} />
              <h4>Cloud Accessibility</h4>
              <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Access your business systems and data from anywhere in the world with secure, encrypted cloud storage.</p>
            </div>
          </div>

          <div style={{ marginTop: "80px" }}>
            <h3 style={{ marginBottom: "32px", textAlign: "center" }}>Standard Features Included</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              {service.features.map((feat: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "var(--bg-surface)", borderRadius: "12px" }}>
                  <CheckCircle2 size={18} style={{ color: "var(--color-primary)" }} />
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Infispark Context */}
        <section style={{ background: "#0F172A", color: "white", padding: "100px 0" }}>
          <div className="container-main" style={{ textAlign: "center" }}>
            <h2 style={{ color: "white", marginBottom: "24px" }}>Ready to Transform Your Operations with {service.title}?</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto 40px", color: "rgba(255,255,255,0.7)" }}>
              Under the vision of Shaikh Mudassir and Moin Zariwala, Infispark is helping enterprise clients and SMBs in India go digital. Join the movement today.
            </p>
            <button 
              onClick={() => setDemoOpen(true)}
              style={{ background: "white", color: "#0F172A", padding: "16px 40px", borderRadius: "12px", border: "none", fontWeight: 800, cursor: "pointer" }}
            >
              Request a Free Quote
            </button>
          </div>
        </section>

        <ContactFooter />
      </main>

      <BookDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      <GoToTop />
    </>
  );
}
