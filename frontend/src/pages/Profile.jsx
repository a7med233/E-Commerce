import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });

        if (response.data.success) {
          setProfileData(response.data.user);
        } else {
          setError("Failed to load profile.");
        }
      } catch (error) {
        console.error(error);
        setError("Error: Not Authorized. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // Function to calculate the total cart count
  const calculateCartCount = (cartData) => {
    if (!cartData || Object.keys(cartData).length === 0) return 0;

    return Object.values(cartData).reduce((total, colors) => {
      return (
        total +
        Object.values(colors).reduce((sum, quantity) => sum + quantity, 0)
      );
    }, 0);
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalCartCount = calculateCartCount(profileData.cartData);

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>
      <p className="text-2xl text-center">
        <strong>Welcome</strong> {profileData.name}
      </p>
      <p>
        <strong>Email: </strong> {profileData.email}
      </p>
      <p>
        <strong>Password: </strong>
        Nah Nah Nah we don't share PASSWORDS 
      </p>
    </div>
  );
};

export default Profile;
