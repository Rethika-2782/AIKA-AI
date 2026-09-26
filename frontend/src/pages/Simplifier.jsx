/**
 * @component Simplifier
 * @description Plain-language legal text explainer for Lexora AI.
 * Paste any legal clause, notice, or contract section and receive a structured,
 * accessible plain-English breakdown powered by Gemini AI.
 */
import { useState, useCallback, memo } from "react";
import { Sparkles } from "lucide-react";
import { api } from "../services/api";
import LoadingAI from "../components/LoadingAI";

/**
 * Simplifier page - legal text to plain-language converter.
 * @param {{ user: Object }} props
 */
function Simplifier({ user }) {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Submits legal text to AI for plain-language explanation */
  const run = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      setData(await api.explain({ text, jurisdiction: user.jurisdiction }));
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [text, user.jurisdiction]);

  const resultSections = data ? [
    ["Simple Explanation", data.simpleExplanation],
    ["Important Points", (data.importantPoints || []).map(x => "• " + x).join("\n")],
    ["Parties Mentioned", (data.partiesMentioned || []).join(", ") || "None identified"],
    ["Obligations", (data.obligations || []).map(x => "• " + x).join("\n")],
    ["Key Dates", (data.dates || []).map(x => "• " + x).join("\n") || "None identified"],
    ["Questions to Consider", (data.questionsToConsider || []).map(x => "• " + x).join("\n")]
  ] : [];

  return (
    <main aria-label="Legal Simplifier - plain language explainer">
      <div>
        <div className="text-sm text-black/45" aria-hidden="true">Plain-language mode</div>
        <h1 className="font-display text-4xl">Legal Simplifier</h1>
        <p className="mt-2 max-w-2xl text-black/55">
          Paste a clause, notice, contract section or official letter and ask LEXORA to explain it clearly.
        </p>
      </div>

      <div className="mt-7 card p-6">
        <label htmlFor="legal-text-input" className="block text-sm font-medium text-gray-700 mb-2">
          Legal Text to Simplify
        </label>
        <textarea
          id="legal-text-input"
          className="input min-h-52"
          placeholder="Paste legal or official text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          aria-label="Paste legal text here for AI simplification"
          aria-describedby="simplifier-hint"
        />
        <p id="simplifier-hint" className="mt-2 text-xs text-gray-400">
          Do not include sensitive personal data you would not want processed by the AI provider.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            className="btn-primary"
            disabled={loading || !text.trim()}
            onClick={run}
            aria-label={loading ? "Simplifying legal text, please wait" : "Explain this legal text in plain language"}
            aria-busy={loading}
          >
            <Sparkles size={16} aria-hidden="true"/> {loading ? "Simplifying..." : "Explain It Simply"}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" aria-live="assertive" className="mt-4 rounded-xl bg-wine/5 p-4 text-sm text-wine">{error}</div>
      )}

      {loading && (
        <div className="mt-5" aria-live="polite" aria-busy="true" aria-label="AI is processing your legal text">
          <LoadingAI/>
        </div>
      )}

      {data && (
        <section className="mt-5 grid gap-4 md:grid-cols-2" aria-label="Simplified legal explanation results">
          {resultSections.map(([title, body]) => (
            <article className="card p-6" key={title} aria-label={title}>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-black/60">{body}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default memo(Simplifier);
