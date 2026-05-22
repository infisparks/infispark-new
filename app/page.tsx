"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyInfispark from "./components/WhyInfispark";
import ContactFooter from "./components/ContactFooter";
import BookDemoModal from "./components/BookDemoModal";
import GoToTop from "./components/GoToTop";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setDemoOpen(true)} />
      <main>
        <HeroSection onBookDemo={() => setDemoOpen(true)} />
        <WhyInfispark />
        <ContactFooter />
        
        {/* Semantic SEO Section */}
        <section style={{ display: "none" }}>
          <h2>Custom Software Development & IT Solutions in India</h2>
          <p>INFISPARK TECHNOLOGIES LLP provides custom software development, mobile application design, e-commerce storefront architectures, and AI integrations for growing enterprises and SMBs. Led by Shaikh Mudassir and Moin Zariwala, we craft fast, user-friendly, and secure digital platforms.</p>
          <ul>
            <li>Top Custom Software Development Agency</li>
            <li>Enterprise Web & Mobile App Engineers</li>
            <li>E-commerce Storefront Architectures</li>
            <li>AI Integrations & Automation Workflows</li>
          </ul>
        </section>
      </main>
      <BookDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      <GoToTop />
    </>
  );
}
