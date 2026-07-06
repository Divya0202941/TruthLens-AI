import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const predictNews = async () => {
    if (!text) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:7860/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

setResult(data);

setHistory((prev) => [
  {
    text: text.length > 50 ? text.slice(0, 50) + "..." : text,
    label: data.label,
    confidence: data.confidence,
  },
  ...prev.slice(0, 4),
]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🧠 TruthLens AI</h1>
      <p>Fake News Detection System</p>

      <textarea
        placeholder="Paste news here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={predictNews}>
        {loading ? "Analyzing..." : "Check News"}
      </button>

      {result && (
  <div
    className={
      result.label.includes("Fake") ? "card fake" : "card real"
    }
  >
    <h2>{result.label}</h2>

<p>
  <strong>Confidence:</strong> {result.confidence}%
</p>

<h3>📝 Why this Result?</h3>

<ul>
  {result.reason.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>

    {history.map((item, index) => (
      <div key={index} className="history-card">
        <p><strong>News:</strong> {item.text}</p>
        <p><strong>Result:</strong> {item.label}</p>
        <p><strong>Confidence:</strong> {item.confidence}%</p>
      </div>
    ))}
  </div>
)}

</div>
);
}

export default App;