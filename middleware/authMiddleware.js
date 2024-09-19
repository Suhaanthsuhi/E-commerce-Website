import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected routes token based
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(`decode Error: ${error}`);
  }
};

// Admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "You are not authorized to access this route",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(`isAmin Error: ${error}`);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
