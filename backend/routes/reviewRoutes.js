import express from "express";
import productModel from "../models/productModel.js";

const router = express.Router();

router.post("/add-review", async (req, res) => {
  try {
    const { productId, user, rating, comment } = req.body;

    // Find the product by ID
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Add the new review
    const review = {
      user,
      rating,
      comment,
      date: new Date(),
    };
    product.reviews = product.reviews || [];
    product.reviews.push(review);

    // Save the updated product
    await product.save();

    res.json({ success: true, reviews: product.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
