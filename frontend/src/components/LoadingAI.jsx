export default function LoadingAI() {
  return <div className="card p-8">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-wine"/>
      <div>
        <div className="font-semibold">Understanding your situation...</div>
        <div className="mt-1 text-sm text-black/55">Identifying key information and organizing your case.</div>
      </div>
    </div>
  </div>;
}
