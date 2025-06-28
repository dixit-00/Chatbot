import React from "react";
import Navbar from "../Components/Navbar";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f4f4] ">
      <Navbar />
      <Header />
      <button
        onClick={() => navigate("/settings")}
        className="mt-8 px-8 py-4 bg-neon-pink text-white text-2xl font-extrabold rounded-full shadow-lg border-4 border-yellow-400 animate-pulse uppercase tracking-widest hover:bg-pink-700 transition"
      >
        No Excuses: Settings
      </button>
    </div>
  );
};

export default Home;
