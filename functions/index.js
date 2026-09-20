const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { Readable } = require("node:stream");

const GROQ_API_KEY = defineSecret("GROQ_API_KEY");

const ALLOWED_MODELS = new Set([
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "groq/compound-mini",
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile"
]);

const MODEL_MAPPING = {
  "llama-3.1-8b-instant": "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile": "openai/gpt-oss-120b"
};

const MAX_MESSAGES = 30;
const MAX_TOKENS_CAP = 1500;
const MAX_BODY_BYTES = 100 * 1024; // 100 KB

exports.chat = onRequest(
  {
    secrets: [GROQ_API_KEY],
    region: "us-central1",
    timeoutSeconds: 60,
    maxInstances: 10
  },
  async (req, res) => {
    // a. Only accept POST
    if (req.method !== "POST") {
      res.set("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      // Validate request body
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ error: "Invalid JSON request body" });
      }

      const bodyStr = JSON.stringify(req.body);
      if (Buffer.byteLength(bodyStr, "utf8") > MAX_BODY_BYTES) {
        return res.status(400).json({ error: "Request payload too large" });
      }

      const { model, messages, temperature, stream, max_tokens, tools, tool_choice } = req.body;

      // Validate model against allowlist
      if (!model || !ALLOWED_MODELS.has(model)) {
        return res.status(400).json({
          error: `Invalid or unsupported model '${model}'. Allowed models: ${Array.from(ALLOWED_MODELS).join(", ")}`
        });
      }

      // Validate messages array
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "'messages' must be a non-empty array" });
      }

      if (messages.length > MAX_MESSAGES) {
        return res.status(400).json({
          error: `Too many messages in history (${messages.length}). Maximum allowed is ${MAX_MESSAGES}.`
        });
      }

      const sanitizedMessages = [];
      for (const msg of messages) {
        if (!msg || typeof msg !== "object") {
          return res.status(400).json({ error: "Invalid message structure in 'messages'" });
        }
        const cleanMsg = {
          role: String(msg.role || "user"),
          content: typeof msg.content === "string" ? msg.content : ""
        };
        if (typeof msg.name === "string") {
          cleanMsg.name = msg.name;
        }
        sanitizedMessages.push(cleanMsg);
      }

      // Build sanitized payload - map to active upstream model if legacy requested
      const targetModel = MODEL_MAPPING[model] || model;
      const payload = {
        model: targetModel,
        messages: sanitizedMessages,
        stream: typeof stream === "boolean" ? stream : true
      };

      if (typeof temperature === "number" && !isNaN(temperature)) {
        payload.temperature = Math.max(0, Math.min(2, temperature));
      } else {
        payload.temperature = 0.2;
      }

      if (max_tokens !== undefined) {
        const parsedTokens = parseInt(max_tokens, 10);
        if (!isNaN(parsedTokens) && parsedTokens > 0) {
          payload.max_tokens = Math.min(parsedTokens, MAX_TOKENS_CAP);
        } else {
          payload.max_tokens = MAX_TOKENS_CAP;
        }
      }

      if (Array.isArray(tools)) {
        payload.tools = tools;
      }

      if (tool_choice !== undefined) {
        payload.tool_choice = tool_choice;
      }

      // Read secret before forwarding upstream
      const apiKey = GROQ_API_KEY.value();
      if (!apiKey || apiKey === "REPLACE_ME") {
        return res.status(500).json({ error: "GROQ_API_KEY secret is not configured" });
      }

      // c. Forward request to Groq API
      const upstreamRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      // f. Clean error handling without leaking upstream headers or keys
      if (!upstreamRes.ok) {
        let errorMsg = `Upstream error (${upstreamRes.status})`;
        try {
          const upstreamError = await upstreamRes.json();
          if (upstreamRes.status === 429) {
            errorMsg = "Rate limit exceeded. Please wait a moment.";
          } else if (upstreamError?.error?.message) {
            errorMsg = upstreamError.error.message;
          }
        } catch {
          // Keep default fallback message
        }
        return res.status(upstreamRes.status).json({ error: errorMsg });
      }

      // e. Stream response back for SSE
      res.status(upstreamRes.status);
      const contentType = upstreamRes.headers.get("content-type") || "text/event-stream; charset=utf-8";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      if (payload.stream && upstreamRes.body) {
        const streamReader = Readable.fromWeb(upstreamRes.body);
        streamReader.pipe(res);
        streamReader.on("error", (streamErr) => {
          console.error("Streaming error:", streamErr);
          if (!res.headersSent) {
            res.status(500).json({ error: "Stream transmission failed" });
          } else {
            res.end();
          }
        });
      } else {
        const data = await upstreamRes.json();
        return res.json(data);
      }
    } catch (err) {
      console.error("Cloud function chat proxy error:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
      res.end();
    }
  }
);
