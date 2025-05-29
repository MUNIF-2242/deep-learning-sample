// /pages/api/extractRegistration.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store this securely in .env
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { inputText } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that extracts Bangladeshi vehicle registration numbers. Return only the full vehicle registration number including region, type, and number (e.g., ঢাকা মেট্রো-গ ৩১-৯৯৫৭). Do not return anything else.",
        },
        {
          role: "user",
          content: `Extract the vehicle registration number from this text:\n\n"${inputText}"`,
        },
      ],
      temperature: 0.2,
    });

    const result = chatCompletion.choices[0]?.message?.content?.trim();

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "OpenAI API call failed" });
  }
}
