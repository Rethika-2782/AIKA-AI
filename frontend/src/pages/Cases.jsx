/**
 * @component Cases
 * @description Displays all saved legal cases for the current user.
 * Includes delete confirmation, accessible list structure, and navigation.
 */
import { useEffect, useState, useCallback, memo } from "react";
import { ArrowRight, BriefcaseBusiness, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

/**
 * Cases page - workspace for browsing and managing saved cases.
 */
function Cases() {
  const [cases, setCases] = useState([]);

  useEffect(() => { api.listCases().then(setCases).catch(() => {}) }, []);

  const remove = useCallback(async (id) => {
    if (!confirm("Delete this case? This action cannot be undone.")) return;
    await api.deleteCase(id);
    setCases(prev => prev.filter(x => x._id !== id));
  }, []);

  return (
    <main aria-label="My Cases workspace">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-black/45" aria-hidden="true">Workspace</div>
          <h1 className="font-display text-4xl">My Cases</h1>
        </div>
      </div>

      <div className="mt-7 grid gap-4" role="list" aria-label="Saved legal cases">
        {cases.length === 0 ? (
          <div className="card p-10 text-center text-black/50" role="status" aria-live="polite">
            No saved cases yet. Start an analysis from the dashboard.
          </div>
        ) : (
          cases.map(c => (
            <article key={c._id} className="card p-6" role="listitem" aria-label={`Case: ${c.title}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-black/40">{c.category} · {c.jurisdiction}</div>
                  <h2 className="mt-2 text-xl font-semibold">{c.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-black/55">{c.description}</p>
                  <div className="mt-3 text-xs text-black/40">
                    <time dateTime={c.updatedAt}>Updated {new Date(c.updatedAt).toLocaleString()}</time>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    className="btn-secondary"
                    to={`/cases/${c._id}`}
                    aria-label={`Open case: ${c.title}`}
                  >
                    Open <ArrowRight size={15} aria-hidden="true"/>
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={() => remove(c._id)}
                    aria-label={`Delete case: ${c.title}`}
                  >
                    <Trash2 size={15} aria-hidden="true"/>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default memo(Cases);
