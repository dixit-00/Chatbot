import React, { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();
axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      console.log(
        "Fetching auth state from:",
        `${backendUrl}/api/auth/is-auth`
      );
      const { data } = await axios.get(`${backendUrl}api/auth/is-auth`, {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedIn(data.isLoggedIn);
        getUserdata();
        if (data.isLoggedIn) {
          getUserdata();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching auth state:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch auth state.");
    }
  };

  const getUserdata = async () => {
    try {
      console.log("Fetching user data from:", `${backendUrl}/api/user/data`);
      const { data } = await axios.get(`${backendUrl}api/user/data`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserdata,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
