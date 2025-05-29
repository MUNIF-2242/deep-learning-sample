const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
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

      // Call OpenAI API to create an image with DALL·E
      const imageResponse = await openai.images.generate({
        prompt: prompt,
        n: 1,
        size: "256x256",
      });

      // Get the URL of the generated image
      const imageUrl = imageResponse.data[0].url;

      // Respond with the image URL
      res.status(200).json({ imageResponse });
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
