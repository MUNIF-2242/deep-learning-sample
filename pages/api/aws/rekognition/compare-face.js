// pages/api/aws/rekognition/compare-face.js

import {
  RekognitionClient,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { sourceImageName, targetImageName } = req.body;

  if (!sourceImageName || !targetImageName) {
    return res.status(400).json({ message: "Missing image file names" });
  }

  const client = new RekognitionClient({
    region: process.env.REGION_AWS,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID_AWS,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
    },
  });

  const params = {
    SourceImage: {
      S3Object: {
        Bucket: process.env.S3_BUCKET_NAME,
        Name: sourceImageName,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: process.env.S3_BUCKET_NAME,
        Name: targetImageName,
      },
    },
    SimilarityThreshold: 80,
  };

  try {
    const command = new CompareFacesCommand(params);
    const response = await client.send(command);

    console.log("CompareFace response:", response);

    const faceMatch = response.FaceMatches[0];

    return res.status(200).json({
      success: true,
      matched: !!faceMatch,
      similarity: faceMatch ? faceMatch.Similarity : 0,
    });
  } catch (error) {
    console.error("CompareFace error:", error);
    return res
      .status(500)
      .json({
        success: false,
        matched: false,
        message: "Face comparison failed.",
      });
  }
}
