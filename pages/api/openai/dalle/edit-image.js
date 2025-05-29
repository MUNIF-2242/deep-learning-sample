const OpenAI = require("openai");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createCanvas, loadImage } = require("canvas");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { imageURL, points, prompt } = req.body;

    const imageDirectory = path.join(__dirname, "public/assets/images/dalle");

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const imageName = `${timestamp}_${randomString}`;

    const originalImagePath = path.join(
      imageDirectory,
      `${imageName}_original.png`
    );

    const imageBuffer = await axios.get(imageURL, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(
      originalImagePath,
      Buffer.from(imageBuffer.data, "binary")
    );

    const image = await loadImage(originalImagePath);

    const canvas = createCanvas(image.width, image.height);

    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imagePath = path.join(imageDirectory, `${imageName}.png`);
    const writer = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(writer);

    writer.on("finish", async () => {
      async function run(prompt, imagePath) {
        const convertedImagePath = imagePath.replace(".png", "_rgba.png");
        await sharp(imagePath).ensureAlpha().toFile(convertedImagePath);
        const response = await openai.createImageEdit(
          fs.createReadStream(convertedImagePath),
          prompt
        );

        fs.unlinkSync(convertedImagePath);

        return response;
      }
      try {
        const output = await run(prompt, imagePath);

        res.json(output.data);
      } catch (error) {
        res.status(500).json(error);
      }
    });

    writer.on("error", (err) => {
      throw new Error(err.message);
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
