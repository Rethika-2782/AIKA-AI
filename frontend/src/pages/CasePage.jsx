import { useEffect, useState, useCallback } from "react";
import { Check, Plus, Trash2, ShieldCheck, FileCheck2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import {
  getCase, updateCase, getEvidence, createEvidence, updateEvidence, deleteEvidence,
  getDocuments, getAIHistory
} from "../services/api";

const EVIDENCE_TYPES = ["Rental Agreement", "Payment Receipt", "Email Conversation", "Legal Notice", "Photograph", "Other"];

export default function CasePage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Other");

  const load = useCallback(() => {
    getCase(id).then(setItem).catch((e) => setError(e.message));
    getEvidence({ caseId: id }).then(setEvidence).catch(() => {});
    getDocuments({ caseId: id }).then(setDocuments).catch(() => {});
    getAIHistory({ caseId: id }).then(setHistory).catch(() => {});
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const cycleStatus = async (e) => {
    const next = e.status === "collected" ? "pending" : e.status === "pending" ? "collected" : "collected";
    try {
      const updated = await updateEvidence(e._id, { status: next });
      setEvidence((prev) => prev.map((x) => (x._id === e._id ? updated : x)));
    } catch (err) { setError(err.message); }
  };

  const addEvidence = async () => {
    if (!newName.trim()) return;
    try {
      const created = await createEvidence({ name: newName.trim(), type: newType, status: "pending", caseId: id });
      setEvidence((prev) => [created, ...prev]);
      setNewName("");
    } catch (err) { setError(err.message); }
  };

  const removeEvidence = async (eid) => {
    try { await deleteEvidence(eid); setEvidence((prev) => prev.filter((x) => x._id !== eid)); } catch (err) { setError(err.message); }
  };

  const setStatus = async (status) => {
    try { setItem(await updateCase(id, { status })); } catch (err) { setError(err.message); }
  };

  if (error && !item) return <div role="alert" className="py-20 text-center text-red-600">{error}</div>;
  if (!item) return <div className="py-20 text-center text-gray-500">Loading case intelligence...</div>;

  const pct = evidence.length ? Math.round((evidence.filter((x) => x.status === "collected").length / evidence.length) * 100) : 0;
  const analysis = item.aiAnalysis || {};

  return (
    <div className="max-w-6xl mx-auto" role="main">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.25em] text-wine font-semibold flex items-center gap-2"><ShieldCheck size={14} /> Case Intelligence</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-ink font-bold">{item.title}</h1>
          <p className="mt-2 text-gray-500 font-medium">{item.category} · {item.jurisdiction}</p>
        </div>
        <select className="input max-w-[180px]" value={item.status} onChange={(e) => setStatus(e.target.value)} aria-label="Case status">
          <option value="active">active</option>
          <option value="pending">pending</option>
          <option value="closed">closed</option>
        </select>
      </div>

      {error && <div role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-500/20 p-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <section className="card p-8 border-t-4 border-t-wine">
            <h2 className="font-semibold text-xl flex items-center gap-2"><FileCheck2 className="text-wine" /> Overview</h2>
            <p className="mt-4 leading-8 text-gray-700 text-lg">{analysis.summary || item.description}</p>
            {analysis.disclaimer && <p className="mt-4 text-[11px] uppercase tracking-widest text-gray-400">{analysis.disclaimer}</p>}
          </section>

          <section className="card p-8">
            <h2 className="font-semibold text-xl mb-6">ActionPath Timeline</h2>
            <ol className="relative border-l-2 border-black/10 ml-4 space-y-8 pb-4">
              {(item.actionPath || []).length === 0 && <li className="text-sm text-gray-500">No action steps yet. Run an AI analysis to generate them.</li>}
              {(item.actionPath || []).map((a, i) => (
                <li key={i} className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 grid h-5 w-5 place-items-center rounded-full bg-wine text-[10px] text-white" />
                  <div className="bg-white/60 p-5 rounded-2xl border border-black/5 shadow-sm">
                    <div className="font-semibold text-ink text-lg">{a.title}</div>
                    <div className="mt-2 text-sm leading-6 text-gray-600">{a.description}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="card p-6 bg-white/40">
              <h2 className="font-semibold">Questions for Counsel</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                {(item.questions || []).length === 0 && <li className="text-gray-500">None yet.</li>}
                {(item.questions || []).map((q, i) => <li key={i} className="flex gap-2 items-start"><span className="text-wine font-bold">Q.</span> {q}</li>)}
              </ul>
            </section>
            <section className="card p-6 bg-red-50/50 border-red-100">
              <h2 className="font-semibold text-red-800">Risk Signals</h2>
              <ul className="mt-4 space-y-3 text-sm text-red-900/80">
                {(item.risks || []).length === 0 && <li className="text-red-900/50">None identified yet.</li>}
                {(item.risks || []).map((x, i) => <li key={i}>• {x}</li>)}
              </ul>
            </section>
          </div>

          <section className="card p-6">
            <h2 className="font-semibold">Documents</h2>
            <div className="mt-4 space-y-2">
              {documents.length === 0 && <p className="text-sm text-gray-500">No documents linked to this case yet.</p>}
              {documents.map((d) => (
                <Link key={d._id} to="/documents" className="block rounded-xl border border-black/5 bg-white/50 p-3 text-sm hover:bg-white">
                  <b>{d.title}</b> <span className="text-gray-500">· {d.type}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold">AI History</h2>
            <div className="mt-4 space-y-2">
              {history.length === 0 && <p className="text-sm text-gray-500">No AI interactions recorded for this case.</p>}
              {history.map((h) => (
                <div key={h._id} className="rounded-xl border border-black/5 bg-white/50 p-3 text-sm">
                  <span className="capitalize font-medium">{h.type}</span> <span className="text-gray-400 text-xs">{new Date(h.createdAt).toLocaleString()}</span>
                  <div className="text-gray-600 line-clamp-1 mt-1">{h.input}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6" aria-label="Evidence management">
          <section className="card p-7 sticky top-24">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg">Evidence Readiness</h2>
              <span className="font-bold text-wine text-xl">{pct}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/5" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
              <div className="h-full bg-gradient-to-r from-wine to-pink-500 transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>

            <ul className="mt-6 space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {evidence.length === 0 && <li className="text-sm text-gray-500">No evidence items yet.</li>}
              {evidence.map((e) => (
                <li key={e._id} className="flex items-center gap-2 rounded-xl border border-black/5 bg-white/50 p-3 text-sm">
                  <button onClick={() => cycleStatus(e)} aria-label={`Toggle status of ${e.name}`} className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border ${e.status === "collected" ? "border-wine bg-wine text-white" : "border-gray-300 bg-white"}`}>
                    {e.status === "collected" && <Check size={12} strokeWidth={3} />}
                  </button>
                  <div className="flex-1">
                    <div className={`font-medium ${e.status === "collected" ? "line-through text-gray-400" : "text-gray-800"}`}>{e.name}</div>
                    <div className="text-[11px] text-gray-400">{e.type} · {e.status}</div>
                  </div>
                  <button onClick={() => removeEvidence(e._id)} aria-label={`Delete ${e.name}`} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-black/5 flex gap-2">
              <select className="input py-2 text-sm" value={newType} onChange={(e) => setNewType(e.target.value)} aria-label="Evidence type">
                {EVIDENCE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="mt-2 flex gap-2">
              <input className="input py-2 text-sm" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Add evidence" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEvidence())} />
              <button className="btn-secondary px-3 py-2" onClick={addEvidence} aria-label="Add evidence"><Plus size={16} /></button>
            </div>
          </section>

          <section className="card p-6 bg-transparent border-0 shadow-none text-center">
            <p className="text-[11px] leading-5 text-gray-400 uppercase tracking-widest">
              {analysis.disclaimer || "AIKA AI provides general legal information. Not a substitute for a qualified professional."}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
