const axios = require("axios");

// Helper function to convert English digits to Bengali
function convertEnglishDigitsToBengali(text) {
  const engToBnDigits = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };
  return text.replace(/[0-9]/g, (digit) => engToBnDigits[digit]);
}

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

    console.log("Full text detected:", fullText);

    // Convert digits to Bengali
    const banglaConvertedText = convertEnglishDigitsToBengali(fullText.trim());

    res.status(200).json({
      success: true,
      fullText: fullText.trim(),
      banglaConvertedText: banglaConvertedText,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to extract text" });
  }
}
