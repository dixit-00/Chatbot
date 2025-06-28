import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      console.warn("Authentication failed: No token provided");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. No token provided." });
    }

    try {
      // Verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decodedToken);

      if (!decodedToken?.userId) {
        console.warn("Authentication failed: Invalid token structure");
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized. Invalid token." });
      }

      // Attach user data to request
      req.user = { userId: decodedToken.userId };
      console.log("Authenticated User:", req.user);

      return next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token verification error:", error.message);

      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized. Invalid token." });
      }

      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized. Token expired." });
      }

      return res.status(500).json({
        success: false,
        message: "Unauthorized. Token verification failed.",
      });
    }
  } catch (error) {
    console.error("JWT Auth Middleware Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default userAuth;
