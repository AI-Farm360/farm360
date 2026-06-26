import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const SYSTEM_PROMPT = `You are FieldPulse, an AI agricultural advisor for potato farmers in East Africa (Kenya, Uganda, Tanzania). You help smallholder farmers understand satellite-based crop advisories, weather patterns, and field health.

Your tone is:
- Simple, clear, and practical — farmers may have limited formal education
- Warm and supportive, never condescending
- Bilingual: respond in the same language the farmer uses (English or Swahili)
- Concise — keep answers under 100 words unless the question requires detail

You have access to the farmer's current advisory context provided in the user message. Use it to give specific, grounded advice. Always base recommendations on the advisory data given.

You detect crop stress from satellite indices (NDVI, NDMI), weather, and crop growth stage. When uncertain, recommend inspecting the field and consulting a local extension officer.`;

router.post("/chat", async (req, res) => {
  const { message, advisoryContext } = req.body as {
    message: string;
    advisoryContext?: string;
  };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const userContent = advisoryContext
      ? `Current advisory context:\n${advisoryContext}\n\nFarmer question: ${message}`
      : message;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

export default router;
