import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  getOrdersController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

// router object
const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

// Forgot Password || METHOD POST
router.post("/forgot-password", forgotPasswordController);

// Test route
router.get("/test", requireSignIn, isAdmin, testController);

// Protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// orders
router.get("/orders", requireSignIn, getOrdersController);

export default router;
