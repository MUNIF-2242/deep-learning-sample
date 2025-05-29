import cosineSimilarity from "./cosineSimilarity";
import getEmbeddings from "./getEmbeddings";

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Extract prompt1 and prompt2 from the request body
      const { prompt1, prompt2 } = req.body;

      if (!prompt1 || !prompt2) {
        return res.status(400).json({
          error: "Both prompt1 and prompt2 are required.",
        });
      }

      // Call OpenAI API for chat completion (if needed)
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Specify the correct model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant",
          },
          { role: "user", content: `Prompt1: ${prompt1}, Prompt2: ${prompt2}` },
        ],
        max_tokens: 2000,
        temperature: 0,
      });

      // Get embeddings for prompt1 and prompt2
      const embeddings1 = await getEmbeddings(prompt1);
      const embeddings2 = await getEmbeddings(prompt2);

      // Calculate similarity
      const similarity = await cosineSimilarity(embeddings1, embeddings2);

      // Send back the embeddings, similarity, and chat completion
      res.status(200).json({
        similarity,
        embeddings1,
        embeddings2,
      });
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
