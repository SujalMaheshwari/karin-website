import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useTheme } from "./hooks/useTheme.js";
import { useSiteContent } from "./hooks/useSiteContent.js";

import LoadingScreen from "./components/LoadingScreen.jsx";
import { ToastContainer, useToast } from "./components/Toast.jsx";

import Navbar        from "./components/Navbar.jsx";
import Hero          from "./components/Hero.jsx";
import Stats         from "./components/Stats.jsx";
import Services      from "./components/Services.jsx";
import WhyKarin      from "./components/WhyKarin.jsx";
import Work          from "./components/Work.jsx";
import HowWeWork     from "./components/HowWeWork.jsx";
import Team          from "./components/Team.jsx";
import Testimonials  from "./components/Testimonials.jsx";
import FAQ           from "./components/FAQ.jsx";
import Contact       from "./components/Contact.jsx";
import Footer        from "./components/Footer.jsx";

const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const CaseStudy = lazy(() => import("./pages/work/CaseStudy.jsx"));
const NotFound = lazy(() => import("./components/NotFound.jsx"));

/* ── Page transition ── */
const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.24, ease: "easeIn" } },
};

function Page({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function RouteFallback() {
  return <div className="route-fallback">Loading...</div>;
}

function AnimatedRoutes({ dark, setDark, toast, content, contentLoading }) {
  const location = useLocation();
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={
          <Page>
            <Navbar dark={dark} setDark={setDark} scrollTo={scrollTo} />
            <main>
              <Hero scrollTo={scrollTo} />
              <Stats />
              <Services services={content.services} loading={contentLoading} />
              <WhyKarin />
              <Work projects={content.projects} loading={contentLoading} />
              <HowWeWork />
              <Team team={content.team} />
              <Testimonials />
              <FAQ />
              <Contact toast={toast} />
            </main>
            <Footer dark={dark} />
          </Page>
        } />

        <Route path="/work/:id" element={<Page><Suspense fallback={<RouteFallback />}><CaseStudy projects={content.projects} /></Suspense></Page>} />
        <Route path="/admin"    element={<Page><Suspense fallback={<RouteFallback />}><AdminLogin toast={toast} /></Suspense></Page>} />
        <Route path="/admin/dashboard" element={<Page><Suspense fallback={<RouteFallback />}><AdminDashboard toast={toast} /></Suspense></Page>} />
        <Route path="*"         element={<Page><Suspense fallback={<RouteFallback />}><NotFound /></Suspense></Page>} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [dark, setDark] = useTheme();
  const [loaded, setLoaded] = useState(false);
  const { toasts, toast }   = useToast();
  const { content, loading: contentLoading } = useSiteContent();

  useEffect(() => {
    document.title = "KARIN AI | Software Development Studio";
    const meta = (attr, val, content) => {
      let el = document.querySelector(`meta[${attr}="${val}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, val); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    meta("name",     "description",    "KARIN AI builds scalable web apps, AI integrations, and modern digital products.");
    meta("name",     "keywords",       "software development, AI, full-stack, React, Node.js, LLM, Bhopal, India, KARIN");
    meta("name",     "author",         "KARIN Pvt. Ltd.");
    meta("property", "og:title",       "KARIN AI | Software Development Studio");
    meta("property", "og:description", "Advanced AI solutions — Bhopal, India.");
    meta("property", "og:type",        "website");
    meta("property", "og:url",         "https://karinpvt.in");
  }, []);

  return (
    <BrowserRouter>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <ToastContainer toasts={toasts} onRemove={() => {}} />
      <AnimatedRoutes
        dark={dark}
        setDark={setDark}
        toast={toast}
        content={content}
        contentLoading={contentLoading}
      />
    </BrowserRouter>
  );
}
