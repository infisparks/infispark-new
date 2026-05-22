"use client";

import { motion, useInView } from "framer-motion";
import {
  Mail, MapPin, Phone, ArrowRight,
  Instagram, Linkedin, Twitter, CheckCircle2, Award, MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { db } from "../lib/firebase";
import { ref, set } from "firebase/database";
import { Loader2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const faqsData = [
  {
    question: "Do you build custom software from scratch or use templates?",
    answer: "Every single line of code we write is 100% custom, built from scratch to match your exact specifications. No generic templates, no bloat, and absolutely no vendor lock-in."
  },
  {
    question: "What is your standard SLA and post-launch support structure?",
    answer: "We offer 24/7 dedicated support and active maintenance SLAs. This includes real-time server monitoring, daily database backups, regular security patches, and direct developer communication channels."
  },
  {
    question: "Can you integrate AI models and WhatsApp APIs into existing systems?",
    answer: "Yes, we specialize in building custom LLM workflows, automated voice dictation systems, and official WhatsApp Business API notification pipelines that sync directly with your current databases and CRM."
  },
  {
    question: "What is the typical timeline for an enterprise custom software project?",
    answer: "Timelines range from 4 to 12 weeks depending on scope. We work in agile sprints and provide weekly staging deployments so you can track progress in real-time."
  }
];

export default function ContactFooter() {
  const [focused, setFocused] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, margin: "-10%" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "", // used for Company Name
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Work Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Company Name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const contactId = `CON-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submission = {
      id: contactId,
      name: formData.name,
      email: formData.email,
      company: formData.subject,
      message: formData.message,
      submittedAt: new Date().toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      })
    };

    set(ref(db, `contacts/${contactId}`), submission)
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
      .catch((error) => {
        console.error("Error saving contact submission to Firebase:", error);
        setIsSubmitting(false);
        setErrors({ submit: "Failed to send message. Please check your network and try again." });
      });
  };

  const contactInfo = [
    {
      icon: <Mail size={17} />,
      title: "Mail Us 24/7",
      value: "infisparks@gmail.com",
      href: "mailto:infisparks@gmail.com",
      color: "var(--color-primary)",
    },
    {
      icon: <Phone size={17} />,
      title: "Call / WhatsApp",
      value: "+91 99583 99157 / +91 81088 21353",
      href: "https://wa.me/919958399157",
      color: "#10B981",
    },
    {
      icon: <MapPin size={17} />,
      title: "Headquarters",
      value: "BKC G-Block, Bandra, Mumbai — 400051",
      href: "#",
      color: "var(--color-purple)",
    },
  ];

  return (
    <footer
      id="contact"
      style={{
        position: "relative",
        paddingTop: "clamp(56px, 9vw, 100px)",
        paddingBottom: "clamp(32px, 4vw, 48px)",
        overflow: "hidden",
        background: "linear-gradient(to top, #FFFFFF 0%, #FAFBFF 60%, #F0F7FF 100%)",
      }}
    >
      {/* Background decorations */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1.5px", background: "linear-gradient(to right, transparent, rgba(99,102,241,0.25), transparent)", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "120%", height: 500, background: "radial-gradient(ellipse at center, rgba(99,102,241,0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        {/* ── CONTACT SECTION ── */}
        <div className="contact-grid">

          {/* Left: Copy & Contact Info */}
          <div style={{ alignSelf: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="section-badge"
            >
              LET&apos;S TALK
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.07 }}
              style={{
                fontSize: "clamp(1.3rem, 4vw, 2.6rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "clamp(10px, 2vw, 18px)",
                color: "#0F172A",
                letterSpacing: "-0.035em",
              }}
            >
              Ready to Accelerate Your{" "}
              <br className="hide-sm" />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-purple))",
                  color: "white",
                  padding: "2px 12px",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                Digital Future?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              style={{
                color: "#475569",
                fontSize: "clamp(0.78rem, 1.6vw, 0.9rem)",
                marginBottom: "clamp(24px, 3.5vw, 40px)",
                maxWidth: 440,
                fontWeight: 500,
                lineHeight: 1.65,
              }}
            >
              Partner with INFISPARK TECHNOLOGIES LLP to build bespoke, scalable custom software, e-commerce architectures, and advanced AI systems.
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 2.2vw, 22px)" }}>
              {contactInfo.map((info, i) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  aria-label={info.title}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.08, ease: EASE }}
                  whileHover={{ x: 3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(10px, 1.8vw, 16px)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: "clamp(38px, 5vw, 46px)",
                      height: "clamp(38px, 5vw, 46px)",
                      borderRadius: "12px",
                      background: `${info.color}0A`,
                      border: `1px solid ${info.color}1E`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: info.color,
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        color: "#64748B",
                        fontSize: "clamp(0.58rem, 1.1vw, 0.68rem)",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      {info.title}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(0.8rem, 1.5vw, 0.92rem)",
                        fontWeight: 700,
                        color: "#0F172A",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {info.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* WhatsApp CTA pill */}
            <motion.a
              href="https://wa.me/919958399157"
              target="_blank"
              rel="noopener"
              aria-label="Chat on WhatsApp"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: "clamp(16px, 2.5vw, 28px)",
                padding: "10px 18px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                color: "#fff",
                fontSize: "0.78rem",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.01em",
                boxShadow: "0 8px 20px -4px rgba(37,211,102,0.35)",
                transition: "all 0.3s ease",
              }}
            >
              <MessageCircle size={14} strokeWidth={2.5} />
              Chat on WhatsApp
            </motion.a>
          </div>

          {/* Right: Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={isFormInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              padding: "clamp(22px, 4vw, 44px)",
              borderRadius: "clamp(20px, 3vw, 32px)",
              background: "#FFFFFF",
              border: "1px solid rgba(226,232,240,0.9)",
              boxShadow: "0 20px 56px -14px rgba(99,102,241,0.1), 0 6px 20px -6px rgba(0,0,0,0.04)",
              position: "relative",
            }}
          >
            {/* Form top accent */}
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2.5, background: "linear-gradient(90deg, var(--color-primary), var(--color-purple), var(--color-accent))", borderRadius: "0 0 5px 5px" }} />

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "40px 0",
                  gap: "16px"
                }}
              >
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Consultation Requested!
                </h3>
                <p style={{ color: "#64748B", fontSize: "0.9rem", maxWidth: "320px", lineHeight: 1.6, margin: 0 }}>
                  Thank you for reaching out. An INFISPARK technologies consultant will contact you via email within the next 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    marginTop: "12px",
                    background: "transparent",
                    border: "none",
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Send another request
                </button>
              </motion.div>
            ) : (
              <>
                <h3
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.55rem)",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: "clamp(4px, 0.8vw, 8px)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Request a Consultation
                </h3>
                <p style={{ color: "#64748B", marginBottom: "clamp(20px, 3vw, 32px)", fontWeight: 500, fontSize: "clamp(0.75rem, 1.3vw, 0.85rem)" }}>
                  Our consultants respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 18px)" }}>
                  <div className="form-row">
                    <FormInput 
                      label="Full Name" 
                      type="text" 
                      id="name" 
                      placeholder="John Doe" 
                      focused={focused === "name"} 
                      onFocus={() => setFocused("name")} 
                      onBlur={() => setFocused(null)} 
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                    <FormInput 
                      label="Work Email" 
                      type="email" 
                      id="email" 
                      placeholder="Enter email" 
                      focused={focused === "email"} 
                      onFocus={() => setFocused("email")} 
                      onBlur={() => setFocused(null)} 
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                    />
                  </div>
                  <FormInput 
                    label="Company Name" 
                    type="text" 
                    id="subject" 
                    placeholder="Enter Company Name" 
                    focused={focused === "subject"} 
                    onFocus={() => setFocused("subject")} 
                    onBlur={() => setFocused(null)} 
                    value={formData.subject}
                    onChange={handleInputChange}
                    error={errors.subject}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label
                      htmlFor="message"
                      style={{
                        fontSize: "clamp(0.68rem, 1.2vw, 0.76rem)",
                        fontWeight: 700,
                        color: focused === "message" ? "var(--color-primary)" : "#475569",
                        transition: "color 0.3s",
                        paddingLeft: 2,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      placeholder="Tell us about your requirements..."
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      value={formData.message}
                      onChange={handleInputChange}
                      style={{
                        padding: "clamp(10px, 1.5vw, 14px)",
                        borderRadius: "clamp(10px, 1.5vw, 13px)",
                        background: "#F8FAFC",
                        border: `1.5px solid ${focused === "message" ? "var(--color-primary)" : "rgba(226,232,240,0.9)"}`,
                        color: "#0F172A",
                        fontSize: "clamp(0.78rem, 1.4vw, 0.88rem)",
                        minHeight: "clamp(80px, 12vw, 110px)",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxShadow: focused === "message" ? "0 0 0 3px rgba(99,102,241,0.07)" : "none",
                        fontFamily: "var(--font-outfit), sans-serif",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {errors.submit && (
                    <p style={{ color: "#EF4444", fontSize: "0.8rem", textAlign: "center", margin: 0, fontWeight: 600 }}>
                      {errors.submit}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    className="glow-btn-primary"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    style={{
                      padding: "clamp(11px, 1.8vw, 15px)",
                      borderRadius: "9999px",
                      border: "none",
                      color: "#fff",
                      fontSize: "clamp(0.78rem, 1.5vw, 0.9rem)",
                      fontWeight: 700,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 4,
                      letterSpacing: "0.01em",
                      opacity: isSubmitting ? 0.8 : 1,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        Submitting...
                        <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                      </>
                    ) : (
                      <>
                        Request a Quote
                        <ArrowRight size={15} strokeWidth={2.5} />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>

        {/* ── FREQUENTLY ASKED QUESTIONS ── */}
        <section style={{ marginTop: "clamp(56px, 9vw, 96px)", paddingBottom: "30px" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(24px, 4vw, 48px)" }}>
            <span className="section-badge">FAQ</span>
            <h3 style={{ fontSize: "clamp(1.15rem, 3.5vw, 2.2rem)", fontWeight: 900, color: "#0F172A", marginBottom: 12, letterSpacing: "-0.035em" }}>
              Questions About Our Solutions
            </h3>
            <p style={{ color: "#475569", fontSize: "clamp(0.72rem, 1.5vw, 0.88rem)", maxWidth: 520, marginInline: "auto", fontWeight: 500, lineHeight: 1.6 }}>
              Find answers to common questions about our custom software development processes, timelines, SLAs, and integrations.
            </p>
          </div>

          <div style={{ maxWidth: "760px", marginInline: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqsData.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                  overflow: "hidden",
                  transition: "all 0.3s ease"
                }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    type="button"
                    style={{
                      width: "100%",
                      padding: "18px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: isOpen ? "rgba(99, 102, 241, 0.02)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      outline: "none"
                    }}
                  >
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: isOpen ? "var(--color-primary)" : "#0F172A", transition: "color 0.2s" }}>
                      {faq.question}
                    </span>
                    <span style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: isOpen ? "var(--color-primary)" : "#64748B",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s ease"
                    }}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: "0 24px 20px 24px",
                      fontSize: "0.82rem",
                      color: "#475569",
                      lineHeight: 1.65,
                      fontWeight: 500,
                      background: "rgba(99, 102, 241, 0.02)"
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FOOTER LINKS ── */}
        <div
          style={{
            marginTop: "clamp(56px, 9vw, 100px)",
            paddingTop: "clamp(40px, 6vw, 64px)",
            borderTop: "1px solid rgba(226,232,240,0.8)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "clamp(28px, 4vw, 48px)",
          }}
        >
          {/* Col 1 */}
          <div style={{ maxWidth: 340 }}>
            <Image
              src="/logo.png"
              alt="Infispark"
              width={100}
              height={32}
              style={{ objectFit: "contain", marginBottom: "clamp(12px, 1.8vw, 18px)" }}
            />
            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
                fontSize: "clamp(0.72rem, 1.3vw, 0.82rem)",
                fontWeight: 500,
              }}
            >
              Custom software development, mobile apps, enterprise systems, and AI integrations engineered for scalability and speed.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: "clamp(18px, 2.5vw, 28px)" }}>
              <SocialLink icon={<Instagram size={15} />} color="#E1306C" ariaLabel="Infispark Instagram" />
              <SocialLink icon={<Linkedin size={15} />} color="#0A66C2" ariaLabel="Infispark Linkedin" />
              <SocialLink icon={<Twitter size={15} />} color="#1DA1F2" ariaLabel="Infispark Twitter" />
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4
              style={{
                fontSize: "clamp(0.65rem, 1.2vw, 0.76rem)",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "clamp(14px, 2vw, 20px)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
              }}
            >
              Company
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.2vw, 12px)" }}>
              <FooterLink text="Our Story" href="#hero" />
              <FooterLink text="Contact Us" href="#contact" />
              <FooterLink text="Privacy Policy" href="#" />
              <FooterLink text="Service Status" href="#" />
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4
              style={{
                fontSize: "clamp(0.65rem, 1.2vw, 0.76rem)",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "clamp(14px, 2vw, 20px)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
              }}
            >
              Solutions
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.2vw, 12px)" }}>
              <FooterLink text="Custom Web Apps" href="/services" />
              <FooterLink text="E-commerce Tech" href="/services/ecommerce-software" />
              <FooterLink text="Mobile &amp; iOS Apps" href="/services/mobile-app-development" />
              <FooterLink text="AI Custom Software" href="/services/ai-custom-software" />
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4
              style={{
                fontSize: "clamp(0.65rem, 1.2vw, 0.76rem)",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "clamp(14px, 2vw, 20px)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
              }}
            >
              Compliance &amp; Standards
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 1.5vw, 16px)" }}>
              {[
                { icon: <CheckCircle2 size={16} />, text: "HIPAA Compliant", color: "#10B981" },
                { icon: <Award size={16} />, text: "ISO 27001 Certified", color: "var(--color-primary)" },
              ].map((badge) => (
                <div
                  key={badge.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: "clamp(0.72rem, 1.3vw, 0.82rem)",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "10px",
                      background: `${badge.color}0C`,
                      border: `1px solid ${badge.color}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: badge.color,
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {badge.icon}
                  </div>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            marginTop: "clamp(36px, 5vw, 56px)",
            paddingTop: "clamp(16px, 2.5vw, 24px)",
            borderTop: "1px solid rgba(226,232,240,0.6)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p suppressHydrationWarning style={{ color: "#94A3B8", fontSize: "clamp(0.68rem, 1.3vw, 0.78rem)", fontWeight: 500 }}>
            © {new Date().getFullYear()} INFISPARK TECHNOLOGIES LLP. All rights reserved.
          </p>
          <p style={{ color: "#94A3B8", fontSize: "clamp(0.64rem, 1.2vw, 0.74rem)", fontWeight: 600, letterSpacing: "0.01em" }}>
            Designed &amp; Engineered with Excellence ✦
          </p>
        </div>
      </div>

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 7vw, 80px);
          align-items: start;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 1000px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr; }
          .hide-sm { display: none; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
}

function FormInput({
  label, type, id, placeholder, focused, onFocus, onBlur, value, onChange, error,
}: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label
          htmlFor={id}
          style={{
            fontSize: "clamp(0.68rem, 1.2vw, 0.76rem)",
            fontWeight: 700,
            color: error ? "#EF4444" : (focused ? "var(--color-primary)" : "#475569"),
            transition: "color 0.3s",
            paddingLeft: 2,
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </label>
        {error && (
          <span style={{ fontSize: "0.68rem", color: "#EF4444", fontWeight: 600 }}>
            {error}
          </span>
        )}
      </div>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        style={{
          padding: "0 clamp(12px, 1.8vw, 16px)",
          height: "clamp(42px, 6vw, 52px)",
          borderRadius: "clamp(9px, 1.3vw, 13px)",
          background: "#F8FAFC",
          border: `1.5px solid ${error ? "#EF4444" : (focused ? "var(--color-primary)" : "rgba(226,232,240,0.9)")}`,
          color: "#0F172A",
          fontSize: "clamp(0.78rem, 1.4vw, 0.88rem)",
          outline: "none",
          transition: "all 0.3s ease",
          boxShadow: focused ? `0 0 0 3px ${error ? "rgba(239, 68, 68, 0.08)" : "rgba(99, 102, 241, 0.07)"}` : "none",
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 500,
        }}
      />
    </div>
  );
}

function FooterLink({ text, href = "#" }: { text: string; href?: string }) {
  return (
    <motion.a
      href={href}
      aria-label={text}
      whileHover={{ x: 4, color: "var(--color-primary)" }}
      style={{
        fontSize: "clamp(0.72rem, 1.3vw, 0.82rem)",
        color: "#64748B",
        textDecoration: "none",
        fontWeight: 500,
        transition: "color 0.25s ease",
        letterSpacing: "0.01em",
        display: "inline-block",
      }}
    >
      {text}
    </motion.a>
  );
}

function SocialLink({ icon, color, ariaLabel }: { icon: any; color: string; ariaLabel: string }) {
  return (
    <motion.a
      href="#"
      aria-label={ariaLabel}
      whileHover={{ y: -3, borderColor: color, color }}
      style={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        border: "1px solid rgba(226,232,240,0.9)",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748B",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
      }}
    >
      {icon}
    </motion.a>
  );
}
