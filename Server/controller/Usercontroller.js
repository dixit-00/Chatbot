import UserModel from "../models/userModel.js";

export const getUserdata = async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user's ID
    const userId = req.user.userId;

    // Fetch user data by ID
    const user = await UserModel.findById(userId, "name isAccountVerified");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Extract required data
    const userData = {
      name: user.name,
      isVerified: user.isAccountVerified || false,
    };

    return res.status(200).json({
      success: true,
      userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
