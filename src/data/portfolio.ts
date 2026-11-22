export interface SystemMetric {
  label: string;
  value: string;
  note: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  detail?: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export type ProjectCategory =
  | "FLAGSHIP"
  | "AI_SYSTEMS"
  | "HACKATHON"
  | "FULL_STACK";

export interface ProjectItem {
  id: string;
  name: string;
  repoName: string;
  tagline: string;
  summary: string;
  category: ProjectCategory;
  /** Retained for layout grouping compatibility across sections */
  tier: "FLAGSHIP" | "AI_SYSTEMS" | "TOOLING";
  featured?: boolean;
  roleSignal: string;
  accent: "cyan" | "amber" | "coral";
  status: string;
  visibility: "Public" | "Private";
  language: string;
  license?: string;
  eventOrContext?: string;
  liveUrl?: string;
  repoUrl: string;
  secondaryRepoUrl?: string;
  externalLinks?: ExternalLink[];
  metrics: SystemMetric[];
  problem: string;
  constraints: string[];
  stack: string[];
  dataflow: string[];
  diagramNodes: DiagramNode[];
  diagramEdges: DiagramEdge[];
  decisions: string[];
}

export interface AdditionalRepoItem {
  id: string;
  name: string;
  visibility: "Public" | "Private";
  language: string;
  license?: string;
  updated: string;
  summary: string;
  repoUrl?: string;
  note?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  type: string;
  accent?: "cyan" | "amber" | "coral";
  highlights: string[];
  stack: string[];
  link?: ExternalLink;
}

export interface EducationItem {
  id: string;
  program: string;
  institution: string;
  period: string;
  status: "In Progress" | "Completed";
  details?: string;
}

export interface SkillGroup {
  category: string;
  accent: "cyan" | "amber" | "coral";
  items: string[];
}

export interface CredentialItem {
  title: string;
  issuer: string;
  year: string;
  date: string;
  type: string;
  role?: string;
  credentialId?: string;
  verifyUrl?: string;
  signatory?: string;
  note?: string;
  fileName?: string;
}

export interface CredentialGroup {
  category: string;
  accent: "cyan" | "amber" | "coral";
  note?: string;
  noteUrl?: string;
  items: CredentialItem[];
}

export interface HeroStat {
  value: string;
  label: string;
}

export const PROFILE = {
  name: "Thu Ta Sitt",
  handle: "DevHuang1",
  initials: "TS",
  role: "Full-Stack, AI Systems & Applied ML Builder",
  headline: "Full-Stack, AI Systems & Applied ML Builder",
  targetRoles: [
    "Forward Deployed Engineer",
    "Full-Stack Engineer",
    "AI Systems / MLOps",
  ],
  location: "Yangon, Myanmar",
  timezone: "Asia/Yangon",
  timezoneLabel: "YGN_MMT",
  domain: "thutasitt.dev",
  designPreference: "Dark-mode-first aesthetic",
  summary:
    "NASA Space Apps Challenge 2026 Yangon Youth Scientific Excellence Award winner (Myanmar Space Agency) and Computer Science undergraduate (B.C.Sc., 2024–2028) at UIT, Yangon. Specializes in full-stack web engineering, multi-agent AI systems, and applied machine learning across 3D space simulation, geospatial intelligence, real-time fraud detection, and edtech.",
  spokenLanguages: [
    "English (Fluent)",
    "Burmese (Native)",
    "Japanese (N5, In Progress)",
  ],
  links: {
    github: "https://github.com/DevHuang1",
    linkedin: "https://www.linkedin.com/in/thu-ta-sitt-6b680734b/",
    email: "mailto:ryanthuta77@gmail.com",
    rawEmail: "ryanthuta77@gmail.com",
    bibiversusEmail: "sitt@bibiversus.com",
    cvPdf: "/cv/ThuTaSitt_CV.pdf",
    cvDocx: "/cv/ThuTaSitt_CV.docx",
  },
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Languages",
    accent: "cyan",
    items: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Java (Java 21)",
    ],
  },
  {
    category: "Frontend & 3D",
    accent: "amber",
    items: [
      "Next.js (App Router, SSR/SSG)",
      "React (React 19)",
      "Vite",
      "Tailwind CSS (v4)",
      "Three.js / WebGL / WebXR",
      "Leaflet",
      "Aladin Lite",
      "Godot",
    ],
  },
  {
    category: "Backend & Real-Time",
    accent: "coral",
    items: [
      "Node.js",
      "Express.js (v5)",
      "Spring Boot 4",
      "Socket.IO",
      "WebSockets",
      "WebRTC",
      "aiogram",
    ],
  },
  {
    category: "AI, ML & GeoAI",
    accent: "cyan",
    items: [
      "Keras",
      "scikit-learn",
      "XGBoost",
      "Pandas",
      "NumPy",
      "LLM fine-tuning (Qwen 3.5 VL 8B)",
      "Multi-Agent AI Systems",
      "RAG (pgvector, MedCPT, Docling)",
      "GeoAI (SAM, NDWI, Google Earth Engine)",
      "Gemini",
      "Groq",
      "OpenRouter",
    ],
  },
  {
    category: "Cloud, Databases & DevOps",
    accent: "amber",
    items: [
      "PostgreSQL",
      "Supabase (Realtime + RLS)",
      "MongoDB",
      "MySQL",
      "AWS (Cloud Practitioner)",
      "Google Cloud Platform",
      "Docker Containers & Compose",
      "VPS Administration (Self-Hosted Linux)",
      "Vercel",
      "Railway",
      "Git / GitHub",
      "CI/CD",
      "Networking (CCNA)",
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "bibiversus",
    role: "Founder & Tech Lead",
    organization: "BibiVersus",
    period: "2026 — Present",
    type: "Real-Time EdTech",
    accent: "amber",
    highlights: [
      "Architected a competitive bilingual (English/Myanmar) 1v1 study arena and study-squad platform covering Computer Science, IELTS, Grade 12, and Myanmar History.",
      "Engineered real-time duels, live spectating, XP/MMR progression, and Telegram bot integration.",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "WebSockets",
      "Telegram Bot",
      "PostgreSQL",
      "XP / MMR Engine",
    ],
    link: {
      label: "bibiversus.com",
      url: "https://bibiversus.com",
    },
  },
  {
    id: "uit-project-lead",
    role: "Project Lead Developer",
    organization: "University of Information Technology (UIT), Yangon",
    period: "May 2025 — Present",
    type: "Engineering Leadership",
    accent: "cyan",
    highlights: [
      "Lead student engineering teams from system architecture and task ownership through code review and delivery across full-stack and applied-ML builds.",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "Python",
      "Java 21",
      "Applied ML",
      "Code Review",
    ],
    link: {
      label: "ThuTaSitt_CV.docx",
      url: "/cv/ThuTaSitt_CV.docx",
    },
  },
  {
    id: "sprout-scouts",
    role: "Research Volunteer",
    organization: "The Sprout Scouts",
    period: "Jun 2026 — Present",
    type: "Research & Community",
    accent: "coral",
    highlights: [
      "Support youth-led environmental research, data gathering, and sustainability initiatives.",
      "Recognized under the ROOT: Growing Together initiative for environmental awareness and youth learning support.",
    ],
    stack: ["Environmental Research", "Data Gathering", "Sustainability"],
  },
  {
    id: "private-tutor-g12",
    role: "Private Tutor — Grade 12 Physics, Chemistry, English",
    organization: "Independent (1-on-1 Matriculation)",
    period: "May 2024 — Jul 2026",
    type: "Teaching & Mentorship",
    accent: "amber",
    highlights: [
      "Delivered 1-on-1 Grade 12 matriculation tutoring across Physics, Chemistry, and English.",
      "Over 70% of tutored students passed with distinctions.",
    ],
    stack: ["Physics", "Chemistry", "English", "Curriculum Coaching"],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: "uit-bcsc",
    program: "B.C.Sc. in Computer Science",
    institution: "University of Information Technology (UIT), Yangon",
    period: "2024 — 2028",
    status: "In Progress",
    details:
      "Computer Science undergraduate specializing in full-stack web engineering, multi-agent AI systems, and applied machine learning.",
  },
  {
    id: "utokyo-gci",
    program: "GCI World (Global Course on AI)",
    institution: "Matsuo & Iwasawa Laboratory, University of Tokyo",
    period: "Sep 2026 Cohort",
    status: "In Progress",
    details: "International data science and AI engineering curriculum.",
  },
  {
    id: "strong-force-mern",
    program: "MERN Stack Program",
    institution: "Strong Force Tech",
    period: "Dec 2024 — Apr 2025",
    status: "Completed",
  },
  {
    id: "creative-coder-web",
    program: "Web Development Fundamentals",
    institution: "Creative Coder Myanmar",
    period: "Sep 2024 — Nov 2024",
    status: "Completed",
  },
  {
    id: "ccna-vce",
    program: "CCNA Training",
    institution: "CCNA VCE Training",
    period: "Jun 2024 — Nov 2024",
    status: "Completed",
  },
  {
    id: "jishin-japanese",
    program: "Japanese Language Study (N5)",
    institution: "Jishin Japanese Language School",
    period: "Nov 2025 — Present",
    status: "In Progress",
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "lunaspis",
    name: "Lunaspis",
    repoName: "lunaspis",
    tagline: "6-Player Co-Op 3D Orbital Transit & ISS Simulator",
    summary:
      "Winner of the Youth Scientific Excellence Award (Myanmar Space Agency, Team INTERFELLAS) at NASA Space Apps Challenge 2026 – Yangon. 6-player co-op 3D orbital transit and ISS simulator featuring LC-39A Shuttle launch to 6-DOF ISS docking & walkable interior, Artemis Lunar Expedition, CubeSat J-SSOD/JEMRMS deployment, and 7 NASA Systems Engineering / MDL consoles.",
    category: "FLAGSHIP",
    tier: "FLAGSHIP",
    featured: true,
    roleSignal: "Award Winner • Distributed 3D Systems",
    accent: "cyan",
    status: "AWARD WINNER • NASA Space Apps 2026",
    visibility: "Public",
    language: "JavaScript",
    eventOrContext:
      "NASA Space Apps Challenge 2026 – Yangon • Youth Scientific Excellence Award (Myanmar Space Agency)",
    repoUrl: "https://github.com/DevHuang1/lunaspis",
    metrics: [
      { label: "Award", value: "Youth Sci.", note: "Myanmar Space Agency" },
      { label: "Co-Op Crew", value: "6 Players", note: "Socket.IO + WebRTC" },
      { label: "Docking & Interior", value: "6-DOF", note: "Walkable ISS" },
      { label: "MDL Consoles", value: "7 Modules", note: "NASA Systems Eng." },
    ],
    problem:
      "Browser-based orbital simulations rarely coordinate multi-crew spacecraft operations, 6-DOF docking, CubeSat deployment, and systems-engineering consoles in a single shared real-time session.",
    constraints: [
      "Synchronize 6 concurrent co-op crew positions and spacecraft telemetry",
      "Support camera-free WebRTC voice coordination without video overhead",
      "Integrate deterministic GMAT/satellite.js orbital modeling with WebGL/WebXR",
    ],
    stack: [
      "Vanilla Three.js (WebGL/WebXR)",
      "Express 5",
      "Socket.IO",
      "PostgreSQL",
      "satellite.js",
      "WebRTC",
      "Docker/GMAT",
    ],
    dataflow: [
      "Three.js Viewport & WebRTC Voice",
      "Express 5 + Socket.IO Gateway",
      "satellite.js & GMAT Mission Engine",
      "PostgreSQL State Persistence",
    ],
    diagramNodes: [
      { id: "client", label: "Three.js Viewport & WebRTC" },
      { id: "gateway", label: "Express 5 + Socket.IO" },
      { id: "sim", label: "satellite.js & Docker/GMAT" },
      { id: "db", label: "PostgreSQL Persistence" },
    ],
    diagramEdges: [
      { from: "client", to: "gateway", label: "6-DOF & Voice" },
      { from: "gateway", to: "sim", label: "Orbit Telemetry" },
      { from: "sim", to: "db", label: "Mission State" },
    ],
    decisions: [
      "Implemented LC-39A Shuttle launch through 6-DOF ISS docking, walkable ISS interior, Artemis Lunar Expedition, and CubeSat J-SSOD/JEMRMS deployment.",
      "Built 7 NASA Systems Engineering / MDL consoles paired with Express 5, Socket.IO, WebRTC crew audio, and PostgreSQL.",
      "Containerized GMAT orbital tooling with Docker alongside satellite.js ephemeris calculations.",
    ],
  },
  {
    id: "fraudshield",
    name: "FraudShield",
    repoName: "Fraud-Detection-Banking-Dashboard",
    tagline: "Real-Time Enterprise Banking Fraud Detection Platform",
    summary:
      "End-to-end real-time enterprise banking fraud detection platform with a 99.93%-accuracy ML model, live transaction streaming, 3-tier RBAC (Analyst/Investigator/Admin), device fingerprinting, anomaly tracking, and case management.",
    category: "FLAGSHIP",
    tier: "FLAGSHIP",
    featured: true,
    roleSignal: "Enterprise Full-Stack & Applied ML",
    accent: "amber",
    status: "SHIPPED • Enterprise ML Stack",
    visibility: "Public",
    language: "TypeScript",
    repoUrl: "https://github.com/DevHuang1/Fraud-Detection-Banking-Dashboard",
    externalLinks: [
      {
        label: "ThuTaSitt_CV.pdf",
        url: "/cv/ThuTaSitt_CV.pdf",
      },
    ],
    metrics: [
      { label: "Model Accuracy", value: "99.93%", note: "Keras ML Classifier" },
      { label: "Access Control", value: "3-Tier RBAC", note: "Analyst/Inv/Admin" },
      { label: "Core Services", value: "3 Runtimes", note: "Next.js/Spring/FastAPI" },
      { label: "Telemetry", value: "Live Stream", note: "Supabase Realtime/RLS" },
    ],
    problem:
      "Banking fraud operations require low-friction coordination between live transaction ingestion, ML risk scoring, device fingerprinting, and role-scoped case investigation.",
    constraints: [
      "Separate high-throughput transaction rules/RBAC from Python ML scoring",
      "Enforce strict 3-tier row-level access control across Analyst, Investigator, and Admin roles",
      "Stream live anomalous transactions and case updates to investigators",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Java 21",
      "Spring Boot 4",
      "Python",
      "FastAPI",
      "Keras",
      "Supabase Realtime/RLS",
      "Tailwind CSS v4",
    ],
    dataflow: [
      "Live Transaction & Device Stream",
      "Java 21 Spring Boot 4 API",
      "FastAPI + Keras Fraud Scorer",
      "Next.js 16 RBAC Case Console",
    ],
    diagramNodes: [
      { id: "stream", label: "Transaction & Device Stream" },
      { id: "spring", label: "Java 21 Spring Boot 4" },
      { id: "ml", label: "FastAPI + Keras (99.93%)" },
      { id: "ui", label: "Next.js 16 + Supabase RLS" },
    ],
    diagramEdges: [
      { from: "stream", to: "spring", label: "Ingest" },
      { from: "spring", to: "ml", label: "Score" },
      { from: "ml", to: "ui", label: "Realtime Alert" },
    ],
    decisions: [
      "Paired a Java 21 / Spring Boot 4 enterprise backend with a FastAPI + Keras fraud scoring service achieving 99.93% accuracy.",
      "Enforced 3-tier RBAC (Analyst, Investigator, Admin) backed by Supabase Realtime and Row-Level Security.",
      "Combined device fingerprinting, anomaly tracking, and case management inside a Next.js 16 + React 19 dashboard.",
    ],
  },
  {
    id: "beacon",
    name: "Beacon.ai (Disaster Escape)",
    repoName: "Beacon.ai",
    tagline: "Real-Time Disaster Preparedness & GeoAI Intelligence Platform",
    summary:
      "Real-time disaster preparedness and geospatial intelligence platform built for ASEAN GeoAI Fusion Hackathon 2026 (MCMC), combining NWS, USGS, and NASA FIRMS live feeds with Leaflet/OSRM turn-by-turn evacuation routing and a Python GeoAI sidecar for NDWI flood extent and SAM burn-scar segmentation.",
    category: "FLAGSHIP",
    tier: "FLAGSHIP",
    featured: true,
    roleSignal: "Geospatial AI & Applied ML",
    accent: "coral",
    status: "SHIPPED • ASEAN GeoAI 2026",
    visibility: "Public",
    language: "JavaScript",
    license: "MIT",
    eventOrContext: "ASEAN GeoAI Fusion Hackathon 2026 (MCMC)",
    repoUrl: "https://github.com/DevHuang1/Beacon.ai",
    metrics: [
      { label: "Live Hazard APIs", value: "3 Feeds", note: "NWS, USGS, NASA FIRMS" },
      { label: "GeoAI Sidecar", value: "NDWI + SAM", note: "FastAPI + Python" },
      { label: "Evacuation", value: "OSRM API", note: "Turn-by-Turn Leaflet" },
      { label: "AI Reasoning", value: "Gemini", note: "Supabase Persistence" },
    ],
    problem:
      "Civilians and responders during floods and wildfires need live hazard feeds coupled with satellite segmentation and turn-by-turn evacuation routes rather than static maps.",
    constraints: [
      "Fuse heterogeneous live telemetry from NWS, USGS, and NASA FIRMS",
      "Isolate heavy Python GeoAI inference (NDWI and SAM) from the web app",
      "Provide interactive Leaflet turn-by-turn evacuation routing via OSRM",
    ],
    stack: [
      "Next.js",
      "React",
      "Leaflet",
      "OSRM API",
      "FastAPI",
      "Python",
      "GeoAI (SAM, NDWI)",
      "Gemini",
      "Supabase",
      "Tailwind CSS",
    ],
    dataflow: [
      "NWS, USGS & NASA FIRMS Feeds",
      "Python FastAPI GeoAI Sidecar",
      "OSRM Turn-by-Turn Router",
      "Next.js + Leaflet Crisis Map",
    ],
    diagramNodes: [
      { id: "feeds", label: "NWS / USGS / NASA FIRMS" },
      { id: "geoai", label: "FastAPI GeoAI (SAM + NDWI)" },
      { id: "osrm", label: "OSRM Evacuation Routing" },
      { id: "map", label: "Next.js + Leaflet + Gemini" },
    ],
    diagramEdges: [
      { from: "feeds", to: "geoai", label: "Hazard Layers" },
      { from: "geoai", to: "osrm", label: "Flood & Burn Masks" },
      { from: "osrm", to: "map", label: "Safe Corridors" },
    ],
    decisions: [
      "Isolated NDWI flood extent mapping and SAM burn-scar segmentation inside a Python FastAPI GeoAI sidecar.",
      "Combined live NWS, USGS, and NASA FIRMS feeds with OSRM turn-by-turn evacuation routing in Leaflet.",
      "Integrated Gemini guidance with Supabase persistence in Next.js and Tailwind CSS.",
    ],
  },
  {
    id: "precision-irrigation-ml",
    name: "Precision Irrigation ML",
    repoName: "precision-irrigation-ml",
    tagline:
      "Auditable Computational-Feasibility Study for Sustainable Farming",
    summary:
      "Auditable computational-feasibility study (AI-Powered Precision Irrigation for Sustainable Vegetable Farming) prepared for the UNESCO–Al Fozan International Prize, benchmarking Logistic Regression, Random Forest, and XGBoost against persistence, threshold, and FAO-56 baselines across 1,800 counterfactual water-balance scenarios with a 3D twin dashboard.",
    category: "AI_SYSTEMS",
    tier: "FLAGSHIP",
    featured: true,
    roleSignal: "Auditable Applied ML & Research",
    accent: "cyan",
    status: "RESEARCH • UNESCO–Al Fozan Prize",
    visibility: "Public",
    language: "TypeScript / Python",
    eventOrContext: "UNESCO–Al Fozan International Prize",
    repoUrl: "https://github.com/DevHuang1/precision-irrigation-ml",
    externalLinks: [
      {
        label: "Audit Report",
        url: "https://docs.google.com/document/d/1a9R5YbRTgaHFJltP6-3u8DcZnjHYDUsGA8twlngqFXI/edit?usp=drivesdk&ouid=116596143423682608451",
      },
      {
        label: "Data Pack",
        url: "https://drive.google.com/drive/folders/1YILC5QjjKQVPBHqdUsgye8tNAo7prXYG",
      },
    ],
    metrics: [
      { label: "Counterfactuals", value: "1,800", note: "Water-Balance Runs" },
      { label: "Eval Split", value: "60/20/20", note: "Chronological + 24h Embargo" },
      { label: "Benchmarks", value: "3 ML vs 3 Base", note: "LR/RF/XGB vs FAO-56" },
      { label: "Telemetry Source", value: "NASA POWER", note: "3D Twin + Pytest" },
    ],
    problem:
      "Agricultural ML proposals often lack temporal leakage guards, physical water-balance baselines, and reproducible audits for scientific review.",
    constraints: [
      "Prevent temporal leakage using chronological 60/20/20 splits and a 24h embargo",
      "Benchmark ML classifiers against persistence, threshold, and FAO-56 baselines",
      "Deliver reproducible Pytest verification alongside an interactive 3D twin UI",
    ],
    stack: [
      "Python",
      "scikit-learn",
      "XGBoost",
      "Pytest",
      "Next.js",
      "TypeScript",
      "NASA POWER API",
    ],
    dataflow: [
      "NASA POWER Agro-Climate API",
      "60/20/20 Split + 24h Embargo",
      "XGBoost / RF / LR vs FAO-56",
      "1,800 Counterfactuals & 3D Twin",
    ],
    diagramNodes: [
      { id: "nasa", label: "NASA POWER Climate Data" },
      { id: "split", label: "Chronological 60/20/20 + 24h Embargo" },
      { id: "bench", label: "LR / RF / XGBoost vs FAO-56" },
      { id: "twin", label: "1,800 Scenarios & 3D Twin UI" },
    ],
    diagramEdges: [
      { from: "nasa", to: "split", label: "Time Series" },
      { from: "split", to: "bench", label: "Leak-Free Eval" },
      { from: "bench", to: "twin", label: "Audited Policy" },
    ],
    decisions: [
      "Enforced chronological 60/20/20 splits with a 24-hour embargo and Pytest checks to eliminate look-ahead leakage.",
      "Evaluated Logistic Regression, Random Forest, and XGBoost against persistence, threshold, and FAO-56 baselines across 1,800 counterfactual water-balance scenarios.",
      "Built an interactive Next.js 3D twin dashboard backed by NASA POWER API inputs and a full Audit Report and Data Pack.",
    ],
  },
  {
    id: "skydetective",
    name: "SkyDetective (SpaceDetective)",
    repoName: "SkyDetective",
    tagline: "Interactive Digital Infrared Sky Atlas & Planet X Screener",
    summary:
      "Interactive digital astronomy atlas for exploring the changing infrared sky—combining SPHEREx QR2 time-series image comparison (timeline + image wipe) and WISE/NEOWISE Planet X candidate screening with JPL small-body cross-checks and CSV export.",
    category: "FULL_STACK",
    tier: "FLAGSHIP",
    featured: true,
    roleSignal: "Scientific Web & FITS Pipeline",
    accent: "amber",
    status: "SHIPPED • MIT Open Source",
    visibility: "Public",
    language: "TypeScript",
    license: "MIT",
    repoUrl: "https://github.com/DevHuang1/SkyDetective",
    externalLinks: [
      {
        label: "Project Description PDF",
        url: "https://drive.google.com/file/d/1Ya3B8CjgCnHEssv18ACCpONidr1Dfu-z/view?usp=drivesdk",
      },
    ],
    metrics: [
      { label: "Sky Surveys", value: "SPHEREx + WISE", note: "QR2 & NEOWISE" },
      { label: "Catalog APIs", value: "IRSA + JPL", note: "SIA & Small-Body" },
      { label: "Renderer", value: "NumPy/Pillow", note: "Python FITS Pipeline" },
      { label: "Frontend", value: "Aladin Lite", note: "Next.js 16 + React 19" },
    ],
    problem:
      "Comparing multi-epoch infrared sky surveys and screening Planet X candidates against known solar-system small bodies requires stitching FITS rendering, IRSA catalogs, and JPL ephemerides.",
    constraints: [
      "Render astronomical FITS imagery reliably for browser timeline and wipe comparison",
      "Cross-check WISE/NEOWISE moving-object candidates against JPL Small-Body records",
      "Support structured CSV export from interactive Aladin Lite sky inspection",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Aladin Lite",
      "IRSA SIA API",
      "Python (NumPy/Pillow FITS renderer)",
      "JPL Small-Body API",
    ],
    dataflow: [
      "IRSA SIA & JPL Small-Body APIs",
      "Python NumPy/Pillow FITS Renderer",
      "SPHEREx Timeline & Wipe Compare",
      "Aladin Lite Atlas + CSV Export",
    ],
    diagramNodes: [
      { id: "irsa", label: "IRSA SIA & JPL Small-Body APIs" },
      { id: "fits", label: "Python FITS Renderer (NumPy/Pillow)" },
      { id: "viewer", label: "Aladin Lite + Timeline Wipe UI" },
      { id: "export", label: "Candidate Screening & CSV Export" },
    ],
    diagramEdges: [
      { from: "irsa", to: "fits", label: "FITS Epochs" },
      { from: "fits", to: "viewer", label: "Rendered Tiles" },
      { from: "viewer", to: "export", label: "Screened Targets" },
    ],
    decisions: [
      "Built a dedicated Python NumPy/Pillow FITS renderer to feed SPHEREx QR2 time-series timeline and wipe comparisons.",
      "Integrated Aladin Lite with IRSA SIA queries and JPL Small-Body cross-checks inside Next.js 16 and React 19.",
      "Added WISE/NEOWISE Planet X candidate screening workflows with direct CSV export.",
    ],
  },
  {
    id: "nodeforge",
    name: "NodeForge.ai",
    repoName: "NodeForge.ai",
    tagline: "4-Node Agentic Code-Review & Security Pipeline",
    summary:
      "Agentic code-review and security pipeline built for ReverieHacks (Aug 2026), orchestrating 4 inspectable AI nodes (Human Input, Query Expansion, Execution & Verification, Output Sanitization) with side-by-side baseline scoring, PR review, SARIF/JSON export, and live Mermaid flowcharts.",
    category: "AI_SYSTEMS",
    tier: "TOOLING",
    featured: true,
    roleSignal: "Agentic AI Systems & AppSec",
    accent: "cyan",
    status: "SHIPPED • ReverieHacks Aug 2026",
    visibility: "Public",
    language: "TypeScript",
    license: "MIT",
    eventOrContext: "ReverieHacks (Aug 2026)",
    repoUrl: "https://github.com/DevHuang1/NodeForge.ai",
    metrics: [
      { label: "AI Nodes", value: "4 Stages", note: "Inspectable Pipeline" },
      { label: "Report Export", value: "SARIF / JSON", note: "PR Review Ready" },
      { label: "Visualization", value: "Mermaid", note: "Live Flowcharts" },
      { label: "Model Routing", value: "OpenRouter", note: "+ Featherless / Vercel" },
    ],
    problem:
      "Opaque single-prompt AI code reviewers provide no visibility into intermediate reasoning, baseline comparisons, or machine-readable security findings.",
    constraints: [
      "Expose every reasoning stage through 4 inspectable pipeline nodes",
      "Deliver side-by-side baseline scoring alongside PR review diagnostics",
      "Emit standard SARIF and JSON outputs plus live Mermaid architecture graphs",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Mermaid",
      "OpenRouter",
      "Featherless",
      "Vercel",
    ],
    dataflow: [
      "Human Input Node",
      "Query Expansion Node",
      "Execution & Verification Node",
      "Output Sanitization -> SARIF/JSON",
    ],
    diagramNodes: [
      { id: "input", label: "1. Human Input" },
      { id: "expand", label: "2. Query Expansion" },
      { id: "verify", label: "3. Execution & Verification" },
      { id: "sanitize", label: "4. Output Sanitization (SARIF)" },
    ],
    diagramEdges: [
      { from: "input", to: "expand", label: "Scope" },
      { from: "expand", to: "verify", label: "Checks" },
      { from: "verify", to: "sanitize", label: "Baseline Score" },
    ],
    decisions: [
      "Structured the review workflow into 4 inspectable nodes: Human Input, Query Expansion, Execution & Verification, and Output Sanitization.",
      "Added side-by-side baseline scoring, PR review workflows, and live Mermaid flowcharts in Next.js.",
      "Supported SARIF/JSON security export backed by OpenRouter and Featherless model routing.",
    ],
  },
  {
    id: "razorstack-trading",
    name: "RazorStack Trading",
    repoName: "razorstack-trading",
    tagline: "Multi-Agent Quantitative Paper-Trading Platform",
    summary:
      "AI-powered quantitative paper-trading platform built for Alpaca AI Trading Agents Hackathon (Aug–Sep 2026), featuring a multi-agent research desk, deterministic risk engine, and real-time paper-trade execution.",
    category: "AI_SYSTEMS",
    tier: "AI_SYSTEMS",
    featured: false,
    roleSignal: "Multi-Agent AI & Deterministic Risk",
    accent: "amber",
    status: "SHIPPED • Alpaca Hackathon 2026",
    visibility: "Public",
    language: "TypeScript",
    license: "MIT",
    eventOrContext: "Alpaca AI Trading Agents Hackathon (Aug–Sep 2026)",
    repoUrl: "https://github.com/DevHuang1/razorstack-trading",
    metrics: [
      { label: "Architecture", value: "Multi-Agent", note: "Research Desk" },
      { label: "Guardrails", value: "Deterministic", note: "Risk Engine" },
      { label: "Execution", value: "Real-Time", note: "Alpaca Paper API" },
      { label: "Backend", value: "FastAPI + Next", note: "Python + TypeScript" },
    ],
    problem:
      "Autonomous LLM trading demos often place unconstrained orders without separating multi-agent research synthesis from deterministic position and risk limits.",
    constraints: [
      "Enforce deterministic risk checks prior to any broker order submission",
      "Coordinate multi-agent research signals with real-time Alpaca paper-trade execution",
    ],
    stack: [
      "Next.js",
      "FastAPI",
      "Python",
      "TypeScript",
      "Alpaca Trading API",
    ],
    dataflow: [
      "Multi-Agent Research Desk",
      "Deterministic Risk Engine",
      "Alpaca Paper Trading API",
      "Next.js Execution Monitor",
    ],
    diagramNodes: [
      { id: "research", label: "Multi-Agent Research Desk" },
      { id: "risk", label: "Deterministic Risk Engine" },
      { id: "alpaca", label: "Alpaca Trading API" },
      { id: "dash", label: "Next.js Trading Console" },
    ],
    diagramEdges: [
      { from: "research", to: "risk", label: "Signals" },
      { from: "risk", to: "alpaca", label: "Validated Orders" },
      { from: "alpaca", to: "dash", label: "Fills & Positions" },
    ],
    decisions: [
      "Decoupled a multi-agent research desk from a deterministic Python risk engine so LLM hypotheses cannot bypass sizing limits.",
      "Connected FastAPI execution services directly to the Alpaca Trading API and a Next.js monitoring UI.",
    ],
  },
  {
    id: "greenlight",
    name: "Greenlight",
    repoName: "greenlight",
    tagline: "AI-Powered Cinema Investment & Scenario Testing Platform",
    summary:
      "AI-powered cinema investment platform built for Agentic Cinema Hackathon (Google for Developers, Aug–Sep 2026), pairing Parallel market research with Gemini-powered source-linked memos and scenario testing.",
    category: "HACKATHON",
    tier: "AI_SYSTEMS",
    featured: false,
    roleSignal: "Agentic Research & Cloud AI",
    accent: "coral",
    status: "SHIPPED • Google Agentic Cinema",
    visibility: "Public",
    language: "TypeScript",
    license: "MIT",
    eventOrContext: "Agentic Cinema Hackathon (Google for Developers, Aug–Sep 2026)",
    repoUrl: "https://github.com/DevHuang1/greenlight",
    externalLinks: [
      {
        label: "Devpost",
        url: "https://devpost.com/software/greenlight-ny2gh1/updates/828308",
      },
    ],
    metrics: [
      { label: "Research Engine", value: "Parallel", note: "Market Signals" },
      { label: "Synthesis", value: "Gemini", note: "Source-Linked Memos" },
      { label: "Modeling", value: "Scenarios", note: "Investment Testing" },
      { label: "Platform", value: "Google Cloud", note: "TypeScript App" },
    ],
    problem:
      "Film slate and production financing decisions depend on verifiable comparables rather than ungrounded narrative summaries.",
    constraints: [
      "Ground investment memos with verifiable source links from market research",
      "Support interactive scenario testing across cinema investment assumptions",
    ],
    stack: ["TypeScript", "Google Cloud", "Gemini", "Parallel"],
    dataflow: [
      "Parallel Market Research",
      "Gemini Source-Linked Memo Engine",
      "Scenario Testing Workspace",
    ],
    diagramNodes: [
      { id: "parallel", label: "Parallel Market Research" },
      { id: "gemini", label: "Gemini Source-Linked Memos" },
      { id: "scenario", label: "Scenario Testing Console" },
    ],
    diagramEdges: [
      { from: "parallel", to: "gemini", label: "Citations" },
      { from: "gemini", to: "scenario", label: "Sensitivity" },
    ],
    decisions: [
      "Paired Parallel market research retrieval with Gemini-generated, source-linked investment memos on Google Cloud.",
      "Built interactive scenario testing directly into the TypeScript evaluation workflow.",
    ],
  },
  {
    id: "coderunway",
    name: "CodeRunway",
    repoName: "CodeRunway",
    tagline: "Guided Coding Workspace from Small Issue to Reviewable Patch",
    summary:
      "Guided coding workspace built for Nebius x NVIDIA Global AI Hackathon (Oct 2026) that helps students and solo builders turn one small issue into a reviewable patch via clear steps, visible edits, and transparent static checks.",
    category: "HACKATHON",
    tier: "TOOLING",
    featured: false,
    roleSignal: "Developer Workflow & Patch Tooling",
    accent: "cyan",
    status: "SHIPPED • Nebius x NVIDIA Oct 2026",
    visibility: "Public",
    language: "TypeScript",
    license: "MIT",
    eventOrContext: "Nebius x NVIDIA Global AI Hackathon (Oct 2026)",
    repoUrl: "https://github.com/DevHuang1/CodeRunway",
    externalLinks: [
      {
        label: "Devpost",
        url: "https://devpost.com/software/popular?WhfCmBJ6aPV3d=QrfFWJ9gb5MDrd&page=18692",
      },
    ],
    metrics: [
      { label: "Workflow", value: "Step-by-Step", note: "Issue -> Patch" },
      { label: "Verification", value: "Static Checks", note: "Transparent Gates" },
      { label: "Stack", value: "TypeScript", note: "Nebius / NVIDIA" },
      { label: "License", value: "MIT", note: "Public Repo" },
    ],
    problem:
      "Students and solo builders often struggle to convert an issue description into clean, incremental code edits with verifiable static checks.",
    constraints: [
      "Keep every intermediate edit visible and reviewable before final patch output",
      "Pair guided steps with transparent static analysis checks",
    ],
    stack: ["TypeScript", "Nebius / NVIDIA Hackathon Stack"],
    dataflow: [
      "Scoped Issue Intake",
      "Guided Stepwise Edits",
      "Transparent Static Checks",
      "Reviewable Patch Output",
    ],
    diagramNodes: [
      { id: "issue", label: "Scoped Issue" },
      { id: "edits", label: "Visible Stepwise Edits" },
      { id: "checks", label: "Static Checks" },
      { id: "patch", label: "Reviewable Patch" },
    ],
    diagramEdges: [
      { from: "issue", to: "edits", label: "Plan" },
      { from: "edits", to: "checks", label: "Validate" },
      { from: "checks", to: "patch", label: "Diff" },
    ],
    decisions: [
      "Designed the workspace around one small issue at a time with explicit steps and visible diffs.",
      "Integrated transparent static checks before producing the final reviewable patch.",
    ],
  },
  {
    id: "studysidekick",
    name: "StudySidekick",
    repoName: "StudySidekick",
    tagline: "Local-First Deterministic Study Planner Showing What Won't Fit",
    summary:
      "Local-first deterministic study planner built for Build, Ship, Shape: Amazon Developer Hackathon (Oct 2026) that turns deadlines and real availability into a feasible study week—and openly surfaces what won't fit.",
    category: "HACKATHON",
    tier: "TOOLING",
    featured: false,
    roleSignal: "Deterministic Scheduling & Product UX",
    accent: "amber",
    status: "SHIPPED • Amazon Dev Hackathon Oct 2026",
    visibility: "Public",
    language: "TypeScript",
    license: "MIT",
    eventOrContext: "Build, Ship, Shape: Amazon Developer Hackathon (Oct 2026)",
    repoUrl: "https://github.com/DevHuang1/StudySidekick",
    externalLinks: [
      {
        label: "Devpost",
        url: "https://devpost.com/software/study-sidekick-the-study-planner-that-shows-what-won-t-fit/updates/856631",
      },
    ],
    metrics: [
      { label: "Architecture", value: "Local-First", note: "Zero Cloud Lock" },
      { label: "Scheduler", value: "Deterministic", note: "Feasible Study Week" },
      { label: "Conflict Signal", value: "Overflow UI", note: "Surfaces What Won't Fit" },
      { label: "Language", value: "TypeScript", note: "MIT Open Source" },
    ],
    problem:
      "Conventional planners silently overbook students by cramming tasks without checking hard weekly hour budgets and deadline feasibility.",
    constraints: [
      "Execute scheduling deterministically and local-first",
      "Explicitly surface overloaded tasks that cannot fit within real availability",
    ],
    stack: ["TypeScript"],
    dataflow: [
      "Deadlines & Availability Input",
      "Deterministic Time-Budget Solver",
      "Feasible Week + Unfit Task Report",
    ],
    diagramNodes: [
      { id: "inputs", label: "Deadlines & Real Availability" },
      { id: "solver", label: "Deterministic Local-First Solver" },
      { id: "plan", label: "Feasible Week + Overflow List" },
    ],
    diagramEdges: [
      { from: "inputs", to: "solver", label: "Constraints" },
      { from: "solver", to: "plan", label: "Schedule & Conflicts" },
    ],
    decisions: [
      "Built a local-first deterministic scheduler instead of an opaque heuristic generator.",
      "Surfaced unscheduled overflow explicitly so students confront time constraints early.",
    ],
  },
  {
    id: "clickwise-ai",
    name: "CLICKWISE AI",
    repoName: "ai-detection-project-self",
    tagline: "Multimodal AI Awareness & Media Information Literacy Platform",
    summary:
      "Interactive AI awareness and Media and Information Literacy platform built as Team Leader of Team Nexora for UNESCO Youth Hackathon 2026, bundling multimodal AI Detection (text/image/audio/video), AI Masking, AI Humanizing, gamified Quiz, Leaderboard, and AI FAQ Assistant.",
    category: "AI_SYSTEMS",
    tier: "AI_SYSTEMS",
    featured: false,
    roleSignal: "Team Lead • Multimodal AI & MIL",
    accent: "coral",
    status: "SHIPPED • UNESCO Youth Hackathon 2026",
    visibility: "Public",
    language: "JavaScript",
    eventOrContext: "UNESCO Youth Hackathon 2026 (Team Nexora Leader)",
    repoUrl: "https://github.com/DevHuang1/ai-detection-project-self",
    externalLinks: [
      {
        label: "Project Proposal",
        url: "https://docs.google.com/document/d/1QhfYZTAAUOk488c6eWoRbdPqdaW8UjZ4J0SPuW5vxFE/edit?usp=drivesdk&ouid=116596143423682608451",
      },
    ],
    metrics: [
      { label: "Detection Modes", value: "4 Modalities", note: "Text/Image/Audio/Video" },
      { label: "Leadership", value: "Team Leader", note: "Team Nexora" },
      { label: "Modules", value: "6 Core Tools", note: "Detect/Mask/Quiz/FAQ" },
      { label: "Inference", value: "Groq API", note: "React + Supabase" },
    ],
    problem:
      "Youth and educators lack an accessible hands-on Media and Information Literacy tool to test synthetic media across modalities and understand AI detection trade-offs.",
    constraints: [
      "Unify text, image, audio, and video AI detection workflows in one interface",
      "Include educational tools (AI Masking, AI Humanizing, Quiz, Leaderboard, FAQ Assistant)",
    ],
    stack: ["React.js", "Tailwind CSS", "Supabase", "Groq API", "Vercel"],
    dataflow: [
      "Text / Image / Audio / Video Input",
      "Detection, Masking & Humanizing API",
      "Groq Assistant + Supabase Leaderboard",
      "React.js MIL Learning UI",
    ],
    diagramNodes: [
      { id: "media", label: "Multimodal Input" },
      { id: "tools", label: "AI Detect / Mask / Humanize" },
      { id: "groq", label: "Groq FAQ & Supabase Quiz" },
      { id: "ui", label: "React.js MIL Platform" },
    ],
    diagramEdges: [
      { from: "media", to: "tools", label: "Inspect" },
      { from: "tools", to: "groq", label: "Score & Educate" },
      { from: "groq", to: "ui", label: "Leaderboard" },
    ],
    decisions: [
      "Led Team Nexora to combine multimodal detection with interactive masking, humanizing, and gamified MIL quizzes.",
      "Backed FAQ assistance with Groq API and leaderboard state with Supabase on Vercel.",
    ],
  },
  {
    id: "focusbridge",
    name: "FocusBridge",
    repoName: "FocusBridge",
    tagline: "Calm AI Productivity Workspace for ADHD Task Breakdown",
    summary:
      "Calm AI productivity workspace built with teammate Lu Maw Aung for Pixel Forge AI Hackathon (Aug–Sep 2026) that helps people with ADHD break overwhelming goals into clear, manageable next steps.",
    category: "HACKATHON",
    tier: "AI_SYSTEMS",
    featured: false,
    roleSignal: "Collaborative Product & AI UX",
    accent: "cyan",
    status: "SHIPPED • Pixel Forge AI 2026",
    visibility: "Public",
    language: "TypeScript",
    license: "MIT",
    eventOrContext: "Pixel Forge AI Hackathon (Aug–Sep 2026, with Lu Maw Aung)",
    repoUrl: "https://github.com/DevHuang1/FocusBridge",
    externalLinks: [
      { label: "Devpost", url: "https://devpost.com/lma-cpu" },
    ],
    metrics: [
      { label: "Target Workflow", value: "ADHD Focus", note: "Stepwise Breakdown" },
      { label: "Collaboration", value: "2-Person Team", note: "w/ Lu Maw Aung" },
      { label: "Language", value: "TypeScript", note: "MIT Open Source" },
      { label: "Event", value: "Pixel Forge", note: "Aug–Sep 2026" },
    ],
    problem:
      "Large, ambiguous goals trigger executive dysfunction and paralysis for people with ADHD when productivity tools present dense backlogs instead of the next calm step.",
    constraints: [
      "Keep cognitive load minimal while decomposing overwhelming goals",
      "Ship a functional TypeScript prototype within Pixel Forge AI Hackathon",
    ],
    stack: ["TypeScript"],
    dataflow: [
      "Overwhelming Goal Input",
      "Stepwise Task Decomposition",
      "Calm Next-Step Execution View",
    ],
    diagramNodes: [
      { id: "goal", label: "Overwhelming Goal Input" },
      { id: "split", label: "AI Stepwise Breakdown" },
      { id: "next", label: "Calm Next-Step UI" },
    ],
    diagramEdges: [
      { from: "goal", to: "split", label: "Decompose" },
      { from: "split", to: "next", label: "Single Focus" },
    ],
    decisions: [
      "Prioritized calm progressive disclosure so users act on one clear next step at a time.",
      "Co-built and shipped with teammate Lu Maw Aung for Pixel Forge AI Hackathon.",
    ],
  },
  {
    id: "embervale-godot",
    name: "Embervale (Godot)",
    repoName: "embervale-godot",
    tagline: "Solo Stylized Dark-Fantasy Mobile Action RPG",
    summary:
      "Solo stylized dark-fantasy mobile action RPG built for RevenueCat Shipaton 2026 (Sep 2026), featuring realm exploration, creature combat, resource gathering, and weapon forging.",
    category: "FULL_STACK",
    tier: "TOOLING",
    featured: false,
    roleSignal: "Solo Game Engineering (Godot)",
    accent: "coral",
    status: "SHIPPED • RevenueCat Shipaton 2026",
    visibility: "Public",
    language: "GDScript",
    license: "MIT",
    eventOrContext: "RevenueCat Shipaton 2026 (Sep 2026)",
    repoUrl: "https://github.com/DevHuang1/embervale-godot",
    externalLinks: [
      {
        label: "Devpost",
        url: "https://devpost.com/software/embervale/updates/833820",
      },
      {
        label: "Verify Shipaton Certificate",
        url: "https://shipaton.com/verify/SH26-D3N0-GD99-BXEG",
      },
    ],
    metrics: [
      { label: "Engine", value: "Godot", note: "GDScript" },
      { label: "Core Loops", value: "4 Systems", note: "Explore/Combat/Gather/Forge" },
      { label: "Scope", value: "Solo Build", note: "Mobile Action RPG" },
      { label: "Event", value: "Shipaton 2026", note: "Sep 2026" },
    ],
    problem:
      "Building a complete dark-fantasy mobile action RPG solo within a hackathon sprint requires tightly scoped gameplay loops from exploration to crafting.",
    constraints: [
      "Deliver mobile-ready exploration, combat, gathering, and forging solo",
      "Ship on schedule for RevenueCat Shipaton 2026",
    ],
    stack: ["Godot", "GDScript"],
    dataflow: [
      "Realm Exploration & Encounters",
      "Creature Combat Loop",
      "Resource Gathering",
      "Weapon Forging Progression",
    ],
    diagramNodes: [
      { id: "explore", label: "Realm Exploration" },
      { id: "combat", label: "Creature Combat" },
      { id: "gather", label: "Resource Gathering" },
      { id: "forge", label: "Weapon Forging" },
    ],
    diagramEdges: [
      { from: "explore", to: "combat", label: "Encounters" },
      { from: "combat", to: "gather", label: "Loot" },
      { from: "gather", to: "forge", label: "Craft" },
    ],
    decisions: [
      "Built the entire gameplay loop in Godot and GDScript as a solo entry for RevenueCat Shipaton 2026.",
      "Tightly coupled combat encounters and resource gathering into weapon forging progression.",
    ],
  },
  {
    id: "sentio",
    name: "Sentio (Chess Agent)",
    repoName: "chess-agent-v2",
    tagline: "Emotion-Adaptive AI Chess Coach with Live Camera Recognition",
    summary:
      "AI chess coach combining live camera chessboard recognition, facial emotion recognition, emotion-adaptive AI difficulty, and conversational LLM move explanations across chess-agent-v2 and chess-agent.",
    category: "AI_SYSTEMS",
    tier: "AI_SYSTEMS",
    featured: false,
    roleSignal: "Computer Vision & Adaptive AI",
    accent: "amber",
    status: "SHIPPED • Public Dual Repo",
    visibility: "Public",
    language: "TypeScript",
    repoUrl: "https://github.com/DevHuang1/chess-agent-v2",
    secondaryRepoUrl: "https://github.com/DevHuang1/chess-agent",
    externalLinks: [
      {
        label: "chess-agent (v1)",
        url: "https://github.com/DevHuang1/chess-agent",
      },
    ],
    metrics: [
      { label: "Vision Pipelines", value: "2 Streams", note: "Board + Facial Emotion" },
      { label: "Difficulty", value: "Adaptive", note: "Emotion-Driven AI" },
      { label: "Coaching", value: "LLM Chat", note: "Move Explanations" },
      { label: "Repos", value: "v2 + v1", note: "TypeScript" },
    ],
    problem:
      "Static chess engines neither read physical camera boards nor adapt coaching tone and playing strength to a learner's real-time frustration or confidence.",
    constraints: [
      "Detect live board state and player facial emotion concurrently",
      "Translate engine evaluation shifts into conversational LLM explanations",
    ],
    stack: ["TypeScript", "Computer Vision", "LLMs"],
    dataflow: [
      "Live Camera Board & Face Stream",
      "Board State + Emotion Recognition",
      "Emotion-Adaptive Chess Engine",
      "Conversational LLM Move Coach",
    ],
    diagramNodes: [
      { id: "cam", label: "Camera Board & Face Input" },
      { id: "cv", label: "Board + Emotion Recognition" },
      { id: "engine", label: "Emotion-Adaptive Chess AI" },
      { id: "coach", label: "LLM Move Explanations" },
    ],
    diagramEdges: [
      { from: "cam", to: "cv", label: "Frames" },
      { from: "cv", to: "engine", label: "Difficulty Target" },
      { from: "engine", to: "coach", label: "Move Context" },
    ],
    decisions: [
      "Paired physical camera chessboard recognition with facial emotion detection to modulate AI difficulty dynamically.",
      "Added conversational LLM coaching to explain candidate moves and tactical ideas.",
    ],
  },
  {
    id: "g12-learn",
    name: "G12 Learn",
    repoName: "g12-learn",
    tagline: "Grade 12 English Learning & Extra-Exercises Web App",
    summary:
      "Grade 12 English learning and extra-exercises web application built with TypeScript, Vite, and React.",
    category: "FULL_STACK",
    tier: "TOOLING",
    featured: false,
    roleSignal: "EdTech Frontend Engineering",
    accent: "cyan",
    status: "SHIPPED • EdTech Web App",
    visibility: "Public",
    language: "TypeScript",
    repoUrl: "https://github.com/DevHuang1/g12-learn",
    metrics: [
      { label: "Curriculum", value: "Grade 12", note: "English + Extra Practice" },
      { label: "Tooling", value: "Vite + React", note: "TypeScript SPA" },
      { label: "Access", value: "Public", note: "GitHub Repo" },
      { label: "Focus", value: "EdTech", note: "Interactive Exercises" },
    ],
    problem:
      "Grade 12 students preparing for English exams need structured, fast-loading extra-practice modules beyond static handouts.",
    constraints: [
      "Deliver fast interactive practice flows with minimal bundle overhead",
      "Keep curriculum modules clearly organized for Grade 12 revision",
    ],
    stack: ["TypeScript", "Vite", "React"],
    dataflow: [
      "Grade 12 English Modules",
      "Interactive Exercise Runner",
      "Immediate Practice Feedback",
    ],
    diagramNodes: [
      { id: "modules", label: "Grade 12 English Content" },
      { id: "runner", label: "Vite + React Exercise Runner" },
      { id: "feedback", label: "Immediate Practice Feedback" },
    ],
    diagramEdges: [
      { from: "modules", to: "runner", label: "Load Lesson" },
      { from: "runner", to: "feedback", label: "Check Answers" },
    ],
    decisions: [
      "Built a lightweight TypeScript + Vite + React single-page app focused on rapid Grade 12 English extra exercises.",
    ],
  },
];

