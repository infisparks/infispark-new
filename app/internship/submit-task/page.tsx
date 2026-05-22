"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ref, get, update } from "firebase/database";
import { db } from "../../lib/firebase";
import { 
  Sparkles, CheckCircle2, Github, FileText, ExternalLink, 
  AlertCircle, Info, Loader2, Code, Laptop, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  title: string;
  deadline: string;
  assignedAt: string;
}

interface TaskSubmission {
  explainWorking: string;
  productionUrl: string;
  githubUrl: string;
  submittedAt: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  task?: Task;
  taskSubmission?: TaskSubmission;
}

const formatDeadline = (dateTimeStr: string) => {
  if (!dateTimeStr) return "";
  try {
    if (/[a-zA-Z]/.test(dateTimeStr) && !/am|pm/i.test(dateTimeStr)) return dateTimeStr;
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    const datePart = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "morning" : "night";
    
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }
    
    const hoursStr = String(hours).padStart(2, "0");
    return `${datePart}, ${hoursStr}:${minutes} ${period}`;
  } catch (e) {
    return dateTimeStr;
  }
};

function TaskSubmissionContent() {
  const searchParams = useSearchParams();
  const candidateIdParam = searchParams.get("candidateId") || "";
  const candidateNameParam = searchParams.get("candidateName") || "";
  const taskNameParam = searchParams.get("taskName") || "";

  const [candidateId, setCandidateId] = useState(candidateIdParam);
  const [candidateName, setCandidateName] = useState(candidateNameParam);
  const [taskName, setTaskName] = useState(taskNameParam);
  const [taskDeadline, setTaskDeadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [explainWorking, setExplainWorking] = useState("");
  const [productionUrl, setProductionUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch candidate details from Firebase to get actual assigned task details
  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }

    const candidateRef = ref(db, `applications/${candidateId}`);
    get(candidateRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Candidate;
          setCandidate(data);
          setCandidateName(data.name);
          if (data.task) {
            setTaskName(data.task.title);
            setTaskDeadline(formatDeadline(data.task.deadline));
          }
          if (data.taskSubmission) {
            setExplainWorking(data.taskSubmission.explainWorking);
            setProductionUrl(data.taskSubmission.productionUrl);
            setGithubUrl(data.taskSubmission.githubUrl);
            setIsSubmitted(true);
          }
        } else {
          setErrorMsg("Application reference ID not found. Please double-check your link.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Firebase read error:", err);
        // Fallback to query params if Firebase read fails
        setLoading(false);
      });
  }, [candidateId]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!explainWorking.trim()) {
      errors.explainWorking = "Explanation of working is required";
    } else if (explainWorking.trim().length < 30) {
      errors.explainWorking = "Please provide a more detailed explanation (min 30 characters)";
    }

    if (!productionUrl.trim()) {
      errors.productionUrl = "Production live URL is required";
    } else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(productionUrl.trim())) {
      errors.productionUrl = "Please enter a valid URL starting with http:// or https://";
    }

    if (!githubUrl.trim()) {
      errors.githubUrl = "GitHub repository URL is required";
    } else if (!githubUrl.trim().includes("github.com")) {
      errors.githubUrl = "Please enter a valid GitHub URL (e.g. github.com/username/repo)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!candidateId) {
      setErrorMsg("Candidate ID is required to submit the task.");
      return;
    }

    setIsSubmitting(true);

    const submissionData: TaskSubmission = {
      explainWorking: explainWorking.trim(),
      productionUrl: productionUrl.trim(),
      githubUrl: githubUrl.trim(),
      submittedAt: new Date().toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      })
    };

    try {
      await update(ref(db, `applications/${candidateId}`), {
        taskSubmission: submissionData
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting task:", err);
      alert("Failed to submit task. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Loader2 size={36} style={{ color: "#4F46E5", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 500 }}>Loading Task Details...</p>
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state (Invalid Link / No ID)
  if (!candidateId || errorMsg) {
    return (
      <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "32px 24px", textAlign: "center", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <AlertCircle size={48} style={{ color: "#EF4444", margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>Invalid Task Link</h2>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", marginTop: "8px", maxWidth: "400px", margin: "8px auto 0", lineHeight: 1.5 }}>
          {errorMsg || "The task submission link is missing candidate identification. Please contact the Infispark recruiting team for a valid submission link."}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "#FFFFFF", borderRadius: "16px", padding: "32px 24px", textAlign: "center",
              border: "1px solid #E5E7EB", boxShadow: "0 8px 30px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <div style={{ color: "#10B981", background: "rgba(16,185,129,0.1)", padding: "12px", borderRadius: "50%" }}>
                <CheckCircle2 size={48} />
              </div>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827" }}>Task Submitted Successfully</h2>
            <p style={{ color: "#6B7280", fontSize: "0.88rem", marginTop: "8px", lineHeight: 1.5 }}>
              Thank you, <strong>{candidateName}</strong>! Your task submissions have been updated in our candidate database.
            </p>

            <div style={{ background: "#F9FAFB", padding: "16px", borderRadius: "12px", border: "1px solid #E5E7EB", margin: "24px 0", textAlign: "left" }}>
              <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Submission Details</h4>
              <p style={{ fontSize: "0.82rem", color: "#374151", margin: "4px 0" }}>
                <strong>Candidate ID:</strong> {candidateId}
              </p>
              <p style={{ fontSize: "0.82rem", color: "#374151", margin: "4px 0" }}>
                <strong>Task Name:</strong> {taskName || "Internship Evaluation Task"}
              </p>
              <p style={{ fontSize: "0.82rem", color: "#374151", margin: "4px 0", wordBreak: "break-all" }}>
                <strong>Production Live URL:</strong> <a href={productionUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#4F46E5", textDecoration: "underline" }}>{productionUrl} <ExternalLink size={10} style={{ display: "inline" }} /></a>
              </p>
              <p style={{ fontSize: "0.82rem", color: "#374151", margin: "4px 0", wordBreak: "break-all" }}>
                <strong>GitHub Repository URL:</strong> <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#4F46E5", textDecoration: "underline" }}>{githubUrl} <ExternalLink size={10} style={{ display: "inline" }} /></a>
              </p>
            </div>

            <p style={{ color: "#6B7280", fontSize: "0.8rem" }}>
              Our review team has been notified. We will examine the implementation and revert soon!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#FFFFFF", borderRadius: "16px", padding: "28px 24px",
              border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
            }}
          >
            {/* Header info */}
            <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "16px", marginBottom: "20px" }}>
              <span style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5", padding: "4px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
                TASK SUBMISSION
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", marginTop: "8px" }}>
                {taskName || "Evaluation Task Submission"}
              </h2>
              <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "4px" }}>
                Candidate Name: <strong>{candidateName}</strong> (ID: {candidateId})
              </p>
              {taskDeadline && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(245,158,11,0.08)", color: "#D97706", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, marginTop: "8px" }}>
                  <span>Deadline: {taskDeadline}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Input 1: Explain the working */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
                  Explain the working *
                </label>
                <textarea
                  placeholder="Describe your task solution, technical architecture, setup steps, and how the core logic works..."
                  value={explainWorking}
                  onChange={(e) => setExplainWorking(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${formErrors.explainWorking ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    resize: "vertical"
                  }}
                />
                {formErrors.explainWorking && (
                  <span style={{ color: "#EF4444", fontSize: "0.75rem", fontWeight: 500 }}>
                    {formErrors.explainWorking}
                  </span>
                )}
              </div>

              {/* Input 2: Production Live URL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
                  Production Live URL *
                </label>
                <input
                  type="text"
                  placeholder="https://my-intern-task.vercel.app"
                  value={productionUrl}
                  onChange={(e) => setProductionUrl(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${formErrors.productionUrl ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
                {formErrors.productionUrl && (
                  <span style={{ color: "#EF4444", fontSize: "0.75rem", fontWeight: 500 }}>
                    {formErrors.productionUrl}
                  </span>
                )}
              </div>

              {/* Input 3: GitHub repository URL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
                  GitHub repository URL of the task *
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/username/my-intern-task"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${formErrors.githubUrl ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
                {formErrors.githubUrl && (
                  <span style={{ color: "#EF4444", fontSize: "0.75rem", fontWeight: 500 }}>
                    {formErrors.githubUrl}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: "#4F46E5",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
                  transition: "all 0.2s"
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Submit Task
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TaskSubmissionPage() {
  return (
    <main style={{ background: "#F5F6F8", minHeight: "100vh", paddingTop: "60px", paddingBottom: "100px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
        {/* Simple Navigation Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111827" }}>
            Infispark Technologies
          </h1>
          <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "2px" }}>
            Internship Evaluation Submission Portal
          </p>
        </div>

        {/* Suspense Boundary for useSearchParams */}
        <Suspense fallback={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
            <Loader2 size={36} style={{ color: "#4F46E5", animation: "spin 1s linear infinite" }} />
          </div>
        }>
          <TaskSubmissionContent />
        </Suspense>
      </div>
    </main>
  );
}
