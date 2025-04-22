import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import { json } from "express";

// function for add product
const addProduct = async (req, res) => {

    try {

        const { name, description, price, category, subCategory, colors, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            colors: JSON.parse(colors),
            bestseller: bestseller === "true" ? true : false,
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()


        res.json({ success: true, message: "Product Added" })


    } catch (error) {
        console.log(error);

        res.json({ success: false, message: error.message })
    }
}


// function for list product
const listProduct = async (req, res) => {
    try {

        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// function for single product info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for adding reviews

const addReview = async (req, res) => {
    try {
        const { productId, user, rating, comment } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        product.reviews.push({ user, rating, comment });
        await product.save();

        res.json({ success: true, message: "Review added successfully", reviews: product.reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller for handling price suggestions
export const addSuggestion = async (req, res) => {
    const { productId, price, link } = req.body;

    if (!productId || !price || !link) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Use the correct model name: productModel
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Add suggestion to the product's suggestions array
        product.suggestions.push({ price, link });
        await product.save();

        res.status(201).json({ success: true, suggestion: { price, link }, message: "Suggestion added successfully" });
    } catch (error) {
        console.error("Error adding suggestion:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, colors, bestseller } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // ✅ Only add to priceHistory if the price has changed
        if (price && product.price !== Number(price)) {
            product.priceHistory.push({ price: product.price, date: new Date() });
        }

        // ✅ Update product fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = Number(price);
        if (category) product.category = category;
        if (subCategory) product.subCategory = subCategory;
        if (colors) product.colors = JSON.parse(colors);
        if (bestseller !== undefined) product.bestseller = bestseller;

        // ✅ Handle images
        const images = req.files;
        if (images && images.length > 0) {
            product.image = [];
            for (let i = 0; i < images.length; i++) {
                const uploadedImage = await cloudinary.uploader.upload(images[i].path, {
                    resource_type: "image",
                });
                product.image.push(uploadedImage.secure_url);
            }
        }

        await product.save();
        res.json({ success: true, message: "Product updated successfully", product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const scrapeProductPrice = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productModel.findById(id);
  
      if (!product || !product.sourceUrl) {
        return res.status(404).json({ success: false, message: "Product not found or missing source URL" });
      }
  
      const scrapedData = await scrapePrice(product.sourceUrl);
      if (!scrapedData.success) {
        return res.status(500).json({ success: false, message: scrapedData.message });
      }
  
      const newPriceNum = Math.round(Number(scrapedData.price.replace(/[^0-9]/g, "")));
  
      const lastEntry = product.priceHistory.length > 0
        ? product.priceHistory[product.priceHistory.length - 1]
        : null;
  
      const lastPrice = lastEntry?.price || 0;
      const lastDate = lastEntry?.date ? new Date(lastEntry.date) : null;
      const now = new Date();
  
      const priceUnchanged = lastPrice === newPriceNum;
      const within10Minutes = lastDate && (now - lastDate < 10 * 60 * 1000);
  
      if (priceUnchanged && within10Minutes) {
        return res.json({
          success: true,
          price: newPriceNum,
          message: "Price is the same and recent. No update needed."
        });
      }
  
      product.priceHistory.push({ price: newPriceNum, date: now });
      product.price = newPriceNum;
      await product.save();
  
      return res.json({ success: true, price: newPriceNum, message: "Price updated successfully!" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  

export { listProduct, addProduct, removeProduct, singleProduct, addReview, updateProduct }