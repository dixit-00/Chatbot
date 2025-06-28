import React, { useContext, useEffect, useState } from "react";
import userIcon from "../assets/sewing.png";
import arrow from "../assets/arrow.png";
import { useNavigate, NavLink } from "react-router-dom";
import "../App.css";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import businessman from "../assets/businessman.png"; // ✅ Import the new image

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, backendUrl } =
    useContext(AppContext);
  const [hardcore, setHardcore] = useState(false);

  // ✅ Logout Function
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}api/auth/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null); // ✅ Clear user data on logout
        navigate("/");
        toast.success("Logged out successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // ✅ Send Verification OTP & Fetch Updated User Data
  const sendVerificationOtp = async () => {
    if (!userData || userData.isAccountVerified) return;

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}api/auth/Sendverifyotp`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/emailVerify");

        // ✅ Fetch latest user data after sending OTP
        fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification OTP"
      );
    }
  };

  // ✅ Fetch Updated User Data
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}api/auth/user`, {
        headers: { Authorization: `Bearer ${userData?.token}` },
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.user); // ✅ Update UI dynamically
        console.log("Updated User Data:", data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // ✅ Auto-Update User Data After Login or Verification
  useEffect(() => {
    if (userData) {
      fetchUserData();
    }
  }, [userData, backendUrl]);

  useEffect(() => {
    const saved = localStorage.getItem("hardcoreMode") === "true";
    setHardcore(saved);
    document.body.classList.toggle("hardcore-mode", saved);
  }, []);

  const toggleHardcore = () => {
    const newMode = !hardcore;
    setHardcore(newMode);
    localStorage.setItem("hardcoreMode", newMode);
    document.body.classList.toggle("hardcore-mode", newMode);
  };

  return (
    <div className="w-full flex  items-center justify-between p-4 sm:p-4 sm:px-10 bg-black text-white shadow-lg">
      <img src={businessman} alt="User avatar" className="w-12 h-12 p-1" />
      <nav className="flex gap-8 items-center font-bold text-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-neon-pink border-b-2 border-neon-pink"
              : "hover:text-neon-pink transition"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/resources"
          className={({ isActive }) =>
            isActive
              ? "text-neon-pink border-b-2 border-neon-pink"
              : "hover:text-neon-pink transition"
          }
        >
          Resources
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            isActive
              ? "text-neon-pink border-b-2 border-neon-pink"
              : "hover:text-neon-pink transition"
          }
        >
          Chat
        </NavLink>
        <NavLink
          to="/challenges"
          className={({ isActive }) =>
            isActive
              ? "text-neon-pink border-b-2 border-neon-pink"
              : "hover:text-neon-pink transition"
          }
        >
          Challenges
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            isActive
              ? "text-neon-pink border-b-2 border-neon-pink"
              : "hover:text-neon-pink transition"
          }
        >
          Progress
        </NavLink>
      </nav>
      <div className="flex gap-3 items-center">
        <button className="bg-neon-pink hover:bg-pink-700 text-white px-4 py-2 rounded-full font-bold shadow-lg transition">
          Start Challenge
        </button>
        <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-full font-bold shadow-lg transition">
          Track Progress
        </button>
        <div className="relative ml-4 cursor-pointer"></div>
      </div>
      {userData ? (
        <div className="group relative">
          {/* ✅ User Avatar */}
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white cursor-pointer">
            {userData.name[0].toUpperCase()}
          </div>

          {/* ✅ Dropdown Menu */}
          <div
            className="absolute top-full right-0 mt-2 z-10 bg-white border rounded shadow-md 
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
          >
            <ul className="text-black min-w-[140px] whitespace-nowrap">
              {!userData.isAccountVerified ? (
                <li
                  onClick={sendVerificationOtp}
                  className="px-4 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              ) : (
                <li
                  onClick={logout}
                  className="px-4 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  Sign Out
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/Login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full py-2 px-6 text-gray-800 hover:bg-gray-100 transition-all focus:outline-none"
        >
          Login
          <img src={arrow} alt="arrow" className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
