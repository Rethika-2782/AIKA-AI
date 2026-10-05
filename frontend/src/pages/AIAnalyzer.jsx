import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeSituation, getAIHistory, getCases, createCase, updateCase } from "../services/api";
import LoadingAI from "../components/LoadingAI";

export default function AIAnalyzer({ user }) {
  const [situation, setSituation] = useState("");
  const [jurisdiction, setJurisdiction] = useState(user.jurisdiction || "India");
  const [title, setTitle] = useState("");
  const [caseId, setCaseId] = useState("");
  const [cases, setCases] = useState([]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCases().then(setCases).catch(() => {});
    getAIHistory({ type: "analysis" }).then(setHistory).catch(() => {});
  }, []);

  const analyze = async () => {
    setLoading(true); setError("");
    try {
      const data = await analyzeSituation({ situation, jurisdiction, caseId: caseId || undefined });
      setResult(data.analysis);
      getAIHistory({ type: "analysis" }).then(setHistory).catch(() => {});
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const saveCase = async () => {
    try {
      let id = caseId;
      if (!id) {
        const created = await createCase({ title: title || "New legal situation", description: situation, jurisdiction });
        id = created._id;
      }
      await updateCase(id, {
        aiAnalysis: result,
        risks: result.possibleRisks,
        actionPath: result.actionPath,
        questions: result.questionsForProfessional
      });
      navigate(`/cases/${id}`);
    } catch (e) { setError(e.message); }
  };

  return (
    <main aria-label="AI legal navigator">
      <div className="text-sm text-black/45">AI workspace</div>
      <h1 className="font-display text-4xl">AI Situation Analyzer</h1>
      <p className="mt-2 text-black/55 max-w-2xl">Describe your legal situation in plain language. AIKA will explain it, identify risks, and outline practical next steps. This is information, not legal advice.</p>

      <div className="mt-7 card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
          <input className="input" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link to an existing case (optional)</label>
          <select className="input" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
            <option value="">None</option>
            {cases.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your situation</label>
          <textarea className="input min-h-40" value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="e.g. My landlord has not returned my security deposit after I moved out." />
        </div>
        <button className="btn-primary" disabled={loading || situation.trim().length < 10} onClick={analyze}>
          <Sparkles size={16} /> {loading ? "Analyzing..." : "Analyze Situation"}
        </button>
      </div>

      {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-500/20 p-4 text-sm text-red-600">{error}</div>}
      {loading && <div className="mt-4"><LoadingAI /></div>}

      {result && (
        <section className="mt-8 card p-8 space-y-6" aria-label="AI analysis result">
          <h2 className="font-semibold text-xl">Case Intelligence</h2>
          <p className="text-gray-700 leading-7">{result.summary}</p>
          <div><h3 className="font-semibold">Key issues</h3><ul className="mt-2 space-y-1 text-sm text-gray-600">{(result.keyIssues || []).map((x, i) => <li key={i}>• {x}</li>)}</ul></div>
          <div><h3 className="font-semibold">Possible risks</h3><ul className="mt-2 space-y-1 text-sm text-red-900/70">{(result.possibleRisks || []).map((x, i) => <li key={i}>• {x}</li>)}</ul></div>
          <div><h3 className="font-semibold">ActionPath</h3><ol className="mt-2 space-y-2">{(result.actionPath || []).map((a, i) => <li key={i} className="text-sm text-gray-600"><b>{a.title}</b> — {a.description}</li>)}</ol></div>
          <div><h3 className="font-semibold">Questions for a professional</h3><ul className="mt-2 space-y-1 text-sm text-gray-600">{(result.questionsForProfessional || []).map((x, i) => <li key={i}>• {x}</li>)}</ul></div>
          <div><h3 className="font-semibold">Missing information</h3><ul className="mt-2 space-y-1 text-sm text-gray-600">{(result.missingInformation || []).map((x, i) => <li key={i}>• {x}</li>)}</ul></div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400">{result.disclaimer}</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {!caseId && <input className="input md:max-w-xs" placeholder="Case title (for saving)" value={title} onChange={(e) => setTitle(e.target.value)} />}
            <button className="btn-primary" onClick={saveCase}><Save size={16} /> Save to Case <ArrowRight size={16} /></button>
          </div>
        </section>
      )}

      <section className="mt-10 card p-6" aria-label="AI history">
        <h2 className="font-semibold text-lg">Recent Analysis History</h2>
        <div className="mt-4 space-y-3">
          {history.length === 0 && <p className="text-sm text-gray-500">No previous analyses.</p>}
          {history.slice(0, 5).map((h) => (
            <div key={h._id} className="rounded-xl border border-black/5 bg-white/50 p-4">
              <div className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString()}</div>
              <div className="text-sm text-gray-700 mt-1 line-clamp-2">{h.input}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
