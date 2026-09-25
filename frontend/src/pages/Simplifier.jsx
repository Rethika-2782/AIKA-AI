import { useState } from "react";
import { Sparkles } from "lucide-react";
import { api } from "../services/api";
import LoadingAI from "../components/LoadingAI";

export default function Simplifier({user}){
  const [text,setText]=useState("");const [data,setData]=useState(null);const [loading,setLoading]=useState(false);const [error,setError]=useState("");
  async function run(){if(!text.trim())return;setLoading(true);setError("");try{setData(await api.explain({text,jurisdiction:user.jurisdiction}))}catch(e){setError(e.message)}finally{setLoading(false)}}
  return <div><div><div className="text-sm text-black/45">Plain-language mode</div><h1 className="font-display text-4xl">Legal Simplifier</h1><p className="mt-2 max-w-2xl text-black/55">Paste a clause, notice, contract section or official letter and ask LEXORA to explain it clearly.</p></div>
    <div className="mt-7 card p-6"><textarea className="input min-h-52" placeholder="Paste legal or official text here..." value={text} onChange={e=>setText(e.target.value)}/><div className="mt-4 flex justify-end"><button className="btn-primary" disabled={loading} onClick={run}><Sparkles size={16}/>{loading?"Simplifying...":"Explain It Simply"}</button></div></div>
    {error&&<div className="mt-4 rounded-xl bg-wine/5 p-4 text-sm text-wine">{error}</div>}{loading&&<div className="mt-5"><LoadingAI/></div>}
    {data&&<div className="mt-5 grid gap-4 md:grid-cols-2">{[["Simple Explanation",data.simpleExplanation],["Important Points",(data.importantPoints||[]).map(x=>"• "+x).join("\n")],["Parties Mentioned",(data.partiesMentioned||[]).join(", ")||"None identified"],["Obligations",(data.obligations||[]).map(x=>"• "+x).join("\n")],["Dates",(data.dates||[]).map(x=>"• "+x).join("\n")||"None identified"],["Questions to Consider",(data.questionsToConsider||[]).map(x=>"• "+x).join("\n")]].map(([title,body])=><div className="card p-6" key={title}><h2 className="font-semibold">{title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-black/60">{body}</p></div>)}</div>}
  </div>;
}
