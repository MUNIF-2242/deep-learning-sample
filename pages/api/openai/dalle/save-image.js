// pages/api/save-image.js

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { imageName, imageUrl } = req.body;

    if (!imageName || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Image name and URL are required." });
    }

    try {
      // Fetch the image from the provided URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image from URL.");
      }

      // Get the image as a buffer
      const buffer = await response.buffer();

      // Define the file path where the image will be saved (in the public folder)
      const imagePath = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "dalle",
        `${imageName}.png`
      );

      // Ensure the `public/assets/images/dalle` directory exists
      const dirPath = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "dalle"
      );
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write the image file to the 'dalle' directory inside 'public/assets/images'
      fs.writeFile(imagePath, buffer, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving image." });
        }

        res.status(200).json({
          message: "Image saved successfully!",
          imageUrl: `/assets/images/dalle/${imageName}.png`,
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to save image." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
