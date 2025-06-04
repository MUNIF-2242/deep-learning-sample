import * as formidable from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pdfParse from "pdf-parse";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { connectToDatabase } from "@/mongodbMiddleware";

const s3 = new S3Client({
  region: process.env.REGION_AWS,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  },
});

const bedrock = new BedrockRuntimeClient({
  region: process.env.REGION_BEDROCK_AWS,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  },
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("documents");

    const form = new formidable.IncomingForm();

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    let uploadedFile = files.file;
    if (Array.isArray(uploadedFile)) {
      uploadedFile = uploadedFile[0];
    }

    if (!uploadedFile) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    if (
      uploadedFile.mimetype !== "application/pdf" &&
      uploadedFile.mimetype !== "application/octet-stream"
    ) {
      return res
        .status(400)
        .json({ message: "Please upload a valid PDF file." });
    }

    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    // Extract text from the PDF
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text;

    // Upload to S3
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const fileName = `doc-${timestamp}.pdf`;
    const bucketName = process.env.S3_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: "application/pdf",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${bucketName}.s3.${process.env.REGION_AWS}.amazonaws.com/${fileName}`;

    // Generate embedding with Bedrock
    const embeddingResponse = await bedrock.send(
      new InvokeModelCommand({
        modelId: "amazon.titan-embed-text-v1",
        body: JSON.stringify({ inputText: extractedText }),
        accept: "application/json",
        contentType: "application/json",
      })
    );

    const embedding = JSON.parse(
      Buffer.from(embeddingResponse.body).toString("utf-8")
    ).embedding;

    // Store document metadata in MongoDB
    await collection.insertOne({
      fileName,
      fileUrl,
      extractedText,
      embedding,
      uploadedAt: new Date(),
    });

    // Return response
    res.status(200).json({
      success: true,
      fileUrl,
      extractedText,
    });
  } catch (error) {
    console.error("Error in upload handler:", error);
    res.status(500).json({
      message: "An error occurred while uploading the file.",
      error: error.message,
    });
  }
}
