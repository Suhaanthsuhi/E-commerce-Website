import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
      case !description:
        return res.status(500).send({ message: "Description is required" });
      case !price:
        return res.status(500).send({ message: "Price is required" });
      case !category:
        return res.status(500).send({ message: "Category is required" });
      case !quantity:
        return res.status(500).send({ message: "Category is required" });
      case !shipping:
        return res.status(500).send({ message: "Shipping is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ message: "Photo is required and should be less than 1MB" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product created successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products fetched successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all products",
      error,
    });
  }
};

export const getProductByCategoryController = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await productModel
      .find({ category: cid })
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products fetched successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all products",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Single product fetched successfully!",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting single product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
      case !description:
        return res.status(500).send({ message: "Description is required" });
      case !price:
        return res.status(500).send({ message: "Price is required" });
      case !category:
        return res.status(500).send({ message: "Category is required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity is required" }); // Corrected message
      case !shipping:
        return res.status(500).send({ message: "Shipping is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ message: "Photo is required and should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) }, // Update fields correctly
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully!",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

export const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args);

    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products fetched successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in filtering products",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Product count fetched successfully!",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting product count",
      error,
    });
  }
};
export const productListController = async (req, res) => {
  try {
    const productsPerPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All products fetched successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting product per page",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting product per page",
      error,
    });
  }
};

export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      message: "All similar products fetched successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting similar products",
      error,
    });
  }
};

export const changeProductQuantityController = async (req, res) => {
  try {
    const { pid, value } = req.params;
    const incrementValue = parseInt(value, 10); // Ensure value is an integer

    if (isNaN(incrementValue)) {
      return res
        .status(400)
        .send({ message: "Invalid value for quantity increment" });
    }

    // Find the product by ID
    const product = await productModel.findById(pid);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.shippingQuantity += incrementValue;

    // Save the updated product
    await product.save();

    return res.status(200).send({
      success: true,
      message: "Product quantity updated successfully!",
      shippingQuantity: product.shippingQuantity,
    });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

// payment gateway api
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        return res
          .status(500)
          .send({ error: "Error generating client token", details: err });
      }
      res.send(response);
    });
  } catch (error) {
    console.error("Error generating client token:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

// paymemts
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.shippingQuantity; // Ensure total includes quantity
    });

    console.log("CART: ", cart);

    let newTransaction = await gateway.transaction.sale({
      amount: total.toFixed(2),
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (newTransaction.success) {
      const order = new orderModel({
        products: cart,
        payment: newTransaction.transaction,
        buyer: req.user._id,
      });
      await order.save();
      res.json({ success: true, message: "Payment and order successful" });
    } else {
      res.status(500).send({ error: newTransaction.message });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};
