// pages/api/aws/rekognition/detect-labels.js

import {
  RekognitionClient,
  DetectLabelsCommand,
} from "@aws-sdk/client-rekognition";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const fileName = req.body; // fileName string

  const client = new RekognitionClient({
    region: process.env.REGION_AWS,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID_AWS,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
    },
  });

  const params = {
    Image: {
      S3Object: {
        Bucket: process.env.S3_BUCKET_NAME,
        Name: fileName,
      },
    },
    MaxLabels: 10,
    MinConfidence: 70,
  };

  try {
    const command = new DetectLabelsCommand(params);
    const response = await client.send(command);

    // Extract label names and confidence
    const labels = response.Labels.map((label) => ({
      name: label.Name,
      confidence: label.Confidence,
    }));

    console.log("Detected labels:", labels);

    return res.status(200).json({
      success: true,
      labels,
    });
  } catch (error) {
    console.error("Error detecting labels:", error);
    return res
      .status(500)
      .json({ success: false, message: "Label detection failed." });
  }
}
