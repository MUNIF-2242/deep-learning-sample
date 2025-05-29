import { OpenAI } from "openai";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse"; // Correct import

// Set up OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up Multer to store the uploaded file locally
const upload = multer({
  dest: "uploads/", // Temporary local folder
});

// Middleware to handle Multer
const uploadMiddleware = upload.single("pdf");

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing by Next.js to handle multipart form data
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Handle file upload
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "File upload failed" });
      }

      const { maxWords } = req.body;
      const pdfPath = req.file?.path;

      // Check if file is uploaded
      if (!pdfPath) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        // Read the file contents
        const pdfData = fs.readFileSync(pdfPath);

        let condition = "";
        if (maxWords) {
          condition = `in about ${maxWords} words in English`;
        }

        // Extract text from PDF
        const data = await pdf(pdfData); // Call pdf-parse here
        const extractedText = data.text;

        //Extarct pdf text into chunks

        // Construct the OpenAI prompt
        const prompt = `Summarize this PDF ${condition} : ${extractedText}`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
          max_tokens: 2000,
          temperature: 0,
        });

        // Delete the uploaded file after processing
        fs.unlinkSync(pdfPath);

        // Send the result back to the frontend
        return res.status(200).json(completion);
      } catch (error) {
        // Delete the uploaded file in case of error
        if (pdfPath) fs.unlinkSync(pdfPath);

        return res.status(500).json({ error: "Processing failed" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
