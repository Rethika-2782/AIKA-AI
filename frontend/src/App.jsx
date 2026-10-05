import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CasePage from "./pages/CasePage";
import Cases from "./pages/Cases";
import Simplifier from "./pages/Simplifier";
import DraftStudio from "./pages/DraftStudio";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";
import AIAnalyzer from "./pages/AIAnalyzer";
import Layout from "./layouts/Layout";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, booting, logout } = useAuth();

  if (booting) return <div className="min-h-screen grid place-items-center bg-ivory"><div className="text-sm">Loading AIKA...</div></div>;

  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth mode="login" />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Auth mode="register" />} />
      <Route path="/dashboard" element={<Protected><Layout user={user} onLogout={logout}><Dashboard user={user} /></Layout></Protected>} />
      <Route path="/cases" element={<Protected><Layout user={user} onLogout={logout}><Cases /></Layout></Protected>} />
      <Route path="/cases/:id" element={<Protected><Layout user={user} onLogout={logout}><CasePage /></Layout></Protected>} />
      <Route path="/documents" element={<Protected><Layout user={user} onLogout={logout}><Documents /></Layout></Protected>} />
      <Route path="/ai" element={<Protected><Layout user={user} onLogout={logout}><AIAnalyzer user={user} /></Layout></Protected>} />
      <Route path="/simplifier" element={<Protected><Layout user={user} onLogout={logout}><Simplifier user={user} /></Layout></Protected>} />
      <Route path="/drafts" element={<Protected><Layout user={user} onLogout={logout}><DraftStudio user={user} /></Layout></Protected>} />
      <Route path="/profile" element={<Protected><Layout user={user} onLogout={logout}><Profile user={user} /></Layout></Protected>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
