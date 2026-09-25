import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo";
import { api } from "../services/api";

const jurisdictions = ["India","United States","United Kingdom","Canada","Australia","Singapore","Other / Not sure"];

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
  return <div className="min-h-screen bg-transparent p-5 text-ink">
    <div className="mx-auto max-w-6xl"><div className="flex items-center justify-between py-3"><Logo /><Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-ink transition-colors"><ArrowLeft size={16}/> Home</Link></div>
      <div className="grid min-h-[calc(100vh-100px)] items-center gap-12 lg:grid-cols-2">
        <div className="hidden lg:block"><div className="text-sm font-semibold text-wine">LEXORA AI</div><h1 className="mt-4 font-display text-6xl leading-tight">A clearer way to prepare for legal next steps.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">Describe your situation, organize evidence and prepare questions and documents — while keeping AI limitations visible.</p></div>
        <div className="rounded-3xl border border-black/5 bg-white/70 backdrop-blur-xl p-7 shadow-xl md:p-10"><div className="flex gap-6 border-b border-black/5 pb-4"><button className={`transition-colors ${mode==="login"?"font-semibold text-wine":"text-gray-500 hover:text-gray-700"}`} onClick={()=>setMode("login")}>Sign in</button><button className={`transition-colors ${mode==="register"?"font-semibold text-wine":"text-gray-500 hover:text-gray-700"}`} onClick={()=>setMode("register")}>Create account</button></div>
          {error&&<div className="mt-5 rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-600 backdrop-blur-sm">{error}</div>}
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode==="register"&&<input className="input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>}
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
            <div className="relative"><input className="input pr-12" type={show?"text":"password"} placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition-colors">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
            {mode==="register"&&<select className="input appearance-none bg-white/70" value={form.jurisdiction} onChange={e=>setForm({...form,jurisdiction:e.target.value})}>{jurisdictions.map(x=><option key={x} className="bg-white text-ink">{x}</option>)}</select>}
            <button disabled={loading} className="btn-primary w-full mt-2">{loading?"Please wait...":mode==="login"?"Sign in":"Create account"}</button>
          </form>
          <div className="mt-6 rounded-2xl border border-black/5 bg-white/50 p-5 text-xs text-gray-500 backdrop-blur-sm"><b className="text-gray-800">Demo account</b><br/>demo@lexora.ai<br/>LexoraDemo@123</div>
        </div>
      </div>
    </div>
  </div>;
}
