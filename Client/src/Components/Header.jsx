import React from "react";
import robot from "../assets/robot.png";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate(); // ✅ Correct way to use navigate

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center">
      <img src={robot} alt="Robot" className="w-36 h-36 rounded-full mb-6" />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "User"}!👋🏻
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to Our Health chatbot
      </h2>
      <p className="mb-8 max-w-md">
        You don’t have to go through this alone. I’m here to listen, support,
        and help you find your way—one step at a time.!
      </p>
      <button
        onClick={() => navigate("/shop")} // ✅ Fixed this
        className="border border-gray-500 rounded-full py-2.5 px-8 hover:bg-gray-100 transition-all"
      >
        Get Started
      </button>
    </div>
  );
};

export default Header;
