"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, remove } from "firebase/database";
import { db, auth } from "../../lib/firebase";
import { 
  Sparkles, CheckCircle2, Github, FileText, Laptop, MapPin, 
  ExternalLink, Settings, AlertCircle, Info, ChevronRight, X, 
  Download, Trash2, Code, GraduationCap, Phone, Mail, User, Calendar, Database, LogOut, Loader2, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  title: string;
  url: string;
  description: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  qualification: string;
  qualificationOther?: string;
  githubUrl: string;
  resumeUrl: string;
  languages: string[];
  knowsSupabase: string;
  projects: Project[];
  dbParadigm: string;
  dbParadigmExplanation: string;
  hasLaptop: string;
  canReportPanvel: string;
  appliedAt: string;
}

export default function InternshipAdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupabase, setFilterSupabase] = useState("all");
  const [filterLaptop, setFilterLaptop] = useState("all");
  const [filterPanvel, setFilterPanvel] = useState("all");

  const router = useRouter();

  // Handle Authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        // Connect to Realtime Database to load candidates
        const applicationsRef = ref(db, "applications");
        const dbUnsubscribe = onValue(applicationsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const list = Object.values(data) as Candidate[];
            const normalized = list.map((c: any) => ({
              ...c,
              projects: Array.isArray(c.projects) 
                ? c.projects 
                : [{ title: "Primary Project", url: "", description: c.projects || "" }],
              dbParadigm: c.dbParadigm || "Not Specified",
              dbParadigmExplanation: c.dbParadigmExplanation || "N/A"
            }));
            normalized.sort((a, b) => (b.id || "").localeCompare(a.id || ""));
            setCandidates(normalized);
          } else {
            setCandidates([]);
          }
          setLoading(false);
        }, (error) => {
          console.error("Database reading error:", error);
          setLoading(false);
        });

        return () => dbUnsubscribe();
      } else {
        setAuthenticated(false);
        router.push("/internship/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/internship/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const deleteCandidate = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the application of ${name}?`)) {
      remove(ref(db, `applications/${id}`))
        .then(() => {
          setCandidates(prev => prev.filter(c => c.id !== id));
          if (selectedCandidate?.id === id) {
            setSelectedCandidate(null);
          }
        })
        .catch((error) => {
          console.error("Firebase delete error:", error);
          alert("Failed to delete application. Please check your credentials.");
        });
    }
  };

  const clearAllCandidates = () => {
    if (confirm("WARNING: Are you sure you want to delete ALL application records from the database? This cannot be undone.")) {
      remove(ref(db, "applications"))
        .then(() => {
          setCandidates([]);
          setSelectedCandidate(null);
        })
        .catch((error) => {
          console.error("Firebase clear error:", error);
          alert("Failed to clear applications. Please check your credentials.");
        });
    }
  };

  const exportCandidatesJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(candidates, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `infisparks_interns_applications_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSupabase = 
      filterSupabase === "all" || c.knowsSupabase === filterSupabase;
      
    const matchesLaptop = 
      filterLaptop === "all" || c.hasLaptop === filterLaptop;
      
    const matchesPanvel = 
      filterPanvel === "all" || c.canReportPanvel === filterPanvel;

    return matchesSearch && matchesSupabase && matchesLaptop && matchesPanvel;
  });

  // Stats calculation
  const totalCount = candidates.length;
  const supabaseExperts = candidates.filter(c => c.knowsSupabase === "hands-on").length;
  const localCandidates = candidates.filter(c => c.canReportPanvel === "yes").length;
  const laptopOwners = candidates.filter(c => c.hasLaptop === "yes").length;

  if (loading || !authenticated) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#F5F6F8" }}>
        <Loader2 size={36} style={{ color: "#4F46E5", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 500, fontFamily: "Inter, sans-serif" }}>Verifying Session...</p>
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <main style={{ background: "#F5F6F8", minHeight: "100vh", paddingTop: "40px", paddingBottom: "80px", fontFamily: "Inter, sans-serif" }}>
        <div className="container-main" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Dashboard Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #E5E7EB", paddingBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                    ADMIN PANEL
                  </span>
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111827", marginTop: "6px" }}>
                  Intern Applications Tracking
                </h1>
                <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "2px" }}>
                  Review and shortlist software engineering interns in real-time.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button 
                  onClick={exportCandidatesJSON} 
                  disabled={totalCount === 0}
                  style={{
                    background: "#FFFFFF", border: "1px solid #E5E7EB", padding: "8px 14px", borderRadius: "8px", 
                    fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", 
                    cursor: totalCount === 0 ? "not-allowed" : "pointer", color: "#374151", transition: "all 0.2s"
                  }}
                >
                  <Download size={14} /> Export JSON
                </button>
                <button 
                  onClick={clearAllCandidates} 
                  disabled={totalCount === 0}
                  style={{
                    background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.18)", padding: "8px 14px", 
                    borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", 
                    cursor: totalCount === 0 ? "not-allowed" : "pointer", color: "#EF4444", transition: "all 0.2s"
                  }}
                >
                  <Trash2 size={14} /> Clear All
                </button>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: "#1F2937", border: "none", padding: "8px 14px", 
                    borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", 
                    cursor: "pointer", color: "#FFFFFF", transition: "all 0.2s"
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Applications</p>
                <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginTop: "4px" }}>{totalCount}</h3>
              </div>
              <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Supabase Preferred</p>
                <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#4F46E5", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                  {supabaseExperts}
                  {totalCount > 0 && <span style={{ fontSize: "0.78rem", fontWeight: 600, background: "rgba(99,102,241,0.08)", padding: "2px 6px", borderRadius: "4px" }}>{Math.round((supabaseExperts/totalCount)*100)}%</span>}
                </h3>
              </div>
              <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Report to Panvel</p>
                <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#10B981", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                  {localCandidates}
                  {totalCount > 0 && <span style={{ fontSize: "0.78rem", fontWeight: 600, background: "rgba(16,185,129,0.08)", padding: "2px 6px", borderRadius: "4px" }}>{Math.round((localCandidates/totalCount)*100)}%</span>}
                </h3>
              </div>
              <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Owns Laptop</p>
                <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#F59E0B", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                  {laptopOwners}
                  {totalCount > 0 && <span style={{ fontSize: "0.78rem", fontWeight: 600, background: "rgba(245,158,11,0.08)", padding: "2px 6px", borderRadius: "4px" }}>{Math.round((laptopOwners/totalCount)*100)}%</span>}
                </h3>
              </div>
            </div>

            {/* Filter controls */}
            <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "12px", border: "1px solid #E5E7EB", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              {/* Search Bar */}
              <div style={{ flex: "1 1 250px", position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input 
                  type="text" 
                  placeholder="Search by Name, Email, ID or City..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              {/* Supabase Filter */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>Supabase Preference</label>
                <select 
                  value={filterSupabase} 
                  onChange={(e) => setFilterSupabase(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.82rem", outline: "none", background: "#FFFFFF" }}
                >
                  <option value="all">All Levels</option>
                  <option value="hands-on">Hands-on Expertise</option>
                  <option value="basic">Basic Knowledge</option>
                  <option value="none">No Experience</option>
                </select>
              </div>

              {/* Laptop Filter */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>Personal Laptop</label>
                <select 
                  value={filterLaptop} 
                  onChange={(e) => setFilterLaptop(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.82rem", outline: "none", background: "#FFFFFF" }}
                >
                  <option value="all">All Applicants</option>
                  <option value="yes">Has Laptop</option>
                  <option value="no">Needs Laptop</option>
                </select>
              </div>

              {/* Panvel office Filter */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>Office Commute</label>
                <select 
                  value={filterPanvel} 
                  onChange={(e) => setFilterPanvel(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.82rem", outline: "none", background: "#FFFFFF" }}
                >
                  <option value="all">All Applicants</option>
                  <option value="yes">Can Commute</option>
                  <option value="no">Remote Only</option>
                </select>
              </div>
            </div>

            {/* Applicants Table/Card View */}
            <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              {filteredCandidates.length === 0 ? (
                <div style={{ padding: "48px 16px", textAlign: "center", color: "#6B7280" }}>
                  <AlertCircle size={36} style={{ margin: "0 auto 12px", color: "#9CA3AF" }} />
                  <h3 style={{ fontWeight: 600, color: "#374151" }}>No applications found</h3>
                  <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>No applications match the search or filter criteria.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", color: "#374151", fontWeight: 700 }}>
                        <th style={{ padding: "14px 16px" }}>Candidate ID</th>
                        <th style={{ padding: "14px 16px" }}>Basic Info</th>
                        <th style={{ padding: "14px 16px" }}>Tech Stack</th>
                        <th style={{ padding: "14px 16px" }}>Supabase</th>
                        <th style={{ padding: "14px 16px" }}>Laptop</th>
                        <th style={{ padding: "14px 16px" }}>Panvel Office</th>
                        <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((cand) => (
                        <tr key={cand.id} style={{ borderBottom: "1px solid #F3F4F6", color: "#1F2937", transition: "background 0.2s" }} className="hover-row">
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: "#4F46E5" }}>{cand.id}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ fontWeight: 700, color: "#111827" }}>{cand.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>Age: {cand.age} • {cand.qualification}</div>
                            <div style={{ fontSize: "0.78rem", color: "#6B7280", display: "flex", gap: "8px", marginTop: "4px" }}>
                              <a href={`mailto:${cand.email}`} style={{ color: "#4F46E5", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}><Mail size={10} /> Mail</a>
                              <a href={`tel:${cand.phone}`} style={{ color: "#10B981", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}><Phone size={10} /> Call</a>
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "250px" }}>
                              {cand.languages.map(lang => (
                                <span key={lang} style={{ fontSize: "0.7rem", background: "#F3F4F6", padding: "1px 6px", borderRadius: "4px", color: "#4B5563", fontWeight: 500 }}>{lang}</span>
                              ))}
                            </div>
                            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                              <a href={cand.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.72rem", color: "#374151", textDecoration: "underline" }}><Github size={11} /> GitHub</a>
                              <a href={cand.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.72rem", color: "#4F46E5", textDecoration: "underline" }}><FileText size={11} /> Resume</a>
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            {cand.knowsSupabase === "hands-on" ? (
                              <span style={{ background: "rgba(99,102,241,0.12)", color: "#4F46E5", fontWeight: 700, padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem" }}>🔥 Yes, Hands-on</span>
                            ) : cand.knowsSupabase === "basic" ? (
                              <span style={{ background: "rgba(99,102,241,0.06)", color: "#4F46E5", fontWeight: 500, padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem" }}>Basic</span>
                            ) : (
                              <span style={{ color: "#9CA3AF", fontSize: "0.75rem" }}>None</span>
                            )}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            {cand.hasLaptop === "yes" ? (
                              <span style={{ color: "#10B981", fontWeight: 700 }}>Yes</span>
                            ) : (
                              <span style={{ color: "#EF4444", fontWeight: 600 }}>No 💻</span>
                            )}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            {cand.canReportPanvel === "yes" ? (
                              <span style={{ color: "#10B981", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}><MapPin size={11} /> Yes</span>
                            ) : (
                              <span style={{ color: "#EF4444", fontWeight: 600 }}>No</span>
                            )}
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                              <button 
                                onClick={() => setSelectedCandidate(cand)}
                                style={{ background: "#4F46E5", border: "none", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                              >
                                View
                              </button>
                              <button 
                                onClick={() => deleteCandidate(cand.id, cand.name)}
                                style={{ background: "none", border: "none", color: "#EF4444", padding: "4px", cursor: "pointer" }}
                                title="Delete candidate"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* View Full Details Modal */}
            <AnimatePresence>
              {selectedCandidate && (
                <div
                  onClick={(e) => { if (e.target === e.currentTarget) setSelectedCandidate(null); }}
                  style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "16px" }}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    style={{ background: "#FFFFFF", borderRadius: "16px", width: "100%", maxWidth: "720px", margin: "auto", overflow: "hidden", border: "1px solid #E5E7EB", boxShadow: "0 20px 40px -5px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}
                  >
                    {/* Modal Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <User size={20} style={{ color: "#4F46E5" }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111827", margin: 0 }}>{selectedCandidate.name}</h3>
                          <p style={{ fontSize: "0.72rem", color: "#6B7280", margin: "2px 0 0" }}>
                            Application ID: <strong style={{ color: "#4F46E5" }}>{selectedCandidate.id}</strong> &nbsp;•&nbsp; Applied: {selectedCandidate.appliedAt}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedCandidate(null)} style={{ background: "#F3F4F6", border: "none", color: "#6B7280", cursor: "pointer", padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center" }}>
                        <X size={18} />
                      </button>
                    </div>

                    {/* Scrollable Body */}
                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>

                      {/* Section 1: Personal Information */}
                      <div>
                        <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                          <User size={12} /> Personal Information
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          {[
                            { label: "Full Name", value: selectedCandidate.name },
                            { label: "Age", value: `${selectedCandidate.age} years` },
                            { label: "City / Location", value: selectedCandidate.city },
                            { label: "Qualification", value: selectedCandidate.qualification + (selectedCandidate.qualificationOther ? ` (${selectedCandidate.qualificationOther})` : "") },
                          ].map(({ label, value }) => (
                            <div key={label} style={{ background: "#F9FAFB", padding: "10px 14px", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                              <p style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>{label}</p>
                              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", marginTop: "3px", wordBreak: "break-word" }}>{value || "—"}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 2: Contact Details */}
                      <div>
                        <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                          <Phone size={12} /> Contact & Links
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <div style={{ background: "#F9FAFB", padding: "10px 14px", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                            <p style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Email</p>
                            <a href={`mailto:${selectedCandidate.email}`} style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4F46E5", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", marginTop: "3px", wordBreak: "break-all" }}>
                              <Mail size={12} /> {selectedCandidate.email}
                            </a>
                          </div>
                          <div style={{ background: "#F9FAFB", padding: "10px 14px", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                            <p style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Phone</p>
                            <a href={`tel:${selectedCandidate.phone}`} style={{ fontSize: "0.82rem", fontWeight: 600, color: "#10B981", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                              <Phone size={12} /> {selectedCandidate.phone}
                            </a>
                          </div>
                          <div style={{ background: "#F9FAFB", padding: "10px 14px", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                            <p style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>GitHub Profile</p>
                            <a href={selectedCandidate.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", marginTop: "3px", wordBreak: "break-all" }}>
                              <Github size={12} /> {selectedCandidate.githubUrl}
                            </a>
                          </div>
                          <div style={{ background: "#F9FAFB", padding: "10px 14px", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                            <p style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Resume / Portfolio</p>
                            <a href={selectedCandidate.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4F46E5", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", marginTop: "3px", wordBreak: "break-all" }}>
                              <FileText size={12} /> View Resume <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Tech Stack & Languages */}
                      <div>
                        <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                          <Code size={12} /> Programming Languages & Frameworks
                        </h4>
                        <div style={{ background: "#F9FAFB", padding: "12px 14px", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {(selectedCandidate.languages || []).map((lang) => (
                              <span key={lang} style={{ fontSize: "0.75rem", background: "#EEF2FF", color: "#4F46E5", padding: "3px 10px", borderRadius: "999px", fontWeight: 600, border: "1px solid #C7D2FE" }}>{lang}</span>
                            ))}
                            {(!selectedCandidate.languages || selectedCandidate.languages.length === 0) && (
                              <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>No languages specified</span>
                            )}
                          </div>
                          <p style={{ fontSize: "0.72rem", color: "#6B7280", marginTop: "8px", fontWeight: 500 }}>{selectedCandidate.languages?.length || 0} skill{selectedCandidate.languages?.length !== 1 ? "s" : ""} selected</p>
                        </div>
                      </div>

                      {/* Section 4: Supabase Experience */}
                      <div>
                        <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                          <Sparkles size={12} /> Supabase Experience
                        </h4>
                        <div style={{ background: "#F9FAFB", padding: "12px 14px", borderRadius: "8px", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "10px" }}>
                          {selectedCandidate.knowsSupabase === "hands-on" ? (
                            <span style={{ background: "rgba(99,102,241,0.12)", color: "#4F46E5", fontWeight: 700, padding: "5px 14px", borderRadius: "999px", fontSize: "0.8rem" }}>🔥 Hands-on Expertise — High selection priority</span>
                          ) : selectedCandidate.knowsSupabase === "basic" ? (
                            <span style={{ background: "rgba(99,102,241,0.06)", color: "#6366F1", fontWeight: 600, padding: "5px 14px", borderRadius: "999px", fontSize: "0.8rem" }}>📘 Basic Knowledge</span>
                          ) : (
                            <span style={{ background: "#F3F4F6", color: "#6B7280", fontWeight: 500, padding: "5px 14px", borderRadius: "999px", fontSize: "0.8rem" }}>No Supabase Experience</span>
                          )}
                        </div>
                      </div>

                      {/* Section 5: Database Paradigm */}
                      {selectedCandidate.dbParadigm && (
                        <div>
                          <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                            <Database size={12} /> Database Preference &amp; Experience
                          </h4>
                          <div style={{ background: "#F9FAFB", padding: "12px 14px", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                            <span style={{ background: "#EEF2FF", color: "#4F46E5", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", fontSize: "0.78rem" }}>{selectedCandidate.dbParadigm}</span>
                            <p style={{ fontSize: "0.83rem", color: "#374151", marginTop: "10px", whiteSpace: "pre-line", lineHeight: 1.6 }}>{selectedCandidate.dbParadigmExplanation}</p>
                          </div>
                        </div>
                      )}

                      {/* Section 6: Project Portfolio */}
                      <div>
                        <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                          <Code size={12} /> Project Portfolio ({Array.isArray(selectedCandidate.projects) ? selectedCandidate.projects.length : 0} project{Array.isArray(selectedCandidate.projects) && selectedCandidate.projects.length !== 1 ? "s" : ""})
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {Array.isArray(selectedCandidate.projects) && selectedCandidate.projects.length > 0 ? (
                            selectedCandidate.projects.map((proj, idx) => (
                              <div key={idx} style={{ background: "#F9FAFB", padding: "14px", borderRadius: "10px", border: "1px solid #E5E7EB" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ background: "#4F46E5", color: "#fff", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>{idx + 1}</span>
                                    <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>{proj.title}</span>
                                  </div>
                                  {proj.url && (
                                    <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#4F46E5", fontWeight: 600, textDecoration: "none", background: "rgba(99,102,241,0.08)", padding: "3px 8px", borderRadius: "6px" }}>
                                      <ExternalLink size={11} /> View Project
                                    </a>
                                  )}
                                </div>
                                <p style={{ fontSize: "0.82rem", color: "#475569", margin: 0, whiteSpace: "pre-line", lineHeight: 1.6 }}>{proj.description}</p>
                              </div>
                            ))
                          ) : (
                            <div style={{ background: "#F9FAFB", padding: "14px", borderRadius: "8px", color: "#9CA3AF", fontSize: "0.82rem", textAlign: "center" }}>No projects added</div>
                          )}
                        </div>
                      </div>

                      {/* Section 7: Logistics */}
                      <div>
                        <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                          <Laptop size={12} /> Logistics &amp; Availability
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div style={{ padding: "14px", borderRadius: "10px", border: "1px solid", background: selectedCandidate.hasLaptop === "yes" ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)", borderColor: selectedCandidate.hasLaptop === "yes" ? "#A7F3D0" : "#FCA5A5" }}>
                            <p style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Personal Laptop</p>
                            <p style={{ fontWeight: 700, fontSize: "0.88rem", color: selectedCandidate.hasLaptop === "yes" ? "#047857" : "#B91C1C", marginTop: "6px" }}>
                              {selectedCandidate.hasLaptop === "yes" ? "✅ Yes, I own a laptop" : "❌ No personal laptop"}
                            </p>
                          </div>
                          <div style={{ padding: "14px", borderRadius: "10px", border: "1px solid", background: selectedCandidate.canReportPanvel === "yes" ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)", borderColor: selectedCandidate.canReportPanvel === "yes" ? "#A7F3D0" : "#FCA5A5" }}>
                            <p style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Panvel Office Commute</p>
                            <p style={{ fontWeight: 700, fontSize: "0.88rem", color: selectedCandidate.canReportPanvel === "yes" ? "#047857" : "#B91C1C", marginTop: "6px" }}>
                              {selectedCandidate.canReportPanvel === "yes" ? "✅ Can report to Panvel" : "❌ Remote only"}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Modal Footer */}
                    <div style={{ padding: "14px 24px", borderTop: "1px solid #E5E7EB", background: "#F9FAFB", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a href={`mailto:${selectedCandidate.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", fontWeight: 600, color: "#4F46E5", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", padding: "7px 12px", borderRadius: "8px", textDecoration: "none" }}>
                          <Mail size={13} /> Email
                        </a>
                        <a href={`tel:${selectedCandidate.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", fontWeight: 600, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.15)", padding: "7px 12px", borderRadius: "8px", textDecoration: "none" }}>
                          <Phone size={13} /> Call
                        </a>
                        <a href={selectedCandidate.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", fontWeight: 600, color: "#374151", background: "#F3F4F6", border: "1px solid #E5E7EB", padding: "7px 12px", borderRadius: "8px", textDecoration: "none" }}>
                          <Github size={13} /> GitHub
                        </a>
                      </div>
                      <button
                        onClick={() => setSelectedCandidate(null)}
                        style={{ background: "#374151", border: "none", color: "#fff", padding: "8px 18px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <style jsx global>{`
        .hover-row:hover {
          background-color: #F9FAFB;
        }
      `}</style>
    </>
  );
}
