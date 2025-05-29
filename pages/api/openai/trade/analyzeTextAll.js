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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
    You are an intelligent assistant that classifies Bangladeshi government documents and optionally extracts key information.
    
    Your task is to:
    1. Identify what kind of document the input text is (e.g., Trade License, Vehicle Registration Certificate, NID, Passport, Driving License).
    2. Return the document type in English (e.g., "Trade License").
    3. If the document is a vehicle registration certificate, extract and return the full vehicle registration number in Bengali format (e.g., ঢাকা মেট্রো-গ ৩১-৯৯৫৭).
    
    Respond only with a JSON object in this structure:
    {
      "documentType": "Trade License",
      "registrationNumber": "ঢাকা মেট্রো-গ ৩১-৯৯৫৭" // optional; only for vehicle registrations
    }
          `.trim(),
        },
        {
          role: "user",
          content: `Analyze the following OCR text and determine the document type:\n\n"${inputText}"`,
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
