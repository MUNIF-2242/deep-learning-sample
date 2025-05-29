const axios = require("axios");

// Define keyword groups
const cartoonKeywords = [
  "cartoon",
  "anime",
  "animation",
  "drawing",
  "illustration",
  "manga",
  "sketch",
  "avatar",
  "comic",
  "line art",
  "chibi",
  "toon",
  "doodle",
];

const aiGeneratedKeywords = [
  "ai generated",
  "artificial intelligence",
  "ai art",
  "ai image",
  "neural network",
  "deepfake",
  "synthesized",
  "midjourney",
  "stable diffusion",
  "dalle",
  "gan",
  "stylegan",
];

const cgi3dKeywords = [
  "3d render",
  "rendering",
  "cgi",
  "computer graphics",
  "digital art",
  "vfx",
  "virtual character",
  "unreal engine",
  "blender",
  "maya",
  "3d model",
  "realistic render",
  "synthetic image",
];

const paintingKeywords = [
  "painting",
  "fine art",
  "oil painting",
  "art",
  "portrait painting",
  "masterpiece",
];

// Combine all non-real indicators
const nonRealKeywords = [
  ...cartoonKeywords,
  ...aiGeneratedKeywords,
  ...cgi3dKeywords,
  ...paintingKeywords,
];

// Utility function to classify image
function classifyImageType({ labels = [], webEntities = [] }) {
  const allDescriptions = [
    ...labels.map((l) => l.description.toLowerCase()),
    ...webEntities.map((e) => (e.description || "").toLowerCase()),
  ];

  for (const desc of allDescriptions) {
    for (const keyword of nonRealKeywords) {
      if (desc.includes(keyword)) {
        return "non-real";
      }
    }
  }

  return "real";
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
              source: { imageUri: imageUrl },
            },
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "SAFE_SEARCH_DETECTION" },
              { type: "WEB_DETECTION" },
              { type: "FACE_DETECTION" },
            ],
          },
        ],
      }
    );

    const data = response.data.responses[0] || {};

    const labels =
      data.labelAnnotations?.map((label) => ({
        description: label.description,
        score: label.score,
      })) || [];

    console.log("Labels:", labels);

    const webEntities =
      data.webDetection?.webEntities?.map((entity) => ({
        description: entity.description,
        score: entity.score,
      })) || [];

    const faces = data.faceAnnotations || [];

    const imageType = classifyImageType({ labels, webEntities });

    console.log("Image Type:", imageType);

    res.status(200).json({
      success: true,
      labels,
      webEntities,
      facesDetected: faces.length,
      imageType, // "real" or "non-real"
    });
  } catch (error) {
    console.error("Vision API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
}
