import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authroutes.js";
import userRouter from "./routes/userrouter.js"; // ✅ Import user routes

dotenv.config(); // ✅ Ensure environment variables are loaded

const app = express();
const port = process.env.PORT || 4000;

// ✅ Define allowed origins for CORS
const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());

connectDB(); // ✅ Connect to MongoDB

app.get("/", (req, res) => {
  res.send("Server is running with changes");
});

// ✅ Use the imported routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
