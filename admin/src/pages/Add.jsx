import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Apple");
  const [subCategory, setSubCategory] = useState("Laptop");
  const [bestseller, setBestseller] = useState(false);
  const [colors, setColors] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("colors", JSON.stringify(colors));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setColors([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

      {/* Image Upload Section */}
      <div>
        <label className="block text-gray-600 font-medium mb-2">Upload Images</label>
        <div className="flex gap-4">
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, i) => (
            <label key={i} className="cursor-pointer">
              <img
                className="w-20 h-20 border rounded-md object-cover"
                src={![image1, image2, image3, image4][i] ? assets.upload_area : URL.createObjectURL([image1, image2, image3, image4][i])}
                alt=""
              />
              <input onChange={(e) => setImage(e.target.files[0])} type="file" hidden />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div>
        <label className="block text-gray-600 font-medium mb-2">Product Name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full border px-4 py-2 rounded-md focus:ring-2 ring-blue-500"
          type="text"
          placeholder="Enter Product Name"
          required
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-2">Description</label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full border px-4 py-2 rounded-md focus:ring-2 ring-blue-500"
          placeholder="Enter Product Description"
          rows="4"
          required
        ></textarea>
      </div>

      {/* Category and Price Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-600 font-medium mb-2">Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 ring-blue-500"
          >
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Lenovo">Lenovo</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-2">Sub-Category</label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 ring-blue-500"
          >
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-2">Price</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 ring-blue-500"
            type="number"
            placeholder="Enter Price"
            required
          />
        </div>
      </div>

      {/* Colors Section */}
      <div>
        <label className="block text-gray-600 font-medium mb-2">Colors</label>
        <div className="flex gap-3">
          {["White", "Black", "Gold", "Blue", "Purple"].map((color) => (
            <div
              key={color}
              onClick={() =>
                setColors((prev) =>
                  prev.includes(color)
                    ? prev.filter((item) => item !== color)
                    : [...prev, color]
                )
              }
              className={`px-3 py-1 rounded-md cursor-pointer ${
                colors.includes(color) ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
              }`}
            >
              {color}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="bestseller"
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          className="h-5 w-5 text-blue-600 focus:ring-2 ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="bestseller" className="text-gray-600 font-medium cursor-pointer">
          Mark as Bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;
