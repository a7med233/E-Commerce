import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ForgotPassword = ({ setPage }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (response.data.success) {
        toast.success("OTP sent to your email");
        setPage("verifyOtp");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error sending OTP");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="border px-4 py-2 rounded-md mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Send OTP
      </button>
    </div>
  );
};

export default ForgotPassword;