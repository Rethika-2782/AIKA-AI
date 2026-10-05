import { useEffect, useState } from "react";
import { FileText, Download, Trash2, Edit3, Save, X } from "lucide-react";
import { getDocuments, updateDocument, deleteDocument } from "../services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getDocuments().then(setDocuments).catch((e) => setError(e.message));
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this document?")) return;
    try { await deleteDocument(id); setDocuments((p) => p.filter((d) => d._id !== id)); } catch (e) { setError(e.message); }
  };

  const saveEdit = async () => {
    try {
      const updated = await updateDocument(editing._id, { title: editing.title, content: editing.content });
      setDocuments((p) => p.map((d) => (d._id === updated._id ? updated : d)));
      setEditing(null);
    } catch (e) { setError(e.message); }
  };

  const download = (d) => {
    const blob = new Blob([d.content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${d.title.replaceAll(" ", "_")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main aria-label="Documents">
      <h1 className="font-display text-4xl">Documents</h1>
      <p className="mt-2 text-black/55">All document drafts saved to your account.</p>
      {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-500/20 p-3 text-sm text-red-600">{error}</div>}

      <div className="mt-7 grid gap-4">
        {documents.length === 0 && <div className="card p-10 text-center text-black/50">No documents yet. Generate one in Draft Studio.</div>}
        {documents.map((d) => (
          <article key={d._id} className="card p-6">
            {editing?._id === d._id ? (
              <div className="space-y-3">
                <input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                <textarea className="input min-h-52" value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={saveEdit}><Save size={15} /> Save</button>
                  <button className="btn-secondary" onClick={() => setEditing(null)}><X size={15} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-black/40">{d.type} · Updated {new Date(d.updatedAt).toLocaleString()}</div>
                  <h2 className="mt-1 text-xl font-semibold">{d.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-black/55 whitespace-pre-line">{d.content}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => setEditing(d)} aria-label="Edit"><Edit3 size={15} /></button>
                  <button className="btn-secondary" onClick={() => download(d)} aria-label="Download"><Download size={15} /></button>
                  <button className="btn-secondary" onClick={() => remove(d._id)} aria-label="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
