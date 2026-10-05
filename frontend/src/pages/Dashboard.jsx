import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, FileText, Sparkles, FolderCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats().then(setData).catch((e) => setError(e.message));
  }, []);

  const stats = data?.stats || { totalCases: 0, activeCases: 0, documents: 0, evidence: 0, interactions: 0 };

  return (
    <main aria-label="Dashboard">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-gray-500 font-medium">Good to see you, {user.name.split(" ")[0]}</div>
          <h1 className="mt-1 font-display text-4xl text-ink font-bold">Your legal workspace</h1>
        </div>
        <Link to="/ai" className="btn-primary">New AI Analysis <ArrowRight size={16} /></Link>
      </div>

      {error && <div role="alert" className="mt-4 rounded-2xl border border-red-500/20 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Cases" value={stats.totalCases} icon={BriefcaseBusiness} />
        <StatCard label="Active Cases" value={stats.activeCases} icon={Activity} />
        <StatCard label="Documents" value={stats.documents} icon={FileText} />
        <StatCard label="Evidence Items" value={stats.evidence} icon={FolderCheck} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-1">
        <StatCard label="AI Interactions" value={stats.interactions} icon={Sparkles} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-label="Recent cases">
          <h2 className="font-semibold text-lg">Recent Cases</h2>
          <div className="mt-4 space-y-3">
            {(data?.recentCases || []).length === 0 && <p className="text-sm text-gray-500">No cases yet. Create your first case analysis.</p>}
            {(data?.recentCases || []).map((c) => (
              <Link key={c._id} to={`/cases/${c._id}`} className="block rounded-xl border border-black/5 bg-white/50 p-4 hover:bg-white transition-colors">
                <div className="font-medium text-ink">{c.title}</div>
                <div className="text-xs text-gray-500 mt-1">{c.category} · {c.jurisdiction} · {new Date(c.updatedAt).toLocaleDateString()}</div>
              </Link>
            ))}
          </div>
        </section>
        <section className="card p-6" aria-label="Recent AI activity">
          <h2 className="font-semibold text-lg">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {(data?.recentActivity || []).length === 0 && <p className="text-sm text-gray-500">No AI activity yet.</p>}
            {(data?.recentActivity || []).map((a) => (
              <div key={a._id} className="rounded-xl border border-black/5 bg-white/50 p-4">
                <div className="text-sm font-medium text-ink capitalize">{a.type}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{String(a.input).slice(0, 120)}</div>
                <div className="text-[11px] text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
