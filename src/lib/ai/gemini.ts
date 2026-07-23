import "server-only";

import { AIMessage, AIProvider } from "./provider";

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
};

export class GeminiProvider implements AIProvider {
  async generate(messages: AIMessage[]) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the server.");
    }

    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const systemMessages = messages.filter((message) => message.role === "system");
    const contents = messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      }));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            ...(systemMessages.length
              ? { systemInstruction: { parts: systemMessages.map((message) => ({ text: message.content })) } }
              : {}),
            contents,
            generationConfig: { responseMimeType: "application/json" },
          }),
          signal: controller.signal,
          cache: "no-store",
        },
      );
      const data = (await response.json()) as GeminiResponse;

      if (!response.ok) {
        throw new Error(`Gemini returned ${response.status}: ${data.error?.message || "Unknown API error"}`);
      }

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();
      if (!text) throw new Error("Gemini returned an empty response.");
      return text;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown connection error";
      throw new Error(`Gemini request failed. ${detail}`);
    } finally {
      clearTimeout(timer);
    }
  }
}
