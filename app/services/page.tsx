"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import ContactFooter from "../components/ContactFooter";
import BookDemoModal from "../components/BookDemoModal";
import GoToTop from "../components/GoToTop";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { services } from "../constants/servicesData";

export default function ServicesPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setDemoOpen(true)} />
      <main style={{ paddingTop: "100px", background: "var(--bg-surface)" }}>
        {/* Hero Section */}
        <section className="container-main" style={{ textAlign: "center", padding: "60px 0" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-badge">Our Services</span>
            <h1 className="gradient-text-vibrant" style={{ marginBottom: "20px" }}>
              Best Custom Software & IT Solutions
            </h1>
            <p style={{ maxWidth: "700px", margin: "0 auto", color: "var(--text-dim)", fontSize: "1.1rem" }}>
              INFISPARK TECHNOLOGIES LLP, founded by Shaikh Mudassir and Moin Zariwala, is leading the digital software revolution with state-of-the-art custom applications and IT integrations.
            </p>
          </motion.div>
        </section>

        {/* Services Grid */}
        <section className="container-main" style={{ paddingBottom: "100px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "32px" 
          }}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-md)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                }}
              >
                <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    borderRadius: "16px", 
                    background: "rgba(99, 102, 241, 0.08)", 
                    border: "1px solid rgba(99, 102, 241, 0.16)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: "20px",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.06)"
                  }}>
                    {service.icon}
                  </div>
                  <h3 style={{ marginBottom: "12px" }}>{service.title}</h3>
                  <p style={{ color: "var(--text-dim)", marginBottom: "20px", fontSize: "0.9rem" }}>{service.description}</p>
                  
                  <ul style={{ 
                    listStyle: "none", 
                    padding: 0, 
                    display: "grid", 
                    gridTemplateColumns: "1fr", 
                    gap: "8px",
                    marginBottom: "24px"
                  }}>
                    {service.features.map((feat, i) => (
                      <li key={i} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px", 
                        fontSize: "0.82rem", 
                        fontWeight: 600,
                        color: "var(--text-main)"
                      }}>
                        <ShieldCheck size={14} style={{ color: "#10B981" }} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <Link 
                      href={`/services/${service.slug}`}
                      style={{ 
                        flex: 1,
                        padding: "12px", 
                        borderRadius: "12px", 
                        border: "1px solid var(--border-subtle)", 
                        color: "var(--text-main)", 
                        cursor: "pointer",
                        textDecoration: "none",
                        textAlign: "center",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                    <button 
                      onClick={() => setDemoOpen(true)}
                      className="glow-btn-primary"
                      style={{ 
                        flex: 1,
                        padding: "12px", 
                        borderRadius: "12px", 
                        border: "none", 
                        color: "white", 
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 700
                      }}
                    >
                      Get a Quote
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section style={{ background: "white", padding: "100px 0" }}>
          <div className="container-main" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <span className="section-badge">Founder's Vision</span>
              <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Driving Digital Innovation and Business Scaling</h2>
              <p style={{ color: "var(--text-dim)", marginBottom: "32px", textAlign: "center", maxWidth: "680px" }}>
                Under the leadership of <strong>Shaikh Mudassir</strong> and <strong>Moin Zariwala</strong>, Infispark has grown into a trusted partner for businesses and scaling enterprises across India. Our goal is to provide high-performance, robust software that empowers operations and speeds up growth.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", width: "100%", maxWidth: "500px" }}>
                <div style={{ padding: "20px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                  <BarChart3 style={{ color: "var(--color-primary)", marginBottom: "10px", marginInline: "auto" }} />
                  <h4 style={{ fontSize: "1.1rem" }}>Scalable</h4>
                  <p style={{ fontSize: "0.75rem" }}>Grows with your enterprise.</p>
                </div>
                <div style={{ padding: "20px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                  <Users style={{ color: "var(--color-purple)", marginBottom: "10px", marginInline: "auto" }} />
                  <h4 style={{ fontSize: "1.1rem" }}>User Friendly</h4>
                  <p style={{ fontSize: "0.75rem" }}>Minimum training required for staff.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <ContactFooter />
      </main>

      <BookDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      <GoToTop />
    </>
  );
}
