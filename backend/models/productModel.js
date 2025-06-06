import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const suggestionSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  link: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
    name: {type: String, required:true },
    description: {type: String, required:true },
    price: {type: Number, required:true },
    image: {type: Array, required:true },
    category: {type: String, required:true },
    subCategory: {type: String, required:true },
    colors: {type: Array, required:true },
    bestseller: {type: Boolean},
    suggestions: [suggestionSchema],
    priceHistory: [priceHistorySchema], 
    date: {type: Number, required:true },
    sourceUrl: { type: String, required: false },
    reviews: [
        {
          user: { type: String, required: true },
          rating: { type: Number, required: true },
          comment: { type: String, required: true },
          date: { type: Date, default: Date.now },
        },
    ],    

})

const productModel = mongoose.models.product || mongoose.model("product",productSchema)

export default productModel