export const ADDITIONAL_REPOS: AdditionalRepoItem[] = [
  {
    id: "embervale-rpg",
    name: "embervale-rpg",
    visibility: "Public",
    language: "TypeScript",
    updated: "Updated Aug 15",
    summary:
      "Playable browser RPG with top-down exploration, turn-based encounters, quest progression, and pixel-fantasy presentation (built with Manus).",
    repoUrl: "https://github.com/DevHuang1/embervale-rpg",
  },
  {
    id: "voxhands",
    name: "VoxHands",
    visibility: "Public",
    language: "Python",
    license: "MIT",
    updated: "Updated Sep 16",
    summary:
      "Python project (archive stored in Drive; Vercel deployment notification Sep 2026).",
    repoUrl: "https://github.com/DevHuang1/VoxHands",
  },
  {
    id: "ibm-bob",
    name: "IBM-Bob",
    visibility: "Public",
    language: "Python",
    updated: "Updated Aug 29",
    summary:
      "Python project built around IBM Dev Day: Bob in Action (Aug 2026).",
    repoUrl: "https://github.com/DevHuang1/IBM-Bob",
  },
  {
    id: "echoes-in-the-ore",
    name: "Echoes_In_The_Ore",
    visibility: "Public",
    language: "GDScript",
    license: "MIT",
    updated: "Updated 3 weeks ago",
    summary: "Godot game project.",
    repoUrl: "https://github.com/DevHuang1/Echoes_In_The_Ore",
  },
  {
    id: "exambuddybot",
    name: "ExamBuddyBot",
    visibility: "Public",
    language: "JavaScript",
    updated: "Updated Aug 28",
    summary: "ExamBuddy bot paired with private autonomous worker companion.",
    repoUrl: "https://github.com/DevHuang1/ExamBuddyBot",
  },
  {
    id: "learning-platform-grade12",
    name: "learning-platform-grade12",
    visibility: "Public",
    language: "TypeScript",
    updated: "Updated Aug 17",
    summary: "Grade 12 learning platform web application.",
    repoUrl: "https://github.com/DevHuang1/learning-platform-grade12",
  },
  {
    id: "burmesetypochecker",
    name: "BurmeseTypoChecker",
    visibility: "Public",
    language: "TypeScript",
    updated: "Updated Aug 17",
    summary: "Burmese typo-checking tool.",
    repoUrl: "https://github.com/DevHuang1/BurmeseTypoChecker",
  },
  {
    id: "japanese-learning-platform",
    name: "japanese-learning-platform",
    visibility: "Public",
    language: "TypeScript",
    updated: "Updated Aug 16",
    summary: "Japanese / JLPT flashcard and learning platform.",
    repoUrl: "https://github.com/DevHuang1/japanese-learning-platform",
  },
];

