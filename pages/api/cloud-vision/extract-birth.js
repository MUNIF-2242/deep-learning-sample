const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const PORT = 3000;

// Replace with your real Google API key
const API_KEY = "AIzaSyA9sPHLXCZAoaTTG8Ko_zc-NAEkQKAVOnA";

app.use(bodyParser.json({ limit: "10mb" }));

app.post("/extract-text", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }
    );

    const annotations = response.data.responses[0].textAnnotations;
    const fullText = annotations?.[0]?.description || "";

    const banglaOnly =
      fullText.match(/[\u0980-\u09FF\s.,-]+/g)?.join(" ") || "";

    res.json({
      success: true,
      fullText: fullText.trim(),
      banglaOnly: banglaOnly.trim(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to extract text" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
