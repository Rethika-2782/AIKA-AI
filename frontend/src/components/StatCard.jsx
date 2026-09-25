export default function StatCard({ label, value, icon: Icon }) {
  return <div className="card p-5">
    <div className="flex items-center justify-between">
      <span className="text-sm text-black/55">{label}</span>
      <span className="rounded-xl bg-ivory p-2"><Icon size={18}/></span>
    </div>
    <div className="mt-4 text-3xl font-semibold">{value}</div>
  </div>;
}
