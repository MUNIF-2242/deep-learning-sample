const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Extract prompt from the request body
      const { prompt } = req.body;

      // Validate the prompt
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          error: "Invalid request format. Prompt should be a non-empty string.",
        });
      }

      // Call OpenAI API for chat completion
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Update to the correct model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0,
      });

      // Respond with the entire completion data
      res.status(200).json(completion); // Change this line
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
