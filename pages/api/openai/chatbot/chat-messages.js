const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Extract prompt from the request body
      const { messages } = req.body;

      // Call OpenAI API for chat completion
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      });

      // Respond with the entire completion data
      res.status(200).json(completion);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
