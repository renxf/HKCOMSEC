import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes FIRST
app.post("/api/suggest-names", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key is not configured" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const systemPrompt = `You are an expert naming consultant for Hong Kong companies. 
The user will provide a brief description of their business. 
Your task is to generate Exactly 3 highly professional company name suggestions.
Each suggestion MUST have an English name and a corresponding Chinese name.
Return a valid JSON array of objects, where each object has "en" and "zh" properties.
Example: [{"en": "Prometheus Technology Limited", "zh": "普罗米修斯科技有限公司"}]
Response MUST be just the JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    let responseText = response.text || "";
    // Strip markdown code blocks if any
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const suggestions = JSON.parse(responseText);
    res.json({ suggestions });
  } catch (error: any) {
    console.error("AI Suggestion error:", error);
    res.status(500).json({ error: error.message || "Failed to generate suggestions" });
  }
});

app.post("/api/rpa/search", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendLog = (message: string, type: string = "info", progress?: number) => {
    res.write(`data: ${JSON.stringify({ message, type, progress })}\n\n`);
  };

  const { chineseName, englishName } = req.body;

  try {
    const queryEng = englishName?.trim() || "";
    const queryChi = chineseName?.trim() || "";
    
    let isConflict = false;
    let conflicts: string[] = [];

    sendLog("Querying data.cr.gov.hk Open API (Local & Foreign DBs)...", "info", 20);

    const fetchNames = async (url: string) => {
        try {
            const res = await fetch(url);
            const data = await res.json() as any;
            const results: string[] = [];
            if (data && data.data && data.data.result) {
                for (const item of data.data.result) {
                    if (item.Local_com_eng_name) results.push(item.Local_com_eng_name);
                    if (item.Local_com_chinese_name && item.Local_com_chinese_name !== '-') results.push(item.Local_com_chinese_name);
                    if (item.Foreign_com_eng_name) results.push(item.Foreign_com_eng_name);
                    if (item.Foreign_com_chinese_name && item.Foreign_com_chinese_name !== '-') results.push(item.Foreign_com_chinese_name);
                }
            }
            return results;
        } catch (e) {
            return [];
        }
    };

    if (queryEng) {
        const queryTerm = queryEng.toUpperCase();
        const localUrl = `https://data.cr.gov.hk/cr/api/api/v1/api_builder/local/search?current=1&size=50&query[0][key1]=Comp_name&query[0][key2]=begins_with&query[0][key3]=${encodeURIComponent(queryTerm)}`;
        const foreignUrl = `https://data.cr.gov.hk/cr/api/api/v1/api_builder/foreign/search?current=1&size=50&query[0][key1]=Corp_name_full&query[0][key2]=begins_with&query[0][key3]=${encodeURIComponent(queryTerm)}`;
        
        const [localR, foreignR] = await Promise.all([fetchNames(localUrl), fetchNames(foreignUrl)]);
        conflicts.push(...localR, ...foreignR);
    }

    sendLog("Processing Chinese Names if available...", "info", 50);

    if (queryChi) {
        const queryTermChi = queryChi;
        const localUrlChi = `https://data.cr.gov.hk/cr/api/api/v1/api_builder/local/search?current=1&size=50&query[0][key1]=Comp_name&query[0][key2]=begins_with&query[0][key3]=${encodeURIComponent(queryTermChi)}`;
        const foreignUrlChi = `https://data.cr.gov.hk/cr/api/api/v1/api_builder/foreign/search?current=1&size=50&query[0][key1]=Corp_name_full&query[0][key2]=begins_with&query[0][key3]=${encodeURIComponent(queryTermChi)}`;
        
        const [localR, foreignR] = await Promise.all([fetchNames(localUrlChi), foreignUrlChi ? fetchNames(foreignUrlChi) : Promise.resolve([])]);
        conflicts.push(...localR, ...foreignR);
    }
    
    conflicts = [...new Set(conflicts)].slice(0, 5); // Limit to top 5 unique conflicts
    
    if (conflicts.length > 0) {
      isConflict = true;
    }

    res.write(`data: ${JSON.stringify({ 
      result: {
        isAvailable: !isConflict,
        conflictingNames: conflicts,
        remarks: isConflict ? "System detected similar existing registrations via ICRIS/Gov Data." : "No exact matches found. Name appears available for registration.",
        checkedAt: new Date().toLocaleString()
      }
    })}\n\n`);

    sendLog("Task execution completed.", "success", 100);

  } catch (err: any) {
    console.error(err);
    sendLog(`API Request Error: ${err.message}`, "error", 100);
    res.write(`data: ${JSON.stringify({ 
      result: {
        isAvailable: false,
        conflictingNames: [],
        remarks: "Lookup Engine encountered a runtime exception. " + err.message,
        checkedAt: new Date().toLocaleString()
      }
    })}\n\n`);
  } finally {
    res.end();
  }
});

async function startDevServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Check if running in Vercel or production
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  startDevServer();
} else {
  // Production standalone node server (not vercel serverless)
  if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Production server running on port ${PORT}`);
    });
  }
}

export default app;
