const axios = require("axios");

const API_KEY = "AIzaSyA9sPHLXCZAoaTTG8Ko_zc-NAEkQKAVOnA";

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
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
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

    const banglaOnly =
      fullText.match(/[\u0980-\u09FF\s.,-]+/g)?.join(" ") || "";

    const tinMatch = fullText.match(/TIN\s*:\s*(\d{10,20})/);
    const tinNumber = tinMatch ? tinMatch[1] : null;

    res.status(200).json({
      success: true,
      fullText: fullText.trim(),
      banglaOnly: banglaOnly.trim(),
      tinNumber,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to extract text" });
  }
}
