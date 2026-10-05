import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getCases, deleteCase, createCase } from "../services/api";

const categories = ["Housing", "Employment", "Family", "Consumer", "Civil", "General"];

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", jurisdiction: "India", category: "General" });
  const [error, setError] = useState("");

  const load = useCallback(() => {
    getCases({ search: search || undefined, status: status || undefined }).then(setCases).catch((e) => setError(e.message));
  }, [search, status]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!confirm("Delete this case? This action cannot be undone.")) return;
    try { await deleteCase(id); setCases((prev) => prev.filter((x) => x._id !== id)); } catch (e) { setError(e.message); }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await createCase(form);
      setShowForm(false);
      setForm({ title: "", description: "", jurisdiction: "India", category: "General" });
      load();
    } catch (e) { setError(e.message); }
  };

  return (
    <main aria-label="My Cases workspace">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-black/45">Workspace</div>
          <h1 className="font-display text-4xl">My Cases</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> New Case</button>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input className="input" placeholder="Search cases..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search cases" />
        <select className="input md:max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="active">active</option>
          <option value="pending">pending</option>
          <option value="closed">closed</option>
        </select>
      </div>

      {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-500/20 p-3 text-sm text-red-600">{error}</div>}

      {showForm && (
        <form onSubmit={create} className="mt-6 card p-6 space-y-4" aria-label="Create a new case">
          <input className="input" placeholder="Case title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input min-h-24" placeholder="Describe the situation" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Jurisdiction" value={form.jurisdiction} onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button className="btn-primary" type="submit">Create Case</button>
        </form>
      )}

      <div className="mt-7 grid gap-4">
        {cases.length === 0 ? (
          <div className="card p-10 text-center text-black/50">No saved cases yet. Create one above or analyze a situation.</div>
        ) : (
          cases.map((c) => (
            <article key={c._id} className="card p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-black/40">{c.category} · {c.jurisdiction} · {c.status}</div>
                  <h2 className="mt-2 text-xl font-semibold">{c.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-black/55">{c.description}</p>
                  <div className="mt-3 text-xs text-black/40">Updated {new Date(c.updatedAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Link className="btn-secondary" to={`/cases/${c._id}`}>Open <ArrowRight size={15} /></Link>
                  <button className="btn-secondary" onClick={() => remove(c._id)} aria-label={`Delete ${c.title}`}><Trash2 size={15} /></button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
