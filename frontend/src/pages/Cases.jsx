import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Cases(){
  const [cases,setCases]=useState([]);
  useEffect(()=>{api.listCases().then(setCases).catch(()=>{})},[]);
  async function remove(id){if(!confirm("Delete this case?"))return;await api.deleteCase(id);setCases(cases.filter(x=>x._id!==id))}
  return <div><div className="flex items-end justify-between"><div><div className="text-sm text-black/45">Workspace</div><h1 className="font-display text-4xl">My Cases</h1></div></div>
    <div className="mt-7 grid gap-4">{cases.length===0?<div className="card p-10 text-center text-black/50">No saved cases yet. Start an analysis from the dashboard.</div>:cases.map(c=><div key={c._id} className="card p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><div className="text-xs uppercase tracking-wider text-black/40">{c.category} · {c.jurisdiction}</div><h2 className="mt-2 text-xl font-semibold">{c.title}</h2><p className="mt-2 line-clamp-2 text-sm text-black/55">{c.description}</p><div className="mt-3 text-xs text-black/40">Updated {new Date(c.updatedAt).toLocaleString()}</div></div><div className="flex gap-2"><Link className="btn-secondary" to={`/cases/${c._id}`}>Open <ArrowRight size={15}/></Link><button className="btn-secondary" onClick={()=>remove(c._id)}><Trash2 size={15}/></button></div></div></div>)}</div>
  </div>;
}
