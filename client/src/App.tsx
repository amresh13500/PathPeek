import { useEffect, useRef, useState } from "react";

export default function App() {
  const [basePath, setBasePath] = useState("");
  const [inputPath, setInputPath] = useState("./");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const inputRef = useRef(null); // for focusing input

  // Fetch base path on load
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:4000/api/base-path");
        const j = await r.json();
        setBasePath(j.basePath || "");
      } catch (e) {
        setError("Failed to load base path");
      }
    })();
    // focus input when page loads
    inputRef.current?.focus();
  }, []);

  const onList = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = { folderPath: inputPath.trim() };
      const res = await fetch("http://localhost:4000/api/list-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus(); // focus back after loading
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onList();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Folder Browser</h2>

        <div style={{ marginBottom: 8, color: "#666", fontSize: 14 }}>
          <strong>Base (Desktop):</strong> {basePath || "loading..."}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            onKeyDown={handleKeyDown} // trigger on Enter
            placeholder='Examples: "./projects" or "C:/Users/You/Desktop"'
          />
          <button
            onClick={onList}
            disabled={loading}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #333",
              background: "#111",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Loading..." : "List"}
          </button>
        </div>

        <div style={{ marginTop: 8, fontSize: 12, color: "#777" }}>
          Tip: If you enter a relative path like <code>./something</code>, it will be resolved from your Desktop.
        </div>

        {error && <div style={{ marginTop: 12, color: "crimson" }}>❌ {error}</div>}

        {result && (
          <div style={{ marginTop: 16 }}>
            <div style={{ color: "#555", marginBottom: 8 }}>
              <strong>Resolved Path:</strong> {result.resolvedPath} &nbsp;•&nbsp;
              <strong>Items:</strong> {result.count}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {result.entries.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>
                    {item.type === "dir" ? "📁" : item.type === "file" ? "📄" : "📦"}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong>{item.name}</strong>
                    <span style={{ color: "#666", fontSize: 12 }}>
                      {item.type === "dir"
                        ? "Folder"
                        : item.type === "file"
                        ? item.ext
                          ? `File · .${item.ext}`
                          : "File"
                        : "Other"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
