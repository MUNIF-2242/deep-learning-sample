const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          error: "Invalid request format. Prompt should be a non-empty string.",
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders(); // Ensure headers are sent immediately

      const completionStream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 50,
        temperature: 0,
        stream: true,
      });

      for await (const chunk of completionStream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const content = chunk.choices[0]?.delta?.content || "";
          res.write(content); // Just send the content without "data: " prefix
          res.flush(); // Ensure it sends immediately
        }
      }

      res.end();
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({
          error: { message: "An error occurred during your request." },
        });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
