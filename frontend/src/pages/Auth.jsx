/**
 * @component Auth
 * @description Accessible login and registration form for Lexora AI.
 * Supports keyboard navigation, ARIA labels, and screen reader compatibility.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo";
import { api } from "../services/api";

const jurisdictions = ["India","United States","United Kingdom","Canada","Australia","Singapore","Other / Not sure"];

/**
 * Auth page component handles user login and registration.
 * @param {{ onLogin: Function }} props
 */
export default function Auth({ onLogin }) {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"demo@lexora.ai",password:"LexoraDemo@123",jurisdiction:"India"});
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const navigate=useNavigate();

  async function submit(e){
    e.preventDefault(); setLoading(true); setError("");
    try{
      const data=mode==="login"?await api.login(form):await api.register(form);
      localStorage.setItem("lexora_token",data.token); onLogin(data.user); navigate("/app");
    }catch(e){setError(e.message)}finally{setLoading(false)}
  }

  return (
    <div className="min-h-screen bg-transparent p-5 text-ink" role="main">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between py-3">
          <Logo />
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-ink transition-colors" aria-label="Go back to home page">
            <ArrowLeft size={16}/> Home
          </Link>
        </div>
        <div className="grid min-h-[calc(100vh-100px)] items-center gap-12 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="text-sm font-semibold text-wine">LEXORA AI</div>
            <h1 className="mt-4 font-display text-6xl leading-tight">A clearer way to prepare for legal next steps.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">Describe your situation, organize evidence and prepare questions and documents — while keeping AI limitations visible.</p>
          </div>
          <section aria-label="Authentication form" className="rounded-3xl border border-black/5 bg-white/70 backdrop-blur-xl p-7 shadow-xl md:p-10">
            <div className="flex gap-6 border-b border-black/5 pb-4" role="tablist" aria-label="Authentication mode">
              <button
                role="tab"
                aria-selected={mode === "login"}
                aria-controls="auth-form"
                className={`transition-colors ${mode==="login"?"font-semibold text-wine":"text-gray-500 hover:text-gray-700"}`}
                onClick={() => setMode("login")}
                aria-label="Switch to sign in mode"
              >Sign in</button>
              <button
                role="tab"
                aria-selected={mode === "register"}
                aria-controls="auth-form"
                className={`transition-colors ${mode==="register"?"font-semibold text-wine":"text-gray-500 hover:text-gray-700"}`}
                onClick={() => setMode("register")}
                aria-label="Switch to create account mode"
              >Create account</button>
            </div>
            {error && (
              <div role="alert" className="mt-5 rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-600 backdrop-blur-sm">
                {error}
              </div>
            )}
            <form id="auth-form" onSubmit={submit} className="mt-6 space-y-4" aria-label={mode === "login" ? "Sign in form" : "Create account form"}>
              {mode==="register" && (
                <input
                  className="input"
                  placeholder="Full name"
                  value={form.name}
                  onChange={e => setForm({...form,name:e.target.value})}
                  required
                  aria-label="Full name"
                  autoComplete="name"
                />
              )}
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({...form,email:e.target.value})}
                required
                aria-label="Email address"
                autoComplete="email"
              />
              <div className="relative">
                <input
                  className="input pr-12"
                  type={show?"text":"password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({...form,password:e.target.value})}
                  required
                  aria-label="Password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {mode==="register" && (
                <select
                  className="input appearance-none bg-white/70"
                  value={form.jurisdiction}
                  onChange={e => setForm({...form,jurisdiction:e.target.value})}
                  aria-label="Select your jurisdiction"
                >
                  {jurisdictions.map(x => <option key={x} className="bg-white text-ink">{x}</option>)}
                </select>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
                aria-label={loading ? "Please wait, authenticating..." : mode==="login" ? "Sign in to Lexora AI" : "Create your Lexora AI account"}
                aria-busy={loading}
              >
                {loading?"Please wait...":mode==="login"?"Sign in":"Create account"}
              </button>
            </form>
            <div className="mt-6 rounded-2xl border border-black/5 bg-white/50 p-5 text-xs text-gray-500 backdrop-blur-sm" aria-label="Demo account credentials">
              <b className="text-gray-800">Demo account</b><br/>demo@lexora.ai<br/>LexoraDemo@123
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
