import puppeteer from "puppeteer";

// Function to scrape price dynamically
const scrapePrice = async (url) => {
    if (!url) return null;
    console.log(`Scraping price from: ${url}`);

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

        const priceSelector = "span.price"; 
        const price = await page.evaluate((selector) => {
            const priceElement = document.querySelector(selector);
            return priceElement ? priceElement.innerText.trim() : null;
        }, priceSelector);

        await browser.close();
        return price;
    } catch (error) {
        console.error("Error scraping price:", error);
        await browser.close();
        return null;
    }
};

export default scrapePrice;
