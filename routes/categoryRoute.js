import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController,
  productCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// Routes
// Create a category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// Update a category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// get all categories
router.get("/get-category", categoryController);

// get single category
router.get("/single-category/:slug", singleCategoryController);

// get product category
router.get("/product-category/:cid", productCategoryController);

// delete single category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
