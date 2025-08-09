import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

function getDesktopPath() {
  return path.join(os.homedir(), "Desktop");
}

app.get("/api/base-path", (_req, res) => {
  const desktop = getDesktopPath();
  res.json({ basePath: desktop });
});


app.post("/api/list-folder", async (req, res) => {
  try {
    let { folderPath } = req.body || {};
    if (typeof folderPath !== "string" || !folderPath.trim()) {
      return res.status(400).json({ error: "folderPath is required (string)" });
    }

    const raw = folderPath.trim();
    const basePath = getDesktopPath();

    // If absolute → use as-is. If relative (e.g. "./foo") → resolve from Desktop.
    const finalPath = path.isAbsolute(raw) ? raw : path.resolve(basePath, raw);

    const entries = await fs.readdir(finalPath, { withFileTypes: true });

    const data = entries.map((ent) => {
      const isDir = ent.isDirectory();
      const isFile = ent.isFile();
      const ext = isFile ? path.extname(ent.name).replace(/^\./, "") : "";
      return {
        name: ent.name,
        type: isDir ? "dir" : isFile ? "file" : "other",
        isDirectory: isDir,
        isFile: isFile,
        ext,
      };
    });

    res.json({ basePath, resolvedPath: finalPath, count: data.length, entries: data });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to list folder" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
