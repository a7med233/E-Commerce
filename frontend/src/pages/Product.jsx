import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const { products, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState(null);
  const [color, setColor] = useState("");
  const [currency, setCurrency] = useState("HUF"); // Default currency
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({ user: "", rating: 0, comment: "" });
  const [activeTab, setActiveTab] = useState("description");

  // New States for Suggest Price Feature
  const [suggestion, setSuggestion] = useState({ price: "", link: "" });
  const [suggestions, setSuggestions] = useState([]); // To store submitted suggestions
  const [priceHistory, setPriceHistory] = useState([]); // Price history state

  const [latestPrice, setLatestPrice] = useState(null);

  useEffect(() => {
    const fetchLatestPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product/scrape-price/${productId}`);
        setLatestPrice(response.data.price);
      } catch (error) {
        console.error("Error fetching latest price:", error);
      }
    };

    fetchLatestPrice();
  }, [productId]);


  // Fetch product data
  useEffect(() => {
    const fetchProductData = () => {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
      }
    };
    fetchProductData();
  }, [productId, products]);

  {/*// Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "http://api.exchangeratesapi.io/v1/latest",
          {
            params: {
              access_key: "e1f139606cb7ffd25e6c429aa60badcc", // Your access key
            },
          }
        );
        if (response.data && response.data.rates) {
          setExchangeRates(response.data.rates);
        } else {
          console.error("Invalid exchange rate data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        alert("Failed to fetch exchange rates. Please try again later.");
      }
    };

    fetchExchangeRates();
  }, []);

  // Calculate converted price
  useEffect(() => {
    if (productData?.price && exchangeRates[currency] && exchangeRates["HUF"]) {
      const priceInSelectedCurrency = (
        (productData.price / exchangeRates["HUF"]) * exchangeRates[currency]
      ).toFixed(2);
      setConvertedPrice(priceInSelectedCurrency);
    }
  }, [currency, exchangeRates, productData]);
  */}

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/product/add-review", {
        productId,
        ...reviewData,
      });
      setReviews(response.data.reviews || []);
      setReviewData({ user: "", rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Handle Suggestion Submission
  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();

    if (!suggestion.price || !suggestion.link) {
      alert("Please provide both a price and a link.");
      return;
    }

    try {
      // Submit to backend (for now, we'll just add to suggestions array)
      const response = await axios.post(
        "http://localhost:4000/api/product/add-suggestion",
        {
          productId,
          ...suggestion,
        }
      );

      setSuggestions((prev) => [...prev, response.data.suggestion]); // Update suggestions
      setSuggestion({ price: "", link: "" }); // Clear form
    } catch (error) {
      console.error("Error submitting suggestion:", error);
    }
  };


  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product/price-history/${productId}`);
        setPriceHistory(response.data.priceHistory);
      } catch (error) {
        console.error("Error fetching price history:", error);
      }
    };

    fetchPriceHistory();
  }, [productId]);



  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Product ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="Selected Product" />
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">({reviews.length})</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {convertedPrice || productData.price} {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Color:</p>
            <div className="flex gap-2">
              {productData.colors.map((item, index) => (
                <button
                  onClick={() => setColor(item)}
                  className={`border py-2 px-4 bg-gray-100 text-black ${item === color ? "border-orange-500" : ""
                    }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, color)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Price History Table */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Price History</h3>
        <table className="w-full border mt-2">
          <thead>
            <tr className="border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="p-2">{entry.price} HUF</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Suggest New Price Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Suggest a New Price</h2>
        <form onSubmit={handleSuggestionSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="number"
            placeholder="Suggested Price"
            value={suggestion.price}
            onChange={(e) => setSuggestion({ ...suggestion, price: e.target.value })}
            className="border px-4 py-2"
            required
          />
          <input
            type="url"
            placeholder="Link to Product on Another Website"
            value={suggestion.link}
            onChange={(e) => setSuggestion({ ...suggestion, link: e.target.value })}
            className="border px-4 py-2"
            required
          />
          <button type="submit" className="bg-black text-white px-6 py-2">
            Submit Suggestion
          </button>
        </form>
      </div>

      {/* Display Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold">User Suggestions</h3>
          <ul className="mt-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="border-b py-2">
                <p>Suggested Price: {suggestion.price}</p>
                <a
                  href={suggestion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Product
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}



     {/* {Currency Selector} 
      <div className="mt-4">
        <label htmlFor="currency">Choose Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border px-3 py-2 ml-2"
        >
          {Object.keys(exchangeRates).map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>
      </div>*/}


      {/* Description & Review Section */}
      <div className="mt-20">
        <div className="flex">
          <button
            className={`border px-5 py-3 text-sm ${activeTab === "description" ? "font-bold" : ""
              }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`border px-5 py-3 text-sm ${activeTab === "reviews" ? "font-bold" : ""
              }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="border px-6 py-6 text-sm text-gray-500">
          {activeTab === "description" ? (
            <div>
              <p>{productData.description || "Description not available."}</p>
            </div>
          ) : (
            <div>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-medium">{review.user}</p>
                    <p className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>
                    <p>{review.comment}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}

              {/* Add Review Form */}
              <form onSubmit={submitReview} className="mt-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={reviewData.user}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, user: e.target.value })
                  }
                  className="border px-3 py-2 mb-2 w-full"
                  required
                />
                <select
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="border px-3 py-2 mb-2 w-full"
                  required
                >
                  <option value={0}>Select Rating</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} Star{star > 1 && "s"}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Your Review"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  className="border px-3 py-2 mb-2 w-full"
                  rows="4"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Display Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Product;
