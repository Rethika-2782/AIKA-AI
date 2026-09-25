import { useEffect, useState } from "react";
import { Check, Plus, Save, Download, FileCheck2, ShieldCheck, UploadCloud } from "lucide-react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

export default function CasePage(){
  const {id}=useParams(); const [item,setItem]=useState(null); const [custom,setCustom]=useState("");
  useEffect(()=>{api.getCase(id).then(setItem).catch(()=>{})},[id]);
  if(!item)return <div className="py-20 text-center text-gray-500">Loading case intelligence...</div>;

  function toggle(i){const evidence=item.evidence.map((x,idx)=>idx===i?{...x,checked:!x.checked}:x);setItem({...item,evidence})}
  function add(){if(!custom.trim())return;setItem({...item,evidence:[...item.evidence,{title:custom.trim(),checked:false,custom:true}]});setCustom("")}
  async function save(){const updated=await api.updateCase(id,{evidence:item.evidence});setItem(updated)}
  const pct=item.evidence.length?Math.round(item.evidence.filter(x=>x.checked).length/item.evidence.length*100):0;
  const analysis=item.analysis||{};
  
  return <div className="max-w-6xl mx-auto print:bg-white print:text-black">
    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-[.25em] text-wine font-semibold flex items-center gap-2">
          <ShieldCheck size={14}/> Verified Case Intelligence
        </div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-ink font-bold">{item.title}</h1>
        <p className="mt-2 text-gray-500 font-medium">{item.category} · {item.jurisdiction}</p>
      </div>
      <div className="flex gap-3 print:hidden">
        <button className="btn-secondary" onClick={()=>window.print()}><Download size={16}/> Export PDF</button>
        <button className="btn-primary bg-gradient-to-r from-wine to-pink-700 border-0"><UploadCloud size={16}/> Upload Documents</button>
      </div>
    </div>
    
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      <div className="space-y-6">
        <section className="card p-8 border-t-4 border-t-wine">
          <h2 className="font-semibold text-xl flex items-center gap-2"><FileCheck2 className="text-wine"/> Executive Summary</h2>
          <p className="mt-4 leading-8 text-gray-700 text-lg">{analysis.summary||item.description}</p>
          
          <div className="mt-8 border-t border-black/5 pt-6">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">Verified Key Facts</h3>
            <ul className="space-y-3">
              {(analysis.keyFacts||[]).map((fact,i)=>
                <li key={i} className="flex gap-3 items-start p-3 bg-white/50 rounded-xl border border-black/5">
                  <div className="bg-green-100 text-green-700 rounded-full p-1 mt-0.5"><Check size={12}/></div>
                  <div>
                    <span className="text-gray-800 font-medium">{fact}</span>
                    <div className="text-[10px] text-green-600 font-semibold uppercase tracking-widest mt-1">✓ AI Verified Citation</div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="card p-8">
          <h2 className="font-semibold text-xl mb-6">ActionPath Timeline</h2>
          <div className="relative border-l-2 border-black/10 ml-4 space-y-8 pb-4">
            {(item.actionPlan||analysis.actionPlan||[]).map((a,i)=><div key={i} className="relative pl-8">
              <div className="absolute -left-[11px] top-1 grid h-5 w-5 place-items-center rounded-full bg-wine text-[10px] text-white shadow-[0_0_10px_rgba(107,38,54,0.4)]"></div>
              <div className="bg-white/60 p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition">
                <div className="font-semibold text-ink text-lg">{a.title}</div>
                <div className="mt-2 text-sm leading-6 text-gray-600">{a.description}</div>
              </div>
            </div>)}
          </div>
        </section>
        
        <div className="grid md:grid-cols-2 gap-6">
          <section className="card p-6 bg-white/40">
            <h2 className="font-semibold">Questions for Counsel</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">{(analysis.questionsForProfessional||[]).map((q,i)=><li key={i} className="flex gap-2 items-start"><span className="text-wine font-bold">Q.</span> {q}</li>)}</ul>
          </section>
          <section className="card p-6 bg-red-50/50 border-red-100">
            <h2 className="font-semibold text-red-800">Risk Signals</h2>
            <ul className="mt-4 space-y-3 text-sm text-red-900/80">{[...(analysis.uncertainties||[]),...(analysis.riskSignals||[])].map((x,i)=><li key={i} className="flex gap-2 items-start"><span className="text-red-600">•</span> {x}</li>)}</ul>
          </section>
        </div>
      </div>

      <aside className="space-y-6 print:hidden">
        <section className="card p-7 sticky top-24">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg">Evidence Readiness</h2>
            <span className="font-bold text-wine text-xl">{pct}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/5 shadow-inner">
            <div className="h-full bg-gradient-to-r from-wine to-pink-500 transition-all duration-700 ease-out" style={{width:`${pct}%`}}/>
          </div>
          
          <div className="mt-6 space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {item.evidence.map((e,i)=><button key={i} onClick={()=>toggle(i)} className="flex w-full items-start gap-3 rounded-xl border border-black/5 bg-white/50 p-3.5 text-left text-sm hover:bg-white transition-colors shadow-sm">
              <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition-colors ${e.checked?"border-wine bg-wine text-white":"border-gray-300 bg-white"}`}>{e.checked&&<Check size={12} strokeWidth={3}/>}</span>
              <span className={`font-medium ${e.checked?"line-through text-gray-400":"text-gray-800"}`}>{e.title}</span>
            </button>)}
          </div>
          
          <div className="mt-4 pt-4 border-t border-black/5 flex gap-2">
            <input className="input py-2 text-sm bg-white" value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Add new evidence"/>
            <button className="btn-secondary px-3 py-2" onClick={add}><Plus size={16}/></button>
          </div>
          <button onClick={save} className="btn-primary mt-4 w-full shadow-lg"><Save size={16}/> Save Evidence Portfolio</button>
        </section>
        
        <section className="card p-6 bg-transparent border-0 shadow-none text-center">
          <p className="text-[11px] leading-5 text-gray-400 uppercase tracking-widest">{analysis.disclaimer||"LEXORA AI provides general legal information. Not a substitute for a qualified professional."}</p>
        </section>
      </aside>
    </div>
  </div>;
}