export interface AwardHighlight {
  id: string;
  badge: string;
  title: string;
  issuer: string;
  date: string;
  detail: string;
  accent: "amber" | "cyan" | "coral";
  verifyUrl?: string;
}

export const AWARD_HIGHLIGHTS: AwardHighlight[] = [
  {
    id: "nasa-youth-scientific-award",
    badge: "AWARD WINNER • MSA",
    title: "Youth Scientific Excellence Award — NASA Space Apps Challenge 2026 (Yangon)",
    issuer: "Myanmar Space Agency (MSA) • Team INTERFELLAS",
    date: "Nov 2026",
    detail:
      "Awarded for Lunaspis in recognition of the team's innovative solution and potential for meaningful, positive impact on communities and society (signed by Dr. Soe Myint Maung).",
    accent: "amber",
  },
  {
    id: "stanford-deeplearning-ml",
    badge: "INTERNATIONAL SPECIALIZATION",
    title: "Machine Learning Specialization",
    issuer: "Stanford Online & DeepLearning.AI (Andrew Ng)",
    date: "Jul 2026",
    detail:
      "3-course verified specialization covering supervised learning, neural networks, unsupervised learning, recommenders, and reinforcement learning (ID: EP5HKLWLB11N).",
    accent: "cyan",
    verifyUrl: "https://coursera.org/verify/specialization/EP5HKLWLB11N",
  },
  {
    id: "asean-geoai-explorer",
    badge: "ASEAN REGIONAL ASSESSMENT",
    title: "ASEAN GeoAI Fusion 2026 — GeoAI Explorer + Bootcamps 1 & 2",
    issuer: "Universiti Malaya-Wales & ASEAN / MCMC",
    date: "Jul – Sep 2026",
    detail:
      "Completed Foundational & Advanced GeoAI tracks and formal GeoAI Explorer assessment (ID: E-C-MM-178-279) leading to Beacon.ai.",
    accent: "coral",
  },
  {
    id: "unesco-youth-hackathon",
    badge: "UNITED NATIONS • TEAM LEADER",
    title: "UNESCO Youth Hackathon 2026 (MIL & Digital Competencies)",
    issuer: "UNESCO • Team Nexora Leader",
    date: "Oct 2026",
    detail:
      "Led Team Nexora building CLICKWISE AI for multimodal AI detection and Media & Information Literacy (signed by Mariya Gabriel, ADG UNESCO).",
    accent: "cyan",
  },
  {
    id: "aws-ai-cloud-track",
    badge: "6 CLOUD & AI CERTS",
    title: "AWS Generative AI, Machine Learning & Cloud Practitioner Track",
    issuer: "Amazon Web Services (AWS Training & Certification)",
    date: "Jul – Oct 2026",
    detail:
      "Six verified AWS certificates spanning Generative AI Solutions, Developing ML Solutions, Responsible AI Practices, AI Fundamentals, and Cloud Practitioner Essentials.",
    accent: "amber",
  },
  {
    id: "itpec-ibm-anthropic-un",
    badge: "GLOBAL & NATIONAL CERTS",
    title: "ITPEC IP (MCF) • IBM DevOps • Anthropic MCP • WHO & UNICEF",
    issuer: "ITPEC / IBM / Anthropic / WHO (IARC) / UNICEF",
    date: "2025 – 2026",
    detail:
      "National ITPEC IT Passport (ID: MMIP25S00205), IBM Introduction to DevOps, Anthropic Model Context Protocol, plus WHO IARC and UNICEF international certificates.",
    accent: "coral",
  },
];

