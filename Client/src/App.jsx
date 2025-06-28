import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import EmailVerify from "./Pages/EmailVerify.jsx";
import Shop from "./Pages/Shop.jsx";
import Settings from "./Pages/Settings.jsx";
import TherapistLocations from "./Pages/TherapistLocations.jsx";
import Resources from "./Pages/Resources.jsx";
import Chat from "./Pages/Chat.jsx";
import Challenges from "./Pages/Challenges.jsx";
import Progress from "./Pages/Progress.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  useEffect(() => {
    toast.error("You missed your check-in. Get back on track!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { fontWeight: "bold", textTransform: "uppercase", fontSize: "1.1rem" },
    });
  }, []);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/emailVerify" element={<EmailVerify />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/therapists" element={<TherapistLocations />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </div>
  );
};

export default App;
