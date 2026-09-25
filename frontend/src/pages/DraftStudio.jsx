import { useEffect, useState } from "react";
import { Copy, Download, FileText, Save, Sparkles } from "lucide-react";
import { api } from "../services/api";

const types=["Formal Request","Complaint Draft","Response Draft","Incident Summary","Consultation Summary","Custom Draft"];

export default function DraftStudio({user}){
  const [cases,setCases]=useState([]);const [caseId,setCaseId]=useState("");const [type,setType]=useState(types[0]);const [instructions,setInstructions]=useState("");const [draft,setDraft]=useState(null);const [loading,setLoading]=useState(false);const [saved,setSaved]=useState("");
  useEffect(()=>{api.listCases().then(setCases).catch(()=>{})},[]);
  const selected=cases.find(c=>c._id===caseId);
  async function generate(){setLoading(true);setSaved("");try{const result=await api.generateDocument({type,caseInfo:selected||{jurisdiction:user.jurisdiction},instructions});setDraft(result)}catch(e){setSaved(e.message)}finally{setLoading(false)}}
  async function save(){if(!draft)return;await api.createDocument({caseId:caseId||null,type,title:draft.title,content:draft.content});setSaved("Draft saved to MongoDB.");}
  function download(){if(!draft)return;const blob=new Blob([draft.content],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${draft.title.replaceAll(" ","_")}.txt`;a.click();URL.revokeObjectURL(a.href)}
  return <div><div className="text-sm text-black/45">Document workspace</div><h1 className="font-display text-4xl">Draft Studio</h1><p className="mt-2 text-black/55">Generate an editable informational draft from your case.</p>
    <div className="mt-7 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="card p-6 space-y-4"><select className="input" value={caseId} onChange={e=>setCaseId(e.target.value)}><option value="">No case selected</option>{cases.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}</select><select className="input" value={type} onChange={e=>setType(e.target.value)}>{types.map(x=><option key={x}>{x}</option>)}</select><textarea className="input min-h-40" value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Additional instructions or facts. Do not add sensitive information you do not want sent to the AI provider."/></div>
      <div className="card min-h-[500px] p-6">{draft?<><input className="input text-xl font-semibold" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/><textarea className="input mt-4 min-h-[330px] resize-y whitespace-pre-wrap" value={draft.content} onChange={e=>setDraft({...draft,content:e.target.value})}/><div className="mt-4 flex flex-wrap gap-2"><button className="btn-primary" onClick={save}><Save size={15}/>Save</button><button className="btn-secondary" onClick={()=>navigator.clipboard.writeText(draft.content)}><Copy size={15}/>Copy</button><button className="btn-secondary" onClick={download}><Download size={15}/>Download</button></div><p className="mt-4 text-xs text-black/45">{draft.disclaimer}</p></>:<div className="grid h-full min-h-[460px] place-items-center text-center text-black/40"><div><FileText className="mx-auto" size={35}/><p className="mt-3">Your generated draft will appear here.</p><button className="btn-primary mt-5" disabled={loading} onClick={generate}><Sparkles size={15}/>{loading?"Generating...":"Generate Draft"}</button></div></div>}</div></div>
    {saved&&<div className="mt-4 rounded-xl border border-black/10 bg-white p-3 text-sm">{saved}</div>}
  </div>;
}
