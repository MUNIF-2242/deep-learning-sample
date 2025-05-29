import { OpenAI } from "openai";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse"; // PDF parsing library

// Set up OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up Multer to handle PDF file upload
const upload = multer({
  dest: "uploads/", // Temporarily stores files in "uploads" folder
});

// Middleware to handle file upload
const uploadMiddleware = upload.single("pdf");

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing to handle multipart form data
  },
};

// Helper to calculate tokens
const calculateTokens = (text) => {
  const encoder = new TextEncoder(); // Encoding text for token calculation
  return encoder.encode(text).length;
};

// Split large text into chunks if needed
const splitTextIntoChunks = (text, maxChunkSize) => {
  const chunks = [];
  let currentChunk = "";

  const sentences = text.split(".");

  sentences.forEach((sentence) => {
    if (calculateTokens(currentChunk + sentence) < maxChunkSize) {
      currentChunk += sentence + ".";
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + ".";
    }
  });

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
};

// Summarize each chunk using OpenAI
const summariseChunk = async (chunk, maxWords) => {
  let condition = maxWords ? `in about ${maxWords} words in Banglish` : "";
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Please summarize the following text ${condition}:\n"""${chunk}"""`,
      },
    ],
    max_tokens: 2000,
  });
  return response.choices[0].message.content;
};

// Summarize all text chunks
const summariseChunks = async (chunks) => {
  return await Promise.all(
    chunks.map(async (chunk) => {
      return await summariseChunk(chunk, 100); // Customize maxWords as needed
    })
  );
};

// Main API handler
export default async function handler(req, res) {
  if (req.method === "POST") {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "File upload failed" });
      }

      const pdfPath = req.file?.path;
      const { maxWords } = req.body;

      if (!pdfPath) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        const pdfData = fs.readFileSync(pdfPath);

        // Extract text from PDF
        const data = await pdf(pdfData);
        const extractedText = data.text;

        if (!extractedText) {
          return res
            .status(400)
            .json({ error: "No text could be extracted from the PDF" });
        }

        // Split text if it exceeds token limit
        const maxToken = 2000;
        let chunks = splitTextIntoChunks(extractedText, maxToken);
        let summarisedText = await summariseChunks(chunks);

        // Clean up uploaded file
        fs.unlinkSync(pdfPath);

        // Send summarized text as response
        return res
          .status(200)
          .json({ summarisedText: summarisedText.join(" ") });
      } catch (error) {
        if (pdfPath) fs.unlinkSync(pdfPath);
        return res.status(500).json({ error: "Processing failed" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
