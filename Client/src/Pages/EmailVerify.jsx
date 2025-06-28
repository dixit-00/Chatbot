import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import userIcon from "../assets/sewing.png";
import { AppContext } from "../Context/AppContext";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, getuserdata, userData } = useContext(AppContext);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Auto-redirect if the user is already verified
  useEffect(() => {
    if (userData?.isAccountVerified) {
      navigate("/");
    }
  }, [userData, navigate]);

  // Handle OTP submission
  const onSubmithandler = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("").trim();

    if (otpCode.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}api/auth/verifyotp`,
        { otp: otpCode },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getuserdata(); // Refresh user data
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();
    const otpArray = pastedData
      .split("")
      .filter((char) => /^[0-9]$/.test(char));

    if (otpArray.length === 6) {
      setOtp(otpArray);
      otpArray.forEach((num, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = num;
        }
      });
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={userIcon}
        alt="User avatar"
        className="absolute left-5 sm:left-20 top-10 w-20 sm:w-20 cursor-pointer"
      />

      <form
        onSubmit={onSubmithandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-2xl font-semibold text-white text-center mb-4">
          Verify Your Email
        </h1>
        <p className="text-indigo-300 mb-4 text-center">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="flex justify-center mb-8 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-all"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
