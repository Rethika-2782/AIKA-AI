import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <main aria-label="Profile">
      <h1 className="font-display text-4xl">Profile</h1>
      <div className="mt-7 card p-8 max-w-2xl space-y-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400">Name</div>
          <div className="mt-1 text-lg font-medium">{user.name}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400">Email</div>
          <div className="mt-1 text-lg font-medium">{user.email}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400">Jurisdiction</div>
          <div className="mt-1 text-lg font-medium">{user.jurisdiction}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400">Member since</div>
          <div className="mt-1 text-lg font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
        <button className="btn-secondary" onClick={logout}>Log out</button>
      </div>
    </main>
  );
}
