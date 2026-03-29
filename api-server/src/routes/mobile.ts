import { Router, type Request, type Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

// ✅ Railway-safe BASE URL
const BASE_URL =
  process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${process.env.PORT || 8080}`;

// ✅ Public directory
function getPublicDir(): string {
  return path.resolve(process.cwd(), "public");
}

// ─────────────────────────────────────────────
// 📦 MANIFEST
// ─────────────────────────────────────────────

router.get("/manifest", (req: Request, res: Response) => {
  try {
    const platform = (req.headers["expo-platform"] as string) || "android";
    const manifestPath = path.join(getPublicDir(), platform, "manifest.json");

    if (!fs.existsSync(manifestPath)) {
      return res.status(404).json({ error: "Manifest not found" });
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    // ✅ Fix bundle URL
    if (manifest.launchAsset?.url) {
      const url = new URL(manifest.launchAsset.url);
      manifest.launchAsset.url = `${BASE_URL}${url.pathname}`;
    }

    // ✅ Fix assets
    if (Array.isArray(manifest.assets)) {
      manifest.assets = manifest.assets.map((asset: any) => {
        if (asset.url) {
          try {
            const url = new URL(asset.url);
            asset.url = `${BASE_URL}${url.pathname}`;
          } catch {}
        }
        return asset;
      });
    }

    res.json(manifest);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 🌐 LANDING PAGE
// ─────────────────────────────────────────────

router.get("/", (_req: Request, res: Response) => {
  const expoUrl = BASE_URL.replace("https://", "exp://");

  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Dhanush Financial</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {
  font-family: Arial;
  background: #080F1E;
  color: white;
  text-align: center;
  padding: 40px;
}
h1 { color: #D4A853; }
.url {
  background: #15202F;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  word-break: break-all;
  margin-top: 20px;
}
</style>
</head>
<body>
<h1>Dhanush Financial</h1>
<p>Open in Expo Go:</p>
<div class="url">${expoUrl}</div>
</body>
</html>
`);
});

export default router;
