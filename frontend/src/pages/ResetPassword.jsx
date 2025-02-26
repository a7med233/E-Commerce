import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ResetPassword = ({ email, setPage }) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password reset successful");
        setPage("login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error resetting password");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        className="border px-4 py-2 rounded-md mb-2"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter new password"
        className="border px-4 py-2 rounded-md mb-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword} className="bg-green-500 text-white px-4 py-2 rounded-md">
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;