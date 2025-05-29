import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { inputText } = req.body;

  try {
    // Try to extract BGD number using regex
    const match = inputText.match(/BGD\d+(?=<)/);

    if (match) {
      return res.status(200).json({ result: match[0], method: "regex" });
    }

    // Fallback to OpenAI if regex fails
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts Bangladeshi passport or ID numbers that start with 'BGD' and are followed by digits, ending just before a '<'. Return only the full BGD number (e.g., BGD1234567890).",
        },
        {
          role: "user",
          content: `Extract the BGD number from this text:\n\n"${inputText}"`,
        },
      ],
      temperature: 0.2,
    });

    const result = chatCompletion.choices[0]?.message?.content?.trim();

    console.log("OpenAI result:", result);
    res.status(200).json({ result, method: "openai" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to extract BGD number" });
  }
}
