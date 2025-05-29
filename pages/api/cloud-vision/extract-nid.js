// pages/api/describe-image.js
import { OpenAI } from "openai";
// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Is there any person name in this image? What is user nid number?What is his date of birth?",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    const description =
      response.choices[0]?.message.content || "No description available";

    res.status(200).json({ description });
  } catch (error) {
    res.status(500).json({ error: "Failed to get image description" });
  }
}
