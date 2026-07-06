import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const checkNews = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResult(data.prediction);
    } catch (err) {
      setResult("Backend error");
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>TruthGuard AI</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter news"
      />

      <button onClick={checkNews}>Check</button>

      <h3>{result}</h3>
    </div>
  );
}

export default App;