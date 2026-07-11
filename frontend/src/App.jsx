import { useState } from "react";
import "./App.css";

const initialActivity = [
  { title: "Welcome to TruthLens AI", meta: "Your verification workspace is ready", status: "Ready" },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [apiError, setApiError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError("Enter your email address and password to continue.");
      return;
    }
    setLoginError("");
    setIsAuthenticated(true);
  };

  const predictNews = async () => {
    if (!text.trim()) {
      setApiError("Paste a news article before starting an analysis.");
      return;
    }

    setLoading(true);
    setResult(null);
    setApiError("");

    try {
      const response = await fetch("http://localhost:7860/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Prediction request failed");
      const data = await response.json();
      setResult(data);
      setHistory((previous) => [
        {
          text: text.length > 60 ? `${text.slice(0, 60)}...` : text,
          label: data.label,
          confidence: data.confidence,
        },
        ...previous.slice(0, 4),
      ]);
    } catch {
      setApiError("We could not reach the analysis service. Start the Flask backend and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="login-page">
        <section className="login-intro">
          <div className="brand"><span className="brand-mark">◈</span> TruthLens AI</div>
          <div className="intro-copy">
            <p className="eyebrow">TRUSTED INTELLIGENCE</p>
            <h1>See through the noise.</h1>
            <p>Verify news content with a focused workspace built for faster, more confident decisions.</p>
          </div>
          <div className="trust-points">
            <span>◉ AI-assisted analysis</span>
            <span>◉ Clear confidence signals</span>
            <span>◉ Private workspace</span>
          </div>
        </section>

        <section className="login-panel">
          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <p className="eyebrow">WELCOME BACK</p>
              <h2>Sign in to your workspace</h2>
              <p className="muted">Use any email and password to access this demo.</p>
            </div>
            <label>
              Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" />
            </label>
            {loginError && <p className="form-error">{loginError}</p>}
            <button className="primary-button" type="submit">Sign in <span>→</span></button>
            <p className="login-note">Authentication is currently a front-end demo. Connect an auth API before production use.</p>
          </form>
        </section>
      </main>
    );
  }

  const displayName = email.split("@")[0] || "Analyst";
  const latestIsFake = result?.label?.includes("Fake");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">◈</span> TruthLens <small>AI</small></div>
        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><span>▦</span> Overview</a>
          <a className="nav-item" href="#analyzer"><span>⌕</span> Analyze news</a>
          <a className="nav-item" href="#history"><span>◷</span> Recent checks</a>
        </nav>
        <div className="sidebar-footer">
          <div className="security-card"><span>✦</span><div><strong>Analysis protected</strong><p>Your workspace is secure.</p></div></div>
          <button className="sign-out" onClick={() => setIsAuthenticated(false)}>Sign out <span>↗</span></button>
        </div>
      </aside>

      <main className="dashboard" id="overview">
        <header className="dashboard-header">
          <div><p className="eyebrow">INTELLIGENCE WORKSPACE</p><h1>Good morning, {displayName}.</h1><p className="muted">Here is your verification activity at a glance.</p></div>
          <div className="profile"><span className="avatar">{displayName.slice(0, 1).toUpperCase()}</span><div><strong>{displayName}</strong><p>Analyst</p></div></div>
        </header>

        <section className="stat-grid" aria-label="Analysis statistics">
          <article className="stat-card"><span className="stat-icon blue">⌕</span><p>Checks completed</p><strong>{history.length}</strong><small>In this session</small></article>
          <article className="stat-card"><span className="stat-icon green">✓</span><p>Reliable signals</p><strong>{history.filter((item) => item.label.includes("Real")).length}</strong><small>Classified as real</small></article>
          <article className="stat-card"><span className="stat-icon red">!</span><p>Flagged content</p><strong>{history.filter((item) => item.label.includes("Fake")).length}</strong><small>Needs a closer look</small></article>
        </section>

        <section className="workspace-grid">
          <article className="analyzer-card" id="analyzer">
            <div className="section-heading"><div><p className="eyebrow">NEW ANALYSIS</p><h2>Verify a news article</h2></div><span className="live-pill">● System online</span></div>
            <p className="muted">Paste the headline or full article text. TruthLens will assess its likely credibility.</p>
            <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste news content here..." aria-label="News content" />
            <div className="analyzer-footer"><span>{text.trim().split(/\s+/).filter(Boolean).length} words</span><button className="primary-button analyze-button" onClick={predictNews} disabled={loading}>{loading ? "Analyzing..." : "Analyze content →"}</button></div>
            {apiError && <p className="form-error api-error">{apiError}</p>}
            {result && <div className={`result-card ${latestIsFake ? "fake-result" : "real-result"}`}><div><p className="eyebrow">ANALYSIS COMPLETE</p><h3>{result.label}</h3><p>{result.reason?.join(" · ")}</p></div><div className="confidence"><strong>{result.confidence}%</strong><span>confidence</span></div></div>}
          </article>

          <article className="activity-card" id="history">
            <div className="section-heading"><div><p className="eyebrow">SESSION ACTIVITY</p><h2>Recent checks</h2></div></div>
            <div className="activity-list">
              {(history.length ? history : initialActivity).map((item, index) => <div className="activity-row" key={`${item.title || item.text}-${index}`}><span className={`activity-dot ${item.label?.includes("Fake") ? "danger" : "success"}`}>{item.label?.includes("Fake") ? "!" : "✓"}</span><div><strong>{item.title || item.text}</strong><p>{item.meta || `${item.label} · ${item.confidence}% confidence`}</p></div></div>)}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
