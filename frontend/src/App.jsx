import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { api } from "./services/api";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CasePage from "./pages/CasePage";
import Cases from "./pages/Cases";
import Simplifier from "./pages/Simplifier";
import DraftStudio from "./pages/DraftStudio";
import Layout from "./layouts/Layout";

function Protected({ user, children }) {
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("lexora_token")) return setBooting(false);
    api.me().then(({ user }) => setUser(user)).catch(() => localStorage.removeItem("lexora_token")).finally(() => setBooting(false));
  }, []);

  if (booting) return <div className="min-h-screen grid place-items-center bg-ivory"><div className="text-sm">Loading LEXORA...</div></div>;

  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/auth" element={user ? <Navigate to="/app" /> : <Auth onLogin={setUser} />} />
      <Route path="/app" element={<Protected user={user}><Layout user={user} onLogout={() => { localStorage.removeItem("lexora_token"); setUser(null); }}><Dashboard user={user} /></Layout></Protected>} />
      <Route path="/cases" element={<Protected user={user}><Layout user={user} onLogout={() => { localStorage.removeItem("lexora_token"); setUser(null); }}><Cases /></Layout></Protected>} />
      <Route path="/cases/:id" element={<Protected user={user}><Layout user={user} onLogout={() => { localStorage.removeItem("lexora_token"); setUser(null); }}><CasePage /></Layout></Protected>} />
      <Route path="/simplifier" element={<Protected user={user}><Layout user={user} onLogout={() => { localStorage.removeItem("lexora_token"); setUser(null); }}><Simplifier user={user} /></Layout></Protected>} />
      <Route path="/drafts" element={<Protected user={user}><Layout user={user} onLogout={() => { localStorage.removeItem("lexora_token"); setUser(null); }}><DraftStudio user={user} /></Layout></Protected>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
