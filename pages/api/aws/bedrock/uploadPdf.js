import * as formidable from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

    console.log("Parsed Fields:", fields);
    console.log("Parsed Files:", files);

    // Adjust file key: sometimes it's an array
    let uploadedFile = files.file;
    if (Array.isArray(uploadedFile)) {
      uploadedFile = uploadedFile[0];
    }

    if (!uploadedFile) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    console.log("Uploaded File:", uploadedFile);

    if (
      uploadedFile.mimetype !== "application/pdf" &&
      uploadedFile.mimetype !== "application/octet-stream" // fallback if mimetype missing
    ) {
      return res
        .status(400)
        .json({ message: "Please upload a valid PDF file." });
    }

    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
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

    return res.status(200).json({
      success: true,
      fileUrl,
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
