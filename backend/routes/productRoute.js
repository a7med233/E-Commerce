import express from "express";
import { 
    listProduct, 
    addProduct, 
    removeProduct, 
    singleProduct, 
    addSuggestion, 
    updateProduct 
} from "../controllers/productController.js";
import productModel from "../models/productModel.js"; // Import product model
import scrapePrice from "../scraper.js"; // Import Puppeteer scraper
import upload from "../middleware/multer.js";
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Add a new product (admin only)
productRouter.post('/add', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

// Remove product (admin only)
productRouter.post('/remove', adminAuth, removeProduct);

// Get single product
productRouter.post('/single', singleProduct);

// List all products
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 */
productRouter.get('/list', listProduct);

// Add a price suggestion
productRouter.post("/add-suggestion", addSuggestion);

// Update a product
productRouter.post('/update', adminAuth, upload.array('images'), updateProduct);

// Get price history
productRouter.get('/price-history/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).select('priceHistory');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, priceHistory: product.priceHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// 🆕 Route to Scrape and Update Product Price
productRouter.get('/scrape-price/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product || !product.sourceUrl) {
            return res.status(404).json({ success: false, message: "Product not found or missing source URL" });
        }

        const newPrice = await scrapePrice(product.sourceUrl);
        if (!newPrice) {
            return res.status(500).json({ success: false, message: "Failed to fetch price" });
        }

        // Convert price to a number (remove currency symbols)
        const numericPrice = parseFloat(newPrice.replace(/[^0-9.]/g, ""));

        // Update price and add to price history
        product.priceHistory.push({ price: numericPrice });
        product.price = numericPrice;
        await product.save();

        res.json({ success: true, price: numericPrice, message: "Price updated successfully!" });
    } catch (error) {
        console.error("Scraping Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default productRouter;
