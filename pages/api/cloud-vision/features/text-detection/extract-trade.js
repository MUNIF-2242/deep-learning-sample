const axios = require("axios");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.CLOUD_VISION_API_KEY}`,
      {
        requests: [
          {
            image: {
              source: {
                imageUri: imageUrl,
              },
            },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }
    );

    const annotations = response.data.responses[0]?.textAnnotations || [];
    const fullText = annotations[0]?.description || "";

    res.status(200).json({
      success: true,
      fullText: fullText.trim(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to extract text" });
  }
}
