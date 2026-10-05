import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("AIKA_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const loginUser = (body) => http.post("/auth/login", body).then((r) => r.data);
export const registerUser = (body) => http.post("/auth/register", body).then((r) => r.data);
export const getCurrentUser = () => http.get("/auth/me").then((r) => r.data);

export const getCases = (params) => http.get("/cases", { params }).then((r) => r.data.cases);
export const createCase = (body) => http.post("/cases", body).then((r) => r.data.case);
export const getCase = (id) => http.get(`/cases/${id}`).then((r) => r.data.case);
export const updateCase = (id, body) => http.put(`/cases/${id}`, body).then((r) => r.data.case);
export const deleteCase = (id) => http.delete(`/cases/${id}`).then((r) => r.data);

export const getEvidence = (params) => http.get("/evidence", { params }).then((r) => r.data.evidence);
export const createEvidence = (body) => http.post("/evidence", body).then((r) => r.data.evidenceItem);
export const updateEvidence = (id, body) => http.put(`/evidence/${id}`, body).then((r) => r.data.evidenceItem);
export const deleteEvidence = (id) => http.delete(`/evidence/${id}`).then((r) => r.data);

export const getDocuments = (params) => http.get("/documents", { params }).then((r) => r.data.documents);
export const createDocument = (body) => http.post("/documents", body).then((r) => r.data.document);
export const updateDocument = (id, body) => http.put(`/documents/${id}`, body).then((r) => r.data.document);
export const deleteDocument = (id) => http.delete(`/documents/${id}`).then((r) => r.data);

export const analyzeSituation = (body) => http.post("/ai/analyze", body).then((r) => r.data);
export const explainText = (body) => http.post("/ai/explain", body).then((r) => r.data.explanation);
export const simplifyClause = (body) => http.post("/ai/simplify", body).then((r) => r.data.simplification);
export const generateDocument = (body) => http.post("/ai/generate-document", body).then((r) => r.data.document);
export const getAIHistory = (params) => http.get("/ai/history", { params }).then((r) => r.data.history);

export const getDashboardStats = () => http.get("/dashboard/stats").then((r) => r.data);

// Compatibility layer for older components
export const api = {
  login: loginUser,
  register: registerUser,
  me: () => getCurrentUser().then((d) => d),
  listCases: () => getCases(),
  getCase,
  createCase,
  updateCase,
  deleteCase,
  analyze: analyzeSituation,
  explain: (body) => http.post("/ai/explain", body).then((r) => r.data.explanation || r.data),
  simplify: (body) => http.post("/ai/simplify", body).then((r) => r.data.simplification || r.data),
  generateDocument,
  createDocument
};
