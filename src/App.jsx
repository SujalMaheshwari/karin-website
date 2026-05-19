import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cursor        from "./components/Cursor.jsx";
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

import AdminLogin     from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CaseStudy      from "./pages/work/CaseStudy.jsx";
import NotFound       from "./components/NotFound.jsx";

function HomePage({ dark, setDark, toast }) {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <>
      <Navbar dark={dark} setDark={setDark} scrollTo={scrollTo} />
      <main>
        <Hero scrollTo={scrollTo} />
        <Stats />
        <Services />
        <WhyKarin />
        <Work />
        <HowWeWork />
        <Team />
        <Testimonials />
        <FAQ />
        <Contact toast={toast} />
      </main>
      <Footer dark={dark} />
    </>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem("karin_theme"); return s ? s === "dark" : true; }
    catch { return true; }
  });
  const [loaded, setLoaded] = useState(false);
  const { toasts, toast } = useToast();

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
    try { localStorage.setItem("karin_theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

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
      <Cursor />
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <ToastContainer toasts={toasts} onRemove={() => {}} />
      <Routes>
        <Route path="/"                element={<HomePage dark={dark} setDark={setDark} toast={toast} />} />
        <Route path="/work/:id"        element={<CaseStudy />} />
        <Route path="/admin"           element={<AdminLogin toast={toast} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard toast={toast} />} />
        <Route path="*"                element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
