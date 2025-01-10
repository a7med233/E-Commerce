import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext); // Ensure token is available from context
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`,{headers:{token}})
  
        if (response.data.success) {
          setProfileData(response.data.user);
        } else {
          setError('Failed to load profile.');
        }
      } catch (error) {
        console.error(error);
        setError('Error: Not Authorized. Please log in again.');
      }
    };
  
    if (token) fetchProfile();
  }, [token]);
  

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <p><strong>Name:</strong> {profileData.name}</p>
      <p><strong>Email:</strong> {profileData.email}</p>
      <p><strong>Cart Items:</strong> {profileData.cartData ? profileData.cartData.length : 0}</p>
      {/* Display other profile details as needed */}
    </div>
  );
};

export default Profile;
