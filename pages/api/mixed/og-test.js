import puppeteer from "puppeteer";

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body; // Get URL from request body

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Launch Puppeteer and open a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract Open Graph meta tags: og:title, og:description, og:image
    const ogData = await page.evaluate(() => {
      const getMetaTagContent = (property) => {
        const metaTag = document.querySelector(`meta[property='${property}']`);
        return metaTag ? metaTag.getAttribute("content") : null;
      };

      const ogTitle = getMetaTagContent("og:title");
      const ogDescription = getMetaTagContent("og:description");
      const ogImage = getMetaTagContent("og:image");

      return {
        ogTitle,
        ogDescription,
        ogImage,
      };
    });

    // Get current date in a readable format
    const currentDate = new Date().toLocaleString(); // Format as needed

    // Close the Puppeteer browser
    await browser.close();

    // Return the extracted data along with the current date and article link
    res.status(200).json({
      title: ogData.ogTitle || "No OG Title found",
      description: ogData.ogDescription || "No OG Description found",
      image: ogData.ogImage || "No OG Image found",
      date: currentDate, // Include current date in the response
      articleLink: url, // Include the article link (URL)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape the webpage" });
  }
}
