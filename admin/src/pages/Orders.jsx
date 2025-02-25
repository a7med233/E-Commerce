import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 shadow-md rounded-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Order Page</h3>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-6 items-start border bg-white shadow p-6 rounded-md"
            key={index}
          >
            <img
              className="w-16 sm:w-20 mx-auto object-contain"
              src={assets.parcel_icon}
              alt=""
            />
            <div>
              {order.items.map((item, index) => (
                <p key={index} className="text-gray-700">
                  {item.name} x {item.quantity} <span>{item.color}</span>
                  {index < order.items.length - 1 && ","}
                </p>
              ))}
              <p className="mt-4 font-medium text-gray-800">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="text-gray-600">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </p>
                <p>{order.address.phone}</p>
              </div>
            </div>
            <div className="text-gray-700 space-y-2">
              <p className="font-medium">
                Items: {order.items.length}
              </p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="font-bold text-lg text-gray-800">
              {currency}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="px-4 py-2 bg-gray-50 border rounded-md focus:ring-2 ring-blue-500"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
