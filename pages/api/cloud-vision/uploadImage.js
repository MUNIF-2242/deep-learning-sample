import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";

const s3 = new S3Client({
  region: process.env.REGION_AWS,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image data provided." });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const fileName = `tin-${timestamp}.jpg`;
    const bucketName = process.env.S3_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: "image/jpg",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const imageUrl = `https://${bucketName}.s3.${process.env.REGION_AWS}.amazonaws.com/${fileName}`;
    return res.status(200).json({ imageUrl, fileName });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while uploading the image.",
      error: error.message,
    });
  }
}

// ✅ Configure body size limit for large base64 image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
