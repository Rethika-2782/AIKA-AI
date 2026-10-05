/**
 * @component Landing
 * @description Accessible and memoized component for AIKA AI.
 */
import { ArrowRight, CheckCircle2, FileText, Globe2, ShieldCheck, Sparkles, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { motion } from "framer-motion";

const features = [
  ["AI Legal Navigator", "Describe what happened and receive a structured, plain-language analysis.", Sparkles],
  ["Case Intelligence", "Turn scattered facts into key facts, missing information, evidence and an ActionPath.", ShieldCheck],
  ["Draft Studio", "Prepare editable informational drafts and consultation summaries.", FileText],
  ["Global by design", "Choose a jurisdiction and keep jurisdiction limitations visible.", Globe2]
];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } }
};

export default function Landing({ user }) {
  return <div className="min-h-screen text-gray-900 overflow-hidden relative">
    {/* Animated background elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] rounded-full bg-wine/5 blur-[150px]" />
    </div>

    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 relative z-10">
      <Logo />
      <div className="flex items-center gap-4">
        <Link className="hidden text-sm font-medium md:block text-gray-600 hover:text-ink transition-colors" to="/login">Sign in</Link>
        <Link className="btn-primary" to={user ? "/dashboard" : "/login"}>{user ? "Open workspace" : "Start with AIKA"} <ArrowRight size={16} /></Link>
      </div>
    </nav>

    <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:pt-24 relative z-10">
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-4 py-2 text-xs font-semibold backdrop-blur-md text-wine shadow-sm">
          <Sparkles size={14} className="text-wine" /> AI-powered legal clarity
        </motion.div>
        <motion.div variants={fadeInUp}>
          <h1 className="max-w-3xl font-display text-5xl leading-[1.1] tracking-tight md:text-7xl">
            Navigate the law with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wine to-pink-700">total confidence.</span>
          </h1>
        </motion.div>
        <motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 font-light">
          AIKA AI helps you understand legal situations, organize critical evidence, prepare documents, and identify actionable next steps — all in clear, accessible language.
        </motion.p>
        <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
          <Link className="btn-primary text-base px-8 py-4 shadow-lg" to={user ? "/dashboard" : "/login"}>
            Analyze Your Situation <ArrowRight size={18} />
          </Link>
          <a href="#features" className="btn-secondary text-base px-8 py-4">Explore Platform</a>
        </motion.div>
        <motion.p variants={fadeInUp} className="mt-6 text-xs text-gray-400 uppercase tracking-wider">
          Informational assistance • Not a substitute for legal advice
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="glass-panel relative overflow-hidden p-1 shadow-2xl perspective-1000"
      >
        <div className="rounded-[22px] bg-gradient-to-br from-white to-gray-50 p-6 border border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[.25em] text-wine/70 font-semibold">Live Analysis</div>
              <div className="mt-2 text-2xl font-display font-medium text-ink">Unpaid salary dispute</div>
            </div>
            <div className="rounded-full bg-black/5 px-4 py-1.5 text-xs text-gray-600 font-medium">Employment Law</div>
          </div>
          
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Core issue", "Key facts", "Evidence Readiness", "ActionPath"].map((x, i) => (
              <div key={x} className="rounded-xl border border-black/5 bg-white/60 p-5 backdrop-blur-sm transition hover:bg-white/90">
                <div className="text-xs text-gray-500 font-medium">{x}</div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {i === 0 ? "Breach of contract" : i === 1 ? "4 critical events" : i === 2 ? "80% organized" : "5 recommended steps"}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 rounded-xl bg-gradient-to-r from-wine/20 to-transparent p-[1px]">
            <div className="rounded-xl bg-white/90 p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs text-wine font-semibold uppercase tracking-wider">
                <CheckCircle2 size={14} /> Next Recommended Action
              </div>
              <div className="mt-2 font-medium text-ink">Issue Formal Demand Notice</div>
              <div className="mt-1 text-sm text-gray-600 leading-relaxed">Draft a clear chronological summary of missed payments and send via certified mail.</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>

    <section id="features" className="relative z-10 border-y border-black/5 bg-white/50 backdrop-blur-3xl">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold tracking-wider text-wine uppercase">Enterprise-Grade Workflows</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-ink">Clarity from chaos.</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map(([title, desc, Icon], idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card p-8 group" 
              key={title}
            >
              <div className="h-12 w-12 rounded-2xl bg-wine/10 flex items-center justify-center mb-6 group-hover:bg-wine/20 transition-colors">
                <Icon className="text-wine" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <footer className="relative z-10 border-t border-black/5 mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 text-sm text-gray-500 md:flex-row md:items-center md:justify-between bg-transparent">
      <Logo />
      <span className="font-light">Understand the law. Know your options. Take the next step.</span>
    </footer>
  </div>;
}
