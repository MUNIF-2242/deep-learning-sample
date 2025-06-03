import * as formidable from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pdfParse from "pdf-parse"; // <--- Import the PDF parser

const s3 = new S3Client({
  region: process.env.REGION_AWS,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = new formidable.IncomingForm();

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
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

    // 📝 Step 1: Extract text using pdf-parse
    const pdfData = await pdfParse(fileBuffer);

    // You can access text content like this:
    const extractedText = pdfData.text;

    console.log("Extracted Text:", extractedText);

    // 🗃️ Step 2: Upload the file to S3 (as you already do)
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

    console.log("File uploaded successfully:", fileUrl);

    // 📨 Step 3: Return both file URL and extracted text
    return res.status(200).json({
      success: true,
      fileUrl,
      extractedText, // Include the extracted text in the response
    });
  } catch (error) {
    console.error("Error in upload handler:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      message: "An error occurred while uploading the file.",
      error: error.message,
    });
  }
}
