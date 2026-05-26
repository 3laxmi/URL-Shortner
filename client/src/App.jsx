import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    setError("");
    setShortUrl("");
    setCopied(false);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setShortUrl(data.shortUrl);
    } catch {
      setError("Could not connect to server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleShorten();
  };

  return (
    <div className="page">
      <div className="card">
        <div className="brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>Snip</span>
        </div>

        <h1>Shorten your URL</h1>
        <p className="subtitle">Paste a long link and get a clean, shareable short URL instantly.</p>

        <div className="input-row">
          <input
            type="text"
            placeholder="https://example.com/very/long/url..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className={error ? "input-error" : ""}
          />
          <button onClick={handleShorten} disabled={loading} className="btn-primary">
            {loading ? <span className="spinner" /> : "Shorten"}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="result">
            <span className="result-label">Your short URL</span>
            <div className="result-row">
              <a href={shortUrl} target="_blank" rel="noreferrer" className="result-link">
                {shortUrl}
              </a>
              <button onClick={handleCopy} className="btn-copy">
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
