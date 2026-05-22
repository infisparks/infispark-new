"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Building, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [focused, setFocused] = useState<string | null>(null);

  const stats = [
    { label: "Timeline", value: "4-8 Weeks" },
    { label: "Ownership", value: "100% Custom Code" },
    { label: "Developer Support", value: "24/7 Active SLA" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "920px",
              background: "#FFFFFF",
              borderRadius: "40px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 60px 150px -20px rgba(0,0,0,0.15)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              overflow: "hidden",
            }}
            className="modal-container"
          >
            {/* Left Side: Info */}
            <div className="modal-left" style={{ padding: "clamp(32px, 5vw, 52px)", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)", position: "relative" }}>
               <div className="section-badge" style={{ marginBottom: 24, fontSize: "0.7rem", backgroundColor: 'rgba(99, 102, 241, 0.08)' }}>FREE CONSULTATION</div>
               <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, color: "var(--text-main)", marginBottom: 14, letterSpacing: "-0.04em", lineHeight: 1.1 }}>Step into the <br /> <span style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-purple) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Future of Custom Tech</span></h2>
               <p style={{ color: "var(--text-dim)", fontSize: "clamp(0.78rem, 1.5vw, 0.9rem)", marginBottom: 36, maxWidth: 340, lineHeight: 1.6, fontWeight: 500 }}>
                 Discover how INFISPARK can build, deploy, and maintain bespoke software systems tailored for your operations.
               </p>

               <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                 {stats.map(stat => (
                   <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-primary)" }} />
                      <div>
                        <div style={{ color: "var(--text-main)", fontSize: "1.1rem", fontWeight: 700 }}>{stat.value}</div>
                        <div style={{ color: "var(--text-dim)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{stat.label}</div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Right Side: Form */}
            <div className="modal-right" style={{ padding: "clamp(28px, 4.5vw, 52px)", borderLeft: "1px solid rgba(0, 0, 0, 0.03)", position: "relative" }}>
               <button 
                 onClick={onClose}
                 style={{ position: "absolute", top: 24, right: 30, color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
                 onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
                 onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
               >
                 <X size={28} />
               </button>

               <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                 <ModalInput label="Full Name" icon={<User size={18} />} type="text" id="name" placeholder="John Doe" focused={focused==="name"} onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)} />
                 <ModalInput label="Company Name" icon={<Building size={18} />} type="text" id="company" placeholder="Enter Company Name" focused={focused==="company"} onFocus={()=>setFocused("company")} onBlur={()=>setFocused(null)} />
                 <ModalInput label="Work Email" icon={<Mail size={18} />} type="email" id="email" placeholder="john@company.com" focused={focused==="email"} onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} />
                 <ModalInput label="Contact Number" icon={<Phone size={18} />} type="text" id="phone" placeholder="+91 XXXX XXXX XXX" focused={focused==="phone"} onFocus={()=>setFocused("phone")} onBlur={()=>setFocused(null)} />

                 <button
                   type="submit"
                   className="glow-btn-primary"
                   style={{ 
                     padding: "clamp(12px, 2vw, 16px)", 
                     borderRadius: "50px", 
                     border: "none", 
                     color: "#fff", 
                     fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)", 
                     fontWeight: 700, 
                     display: "flex", 
                     alignItems: "center", 
                     justifyContent: "center", 
                     gap: 10,
                     marginTop: 12,
                     cursor: "pointer"
                   }}
                 >
                   Request a Free Quote
                   <ArrowRight size={20} strokeWidth={2.5} />
                 </button>
               </form>
            </div>
          </motion.div>
        </div>
      )}
      
      <style jsx>{`
        @media (max-width: 900px) {
          .modal-container {
             grid-template-columns: 1fr !important;
             max-height: 85vh !important;
             overflow-y: auto !important;
             border-radius: 32px !important;
          }
          .modal-left {
             padding: 40px !important;
             display: none !important;
          }
          .modal-right {
             padding: 40px !important;
             border-left: none !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}

function ModalInput({ label, icon, type, id, placeholder, focused, onFocus, onBlur }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label htmlFor={id} style={{ fontSize: "0.85rem", fontWeight: 700, color: focused ? "var(--color-primary)" : "var(--text-dim)", transition: "all 0.3s ease" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", color: focused ? "var(--color-primary)" : "var(--text-muted)", transition: "all 0.3s ease" }}>{icon}</div>
        <input 
          type={type} 
          id={id} 
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{ 
            width: "100%",
            padding: "0 24px 0 60px", 
            height: "64px", 
            borderRadius: "20px", 
            background: "#F8FAFC", 
            border: `1px solid ${focused ? "var(--color-primary)" : "rgba(0,0,0,0.05)"}`, 
            color: "var(--text-main)", 
            fontSize: "1.05rem", 
            outline: "none", 
            transition: "all 0.3s ease",
            boxShadow: focused ? "0 10px 20px rgba(99, 102, 241, 0.05)" : "none"
          }} 
        />
      </div>
    </div>
  );
}