export const CREDENTIALS: CredentialGroup[] = [
  {
    category: "Awards, Hackathons & International Competitions",
    accent: "amber",
    items: [
      {
        title:
          "Youth Scientific Excellence Award — NASA Space Apps Challenge 2026 (Yangon)",
        issuer: "Myanmar Space Agency (MSA) • NASA Space Apps Challenge Yangon",
        year: "2026",
        date: "Nov 2026",
        type: "Award Winner",
        role: "Team INTERFELLAS (Thu Ta Sitt, Lu Maw Aung, Yin Min Htike, Ye Hein Thuta Aung, Kaung Htet Thar, Yan Myo Thura Ko)",
        signatory: "Dr. Soe Myint Maung (Myanmar Space Agency)",
        note: "Awarded by the Myanmar Space Agency in recognition of Team INTERFELLAS's innovative solution (Lunaspis) and its potential to create meaningful, positive impact on communities and society at NASA Space Apps Challenge 2026 – Yangon.",
      },
      {
        title: "NASA Space Apps Challenge Yangon 2026 — Galactic Problem Solver",
        issuer: "NASA Space Apps Challenge (UIT Yangon)",
        year: "2026",
        date: "Nov 14–15, 2026",
        type: "International Hackathon",
        role: "Galactic Problem Solver — Team INTERFELLAS",
        signatory: "Marc Kuchner (Program Scientist, NASA)",
        fileName: "NASA Space Apps Challenge.pdf",
      },
      {
        title: "UNESCO Youth Hackathon 2026 — Certificate of Participation",
        issuer: "UNESCO (MIL & Digital Competencies)",
        year: "2026",
        date: "Oct 24, 2026",
        type: "Hackathon",
        role: "Participant (Team Leader, Team Nexora)",
        signatory:
          "Mariya Gabriel (Assistant Director-General for Communication & Information, UNESCO)",
        fileName: "UNESCO Hackathon.pdf",
      },
      {
        title: "ASEAN GeoAI Fusion 2026 — GeoAI Explorer",
        issuer: "Universiti Malaya-Wales & ASEAN / MCMC",
        year: "2026",
        date: "Sep 22, 2026",
        type: "Formal Assessment",
        role: "GeoAI Explorer",
        credentialId: "E-C-MM-178-279",
        signatory:
          "Prof. Dr. Roselina Ahmad Saufi & Emeritus Prof. Dato' Dr. Halimah Badioze Zaman",
        fileName: "GeoAI Explorer.pdf",
      },
      {
        title: "ASEAN GeoAI Fusion 2026 — Bootcamp 2 (Advanced GeoAI)",
        issuer: "ASEAN / MCMC",
        year: "2026",
        date: "Jul 21–23, 2026",
        type: "Bootcamp",
        role: "Advance Track Participant",
        credentialId: "AGAIF2026-BC2-0336",
        signatory: "Tan Sri Mohamad Salim Bin Fateh Din (Chairman, MCMC)",
        fileName: "GeoAI Bootcamp 2.pdf",
      },
      {
        title: "ASEAN GeoAI Fusion 2026 — Bootcamp 1 (Foundational GeoAI)",
        issuer: "ASEAN / MCMC",
        year: "2026",
        date: "Jul 7–9, 2026",
        type: "Bootcamp",
        role: "Foundation Track Participant",
        credentialId: "AGAIF2026-BC1-0405",
        signatory: "Tan Sri Mohamad Salim Bin Fateh Din (Chairman, MCMC)",
        fileName: "GeoAI Bootcamp 1.pdf",
      },
      {
        title: "AI Infra Summit Hackathon Certificate",
        issuer: "lablab.ai (NativelyAI)",
        year: "2026",
        date: "Sep 10–16, 2026",
        type: "Hackathon",
        role: "Completion (GROQ / AI/ML API)",
        credentialId: "CMUCOKMO3000LS601WQ3SAY1E",
        signatory: "Pawel Czech (Founder, NativelyAI)",
        fileName: "AI Infra Summit Hackathon-certificate.pdf",
      },
      {
        title: "Alpaca AI Trading Agents Hackathon Certificate",
        issuer: "lablab.ai / Alpaca",
        year: "2026",
        date: "Aug 28 – Sep 4, 2026",
        type: "Hackathon",
        role: "Completion (AI/ML API / GitHub Copilot)",
        credentialId: "CMU18DGUN005PS601QW6MF7AG",
        signatory: "Pawel Czech (Founder, NativelyAI)",
        fileName: "Alpaca AI Trading Agents Hackathon-certificate.pdf",
      },
      {
        title:
          "RevenueCat Shipaton 2026 — Certificate of Participation (Embervale)",
        issuer: "RevenueCat",
        year: "2026",
        date: "Sep 2026",
        type: "Hackathon",
        role: "Solo Developer — Embervale",
        credentialId: "SH26-D3N0-GD99-BXEG",
        verifyUrl: "https://shipaton.com/verify/SH26-D3N0-GD99-BXEG",
        signatory: "Charles Chapman (Captain of Shipaton)",
        fileName: "shipaton-2026-certificate.pdf",
      },
      {
        title: "Pixel Forge AI Hackathon — Certificate of Participation",
        issuer: "Pixel Forge AI Hackathon",
        year: "2026",
        date: "Sep 2026",
        type: "Hackathon",
        role: "Participant",
        signatory: "Rishabh Mittal (Organizer)",
        fileName: "Pixel Forge AI Hackathon Participation Cert.png",
      },
      {
        title: "IBM Dev Day: Bob in Action — Certificate of Participation",
        issuer: "IBM / BeMyApp",
        year: "2026",
        date: "Aug 27–30, 2026",
        type: "Virtual Event & Hackathon",
        role: "Participant",
        fileName: "IBM Dev Day Bob in Action Certificate – Thu Ta Sitt.pdf",
      },
      {
        title: "ASEAN Data Science Explorers 2026 Enablement Session",
        issuer: "SAP, ASEAN Foundation & ASEAN Youth Organization",
        year: "2026",
        date: "Jun 2026",
        type: "Training Session",
        role: "SAP Analytics Cloud Participant",
        signatory: "Verena Siow, Dr. Piti Srisangnam & Sarah Rauzana",
        fileName:
          "e-Certificate ASEAN Data Science Explorers 2026 Enablement Session Thu Ta Sitt.pdf",
      },
    ],
  },
  {
    category: "AI, Machine Learning & Cloud Certifications",
    accent: "amber",
    items: [
      {
        title: "Generative AI Solutions (AWS)",
        issuer: "Amazon Web Services (AWS Training & Certification)",
        year: "2026",
        date: "Oct 3, 2026",
        type: "Completion Certificate",
        fileName: "GenAI Solutions.pdf",
      },
      {
        title: "AWS Developing Machine Learning Solutions",
        issuer: "Amazon Web Services (AWS Training & Certification)",
        year: "2026",
        date: "Sep 6, 2026",
        type: "Completion Certificate",
        fileName: "AWS Developing ML Solutions.pdf",
      },
      {
        title: "AWS Responsible AI Practices",
        issuer: "Amazon Web Services (AWS Training & Certification)",
        year: "2026",
        date: "Sep 3, 2026",
        type: "Completion Certificate",
        fileName: "AWS Responsible AI Practices.pdf",
      },
      {
        title: "AWS AI Use Cases and Applications",
        issuer: "Amazon Web Services (AWS Training & Certification)",
        year: "2026",
        date: "Sep 2, 2026",
        type: "Completion Certificate",
        fileName: "AWS AI Usecase and Applications.pdf",
      },
      {
        title: "AWS AI Fundamentals",
        issuer: "Amazon Web Services (AWS Training & Certification)",
        year: "2026",
        date: "Aug 27, 2026",
        type: "Completion Certificate",
        fileName: "AWS AI Fundamentals.pdf",
      },
      {
        title: "AWS Cloud Practitioner Essentials",
        issuer: "Amazon Web Services (AWS Training & Certification)",
        year: "2026",
        date: "Jul 14, 2026",
        type: "Completion Certificate",
        signatory: "Michelle Vaz",
        fileName: "AWS SkillBuild CloudPractitioner.pdf",
      },
      {
        title: "Machine Learning Specialization",
        issuer: "DeepLearning.AI & Stanford Online (Coursera)",
        year: "2026",
        date: "Jul 2, 2026",
        type: "Specialization",
        credentialId: "EP5HKLWLB11N",
        verifyUrl: "https://coursera.org/verify/specialization/EP5HKLWLB11N",
        signatory: "Andrew Ng",
        fileName: "MachineLearning Specialization.pdf",
      },
      {
        title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
        issuer: "DeepLearning.AI & Stanford Online (Coursera)",
        year: "2026",
        date: "Jul 2, 2026",
        type: "Course (ML Specialization 3/3)",
        credentialId: "MCL3Z1MGSVTJ",
        verifyUrl: "https://coursera.org/verify/MCL3Z1MGSVTJ",
        signatory: "Andrew Ng",
        fileName: "UnsupervisedML.pdf",
      },
      {
        title: "Advanced Learning Algorithms",
        issuer: "DeepLearning.AI & Stanford Online (Coursera)",
        year: "2026",
        date: "Jun 26, 2026",
        type: "Course (ML Specialization 2/3)",
        credentialId: "JL17C2POEBUC",
        verifyUrl: "https://coursera.org/verify/JL17C2POEBUC",
        signatory: "Andrew Ng",
        fileName: "AdvancedLearningAlgorithms.pdf",
      },
      {
        title: "Supervised Machine Learning: Regression and Classification",
        issuer: "DeepLearning.AI & Stanford Online (Coursera)",
        year: "2025",
        date: "Dec 21, 2025",
        type: "Course (ML Specialization 1/3)",
        credentialId: "H7XSVKQ6TAQA",
        verifyUrl: "https://coursera.org/verify/H7XSVKQ6TAQA",
        signatory: "Andrew Ng",
        fileName: "Machine Learning.pdf",
      },
      {
        title: "Introduction to Model Context Protocol (MCP)",
        issuer: "Anthropic Education",
        year: "2026",
        date: "Jun 29, 2026",
        type: "Completion Certificate",
        fileName: "Anthropic.pdf",
      },
      {
        title: "Python for Data Science and AI",
        issuer: "IBM Developer Skills Network (Coursera)",
        year: "2025",
        date: "Dec 26, 2025",
        type: "Digital Credential",
        credentialId: "afccbd22-ead3-4c0b-8937-0b261b8e8a32",
        verifyUrl:
          "https://www.credly.com/badges/afccbd22-ead3-4c0b-8937-0b261b8e8a32",
        fileName: "Python for Data Science and AI.pdf",
      },
    ],
  },
  {
    category: "Software Engineering, DevOps & Web Development",
    accent: "cyan",
    items: [
      {
        title: "Introduction to DevOps",
        issuer: "IBM (Coursera)",
        year: "2026",
        date: "May 20, 2026",
        type: "Course Certificate",
        credentialId: "RSD867ZCM9IH",
        verifyUrl: "https://coursera.org/verify/RSD867ZCM9IH",
        signatory: "John J. Rofrano",
        fileName: "Introduction To DevOps.pdf",
      },
      {
        title: "Information Technology Passport Examination (ITPEC IP)",
        issuer: "ITPEC & Myanmar Computer Federation (MCF)",
        year: "2025",
        date: "Apr 27, 2025 (Issued Jul 12, 2025)",
        type: "National Certification",
        credentialId: "MMIP25S00205",
        signatory: "Min Zeyar Hlaing (Chairman, MCF)",
        fileName: "ITPEC_IP.pdf",
      },
      {
        title: "Introduction to Git and GitHub",
        issuer: "Google (Coursera)",
        year: "2025",
        date: "Oct 21, 2025",
        type: "Course Certificate",
        credentialId: "F8KJCQN0YAC6",
        verifyUrl: "https://coursera.org/verify/F8KJCQN0YAC6",
        signatory: "Google",
        fileName: "Git and GitHub.pdf",
      },
      {
        title: "Introduction to MongoDB",
        issuer: "MongoDB Inc. (Coursera)",
        year: "2025",
        date: "Oct 17, 2025",
        type: "Course Certificate",
        credentialId: "7J789B2EGJXL",
        verifyUrl: "https://coursera.org/verify/7J789B2EGJXL",
        signatory: "Sahir Azam",
        fileName: "Introduction to MongoDB.pdf",
      },
      {
        title: "Advanced JavaScript Specialization (Courses 1–3)",
        issuer: "Scrimba (Coursera)",
        year: "2025",
        date: "Oct 16, 2025",
        type: "Specialization (Courses 1–3)",
        credentialId: "C58KUTHJ3FL3",
        verifyUrl: "https://coursera.org/verify/specialization/C58KUTHJ3FL3",
        signatory: "Tom Chant",
        note: "Covers Course 1 (Objects, Loops, Hoisting), Course 2 (Async JS, APIs, Operators, Objects), and Course 3 (Objects, Collections, Functions).",
        fileName: "Advanced JS Specialization.pdf",
      },
      {
        title: "Advanced JavaScript 1: Objects, Loops, Hoisting",
        issuer: "Scrimba (Coursera)",
        year: "2025",
        date: "Oct 15, 2025",
        type: "Course (Advanced JS 1/3)",
        credentialId: "R0UYEFP5B3TW",
        verifyUrl: "https://coursera.org/verify/R0UYEFP5B3TW",
        signatory: "T. Chant",
        fileName: "Advanced JavaScript1.pdf",
      },
      {
        title: "Advanced JavaScript 2: Async JS, APIs, Operators, Objects",
        issuer: "Scrimba (Coursera)",
        year: "2025",
        date: "Oct 16, 2025",
        type: "Course (Advanced JS 2/3)",
        credentialId: "3IBR2LP62LRW",
        verifyUrl: "https://coursera.org/verify/3IBR2LP62LRW",
        signatory: "T. Chant",
        fileName: "Advanced JavaScript2.pdf",
      },
      {
        title: "Introduction to Software Engineering",
        issuer: "IBM (Coursera)",
        year: "2025",
        date: "Oct 12, 2025",
        type: "Course Certificate",
        credentialId: "541W3V0LRVSY",
        verifyUrl: "https://coursera.org/verify/541W3V0LRVSY",
        signatory: "Lin Joyner, Rav Ahuja & Bethany Hudnutt",
        fileName: "Essentials for software engineering.pdf",
      },
      {
        title: "Software Engineering Essentials (IBM Digital Credential)",
        issuer: "IBM Developer Skills Network (Coursera)",
        year: "2025",
        date: "Oct 12, 2025",
        type: "Digital Credential",
        credentialId: "866eaf38-9624-4111-bd89-210bee4b657f",
        verifyUrl:
          "https://www.credly.com/badges/866eaf38-9624-4111-bd89-210bee4b657f",
        fileName: "IBM Software Engineering.pdf",
      },
      {
        title: "RESTful API with Express",
        issuer: "Packt (Coursera)",
        year: "2025",
        date: "Sep 6, 2025",
        type: "Course Certificate",
        credentialId: "VPS6VRFRWNHZ",
        verifyUrl: "https://coursera.org/verify/VPS6VRFRWNHZ",
        fileName: "RESTful APIs using Express.pdf",
      },
    ],
  },
  {
    category: "Volunteering, Community & Interdisciplinary",
    accent: "coral",
    items: [
      {
        title: "Research Volunteer Certificate — ROOT: Growing Together",
        issuer: "The Sprout Scouts",
        year: "2026",
        date: "Oct 11, 2026",
        type: "Volunteer Certificate",
        role: "Volunteer (2 Volunteer Hours)",
        signatory: "Zune Thi Khine (Founder)",
        fileName: "TSS VOL.PNG",
      },
      {
        title:
          'Wings of Hope / "The Unfair Advantage" AI Industry Webinar',
        issuer: "Wings of Hope (SIAEi Initiative)",
        year: "2026",
        date: "Sep 8, 2026",
        type: "Webinar Completion",
        signatory: "Dr Marie Ang (Workshop Facilitator)",
        fileName: "Wings of Hope.PNG",
      },
      {
        title: "Cancer Surveillance and Registration",
        issuer: "IARC / World Health Organization (WHO)",
        year: "2026",
        date: "Jun 29, 2026",
        type: "Course Confirmation",
        note: "Confirmation of participation (minimum 70% quiz score).",
        fileName: "WHO cerificate.pdf",
      },
      {
        title:
          "Child Rights Toolkit: Integrating Child Rights in International Partnerships",
        issuer: "UNICEF (Agora)",
        year: "2026",
        date: "Jun 29, 2026",
        type: "Completion Certificate",
        credentialId: "tUMNB9s6SH",
        signatory:
          "Hannan Sulieman (Deputy Executive Director-Management, UNICEF)",
        fileName: "Child-Rights-Toolkit_Certificate of completion.pdf",
      },
    ],
  },
];

export const HERO_STATS: HeroStat[] = [
  { value: "MSA", label: "NASA Space Apps Award" },
  { value: String(PROJECTS.length).padStart(2, "0"), label: "Flagship Systems" },
  {
    value: String(CREDENTIALS[0]?.items.length ?? 0).padStart(2, "0"),
    label: "Awards & Hackathons",
  },
  {
    value: String(CREDENTIALS.reduce((sum, group) => sum + group.items.length, 0)),
    label: "Intl & Verified Certs",
  },
];

export const TICKER_ITEMS: string[] = [
  "NASA SPACE APPS 2026 YANGON // YOUTH SCIENTIFIC EXCELLENCE AWARD",
  "STANFORD & DEEPLEARNING.AI // ML SPECIALIZATION",
  "ASEAN GEOAI EXPLORER // UNESCO YOUTH HACKATHON",
  "AWS GENAI & ML TRACK // IBM DEVOPS // ANTHROPIC MCP",
  "NEXT.JS 16 // REACT 19 // TYPESCRIPT // PYTHON",
  "THREE.JS // WEBGL // SPRING BOOT 4 // DOCKER VPS",
  "GEOAI // SAM // NDWI // OSRM // KERAS // XGBOOST",
];
