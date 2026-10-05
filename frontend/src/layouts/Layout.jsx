import { NavLink, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, FileText, Home, LogOut, Menu, MessageSquareText, Scale, User, X } from "lucide-react";
import { useState } from "react";
import Logo from "../components/Logo";

export default function Layout({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const items = [
    ["/dashboard", "Dashboard", Home],
    ["/cases", "My Cases", BriefcaseBusiness],
    ["/ai", "AI Analyzer", MessageSquareText],
    ["/simplifier", "Legal Simplifier", Scale],
    ["/drafts", "Draft Studio", FileText],
    ["/documents", "Documents", FileText],
    ["/profile", "Profile", User]
  ];
  const nav = (to) => { setOpen(false); navigate(to); };
  return <div className="min-h-screen bg-transparent text-gray-900">
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/60 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between px-5 py-4"><Logo/><button aria-label="Toggle menu" className="text-ink" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
    </header>
    <div className="flex min-h-screen">
      <aside className={`fixed z-50 h-full w-72 border-r border-black/10 bg-white/40 backdrop-blur-xl p-6 text-ink transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center justify-between"><Logo /><button className="lg:hidden text-ink" onClick={()=>setOpen(false)}><X/></button></div>
        <div className="mb-6 rounded-2xl border border-black/10 bg-white/50 p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[.2em] text-wine/70 font-semibold">Jurisdiction</div>
          <div className="mt-2 font-medium">{user.jurisdiction}</div>
        </div>
        <nav className="space-y-2">{items.map(([to,label,Icon])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${isActive?"bg-wine/10 text-wine border border-wine/20":"text-gray-600 hover:bg-white/50 hover:text-ink border border-transparent"}`}><Icon size={18}/>{label}</NavLink>)}</nav>
        <div className="mt-auto absolute bottom-6 left-6 right-6">
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-white/50 hover:text-ink transition-colors border border-transparent hover:border-black/10"><LogOut size={18}/>Log out</button>
        </div>
      </aside>
      <main className="w-full lg:ml-0"><div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div></main>
    </div>
  </div>;
}
