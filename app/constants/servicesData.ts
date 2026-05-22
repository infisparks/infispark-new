import { 
  Activity, 
  ShoppingBag, 
  FlaskConical, 
  Smartphone, 
  Tv, 
  Brain, 
  MessageSquare, 
  Headphones 
} from "lucide-react";
import React from "react";

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  features: string[];
  slug: string;
  detailedContent: string[];
}

export const services: Service[] = [
  {
    title: "Hospital Management Software (HMS)",
    description: "The most comprehensive HMS software in India. Automate OPD, IPD, Pharmacy, and Billing with ease.",
    icon: React.createElement(Activity, { className: "text-indigo-600", size: 32 }),
    image: "/service/hospital-management-software.webp",
    features: ["OPD/IPD Management", "Integrated Billing & Accounting", "Doctor's Workbench", "Pharmacy & Inventory"],
    slug: "hospital-management-software",
    detailedContent: [
      "Hospital Management Software (HMS) by INFISPARK TECHNOLOGIES LLP serves as the ultimate digital core for modern healthcare setups, multi-specialty clinics, and large hospital networks across India. In the fast-paced medical sector, clinical and administrative inefficiencies can directly impact patient care. Our custom HMS automates complex workflows across outpatient departments (OPD), inpatient departments (IPD), diagnostics, pharmacy stocks, and billing units. By replacing manual paperwork with electronic health records (EHR), healthcare facilities can easily schedule visits, track physician availability, manage patient admissions, and ensure smooth medical histories are accessible at the click of a button.",
      "At the center of our HMS is a suite of integrated modules designed to connect different hospital floors. The OPD module manages patient queues, consultation charges, and digital prescriptions. When a patient is admitted, the IPD module tracks bed occupancy, nursing desk tasks, vitals logging, and surgical schedules. The integration extends directly to the pathology lab and the in-house pharmacy; test results are instantly uploaded to the doctor’s portal, and medicine requests dynamically update the central inventory. This interconnectedness prevents stock leakages, ensures billing accuracy by auto-compiling services rendered, and minimizes manual data entry errors.",
      "Security, compliance, and reliability are built into the architectural foundation of our HMS. We implement strict role-based access control (RBAC), ensuring that doctors, nurses, administrative staff, and billing personnel only view records authorized for their specific responsibilities. The database conforms to industry security guidelines, with fully encrypted transmissions and automated daily backups to independent cloud nodes, ensuring zero data loss. The lightweight system is optimized to operate smoothly even on standard office computers and tablets, maintaining high responsiveness during peak OPD hours and ensuring that patient care is always the top priority.",
      "Furthermore, our HMS features a built-in doctor’s workbench that allows medical professionals to view comprehensive patient timelines, write digital prescriptions using pre-configured drug lists, and order lab tests directly from the consultation screen. The integrated financial module processes complex insurance claims, manages third-party billing, and provides hospital administrators with deep insights into daily collections, department-wise revenue, and pharmacy profit margins. By deploying our custom-built HMS, healthcare facilities transition from fragmented tools to a single, unified database that increases operational velocity and improves the patient experience."
    ]
  },
  {
    title: "E-commerce Custom Software",
    description: "High-performance e-commerce solutions built to scale. Seamless payments, inventory sync, and multi-channel sales.",
    icon: React.createElement(ShoppingBag, { className: "text-indigo-600", size: 32 }),
    image: "/service/ecommerce-software.webp",
    features: ["Secure Checkout", "Inventory Management", "Custom Admin Dashboard", "Multi-payment Gateway"],
    slug: "ecommerce-software",
    detailedContent: [
      "For businesses aiming to scale in the competitive retail market, template-based e-commerce frameworks often fall short of meeting complex functional and design requirements. INFISPARK TECHNOLOGIES LLP builds high-performance, fully customized e-commerce solutions that give you complete ownership of your digital store. We focus on building highly optimized backend architectures and lightning-fast frontend pages that load in milliseconds, directly boosting search engine optimization (SEO) ranks and reducing user drop-off rates. From customized catalog management and dynamic pricing filters to personalized user journeys, we design systems that adapt to your business rules.",
      "Our custom e-commerce solution is built to handle high-traffic spikes during sales events without breaking or lagging. We integrate robust checkout flows with multi-gateway systems, including Razorpay, Stripe, Paytm, UPI payments, and credit cards, ensuring frictionless transaction processes with high success rates. The cart system automatically computes customized discount coupons, dynamic shipping rates based on geographical location, and multi-tier taxation rules. Behind the scenes, the warehouse and inventory database updates in real-time, preventing issues like overselling and providing merchants with automatic low-stock alerts before items sell out entirely.",
      "Administrators are equipped with a tailored, modern dashboard that delivers crucial business intelligence. This admin panel allows you to track customer order histories, manage product catalogs, configure promotional campaigns, and analyze sales reports without technical complexity. It includes custom integration with courier partner APIs (such as Delhivery or Shiprocket) to automate shipping label generation, tracking updates, and return management. The customer profile system supports secure login options, order tracking, and purchase histories, encouraging repeat orders and raising customer lifetime value.",
      "We place extreme priority on the reliability and security of our e-commerce systems. All transactions are fully encrypted, and the codebase is audited regularly to guard against common web vulnerabilities. By opting for a custom-built solution rather than generic platforms, you avoid monthly subscription fees, template constraints, and performance bottlenecks. Our database structure is optimized to support hundreds of thousands of active products and process millions of page views daily, providing a scalable foundation that grows alongside your brand's digital presence."
    ]
  },
  {
    title: "Pathology Lab Management (LIS)",
    description: "End-to-end laboratory automation software with bi-directional machine interfacing and smart reports.",
    icon: React.createElement(FlaskConical, { className: "text-indigo-600", size: 32 }),
    image: "/service/lab-management-software.webp",
    features: ["Machine Interfacing", "QR Sample Tracking", "Smart Reports", "Patient Portal"],
    slug: "lab-management-software",
    detailedContent: [
      "The Laboratory Information System (LIS) by INFISPARK TECHNOLOGIES LLP is designed to automate the entire lifecycle of diagnostic centers, pathologies, and pathology lab networks. In manual diagnostic settings, sample mix-ups, transcription mistakes, and delayed reports are significant risks. Our LIS mitigates these vulnerabilities by introducing QR code and barcode sample tracking at the point of collection. This ensures that every tube, vial, or swab is uniquely identified and digitally matched to the patient record throughout the testing process, ensuring absolute reliability in results.",
      "A key feature of our LIS is bi-directional machine interfacing. By connecting diagnostic analyzers directly to our software, test results are automatically transmitted from the medical hardware into the LIS database without manual data entry. This bi-directional communication not only saves technician hours but also eliminates entry errors. The software automatically highlights abnormal test values and flags critical cases for immediate review. Pathologists can review sample data, look up patient historical records, and digitally authorize reports from any location using our secure doctor signature module.",
      "Once reports are approved, our system automates delivery to patients and referring doctors. The software generates clean, professional PDF reports featuring dynamic QR codes that allow readers to verify the authenticity of the test results online. Reports are dispatched instantly via automated email, WhatsApp notifications, or the secure online patient portal. Patients can view, download, and store their medical history, while clinics can manage client accounts and handle referrals efficiently. This automated loop shortens turnaround times (TAT) and enhances client satisfaction.",
      "For laboratory administrators, the LIS provides tools for billing, expense tracking, and inventory management for chemical reagents. It alerts lab managers when reagents are near expiry or running low, ensuring testing never halts. The system compiles business performance statistics, breaking down revenues by collection center, test type, and referral doctor, which enables data-driven decisions. Whether you run a single neighborhood laboratory or a multi-city diagnostic chain with hub-and-spoke collection networks, our LIS scales seamlessly to support your growing diagnostics volumes."
    ]
  },
  {
    title: "Cross-Platform Mobile Apps",
    description: "Stunning iOS and Android mobile apps crafted using React Native or Flutter. High performance and native experiences.",
    icon: React.createElement(Smartphone, { className: "text-indigo-600", size: 32 }),
    image: "/service/mobile-app-development.webp",
    features: ["Native Performance", "Offline Capability", "Push Notifications", "App Store Publishing"],
    slug: "mobile-app-development",
    detailedContent: [
      "In today's mobile-first market, having a robust presence on smartphones is a necessity for modern businesses. INFISPARK TECHNOLOGIES LLP designs and compiles cross-platform mobile apps using modern frameworks like React Native and Flutter. This cross-platform approach allows us to write a single codebase that runs on both iOS and Android platforms, cutting development timelines in half and reducing ongoing maintenance expenses. Our team focuses on building fluid interfaces, using high-framerate animations and gestures to ensure the app feels as responsive and premium as a fully native application.",
      "Our mobile applications are engineered with advanced client-side features to maximize user engagement and utility. We implement secure offline database storage, letting users access core application features even in low-connectivity areas, with automatic syncing once they are back online. We integrate native mobile capabilities such as biometric authentication (FaceID and fingerprint scanning) for secure logins, GPS-based location tracking for delivery or geo-fencing services, and camera integration for document uploading. The notification engine is customized to send personalized push notifications, driving user retention and conversion rates.",
      "Beyond coding, we manage the entire publishing process for our clients. Uploading apps to the Google Play Store and Apple App Store requires navigating strict guidelines, privacy policies, and verification steps. We handle all requirements, from compiling assets to managing App Store updates. We integrate industry-standard tracking tools and crash reports to monitor the app's real-world performance, allowing us to identify and resolve bugs before they affect your audience. Our apps are built to scale, ensuring consistent performance even as your user base grows.",
      "Each app layout is designed to match the specific branding and workflow rules of your enterprise. Whether you need a customer-facing e-commerce app, a delivery partner tracker, a B2B ordering client, or an internal operations tool for employees, we ensure the UI is clean and intuitive. By optimizing image caching and reducing bundle sizes, we ensure the app downloads quickly and runs smoothly on both budget devices and high-end smartphones, providing an inclusive digital solution for your target market."
    ]
  },
  {
    title: "OTT Platform Development",
    description: "Launch your own video streaming or OTT platform with secure content delivery, subscription models, and multi-device support.",
    icon: React.createElement(Tv, { className: "text-indigo-600", size: 32 }),
    image: "/service/ott-platform-development.webp",
    features: ["Video Streaming Infrastructure", "Subscription Models (SVOD/AVOD)", "Multi-device Support", "Secure DRM Content Protection"],
    slug: "ott-platform-development",
    detailedContent: [
      "The demand for customized video-on-demand (VOD) and live streaming setups has grown significantly among media agencies, training centers, and fitness creators. INFISPARK TECHNOLOGIES LLP develops secure, scalable OTT (Over-The-Top) platforms that give you complete authority over your video assets. We build robust video transcoding pipelines in the cloud, automatically compressing uploaded videos into multiple resolutions to ensure buffer-free streaming across varying network speeds (including 3G, 4G, 5G, and fiber broadband). This guarantees a high-quality viewing experience for all users.",
      "Content security is a primary focus of our OTT architecture. To protect your digital assets from unauthorized duplication and piracy, we integrate standard Digital Rights Management (DRM) technologies and secure tokenized URLs. The video player includes features to prevent screen recording and restricts access based on geographic location or user subscription levels. We implement multiple payment models, including Subscription Video on Demand (SVOD), Transactional Video on Demand (TVOD) for pay-per-view events, and Ad-supported Video on Demand (AVOD) for ad revenue networks.",
      "The user interface is designed to support multiple devices, providing seamless video playback across web browsers, smartphones, tablets, and smart TV applications. We implement standard user features like 'Continue Watching' queues, watchlists, search filters, and user profiles. Behind the scenes, the administrative content management system (CMS) allows your team to upload media files, organize video series and playlists, set up pricing, and view analytics regarding viewer retention, popular search terms, and active subscriber growth.",
      "Our OTT platform architecture handles high numbers of concurrent viewers during live events or major releases. By utilizing reliable cloud services and Content Delivery Networks (CDNs), we ensure that video assets are cached close to your audience, reducing load times. Whether you are launching an educational streaming portal, a corporate training library, or an entertainment channel, we configure the platform to reflect your branding and operational guidelines, creating a professional and scalable digital home for your video assets."
    ]
  },
  {
    title: "AI-Integrated Solutions",
    description: "Harness the power of Artificial Intelligence to automate tasks, generate content, and analyze data with smart models.",
    icon: React.createElement(Brain, { className: "text-indigo-600", size: 32 }),
    image: "/service/ai-custom-software.webp",
    features: ["LLM Integration", "Predictive Analytics", "AI Assistant/Agent", "Natural Language Processing"],
    slug: "ai-custom-software",
    detailedContent: [
      "Artificial Intelligence is changing the way companies operate, turning repetitive manual tasks into automated, smart processes. INFISPARK TECHNOLOGIES LLP designs custom AI-integrated software that helps businesses utilize Large Language Models (LLMs) and custom machine learning tools. We avoid generic, out-of-the-box AI wrappers; instead, we build systems that integrate directly with your company's proprietary data and existing software systems, allowing you to automate customer support, analyze complex business documents, and make decisions based on real-time data insights.",
      "We implement custom Retrieval-Augmented Generation (RAG) pipelines that allow your team to interact with internal knowledge bases, contracts, and manuals, receiving accurate answers with verified source links. We develop smart AI agents capable of performing multi-step actions, such as retrieving client files, drafting response emails, updating database records, and scheduling follow-up meetings. For search-heavy platforms, we build vector-based semantic search tools that understand user search intent beyond simple keywords, helping customers locate products or documents faster.",
      "We prioritize data privacy and system accuracy in our AI deployments. By building secure intermediate API layers, we ensure that your proprietary business records are not shared with public model training datasets. We use advanced prompt engineering, vector databases (like Pinecone or pgvector), and guardrails to prevent AI hallucinations, ensuring that generated answers conform to your company guidelines. Our custom AI dashboards present complex analytical data clearly, highlighting trends and predicting customer behavior to support business planning.",
      "Our custom AI solutions are built to connect with your existing tools, such as CRMs, ERPs, and database systems. Whether you want to add an intelligent chatbot to your e-commerce storefront, automate invoice data extraction, or deploy predictive forecasting models for inventory planning, we handle the integration from start to finish. We ensure your AI system is scalable, cost-efficient, and easy to maintain, giving your business a significant competitive advantage in a data-driven market."
    ]
  },
  {
    title: "WhatsApp API Integration",
    description: "Engage customers directly on WhatsApp. Automate notifications, customer support, and sales workflows.",
    icon: React.createElement(MessageSquare, { className: "text-indigo-600", size: 32 }),
    image: "/service/whatsapp-api-integration.webp",
    features: ["Official Business API", "Automated Notifications", "Shared Team Inbox", "Interactive Chatbots"],
    slug: "whatsapp-api-integration",
    detailedContent: [
      "As the most popular messaging tool in India, WhatsApp offers a direct channel for businesses to connect with customers. INFISPARK TECHNOLOGIES LLP integrates official WhatsApp Business API systems that allow companies to automate customer communication, achieving up to 98% open rates. We set up official business accounts under Meta guidelines, helping you secure verified business profiles. We replace manual messaging on individual phones with a scalable cloud-based API that supports multi-agent customer service workspaces, automated chat routing, and CRM database integrations.",
      "Our WhatsApp API systems automate key transactional communication. The software dispatches automated order confirmations, delivery tracking updates, appointment alerts, payment links, and diagnostic reports to users instantly. To handle common support queries, we build custom chat systems with interactive reply buttons, list menus, and catalog selectors. This allows customers to browse services, select options, and make purchases directly within the chat. Inquiries that require human assistance are automatically routed to the appropriate support agents.",
      "We integrate these messaging channels with your core company software, including e-commerce engines, patient databases, and client dashboards. Every message sent or received is logged, giving your sales and support teams complete visibility into previous communications. We also set up template management portals, allowing you to compose, test, and submit message templates for Meta approval. This ensures compliance with WhatsApp messaging policies and prevents account suspension while keeping templates ready for promotional campaigns.",
      "To help you assess performance, our WhatsApp integration features an analytics dashboard that reports delivery rates, read rates, response times, and customer satisfaction metrics. This data enables you to refine message templates, adjust automated chatbot workflows, and optimize resource allocation. Whether you need to send bulk notifications, automate customer onboarding, or build an interactive shopping bot, we build a secure, scalable WhatsApp API integration that improves customer satisfaction and drives revenue."
    ]
  },
  {
    title: "Dedicated Support & Maintenance",
    description: "Ensure your software runs 24/7 with zero downtime. Dedicated engineers for regular maintenance, backups, and feature updates.",
    icon: React.createElement(Headphones, { className: "text-indigo-600", size: 32 }),
    image: "/service/support-and-maintenance.webp",
    features: ["24/7 Server Monitoring", "Regular Backups", "Bug Fixing & Patches", "Performance Optimization"],
    slug: "support-and-maintenance",
    detailedContent: [
      "For modern companies, system downtime can lead to lost revenue and reduced customer trust. INFISPARK TECHNOLOGIES LLP offers comprehensive support and maintenance plans to ensure your custom business software, databases, and cloud systems run with maximum uptime. Our team of experienced engineers continuously audits application performance, resolves software bugs, updates packages, and installs security patches. This proactive maintenance resolves performance bottlenecks before they can disrupt your daily business operations.",
      "Security is a core focus of our support and maintenance services. We manage automated, encrypted database backups to secure, independent cloud nodes, ensuring that your valuable customer and operational data can be restored in the event of hardware failures or security incidents. We perform regular security scans, update SSL certificates, block malicious traffic, and review server access logs. We also monitor third-party API dependencies, ensuring your systems remain compatible with external updates from payment gateways, maps, and notification services.",
      "Our server management services help optimize your infrastructure costs. We monitor server load, database query execution times, and memory usage, adjusting configurations to ensure fast page loads (under 200ms) even during traffic spikes. If your application experiences rapid user growth, we manage the scale-up process, configuring load balancers and database replicas to handle the increased demand. We also provide recommendations for software upgrades and refactoring to prevent technical debt from slowing future development.",
      "We establish clear communication channels and Service Level Agreements (SLAs) for technical support. Whether you encounter a minor formatting issue or a critical system error, our helpdesk team is available to assist, providing clear resolutions. We also compile regular system health reports, detailing server performance, database storage metrics, security events, and resolved support tickets. This gives you complete visibility into the health of your digital infrastructure and helps you plan future upgrades with confidence."
    ]
  }
];
