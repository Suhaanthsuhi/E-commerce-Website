import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import {
  createProductController,
  getProductController,
  getProductByCategoryController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  deleteProductController,
  filterProductController,
  productCountController,
  productListController,
  searchProductController,
  similarProductController,
  changeProductQuantityController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// Routes
// Create a new product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.put(
    "/update-product/:id",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
  );

// Get all products
router.get("/get-product", getProductController);

// Get all products in a category
router.get("/get-category-product/:cid", getProductByCategoryController);

// Get single product
router.get("/get-product/:slug", getSingleProductController);

// Get photo
router.get("/product-photo/:pid", productPhotoController);

// Delete product
router.delete(
  "/delete-product/:pid",
  deleteProductController
);

// filter products
router.post('/filter-products', filterProductController);

// product count
router.get('/product-count', productCountController);

// product per page
router.get('/product-list/:page', productListController);

// search product 
router.get('/search/:keyword', searchProductController);

// similar product
router.get('/similar-product/:pid/:cid', similarProductController);

// shipping quantity
router.post('/change-quantity/:pid/:value', requireSignIn, changeProductQuantityController);

// payment routes
// tokens
router.get('/braintree/token', braintreeTokenController);

// payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController);

export default router;
