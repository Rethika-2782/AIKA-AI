const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("lexora_token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed.");
  return data;
}

export const api = {
  register: body => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: body => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  analyze: body => request("/ai/analyze", { method: "POST", body: JSON.stringify(body) }),
  explain: body => request("/ai/explain", { method: "POST", body: JSON.stringify(body) }),
  generateDocument: body => request("/ai/generate-document", { method: "POST", body: JSON.stringify(body) }),
  listCases: () => request("/cases"),
  getCase: id => request(`/cases/${id}`),
  createCase: body => request("/cases", { method: "POST", body: JSON.stringify(body) }),
  updateCase: (id, body) => request(`/cases/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCase: id => request(`/cases/${id}`, { method: "DELETE" }),
  listDocuments: () => request("/documents"),
  createDocument: body => request("/documents", { method: "POST", body: JSON.stringify(body) }),
  deleteDocument: id => request(`/documents/${id}`, { method: "DELETE" })
};
