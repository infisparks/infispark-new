"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Brain, Layout, MessageSquare, Cpu, ArrowRight } from "lucide-react";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  stat?: string;
  statLabel?: string;
}

const benefits: Benefit[] = [
  {
    icon: <Cpu size={20} />,
    title: "Bespoke Architecture",
    description: "Tailored code systems engineered for speed and stability. No templates, no bloat, just pure performance built for your operations.",
    color: "#7C3AED",
    stat: "100%",
    statLabel: "Custom Code",
  },
  {
    icon: <Brain size={20} />,
    title: "AI-Powered Efficiency",
    description: "Integrate Large Language Models and voice processing engines directly into your workflows to automate report generation and data entry.",
    color: "#EC4899",
    stat: "10×",
    statLabel: "Faster Tasks",
  },
  {
    icon: <Zap size={20} />,
    title: "High-Density Cloud",
    description: "Our server deployments on AWS/GCP ensure zero latency, high-volume database queries, and automatic backup architectures.",
    color: "#3B82F6",
    stat: "99.99%",
    statLabel: "Uptime SLA",
  },
  {
    icon: <Layout size={20} />,
    title: "User-Centric UX/UI",
    description: "Aesthetically stunning, modern, and response-driven layouts tailored for high employee adoption and customer conversion rates.",
    color: "#10B981",
    stat: "95%",
    statLabel: "User Adoption",
  },
  {
    icon: <MessageSquare size={20} />,
    title: "Omnichannel APIs",
    description: "Unify transactional notifications, billing updates, and support queues into WhatsApp, SMS, and email configurations.",
    color: "#14B8A6",
    stat: "98%",
    statLabel: "Open Rates",
  },
  {
    icon: <Shield size={20} />,
    title: "Enterprise SLA",
    description: "Proactive monitoring, daily backups, code updates, and direct developer communication channels to keep your app secure.",
    color: "#F59E0B",
    stat: "24/7",
    statLabel: "Active Support",
  },
];

export default function WhyInfispark() {
  return (
    <section
      id="why-infispark"
      style={{
        position: "relative",
        padding: "clamp(56px, 9vw, 100px) 0",
        overflow: "hidden",
        background: "linear-gradient(165deg, #F8FAFC 0%, #EEF2FF 50%, #F5F3FF 100%)",
        borderTop: "1px solid rgba(226,232,240,0.6)",
        borderBottom: "1px solid rgba(226,232,240,0.6)",
      }}
    >
      {/* Dot grid */}
      <div
        style={{ position: "absolute", inset: 0, opacity: 0.3 }}
        className="bg-dot-grid"
      />

      {/* Glow accents */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        {/* Header — compact 2-col layout on desktop */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(24px, 4vw, 48px)", alignItems: "flex-end", marginBottom: "clamp(40px, 6vw, 64px)" }} className="why-header">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="section-badge"
            >
              THE INFISPARK ADVANTAGE
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.07 }}
              style={{
                fontSize: "clamp(1.3rem, 4vw, 2.6rem)",
                fontWeight: 800,
                marginBottom: "clamp(10px, 1.5vw, 16px)",
                color: "var(--text-main)",
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
              }}
            >
              Built for the New Era of{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-purple) 100%)",
                  color: "white",
                  padding: "2px 10px",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                Enterprise Tech
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              style={{
                color: "var(--text-dim)",
                fontSize: "clamp(0.78rem, 1.6vw, 0.92rem)",
                lineHeight: 1.65,
                maxWidth: 480,
                fontWeight: 500,
              }}
            >
              Transform your business operations with custom software environments engineered for speed, data security, and seamless usability.
            </motion.p>
          </div>

          {/* CTA pill — desktop only */}
          <motion.a
            href="#contact"
            aria-label="Talk to Sales"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            className="why-cta-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 20px",
              borderRadius: "9999px",
              border: "1.5px solid rgba(99,102,241,0.25)",
              color: "var(--color-primary)",
              fontSize: "0.78rem",
              fontWeight: 700,
              textDecoration: "none",
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
              transition: "all 0.3s ease",
            }}
          >
            Talk to Sales
            <ArrowRight size={13} strokeWidth={2.5} />
          </motion.a>
        </div>

        {/* Benefits Grid — denser */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(220px, 28vw, 310px), 1fr))",
            gap: "clamp(10px, 2vw, 18px)",
          }}
        >
          {benefits.map((benefit, i) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      animate="rest"
      variants={{
        rest: {
          y: 0,
          borderColor: "var(--border-subtle)",
          boxShadow: "0 2px 12px -4px rgba(0,0,0,0.05)",
          backgroundColor: "#FFFFFF",
        },
        hover: {
          y: -5,
          borderColor: benefit.color + "45",
          boxShadow: `0 16px 40px -8px ${benefit.color}1A`,
          backgroundColor: "#FAFCFF",
        },
      }}
      style={{
        position: "relative",
        padding: "clamp(18px, 2.8vw, 28px) clamp(16px, 2.2vw, 24px)",
        borderRadius: "clamp(14px, 2vw, 20px)",
        border: "1px solid",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <motion.div
        variants={{
          rest: { scaleX: 0, opacity: 0 },
          hover: { scaleX: 1, opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 2.5,
          background: `linear-gradient(90deg, ${benefit.color}, ${benefit.color}70)`,
          transformOrigin: "left",
        }}
      />

      {/* Icon + stat row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(12px, 2vw, 18px)" }}>
        <motion.div
          variants={{
            rest: { backgroundColor: "#F1F5F9", color: benefit.color },
            hover: { backgroundColor: benefit.color, color: "#FFFFFF" },
          }}
          transition={{ duration: 0.28 }}
          style={{
            width: "clamp(36px, 5vw, 44px)",
            height: "clamp(36px, 5vw, 44px)",
            borderRadius: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {benefit.icon}
        </motion.div>

        {/* Stat chip */}
        {benefit.stat && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)", fontWeight: 800, color: benefit.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{benefit.stat}</div>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 1 }}>{benefit.statLabel}</div>
          </div>
        )}
      </div>

      <motion.h3
        variants={{
          rest: { color: "var(--text-main)" },
          hover: { color: benefit.color },
        }}
        transition={{ duration: 0.22 }}
        style={{
          fontSize: "clamp(0.85rem, 1.7vw, 1.05rem)",
          fontWeight: 700,
          marginBottom: "clamp(6px, 1vw, 10px)",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {benefit.title}
      </motion.h3>

      <p
        style={{
          lineHeight: 1.6,
          fontSize: "clamp(0.72rem, 1.3vw, 0.82rem)",
          color: "var(--text-dim)",
          fontWeight: 500,
        }}
      >
        {benefit.description}
      </p>
    </motion.div>
  );
}
