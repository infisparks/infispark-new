"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, CheckCircle2, Github, FileText, Laptop, MapPin, 
  ExternalLink, Settings, AlertCircle, Info, ChevronRight, X, 
  Download, Trash2, Code, GraduationCap, Phone, Mail, User, Calendar, Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookDemoModal from "../components/BookDemoModal";
import GoToTop from "../components/GoToTop";
import ContactFooter from "../components/ContactFooter";
import { db } from "../lib/firebase";
import { ref, set, onValue, remove } from "firebase/database";
import Image from "next/image";

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
  qualificationOther?: string | null;
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

const DEFAULT_LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "React.js", "Next.js", "Node.js",
  "Firebase", "Supabase", "MongoDB", "PostgreSQL", "HTML5 & CSS3", "Java", "C++", "Flutter"
];

export default function InternshipPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Custom language input state
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(DEFAULT_LANGUAGES);
  const [customLanguage, setCustomLanguage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    qualification: "",
    qualificationOther: "",
    githubUrl: "",
    resumeUrl: "",
    languages: [] as string[],
    knowsSupabase: "",
    projects: [] as Project[],
    dbParadigm: "",
    dbParadigmExplanation: "",
    hasLaptop: "",
    canReportPanvel: ""
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  // Detect admin mode from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get("admin") === "true";
      setIsAdmin(adminParam);
      
      const loadFromLocalStorage = () => {
        const saved = localStorage.getItem("infisparks_applications");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Normalize legacy candidate data to avoid rendering issues
            const normalized = parsed.map((c: any) => ({
              ...c,
              projects: Array.isArray(c.projects) 
                ? c.projects 
                : [{ title: "Primary Project", url: "", description: c.projects || "" }],
              dbParadigm: c.dbParadigm || "Not Specified",
              dbParadigmExplanation: c.dbParadigmExplanation || "N/A"
            }));
            setCandidates(normalized);
          } catch (e) {
            console.error("Error parsing applications data", e);
          }
        }
      };

      if (adminParam) {
        try {
          const applicationsRef = ref(db, "applications");
          onValue(applicationsRef, (snapshot) => {
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
          }, (error) => {
            console.warn("Could not fetch applications from Firebase (likely due to security rules):", error);
            loadFromLocalStorage();
          });
        } catch (firebaseErr) {
          console.error("Firebase connection error in useEffect:", firebaseErr);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleLanguageToggle = (lang: string) => {
    setFormData(prev => {
      const selected = prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang];
      
      if (errors.languages) {
        setErrors(err => {
          const next = { ...err };
          delete next.languages;
          return next;
        });
      }
      return { ...prev, languages: selected };
    });
  };

  const handleAddCustomLanguage = () => {
    const trimmed = customLanguage.trim();
    if (!trimmed) return;
    
    // Add to available languages if not exists
    if (!availableLanguages.some(l => l.toLowerCase() === trimmed.toLowerCase())) {
      setAvailableLanguages(prev => [...prev, trimmed]);
    }
    
    // Auto-select the language if not already selected
    const match = availableLanguages.find(l => l.toLowerCase() === trimmed.toLowerCase()) || trimmed;
    if (!formData.languages.includes(match)) {
      handleLanguageToggle(match);
    }
    setCustomLanguage("");
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    setFormData(prev => {
      const updatedProjects = prev.projects.map((proj, idx) => {
        if (idx === index) {
          return { ...proj, [field]: value };
        }
        return proj;
      });
      
      // Clear error for this field
      const errKey = `project_${index}_${field}`;
      if (errors[errKey]) {
        setErrors(err => {
          const next = { ...err };
          delete next[errKey];
          return next;
        });
      }
      
      return { ...prev, projects: updatedProjects };
    });
  };

  const handleAddProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: "", url: "", description: "" }]
    }));
  };

  const handleRemoveProject = (index: number) => {
    setFormData(prev => {
      const updated = prev.projects.filter((_, idx) => idx !== index);
      
      // Clear errors related to projects and let re-validation rebuild index-based errors
      setErrors(err => {
        const next: Record<string, string> = {};
        Object.keys(err).forEach(key => {
          if (!key.startsWith("project_")) {
            next[key] = err[key];
          }
        });
        return next;
      });
      
      return { ...prev, projects: updated };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (10-12 digits)";
    }
    
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
        newErrors.age = "Applicants must be 18 years or older";
      }
    }
    
    if (!formData.city.trim()) newErrors.city = "Current location is required";
    
    if (!formData.qualification) {
      newErrors.qualification = "Qualification is required";
    } else if ((formData.qualification === "Other" || formData.qualification === "Other Technical Degree") && (!formData.qualificationOther || !formData.qualificationOther.trim())) {
      newErrors.qualificationOther = "Please specify your academic qualification";
    }
    
    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = "GitHub Profile URL is required";
    } else if (!formData.githubUrl.includes("github.com")) {
      newErrors.githubUrl = "Please enter a valid GitHub URL (github.com)";
    }
    
    if (!formData.resumeUrl.trim()) {
      newErrors.resumeUrl = "Resume / portfolio link is required";
    } else if (!formData.resumeUrl.startsWith("http://") && !formData.resumeUrl.startsWith("https://")) {
      newErrors.resumeUrl = "Please enter a valid cloud link starting with http:// or https://";
    }
    
    if (formData.languages.length === 0) {
      newErrors.languages = "Select at least one programming language";
    }
    
    if (!formData.knowsSupabase) newErrors.knowsSupabase = "Please select your Supabase experience level";
    
    // Database Paradigm Validation
    if (!formData.dbParadigm) {
      newErrors.dbParadigm = "Please select your preferred database paradigm";
    }
    if (!formData.dbParadigmExplanation.trim()) {
      newErrors.dbParadigmExplanation = "Please explain your database experience";
    } else if (formData.dbParadigmExplanation.trim().length < 30) {
      newErrors.dbParadigmExplanation = "Please write a more detailed explanation (min 30 characters)";
    }

    // Projects Array Validation
    formData.projects.forEach((proj, idx) => {
      if (!proj.title.trim()) {
        newErrors[`project_${idx}_title`] = "Project title is required";
      }
      if (proj.url.trim() && !proj.url.startsWith("http://") && !proj.url.startsWith("https://")) {
        newErrors[`project_${idx}_url`] = "URL must start with http:// or https://";
      }
      if (!proj.description.trim()) {
        newErrors[`project_${idx}_description`] = "Project description is required";
      } else if (proj.description.trim().length < 30) {
        newErrors[`project_${idx}_description`] = "Description must be at least 30 characters";
      }
    });
    
    if (!formData.hasLaptop) newErrors.hasLaptop = "Please clarify laptop ownership";
    if (!formData.canReportPanvel) newErrors.canReportPanvel = "Please clarify office commute capability";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Firebase rejects `undefined` — strip all undefined values recursively before writing
  const sanitizeForFirebase = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sanitizeForFirebase);
    if (obj !== null && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, sanitizeForFirebase(v)])
      );
    }
    return obj;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    
    const generatedRef = `ISP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(generatedRef);
    
    const newCandidate: Candidate = {
      id: generatedRef,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age),
      city: formData.city,
      qualification: (formData.qualification === "Other" || formData.qualification === "Other Technical Degree") 
        ? (formData.qualificationOther || formData.qualification) 
        : formData.qualification,
      qualificationOther: (formData.qualification === "Other" || formData.qualification === "Other Technical Degree") 
        ? (formData.qualificationOther || null)
        : null,
      githubUrl: formData.githubUrl,
      resumeUrl: formData.resumeUrl,
      languages: formData.languages,
      knowsSupabase: formData.knowsSupabase,
      projects: formData.projects,
      dbParadigm: formData.dbParadigm,
      dbParadigmExplanation: formData.dbParadigmExplanation,
      hasLaptop: formData.hasLaptop,
      canReportPanvel: formData.canReportPanvel,
      appliedAt: new Date().toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      })
    };

    set(ref(db, `applications/${generatedRef}`), sanitizeForFirebase(newCandidate))
      .then(() => {
        const updated = [newCandidate, ...candidates];
        setCandidates(updated);
        localStorage.setItem("infisparks_applications", JSON.stringify(updated));
        setIsSubmitting(false);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Firebase write error, falling back to local storage:", error);
        const updated = [newCandidate, ...candidates];
        setCandidates(updated);
        localStorage.setItem("infisparks_applications", JSON.stringify(updated));
        setIsSubmitting(false);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  const deleteCandidate = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the application of ${name}?`)) {
      remove(ref(db, `applications/${id}`))
        .then(() => {
          const updated = candidates.filter(c => c.id !== id);
          setCandidates(updated);
          localStorage.setItem("infisparks_applications", JSON.stringify(updated));
          if (selectedCandidate?.id === id) {
            setSelectedCandidate(null);
          }
        })
        .catch((error) => {
          console.error("Firebase delete error, falling back locally:", error);
          const updated = candidates.filter(c => c.id !== id);
          setCandidates(updated);
          localStorage.setItem("infisparks_applications", JSON.stringify(updated));
          if (selectedCandidate?.id === id) {
            setSelectedCandidate(null);
          }
        });
    }
  };

  const clearAllCandidates = () => {
    if (confirm("WARNING: Are you sure you want to delete ALL application records? This cannot be undone.")) {
      remove(ref(db, "applications"))
        .then(() => {
          setCandidates([]);
          localStorage.removeItem("infisparks_applications");
          setSelectedCandidate(null);
        })
        .catch((error) => {
          console.error("Firebase clear error, falling back locally:", error);
          setCandidates([]);
          localStorage.removeItem("infisparks_applications");
          setSelectedCandidate(null);
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

  // Stats calculation
  const totalCount = candidates.length;
  const supabaseExperts = candidates.filter(c => c.knowsSupabase === "hands-on").length;
  const localCandidates = candidates.filter(c => c.canReportPanvel === "yes").length;
  const laptopOwners = candidates.filter(c => c.hasLaptop === "yes").length;

  return (
    <>
      <main className="internship-page" style={{ background: "#F5F6F8", minHeight: "100vh", paddingTop: "40px", paddingBottom: "80px" }}>
        <div className="container-main" style={{ maxWidth: isAdmin ? "1200px" : "800px", margin: "0 auto", padding: "0 16px" }}>
          
          {/* Admin Dashboard Mode */}
          {isAdmin ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Dashboard Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #E5E7EB", paddingBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ background: "rgba(7,64,243,0.1)", color: "var(--color-primary)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>ADMIN PORTAL</span>
                  </div>
                  <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111827", marginTop: "6px", fontFamily: "var(--font-outfit), sans-serif" }}>Intern Applications Tracking</h1>
                  <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "2px" }}>Review and shortlist software engineering interns.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={exportCandidatesJSON} 
                    disabled={totalCount === 0}
                    style={{
                      background: "#FFFFFF", border: "1px solid #E5E7EB", padding: "8px 14px", borderRadius: "8px", 
                      fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", 
                      cursor: totalCount === 0 ? "not-allowed" : "pointer", color: "#374151"
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
                      cursor: totalCount === 0 ? "not-allowed" : "pointer", color: "#EF4444"
                    }}
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Applications</p>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginTop: "4px" }}>{totalCount}</h3>
                </div>
                <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Supabase Preferred</p>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, color: "var(--color-primary)", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
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
                  <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#F59E0B", marginTop: "4px" }}>{laptopOwners}</h3>
                </div>
              </div>

              {/* Applicants Table/Card View */}
              <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                {candidates.length === 0 ? (
                  <div style={{ padding: "48px 16px", textAlign: "center", color: "#6B7280" }}>
                    <AlertCircle size={36} style={{ margin: "0 auto 12px", color: "#9CA3AF" }} />
                    <h3 style={{ fontWeight: 600, color: "#374151" }}>No applications found</h3>
                    <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>Submit applications using the regular form to populate the database.</p>
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
                          <th style={{ padding: "14px 16px" }}>Panvel office</th>
                          <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((cand) => (
                          <tr key={cand.id} style={{ borderBottom: "1px solid #F3F4F6", color: "#1F2937", transition: "background 0.2s" }} className="hover-row">
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0740F3" }}>{cand.id}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontWeight: 700, color: "#111827" }}>{cand.name}</div>
                              <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>Age: {cand.age} • {cand.qualification}</div>
                              <div style={{ fontSize: "0.78rem", color: "#6B7280", display: "flex", gap: "8px", marginTop: "4px" }}>
                                <a href={`mailto:${cand.email}`} style={{ color: "var(--color-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}><Mail size={10} /> Mail</a>
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
                                <a href={cand.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.72rem", color: "#0740F3", textDecoration: "underline" }}><FileText size={11} /> Resume</a>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              {cand.knowsSupabase === "hands-on" ? (
                                <span style={{ background: "rgba(7,64,243,0.12)", color: "var(--color-primary)", fontWeight: 700, padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem" }}>🔥 Yes, Hands-on</span>
                              ) : cand.knowsSupabase === "basic" ? (
                                <span style={{ background: "rgba(7,64,243,0.06)", color: "#0740F3", fontWeight: 500, padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem" }}>Basic</span>
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
                                  style={{ background: "#0740F3", border: "none", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
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

              {/* View Project Details Modal */}
              <AnimatePresence>
                {selectedCandidate && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "16px" }}>
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      style={{ background: "#FFFFFF", borderRadius: "16px", width: "100%", maxWidth: "600px", margin: "auto", overflow: "hidden", border: "1px solid #E5E7EB", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
                        <div>
                          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>{selectedCandidate.name}</h3>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Application ID: {selectedCandidate.id} • Applied on {selectedCandidate.appliedAt}</p>
                        </div>
                        <button onClick={() => setSelectedCandidate(null)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: "4px" }}><X size={20} /></button>
                      </div>
                      
                      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "70vh", overflowY: "auto" }}>
                        <div>
                          <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "4px" }}><GraduationCap size={13} /> Qualification & Profile</h4>
                          <div style={{ background: "#F9FAFB", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", marginTop: "6px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                            <span><strong>Qualification:</strong> {selectedCandidate.qualification}</span>
                            <span><strong>Age:</strong> {selectedCandidate.age}</span>
                            <span><strong>Location:</strong> {selectedCandidate.city}</span>
                          </div>
                        </div>

                        <div>
                          <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "4px" }}><Code size={13} /> Project Portfolio</h4>
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                            {Array.isArray(selectedCandidate.projects) ? (
                              selectedCandidate.projects.map((proj, idx) => (
                                <div key={idx} style={{ background: "#F9FAFB", padding: "12px 14px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#111827" }}>Project #{idx + 1}: {proj.title}</span>
                                    {proj.url && (
                                      <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.72rem", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
                                        Link <ExternalLink size={10} />
                                      </a>
                                    )}
                                  </div>
                                  <p style={{ fontSize: "0.8rem", color: "#475569", marginTop: "6px", whiteSpace: "pre-line", lineHeight: 1.4 }}>{proj.description}</p>
                                </div>
                              ))
                            ) : (
                              <p style={{ background: "#F9FAFB", padding: "12px 14px", borderRadius: "8px", fontSize: "0.85rem", marginTop: "6px", color: "#374151", whiteSpace: "pre-line", lineHeight: 1.5 }}>
                                {String(selectedCandidate.projects)}
                              </p>
                            )}
                          </div>
                        </div>

                        {selectedCandidate.dbParadigm && (
                          <div>
                            <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "4px" }}><Database size={13} /> Database Paradigm ({selectedCandidate.dbParadigm})</h4>
                            <p style={{ background: "#F9FAFB", padding: "12px 14px", borderRadius: "8px", fontSize: "0.85rem", marginTop: "6px", color: "#374151", whiteSpace: "pre-line", lineHeight: 1.4 }}>
                              {selectedCandidate.dbParadigmExplanation}
                            </p>
                          </div>
                        )}

                        <div>
                          <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>Logistics Summary</h4>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "6px" }}>
                            <div style={{ padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", background: selectedCandidate.hasLaptop === "yes" ? "rgba(16,185,129,0.02)" : "rgba(239,68,68,0.02)", borderColor: selectedCandidate.hasLaptop === "yes" ? "#A7F3D0" : "#FCA5A5" }}>
                              <p style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 500 }}>Personal Laptop</p>
                              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: selectedCandidate.hasLaptop === "yes" ? "#047857" : "#B91C1C", marginTop: "2px" }}>
                                {selectedCandidate.hasLaptop === "yes" ? "✅ Owned / Ready" : "❌ No personal laptop"}
                              </p>
                            </div>
                            <div style={{ padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", background: selectedCandidate.canReportPanvel === "yes" ? "rgba(16,185,129,0.02)" : "rgba(239,68,68,0.02)", borderColor: selectedCandidate.canReportPanvel === "yes" ? "#A7F3D0" : "#FCA5A5" }}>
                              <p style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 500 }}>Office Commute</p>
                              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: selectedCandidate.canReportPanvel === "yes" ? "#047857" : "#B91C1C", marginTop: "2px" }}>
                                {selectedCandidate.canReportPanvel === "yes" ? "✅ Can report to Panvel" : "❌ Remote only"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ padding: "14px 20px", borderTop: "1px solid #F3F4F6", textAlign: "right", background: "#F9FAFB" }}>
                        <button 
                          onClick={() => setSelectedCandidate(null)}
                          style={{ background: "#374151", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            
            /* Candidate Internship Application Form */
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>


              {/* Form Status Navigation */}
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  
                  /* Dynamic Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: "#FFFFFF", borderRadius: "16px", padding: "32px 24px", textAlign: "center",
                      border: "1px solid #E5E7EB", boxShadow: "0 8px 30px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        style={{ color: "#10B981" }}
                      >
                        <CheckCircle2 size={64} strokeWidth={2.5} />
                      </motion.div>
                    </div>
                    
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", fontFamily: "var(--font-outfit), sans-serif" }}>Application Received Successfully</h2>
                    <p style={{ color: "#6B7280", fontSize: "0.88rem", marginTop: "8px", maxWidth: "480px", margin: "8px auto 0", lineHeight: 1.5 }}>
                      Thank you for applying to the Custom Software Developer internship at <strong style={{ color: "#111827", fontWeight: 700 }}>Infispark Technologies</strong>. Our technical review board has cataloged your profile details.
                    </p>

                    <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "12px", border: "1px dashed #E2E8F0", margin: "24px auto", maxWidth: "340px", textAlign: "left" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Application Tracking Reference</div>
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-primary)", marginTop: "2px", letterSpacing: "0.02em" }}>{referenceId}</div>
                      <div style={{ height: "1px", background: "#E2E8F0", margin: "10px 0" }} />
                      <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                        <strong>Applicant:</strong> {formData.name}<br />
                        <strong>Phone:</strong> {formData.phone}<br />
                        <strong>Supabase Experience:</strong> {formData.knowsSupabase === "hands-on" ? "🔥 Yes, Hands-on" : formData.knowsSupabase === "basic" ? "Basic" : "None"}
                      </div>
                    </div>

                    <div style={{ color: "#475569", fontSize: "0.82rem", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto" }}>
                      <p>
                        <span style={{ fontWeight: 700 }}>💡 Next Steps</span>: Our core developers (<strong style={{ fontWeight: 700 }}>Shaikh Mudassir</strong> and <strong style={{ fontWeight: 700 }}>Moin Zariwala</strong>) will review your GitHub repositories and projects. If your profile is shortlisted, you will receive an invitation link for a short technical screening call within 3-4 working days.
                      </p>
                    </div>

                    <div style={{ marginTop: "28px", display: "flex", gap: "12px", justifyContent: "center" }}>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: "", email: "", phone: "", age: "", city: "", qualification: "",
                            qualificationOther: "", githubUrl: "", resumeUrl: "", languages: [], knowsSupabase: "",
                            projects: [], dbParadigm: "",
                            dbParadigmExplanation: "", hasLaptop: "", canReportPanvel: ""
                          });
                        }}
                        style={{
                          background: "var(--color-primary)", color: "#fff", border: "none", padding: "11px 24px",
                          borderRadius: "10px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                          transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
                        }}
                      >
                        Submit Another Response
                      </button>
                      <a
                        href="/"
                        style={{
                          background: "#FFFFFF", color: "#374151", border: "1px solid #D1D5DB", padding: "11px 24px",
                          borderRadius: "10px", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none",
                          transition: "all 0.3s ease"
                        }}
                      >
                        Return Home
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  
                  /* Application Form Page */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                  >
                    {/* Header Details */}
                    <div style={{ textAlign: "center", marginBottom: "8px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(7,64,243,0.06)", border: "1px solid rgba(7,64,243,0.15)", padding: "5px 12px", borderRadius: "9999px", color: "var(--color-primary)", fontSize: "0.78rem", fontWeight: 700, marginBottom: "12px" }}>
                        <Sparkles size={12} /> OPEN INVITATION
                      </div>
                      <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#111827", fontFamily: "var(--font-outfit), sans-serif", letterSpacing: "-0.01em" }}>Custom Software Developer Internship</h1>
                      <p style={{ color: "#6B7280", fontSize: "0.88rem", marginTop: "6px", maxWidth: "520px", margin: "6px auto 0", lineHeight: 1.5 }}>
                        Join <strong style={{ fontWeight: 700 }}>Infispark Technologies LLP</strong> in Panvel, Mumbai. We build specialized business applications, AI workflows, and OTT systems. Show us your coding mettle.
                      </p>
                    </div>

                    {/* Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      style={{ borderRadius: "14px", overflow: "hidden", marginBottom: "8px" }}
                    >
                      <Image
                        src="/banner.png"
                        alt="Infispark Technologies – We're Hiring Developer Interns · Earn ₹10,000/month"
                        width={1200}
                        height={400}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        priority
                      />
                    </motion.div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }} noValidate>
                      
                      {/* Section 1: Basic Profile Info */}
                      <div style={{ background: "#FFFFFF", padding: "20px 24px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F3F4F6", paddingBottom: "10px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <User size={14} style={{ color: "var(--color-primary)" }} /> 1. Personal Credentials
                        </h3>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                          {/* Full Name */}
                          <div>
                            <label htmlFor="name" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Full Name <span style={{ color: "#EF4444" }}>*</span></label>
                            <input
                              type="text"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="e.g. Rahul Sharma"
                              style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.name ? "#EF4444" : "#E5E7EB"}`,
                                fontSize: "0.85rem", color: "#1F2937", outline: "none", transition: "border-color 0.2s"
                              }}
                            />
                            {errors.name && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.name}</p>}
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                            {/* Email */}
                            <div>
                              <label htmlFor="email" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Email Address <span style={{ color: "#EF4444" }}>*</span></label>
                              <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g. sharmarahul@gmail.com"
                                style={{
                                  width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.email ? "#EF4444" : "#E5E7EB"}`,
                                  fontSize: "0.85rem", color: "#1F2937", outline: "none"
                                }}
                              />
                              {errors.email && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                              <label htmlFor="phone" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Phone Number <span style={{ color: "#EF4444" }}>*</span></label>
                              <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g. +91 98765 43210"
                                style={{
                                  width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.phone ? "#EF4444" : "#E5E7EB"}`,
                                  fontSize: "0.85rem", color: "#1F2937", outline: "none"
                                }}
                              />
                              {errors.phone && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.phone}</p>}
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                            {/* Age */}
                            <div>
                              <label htmlFor="age" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Age <span style={{ color: "#EF4444" }}>*</span></label>
                              <input
                                type="number"
                                id="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder="e.g. 21"
                                style={{
                                  width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.age ? "#EF4444" : "#E5E7EB"}`,
                                  fontSize: "0.85rem", color: "#1F2937", outline: "none"
                                }}
                              />
                              {errors.age && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.age}</p>}
                            </div>

                            {/* Current City */}
                            <div>
                              <label htmlFor="city" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Current City & State <span style={{ color: "#EF4444" }}>*</span></label>
                              <input
                                type="text"
                                id="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="e.g. Panvel, Navi Mumbai"
                                style={{
                                  width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.city ? "#EF4444" : "#E5E7EB"}`,
                                  fontSize: "0.85rem", color: "#1F2937", outline: "none"
                                }}
                              />
                              {errors.city && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.city}</p>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Education & Links */}
                      <div style={{ background: "#FFFFFF", padding: "20px 24px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F3F4F6", paddingBottom: "10px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <GraduationCap size={14} style={{ color: "var(--color-primary)" }} /> 2. Academic & URLs
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {/* Highest Qualification */}
                          <div>
                            <label htmlFor="qualification" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Highest Academic Qualification <span style={{ color: "#EF4444" }}>*</span></label>
                            <select
                              id="qualification"
                              value={formData.qualification}
                              onChange={handleInputChange}
                              style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.qualification ? "#EF4444" : "#E5E7EB"}`,
                                fontSize: "0.85rem", color: "#1F2937", outline: "none", background: "#fff"
                              }}
                            >
                              <option value="">-- Select Qualification --</option>
                              <option value="B.E. / B.Tech">B.E. / B.Tech (Computer Science / IT)</option>
                              <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                              <option value="MCA">MCA (Master of Computer Applications)</option>
                              <option value="B.Sc IT / CS">B.Sc (IT / Computer Science)</option>
                              <option value="M.Sc IT / CS">M.Sc (IT / Computer Science)</option>
                              <option value="Other Technical Degree">Other Technical Degree / Diploma</option>
                              <option value="Other">Other</option>
                            </select>
                            {errors.qualification && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.qualification}</p>}
                          </div>

                          {/* Conditional Other Qualification input */}
                          {(formData.qualification === "Other" || formData.qualification === "Other Technical Degree") && (
                            <div>
                              <label htmlFor="qualificationOther" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Specify Qualification <span style={{ color: "#EF4444" }}>*</span></label>
                              <input
                                type="text"
                                id="qualificationOther"
                                value={formData.qualificationOther}
                                onChange={handleInputChange}
                                placeholder="e.g. B.Sc in Animation, Diploma in Software Eng."
                                style={{
                                  width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.qualificationOther ? "#EF4444" : "#E5E7EB"}`,
                                  fontSize: "0.85rem", color: "#1F2937", outline: "none"
                                }}
                              />
                              {errors.qualificationOther && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.qualificationOther}</p>}
                            </div>
                          )}

                          {/* GitHub Profile URL */}
                          <div>
                            <label htmlFor="githubUrl" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>GitHub Profile URL <span style={{ color: "#EF4444" }}>*</span></label>
                            <input
                              type="url"
                              id="githubUrl"
                              value={formData.githubUrl}
                              onChange={handleInputChange}
                              placeholder="https://github.com/yourusername"
                              style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.githubUrl ? "#EF4444" : "#E5E7EB"}`,
                                fontSize: "0.85rem", color: "#1F2937", outline: "none"
                              }}
                            />
                            {errors.githubUrl && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.githubUrl}</p>}
                          </div>

                          {/* Resume Link */}
                          <div>
                            <label htmlFor="resumeUrl" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Resume / CV Link (Google Drive, Dropbox, or PDF link) <span style={{ color: "#EF4444" }}>*</span></label>
                            <input
                              type="url"
                              id="resumeUrl"
                              value={formData.resumeUrl}
                              onChange={handleInputChange}
                              placeholder="https://drive.google.com/file/d/.../view"
                              style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.resumeUrl ? "#EF4444" : "#E5E7EB"}`,
                                fontSize: "0.85rem", color: "#1F2937", outline: "none"
                              }}
                            />
                            <p style={{ color: "#6B7280", fontSize: "0.7rem", marginTop: "4px" }}>💡 Ensure document sharing permissions are set to "Anyone with the link can view".</p>
                            {errors.resumeUrl && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.resumeUrl}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Technical Skills Assessment */}
                      <div style={{ background: "#FFFFFF", padding: "20px 24px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F3F4F6", paddingBottom: "10px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Code size={14} style={{ color: "var(--color-primary)" }} /> 3. Skills & Engineering Aptitude
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {/* Programming Languages Select */}
                          <div>
                            <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                              Programming Languages & Frameworks {formData.languages.length > 0 && `(Selected: ${formData.languages.length})`} <span style={{ color: "#EF4444" }}>*</span>
                            </span>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px", marginTop: "8px" }}>
                              {availableLanguages.map((lang: string) => {
                                const selected = formData.languages.includes(lang);
                                return (
                                  <button
                                    key={lang}
                                    type="button"
                                    onClick={() => handleLanguageToggle(lang)}
                                    style={{
                                      padding: "8px 10px", borderRadius: "8px", fontSize: "0.78rem", textAlign: "left",
                                      border: `1.5px solid ${selected ? "var(--color-primary)" : "#E5E7EB"}`,
                                      background: selected ? "rgba(99,102,241,0.04)" : "#FFFFFF",
                                      color: selected ? "var(--color-primary)" : "#4B5563",
                                      fontWeight: selected ? 700 : 500, cursor: "pointer", transition: "all 0.2s"
                                    }}
                                  >
                                    {selected ? "✓ " : "+ "} {lang}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Custom Skill Input */}
                            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                              <input
                                type="text"
                                value={customLanguage}
                                onChange={(e) => setCustomLanguage(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCustomLanguage();
                                  }
                                }}
                                placeholder="Add other skill (e.g. Go, Rust, Flutter)"
                                style={{
                                  flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB",
                                  fontSize: "0.82rem", color: "#1F2937", outline: "none"
                                }}
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomLanguage}
                                style={{
                                  background: "var(--color-primary)", color: "#FFFFFF", border: "none", padding: "8px 16px",
                                  borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                                  transition: "all 0.2s"
                                }}
                              >
                                + Add Skill
                              </button>
                            </div>
                            {errors.languages && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.languages}</p>}
                          </div>

                          {/* Supabase Highlight Box */}
                          <div style={{ border: "1.5px solid rgba(99, 102, 241, 0.25)", background: "rgba(99, 102, 241, 0.02)", padding: "16px", borderRadius: "10px", marginTop: "6px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                              <Info size={16} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
                              <div>
                                <span style={{ fontWeight: 800, fontSize: "0.78rem", color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em" }}>Supabase Competency (Priority Status)</span>
                                <p style={{ fontSize: "0.75rem", color: "#4B5563", marginTop: "2px", lineHeight: 1.4 }}>
                                  Candidates with working experience setting up databases, user authorization, or storage buckets inside <strong style={{ fontWeight: 700 }}>Supabase</strong> are highly sought after and receive fast-tracked evaluation.
                                </p>
                              </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#374151", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="knowsSupabase"
                                  checked={formData.knowsSupabase === "hands-on"}
                                  onChange={() => {
                                    setFormData(prev => ({ ...prev, knowsSupabase: "hands-on" }));
                                    if (errors.knowsSupabase) setErrors(e => { const n = {...e}; delete n.knowsSupabase; return n; });
                                  }}
                                  style={{ accentColor: "var(--color-primary)" }}
                                />
                                <strong>🔥 Yes, I have built projects using Supabase (Database, Auth, or Storage)</strong>
                              </label>
                              
                              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#374151", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="knowsSupabase"
                                  checked={formData.knowsSupabase === "basic"}
                                  onChange={() => {
                                    setFormData(prev => ({ ...prev, knowsSupabase: "basic" }));
                                    if (errors.knowsSupabase) setErrors(e => { const n = {...e}; delete n.knowsSupabase; return n; });
                                  }}
                                  style={{ accentColor: "var(--color-primary)" }}
                                />
                                I have basic/conceptual knowledge of Supabase
                              </label>

                              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#374151", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="knowsSupabase"
                                  checked={formData.knowsSupabase === "none"}
                                  onChange={() => {
                                    setFormData(prev => ({ ...prev, knowsSupabase: "none" }));
                                    if (errors.knowsSupabase) setErrors(e => { const n = {...e}; delete n.knowsSupabase; return n; });
                                  }}
                                  style={{ accentColor: "var(--color-primary)" }}
                                />
                                No prior experience with Supabase
                              </label>
                            </div>
                            {errors.knowsSupabase && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.knowsSupabase}</p>}
                          </div>

                          {/* Database Paradigm Question */}
                          <div>
                            <label htmlFor="dbParadigm" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Preferred Database Paradigm <span style={{ color: "#EF4444" }}>*</span></label>
                            <select
                              id="dbParadigm"
                              value={formData.dbParadigm}
                              onChange={handleInputChange}
                              style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.dbParadigm ? "#EF4444" : "#E5E7EB"}`,
                                fontSize: "0.85rem", color: "#1F2937", outline: "none", background: "#fff"
                              }}
                            >
                              <option value="">-- Select Preference --</option>
                              <option value="SQL">SQL (Relational - PostgreSQL, MySQL, SQLite, etc.)</option>
                              <option value="NoSQL">NoSQL (Non-Relational - MongoDB, Firebase, DynamoDB, etc.)</option>
                              <option value="Both">Both (Hybrid / depending on the system architecture)</option>
                              <option value="None">None / No database experience yet</option>
                            </select>
                            {errors.dbParadigm && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.dbParadigm}</p>}
                          </div>

                          <div>
                            <label htmlFor="dbParadigmExplanation" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>
                              What is best in your opinion, SQL or NoSQL? Explain your experience in a professional way. <span style={{ color: "#EF4444" }}>*</span>
                            </label>
                            <textarea
                              id="dbParadigmExplanation"
                              value={formData.dbParadigmExplanation}
                              onChange={handleInputChange}
                              placeholder="Provide a professional comparison based on your knowledge/experience. Explain which engines you have used and why you prefer one over the other for certain use cases. (min 30 characters)"
                              style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${errors.dbParadigmExplanation ? "#EF4444" : "#E5E7EB"}`,
                                fontSize: "0.85rem", color: "#1F2937", outline: "none", minHeight: "80px", resize: "vertical"
                              }}
                            />
                            {errors.dbParadigmExplanation && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.dbParadigmExplanation}</p>}
                          </div>

                          {/* Project Portfolio Builder */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>
                                Detailed Project Portfolio <span style={{ color: "#6B7280", fontWeight: 500 }}>(Optional)</span>
                              </label>
                              <span style={{ fontSize: "0.72rem", color: "#6B7280", fontWeight: 500 }}>
                                {formData.projects.length} project(s) added
                              </span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                              {formData.projects.length === 0 ? (
                                <div style={{
                                  background: "#F9FAFB",
                                  padding: "20px",
                                  borderRadius: "10px",
                                  border: "1.5px dashed #D1D5DB",
                                  textAlign: "center",
                                  color: "#6B7280",
                                  fontSize: "0.82rem"
                                }}>
                                  No projects added yet. Click the button below to add your projects.
                                </div>
                              ) : (
                                formData.projects.map((project, index) => {
                                  const titleErr = errors[`project_${index}_title`];
                                  const urlErr = errors[`project_${index}_url`];
                                  const descErr = errors[`project_${index}_description`];

                                  return (
                                    <div 
                                      key={index} 
                                      style={{ 
                                        background: "#F9FAFB", 
                                        padding: "16px", 
                                        borderRadius: "10px", 
                                        border: "1px solid #E5E7EB",
                                        position: "relative" 
                                      }}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveProject(index)}
                                        style={{
                                          position: "absolute",
                                          top: "12px",
                                          right: "12px",
                                          background: "none",
                                          border: "none",
                                          color: "#EF4444",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "4px",
                                          fontSize: "0.75rem",
                                          fontWeight: 600,
                                          padding: "4px 8px",
                                          borderRadius: "6px",
                                          transition: "background 0.2s"
                                        }}
                                        title="Remove this project"
                                      >
                                        <Trash2 size={13} style={{ marginRight: "2px" }} /> Remove
                                      </button>

                                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {/* Project Index Title */}
                                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                          Project #{index + 1}
                                        </span>

                                        {/* Project Title Input */}
                                        <div>
                                          <label htmlFor={`project_${index}_title`} style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", marginBottom: "4px" }}>
                                            Project Title <span style={{ color: "#EF4444" }}>*</span>
                                          </label>
                                          <input
                                            type="text"
                                            id={`project_${index}_title`}
                                            value={project.title}
                                            onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                                            placeholder="e.g. E-Commerce Platform or Personal Portfolio"
                                            style={{
                                              width: "100%", padding: "8px 10px", borderRadius: "6px", border: `1.5px solid ${titleErr ? "#EF4444" : "#D1D5DB"}`,
                                              fontSize: "0.8rem", color: "#1F2937", outline: "none"
                                            }}
                                          />
                                          {titleErr && <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "3px", display: "flex", alignItems: "center", gap: "3px" }}><AlertCircle size={9} /> {titleErr}</p>}
                                        </div>

                                        {/* Project URL Input */}
                                        <div>
                                          <label htmlFor={`project_${index}_url`} style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", marginBottom: "4px" }}>
                                            Project URL (GitHub / Live Link) <span style={{ color: "#9CA3AF" }}>(Optional)</span>
                                          </label>
                                          <input
                                            type="url"
                                            id={`project_${index}_url`}
                                            value={project.url}
                                            onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                                            placeholder="e.g. https://github.com/yourusername/project"
                                            style={{
                                              width: "100%", padding: "8px 10px", borderRadius: "6px", border: `1.5px solid ${urlErr ? "#EF4444" : "#D1D5DB"}`,
                                              fontSize: "0.8rem", color: "#1F2937", outline: "none"
                                            }}
                                          />
                                          {urlErr && <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "3px", display: "flex", alignItems: "center", gap: "3px" }}><AlertCircle size={9} /> {urlErr}</p>}
                                        </div>

                                        {/* Project Description Input */}
                                        <div>
                                          <label htmlFor={`project_${index}_description`} style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", marginBottom: "4px" }}>
                                            Project Description & Tech Stack <span style={{ color: "#EF4444" }}>*</span>
                                          </label>
                                          <textarea
                                            id={`project_${index}_description`}
                                            value={project.description}
                                            onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                                            placeholder="Describe the project, technologies used (frontend, backend, database), your role, and what features it has. (min 30 characters)"
                                            style={{
                                              width: "100%", padding: "8px 10px", borderRadius: "6px", border: `1.5px solid ${descErr ? "#EF4444" : "#D1D5DB"}`,
                                              fontSize: "0.8rem", color: "#1F2937", outline: "none", minHeight: "80px", resize: "vertical"
                                            }}
                                          />
                                          {descErr && <p style={{ color: "#EF4444", fontSize: "0.7rem", marginTop: "3px", display: "flex", alignItems: "center", gap: "3px" }}><AlertCircle size={9} /> {descErr}</p>}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* Add Project Button */}
                            <button
                              type="button"
                              onClick={handleAddProject}
                              style={{
                                marginTop: "12px",
                                background: "#FFFFFF",
                                color: "var(--color-primary)",
                                border: "1.5px dashed var(--color-primary)",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                width: "100%",
                                transition: "all 0.2s"
                              }}
                            >
                              {formData.projects.length === 0 ? "+ Specify Project" : "+ Add Another Project"}
                            </button>
                            {errors.projects && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.projects}</p>}
                          </div>
                        </div>
                      </div>


                      {/* Section 4: Workspace & Logistics */}
                      <div style={{ background: "#FFFFFF", padding: "20px 24px", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F3F4F6", paddingBottom: "10px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Laptop size={14} style={{ color: "var(--color-primary)" }} /> 4. Workspace & Logistics
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {/* Laptop Ownership */}
                          <div>
                            <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Do you own a personal laptop suitable for software development? <span style={{ color: "#EF4444" }}>*</span></span>
                            <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#374151", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="hasLaptop"
                                  checked={formData.hasLaptop === "yes"}
                                  onChange={() => {
                                    setFormData(prev => ({ ...prev, hasLaptop: "yes" }));
                                    if (errors.hasLaptop) setErrors(e => { const n = {...e}; delete n.hasLaptop; return n; });
                                  }}
                                  style={{ accentColor: "var(--color-primary)" }}
                                />
                                Yes, I have a development-ready laptop.
                              </label>
                              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#374151", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="hasLaptop"
                                  checked={formData.hasLaptop === "no"}
                                  onChange={() => {
                                    setFormData(prev => ({ ...prev, hasLaptop: "no" }));
                                    if (errors.hasLaptop) setErrors(e => { const n = {...e}; delete n.hasLaptop; return n; });
                                  }}
                                  style={{ accentColor: "var(--color-primary)" }}
                                />
                                No, I do not have a laptop.
                              </label>
                            </div>
                            {errors.hasLaptop && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.hasLaptop}</p>}
                          </div>

                          {/* Panvel office commute */}
                          <div>
                            <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>Are you capable of reporting to our office in Panvel, Navi Mumbai? <span style={{ color: "#EF4444" }}>*</span></span>
                            <a 
                              href="https://maps.app.goo.gl/RyhLrErH3SSAceYC6" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--color-primary)", fontSize: "0.75rem", textDecoration: "underline", fontWeight: 600, marginBottom: "8px" }}
                            >
                              <MapPin size={11} /> View Office Location on Google Maps <ExternalLink size={9} />
                            </a>

                            <div style={{ display: "flex", gap: "16px" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#374151", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="canReportPanvel"
                                  checked={formData.canReportPanvel === "yes"}
                                  onChange={() => {
                                    setFormData(prev => ({ ...prev, canReportPanvel: "yes" }));
                                    if (errors.canReportPanvel) setErrors(e => { const n = {...e}; delete n.canReportPanvel; return n; });
                                  }}
                                  style={{ accentColor: "var(--color-primary)" }}
                                />
                                Yes, I can report to the Panvel office (Hybrid / On-site).
                              </label>
                              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#374151", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="canReportPanvel"
                                  checked={formData.canReportPanvel === "no"}
                                  onChange={() => {
                                    setFormData(prev => ({ ...prev, canReportPanvel: "no" }));
                                    if (errors.canReportPanvel) setErrors(e => { const n = {...e}; delete n.canReportPanvel; return n; });
                                  }}
                                  style={{ accentColor: "var(--color-primary)" }}
                                />
                                No, I am looking for 100% remote roles.
                              </label>
                            </div>
                            {errors.canReportPanvel && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={10} /> {errors.canReportPanvel}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div style={{ marginTop: "8px" }}>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          style={{
                            width: "100%", padding: "13px", background: "var(--color-primary)", color: "#FFFFFF",
                            border: "none", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700,
                            cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "8px", transition: "all 0.3s ease",
                            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.2)"
                          }}
                          className="glow-btn-primary"
                        >
                          {isSubmitting ? (
                            <>Processing Application...</>
                          ) : (
                            <>
                              Submit Internship Application <ChevronRight size={15} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
        </div>
      </main>

      <BookDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      <GoToTop />
      <style>{`
        .internship-page {
          --color-primary: #0740F3;
        }
        .internship-page .glow-btn-primary {
          box-shadow: 0 4px 16px rgba(7, 64, 243, 0.3);
        }
        .internship-page .glow-btn-primary:hover {
          background: #0535d4 !important;
          box-shadow: 0 6px 20px rgba(7, 64, 243, 0.4);
        }
        .internship-page input:focus,
        .internship-page textarea:focus,
        .internship-page select:focus {
          border-color: #0740F3 !important;
          box-shadow: 0 0 0 3px rgba(7, 64, 243, 0.1);
        }
      `}</style>
    </>
  );
}
