import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; // Assuming userModel is imported here
import transporter from "../config/Nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const mailOptions = {
      from: process.env.SMTP_USER, // The sender's email
      to: email, // Recipient's email
      subject: "Welcome to our website", // Email subject
      text: "Welcome to Website of Dixit", // Email body
    };

    // Sending the email using the transporter
    await transporter.sendMail(mailOptions);

    // Send a success response
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send a success response
    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the cookie by passing the same options that were used when it was set
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    // Send a response indicating successful logout
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    // Catch and return any errors that occurred during logout
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const Sendverifyotp = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ Corrected

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID missing in request" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    if (user.verifyOtpExpiryAt && user.verifyOtpExpiryAt > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent. Please wait before requesting a new one.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.verifyOtp = otp.toString();
    user.verifyOtpExpiryAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Please verify your account within 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const { userId } = req.user; // Get `userId` from authenticated request

  if (!otp) {
    return res.status(400).json({ success: false, message: "Missing OTP." });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    console.log("Received OTP:", otp);
    console.log("Stored OTP:", user.verifyOtp);

    // Ensure OTP exists and compare case-insensitively
    if (!user.verifyOtp) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found. Request a new OTP." });
    }

    if (user.verifyOtp.trim().toLowerCase() !== otp.trim().toLowerCase()) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Check OTP expiry
    if (!user.verifyOtpExpiryAt || user.verifyOtpExpiryAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Request a new OTP." });
    }

    // Mark account as verified
    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpiryAt = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

export const Isauthenticated = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "User is authenticated." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

export const Resendotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.resetOtpExpiryAt && user.resetOtpExpiryAt > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent. Please wait before requesting a new one.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);

    // Save OTP
    user.resetOtp = otp.toString();
    user.resetOtpExpiryAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Save changes
    await user.save();

    // Verify if OTP is stored
    const checkUser = await userModel.findOne({ email });
    console.log("Stored OTP after saving:", checkUser.resetOtp);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. This OTP is valid for 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully to:", user.email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP email." });
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export const ResetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    console.log("Stored OTP in DB:", user.resetOtp);
    console.log("Received OTP from user:", otp);

    console.log("Stored Expiry Time:", user.resetOtpExpiryAt);
    console.log("Current Time:", Date.now());

    if (!user.resetOtpExpiryAt || user.resetOtpExpiryAt < Date.now()) {
      console.log("OTP Expired!");
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Request a new OTP." });
    }

    if (!user.resetOtp) {
      console.log("OTP Not Found in DB!");
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. No OTP found in database.",
      });
    }

    if (String(user.resetOtp).trim() !== String(otp).trim()) {
      console.log("Mismatch Detected!");
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiryAt = undefined;

    await user.save();

    console.log("Password reset successfully!");

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};
