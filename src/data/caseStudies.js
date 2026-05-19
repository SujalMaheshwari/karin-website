// ═══════════════════════════════════════════
//  KARIN — Case Study Detail Data
// ═══════════════════════════════════════════

import pulseboardImg  from "../assets/projects/pulseboard-analytics.png";
import cartflowImg    from "../assets/projects/cartflow-commerce.png";
import medassistImg   from "../assets/projects/medassist-ai.png";
import nexusImg       from "../assets/projects/nexus-client-suite.png";

export const CASE_STUDIES = [
  {
    id:       "nexus-client-suite",
    title:    "Nexus Client Suite",
    type:     "Internal Product Concept",
    category: "Full-Stack · SaaS",
    year:     "2025",
    color:    "#c8f564",
    duration: "8 weeks",
    image:    nexusImg,
    imageAlt: "Nexus Client Suite — agency command center dashboard",
    stack:    ["React", "Node.js", "MongoDB", "JWT", "Express", "Tailwind"],

    summary:
      "A multi-role client management platform built to explore scalable dashboard architecture, role-based access control, and real-time project tracking for small to mid-size agencies.",

    problem:
      "Agencies managing multiple clients often juggle spreadsheets, email threads, and disconnected tools. There was no single place to track project status, share updates, and manage invoices — all in one clean interface.",

    goals: [
      "Build a role-based system with Admin, Manager, and Client views",
      "Real-time project status and milestone tracking",
      "Invoice generation and payment status",
      "Clean, responsive dashboard that works on any device",
    ],

    approach:
      "We designed a three-tier access system from the ground up, ensuring each role sees only what they need. The backend uses JWT authentication with refresh tokens. The frontend is fully componentised with a shared design system.",

    outcomes: [
      "Complete role-based auth system with 3 access levels",
      "Dashboard with real-time project and invoice tracking",
      "Reusable component library of 20+ UI elements",
      "90+ Lighthouse performance score",
    ],

    challenges:
      "The biggest challenge was designing the permission model cleanly — ensuring a client can view their projects but never access billing data of other clients. Solved using middleware-level access guards on every protected route.",
  },

  {
    id:       "medassist-ai",
    title:    "MedAssist AI",
    type:     "Prototype Platform",
    category: "LLM · Backend",
    year:     "2025",
    color:    "#64c8f5",
    duration: "6 weeks",
    image:    medassistImg,
    imageAlt: "MedAssist AI — healthcare AI assistant interface",
    stack:    ["Python", "FastAPI", "OpenAI", "LangChain", "MongoDB", "React"],

    summary:
      "An AI-powered assistant prototype for healthcare workflows — context-aware patient query handling, appointment guidance, and document intelligence using a RAG (Retrieval-Augmented Generation) architecture.",

    problem:
      "Healthcare front desks handle hundreds of repetitive patient queries daily — appointment scheduling questions, medication refill requests, general health information. Staff bandwidth is wasted on queries that could be handled automatically.",

    goals: [
      "Build a RAG pipeline that answers from hospital-specific documents",
      "Context-aware multi-turn conversation with memory",
      "Safe fallback to human agent when confidence is low",
      "HIPAA-conscious design — no patient data stored unnecessarily",
    ],

    approach:
      "We used LangChain to build a document ingestion pipeline — hospital FAQs, appointment policies, and drug information sheets are chunked and embedded into a vector store. At query time, the most relevant chunks are retrieved and passed to GPT-4 with a strict system prompt.",

    outcomes: [
      "Answers 80%+ of common queries without human intervention",
      "Multi-turn conversation with context window management",
      "Confidence scoring — low-confidence queries escalate to staff",
      "Document ingestion pipeline for updating knowledge base",
    ],

    challenges:
      "Hallucination control was critical in a medical context. We implemented a strict retrieval-only mode — the model is explicitly instructed not to answer beyond what's in the retrieved documents, with a fallback message that directs users to call the clinic.",
  },

  {
    id:       "cartflow-commerce",
    title:    "CartFlow Commerce",
    type:     "MVP Exploration",
    category: "Frontend · API",
    year:     "2024",
    color:    "#f5a164",
    duration: "5 weeks",
    image:    cartflowImg,
    imageAlt: "CartFlow Commerce — e-commerce storefront with Stripe checkout",
    stack:    ["React", "Node.js", "MongoDB", "Stripe", "Cloudinary", "Redis"],

    summary:
      "A performant e-commerce storefront built to explore modern commerce patterns — Stripe payment integration, real-time inventory management, and a fast, responsive product browsing experience.",

    problem:
      "Most small businesses in India use Instagram DMs or WhatsApp to sell products — a painful, unscalable process. The goal was to build a clean, affordable storefront template that any small seller could use.",

    goals: [
      "Fast product catalogue with search and category filters",
      "Stripe + Razorpay payment gateway integration",
      "Admin panel for inventory and order management",
      "Mobile-first design — 70%+ of users shop on phones",
    ],

    approach:
      "We prioritised performance from day one — images served via Cloudinary with automatic WebP conversion, lazy loading throughout. Redis used for cart session caching. Stripe webhooks handle payment confirmation asynchronously.",

    outcomes: [
      "Sub-2 second load time on 4G mobile",
      "Full Stripe checkout with webhook-based order confirmation",
      "Admin inventory panel with low-stock alerts",
      "Redis-backed cart with 30-minute session persistence",
    ],

    challenges:
      "Handling payment failures gracefully was the most complex part. We built an idempotent order creation system — if a payment fails or the user refreshes mid-checkout, no duplicate orders are created and the cart is preserved.",
  },

  {
    id:       "pulseboard-analytics",
    title:    "PulseBoard Analytics",
    type:     "Internal SaaS Build",
    category: "Full-Stack · Data Viz",
    year:     "2024",
    color:    "#c864f5",
    duration: "7 weeks",
    image:    pulseboardImg,
    imageAlt: "PulseBoard Analytics — real-time business metrics dashboard",
    stack:    ["React", "Recharts", "Node.js", "MongoDB", "Aggregation Pipeline", "JWT"],

    summary:
      "A real-time business metrics platform built to explore analytics visualisation, role-based dashboards, and scalable data pipelines — with a reusable charting component architecture.",

    problem:
      "Business owners often have data scattered across tools — sales in one sheet, traffic in another, support tickets elsewhere. PulseBoard was built to explore how to pull this into one coherent, real-time dashboard.",

    goals: [
      "Unified metrics dashboard — sales, traffic, support in one view",
      "Custom date range filters with instant chart updates",
      "Role-based views — Executive, Manager, Analyst",
      "Export to CSV and PDF",
    ],

    approach:
      "The backend uses MongoDB aggregation pipelines to compute metrics server-side — no heavy processing on the client. Charts built with Recharts, wrapped in reusable components that accept any data shape. All chart configs are stored in a single constants file for easy white-labelling.",

    outcomes: [
      "12 reusable chart components (bar, line, donut, heatmap)",
      "Real-time data refresh every 60 seconds",
      "PDF export using browser print API with custom print styles",
      "Query response time under 200ms via aggregation optimisation",
    ],

    challenges:
      "Date-range filtering with timezone correctness was surprisingly tricky. We store all timestamps in UTC and convert to IST at the aggregation layer — this ensures consistent results regardless of where the user is accessing from.",
  },
];

export const getCaseStudy = (id) => CASE_STUDIES.find((c) => c.id === id);
