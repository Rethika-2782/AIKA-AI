/**
 * @component DraftStudio
 * @description AI-powered document drafting workspace for Lexora AI.
 * Generates editable legal document drafts based on case context and user instructions.
 * Fully accessible with ARIA labels, form semantics, and keyboard support.
 */
import { useEffect, useState, useCallback, memo } from "react";
import { Copy, Download, FileText, Save, Sparkles } from "lucide-react";
import { api } from "../services/api";

const types = ["Formal Request", "Complaint Draft", "Response Draft", "Incident Summary", "Consultation Summary", "Custom Draft"];

/**
 * DraftStudio - document generation workspace.
 * @param {{ user: Object }} props
 */
function DraftStudio({ user }) {
  const [cases, setCases] = useState([]);
  const [caseId, setCaseId] = useState("");
  const [type, setType] = useState(types[0]);
  const [instructions, setInstructions] = useState("");
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => { api.listCases().then(setCases).catch(() => {}) }, []);

  const selected = cases.find(c => c._id === caseId);

  /** Generates a document draft using AI based on case and instructions */
  const generate = useCallback(async () => {
    setLoading(true);
    setSaved("");
    try {
      const result = await api.generateDocument({ type, caseInfo: selected || { jurisdiction: user.jurisdiction }, instructions });
      setDraft(result);
    } catch(e) {
      setSaved(e.message);
    } finally {
      setLoading(false);
    }
  }, [type, selected, user.jurisdiction, instructions]);

  /** Saves the current draft to persistent storage */
  const save = useCallback(async () => {
    if (!draft) return;
    await api.createDocument({ caseId: caseId || null, type, title: draft.title, content: draft.content });
    setSaved("Draft saved successfully.");
  }, [draft, caseId, type]);

  /** Downloads the current draft as a text file */
  const download = useCallback(() => {
    if (!draft) return;
    const blob = new Blob([draft.content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${draft.title.replaceAll(" ", "_")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [draft]);

  /** Copies draft content to clipboard */
  const copyToClipboard = useCallback(() => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.content);
  }, [draft]);

  return (
    <main aria-label="Draft Studio - Document generation workspace">
      <div>
        <div className="text-sm text-black/45" aria-hidden="true">Document workspace</div>
        <h1 className="font-display text-4xl">Draft Studio</h1>
        <p className="mt-2 text-black/55">Generate an editable informational draft from your case.</p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <section className="card p-6 space-y-4" aria-label="Document configuration">
          <div>
            <label htmlFor="case-select" className="block text-sm font-medium text-gray-700 mb-1">Select Case (optional)</label>
            <select
              id="case-select"
              className="input"
              value={caseId}
              onChange={e => setCaseId(e.target.value)}
              aria-label="Select a saved case to link to this document"
            >
              <option value="">No case selected</option>
              {cases.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              id="doc-type"
              className="input"
              value={type}
              onChange={e => setType(e.target.value)}
              aria-label="Select the type of document to generate"
            >
              {types.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="doc-instructions" className="block text-sm font-medium text-gray-700 mb-1">Additional Instructions</label>
            <textarea
              id="doc-instructions"
              className="input min-h-40"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Additional instructions or facts. Do not add sensitive information you do not want sent to the AI provider."
              aria-label="Additional instructions for document generation"
            />
          </div>

          {!draft && (
            <button
              className="btn-primary w-full"
              disabled={loading}
              onClick={generate}
              aria-label={loading ? "Generating document draft, please wait" : "Generate document draft with AI"}
              aria-busy={loading}
            >
              <Sparkles size={15} aria-hidden="true"/> {loading ? "Generating..." : "Generate Draft"}
            </button>
          )}
        </section>

        <section className="card min-h-[500px] p-6" aria-label="Document editor">
          {draft ? (
            <>
              <div>
                <label htmlFor="draft-title" className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                <input
                  id="draft-title"
                  className="input text-xl font-semibold"
                  value={draft.title}
                  onChange={e => setDraft({...draft, title: e.target.value})}
                  aria-label="Edit document title"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="draft-content" className="block text-sm font-medium text-gray-700 mb-1">Document Content</label>
                <textarea
                  id="draft-content"
                  className="input mt-1 min-h-[330px] resize-y whitespace-pre-wrap"
                  value={draft.content}
                  onChange={e => setDraft({...draft, content: e.target.value})}
                  aria-label="Edit document content"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary" onClick={save} aria-label="Save this document draft"><Save size={15} aria-hidden="true"/> Save</button>
                <button className="btn-secondary" onClick={copyToClipboard} aria-label="Copy document content to clipboard"><Copy size={15} aria-hidden="true"/> Copy</button>
                <button className="btn-secondary" onClick={download} aria-label="Download document as text file"><Download size={15} aria-hidden="true"/> Download</button>
                <button className="btn-secondary" onClick={() => setDraft(null)} aria-label="Regenerate document with new settings"><Sparkles size={15} aria-hidden="true"/> Regenerate</button>
              </div>
              <p className="mt-4 text-xs text-black/45" role="note">{draft.disclaimer}</p>
            </>
          ) : (
            <div className="grid h-full min-h-[460px] place-items-center text-center text-black/40">
              <div>
                <FileText className="mx-auto" size={35} aria-hidden="true"/>
                <p className="mt-3">Your generated draft will appear here.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {saved && (
        <div className="mt-4 rounded-xl border border-black/10 bg-white p-3 text-sm" role="status" aria-live="polite">{saved}</div>
      )}
    </main>
  );
}

export default memo(DraftStudio);
