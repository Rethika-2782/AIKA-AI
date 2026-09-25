import { useEffect, useState, useRef } from "react";
import { ArrowRight, BriefcaseBusiness, FileText, Globe2, Sparkles, UploadCloud, FileType, CheckCircle2, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import LoadingAI from "../components/LoadingAI";
import StatCard from "../components/StatCard";

export default function Dashboard({ user }) {
  const [mode, setMode] = useState("chat"); // 'chat' or 'upload'
  const [messages, setMessages] = useState([
    { role: "ai", text: `Hello ${user.name.split(" ")[0]}. I am LEXORA, your legal navigator. What brings you here today? Please describe your situation or the legal issue you are facing.` }
  ]);
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(()=>{api.listCases().then(setCases).catch(()=>{})},[]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if(!inputText.trim()) return;
    
    const newMessages = [...messages, { role: "user", text: inputText }];
    setMessages(newMessages);
    setInputText("");
    setLoading(true);
    setError("");
    
    try {
      // If it's a short message, ask for more details. If it's long enough, analyze it.
      const fullText = newMessages.filter(m => m.role === 'user').map(m => m.text).join(" ");
      if (fullText.length < 50 && newMessages.length < 5) {
        setTimeout(() => {
          setMessages([...newMessages, { role: "ai", text: "I need a bit more context to give you an accurate analysis. Could you provide some specific details like dates, agreements, or what exactly happened next?" }]);
          setLoading(false);
        }, 1000);
      } else {
        setMessages([...newMessages, { role: "ai", text: "Thank you. Analyzing your situation and generating your Case Intelligence report..." }]);
        const data = await api.analyze({ situation: fullText, jurisdiction: user.jurisdiction });
        setAnalysis(data);
      }
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e) {
    const f = e.target.files[0];
    if(!f) return;
    setFile(f);
    setLoading(true);
    // Mock processing delay for contract analyzer
    setTimeout(async () => {
      try {
        const data = await api.analyze({ situation: "Uploaded Contract: " + f.name + " for review regarding unfair clauses.", jurisdiction: user.jurisdiction });
        setAnalysis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }

  async function saveCase(){
    try{
      const fullContext = messages.filter(m => m.role === 'user').map(m => m.text).join("\n") || (file ? "Contract: " + file.name : "New case");
      const c = await api.createCase({title:analysis.issueTitle||"New legal situation",jurisdiction:user.jurisdiction,category:analysis.category,description:fullContext,analysis});
      navigate(`/cases/${c._id}`);
    }catch(e){setError(e.message)}
  }

  return <div>
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-sm text-gray-500 font-medium">Good to see you, {user.name.split(" ")[0]}</div>
        <h1 className="mt-1 font-display text-4xl text-ink font-bold">How can we help you today?</h1>
      </div>
      <div className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-medium shadow-sm"><Globe2 className="mr-2 inline text-wine" size={15}/>{user.jurisdiction}</div>
    </div>
    
    <div className="mt-8 grid gap-4 md:grid-cols-4">
      <StatCard label="Active Cases" value={cases.length} icon={BriefcaseBusiness}/>
      <StatCard label="Saved Documents" value="0" icon={FileText}/>
      <StatCard label="AI Consultations" value="12" icon={Sparkles}/>
      <StatCard label="Evidence Progress" value="45%" icon={ArrowRight}/>
    </div>

    <div className="mt-8 mb-4 flex gap-4 border-b border-black/5 pb-0">
      <button className={`pb-3 px-2 font-semibold text-sm transition-colors border-b-2 ${mode === 'chat' ? 'border-wine text-wine' : 'border-transparent text-gray-500 hover:text-ink'}`} onClick={() => setMode('chat')}>
        <MessageSquareText size={16} className="inline mr-2"/> Automated Intake
      </button>
      <button className={`pb-3 px-2 font-semibold text-sm transition-colors border-b-2 ${mode === 'upload' ? 'border-wine text-wine' : 'border-transparent text-gray-500 hover:text-ink'}`} onClick={() => setMode('upload')}>
        <FileText size={16} className="inline mr-2"/> Contract Analyzer
      </button>
    </div>

    {mode === 'chat' ? (
      <div className="card flex flex-col h-[500px] bg-white/70">
        <div className="flex items-center gap-2 text-sm font-semibold p-5 border-b border-black/5 bg-white/50 rounded-t-3xl">
          <Sparkles size={17} className="text-wine"/> LEXORA Legal Navigator
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-ink text-white rounded-br-sm' : 'bg-white border border-black/5 shadow-sm text-gray-800 rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && !analysis && <div className="flex justify-start"><div className="bg-white border border-black/5 p-4 rounded-2xl rounded-bl-sm shadow-sm"><LoadingAI /></div></div>}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t border-black/5 bg-white/50 rounded-b-3xl flex gap-3">
          <input className="input flex-1 bg-white" placeholder="Type your response here..." value={inputText} onChange={e=>setInputText(e.target.value)} disabled={loading || analysis} />
          <button type="submit" className="btn-primary px-6" disabled={loading || !inputText.trim() || analysis}>Send <ArrowRight size={16}/></button>
        </form>
      </div>
    ) : (
      <div className="card p-10 flex flex-col items-center justify-center border-dashed border-2 border-black/10 bg-white/40 hover:bg-white/60 transition-colors text-center min-h-[400px]">
        {file ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32}/></div>
            <h3 className="text-xl font-bold text-ink">{file.name}</h3>
            <p className="text-gray-500 mt-2">Document uploaded successfully.</p>
            {loading && <div className="mt-6"><LoadingAI /> <span className="text-sm text-gray-500 block mt-2">Analyzing clauses and policy compliance...</span></div>}
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-wine/10 text-wine rounded-full flex items-center justify-center mb-6"><UploadCloud size={32}/></div>
            <h2 className="text-2xl font-bold text-ink">Upload Document for Analysis</h2>
            <p className="text-gray-500 mt-3 max-w-md">Upload a contract, lease agreement, or legal notice. LEXORA will automatically review it for unfair clauses, risk signals, and compliance issues.</p>
            <label className="btn-primary mt-8 cursor-pointer shadow-lg">
              Select PDF or Word Document
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
            </label>
          </>
        )}
      </div>
    )}

    {error&&<div className="mt-4 rounded-2xl border border-red-500/20 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
    
    {analysis&&<div className="mt-8 space-y-6">
      <div className="card overflow-hidden border-t-4 border-t-wine shadow-xl">
        <div className="bg-gradient-to-r from-ink to-gray-900 p-8 text-white">
          <div className="text-xs uppercase tracking-[.25em] text-gold font-bold flex items-center gap-2"><CheckCircle2 size={14}/> Verified Analysis Complete</div>
          <div className="mt-3 text-3xl font-display font-semibold">{analysis.issueTitle}</div>
          <div className="mt-2 text-sm text-gray-400 font-medium">{analysis.category} · {analysis.jurisdiction}</div>
        </div>
        <div className="grid gap-6 p-8 md:grid-cols-2 bg-white/50">
          <section className="bg-white p-5 rounded-xl border border-black/5 shadow-sm"><h3 className="font-semibold text-lg flex items-center gap-2"><FileType size={18} className="text-wine"/> Plain-language summary</h3><p className="mt-3 leading-7 text-gray-600">{analysis.summary}</p></section>
          <section className="bg-white p-5 rounded-xl border border-black/5 shadow-sm"><h3 className="font-semibold text-lg">Key facts</h3><ul className="mt-3 space-y-2 text-sm text-gray-600">{(analysis.keyFacts||[]).map((x,i)=><li key={i} className="flex gap-2"><span className="text-wine">•</span> {x}</li>)}</ul></section>
          <section className="bg-white p-5 rounded-xl border border-black/5 shadow-sm"><h3 className="font-semibold text-lg">Information needed</h3><ul className="mt-3 space-y-2 text-sm text-gray-600">{(analysis.missingInformation||[]).map((x,i)=><li key={i} className="flex gap-2"><span className="text-wine">•</span> {x}</li>)}</ul></section>
          <section className="bg-white p-5 rounded-xl border border-black/5 shadow-sm"><h3 className="font-semibold text-lg">Possible legal areas</h3><ul className="mt-3 space-y-2 text-sm text-gray-600">{(analysis.possibleLegalAreas||[]).map((x,i)=><li key={i} className="flex gap-2"><span className="text-wine">•</span> {x}</li>)}</ul></section>
        </div>
      </div>
      <div className="flex justify-end"><button className="btn-primary shadow-xl px-8 py-4 text-base" onClick={saveCase}>Save to Case Dashboard <ArrowRight size={18}/></button></div>
    </div>}
  </div>;
}
