import { Router } from "express";
import multer from "multer";
<<<<<<< HEAD
import { GoogleGenerativeAI } from "@google/generative-ai";
=======
import { GoogleGenAI } from "@google/genai";
>>>>>>> 52d7754 (final fix)

const router = Router();

// ✅ ENV
const geminiApiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const visionApiKey = process.env.GOOGLE_API_KEY;

<<<<<<< HEAD
// ❌ Warn if missing
=======
// ❌ Fail fast if missing
>>>>>>> 52d7754 (final fix)
if (!geminiApiKey) {
  console.warn("⚠️ GEMINI API KEY missing");
}
if (!visionApiKey) {
  console.warn("⚠️ GOOGLE VISION API KEY missing");
}

// ✅ Gemini setup
<<<<<<< HEAD
const genAI = new GoogleGenerativeAI(geminiApiKey || "");

// ✅ Multer
=======
const ai = new GoogleGenAI({
  apiKey: geminiApiKey || "",
});

// ✅ Multer (memory upload)
>>>>>>> 52d7754 (final fix)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 },
});

<<<<<<< HEAD
// ─────────────────────────────────────────────
// 🔍 GOOGLE VISION OCR
// ─────────────────────────────────────────────
=======

// ─────────────────────────────────────────────
// 🔍 GOOGLE VISION OCR
// ─────────────────────────────────────────────

>>>>>>> 52d7754 (final fix)
async function visionOcrImage(buffer: Buffer): Promise<string> {
  if (!visionApiKey) throw new Error("GOOGLE_API_KEY missing");

  const base64 = buffer.toString("base64");

  const resp = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64 },
            features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
          },
        ],
      }),
    }
  );

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Vision API error: ${errText}`);
  }

  const data: any = await resp.json();
  return data?.responses?.[0]?.fullTextAnnotation?.text || "";
}

<<<<<<< HEAD
// ─────────────────────────────────────────────
// 📄 EXTRACT TEXT
// ─────────────────────────────────────────────
async function extractText(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype.startsWith("image/")) {
    return await visionOcrImage(buffer);
  }
  return buffer.toString("utf-8");
}

// ─────────────────────────────────────────────
// 🤖 GEMINI PARSE
// ─────────────────────────────────────────────
async function runGemini(prompt: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

=======

// ─────────────────────────────────────────────
// 📄 EXTRACT TEXT
// ─────────────────────────────────────────────

async function extractText(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  if (mimetype.startsWith("image/")) {
    return await visionOcrImage(buffer);
  }

  // fallback for pdf/text
  return buffer.toString("utf-8");
}


// ─────────────────────────────────────────────
// 🤖 GEMINI PARSE
// ─────────────────────────────────────────────

async function runGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });

  return response.text ?? "";
}


>>>>>>> 52d7754 (final fix)
// ─────────────────────────────────────────────
// 🚀 ROUTES
// ─────────────────────────────────────────────

// ✅ Health
router.get("/", (_req, res) => {
  res.json({ status: "Parse route working ✅" });
});

<<<<<<< HEAD
=======

>>>>>>> 52d7754 (final fix)
// ✅ Upload + parse
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File required" });
    }

    const text = await extractText(
      req.file.buffer,
      req.file.mimetype
    );

    if (!text.trim()) {
      return res.status(400).json({ error: "No text extracted" });
    }

    const aiResult = await runGemini(`
Extract structured financial data from this:

${text}

Return ONLY valid JSON.
`);

    res.json({
      success: true,
      rawText: text,
      ai: aiResult,
    });

  } catch (err: any) {
    console.error("❌ Parse error:", err);

    res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 52d7754 (final fix)
