import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate(); // Use navigate hook

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
<>
  <div className="mb-6">
    <h1 className="text-xl font-bold text-gray-800">All Products List</h1>
  </div>
  <div className="flex flex-col gap-4">
    {/* Table Header */}
    <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-200 text-sm font-medium rounded-md">
      <span className="text-center">Image</span>
      <span className="text-left">Name</span>
      <span className="text-left">Manufacturer</span>
      <span className="text-left">Price</span>
      <span className="text-center">Action</span>
      <span className="text-center">Edit</span>
    </div>

    {/* Product List */}
    {list.map((item, index) => (
      <div
        key={index}
        className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <img
          className="w-16 h-16 object-cover rounded-md border"
          src={item.image[0]}
          alt={item.name}
        />
        <p className="text-gray-700 font-medium">{item.name}</p>
        <p className="text-gray-500">{item.category}</p>
        <p className="text-gray-800 font-semibold">
          {currency}
          {item.price}
        </p>
        <button
          onClick={() => removeProduct(item._id)}
          className="text-red-600 font-medium hover:underline text-center"
        >
          Remove
        </button>
        <button
          onClick={() => navigate(`/admin/edit/${item._id}`)}
          className="text-blue-600 font-medium hover:underline text-center"
        >
          Edit
        </button>
      </div>
    ))}
  </div>
</>

  );
};

export default List;
